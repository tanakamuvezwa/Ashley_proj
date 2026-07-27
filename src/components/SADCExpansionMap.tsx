import React, { useState } from 'react';
import { 
  Globe2, 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2, 
  ArrowUpRight, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export const SADCExpansionMap: React.FC = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('ZW');

  const sadcMarkets = [
    {
      code: 'ZW',
      country: 'Zimbabwe (Initial Focus HQ)',
      flag: '🇿🇼',
      status: 'Active Anchor Market',
      activeUsers: '142,000+',
      capitalFlowUSD: '$42.8M',
      focusSectors: ['AgriTech Export', 'Commercial Solar', 'Mining Supply Chain', 'SME Credit'],
      keyPartners: ['CBZ Bank', 'Stanbic Zim', 'NMB Bank', 'EcoCash'],
      description: 'Primary technology launchpad. MBONGOCIRCLE connects Zimbabwean projects & businesses to domestic banks and international SADC liquidity pools.'
    },
    {
      code: 'ZA',
      country: 'South Africa',
      flag: '🇿🇦',
      status: 'SADC Expansion Phase 1',
      activeUsers: '68,000+',
      capitalFlowUSD: '$28.4M',
      focusSectors: ['Institutional Debt Funds', 'Cross-Border Freight', 'Renewable Micro-grids'],
      keyPartners: ['Old Mutual Capital', 'Standard Bank SADC', 'JSE Private Market'],
      description: 'Institutional capital hub routing private equity and pension funds into high-yielding Zimbabwean & regional projects.'
    },
    {
      code: 'BW',
      country: 'Botswana',
      flag: '🇧🇼',
      status: 'Active SADC Corridor',
      activeUsers: '24,000+',
      capitalFlowUSD: '$8.6M',
      focusSectors: ['Diamond Logistics', 'Eco-Tourism Debt', 'BWP/USD FX Clearing'],
      keyPartners: ['First Capital Bank', 'Botswana Innovation Hub'],
      description: 'Providing seamless diamond corridor FX liquidity and cross-border commercial equipment financing.'
    },
    {
      code: 'ZM',
      country: 'Zambia',
      flag: '🇿🇲',
      status: 'Active SADC Corridor',
      activeUsers: '31,000+',
      capitalFlowUSD: '$11.2M',
      focusSectors: ['Copperbelt Agri-processing', 'Hydropower Solar Hybrids', 'ZMW Trade'],
      keyPartners: ['Zambia National Commercial Bank', 'Lusaka Private Fund'],
      description: 'Facilitating cross-border agricultural off-take agreements and clean power infrastructure loans.'
    }
  ];

  const activeMarket = sadcMarkets.find((m) => m.code === selectedCountryCode) || sadcMarkets[0];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Globe2 className="w-4 h-4" />
            <span>Regional Strategy & Footprint</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Zimbabwe Anchor & SADC Expansion Roadmap
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            MBONGOCIRCLE is initially focused on Zimbabwe before scaling its AI loan matching network across the Southern African Development Community (SADC).
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-xs">
          <span className="font-bold text-white">345M SADC Population</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-bold">$720B Regional GDP</span>
        </div>
      </div>

      {/* Interactive Country Grid & Active Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: SADC Countries List */}
        <div className="lg:col-span-5 space-y-4">
          {sadcMarkets.map((m) => (
            <div
              key={m.code}
              onClick={() => setSelectedCountryCode(m.code)}
              className={`glass-card p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                selectedCountryCode === m.code
                  ? 'border-emerald-500 bg-emerald-950/25 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{m.flag}</span>
                <div>
                  <h3 className="font-bold text-white text-base">{m.country}</h3>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    ● {m.status}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-mono font-bold text-amber-400">{m.capitalFlowUSD}</p>
                <p className="text-[10px] text-slate-400">Capital Originated</p>
              </div>
            </div>
          ))}

          {/* SADC Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Unified African Financial Ecosystem</span>
            </div>
            <p className="text-slate-300">
              By standardizing credit scoring models and embedded FX rails, MBONGOCIRCLE removes cross-border friction for investors in South Africa or Botswana looking to fund high-yielding projects in Zimbabwe.
            </p>
          </div>
        </div>

        {/* Right Column: Selected Country Strategy Spotlight */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-emerald-500/40 relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{activeMarket.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeMarket.country}</h3>
                  <p className="text-xs text-emerald-400 font-medium">{activeMarket.status}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-mono font-bold border border-slate-800">
                {activeMarket.capitalFlowUSD} Flow
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {activeMarket.description}
            </p>

            {/* Strategic Sector Focus */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Priority Underwriting Sectors in {activeMarket.country}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {activeMarket.focusSectors.map((sector, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sector}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory & Institutional Partners */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Participating Financial Providers & Banking Rails
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeMarket.keyPartners.map((partner, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium">
                    🏛️ {partner}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
