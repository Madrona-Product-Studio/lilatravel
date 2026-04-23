import { createClient } from '@supabase/supabase-js';
import { checkOrigin } from './_utils.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkOrigin(req, res)) return;

  const { userId, shareTokens } = req.body || {};

  if (!userId || !Array.isArray(shareTokens) || shareTokens.length === 0) {
    return res.status(400).json({ error: 'userId and shareTokens required' });
  }

  // Validate userId is a UUID
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  // Limit to 20 tokens per call
  const tokens = shareTokens.slice(0, 20).filter(t => typeof t === 'string' && uuidRe.test(t));
  if (tokens.length === 0) {
    return res.status(400).json({ error: 'No valid share tokens' });
  }

  try {
    // Find itineraries by share_token that don't already have a user_id
    const { data: itineraries, error: fetchErr } = await supabase
      .from('itineraries')
      .select('id, session_id')
      .in('share_token', tokens)
      .is('user_id', null);

    if (fetchErr) throw fetchErr;
    if (!itineraries || itineraries.length === 0) {
      return res.status(200).json({ claimed: 0 });
    }

    const itineraryIds = itineraries.map(i => i.id);
    const sessionIds = [...new Set(itineraries.map(i => i.session_id))];

    // Claim itineraries
    const { error: claimErr } = await supabase
      .from('itineraries')
      .update({ user_id: userId })
      .in('id', itineraryIds);

    if (claimErr) throw claimErr;

    // Claim their parent sessions too
    if (sessionIds.length > 0) {
      await supabase
        .from('sessions')
        .update({ user_id: userId })
        .in('id', sessionIds)
        .is('user_id', null);
    }

    return res.status(200).json({ claimed: itineraryIds.length });
  } catch (e) {
    console.error('claim-trips error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
