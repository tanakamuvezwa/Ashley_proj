import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_DB_PATH = path.join(__dirname, 'data', 'fallback_db.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(FALLBACK_DB_PATH))) {
  fs.mkdirSync(path.dirname(FALLBACK_DB_PATH), { recursive: true });
}

// Schemas for MongoDB
const LoanOfferSchema = new mongoose.Schema({
  id: String,
  lenderName: String,
  lenderType: String,
  lenderLogo: String, // Store Lucide Icon string (e.g. 'Building2')
  interestRate: Number,
  monthlyPayment: Number,
  totalRepayment: Number,
  approvalProbability: Number,
  turnaroundTimeHours: Number,
  specialFeatures: [String]
});

const LoanRequestSchema = new mongoose.Schema({
  id: String,
  userId: String,
  borrowerName: String,
  borrowerAvatar: String,
  businessName: String,
  category: String,
  amountRequested: Number,
  currency: String,
  tenureMonths: Number,
  creditScore: Number,
  riskScore: String,
  purpose: String,
  location: String,
  offers: [LoanOfferSchema],
  status: String,
  createdAt: String
});

const ProjectPitchSchema = new mongoose.Schema({
  id: String,
  userId: String,
  title: String,
  tagline: String,
  category: String,
  targetCapital: Number,
  raisedCapital: Number,
  currency: String,
  projectedROI: Number,
  minInvestment: Number,
  durationMonths: Number,
  location: String,
  country: String,
  countryCode: String,
  entrepreneur: {
    name: String,
    role: String,
    avatar: String,
    verified: Boolean
  },
  pitchSummary: String,
  image: String,
  backersCount: Number,
  riskRating: String,
  highlights: [String]
});

const InstitutionSchema = new mongoose.Schema({
  id: String,
  name: String,
  code: String,
  logo: String, // Store Lucide Icon string (e.g. 'Building2')
  country: String,
  countryCode: String,
  activeLiquidityUSD: Number,
  minTicketUSD: Number,
  maxTicketUSD: Number,
  preferredCategories: [String],
  autoBidEnabled: Boolean,
  bidsSubmitted: Number
});

const FxRateSchema = new mongoose.Schema({
  pair: String,
  baseCurrency: String,
  quoteCurrency: String,
  rate: Number,
  change24h: Number,
  buyRate: Number,
  sellRate: Number,
  lastUpdated: String
});

const InsuranceProductSchema = new mongoose.Schema({
  id: String,
  title: String,
  provider: String,
  coverageType: String,
  monthlyPremiumUSD: Number,
  maxCoverageUSD: Number,
  deductibleUSD: Number,
  features: [String]
});

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  status: String,
  createdAt: String
});

// Compile Models
let LoanRequest, ProjectPitch, Institution, FxRate, InsuranceProduct, User;
try {
  LoanRequest = mongoose.model('LoanRequest', LoanRequestSchema);
  ProjectPitch = mongoose.model('ProjectPitch', ProjectPitchSchema);
  Institution = mongoose.model('Institution', InstitutionSchema);
  FxRate = mongoose.model('FxRate', FxRateSchema);
  InsuranceProduct = mongoose.model('InsuranceProduct', InsuranceProductSchema);
  User = mongoose.model('User', UserSchema);
} catch (e) {
  LoanRequest = mongoose.model('LoanRequest');
  ProjectPitch = mongoose.model('ProjectPitch');
  Institution = mongoose.model('Institution');
  FxRate = mongoose.model('FxRate');
  InsuranceProduct = mongoose.model('InsuranceProduct');
  User = mongoose.model('User');
}

// Database Connection & Mode
let isConnected = false;
let fallbackDb = null;

// Initial Data Seed
const SEED_DATA = {
  users: [
    {
      id: 'USR-001',
      name: 'Apex Admin',
      email: 'admin@apexlend.ai',
      password: '$2b$12$UAklfwyYXPzUn6MPa7HGouON7MTV9vaBfGRXS2qf03gTMyGHbLfnm',
      role: 'admin',
      status: 'Active',
      createdAt: '2026-07-29T12:00:00Z'
    },
    {
      id: 'USR-002',
      name: 'Ashley Founder',
      email: 'ashley@apexlend.ai',
      password: '$2b$12$OT.jSCv8GX0rc2C.1GTzOeUL24NFEel1Z960Su11fl7jc0t4IrBXK',
      role: 'borrower',
      status: 'Active',
      createdAt: '2026-07-29T12:00:00Z'
    },
    {
      id: 'USR-003',
      name: 'Vanguard Capital',
      email: 'lender@apexlend.ai',
      password: '$2b$12$Sz/bnOWsNDgvlClY1rMnOeGq1I.fjuWx.RU0i35XOQq0aJylnJ3j.',
      role: 'lender',
      status: 'Active',
      createdAt: '2026-07-29T12:00:00Z'
    }
  ],
  loanRequests: [
    {
      id: 'LR-8821',
      borrowerName: 'Tinashe Moyo',
      borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      businessName: 'Highveld Horticulture Co.',
      category: 'Agricultural Expansion',
      amountRequested: 25000,
      currency: 'USD',
      tenureMonths: 18,
      creditScore: 765,
      riskScore: 'Low Risk (A+)',
      purpose: 'Drip irrigation installation & macadamia nut export expansion in Mutare.',
      location: 'Mutare, Zimbabwe',
      status: 'Bidding Active',
      createdAt: '12 mins ago',
      offers: [
        {
          id: 'LO-101',
          lenderName: 'Horizon Commercial Bank',
          lenderType: 'Commercial Bank',
          lenderLogo: 'Building2',
          interestRate: 8.5,
          monthlyPayment: 1482,
          totalRepayment: 26676,
          approvalProbability: 98,
          turnaroundTimeHours: 4,
          specialFeatures: ['Flexible harvest schedule', '0% early payout penalty']
        },
        {
          id: 'LO-102',
          lenderName: 'Apex Agribusiness Fund',
          lenderType: 'Commercial Bank',
          lenderLogo: 'Leaf',
          interestRate: 7.9,
          monthlyPayment: 1475,
          totalRepayment: 26550,
          approvalProbability: 95,
          turnaroundTimeHours: 2,
          specialFeatures: ['Bundled crop insurance', 'Free FX conversion waiver']
        },
        {
          id: 'LO-103',
          lenderName: 'Vanguard SADC Impact Fund',
          lenderType: 'SADC Private Equity',
          lenderLogo: 'TrendingUp',
          interestRate: 7.2,
          monthlyPayment: 1468,
          totalRepayment: 26424,
          approvalProbability: 91,
          turnaroundTimeHours: 6,
          specialFeatures: ['ESG Carbon credit rebate', 'Direct buyer export channel']
        }
      ]
    },
    {
      id: 'LR-8824',
      borrowerName: 'Chipo Nyathi',
      borrowerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      businessName: 'SunPower Zim Commercial',
      category: 'Solar Infrastructure',
      amountRequested: 85000,
      currency: 'USD',
      tenureMonths: 36,
      creditScore: 790,
      riskScore: 'Low Risk (A+)',
      purpose: 'Installing 150kW commercial solar array for industrial park in Msasa, Harare.',
      location: 'Harare, Zimbabwe',
      status: 'Bidding Active',
      createdAt: '45 mins ago',
      offers: [
        {
          id: 'LO-201',
          lenderName: 'EcoLend Renewable Energy Desk',
          lenderType: 'Commercial Bank',
          lenderLogo: 'Zap',
          interestRate: 6.8,
          monthlyPayment: 2616,
          totalRepayment: 94176,
          approvalProbability: 99,
          turnaroundTimeHours: 1,
          specialFeatures: ['Equipment lien collateral', 'Green energy subsidy rate']
        },
        {
          id: 'LO-202',
          lenderName: 'GeoPower Clean Infra',
          lenderType: 'Commercial Bank',
          lenderLogo: 'Globe',
          interestRate: 7.4,
          monthlyPayment: 2640,
          totalRepayment: 95040,
          approvalProbability: 93,
          turnaroundTimeHours: 3,
          specialFeatures: ['Grid feed-in tariff financing', '100% equipment coverage']
        }
      ]
    },
    {
      id: 'LR-8830',
      borrowerName: 'Kudzai Sibanda',
      borrowerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      businessName: 'Harare Logistics & Express',
      category: 'Retail Working Capital',
      amountRequested: 15000,
      currency: 'USD',
      tenureMonths: 12,
      creditScore: 710,
      riskScore: 'Moderate (B)',
      purpose: 'Acquiring 3 last-mile electric delivery bikes and warehouse inventory management system.',
      location: 'Bulawayo, Zimbabwe',
      status: 'Bidding Active',
      createdAt: '2 hours ago',
      offers: [
        {
          id: 'LO-301',
          lenderName: 'FinWallet Merchant Credit',
          lenderType: 'FinTech Syndicate',
          lenderLogo: 'Smartphone',
          interestRate: 9.2,
          monthlyPayment: 1313,
          totalRepayment: 15756,
          approvalProbability: 96,
          turnaroundTimeHours: 0.5,
          specialFeatures: ['Instant mobile wallet disbursement', 'Daily POS revenue deductions']
        }
      ]
    }
  ],
  projectPitches: [
    {
      id: 'PRJ-101',
      title: 'Zambezi Valley Organic Blueberry Venture',
      tagline: 'High-yield drip-irrigated blueberry export farm targeting EU & Gulf markets.',
      category: 'Agriculture & AgriTech',
      targetCapital: 150000,
      raisedCapital: 112500,
      currency: 'USD',
      projectedROI: 22.4,
      minInvestment: 500,
      durationMonths: 24,
      location: 'Kariba Region',
      country: 'Zimbabwe',
      countryCode: 'zw',
      entrepreneur: {
        name: 'Dr. Farai Mudarikwa',
        role: 'Agri-Economist & Lead Founder',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      pitchSummary: 'Constructing a 20-hectare automated climate-controlled blueberry plantation. 60% of off-take is secured via pre-signed forward supply agreements with European retail distributors.',
      image: 'https://images.unsplash.com/photo-1595231712325-9fede2755282?auto=format&fit=crop&w=800&q=80',
      backersCount: 48,
      riskRating: 'AA',
      highlights: ['Off-take buyer contract signed', 'Solar-powered cold storage', 'GlobalGAP Certified']
    },
    {
      id: 'PRJ-102',
      title: 'Matabeleland 5MW Distributed Solar Micro-Grid',
      tagline: 'Providing reliable clean electricity to 12 mining sites and 4,000 rural households.',
      category: 'Renewable Energy',
      targetCapital: 450000,
      raisedCapital: 380000,
      currency: 'USD',
      projectedROI: 18.5,
      minInvestment: 1000,
      durationMonths: 48,
      location: 'Gwanda District',
      country: 'Zimbabwe',
      countryCode: 'zw',
      entrepreneur: {
        name: 'Tendai Zhou, PE',
        role: 'Renewable Energy Systems Engineer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      pitchSummary: 'Hybrid solar plus BESS (battery energy storage system) replacing diesel generators. Guaranteed revenue model backed by long-term Power Purchase Agreements (PPAs).',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      backersCount: 112,
      riskRating: 'AAA',
      highlights: ['PPA backed by escrow bank account', '20-year asset life', 'Carbon credit monetization']
    },
    {
      id: 'PRJ-103',
      title: 'PayZim Cross-Border Settlement API',
      tagline: 'Instant low-fee settlement layer for intra-SADC remittance and trade finance.',
      category: 'Fintech & Digital Trade',
      targetCapital: 250000,
      raisedCapital: 190000,
      currency: 'USD',
      projectedROI: 31.0,
      minInvestment: 250,
      durationMonths: 18,
      location: 'Harare Innovation Hub',
      country: 'Zimbabwe',
      countryCode: 'zw',
      entrepreneur: {
        name: 'Rudo Gava',
        role: 'Former Senior Payments Architect',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      pitchSummary: 'Sub-second digital currency bridging ZWG, ZAR, and USD. Eliminates 90% of wire friction for SADC cross-border merchants and informal cross-border traders.',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      backersCount: 154,
      riskRating: 'A',
      highlights: ['Central Bank Sandbox participant', 'Licensed payment provider partner', '28k monthly active merchants']
    },
    {
      id: 'PRJ-104',
      title: 'Gaborone Green Freight Fleet Electrification',
      tagline: 'Commercial EV trucks connecting Botswana, South Africa, and Zimbabwe transit routes.',
      category: 'Real Estate & Logistics',
      targetCapital: 320000,
      raisedCapital: 160000,
      currency: 'USD',
      projectedROI: 19.8,
      minInvestment: 500,
      durationMonths: 36,
      location: 'Gaborone Corridor',
      country: 'Botswana',
      countryCode: 'bw',
      entrepreneur: {
        name: 'Kabo Kgosi',
        role: 'Logistics Operations Director',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      pitchSummary: 'Fleet expansion of heavy-duty electric haulage trucks servicing SADC copper and agricultural corridors.',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      backersCount: 79,
      riskRating: 'AA',
      highlights: ['Long-term logistics leases', '62% fuel cost reduction', 'Cross-border green corridor status']
    }
  ],
  institutions: [
    {
      id: 'INST-01',
      name: 'Horizon Commercial Bank',
      code: 'HORIZON-ZW',
      logo: 'Building2',
      country: 'Zimbabwe',
      countryCode: 'zw',
      activeLiquidityUSD: 14500000,
      minTicketUSD: 5000,
      maxTicketUSD: 500000,
      preferredCategories: ['Agricultural Expansion', 'Solar Infrastructure', 'Mining Equipment'],
      autoBidEnabled: true,
      bidsSubmitted: 1420
    },
    {
      id: 'INST-02',
      name: 'Apex Agribusiness Fund',
      code: 'APEX-AGRI',
      logo: 'Leaf',
      country: 'Zimbabwe',
      countryCode: 'zw',
      activeLiquidityUSD: 28000000,
      minTicketUSD: 2500,
      maxTicketUSD: 1000000,
      preferredCategories: ['Agricultural Expansion', 'Retail Working Capital', 'Real Estate & Logistics'],
      autoBidEnabled: true,
      bidsSubmitted: 3105
    },
    {
      id: 'INST-03',
      name: 'Vanguard SADC Private Credit',
      code: 'VANGUARD-SADC',
      logo: 'TrendingUp',
      country: 'South Africa / SADC',
      countryCode: 'za',
      activeLiquidityUSD: 50000000,
      minTicketUSD: 20000,
      maxTicketUSD: 2500000,
      preferredCategories: ['Renewable Energy', 'Fintech & Digital Trade', 'Solar Infrastructure'],
      autoBidEnabled: true,
      bidsSubmitted: 890
    },
    {
      id: 'INST-04',
      name: 'EcoLend Renewable Energy Desk',
      code: 'ECOLEND-ZW',
      logo: 'Zap',
      country: 'Zimbabwe',
      countryCode: 'zw',
      activeLiquidityUSD: 18200000,
      minTicketUSD: 1000,
      maxTicketUSD: 750000,
      preferredCategories: ['Solar Infrastructure', 'Tech Startup Seed', 'Retail Working Capital'],
      autoBidEnabled: false,
      bidsSubmitted: 945
    }
  ],
  fxRates: [
    {
      pair: 'USD / ZWG',
      baseCurrency: 'USD',
      quoteCurrency: 'ZWG',
      rate: 13.85,
      change24h: 0.12,
      buyRate: 13.80,
      sellRate: 13.90,
      lastUpdated: 'Live Central Bank Rate'
    },
    {
      pair: 'USD / ZAR',
      baseCurrency: 'USD',
      quoteCurrency: 'ZAR',
      rate: 18.24,
      change24h: -0.45,
      buyRate: 18.20,
      sellRate: 18.28,
      lastUpdated: 'Live SADC Interbank'
    },
    {
      pair: 'ZWG / ZAR',
      baseCurrency: 'ZWG',
      quoteCurrency: 'ZAR',
      rate: 1.317,
      change24h: 0.08,
      buyRate: 1.310,
      sellRate: 1.324,
      lastUpdated: 'Direct Triangulated Rate'
    },
    {
      pair: 'USD / BWP',
      baseCurrency: 'USD',
      quoteCurrency: 'BWP',
      rate: 13.62,
      change24h: 0.15,
      buyRate: 13.58,
      sellRate: 13.66,
      lastUpdated: 'Bank of Botswana'
    }
  ],
  insuranceProducts: [
    {
      id: 'INS-01',
      title: 'AgriGuard Climate & Drought Shield',
      provider: 'Vanguard Climate Insurance',
      coverageType: 'Crop & Livestock',
      monthlyPremiumUSD: 45,
      maxCoverageUSD: 30000,
      deductibleUSD: 250,
      features: ['Satellite parametric rainfall monitoring', 'Payout within 48 hours of drought index trigger', 'Includes hail & pest coverage']
    },
    {
      id: 'INS-02',
      title: 'Solar & Inverter Asset Protection',
      provider: 'SafeShield Asset Protection',
      coverageType: 'Solar Asset Damage',
      monthlyPremiumUSD: 60,
      maxCoverageUSD: 100000,
      deductibleUSD: 500,
      features: ['Comprehensive surge & lightning protection', 'Theft & battery replacement coverage', 'Business downtime revenue indemnity']
    },
    {
      id: 'INS-03',
      title: 'SADC Cross-Border Transit Security',
      provider: 'GlobalTransit Cargo Insurance',
      coverageType: 'Cross-Border Cargo',
      monthlyPremiumUSD: 85,
      maxCoverageUSD: 150000,
      deductibleUSD: 750,
      features: ['Corridor port-to-door protection', 'GPS tracking integration', 'Border delay loss guarantee']
    }
  ]
};

// Fallback JSON operations
function loadFallbackDb() {
  if (fs.existsSync(FALLBACK_DB_PATH)) {
    try {
      const data = fs.readFileSync(FALLBACK_DB_PATH, 'utf-8');
      fallbackDb = JSON.parse(data);
      if (!fallbackDb.users) {
        fallbackDb.users = [...SEED_DATA.users];
        saveFallbackDb();
      }
    } catch (e) {
      console.error('Failed to read fallback DB, reinitializing:', e);
      fallbackDb = { ...SEED_DATA };
      saveFallbackDb();
    }
  } else {
    fallbackDb = { ...SEED_DATA };
    saveFallbackDb();
  }
}

function saveFallbackDb() {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(fallbackDb, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write to fallback DB:', e);
  }
}

// Database init
export async function initDb(uri) {
  try {
    console.log('Connecting to MongoDB at:', uri);
    mongoose.set('strictQuery', false);
    
    // Connect with a 2 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    
    isConnected = true;
    console.log('✔ MongoDB connected successfully!');
    
    // Seed MongoDB if empty
    await seedMongo();
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ MongoDB connection failed. Falling back to Local JSON File Storage Mode.');
    loadFallbackDb();
  }
}

async function seedMongo() {
  try {
    const instCount = await Institution.countDocuments();
    if (instCount === 0) {
      console.log('Seeding initial data into MongoDB...');
      await User.insertMany(SEED_DATA.users);
      await LoanRequest.insertMany(SEED_DATA.loanRequests);
      await ProjectPitch.insertMany(SEED_DATA.projectPitches);
      await Institution.insertMany(SEED_DATA.institutions);
      await FxRate.insertMany(SEED_DATA.fxRates);
      await InsuranceProduct.insertMany(SEED_DATA.insuranceProducts);
      console.log('✔ Seeding complete.');
    } else {
      // Seed users collection separately if it is empty but other collections exist
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('Seeding initial users into MongoDB...');
        await User.insertMany(SEED_DATA.users);
        console.log('✔ User seeding complete.');
      }
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

// Unified CRUD Data Interface
export async function getLoanRequests() {
  if (isConnected) {
    return await LoanRequest.find({}).sort({ createdAt: -1 });
  } else {
    return fallbackDb.loanRequests;
  }
}

export async function saveLoanRequest(newRequest) {
  if (isConnected) {
    const req = new LoanRequest(newRequest);
    return await req.save();
  } else {
    fallbackDb.loanRequests.unshift(newRequest);
    saveFallbackDb();
    return newRequest;
  }
}

export async function updateLoanRequest(id, updatedRequest) {
  if (isConnected) {
    return await LoanRequest.findOneAndUpdate({ id }, updatedRequest, { new: true });
  } else {
    const idx = fallbackDb.loanRequests.findIndex(r => r.id === id);
    if (idx !== -1) {
      fallbackDb.loanRequests[idx] = updatedRequest;
      saveFallbackDb();
      return updatedRequest;
    }
    return null;
  }
}

export async function getProjectPitches() {
  if (isConnected) {
    return await ProjectPitch.find({});
  } else {
    return fallbackDb.projectPitches;
  }
}

export async function saveProjectPitch(newPitch) {
  if (isConnected) {
    const pitch = new ProjectPitch(newPitch);
    return await pitch.save();
  } else {
    fallbackDb.projectPitches.unshift(newPitch);
    saveFallbackDb();
    return newPitch;
  }
}

export async function getInstitutions() {
  if (isConnected) {
    return await Institution.find({});
  } else {
    return fallbackDb.institutions;
  }
}

export async function updateInstitutionRules(id, updates) {
  if (isConnected) {
    return await Institution.findOneAndUpdate({ id }, updates, { new: true });
  } else {
    const idx = fallbackDb.institutions.findIndex(i => i.id === id);
    if (idx !== -1) {
      fallbackDb.institutions[idx] = { ...fallbackDb.institutions[idx], ...updates };
      saveFallbackDb();
      return fallbackDb.institutions[idx];
    }
    return null;
  }
}

export async function getFxRates() {
  if (isConnected) {
    return await FxRate.find({});
  } else {
    return fallbackDb.fxRates;
  }
}

export async function getInsuranceProducts() {
  if (isConnected) {
    return await InsuranceProduct.find({});
  } else {
    return fallbackDb.insuranceProducts;
  }
}

// User Accounts CRUD
export async function getUsers() {
  if (isConnected) {
    return await User.find({});
  } else {
    return fallbackDb.users || [];
  }
}

export async function saveUser(newUser) {
  if (isConnected) {
    const u = new User(newUser);
    return await u.save();
  } else {
    if (!fallbackDb.users) fallbackDb.users = [];
    fallbackDb.users.push(newUser);
    saveFallbackDb();
    return newUser;
  }
}

export async function updateUserStatus(id, status) {
  if (isConnected) {
    return await User.findOneAndUpdate({ id }, { status }, { new: true });
  } else {
    const idx = fallbackDb.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      fallbackDb.users[idx].status = status;
      saveFallbackDb();
      return fallbackDb.users[idx];
    }
    return null;
  }
}

export async function deleteUser(id) {
  if (isConnected) {
    return await User.findOneAndDelete({ id });
  } else {
    const idx = fallbackDb.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const deleted = fallbackDb.users.splice(idx, 1);
      saveFallbackDb();
      return deleted[0];
    }
    return null;
  }
}

export async function getUserByEmail(email) {
  if (isConnected) {
    return await User.findOne({ email });
  } else {
    if (!fallbackDb.users) fallbackDb.users = [];
    return fallbackDb.users.find(u => u.email === email) || null;
  }
}

export async function updateUser(id, updates) {
  if (isConnected) {
    return await User.findOneAndUpdate({ id }, updates, { new: true });
  } else {
    const idx = fallbackDb.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      fallbackDb.users[idx] = { ...fallbackDb.users[idx], ...updates };
      saveFallbackDb();
      return fallbackDb.users[idx];
    }
    return null;
  }
}

export async function updateProjectPitch(id, updates) {
  if (isConnected) {
    return await ProjectPitch.findOneAndUpdate({ id }, updates, { new: true });
  } else {
    const idx = fallbackDb.projectPitches.findIndex(p => p.id === id);
    if (idx !== -1) {
      fallbackDb.projectPitches[idx] = { ...fallbackDb.projectPitches[idx], ...updates };
      saveFallbackDb();
      return fallbackDb.projectPitches[idx];
    }
    return null;
  }
}
