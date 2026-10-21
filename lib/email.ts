import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const adminEmail = process.env.RESEND_ADMIN_EMAIL || 'aniljoseph2027@gmail.com';

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
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'You have been invited to Chaitanya Keralam Admin',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #23221e; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1a4d2e;">Chaitanya Keralam</h2>
          <p>Hello,</p>
          <p>You have been invited to join the <strong>Chaitanya Keralam Admin Panel</strong> as a <strong>${roleName}</strong>.</p>
          <p style="margin: 28px 0;">
            <a href="${inviteUrl}" style="background-color: #1a4d2e; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Accept Invitation & Set Password
            </a>
          </p>
          <p style="color: #666; font-size: 13px;">This invitation link will expire in 48 hours. If you were not expecting this invitation, you can ignore this email.</p>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

export async function sendEnquiryNotification({
  type,
  name,
  email,
  phone,
  message,
}: {
  type: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  if (!resend) return { success: false, error: 'Resend not configured' };

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Enquiry Received: ${type.toUpperCase()} from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #23221e; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h3 style="color: #1a4d2e;">New Website Enquiry</h3>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f7f3e8; border-left: 4px solid #1a4d2e; padding: 12px; margin: 12px 0;">
            ${message.replace(/\n/g, '<br/>')}
          </blockquote>
          <p><a href="https://chaitanyakeralam.org/admin/enquiries">View in Admin Panel</a></p>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
