import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';

const genCode = () => 'CS-' + Math.floor(1000 + Math.random() * 9000) + '-TX';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, studentId, campusOrg } = req.body;
  const email = req.body.email ? String(req.body.email).toLowerCase().trim() : '';

  if (!name || !campusOrg) return res.status(400).json({ error: 'Name and Campus/Org are required.' });

  if (studentId) {
    const { data } = await supabase
      .from('seminar_registrations')
      .select('student_id')
      .ilike('student_id', studentId)
      .limit(1);
    if (data && data.length > 0)
      return res.status(409).json({ error: 'This Student ID is already registered for the seminar.' });
  }

  const code = genCode();
  const { error } = await supabase.from('seminar_registrations').insert({
    ticket_code: code,
    name,
    student_id:  studentId ?? '',
    email,
    campus_org:  campusOrg,
    track_type:  'SEMINAR_ONLY',
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }

  return res.status(200).json({ success: true, ticketCode: code });
}
