import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Activity, 
  Cpu, 
  Database,
  Lock,
  ChevronRight,
  TrendingUp,
  Building2,
  ArrowRightLeft,
  Quote
} from 'lucide-react';

interface LandingPageProps {
  onStartLoanRequest: () => void;
  onBrowseProjects: () => void;
  onNavigateToTab: (tab: 'uber-loans' | 'projects' | 'services') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLoanRequest,
  onBrowseProjects,
  onNavigateToTab
}) => {
  return (
    <div className="bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      
      {/* Shifting radial glow background */}
      <div className="absolute top-1/10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] -z-10" />

      {/* Main Centered Minimalist Hero - MindSphere style */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-10 relative">
        
        {/* Animated Centered Credit Underwriting Vault */}
        <div className="relative flex items-center justify-center py-4">
          
          {/* Radial glowing backdrop circle */}
          <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px] -z-10 animate-pulse" />
          
          {/* Glowing Ring representing robot sphere backdrop */}
          <div className="relative w-56 h-56 rounded-full border border-emerald-500/20 bg-slate-900/60 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-emerald-500/10 animate-pulse" />
            
            {/* CSS Floating Shield */}
            <div className="relative z-10 animate-float flex flex-col items-center justify-center">
              <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 shadow-xl relative group hover:border-emerald-500/50 transition duration-300">
                <ShieldCheck className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                <Cpu className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-spin-slow" />
              </div>
            </div>

            {/* Glowing Scan Laser Line */}
            <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan" />
          </div>
        </div>

        {/* Spacious Typography */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Where SME Credit Connects, Underwrites, and Settles.
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed font-light">
            ApexLend maps credit profiles and routes commercial bank liquidity pools across SADC automatically. Establish underwriting clearances in under 4 minutes.
          </p>
        </div>

        {/* Single MindSphere style Connect CTA */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onStartLoanRequest}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 cursor-pointer border border-emerald-400/20"
          >
            <span>Enter Bidding Desk</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </section>

      {/* Reorganized Workspace Selector Cards - Clean, Spacious, Easy to Understand */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 space-y-10">
        
        <div className="text-center space-y-2">
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider block">Unified Control Panel</span>
          <h2 className="text-2xl font-bold text-white">Select Workspace Gateway</h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Choose a corridor desk below to query matched funding offers, pitch ventures, or inspect sovereign settlement API logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "SME Credit Matching",
              desc: "Submit operational turnover, check credit ratings, and trigger automated bidding matching lists.",
              tab: "uber-loans" as const,
              actionText: "Open Underwriting Desk",
              icon: <Activity className="w-5 h-5 text-emerald-400" />
            },
            {
              title: "Venture Investment Hub",
              desc: "Browse vetted agricultural, logistics, and solar pipeline ventures raising debt in the region.",
              tab: "projects" as const,
              actionText: "Browse Pitch Room",
              icon: <TrendingUp className="w-5 h-5 text-amber-400" />
            },
            {
              title: "FX Corridor Settlement",
              desc: "Clear cross-border transactions automatically across USD, ZWG, and ZAR bank channels.",
              tab: "services" as const,
              actionText: "View Exchange Rates",
              icon: <ArrowRightLeft className="w-5 h-5 text-sky-400" />
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col justify-between hover:border-white/15 hover:bg-slate-900/30 transition duration-300 group"
            >
              <div className="space-y-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 inline-block shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
              
              <button
                onClick={() => onNavigateToTab(item.tab)}
                className="mt-6 w-full py-2.5 rounded-lg bg-slate-950 group-hover:bg-slate-900 text-slate-300 group-hover:text-white border border-white/5 group-hover:border-white/10 text-[10px] font-bold uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>{item.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </section>

      {/* Spacious Testimonials Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Lender & Borrower Endorsements</h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Regulated SADC fund managers and entrepreneurs share their experiences using ApexLend's real-time matching rails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "ApexLend cut down our underwritten capital request cycle from 45 days to under a week. Having commercial banks submit matching bids for our citrus concentrates division was a game-changer.",
              name: "Ashley Muvezwa",
              role: "CEO, Highveld Horticulture Co. (Mutare)",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&h=250&q=80"
            },
            {
              quote: "As a regional private equity manager, origination has always been our bottleneck. The ApexLend administrative desk allows us to configure rules and participate in matched loans programmatically.",
              name: "Nkosana Ncube",
              role: "Managing Partner, SADC Impact Credit Fund",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=250&q=80"
            }
          ].map((testi, i) => (
            <div key={i} className="glass-card p-6.5 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col justify-between space-y-5 relative">
              <Quote className="absolute top-5 right-6 w-8 h-8 text-slate-800/10" />
              <p className="text-slate-300 text-xs font-light leading-relaxed italic z-10">"{testi.quote}"</p>
              
              <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl overflow-hidden aspect-square border border-white/10 shrink-0">
                  <img src={testi.img} alt={testi.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{testi.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SADC Regional Settlement Corridors */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 text-center space-y-10">
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-bold text-white">Direct Sovereign Settlement</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            By standardizing credit profiles and escrow rails, ApexLend connects financial nodes between primary SADC commercial centers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
          {[
            { name: "Zimbabwe (HQ)", code: "zw", flow: "$42.8M Deployed", id: 1056 },
            { name: "South Africa", code: "za", flow: "$28.4M Deployed", id: 1057 },
            { name: "Botswana", code: "bw", flow: "$8.6M Deployed", id: 1058 },
            { name: "Zambia", code: "zm", flow: "$11.2M Deployed", id: 1059 }
          ].map((country, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/20 border border-white/5 space-y-4 hover:border-white/10 transition">
              <div className="flex items-center justify-center space-x-2">
                <img 
                  src={`https://flagcdn.com/w40/${country.code}.png`} 
                  alt={country.name} 
                  className="w-5 h-3.5 object-cover rounded-sm border border-white/5" 
                />
                <span className="font-bold text-xs text-white">{country.name}</span>
              </div>
              <img 
                src={`https://picsum.photos/id/${country.id}/120/80`} 
                alt="Picsum corridor preview" 
                className="w-full h-12 object-cover rounded-lg border border-white/5" 
              />
              <span className="text-[9px] text-emerald-400 font-mono block font-bold">{country.flow}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
