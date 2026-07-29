import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateChatReply } from './ai.js';
import { 
  initDb, 
  getLoanRequests, 
  saveLoanRequest, 
  updateLoanRequest,
  getProjectPitches, 
  saveProjectPitch, 
  getInstitutions, 
  updateInstitutionRules,
  getFxRates, 
  getInsuranceProducts,
  getUsers,
  saveUser,
  updateUserStatus,
  deleteUser,
  getUserByEmail,
  updateUser,
  updateProjectPitch
} from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'apexlend-sadc-jwt-secret-2026';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded KYC files statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ─── Multer — KYC file upload ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only images (JPEG/PNG) and PDFs are allowed'));
  }
});

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const token = req.cookies?.apex_token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
};

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
    next();
  });
};

// Helper: issue JWT and set HTTP-only cookie
const issueToken = (res, user) => {
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('apex_token', token, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return token;
};

// ─── Database Init ─────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apexlend';
initDb(MONGODB_URI);

// ─── Live FX Rate Cache ────────────────────────────────────────────────────────
let fxCache = null;
let fxCacheTime = 0;
const FX_TTL = 10 * 60 * 1000; // 10 minutes

async function getLiveFxRates() {
  const now = Date.now();
  if (fxCache && now - fxCacheTime < FX_TTL) return fxCache;
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data.result === 'success') {
      const rates = data.rates;
      fxCache = [
        { pair: 'USD/ZAR', baseCurrency: 'USD', quoteCurrency: 'ZAR', rate: rates.ZAR || 18.24, change24h: (Math.random() * 0.4 - 0.2).toFixed(2), buyRate: (rates.ZAR || 18.24) * 1.005, sellRate: (rates.ZAR || 18.24) * 0.995, lastUpdated: new Date().toISOString() },
        { pair: 'USD/ZWG', baseCurrency: 'USD', quoteCurrency: 'ZWG', rate: 13.85, change24h: (Math.random() * 0.3 - 0.15).toFixed(2), buyRate: 13.95, sellRate: 13.75, lastUpdated: new Date().toISOString() },
        { pair: 'USD/BWP', baseCurrency: 'USD', quoteCurrency: 'BWP', rate: rates.BWP || 13.62, change24h: (Math.random() * 0.3 - 0.15).toFixed(2), buyRate: (rates.BWP || 13.62) * 1.005, sellRate: (rates.BWP || 13.62) * 0.995, lastUpdated: new Date().toISOString() },
        { pair: 'USD/ZMW', baseCurrency: 'USD', quoteCurrency: 'ZMW', rate: rates.ZMW || 26.5, change24h: (Math.random() * 0.5 - 0.25).toFixed(2), buyRate: (rates.ZMW || 26.5) * 1.005, sellRate: (rates.ZMW || 26.5) * 0.995, lastUpdated: new Date().toISOString() },
        { pair: 'USD/MZN', baseCurrency: 'USD', quoteCurrency: 'MZN', rate: rates.MZN || 63.8, change24h: (Math.random() * 0.5 - 0.25).toFixed(2), buyRate: (rates.MZN || 63.8) * 1.005, sellRate: (rates.MZN || 63.8) * 0.995, lastUpdated: new Date().toISOString() }
      ];
      fxCacheTime = now;
    }
  } catch (err) {
    console.warn('Live FX fetch failed, using DB fallback:', err.message);
    fxCache = await getFxRates();
    fxCacheTime = now;
  }
  return fxCache;
}

// ════════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════════

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password' });

    if (user.status === 'Suspended')
      return res.status(403).json({ error: 'Your account has been suspended. Contact administration.' });

    const token = issueToken(res, user);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt, token });
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed: ' + err.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existing = await getUserByEmail(email.toLowerCase().trim());
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    const saved = await saveUser(newUser);
    const token = issueToken(res, saved);
    res.status(201).json({ id: saved.id, name: saved.name, email: saved.email, role: saved.role, status: saved.status, createdAt: saved.createdAt, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('apex_token');
  res.json({ success: true });
});

// Get current user (verify session)
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await getUserByEmail(req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ════════════════════════════════════════════════════════════════════════════════
// KYC DOCUMENT UPLOAD
// ════════════════════════════════════════════════════════════════════════════════

app.post('/api/kyc/upload', upload.fields([
  { name: 'businessDoc', maxCount: 1 },
  { name: 'idDoc', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId, compRegNo, directorName } = req.body;
    const files = req.files;

    if (!compRegNo || !directorName)
      return res.status(400).json({ error: 'Company registration number and director name are required' });
    if (!files?.businessDoc || !files?.idDoc)
      return res.status(400).json({ error: 'Both business registration and ID documents are required' });

    const kycRecord = {
      userId: userId || 'GUEST',
      compRegNo,
      directorName,
      businessDoc: `/uploads/${files.businessDoc[0].filename}`,
      idDoc: `/uploads/${files.idDoc[0].filename}`,
      submittedAt: new Date().toISOString(),
      status: 'Under Review'
    };

    console.log(`KYC submitted for user ${userId}: Reg #${compRegNo}, Director: ${directorName}`);
    res.json({ success: true, message: 'KYC documents received. Verification is in progress.', record: kycRecord });
  } catch (err) {
    res.status(500).json({ error: 'KYC upload failed: ' + err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════════
// USER DASHBOARD — My Loans & My Pitches
// ════════════════════════════════════════════════════════════════════════════════

app.get('/api/my/loans', requireAuth, async (req, res) => {
  try {
    const all = await getLoanRequests();
    // Match by borrowerName or userId stored in loan
    const mine = all.filter(l =>
      l.userId === req.user.id ||
      l.borrowerName?.toLowerCase() === req.user.name?.toLowerCase()
    );
    res.json(mine);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your loans' });
  }
});

app.get('/api/my/pitches', requireAuth, async (req, res) => {
  try {
    const all = await getProjectPitches();
    const mine = all.filter(p => p.userId === req.user.id);
    res.json(mine);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your pitches' });
  }
});

// ════════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES (protected)
// ════════════════════════════════════════════════════════════════════════════════

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try { res.json(await getUsers()); }
  catch (err) { res.status(500).json({ error: 'Failed to retrieve users' }); }
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'ChangeMe123!', 12);
    const newUser = { id: `USR-${Date.now().toString(36).toUpperCase()}`, name, email: email.toLowerCase().trim(), password: hashedPassword, role, status: 'Active', createdAt: new Date().toISOString() };
    res.json(await saveUser(newUser));
  } catch (err) { res.status(500).json({ error: 'Failed to create user account' }); }
});

app.post('/api/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    const updated = await updateUser(id, { name, email, role, status });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Failed to update user account' }); }
});

app.post('/api/admin/users/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Active', 'Suspended'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const updated = await updateUserStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Failed to update user status' }); }
});

app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, deleted });
  } catch (err) { res.status(500).json({ error: 'Failed to delete user' }); }
});

app.post('/api/admin/loans/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await getLoanRequests();
    const reqItem = requests.find(r => r.id === id);
    if (!reqItem) return res.status(404).json({ error: 'Loan request not found' });
    reqItem.status = req.body.status;
    res.json(await updateLoanRequest(id, reqItem));
  } catch (err) { res.status(500).json({ error: 'Failed to update loan status' }); }
});

app.post('/api/admin/loans/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowerName, businessName, amountRequested, creditScore, purpose, status } = req.body;
    const requests = await getLoanRequests();
    const reqData = requests.find(r => r.id === id);
    if (!reqData) return res.status(404).json({ error: 'Loan request not found' });
    Object.assign(reqData, { borrowerName, businessName, amountRequested: Number(amountRequested), creditScore: Number(creditScore), purpose, status });
    res.json(await updateLoanRequest(id, reqData));
  } catch (err) { res.status(500).json({ error: 'Failed to update loan details' }); }
});

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  try {
    const { title, tagline, category, targetCapital, projectedROI, minInvestment, durationMonths, location, country, countryCode, pitchSummary } = req.body;
    const newPitch = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`, title, tagline: tagline || 'High potential SADC venture expansion.',
      category, targetCapital: Number(targetCapital), raisedCapital: 0, currency: 'USD',
      projectedROI: Number(projectedROI), minInvestment: Number(minInvestment || 250),
      durationMonths: Number(durationMonths || 12), location, country, countryCode: countryCode || 'ZW',
      entrepreneur: { name: 'SADC Founder', role: 'Managing Director', avatar: 'https://picsum.photos/id/1025/150/150', verified: true },
      pitchSummary, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&h=337&q=80',
      backersCount: 0, riskRating: 'AA', highlights: ['Automated Risk Clear', 'SADC Market Off-take']
    };
    res.json(await saveProjectPitch(newPitch));
  } catch (err) { res.status(500).json({ error: 'Failed to create project pitch' }); }
});

app.post('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateProjectPitch(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Failed to update project details' }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// LOAN ROUTES
// ════════════════════════════════════════════════════════════════════════════════

app.get('/api/loan-requests', async (req, res) => {
  try { res.json(await getLoanRequests()); }
  catch (err) { res.status(500).json({ error: 'Failed to retrieve loan requests' }); }
});

app.post('/api/loan-requests', async (req, res) => {
  try {
    const { borrowerName, businessName, category, amountRequested, currency = 'USD', tenureMonths, purpose, location, userId } = req.body;
    if (!borrowerName || !businessName || !amountRequested || !tenureMonths)
      return res.status(400).json({ error: 'Missing required underwriting fields' });

    const creditScore = Math.floor(700 + Math.random() * 120);
    const riskScore = creditScore > 760 ? 'Low Risk (A+)' : creditScore > 710 ? 'Moderate (B)' : 'Growth Venture (C+)';
    const requestId = `LR-${Math.floor(1000 + Math.random() * 9000)}`;

    const institutions = await getInstitutions();
    const activeBidders = institutions.filter(i => i.autoBidEnabled);
    const offers = activeBidders.map((inst, index) => {
      const rateMod = -0.5 + (index * 0.4) + (Math.random() * 0.3);
      const interestRate = parseFloat((7.8 + rateMod).toFixed(1));
      const monthlyPayment = Math.round((amountRequested * (1 + (interestRate / 100))) / tenureMonths);
      return {
        id: `LO-${Math.floor(100 + Math.random() * 900)}`,
        lenderName: inst.name, lenderType: inst.code.includes('VANGUARD') ? 'SADC Private Equity' : 'Commercial Bank',
        lenderLogo: inst.logo, interestRate, monthlyPayment, totalRepayment: monthlyPayment * tenureMonths,
        approvalProbability: Math.floor(90 + Math.random() * 9), turnaroundTimeHours: Math.floor(1 + Math.random() * 4),
        specialFeatures: ['Flexible repayment terms', 'Same-day digital disbursement']
      };
    });

    const newRequest = {
      id: requestId, userId: userId || null, borrowerName,
      borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      businessName, category, amountRequested: Number(amountRequested), currency,
      tenureMonths: Number(tenureMonths), creditScore, riskScore, purpose, location, offers,
      status: 'Bidding Active', createdAt: new Date().toISOString()
    };

    const saved = await saveLoanRequest(newRequest);
    for (const inst of activeBidders) await updateInstitutionRules(inst.id, { bidsSubmitted: inst.bidsSubmitted + 1 });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create loan request: ' + err.message });
  }
});

app.post('/api/loan-requests/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { offerId } = req.body;
    const list = await getLoanRequests();
    const reqItem = list.find(r => r.id === id);
    if (!reqItem) return res.status(404).json({ error: 'Loan request not found' });
    const offer = reqItem.offers?.find(o => o.id === offerId);
    if (!offer) return res.status(400).json({ error: 'Lender offer not found' });
    reqItem.status = 'Funded';
    await updateLoanRequest(id, reqItem);
    res.json({ success: true, request: reqItem });
  } catch (err) { res.status(500).json({ error: 'Failed to accept loan offer' }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// PROJECT PITCHES
// ════════════════════════════════════════════════════════════════════════════════

app.get('/api/project-pitches', async (req, res) => {
  try { res.json(await getProjectPitches()); }
  catch (err) { res.status(500).json({ error: 'Failed to retrieve project pitches' }); }
});

app.post('/api/project-pitches', async (req, res) => {
  try {
    const { title, category, targetCapital, projectedROI, pitchSummary, location, userId } = req.body;
    if (!title || !targetCapital || !projectedROI) return res.status(400).json({ error: 'Missing key pitch parameters' });
    const newPitch = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`, userId: userId || null,
      title, tagline: 'High potential business expansion initiative.', category,
      targetCapital: Number(targetCapital), raisedCapital: 0, currency: 'USD',
      projectedROI: Number(projectedROI), minInvestment: Math.round(targetCapital * 0.01),
      durationMonths: 24, location, country: 'Zimbabwe', countryCode: 'zw',
      entrepreneur: { name: 'Ashley Founder', role: 'Managing Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', verified: true },
      pitchSummary, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      backersCount: 0, riskRating: 'AA', highlights: ['AI Verified Financial Plan', 'SADC Market Off-take', 'Local Regulatory Clearance']
    };
    res.status(201).json(await saveProjectPitch(newPitch));
  } catch (err) { res.status(500).json({ error: 'Failed to create project pitch' }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// INSTITUTIONS & FX
// ════════════════════════════════════════════════════════════════════════════════

app.get('/api/institutions', async (req, res) => {
  try { res.json(await getInstitutions()); }
  catch (err) { res.status(500).json({ error: 'Failed to retrieve institutions' }); }
});

app.post('/api/institutions/:id/rules', async (req, res) => {
  try {
    const { autoBidEnabled, maxTicketUSD } = req.body;
    res.json(await updateInstitutionRules(req.params.id, { autoBidEnabled, maxTicketUSD }));
  } catch (err) { res.status(500).json({ error: 'Failed to update rules' }); }
});

// Live FX rates (from open.er-api.com with 10-min cache)
app.get('/api/fx-rates', async (req, res) => {
  try { res.json(await getLiveFxRates()); }
  catch (err) { res.status(500).json({ error: 'Failed to retrieve FX rates' }); }
});

app.get('/api/insurance', async (req, res) => {
  try { res.json(await getInsuranceProducts()); }
  catch (err) { res.status(500).json({ error: 'Failed to retrieve insurance products' }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// GEMINI AI CHAT
// ════════════════════════════════════════════════════════════════════════════════

app.post('/api/chat', async (req, res) => {
  try {
    const { query, history } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const [loans, insts, fxRates, pitches] = await Promise.all([
      getLoanRequests(), getInstitutions(), getLiveFxRates(), getProjectPitches()
    ]);

    const replyText = await generateChatReply(query, { loans, insts, fxRates, pitches }, history || []);
    res.json({ text: replyText });
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed: ' + err.message });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 ApexLend Backend Server listening on port ${PORT}`);
});
