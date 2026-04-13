import { Resend } from 'resend';
import { checkOrigin, checkRateLimit, escapeHtml, isSafeUrl, isValidEmail } from './_utils.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'send-trip-email')) return;

  const { email, itineraryUrl, mode, itineraryTitle } = req.body;

  if (!email || !itineraryUrl) {
    return res.status(400).json({ error: 'Missing email or itineraryUrl' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!isSafeUrl(itineraryUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const safeTitle = escapeHtml(itineraryTitle);
  const safeUrl = escapeHtml(itineraryUrl);
  const isSave = mode === 'save';

  const subject = isSave
    ? `Your Lila Trips itinerary — ${safeTitle || 'pick up where you left off'}`
    : `Someone shared a Lila Trips itinerary with you`;

  const html = isSave ? `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #1E2825;">
      <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #5A7068; margin-bottom: 24px;">Lila Trips</p>
      <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; line-height: 1.3;">${safeTitle || 'Your itinerary is waiting'}</h1>
      <p style="font-size: 15px; color: #4A5650; line-height: 1.75; margin-bottom: 32px;">
        Your trip is saved. Come back anytime to keep refining — your progress is right where you left it.
      </p>
      <a href="${safeUrl}" style="display: inline-block; background: #1E2825; color: #FAF8F4; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; text-decoration: none; border-radius: 2px;">
        Open my itinerary →
      </a>
      <p style="font-size: 12px; color: #7A857E; margin-top: 40px; line-height: 1.6;">
        Or copy this link: <a href="${safeUrl}" style="color: #4A8C85;">${safeUrl}</a>
      </p>
    </div>
  ` : `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #1E2825;">
      <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #5A7068; margin-bottom: 24px;">Lila Trips</p>
      <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; line-height: 1.3;">Someone shared a trip with you</h1>
      <p style="font-size: 15px; color: #4A5650; line-height: 1.75; margin-bottom: 32px;">
        ${safeTitle ? `"${safeTitle}" —` : ''} take a look and see what's been put together.
      </p>
      <a href="${safeUrl}" style="display: inline-block; background: #1E2825; color: #FAF8F4; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; text-decoration: none; border-radius: 2px;">
        View itinerary →
      </a>
      <p style="font-size: 12px; color: #7A857E; margin-top: 40px; line-height: 1.6;">
        Or copy this link: <a href="${safeUrl}" style="color: #4A8C85;">${safeUrl}</a>
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Lila Trips <trips@lilatrips.com>',
      to: email,
      subject,
      html,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Email failed to send' });
  }
}
