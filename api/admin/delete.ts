import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';

const ADMIN_KEY = process.env.ADMIN_KEY ?? 'tvcss-admin-2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key, ticketCode, type } = req.body as { key: string; ticketCode: string; type: 'hackathon' | 'seminar' };
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  if (!ticketCode || !type) return res.status(400).json({ error: 'ticketCode and type are required.' });

  if (type === 'hackathon') {
    // Delete the hackathon team
    const { error: hErr } = await supabase
      .from('hackathon_registrations')
      .delete()
      .eq('ticket_code', ticketCode);
    if (hErr) { console.error(hErr); return res.status(500).json({ error: 'Failed to delete hackathon record.' }); }

    // Also delete their mirrored seminar entries (ticket codes like CS-XXXX-TX-L, -M2 …)
    const { error: sErr } = await supabase
      .from('seminar_registrations')
      .delete()
      .like('ticket_code', `${ticketCode}-%`);
    if (sErr) console.error('Seminar mirror delete failed (non-fatal):', sErr);

    return res.status(200).json({ success: true });
  }

  if (type === 'seminar') {
    const { error } = await supabase
      .from('seminar_registrations')
      .delete()
      .eq('ticket_code', ticketCode);
    if (error) { console.error(error); return res.status(500).json({ error: 'Failed to delete seminar record.' }); }
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'type must be hackathon or seminar.' });
}
