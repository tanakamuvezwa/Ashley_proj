export type NavigationTab = 'home' | 'uber-loans' | 'projects' | 'institutional' | 'fx' | 'insurance' | 'services' | 'sadc-map' | 'admin-dashboard' | 'dashboard';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'borrower' | 'lender' | 'admin';
  status: 'Active' | 'Suspended';
  createdAt: string;
  token?: string;
}

export interface LoanOffer {
  id: string;
  lenderName: string;
  lenderType: 'Commercial Bank' | 'Microfinance Institution' | 'SADC Private Equity' | 'FinTech Syndicate';
  lenderLogo: string;
  interestRate: number; // annual percentage %
  monthlyPayment: number;
  totalRepayment: number;
  approvalProbability: number; // percentage %
  turnaroundTimeHours: number;
  specialFeatures: string[];
}

export interface LoanRequest {
  id: string;
  borrowerName: string;
  borrowerAvatar: string;
  businessName: string;
  category: 'Agricultural Expansion' | 'Solar Infrastructure' | 'Retail Working Capital' | 'Mining Equipment' | 'Tech Startup Seed';
  amountRequested: number;
  currency: 'USD' | 'ZWG' | 'ZAR';
  tenureMonths: number;
  creditScore: number; // 300 to 850
  riskScore: 'Low Risk (A+)' | 'Moderate (B)' | 'Growth Venture (C+)';
  purpose: string;
  location: string;
  offers: LoanOffer[];
  status: 'Bidding Active' | 'Funded' | 'Under AI Underwriting';
  createdAt: string;
}

export interface ProjectPitch {
  id: string;
  title: string;
  tagline: string;
  category: 'Agriculture & AgriTech' | 'Renewable Energy' | 'Mining & Minerals' | 'Fintech & Digital Trade' | 'Real Estate & Logistics';
  targetCapital: number;
  raisedCapital: number;
  currency: 'USD' | 'ZWG' | 'ZAR';
  projectedROI: number; // annual %
  minInvestment: number;
  durationMonths: number;
  location: string;
  country: 'Zimbabwe' | 'South Africa' | 'Zambia' | 'Botswana' | 'Mozambique';
  countryCode: string;
  entrepreneur: {
    name: string;
    role: string;
    avatar: string;
    verified: boolean;
  };
  pitchSummary: string;
  image: string;
  backersCount: number;
  riskRating: 'AAA' | 'AA' | 'A' | 'BBB';
  highlights: string[];
}

export interface InstitutionalProvider {
  id: string;
  name: string;
  code: string;
  logo: string;
  country: string;
  activeLiquidityUSD: number;
  minTicketUSD: number;
  maxTicketUSD: number;
  preferredCategories: string[];
  autoBidEnabled: boolean;
  bidsSubmitted: number;
}

export interface FXPair {
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  change24h: number;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

export interface InsuranceQuote {
  id: string;
  title: string;
  provider: string;
  coverageType: 'Crop & Livestock' | 'Solar Asset Damage' | 'Cross-Border Cargo' | 'Business Interruption';
  monthlyPremiumUSD: number;
  maxCoverageUSD: number;
  deductibleUSD: number;
  features: string[];
}
