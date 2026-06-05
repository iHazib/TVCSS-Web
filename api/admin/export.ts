import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';

const ADMIN_KEY = process.env.ADMIN_KEY ?? 'tvcss-admin-2026';

function esc(v: unknown): string {
  if (v == null) return '';
  const s = String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? `"${s.replace(/"/g, '""')}"` : s;
}

const H_COLS = [
  'timestamp','ticket_code','team_name','leader_name','leader_student_id','leader_email',
  'campus_university','whatsapp','category','team_size','total_fee_pkr',
  'member2_name','member2_student_id','member3_name','member3_student_id',
  'member4_name','member4_student_id','member5_name','member5_student_id','payment_verified',
];

const S_COLS = ['timestamp','ticket_code','name','student_id','email','campus_org','track_type'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { type, key } = req.query as Record<string, string>;
  if (key !== ADMIN_KEY) return res.status(401).send('Unauthorized');

  if (type === 'hackathon') {
    const { data } = await supabase
      .from('hackathon_registrations')
      .select('*')
      .order('created_at', { ascending: true });

    const rows = (data ?? []).map(r =>
      [r.created_at, r.ticket_code, r.team_name, r.leader_name, r.leader_student_id,
       r.leader_email, r.campus_university, r.whatsapp, r.category, r.team_size, r.total_fee_pkr,
       r.member2_name, r.member2_student_id, r.member3_name, r.member3_student_id,
       r.member4_name, r.member4_student_id, r.member5_name, r.member5_student_id,
       r.payment_verified ? 'YES' : 'NO',
      ].map(esc).join(',')
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="hackathon_teams.csv"');
    return res.send([H_COLS.join(','), ...rows].join('\n'));
  }

  if (type === 'seminar') {
    const { data } = await supabase
      .from('seminar_registrations')
      .select('*')
      .order('created_at', { ascending: true });

    const rows = (data ?? []).map(r =>
      [r.created_at, r.ticket_code, r.name, r.student_id, r.email, r.campus_org, r.track_type]
        .map(esc).join(',')
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="seminar_attendees.csv"');
    return res.send([S_COLS.join(','), ...rows].join('\n'));
  }

  return res.status(400).send('Use ?type=hackathon or ?type=seminar');
}
