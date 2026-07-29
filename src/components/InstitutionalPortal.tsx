import React, { useState, useEffect } from 'react';
import { InstitutionalProvider } from '../types';
import { 
  Building2, 
  Bot, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  FileText,
  ToggleLeft,
  ToggleRight,
  PieChart,
  Leaf
} from 'lucide-react';

export const InstitutionalPortal: React.FC = () => {
  const [providers, setProviders] = useState<InstitutionalProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<InstitutionalProvider | null>(null);

  const fetchProviders = () => {
    fetch('/api/institutions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProviders(data);
          if (selectedProvider) {
            const found = data.find(p => p.id === selectedProvider.id);
            if (found) setSelectedProvider(found);
          } else if (data.length > 0) {
            setSelectedProvider(data[0]);
          }
        }
      })
      .catch(err => console.error('Failed to load institutions:', err));
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const renderInstIcon = (logoName: string) => {
    let id = 1018;
    if (logoName === 'Building2') id = 1018;
    else if (logoName === 'Leaf') id = 1019;
    else if (logoName === 'TrendingUp') id = 1020;
    else if (logoName === 'Zap') id = 1021;
    
    return (
      <img 
        src={`https://picsum.photos/id/${id}/60/60`} 
        alt={logoName} 
        className="w-5 h-5 rounded-full border border-slate-800 object-cover shrink-0" 
      />
    );
  };

  // Toggle Auto-Bidding rule for provider
  const toggleAutoBid = async (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return;

    try {
      const response = await fetch(`/api/institutions/${id}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          autoBidEnabled: !provider.autoBidEnabled,
          maxTicketUSD: provider.maxTicketUSD
        })
      });
      if (response.ok) {
        fetchProviders();
      }
    } catch (err) {
      console.error('Failed to toggle auto-bid:', err);
    }
  };

  if (!selectedProvider) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading Capital Providers...</p>
      </div>
    );
  }

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            <span>Institutional & Bank Workbench</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Capital Provider Origination & Auto-Bidding Hub
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            ApexLend serves as the AI technology and distribution layer connecting regulated financial institutions and funds to high-quality project & loan demand across Africa.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl text-emerald-400 text-xs font-semibold">
          <Bot className="w-4 h-4 animate-bounce" />
          <span>AI Programmatic Underwriting Active</span>
        </div>
      </div>

      {/* Select Active Institution Tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {providers.map((inst) => (
          <div
            key={inst.id}
            onClick={() => setSelectedProvider(inst)}
            className={`glass-card p-5 rounded-2xl border transition cursor-pointer ${
              selectedProvider.id === inst.id
                ? 'border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-900/20'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span>{renderInstIcon(inst.logo)}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {inst.country}
              </span>
            </div>
            <h3 className="font-bold text-white text-base mb-1">{inst.name}</h3>
            <p className="text-xs text-slate-400 font-mono mb-3">Code: {inst.code}</p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Deployed Liquidity:</span>
              <span className="text-emerald-400 font-black font-mono">
                ${(inst.activeLiquidityUSD / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Institution Rule Engine & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Auto Bidding Parameters */}
        <div className="lg:col-span-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <span>Auto-Bidding Rule Engine</span>
                </h3>
                <p className="text-xs text-slate-400">{selectedProvider.name} Underwriting Rules</p>
              </div>

              {/* Auto Bid Toggle */}
              <button
                onClick={() => toggleAutoBid(selectedProvider.id)}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
              >
                {selectedProvider.autoBidEnabled ? (
                  <>
                    <ToggleRight className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Auto-Bid Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-6 h-6 text-slate-500" />
                    <span className="text-xs font-bold text-slate-400">Manual Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Rule Sliders & Toggles */}
            <div className="space-y-4 text-xs">
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Minimum Credit Score Cutoff</span>
                  <span className="text-emerald-400 font-mono font-bold">720+ Score</span>
                </div>
                <input type="range" min="650" max="800" defaultValue="720" className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Maximum Ticket Exposure per Loan</span>
                  <span className="text-amber-400 font-mono font-bold">${selectedProvider.maxTicketUSD.toLocaleString()} USD</span>
                </div>
                <input type="range" min="10000" max="1000000" step="10000" defaultValue={selectedProvider.maxTicketUSD} className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded" />
              </div>

              <div>
                <span className="text-slate-300 font-medium block mb-2">Target Underwriting Sectors</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.preferredCategories.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      ✓ {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 mt-4">
                <div className="flex justify-between text-slate-300">
                  <span>Total Bids Placed by Algorithm:</span>
                  <span className="font-bold text-white font-mono">{selectedProvider.bidsSubmitted.toLocaleString()} Bids</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Average Turnaround SLA:</span>
                  <span className="font-bold text-emerald-400">1.2 Hours</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Default Rate (NPL):</span>
                  <span className="font-bold text-emerald-400">0.34% (AI Risk Filtered)</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Live Origination Queue & Portfolio Risk */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Real-Time Origination Feed for Bidding</span>
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Drip Irrigation Infrastructure', borrower: 'Highveld Horticulture', amount: '$25,000 USD', risk: 'Score 765 (A+)', status: 'Auto-Bid Match' },
                { title: 'Solar Array 150kW Msasa', borrower: 'SunPower Zim', amount: '$85,000 USD', risk: 'Score 790 (A+)', status: 'Auto-Bid Match' },
                { title: 'Electric Haulage Logistics Fleet', borrower: 'Gaborone Green Transit', amount: '$160,000 USD', risk: 'Score 740 (A)', status: 'Manual Underwrite Needed' }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-slate-400">{item.borrower} • {item.risk}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-400 font-mono text-sm">{item.amount}</p>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-base">Regulatory Compliance & Escrow</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Compliant with Reserve Bank of Zimbabwe (RBZ) Fintech Sandbox guidelines & SADC cross-border payment rules.
              </p>
            </div>
            <ShieldAlert className="w-10 h-10 text-emerald-400 shrink-0 ml-4" />
          </div>

        </div>

      </div>

    </section>
  );
};
