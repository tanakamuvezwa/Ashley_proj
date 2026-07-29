import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sliders, 
  Building2, 
  Leaf, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  UserCheck,
  Building
} from 'lucide-react';
import { LoanRequest, LoanOffer } from '../types';

export const UberForLoansSimulator: React.FC = () => {
  // KYC Verification state
  const [kycVerified, setKycVerified] = useState<boolean>(() => {
    return localStorage.getItem('apex_kyc_verified') === 'true';
  });
  const [kycLoading, setKycLoading] = useState<boolean>(false);
  const [kycError, setKycError] = useState<string | null>(null);

  // KYC Form fields
  const [compRegNo, setCompRegNo] = useState('');
  const [dirName, setDirName] = useState('');
  const [bizFile, setBizFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);

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
  const [requestsList, setRequestsList] = useState<LoanRequest[]>([]);

  useEffect(() => {
    fetch('/api/loan-requests')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRequestsList(data);
      })
      .catch(err => console.error('Failed to load loan requests:', err));
  }, []);

  const renderLenderIcon = (logoName: string) => {
    let id = 1018;
    if (logoName === 'Building2') id = 1018;
    else if (logoName === 'Leaf') id = 1019;
    else if (logoName === 'TrendingUp') id = 1020;
    else if (logoName === 'Zap') id = 1021;
    else if (logoName === 'Globe') id = 1022;
    else if (logoName === 'Smartphone') id = 1023;
    
    return (
      <img 
        src={`https://picsum.photos/id/${id}/60/60`} 
        alt={logoName} 
        className="w-7 h-7 rounded-full border border-slate-800 object-cover shrink-0" 
      />
    );
  };

  // Submit KYC Documents
  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compRegNo || !dirName || !bizFile || !idFile) {
      setKycError('Please fill in all details and upload registration/ID files.');
      return;
    }

    setKycLoading(true);
    setKycError(null);

    try {
      // Fetch dynamic user detail if logged in
      const savedUserStr = localStorage.getItem('apex_user');
      const userId = savedUserStr ? JSON.parse(savedUserStr).id : 'GUEST';

      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          documentType: 'Company Incorporation & Director ID',
          fileName: bizFile.name,
          fileSize: bizFile.size
        })
      });

      if (!response.ok) {
        throw new Error('KYC verification check failed');
      }

      // Simulate a small delay for underwriting compliance check
      setTimeout(() => {
        setKycVerified(true);
        localStorage.setItem('apex_kyc_verified', 'true');
        setKycLoading(false);
      }, 1500);

    } catch (err: any) {
      setKycError(err.message || 'Verification failed. Please retry.');
      setKycLoading(false);
    }
  };

  // Trigger AI Matching Process
  const handleRunAiMatching = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setEvaluationProgress(15);
    setGeneratedRequest(null);
    setSelectedOffer(null);
    setIsAccepted(false);

    try {
      const response = await fetch('/api/loan-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName,
          businessName,
          category,
          amountRequested: amount,
          tenureMonths: tenure,
          purpose,
          location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit loan request');
      }

      const newRequest = await response.json();

      // Trigger progress bar increments
      const interval = setInterval(() => {
        setEvaluationProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setGeneratedRequest(newRequest);
            setRequestsList((prevList) => [newRequest, ...prevList]);
            setIsEvaluating(false);
            return 100;
          }
          return prev + 25;
        });
      }, 400);

    } catch (err) {
      console.error('Error matching loan request:', err);
      setIsEvaluating(false);
    }
  };

  const handleAcceptOffer = async (offer: LoanOffer) => {
    if (!generatedRequest) return;
    try {
      const response = await fetch(`/api/loan-requests/${generatedRequest.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id })
      });
      
      const data = await response.json();
      if (data.success) {
        setSelectedOffer(offer);
        setIsAccepted(true);
        // Refresh feed list
        const res = await fetch('/api/loan-requests');
        const list = await res.json();
        if (Array.isArray(list)) setRequestsList(list);
      }
    } catch (err) {
      console.error('Failed to accept offer:', err);
    }
  };

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Real-time matching desk</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Solutions Funding matching workbench
          </h2>
          <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
            Verify identity credentials, submit capital metrics, and obtain competitive debt interest bids directly from participating sovereign institutions in SADC.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-900/60 p-3 rounded-xl border border-white/10 shrink-0">
          <div className="flex -space-x-1.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400"><Building2 className="w-3.5 h-3.5" /></div>
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400"><Leaf className="w-3.5 h-3.5" /></div>
            <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400"><TrendingUp className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-[10px] text-slate-350 leading-tight">
            <p className="font-bold text-white">Liquidity clearing SLA</p>
            <p className="text-emerald-400 font-semibold mt-0.5">Average match: 4 mins</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column Workspace */}
        <div className="lg:col-span-5">
          
          {/* STEP 1: KYC IDENTITY UPLOAD FORM IF NOT VERIFIED */}
          {!kycVerified ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span>KYC Compliance Verification</span>
                </h3>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-light">
                  SADC financial rules require company and director validation before accessing banking desks. Upload documents to clear your profile.
                </p>
              </div>

              {kycError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-450" />
                  <span>{kycError}</span>
                </div>
              )}

              <form onSubmit={handleKycSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Business Registration Number</label>
                  <input
                    type="text"
                    value={compRegNo}
                    onChange={(e) => setCompRegNo(e.target.value)}
                    placeholder="e.g. B/128/2021"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/40 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Director Full Name</label>
                  <input
                    type="text"
                    value={dirName}
                    onChange={(e) => setDirName(e.target.value)}
                    placeholder="As listed on passport/ID"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/40 text-white"
                    required
                  />
                </div>

                {/* File Upload 1 */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Certificate (IPEC / CIPRO PDF)</label>
                  <div className="relative border border-dashed border-white/10 hover:border-white/20 rounded-xl p-4 bg-slate-950/30 text-center cursor-pointer transition">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setBizFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center space-y-1.5 text-slate-400">
                      <Upload className="w-5 h-5 text-emerald-400" />
                      <span className="font-semibold text-[10px]">
                        {bizFile ? bizFile.name : 'Select Incorporation PDF'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* File Upload 2 */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Director ID / Passport photo</label>
                  <div className="relative border border-dashed border-white/10 hover:border-white/20 rounded-xl p-4 bg-slate-950/30 text-center cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center space-y-1.5 text-slate-400">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      <span className="font-semibold text-[10px]">
                        {idFile ? idFile.name : 'Select Identity Image'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={kycLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer"
                >
                  {kycLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>Verify & Clear KYC</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          ) : (
            
            /* STEP 2: ACTIVE DEBT REQUEST SUBMISSION FORM */
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <span>Request SME Capital</span>
                </h3>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KYC cleared</span>
                </span>
              </div>

              <form onSubmit={handleRunAiMatching} className="space-y-4 text-xs">
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Project Sector Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white bg-[#0F172A]"
                  >
                    <option value="Agricultural Expansion">Agricultural Expansion</option>
                    <option value="Solar Infrastructure">Solar Infrastructure</option>
                    <option value="Retail Working Capital">Retail Working Capital</option>
                    <option value="Mining Equipment">Mining Equipment</option>
                    <option value="Tech Startup Seed">Tech Startup Seed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Legal Title</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/40 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Applicant / Director Name</label>
                  <input
                    type="text"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/40 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount requested ($)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full glass-input px-3.5 py-2 rounded-xl text-xs bg-slate-950/40 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tenure Months</label>
                    <input
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full glass-input px-3.5 py-2 rounded-xl text-xs bg-slate-950/40 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Geographic Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mutare, Zimbabwe"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/40 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Purpose & Collateral Security</label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/40 text-white h-20 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer"
                >
                  {isEvaluating ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-slate-955" />
                      <span>Initiate Match Bidding</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          )}

        </div>

        {/* Right Column: AI Bidding & Live Bank Matches Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Matching progress bar overlay */}
          {isEvaluating && (
            <div className="glass-card p-6.5 rounded-2xl border border-white/10 bg-slate-900/40 text-center space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center justify-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Calculating Risk Underwriting Vectors</span>
              </h4>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${evaluationProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Running compliance check: {evaluationProgress}% complete</p>
            </div>
          )}

          {/* Matches Output List */}
          {generatedRequest && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider leading-none">Credit registry ID</p>
                  <p className="font-bold text-white mt-1.5">{generatedRequest.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider leading-none">AI Risk Grade</p>
                  <p className="font-bold text-emerald-400 mt-1.5">{generatedRequest.riskScore}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider leading-none">Total bids arrived</p>
                  <p className="font-bold text-white mt-1.5 text-center">{generatedRequest.offers?.length || 0}</p>
                </div>
              </div>

              {!isAccepted ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white">Bank matches & quotes (Select one)</h4>
                  <div className="grid grid-cols-1 gap-3.5">
                    {generatedRequest.offers?.map((offer) => (
                      <div 
                        key={offer.id} 
                        className="glass-card p-5 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500/45 transition"
                      >
                        <div className="flex items-center space-x-3">
                          {renderLenderIcon(offer.lenderLogo)}
                          <div>
                            <h5 className="font-bold text-white text-xs leading-none">{offer.lenderName}</h5>
                            <span className="text-[9px] text-slate-500 font-bold block mt-1.5 uppercase font-mono">{offer.lenderType}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-[10px] leading-tight font-mono">
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase font-bold">Interest APR</span>
                            <span className="font-bold text-emerald-400 mt-0.5 block">{offer.interestRate}%</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase font-bold">Monthly payment</span>
                            <span className="font-bold text-white mt-0.5 block">${offer.monthlyPayment.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase font-bold">Payout Speed</span>
                            <span className="font-bold text-amber-400 mt-0.5 block">{offer.turnaroundTimeHours}h cleared</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptOffer(offer)}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-lg transition cursor-pointer shrink-0 uppercase tracking-wider"
                        >
                          Accept Bid
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                
                /* Bid accepted success visual check */
                <div className="glass-card p-8 rounded-3xl border border-emerald-500/25 bg-emerald-950/5 text-center space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-white">Escrow Agreement Disbursed Successfully!</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light max-w-md mx-auto">
                      You have accepted the offer from **{selectedOffer?.lenderName}** at **{selectedOffer?.interestRate}% APR**. Funds have been clearing to your verified bank accounts.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 inline-block text-[11px] font-mono text-left space-y-1 text-slate-400">
                    <p>• Transact ID: <span className="text-white font-bold">TXN-{(Math.random() * 1000000).toFixed(0)}</span></p>
                    <p>• Ledger clearing rate: <span className="text-emerald-400 font-bold">{selectedOffer?.interestRate}% APR</span></p>
                    <p>• Settlement speed: <span className="text-white font-bold">Cleared SLA Immediate</span></p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Active Marketplace Loan requests view grid */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Active Sovereign Credit Registries</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {requestsList.slice(0, 4).map((loan) => (
                <div key={loan.id} className="p-4.5 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-white/10 transition space-y-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-black font-mono block leading-none">{loan.id}</span>
                        <h5 className="font-bold text-white text-xs mt-1.5">{loan.businessName}</h5>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        loan.status === 'Funded' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-light line-clamp-2">{loan.purpose}</p>
                  </div>

                  <div className="pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] leading-none">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-medium">Clearance required</span>
                      <span className="font-bold text-white block mt-1.5 font-mono">${loan.amountRequested.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 uppercase font-medium">Bureau Rating</span>
                      <span className="font-bold text-emerald-400 block mt-1.5 font-mono">{loan.creditScore} rating</span>
                    </div>
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
