// Email templates. Visual values come from docs/LANDING-PAGE-DESIGN-SYSTEM.md (Part 4):
// paper / ink / night palette, Albert Sans 300-500, square corners, hairline rows, no accent colours.
// Email clients ignore CSS variables and most <style> rules, so tokens are inlined as literals.

const T = {
  paper: '#fbfaf7',
  paper2: '#f2efe8',
  ink: '#111613',
  inkMuted: '#5a625d',
  line: '#dedad1',
  night: '#070d0b',
  forest: '#0b3d24',
  on: '#ffffff',
  onMuted: 'rgba(255,255,255,0.78)',
  font: "'Albert Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Row = { label: string; value: string; href?: string };

function rows(items: Row[]) {
  return items
    .map(
      (r) => `
      <tr>
        <td class="ck-label" style="padding:14px 0;border-top:1px solid ${T.line};font:400 14px/1.4 ${T.font};color:${T.inkMuted};width:132px;vertical-align:top;">${escapeHtml(r.label)}</td>
        <td class="ck-value" style="padding:14px 0;border-top:1px solid ${T.line};font:400 16px/1.5 ${T.font};color:${T.ink};vertical-align:top;">${
          r.href
            ? `<a href="${escapeHtml(r.href)}" style="color:${T.ink};text-decoration:underline;">${escapeHtml(r.value)}</a>`
            : escapeHtml(r.value)
        }</td>
      </tr>`,
    )
    .join('');
}

function button(label: string, href: string) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="background:${T.ink};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:17px 26px;font:500 15px/1 ${T.font};letter-spacing:0.01em;color:${T.paper};text-decoration:none;">${escapeHtml(label)}&nbsp;&nbsp;&rarr;</a>
    </td>
  </tr></table>`;
}

function textLink(label: string, href: string) {
  return `<a href="${escapeHtml(href)}" style="font:400 16px/22px ${T.font};color:${T.ink};text-decoration:underline;">${escapeHtml(label)}&nbsp;&rarr;</a>`;
}

function layout({
  siteUrl,
  preheader,
  kicker,
  title,
  body,
}: {
  siteUrl: string;
  preheader: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  @media (max-width: 600px) {
    .ck-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .ck-title { font-size: 30px !important; line-height: 1.1 !important; }
    .ck-label { display: block !important; width: auto !important; padding-bottom: 2px !important; }
    .ck-value { display: block !important; border-top: 0 !important; padding-top: 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${T.paper2};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${T.paper2};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${T.paper};">

      <!-- Header -->
      <tr><td class="ck-pad" style="padding:28px 40px;border-bottom:1px solid ${T.line};">
        <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle;"><img src="${escapeHtml(siteUrl)}/assets/logo.png" width="44" height="44" alt="" style="display:block;border:0;"></td>
            <td style="vertical-align:middle;padding-left:12px;font:500 18px/1.2 ${T.font};color:${T.ink};letter-spacing:-0.01em;">Chaitanya Keralam</td>
          </tr></table>
        </a>
      </td></tr>

      <!-- Title -->
      <tr><td class="ck-pad" style="padding:44px 40px 8px;">
        <div style="font:500 12px/16px ${T.font};letter-spacing:0.16em;text-transform:uppercase;color:${T.inkMuted};">${escapeHtml(kicker)}</div>
        <h1 class="ck-title" style="margin:14px 0 0;font:400 38px/1.06 ${T.font};letter-spacing:-0.015em;color:${T.ink};">${escapeHtml(title)}</h1>
      </td></tr>

      <!-- Body -->
      <tr><td class="ck-pad" style="padding:20px 40px 48px;">${body}</td></tr>

      <!-- Footer -->
      <tr><td class="ck-pad" style="background:${T.night};padding:36px 40px;">
        <div style="font:300 22px/1.35 ${T.font};color:${T.onMuted};">One with nature.</div>
        <div style="margin-top:6px;font:500 12px/16px ${T.font};letter-spacing:0.16em;text-transform:uppercase;color:${T.onMuted};">Eco-Spiritual Peace Tourism</div>
        <div style="margin-top:24px;font:400 13px/1.5 ${T.font};color:${T.onMuted};">
          <a href="${escapeHtml(siteUrl)}" style="color:${T.on};text-decoration:underline;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function detailTable(items: Row[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid ${T.line};">${rows(items)}</table>`;
}

const ENQUIRY_TYPE_LABELS: Record<string, string> = {
  admission: 'Admission',
  tesh: 'TESH Homes',
  partner: 'Partnership',
  contact: 'General contact',
};

export function enquiryTypeLabel(type: string) {
  return ENQUIRY_TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

export function enquiryNotificationTemplate({
  siteUrl,
  type,
  subType,
  name,
  email,
  phone,
  district,
  message,
  receivedAt = new Date(),
}: {
  siteUrl: string;
  type: string;
  subType?: string;
  name: string;
  email: string;
  phone?: string;
  district?: string;
  message: string;
  receivedAt?: Date;
}) {
  const typeLabel = enquiryTypeLabel(type);
  const when = receivedAt.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const details: Row[] = [
    { label: 'Name', value: name },
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'Phone', value: phone || 'Not provided', href: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined },
    ...(subType ? [{ label: 'Interested in', value: subType }] : []),
    ...(district ? [{ label: 'District', value: district }] : []),
    { label: 'Received', value: `${when} IST` },
  ];

  const messageBlock = message.trim()
    ? `
      <div style="margin-top:36px;font:500 12px/16px ${T.font};letter-spacing:0.16em;text-transform:uppercase;color:${T.inkMuted};">Message</div>
      <div style="margin-top:12px;padding:20px 22px;background:${T.paper2};font:400 16px/1.6 ${T.font};color:${T.ink};">${escapeHtml(message.trim()).replace(/\n/g, '<br>')}</div>`
    : '';

  const replySubject = `Re: Your ${typeLabel.toLowerCase()} enquiry with Chaitanya Keralam`;
  const body = `
    <p style="margin:0 0 28px;font:300 18px/1.55 ${T.font};color:${T.inkMuted};">${escapeHtml(name)} sent an enquiry through the website. Reply to this email to answer them directly.</p>
    ${detailTable(details)}
    ${messageBlock}
    <div style="margin-top:36px;">${button(`Reply to ${name.split(' ')[0]}`, `mailto:${email}?subject=${encodeURIComponent(replySubject)}`)}</div>
    <div style="margin-top:22px;">${textLink('Open in admin panel', `${siteUrl}/admin/enquiries`)}</div>`;

  const html = layout({
    siteUrl,
    preheader: `${typeLabel} enquiry from ${name}${message ? `: ${message.slice(0, 90)}` : ''}`,
    kicker: `New enquiry · ${typeLabel}`,
    title: `${name} wants to hear from you`,
    body,
  });

  const text = [
    `New ${typeLabel} enquiry`,
    '',
    ...details.map((d) => `${d.label}: ${d.value}`),
    ...(message.trim() ? ['', 'Message:', message.trim()] : []),
    '',
    `Open in admin panel: ${siteUrl}/admin/enquiries`,
  ].join('\n');

  return { subject: `New ${typeLabel} enquiry from ${name}`, html, text };
}

export function inviteTemplate({
  siteUrl,
  roleName,
  inviteUrl,
}: {
  siteUrl: string;
  roleName: string;
  inviteUrl: string;
}) {
  const body = `
    <p style="margin:0 0 28px;font:300 18px/1.55 ${T.font};color:${T.inkMuted};">You have been invited to the Chaitanya Keralam admin panel. Accept the invitation to set your password and sign in.</p>
    ${detailTable([{ label: 'Role', value: roleName }, { label: 'Expires', value: 'In 48 hours' }])}
    <div style="margin-top:36px;">${button('Accept invitation', inviteUrl)}</div>
    <p style="margin:28px 0 0;font:400 14px/1.5 ${T.font};color:${T.inkMuted};">If the button doesn't work, copy this link into your browser:<br><a href="${escapeHtml(inviteUrl)}" style="color:${T.ink};word-break:break-all;">${escapeHtml(inviteUrl)}</a></p>
    <p style="margin:20px 0 0;font:400 14px/1.5 ${T.font};color:${T.inkMuted};">Not expecting this? You can ignore this email.</p>`;

  const html = layout({
    siteUrl,
    preheader: `You've been invited to join as ${roleName}.`,
    kicker: 'Admin invitation',
    title: 'Join the Chaitanya Keralam team',
    body,
  });

  const text = [
    'You have been invited to the Chaitanya Keralam admin panel.',
    '',
    `Role: ${roleName}`,
    'Expires: in 48 hours',
    '',
    `Accept the invitation: ${inviteUrl}`,
    '',
    "Not expecting this? You can ignore this email.",
  ].join('\n');

  return { subject: 'You have been invited to Chaitanya Keralam Admin', html, text };
}
