'use server';

import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInviteEmail } from '@/lib/email';
import type { AdminRole } from '@/lib/supabase/types';

export async function loginAction(data: { email: string; pw: string }) {
  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email.trim(),
      password: data.pw,
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Invalid email or password' };
    }

    // Check user profile
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('role, status, name')
      .eq('id', authData.user.id)
      .single();

    if (profError || !profile) {
      // If profile does not exist yet (e.g. bootstrap Super Admin), create it
      const adminClient = createAdminClient();
      await adminClient.from('profiles').upsert({
        id: authData.user.id,
        name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'Administrator',
        role: 'super',
        status: 'active'
      });
    } else if (profile.status === 'suspended') {
      await supabase.auth.signOut();
      return { success: false, error: 'Your account has been suspended. Please contact a Super Admin.' };
    }

    // Check MFA requirements
    const role = profile?.role || 'super';
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totpFactors = factors?.totp || [];
    const hasTotp = totpFactors.length > 0;

    if (role === 'super') {
      if (!hasTotp) {
        return { success: true, needsMfaSetup: true, role };
      }
      return { success: true, needsMfa: true, factorId: totpFactors[0].id, role };
    }

    if (hasTotp) {
      return { success: true, needsMfa: true, factorId: totpFactors[0].id, role };
    }

    return { success: true, role };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred during sign-in' };
  }
}

export async function verifyMfaAction(data: { factorId: string; code: string }) {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: data.factorId,
      code: data.code.trim(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to verify two-factor code' };
  }
}

export async function setupMfaAction() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'Chaitanya Keralam Admin',
    });

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to initialize MFA' };
    }

    return {
      success: true,
      factorId: data.id,
      secret: data.totp.secret,
      qrCode: data.totp.qr_code,
      uri: data.totp.uri,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to set up MFA' };
  }
}

export async function confirmMfaSetupAction(data: { factorId: string; code: string }) {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: data.factorId,
      code: data.code.trim(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to confirm authenticator' };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaitanyakeralam.org';
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/admin/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to request password reset' };
  }
}

export async function resetPasswordAction(password: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update password' };
  }
}

export async function signOutAction() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function inviteUserAction(data: { email: string; role: AdminRole }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Check if requester is super admin
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single();

    if (callerProfile?.role !== 'super') {
      return { success: false, error: 'Only Super Administrators can invite new users.' };
    }

    const adminClient = createAdminClient();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const { error: invErr } = await adminClient.from('invitations').insert({
      email: data.email.trim().toLowerCase(),
      role: data.role,
      token,
      invited_by: callerProfile.name || user.email || 'Super Admin',
      expires_at: expiresAt,
    });

    if (invErr) {
      return { success: false, error: invErr.message };
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const inviteUrl = `${origin}/admin/invite?token=${token}`;

    await sendInviteEmail({
      to: data.email.trim().toLowerCase(),
      role: data.role,
      inviteUrl,
    });

    await adminClient.from('activity_log').insert({
      action: 'invited',
      item: `${data.email} (${data.role})`,
      by_user: callerProfile.name || 'Super Admin',
      role: 'super',
      details: `Sent invitation link expiring in 48 hours`
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send invitation' };
  }
}

export async function validateInviteTokenAction(token: string) {
  try {
    const adminClient = createAdminClient();
    const { data: inv, error } = await adminClient
      .from('invitations')
      .select('email, role, expires_at, accepted_at')
      .eq('token', token)
      .single();

    if (error || !inv) {
      return { valid: false, reason: 'Invalid invitation link' };
    }

    if (inv.accepted_at) {
      return { valid: false, reason: 'This invitation has already been accepted.' };
    }

    if (new Date(inv.expires_at) < new Date()) {
      return { valid: false, reason: 'This invitation has expired.' };
    }

    return { valid: true, email: inv.email, role: inv.role };
  } catch (err: any) {
    return { valid: false, reason: err.message || 'Validation error' };
  }
}

export async function acceptInviteAction(data: { token: string; name: string; pw: string }) {
  try {
    const adminClient = createAdminClient();

    // Verify token
    const { data: inv, error: invErr } = await adminClient
      .from('invitations')
      .select('*')
      .eq('token', data.token)
      .single();

    if (invErr || !inv || inv.accepted_at || new Date(inv.expires_at) < new Date()) {
      return { success: false, error: 'Invitation is invalid or has expired.' };
    }

    // Create user in Supabase Auth
    const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
      email: inv.email,
      password: data.pw,
      email_confirm: true,
      user_metadata: { name: data.name },
    });

    if (createErr || !newUser.user) {
      return { success: false, error: createErr?.message || 'Failed to create user account' };
    }

    // Create profile
    await adminClient.from('profiles').upsert({
      id: newUser.user.id,
      name: data.name,
      role: inv.role,
      status: 'active',
      updated_at: new Date().toISOString()
    });

    // Mark invitation accepted
    await adminClient
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', inv.id);

    // Sign in on server
    const supabase = createClient();
    await supabase.auth.signInWithPassword({
      email: inv.email,
      password: data.pw,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to accept invitation' };
  }
}
