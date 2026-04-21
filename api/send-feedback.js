import { Resend } from 'resend';
import { checkRateLimit, escapeHtml } from './_utils.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FEEDBACK_TO = 'feedback@madronaproduct.com';

// Allow cross-origin from all Madrona apps
const ALLOWED = [
  'https://www.lilatrips.com',
  'https://lilatrips.com',
  'https://lilatravel.vercel.app',
  'https://utahtrip.vercel.app',
  'https://sanjuan.vercel.app',
  'https://lilayoga.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
];

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || '';
  const allowed = ALLOWED.some(ao => origin.startsWith(ao));
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  if (!allowed) return res.status(403).json({ error: 'Origin not allowed' });
  if (!checkRateLimit(req, res, 'send-feedback')) return;

  const { source, sentiment, tag, text, pathname } = req.body;

  if (!sentiment || !source) {
    return res.status(400).json({ error: 'Missing sentiment or source' });
  }

  const sentimentLabels = { loved: 'Loved it', okay: 'It was okay', off: 'Felt off' };
  const label = sentimentLabels[sentiment] || sentiment;
  const safeSource = escapeHtml(source);
  const safeTag = tag ? escapeHtml(tag) : null;
  const safeText = text ? escapeHtml(text) : null;
  const safePath = pathname ? escapeHtml(pathname) : '/';

  // Sentiment color for the email
  const sentimentColors = { loved: '#4A9B9F', okay: '#D4A853', off: '#C4875A' };
  const color = sentimentColors[sentiment] || '#666';

  const html = `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1E2825;">
      <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #5A7068; margin-bottom: 24px;">${safeSource} — User Feedback</p>

      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
        <span style="display: inline-block; padding: 4px 12px; background: ${color}18; color: ${color}; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; border-left: 3px solid ${color};">${escapeHtml(label)}</span>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        ${safeTag ? `<tr>
          <td style="padding: 8px 0; font-size: 12px; font-weight: 600; color: #7A857E; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top; width: 80px;">Tag</td>
          <td style="padding: 8px 0; font-size: 15px; color: #1E2825;">${safeTag}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; font-size: 12px; font-weight: 600; color: #7A857E; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top; width: 80px;">Page</td>
          <td style="padding: 8px 0; font-size: 15px; color: #1E2825;">${safePath}</td>
        </tr>
      </table>

      ${safeText ? `<div style="padding: 20px; background: #f5f1ea; border-left: 3px solid ${color}; margin-bottom: 24px;">
        <p style="font-size: 15px; color: #4A5650; line-height: 1.75; margin: 0; white-space: pre-wrap;">${safeText}</p>
      </div>` : '<p style="font-size: 14px; color: #7A857E; font-style: italic;">No comment provided.</p>'}
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Madrona Feedback <trips@lilatrips.com>',
      to: FEEDBACK_TO,
      subject: `[${safeSource}] Feedback — ${label}`,
      html,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend feedback error:', err);
    res.status(500).json({ error: 'Email failed to send' });
  }
}
