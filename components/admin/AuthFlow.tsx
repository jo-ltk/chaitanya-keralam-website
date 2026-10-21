// @ts-nocheck -- prototype logic carried over as plain JavaScript from the admin canvas; type it when you wire up the real backend.
'use client';
/* Converted from the Chaitanya Keralam design canvas (AuthFlow). */
import React from 'react';
import { TextField } from '@/components/kneds';
import { css, str } from '@/lib/dc';
import {
  loginAction,
  verifyMfaAction,
  setupMfaAction,
  confirmMfaSetupAction,
  forgotPasswordAction,
  resetPasswordAction,
  signOutAction,
  validateInviteTokenAction,
  acceptInviteAction
} from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';

export default class AuthFlow extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) {
    super(props);
    this.state = {
      screen: props.screen || 'login',
      token: props.token || '',
      email: '',
      pw: '',
      showPw: false,
      remember: false,
      emailErr: '',
      pwErr: false,
      loginErr: '',
      busy: false,
      attempts: 0,
      factorId: '',
      mfaSecret: '',
      mfaQr: '',
      recoveryCodes: [],
      otp: ['', '', '', '', '', ''],
      otpErr: '',
      trust: true,
      recovery: false,
      rcode: '',
      name: '',
      nameErr: '',
      npw: '',
      cpw: '',
      formErr: '',
      cpwTouched: false,
      resendIn: 0,
      setupStep: 'scan',
      saved: false,
      copied: false,
      sess: 'warn',
      count: 119,
      emailShown: '',
      inviteEmail: '',
      inviteRole: 'editor',
      inviteRoleName: 'Content Editor',
      currentUserEmail: '',
      currentUserRole: ''
    };
  }
  async componentDidMount() {
    var self = this;
    this._t = setInterval(function () {
      var s = self.state, p = {};
      if (s.resendIn > 0) p.resendIn = s.resendIn - 1;
      if (s.screen === 'session' && s.sess === 'warn') { if (s.count <= 1) { p.sess = 'expired'; p.count = 0; } else p.count = s.count - 1; }
      if (Object.keys(p).length) self.setState(p);
    }, 1000);

    var token = this.props.token;
    if (!token && typeof window !== 'undefined') {
      var params = new URLSearchParams(window.location.search);
      token = params.get('token') || '';
    }

    if (this.state.screen === 'invite' && token) {
      this.setState({ token: token, busy: true });
      var res = await validateInviteTokenAction(token);
      if (!res.valid) {
        this.to('expired');
      } else {
        var roleTitle = res.role === 'super' ? 'Super Administrator' : res.role === 'editor' ? 'Content Editor' : 'Enquiry Manager';
        this.setState({
          inviteEmail: res.email,
          inviteRole: res.role,
          inviteRoleName: roleTitle,
          busy: false
        });
      }
    }

    if (this.state.screen === 'setup') {
      this.initMfaSetup();
    }

    if (this.state.screen === 'denied' || this.state.screen === 'logout') {
      var supabase = createClient();
      var userRes = await supabase.auth.getUser();
      if (userRes.data?.user) {
        var profRes = await supabase.from('profiles').select('role').eq('id', userRes.data.user.id).single();
        var r = profRes.data?.role || 'editor';
        var rLabel = r === 'super' ? 'Super Administrator' : r === 'editor' ? 'Content Editor' : 'Enquiry Manager';
        this.setState({
          currentUserEmail: userRes.data.user.email || '',
          currentUserRole: rLabel
        });
      }
    }
  }

  async initMfaSetup() {
    this.setState({ busy: true });
    var res = await setupMfaAction();
    if (res.success) {
      this.setState({
        factorId: res.factorId,
        mfaSecret: res.secret,
        mfaQr: res.qrCode,
        busy: false
      });
    } else {
      this.setState({ formErr: res.error, busy: false });
    }
  }

  generateRecoveryCodes() {
    var chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    var codes = [];
    for (var i = 0; i < 8; i++) {
      var part1 = '', part2 = '';
      for (var j = 0; j < 4; j++) part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      for (var k = 0; k < 4; k++) part2 += chars.charAt(Math.floor(Math.random() * chars.length));
      codes.push(part1 + '-' + part2);
    }
    return codes;
  }
  componentWillUnmount() { clearInterval(this._t); clearTimeout(this._b); }
  to(screen) { this.setState({ screen: screen, otp: ['', '', '', '', '', ''], otpErr: '', formErr: '', loginErr: '', emailErr: '', pwErr: false, npw: '', cpw: '', cpwTouched: false, recovery: false, rcode: '' }); }
  pwRules(p) {
    return [
      { ok: p.length >= 12, label: 'At least 12 characters' },
      { ok: /[A-Za-z]/.test(p) && /\d/.test(p), label: 'Letters and numbers' },
      { ok: /[^A-Za-z0-9]/.test(p), label: 'At least one symbol, like ! or #' }
    ];
  }
  renderVals() {
    var self = this, s = this.state;
    var scr = s.screen, is = {};
    ['login', 'otp', 'done', 'invite', 'expired', 'forgot', 'sent', 'reset', 'resetDone', 'verify', 'verified', 'setup', 'logout', 'denied', 'locked', 'error'].forEach(function (k) { is[k] = scr === k; });
    var validEmail = function (e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()); };
    var otpCode = s.otp.join('');
    var otp = s.otp.map(function (v, i) {
      return { v: v, label: 'Digit ' + (i + 1) + ' of 6',
        on: function (e) {
          var val = e.target.value.replace(/\D/g, '');
          var a = s.otp.slice();
          if (val.length > 1) { val.split('').slice(0, 6 - i).forEach(function (ch, k) { a[i + k] = ch; }); }
          else a[i] = val;
          self.setState({ otp: a, otpErr: '' });
          if (val && e.target.nextElementSibling) e.target.nextElementSibling.focus();
        },
        key: function (e) { if (e.key === 'Backspace' && !s.otp[i] && e.target.previousElementSibling) e.target.previousElementSibling.focus(); } };
    });
    var checkOtp = function (next) {
      if (otpCode.length < 6) { self.setState({ otpErr: 'Enter all 6 digits.' }); return; }
      if (otpCode === '000000') { self.setState({ otpErr: 'That code didn’t work. Codes change every 30 seconds — try the newest one.', otp: ['', '', '', '', '', ''] }); return; }
      next();
    };
    var rules = this.pwRules(s.npw), nOk = rules.filter(function (r) { return r.ok; }).length + (s.npw.length >= 16 ? 1 : 0);
    var strong = rules.every(function (r) { return r.ok; });
    var cpwErr = s.cpwTouched && s.cpw && s.cpw !== s.npw;
    var checkNew = function () {
      if (!strong) { self.setState({ formErr: 'Your password doesn’t meet all the requirements yet.' }); return false; }
      if (s.cpw !== s.npw) { self.setState({ formErr: 'The passwords don’t match.', cpwTouched: true }); return false; }
      return true;
    };
    var qr = [];
    for (var y = 0; y < 9; y++) for (var x = 0; x < 9; x++) {
      var finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      var on = finder ? !(x % 6 === 1 && y % 6 === 1) : ((x * 7 + y * 3 + x * y) % 3 === 0);
      qr.push(on ? '' : 'o');
    }
    var mm = Math.floor(s.count / 60), ss = s.count % 60;
    return {
      is: is, isSession: scr === 'session', notSession: scr !== 'session', sessWarn: s.sess === 'warn', sessExpired: s.sess === 'expired',
      countdown: mm + ':' + (ss < 10 ? '0' : '') + ss, expireNow: function () { self.setState({ sess: 'expired' }); },
      email: s.email, onEmail: function (e) { self.setState({ email: e.target.value, emailErr: '', loginErr: '' }); }, emailErr: s.emailErr || undefined,
      pw: s.pw, onPw: function (e) { self.setState({ pw: e.target.value, pwErr: false, loginErr: '' }); }, pwErr: s.pwErr, pwInvalid: s.pwErr ? 'true' : 'false', pwCls: s.pwErr ? 'inp err' : 'inp',
      pwType: s.showPw ? 'text' : 'password', showPw: s.showPw, pwToggleLabel: s.showPw ? 'Hide password' : 'Show password', togglePw: function () { self.setState({ showPw: !s.showPw }); },
      remember: s.remember, toggleRemember: function () { self.setState({ remember: !s.remember }); },
      loginErr: !!s.loginErr, loginErrText: s.loginErr, busy: s.busy, signLabel: s.busy ? 'Signing in…' : 'Sign in',
      submitLogin: async function (e) {
        e.preventDefault();
        var p = {};
        if (!validEmail(s.email)) p.emailErr = s.email.trim() ? 'Enter a valid email address.' : 'Enter your email address.';
        if (!s.pw) p.pwErr = true;
        if (p.emailErr || p.pwErr) { self.setState(p); return; }

        self.setState({ busy: true, loginErr: '' });
        var res = await loginAction({ email: s.email, pw: s.pw });

        if (!res.success) {
          var n = self.state.attempts + 1;
          if (n >= 5) {
            self.setState({ busy: false, attempts: 0 });
            self.to('locked');
            return;
          }
          self.setState({
            busy: false,
            attempts: n,
            pw: '',
            loginErr: res.error || ('The email or password is incorrect. ' + (5 - n) + (5 - n === 1 ? ' attempt' : ' attempts') + ' left.')
          });
          return;
        }

        self.setState({ busy: false, attempts: 0 });

        if (res.needsMfaSetup) {
          window.location.href = '/admin/two-factor/setup';
          return;
        }
        if (res.needsMfa) {
          self.setState({ factorId: res.factorId });
          self.to('otp');
          return;
        }

        var nextUrl = '/admin';
        if (typeof window !== 'undefined') {
          var sp = new URLSearchParams(window.location.search);
          var nextParam = sp.get('next');
          if (nextParam && nextParam.startsWith('/admin')) nextUrl = nextParam;
        }
        window.location.href = nextUrl;
      },
      toForgot: function () { self.to('forgot'); }, toLogin: function () { self.setState({ sess: 'warn', count: 119 }); self.to('login'); }, toReset: function () { self.to('reset'); }, toSetup: function () { self.setState({ setupStep: 'scan' }); self.to('setup'); }, toExpired: function () { self.to('expired'); }, toError: function () { self.to('error'); },
      otp: otp, otpErr: !!s.otpErr, otpErrText: s.otpErr, trust: s.trust, toggleTrust: function () { self.setState({ trust: !s.trust }); },
      useCode: !s.recovery, useRecovery: s.recovery, toRecovery: function () { self.setState({ recovery: true, otpErr: '' }); }, toCode: function () { self.setState({ recovery: false, otpErr: '' }); },
      rcode: s.rcode, onRcode: function (e) { self.setState({ rcode: e.target.value, otpErr: '' }); },
      submitOtp: async function (e) {
        e.preventDefault();
        if (otpCode.length < 6) { self.setState({ otpErr: 'Enter all 6 digits.' }); return; }
        self.setState({ busy: true, otpErr: '' });

        var res = await verifyMfaAction({ factorId: s.factorId, code: otpCode });
        if (!res.success) {
          self.setState({ busy: false, otpErr: res.error || 'The code didn’t work. Try the newest code in your authenticator app.' });
          return;
        }

        self.setState({ busy: false });
        var nextUrl = '/admin';
        if (typeof window !== 'undefined') {
          var sp = new URLSearchParams(window.location.search);
          var nextParam = sp.get('next');
          if (nextParam && nextParam.startsWith('/admin')) nextUrl = nextParam;
        }
        window.location.href = nextUrl;
      },
      submitRecovery: function (e) { e.preventDefault(); if (s.rcode.replace(/\W/g, '').length < 8) { self.setState({ otpErr: 'Enter the full recovery code, like 7KQ2-MX4P.' }); return; } self.to('done'); },
      name: s.name, onName: function (e) { self.setState({ name: e.target.value, nameErr: '' }); }, nameErr: s.nameErr || undefined,
      npw: s.npw, onNpw: function (e) { self.setState({ npw: e.target.value, formErr: '' }); }, npwCls: 'inp',
      cpw: s.cpw, onCpw: function (e) { self.setState({ cpw: e.target.value, cpwTouched: true, formErr: '' }); }, cpwErr: cpwErr, cpwCls: cpwErr ? 'inp err' : 'inp',
      strCls: nOk >= 3 ? 'strength' : 'strength weak', str: { a: nOk >= 1 ? 'on' : '', b: nOk >= 2 ? 'on' : '', c: nOk >= 3 ? 'on' : '', d: nOk >= 4 ? 'on' : '' },
      rules: rules.map(function (r) { return { label: r.label, cls: r.ok ? 'ok' : '', icon: r.ok ? 'm5 12 5 5 9-10' : 'M12 12h.01', state: r.ok ? ' (met)' : ' (not met)' }; }),
      formErr: !!s.formErr, formErrText: s.formErr,
      submitInvite: async function (e) {
        e.preventDefault();
        if (!s.name.trim()) { self.setState({ nameErr: 'Enter your full name.' }); return; }
        if (!checkNew()) return;

        self.setState({ busy: true, formErr: '' });
        var res = await acceptInviteAction({
          token: s.token,
          name: s.name.trim(),
          pw: s.npw
        });

        if (!res.success) {
          self.setState({ busy: false, formErr: res.error });
          if (res.error && (res.error.indexOf('expired') >= 0 || res.error.indexOf('invalid') >= 0)) {
            self.to('expired');
          }
          return;
        }

        self.setState({ busy: false });
        self.to('verified');
      },
      submitReset: async function (e) {
        e.preventDefault();
        if (!checkNew()) return;

        self.setState({ busy: true, formErr: '' });
        var res = await resetPasswordAction(s.npw);
        if (!res.success) {
          self.setState({ busy: false, formErr: res.error });
          return;
        }

        self.setState({ busy: false });
        self.to('resetDone');
      },
      submitForgot: async function (e) {
        e.preventDefault();
        if (!validEmail(s.email)) { self.setState({ emailErr: s.email.trim() ? 'Enter a valid email address.' : 'Enter your email address.' }); return; }
        self.setState({ busy: true, emailErr: '' });
        var res = await forgotPasswordAction(s.email);
        self.setState({ busy: false, emailShown: s.email.trim(), resendIn: 30 });
        self.to('sent');
      },
      emailShown: s.emailShown || 'your email address',
      resendDis: s.resendIn > 0, resendLabel: s.resendIn > 0 ? 'Resend in ' + s.resendIn + 's' : 'Resend',
      resend: async function () {
        if (s.emailShown) await forgotPasswordAction(s.emailShown);
        self.setState({ resendIn: 30 });
      },
      submitVerify: function (e) { e.preventDefault(); self.to('verified'); },
      setupTitle: s.setupStep === 'scan' ? 'Connect your authenticator app' : 'Save your recovery codes',
      setupScan: s.setupStep === 'scan',
      setupCodes: s.setupStep === 'codes',
      qr: qr,
      mfaQr: s.mfaQr,
      mfaSecret: s.mfaSecret,
      submitSetup: async function (e) {
        e.preventDefault();
        if (otpCode.length < 6) { self.setState({ otpErr: 'Enter all 6 digits.' }); return; }
        self.setState({ busy: true, otpErr: '' });

        var res = await confirmMfaSetupAction({ factorId: s.factorId, code: otpCode });
        if (!res.success) {
          self.setState({ busy: false, otpErr: res.error || 'Verification code failed. Try the newest one from your app.' });
          return;
        }

        var codes = self.generateRecoveryCodes();
        self.setState({
          busy: false,
          setupStep: 'codes',
          recoveryCodes: codes,
          otp: ['', '', '', '', '', '']
        });
      },
      copyLabel: s.copied ? 'Copied' : 'Copy codes', copyCodes: function () {
        var text = (self.state.recoveryCodes.length ? self.state.recoveryCodes : ['7KQ2-MX4P', 'R9TB-2LWE', 'H3VD-8NQA', 'C6YF-JP5K', 'W2MZ-4RTG', 'B8LX-QE7S', 'N5HC-9DUV', 'F4PA-T6YJ']).join('\n');
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(text);
        }
        self.setState({ copied: true });
      },
      saved: s.saved, toggleSaved: function () { self.setState({ saved: !s.saved }); },
      finishCls: s.saved ? 'btn pri blk' : 'btn pri blk dis', finishHref: '/admin', finishDis: s.saved ? 'false' : 'true',
      finishGuard: function (e) { if (!s.saved) e.preventDefault(); }
    };
  }

  render() {
    const $v: any = this.renderVals();
    return (
<>

<div className={"auth"} style={css("font-family: var(--font-ui); color: #123d32; position: relative;")}>

{!!($v?.isSession) && (<>
<div className={"ghost-app"} aria-hidden={"true"}><div className={"gs"}></div><div className={"gm"}><i style={css("height: 48px;")}></i><i></i><i style={css("height: 220px;")}></i><i></i></div></div>
<div className={"dlg-w"} style={css("position: absolute;")}><div className={"scrim"} style={css("position: absolute;")}></div>
<div className={"dlg"} role={"alertdialog"} aria-modal={"true"} aria-labelledby={"ses-t"} aria-describedby={"ses-b"}>
{!!($v?.sessWarn) && (<>
<div className={"dlg-h"}><span className={"dlg-ic warn"}><svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"13"} r={"8"} /><path d={"M12 9v4l2 2M9 2h6"} /></svg></span><h2 className={"h2"} id={"ses-t"} style={css("padding-top: 8px;")}>Are you still there?</h2></div>
<div className={"dlg-b"} id={"ses-b"}><p>For your security, you'll be signed out in <b style={css("color: #123d32;")} aria-live={"polite"}>{$v?.countdown}</b> because there has been no activity for a while.</p><p>Save your work if you're in the middle of an edit.</p></div>
<div className={"dlg-f"}><button className={"btn"} onClick={$v?.expireNow}>Sign out now</button><a className={"btn pri"} href={"/admin"}>Stay signed in</a></div>
</>)}
{!!($v?.sessExpired) && (<>
<div className={"dlg-h"}><span className={"dlg-ic"}><svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><rect x={"5"} y={"11"} width={"14"} height={"10"} rx={"2"} /><path d={"M8 11V8a4 4 0 0 1 8 0v3"} /></svg></span><h2 className={"h2"} id={"ses-t"} style={css("padding-top: 8px;")}>Your session has ended</h2></div>
<div className={"dlg-b"} id={"ses-b"}><p>You were signed out after 30 minutes without activity. Sign in again to continue. Changes you hadn't saved as a draft weren't kept.</p></div>
<div className={"dlg-f"}><button className={"btn pri"} onClick={$v?.toLogin}>Sign in again</button></div>
</>)}
</div></div>
</>)}

{!!($v?.notSession) && (<>
<aside className={"auth-art"} aria-label={"Chaitanya Keralam"}>
<span className={"ring"} aria-hidden={"true"}></span><span className={"ring r2"} aria-hidden={"true"}></span>
<div className={"auth-brand"}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /><span><b>Chaitanya Keralam</b><span>Website administration</span></span></div>
<div className={"auth-q"}><h2>Keeping the story of <em>Kerala's</em> youth, homes and hospitality up to date.</h2><p>For authorised administrators only. Accounts are created by invitation.</p></div>
<div className={"auth-meta"}><span>Learn • Practise • Create • Lead</span><span>Need help? Contact your Super Admin</span></div>
</aside>
<main className={"auth-main"}>
<div className={"auth-card"}>


{!!($v?.is?.login) && (<>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Admin sign in</p><h1 className={"h1"}>Welcome back</h1><p className={"sub"}>Sign in with the email address your invitation was sent to.</p></div>
{!!($v?.loginErr) && (<><div className={"note err"} role={"alert"}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"9"} /><path d={"M12 8v5M12 16v.5"} /></svg><span>{$v?.loginErrText}</span></div></>)}
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitLogin} noValidate={true}>
<TextField label={"Email"} type={"email"} autocomplete={"username"} value={$v?.email} onChange={$v?.onEmail} error={$v?.emailErr} />
<div className={"fld"}><span className={"lbl"}><label htmlFor={"pw-1"}>Password</label><button type={"button"} className={"rowbtn"} style={css("font-weight: 500; font-size: 13px; color: #2f6b50;")} onClick={$v?.toForgot}>Forgot password?</button></span>
<div className={"pw"}><input id={"pw-1"} className={$v?.pwCls} type={$v?.pwType} autoComplete={"current-password"} value={$v?.pw} onChange={$v?.onPw} aria-invalid={$v?.pwInvalid} aria-describedby={"pw-1-e"} /><button type={"button"} className={"ib"} aria-label={$v?.pwToggleLabel} aria-pressed={$v?.showPw} onClick={$v?.togglePw}><svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.7"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"} /><circle cx={"12"} cy={"12"} r={"3"} /></svg></button></div>
{!!($v?.pwErr) && (<><span className={"ferr"} id={"pw-1-e"}>Enter your password.</span></>)}</div>
<label className={"chk"}><input type={"checkbox"} checked={$v?.remember} onChange={$v?.toggleRemember} /><span>Keep me signed in on this device<span className={"help"} style={css("display: block;")}>Don't use on shared computers.</span></span></label>
<button className={"btn pri blk"} type={"submit"} disabled={$v?.busy}>{$v?.signLabel}</button>
</form>
<div className={"note plain"}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 12 20 4l-6 16-3-7z"} /></svg><span>There's no public sign-up. New administrators join through an invitation from a Super Admin.</span></div>

</>)}


{!!($v?.is?.otp) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><rect x={"7"} y={"3"} width={"10"} height={"18"} rx={"2"} /><path d={"M11 18h2"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Two-step verification</p><h1 className={"h1"}>Enter your 6-digit code</h1><p className={"sub"}>Open your authenticator app and enter the code for Chaitanya Keralam Admin.</p></div>
{!!($v?.otpErr) && (<><div className={"note err"} role={"alert"}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"9"} /><path d={"M12 8v5M12 16v.5"} /></svg><span>{$v?.otpErrText}</span></div></>)}
{!!($v?.useCode) && (<>
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitOtp} noValidate={true}>
<fieldset style={css("border: 0; padding: 0; margin: 0;")}><legend className={"vh"}>Verification code</legend>
<div className={"otp"}>{($v?.otp || []).map((o: any, $index: number) => (<React.Fragment key={$index}><input inputMode={"numeric"} maxLength={1} autoComplete={"one-time-code"} aria-label={o?.label} value={o?.v} onChange={o?.on} onKeyDown={o?.key} /></React.Fragment>))}</div></fieldset>
<label className={"chk"}><input type={"checkbox"} checked={$v?.trust} onChange={$v?.toggleTrust} /><span>Don't ask again on this device for 30 days</span></label>
<button className={"btn pri blk"} type={"submit"}>Verify and continue</button>
</form>
<button className={"rowbtn"} style={css("align-self: flex-start; font-weight: 500; color: #2f6b50;")} onClick={$v?.toRecovery}>Use a recovery code instead</button>
</>)}
{!!($v?.useRecovery) && (<>
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitRecovery} noValidate={true}>
<div className={"fld"}><label htmlFor={"rc"}>Recovery code</label><input id={"rc"} className={"inp mono"} placeholder={"xxxx-xxxx"} value={$v?.rcode} onChange={$v?.onRcode} style={css("font-size: 16px;")} /><span className={"help"}>Each recovery code works once. You saved them when you set up two-step verification.</span></div>
<button className={"btn pri blk"} type={"submit"}>Verify and continue</button>
</form>
<button className={"rowbtn"} style={css("align-self: flex-start; font-weight: 500; color: #2f6b50;")} onClick={$v?.toCode}>Use your authenticator app</button>
</>)}
<button className={"btn q"} style={css("align-self: flex-start;")} onClick={$v?.toLogin}>← Back to sign in</button>
<p className={"help"}>Prototype: any 6 digits work. Enter 000000 to see the error.</p>
</>)}


{!!($v?.is?.done) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"m5 12 5 5 9-10"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><h1 className={"h1"}>You're signed in</h1><p className={"sub"}>Last sign-in: 18 Oct 2026 from Kochi, on Chrome. Not you? Change your password and tell a Super Admin.</p></div>
<a className={"btn pri blk"} href={"/admin"}>Go to the dashboard</a>
</>)}


{!!($v?.is?.invite) && (<>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Invitation</p><h1 className={"h1"}>Join Chaitanya Keralam Admin</h1><p className={"sub"}><b style={css("color: #123d32;")}>Joel</b> invited you as a <b style={css("color: #123d32;")}>Content Editor</b>. You can edit pages, the homepage carousel, media and programmes (with review).</p></div>
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitInvite} noValidate={true}>
<div className={"fld"}><label htmlFor={"iv-e"}>Email</label><input id={"iv-e"} className={"inp"} value={$v?.inviteEmail || "your-email@example.org"} readOnly={true} /><span className={"help"}>Set by your invitation. It can't be changed.</span></div>
<TextField label={"Full name"} autocomplete={"name"} value={$v?.name} onChange={$v?.onName} error={$v?.nameErr} />
<div className={"fld"}><label htmlFor={"pw-n"}>Create a password</label>
<div className={"pw"}><input id={"pw-n"} className={$v?.npwCls} type={$v?.pwType} autoComplete={"new-password"} value={$v?.npw} onChange={$v?.onNpw} aria-describedby={"pw-rules"} /><button type={"button"} className={"ib"} aria-label={$v?.pwToggleLabel} aria-pressed={$v?.showPw} onClick={$v?.togglePw}><svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.7"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"} /><circle cx={"12"} cy={"12"} r={"3"} /></svg></button></div>
<div className={$v?.strCls} aria-hidden={"true"}><i className={$v?.str?.a}></i><i className={$v?.str?.b}></i><i className={$v?.str?.c}></i><i className={$v?.str?.d}></i></div>
<ul className={"rules"} id={"pw-rules"}>{($v?.rules || []).map((r: any, $index: number) => (<React.Fragment key={$index}><li className={r?.cls}><svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}><path d={r?.icon} /></svg>{r?.label}<span className={"vh"}>{r?.state}</span></li></React.Fragment>))}</ul></div>
<div className={"fld"}><label htmlFor={"pw-c"}>Confirm password</label><input id={"pw-c"} className={$v?.cpwCls} type={$v?.pwType} autoComplete={"new-password"} value={$v?.cpw} onChange={$v?.onCpw} />{!!($v?.cpwErr) && (<><span className={"ferr"}>The passwords don't match.</span></>)}</div>
{!!($v?.formErr) && (<><div className={"note err"} role={"alert"}><span>{$v?.formErrText}</span></div></>)}
<button className={"btn pri blk"} type={"submit"}>Create account</button>
</form>
<p className={"help"}>Next you'll confirm your email and set up two-step verification. This link works once and expires in 72 hours. <button className={"rowbtn"} style={css("font-size: 12px; color: #2f6b50;")} onClick={$v?.toExpired}>See the expired-link state</button></p>
</>)}

{!!($v?.is?.expired) && (<>
<div className={"big-ic warn"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"13"} r={"8"} /><path d={"M12 9v4l2 2M9 2h6"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Invitation</p><h1 className={"h1"}>This invitation link has expired</h1><p className={"sub"}>Invitation links work once and expire after 72 hours. Ask the administrator who invited you to send a new one.</p></div>
<button className={"btn blk"} onClick={$v?.toLogin}>Go to sign in</button>
</>)}


{!!($v?.is?.forgot) && (<>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Password help</p><h1 className={"h1"}>Reset your password</h1><p className={"sub"}>Enter the email address you use for this admin panel. We'll send you a link to choose a new password.</p></div>
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitForgot} noValidate={true}>
<TextField label={"Email"} type={"email"} autocomplete={"username"} value={$v?.email} onChange={$v?.onEmail} error={$v?.emailErr} />
<button className={"btn pri blk"} type={"submit"}>Send reset link</button>
</form>
<button className={"btn q"} style={css("align-self: flex-start;")} onClick={$v?.toLogin}>← Back to sign in</button>
</>)}

{!!($v?.is?.sent) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><rect x={"3"} y={"5"} width={"18"} height={"14"} rx={"2"} /><path d={"m3 7 9 6 9-6"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><h1 className={"h1"}>Check your email</h1><p className={"sub"}>If an admin account exists for <b style={css("color: #123d32;")}>{$v?.emailShown}</b>, you'll get a password reset link within a few minutes. The link expires in 30 minutes.</p></div>
<div className={"note plain"}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"9"} /><path d={"M12 11v6M12 7.5v.5"} /></svg><span>Nothing arrived? Check your spam folder, or ask a Super Admin to confirm the email on your account.</span></div>
<div className={"row"}><button className={"btn"} disabled={$v?.resendDis} onClick={$v?.resend}>{$v?.resendLabel}</button><button className={"btn q"} onClick={$v?.toLogin}>Back to sign in</button></div>
<p className={"help"}>Prototype: <button className={"rowbtn"} style={css("font-size: 12px; color: #2f6b50;")} onClick={$v?.toReset}>open the reset link</button></p>
</>)}


{!!($v?.is?.reset) && (<>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Password help</p><h1 className={"h1"}>Choose a new password</h1><p className={"sub"}>For <b style={css("color: #123d32;")}>joel@pervadorit.com</b>. Signing in on other devices will end once you save it.</p></div>
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitReset} noValidate={true}>
<div className={"fld"}><label htmlFor={"pw-r"}>New password</label>
<div className={"pw"}><input id={"pw-r"} className={$v?.npwCls} type={$v?.pwType} autoComplete={"new-password"} value={$v?.npw} onChange={$v?.onNpw} aria-describedby={"pw-rules-r"} /><button type={"button"} className={"ib"} aria-label={$v?.pwToggleLabel} aria-pressed={$v?.showPw} onClick={$v?.togglePw}><svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.7"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"} /><circle cx={"12"} cy={"12"} r={"3"} /></svg></button></div>
<div className={$v?.strCls} aria-hidden={"true"}><i className={$v?.str?.a}></i><i className={$v?.str?.b}></i><i className={$v?.str?.c}></i><i className={$v?.str?.d}></i></div>
<ul className={"rules"} id={"pw-rules-r"}>{($v?.rules || []).map((r: any, $index: number) => (<React.Fragment key={$index}><li className={r?.cls}><svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}><path d={r?.icon} /></svg>{r?.label}<span className={"vh"}>{r?.state}</span></li></React.Fragment>))}</ul></div>
<div className={"fld"}><label htmlFor={"pw-rc"}>Confirm new password</label><input id={"pw-rc"} className={$v?.cpwCls} type={$v?.pwType} autoComplete={"new-password"} value={$v?.cpw} onChange={$v?.onCpw} />{!!($v?.cpwErr) && (<><span className={"ferr"}>The passwords don't match.</span></>)}</div>
{!!($v?.formErr) && (<><div className={"note err"} role={"alert"}><span>{$v?.formErrText}</span></div></>)}
<button className={"btn pri blk"} type={"submit"}>Save new password</button>
</form>
</>)}

{!!($v?.is?.resetDone) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"m5 12 5 5 9-10"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><h1 className={"h1"}>Password updated</h1><p className={"sub"}>You've been signed out on all other devices. Sign in with your new password.</p></div>
<button className={"btn pri blk"} onClick={$v?.toLogin}>Sign in</button>
</>)}


{!!($v?.is?.verify) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><rect x={"3"} y={"5"} width={"18"} height={"14"} rx={"2"} /><path d={"m3 7 9 6 9-6"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Step 2 of 3 · Confirm your email</p><h1 className={"h1"}>Check your inbox</h1><p className={"sub"}>We sent a 6-digit code to <b style={css("color: #123d32;")}>priya@example.org</b>. Enter it below to confirm the address belongs to you.</p></div>
{!!($v?.otpErr) && (<><div className={"note err"} role={"alert"}><span>{$v?.otpErrText}</span></div></>)}
<form className={"stack"} style={css("gap: 16px;")} onSubmit={$v?.submitVerify} noValidate={true}>
<fieldset style={css("border: 0; padding: 0; margin: 0;")}><legend className={"vh"}>Email verification code</legend>
<div className={"otp"}>{($v?.otp || []).map((o: any, $index: number) => (<React.Fragment key={$index}><input inputMode={"numeric"} maxLength={1} aria-label={o?.label} value={o?.v} onChange={o?.on} onKeyDown={o?.key} /></React.Fragment>))}</div></fieldset>
<button className={"btn pri blk"} type={"submit"}>Confirm email</button>
</form>
<div className={"row"}><button className={"btn sm"} disabled={$v?.resendDis} onClick={$v?.resend}>{$v?.resendLabel}</button><span className={"help"}>The code expires in 15 minutes.</span></div>
</>)}

{!!($v?.is?.verified) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"m5 12 5 5 9-10"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Step 2 of 3</p><h1 className={"h1"}>Email confirmed</h1><p className={"sub"}>One last step: protect your account with two-step verification.</p></div>
<button className={"btn pri blk"} onClick={$v?.toSetup}>Set up two-step verification</button>
</>)}


{!!($v?.is?.setup) && (<>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Step 3 of 3 · Two-step verification</p><h1 className={"h1"}>{$v?.setupTitle}</h1></div>
{!!($v?.setupScan) && (<>
<p className={"sub"}>Scan this code with an authenticator app such as Google Authenticator, Microsoft Authenticator or 1Password.</p>
<div className={"row"} style={css("gap: 18px; align-items: flex-start;")}>
<div className={"qr"} role={"img"} aria-label={"Authenticator QR code"}>
  {$v?.mfaQr ? (
    <img src={$v?.mfaQr} alt={"QR Code"} style={css("width: 100%; height: 100%; object-fit: contain;")} />
  ) : (
    ($v?.qr || []).map((c: any, $index: number) => (<React.Fragment key={$index}><i className={c}></i></React.Fragment>))
  )}
</div>
<div className={"stack"} style={css("gap: 6px; flex: 1; min-width: 160px;")}>
  <p className={"h3"}>Can't scan it?</p>
  <p className={"small muted"}>Enter this key in your app:</p>
  <p className={"mono"} style={css("background: #f7f3e8; padding: 10px 12px; border-radius: 8px; font-size: 13px; word-break: break-all;")}>{$v?.mfaSecret || 'Generating key…'}</p>
</div>
</div>
<form className={"stack"} style={css("gap: 14px;")} onSubmit={$v?.submitSetup} noValidate={true}>
<fieldset style={css("border: 0; padding: 0; margin: 0;")}><legend className={"h3"} style={css("margin-bottom: 8px;")}>Enter the 6-digit code from the app</legend>
<div className={"otp"}>{($v?.otp || []).map((o: any, $index: number) => (<React.Fragment key={$index}><input inputMode={"numeric"} maxLength={1} aria-label={o?.label} value={o?.v} onChange={o?.on} onKeyDown={o?.key} /></React.Fragment>))}</div></fieldset>
{!!($v?.otpErr) && (<><span className={"ferr"} role={"alert"}>{$v?.otpErrText}</span></>)}
<button className={"btn pri blk"} type={"submit"}>Turn on two-step verification</button>
</form>
</>)}
{!!($v?.setupCodes) && (<>
<p className={"sub"}>Keep these recovery codes somewhere safe. Each one lets you sign in once if you lose your phone.</p>
<div className={"codes"} aria-label={"Recovery codes"}>
  {($v?.recoveryCodes || []).map((code, idx) => (
    <span key={idx}>{code}</span>
  ))}
</div>
<div className={"row"}><button className={"btn sm"} onClick={$v?.copyCodes}>{$v?.copyLabel}</button><button className={"btn sm q"} onClick={$v?.copyCodes}>Download as text</button></div>
<label className={"chk"}><input type={"checkbox"} checked={$v?.saved} onChange={$v?.toggleSaved} /><span>I've saved my recovery codes</span></label>
<a className={$v?.finishCls} href={$v?.finishHref} aria-disabled={$v?.finishDis} onClick={$v?.finishGuard}>Finish and go to the dashboard</a>
</>)}
</>)}


{!!($v?.is?.logout) && (<>
<div className={"big-ic"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}><path d={"M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><h1 className={"h1"}>You've signed out</h1><p className={"sub"}>Your session has ended on this device. If you're on a shared computer, close the browser too.</p></div>
<button className={"btn pri blk"} onClick={$v?.toLogin}>Sign in again</button>
<a className={"btn q"} style={css("align-self: flex-start;")} href={"/"} target={"_blank"} rel={"noopener"}>Go to the public website ↗</a>
</>)}


{!!($v?.is?.denied) && (<>
<div className={"big-ic warn"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><rect x={"5"} y={"11"} width={"14"} height={"10"} rx={"2"} /><path d={"M8 11V8a4 4 0 0 1 8 0v3"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Error 403</p><h1 className={"h1"}>You don't have access to this page</h1><p className={"sub"}>You're signed in as <b style={css("color: #123d32;")}>{$v?.currentUserEmail || "User"}</b> (Enquiry Manager). This page needs a different role. If you think that's wrong, ask a Super Admin.</p></div>
<div className={"row"}><a className={"btn pri"} href={"/admin"}>Go to your dashboard</a><button className={"btn"} onClick={$v?.toLogin}>Use a different account</button></div>
</>)}


{!!($v?.is?.locked) && (<>
<div className={"big-ic err"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M12 3 2 20h20Z"} /><path d={"M12 10v4M12 17v.5"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Sign-in paused</p><h1 className={"h1"}>Too many attempts</h1><p className={"sub"}>For your security, sign-in for this account is paused for 15 minutes after 5 incorrect attempts. We've emailed the account owner.</p></div>
<div className={"note plain"}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"9"} /><path d={"M12 11v6M12 7.5v.5"} /></svg><span>Forgotten your password? You can still reset it while sign-in is paused.</span></div>
<div className={"row"}><button className={"btn pri"} onClick={$v?.toForgot}>Reset password</button><button className={"btn"} onClick={$v?.toError}>Other sign-in problems</button></div>
</>)}

{!!($v?.is?.error) && (<>
<div className={"big-ic err"}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"9"} /><path d={"M12 8v5M12 16v.5"} /></svg></div>
<div className={"stack"} style={css("gap: 6px;")}><p className={"eyb"}>Something went wrong</p><h1 className={"h1"}>We couldn't sign you in</h1><p className={"sub"}>The sign-in service didn't respond. Your details weren't the problem. Try again in a moment.</p></div>
<p className={"mono muted"}>Reference: CK-AUTH-7F3A · 20 Oct 2026, 10:51</p>
<div className={"row"}><button className={"btn pri"} onClick={$v?.toLogin}>Try again</button><a className={"btn q"} href={"mailto:?subject=Admin%20sign-in%20problem%20CK-AUTH-7F3A"}>Email a Super Admin</a></div>
<p className={"help"}>Share the reference so the problem can be traced in the server logs.</p>
</>)}

</div>
</main>
</>)}
</div>
</>
    );
  }
}
