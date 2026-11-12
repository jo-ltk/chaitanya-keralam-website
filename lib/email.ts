import { Resend } from 'resend';
import { enquiryNotificationTemplate, inviteTemplate } from './email-templates';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Sender must be on the domain verified in Resend (keralapeacetourism.in).
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Chaitanya Keralam <noreply@keralapeacetourism.in>';
const adminEmail = process.env.RESEND_ADMIN_EMAIL || 'aniljoseph2027@gmail.com';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.keralapeacetourism.in').replace(/\/$/, '');

export async function sendInviteEmail({
  to,
  role,
  inviteUrl,
}: {
  to: string;
  role: string;
  inviteUrl: string;
}) {
  if (!resend) return { success: false, error: 'Resend not configured' };

  try {
    const roleName = role === 'super' ? 'Super Administrator' : role === 'editor' ? 'Content Editor' : 'Enquiry Manager';
    const { subject, html, text } = inviteTemplate({ siteUrl, roleName, inviteUrl });
    const { data, error } = await resend.emails.send({ from: fromEmail, to, subject, html, text });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

export async function sendEnquiryNotification({
  type,
  subType,
  name,
  email,
  phone,
  district,
  message,
}: {
  type: string;
  subType?: string;
  name: string;
  email: string;
  phone?: string;
  district?: string;
  message: string;
}) {
  if (!resend) return { success: false, error: 'Resend not configured' };

  try {
    const cleanName = name.replace(/\s+/g, ' ').trim();
    const { subject, html, text } = enquiryNotificationTemplate({
      siteUrl,
      type,
      subType,
      name: cleanName,
      email,
      phone,
      district,
      message,
    });
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
