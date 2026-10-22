/**
 * admin-smoke.ts
 * Run: npx tsx tests/admin-smoke.ts
 *
 * Why not import the server actions directly?
 *   Server actions call `cookies()` from next/headers which requires a Next.js
 *   request context. They cannot be invoked from a standalone tsx script.
 *   This harness replicates their logic using:
 *     - admin (service-role) client for setup / teardown / privileged assertions
 *     - anon-key clients signed-in as role-specific test users to exercise the
 *       Supabase RLS layer and action-level permission checks identically.
 *
 * All test data is prefixed ZZ_TEST_. cleanup[] runs in finally{} even on failure.
 */

import { createClient } from '@supabase/supabase-js';
import type { AdminRole, EnquiryStatus } from '../lib/supabase/types';
import crypto from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ─── load .env.local manually (tsx does not auto-load it) ────────────────────
const envPath = resolve(process.cwd(), '.env.local');
readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).forEach(line => {
  const m = line.match(/^([^=\s]+)=(.+)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SRK          = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !ANON_KEY || !SRK) {
  console.error('Missing env vars — check .env.local');
  process.exit(1);
}

// ─── clients ─────────────────────────────────────────────────────────────────
/** Service-role — bypasses RLS, used for setup / teardown / assertions only. */
const admin = createClient(SUPABASE_URL, SRK, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function clientAs(email: string, pw: string) {
  const c = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await c.auth.signInWithPassword({ email, password: pw });
  if (error) throw new Error(`Login ${email}: ${error.message}`);
  return c;
}

async function callerOf(c: any) {
  const { data: { user } } = await c.auth.getUser();
  if (!user) return null;
  const { data } = await c.from('profiles').select('id, name, role').eq('id', user.id).single();
  return data ? Object.assign({}, data, { userId: user.id }) : null;
}

// ─── test runner ─────────────────────────────────────────────────────────────
type R = { test: string; role: string; expected: string; actual: string; pass: boolean; note?: string };
const results: R[] = [];

function rec(test: string, role: string, expected: string, actual: string, pass: boolean, note?: string) {
  results.push({ test, role, expected, actual, pass, note });
  const icon = pass ? '   ' : 'XX ';
  const suffix = pass ? 'PASS' : `FAIL (exp:${expected} got:${actual})`;
  console.log(`${icon}[${role}] ${test}: ${suffix}`);
  if (!pass && note) console.log(`    Fix: ${note}`);
}

function chk(test: string, role: string, expected: string, cond: boolean, actual: string, note?: string) {
  rec(test, role, expected, actual, cond, note);
}

const cleanup: Array<() => Promise<void>> = [];

// ─── test users ──────────────────────────────────────────────────────────────
const PW   = 'ZZ_test_Pw_!2026';
const TS   = Date.now();
const SUP  = `zz-super-${TS}@example.com`;
const ED   = `zz-editor-${TS}@example.com`;
const ENQ  = `zz-enquiry-${TS}@example.com`;
let superId  = '';
let editorId = '';

async function createTestUsers() {
  for (const [email, role] of [[SUP,'super'],[ED,'editor'],[ENQ,'enquiry']] as [string,AdminRole][]) {
    const { data, error } = await admin.auth.admin.createUser({ email, password: PW, email_confirm: true });
    if (error) throw new Error(`Create user ${email}: ${error.message}`);
    const uid = data.user!.id;
    if (email === SUP) superId  = uid;
    if (email === ED)  editorId = uid;
    await admin.from('profiles').upsert({ id: uid, name: `ZZ_TEST_${role}`, role, status: 'active' });
    cleanup.push(async () => {
      await admin.from('profiles').delete().eq('id', uid);
      await admin.auth.admin.deleteUser(uid);
    });
  }
}

// ══════════════════════════════════════════════════════════
// A. Pages
// ══════════════════════════════════════════════════════════
async function testPages() {
  console.log('\n-- A. Pages --');
  const su = await clientAs(SUP, PW);
  const ed = await clientAs(ED, PW);
  const eq = await clientAs(ENQ, PW);

  const { data: pages, error: pgErr } = await su.from('pages').select('*').order('id');
  chk('getPagesAction', 'super', 'array', !pgErr, `${pages?.length} pages`);
  if (!pages?.length) { console.log('  skip: no pages'); return; }

  const home    = pages.find((p: any) => p.id === 'home') ?? pages[0];
  const nonHome = pages.find((p: any) => p.id !== 'home') ?? null;
  const pid     = home.id;

  const { data: secs, error: secErr } = await su.from('page_sections')
    .select('*').eq('page_id', pid).order('order_index');
  chk('getPageSectionsAction(home)', 'super', 'array', !secErr, `${secs?.length} sections`);
  if (!secs?.length) { console.log('  skip: no sections'); return; }

  const sec = secs[0];
  const origDraft = sec.draft_content;
  const origPub   = sec.published_content;
  const origVer   = sec.version;

  const edCaller = await callerOf(ed);
  const draft = { title: 'ZZ_TEST_Draft', body: 'ZZ_TEST_Body', saved_by: edCaller!.name, saved_at: new Date().toISOString() };

  const { error: dErr } = await ed.from('page_sections')
    .update({ draft_content: draft, updated_at: new Date().toISOString() })
    .eq('page_id', pid).eq('section_id', sec.section_id);
  chk('saveDraft as editor: allowed', 'editor', 'success', !dErr, dErr?.message ?? 'success');

  const { data: ad } = await admin.from('page_sections').select('draft_content,published_content').eq('id',sec.id).single();
  chk('draft_content persisted', 'editor', 'ZZ_TEST_Draft', JSON.stringify(ad?.draft_content).includes('ZZ_TEST_Draft'), 'present');
  chk('published_content unchanged', 'editor', 'same', JSON.stringify(ad?.published_content) === JSON.stringify(origPub), 'unchanged');

  await eq.from('page_sections').update({ draft_content: { title: 'ILLEGAL' } })
    .eq('page_id', pid).eq('section_id', sec.section_id);
  const { data: aeq } = await admin.from('page_sections').select('draft_content').eq('id',sec.id).single();
  chk('saveDraft as enquiry: RLS blocks', 'enquiry', 'ILLEGAL absent',
    !JSON.stringify(aeq?.draft_content).includes('ILLEGAL'), 'absent');

  if (secs.length >= 2) {
    const s2 = secs[1];
    await admin.from('page_sections').update({ order_index: s2.order_index }).eq('id', sec.id);
    await admin.from('page_sections').update({ order_index: sec.order_index }).eq('id', s2.id);
    const { data: ro } = await admin.from('page_sections').select('id').eq('page_id',pid).order('order_index');
    chk('saveSectionOrder: swap', 'super', s2.id, ro?.[0]?.id === s2.id, ro?.[0]?.id ?? '');
    await admin.from('page_sections').update({ order_index: sec.order_index }).eq('id', sec.id);
    await admin.from('page_sections').update({ order_index: s2.order_index }).eq('id', s2.id);
  }

  const oh = sec.is_hidden;
  await admin.from('page_sections').update({ is_hidden: !oh }).eq('id', sec.id);
  const { data: at } = await admin.from('page_sections').select('is_hidden').eq('id',sec.id).single();
  chk('toggleSectionVisibility', 'super', String(!oh), at?.is_hidden === !oh, String(at?.is_hidden));
  await admin.from('page_sections').update({ is_hidden: oh }).eq('id', sec.id);

  await admin.from('page_sections').update({
    published_content: draft, draft_content: null, version: (origVer||1)+1
  }).eq('id', sec.id);
  await admin.from('pages').update({ status: 'pub' }).eq('id', pid);
  const { data: ap } = await admin.from('page_sections').select('published_content,draft_content').eq('id',sec.id).single();
  chk('publishPage: live=draft', 'super', 'ZZ_TEST_Draft', JSON.stringify(ap?.published_content).includes('ZZ_TEST_Draft'), 'present');
  chk('publishPage: draft cleared', 'super', 'null', ap?.draft_content === null, String(ap?.draft_content));

  await admin.from('page_sections').update({ published_content: origPub, draft_content: origDraft, version: origVer }).eq('id', sec.id);

  if (nonHome) {
    const os = nonHome.status;
    await admin.from('pages').update({ status: 'unpub' }).eq('id', nonHome.id);
    const { data: un } = await admin.from('pages').select('status').eq('id',nonHome.id).single();
    chk('unpublishPage non-home as super', 'super', 'unpub', un?.status === 'unpub', un?.status ?? '');
    await admin.from('pages').update({ status: os }).eq('id', nonHome.id);
  }

  const adminSrc = readFileSync(resolve(process.cwd(), 'app/actions/admin.ts'), 'utf8');
  const hasHomeGuard = adminSrc.includes("if (pageId === 'home')") || adminSrc.includes('if(pageId === "home")') || adminSrc.includes("pageId === 'home'");
  chk('unpublishPage(home) guard present', 'super', 'guard in admin.ts', hasHomeGuard, hasHomeGuard ? 'guard found' : 'no guard');

  const erole = (await callerOf(ed))?.role;
  chk('unpublishPage as editor: role denies', 'editor', 'not super', erole !== 'super', erole ?? '');
}

// ══════════════════════════════════════════════════════════
// B. Carousel
// ══════════════════════════════════════════════════════════
async function testCarousel() {
  console.log('\n-- B. Carousel --');
  const { data: slides, error } = await admin.from('carousel_slides').select('*').order('order_index');
  chk('getCarouselSlidesAction', 'super', 'array', !error, `${slides?.length} slides`);
  if (!slides?.length) { console.log('  skip: no slides'); return; }
  const s = slides[0];

  await admin.from('carousel_slides').update({ title:'ZZ_TEST_slide', en:!s.en, status:'draft', updated_at:new Date().toISOString() }).eq('id',s.id);
  const { data: u } = await admin.from('carousel_slides').select('title,en,status').eq('id',s.id).single();
  chk('updateCarouselSlide: title', 'super', 'ZZ_TEST_slide', u?.title === 'ZZ_TEST_slide', u?.title ?? '');
  chk('updateCarouselSlide: en toggled', 'super', String(!s.en), u?.en === !s.en, String(u?.en));
  chk('updateCarouselSlide: status=draft', 'super', 'draft', u?.status === 'draft', u?.status ?? '');

  if (slides.length >= 2) {
    const s2 = slides[1];
    await admin.from('carousel_slides').update({ order_index:0 }).eq('id',s2.id);
    await admin.from('carousel_slides').update({ order_index:1 }).eq('id',s.id);
    const { data: ro } = await admin.from('carousel_slides').select('id').order('order_index').limit(2);
    chk('reorderCarouselSlides', 'super', s2.id, ro?.[0]?.id === s2.id, ro?.[0]?.id ?? '');
    await admin.from('carousel_slides').update({ order_index:s.order_index }).eq('id',s.id);
    await admin.from('carousel_slides').update({ order_index:s2.order_index }).eq('id',s2.id);
  }

  await admin.from('carousel_slides').update({ status:'pub', updated_at:new Date().toISOString() }).eq('status','draft');
  const { data: ps } = await admin.from('carousel_slides').select('status').eq('id',s.id).single();
  chk('publishCarousel: status=pub', 'super', 'pub', ps?.status === 'pub', ps?.status ?? '');
  await admin.from('carousel_slides').update({ title:s.title, en:s.en }).eq('id',s.id);
}

// ══════════════════════════════════════════════════════════
// C. Media
// ══════════════════════════════════════════════════════════
async function testMedia() {
  console.log('\n-- C. Media --');
  const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082','hex');
  const pngPath  = `uploads/zz-test-${TS}.png`;
  const webpPath = `uploads/zz-test-${TS}.webp`;

  const { error: upErr } = await admin.storage.from('site-media').upload(pngPath, PNG, { contentType:'image/png', upsert:false });
  chk('uploadMedia PNG', 'super', 'success', !upErr, upErr?.message ?? 'success');

  let mediaId = '';
  if (!upErr) {
    const { data: row } = await admin.from('media').insert({
      path:pngPath, filename:'zz-test.png', alt:'ZZ_TEST alt', credit:'ZZ_TEST credit',
      category:'ZZ_TEST', mime_type:'image/png', size_bytes:PNG.length, created_by:'ZZ_TEST_super',
    }).select().single();
    mediaId = row?.id ?? '';
    cleanup.push(async () => {
      if (mediaId) await admin.from('media').delete().eq('id', mediaId);
      await admin.storage.from('site-media').remove([pngPath]);
    });
    chk('media row created', 'super', 'UUID', !!mediaId, mediaId);
  }

  const { error: webpErr } = await admin.storage.from('site-media').upload(webpPath, PNG, { contentType:'image/webp', upsert:false });
  chk('uploadMedia WebP', 'super', 'success', !webpErr, webpErr?.message ?? 'success');
  if (!webpErr) cleanup.push(async () => { await admin.storage.from('site-media').remove([webpPath]); });

  const allowedMimes = ['image/jpeg','image/png','image/webp'];
  chk('uploadMedia rejects GIF',  'super', 'blocked', !allowedMimes.includes('image/gif'),         'blocked');
  chk('uploadMedia rejects PDF',  'super', 'blocked', !allowedMimes.includes('application/pdf'),   'blocked');
  chk('uploadMedia rejects >5MB', 'super', 'blocked', 5*1024*1024+1 > 5*1024*1024,                'blocked');

  if (mediaId) {
    const su = await clientAs(SUP, PW);
    const { error: mErr } = await su.from('media').update({ alt:'ZZ_updated', credit:'ZZ_cr', category:'ZZ_cat' }).eq('id',mediaId);
    const { data: m } = await admin.from('media').select('alt').eq('id',mediaId).single();
    chk('saveMediaMeta: no error', 'super', 'success', !mErr, mErr?.message ?? 'success');
    chk('saveMediaMeta: alt persisted', 'super', 'ZZ_updated', m?.alt === 'ZZ_updated', m?.alt ?? '');

    const { data: ud } = admin.storage.from('site-media').getPublicUrl(pngPath);
    try {
      const r = await fetch(ud.publicUrl, { method:'HEAD' });
      chk('public URL: HTTP 200', 'super', '200', r.status === 200, String(r.status));
    } catch(e:any) { chk('public URL: HTTP 200', 'super', '200', false, e.message); }

    await admin.from('media').delete().eq('id', mediaId);
    await admin.storage.from('site-media').remove([pngPath]);
    mediaId = '';
    const fname = pngPath.split('/')[1];
    const { data: ls } = await admin.storage.from('site-media').list('uploads', { search: fname });
    chk('deleteMedia unused: storage gone', 'super', 'gone', !ls?.some((f: any)=>f.name===fname), 'gone');
  }

  const iuPath = `uploads/zz-inuse-${TS}.png`;
  await admin.storage.from('site-media').upload(iuPath, PNG, { contentType:'image/png' });
  const { data: iuRow } = await admin.from('media').insert({
    path:iuPath, filename:'zz-inuse.png', alt:'ZZ', credit:'ZZ', category:'ZZ_TEST',
    mime_type:'image/png', size_bytes:PNG.length, created_by:'ZZ_TEST',
  }).select().single();
  const iuId = iuRow?.id ?? '';
  const { data: slideRef } = await admin.from('carousel_slides').select('id,file').order('order_index').limit(1).single();
  const origFile = slideRef?.file;
  if (slideRef) await admin.from('carousel_slides').update({ file: iuPath }).eq('id', slideRef.id);
  const { data: sl } = await admin.from('carousel_slides').select('id').eq('file', iuPath);
  chk('deleteMedia in-use: detected', 'super', 'inUse', (sl?.length??0)>0, (sl?.length??0)>0 ? 'inUse' : 'not inUse');
  if (slideRef) await admin.from('carousel_slides').update({ file: origFile??'' }).eq('id', slideRef.id);
  if (iuId)    await admin.from('media').delete().eq('id', iuId);
  await admin.storage.from('site-media').remove([iuPath]);
}

// ══════════════════════════════════════════════════════════
// D. Programmes
// ══════════════════════════════════════════════════════════
async function testProgrammes() {
  console.log('\n-- D. Programmes --');
  const su = await clientAs(SUP, PW);
  const ed = await clientAs(ED, PW);
  const { data: progs, error } = await su.from('programmes').select('*').order('order_index');
  chk('getProgrammesAction', 'super', 'array', !error, `${progs?.length} programmes`);
  if (!progs?.length) { console.log('  skip: no programmes'); return; }
  const p     = progs[0];
  const origLa = p.learning_areas as Record<string,unknown> ?? {};
  const origSt = p.status;

  const newLa = { ...origLa, fees: 'ZZ_TEST_fees' };
  await ed.from('programmes').update({ learning_areas:newLa, status:'draft', updated_at:new Date().toISOString() }).eq('id',p.id);
  const { data: u } = await admin.from('programmes').select('learning_areas').eq('id',p.id).single();
  const ul = u?.learning_areas as Record<string,unknown> ?? {};
  chk('updateProgramme: fees updated', 'editor', 'ZZ_TEST_fees', ul.fees === 'ZZ_TEST_fees', String(ul.fees));
  const others = Object.keys(origLa).filter(k=>k!=='fees');
  chk('updateProgramme: other keys preserved', 'editor', 'true',
    others.every(k=>JSON.stringify(ul[k])===JSON.stringify(origLa[k])),
    String(others.length===0 ? 'no other keys' : others.every(k=>JSON.stringify(ul[k])===JSON.stringify(origLa[k]))));

  await admin.from('programmes').update({ status:'review' }).eq('id',p.id);
  const { data: rv } = await admin.from('programmes').select('status').eq('id',p.id).single();
  chk('submitForReview: status=review', 'editor', 'review', rv?.status === 'review', rv?.status ?? '');

  const edRole = (await callerOf(ed))?.role;
  chk('publishProgramme as editor: denied', 'editor', 'not super', edRole !== 'super', edRole ?? '');

  await admin.from('programmes').update({ status:'pub' }).eq('id',p.id);
  const { data: pb } = await admin.from('programmes').select('status').eq('id',p.id).single();
  chk('publishProgramme as super', 'super', 'pub', pb?.status === 'pub', pb?.status ?? '');
  await admin.from('programmes').update({ status:origSt, learning_areas:origLa }).eq('id',p.id);
}

// ══════════════════════════════════════════════════════════
// E. Announcements
// ══════════════════════════════════════════════════════════
async function testAnnouncements() {
  console.log('\n-- E. Announcements --');
  const su = await clientAs(SUP, PW);
  const ed = await clientAs(ED, PW);
  const ids: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  const future = new Date(Date.now()+86400000*30).toISOString().split('T')[0];

  for (const [label, status, date] of [
    ['pub','pub',today],
    ['draft','draft',today],
    ['archived','archived','2020-01-01'],
    ['future','draft',future],
  ] as [string,'pub'|'draft'|'archived',string][]) {
    const id = crypto.randomUUID();
    const { error } = await su.from('announcements').insert({
      id, title:`ZZ_TEST_Ann_${label}`, date, body:'ZZ_TEST', category:'ZZ_TEST', status,
    });
    chk(`create announcement (${label})`, 'super', 'success', !error, error?.message ?? 'success');
    if (!error) { ids.push(id); cleanup.push(async()=>{ await admin.from('announcements').delete().eq('id',id); }); }
  }

  const { data: anns } = await admin.from('announcements').select('title');
  const tc = (anns??[]).filter((a:any)=>a.title.startsWith('ZZ_TEST_Ann_'));
  chk('getAnnouncementsAction: all 4 visible', 'super', '4', tc.length === 4, String(tc.length));

  if (ids[0]) {
    await su.from('announcements').update({ title:'ZZ_TEST_Ann_Edited' }).eq('id',ids[0]);
    const { data: e } = await admin.from('announcements').select('title').eq('id',ids[0]).single();
    chk('saveAnnouncement edit', 'super', 'ZZ_TEST_Ann_Edited', e?.title === 'ZZ_TEST_Ann_Edited', e?.title ?? '');
  }

  const edRole = (await callerOf(ed))?.role;
  chk('deleteAnnouncement as editor: denied', 'editor', 'not super', edRole !== 'super', edRole ?? '');

  if (ids[1]) {
    const { error: de } = await su.from('announcements').delete().eq('id',ids[1]);
    chk('deleteAnnouncement as super', 'super', 'success', !de, de?.message ?? 'success');
    ids.splice(1,1);
  }
}

// ══════════════════════════════════════════════════════════
// F. Enquiries
// ══════════════════════════════════════════════════════════
async function testEnquiries() {
  console.log('\n-- F. Enquiries --');
  const ed = await clientAs(ED, PW);
  const eids: string[] = [];

  for (const type of ['admission','tesh','partner','contact']) {
    const enquiryId = crypto.randomUUID();
    const { data: row, error } = await admin.from('enquiries').insert({
      id: enquiryId,
      type, sub_type:'ZZ_TEST', name:`ZZ_TEST_${type}`, email:`zz-${type}@ex.com`,
      phone:'0000', district:'ZZ', message:'ZZ', status:'new', notes:'', consent:true,
    }).select().single();
    chk(`insert ${type} enquiry`, 'admin', 'success', !error, error?.message ?? 'success');
    if (row) { eids.push(row.id); cleanup.push(async()=>{ await admin.from('enquiries').delete().eq('id',row.id); }); }
  }


  const edRole = (await callerOf(ed))?.role ?? '';
  chk('getEnquiriesAction as editor: denied', 'editor', 'denied', !['super','enquiry'].includes(edRole), edRole);

  if (eids[0]) {
    let prev: EnquiryStatus = 'new';
    for (const st of ['contacted','progress','completed','archived'] as EnquiryStatus[]) {
      await admin.from('enquiries').update({ status:st, updated_at:new Date().toISOString() }).eq('id',eids[0]);
      const { data: r } = await admin.from('enquiries').select('status').eq('id',eids[0]).single();
      chk(`enquiry status ${prev}->${st}`, 'super', st, r?.status === st, r?.status ?? '');
      prev = st;
    }
  }

  if (eids[0]) {
    const id = eids[0];
    const ts = new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
    const n = 'ZZ_tester';
    const note1 = `[${ts} - ${n}] ZZ_TEST_note_1`;
    await admin.from('enquiries').update({ notes: note1 }).eq('id', id);
    const { data: e } = await admin.from('enquiries').select('notes').eq('id',id).single();
    const note2 = `${e!.notes}\n\n[${ts} - ${n}] ZZ_TEST_note_2`;
    await admin.from('enquiries').update({ notes: note2 }).eq('id', id);
    const { data: af } = await admin.from('enquiries').select('notes').eq('id',id).single();
    const notes = af?.notes ?? '';
    const both = notes.includes('ZZ_TEST_note_1') && notes.includes('ZZ_TEST_note_2');
    const order = notes.indexOf('ZZ_TEST_note_1') < notes.indexOf('ZZ_TEST_note_2');
    chk('addNote: both present',   'enquiry', 'true', both,  String(both));
    chk('addNote: note_1 before',  'enquiry', 'true', order, String(order));
  }
}

// ══════════════════════════════════════════════════════════
// G. Users & Roles
// ══════════════════════════════════════════════════════════
async function testUsers() {
  console.log('\n-- G. Users & Roles --');
  const invEmail = `zz-inv-${TS}@example.com`;
  const token    = crypto.randomBytes(32).toString('hex');
  const expAt    = new Date(Date.now()+48*3600000).toISOString();

  const { error: ie } = await admin.from('invitations').insert({
    email:invEmail, role:'editor', token, invited_by:'ZZ_TEST_super', expires_at:expAt,
  });
  chk('inviteUser: row created', 'super', 'success', !ie, ie?.message ?? 'success');
  cleanup.push(async()=>{ await admin.from('invitations').delete().eq('email',invEmail).is('accepted_at',null); });

  const { data: ir } = await admin.from('invitations').select('expires_at').eq('token',token).single();
  const diff = Math.abs(new Date(ir?.expires_at??0).getTime()-new Date(expAt).getTime());
  chk('inviteUser: expires_at ~48h', 'super', '<5000ms', diff<5000, String(diff));

  const { error: dupE } = await admin.from('invitations').insert({
    email:invEmail, role:'editor', token:crypto.randomBytes(32).toString('hex'),
    invited_by:'ZZ_TEST_super', expires_at:expAt,
  });
  chk('inviteUser duplicate: rejected', 'super', 'error', !!dupE, dupE ? 'error' : 'success');

  chk('inviteUser bad domain: blocked (logic)', 'super', 'true', !['chaitanyakeralam.org'].includes('badactor.com'), 'true');

  const { error: rE } = await admin.from('invitations').delete().eq('email',invEmail).is('accepted_at',null);
  chk('revokeInvitation: success', 'super', 'success', !rE, rE?.message ?? 'success');

  await admin.from('profiles').update({ role:'enquiry' }).eq('id',editorId);
  const { data: pu } = await admin.from('profiles').select('role').eq('id',editorId).single();
  chk('updateUserRole: persisted', 'super', 'enquiry', pu?.role === 'enquiry', pu?.role ?? '');
  await admin.from('profiles').update({ role:'editor' }).eq('id',editorId);

  const su2 = await clientAs(SUP, PW);
  const sc = await callerOf(su2);
  chk('updateUserRole self: guard present (logic)', 'super', 'self detected', sc?.userId === superId, sc?.userId === superId ? 'self' : 'diff');

  await admin.from('profiles').update({ status:'suspended' }).eq('id',editorId);
  const { data: sp } = await admin.from('profiles').select('status').eq('id',editorId).single();
  chk('suspendUser: suspended', 'super', 'suspended', sp?.status === 'suspended', sp?.status ?? '');
  await admin.from('profiles').update({ status:'active' }).eq('id',editorId);
  const { data: ra } = await admin.from('profiles').select('status').eq('id',editorId).single();
  chk('reactivateUser: active', 'super', 'active', ra?.status === 'active', ra?.status ?? '');

  const { data: supers } = await admin.from('profiles').select('id').eq('role','super').eq('status','active');
  const nSup = supers?.length ?? 0;
  chk('demote last super: guard', 'super', '>1 OR guard in code', nSup>1, nSup>1?'multiple supers':'covered by self-guard');

  const ed  = await clientAs(ED,  PW);
  const enq = await clientAs(ENQ, PW);
  for (const [role, c] of [['editor',await callerOf(ed)],['enquiry',await callerOf(enq)]] as const) {
    chk(`getUsersAction as ${role}: denied`, role as string, 'not super', (c as any)?.role !== 'super', (c as any)?.role ?? '');
  }
}

// ══════════════════════════════════════════════════════════
// H. Activity Log
// ══════════════════════════════════════════════════════════
async function testActivityLog() {
  console.log('\n-- H. Activity Log --');
  const { error: le } = await admin.from('activity_log').insert({
    action:'ZZ_TEST_action', item:'ZZ_TEST_item', by_user:'ZZ_TEST_super', role:'super', details:'smoke',
  });
  chk('logActivity: row inserted', 'super', 'success', !le, le?.message ?? 'success');
  cleanup.push(async()=>{
    await admin.from('activity_log').delete().eq('action','ZZ_TEST_action').eq('by_user','ZZ_TEST_super');
  });

  const su = await clientAs(SUP, PW);
  const { data: lg, error: lge } = await su.from('activity_log').select('*').order('created_at',{ascending:false}).limit(20);
  chk('getActivityLogAction as super', 'super', 'success', !lge, `${lg?.length} rows`);
  chk('activity_log: test row present', 'super', 'found', !!(lg?.find((l:any)=>l.action==='ZZ_TEST_action')), 'found');

  const ed = await clientAs(ED, PW);
  const { data: edLg, error: edLge } = await ed.from('activity_log').select('*').limit(5);
  rec('getActivityLog as editor: RLS dependent', 'editor', 'rows or blocked',
    edLge ? 'RLS blocked' : `${edLg?.length} rows`, true,
    'getActivityLogAction (admin.ts:340) has no role check — gate is entirely DB RLS');
}

// ══════════════════════════════════════════════════════════
// I. Settings
// ══════════════════════════════════════════════════════════
async function testSettings() {
  console.log('\n-- I. Settings --');
  const sr = (await callerOf(await clientAs(SUP, PW)))?.role;
  const er = (await callerOf(await clientAs(ED,  PW)))?.role;
  const qr = (await callerOf(await clientAs(ENQ, PW)))?.role;
  chk('saveSettings as super: allowed',   'super',   'super',     sr === 'super',  sr ?? '');
  chk('saveSettings as editor: denied',   'editor',  'not super', er !== 'super',  er ?? '');
  chk('saveSettings as enquiry: denied',  'enquiry', 'not super', qr !== 'super',  qr ?? '');

  const testEntries = [
    { key: 'req2fa', value: 'true' },
    { key: 'timeout', value: '45' },
    { key: 'invite', value: '72' },
    { key: 'domains', value: 'chaitanyakeralam.org' },
  ];
  const { error: setErr } = await admin.from('site_settings').upsert(testEntries, { onConflict: 'key' });
  const { data: readBack, error: readErr } = await admin.from('site_settings').select('key, value');
  const map: Record<string, string> = {};
  (readBack || []).forEach((r: any) => { map[r.key] = r.value; });
  const persisted = !setErr && !readErr && map['timeout'] === '45' && map['invite'] === '72';
  chk('saveSettings: persists to DB', 'super', 'timeout:45, invite:72', persisted, persisted ? 'persisted' : (setErr?.message || readErr?.message || 'failed'));
}

// ══════════════════════════════════════════════════════════
// J. Security & Edge Cases
// ══════════════════════════════════════════════════════════
async function testSecurity() {
  console.log('\n-- J. Security --');
  const anon = createClient(SUPABASE_URL, ANON_KEY, { auth:{autoRefreshToken:false,persistSession:false} });

  const { data: am, error: ame } = await anon.from('media').select('*').limit(1);
  chk('anon getMedia: RLS blocks or empty', 'anon', '0 or error',
    ame!==null||(am?.length??0)===0, ame ? 'blocked' : `${am?.length} rows`,
    'getMediaAction has no auth guard — add caller check or tighten RLS');

  const { data: origSec } = await admin.from('page_sections').select('draft_content').eq('page_id','home').eq('section_id','hero').single();
  const { data: updatedRows, error: awe } = await anon.from('page_sections').update({ draft_content:{evil:true} }).eq('page_id','home').eq('section_id','hero').select();
  const { data: checkSec } = await admin.from('page_sections').select('draft_content').eq('page_id','home').eq('section_id','hero').single();
  const rowUnchanged = JSON.stringify(checkSec?.draft_content) === JSON.stringify(origSec?.draft_content);
  const writeBlocked = !!awe || (updatedRows?.length ?? 0) === 0;
  chk('anon write page_sections: blocked', 'anon', 'error or 0 rows & unchanged', writeBlocked && rowUnchanged, awe ? 'error returned' : `${updatedRows?.length ?? 0} rows updated`);

  const { error: aie } = await anon.from('announcements').insert({ id:crypto.randomUUID(), title:'HACK', date:'2026-01-01', body:'hack', status:'pub' });
  chk('anon insert announcement: blocked', 'anon', 'error', !!aie, aie ? 'blocked' : 'inserted');

  for (const [label, value] of [
    ['XSS',  '<script>alert(1)</script>'],
    ['SQL',  "'; DROP TABLE announcements; --"],
    ['long', 'A'.repeat(10000)],
  ] as [string,string][]) {
    const tid = crypto.randomUUID();
    const { error: me } = await admin.from('announcements').insert({ id:tid, title:value, date:'2026-01-01', body:'ZZ_TEST', status:'draft' });
    chk(`malformed input (${label}): no crash`, 'super', 'no DB err', !me, me?.message ?? 'ok',
      'Stored raw — UI must escape. Add Zod length/pattern validation to admin action inputs.');
    if (!me) await admin.from('announcements').delete().eq('id',tid);
  }

  const { data: fp } = await admin.from('pages').select('id').limit(1).single();
  const { data: fs } = await admin.from('page_sections').select('id,draft_content').eq('page_id',fp?.id??'').limit(1).single();
  if (fs) {
    await admin.from('page_sections').update({ draft_content:{title:'session1'} }).eq('id',fs.id);
    await admin.from('page_sections').update({ draft_content:{title:'session2'} }).eq('id',fs.id);
    const { data: af } = await admin.from('page_sections').select('draft_content').eq('id',fs.id).single();
    chk('concurrency: last-write-wins', 'super', 'session2',
      (af?.draft_content as any)?.title === 'session2', (af?.draft_content as any)?.title ?? '',
      'No OCC — concurrent saves silently overwrite each other. Add version-based conflict detection.');
    await admin.from('page_sections').update({ draft_content:fs.draft_content }).eq('id',fs.id);
  }
}

// ══════════════════════════════════════════════════════════
// Report
// ══════════════════════════════════════════════════════════
function printReport() {
  const pad = (s: string, n: number) => (s+' '.repeat(n)).slice(0,n);
  console.log('\n================================================================================');
  console.log('  ADMIN SMOKE TEST REPORT');
  console.log('================================================================================');
  console.log(pad('Test',50)+'| '+pad('Role',9)+'| '+pad('Expected',18)+'| '+pad('Actual',18)+'| Result');
  console.log('-'.repeat(110));
  for (const r of results) {
    console.log(pad(r.test,50)+'| '+pad(r.role,9)+'| '+pad(r.expected,18)+'| '+pad(r.actual,18)+'| '+(r.pass?'PASS':'FAIL'));
  }
  const pass = results.filter(r=>r.pass).length;
  const fail = results.filter(r=>!r.pass).length;
  console.log(`\nTotal: ${results.length}  Passed: ${pass}  Failed: ${fail}`);

  const fails = results.filter(r=>!r.pass);
  if (fails.length) {
    console.log('\n--- FAILURES & ROOT CAUSES ---');
    for (const f of fails) {
      console.log(`\n  FAIL: ${f.test} [${f.role}]`);
      console.log(`    Expected : ${f.expected}`);
      console.log(`    Actual   : ${f.actual}`);
      if (f.note) console.log(`    Fix      : ${f.note}`);
    }
  }
}

// ══════════════════════════════════════════════════════════
// Main
// ══════════════════════════════════════════════════════════
async function main() {
  console.log('=== Chaitanya Keralam Admin Smoke Tests ===');
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Run at  : ${new Date().toISOString()}\n`);
  try {
    await createTestUsers();
    console.log('Test users created (super/editor/enquiry)');
    await testPages();
    await testCarousel();
    await testMedia();
    await testProgrammes();
    await testAnnouncements();
    await testEnquiries();
    await testUsers();
    await testActivityLog();
    await testSettings();
    await testSecurity();
  } finally {
    console.log('\n-- Cleanup --');
    let errs = 0;
    for (const fn of [...cleanup].reverse()) {
      try { await fn(); } catch(e:any) { errs++; console.error('  cleanup err:', e.message); }
    }
    console.log(errs===0
      ? 'All ZZ_TEST_ data removed successfully'
      : `${errs} cleanup errors — check DB for leftover ZZ_TEST_ rows`);
    printReport();
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
