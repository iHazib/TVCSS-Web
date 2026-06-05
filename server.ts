// Local-dev Express wrapper — imports the same handlers used by Vercel API routes.
// Run with: npm run server
import 'dotenv/config';
import express, { type Request, type Response } from 'express';

import hackathon        from './api/register/hackathon.js';
import seminar          from './api/register/seminar.js';
import registrations    from './api/admin/registrations.js';
import verifyPayment    from './api/admin/verify-payment.js';
import exportHandler    from './api/admin/export.js';

const app  = express();
const PORT = parseInt(process.env.API_PORT ?? '3001', 10);

app.use(express.json());

// Vercel handler signatures are compatible with Express req/res
const h = (fn: Function) => (req: Request, res: Response) => fn(req, res);

app.post('/api/register/hackathon',     h(hackathon));
app.post('/api/register/seminar',       h(seminar));
app.get ('/api/admin/registrations',    h(registrations));
app.post('/api/admin/verify-payment',   h(verifyPayment));
app.get ('/api/admin/export',           h(exportHandler));

app.listen(PORT, () => {
  console.log(`\n  Local API  →  http://localhost:${PORT}`);
  console.log(`  Admin      →  http://localhost:3000/admin\n`);
});
