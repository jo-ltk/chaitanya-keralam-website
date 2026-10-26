import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('d:/works/IT/Chaitanya keralam/chaitanya-keralam-nextjs-website/chaitanya-keralam-website/.env.local','utf8').replace(/^\uFEFF/,'').split(/\r?\n/);
for (const line of env) { const m = line.match(/^([^=\s]+)=(.+)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim(); }

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(SB_URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });

const filePath = 'C:/Users/joelt/Downloads/Golden Sunset Boat Ride.png';
const buf = fs.readFileSync(filePath);
const filename = 'sunset-backwaters-' + Date.now() + '.png';
const storagePath = 'uploads/' + filename;

(async () => {
  const { data: up, error: ue } = await admin.storage.from('site-media').upload(storagePath, buf, {
    contentType: 'image/png', upsert: false,
  });
  console.log('upload:', ue ? ue.message : 'OK', up);
  if (ue) process.exit(1);

  const { data: row, error: dbErr } = await admin.from('media').insert({
    path: storagePath,
    filename,
    alt: 'Sunset over the backwaters',
    credit: 'User upload',
    category: 'Banner',
    mime_type: 'image/png',
    size_bytes: buf.length,
    created_by: 'System',
  }).select().single();
  console.log('db:', dbErr ? dbErr.message : 'OK', row?.id);

  const { data: pub } = admin.storage.from('site-media').getPublicUrl(storagePath);
  console.log('PUBLIC_URL:', pub.publicUrl);
})();