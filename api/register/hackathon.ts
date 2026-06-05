import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';

const FEES: Record<number, number> = { 1: 500, 2: 1000, 3: 1500, 4: 2000, 5: 2000 };
const genCode = () => 'CS-' + Math.floor(1000 + Math.random() * 9000) + '-TX';
const normWa  = (n: string) => n.replace(/\D/g, '').slice(-10);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { teamName, leaderName, leaderStudentId, campus, whatsapp, category, teamSize, members } = req.body;
  const leaderEmail = req.body.leaderEmail ? String(req.body.leaderEmail).toLowerCase().trim() : '';

  if (!teamName || !leaderName || !leaderStudentId || !campus || !whatsapp || !category) {
    return res.status(400).json({ error: 'All required fields must be completed.' });
  }

  // Fetch existing registrations for uniqueness checks
  const { data: existing, error: fetchErr } = await supabase
    .from('hackathon_registrations')
    .select('team_name, leader_name, leader_email, whatsapp, leader_student_id');

  if (fetchErr) {
    console.error(fetchErr);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }

  const rows = existing ?? [];

  if (rows.some(r => r.team_name.toLowerCase() === teamName.toLowerCase()))
    return res.status(409).json({ error: 'This team name is already registered. Please choose a different team name.' });
  if (rows.some(r => r.leader_name.toLowerCase() === leaderName.toLowerCase()))
    return res.status(409).json({ error: 'A registration with this leader name already exists.' });
  if (leaderEmail && rows.some(r => r.leader_email && r.leader_email.toLowerCase() === leaderEmail))
    return res.status(409).json({ error: 'This email address is already registered as a team leader.' });
  if (rows.some(r => normWa(r.whatsapp) === normWa(whatsapp)))
    return res.status(409).json({ error: 'This WhatsApp number is already registered.' });
  if (rows.some(r => r.leader_student_id.toLowerCase() === leaderStudentId.toLowerCase()))
    return res.status(409).json({ error: 'This leader Student ID is already registered.' });

  const code = genCode();
  const fee  = FEES[parseInt(teamSize)] ?? 500;
  const m    = (members as { name: string; studentId: string }[]) ?? [];

  const { error: insertErr } = await supabase.from('hackathon_registrations').insert({
    ticket_code:       code,
    team_name:         teamName,
    leader_name:       leaderName,
    leader_student_id: leaderStudentId,
    leader_email:      leaderEmail,
    campus_university: campus,
    whatsapp,
    category,
    team_size:         parseInt(teamSize),
    total_fee_pkr:     fee,
    member2_name:      m[0]?.name      ?? '',
    member2_student_id:m[0]?.studentId ?? '',
    member3_name:      m[1]?.name      ?? '',
    member3_student_id:m[1]?.studentId ?? '',
    member4_name:      m[2]?.name      ?? '',
    member4_student_id:m[2]?.studentId ?? '',
    member5_name:      m[3]?.name      ?? '',
    member5_student_id:m[3]?.studentId ?? '',
    payment_verified:  false,
  });

  if (insertErr) {
    console.error(insertErr);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }

  // Mirror leader + all members into seminar table
  const people = [
    { name: leaderName, sid: leaderStudentId, suffix: 'L' },
    ...m.filter(x => x?.name).map((x, i) => ({ name: x.name, sid: x.studentId ?? '', suffix: `M${i + 2}` })),
  ];
  for (const p of people) {
    await supabase.from('seminar_registrations').upsert({
      ticket_code: `${code}-${p.suffix}`,
      name:        p.name,
      student_id:  p.sid,
      email:       leaderEmail,
      campus_org:  campus,
      track_type:  'HACKATHON',
    }, { onConflict: 'ticket_code' });
  }

  return res.status(200).json({ success: true, ticketCode: code, fee });
}
