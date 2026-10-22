'use client';

import React from 'react';
import { Button, Tag, TextField } from '@/components/kneds';
import { css, str } from '@/lib/dc';
import {
  saveDraftPageAction,
  saveSectionOrderAction,
  toggleSectionVisibilityAction,
  publishPageAction,
  unpublishPageAction,
  getPagesAction,
  getPageSectionsAction,
  publishCarouselAction,
  updateCarouselSlideAction,
  reorderCarouselSlidesAction,
  getCarouselSlidesAction,
  updateProgrammeAction,
  submitProgrammeForReviewAction,
  publishProgrammeAction,
  getProgrammesAction,
  saveAnnouncementAction,
  deleteAnnouncementAction,
  getAnnouncementsAction,
  suspendUserAction,
  updateUserRoleAction,
  revokeInvitationAction,
  getUsersAction,
  deleteMediaAction,
  uploadMediaAction,
  saveMediaMetaAction,
  getMediaAction,
  saveSettingsAction,
  getActivityLogAction,
} from '@/app/actions/admin';
import { inviteUserAction } from '@/app/actions/auth';
import { updateEnquiryStatusAction, addEnquiryNoteAction, getEnquiriesAction } from '@/app/actions/enquiries';
import type { AdminRole, PublishStatus, EnquiryStatus, UserStatus, Database } from '@/lib/supabase/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type PageRow = Database['public']['Tables']['pages']['Row'];
type SectionRow = Database['public']['Tables']['page_sections']['Row'];
type CarouselSlideRow = Database['public']['Tables']['carousel_slides']['Row'];
type MediaRow = Database['public']['Tables']['media']['Row'];
type ProgrammeRow = Database['public']['Tables']['programmes']['Row'];
type AnnouncementRow = Database['public']['Tables']['announcements']['Row'];
type EnquiryRow = Database['public']['Tables']['enquiries']['Row'];
type ActivityRow = Database['public']['Tables']['activity_log']['Row'];
type InvitationRow = Database['public']['Tables']['invitations']['Row'];

export const VIEW_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  pages: 'Pages',
  pageEdit: 'Page Editor',
  carousel: 'Homepage Carousel',
  media: 'Media Library',
  programmes: 'Programmes',
  announcements: 'Announcements',
  enquiries: 'Enquiries',
  users: 'Users & Roles',
  activity: 'Activity Log',
  settings: 'Settings',
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super: 'Super Admin',
  editor: 'Content Editor',
  enquiry: 'Enquiry Manager',
};


interface AdminAppState {
  view: string;
  role: AdminRole;
  nav: boolean;
  prof: boolean;
  q: string;
  toast: [string, string, string?] | null;
  dlg: any;
  loading: boolean;
  pageId: string;
  secId: string | null;
  edits: Record<string, unknown>;
  order: Record<string, unknown>;
  hidden: Record<string, boolean>;
  pstat: Record<string, PublishStatus>;
  dirty: Record<string, boolean>;
  device: string;
  pFilter: string;
  dragSec: any;
  overSec: any;
  hist: boolean;
  pages: PageRow[];
  sections: SectionRow[];
  slideSel: number;
carSel: number;           // selected slide index for editor
  carEdits: Record<string, unknown>;  // form edit state for selected slide
  carOrder: string[];       // ordered slide IDs for reordering
  carMoving: boolean;       // reorder in progress flag
  carDirty: boolean;
  carSt: string;
  slides: CarouselSlideRow[];
  slUp: any;
  overSl: any;
  media: MediaRow[];
  mView: string;
  mCat: string;
  mQ: string;
  mSel: string | null;
  mEdits: Record<string, unknown>;
  upl: any[];
  hot: boolean;
  progId: string;
  progTab: string;
  pedits: Record<string, unknown>;
  prst: Record<string, PublishStatus>;
  prDirty: Record<string, boolean>;
  programmes: ProgrammeRow[];
  ann: AnnouncementRow[];
  annId: string | null;
  annEdits: Record<string, unknown>;
  annErr: boolean;
  enq: EnquiryRow[];
  enqTab: string;
  enqSt: string;
  enqQ: string;
  enqSel: string | null;
  note: string;
  users: ProfileRow[];
  invitations: InvitationRow[];
  invEmail: string;
  invRole: AdminRole;
  invErr: string;
  ex: { fmt: string; contact: boolean; notes: boolean };
  aRows: any[];
  aType: string;
  aQ: string;
  aNone: boolean;
  set: { req2fa: boolean; timeout: string; invite: string; domains: string };
  ack: boolean;
  activity: ActivityRow[];
  crop: any;
  pickKey: string | null;
}

export default class AdminApp extends React.Component<{
  view?: string;
  role?: string;
  page?: string;
  sec?: string;
  mcat?: string;
  msel?: string;
  etab?: string;
  esel?: string;
  open?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}, AdminAppState> {
  [key: string]: any;

  constructor(props: {
    view?: string;
    role?: string;
    page?: string;
    sec?: string;
    mcat?: string;
    msel?: string;
    etab?: string;
    esel?: string;
    open?: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
  }) {
    super(props);
    this.state = {
      view: props.view || 'dashboard',
      role: (props.role as AdminRole) || 'super',
      nav: false,
      prof: false,
      q: '',
      toast: null,
      dlg: null,
      loading: true,
      ack: false,
      pageId: props.page || 'home',
      secId: null,
      edits: {},
      order: {},
      hidden: {},
      pstat: {},
      dirty: {},
      device: 'desktop',
      pFilter: 'all',
      dragSec: null,
      overSec: null,
      hist: false,
      pages: [],
      sections: [],
      slideSel: 0,
      carSel: 0,
      carEdits: {},
      carOrder: [],
      carMoving: false,
      carDirty: false,
      carSt: 'pub',
      slides: [],
      slUp: null,
      overSl: null,
      media: [],
      mView: 'grid',
      mCat: 'all',
      mQ: '',
      mSel: null,
      mEdits: {},
      upl: [],
      hot: false,
      progId: '3m',
      progTab: 'overview',
      pedits: {},
      prst: { '3m': 'pub', '6m': 'pub', '12m': 'review' },
      prDirty: {},
      programmes: [],
      ann: [],
      annId: null,
      annEdits: {},
      annErr: false,
      enq: [],
      enqTab: 'all',
      enqSt: 'all',
      enqQ: '',
      enqSel: null,
      note: '',
      users: [],
      invitations: [],
      invEmail: '',
      invRole: 'editor',
      invErr: '',
      ex: { fmt: 'csv', contact: false, notes: false },
      aRows: [],
      aType: 'all',
      aQ: '',
      aNone: false,
      set: { req2fa: true, timeout: '30', invite: '72', domains: '' },
      activity: [],
      crop: null,
      pickKey: null,
    };
  }

  componentDidMount() {
    this.loadAll();
    if (this.state.view === 'pageEdit') this.loadSections(this.state.pageId);
  }

  private async loadSections(pid: string) {
    const res = await getPageSectionsAction(pid);
    if (res.success && res.sections) {
      this.setState({ sections: res.sections, secId: res.sections[0]?.id ?? null, edits: {}, order: {} });
    } else {
      this.toast('Could not load sections: ' + (res.error || 'Unknown error'), '', 'err');
    }
  }

  private async loadAll() {
    const self = this;
    const role = this.state.role;
    try {
      const [pagesRes, slidesRes, mediaRes, annRes, enqRes, activities] = await Promise.all([
        getPagesAction(),
        getCarouselSlidesAction(),
        getMediaAction(),
        getAnnouncementsAction(),
        getEnquiriesAction(),
        getActivityLogAction(),
      ]);
      const programmesRes = await getProgrammesAction();
      if (!pagesRes.success || !slidesRes.success || !mediaRes.success) {
        this.toast('Some admin data failed to load', 'Refresh to retry.', 'err');
      }
      if (pagesRes.success && pagesRes.pages) self.setState({ pages: pagesRes.pages, pstat: Object.fromEntries(pagesRes.pages.map((p: PageRow) => [p.id, p.status])) });
      if (slidesRes.success && slidesRes.slides) self.setState({ slides: slidesRes.slides });
      if (mediaRes.success && mediaRes.media) self.setState({ media: mediaRes.media });
      if (annRes.success && annRes.announcements) self.setState({ ann: annRes.announcements });
      if (programmesRes.success && programmesRes.programmes) {
        const prstMap: Record<string, PublishStatus> = { ...self.state.prst };
        programmesRes.programmes.forEach((p: ProgrammeRow) => {
          prstMap[p.id] = p.status;
        });
        self.setState({ programmes: programmesRes.programmes, prst: prstMap });
      }
      if (enqRes.success && enqRes.enquiries) self.setState({ enq: enqRes.enquiries });
      if (activities.success && activities.log) self.setState({ activity: activities.log });
      if (role === 'super') {
        const usersRes = await getUsersAction();
        if (usersRes.success && usersRes.profiles) self.setState({ users: usersRes.profiles, invitations: (usersRes.invitations as InvitationRow[]) || [] });
      }
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      self.setState({ loading: false });
    }
  }

  private toast(msg: string, sub?: string, kind?: string) {
    this.setState({ toast: [msg, sub || '', kind] });
    clearTimeout(this._tt);
    this._tt = setTimeout(() => this.setState({ toast: null }), 4000);
  }

  private confirm(opts: { title: string; body: string; ok: string; act?: string; href?: string; danger?: boolean; warn?: boolean; needAck?: boolean; ackLabel?: string; list?: string[] }) {
    this.setState({ dlg: opts, ack: false });
  }

  private stInfo(st: PublishStatus | 'review' | undefined): [string, string] {
    const map: Record<string, [string, string]> = {
      pub: ['Live', 'st st-on'],
      draft: ['Draft', 'st st-draft'],
      review: ['Review', 'st st-review'],
      unpub: ['Unpublished', 'st st-off'],
      archived: ['Archived', 'st st-off'],
    };
    return map[st] || ['—', 'st st-off'];
  }

  private ev(obj: any, def: any): any {
    return obj != null ? obj : def;
  }

  private K(sec: SectionRow, k: string): any {
    return sec.draft_content && typeof sec.draft_content === 'object' ? (sec.draft_content as Record<string, unknown>)[k] : undefined;
  }

  private secsOf(pid: string): SectionRow[] {
    return this.state.sections.filter((s: SectionRow) => s.page_id === pid);
  }

  private fld(v: any, onChange: (v: any) => void, max?: number) {
    return { v: v != null ? v : '', onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value), max: max };
  }

  private markDirty(pid: string): Record<string, boolean> {
    const d = Object.assign({}, this.state.dirty);
    d[pid] = true;
    return d;
  }

  private async uploadSingleFile(file: File) {
    if (!file) return;
    if (['image/jpeg', 'image/png', 'image/webp'].indexOf(file.type) < 0) return this.toast('Only JPG, PNG or WebP allowed', '', 'err');
    if (file.size > 5 * 1024 * 1024) return this.toast('File is larger than 5 MB', file.name, 'err');
    const cat = this.state.mCat && this.state.mCat !== 'all' ? this.state.mCat : 'General';
    const alt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', alt);
    formData.append('credit', 'Chaitanya Keralam');
    formData.append('category', cat);
    this.toast('Uploading ' + file.name + '...');
    const res = await uploadMediaAction(formData);
    if (res.success && res.media) {
      const m = res.media as MediaRow;
      const mediaList = [m, ...(this.state.media || [])];
      this.setState({ media: mediaList, mSel: m.id });
      this.toast('Uploaded successfully', file.name);
    } else {
      this.toast('Upload failed: ' + (res.error || 'Unknown error'), '', 'err');
    }
  }

  private syncUrl(view: string, pageId?: string) {
    if (typeof window === 'undefined') return;
    const slug: string | undefined = ({
      dashboard: '',
      pages: '/pages',
      pageEdit: '/pages/' + pageId,
      carousel: '/carousel',
      media: '/media',
      programmes: '/programmes',
      announcements: '/announcements',
      enquiries: '/enquiries',
      users: '/users',
      activity: '/activity',
      settings: '/settings',
    } as Record<string, string>)[view];
    if (slug != null) window.history.replaceState(null, '', '/admin' + slug);
  }

  componentWillUnmount() {
    clearTimeout(this._tt);
    clearInterval(this._ui);
    clearInterval(this._su);
    clearTimeout(this._lt);
  }

  private goView(view: string) {
    this.setState({ view, dlg: null });
    this.syncUrl(view, this.state.pageId);
    if (view === 'pageEdit') this.loadSections(this.state.pageId);
  }

  private go(view: string, opts?: any) {
    const nextPid = opts?.pageId ?? this.state.pageId;
    if (opts) {
      if (opts.pageId !== undefined) this.setState({ pageId: opts.pageId });
      if (opts.secId !== undefined) this.setState({ secId: opts.secId });
      if (opts.mcat !== undefined) this.setState({ mCat: opts.mcat });
      if (opts.msel !== undefined) this.setState({ mSel: opts.msel });
      if (opts.etab !== undefined) this.setState({ enqTab: opts.etab });
      if (opts.esel !== undefined) this.setState({ enqSel: opts.esel });
      if (opts.progId !== undefined) this.setState({ progId: opts.progId });
      if (opts.progTab !== undefined) this.setState({ progTab: opts.progTab });
    }
    this.setState({ view, dlg: null });
    this.syncUrl(view, nextPid);
    if (view === 'pageEdit') this.loadSections(nextPid);
  }

  private allowed(view: string, role: AdminRole): boolean {
    const A: Record<string, string | string[]> = {
      super: 'all',
      editor: ['dashboard', 'pages', 'pageEdit', 'carousel', 'media', 'programmes', 'announcements', 'activity'],
      enquiry: ['dashboard', 'enquiries', 'activity'],
    };
    const perm = A[role];
    if (!perm) return false;
    return perm === 'all' || (typeof perm === 'string' ? perm === view : perm.includes(view));
  }

  private ini(name: string): string {
    return name.split(' ').map((w) => w.charAt(0)).join('').toUpperCase();
  }

  private async run(act: string) {
    const pid = this.state.pageId;
    const pname = this.state.pages.find((pg: PageRow) => pg.id === pid)?.name || 'Page';
    const close = () => this.setState({ dlg: null });
    const fail = (label: string, err?: string) => this.toast(label + (err || 'Unknown error'), '', 'err');
    type R = { success: boolean; error?: string };
    const call = async (fn: () => Promise<R>, ok: () => void, msg: [string, string?], failLabel: string) => {
      try {
        const res = await fn();
        close();
        if (res.success) { ok(); this.toast(msg[0], msg[1]); } else fail(failLabel, res.error);
      } catch (e: any) { close(); fail(failLabel, e?.message); }
    };

    if (act === 'publishPage' || act === 'republishPage') {
      return call(() => publishPageAction(pid), () =>
        this.setState((p) => ({ pstat: { ...p.pstat, [pid]: 'pub' }, dirty: { ...p.dirty, [pid]: false } })),
        [act === 'publishPage' ? pname + ' published' : 'Republished', 'Changes are live on the public website.'], 'Could not publish: ');
    }
    if (act === 'unpublishPage') {
      return call(() => unpublishPageAction(pid), () =>
        this.setState((p) => ({ pstat: { ...p.pstat, [pid]: 'unpub' } })), [pname + ' unpublished'], 'Could not unpublish: ');
    }
    if (act === 'discard') {
      this.setState((p) => {
        const e: Record<string, unknown> = {};
        Object.keys(p.edits).forEach((k) => { if (k.indexOf('p.' + pid + '.') !== 0) e[k] = p.edits[k]; });
        const o = { ...p.order }; delete o[pid];
        return { edits: e, order: o, dirty: { ...p.dirty, [pid]: false }, dlg: null };
      });
      return this.toast('Unsaved changes discarded', 'The last saved draft is shown.');
    }
    if (act === 'publishCar') {
      return call(() => publishCarouselAction(), () => this.setState({ carSt: 'pub', carDirty: false }),
        ['Homepage carousel published', 'All enabled slides are now live.'], 'Could not publish carousel: ');
    }
    if (act === 'approveProg') {
      const id = this.state.progId;
      if (this.state.prDirty[id]) { close(); return this.toast('Save the draft first', 'You have unsaved edits.', 'err'); }
      return call(() => publishProgrammeAction(id), () =>
        this.setState((p) => ({ prst: { ...p.prst, [id]: 'pub' }, prDirty: { ...p.prDirty, [id]: false } })),
        ['Programme published', 'The programme page and comparison table are updated.'], 'Could not publish: ');
    }
    if (act === 'submitForReview') {
      const id = this.state.progId;
      if (this.state.prDirty[id]) { close(); return this.toast('Save the draft first', 'You have unsaved edits.', 'err'); }
      return call(() => submitProgrammeForReviewAction(id), () =>
        this.setState((p) => ({ prst: { ...p.prst, [id]: 'review' } })),
        ['Submitted for review', 'A Super Admin can now approve and publish it.'], 'Could not submit: ');
    }
    if (act.startsWith('deleteMedia_')) {
      const id = act.replace('deleteMedia_', '');
      return call(() => deleteMediaAction(id), () =>
        this.setState((p) => ({ media: p.media.filter((m: MediaRow) => m.id !== id), mSel: null })),
        ['Media deleted'], 'Could not delete (it may be in use): ');
    }
    if (act.startsWith('deleteAnnouncement_')) {
      const id = act.replace('deleteAnnouncement_', '');
      return call(() => deleteAnnouncementAction(id), () =>
        this.setState((p) => ({ ann: p.ann.filter((a: AnnouncementRow) => a.id !== id), annId: null })),
        ['Announcement deleted'], 'Could not delete announcement: ');
    }
    if (act.startsWith('suspendUser_')) {
      const [userId, flag] = act.replace('suspendUser_', '').split(':');
      const suspend = flag === 'true';
      return call(() => suspendUserAction(userId, suspend), () =>
        this.setState((p) => ({ users: p.users.map((u: ProfileRow) => u.id === userId ? { ...u, status: (suspend ? 'suspended' : 'active') as UserStatus } : u) })),
        [suspend ? 'User suspended' : 'User reactivated'], 'Action failed: ');
    }
    if (act.startsWith('revokeInvitation_')) {
      const email = act.replace('revokeInvitation_', '');
      return call(() => revokeInvitationAction(email), () =>
        this.setState((p) => ({ invitations: p.invitations.filter((i: InvitationRow) => i.email.toLowerCase() !== email.toLowerCase()) })),
        ['Invitation revoked'], 'Could not revoke invitation: ');
    }
    close();
  }

  private orderedSecs(): SectionRow[] {
    const { order, pageId, sections } = this.state;
    const ids = order[pageId] as string[] | undefined;
    if (!ids) return sections;
    return ids.map((id) => sections.find((x: SectionRow) => x.id === id)).filter(Boolean) as SectionRow[];
  }

  private moveSec(id: string, dir: -1 | 1) {
    const ids = this.orderedSecs().map((x) => x.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    this.setState((p) => ({ order: { ...p.order, [p.pageId]: ids }, dirty: { ...p.dirty, [p.pageId]: true } }));
  }

  private secVal(sec: SectionRow, key: string): string {
    const k = `p.${this.state.pageId}.${sec.id}.${key}`;
    const v = k in this.state.edits ? this.state.edits[k] : this.K(sec, key);
    return v == null ? '' : String(v);
  }

  private setSecVal(sec: SectionRow, key: string, v: string) {
    this.setState((p) => ({ edits: { ...p.edits, [`p.${p.pageId}.${sec.id}.${key}`]: v }, dirty: { ...p.dirty, [p.pageId]: true } }));
  }

  private async saveDraft() {
    const s = this.state;
    const pid = s.pageId;
    const prefix = `p.${pid}.`;
    const bySec: Record<string, Record<string, unknown>> = {};
    Object.keys(s.edits).filter((k) => k.indexOf(prefix) === 0).forEach((k) => {
      const parts = k.slice(prefix.length).split('.');
      bySec[parts[0]] = bySec[parts[0]] || {};
      bySec[parts[0]][parts.slice(1).join('.')] = s.edits[k];
    });

    try {
      const savePromises = Object.keys(bySec).map((secId) => {
        const sec = s.sections.find((x: SectionRow) => x.id === secId);
        const existingDraft = (sec?.draft_content && typeof sec.draft_content === 'object') ? sec.draft_content as Record<string, unknown> : {};
        const mergedFields = { ...existingDraft, ...bySec[secId] };
        return saveDraftPageAction({ pageId: pid, sectionId: sec?.section_id || secId, fields: mergedFields });
      });

      const results = await Promise.all(savePromises);
      const failed = results.find((r) => !r.success);
      if (failed) return this.toast('Could not save draft: ' + (failed.error || 'Unknown error'), '', 'err');

      if (s.order[pid]) {
        const orderIds = (s.order[pid] as string[]).map((id) => {
          const sec = s.sections.find((x) => x.id === id);
          return sec?.section_id || id;
        });
        const r2 = await saveSectionOrderAction({ pageId: pid, order: orderIds });
        if (!r2?.success) return this.toast('Could not save order: ' + (r2?.error || 'Unknown error'), '', 'err');
      }

      this.setState((p) => ({
        sections: p.sections.map((x: SectionRow) => {
          if (!bySec[x.id]) return x;
          const existingDraft = (x.draft_content && typeof x.draft_content === 'object') ? x.draft_content as Record<string, unknown> : {};
          return { ...x, draft_content: { ...existingDraft, ...bySec[x.id] } } as SectionRow;
        }),
        edits: Object.keys(p.edits).reduce((a: Record<string, unknown>, k) => { if (k.indexOf(prefix) !== 0) a[k] = p.edits[k]; return a; }, {}),
        dirty: { ...p.dirty, [pid]: false },
        pstat: { ...p.pstat, [pid]: p.pstat[pid] === 'pub' ? 'draft' : p.pstat[pid] },
      }));
      this.toast('Draft saved', 'The live page is unchanged until you publish.');
    } catch (e: any) {
      this.toast('Could not save draft: ' + e?.message, '', 'err');
    }
  }

  private async toggleSec(sec: SectionRow) {
    const key = this.state.pageId + '.' + sec.id;
    const next = !this.state.hidden[key];
    const res = await toggleSectionVisibilityAction({ pageId: this.state.pageId, sectionId: sec.section_id || sec.id, hidden: next });
    if (res?.success) {
      this.setState((p) => ({ hidden: { ...p.hidden, [key]: next }, dirty: { ...p.dirty, [p.pageId]: true } }));
    } else {
      this.toast('Could not change visibility: ' + (res?.error || 'Unknown error'), '', 'err');
    }
  }

  private slideKeys(sl: any): string[] {
    const skip = ['id', 'created_at', 'updated_at', 'image', 'image_path', 'path', 'media_id', 'status', 'order_index'];
    return Object.keys(sl).filter((k) => (typeof sl[k] === 'string' || typeof sl[k] === 'number') && skip.indexOf(k) < 0);
  }

  private async saveSlide(sl: CarouselSlideRow) {
    const edits = (this.state.carEdits as Record<string, any>) || {};
    const res = await updateCarouselSlideAction({ id: sl.id, ...edits });
    if (res?.success) {
      this.setState((p) => ({
        slides: p.slides.map((x: CarouselSlideRow) => x.id === sl.id ? { ...x, ...edits } as CarouselSlideRow : x),
        carEdits: {},
        carDirty: false,
        carSt: 'draft',
      }));
      this.toast('Slide saved', 'Publish the carousel to make it live.');
    } else {
      this.toast('Could not save slide: ' + (res?.error || 'Unknown error'), '', 'err');
    }
  }

  private async toggleSlide(sl: CarouselSlideRow) {
    const res = await updateCarouselSlideAction({ id: sl.id, en: !sl.en });
    if (res?.success) {
      this.setState((p) => ({
        slides: p.slides.map((x: CarouselSlideRow) => x.id === sl.id ? { ...x, en: !sl.en } as CarouselSlideRow : x),
        carSt: 'draft',
      }));
    } else {
      this.toast('Could not update slide: ' + (res?.error || 'Unknown error'), '', 'err');
    }
  }

  private async moveSlide(i: number, dir: -1 | 1) {
    const list = [...this.state.slides];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    const res = await reorderCarouselSlidesAction(list.map((x) => x.id));
    if (res?.success) {
      this.setState({ slides: list, carSt: 'draft' });
    } else {
      this.toast('Could not reorder: ' + (res?.error || 'Unknown error'), '', 'err');
    }
  }

  private renderPageEditor() {
    const s = this.state;
    const pid = s.pageId;
    const pg = s.pages.find((p: PageRow) => p.id === pid);
    const st = s.pstat[pid];
    const [stLabel, stCls] = this.stInfo(st);
    const secs = this.orderedSecs();
    const cur = secs.find((x) => x.id === s.secId) || secs[0];
    const keys = cur && cur.draft_content && typeof cur.draft_content === 'object'
      ? Object.keys(cur.draft_content as object).filter((k) => typeof (cur.draft_content as any)[k] === 'string' || typeof (cur.draft_content as any)[k] === 'number')
      : [];
    const dirty = !!s.dirty[pid];

    return (
      <div className={"stack"} style={css("gap: 20px;")}>
        <div className={"ph"}>
          <div className={"ph-t"}>
            <p className={"eyb"}>Page editor</p>
            <h1 className={"h1"}>{pg?.name || 'Page'}</h1>
            <p className={"sub"}>
              <span className={"st " + stCls}>{stLabel}</span> {pg?.path}
              {dirty && <b style={css("color:#c5a15a;")}> · Unsaved changes</b>}
            </p>
          </div>
          <div className={"acts"}>
            <button className={"btn"} onClick={() => this.go('pages')}>← Pages</button>
            <button className={"btn"} disabled={!dirty} onClick={() => this.confirm({ title: 'Discard unsaved changes?', body: 'Edits since your last saved draft will be lost.', ok: 'Discard', danger: true, act: 'discard' })}>Discard</button>
            <button className={"btn"} disabled={!dirty} onClick={() => this.saveDraft()}>Save Draft</button>
            {s.role === 'super' && st === 'unpub' && (
              <button className={"btn"} onClick={() => this.confirm({ title: 'Republish ' + (pg?.name || 'page'), body: 'The page will be visible again.', ok: 'Republish', act: 'republishPage' })}>Republish</button>
            )}
            {s.role === 'super' && st !== 'unpub' && pid !== 'home' && (
              <button className={"btn danger"} onClick={() => this.confirm({ title: 'Unpublish ' + (pg?.name || 'page'), body: 'Visitors will see a "page not available" notice.', ok: 'Unpublish', danger: true, act: 'unpublishPage' })}>Unpublish</button>
            )}
            <button className={"btn pri"} disabled={dirty} title={dirty ? 'Save draft first' : ''} onClick={() => this.confirm({ title: 'Publish ' + (pg?.name || 'page'), body: 'Your draft will replace the live page.', ok: 'Publish now', act: 'publishPage', needAck: true, ackLabel: 'I have previewed the changes on desktop and mobile' })}>Publish</button>
          </div>
        </div>
        <div style={css("display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:16px;align-items:start;")}>
          <div className={"card"}>
            <div className={"card-h"}><h2 className={"h2"}>Sections ({secs.length})</h2></div>
            {secs.length === 0 && <div className={"empty"}><b>No sections found for this page.</b></div>}
            {secs.map((x, i) => {
              const hid = !!s.hidden[pid + '.' + x.id];
              return (
                <div key={x.id} style={css(`padding:12px 16px;border-top:1px solid var(--line);background:${cur?.id === x.id ? 'var(--ivory)' : '#fff'};opacity:${hid ? 0.55 : 1};`)}>
                  <div style={css("font-weight:600;cursor:pointer;")} onClick={() => this.setState({ secId: x.id })}>{x.name}</div>
                  <div className={"small muted"}>{x.title}{hid ? ' · hidden' : ''}</div>
                  <div style={css("display:flex;gap:6px;margin-top:8px;")}>
                    <button className={"btn sm"} disabled={i === 0} onClick={() => this.moveSec(x.id, -1)}>↑</button>
                    <button className={"btn sm"} disabled={i === secs.length - 1} onClick={() => this.moveSec(x.id, 1)}>↓</button>
                    <button className={"btn sm"} onClick={() => this.toggleSec(x)}>{hid ? 'Show' : 'Hide'}</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={"card"} style={css("padding:24px;display:flex;flex-direction:column;gap:16px;")}>
            {!cur ? <div className={"empty"}><b>Select a section to edit.</b></div> : (<>
              <h2 className={"h2"}>{cur.name}</h2>
              {keys.length === 0 && <p className={"small muted"}>This section has no editable text fields.</p>}
              {keys.map((k) => {
                const v = this.secVal(cur, k);
                const long = v.length > 80 || /body|text|description|summary/i.test(k);
                return (
                  <div className={"fld"} key={k}>
                    <label style={css("text-transform:capitalize;")}>{k.replace(/[_-]/g, ' ')}</label>
                    {long
                      ? <textarea className={"inp"} rows={4} value={v} onChange={(e) => this.setSecVal(cur, k, e.target.value)} />
                      : <input className={"inp"} value={v} onChange={(e) => this.setSecVal(cur, k, e.target.value)} />}
                  </div>
                );
              })}
            </>)}
          </div>
        </div>
      </div>
    );
  }

  private renderCarousel() {
    const s = this.state;
    const slides = s.slides;
    const sel = slides[s.carSel] as any;
    const edits = (s.carEdits as Record<string, any>) || {};
    const [stLabel, stCls] = this.stInfo(s.carSt as PublishStatus);

    return (
      <div className={"stack"} style={css("gap: 20px;")}>
        <div className={"ph"}>
          <div className={"ph-t"}>
            <p className={"eyb"}>Homepage</p>
            <h1 className={"h1"}>Carousel ({slides.length})</h1>
            <p className={"sub"}><span className={"st " + stCls}>{stLabel}</span> {slides.filter((x: CarouselSlideRow) => x.en).length} enabled slides</p>
          </div>
          <div className={"acts"}>
            <button className={"btn pri"} onClick={() => this.confirm({ title: 'Publish carousel', body: 'All enabled slides will go live on the Home page.', ok: 'Publish carousel', act: 'publishCar' })}>Publish Carousel</button>
          </div>
        </div>
        <div style={css("display:grid;grid-template-columns:minmax(260px,360px) 1fr;gap:16px;align-items:start;")}>
          <div className={"card"}>
            {slides.length === 0 && <div className={"empty"}><b>No slides yet.</b></div>}
            {slides.map((sl: CarouselSlideRow, i: number) => (
              <div key={sl.id} style={css(`padding:12px 16px;border-top:1px solid var(--line);background:${i === s.carSel ? 'var(--ivory)' : '#fff'};opacity:${sl.en ? 1 : 0.55};`)}>
                <div style={css("font-weight:600;cursor:pointer;")} onClick={() => this.setState({ carSel: i, carEdits: {}, carDirty: false })}>
                  {i + 1}. {(sl as any).title || (sl as any).headline || 'Slide ' + (i + 1)}
                </div>
                <div style={css("display:flex;gap:6px;margin-top:8px;")}>
                  <button className={"btn sm"} disabled={i === 0} onClick={() => this.moveSlide(i, -1)}>↑</button>
                  <button className={"btn sm"} disabled={i === slides.length - 1} onClick={() => this.moveSlide(i, 1)}>↓</button>
                  <button className={"btn sm"} onClick={() => this.toggleSlide(sl)}>{sl.en ? 'Disable' : 'Enable'}</button>
                </div>
              </div>
            ))}
          </div>
          <div className={"card"} style={css("padding:24px;display:flex;flex-direction:column;gap:16px;")}>
            {!sel ? <div className={"empty"}><b>Select a slide to edit.</b></div> : (<>
              {this.slideKeys(sel).map((k) => (
                <div className={"fld"} key={k}>
                  <label style={css("text-transform:capitalize;")}>{k.replace(/[_-]/g, ' ')}</label>
                  <input
                    className={"inp"}
                    value={edits[k] !== undefined ? edits[k] : sel[k] || ''}
                    onChange={(e) => this.setState({ carEdits: { ...edits, [k]: e.target.value }, carDirty: true })}
                  />
                </div>
              ))}
              <div style={css("display:flex;justify-content:flex-end;")}>
                <button className={"btn pri"} disabled={!s.carDirty} onClick={() => this.saveSlide(sel)}>Save Slide</button>
              </div>
            </>)}
          </div>
        </div>
      </div>
    );
  }

  private renderVals() {
    const s = this.state;
    const self: any = this;
    const role = s.role;
    const viewNames = { dashboard: 'the dashboard', pages: 'Pages', pageEdit: 'the page editor', carousel: 'the homepage carousel', media: 'the media library', programmes: 'Programmes', announcements: 'Announcements', enquiries: 'Enquiries', users: 'Users & roles', activity: 'the activity log', settings: 'Settings' };
    const roleLabels = ROLE_LABELS;
    const me = {
      id: this.props.userId || '',
      name: this.props.userName || (role === 'super' ? 'Joel' : role === 'editor' ? 'Anitha Menon' : 'Rahul Nair'),
      email: this.props.userEmail || (role === 'super' ? 'joel@pervadorit.com' : role === 'editor' ? 'anitha@example.org' : 'rahul@example.org'),
      roleLabel: roleLabels[role],
    };
    const denied = !this.allowed(s.view, role);
    const is = (v: string) => !denied && !s.loading && s.view === v;

    const pages = s.pages || [];
    const pageRows = (pages || []).map((p: PageRow, i: number) => {
      const st = s.pstat[p.id];
      const info = self.stInfo(st);
      return {
        n: i + 1,
        id: p.id,
        name: p.name,
        path: p.path,
        stKey: st,
        stLabel: info[0],
        stCls: info[1],
        dirty: !!s.dirty[p.id],
        canUnpub: p.id !== 'home' && st !== 'unpub',
        isUnpub: st === 'unpub',
        updatedAt: (p as any).updated_at ? new Date((p as any).updated_at).toLocaleString('en-IN') : '—',
      };
    });
    const total = pageRows.length;
    const pubN = pageRows.filter((r) => r.stKey === 'pub').length;
    const draftN = pageRows.filter((r) => r.stKey === 'draft').length;
    const revN = pageRows.filter((r) => r.stKey === 'review').length;
    const unpubN = pageRows.filter((r) => r.stKey === 'unpub').length;

    const sections = s.sections || [];
    const enabledN = (s.slides || []).filter((x: CarouselSlideRow) => x.en).length;

    const enq = s.enq || [];
    const enqNewAll = enq.filter((e: EnquiryRow) => String(e.status) === 'new').length;
    const partAll = enq.filter((e: EnquiryRow) => String(e.type) === 'tesh' || String(e.type) === 'partner' || String(e.type) === 'partnership');
    const partNew = partAll.filter((e) => String(e.status) === 'new').length;

    const progs = s.programmes || [];
    const progDrafts = (['3m', '6m', '12m'] as const).filter((k) => s.prst[k] !== 'pub').length;
    const annDrafts = (s.ann || []).filter((a: AnnouncementRow) => a.status === 'draft').length;
    const drafts = draftN + revN + (s.carSt !== 'pub' ? 1 : 0) + progDrafts + annDrafts;

    const mix = {
      pub: 'width:' + (total > 0 ? pubN / total * 100 : 0) + '%;background:#2f6b50;',
      draft: 'width:' + (total > 0 ? draftN / total * 100 : 0) + '%;background:#c5a15a;',
      rev: 'width:' + (total > 0 ? revN / total * 100 : 0) + '%;background:#1f4a6b;',
      label: total + ' pages published with no pending changes, ' + draftN + ' with draft changes, ' + revN + ' in review',
    };

    const navCls = !denied && !s.loading ? 'nav on' : 'nav';
    const navAc = !denied && !s.loading ? 'nav-ac on' : 'nav-ac';
    const go = {
      dashboard: () => self.go('dashboard'),
      pages: () => self.go('pages'),
      pageEdit: (p: string) => self.go('pageEdit', { pageId: p }),
      carousel: () => self.go('carousel'),
      media: () => self.go('media'),
      programmes: () => self.go('programmes'),
      announcements: () => self.go('announcements'),
      enquiries: (o?: any) => self.go('enquiries', o || {}),
      users: () => self.go('users'),
      activity: () => self.go('activity'),
      settings: () => self.go('settings'),
    };
    (go as any).enquiriesTesh = () => self.go('enquiries', { enqTab: 'tesh' });

    const pTabs = [['all', 'All pages'], ['pub', 'Published'], ['draft', 'Draft changes'], ['review', 'In review'], ['unpub', 'Unpublished']].map((t: string[]) => {
      const count = t[0] === 'all' ? pageRows.length : pageRows.filter((r) => r.stKey === t[0]).length;
      return { label: t[1], count: count, on: s.pFilter === t[0], cls: s.pFilter === t[0] ? 'tab on' : 'tab', pick: () => self.setState({ pFilter: t[0] }) };
    });
    const pRows = pageRows.filter((r) => s.pFilter === 'all' || r.stKey === s.pFilter);

    const meIni = me.name.split(' ').map((w) => w.charAt(0)).join('').toUpperCase();
    const showEnqCnt = this.allowed('enquiries', role) && enqNewAll > 0;
    const dlg: any = s.dlg;
    const rolesList = (['super', 'editor', 'enquiry'] as const).map((r) => ({
      label: roleLabels[r],
      on: role === r,
      cls: role === r ? 'mi on' : 'mi',
      pick: () => {
        self.setState({ role: r, prof: false });
        self.toast('Viewing as ' + roleLabels[r], 'Prototype only: see which sections and actions this role can use.');
      },
    }));

    const pid = s.pageId;
    const secList = sections;
    const curSec = secList.find((x: SectionRow) => x.id === s.secId) || secList[0];
    const secs = sections.map((x) => ({
      id: x.id,
      name: x.name,
      title: x.title,
      hidden: !!s.hidden[pid + '.' + x.id],
      pick: () => self.setState({ secId: x.id }),
      toggle: () => {
        const h = Object.assign({}, s.hidden);
        h[pid + '.' + x.id] = !h[pid + '.' + x.id];
        self.setState({ hidden: h, dirty: self.markDirty(pid) });
      },
    }));
    const pg = pageRows.find((p) => p.id === pid) || pageRows[0];

    return {
      appCls: 'app' + (s.nav ? ' nav-open' : ''),
      navOpen: s.nav,
      toggleNav: () => self.setState({ nav: !s.nav }),
      closeNav: () => self.setState({ nav: false }),
      nc: navCls,
      nac: navAc,
      go: go,
      enquiriesTesh: (go as any).enquiriesTesh,
      role: role,
      me: me,
      prof: s.prof,
      toggleProf: () => self.setState({ prof: !s.prof }),
      roles: rolesList,
      showEnqCnt: showEnqCnt,
      enqNewAll: enqNewAll,
      enqCntLabel: enqNewAll + ' new enquiries',
      bellLabel: this.allowed('enquiries', role) ? 'Notifications: ' + enqNewAll + ' new enquiries' : 'Notifications',
      askLogout: () => self.confirm({ title: 'Sign out?', body: 'You\'ll need your password and two-step code to sign in again. Unsaved changes on this device will be lost.', ok: 'Sign out', href: '/admin/signed-out', warn: true }),
      q: s.q,
      onQ: (e: any) => self.setState({ q: e.target.value }),
      hasQ: s.q.length >= 2,
      sres: [],
      noRes: s.q.length >= 2 && false,
      denied: denied,
      deniedView: (VIEW_NAMES as Record<string, string>)[s.view] || s.view,
      showLoading: !denied && s.loading,
      isDash: is('dashboard'),
      isPages: is('pages'),
      isEdit: is('pageEdit'),
      isCar: is('carousel'),
      isMedia: is('media'),
      isProg: is('programmes'),
      isAnn: is('announcements'),
      isEnq: is('enquiries'),
      isUsers: is('users'),
      isAct: is('activity'),
      isSet: is('settings'),
      st: s.pstat[pid],
      mix: mix,
      dPages: pageRows,
      recent: [],
      recentEdits: [],
      openSitePreview: () => self.setState({ pageId: 'home', dlg: { kind: 'preview' } }),
      pTabs: pTabs,
      pRows: pRows,
      pEmpty: pRows.length === 0,
      pg: pg,
      secs: secs,
      cur: curSec,
      f: {},
      imgs: [],
      pvCur: { name: curSec?.name || '', hasCta: false, hasImgs: false, imgCount: '', isCarousel: false, isHidden: false },
      pvAll: [],
      dev: {
        isD: s.device === 'desktop',
        isM: s.device !== 'desktop',
        dCls: s.device === 'desktop' ? 'on' : '',
        mCls: s.device === 'desktop' ? '' : 'on',
        setD: () => self.setState({ device: 'desktop' }),
        setM: () => self.setState({ device: 'mobile' }),
      },
      pvState: 'Draft, not yet live',
      saveDraft: () => {
        const ps = Object.assign({}, s.pstat);
        if (ps[pid] === 'pub') ps[pid] = 'draft';
        const dd = Object.assign({}, s.dirty);
        dd[pid] = false;
        self.setState({ pstat: ps, dirty: dd });
        self.toast('Draft saved (simulated)', 'In the real system the draft is stored on the server. The live page is unchanged until you publish.');
      },
      previewPage: () => self.setState({ dlg: { kind: 'preview' } }),
      askPublish: () => self.confirm({ title: 'Publish ' + (pg?.name || 'Page'), body: 'Your changes will replace the live page on the public website. The current live version stays in the version history and can be restored.', ok: 'Publish now', act: 'publishPage', ackLabel: 'I have previewed the changes on desktop and mobile', needAck: true }),
      askUnpublish: () => self.confirm({ title: 'Unpublish ' + (pg?.name || 'Page'), body: 'The page will disappear from the website and its menu links will be hidden. Visitors who open the address will see a "page not available" notice. You can republish it at any time.', ok: 'Unpublish page', danger: true, act: 'unpublishPage' }),
      askRepublish: () => self.confirm({ title: 'Republish ' + (pg?.name || 'Page'), body: 'The page will be visible on the website again.', ok: 'Republish', act: 'republishPage' }),
      askDiscard: () => self.confirm({ title: 'Discard unsaved changes?', body: 'Edits made since your last saved draft will be lost.', ok: 'Discard changes', danger: true, act: 'discard' }),
      histOpen: () => self.setState({ hist: true }),
      closeHist: () => self.setState({ hist: false }),
      versions: [],
      cmp: null,
      crop: s.crop || {},
      pick: null,
      slides: s.slides || [],
      sl: null,
      car: null,
      saveCar: () => self.setState({ carDirty: false, carSt: s.carSt === 'pub' ? 'pub' : 'draft' }),
      askPublishCar: () => self.confirm({ title: 'Publish carousel', body: 'This will publish the homepage carousel and make all enabled slides live on the Home page.', ok: 'Publish carousel', act: 'publishCar' }),
      closeToast: () => self.setState({ toast: null }),
      hasToast: !!s.toast,
      toast: s.toast || {},
      toastCls: s.toast && s.toast[2] === 'err' ? 'toast err' : 'toast',
      set: s.set || {},
      setActions: {
        toggle2fa: () => self.setState({ set: Object.assign({}, s.set, { req2fa: !s.set.req2fa }) }),
        timeout: (e: any) => self.setState({ set: Object.assign({}, s.set, { timeout: e.target.value }) }),
        invite: (e: any) => self.setState({ set: Object.assign({}, s.set, { invite: e.target.value }) }),
        domains: (e: any) => self.setState({ set: Object.assign({}, s.set, { domains: e.target.value }) }),
        saveSet: () => { self.toast('Security settings saved (simulated)', 'In the real system these rules are enforced by the server for every admin.'); },
      },
      s: s,
      roleLabels: roleLabels,
      pages: pageRows,
      total: total,
      pubN: pubN,
      draftN: draftN,
      revN: revN,
      unpubN: unpubN,
      progs: progs,
      progDrafts: progDrafts,
      annDrafts: annDrafts,
      enq: enq,
      sections: sections,
      pid: pid,
      mView: s.mView || '',
      mCat: s.mCat || '',
      mQ: s.mQ || '',
      mSel: s.mSel || null,
      upl: s.upl || {},
      hot: s.hot || false,
      progId: s.progId || '',
      progTab: s.progTab || 'grid',
      pedits: s.pedits || [],
      prst: s.prst || {},
      prDirty: s.prDirty || {},
      ann: s.ann || [],
      annId: s.annId || '',
      annEdits: s.annEdits || {},
      annErr: s.annErr || '',
      enqTab: s.enqTab || 'all',
      enqSt: s.enqSt || 'all',
      enqQ: s.enqQ || '',
      enqSel: s.enqSel || null,
      note: s.note || '',
      users: s.users || [],
      invitations: s.invitations || [],
      invEmail: s.invEmail || '',
      invRole: s.invRole || 'editor',
      invErr: s.invErr || '',
      ex: s.ex || null,
      aRows: s.aRows || [],
      aType: s.aType || 'all',
      aQ: s.aQ || '',
      aNone: s.aNone || false,
      activity: s.activity || [],
      pickKey: s.pickKey || '',
carSel: s.carSel,
  carEdits: s.carEdits || {},
  carOrder: s.carOrder || [],
  carMoving: s.carMoving || false,
    };
  }

  render() {
    const $v = this.renderVals();
    const s = this.state;
    const is = (v: string) => this.allowed(s.view, s.role) && s.view === v;
    return (
      <div className={"app" + (s.nav ? " nav-open" : "")}>
        <aside className={"side"} aria-label="Admin navigation">
          <a className={"brand"} href={"/admin"}>
            <img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam"} width={"40"} height={"38"} />
            <div>
              <b>Chaitanya Keralam</b>
              <span>Admin Portal</span>
            </div>
          </a>

          <div className={"nav-g"}>Manage</div>
          {this.allowed('dashboard', s.role) && (
            <button className={"nav-i" + ($v.isDash ? " on" : "")} onClick={$v.go.dashboard}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
              <span>Dashboard</span>
            </button>
          )}
          {this.allowed('pages', s.role) && (
            <button className={"nav-i" + ($v.isPages ? " on" : "")} onClick={$v.go.pages}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>Pages</span>
            </button>
          )}
          {this.allowed('carousel', s.role) && (
            <button className={"nav-i" + ($v.isCar ? " on" : "")} onClick={$v.go.carousel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="14" x="3" y="5" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
              <span>Carousel</span>
            </button>
          )}
          {this.allowed('media', s.role) && (
            <button className={"nav-i" + ($v.isMedia ? " on" : "")} onClick={$v.go.media}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m2 15 3-3 3 3"></path><path d="m5 12v9"></path></svg>
              <span>Media</span>
            </button>
          )}

          <div className={"nav-g"}>Audience</div>
          {this.allowed('enquiries', s.role) && (
            <button className={"nav-i" + ($v.isEnq ? " on" : "")} onClick={$v.go.enquiries}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              <span>Enquiries</span>
              {$v.enqNewAll > 0 && <span className={"cnt"}>{$v.enqNewAll}</span>}
            </button>
          )}
          {this.allowed('users', s.role) && (
            <button className={"nav-i" + ($v.isUsers ? " on" : "")} onClick={$v.go.users}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Users &amp; roles</span>
            </button>
          )}

          <div className={"nav-g"}>Publish</div>
          {this.allowed('programmes', s.role) && (
            <button className={"nav-i" + ($v.isProg ? " on" : "")} onClick={$v.go.programmes}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              <span>Programmes</span>
            </button>
          )}
          {this.allowed('announcements', s.role) && (
            <button className={"nav-i" + ($v.isAnn ? " on" : "")} onClick={$v.go.announcements}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
              <span>Announcements</span>
            </button>
          )}
          {this.allowed('activity', s.role) && (
            <button className={"nav-i" + ($v.isAct ? " on" : "")} onClick={$v.go.activity}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Activity log</span>
            </button>
          )}

          <div className={"nav-g"}>System</div>
          {this.allowed('settings', s.role) && (
            <button className={"nav-i" + ($v.isSet ? " on" : "")} onClick={$v.go.settings}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>Settings</span>
            </button>
          )}

          <div className={"side-foot"}>
            <div>
              <b style={css("color: #fff;")}>{$v.me.name}</b>
              <div style={css("color: #a9c2b4; font-size: 11px;")}>{ROLE_LABELS[s.role] || s.role}</div>
            </div>
            <a href={"/"} target={"_blank"} rel={"noreferrer"} style={css("color: #c5a15a; text-decoration: none; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;")}>
              <span>Public website</span>
              <span>↗</span>
            </a>
          </div>
        </aside>

        <div className={"main"}>
          <header className={"top"}>
            <button className={"ib menu-btn"} onClick={$v.toggleNav} aria-label="Toggle navigation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className={"crumb"}>
              <button onClick={$v.go.dashboard}>Admin</button>
              <span>/</span>
              <span>{(VIEW_NAMES[s.view] || s.view)}</span>
            </div>
            <div className={"top-r"}>
              <a href={"/"} target={"_blank"} rel={"noreferrer"} className={"btn sm q"}>View live site ↗</a>
              <div className={"prof"}>
                <span className={"av"}>{$v.me.name.charAt(0)}</span>
                <div className={"prof-t"}>
                  <b>{$v.me.name}</b>
                  <span>{ROLE_LABELS[s.role] || s.role}</span>
                </div>
              </div>
              <a href={"/admin/signed-out"} className={"ib bd sm"} title="Sign out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </a>
            </div>
          </header>

          <main className={"content"}>
            {s.loading && <div className={"empty"}><b>Loading admin data…</b></div>}
            {!s.loading && !this.allowed(s.view, s.role) && (
              <div className={"empty"}>
                <div className={"eic"}>🔒</div>
                <b>You don't have access to {(VIEW_NAMES as any)[s.view] || 'this section'}.</b>
                <p className={"small muted"}>Ask a Super Admin to change your role.</p>
              </div>
            )}
            {/*
              Dashboard overview
            */}
            {is('dashboard') && (
              <div className={"stack"} style={css("gap: 24px;")}>
                <div className={"ph"}>
                  <div className={"ph-t"}>
                    <p className={"eyb"}>Overview</p>
                    <h1 className={"h1"}>Administration Dashboard</h1>
                    <p className={"sub"}>Welcome back, {$v.me.name}. Here is a summary of your website contents and audience enquiries.</p>
                  </div>
                  <div className={"acts"}>
                    <button className={"btn"} onClick={$v.go.pages}>Manage Pages</button>
                    <button className={"btn pri"} onClick={$v.go.enquiries}>View Enquiries ({$v.enqNewAll})</button>
                  </div>
                </div>

                <div className={"stats"}>
                  <div className={"stat"} onClick={$v.go.pages}>
                    <span className={"k"}><span className={"ic"}>📄</span> Total Pages</span>
                    <span className={"v"}>{$v.total}</span>
                    <span className={"s"}>{$v.pubN} live · {$v.draftN} draft · {$v.revN} review</span>
                  </div>
                  <div className={"stat alert"} onClick={$v.go.enquiries}>
                    <span className={"k"}><span className={"ic"}>✉️</span> New Enquiries</span>
                    <span className={"v"}>{$v.enqNewAll}</span>
                    <span className={"s"}>{$v.enqNewAll === 1 ? 'Needs reply' : 'Needing replies'}</span>
                  </div>
                  <div className={"stat"} onClick={$v.go.programmes}>
                    <span className={"k"}><span className={"ic"}>🎓</span> Programmes</span>
                    <span className={"v"}>{$v.progs.length}</span>
                    <span className={"s"}>{$v.progDrafts} drafts in progress</span>
                  </div>
                  <div className={"stat"} onClick={$v.go.announcements}>
                    <span className={"k"}><span className={"ic"}>📢</span> Announcements</span>
                    <span className={"v"}>{$v.ann ? $v.ann.length : 0}</span>
                    <span className={"s"}>{$v.annDrafts} draft items</span>
                  </div>
                </div>

                <div className={"grid2"}>
                  <div className={"card"}>
                    <div className={"card-h"}>
                      <h2 className={"h2"}>Quick Actions</h2>
                    </div>
                    <div className={"qa"}>
                      <button onClick={$v.go.pages}><span>📄</span> Edit Site Pages</button>
                      <button onClick={$v.go.enquiries}><span>✉️</span> Respond to Inquiries</button>
                      <button onClick={$v.go.programmes}><span>🎓</span> Update Programmes</button>
                      <button onClick={$v.go.media}><span>🖼️</span> Upload Media Files</button>
                    </div>
                  </div>

                  <div className={"card"}>
                    <div className={"card-h"}>
                      <h2 className={"h2"}>Publishing Mix</h2>
                    </div>
                    <div className={"card-b"}>
                      <p className={"small muted"} style={css("margin-bottom: 12px;")}>{$v.mix.label}</p>
                      <div className={"bar"}>
                        <i style={css($v.mix.pub)}></i>
                        <i style={css($v.mix.draft)}></i>
                        <i style={css($v.mix.rev)}></i>
                      </div>
                      <div className={"legend"} style={css("margin-top: 14px;")}>
                        <span><i style={css("background: #2f6b50;")}></i> Published ({$v.pubN})</span>
                        <span><i style={css("background: #c5a15a;")}></i> Draft ({$v.draftN})</span>
                        <span><i style={css("background: #1f4a6b;")}></i> Review ({$v.revN})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={"card"}>
                  <div className={"card-h"}>
                    <div>
                      <h2 className={"h2"}>All Website Pages ({$v.pages.length})</h2>
                      <p className={"small muted"}>Manage content, sections, and publication status for all pages on the site.</p>
                    </div>
                    <button className={"btn sm"} onClick={$v.go.pages}>View Full Page Manager →</button>
                  </div>
                  <div className={"tw"}>
                    <div className={"tbl"} style={css("--cols: 2.5fr 2fr 1fr 1.5fr auto; --minw: 700px;")}>
                      <div className={"tr th"}>
                        <div className={"td"}>Page Name</div>
                        <div className={"td"}>Public URL</div>
                        <div className={"td"}>Status</div>
                        <div className={"td"}>Last Updated</div>
                        <div className={"td"} style={css("text-align: right;")}>Actions</div>
                      </div>
                      {$v.pages.map((p) => {
                        const isPub = p.stKey === 'pub';
                        const isDraft = p.stKey === 'draft';
                        const stClass = isPub ? 'st-pub' : isDraft ? 'st-draft' : 'st-unpub';
                        return (
                          <div key={p.id} className={"tr"}>
                            <div className={"td"}>
                              <span className={"t-main"}>{p.name}</span>
                            </div>
                            <div className={"td"}>
                              <a href={p.path} target={"_blank"} rel={"noreferrer"} style={css("color: #2f6b50; text-decoration: none; font-size: 13px; font-family: monospace;")}>
                                {p.path} ↗
                              </a>
                            </div>
                            <div className={"td"}>
                              <span className={"st " + stClass}>{p.stLabel}</span>
                            </div>
                            <div className={"td"}>
                              <span className={"t-sub"}>{p.updatedAt}</span>
                            </div>
                            <div className={"td"} style={css("text-align: right; display: flex; gap: 6px; justify-content: flex-end;")}>
                              <button className={"btn sm"} onClick={() => $v.go.pageEdit(p.id)}>Edit</button>
                              <a href={p.path} target={"_blank"} rel={"noreferrer"} className={"btn sm q"}>Preview</a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*
              Pages Manager
            */}
            {is('pages') && (
              <div className={"stack"} style={css("gap: 20px;")}>
                <div className={"ph"}>
                  <div className={"ph-t"}>
                    <p className={"eyb"}>Content</p>
                    <h1 className={"h1"}>Website Pages ({$v.pages.length})</h1>
                    <p className={"sub"}>Manage pages, page metadata, section content, and visibility on the public site.</p>
                  </div>
                  <div className={"acts"}>
                    <button className={"btn"} onClick={$v.go.dashboard}>← Back to Dashboard</button>
                    <a href={"/"} target={"_blank"} rel={"noreferrer"} className={"btn pri"}>Visit Website ↗</a>
                  </div>
                </div>

                <div className={"tabs"}>
                  {$v.pTabs.map((t) => (
                    <button key={t.label} className={t.cls} onClick={t.pick}>
                      {t.label} {t.count > 0 && <span style={css("opacity: 0.7; font-size: 12px;")}>({t.count})</span>}
                    </button>
                  ))}
                </div>

                <div className={"card"}>
                  <div className={"tw"}>
                    <div className={"tbl"} style={css("--cols: 2.5fr 2fr 1.2fr 1.5fr auto; --minw: 750px;")}>
                      <div className={"tr th"}>
                        <div className={"td"}>Page Name &amp; Key</div>
                        <div className={"td"}>Live Route</div>
                        <div className={"td"}>Publication Status</div>
                        <div className={"td"}>Last Editor</div>
                        <div className={"td"} style={css("text-align: right;")}>Actions</div>
                      </div>
                      {$v.pRows.map((p) => {
                        const isPub = p.stKey === 'pub';
                        const isDraft = p.stKey === 'draft';
                        const stClass = isPub ? 'st-pub' : isDraft ? 'st-draft' : 'st-unpub';
                        return (
                          <div key={p.id} className={"tr"}>
                            <div className={"td"}>
                              <div className={"t-main"}>{p.name}</div>
                              <span className={"t-sub"} style={css("font-family: monospace; font-size: 11px;")}>id: {p.id}</span>
                            </div>
                            <div className={"td"}>
                              <a href={p.path} target={"_blank"} rel={"noreferrer"} style={css("color: #2f6b50; text-decoration: underline; font-family: monospace; font-size: 13px;")}>
                                {p.path}
                              </a>
                            </div>
                            <div className={"td"}>
                              <span className={"st " + stClass}>{p.stLabel}</span>
                            </div>
                            <div className={"td"}>
                              <span className={"t-sub"}>Super Admin</span>
                            </div>
                            <div className={"td"} style={css("text-align: right; display: flex; gap: 6px; justify-content: flex-end;")}>
                              <button className={"btn sm pri"} onClick={() => $v.go.pageEdit(p.id)}>Edit Page</button>
                              <a href={p.path} target={"_blank"} rel={"noreferrer"} className={"btn sm"}>View Live ↗</a>
                              {p.canUnpub && <button className={"btn sm q"} onClick={$v.askUnpublish}>Unpublish</button>}
                            </div>
                          </div>
                        );
                      })}
                      {$v.pRows.length === 0 && (
                        <div className={"empty"}>
                          <b>No pages match the selected filter.</b>
                          <p>Click "All pages" to view the full list.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page editor */}
            {is('pageEdit') && this.renderPageEditor()}

            {/* Carousel */}
            {is('carousel') && this.renderCarousel()}

            {/* Media Library */}
            {is('media') && (() => {
              const categories = ['All', 'Nature', 'Culture', 'Heritage', 'Hospitality', 'Youth'];
              const selCat = (s.mCat || 'All').toLowerCase();
              const filteredMedia = (s.media || []).filter((m: MediaRow) => {
                const matchCat = selCat === 'all' || (m.category && m.category.toLowerCase() === selCat);
                const q = (s.mQ || '').trim().toLowerCase();
                const matchQ = !q || (m.filename && m.filename.toLowerCase().includes(q)) || (m.alt && m.alt.toLowerCase().includes(q)) || (m.credit && m.credit.toLowerCase().includes(q));
                return matchCat && matchQ;
              });

              const selectedMedia = s.mSel ? (s.media || []).find((m: MediaRow) => m.id === s.mSel) : null;
              const formatSize = (bytes: number) => {
                if (!bytes) return '0 KB';
                if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
              };

              const getPublicUrl = (path: string) => {
                const base = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwhatknkdcffxpezkage.supabase.co';
                return `${base}/storage/v1/object/public/site-media/${path}`;
              };

              const handleDrop = async (e: React.DragEvent) => {
                e.preventDefault();
                this.setState({ hot: false });
                Array.from(e.dataTransfer.files || []).forEach((f) => this.uploadSingleFile(f));
              };

              const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
                Array.from(e.target.files || []).forEach((f) => this.uploadSingleFile(f));
                e.target.value = '';
              };

              return (
                <div className={"stack"} style={css("gap: 20px;")}>
                  <div className={"ph"}>
                    <div className={"ph-t"}>
                      <p className={"eyb"}>Assets &amp; Storage</p>
                      <h1 className={"h1"}>Media Library ({s.media?.length || 0})</h1>
                      <p className={"sub"}>Upload and manage photography, campus shots, banners, and heritage visuals for public pages.</p>
                    </div>
                    <div className={"acts"}>
                      <label className={"btn pri"} style={css("cursor: pointer;")}>
                        <span>↑ Upload New Image</span>
                        <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} style={css("display: none;")} />
                      </label>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    className={"drop-z" + (s.hot ? " hot" : "")}
                    onDragOver={(e) => { e.preventDefault(); this.setState({ hot: true }); }}
                    onDragLeave={(e) => { e.preventDefault(); this.setState({ hot: false }); }}
                    onDrop={handleDrop}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={css("color: var(--forest); opacity: 0.8;")}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <div>
                      <b style={css("display: block; font-size: 15px;")}>Drag &amp; drop images here to upload</b>
                      <span className={"muted small"}>Accepts JPG, PNG, WebP up to 5 MB per file.</span>
                    </div>
                    <label className={"btn sm"} style={css("cursor: pointer; margin-left: 12px;")}>
                      <span>Browse Files</span>
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} style={css("display: none;")} />
                    </label>
                  </div>

                  {/* Filter Toolbar */}
                  <div className={"mtool"}>
                    <div className={"tabs"}>
                      {categories.map((cat) => {
                        const isCatOn = selCat === cat.toLowerCase();
                        const count = cat === 'All'
                          ? (s.media || []).length
                          : (s.media || []).filter((m: MediaRow) => m.category && m.category.toLowerCase() === cat.toLowerCase()).length;
                        return (
                          <button
                            key={cat}
                            className={"tab" + (isCatOn ? " on" : "")}
                            onClick={() => this.setState({ mCat: cat })}
                          >
                            <span>{cat}</span>
                            <span className={"cnt"}>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={css("display: flex; gap: 8px; align-items: center;")}>
                      <input
                        type="text"
                        placeholder="Search media by filename, alt..."
                        className={"inp"}
                        style={css("max-width: 260px; height: 36px; font-size: 13px;")}
                        value={s.mQ || ''}
                        onChange={(e) => this.setState({ mQ: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Grid of Media Cards */}
                  {filteredMedia.length > 0 ? (
                    <div className={"mgrid"}>
                      {filteredMedia.map((m: MediaRow) => {
                        const isSel = s.mSel === m.id;
                        const pubUrl = getPublicUrl(m.path);
                        return (
                          <div
                            key={m.id}
                            className={"mcard" + (isSel ? " on" : "")}
                            onClick={() => this.setState({
                              mSel: m.id,
                              mEdits: { alt: m.alt || '', credit: m.credit || '', category: m.category || 'Nature' }
                            })}
                          >
                            <div className={"thumb"}>
                              <img src={pubUrl} alt={m.alt || m.filename} loading="lazy" />
                              <span className={"tlab"}>{m.category || 'General'}</span>
                            </div>
                            <div className={"mb"}>
                              <b title={m.filename}>{m.filename}</b>
                              <span>
                                {formatSize(m.size_bytes)} · {m.mime_type?.replace('image/', '').toUpperCase()}
                                {(m as any).width && (m as any).height ? ` · ${(m as any).width}×${(m as any).height}` : ''}
                              </span>
                              <button
                                className={"btn sm"}
                                style={css("margin-top: 6px;")}
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  navigator.clipboard.writeText(pubUrl);
                                  this.toast('Public URL copied');
                                }}
                              >
                                Copy URL
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={"card"}>
                      <div className={"empty"}>
                        <div className={"eic"}>🖼️</div>
                        <b>No media found</b>
                        <p className={"small muted"}>No media assets found matching the selected category or search filter.</p>
                      </div>
                    </div>
                  )}

                  {/* Media Details Drawer */}
                  {selectedMedia && (
                    <div className={"scrim"} onClick={() => this.setState({ mSel: null })}>
                      <div className={"drawer"} onClick={(e) => e.stopPropagation()}>
                        <div className={"drawer-h"}>
                          <div>
                            <h2 className={"h2"} style={css("font-size: 17px;")}>Media Details</h2>
                            <p className={"small muted"}>{selectedMedia.filename}</p>
                          </div>
                          <button
                            className={"ib sm"}
                            onClick={() => this.setState({ mSel: null })}
                            aria-label="Close drawer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className={"drawer-b"}>
                          <div style={css("border-radius: 8px; overflow: hidden; border: 1px solid var(--line); background: var(--ivory); max-height: 260px; display: flex; align-items: center; justify-content: center;")}>
                            <img
                              src={getPublicUrl(selectedMedia.path)}
                              alt={selectedMedia.alt}
                              style={css("max-width: 100%; max-height: 260px; object-fit: contain;")}
                            />
                          </div>

                          <div className={"fld"}>
                            <label>Public Storage URL</label>
                            <div style={css("display: flex; gap: 6px;")}>
                              <input
                                type="text"
                                readOnly
                                className={"inp"}
                                value={getPublicUrl(selectedMedia.path)}
                                style={css("font-family: monospace; font-size: 12px;")}
                              />
                              <button
                                className={"btn sm"}
                                onClick={() => {
                                  navigator.clipboard.writeText(getPublicUrl(selectedMedia.path));
                                  this.toast('Copied public URL to clipboard');
                                }}
                              >
                                Copy
                              </button>
                            </div>
                          </div>

                          <div className={"fld"}>
                            <label>Category</label>
                            <select
                              className={"inp"}
                              value={((s.mEdits as any)?.category != null ? (s.mEdits as any).category : selectedMedia.category) || 'General'}
                              onChange={(e) => this.setState({
                                mEdits: { ...s.mEdits, category: e.target.value }
                              })}
                            >
                              <option value="Nature">Nature</option>
                              <option value="Culture">Culture</option>
                              <option value="Heritage">Heritage</option>
                              <option value="Hospitality">Hospitality</option>
                              <option value="Youth">Youth</option>
                              <option value="General">General</option>
                            </select>
                          </div>

                          <div className={"fld"}>
                            <label>Alt Text (Accessibility &amp; SEO)</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={((s.mEdits as any)?.alt != null ? (s.mEdits as any).alt : selectedMedia.alt) || ''}
                              placeholder="Descriptive text for visually impaired readers"
                              onChange={(e) => this.setState({
                                mEdits: { ...s.mEdits, alt: e.target.value }
                              })}
                            />
                          </div>

                          <div className={"fld"}>
                            <label>Photo Credit / Source</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={((s.mEdits as any)?.credit != null ? (s.mEdits as any).credit : selectedMedia.credit) || ''}
                              placeholder="e.g. Chaitanya Keralam Archive / Joel"
                              onChange={(e) => this.setState({
                                mEdits: { ...s.mEdits, credit: e.target.value }
                              })}
                            />
                          </div>

                          <div className={"card"} style={css("background: var(--ivory); padding: 12px 14px;")}>
                            <dl className={"kv"}>
                              <dt>File Size:</dt>
                              <dd>{formatSize(selectedMedia.size_bytes)}</dd>
                              <dt>Format:</dt>
                              <dd>{selectedMedia.mime_type}</dd>
                              <dt>Uploaded by:</dt>
                              <dd>{selectedMedia.created_by || 'Admin'}</dd>
                              <dt>Uploaded at:</dt>
                              <dd>{new Date(selectedMedia.created_at).toLocaleString()}</dd>
                            </dl>
                          </div>
                        </div>
                        <div className={"drawer-f"}>
                          <button
                            className={"btn danger"}
                            onClick={() => {
                              this.confirm({
                                title: `Delete "${selectedMedia.filename}"?`,
                                body: 'This file will be permanently removed from Supabase storage. If it is in use by a page or carousel slide, the deletion will be rejected.',
                                ok: 'Delete Image',
                                danger: true,
                                act: `deleteMedia_${selectedMedia.id}`
                              });
                            }}
                          >
                            Delete File
                          </button>
                          <button
                            className={"btn pri"}
                            onClick={async () => {
                              const alt = ((s.mEdits as any)?.alt != null ? (s.mEdits as any).alt : selectedMedia.alt) || '';
                              const credit = ((s.mEdits as any)?.credit != null ? (s.mEdits as any).credit : selectedMedia.credit) || '';
                              const category = ((s.mEdits as any)?.category != null ? (s.mEdits as any).category : selectedMedia.category) || 'General';
                              const res = await saveMediaMetaAction({ id: selectedMedia.id, alt, credit, category });
                              if (res.success) {
                                const updatedMedia = (s.media || []).map((m: MediaRow) => m.id === selectedMedia.id ? { ...m, alt, credit, category } : m);
                                this.setState({ media: updatedMedia });
                                this.toast('Media details saved successfully');
                              } else {
                                this.toast('Failed to save: ' + (res.error || 'Unknown error'), '', 'err');
                              }
                            }}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Programmes */}
            {is('programmes') && (() => {
              const currentRole = $v.role || s.role;
              const currentId = s.progId || '3m';
              const progDefs = [
                { id: '3m', name: '3-Month Foundation', badge: '3M', hours: '240 training hours', level: 'Foundation' },
                { id: '6m', name: '6-Month Professional', badge: '6M', hours: '480 training hours', level: 'Professional' },
                { id: '12m', name: '1-Year Advanced', badge: '1Y', hours: '960 training hours', level: 'Advanced' },
              ];
              const dbProg = (s.programmes || []).find((p: ProgrammeRow) => p.id === currentId);
              const pEdits = (s.pedits as Record<string, any>)[currentId] || {};
              const curStatus: PublishStatus = (s.prst && s.prst[currentId]) || (dbProg?.status as PublishStatus) || 'pub';
              const isDirty = !!(s.prDirty && s.prDirty[currentId]);

              // Form fields with fallback
              const fName = pEdits.name !== undefined ? pEdits.name : (dbProg?.name || (currentId === '3m' ? '3-Month Foundation Programme' : currentId === '6m' ? '6-Month Professional Programme' : '1-Year Advanced Programme'));
              const fTagline = pEdits.tagline !== undefined ? pEdits.tagline : (dbProg?.tagline || (currentId === '3m' ? 'Foundation Level' : currentId === '6m' ? 'Professional Level' : 'Advanced Level'));
              const fDuration = pEdits.duration !== undefined ? pEdits.duration : (dbProg?.duration || (currentId === '3m' ? '3 months · 4 hours a day, 5 days a week' : currentId === '6m' ? '6 months · 4 hours a day, 5 days a week' : '12 months · 4 hours a day, 5 days a week'));
              const fHours = pEdits.hours !== undefined ? pEdits.hours : (dbProg?.hours || (currentId === '3m' ? '240 training hours' : currentId === '6m' ? '480 training hours' : '960 training hours'));
              const fEligibility = pEdits.eligibility !== undefined ? pEdits.eligibility : (dbProg?.eligibility || (currentId === '12m' ? 'Graduates or completion of 6-Month Professional programme' : 'Plus Two / Higher Secondary or equivalent'));
              const fDescription = pEdits.description !== undefined ? pEdits.description : (dbProg?.description || 'Introduces comprehensive practical and foundational industry skills.');
              const fSummary = pEdits.summary !== undefined ? pEdits.summary : (dbProg?.summary || 'Outcome: practical competence and industry-aligned experiential capabilities.');
              
              // Structured JSON arrays or strings
              const fCurriculum = pEdits.curriculum !== undefined ? pEdits.curriculum : (
                Array.isArray(dbProg?.curriculum) && (dbProg?.curriculum as any[]).length > 0
                  ? (dbProg?.curriculum as any[]).map(c => typeof c === 'string' ? c : c.title || JSON.stringify(c)).join('\n')
                  : currentId === '3m'
                    ? 'Tourism & travel and eco-spiritual peace tourism\nHospitality and eco-hospitality\nBasic caregiving & patient assistance\nEntrepreneurship and personal leadership\nDigital skills & office productivity'
                    : currentId === '6m'
                      ? 'Eco-spiritual tourism, destination development and sustainable tourism\nTour and itinerary planning\nHospitality operations and international caregiving\nEntrepreneurship, business development and team leadership\nTESH Home practical residency'
                      : 'Tourism management, destination management and tour operations\nTourism experience design and advanced hospitality management\nEco-resort and wellness management; advanced caregiving\nEntrepreneurship, business management, financial skills and digital marketing\nLeadership, supervision and TESH Home administration'
              );

              const fProjects = pEdits.projects !== undefined ? pEdits.projects : (
                Array.isArray(dbProg?.projects) && (dbProg?.projects as any[]).length > 0
                  ? (dbProg?.projects as any[]).map(p => typeof p === 'string' ? p : p.name || JSON.stringify(p)).join('\n')
                  : currentId === '3m'
                    ? 'Local Heritage Trail Walkthrough & Guiding\nFront Desk Welcome & Hospitality Simulation\nElder Care Compassion & Vital Monitoring Workshop'
                    : currentId === '6m'
                      ? 'Community-Based Sustainable Tourism Package\nEco-Resort Service Standards & Food Safety Audit\nTESH Care Management Pilot Exercise'
                      : 'Destination Branding & Master Itinerary Launch\nHolistic Eco-Retreat Facility Business Plan\nFull-Scale Live Event & Guest Logistics Management'
              );

              // Fees Breakdown: Tuition, Lab & Practical, Materials, Certification
              const defaultFees = currentId === '3m'
                ? { tuition: '15,000', lab: '5,000', materials: '3,000', cert: '2,000', total: '25,000' }
                : currentId === '6m'
                  ? { tuition: '28,000', lab: '9,000', materials: '5,000', cert: '3,000', total: '45,000' }
                  : { tuition: '50,000', lab: '18,000', materials: '8,000', cert: '4,000', total: '80,000' };

              const fFees = pEdits.fees || (
                dbProg?.learning_areas && (dbProg.learning_areas as any).fees
                  ? (dbProg.learning_areas as any).fees
                  : defaultFees
              );

              const setField = (key: string, val: any) => {
                const currentEdits = (s.pedits as Record<string, any>)[currentId] || {};
                const nextEdits = {
                  ...s.pedits,
                  [currentId]: {
                    ...currentEdits,
                    [key]: val,
                  }
                };
                const nextDirty = {
                  ...s.prDirty,
                  [currentId]: true,
                };
                this.setState({ pedits: nextEdits, prDirty: nextDirty });
              };

              const setFeeField = (feeKey: string, val: string) => {
                const nextFees = { ...fFees, [feeKey]: val };
                // Calculate total automatically if numeric
                const t = (Number(nextFees.tuition.replace(/[^0-9]/g, '')) || 0) +
                          (Number(nextFees.lab.replace(/[^0-9]/g, '')) || 0) +
                          (Number(nextFees.materials.replace(/[^0-9]/g, '')) || 0) +
                          (Number(nextFees.cert.replace(/[^0-9]/g, '')) || 0);
                nextFees.total = t > 0 ? t.toLocaleString('en-IN') : nextFees.total;
                setField('fees', nextFees);
              };

              const handleSaveDraft = async () => {
                const curriculumArr = typeof fCurriculum === 'string' ? fCurriculum.split('\n').filter((l: string) => l.trim().length > 0) : fCurriculum;
                const projectsArr = typeof fProjects === 'string' ? fProjects.split('\n').filter((l: string) => l.trim().length > 0) : fProjects;
                
                const payload = {
                  id: currentId,
                  fields: {
                    name: fName,
                    tagline: fTagline,
                    duration: fDuration,
                    hours: fHours,
                    eligibility: fEligibility,
                    description: fDescription,
                    summary: fSummary,
                    curriculum: curriculumArr,
                    projects: projectsArr,
                    learning_areas: { fees: fFees },
                  }
                };

                const res = await updateProgrammeAction(payload);
                if (res.success) {
                  const updatedList = (s.programmes || []).map((p: ProgrammeRow) =>
                    p.id === currentId ? { ...p, ...payload.fields, status: 'draft' as PublishStatus } : p
                  );
                  const nextPrst = { ...s.prst, [currentId]: 'draft' as PublishStatus };
                  const nextDirty = { ...s.prDirty, [currentId]: false };
                  this.setState({ programmes: updatedList, prst: nextPrst, prDirty: nextDirty });
                  this.toast('Draft saved successfully', 'Programme changes saved as draft. Submit for review when ready.');
                } else {
                  this.toast('Failed to save draft: ' + (res.error || 'Unknown error'), '', 'err');
                }
              };

              const subTab = s.progTab || 'overview';

              return (
                <div style={css("display: flex; flex-direction: column; gap: 20px;")}>
                  {/* Top Bar with Programme Tabs & Status */}
                  <div className={"card"} style={css("padding: 16px 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px;")}>
                    <div style={css("display: flex; align-items: center; gap: 10px; flex-wrap: wrap;")}>
                      <span style={css("font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-right: 4px;")}>
                        Programmes:
                      </span>
                      {progDefs.map((def) => {
                        const isCurrent = currentId === def.id;
                        const st = (s.prst && s.prst[def.id]) || 'pub';
                        const dirty = !!(s.prDirty && s.prDirty[def.id]);
                        return (
                          <button
                            key={def.id}
                            onClick={() => this.setState({ progId: def.id })}
                            style={css(`
                              padding: 8px 14px;
                              border-radius: 8px;
                              border: 1px solid ${isCurrent ? 'var(--forest)' : 'var(--line)'};
                              background: ${isCurrent ? 'var(--forest)' : '#ffffff'};
                              color: ${isCurrent ? '#ffffff' : 'var(--ink)'};
                              cursor: pointer;
                              display: flex;
                              align-items: center;
                              gap: 8px;
                              font-weight: 500;
                              font-size: 14px;
                              transition: all 0.15s ease;
                            `)}
                          >
                            <span style={css(`
                              padding: 2px 6px;
                              border-radius: 4px;
                              font-size: 11px;
                              font-weight: 700;
                              background: ${isCurrent ? 'rgba(255,255,255,0.2)' : 'var(--ivory)'};
                              color: ${isCurrent ? '#ffffff' : 'var(--forest)'};
                            `)}>
                              {def.badge}
                            </span>
                            <span>{def.name}</span>
                            <span style={css(`
                              width: 8px;
                              height: 8px;
                              border-radius: 50%;
                              background: ${dirty ? '#c5a15a' : st === 'pub' ? '#2f6b50' : st === 'review' ? '#1f4a6b' : '#c5a15a'};
                            `)} title={`Status: ${dirty ? 'Unsaved edits' : st}`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Status badge & action buttons */}
                    <div style={css("display: flex; align-items: center; gap: 10px;")}>
                      <span className={`pill ${curStatus === 'pub' ? 'pub' : curStatus === 'review' ? 'rev' : 'draft'}`}>
                        {curStatus === 'pub' ? '● Published' : curStatus === 'review' ? '▲ In Review' : '✎ Draft'}
                      </span>
                      {isDirty && (
                        <span style={css("font-size: 12px; color: #c5a15a; font-weight: 600;")}>● Unsaved</span>
                      )}

                      {/* Workflow Actions */}
                      <button
                        className={"btn sm"}
                        onClick={handleSaveDraft}
                        style={css("font-weight: 500;")}
                      >
                        Save Draft
                      </button>

                      {curStatus === 'draft' && (
                        <button
                          className={"btn sm"}
                          onClick={() => {
                            this.confirm({
                              title: `Submit "${fName}" for Review?`,
                              body: 'This will change the programme status to Review and alert Super Admins for final sign-off and publishing.',
                              ok: 'Submit for Review',
                              act: 'submitForReview',
                            });
                          }}
                          style={css("background: #1f4a6b; color: #ffffff; border-color: #1f4a6b;")}
                        >
                          Submit for Review
                        </button>
                      )}

                      {/* Publish Programme: Super Admin only */}
                      {currentRole === 'super' ? (
                        <button
                          className={"btn sm pri"}
                          onClick={() => {
                            this.confirm({
                              title: `Publish "${fName}" Live?`,
                              body: 'Publishing will immediately update the live website programme page, comparison cards, and fees for all prospective students.',
                              ok: 'Publish Programme',
                              act: 'approveProg',
                            });
                          }}
                        >
                          Publish Programme
                        </button>
                      ) : (
                        curStatus === 'review' && (
                          <span style={css("font-size: 12px; color: var(--muted); font-style: italic;")}>
                            Awaiting Super Admin approval
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Inner Sub-navigation (Overview & Curriculum / Fees & Practical) */}
                  <div style={css("display: flex; border-bottom: 1px solid var(--line); gap: 20px; padding: 0 4px;")}>
                    <button
                      onClick={() => this.setState({ progTab: 'overview' })}
                      style={css(`
                        padding: 10px 4px;
                        border: none;
                        background: none;
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 600;
                        color: ${subTab === 'overview' ? 'var(--forest)' : 'var(--muted)'};
                        border-bottom: 2px solid ${subTab === 'overview' ? 'var(--forest)' : 'transparent'};
                        transition: all 0.15s ease;
                      `)}
                    >
                      Overview & Details
                    </button>
                    <button
                      onClick={() => this.setState({ progTab: 'curriculum' })}
                      style={css(`
                        padding: 10px 4px;
                        border: none;
                        background: none;
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 600;
                        color: ${subTab === 'curriculum' ? 'var(--forest)' : 'var(--muted)'};
                        border-bottom: 2px solid ${subTab === 'curriculum' ? 'var(--forest)' : 'transparent'};
                        transition: all 0.15s ease;
                      `)}
                    >
                      Curriculum & Practical Modules
                    </button>
                    <button
                      onClick={() => this.setState({ progTab: 'fees' })}
                      style={css(`
                        padding: 10px 4px;
                        border: none;
                        background: none;
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 600;
                        color: ${subTab === 'fees' ? 'var(--forest)' : 'var(--muted)'};
                        border-bottom: 2px solid ${subTab === 'fees' ? 'var(--forest)' : 'transparent'};
                        transition: all 0.15s ease;
                      `)}
                    >
                      Fee Breakdown & Eligibility
                    </button>
                  </div>

                  {/* TAB 1: Overview & Details */}
                  {subTab === 'overview' && (
                    <div className={"card"} style={css("padding: 24px; display: flex; flex-direction: column; gap: 18px;")}>
                      <div className={"grid2"}>
                        <div className={"fld"}>
                          <label>Programme Title</label>
                          <input
                            type="text"
                            className={"inp"}
                            value={fName}
                            onChange={(e) => setField('name', e.target.value)}
                            placeholder="e.g. 3-Month Foundation Programme"
                          />
                        </div>
                        <div className={"fld"}>
                          <label>Badge / Tagline</label>
                          <input
                            type="text"
                            className={"inp"}
                            value={fTagline}
                            onChange={(e) => setField('tagline', e.target.value)}
                            placeholder="e.g. Foundation Level"
                          />
                        </div>
                      </div>

                      <div className={"grid2"}>
                        <div className={"fld"}>
                          <label>Duration & Schedule</label>
                          <input
                            type="text"
                            className={"inp"}
                            value={fDuration}
                            onChange={(e) => setField('duration', e.target.value)}
                            placeholder="e.g. 3 months · 4 hours a day, 5 days a week"
                          />
                        </div>
                        <div className={"fld"}>
                          <label>Total Training Hours</label>
                          <input
                            type="text"
                            className={"inp"}
                            value={fHours}
                            onChange={(e) => setField('hours', e.target.value)}
                            placeholder="e.g. 240 training hours"
                          />
                        </div>
                      </div>

                      <div className={"fld"}>
                        <label>Programme Description</label>
                        <textarea
                          className={"inp"}
                          rows={3}
                          value={fDescription}
                          onChange={(e) => setField('description', e.target.value)}
                          placeholder="Summary of what makes this programme distinct..."
                        />
                      </div>

                      <div className={"fld"}>
                        <label>Career & Learning Outcome</label>
                        <textarea
                          className={"inp"}
                          rows={2}
                          value={fSummary}
                          onChange={(e) => setField('summary', e.target.value)}
                          placeholder="Key career progression and competency outcome..."
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Curriculum & Practical Modules */}
                  {subTab === 'curriculum' && (
                    <div className={"card"} style={css("padding: 24px; display: flex; flex-direction: column; gap: 20px;")}>
                      <div className={"fld"}>
                        <div style={css("display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;")}>
                          <label style={css("font-weight: 600;")}>Curriculum Modules (one per line)</label>
                          <span className={"small muted"}>Displays in curriculum syllabus & comparison cards</span>
                        </div>
                        <textarea
                          className={"inp"}
                          rows={6}
                          style={css("font-family: inherit; line-height: 1.6;")}
                          value={fCurriculum}
                          onChange={(e) => setField('curriculum', e.target.value)}
                          placeholder="Module 1&#10;Module 2&#10;Module 3..."
                        />
                      </div>

                      <div className={"fld"}>
                        <div style={css("display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;")}>
                          <label style={css("font-weight: 600;")}>Practical Projects & Industry Immersions (one per line)</label>
                          <span className={"small muted"}>Hands-on labs, field trips, residency simulations</span>
                        </div>
                        <textarea
                          className={"inp"}
                          rows={5}
                          style={css("font-family: inherit; line-height: 1.6;")}
                          value={fProjects}
                          onChange={(e) => setField('projects', e.target.value)}
                          placeholder="Project 1: Heritage Trail Execution&#10;Project 2: F&B Hospitality Audit..."
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Fee Breakdown & Eligibility */}
                  {subTab === 'fees' && (
                    <div style={css("display: flex; flex-direction: column; gap: 20px;")}>
                      <div className={"card"} style={css("padding: 24px;")}>
                        <h3 className={"h3"} style={css("margin-bottom: 6px; font-size: 16px;")}>Eligibility Criteria</h3>
                        <p className={"small muted"} style={css("margin-bottom: 14px;")}>Educational background and prior experience required for entry.</p>
                        <div className={"fld"}>
                          <input
                            type="text"
                            className={"inp"}
                            value={fEligibility}
                            onChange={(e) => setField('eligibility', e.target.value)}
                            placeholder="e.g. Plus Two / Higher Secondary or equivalent"
                          />
                        </div>
                      </div>

                      <div className={"card"} style={css("padding: 24px;")}>
                        <div style={css("display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;")}>
                          <div>
                            <h3 className={"h3"} style={css("margin-bottom: 4px; font-size: 16px;")}>Fee Breakdown Structure</h3>
                            <p className={"small muted"}>Itemised tuition, laboratory fees, study material, and assessment charges.</p>
                          </div>
                          <div style={css("text-align: right;")}>
                            <span className={"small muted"}>Total Estimated Fee:</span>
                            <div style={css("font-size: 20px; font-weight: 700; color: var(--forest);")}>
                              ₹{fFees.total || '0'}
                            </div>
                          </div>
                        </div>

                        <div className={"grid2"} style={css("gap: 16px;")}>
                          <div className={"fld"}>
                            <label>Tuition & Academic Instruction (₹)</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={fFees.tuition || ''}
                              onChange={(e) => setFeeField('tuition', e.target.value)}
                              placeholder="15,000"
                            />
                          </div>
                          <div className={"fld"}>
                            <label>Lab, Practical & Field Immersion (₹)</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={fFees.lab || ''}
                              onChange={(e) => setFeeField('lab', e.target.value)}
                              placeholder="5,000"
                            />
                          </div>
                          <div className={"fld"}>
                            <label>Training Materials & Uniform (₹)</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={fFees.materials || ''}
                              onChange={(e) => setFeeField('materials', e.target.value)}
                              placeholder="3,000"
                            />
                          </div>
                          <div className={"fld"}>
                            <label>Certification & Exam Fee (₹)</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={fFees.cert || ''}
                              onChange={(e) => setFeeField('cert', e.target.value)}
                              placeholder="2,000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Save Bar */}
                  <div style={css("display: flex; justify-content: flex-end; gap: 12px; margin-top: 4px;")}>
                    <button
                      className={"btn"}
                      onClick={handleSaveDraft}
                      disabled={!isDirty}
                      style={css(isDirty ? "font-weight: 600;" : "opacity: 0.6;")}
                    >
                      Save Draft
                    </button>
                    {curStatus === 'draft' && (
                      <button
                        className={"btn"}
                        onClick={() => {
                          this.confirm({
                            title: `Submit "${fName}" for Review?`,
                            body: 'This marks the draft ready for review by a Super Admin.',
                            ok: 'Submit for Review',
                            act: 'submitForReview',
                          });
                        }}
                        style={css("background: #1f4a6b; color: #ffffff; border-color: #1f4a6b;")}
                      >
                        Submit for Review
                      </button>
                    )}
                    {currentRole === 'super' && (
                      <button
                        className={"btn pri"}
                        onClick={() => {
                          this.confirm({
                            title: `Publish "${fName}" Live?`,
                            body: 'The live website will immediately reflect all saved and reviewed changes.',
                            ok: 'Publish Programme',
                            act: 'approveProg',
                          });
                        }}
                      >
                        Publish Programme
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Announcements */}
            {is('announcements') && (() => {
              const currentRole = $v.role || s.role;
              const annList = s.ann || [];
              const selectedAnn = s.annId === 'new'
                ? { id: '', title: '', body: '', category: 'Admissions', date: new Date().toISOString().split('T')[0], status: 'pub' as const, order_index: 0 }
                : annList.find((a: AnnouncementRow) => a.id === s.annId) || null;

              const edits = (s.annEdits as Record<string, any>) || {};

              // Parse body metadata if stored as JSON or fallback
              let parsedExpiry = '';
              let parsedPinned = false;
              let cleanBody = selectedAnn?.body || '';
              if (selectedAnn) {
                try {
                  if (cleanBody.startsWith('{') && cleanBody.endsWith('}')) {
                    const parsed = JSON.parse(cleanBody);
                    cleanBody = parsed.text || '';
                    parsedExpiry = parsed.expiry || '';
                    parsedPinned = !!parsed.pinned;
                  }
                } catch {
                  // normal text
                }
              }

              const fTitle = edits.title !== undefined ? edits.title : (selectedAnn?.title || '');
              const fBody = edits.body !== undefined ? edits.body : cleanBody;
              const fCategory = edits.category !== undefined ? edits.category : (selectedAnn?.category || 'Admissions');
              const fDate = edits.date !== undefined ? edits.date : (selectedAnn?.date || new Date().toISOString().split('T')[0]);
              const fStatus = edits.status !== undefined ? edits.status : (selectedAnn?.status || 'pub');
              const fPinned = edits.pinned !== undefined ? edits.pinned : (selectedAnn ? (selectedAnn.order_index === -1 || parsedPinned) : false);
              const fExpiry = edits.expiry !== undefined ? edits.expiry : parsedExpiry;

              const handleSaveAnnouncement = async () => {
                if (!fTitle.trim() || !fBody.trim()) {
                  this.toast('Title and body cannot be empty', '', 'err');
                  return;
                }

                // Pack pinned and expiry metadata into body payload safely
                const bodyPayload = JSON.stringify({
                  text: fBody.trim(),
                  pinned: fPinned,
                  expiry: fExpiry,
                });

                const payload = {
                  id: selectedAnn?.id || undefined,
                  title: fTitle.trim(),
                  date: fDate,
                  body: bodyPayload,
                  category: fCategory,
                  status: fStatus as 'pub' | 'draft' | 'archived',
                };

                const res = await saveAnnouncementAction(payload);
                if (res.success) {
                  // Refresh list
                  const getRes = await getAnnouncementsAction();
                  if (getRes.success) {
                    this.setState({ ann: getRes.announcements, annId: null, annEdits: {} });
                  } else {
                    this.setState({ annId: null, annEdits: {} });
                  }
                  this.toast(selectedAnn?.id ? 'Announcement updated' : 'Announcement created successfully');
                } else {
                  this.toast('Error saving announcement: ' + (res.error || 'Unknown error'), '', 'err');
                }
              };

              return (
                <div style={css("display: flex; flex-direction: column; gap: 20px;")}>
                  {/* Action Header */}
                  <div className={"card"} style={css("padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;")}>
                    <div>
                      <h2 className={"h2"} style={css("font-size: 18px; margin-bottom: 2px;")}>Site Announcements</h2>
                      <p className={"small muted"}>Manage flash notices, admissions announcements, and campus event alerts across the website.</p>
                    </div>
                    <button
                      className={"btn pri"}
                      onClick={() => this.setState({ annId: 'new', annEdits: {} })}
                    >
                      <span>+</span> New Announcement
                    </button>
                  </div>

                  {/* Announcements Table */}
                  <div className={"card"} style={css("padding: 0; overflow: hidden;")}>
                    <div style={css("overflow-x: auto;")}>
                      <table className={"tbl"} style={css("width: 100%; border-collapse: collapse;")}>
                        <thead>
                          <tr>
                            <th style={css("text-align: left; padding: 12px 18px;")}>Title & Content</th>
                            <th style={css("text-align: left; padding: 12px 18px;")}>Category</th>
                            <th style={css("text-align: left; padding: 12px 18px;")}>Date / Schedule</th>
                            <th style={css("text-align: center; padding: 12px 18px;")}>Pinned</th>
                            <th style={css("text-align: center; padding: 12px 18px;")}>Status</th>
                            <th style={css("text-align: right; padding: 12px 18px;")}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {annList.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={css("text-align: center; padding: 36px; color: var(--muted);")}>
                                No announcements found. Click "New Announcement" to create one.
                              </td>
                            </tr>
                          ) : (
                            annList.map((a: AnnouncementRow) => {
                              let isPinned = a.order_index === -1;
                              let expiry = '';
                              let previewText = a.body;
                              try {
                                if (a.body.startsWith('{') && a.body.endsWith('}')) {
                                  const parsed = JSON.parse(a.body);
                                  previewText = parsed.text || previewText;
                                  if (parsed.pinned !== undefined) isPinned = parsed.pinned;
                                  if (parsed.expiry) expiry = parsed.expiry;
                                }
                              } catch {}

                              const isExpired = expiry && new Date(expiry) < new Date();

                              const catBadgeStyle = a.category === 'Admissions'
                                ? 'background: #e8f0eb; color: #123d32; border: 1px solid #c8dcd0;'
                                : a.category === 'Events'
                                  ? 'background: #fdf5e6; color: #8a6414; border: 1px solid #ebd49f;'
                                  : 'background: #f0f4f8; color: #1f4a6b; border: 1px solid #cbdde9;';

                              return (
                                <tr key={a.id} style={css("border-top: 1px solid var(--line);")}>
                                  <td style={css("padding: 14px 18px; max-width: 320px;")}>
                                    <div style={css("font-weight: 600; color: var(--ink); margin-bottom: 3px; display: flex; align-items: center; gap: 6px;")}>
                                      {isPinned && <span title="Pinned to top" style={css("font-size: 13px;")}>📌</span>}
                                      <span>{a.title}</span>
                                    </div>
                                    <p className={"small muted"} style={css("display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0;")}>
                                      {previewText}
                                    </p>
                                  </td>
                                  <td style={css("padding: 14px 18px; vertical-align: middle;")}>
                                    <span style={css(`display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; ${catBadgeStyle}`)}>
                                      {a.category || 'General'}
                                    </span>
                                  </td>
                                  <td style={css("padding: 14px 18px; vertical-align: middle; white-space: nowrap;")}>
                                    <div style={css("font-size: 13px; font-weight: 500;")}>{a.date}</div>
                                    {expiry && (
                                      <div style={css(`font-size: 11px; margin-top: 2px; color: ${isExpired ? '#991b1b' : 'var(--muted)'};`)}>
                                        {isExpired ? 'Expired: ' : 'Expires: '}{expiry}
                                      </div>
                                    )}
                                  </td>
                                  <td style={css("padding: 14px 18px; vertical-align: middle; text-align: center;")}>
                                    {isPinned ? (
                                      <span style={css("font-size: 11px; font-weight: 700; color: #123d32; background: #e8f0eb; padding: 2px 7px; border-radius: 4px;")}>
                                        Pinned
                                      </span>
                                    ) : (
                                      <span style={css("color: var(--muted); font-size: 12px;")}>—</span>
                                    )}
                                  </td>
                                  <td style={css("padding: 14px 18px; vertical-align: middle; text-align: center;")}>
                                    <span className={`pill ${a.status === 'pub' ? 'pub' : a.status === 'draft' ? 'draft' : 'rev'}`}>
                                      {a.status === 'pub' ? 'Active' : a.status === 'draft' ? 'Draft' : 'Archived'}
                                    </span>
                                  </td>
                                  <td style={css("padding: 14px 18px; vertical-align: middle; text-align: right; white-space: nowrap;")}>
                                    <div style={css("display: flex; gap: 8px; justify-content: flex-end;")}>
                                      <button
                                        className={"btn sm"}
                                        onClick={() => this.setState({ annId: a.id, annEdits: {} })}
                                      >
                                        Edit
                                      </button>
                                      {currentRole === 'super' && (
                                        <button
                                          className={"btn sm danger"}
                                          onClick={() => {
                                            this.confirm({
                                              title: `Delete "${a.title}"?`,
                                              body: 'This announcement will be permanently deleted from the database and will no longer be visible to visitors.',
                                              ok: 'Delete Announcement',
                                              danger: true,
                                              act: `deleteAnnouncement_${a.id}`
                                            });
                                          }}
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Drawer for Create / Edit Announcement */}
                  {selectedAnn && (
                    <div className={"scrim"} onClick={() => this.setState({ annId: null, annEdits: {} })}>
                      <div className={"drawer"} onClick={(e) => e.stopPropagation()} style={css("max-width: 520px;")}>
                        <div className={"drawer-h"}>
                          <div>
                            <h2 className={"h2"} style={css("font-size: 17px;")}>
                              {selectedAnn.id ? 'Edit Announcement' : 'Create New Announcement'}
                            </h2>
                            <p className={"small muted"}>
                              {selectedAnn.id ? 'Modify announcement fields and schedule' : 'Publish or draft a new public notice'}
                            </p>
                          </div>
                          <button
                            className={"ib sm"}
                            onClick={() => this.setState({ annId: null, annEdits: {} })}
                            aria-label="Close drawer"
                          >
                            ✕
                          </button>
                        </div>

                        <div className={"drawer-b"} style={css("display: flex; flex-direction: column; gap: 16px; padding: 20px;")}>
                          <div className={"fld"}>
                            <label>Title *</label>
                            <input
                              type="text"
                              className={"inp"}
                              value={fTitle}
                              onChange={(e) => this.setState({ annEdits: { ...edits, title: e.target.value } })}
                              placeholder="e.g. Admissions Open for 2026 Batch"
                            />
                          </div>

                          <div className={"grid2"}>
                            <div className={"fld"}>
                              <label>Category</label>
                              <select
                                className={"inp"}
                                value={fCategory}
                                onChange={(e) => this.setState({ annEdits: { ...edits, category: e.target.value } })}
                              >
                                <option value="Admissions">Admissions</option>
                                <option value="Events">Events</option>
                                <option value="General">General</option>
                              </select>
                            </div>

                            <div className={"fld"}>
                              <label>Status</label>
                              <select
                                className={"inp"}
                                value={fStatus}
                                onChange={(e) => this.setState({ annEdits: { ...edits, status: e.target.value } })}
                              >
                                <option value="pub">Published (Active)</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                          </div>

                          <div className={"grid2"}>
                            <div className={"fld"}>
                              <label>Publication Date</label>
                              <input
                                type="date"
                                className={"inp"}
                                value={fDate}
                                onChange={(e) => this.setState({ annEdits: { ...edits, date: e.target.value } })}
                              />
                            </div>

                            <div className={"fld"}>
                              <label>Expiration Date (Optional)</label>
                              <input
                                type="date"
                                className={"inp"}
                                value={fExpiry}
                                onChange={(e) => this.setState({ annEdits: { ...edits, expiry: e.target.value } })}
                              />
                            </div>
                          </div>

                          <div className={"fld"}>
                            <label style={css("display: flex; align-items: center; gap: 8px; cursor: pointer; text-transform: none; font-size: 14px; font-weight: 500;")}>
                              <input
                                type="checkbox"
                                checked={fPinned}
                                onChange={(e) => this.setState({ annEdits: { ...edits, pinned: e.target.checked } })}
                                style={css("width: 17px; height: 17px; accent-color: var(--forest); cursor: pointer;")}
                              />
                              <span>📌 Pin to top of announcements list</span>
                            </label>
                          </div>

                          <div className={"fld"}>
                            <label>Announcement Body / Message *</label>
                            <textarea
                              className={"inp"}
                              rows={5}
                              value={fBody}
                              onChange={(e) => this.setState({ annEdits: { ...edits, body: e.target.value } })}
                              placeholder="Write announcement details here..."
                            />
                          </div>
                        </div>

                        <div className={"drawer-f"}>
                          {selectedAnn.id && currentRole === 'super' ? (
                            <button
                              className={"btn danger"}
                              onClick={() => {
                                this.confirm({
                                  title: `Delete "${selectedAnn.title}"?`,
                                  body: 'This will permanently remove the announcement from the system.',
                                  ok: 'Delete Announcement',
                                  danger: true,
                                  act: `deleteAnnouncement_${selectedAnn.id}`
                                });
                              }}
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              className={"btn"}
                              onClick={() => this.setState({ annId: null, annEdits: {} })}
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            className={"btn pri"}
                            onClick={handleSaveAnnouncement}
                          >
                            {selectedAnn.id ? 'Save Changes' : 'Publish Announcement'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Enquiries */}
            {is('enquiries') && (() => {
              const enqList = s.enq || [];
              const activeTab = s.enqTab || 'all'; // all, admission, tesh, partner, general
              const statusFilter = s.enqSt || 'all'; // all, new, contacted, progress, completed, archived

              // Filter by Category tab
              const catFiltered = enqList.filter((e: EnquiryRow) => {
                if (activeTab === 'all') return true;
                if (activeTab === 'admission') return e.type === 'programme' || e.type === 'admission';
                if (activeTab === 'tesh') return e.type === 'tesh';
                if (activeTab === 'partner') return e.type === 'partnership' || e.type === 'partner';
                if (activeTab === 'general') return e.type === 'general';
                return true;
              });

              // Filter by Status & Query
              const q = (s.enqQ || '').toLowerCase().trim();
              const displayed = catFiltered.filter((e: EnquiryRow) => {
                const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
                const matchesQ = !q ||
                  e.name.toLowerCase().includes(q) ||
                  e.email.toLowerCase().includes(q) ||
                  (e.phone && e.phone.toLowerCase().includes(q)) ||
                  (e.message && e.message.toLowerCase().includes(q)) ||
                  (e.district && e.district.toLowerCase().includes(q));
                return matchesStatus && matchesQ;
              });

              // Selected enquiry
              const selectedId = s.enqSel || (displayed.length > 0 ? displayed[0].id : null);
              const curEnq = enqList.find((e: EnquiryRow) => e.id === selectedId) || null;

              const tabs = [
                { id: 'all', label: 'All Enquiries', count: enqList.length, newCount: enqList.filter(e => e.status === 'new').length },
                { id: 'admission', label: 'Admissions', count: enqList.filter(e => e.type === 'programme' || e.type === 'admission').length, newCount: enqList.filter(e => (e.type === 'programme' || e.type === 'admission') && e.status === 'new').length },
                { id: 'tesh', label: 'TESH Homestays', count: enqList.filter(e => e.type === 'tesh').length, newCount: enqList.filter(e => e.type === 'tesh' && e.status === 'new').length },
                { id: 'partner', label: 'Partnerships', count: enqList.filter(e => e.type === 'partnership' || e.type === 'partner').length, newCount: enqList.filter(e => (e.type === 'partnership' || e.type === 'partner') && e.status === 'new').length },
                { id: 'general', label: 'General Contact', count: enqList.filter(e => e.type === 'general').length, newCount: enqList.filter(e => e.type === 'general' && e.status === 'new').length },
              ];

              const handleStatusChange = async (newStatus: EnquiryStatus) => {
                if (!curEnq) return;
                const res = await updateEnquiryStatusAction(curEnq.id, newStatus);
                if (res.success) {
                  const updated = enqList.map((e: EnquiryRow) => e.id === curEnq.id ? { ...e, status: newStatus } : e);
                  this.setState({ enq: updated });
                  this.toast(`Enquiry marked as ${newStatus}`);
                } else {
                  this.toast('Failed to update status: ' + (res.error || 'Unknown error'), '', 'err');
                }
              };

              const handleAddNote = async (e: React.FormEvent) => {
                e.preventDefault();
                if (!curEnq || !s.note || !s.note.trim()) return;
                const res = await addEnquiryNoteAction(curEnq.id, s.note.trim());
                if (res.success) {
                  const updated = enqList.map((eq: EnquiryRow) => eq.id === curEnq.id ? { ...eq, notes: res.notes || '' } : eq);
                  this.setState({ enq: updated, note: '' });
                  this.toast('Note added to enquiry');
                } else {
                  this.toast('Failed to add note: ' + (res.error || 'Unknown error'), '', 'err');
                }
              };

              return (
                <div style={css("display: flex; flex-direction: column; gap: 16px;")}>
                  {/* Category Navigation Tabs */}
                  <div className={"card"} style={css("padding: 8px 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between;")}>
                    <div style={css("display: flex; gap: 6px; flex-wrap: wrap;")}>
                      {tabs.map((t) => {
                        const isCurrent = activeTab === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => this.setState({ enqTab: t.id, enqSel: null })}
                            style={css(`
                              padding: 8px 14px;
                              border-radius: 8px;
                              border: 1px solid ${isCurrent ? 'var(--forest)' : 'var(--line)'};
                              background: ${isCurrent ? 'var(--forest)' : '#ffffff'};
                              color: ${isCurrent ? '#ffffff' : 'var(--ink)'};
                              cursor: pointer;
                              font-size: 13px;
                              font-weight: 500;
                              display: flex;
                              align-items: center;
                              gap: 8px;
                              transition: all 0.15s ease;
                            `)}
                          >
                            <span>{t.label}</span>
                            <span style={css(`
                              font-size: 11px;
                              font-weight: 700;
                              padding: 1px 6px;
                              border-radius: 999px;
                              background: ${isCurrent ? 'rgba(255,255,255,0.25)' : 'var(--ivory)'};
                              color: ${isCurrent ? '#ffffff' : 'var(--forest)'};
                            `)}>
                              {t.count}
                            </span>
                            {t.newCount > 0 && (
                              <span style={css(`
                                font-size: 10px;
                                font-weight: 700;
                                padding: 1px 5px;
                                border-radius: 999px;
                                background: #ef4444;
                                color: #ffffff;
                              `)} title={`${t.newCount} unread / new`}>
                                {t.newCount} new
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Filter and Search */}
                    <div style={css("display: flex; gap: 8px; align-items: center;")}>
                      <input
                        type="text"
                        placeholder="Search enquiries..."
                        className={"inp"}
                        value={s.enqQ || ''}
                        onChange={(e) => this.setState({ enqQ: e.target.value })}
                        style={css("padding: 6px 10px; font-size: 12px; width: 170px;")}
                      />
                      <select
                        className={"inp"}
                        value={statusFilter}
                        onChange={(e) => this.setState({ enqSt: e.target.value })}
                        style={css("padding: 6px 10px; font-size: 12px; width: 130px;")}
                      >
                        <option value="all">All Statuses</option>
                        <option value="new">● New</option>
                        <option value="contacted">Contacted</option>
                        <option value="progress">In-Progress</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Split Layout: Left List + Right Details */}
                  <div style={css("display: grid; grid-template-columns: minmax(320px, 380px) 1fr; gap: 16px; align-items: start;")}>
                    {/* Left: Enquiry List */}
                    <div className={"card"} style={css("padding: 0; overflow: hidden; display: flex; flex-direction: column; max-height: 720px;")}>
                      <div style={css("padding: 12px 16px; border-bottom: 1px solid var(--line); font-size: 13px; font-weight: 600; color: var(--muted); background: var(--ivory); display: flex; justify-content: space-between;")}>
                        <span>ENQUIRIES ({displayed.length})</span>
                        <span>{displayed.filter(e => e.status === 'new').length} Unread</span>
                      </div>
                      <div style={css("overflow-y: auto; display: flex; flex-direction: column;")}>
                        {displayed.length === 0 ? (
                          <div style={css("padding: 40px 20px; text-align: center; color: var(--muted); font-size: 13px;")}>
                            No matching enquiries found.
                          </div>
                        ) : (
                          displayed.map((e: EnquiryRow) => {
                            const isSel = curEnq?.id === e.id;
                            const isNew = e.status === 'new';
                            const createdDate = new Date(e.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            });

                            return (
                              <div
                                key={e.id}
                                onClick={() => this.setState({ enqSel: e.id })}
                                style={css(`
                                  padding: 14px 16px;
                                  border-bottom: 1px solid var(--line);
                                  cursor: pointer;
                                  background: ${isSel ? 'var(--ivory)' : isNew ? '#ffffff' : '#fafafa'};
                                  border-left: 4px solid ${isSel ? 'var(--forest)' : isNew ? '#2f6b50' : 'transparent'};
                                  transition: background 0.15s ease;
                                `)}
                              >
                                <div style={css("display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;")}>
                                  <div style={css("display: flex; align-items: center; gap: 6px;")}>
                                    {isNew && (
                                      <span style={css("width: 8px; height: 8px; border-radius: 50%; background: #2f6b50; flex-shrink: 0;")} title="New Enquiry" />
                                    )}
                                    <span style={css(`font-size: 14px; font-weight: ${isNew ? '700' : '600'}; color: var(--ink);`)}>
                                      {e.name}
                                    </span>
                                  </div>
                                  <span style={css("font-size: 11px; color: var(--muted);")}>{createdDate}</span>
                                </div>

                                <div style={css("display: flex; gap: 6px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;")}>
                                  <span style={css(`
                                    font-size: 10px;
                                    font-weight: 700;
                                    text-transform: uppercase;
                                    padding: 1px 6px;
                                    border-radius: 4px;
                                    background: ${e.type === 'programme' || e.type === 'admission' ? '#e8f0eb' : e.type === 'tesh' ? '#fdf5e6' : '#f0f4f8'};
                                    color: ${e.type === 'programme' || e.type === 'admission' ? '#123d32' : e.type === 'tesh' ? '#8a6414' : '#1f4a6b'};
                                  `)}>
                                    {e.type}
                                  </span>
                                  <span className={`pill ${e.status === 'new' ? 'pub' : e.status === 'contacted' ? 'rev' : e.status === 'progress' ? 'draft' : 'pub'}`} style={css("font-size: 10px; padding: 1px 6px;")}>
                                    {e.status}
                                  </span>
                                  {e.district && (
                                    <span className={"small muted"} style={css("font-size: 11px;")}>📍 {e.district}</span>
                                  )}
                                </div>

                                <p className={"small muted"} style={css("display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; line-height: 1.4;")}>
                                  {e.message || 'No additional message provided.'}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right: Enquiry Detail Panel */}
                    {curEnq ? (
                      <div className={"card"} style={css("padding: 24px; display: flex; flex-direction: column; gap: 20px;")}>
                        {/* Header & Status Actions */}
                        <div style={css("display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; border-bottom: 1px solid var(--line); padding-bottom: 16px;")}>
                          <div>
                            <div style={css("display: flex; align-items: center; gap: 10px; margin-bottom: 4px;")}>
                              <h2 className={"h2"} style={css("font-size: 20px; margin: 0;")}>{curEnq.name}</h2>
                              <span className={`pill ${curEnq.status === 'new' ? 'pub' : curEnq.status === 'contacted' ? 'rev' : curEnq.status === 'progress' ? 'draft' : 'pub'}`}>
                                {curEnq.status.toUpperCase()}
                              </span>
                            </div>
                            <p className={"small muted"}>
                              Submitted on {new Date(curEnq.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </p>
                          </div>

                          {/* Quick Workflow Action Buttons */}
                          <div style={css("display: flex; gap: 8px; flex-wrap: wrap;")}>
                            <button
                              className={"btn sm"}
                              disabled={curEnq.status === 'contacted'}
                              onClick={() => handleStatusChange('contacted')}
                              style={css(curEnq.status === 'contacted' ? "background: #1f4a6b; color: #fff;" : "")}
                            >
                              ✓ Contacted
                            </button>
                            <button
                              className={"btn sm"}
                              disabled={curEnq.status === 'progress'}
                              onClick={() => handleStatusChange('progress')}
                              style={css(curEnq.status === 'progress' ? "background: #c5a15a; color: #fff;" : "")}
                            >
                              ⟳ In-Progress
                            </button>
                            <button
                              className={"btn sm pri"}
                              disabled={curEnq.status === 'completed'}
                              onClick={() => handleStatusChange('completed')}
                            >
                              ★ Completed
                            </button>
                            {curEnq.status !== 'archived' && (
                              <button
                                className={"btn sm"}
                                onClick={() => handleStatusChange('archived')}
                                style={css("color: var(--muted);")}
                              >
                                Archive
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Contact & Enquiry Information Details */}
                        <div className={"grid2"} style={css("background: var(--ivory); padding: 16px; border-radius: 8px; border: 1px solid var(--line); gap: 14px;")}>
                          <div>
                            <span className={"small muted"}>Email Address</span>
                            <div style={css("font-weight: 600; font-size: 14px; margin-top: 2px;")}>
                              <a href={`mailto:${curEnq.email}`} style={css("color: var(--forest); text-decoration: underline;")}>
                                {curEnq.email}
                              </a>
                            </div>
                          </div>
                          <div>
                            <span className={"small muted"}>Phone Number</span>
                            <div style={css("font-weight: 600; font-size: 14px; margin-top: 2px;")}>
                              {curEnq.phone ? (
                                <a href={`tel:${curEnq.phone}`} style={css("color: var(--forest);")}>
                                  {curEnq.phone}
                                </a>
                              ) : (
                                <span style={css("color: var(--muted);")}>Not provided</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className={"small muted"}>Category / Type</span>
                            <div style={css("font-weight: 600; font-size: 14px; margin-top: 2px; text-transform: capitalize;")}>
                              {curEnq.type} {curEnq.sub_type ? `· ${curEnq.sub_type}` : ''}
                            </div>
                          </div>
                          <div>
                            <span className={"small muted"}>Location / District</span>
                            <div style={css("font-weight: 600; font-size: 14px; margin-top: 2px;")}>
                              {curEnq.district || 'Kerala / General'}
                            </div>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className={"fld"}>
                          <label style={css("font-weight: 600; margin-bottom: 6px;")}>Enquiry Message</label>
                          <div style={css("padding: 14px 16px; background: #ffffff; border: 1px solid var(--line); border-radius: 6px; line-height: 1.6; font-size: 14px; white-space: pre-wrap;")}>
                            {curEnq.message || <em style={css("color: var(--muted);")}>No message body included.</em>}
                          </div>
                        </div>

                        {/* Internal Note Thread */}
                        <div style={css("border-top: 1px solid var(--line); padding-top: 16px; display: flex; flex-direction: column; gap: 14px;")}>
                          <div style={css("display: flex; justify-content: space-between; align-items: baseline;")}>
                            <h3 className={"h3"} style={css("font-size: 15px; margin: 0;")}>Internal Notes & Audit Trail</h3>
                            <span className={"small muted"}>Visible to staff only</span>
                          </div>

                          {/* Existing notes */}
                          {curEnq.notes ? (
                            <div style={css("padding: 12px 14px; background: var(--ivory); border: 1px solid var(--line); border-radius: 6px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; font-family: monospace;")}>
                              {curEnq.notes}
                            </div>
                          ) : (
                            <p className={"small muted"} style={css("font-style: italic; margin: 0;")}>
                              No internal notes recorded yet.
                            </p>
                          )}

                          {/* Add Note Form */}
                          <form onSubmit={handleAddNote} style={css("display: flex; gap: 10px; align-items: flex-end;")}>
                            <div className={"fld"} style={css("flex: 1; margin: 0;")}>
                              <textarea
                                className={"inp"}
                                rows={2}
                                placeholder="Add an internal note or update status..."
                                value={s.note || ''}
                                onChange={(e) => this.setState({ note: e.target.value })}
                                style={css("resize: vertical; font-size: 13px;")}
                              />
                            </div>
                            <button
                              type="submit"
                              className={"btn sm pri"}
                              disabled={!s.note || !s.note.trim()}
                              style={css("padding: 10px 16px;")}
                            >
                              Post Note
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <div className={"card"} style={css("padding: 40px; text-align: center; color: var(--muted);")}>
                        Select an enquiry from the list to view its full details and thread.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Users */}
            {is('users') && (() => {
              const userList: ProfileRow[] = s.users || [];
              const pendingInvites: InvitationRow[] = s.invitations || [];
              const showInviteModal = s.dlg && s.dlg.kind === 'inviteUser';

              const roleDisplay: Record<AdminRole, { label: string; badgeCls: string }> = {
                super: { label: 'Super Admin', badgeCls: 'background: #123d32; color: #f7f3e8;' },
                editor: { label: 'Content Editor', badgeCls: 'background: #e8f0eb; color: #123d32; border: 1px solid #c8dcd0;' },
                enquiry: { label: 'Enquiry Manager', badgeCls: 'background: #f0f4f8; color: #1f4a6b; border: 1px solid #cbdde9;' },
              };

              const handleRoleChange = async (userId: string, newRole: AdminRole) => {
                const res = await updateUserRoleAction(userId, newRole);
                if (res.success) {
                  const updated = userList.map((u) => u.id === userId ? { ...u, role: newRole } : u);
                  this.setState({ users: updated });
                  this.toast('User role updated successfully');
                } else {
                  this.toast('Failed to update role: ' + (res.error || 'Unknown error'), '', 'err');
                }
              };

              const handleSendInvite = async (e: React.FormEvent) => {
                e.preventDefault();
                const email = (s.invEmail || '').trim().toLowerCase();
                const role = s.invRole || 'editor';
                if (!email) {
                  this.setState({ invErr: 'Please enter a valid email address' });
                  return;
                }
                const res = await inviteUserAction({ email, role });
                if (res.success) {
                  // Reload user list & invitations
                  const usersRes = await getUsersAction();
                  if (usersRes.success) {
                    this.setState({
                      users: usersRes.profiles,
                      invitations: usersRes.invitations as InvitationRow[],
                      dlg: null,
                      invEmail: '',
                      invErr: '',
                    });
                  } else {
                    this.setState({ dlg: null, invEmail: '', invErr: '' });
                  }
                  this.toast('Invitation sent successfully', `Invite email sent to ${email}`);
                } else {
                  this.setState({ invErr: res.error || 'Failed to send invitation' });
                }
              };

              return (
                <div style={css("display: flex; flex-direction: column; gap: 24px;")}>
                  {/* Top Bar with Action Button */}
                  <div className={"card"} style={css("padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;")}>
                    <div>
                      <h2 className={"h2"} style={css("font-size: 18px; margin-bottom: 2px;")}>Users & Access Control</h2>
                      <p className={"small muted"}>Manage administrator permissions, invite new team members, and oversee account access.</p>
                    </div>
                    <button
                      className={"btn pri"}
                      onClick={() => this.setState({ dlg: { kind: 'inviteUser' }, invEmail: '', invRole: 'editor', invErr: '' })}
                    >
                      <span>+</span> Invite New Admin
                    </button>
                  </div>

                  {/* Active Users Table */}
                  <div className={"card"} style={css("padding: 0; overflow: hidden;")}>
                    <div style={css("padding: 14px 20px; border-bottom: 1px solid var(--line); background: var(--ivory); display: flex; justify-content: space-between; align-items: center;")}>
                      <span style={css("font-size: 13px; font-weight: 700; color: var(--forest); text-transform: uppercase; letter-spacing: 0.04em;")}>
                        Active Team Members ({userList.length})
                      </span>
                      <span className={"small muted"}>Super Admin privileges required to manage accounts</span>
                    </div>

                    <div style={css("overflow-x: auto;")}>
                      <table className={"tbl"} style={css("width: 100%; border-collapse: collapse;")}>
                        <thead>
                          <tr>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Admin User</th>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Email / Account ID</th>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Role & Permissions</th>
                            <th style={css("text-align: center; padding: 12px 20px;")}>Account Status</th>
                            <th style={css("text-align: right; padding: 12px 20px;")}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userList.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={css("text-align: center; padding: 36px; color: var(--muted);")}>
                                No administrator accounts found.
                              </td>
                            </tr>
                          ) : (
                            userList.map((u: any) => {
                              const userEmail = u.email || `${u.name?.toLowerCase().replace(/\s+/g, '') || 'admin'}@chaitanyakeralam.org`;
                              const isSelf = userEmail === $v.me.email;
                              const isSuspended = u.status === 'suspended';
                              const initials = (u.name || userEmail || 'A')
                                .split(' ')
                                .map((w: string) => w.charAt(0))
                                .join('')
                                .toUpperCase()
                                .slice(0, 2);

                              const roleInfo = roleDisplay[u.role as AdminRole] || { label: u.role, badgeCls: '' };

                              return (
                                <tr key={u.id} style={css("border-top: 1px solid var(--line);")}>
                                  <td style={css("padding: 14px 20px;")}>
                                    <div style={css("display: flex; align-items: center; gap: 12px;")}>
                                      <div style={css(`
                                        width: 36px;
                                        height: 36px;
                                        border-radius: 50%;
                                        background: var(--forest);
                                        color: #ffffff;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 13px;
                                        font-weight: 700;
                                        flex-shrink: 0;
                                      `)}>
                                        {initials}
                                      </div>
                                      <div>
                                        <div style={css("font-weight: 600; color: var(--ink);")}>
                                          {u.name} {isSelf && <span style={css("font-size: 11px; color: var(--muted); font-weight: normal;")}> (You)</span>}
                                        </div>
                                        <div className={"small muted"}>ID: {u.id.slice(0, 8)}...</div>
                                      </div>
                                    </div>
                                  </td>

                                  <td style={css("padding: 14px 20px; font-size: 14px;")}>
                                    <a href={`mailto:${userEmail}`} style={css("color: var(--forest);")}>{userEmail}</a>
                                  </td>

                                  <td style={css("padding: 14px 20px;")}>
                                    <div style={css("display: flex; align-items: center; gap: 8px;")}>
                                      <span style={css(`
                                        display: inline-block;
                                        padding: 3px 8px;
                                        border-radius: 4px;
                                        font-size: 11px;
                                        font-weight: 700;
                                        ${roleInfo.badgeCls}
                                      `)}>
                                        {roleInfo.label}
                                      </span>

                                      {/* Role change dropdown (cannot change own role) */}
                                      {!isSelf && (
                                        <select
                                          className={"inp"}
                                          value={u.role}
                                          onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                                          style={css("padding: 3px 8px; font-size: 12px; height: 28px; width: 140px;")}
                                        >
                                          <option value="super">Super Admin</option>
                                          <option value="editor">Content Editor</option>
                                          <option value="enquiry">Enquiry Manager</option>
                                        </select>
                                      )}
                                    </div>
                                  </td>

                                  <td style={css("padding: 14px 20px; text-align: center;")}>
                                    <span className={`pill ${isSuspended ? 'draft' : 'pub'}`} style={css(isSuspended ? "background: #fee2e2; color: #991b1b;" : "")}>
                                      {isSuspended ? 'Suspended' : 'Active'}
                                    </span>
                                  </td>

                                  <td style={css("padding: 14px 20px; text-align: right;")}>
                                    {!isSelf && (
                                      <button
                                        className={`btn sm ${isSuspended ? '' : 'danger'}`}
                                        onClick={() => {
                                          this.confirm({
                                            title: isSuspended ? `Reactivate ${u.name}?` : `Suspend ${u.name}'s Account?`,
                                            body: isSuspended
                                              ? `This will restore account login privileges and system access for ${userEmail}.`
                                              : `This will immediately terminate active sessions and prevent ${userEmail} from logging into the admin console.`,
                                            ok: isSuspended ? 'Reactivate User' : 'Suspend User',
                                            danger: !isSuspended,
                                            act: `suspendUser_${u.id}:${!isSuspended}`
                                          });
                                        }}
                                      >
                                        {isSuspended ? 'Reactivate' : 'Suspend'}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pending Invitations Section */}
                  <div className={"card"} style={css("padding: 0; overflow: hidden;")}>
                    <div style={css("padding: 14px 20px; border-bottom: 1px solid var(--line); background: var(--ivory); display: flex; justify-content: space-between; align-items: center;")}>
                      <span style={css("font-size: 13px; font-weight: 700; color: var(--forest); text-transform: uppercase; letter-spacing: 0.04em;")}>
                        Pending Invitations ({pendingInvites.length})
                      </span>
                      <span className={"small muted"}>Invited users who have not yet accepted their access link</span>
                    </div>

                    <div style={css("overflow-x: auto;")}>
                      <table className={"tbl"} style={css("width: 100%; border-collapse: collapse;")}>
                        <thead>
                          <tr>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Invited Email</th>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Assigned Role</th>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Expires At</th>
                            <th style={css("text-align: right; padding: 12px 20px;")}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingInvites.length === 0 ? (
                            <tr>
                              <td colSpan={4} style={css("text-align: center; padding: 24px; color: var(--muted); font-size: 13px;")}>
                                No pending invitations.
                              </td>
                            </tr>
                          ) : (
                            pendingInvites.map((inv: InvitationRow) => {
                              const expiresDate = new Date(inv.expires_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              });

                              return (
                                <tr key={inv.email} style={css("border-top: 1px solid var(--line);")}>
                                  <td style={css("padding: 12px 20px; font-weight: 500;")}>
                                    {inv.email}
                                  </td>
                                  <td style={css("padding: 12px 20px;")}>
                                    <span className={"small"} style={css("font-weight: 600; text-transform: capitalize;")}>
                                      {inv.role}
                                    </span>
                                  </td>
                                  <td style={css("padding: 12px 20px; color: var(--muted); font-size: 13px;")}>
                                    {expiresDate}
                                  </td>
                                  <td style={css("padding: 12px 20px; text-align: right;")}>
                                    <button
                                      className={"btn sm danger"}
                                      onClick={() => {
                                        this.confirm({
                                          title: `Revoke invitation for ${inv.email}?`,
                                          body: 'The recipient will no longer be able to use the invitation link to set up an account.',
                                          ok: 'Revoke Invitation',
                                          danger: true,
                                          act: `revokeInvitation_${inv.email}`
                                        });
                                      }}
                                    >
                                      Revoke
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Invite New Admin Modal */}
                  {showInviteModal && (
                    <div className={"scrim"} onClick={() => this.setState({ dlg: null })}>
                      <div className={"dialog"} onClick={(e) => e.stopPropagation()} style={css("max-width: 460px; padding: 24px;")}>
                        <h2 className={"h2"} style={css("font-size: 18px; margin-bottom: 6px;")}>Invite New Administrator</h2>
                        <p className={"small muted"} style={css("margin-bottom: 18px;")}>
                          An email invitation with a secure link will be sent to the recipient to complete account setup.
                        </p>

                        <form onSubmit={handleSendInvite} style={css("display: flex; flex-direction: column; gap: 16px;")}>
                          <div className={"fld"}>
                            <label>Recipient Email Address *</label>
                            <input
                              type="email"
                              required
                              className={"inp"}
                              placeholder="colleague@example.com"
                              value={s.invEmail || ''}
                              onChange={(e) => this.setState({ invEmail: e.target.value, invErr: '' })}
                            />
                          </div>

                          <div className={"fld"}>
                            <label>Select Admin Role</label>
                            <select
                              className={"inp"}
                              value={s.invRole || 'editor'}
                              onChange={(e) => this.setState({ invRole: e.target.value as AdminRole })}
                            >
                              <option value="editor">Content Editor (Pages, Programmes, Media, Carousel)</option>
                              <option value="enquiry">Enquiry Manager (Admissions, TESH & Contact Inbox)</option>
                              <option value="super">Super Admin (Full Administrative Access)</option>
                            </select>
                          </div>

                          {s.invErr && (
                            <div style={css("font-size: 13px; color: #991b1b; background: #fee2e2; padding: 8px 12px; border-radius: 6px;")}>
                              {s.invErr}
                            </div>
                          )}

                          <div style={css("display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;")}>
                            <button
                              type="button"
                              className={"btn"}
                              onClick={() => this.setState({ dlg: null })}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className={"btn pri"}
                            >
                              Send Invitation
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Activity */}
            {is('activity') && (() => {
              const actList: ActivityRow[] = s.activity || [];
              const actionFilter = s.aType || 'all';
              const query = (s.aQ || '').toLowerCase().trim();

              // Extract unique action types for filter options
              const rawActions = Array.from(new Set(actList.map((a: ActivityRow) => a.action)));

              const filtered = actList.filter((a: ActivityRow) => {
                const matchesType = actionFilter === 'all' || a.action.toLowerCase() === actionFilter.toLowerCase();
                const matchesQuery = !query ||
                  a.action.toLowerCase().includes(query) ||
                  a.item.toLowerCase().includes(query) ||
                  a.by_user.toLowerCase().includes(query) ||
                  (a.details && a.details.toLowerCase().includes(query)) ||
                  a.role.toLowerCase().includes(query);
                return matchesType && matchesQuery;
              });

              const getActionBadge = (action: string) => {
                const act = action.toLowerCase();
                if (act.includes('pub')) {
                  return { cls: 'background: #e8f0eb; color: #123d32; border: 1px solid #c8dcd0;', icon: '🚀' };
                }
                if (act.includes('suspend') || act.includes('delete') || act.includes('revok')) {
                  return { cls: 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;', icon: '⚠️' };
                }
                if (act.includes('edit') || act.includes('draft') || act.includes('updat')) {
                  return { cls: 'background: #fdf5e6; color: #8a6414; border: 1px solid #ebd49f;', icon: '✎' };
                }
                if (act.includes('invit') || act.includes('role')) {
                  return { cls: 'background: #f0f4f8; color: #1f4a6b; border: 1px solid #cbdde9;', icon: '👤' };
                }
                return { cls: 'background: var(--ivory); color: var(--forest); border: 1px solid var(--line);', icon: '⚡' };
              };

              return (
                <div style={css("display: flex; flex-direction: column; gap: 20px;")}>
                  {/* Top Bar with Filter & Search */}
                  <div className={"card"} style={css("padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;")}>
                    <div>
                      <h2 className={"h2"} style={css("font-size: 18px; margin-bottom: 2px;")}>Activity & Audit Trail</h2>
                      <p className={"small muted"}>Immutable audit log of all publishing, content edits, administrative operations, and user invitations.</p>
                    </div>

                    <div style={css("display: flex; gap: 10px; align-items: center; flex-wrap: wrap;")}>
                      {/* Search box */}
                      <input
                        type="text"
                        placeholder="Search activity by user, item, action..."
                        className={"inp"}
                        value={s.aQ || ''}
                        onChange={(e) => this.setState({ aQ: e.target.value })}
                        style={css("width: 250px; font-size: 13px; padding: 7px 12px;")}
                      />

                      {/* Filter by action type */}
                      <select
                        className={"inp"}
                        value={actionFilter}
                        onChange={(e) => this.setState({ aType: e.target.value })}
                        style={css("font-size: 13px; padding: 7px 12px; width: 170px;")}
                      >
                        <option value="all">All Action Types</option>
                        {rawActions.map((act) => (
                          <option key={act} value={act}>
                            {act.charAt(0).toUpperCase() + act.slice(1)}
                          </option>
                        ))}
                      </select>

                      {(s.aQ || actionFilter !== 'all') && (
                        <button
                          className={"btn sm"}
                          onClick={() => this.setState({ aQ: '', aType: 'all' })}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Activity Log Table */}
                  <div className={"card"} style={css("padding: 0; overflow: hidden;")}>
                    <div style={css("padding: 14px 20px; border-bottom: 1px solid var(--line); background: var(--ivory); display: flex; justify-content: space-between; align-items: center;")}>
                      <span style={css("font-size: 13px; font-weight: 700; color: var(--forest); text-transform: uppercase; letter-spacing: 0.04em;")}>
                        Logged Events ({filtered.length}{filtered.length !== actList.length ? ` of ${actList.length}` : ''})
                      </span>
                      <span className={"small muted"}>Server-timestamped with UTC synchronization</span>
                    </div>

                    <div style={css("overflow-x: auto;")}>
                      <table className={"tbl"} style={css("width: 100%; border-collapse: collapse;")}>
                        <thead>
                          <tr>
                            <th style={css("text-align: left; padding: 12px 20px; width: 180px;")}>Date & Timestamp</th>
                            <th style={css("text-align: left; padding: 12px 20px; width: 190px;")}>Admin User</th>
                            <th style={css("text-align: left; padding: 12px 20px; width: 180px;")}>Action Taken</th>
                            <th style={css("text-align: left; padding: 12px 20px;")}>Target Item / Details</th>
                            <th style={css("text-align: left; padding: 12px 20px; width: 160px;")}>IP / Context</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={css("text-align: center; padding: 48px; color: var(--muted); font-size: 14px;")}>
                                {actList.length === 0 ? 'No activity has been logged yet.' : 'No activity records match your filter criteria.'}
                              </td>
                            </tr>
                          ) : (
                            filtered.map((log: ActivityRow) => {
                              const badge = getActionBadge(log.action);
                              const ts = new Date(log.created_at).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              });

                              return (
                                <tr key={log.id} style={css("border-top: 1px solid var(--line);")}>
                                  <td style={css("padding: 13px 20px; font-size: 12px; font-family: monospace; color: var(--muted); white-space: nowrap;")}>
                                    {ts}
                                  </td>

                                  <td style={css("padding: 13px 20px;")}>
                                    <div style={css("display: flex; align-items: center; gap: 8px;")}>
                                      <div style={css("width: 24px; height: 24px; border-radius: 50%; background: var(--forest); color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;")}>
                                        {(log.by_user || 'A').charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div style={css("font-weight: 600; font-size: 13px; color: var(--ink);")}>
                                          {log.by_user}
                                        </div>
                                        <div className={"small muted"} style={css("font-size: 10px; text-transform: uppercase;")}>
                                          {log.role}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td style={css("padding: 13px 20px; vertical-align: middle;")}>
                                    <span style={css(`
                                      display: inline-flex;
                                      align-items: center;
                                      gap: 5px;
                                      padding: 3px 8px;
                                      border-radius: 4px;
                                      font-size: 11px;
                                      font-weight: 700;
                                      text-transform: capitalize;
                                      ${badge.cls}
                                    `)}>
                                      <span>{badge.icon}</span>
                                      <span>{log.action}</span>
                                    </span>
                                  </td>

                                  <td style={css("padding: 13px 20px;")}>
                                    <div style={css("font-weight: 600; font-size: 13px; color: var(--ink); margin-bottom: 2px;")}>
                                      {log.item}
                                    </div>
                                    {log.details && (
                                      <div className={"small muted"} style={css("font-size: 12px; line-height: 1.4;")}>
                                        {log.details}
                                      </div>
                                    )}
                                  </td>

                                  <td style={css("padding: 13px 20px; font-size: 12px; color: var(--muted); font-family: monospace; white-space: nowrap;")}>
                                    <span title="Origin">Cloud / Admin API</span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Settings */}
            {is('settings') && (() => {
              const currentRole = $v.role || s.role;
              const setVals = s.set || { req2fa: true, timeout: '30', invite: '72', domains: '' };

              const handleSaveSettings = async (e: React.FormEvent) => {
                e.preventDefault();
                const res = await saveSettingsAction(setVals);
                if (res.success) {
                  this.toast('Portal security settings saved successfully', 'Configuration policies updated for all admin sessions.');
                } else {
                  this.toast('Failed to save settings: ' + (res.error || 'Unknown error'), '', 'err');
                }
              };

              return (
                <div style={css("display: flex; flex-direction: column; gap: 20px; max-width: 860px;")}>
                  {/* Header */}
                  <div className={"card"} style={css("padding: 20px 24px;")}>
                    <h2 className={"h2"} style={css("font-size: 19px; margin-bottom: 4px;")}>Portal Security & Access Settings</h2>
                    <p className={"small muted"}>
                      Configure system-wide administrative security rules, session timeouts, and invitation domain restrictions. Restricted to Super Admins.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} style={css("display: flex; flex-direction: column; gap: 20px;")}>
                    {/* Inactivity & Session Policies */}
                    <div className={"card"} style={css("padding: 24px; display: flex; flex-direction: column; gap: 20px;")}>
                      <div style={css("border-bottom: 1px solid var(--line); padding-bottom: 12px;")}>
                        <h3 className={"h3"} style={css("font-size: 16px; margin-bottom: 2px;")}>Session & Inactivity Policies</h3>
                        <p className={"small muted"}>Control automatic session termination to prevent unauthorized console takeover.</p>
                      </div>

                      <div className={"grid2"} style={css("gap: 20px;")}>
                        <div className={"fld"}>
                          <label style={css("font-weight: 600;")}>Session Inactivity Timeout</label>
                          <select
                            className={"inp"}
                            value={setVals.timeout || '30'}
                            onChange={(e) => this.setState({ set: { ...setVals, timeout: e.target.value } })}
                          >
                            <option value="15">15 minutes (Strict)</option>
                            <option value="30">30 minutes (Standard)</option>
                            <option value="60">1 hour (Extended)</option>
                          </select>
                          <span className={"small muted"} style={css("margin-top: 4px;")}>
                            Idle admin sessions will be automatically logged out after this duration.
                          </span>
                        </div>

                        <div className={"fld"}>
                          <label style={css("font-weight: 600;")}>Invitation Token Expiration</label>
                          <select
                            className={"inp"}
                            value={setVals.invite || '72'}
                            onChange={(e) => this.setState({ set: { ...setVals, invite: e.target.value } })}
                          >
                            <option value="24">24 hours (1 Day)</option>
                            <option value="48">48 hours (2 Days)</option>
                            <option value="72">72 hours (3 Days - Recommended)</option>
                            <option value="168">7 days (1 Week)</option>
                          </select>
                          <span className={"small muted"} style={css("margin-top: 4px;")}>
                            Duration an email invitation token remains valid before revoking automatically.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Domain Restrictions & Access Rules */}
                    <div className={"card"} style={css("padding: 24px; display: flex; flex-direction: column; gap: 20px;")}>
                      <div style={css("border-bottom: 1px solid var(--line); padding-bottom: 12px;")}>
                        <h3 className={"h3"} style={css("font-size: 16px; margin-bottom: 2px;")}>Domain Restrictions</h3>
                        <p className={"small muted"}>Restrict administrator invites and sign-ins to verified institutional email domains.</p>
                      </div>

                      <div className={"fld"}>
                        <label style={css("font-weight: 600;")}>Allowed Email Domains (comma-separated)</label>
                        <input
                          type="text"
                          className={"inp"}
                          placeholder="e.g. chaitanyakeralam.org, pervadorit.com"
                          value={setVals.domains || ''}
                          onChange={(e) => this.setState({ set: { ...setVals, domains: e.target.value } })}
                        />
                        <span className={"small muted"} style={css("margin-top: 4px;")}>
                          Leave blank to allow any email domain for invitations, or specify authorized domains separated by commas.
                        </span>
                      </div>

                      <div className={"fld"}>
                        <label style={css("display: flex; align-items: center; gap: 10px; cursor: pointer; text-transform: none; font-size: 14px; font-weight: 500;")}>
                          <input
                            type="checkbox"
                            checked={!!setVals.req2fa}
                            onChange={(e) => this.setState({ set: { ...setVals, req2fa: e.target.checked } })}
                            style={css("width: 17px; height: 17px; accent-color: var(--forest); cursor: pointer;")}
                          />
                          <span>Enforce Two-Factor Authentication (2FA) for all administrative roles</span>
                        </label>
                        <span className={"small muted"} style={css("margin-left: 27px; display: block;")}>
                          Requires TOTP authenticator verification before entering the dashboard.
                        </span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div style={css("display: flex; justify-content: flex-end; gap: 12px;")}>
                      <button
                        type="submit"
                        className={"btn pri"}
                        style={css("padding: 10px 24px; font-size: 14px; font-weight: 600;")}
                      >
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              );
            })()}

          </main>
        </div>

        {/* Global Confirmation Dialog */}
        {s.dlg && (
          <div className={"dlg-w"}>
            <div className={"scrim"} onClick={() => this.setState({ dlg: null })} />
            <div className={"dlg"}>
              <div className={"dlg-h"}>
                <div className={"dlg-ic" + (s.dlg.danger ? " danger" : s.dlg.warn ? " warn" : "")}>
                  {s.dlg.danger ? '⚠️' : 'ℹ️'}
                </div>
                <div>
                  <h2 className={"h2"}>{s.dlg.title}</h2>
                </div>
              </div>
              <div className={"dlg-b"}>
                <p>{s.dlg.body}</p>
              </div>
              <div className={"dlg-f"}>
                <button className={"btn"} onClick={() => this.setState({ dlg: null })}>
                  Cancel
                </button>
                <button
                  className={"btn " + (s.dlg.danger ? "danger pri" : "pri")}
                  onClick={() => {
                    if (s.dlg.act) {
                      this.run(s.dlg.act);
                    } else {
                      this.setState({ dlg: null });
                    }
                  }}
                >
                  {s.dlg.ok || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {s.toast && (
          <div className={"toast" + (s.toast[2] === 'err' ? " err" : "")}>
            <div style={css("flex: 1;")}>
              <b>{s.toast[0]}</b>
              {s.toast[1] && <small>{s.toast[1]}</small>}
            </div>
            <button className={"ib sm"} onClick={() => this.setState({ toast: null })}>
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }
}
