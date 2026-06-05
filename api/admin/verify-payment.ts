import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';
import { sendConfirmationEmail } from '../../lib/email.js';

const ADMIN_KEY = process.env.ADMIN_KEY ?? 'tvcss-admin-2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key, ticketCode } = req.body as { key: string; ticketCode: string };
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const { data: rows, error: fetchErr } = await supabase
    .from('hackathon_registrations')
    .select('*')
    .eq('ticket_code', ticketCode)
    .limit(1);

  if (fetchErr || !rows || rows.length === 0)
    return res.status(404).json({ error: 'Registration not found.' });

  const row = rows[0];

  const { error: updateErr } = await supabase
    .from('hackathon_registrations')
    .update({ payment_verified: true })
    .eq('ticket_code', ticketCode);

  if (updateErr) {
    console.error(updateErr);
    return res.status(500).json({ error: 'Failed to update payment status.' });
  }

  const emailAddr = row.leader_email ?? '';
  let emailSent = false;
  if (emailAddr) {
    emailSent = await sendConfirmationEmail(emailAddr, {
      name:        row.leader_name,
      ticketCode:  row.ticket_code,
      teamName:    row.team_name,
      fee:         String(row.total_fee_pkr),
      isHackathon: true,
    });
  }

  return res.status(200).json({ success: true, emailSent, emailAddr: emailAddr || null });
}
