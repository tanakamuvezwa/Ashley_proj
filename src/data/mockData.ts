import { LoanRequest, ProjectPitch, InstitutionalProvider, FXPair, InsuranceQuote } from '../types';

export const INITIAL_LOAN_REQUESTS: LoanRequest[] = [
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
];

export const INITIAL_PROJECT_PITCHES: ProjectPitch[] = [
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
];

export const INSTITUTIONAL_PROVIDERS: InstitutionalProvider[] = [
  {
    id: 'INST-01',
    name: 'Horizon Commercial Bank',
    code: 'HORIZON-ZW',
    logo: 'Building2',
    country: 'Zimbabwe',
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
    activeLiquidityUSD: 18200000,
    minTicketUSD: 1000,
    maxTicketUSD: 750000,
    preferredCategories: ['Solar Infrastructure', 'Tech Startup Seed', 'Retail Working Capital'],
    autoBidEnabled: false,
    bidsSubmitted: 945
  }
];

export const LIVE_FX_RATES: FXPair[] = [
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
];

export const MOCK_INSURANCE_PRODUCTS: InsuranceQuote[] = [
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
];
