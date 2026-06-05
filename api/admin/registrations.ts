import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';

const ADMIN_KEY = process.env.ADMIN_KEY ?? 'tvcss-admin-2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type, key } = req.query as Record<string, string>;
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  if (type === 'hackathon') {
    const { data, error } = await supabase
      .from('hackathon_registrations')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: 'Failed to fetch data.' });

    // Map to the shape AdminPanel expects (mirrors old CSV column names)
    const mapped = (data ?? []).map(r => ({
      timestamp:          r.created_at,
      ticket_code:        r.ticket_code,
      team_name:          r.team_name,
      leader_name:        r.leader_name,
      leader_student_id:  r.leader_student_id,
      leader_email:       r.leader_email ?? '',
      campus_university:  r.campus_university,
      whatsapp:           r.whatsapp,
      category:           r.category,
      team_size:          String(r.team_size),
      total_fee_pkr:      String(r.total_fee_pkr),
      member2_name:       r.member2_name       ?? '',
      member2_student_id: r.member2_student_id ?? '',
      member3_name:       r.member3_name       ?? '',
      member3_student_id: r.member3_student_id ?? '',
      member4_name:       r.member4_name       ?? '',
      member4_student_id: r.member4_student_id ?? '',
      member5_name:       r.member5_name       ?? '',
      member5_student_id: r.member5_student_id ?? '',
      payment_verified:   r.payment_verified ? 'YES' : 'NO',
    }));

    return res.status(200).json({ data: mapped, total: mapped.length });
  }

  if (type === 'seminar') {
    const { data, error } = await supabase
      .from('seminar_registrations')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: 'Failed to fetch data.' });

    const mapped = (data ?? []).map(r => ({
      timestamp:   r.created_at,
      ticket_code: r.ticket_code,
      name:        r.name,
      student_id:  r.student_id  ?? '',
      email:       r.email       ?? '',
      campus_org:  r.campus_org,
      track_type:  r.track_type,
    }));

    return res.status(200).json({ data: mapped, total: mapped.length });
  }

  return res.status(400).json({ error: 'Use ?type=hackathon or ?type=seminar' });
}
