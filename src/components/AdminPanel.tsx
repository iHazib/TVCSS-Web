import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Download, LogOut, Check, Mail, AlertTriangle, Search, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';
import CustomCursor from './CustomCursor';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HRow {
  timestamp: string; ticket_code: string;
  team_name: string; leader_name: string; leader_student_id: string; leader_email: string;
  campus_university: string; whatsapp: string; category: string;
  team_size: string; total_fee_pkr: string;
  member2_name: string; member2_student_id: string;
  member3_name: string; member3_student_id: string;
  member4_name: string; member4_student_id: string;
  member5_name: string; member5_student_id: string;
  payment_verified: string;
}

interface SRow {
  timestamp: string; ticket_code: string;
  name: string; student_id: string; email: string; campus_org: string; track_type: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function members(row: HRow): { name: string; id: string }[] {
  const out = [];
  for (let i = 2; i <= 5; i++) {
    const n = row[`member${i}_name` as keyof HRow];
    const id = row[`member${i}_student_id` as keyof HRow];
    if (n) out.push({ name: n, id });
  }
  return out;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [key,        setKey]        = useState('');
  const [authed,     setAuthed]     = useState(false);
  const [authErr,    setAuthErr]    = useState('');
  const [tab,        setTab]        = useState<'hackathon' | 'seminar'>('hackathon');
  const [hData,      setHData]      = useState<HRow[]>([]);
  const [sData,      setSData]      = useState<SRow[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [verifying,  setVerifying]  = useState<string | null>(null);
  const [reminding,  setReminding]  = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [toast,      setToast]      = useState('');
  const [search,     setSearch]     = useState('');
  const [expandedRow,setExpandedRow]= useState<string | null>(null);

  const savedKey = () => sessionStorage.getItem('tvcss_admin_key') ?? key;

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchAll = useCallback(async (k: string) => {
    setLoading(true);
    try {
      const [hRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/registrations?type=hackathon&key=${encodeURIComponent(k)}`),
        fetch(`${API_BASE}/api/admin/registrations?type=seminar&key=${encodeURIComponent(k)}`),
      ]);
      if (hRes.status === 401) { setAuthed(false); setAuthErr('Session expired — log in again.'); return; }
      const hJson = await hRes.json();
      const sJson = await sRes.json();
      setHData(hJson.data ?? []);
      setSData(sJson.data ?? []);
    } catch { flash('Network error — could not fetch data.'); }
    finally  { setLoading(false); }
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr('');
    const res = await fetch(`${API_BASE}/api/admin/registrations?type=hackathon&key=${encodeURIComponent(key)}`);
    if (res.status === 401) { setAuthErr('Invalid admin key.'); return; }
    sessionStorage.setItem('tvcss_admin_key', key);
    setAuthed(true);
    fetchAll(key);
  };

  const logout = () => {
    sessionStorage.removeItem('tvcss_admin_key');
    setAuthed(false); setKey(''); setHData([]); setSData([]);
  };

  const verifyPayment = async (ticketCode: string) => {
    setVerifying(ticketCode);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: savedKey(), ticketCode }),
      });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error}`); return; }
      setHData(prev => prev.map(r => r.ticket_code === ticketCode ? { ...r, payment_verified: 'YES' } : r));
      flash(data.emailSent
        ? `✓ Marked paid + email sent to ${data.emailAddr}`
        : `✓ Marked paid${data.emailAddr ? ' (email failed — check server logs)' : ' (no email on file)'}`,
      );
    } catch { flash('Network error.'); }
    finally { setVerifying(null); }
  };

  const sendReminder = async (ticketCode: string, type: 'oncampus' | 'offcampus') => {
    setReminding(ticketCode + type);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: savedKey(), ticketCode, type }),
      });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error}`); return; }
      flash(`✓ ${type === 'oncampus' ? 'On-campus' : 'Off-campus'} reminder sent to ${data.emailAddr}`);
    } catch { flash('Network error.'); }
    finally { setReminding(null); }
  };

  const deleteRecord = async (ticketCode: string, type: 'hackathon' | 'seminar') => {
    const label = type === 'hackathon' ? 'this team and all their seminar entries' : 'this seminar record';
    if (!window.confirm(`Permanently delete ${label}? This cannot be undone.`)) return;
    setDeleting(ticketCode);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: savedKey(), ticketCode, type }),
      });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error}`); return; }
      if (type === 'hackathon') {
        setHData(prev => prev.filter(r => r.ticket_code !== ticketCode));
        setSData(prev => prev.filter(r => !r.ticket_code.startsWith(ticketCode + '-')));
      } else {
        setSData(prev => prev.filter(r => r.ticket_code !== ticketCode));
      }
      flash('✓ Record deleted.');
    } catch { flash('Network error.'); }
    finally { setDeleting(null); }
  };

  const exportCSV = (type: string) => {
    window.open(`${API_BASE}/api/admin/export?type=${type}&key=${encodeURIComponent(savedKey())}`, '_blank');
  };

  // Try restoring session on mount
  useEffect(() => {
    const k = sessionStorage.getItem('tvcss_admin_key');
    if (k) { setKey(k); setAuthed(true); fetchAll(k); }
  }, [fetchAll]);

  // Stats
  const totalFee    = hData.reduce((s, r) => s + (parseInt(r.total_fee_pkr) || 0), 0);
  const paidFee     = hData.filter(r => r.payment_verified === 'YES').reduce((s, r) => s + (parseInt(r.total_fee_pkr) || 0), 0);
  const unpaidCount = hData.filter(r => r.payment_verified !== 'YES').length;

  const filteredH = hData.filter(r =>
    !search ||
    r.team_name.toLowerCase().includes(search.toLowerCase()) ||
    r.ticket_code.toLowerCase().includes(search.toLowerCase()) ||
    r.leader_name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredS = sData.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.ticket_code.toLowerCase().includes(search.toLowerCase())
  );

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <CustomCursor />
      <form onSubmit={login} className="w-full max-w-sm space-y-6">
        <div>
          <p className="font-mono text-[9px] text-brand-green uppercase tracking-widest mb-1">TVCSS Admin</p>
          <h1 className="font-display text-4xl uppercase text-white">Admin Panel</h1>
          <p className="font-mono text-[9px] text-white/30 uppercase mt-1">Code-Storm 2026 Registration System</p>
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Admin Key</label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full bg-transparent border border-white/20 focus:border-brand-orange outline-none font-mono text-sm text-white px-3 py-2.5 placeholder:text-white/20 transition-colors"
          />
          {authErr && <p className="font-mono text-[9px] text-red-400 uppercase">{authErr}</p>}
        </div>
        <button type="submit" className="w-full bg-brand-orange text-brand-dark font-mono text-xs uppercase font-bold py-3 hover:bg-brand-yellow transition-colors tracking-widest">
          Access Dashboard
        </button>
      </form>
    </div>
  );

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-dark text-brand-light font-mono">
      <CustomCursor />

      {/* Top bar */}
      <div className="border-b border-white/15 px-4 sm:px-6 py-3 flex items-center justify-between bg-brand-dark/95 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[9px] text-brand-green uppercase tracking-widest">TVCSS Admin</p>
          <span className="text-white/20">·</span>
          <p className="font-mono text-[9px] text-white/35 uppercase">Code-Storm 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchAll(savedKey())} className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 hover:text-white px-2 py-1.5 border border-white/10 hover:border-white/25 transition-colors uppercase" title="Refresh">
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 hover:text-white px-2 py-1.5 border border-white/10 hover:border-white/25 transition-colors uppercase">
            <LogOut size={11} /> Logout
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-dark border border-brand-green/50 text-brand-green font-mono text-[10px] uppercase px-5 py-3 shadow-[0_0_20px_rgba(57,255,20,0.2)] max-w-sm text-center">
          {toast}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Teams',     value: hData.length,  color: 'text-white'        },
            { label: 'Paid',      value: hData.filter(r => r.payment_verified === 'YES').length, color: 'text-brand-green' },
            { label: 'Unpaid',    value: unpaidCount,   color: 'text-brand-orange' },
            { label: 'Seminar',   value: sData.length,  color: 'text-brand-cyan'   },
          ].map(s => (
            <div key={s.label} className="border border-white/10 p-4">
              <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest">{s.label}</p>
              <p className={`font-display text-3xl mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Fee stats */}
        <div className="border border-white/10 px-4 py-3 flex flex-wrap gap-6 font-mono text-[9px] uppercase text-white/40">
          <span>Expected: <span className="text-white">PKR {totalFee.toLocaleString()}</span></span>
          <span>Collected: <span className="text-brand-green">PKR {paidFee.toLocaleString()}</span></span>
          <span>Pending: <span className="text-brand-orange">PKR {(totalFee - paidFee).toLocaleString()}</span></span>
          <span>Hackathon attendees in seminar CSV: <span className="text-brand-cyan">{sData.filter(r => r.track_type === 'HACKATHON').length}</span></span>
          <span>Seminar-only: <span className="text-brand-cyan">{sData.filter(r => r.track_type === 'SEMINAR_ONLY').length}</span></span>
        </div>

        {/* Tabs + search + export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-white/15">
            {(['hackathon','seminar'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(''); setExpandedRow(null); }}
                className={`font-mono text-[9px] uppercase tracking-widest px-4 py-2 transition-colors ${tab === t ? 'bg-brand-orange text-brand-dark font-bold' : 'text-white/40 hover:text-white'}`}
              >
                {t === 'hackathon' ? `Hackathon Teams (${hData.length})` : `Seminar Attendees (${sData.length})`}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-white/15 px-3 py-2 gap-2 flex-1 min-w-[160px] max-w-xs">
            <Search size={12} className="text-white/30 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search team / name / ticket..."
              className="bg-transparent text-white text-[11px] font-mono outline-none w-full placeholder:text-white/20"
            />
          </div>

          <button onClick={() => exportCSV(tab)} className="flex items-center gap-1.5 font-mono text-[9px] text-white/50 hover:text-white border border-white/15 px-3 py-2 hover:border-white/30 transition-colors uppercase">
            <Download size={11} /> Export CSV
          </button>
        </div>

        {/* ── HACKATHON TABLE ─────────────────────────────────────── */}
        {tab === 'hackathon' && (
          <div className="border border-white/12 overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-white/12 bg-white/[0.03]">
                  {['Ticket','Team','Leader','Email','WhatsApp','Campus','Category','Size','Fee','Payment','Members',''].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-mono text-[8px] text-white/35 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredH.length === 0 && (
                  <tr><td colSpan={11} className="px-4 py-8 text-center text-white/25 uppercase text-[9px]">
                    {hData.length === 0 ? 'No registrations yet.' : 'No results for current search.'}
                  </td></tr>
                )}
                {filteredH.map(row => {
                  const mems = members(row);
                  const paid = row.payment_verified === 'YES';
                  return (
                    <>
                      <tr
                        key={row.ticket_code}
                        className={`border-b border-white/[0.06] hover:bg-white/[0.02] cursor-pointer transition-colors ${paid ? 'opacity-80' : ''}`}
                        onClick={() => setExpandedRow(expandedRow === row.ticket_code ? null : row.ticket_code)}
                      >
                        <td className="px-3 py-2.5 text-brand-yellow whitespace-nowrap">{row.ticket_code}</td>
                        <td className="px-3 py-2.5 font-bold text-white whitespace-nowrap max-w-[140px] truncate">{row.team_name}</td>
                        <td className="px-3 py-2.5 text-white/70 whitespace-nowrap">{row.leader_name}</td>
                        <td className="px-3 py-2.5 text-white/45 whitespace-nowrap max-w-[160px] truncate">{row.leader_email || '—'}</td>
                        <td className="px-3 py-2.5 text-white/45 whitespace-nowrap">{row.whatsapp}</td>
                        <td className="px-3 py-2.5 text-white/45 whitespace-nowrap max-w-[120px] truncate">{row.campus_university}</td>
                        <td className="px-3 py-2.5 text-white/45 whitespace-nowrap capitalize">{row.category.replace(/-/g,' ')}</td>
                        <td className="px-3 py-2.5 text-center text-white/60">{row.team_size}</td>
                        <td className="px-3 py-2.5 text-brand-orange whitespace-nowrap font-bold">{parseInt(row.total_fee_pkr).toLocaleString()}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {paid ? (
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-1 text-brand-green font-bold">
                                <Check size={11} /> PAID
                              </span>
                              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => sendReminder(row.ticket_code, 'oncampus')}
                                  disabled={reminding !== null}
                                  className="flex items-center gap-1 bg-brand-cyan/10 border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan hover:text-brand-dark px-1.5 py-0.5 transition-colors disabled:opacity-40 uppercase text-[7px] font-bold whitespace-nowrap"
                                  title="Send on-campus reminder"
                                >
                                  {reminding === row.ticket_code + 'oncampus'
                                    ? <RefreshCw size={8} className="animate-spin" />
                                    : <Mail size={8} />
                                  }
                                  On-Site
                                </button>
                                <button
                                  onClick={() => sendReminder(row.ticket_code, 'offcampus')}
                                  disabled={reminding !== null}
                                  className="flex items-center gap-1 bg-brand-yellow/10 border border-brand-yellow/40 text-brand-yellow hover:bg-brand-yellow hover:text-brand-dark px-1.5 py-0.5 transition-colors disabled:opacity-40 uppercase text-[7px] font-bold whitespace-nowrap"
                                  title="Send off-campus reminder"
                                >
                                  {reminding === row.ticket_code + 'offcampus'
                                    ? <RefreshCw size={8} className="animate-spin" />
                                    : <Mail size={8} />
                                  }
                                  Remote
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={e => { e.stopPropagation(); verifyPayment(row.ticket_code); }}
                              disabled={verifying === row.ticket_code}
                              className="flex items-center gap-1 bg-brand-orange/15 border border-brand-orange/50 text-brand-orange hover:bg-brand-orange hover:text-brand-dark px-2 py-1 transition-colors disabled:opacity-50 uppercase text-[8px] font-bold"
                            >
                              {verifying === row.ticket_code
                                ? <RefreshCw size={10} className="animate-spin" />
                                : <Mail size={10} />
                              }
                              Mark Paid
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-white/35">
                          {mems.length > 0 ? `+${mems.length} member${mems.length > 1 ? 's' : ''}` : 'Solo'}
                          {' '}
                          <span className="text-white/20">{expandedRow === row.ticket_code ? '▲' : '▼'}</span>
                        </td>
                        <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => deleteRecord(row.ticket_code, 'hackathon')}
                            disabled={deleting === row.ticket_code}
                            className="flex items-center gap-1 bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 transition-colors disabled:opacity-40 uppercase text-[8px] font-bold"
                            title="Delete record"
                          >
                            {deleting === row.ticket_code
                              ? <RefreshCw size={10} className="animate-spin" />
                              : <Trash2 size={10} />
                            }
                          </button>
                        </td>
                      </tr>

                      {/* Expanded members row */}
                      {expandedRow === row.ticket_code && mems.length > 0 && (
                        <tr key={`${row.ticket_code}-exp`} className="bg-white/[0.02] border-b border-white/[0.06]">
                          <td colSpan={12} className="px-6 py-3">
                            <p className="text-[8px] text-white/30 uppercase tracking-widest mb-2">Team Members</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {/* Leader */}
                              <div className="border border-white/10 px-3 py-2">
                                <p className="text-[8px] text-brand-orange uppercase mb-1">Leader</p>
                                <p className="text-white/80">{row.leader_name}</p>
                                <p className="text-white/35 text-[9px]">{row.leader_student_id || '—'}</p>
                              </div>
                              {mems.map((m, i) => (
                                <div key={i} className="border border-white/10 px-3 py-2">
                                  <p className="text-[8px] text-white/30 uppercase mb-1">Member {i + 2}</p>
                                  <p className="text-white/80">{m.name}</p>
                                  <p className="text-white/35 text-[9px]">{m.id || '—'}</p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── SEMINAR TABLE ───────────────────────────────────────── */}
        {tab === 'seminar' && (
          <div className="border border-white/12 overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-white/12 bg-white/[0.03]">
                  {['Ticket','Name','Student ID','Email','Campus / Org','Track','Registered',''].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 font-mono text-[8px] text-white/35 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredS.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-white/25 uppercase text-[9px]">
                    {sData.length === 0 ? 'No seminar registrations yet.' : 'No results.'}
                  </td></tr>
                )}
                {filteredS.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5 text-brand-yellow whitespace-nowrap">{row.ticket_code}</td>
                    <td className="px-3 py-2.5 font-bold text-white/80 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-2.5 text-white/45">{row.student_id || '—'}</td>
                    <td className="px-3 py-2.5 text-white/45 max-w-[180px] truncate">{row.email || '—'}</td>
                    <td className="px-3 py-2.5 text-white/45 max-w-[160px] truncate">{row.campus_org}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase ${
                        row.track_type === 'HACKATHON' ? 'bg-brand-orange/15 text-brand-orange' : 'bg-brand-cyan/15 text-brand-cyan'
                      }`}>
                        {row.track_type === 'HACKATHON' ? 'Hackathon' : 'Seminar Only'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-white/25 whitespace-nowrap">
                      {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => deleteRecord(row.ticket_code, 'seminar')}
                        disabled={deleting === row.ticket_code}
                        className="flex items-center gap-1 bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 transition-colors disabled:opacity-40 uppercase text-[8px] font-bold"
                        title="Delete record"
                      >
                        {deleting === row.ticket_code
                          ? <RefreshCw size={10} className="animate-spin" />
                          : <Trash2 size={10} />
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Email warning if not configured */}
        {tab === 'hackathon' && (
          <div className="flex gap-2 items-start border border-white/10 bg-white/[0.02] px-4 py-3 text-[9px] text-white/35 uppercase">
            <AlertTriangle size={12} className="shrink-0 mt-0.5 text-brand-orange/60" />
            Clicking "Mark Paid" updates Supabase and sends a confirmation email to the registrant's address (if configured in .env).
            Emails require EMAIL_USER and EMAIL_PASS to be set. Deleting a hackathon team also removes their seminar mirror entries.
          </div>
        )}

      </div>
    </div>
  );
}
