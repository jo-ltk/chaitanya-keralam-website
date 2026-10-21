'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AdminRole } from '@/lib/supabase/types';

async function getCallerProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles').select('id, name, role').eq('id', user.id).single();
  return profile ? { ...profile, userId: user.id } : null;
}

async function logActivity(action: string, item: string, by_user: string, role: AdminRole, details?: string) {
  const admin = createAdminClient();
  await admin.from('activity_log').insert({ action, item, by_user, role, details: details || '' });
}

// ─── Pages ──────────────────────────────────────────────────────────────────

export async function saveDraftPageAction(data: {
  pageId: string;
  sectionId: string;
  fields: Record<string, unknown>;
}) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const draftContent = { ...data.fields, saved_at: new Date().toISOString(), saved_by: caller.name };
  const { error } = await supabase.from('page_sections')
    .update({ draft_content: draftContent, updated_at: new Date().toISOString() })
    .eq('page_id', data.pageId).eq('section_id', data.sectionId);
  if (error) return { success: false, error: error.message };
  await supabase.from('pages')
    .update({ status: 'draft', updated_by: caller.name, updated_at: new Date().toISOString() })
    .eq('id', data.pageId).in('status', ['pub']);
  await logActivity('edited', `${data.pageId} - ${data.sectionId}`, caller.name, caller.role as AdminRole, 'Saved draft');
  return { success: true };
}

export async function saveSectionOrderAction(data: { pageId: string; order: string[] }) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const updates = data.order.map((sectionId, idx) =>
    supabase.from('page_sections')
      .update({ order_index: idx, updated_at: new Date().toISOString() })
      .eq('page_id', data.pageId).eq('section_id', sectionId)
  );
  const results = await Promise.all(updates);
  const err = results.find(r => r.error);
  if (err?.error) return { success: false, error: err.error.message };
  return { success: true };
}

export async function toggleSectionVisibilityAction(data: { pageId: string; sectionId: string; hidden: boolean }) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { error } = await supabase.from('page_sections')
    .update({ is_hidden: data.hidden, updated_at: new Date().toISOString() })
    .eq('page_id', data.pageId).eq('section_id', data.sectionId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function publishPageAction(pageId: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { data: sections } = await supabase.from('page_sections')
    .select('id, draft_content, version').eq('page_id', pageId).not('draft_content', 'is', null);
  if (sections && sections.length > 0) {
    const updates = sections.map(sec =>
      supabase.from('page_sections').update({
        published_content: sec.draft_content as Record<string, unknown>,
        draft_content: null,
        version: (sec.version || 1) + 1,
        updated_at: new Date().toISOString(),
      }).eq('id', sec.id)
    );
    await Promise.all(updates);
  }
  const { data: page, error } = await supabase.from('pages')
    .update({ status: 'pub', updated_by: caller.name, updated_at: new Date().toISOString() })
    .eq('id', pageId).select('name').single();
  if (error) return { success: false, error: error.message };
  await logActivity('published', page.name, caller.name, caller.role as AdminRole, 'Published page');
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/eco-spiritual-tourism');
  revalidatePath('/programmes');
  revalidatePath('/tesh-homes');
  return { success: true, pageName: page.name };
}

export async function unpublishPageAction(pageId: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can unpublish pages' };
  const supabase = createClient();
  const { data: page, error } = await supabase.from('pages')
    .update({ status: 'unpub', updated_by: caller.name, updated_at: new Date().toISOString() })
    .eq('id', pageId).select('name').single();
  if (error) return { success: false, error: error.message };
  await logActivity('unpublished', page.name, caller.name, caller.role as AdminRole);
  revalidatePath('/');
  return { success: true };
}

export async function getPagesAction() {
  const supabase = createClient();
  const { data, error } = await supabase.from('pages').select('*').order('id');
  if (error) return { success: false, error: error.message };
  return { success: true, pages: data };
}

export async function getPageSectionsAction(pageId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('page_sections')
    .select('*').eq('page_id', pageId).order('order_index');
  if (error) return { success: false, error: error.message };
  return { success: true, sections: data };
}

// ─── Carousel ───────────────────────────────────────────────────────────────

export async function getCarouselSlidesAction() {
  const supabase = createClient();
  const { data, error } = await supabase.from('carousel_slides').select('*').order('order_index');
  if (error) return { success: false, error: error.message };
  return { success: true, slides: data };
}

export async function updateCarouselSlideAction(data: {
  id: string;
  kicker?: string; title?: string; cap?: string;
  left_text?: string; right_text?: string; cta?: string; href?: string;
  alt?: string; en?: boolean; fx?: number; fy?: number; file?: string;
}) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { id, ...fields } = data;
  const { error } = await supabase.from('carousel_slides')
    .update({ ...fields, status: 'draft', updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function reorderCarouselSlidesAction(orderedIds: string[]) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const updates = orderedIds.map((id, idx) =>
    supabase.from('carousel_slides')
      .update({ order_index: idx, updated_at: new Date().toISOString() }).eq('id', id)
  );
  const results = await Promise.all(updates);
  const err = results.find(r => r.error);
  if (err?.error) return { success: false, error: err.error.message };
  return { success: true };
}

export async function publishCarouselAction() {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { error } = await supabase.from('carousel_slides')
    .update({ status: 'pub', updated_at: new Date().toISOString() }).eq('status', 'draft');
  if (error) return { success: false, error: error.message };
  await logActivity('published', 'Homepage carousel', caller.name, caller.role as AdminRole);
  revalidatePath('/');
  return { success: true };
}

// ─── Programmes ─────────────────────────────────────────────────────────────

export async function getProgrammesAction() {
  const supabase = createClient();
  const { data, error } = await supabase.from('programmes').select('*').order('order_index');
  if (error) return { success: false, error: error.message };
  return { success: true, programmes: data };
}

export async function updateProgrammeAction(data: { id: string; fields: Record<string, unknown> }) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { error } = await supabase.from('programmes')
    .update({ ...data.fields, status: 'draft', updated_at: new Date().toISOString() }).eq('id', data.id);
  if (error) return { success: false, error: error.message };
  await logActivity('edited', `Programme: ${data.id}`, caller.name, caller.role as AdminRole, 'Saved draft');
  return { success: true };
}

export async function submitProgrammeForReviewAction(programmeId: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { error } = await supabase.from('programmes')
    .update({ status: 'review', updated_at: new Date().toISOString() }).eq('id', programmeId);
  if (error) return { success: false, error: error.message };
  await logActivity('submitted for review', `Programme: ${programmeId}`, caller.name, caller.role as AdminRole);
  return { success: true };
}

export async function publishProgrammeAction(programmeId: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can approve and publish programmes' };
  const supabase = createClient();
  const { data: prog, error } = await supabase.from('programmes')
    .update({ status: 'pub', updated_at: new Date().toISOString() })
    .eq('id', programmeId).select('name').single();
  if (error) return { success: false, error: error.message };
  await logActivity('published', `Programme: ${prog.name}`, caller.name, 'super', 'Approved and published');
  revalidatePath('/programmes');
  return { success: true };
}

// ─── Announcements ──────────────────────────────────────────────────────────

export async function getAnnouncementsAction() {
  const supabase = createClient();
  const { data, error } = await supabase.from('announcements').select('*').order('order_index');
  if (error) return { success: false, error: error.message };
  return { success: true, announcements: data };
}

export async function saveAnnouncementAction(data: {
  id?: string; title: string; date: string; body: string;
  category?: string; status: 'pub' | 'draft' | 'archived';
}) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const payload = {
    title: data.title, date: data.date, body: data.body,
    category: data.category || 'General', status: data.status,
    updated_at: new Date().toISOString(),
  };
  if (data.id) {
    const { error } = await supabase.from('announcements').update(payload).eq('id', data.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('announcements')
      .insert({ ...payload, id: crypto.randomUUID() });
    if (error) return { success: false, error: error.message };
  }
  await logActivity(data.status === 'pub' ? 'published' : 'edited', `Announcement: ${data.title}`, caller.name, caller.role as AdminRole);
  if (data.status === 'pub') revalidatePath('/');
  return { success: true };
}

export async function deleteAnnouncementAction(id: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can delete announcements' };
  const supabase = createClient();
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function getUsersAction() {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can view users' };
  const supabase = createClient();
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').order('created_at');
  if (profErr) return { success: false, error: profErr.message };
  const { data: invitations } = await supabase.from('invitations')
    .select('email, role, expires_at, created_at').is('accepted_at', null)
    .gt('expires_at', new Date().toISOString());
  return { success: true, profiles: profiles || [], invitations: invitations || [] };
}

export async function suspendUserAction(userId: string, suspend: boolean) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can suspend accounts' };
  if (userId === caller.userId) return { success: false, error: 'Cannot suspend your own account' };
  const supabase = createClient();
  const { data: profile, error } = await supabase.from('profiles')
    .update({ status: suspend ? 'suspended' : 'active', updated_at: new Date().toISOString() })
    .eq('id', userId).select('name, email').single();
  if (error) return { success: false, error: error.message };
  if (suspend) {
    const admin = createAdminClient();
    await admin.auth.admin.signOut(userId);
  }
  await logActivity(suspend ? 'suspended' : 'reactivated', profile.email, caller.name, 'super');
  return { success: true };
}

export async function updateUserRoleAction(userId: string, role: AdminRole) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can change roles' };
  if (userId === caller.userId) return { success: false, error: 'Cannot change your own role' };
  const supabase = createClient();
  const { data: profile, error } = await supabase.from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId).select('email').single();
  if (error) return { success: false, error: error.message };
  await logActivity('changed role', `${profile.email} to ${role}`, caller.name, 'super');
  return { success: true };
}

export async function revokeInvitationAction(email: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can revoke invitations' };
  const admin = createAdminClient();
  const { error } = await admin.from('invitations')
    .delete().eq('email', email.toLowerCase()).is('accepted_at', null);
  if (error) return { success: false, error: error.message };
  await logActivity('revoked invitation', email, caller.name, 'super');
  return { success: true };
}

// ─── Activity Log ────────────────────────────────────────────────────────────

export async function getActivityLogAction(limit = 50) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  const supabase = createClient();
  const { data, error } = await supabase.from('activity_log')
    .select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) return { success: false, error: error.message };
  return { success: true, log: data };
}

// ─── Media ──────────────────────────────────────────────────────────────────

export async function getMediaAction() {
  const supabase = createClient();
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  if (error) return { success: false, error: error.message };
  return { success: true, media: data };
}

export async function saveMediaMetaAction(data: { id: string; alt: string; credit: string; category?: string }) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { error } = await supabase.from('media')
    .update({ alt: data.alt, credit: data.credit, category: data.category }).eq('id', data.id);
  if (error) return { success: false, error: error.message };
  await logActivity('edited alt text', data.id, caller.name, caller.role as AdminRole);
  return { success: true };
}

export async function deleteMediaAction(id: string) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const supabase = createClient();
  const { data: mediaRecord } = await supabase.from('media').select('path, filename').eq('id', id).single();
  if (!mediaRecord) return { success: false, error: 'Media not found' };
  const { data: sections } = await supabase.from('page_sections').select('id, images');
  const inUseSections = (sections || []).filter(s => {
    try { return JSON.stringify(s.images).includes(mediaRecord.path); } catch { return false; }
  });
  const { data: slides } = await supabase.from('carousel_slides').select('id').eq('file', mediaRecord.path);
  if (inUseSections.length > 0 || (slides && slides.length > 0)) {
    return { success: false, inUse: true, error: 'This image is in active use. Remove it from pages and slides before deleting.' };
  }
  const adminClient = createAdminClient();
  await adminClient.storage.from('site-media').remove([mediaRecord.path]);
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  await logActivity('deleted media', mediaRecord.filename, caller.name, caller.role as AdminRole);
  return { success: true };
}

export async function uploadMediaAction(formData: FormData) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (!['super', 'editor'].includes(caller.role)) return { success: false, error: 'Permission denied' };
  const file = formData.get('file') as File | null;
  const alt = ((formData.get('alt') as string) || '').trim();
  const credit = ((formData.get('credit') as string) || '').trim();
  const category = ((formData.get('category') as string) || 'General').trim();
  if (!file) return { success: false, error: 'No file provided' };
  if (!alt) return { success: false, error: 'Alt text is required' };
  if (!credit) return { success: false, error: 'Photo credit is required' };
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) return { success: false, error: 'Only JPG, PNG and WebP files are allowed' };
  if (file.size > 5 * 1024 * 1024) return { success: false, error: 'File must be 5 MB or smaller' };
  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const slug = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const filename = `${slug}-${Date.now()}.${ext}`;
  const path = `uploads/${filename}`;
  const adminClient = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadErr } = await adminClient.storage
    .from('site-media').upload(path, arrayBuffer, { contentType: file.type, upsert: false });
  if (uploadErr) return { success: false, error: uploadErr.message };
  const supabase = createClient();
  const { data: mediaRow, error: dbErr } = await supabase.from('media').insert({
    path, filename, alt, credit, category,
    mime_type: file.type, size_bytes: file.size, created_by: caller.name,
  }).select().single();
  if (dbErr) return { success: false, error: dbErr.message };
  await logActivity('uploaded media', filename, caller.name, caller.role as AdminRole);
  return { success: true, media: mediaRow };
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function saveSettingsAction(settings: {
  req2fa: boolean; timeout: string; invite: string; domains: string;
}) {
  const caller = await getCallerProfile();
  if (!caller) return { success: false, error: 'Unauthorized' };
  if (caller.role !== 'super') return { success: false, error: 'Only Super Admins can change settings' };
  await logActivity(
    'updated security settings',
    `2FA: ${settings.req2fa}, Timeout: ${settings.timeout}m, Invite: ${settings.invite}h`,
    caller.name, 'super'
  );
  return { success: true };
}

