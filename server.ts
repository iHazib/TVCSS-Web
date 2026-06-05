import express        from 'express';
import fs             from 'fs';
import path           from 'path';
import { fileURLToPath } from 'url';
import dotenv         from 'dotenv';
import nodemailer     from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app        = express();
const PORT       = parseInt(process.env.API_PORT ?? '3001', 10);
const ADMIN_KEY  = process.env.ADMIN_KEY ?? 'tvcss-admin-2026';

app.use(express.json());

// CORS — allow the Vercel frontend (and any origin in dev)
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN ?? '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// ── CSV storage ───────────────────────────────────────────────────────────────

const DATA_DIR       = path.join(__dirname, 'registrations');
const HACKATHON_FILE = path.join(DATA_DIR, 'hackathon.csv');
const SEMINAR_FILE   = path.join(DATA_DIR, 'seminar.csv');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const H_COLS = [
  'timestamp', 'ticket_code',
  'team_name', 'leader_name', 'leader_student_id', 'leader_email',
  'campus_university', 'whatsapp', 'category',
  'team_size', 'total_fee_pkr',
  'member2_name', 'member2_student_id',
  'member3_name', 'member3_student_id',
  'member4_name', 'member4_student_id',
  'member5_name', 'member5_student_id',
  'payment_verified',
];

const S_COLS = [
  'timestamp', 'ticket_code', 'name', 'student_id', 'email', 'campus_org', 'track_type',
];

// ── CSV helpers ───────────────────────────────────────────────────────────────

function esc(v: unknown): string {
  if (v == null) return '';
  const s = String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? `"${s.replace(/"/g, '""')}"` : s;
}

function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = '', q = false;
  for (const ch of line) {
    if (ch === '"') { q = !q; }
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

function readRows(file: string): string[][] {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(parseLine);
}

// Convert rows (excluding header) to array-of-objects using column definitions
function rowsToObjects(file: string, cols: string[]): Record<string, string>[] {
  const rows = readRows(file);
  if (rows.length === 0) return [];
  return rows.slice(1).map(row => {
    const obj: Record<string, string> = {};
    cols.forEach((col, i) => { obj[col] = row[i] ?? ''; });
    return obj;
  });
}

function ensureHeader(file: string, cols: string[]) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, cols.join(',') + '\n');
    return;
  }
  // Migrate if schema changed (e.g. new column added)
  const rows = readRows(file);
  if (rows.length === 0) { fs.writeFileSync(file, cols.join(',') + '\n'); return; }
  const existingCols = rows[0];
  if (existingCols.join(',') === cols.join(',')) return; // already up-to-date

  // Remap existing data rows to new column order
  const migrated = rows.slice(1).map(row => {
    const obj: Record<string, string> = {};
    existingCols.forEach((c, i) => { obj[c] = row[i] ?? ''; });
    return cols.map(c => esc(obj[c] ?? ''));
  });
  const lines = [cols.join(','), ...migrated.map(r => r.join(','))];
  fs.writeFileSync(file, lines.join('\n') + '\n');
  console.log(`  [migration] ${path.basename(file)}: added columns ${cols.filter(c => !existingCols.includes(c)).join(', ')}`);
}

function append(file: string, vals: unknown[]) {
  fs.appendFileSync(file, vals.map(esc).join(',') + '\n');
}

// Rewrite whole CSV from objects
function writeObjects(file: string, cols: string[], objs: Record<string, string>[]) {
  const lines = [
    cols.join(','),
    ...objs.map(o => cols.map(c => esc(o[c] ?? '')).join(',')),
  ];
  fs.writeFileSync(file, lines.join('\n') + '\n');
}

function genCode() { return 'CS-' + Math.floor(1000 + Math.random() * 9000) + '-TX'; }

const FEES: Record<number, number> = { 1:500, 2:1000, 3:1500, 4:2000, 5:2000 };

// ── Email ─────────────────────────────────────────────────────────────────────

const transporter = (process.env.EMAIL_USER && process.env.EMAIL_PASS)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  : null;

function emailHTML(p: {
  name: string; ticketCode: string;
  teamName?: string; fee?: string; isHackathon: boolean;
}): string {
  const { name, ticketCode, teamName, fee, isHackathon } = p;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#0a0b0e;font-family:'Courier New',Courier,monospace;">
<div style="max-width:560px;margin:0 auto;">

  <div style="border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:18px;margin-bottom:24px;">
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#39FF14;">TVCSS // Tech Visionary CS Society</p>
    <p style="margin:0;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);">DHA Suffa University DCK · 2025-26</p>
  </div>

  <div style="border:1px solid rgba(57,255,20,.3);background:rgba(57,255,20,.05);padding:16px 20px;margin-bottom:22px;">
    <p style="margin:0 0 5px;font-size:13px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;color:#39FF14;">✓ Payment Verified</p>
    <p style="margin:0;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);">Your Code-Storm 2026 registration is confirmed</p>
  </div>

  <p style="margin:0 0 18px;font-size:13px;color:rgba(255,255,255,.8);">Hello ${name},</p>
  <p style="margin:0 0 22px;font-size:11px;line-height:1.7;color:rgba(255,255,255,.5);">
    Your payment has been verified by the TVCSS team. You are officially registered for Code-Storm 2026!
  </p>

  <div style="border:1px solid rgba(255,255,255,.1);margin-bottom:22px;">
    <div style="background:rgba(255,255,255,.04);padding:9px 16px;border-bottom:1px solid rgba(255,255,255,.08);">
      <p style="margin:0;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.38);">Registration Details</p>
    </div>
    <div style="padding:14px 16px;">
      <table width="100%" style="border-collapse:collapse;font-size:11px;">
        <tr>
          <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;font-size:9px;">Ticket Code</td>
          <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);text-align:right;color:#fcd34d;font-weight:bold;font-size:15px;letter-spacing:.15em;">${ticketCode}</td>
        </tr>
        ${teamName ? `<tr>
          <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;font-size:9px;">Team</td>
          <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);text-align:right;color:#e5e5e5;text-transform:uppercase;">${teamName}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;font-size:9px;">Track</td>
          <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);text-align:right;color:#e5e5e5;text-transform:uppercase;">${isHackathon ? 'Hackathon + Seminar (Included)' : 'Seminar Only'}</td>
        </tr>
        ${fee ? `<tr>
          <td style="padding:7px 0;color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;font-size:9px;">Amount Paid</td>
          <td style="padding:7px 0;text-align:right;color:#FF4500;font-weight:bold;text-transform:uppercase;">PKR ${parseInt(fee).toLocaleString()}</td>
        </tr>` : ''}
      </table>
    </div>
  </div>

  <div style="border:1px solid rgba(103,232,249,.18);background:rgba(103,232,249,.04);margin-bottom:22px;">
    <div style="border-bottom:1px solid rgba(103,232,249,.12);padding:9px 16px;">
      <p style="margin:0;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#67e8f9;">Event Schedule</p>
    </div>
    <div style="padding:14px 16px;font-size:10px;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.08em;line-height:1.8;">
      <p style="margin:0 0 8px;"><span style="color:#fcd34d;">Day 1 — Wed, Jun 10</span> · 12:00–1:30 PM · Seminar &amp; Orientation</p>
      ${isHackathon ? `<p style="margin:0 0 8px;"><span style="color:#fcd34d;">Day 2 — Thu, Jun 11</span> · 12:00–1:30 PM · Hackathon Track 1</p>
      <p style="margin:0 0 8px;"><span style="color:#fcd34d;">Day 3 — Mon, Jun 15</span> · 12:00–2:30 PM · Showcase &amp; Winner Ceremony</p>` : ''}
      <p style="margin:8px 0 0;color:rgba(255,255,255,.3);">📍 DSU DCK Campus, Karachi</p>
    </div>
  </div>

  <div style="border-top:1px solid rgba(255,255,255,.08);padding-top:16px;">
    <p style="margin:0;font-size:9px;color:rgba(255,255,255,.22);text-transform:uppercase;letter-spacing:.08em;">
      © 2026 Tech Visionary Computer Science Society · DHA Suffa University DCK · Automated message, do not reply.
    </p>
  </div>
</div></body></html>`;
}

// ── POST /api/register/hackathon ──────────────────────────────────────────────

app.post('/api/register/hackathon', (req, res) => {
  try {
    ensureHeader(HACKATHON_FILE, H_COLS);
    ensureHeader(SEMINAR_FILE,   S_COLS);

    const { teamName, leaderName, leaderStudentId,
            campus, whatsapp, category, teamSize, members } = req.body;
    const leaderEmail = req.body.leaderEmail ? (req.body.leaderEmail as string).toLowerCase().trim() : '';

    if (!teamName || !leaderName || !leaderStudentId || !campus || !whatsapp || !category) {
      return res.status(400).json({ error: 'All required fields must be completed.' });
    }

    const existing = rowsToObjects(HACKATHON_FILE, H_COLS);

    // Normalise WA number to last 10 digits for duplicate detection
    const normWa = (n: string) => n.replace(/\D/g, '').slice(-10);

    if (existing.some(r => r.team_name.toLowerCase() === teamName.toLowerCase()))
      return res.status(409).json({ error: 'This team name is already registered. Please choose a different team name.' });
    if (existing.some(r => r.leader_name.toLowerCase() === leaderName.toLowerCase()))
      return res.status(409).json({ error: 'A registration with this leader name already exists.' });
    if (leaderEmail && existing.some(r => r.leader_email.toLowerCase() === leaderEmail.toLowerCase()))
      return res.status(409).json({ error: 'This email address is already registered as a team leader.' });
    if (existing.some(r => normWa(r.whatsapp) === normWa(whatsapp)))
      return res.status(409).json({ error: 'This WhatsApp number is already registered.' });
    if (existing.some(r => r.leader_student_id.toLowerCase() === leaderStudentId.toLowerCase()))
      return res.status(409).json({ error: 'This leader Student ID is already registered.' });

    const code = genCode();
    const fee  = FEES[parseInt(teamSize)] ?? 500;
    const ts   = new Date().toISOString();
    const m    = (members as { name: string; studentId: string }[]) ?? [];

    append(HACKATHON_FILE, [
      ts, code, teamName, leaderName, leaderStudentId, leaderEmail ?? '',
      campus, whatsapp, category, teamSize, fee,
      m[0]?.name ?? '', m[0]?.studentId ?? '',
      m[1]?.name ?? '', m[1]?.studentId ?? '',
      m[2]?.name ?? '', m[2]?.studentId ?? '',
      m[3]?.name ?? '', m[3]?.studentId ?? '',
      'NO',
    ]);

    // Mirror all team members into seminar CSV
    const semObjs = rowsToObjects(SEMINAR_FILE, S_COLS);
    const people  = [
      { name: leaderName, sid: leaderStudentId },
      ...m.filter(x => x?.name).map(x => ({ name: x.name, sid: x.studentId ?? '' })),
    ];
    for (const p of people) {
      const dup = p.sid && semObjs.some(r => r.student_id.toLowerCase() === p.sid.toLowerCase());
      if (!dup) append(SEMINAR_FILE, [ts, code, p.name, p.sid, leaderEmail ?? '', campus, 'HACKATHON']);
    }

    return res.json({ success: true, ticketCode: code, fee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── POST /api/register/seminar ────────────────────────────────────────────────

app.post('/api/register/seminar', (req, res) => {
  try {
    ensureHeader(SEMINAR_FILE, S_COLS);

    const { name, studentId, campusOrg } = req.body;
    const email = req.body.email ? (req.body.email as string).toLowerCase().trim() : '';
    if (!name || !campusOrg) return res.status(400).json({ error: 'Name and Campus/Org are required.' });

    const existing = rowsToObjects(SEMINAR_FILE, S_COLS);
    if (studentId && existing.some(r => r.student_id.toLowerCase() === studentId.toLowerCase()))
      return res.status(409).json({ error: 'This Student ID is already registered for the seminar.' });

    const code = genCode();
    append(SEMINAR_FILE, [new Date().toISOString(), code, name, studentId ?? '', email ?? '', campusOrg, 'SEMINAR_ONLY']);
    return res.json({ success: true, ticketCode: code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/admin/registrations  (JSON for admin panel) ─────────────────────

app.get('/api/admin/registrations', (req, res) => {
  const { type, key } = req.query as Record<string, string>;
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const cols = type === 'hackathon' ? H_COLS : S_COLS;
  const file = type === 'hackathon' ? HACKATHON_FILE : SEMINAR_FILE;
  const data = rowsToObjects(file, cols);

  return res.json({ data, total: data.length });
});

// ── POST /api/admin/verify-payment ───────────────────────────────────────────

app.post('/api/admin/verify-payment', async (req, res) => {
  try {
    const { key, ticketCode } = req.body as { key: string; ticketCode: string };
    if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

    const objs = rowsToObjects(HACKATHON_FILE, H_COLS);
    const row  = objs.find(r => r.ticket_code === ticketCode);
    if (!row) return res.status(404).json({ error: 'Registration not found.' });

    // Update payment_verified
    row.payment_verified = 'YES';
    writeObjects(HACKATHON_FILE, H_COLS, objs);

    // Send confirmation email
    const emailAddr = row.leader_email;
    let emailSent   = false;
    if (emailAddr && transporter) {
      try {
        await transporter.sendMail({
          from:    process.env.EMAIL_FROM ?? `TVCSS Code-Storm 2026 <${process.env.EMAIL_USER}>`,
          to:      emailAddr,
          subject: `Payment Confirmed — Code-Storm 2026 | TVCSS`,
          html:    emailHTML({
            name:       row.leader_name,
            ticketCode: row.ticket_code,
            teamName:   row.team_name,
            fee:        row.total_fee_pkr,
            isHackathon: true,
          }),
        });
        emailSent = true;
      } catch (err) {
        console.error('Email failed:', err);
      }
    }

    return res.json({ success: true, emailSent, emailAddr: emailAddr || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/admin/export  (CSV download) ────────────────────────────────────

app.get('/api/admin/export', (req, res) => {
  const { type, key } = req.query as Record<string, string>;
  if (key !== ADMIN_KEY) return res.status(401).send('Unauthorized');

  const map: Record<string, { file: string; name: string }> = {
    hackathon: { file: HACKATHON_FILE, name: 'hackathon_teams.csv'       },
    seminar:   { file: SEMINAR_FILE,   name: 'seminar_attendees.csv'     },
  };
  const entry = map[type];
  if (!entry)              return res.status(400).send('Use ?type=hackathon or ?type=seminar');
  if (!fs.existsSync(entry.file)) return res.status(404).send('No registrations yet.');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${entry.name}"`);
  return res.send(fs.readFileSync(entry.file, 'utf8'));
});

// Catch-all for SPA in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}

// Migrate CSV schemas on startup so admin reads are always correct
ensureHeader(HACKATHON_FILE, H_COLS);
ensureHeader(SEMINAR_FILE,   S_COLS);

app.listen(PORT, () => {
  console.log(`\n  TVCSS Server  →  http://localhost:${PORT}`);
  console.log(`  Admin Panel   →  http://localhost:3000/admin  (open in browser)`);
  console.log(`  Email: ${transporter ? 'configured ✓' : 'NOT configured — set EMAIL_USER and EMAIL_PASS in .env'}\n`);
});
