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
import type { AdminRole, PublishStatus, EnquiryStatus, Database } from '@/lib/supabase/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type PageRow = Database['public']['Tables']['pages']['Row'];
type SectionRow = Database['public']['Tables']['page_sections']['Row'];
type CarouselSlideRow = Database['public']['Tables']['carousel_slides']['Row'];
type MediaRow = Database['public']['Tables']['media']['Row'];
type ProgrammeRow = Database['public']['Tables']['programmes']['Row'];
type AnnouncementRow = Database['public']['Tables']['announcements']['Row'];
type EnquiryRow = Database['public']['Tables']['enquiries']['Row'];
type InvitationRow = Database['public']['Tables']['invitations']['Row'];
type ActivityRow = Database['public']['Tables']['activity_log']['Row'];


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
}, AdminAppState> {
  [key: string]: any;

  constructor(props: { view?: string; role?: string; page?: string; sec?: string; mcat?: string; msel?: string; etab?: string; esel?: string; open?: string }) {
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
      enqTab: 'admission',
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
      if (pagesRes.success) self.setState({ pages: pagesRes.pages, pstat: Object.fromEntries(pagesRes.pages.map((p: PageRow) => [p.id, p.status])) });
      if (slidesRes.success) self.setState({ slides: slidesRes.slides });
      if (mediaRes.success) self.setState({ media: mediaRes.media });
      if (annRes.success) self.setState({ ann: annRes.announcements });
      if (programmesRes.success) self.setState({ programmes: programmesRes.programmes });
      if (enqRes.success) self.setState({ enq: enqRes.enquiries });
      if (activities.success) self.setState({ activity: activities.log });
      if (role === 'super') {
        const usersRes = await getUsersAction();
        if (usersRes.success) self.setState({ users: usersRes.profiles, invitations: usersRes.invitations as InvitationRow[] });
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


  private confirm(opts: { title: string; body: string; ok: string; act?: string; danger?: boolean; warn?: boolean; needAck?: boolean; ackLabel?: string; list?: string[] }) {
    this.setState({ dlg: opts });
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

  private startUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async function (this: any) {
      const file = this.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const altEl = document.getElementById('alt-input') as HTMLInputElement | null;
      const creditEl = document.getElementById('credit-input') as HTMLInputElement | null;
      const catEl = document.getElementById('cat-input') as HTMLInputElement | null;
      formData.append('alt', (altEl?.value || '').trim());
      formData.append('credit', (creditEl?.value || '').trim());
      formData.append('category', (catEl?.value || 'General').trim());
      const res = await uploadMediaAction(formData);
      if (res.success) {
        const m = res.media as MediaRow;
        const s = this.state.media;
        s.push(m);
        this.setState({ media: s, mSel: m.id });
      } else {
        this.toast('Upload failed: ' + (res.error || 'Unknown error'), '', 'err');
      }
    }.bind(this);
    input.click();
  }

  private handleUpload() { this.startUpload(); }

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
  }

  private go(view: string, opts?: any) {
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
    this.goView(view);
  }

  private allowed(view: string, role: AdminRole): boolean {
    const A: Record<string, string | string[]> = {
      super: 'all',
      editor: ['dashboard', 'pages', 'pageEdit', 'carousel', 'media', 'programmes', 'announcements', 'activity', 'settings'],
      enquiry: ['dashboard', 'enquiries', 'activity', 'settings'],
    };
    const perm = A[role];
    if (!perm) return false;
    return perm === 'all' || (typeof perm === 'string' ? perm === view : perm.includes(view));
  }

  private ini(name: string): string {
    return name.split(' ').map((w) => w.charAt(0)).join('').toUpperCase();
  }

  private run(act: string) {
    const s = this.state;
    const self = this;
    const pid = s.pageId;
    const pname = (s.pages || []).find((pg: PageRow) => pg.id === pid)?.name || 'Page';
    if (act === 'publishPage') {
      self.setState({ loading: true });
      publishPageAction(pid).then((res: { success: boolean; error?: string; pageName?: string }) => {
        self.setState({ loading: false, dlg: null });
        if (res.success) {
          const ps = Object.assign({}, s.pstat);
          ps[pid] = 'pub';
          const dd = Object.assign({}, s.dirty);
          dd[pid] = false;
          self.setState({ pstat: ps, dirty: dd });
          self.toast(pname + ' published', 'Changes are now live on the public website.');
        } else {
          self.toast('Could not publish: ' + (res.error || 'Unknown error'), '', 'err');
        }
      });
    }
    if (act === 'unpublishPage') {
      unpublishPageAction(pid).then((res: { success: boolean; error?: string }) => {
        self.setState({ dlg: null });
        if (res.success) {
          const pu = Object.assign({}, s.pstat);
          pu[pid] = 'unpub';
          self.setState({ pstat: pu });
          self.toast(pname + ' unpublished');
        } else {
          self.toast('Could not unpublish: ' + (res.error || 'Unknown error'), '', 'err');
        }
      });
    }
    if (act === 'republishPage') {
      publishPageAction(pid).then((res: { success: boolean; error?: string }) => {
        self.setState({ dlg: null });
        if (res.success) {
          const pr = Object.assign({}, s.pstat);
          pr[pid] = 'pub';
          self.setState({ pstat: pr });
          self.toast('Republished', 'The page is live again.');
        } else {
          self.toast('Could not republish: ' + (res.error || 'Unknown error'), '', 'err');
        }
      });
    }
    if (act === 'discard') {
      const e: Record<string, unknown> = {};
      Object.keys(s.edits).forEach((k) => {
        if (k.indexOf('p.' + pid + '.') !== 0) e[k] = (s.edits as Record<string, unknown>)[k];
      });
      const o = Object.assign({}, s.order);
      delete o[pid];
      const d: Record<string, boolean> = Object.assign({}, s.dirty);
      d[pid] = false;
      this.setState({ edits: e, order: o, dirty: d, dlg: null });
      this.toast('Unsaved changes discarded', 'The last saved draft is shown.');
    }
    if (act === 'restore') {
      const pz = Object.assign({}, s.pstat);
      pz[pid] = 'draft';
      this.setState({ pstat: pz, dlg: null, hist: false });
      this.toast('Earlier version restored as a draft', 'Review it, then publish when ready. The live page is unchanged until you do.');
    }
    if (act === 'publishCar') {
      publishCarouselAction().then((res: { success: boolean; error?: string }) => {
        self.setState({ dlg: null });
        if (res.success) {
          self.setState({ carSt: 'pub', carDirty: false });
          self.toast('Homepage carousel published', 'All enabled slides are now live on the Home page.');
        } else {
          self.toast('Could not publish carousel: ' + (res.error || 'Unknown error'), '', 'err');
        }
      });
    }
    if (act === 'approveProg') {
      publishProgrammeAction(s.progId).then((res: { success: boolean; error?: string }) => {
        self.setState({ dlg: null });
        if (res.success) {
          const pa = Object.assign({}, s.prst);
          pa[s.progId] = 'pub';
          const pdd = Object.assign({}, s.prDirty);
          pdd[s.progId] = false;
          self.setState({ prst: pa, prDirty: pdd });
          self.toast('Programme approved and published', 'The programme page and comparison table are updated.');
        } else {
          self.toast('Could not publish: ' + (res.error || 'Unknown error'), '', 'err');
        }
      });
    }
    if (act === 'submitForReview') {
      submitProgrammeForReviewAction(s.progId).then((res: { success: boolean; error?: string }) => {
        self.setState({ dlg: null });
        if (res.success) {
          const pd = Object.assign({}, s.prDirty);
          pd[s.progId] = false;
          self.setState({ prDirty: pd, prst: Object.assign({}, s.prst, { [s.progId]: 'review' }) });
          self.toast('Submitted for review');
        } else {
          self.toast('Could not submit: ' + (res.error || 'Unknown error'), '', 'err');
        }
      });
    }
  }

  private renderVals() {
    const s = this.state;
    const self: any = this;
    const role = s.role;
    const viewNames = { dashboard: 'the dashboard', pages: 'Pages', pageEdit: 'the page editor', carousel: 'the homepage carousel', media: 'the media library', programmes: 'Programmes', announcements: 'Announcements', enquiries: 'Enquiries', users: 'Users & roles', activity: 'the activity log', settings: 'Settings' };
    const roleLabels = { super: 'Super Admin', editor: 'Content Editor', enquiry: 'Enquiry Manager' };
    const me = { name: role === 'super' ? 'Joel' : role === 'editor' ? 'Anitha Menon' : 'Rahul Nair', email: role === 'super' ? 'joel@pervadorit.com' : role === 'editor' ? 'anitha@example.org' : 'rahul@example.org', roleLabel: roleLabels[role] };
    const denied = !this.allowed(s.view, role);
    const is = (v: string) => !denied && !s.loading && s.view === v;

    const pages = s.pages || [];
    const pageRows = (pages || []).map((p: PageRow, i: number) => {
      const st = s.pstat[p.id];
      const info = self.stInfo(st);
      return { n: i + 1, id: p.id, name: p.name, path: p.path, stKey: st, stLabel: info[0], stCls: info[1], dirty: !!s.dirty[p.id], canUnpub: p.id !== 'home' && st !== 'unpub', isUnpub: st === 'unpub' };
    });
    const total = pageRows.length;
    const pubN = pageRows.filter((r) => r.stKey === 'pub').length;
    const draftN = pageRows.filter((r) => r.stKey === 'draft').length;
    const revN = pageRows.filter((r) => r.stKey === 'review').length;
    const unpubN = pageRows.filter((r) => r.stKey === 'unpub').length;

    const sections = s.sections || [];
    const enabledN = (s.slides || []).filter((x: CarouselSlideRow) => x.en).length;

    const enq = s.enq || [];
    const enqNewAll = enq.filter((e: EnquiryRow) => e.status === 'new').length;
    const partAll = enq.filter((e: EnquiryRow) => e.type === 'tesh' || e.type === 'partner');
    const partNew = partAll.filter((e) => e.status === 'new').length;

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
      deniedView: viewNames[s.view],
      reqAccess: () => self.run('reqAccess'),
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
          <button className={"nav-i" + ($v.isDash ? " on" : "")} onClick={$v.go.dashboard}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
            <span>Dashboard</span>
          </button>
          <button className={"nav-i" + ($v.isPages ? " on" : "")} onClick={$v.go.pages}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span>Pages</span>
          </button>
          <button className={"nav-i" + ($v.isCar ? " on" : "")} onClick={$v.go.carousel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="14" x="3" y="5" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
            <span>Carousel</span>
          </button>
          <button className={"nav-i" + ($v.isMedia ? " on" : "")} onClick={$v.go.media}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m2 15 3-3 3 3"></path><path d="m5 12v9"></path></svg>
            <span>Media</span>
          </button>

          <div className={"nav-g"}>Audience</div>
          <button className={"nav-i" + ($v.isEnq ? " on" : "")} onClick={$v.go.enquiries}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            <span>Enquiries</span>
            {$v.enqNewAll > 0 && <span className={"cnt"}>{$v.enqNewAll}</span>}
          </button>
          {s.role === 'super' && (
            <button className={"nav-i" + ($v.isUsers ? " on" : "")} onClick={$v.go.users}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Users &amp; roles</span>
            </button>
          )}

          <div className={"nav-g"}>Publish</div>
          <button className={"nav-i" + ($v.isProg ? " on" : "")} onClick={$v.go.programmes}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            <span>Programmes</span>
          </button>
          <button className={"nav-i" + ($v.isAnn ? " on" : "")} onClick={$v.go.announcements}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
            <span>Announcements</span>
          </button>
          <button className={"nav-i" + ($v.isAct ? " on" : "")} onClick={$v.go.activity}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Activity log</span>
          </button>

          <div className={"nav-g"}>System</div>
          <button className={"nav-i" + ($v.isSet ? " on" : "")} onClick={$v.go.settings}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>Settings</span>
          </button>

          <div className={"side-foot"}>
            <div>
              <b style={css("color: #fff;")}>{$v.me.name}</b>
              <div style={css("color: #a9c2b4; font-size: 11px;")}>{$v.roleLabels[s.role]}</div>
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
              <span>{s.view.charAt(0).toUpperCase() + s.view.slice(1)}</span>
            </div>
            <div className={"top-r"}>
              <a href={"/"} target={"_blank"} rel={"noreferrer"} className={"btn sm q"}>View live site ↗</a>
              <div className={"prof"}>
                <span className={"av"}>{$v.me.name.charAt(0)}</span>
                <div className={"prof-t"}>
                  <b>{$v.me.name}</b>
                  <span>{$v.roleLabels[s.role]}</span>
                </div>
              </div>
              <a href={"/admin/signed-out"} className={"ib bd sm"} title="Sign out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </a>
            </div>
          </header>

          <main className={"content"}>
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
                              <span className={"t-sub"}>Super Admin</span>
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

            {/*
              Page editor
            */}
            {is('pageEdit') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>{$v.pg?.name || 'Page'}</div>
                  <div className={"card-s"}>{$v.pg?.path}</div>
                  <div className={"st"}><span className={"st-txt"}>{$v.pg?.stLabel}</span><span className={"st-sub"}>{$v.pg?.dirty ? 'unsaved changes' : 'no unsaved changes'}</span></div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Sections</div>
                  <div className={"card-s"}>{$v.secs.length} sections</div>
                  <div className={"sec-list"}>
                    {$v.secs.map((sec) => (
                      <div key={sec.id} className={"sec-row" + ($v.cur?.id === sec.id ? ' on' : '') + (sec.hidden ? ' off' : '')}>
                        <div className={"sec-row-t"}>
                          <span className={"sec-row-txt"}>{sec.name}</span>
                          <span className={"sec-row-sp"}>{sec.title}</span>
                        </div>
                        <div className={"sec-row-f"}>
                          <button className={"btn sm"} onClick={sec.pick}>Edit</button>
                          <button className={"btn sm"} onClick={sec.toggle}>{sec.hidden ? 'Show' : 'Hide'}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
{/* Carousel */}
            {is('carousel') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Carousel</div>
                  <div className={"card-s"}>{$v.slides.length} slides</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>View</div>
                  <div className={"card-s"}>{$v.mView}</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Category</div>
                  <div className={"card-s"}>{$v.mCat}</div>
                </div>
              </div>
            )}

            {/* Media */}
            {is('media') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Media</div>
                  <div className={"card-s"}>{Array.isArray($v.upl) && $v.upl.length ? $v.upl.length + ' uploads' : 'No upload'}</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Status</div>
                  <div className={"card-s"}>{$v.hot ? 'Hot' : 'Normal'}</div>
                </div>
              </div>
            )}

            {/* Programmes */}
            {is('programmes') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Programmes</div>
                  <div className={"card-s"}>{$v.progs.length}</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Status</div>
                  <div className={"card-s"}>{JSON.stringify($v.prst)}</div>
                </div>
              </div>
            )}

            {/* Announcements */}
            {is('announcements') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Announcements</div>
                  <div className={"card-s"}>{$v.ann.length}</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Error</div>
                  <div className={"card-s"}>{$v.annErr ? 'Error' : 'None'}</div>
                </div>
              </div>
            )}

            {/* Enquiries */}
            {is('enquiries') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Enquiries</div>
                  <div className={"card-s"}>{$v.enqNewAll} new</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Status</div>
                  <div className={"card-s"}>{$v.enqSt}</div>
                </div>
              </div>
            )}

            {/* Users */}
            {is('users') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Users</div>
                  <div className={"card-s"}>{$v.users.length}</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Invitations</div>
                  <div className={"card-s"}>{$v.invitations.length}</div>
                </div>
              </div>
            )}

            {/* Activity */}
            {is('activity') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Activity</div>
                  <div className={"card-s"}>{$v.activity.length} entries</div>
                </div>
              </div>
            )}

            {/* Settings */}
            {is('settings') && (
              <div className={"card-grid"}>
                <div className={"card"}>
                  <div className={"card-h"}>Settings</div>
                  <div className={"card-s"}>{(s.set as any)?.req2fa ? '2FA required' : 'Optional'}</div>
                </div>
                <div className={"card"}>
                  <div className={"card-h"}>Crop</div>
                  <div className={"card-s"}>{$v.crop ? 'Custom' : 'Default'}</div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    );
  }
}
