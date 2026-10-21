'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEnquiryNotification } from '@/lib/email';
import type { AdminRole, EnquiryStatus } from '@/lib/supabase/types';

async function getCallerProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('id, name, role').eq('id', user.id).single();
  return profile ? { ...profile, userId: user.id } : null;
}

async function logActivity(action: string, item: string, by_user: string, role: AdminRole, details?: string) {
  const admin = createAdminClient();
  await admin.from('activity_log').insert({ action, item, by_user, role, details: details || '' });
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // dev fallback
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const json = await res.json();
  return json.success === true;
}

// ─── Public enquiry submission ────────────────────────────────────────────────

const BaseEnquirySchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must consent to continue' }) }),
  turnstileToken: z.string().min(1, 'Security check required'),
});

const AdmissionSchema = BaseEnquirySchema.extend({
  type: z.literal('admission'),
  sub_type: z.string().optional(),
  district: z.string().max(80).optional(),
});

const TeshSchema = BaseEnquirySchema.extend({
  type: z.literal('tesh'),
  sub_type: z.string().max(80).optional(),
  district: z.string().max(80).optional(),
});

const PartnerSchema = BaseEnquirySchema.extend({
  type: z.literal('partner'),
  sub_type: z.string().max(80).optional(),
  district: z.string().max(80).optional(),
});

const ContactSchema = BaseEnquirySchema.extend({
  type: z.literal('contact'),
  sub_type: z.string().max(120).optional(),
});

const EnquirySchema = z.discriminatedUnion('type', [
  AdmissionSchema, TeshSchema, PartnerSchema, ContactSchema,
]);

export type EnquiryInput = z.infer<typeof EnquirySchema>;

export async function submitEnquiryAction(input: EnquiryInput) {
  // Validate
  const parsed = EnquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Turnstile bot check
  const botOk = await verifyTurnstile(data.turnstileToken);
  if (!botOk) return { success: false, error: 'Security check failed. Please try again.' };

  // Consent double-check
  if (!data.consent) return { success: false, error: 'Consent is required.' };

  const supabase = createClient();
  const { error } = await supabase.from('enquiries').insert({
    type: data.type,
    sub_type: data.sub_type || '',
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    district: ('district' in data ? data.district : '') || '',
    message: data.message || '',
    status: 'new',
    notes: '',
    consent: true,
  });

  if (error) return { success: false, error: 'We could not record your enquiry. Please try again.' };

  // Notify admin via email (non-blocking)
  sendEnquiryNotification({
    type: data.type,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message || '',
  }).catch(() => {});

  return { success: true };
}

// ─── Admin enquiry management ─────────────────────────────────────────────────

export async function getEnquiriesAction(type?: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'enquiry'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) return { success: false, error: error.message };
  return { success: true, enquiries: data };
}

export async function updateEnquiryStatusAction(id: string, status: EnquiryStatus) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'enquiry'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { error } = await supabase.from('enquiries')
    .update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return { success: false, error: error.message };
  await logActivity('changed status', `Enquiry ${id} to ${status}`, caller.name, caller.role as AdminRole);
  return { success: true };
}

export async function addEnquiryNoteAction(id: string, note: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'enquiry'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  if (!note.trim()) return { success: false, error: 'Note cannot be empty' };
  const supabase = createClient();
  const { data: enquiry } = await supabase.from('enquiries').select('notes').eq('id', id).single();
  if (!enquiry) return { success: false, error: 'Enquiry not found' };
  const existingNotes = enquiry.notes || '';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const newNotes = existingNotes
    ? `${existingNotes}\n\n[${timestamp} – ${caller.name}] ${note.trim()}`
    : `[${timestamp} – ${caller.name}] ${note.trim()}`;
  const { error } = await supabase.from('enquiries')
    .update({ notes: newNotes, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return { success: false, error: error.message };
  await logActivity('added note', `Enquiry ${id}`, caller.name, caller.role as AdminRole);
  return { success: true, notes: newNotes };
}
