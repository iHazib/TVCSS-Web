import nodemailer from 'nodemailer';

export interface EmailParams {
  name: string;
  ticketCode: string;
  teamName?: string;
  fee?: string;
  isHackathon: boolean;
}

export function emailHTML({ name, ticketCode, teamName, fee, isHackathon }: EmailParams): string {
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

export async function sendConfirmationEmail(to: string, params: EmailParams): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM ?? `TVCSS Code-Storm 2026 <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Payment Confirmed — Code-Storm 2026 | TVCSS',
      html:    emailHTML(params),
    });
    return true;
  } catch (err) {
    console.error('Email failed:', err);
    return false;
  }
}
