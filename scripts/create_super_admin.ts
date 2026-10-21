import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
const env: Record<string, string> = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@chaitanyakeralam.org';
  const password = args[1] || 'Chaitanya@2026Admin!';
  const name = args[2] || 'Joel (Super Admin)';

  console.log(`--- Creating Super Admin User ---`);
  console.log(`Email: ${email}`);
  console.log(`Name:  ${name}`);

  // 1. Create or get user in Supabase Auth
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  let userId: string;

  if (userError) {
    if (userError.message.includes('already exists') || userError.message.includes('already been registered')) {
      console.log('User already exists in Supabase Auth, fetching existing user ID...');
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = (list?.users || []).find((u: any) => u.email === email);
      if (!existing) {
        throw new Error('Could not find existing user ID: ' + userError.message);
      }
      userId = existing.id;
      // Update password
      await supabase.auth.admin.updateUserById(userId, { password });
      console.log('Updated password for existing user.');
    } else {
      throw userError;
    }
  } else {
    userId = userData.user.id;
    console.log(`✓ User created in Supabase Auth (ID: ${userId})`);
  }

  // 2. Create or update profile in public.profiles
  const { error: profError } = await supabase.from('profiles').upsert({
    id: userId,
    name,
    role: 'super',
    status: 'active',
    updated_at: new Date().toISOString()
  });

  if (profError) {
    throw profError;
  }

  console.log('✓ Profile assigned role "super" and status "active" in public.profiles');
  console.log('--- Setup Complete! ---');
  console.log(`You can now sign in at /admin/login with:`);
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
}

main().catch(err => {
  console.error('Failed to create super admin:', err);
  process.exit(1);
});
