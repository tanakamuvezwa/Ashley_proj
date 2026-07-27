import React, { useState } from 'react';
import { LIVE_FX_RATES, MOCK_INSURANCE_PRODUCTS } from '../data/mockData';
import { InsuranceQuote } from '../types';
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Globe2, 
  DollarSign,
  Sparkles
} from 'lucide-react';

export const FinancialServicesSuite: React.FC = () => {
  // FX State
  const [amountUSD, setAmountUSD] = useState<number>(1000);
  const [targetCurrency, setTargetCurrency] = useState<'ZWG' | 'ZAR' | 'BWP'>('ZWG');

  // Selected Insurance Policy State
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceQuote | null>(null);
  const [insuredSuccess, setInsuredSuccess] = useState<boolean>(false);

  // FX Rates Lookup
  const getRate = () => {
    if (targetCurrency === 'ZWG') return 13.85;
    if (targetCurrency === 'ZAR') return 18.24;
    if (targetCurrency === 'BWP') return 13.62;
    return 1.0;
  };

  const convertedValue = (amountUSD * getRate()).toFixed(2);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Embedded Financial Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Payments, FX Exchange & Micro-Insurance
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Unified digital ecosystem enabling frictionless currency conversions, instant asset protection quotes, and real-time trade settlement across Zimbabwe & SADC.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: SADC & Zimbabwean FX Converter Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                <span>Instant SADC FX Exchange</span>
              </h3>
              <span className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Zero Friction
              </span>
            </div>

            <div className="space-y-4">
              
              {/* USD Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">You Pay (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    value={amountUSD}
                    onChange={(e) => setAmountUSD(Number(e.target.value))}
                    className="w-full glass-input pl-8 pr-4 py-3 rounded-xl text-lg font-mono font-bold"
                  />
                </div>
              </div>

              {/* Conversion Swap Icon */}
              <div className="flex justify-center -my-2">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Target Currency Output */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Converted Recipient Receives</label>
                  <div className="flex space-x-1">
                    {(['ZWG', 'ZAR', 'BWP'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setTargetCurrency(curr)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          targetCurrency === curr
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
                  <span className="text-2xl font-black gold-gradient-text">{convertedValue} {targetCurrency}</span>
                  <span className="text-xs text-slate-400">Rate: 1 USD = {getRate()} {targetCurrency}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Interbank Settlement:</span>
                  <span className="text-emerald-400 font-medium">Real-Time Gross Settlement (RTGS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fee Savings vs Traditional Banks:</span>
                  <span className="text-amber-400 font-medium">Save ~4.2% per transfer</span>
                </div>
              </div>

              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md shadow-emerald-900/30 transition hover:scale-[1.01]">
                Lock Live Exchange Rate
              </button>

            </div>
          </div>
        </div>

        {/* Right Column: Embedded Micro-Insurance Quote Suite */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Embedded Business & Project Insurance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Protect funded assets with instant climate, theft, and transit coverage</p>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_INSURANCE_PRODUCTS.map((prod) => (
                <div 
                  key={prod.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                        {prod.coverageType}
                      </span>
                      <h4 className="font-bold text-white text-base">{prod.title}</h4>
                    </div>

                    <p className="text-xs text-slate-400">Underwritten by {prod.provider}</p>

                    <div className="flex flex-wrap gap-x-4 text-xs text-slate-300 pt-1 font-mono">
                      <span>Max Cover: <strong className="text-emerald-400">${prod.maxCoverageUSD.toLocaleString()} USD</strong></span>
                      <span>Deductible: <strong className="text-slate-400">${prod.deductibleUSD}</strong></span>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-1">
                      {prod.features.map((f, i) => (
                        <span key={i} className="text-[10px] text-slate-300 bg-slate-950 p-1 px-2 rounded border border-slate-800">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-amber-400 font-mono">${prod.monthlyPremiumUSD}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                    <button
                      onClick={() => {
                        setSelectedInsurance(prod);
                        setInsuredSuccess(true);
                      }}
                      className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
                    >
                      Attach Policy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Insurance Success Confirmation Toast */}
            {insuredSuccess && selectedInsurance && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Attached policy: <strong>{selectedInsurance.title}</strong> (${selectedInsurance.monthlyPremiumUSD}/mo) to your active project ledger.
                  </span>
                </div>
                <button onClick={() => setInsuredSuccess(false)} className="text-slate-400 hover:text-white ml-2">
                  Dismiss
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

    </section>
  );
};
