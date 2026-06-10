import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';
import { sendReminderEmail } from '../../lib/email.js';

const ADMIN_KEY = process.env.ADMIN_KEY ?? 'tvcss-admin-2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key, ticketCode, type } = req.body as {
    key: string;
    ticketCode: string;
    type: 'oncampus' | 'offcampus';
  };

  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  if (!ticketCode || !type) return res.status(400).json({ error: 'ticketCode and type are required' });
  if (type !== 'oncampus' && type !== 'offcampus') return res.status(400).json({ error: 'type must be oncampus or offcampus' });

  const { data, error } = await supabase
    .from('hackathon_registrations')
    .select('leader_name, leader_email, team_name, payment_verified')
    .eq('ticket_code', ticketCode)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Registration not found' });
  if (!data.payment_verified) return res.status(400).json({ error: 'Team has not paid — reminder not sent' });
  if (!data.leader_email) return res.status(400).json({ error: 'No email on file for this team' });

  const sent = await sendReminderEmail(
    data.leader_email,
    type,
    data.leader_name,
    data.team_name,
    ticketCode,
  );

  if (!sent) return res.status(500).json({ error: 'Email failed — check EMAIL_USER / EMAIL_PASS env vars' });

  return res.status(200).json({ ok: true, emailAddr: data.leader_email });
}
