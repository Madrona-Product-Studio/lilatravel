import { Resend } from 'resend';
import { checkOrigin, escapeHtml } from './_utils.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!checkOrigin(req, res)) return;

  const { name, email, category, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing email or message' });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCategory = escapeHtml(category) || 'General';
  const safeMessage = escapeHtml(message);

  const html = `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1E2825;">
      <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #5A7068; margin-bottom: 24px;">Lila Trips — Contact Form</p>
      <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 20px; line-height: 1.3;">${safeCategory}</h1>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; font-weight: 600; color: #7A857E; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top; width: 80px;">From</td>
          <td style="padding: 8px 0; font-size: 15px; color: #1E2825;">${safeName || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; font-weight: 600; color: #7A857E; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Email</td>
          <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${safeEmail}" style="color: #4A8C85;">${safeEmail}</a></td>
        </tr>
      </table>
      <div style="padding: 20px; background: #f5f1ea; border-left: 3px solid #D4A853; margin-bottom: 24px;">
        <p style="font-size: 15px; color: #4A5650; line-height: 1.75; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
      </div>
      <p style="font-size: 12px; color: #7A857E; line-height: 1.6;">
        Reply directly to this email to respond to ${safeName || 'the sender'}.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Lila Trips <trips@lilatrips.com>',
      to: 'charlie.koch@gmail.com',
      replyTo: email,
      subject: `[Lila Trips] ${safeCategory} — ${safeName || 'New message'}`,
      html,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend contact error:', err);
    res.status(500).json({ error: 'Email failed to send' });
  }
}
