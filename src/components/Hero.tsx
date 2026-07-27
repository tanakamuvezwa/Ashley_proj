import React from 'react';
import { LIVE_FX_RATES } from '../data/mockData';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Briefcase
} from 'lucide-react';

interface HeroProps {
  onStartLoanRequest: () => void;
  onBrowseProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartLoanRequest,
  onBrowseProjects
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-800/60">
      
      {/* Background Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Live Financial & FX Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-card py-2.5 px-4 rounded-2xl flex items-center justify-between overflow-x-auto gap-6 border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-slate-300 text-[11px]">SADC Live Market Ticker:</span>
          </div>

          <div className="flex items-center space-x-6 shrink-0 divide-x divide-slate-800">
            {LIVE_FX_RATES.map((fx) => (
              <div key={fx.pair} className="flex items-center space-x-2 pl-4 first:pl-0 font-mono">
                <span className="text-slate-400 font-sans font-semibold">{fx.pair}:</span>
                <span className="text-white font-bold">{fx.rate}</span>
                <span className={`text-[10px] font-semibold flex items-center ${fx.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fx.change24h >= 0 ? '+' : ''}{fx.change24h}%
                </span>
              </div>
            ))}

            <div className="flex items-center space-x-2 pl-4 shrink-0 font-sans text-amber-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Liquidity Pool: <strong>$84.2M USD</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>MBONGOCIRCLE Holdings Limited • AI Financial Marketplace</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans leading-[1.15] mb-6">
            The <span className="gold-gradient-text">Uber for Loans</span> & Capital Bidding Engine in Africa
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-3xl mx-auto">
            Transforming how individuals, agricultural ventures, solar projects, and businesses discover, negotiate, and secure instant capital from competing commercial banks, private equity, and institutional investors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartLoanRequest}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-900/40 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Get AI Loan Offers (Instant Match)</span>
            </button>

            <button
              onClick={onBrowseProjects}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Browse Project Pitch Marketplace</span>
            </button>
          </div>

          {/* Institutional Trust Matrix Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            
            <div className="glass-card p-4 rounded-2xl text-left border-slate-800/80">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Institutional Network</span>
              </div>
              <p className="text-2xl font-black text-white">28+</p>
              <p className="text-[11px] text-slate-400">Banks & Pension Funds Bidding</p>
            </div>

            <div className="glass-card p-4 rounded-2xl text-left border-slate-800/80">
              <div className="flex items-center space-x-2 text-amber-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Match Speed</span>
              </div>
              <p className="text-2xl font-black text-white">120 Secs</p>
              <p className="text-[11px] text-slate-400">Average AI Underwriting Time</p>
            </div>

            <div className="glass-card p-4 rounded-2xl text-left border-slate-800/80">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Anchor Market</span>
              </div>
              <p className="text-2xl font-black text-white">Zimbabwe</p>
              <p className="text-[11px] text-slate-400">Expanding into SADC Trade</p>
            </div>

            <div className="glass-card p-4 rounded-2xl text-left border-slate-800/80">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Capital Disbursed</span>
              </div>
              <p className="text-2xl font-black text-white">$42.8M</p>
              <p className="text-[11px] text-slate-400">Across 3,200+ Projects & Loans</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
