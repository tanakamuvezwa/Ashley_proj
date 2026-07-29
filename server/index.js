import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ashley-project';
initDb(MONGODB_URI);

// API Routes

// 0. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.status === 'Suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact administration.' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      token: `mock-jwt-token-for-${user.id}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
    }
    const existing = await getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    const saved = await saveUser(newUser);
    res.status(201).json({
      id: saved.id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
      status: saved.status,
      createdAt: saved.createdAt,
      token: `mock-jwt-token-for-${saved.id}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Admin User Management
app.get('/api/admin/users', async (req, res) => {
  try {
    const list = await getUsers();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

app.post('/api/admin/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await updateUserStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Admin Loan Status Overrides
app.post('/api/admin/loans/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const requests = await getLoanRequests();
    const request = requests.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ error: 'Loan request not found' });
    }
    request.status = status;
    const updated = await updateLoanRequest(id, request);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update loan status' });
  }
});

// 1. Fetch all loan requests
app.get('/api/loan-requests', async (req, res) => {
  try {
    const list = await getLoanRequests();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve loan requests' });
  }
});

// 2. Submit a new loan request and generate simulated competitive offers in real-time
app.post('/api/loan-requests', async (req, res) => {
  try {
    const { 
      borrowerName, 
      businessName, 
      category, 
      amountRequested, 
      currency = 'USD', 
      tenureMonths, 
      purpose, 
      location 
    } = req.body;

    if (!borrowerName || !businessName || !amountRequested || !tenureMonths) {
      return res.status(400).json({ error: 'Missing required underwriting fields' });
    }

    // Dynamic AI Underwriting parameters
    const creditScore = Math.floor(700 + Math.random() * 120); // 700 to 820
    const riskScore = creditScore > 760 ? 'Low Risk (A+)' : creditScore > 710 ? 'Moderate (B)' : 'Growth Venture (C+)';
    const requestId = `LR-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Simulate Uber-like bidding engine based on category and amount
    const monthlyPaymentBase = Math.round((amountRequested * (1 + 0.08)) / tenureMonths);
    const totalRepaymentBase = monthlyPaymentBase * tenureMonths;

    // Generate offers from our fictional institutions
    const institutions = await getInstitutions();
    const activeBidders = institutions.filter(i => i.autoBidEnabled);
    
    const offers = activeBidders.map((inst, index) => {
      // Modify interest rates slightly per lender
      const rateMod = -0.5 + (index * 0.4) + (Math.random() * 0.3);
      const interestRate = parseFloat((7.8 + rateMod).toFixed(1));
      
      const monthlyPayment = Math.round((amountRequested * (1 + (interestRate / 100))) / tenureMonths);
      const totalRepayment = monthlyPayment * tenureMonths;
      
      let specialFeatures = [];
      if (inst.code.includes('HORIZON')) {
        specialFeatures = ['Direct supplier payout options', 'Dedicated relationship officer', '0% early payout fee'];
      } else if (inst.code.includes('APEX')) {
        specialFeatures = ['Grace period until first harvest', 'Crop insurance package integration'];
      } else if (inst.code.includes('VANGUARD')) {
        specialFeatures = ['ESG Carbon offset credit rebate', 'SADC regional trade corridor access'];
      } else {
        specialFeatures = ['Flexible repayment terms', 'Same-day digital disbursement'];
      }

      return {
        id: `LO-${Math.floor(100 + Math.random() * 900)}`,
        lenderName: inst.name,
        lenderType: inst.code.includes('VANGUARD') ? 'SADC Private Equity' : 'Commercial Bank',
        lenderLogo: inst.logo,
        interestRate,
        monthlyPayment,
        totalRepayment,
        approvalProbability: Math.floor(90 + Math.random() * 9),
        turnaroundTimeHours: Math.floor(1 + Math.random() * 4),
        specialFeatures
      };
    });

    const newRequest = {
      id: requestId,
      borrowerName,
      borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      businessName,
      category,
      amountRequested: Number(amountRequested),
      currency,
      tenureMonths: Number(tenureMonths),
      creditScore,
      riskScore,
      purpose,
      location,
      offers,
      status: 'Bidding Active',
      createdAt: 'Just Now'
    };

    const saved = await saveLoanRequest(newRequest);
    
    // Increment bids count on active institutions
    for (const inst of activeBidders) {
      await updateInstitutionRules(inst.id, { bidsSubmitted: inst.bidsSubmitted + 1 });
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create loan request: ' + err.message });
  }
});

// 3. Accept a loan offer (Disburse funds)
app.post('/api/loan-requests/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { offerId } = req.body;

    const list = await getLoanRequests();
    const reqItem = list.find(r => r.id === id);
    if (!reqItem) {
      return res.status(404).json({ error: 'Loan request not found' });
    }

    const offer = reqItem.offers.find(o => o.id === offerId);
    if (!offer) {
      return res.status(400).json({ error: 'Lender offer not found' });
    }

    reqItem.status = 'Funded';
    // Persist status change
    await updateLoanRequest(id, reqItem);
    res.json({ success: true, request: reqItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept loan offer' });
  }
});

// 4. Fetch all project pitches
app.get('/api/project-pitches', async (req, res) => {
  try {
    const list = await getProjectPitches();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve project pitches' });
  }
});

// 5. Submit a new project pitch
app.post('/api/project-pitches', async (req, res) => {
  try {
    const { title, category, targetCapital, projectedROI, pitchSummary, location } = req.body;
    if (!title || !targetCapital || !projectedROI) {
      return res.status(400).json({ error: 'Missing key pitch parameters' });
    }

    const newPitch = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      tagline: 'High potential business expansion initiative.',
      category,
      targetCapital: Number(targetCapital),
      raisedCapital: 0,
      currency: 'USD',
      projectedROI: Number(projectedROI),
      minInvestment: Math.round(targetCapital * 0.01),
      durationMonths: 24,
      location,
      country: 'Zimbabwe',
      countryCode: 'zw',
      entrepreneur: {
        name: 'Ashley Founder',
        role: 'Managing Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      pitchSummary,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      backersCount: 0,
      riskRating: 'AA',
      highlights: ['AI Verified Financial Plan', 'SADC Market Off-take', 'Local Regulatory Clearance']
    };

    const saved = await saveProjectPitch(newPitch);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project pitch' });
  }
});

// 6. Fetch institutional providers
app.get('/api/institutions', async (req, res) => {
  try {
    const list = await getInstitutions();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve institutions' });
  }
});

// 7. Update institutional rules
app.post('/api/institutions/:id/rules', async (req, res) => {
  try {
    const { id } = req.params;
    const { autoBidEnabled, maxTicketUSD } = req.body;
    const updated = await updateInstitutionRules(id, { autoBidEnabled, maxTicketUSD });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rules' });
  }
});

// 8. Fetch live FX rates
app.get('/api/fx-rates', async (req, res) => {
  try {
    const list = await getFxRates();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve FX rates' });
  }
});

// 9. Fetch insurance products
app.get('/api/insurance', async (req, res) => {
  try {
    const list = await getInsuranceProducts();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve insurance products' });
  }
});

// 10. Interactive Database-Backed AI Assistant Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(450).json({ error: 'Query is required' });
    
    const qLower = query.toLowerCase().trim();
    
    // 1. Fetch live SADC database stats to use as context
    const [loans, insts, fxRates, pitches] = await Promise.all([
      getLoanRequests(),
      getInstitutions(),
      getFxRates(),
      getProjectPitches()
    ]);
    
    const zwgRate = fxRates.find(r => r.quoteCurrency === 'ZWG')?.rate || 13.85;
    const zarRate = fxRates.find(r => r.quoteCurrency === 'ZAR')?.rate || 18.24;
    const bwpRate = fxRates.find(r => r.quoteCurrency === 'BWP')?.rate || 13.62;
    const totalPool = insts.reduce((acc, curr) => acc + curr.activeLiquidityUSD, 0);
    const bankNames = insts.map(i => i.name).join(', ');
    
    const dbContext = `
      Current SADC Platform Database State:
      - Active Loans in Underwriting: ${loans.length}
      - Matches Funded: ${loans.filter(l => l.status === 'Funded').length}
      - Connected Bidding Banks: ${bankNames}
      - Total Active Liquidity Pool: $${(totalPool / 1000000).toFixed(1)}M USD
      - USD/ZWG Live Rate: ${zwgRate}
      - USD/ZAR Live Rate: ${zarRate}
      - USD/BWP Live Rate: ${bwpRate}
      - Active Project Pitches: ${pitches.length} (Venture Projects)
    `;

    let replyText = "";
    
    // Try calling Gemini first
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash',
          systemInstruction: "You are Apex AI, an expert SADC financial advisor. Be extremely brief, clear, and professional. Use the retrieved platform context to answer questions about active rates, banks, and projects on ApexLend. Avoid markdown formatting inside your responses other than simple sentences."
        });

        const prompt = `
          Retrieved Live Platform State Context:
          ${dbContext}

          User Query:
          ${query}
        `;

        const result = await model.generateContent(prompt);
        replyText = result.response.text().trim();
      } catch (apiErr) {
        console.warn('Gemini API call failed, falling back to rule engine:', apiErr.message);
      }
    }

    // Fallback Rule-Based Engine if Gemini failed or key is missing
    if (!replyText) {
      if (qLower.includes('rate') || qLower.includes('apr') || qLower.includes('interest')) {
        replyText = `Current sovereign average loan rate is 7.8% APR. Solar projects qualify for discount desks (e.g. EcoLend desk at 6.8%), while agricultural ventures clear at 7.2%. There are currently ${loans.length} active credit files in our underwriting registry.`;
      } 
      else if (qLower.includes('zwg') || qLower.includes('fx') || qLower.includes('zar') || qLower.includes('exchange') || qLower.includes('currency')) {
        replyText = `Current live interbank exchange rates against USD: USD/ZWG is ${zwgRate}, USD/ZAR is ${zarRate}, and USD/BWP is ${bwpRate}. Cross-border clearing is automated on ApexLend rails with 0% extra broker margin.`;
      } 
      else if (qLower.includes('bank') || qLower.includes('lender') || qLower.includes('institution') || qLower.includes('pool') || qLower.includes('mutual')) {
        replyText = `Participating financial institutions include: ${bankNames}. The combined active liquidity pool across these desks is currently $${(totalPool / 1000000).toFixed(1)}M USD, with automatic bidding matching parameters deployed.`;
      } 
      else if (qLower.includes('loan') || qLower.includes('credit') || qLower.includes('borrow') || qLower.includes('turnover') || qLower.includes('apply')) {
        const fundedCount = loans.filter(l => l.status === 'Funded').length;
        replyText = `To apply, enter your metrics in the 'Solutions' workspace. Our AI underwriting pipeline checks biometric identities, local registrars, and Plaid cashflows. Currently, ${fundedCount} loan requests have been matched and funded by regional desks.`;
      }
      else if (qLower.includes('project') || qLower.includes('pitch') || qLower.includes('venture')) {
        replyText = `We currently have ${pitches.length} active projects in our Pitch Room. Regional developers are raising capital for solar fields, agricultural facilities, and logistics. Hover over any project to inspect projected ROI (up to 21% p.a.).`;
      } else {
        replyText = "I am Apex AI. I analyze real-time market data across SADC. Try asking about loan rates, FX rates, or participating banks!";
      }
    }

    res.json({ text: replyText });
  } catch (err) {
    res.status(500).json({ error: 'AI Assistant processing failed: ' + err.message });
  }
});

// Admin Add New User
app.post('/api/admin/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    const saved = await saveUser(newUser);
    res.json(saved);
  } catch (err) {
    res.status(505).json({ error: 'Failed to create user account' });
  }
});

// Admin Edit User Account Details
app.post('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;
    const updated = await updateUser(id, { name, email, password, role, status });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(505).json({ error: 'Failed to update user account' });
  }
});

// Admin Add New Project Pitch
app.post('/api/admin/projects', async (req, res) => {
  try {
    const { title, tagline, category, targetCapital, projectedROI, minInvestment, durationMonths, location, country, countryCode, pitchSummary } = req.body;
    const newPitch = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      tagline: tagline || 'High potential SADC venture expansion.',
      category,
      targetCapital: Number(targetCapital),
      raisedCapital: 0,
      currency: 'USD',
      projectedROI: Number(projectedROI),
      minInvestment: Number(minInvestment || 250),
      durationMonths: Number(durationMonths || 12),
      location,
      country,
      countryCode: countryCode || 'ZW',
      entrepreneur: {
        name: 'SADC Founder',
        role: 'Managing Director',
        avatar: 'https://picsum.photos/id/1025/150/150',
        verified: true
      },
      pitchSummary,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&h=337&q=80',
      backersCount: 0,
      riskRating: 'AA',
      highlights: ['Automated Risk Clear', 'SADC Market Off-take']
    };
    const saved = await saveProjectPitch(newPitch);
    res.json(saved);
  } catch (err) {
    res.status(505).json({ error: 'Failed to create project pitch' });
  }
});

// Admin Edit Project Pitch Details
app.post('/api/admin/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tagline, category, targetCapital, projectedROI, minInvestment, durationMonths, location, country, countryCode, pitchSummary } = req.body;
    const updated = await updateProjectPitch(id, { title, tagline, category, targetCapital, projectedROI, minInvestment, durationMonths, location, country, countryCode, pitchSummary });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(505).json({ error: 'Failed to update project details' });
  }
});

// Admin Edit/Fix Loan Request Details
app.post('/api/admin/loans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowerName, businessName, amountRequested, creditScore, purpose, status } = req.body;
    const requests = await getLoanRequests();
    const reqData = requests.find(r => r.id === id);
    if (!reqData) return res.status(404).json({ error: 'Loan request not found' });
    
    reqData.borrowerName = borrowerName;
    reqData.businessName = businessName;
    reqData.amountRequested = Number(amountRequested);
    reqData.creditScore = Number(creditScore);
    reqData.purpose = purpose;
    reqData.status = status;
    
    const updated = await updateLoanRequest(id, reqData);
    res.json(updated);
  } catch (err) {
    res.status(505).json({ error: 'Failed to update loan details' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ApexLend Backend Server listening on port ${PORT}`);
});
