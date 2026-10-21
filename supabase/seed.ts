import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Read environment variables from .env.local (stripping BOM and Windows line endings)
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
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runSeed() {
  console.log('--- Starting Chaitanya Keralam Database Seed ---');

  // Load raw data from AdminApp.tsx to ensure 100% parity
  const appPath = path.resolve(process.cwd(), 'components/admin/AdminApp.tsx');
  const content = fs.readFileSync(appPath, 'utf8');
  const seedStart = content.indexOf('seed() {');
  const enqStart = content.indexOf('var enq0 = [');
  const seedBlock = content.substring(seedStart + 8, enqStart);
  const fn = new Function(seedBlock + '; return { pages, slides0, media0, progs, ann0 };');
  const data = fn();

  // 1. Pages & Page Sections
  console.log(`Seeding ${data.pages.length} pages...`);
  for (const p of data.pages) {
    const { error: pageErr } = await supabase.from('pages').upsert({
      id: p.id,
      name: p.name,
      path: p.path,
      status: p.id === 'home' || p.id === 'tesh' ? 'draft' : 'pub',
      updated_at: new Date().toISOString(),
      updated_by: p.by || 'Joel'
    });
    if (pageErr) throw new Error(`Page ${p.id} error: ${pageErr.message}`);

    const sections = p.secs || [];
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const secId = `${p.id}.${s.id}`;
      const pubContent = {
        eyb: s.eyb || '',
        head: s.head || '',
        body: s.body || '',
        cta: s.cta || '',
        href: s.href || '',
        imgs: s.imgs || []
      };

      const { error: secErr } = await supabase.from('page_sections').upsert({
        id: secId,
        page_id: p.id,
        section_id: s.id,
        name: s.name,
        title: s.eyb || '',
        subtitle: s.head || '',
        body: s.body || '',
        cta: s.cta || '',
        cta_href: s.href || '',
        images: s.imgs || [],
        is_carousel: !!s.carousel,
        is_hidden: false,
        order_index: i,
        published_content: pubContent,
        draft_content: null,
        version: 1,
        updated_at: new Date().toISOString()
      });
      if (secErr) throw new Error(`Section ${secId} error: ${secErr.message}`);
    }
  }

  // 2. Carousel slides
  console.log(`Seeding ${data.slides0.length} carousel slides...`);
  for (let i = 0; i < data.slides0.length; i++) {
    const s = data.slides0[i];
    const { error: slErr } = await supabase.from('carousel_slides').upsert({
      id: s.id,
      kicker: s.kicker || '',
      title: s.title || '',
      cap: s.cap || '',
      left_text: s.left || '',
      right_text: s.right || '',
      cta: s.cta || '',
      href: s.href || '',
      alt: s.alt || '',
      en: s.en !== false,
      fx: s.fx != null ? s.fx : 50,
      fy: s.fy != null ? s.fy : 50,
      file: s.file || '',
      order_index: i,
      status: 'pub',
      updated_at: new Date().toISOString()
    });
    if (slErr) throw new Error(`Slide ${s.id} error: ${slErr.message}`);
  }

  // 3. Programmes
  const progKeys = Object.keys(data.progs);
  console.log(`Seeding ${progKeys.length} programmes...`);
  for (let i = 0; i < progKeys.length; i++) {
    const k = progKeys[i];
    const pr = data.progs[k];
    const { error: prErr } = await supabase.from('programmes').upsert({
      id: k,
      name: pr.title || '',
      tagline: pr.level || '',
      duration: pr.duration || '',
      hours: pr.hours || '',
      eligibility: pr.elig || '',
      description: pr.summary || '',
      summary: pr.outcome || '',
      learning_areas: [],
      curriculum: pr.mods || [],
      outcomes: pr.outs ? pr.outs.split('\n') : [],
      projects: [],
      status: 'pub',
      order_index: i,
      updated_at: new Date().toISOString()
    });
    if (prErr) throw new Error(`Programme ${k} error: ${prErr.message}`);
  }

  // 4. Announcements
  console.log(`Seeding ${data.ann0.length} announcements...`);
  for (let i = 0; i < data.ann0.length; i++) {
    const a = data.ann0[i];
    const { error: anErr } = await supabase.from('announcements').upsert({
      id: a.id,
      title: a.title,
      date: a.from || '2026-10-01',
      body: a.msg || '',
      category: a.place || 'General',
      status: a.st === 'draft' ? 'draft' : 'pub',
      order_index: i,
      updated_at: new Date().toISOString()
    });
    if (anErr) throw new Error(`Announcement ${a.id} error: ${anErr.message}`);
  }

  // 5. Real media
  const realMedia = data.media0.filter((m: any) => !m.empty);
  console.log(`Seeding ${realMedia.length} real media assets...`);
  for (const m of realMedia) {
    const { error: mErr } = await supabase.from('media').upsert({
      path: m.src,
      filename: m.name,
      alt: m.alt,
      credit: m.desc || 'Chaitanya Keralam official assets',
      category: m.cat || 'General',
      mime_type: m.type === 'PNG' ? 'image/png' : 'image/webp',
      size_bytes: m.size === '22 KB' ? 22528 : 413696,
      created_by: 'Joel'
    }, { onConflict: 'path' });
    if (mErr) throw new Error(`Media ${m.name} error: ${mErr.message}`);
  }

  console.log('✓ Seeding completed successfully!');
  console.log('Note: Sample fake enquiries, users and activity were NOT seeded, preserving data cleanliness.');
}

runSeed().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
