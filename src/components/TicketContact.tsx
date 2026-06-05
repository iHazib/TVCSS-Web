import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldAlert, ArrowLeft } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const FEES: Record<number, number> = { 1: 500, 2: 1000, 3: 1500, 4: 2000, 5: 2000 };

const CATEGORIES = [
  { id: 'education',  label: 'Education',              color: '#67e8f9', desc: 'AI solutions for learning, teaching, skill development, and educational accessibility.' },
  { id: 'healthcare', label: 'Healthcare & Wellbeing', color: '#fcd34d', desc: 'AI-powered tools that support health, wellness, and accessibility.' },
  { id: 'fintech',    label: 'Fintech',                color: '#FF4500', desc: 'Intelligent financial solutions for smarter, safer, and more accessible finance.' },
  { id: 'ecommerce',  label: 'E-commerce & Retail',    color: '#67e8f9', desc: 'AI applications that enhance shopping, commerce, and customer experiences.' },
  { id: 'social',     label: 'Social Impact',          color: '#fcd34d', desc: 'Technology-driven solutions that tackle real-world social and environmental challenges.' },
  { id: 'ai-agents',  label: 'AI Assistants & Agents', color: '#FF4500', desc: 'Autonomous AI systems that assist, automate, and solve complex tasks.' },
];

const PAYMENT = {
  bank:          'Bank Alfalah',
  accountTitle:  'Syed Muhammad Zunnoorain Ali Shah',
  accountNo:     '08301008702146',
  waNumber:      '923378412370',
  displayNumber: '0337-8412370',
};

const NOISE_BG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Member = { name: string; studentId: string };

// ─── Ticket sub-components ────────────────────────────────────────────────────

/** Narrow left stub — vertical text strip */
function Stub({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className="shrink-0 w-full lg:w-12 flex lg:flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-zinc-300 p-3 lg:py-6 lg:px-2"
      style={{ backgroundColor: `${accent}12` }}
    >
      <div
        className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] whitespace-nowrap"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: accent, opacity: 0.75 }}
      >
        {label}
      </div>
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${accent}25`, border: `1px solid ${accent}55` }}
      >
        <span style={{ color: accent, fontSize: 9 }}>▶</span>
      </div>
    </div>
  );
}

/** Perforated dotted divider */
function Perf({ vertical = false }: { vertical?: boolean }) {
  return vertical
    ? <div className="self-stretch w-px border-l-[2px] border-dotted border-zinc-300 mx-0" />
    : <div className="w-full border-t-[2px] border-dotted border-zinc-300" />;
}

/** CSS barcode */
function Barcode() {
  return (
    <div className="pt-3 border-t border-dotted border-zinc-300">
      <p className="font-mono text-[7px] uppercase text-center text-zinc-400 tracking-widest mb-1.5">
        EVENT · DATA TRANSMISSION
      </p>
      <div
        className="h-8 sm:h-10 w-full opacity-80 max-w-[200px] mx-auto"
        style={{
          background: 'repeating-linear-gradient(to right,#18181b 0,#18181b 2px,transparent 2px,transparent 4px,#18181b 4px,#18181b 5px,transparent 5px,transparent 8px,#18181b 8px,#18181b 12px,transparent 12px,transparent 14px,#18181b 14px,#18181b 18px,transparent 18px,transparent 20px)',
        }}
      />
      <p className="font-display text-xl text-center mt-2 text-zinc-700 leading-none tracking-wider">TVCSS</p>
    </div>
  );
}

/** Outer ticket shell with paper texture */
function TicketShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2px] shadow-[0_20px_60px_rgba(0,0,0,0.55)] ${className}`}
      style={{ backgroundColor: '#e8e8eb', color: '#18181b' }}
    >
      {/* Paper noise */}
      <div className="absolute inset-0 opacity-[0.045] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: NOISE_BG }} />
      <div className="relative z-10 flex flex-col lg:flex-row h-full">
        {children}
      </div>
    </div>
  );
}

/** Input field styled for light ticket background */
function TField({
  label, value, onChange, placeholder, type = 'text', required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-zinc-500">
        {label}{required && <span className="text-brand-orange ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-dotted border-zinc-400 focus:border-zinc-800 outline-none font-mono text-[11px] sm:text-xs text-zinc-900 uppercase pb-1 placeholder:text-zinc-300 placeholder:normal-case transition-colors"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TicketContact() {
  const [track,        setTrack]        = useState<'hackathon' | 'seminar' | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketCode,   setTicketCode]   = useState('');

  // Hackathon
  const [teamSize,        setTeamSize]        = useState(1);
  const [teamName,        setTeamName]        = useState('');
  const [leaderName,      setLeaderName]      = useState('');
  const [leaderStudentId, setLeaderStudentId] = useState('');
  const [leaderEmail,     setLeaderEmail]     = useState('');
  const [campus,          setCampus]          = useState('');
  const [whatsapp,        setWhatsapp]        = useState('');
  const [category,        setCategory]        = useState('');
  const [members,         setMembers]         = useState<Member[]>(
    Array(4).fill(null).map(() => ({ name: '', studentId: '' }))
  );
  const [confirmedFee,        setConfirmedFee]        = useState(500);
  const [confirmedTeamName,   setConfirmedTeamName]   = useState('');
  const [confirmedLeaderName, setConfirmedLeaderName] = useState('');
  const [confirmedMembers,    setConfirmedMembers]    = useState<Member[]>([]);
  const [confirmedTeamSize,   setConfirmedTeamSize]   = useState(1);

  // Seminar
  const [seminarName,      setSeminarName]      = useState('');
  const [seminarStudentId, setSeminarStudentId] = useState('');
  const [seminarEmail,     setSeminarEmail]     = useState('');
  const [seminarCampus,    setSeminarCampus]    = useState('');

  const fee = FEES[teamSize];

  const updateMember = (i: number, field: keyof Member, val: string) =>
    setMembers(prev => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n; });

  const reset = () => {
    setTrack(null); setIsRegistered(false); setError('');
    setTeamSize(1); setTeamName(''); setLeaderName('');
    setLeaderStudentId(''); setLeaderEmail(''); setCampus(''); setWhatsapp(''); setCategory('');
    setMembers(Array(4).fill(null).map(() => ({ name: '', studentId: '' })));
    setSeminarName(''); setSeminarStudentId(''); setSeminarEmail(''); setSeminarCampus('');
    setConfirmedLeaderName(''); setConfirmedMembers([]); setConfirmedTeamSize(1);
  };

  const submitHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) { setError('Please select an application category.'); return; }
    for (let i = 0; i < teamSize - 1; i++) {
      if (!members[i].name.trim()) { setError(`Please enter name for Member ${i + 2}.`); return; }
    }
    setError(''); setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/register/hackathon`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, leaderName, leaderStudentId, leaderEmail, campus, whatsapp, category, teamSize, members: members.slice(0, teamSize - 1) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return; }
      setTicketCode(data.ticketCode); setConfirmedFee(data.fee); setConfirmedTeamName(teamName);
      setConfirmedLeaderName(leaderName);
      setConfirmedMembers(members.slice(0, teamSize - 1));
      setConfirmedTeamSize(teamSize);
      setIsRegistered(true);
    } catch { setError('Network error — check connection and try again.'); }
    finally { setIsLoading(false); }
  };

  const submitSeminar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/register/seminar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: seminarName, studentId: seminarStudentId, email: seminarEmail, campusOrg: seminarCampus }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return; }
      setTicketCode(data.ticketCode); setIsRegistered(true);
    } catch { setError('Network error — check connection and try again.'); }
    finally { setIsLoading(false); }
  };

  const waMsg  = `Code-Storm 2026 Hackathon\n\nTeam Name: ${confirmedTeamName}\nTicket: ${ticketCode}\nAmount Paid: PKR ${confirmedFee}\n\n[Attach payment screenshot from this exact WhatsApp number]`;
  const waLink = `https://wa.me/${PAYMENT.waNumber}?text=${encodeURIComponent(waMsg)}`;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="register-section"
      className="py-12 md:py-20 px-4 sm:px-6 md:px-12 bg-brand-dark relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-64 bg-brand-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-brand-cyan/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 md:mb-12 border-b border-white/20 pb-4 flex items-end justify-between">
        <div className="flex items-end gap-4">
          {(track && !isRegistered) && (
            <button onClick={reset} className="font-mono text-[9px] text-white/35 hover:text-white flex items-center gap-1 mb-1 transition-colors">
              <ArrowLeft size={11} /> Back
            </button>
          )}
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase text-white leading-none">Register_</h2>
        </div>
        <p className="font-mono text-[9px] sm:text-[10px] uppercase text-brand-green tracking-widest hidden sm:block">
          [ Code-Storm 2026 Portal ]
        </p>
      </div>

      <AnimatePresence mode="wait">

        {/* ════════════════════════════════════════════════════════════════
            TRACK SELECTION — two side-by-side physical tickets
            ════════════════════════════════════════════════════════════════ */}
        {!track && !isRegistered && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <p className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-6">
              Choose your registration track —
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

              {/* ── HACKATHON TICKET ── */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <TicketShell>
                  <Stub label="HACKATHON" accent="#FF4500" />

                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between gap-5" style={{ backgroundColor: '#e8e8eb' }}>
                    {/* Header row */}
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Event Proforma</span>
                      <div className="bg-zinc-900 text-white font-mono text-[8px] px-2 py-0.5 uppercase tracking-widest">ANNEXURE A</div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-display text-4xl sm:text-5xl leading-none uppercase text-zinc-900">CODE-STORM</h3>
                      <p className="font-display text-lg text-zinc-600 leading-none uppercase mt-0.5">2026 // Hackathon + Seminar</p>
                      <div className="flex flex-wrap gap-2 mt-3 font-mono text-[8px] uppercase font-bold">
                        <span className="px-2 py-1 border border-zinc-400" style={{ background: '#FF4500', color: '#fff' }}>DSU DCK Campus</span>
                        <span className="bg-zinc-900 text-white px-2 py-1">Jun 10, 11 & 15</span>
                        <span className="bg-zinc-200 text-zinc-700 px-2 py-1 border border-zinc-300">PKR 500/person</span>
                      </div>
                    </div>

                    <Perf />

                    {/* Pricing */}
                    <div className="space-y-1.5 font-mono text-[8px] uppercase">
                      <p className="text-zinc-500 font-bold tracking-wider mb-2">[ Team Pricing ]</p>
                      {([1,2,3,4,5] as const).map(s => (
                        <div key={s} className="flex justify-between text-zinc-600">
                          <span>{s === 1 ? 'Solo' : `${s} Members`}{s === 5 ? ' — Deal 🔥' : ''}</span>
                          <span className={s === 5 ? 'font-bold' : ''} style={{ color: s === 5 ? '#FF4500' : undefined }}>
                            PKR {FEES[s].toLocaleString()}
                            {s === 5 && <span className="text-zinc-400 line-through ml-1.5">2,500</span>}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Perf />

                    {/* CTA */}
                    <button
                      onClick={() => setTrack('hackathon')}
                      className="w-full font-mono text-xs uppercase font-bold py-3.5 flex justify-between items-center transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#FF4500', color: '#fff' }}
                    >
                      <span>Register for Hackathon</span>
                      <span>[↗]</span>
                    </button>
                  </div>
                </TicketShell>
              </motion.div>

              {/* ── SEMINAR TICKET ── */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <TicketShell>
                  <Stub label="SEMINAR" accent="#67e8f9" />

                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between gap-5" style={{ backgroundColor: '#e8e8eb' }}>
                    {/* Header row */}
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Seminar Pass</span>
                      <div className="bg-zinc-900 text-white font-mono text-[8px] px-2 py-0.5 uppercase tracking-widest">ANNEXURE B</div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-display text-4xl sm:text-5xl leading-none uppercase text-zinc-900">CODE-STORM</h3>
                      <p className="font-display text-lg text-zinc-600 leading-none uppercase mt-0.5">2026 // Seminar Only</p>
                      <div className="flex flex-wrap gap-2 mt-3 font-mono text-[8px] uppercase font-bold">
                        <span className="px-2 py-1 border border-zinc-400" style={{ background: '#67e8f9', color: '#0a0b0e' }}>DSU DCK Campus</span>
                        <span className="bg-zinc-900 text-white px-2 py-1">Jun 10 Only</span>
                        <span className="bg-zinc-200 text-zinc-700 px-2 py-1 border border-zinc-300">12:00 – 1:30 PM</span>
                      </div>
                    </div>

                    <Perf />

                    {/* Free entry */}
                    <div className="space-y-2">
                      <p className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">[ Entry Details ]</p>
                      <div className="flex items-end gap-3">
                        <span className="font-display text-6xl leading-none text-zinc-900">FREE</span>
                        <div className="font-mono text-[8px] uppercase text-zinc-500 leading-relaxed pb-1">
                          <p>No cost · Open to all</p>
                          <p>Day 1 seminar session</p>
                          <p>Industry speakers</p>
                        </div>
                      </div>
                    </div>

                    <Perf />

                    {/* CTA */}
                    <button
                      onClick={() => setTrack('seminar')}
                      className="w-full font-mono text-xs uppercase font-bold py-3.5 flex justify-between items-center transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#67e8f9', color: '#0a0b0e' }}
                    >
                      <span>Register for Free Seminar</span>
                      <span>[↗]</span>
                    </button>
                  </div>
                </TicketShell>
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            HACKATHON FORM TICKET
            ════════════════════════════════════════════════════════════════ */}
        {track === 'hackathon' && !isRegistered && (
          <motion.form
            key="hackathon"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            onSubmit={submitHackathon}
            className="max-w-5xl mx-auto"
          >
            <TicketShell>
              <Stub label="HACKATHON" accent="#FF4500" />

              {/* ─ Left: event info + fee + payment ─────────────────── */}
              <div className="flex-[2] p-5 sm:p-8 flex flex-col gap-5 border-b lg:border-b-0 lg:border-r border-zinc-300 min-w-0">

                <div className="flex justify-between items-start">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Event Proforma</span>
                  <div className="bg-zinc-900 text-white font-mono text-[8px] px-2 py-0.5 uppercase">ANNEXURE A // DSU DCK</div>
                </div>

                <div>
                  <h2 className="font-display text-4xl sm:text-5xl leading-none uppercase text-zinc-900">CODE-STORM</h2>
                  <h3 className="font-display text-xl text-zinc-600 leading-none uppercase mt-0.5">2026 // Hackathon + Seminar</h3>
                  <div className="flex flex-wrap gap-2 mt-3 font-mono text-[8px] uppercase font-bold">
                    <span className="px-2 py-1" style={{ background: '#FF4500', color: '#fff' }}>DSU DCK Campus</span>
                    <span className="bg-zinc-900 text-white px-2 py-1">Jun 10, 11 & 15</span>
                  </div>
                </div>

                <Perf />

                {/* Schedule */}
                <div className="font-mono text-[8px] uppercase space-y-3">
                  <p className="font-bold text-zinc-700 tracking-wider">[ Itinerary ]</p>
                  {[
                    ['Day 01 — Wed Jun 10', 'Seminar & Orientation · 12:00–1:30 PM'],
                    ['Day 02 — Thu Jun 11', 'Hackathon Track 1 · 12:00–1:30 PM'],
                    ['Day 03 — Mon Jun 15', 'Track 2 & Showcase · 12:00–2:30 PM'],
                  ].map(([day, detail]) => (
                    <div key={day} className="border-l-2 border-zinc-400 pl-2">
                      <p className="font-bold text-zinc-800">{day}</p>
                      <p className="text-zinc-500">{detail}</p>
                    </div>
                  ))}
                </div>

                <Perf />

                {/* Live fee summary */}
                <div className="font-mono text-[8px] uppercase space-y-1.5">
                  <p className="font-bold text-zinc-700 tracking-wider">[ Fee Summary ]</p>
                  {([1,2,3,4,5] as const).map(s => (
                    <div key={s} className={`flex justify-between transition-colors ${s === teamSize ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
                      <span>{s === 1 ? 'Solo' : `${s} members`}{s === 5 ? ' — Deal' : ''}</span>
                      <span>PKR {FEES[s].toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-zinc-300 pt-2 flex justify-between items-baseline">
                    <span className="text-zinc-500">Your Total</span>
                    <span className="font-display text-3xl" style={{ color: '#FF4500' }}>PKR {fee.toLocaleString()}</span>
                  </div>
                  {teamSize === 5 && <p className="text-[7px]" style={{ color: '#FF4500' }}>🔥 Deal applied — save PKR 500</p>}
                </div>

                <Perf />

                {/* Payment preview + screenshot instructions */}
                <div className="font-mono text-[8px] uppercase space-y-1.5 text-zinc-600">
                  <p className="font-bold text-zinc-700 tracking-wider">[ Payment After Submit ]</p>
                  <p className="text-zinc-800 font-bold">{PAYMENT.accountTitle}</p>
                  <p>Bank: <span className="text-zinc-800 font-bold">{PAYMENT.bank}</span></p>
                  <p>A/C: {PAYMENT.accountNo}</p>
                  <p>WA: <span style={{ color: '#FF4500' }} className="font-bold">{PAYMENT.displayNumber}</span></p>
                </div>

                <Perf />

                <div className="font-mono text-[8px] uppercase space-y-1.5 text-zinc-600">
                  <p className="font-bold text-zinc-700 tracking-wider">[ Screenshot Instructions ]</p>
                  <p><span style={{ color: '#FF4500' }} className="font-bold">01</span> — Transfer PKR 500/person to account above</p>
                  <p><span style={{ color: '#FF4500' }} className="font-bold">02</span> — <span className="text-zinc-800 font-bold">Team leader</span> sends payment screenshot to WA</p>
                  <p><span style={{ color: '#FF4500' }} className="font-bold">03</span> — Write your <span className="text-zinc-800 font-bold">team name</span> with the screenshot</p>
                  <p><span style={{ color: '#FF4500' }} className="font-bold">04</span> — Send from leader's <span className="text-zinc-800 font-bold">registered</span> WhatsApp number</p>
                </div>

                {/* Footer */}
                <div className="mt-auto flex justify-between items-end font-mono text-[8px] uppercase text-zinc-400">
                  <div>
                    <p className="font-display text-xl text-zinc-700">SYS.V2.0</p>
                    <p className="text-[7px] tracking-widest">BATCH 25-26 // HACK</p>
                  </div>
                  <div className="text-right">
                    <p>24.9628° N</p>
                    <p>67.0421° E</p>
                  </div>
                </div>
              </div>

              {/* ─ Right: form (tear-off stub) ──────────────────────── */}
              <div className="flex-[1.4] p-5 sm:p-7 flex flex-col gap-4 min-w-0" style={{ backgroundColor: '#f0f0f3' }}>

                {/* Glassy corner */}
                <div className="absolute top-0 right-0 w-16 h-16 hidden lg:block rounded-bl-2xl bg-gradient-to-bl from-white/70 to-transparent border-b border-l border-white/50" />

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Ticket Ref</p>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-600">C-STORM/REG/2026</p>
                  <div className="mt-2 inline-block font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-1 bg-zinc-900" style={{ color: '#FF4500' }}>
                    PKR 500 / PERSON
                  </div>
                </div>

                <Perf />

                {/* ── Team info ── */}
                <div className="space-y-3">
                  <p className="font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-500">[ Team Info ]</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TField label="Team Name"      value={teamName}        onChange={setTeamName}        placeholder="Your team name"      required />
                    <TField label="WhatsApp"        value={whatsapp}        onChange={setWhatsapp}        placeholder="03XXXXXXXXX"          required type="tel" />
                    <TField label="Leader Name"     value={leaderName}      onChange={setLeaderName}      placeholder="Full name"           required />
                    <TField label="Student ID"      value={leaderStudentId} onChange={setLeaderStudentId} placeholder="e.g. CS-221041"      required />
                    <TField label="Leader Email"    value={leaderEmail}     onChange={setLeaderEmail}     placeholder="email@domain.com"    required type="email" />
                    <TField label="Campus / Uni"    value={campus}          onChange={setCampus}          placeholder="DSU DCK / NEDUET..." required />
                  </div>
                </div>

                <Perf />

                {/* ── Team Size ── */}
                <div className="space-y-2">
                  <p className="font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-500">[ Team Size ]</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {([1,2,3,4,5] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTeamSize(s)}
                        className={`relative flex flex-col items-center py-2.5 border transition-colors duration-150 ${
                          teamSize === s
                            ? s === 5
                              ? 'border-brand-orange/60 text-brand-dark'
                              : 'border-zinc-600 bg-zinc-800 text-white'
                            : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                        }`}
                        style={teamSize === s && s === 5 ? { background: '#FF4500', color: '#fff' } : undefined}
                      >
                        {s === 5 && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[6px] bg-brand-orange text-white px-1 py-0.5 uppercase whitespace-nowrap">
                            Deal
                          </span>
                        )}
                        <span className="font-display text-xl leading-none">{s}</span>
                        <span className="font-mono text-[6px] uppercase mt-0.5 opacity-60">{s===1?'Solo':'Mem'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Team Members ── */}
                {teamSize > 1 && (
                  <div className="space-y-3">
                    <p className="font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-500">[ Members 2–{teamSize} ]</p>
                    {Array.from({ length: teamSize - 1 }, (_, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2">
                        <TField label={`M${i+2} Name`}  value={members[i].name}      onChange={v => updateMember(i,'name',v)}      placeholder={`Member ${i+2}`} required />
                        <TField label={`M${i+2} ID`}    value={members[i].studentId} onChange={v => updateMember(i,'studentId',v)} placeholder="Student ID" />
                      </div>
                    ))}
                  </div>
                )}

                <Perf />

                {/* ── Application Category ── */}
                <div className="space-y-2">
                  <p className="font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                    [ Category ] <span className="font-normal">— Pick one</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`relative text-left p-2.5 border overflow-hidden transition-all duration-150 ${
                          category === cat.id ? 'border-zinc-500 bg-zinc-100' : 'border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <div
                          className="absolute top-0 inset-x-0 h-[2px]"
                          style={{ backgroundColor: category === cat.id ? cat.color : 'transparent' }}
                        />
                        {category === cat.id && (
                          <div className="absolute top-2 right-2 w-1.5 h-1.5" style={{ backgroundColor: cat.color }} />
                        )}
                        <p className="font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-wide leading-tight" style={{ color: cat.color }}>
                          {cat.label}
                        </p>
                        <p className="font-mono text-[6px] sm:text-[7px] text-zinc-400 leading-tight mt-0.5 uppercase line-clamp-2">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex gap-2 items-start border border-red-400/50 bg-red-50 p-2.5">
                    <ShieldAlert size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="font-mono text-[7px] uppercase text-red-600 leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-mono text-xs uppercase font-bold py-3.5 flex justify-between items-center transition-opacity hover:opacity-90 disabled:opacity-50 mt-auto"
                  style={{ backgroundColor: '#FF4500', color: '#fff' }}
                >
                  <span>{isLoading ? 'Processing...' : `Secure Pass — PKR ${fee.toLocaleString()}`}</span>
                  <span>[↗]</span>
                </button>

                <Barcode />
              </div>

            </TicketShell>
          </motion.form>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SEMINAR FORM TICKET
            ════════════════════════════════════════════════════════════════ */}
        {track === 'seminar' && !isRegistered && (
          <motion.form
            key="seminar"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            onSubmit={submitSeminar}
            className="max-w-3xl mx-auto"
          >
            <TicketShell>
              <Stub label="SEMINAR" accent="#67e8f9" />

              {/* ─ Left: seminar info ─────────────────────────────── */}
              <div className="flex-1 p-5 sm:p-8 flex flex-col gap-5 border-b lg:border-b-0 lg:border-r border-zinc-300">

                <div className="flex justify-between items-start">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Seminar Pass</span>
                  <div className="bg-zinc-900 text-white font-mono text-[8px] px-2 py-0.5 uppercase">ANNEXURE B</div>
                </div>

                <div>
                  <h2 className="font-display text-4xl sm:text-5xl leading-none uppercase text-zinc-900">CODE-STORM</h2>
                  <h3 className="font-display text-xl text-zinc-600 leading-none uppercase mt-0.5">2026 // Seminar Only</h3>
                  <div className="flex flex-wrap gap-2 mt-3 font-mono text-[8px] uppercase font-bold">
                    <span className="px-2 py-1" style={{ background: '#67e8f9', color: '#0a0b0e' }}>DSU DCK Campus</span>
                    <span className="bg-zinc-900 text-white px-2 py-1">Jun 10 Only</span>
                    <span className="bg-zinc-200 text-zinc-700 border border-zinc-300 px-2 py-1">12:00 – 1:30 PM</span>
                  </div>
                </div>

                <Perf />

                <div className="space-y-2 font-mono text-[8px] uppercase text-zinc-600">
                  <div className="border-l-2 border-zinc-400 pl-2">
                    <p className="font-bold text-zinc-800">Day 01 — Wed Jun 10</p>
                    <p>Seminar & Industry Orientation Session</p>
                    <p>Guest online session · Innovation briefing</p>
                  </div>
                </div>

                <Perf />

                <div className="flex items-end gap-3">
                  <span className="font-display text-6xl leading-none text-zinc-900">FREE</span>
                  <div className="font-mono text-[8px] uppercase text-zinc-500 leading-relaxed pb-1">
                    No cost<br/>Open to all students<br/>No hackathon participation
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-end font-mono text-[8px] uppercase text-zinc-400">
                  <div>
                    <p className="font-display text-xl text-zinc-700">SYS.V2.0</p>
                    <p className="text-[7px] tracking-widest">BATCH 25-26 // SEM</p>
                  </div>
                  <div className="text-right">
                    <p>24.9628° N</p>
                    <p>67.0421° E</p>
                  </div>
                </div>
              </div>

              {/* ─ Right: seminar form ────────────────────────────── */}
              <div className="flex-1 p-5 sm:p-7 flex flex-col gap-4" style={{ backgroundColor: '#f0f0f3' }}>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Ticket Ref</p>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-600">C-STORM/SEM/2026</p>
                  <div className="mt-2 inline-block font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-1 bg-zinc-900" style={{ color: '#67e8f9' }}>
                    ENTRY: FREE
                  </div>
                </div>

                <Perf />

                <div className="space-y-3.5 flex-1">
                  <p className="font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-500">[ Attendee Details ]</p>
                  <TField label="Full Name"             value={seminarName}      onChange={setSeminarName}      placeholder="Your full name"         required />
                  <TField label="Email"                 value={seminarEmail}     onChange={setSeminarEmail}     placeholder="email@domain.com"        required type="email" />
                  <TField label="Campus / Organization" value={seminarCampus}    onChange={setSeminarCampus}    placeholder="DSU DCK / NEDUET / Other" required />
                  <TField label="Student ID (Optional)" value={seminarStudentId} onChange={setSeminarStudentId} placeholder="If applicable" />
                </div>

                {error && (
                  <div className="flex gap-2 items-start border border-red-400/50 bg-red-50 p-2.5">
                    <ShieldAlert size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="font-mono text-[7px] uppercase text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-mono text-xs uppercase font-bold py-3.5 flex justify-between items-center transition-opacity hover:opacity-90 disabled:opacity-50 mt-auto"
                  style={{ backgroundColor: '#67e8f9', color: '#0a0b0e' }}
                >
                  <span>{isLoading ? 'Processing...' : 'Register Free Seminar Pass'}</span>
                  <span>[↗]</span>
                </button>

                <Barcode />
              </div>

            </TicketShell>
          </motion.form>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SUCCESS — completed / stamped ticket
            ════════════════════════════════════════════════════════════════ */}
        {isRegistered && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <TicketShell>
              <Stub label={track === 'hackathon' ? '✓ CONFIRMED' : '✓ REGISTERED'} accent="#39FF14" />

              {/* ─ Left: ticket details ────────────────────────────── */}
              <div className="flex-[2] p-5 sm:p-8 flex flex-col gap-5 border-b lg:border-b-0 lg:border-r border-zinc-300">

                <div className="flex justify-between items-start flex-wrap gap-2">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Event Gatepass</span>
                  <div className="bg-zinc-900 font-mono text-[8px] px-2 py-0.5 uppercase tracking-widest" style={{ color: track === 'hackathon' ? '#fcd34d' : '#39FF14' }}>
                    {track === 'hackathon' ? 'AWAITING PAYMENT' : 'REGISTRATION CONFIRMED'}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-4xl sm:text-5xl leading-none uppercase text-zinc-900">CODE-STORM</h2>
                  <p className="font-display text-xl text-zinc-600 leading-none uppercase mt-0.5">
                    2026 // {track === 'hackathon' ? 'Hackathon + Seminar' : 'Seminar Only'}
                  </p>
                </div>

                <Perf />

                {/* Gatepass code */}
                <div className="border border-dashed border-zinc-400 bg-zinc-200/50 p-4 space-y-1.5">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Gatepass Code</p>
                  <p className="font-display text-4xl sm:text-5xl tracking-wider select-all text-zinc-900">{ticketCode}</p>
                  {track === 'hackathon' && (
                    <div className="font-mono text-[8px] uppercase space-y-0.5 text-zinc-600 pt-1 border-t border-dashed border-zinc-300">
                      <p>Team: <span className="text-zinc-900 font-bold">{confirmedTeamName}</span></p>
                      <p>Fee Due: <span style={{ color: '#FF4500' }} className="font-bold">PKR {confirmedFee.toLocaleString()}</span></p>
                      <p>Status: <span style={{ color: '#fcd34d' }} className="font-bold">Awaiting Payment Confirmation</span></p>
                    </div>
                  )}
                </div>

                {/* Team members roster */}
                {track === 'hackathon' && (
                  <div className="font-mono text-[8px] uppercase space-y-2">
                    <p className="font-bold text-zinc-700 tracking-wider">[ Registered Team ]</p>
                    <div className="space-y-1">
                      <div className="flex justify-between border-b border-dotted border-zinc-300 pb-1">
                        <span className="text-zinc-400">Leader</span>
                        <span className="text-zinc-900 font-bold">{confirmedLeaderName}</span>
                      </div>
                      {confirmedMembers.map((m, i) => m.name && (
                        <div key={i} className="flex justify-between">
                          <span className="text-zinc-400">Member {i + 2}</span>
                          <span className="text-zinc-800 font-bold">{m.name}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1 border-t border-dotted border-zinc-300">
                        <span className="text-zinc-400">Total Members</span>
                        <span className="text-zinc-800 font-bold">{confirmedTeamSize}</span>
                      </div>
                    </div>
                  </div>
                )}

                {track === 'hackathon' && (
                  <div className="font-mono text-[8px] uppercase text-zinc-600 space-y-1">
                    <p className="text-[7px] text-zinc-400">Registered for</p>
                    <p>Day 1 — Seminar &amp; Orientation · Jun 10</p>
                    <p>Day 2 — Hackathon Track 1 · Jun 11</p>
                    <p>Day 3 — Track 2 &amp; Showcase · Jun 15</p>
                  </div>
                )}
                {track === 'seminar' && (
                  <div className="font-mono text-[8px] uppercase text-zinc-600">
                    <p>Day 1 — Seminar &amp; Orientation · Jun 10 · 12:00–1:30 PM</p>
                  </div>
                )}

                <div className="mt-auto">
                  <button onClick={reset} className="font-mono text-[8px] uppercase text-zinc-400 hover:text-zinc-700 transition-colors tracking-widest">
                    ← Register another
                  </button>
                </div>
              </div>

              {/* ─ Right: payment instructions (hackathon) or simple confirm ── */}
              <div className="flex-[1.4] p-5 sm:p-7 flex flex-col gap-4" style={{ backgroundColor: '#f0f0f3' }}>

                {track === 'hackathon' ? (
                  <>
                    {/* Processing banner */}
                    <div className="bg-zinc-900 p-3 space-y-0.5">
                      <p className="font-mono text-[7px] uppercase tracking-widest" style={{ color: '#fcd34d' }}>Registration Processing</p>
                      <p className="font-mono text-[9px] font-bold uppercase text-white">Complete payment to confirm your slot</p>
                    </div>

                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Step 2</p>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-800">Complete Payment</p>
                    </div>

                    <Perf />

                    <div className="font-mono text-[8px] uppercase space-y-2.5 text-zinc-600">
                      <div className="flex justify-between border-b border-dotted border-zinc-300 pb-2">
                        <span>Amount Due</span>
                        <span className="font-bold text-base" style={{ color: '#FF4500' }}>PKR {confirmedFee.toLocaleString()}</span>
                      </div>
                      <p className="font-bold text-zinc-800">{PAYMENT.accountTitle}</p>
                      <p>Bank: <span className="font-bold text-zinc-800">{PAYMENT.bank}</span></p>
                      <p>A/C No: {PAYMENT.accountNo}</p>
                      <p>WA: <span style={{ color: '#FF4500' }} className="font-bold">{PAYMENT.displayNumber}</span></p>
                    </div>

                    <Perf />

                    <div className="font-mono text-[7px] sm:text-[8px] uppercase space-y-2 text-zinc-500">
                      <p className="font-bold text-zinc-700">Strict Instructions</p>
                      <p><span style={{ color: '#FF4500' }} className="font-bold">01</span> — Transfer PKR {confirmedFee.toLocaleString()} to account above</p>
                      <p><span style={{ color: '#FF4500' }} className="font-bold">02</span> — <span className="text-zinc-800 font-bold">Team leader</span> sends screenshot to WA: {PAYMENT.displayNumber}</p>
                      <p><span style={{ color: '#FF4500' }} className="font-bold">03</span> — Send from leader's <span className="text-zinc-800 font-bold">registered</span> WhatsApp number</p>
                      <p><span style={{ color: '#FF4500' }} className="font-bold">04</span> — Write team name <span className="text-zinc-900 font-bold">"{confirmedTeamName}"</span> with the screenshot</p>
                    </div>

                    <a
                      href={waLink} target="_blank" rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-between w-full font-mono text-[9px] sm:text-xs uppercase font-bold py-3.5 px-4 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#25D366', color: '#fff' }}
                    >
                      <span>Send Payment on WhatsApp</span>
                      <span>[↗]</span>
                    </a>

                    <Barcode />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)', border: '2px solid rgba(57,255,20,0.3)' }}>
                        <Check size={26} style={{ color: '#39FF14' }} />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-800">You're Registered!</p>
                        <p className="font-mono text-[8px] uppercase text-zinc-500 mt-1">No payment required · Free entry</p>
                      </div>
                      <p className="font-mono text-[8px] uppercase text-zinc-500 leading-relaxed">
                        Show your gatepass code at the venue on Jun 10. A confirmation email will be sent to you.
                      </p>
                    </div>
                    <Barcode />
                  </>
                )}

              </div>
            </TicketShell>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
}
