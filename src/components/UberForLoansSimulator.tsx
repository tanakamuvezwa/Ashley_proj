import React, { useState } from 'react';
import { INITIAL_LOAN_REQUESTS } from '../data/mockData';
import { LoanRequest, LoanOffer } from '../types';
import { 
  Zap, 
  Sparkles, 
  CheckCircle, 
  DollarSign, 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Sliders, 
  Check, 
  ArrowRight,
  UserCheck,
  Percent,
  Calculator
} from 'lucide-react';

export const UberForLoansSimulator: React.FC = () => {
  // Form State for creating a new loan / funding request
  const [amount, setAmount] = useState<number>(20000);
  const [tenure, setTenure] = useState<number>(18);
  const [category, setCategory] = useState<LoanRequest['category']>('Agricultural Expansion');
  const [businessName, setBusinessName] = useState<string>('ZimAgri Fresh Harvest Ltd');
  const [borrowerName, setBorrowerName] = useState<string>('Ashley Chimutengwende');
  const [purpose, setPurpose] = useState<string>('Purchasing solar water pumps and cold storage truck for horticulture exports.');
  const [location, setLocation] = useState<string>('Harare, Zimbabwe');

  // Simulation State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationProgress, setEvaluationProgress] = useState<number>(0);
  const [generatedRequest, setGeneratedRequest] = useState<LoanRequest | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  // Existing active loan requests on the marketplace
  const [requestsList, setRequestsList] = useState<LoanRequest[]>(INITIAL_LOAN_REQUESTS);

  // Trigger AI Matching Process
  const handleRunAiMatching = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setEvaluationProgress(15);
    setGeneratedRequest(null);
    setSelectedOffer(null);
    setIsAccepted(false);

    const interval = setInterval(() => {
      setEvaluationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          
          // Generate simulated real-time offers
          const monthlyPaymentEst = Math.round((amount * (1 + 0.08)) / tenure);
          const totalRepaymentEst = monthlyPaymentEst * tenure;

          const newRequest: LoanRequest = {
            id: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
            borrowerName: borrowerName || 'Ashley Project Lead',
            borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            businessName: businessName || 'SADC Project Innovation',
            category: category,
            amountRequested: amount,
            currency: 'USD',
            tenureMonths: tenure,
            creditScore: 785,
            riskScore: 'Low Risk (A+)',
            purpose: purpose,
            location: location,
            status: 'Bidding Active',
            createdAt: 'Just Now',
            offers: [
              {
                id: `LO-${Math.random()}`,
                lenderName: 'Stanbic Bank Zimbabwe',
                lenderType: 'Commercial Bank',
                lenderLogo: '🏛️',
                interestRate: 7.8,
                monthlyPayment: monthlyPaymentEst,
                totalRepayment: totalRepaymentEst,
                approvalProbability: 99,
                turnaroundTimeHours: 1,
                specialFeatures: ['Direct supplier payment', '0% early settlement fee', 'Dedicated relationship officer']
              },
              {
                id: `LO-${Math.random()}`,
                lenderName: 'CBZ Agribusiness & Private Capital',
                lenderType: 'Commercial Bank',
                lenderLogo: '🌿',
                interestRate: 7.2,
                monthlyPayment: Math.round(monthlyPaymentEst * 0.98),
                totalRepayment: Math.round(totalRepaymentEst * 0.98),
                approvalProbability: 96,
                turnaroundTimeHours: 2,
                specialFeatures: ['Bundled agricultural insurance discount', 'Grace period until first harvest']
              },
              {
                id: `LO-${Math.random()}`,
                lenderName: 'Old Mutual SADC Impact Fund',
                lenderType: 'SADC Private Equity',
                lenderLogo: '🦁',
                interestRate: 6.9,
                monthlyPayment: Math.round(monthlyPaymentEst * 0.96),
                totalRepayment: Math.round(totalRepaymentEst * 0.96),
                approvalProbability: 92,
                turnaroundTimeHours: 4,
                specialFeatures: ['ESG Sustainability rebate', 'Regional export facilitation']
              }
            ]
          };

          setGeneratedRequest(newRequest);
          setRequestsList((prevList) => [newRequest, ...prevList]);
          setIsEvaluating(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleAcceptOffer = (offer: LoanOffer) => {
    setSelectedOffer(offer);
    setIsAccepted(true);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" />
            <span>AI Automated Bidding Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            "Uber for Loans" Matching Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Submit your project capital request. MBONGOCIRCLE's AI underwrites your profile in real-time and alerts competing banks & capital providers to bid for your loan.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <div className="flex -space-x-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs">🏛️</span>
            <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-xs">🌿</span>
            <span className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-xs">⚡</span>
          </div>
          <div className="text-xs text-slate-300">
            <p className="font-bold text-white">28 Active Lenders Online</p>
            <p className="text-[11px] text-emerald-400">Average response: 4 mins</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Loan Request Form */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800/90 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>Request Capital / Loan</span>
              </h3>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                Instant AI Underwrite
              </span>
            </div>

            <form onSubmit={handleRunAiMatching} className="space-y-5">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Project / Loan Purpose Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Agricultural Expansion">Agricultural & AgriTech Expansion</option>
                  <option value="Solar Infrastructure">Solar & Clean Energy Infrastructure</option>
                  <option value="Retail Working Capital">Retail Working Capital & Inventory</option>
                  <option value="Mining Equipment">Mining & Heavy Machinery Finance</option>
                  <option value="Tech Startup Seed">Tech Startup & Innovation Seed</option>
                </select>
              </div>

              {/* Amount Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Capital Amount (USD)
                  </label>
                  <span className="text-lg font-black gold-gradient-text font-mono">
                    ${amount.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={250000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>$2,000</span>
                  <span>$100,000</span>
                  <span>$250,000</span>
                </div>
              </div>

              {/* Tenure Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Repayment Tenure
                  </label>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {tenure} Months
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 18, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenure(m)}
                      className={`py-2 text-xs font-bold rounded-xl transition ${
                        tenure === m
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/30'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Borrower & Project Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Business / Project</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    placeholder="Company Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location & Purpose Summary</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs resize-none"
                  placeholder="Describe what funds will be used for..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>AI Underwriting & Dispatching Bids... ({evaluationProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-slate-950" />
                    <span>Request AI Live Offers Now</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: AI Bidding Engine Results & Live Feed */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Progress Bar when evaluating */}
          {isEvaluating && (
            <div className="glass-card p-6 rounded-3xl border-emerald-500/30 text-center animate-pulse">
              <div className="flex items-center justify-center space-x-3 text-emerald-400 mb-3">
                <Sparkles className="w-6 h-6 animate-spin" />
                <span className="font-bold text-lg">AI Financial Underwriter at Work...</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Analyzing credit risk score, cash flow capability, asset collateral, and broadcasting loan parameters to CBZ, Stanbic, NMB, and Old Mutual funds.
              </p>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
                  style={{ width: `${evaluationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Generated Loan Offers Section (When user ran AI match) */}
          {generatedRequest && !isEvaluating && (
            <div className="glass-card p-6 rounded-3xl border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 to-slate-900/90 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      3 Institutional Bids Received for ${generatedRequest.amountRequested.toLocaleString()}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">
                      AI Underwriting Completed • Risk Grade: {generatedRequest.riskScore} • Score: {generatedRequest.creditScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* Loan Offers Cards List */}
              <div className="space-y-4 my-6">
                {generatedRequest.offers.map((offer) => (
                  <div 
                    key={offer.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{offer.lenderLogo}</span>
                        <h4 className="font-bold text-white text-base">{offer.lenderName}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-full">
                          {offer.lenderType}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                        <span>Rate: <strong className="text-emerald-400">{offer.interestRate}% APR</strong></span>
                        <span>Monthly: <strong className="text-white font-mono">${offer.monthlyPayment.toLocaleString()}</strong></span>
                        <span>Match Confidence: <strong className="text-amber-400">{offer.approvalProbability}%</strong></span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {offer.specialFeatures.map((feat, idx) => (
                          <span key={idx} className="inline-flex items-center text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                            <Check className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-900/30 transition shrink-0 cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>Accept & Disburse</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offer Acceptance Celebration Modal / Banner */}
          {isAccepted && selectedOffer && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-slate-900 border-2 border-emerald-400 shadow-2xl text-white animate-bounce-short">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-2xl">
                    🎉
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-white">Loan Offer Accepted!</h4>
                    <p className="text-xs text-emerald-200">
                      Disbursement contract generated with <strong>{selectedOffer.lenderName}</strong>.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAccepted(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">Approved Amount</span>
                  <p className="font-bold text-emerald-400 text-sm">${amount.toLocaleString()} USD</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Interest Rate</span>
                  <p className="font-bold text-white text-sm">{selectedOffer.interestRate}% APR</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Estimated Payout</span>
                  <p className="font-bold text-amber-400 text-sm">Within 2 Hours</p>
                </div>
              </div>
            </div>
          )}

          {/* Active Marketplace Loan Requests Feed */}
          <div className="glass-card p-6 rounded-3xl border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span>Live Marketplace Requests Receiving Offers</span>
              </h3>
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Feed</span>
              </span>
            </div>

            <div className="space-y-4">
              {requestsList.map((req) => (
                <div 
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={req.borrowerAvatar} 
                        alt={req.borrowerName} 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white">{req.businessName}</h4>
                        <p className="text-[11px] text-slate-400">{req.borrowerName} • {req.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-amber-400 font-mono">${req.amountRequested.toLocaleString()} USD</p>
                      <span className="text-[10px] text-emerald-400 font-semibold">{req.offers.length} Competitive Bids</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 mb-3">
                    "{req.purpose}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{req.createdAt}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                      Best Rate Offered: {Math.min(...req.offers.map(o => o.interestRate))}% APR
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
