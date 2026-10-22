import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  .replace(/^\uFEFF/, '').split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^=\s]+)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  });

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRK    = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin  = createClient(SB_URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });

async function sql(q: string) {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: q }),
  });
  if (r.ok) return null;
  // try pg endpoint  
  const r2 = await fetch(`${SB_URL}/pg/query`, {
    method: 'POST',
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q }),
  });
  if (r2.ok) return null;
  return await r2.text();
}

async function main() {
  const stmts = [
    `create table if not exists public.site_settings (key text primary key, value text not null default '')`,
    `insert into public.site_settings (key, value) values ('req2fa','false'),('timeout','30'),('invite','48'),('domains','') on conflict (key) do nothing`,
    `alter table public.site_settings enable row level security`,
    `drop policy if exists "Super Admins can manage settings" on public.site_settings`,
    `create policy "Super Admins can manage settings" on public.site_settings for all using (public.current_user_role() = 'super')`,
    `alter table public.enquiries alter column id set default gen_random_uuid()::text`,
    `alter table public.enquiries drop constraint if exists enquiries_type_check`,
    `alter table public.enquiries add constraint enquiries_type_check check (type in ('admission','programme','tesh','partner','partnership','contact','general'))`,
    `drop policy if exists "Public can view media records" on public.media`,
    `create policy "Authenticated admins can view media records" on public.media for select using (public.is_admin())`,
    `drop policy if exists "Editors and Super Admins can modify page sections" on public.page_sections`,
    `create policy "Editors and Super Admins can modify page sections" on public.page_sections for all using (public.current_user_role() in ('super','editor')) with check (public.current_user_role() in ('super','editor'))`,
    `insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('site-media','site-media',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing`,
    `drop policy if exists "Public can read site-media" on storage.objects`,
    `create policy "Public can read site-media" on storage.objects for select using (bucket_id = 'site-media')`,
    `drop policy if exists "Admins can upload to site-media" on storage.objects`,
    `create policy "Admins can upload to site-media" on storage.objects for insert with check (bucket_id = 'site-media' and public.current_user_role() in ('super','editor'))`,
    `drop policy if exists "Admins can delete from site-media" on storage.objects`,
    `create policy "Admins can delete from site-media" on storage.objects for delete using (bucket_id = 'site-media' and public.current_user_role() in ('super','editor'))`,
  ];

  let ok = 0, fail = 0;
  for (const stmt of stmts) {
    const err = await sql(stmt);
    if (err === null) { ok++; }
    else { console.log('STMT FAILED:', stmt.slice(0, 70), '\n  →', err?.slice(0,120)); fail++; }
  }
  console.log(`\nRPC migration: ${ok} ok, ${fail} failed`);

  // Verify site_settings
  const { data: ss, error: sse } = await admin.from('site_settings').select('key').limit(1);
  console.log('site_settings:', sse ? 'MISSING - ' + sse.message : `OK (${ss?.length} row)`);

  // Verify enquiries constraint
  const tid = 'zz-' + Date.now();
  const { error: ce } = await admin.from('enquiries').insert({
    id: tid, type: 'admission', sub_type: '', name: 'ZZ', email: 'zz@zz.com',
    phone: '', district: '', message: '', status: 'new', notes: '', consent: true,
  });
  if (!ce) { await admin.from('enquiries').delete().eq('id', tid); console.log('enquiries type=admission: OK'); }
  else console.log('enquiries type=admission: FAIL -', ce.message);

  // Verify storage bucket
  const { data: bkt, error: be } = await admin.storage.getBucket('site-media');
  console.log('site-media bucket:', be ? 'MISSING - ' + be.message : `OK (${bkt?.name})`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
