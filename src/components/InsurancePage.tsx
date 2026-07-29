import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, CheckCircle2, AlertCircle, Loader2,
  Leaf, Sun, Package, Briefcase, Star, ArrowRight,
  BadgeCheck, Clock, DollarSign, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { InsuranceQuote } from '../types';

const COVERAGE_ICONS: Record<string, React.ElementType> = {
  'Crop & Livestock':        Leaf,
  'Solar Asset Damage':      Sun,
  'Cross-Border Cargo':      Package,
  'Business Interruption':   Briefcase,
};

const COVERAGE_COLORS: Record<string, string> = {
  'Crop & Livestock':      'from-emerald-600/20 to-teal-600/10 border-emerald-500/20',
  'Solar Asset Damage':    'from-amber-600/20 to-yellow-600/10 border-amber-500/20',
  'Cross-Border Cargo':    'from-blue-600/20 to-indigo-600/10 border-blue-500/20',
  'Business Interruption': 'from-purple-600/20 to-violet-600/10 border-purple-500/20',
};

const COVERAGE_ACCENT: Record<string, string> = {
  'Crop & Livestock':      'text-emerald-400',
  'Solar Asset Damage':    'text-amber-400',
  'Cross-Border Cargo':    'text-blue-400',
  'Business Interruption': 'text-purple-400',
};

interface QuoteModalProps {
  quote: InsuranceQuote;
  onClose: () => void;
  onConfirm: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ quote, onClose, onConfirm }) => {
  const CovIcon = COVERAGE_ICONS[quote.coverageType] || ShieldCheck;
  const accent = COVERAGE_ACCENT[quote.coverageType] || 'text-emerald-400';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-white/10 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent} bg-current/10 bg-opacity-10`} style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CovIcon className={`w-5 h-5 ${accent}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{quote.title}</h3>
            <p className="text-[10px] text-slate-500">{quote.provider}</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Monthly Premium', value: `$${quote.monthlyPremiumUSD}/mo` },
              { label: 'Max Coverage', value: `$${(quote.maxCoverageUSD / 1000).toFixed(0)}K` },
              { label: 'Deductible', value: `$${quote.deductibleUSD}` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-center">
                <p className="text-base font-black text-white">{value}</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Coverage Features</p>
            <div className="space-y-1.5">
              {quote.features.map(f => (
                <div key={f} className="flex items-center space-x-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${accent}`} />
                  <span className="text-xs text-slate-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer hover:from-emerald-400 hover:to-teal-400 transition flex items-center justify-center space-x-2"
        >
          <BadgeCheck className="w-4 h-4" />
          <span>Activate Policy — ${quote.monthlyPremiumUSD}/mo</span>
        </button>
        <p className="text-center text-[9px] text-slate-600 mt-2">Cancel anytime. No long-term lock-in.</p>
      </div>
    </div>
  );
};

export const InsurancePage: React.FC = () => {
  const [products, setProducts] = useState<InsuranceQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<InsuranceQuote | null>(null);
  const [activatedPolicies, setActivatedPolicies] = useState<Set<string>>(new Set());
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/insurance')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleActivate = (quote: InsuranceQuote) => {
    setActivatedPolicies(prev => new Set([...prev, quote.id]));
    setSelectedQuote(null);
    setSuccessMsg(`${quote.title} policy activated! Welcome to the ApexLend insurance umbrella.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const faqs = [
    {
      q: 'How quickly does a claim get processed?',
      a: 'Claims are assessed within 48 hours through our AI-assisted claims engine. Payouts typically clear within 5–7 business days depending on documentation.'
    },
    {
      q: 'Can I bundle multiple policies?',
      a: 'Yes — bundle 2+ policies and receive a 10% multi-policy discount automatically applied to your monthly premium.'
    },
    {
      q: 'Are policies SADC-wide or country-specific?',
      a: 'Policies are region-aware. Cross-Border Cargo cover is SADC-wide. Crop, Solar, and Business Interruption coverage depends on the country of asset registration.'
    },
    {
      q: 'What happens if I miss a monthly payment?',
      a: 'A 7-day grace period applies. If payment isn\'t received within the grace period, the policy is paused but not cancelled — you can reinstate within 30 days without re-underwriting.'
    },
  ];

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-white/5">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Embedded Asset Insurance</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px]">SADC CERTIFIED</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Protect Your Assets</h2>
        <p className="text-slate-400 text-sm mt-1">Parametric insurance products designed for SADC entrepreneurs, farmers, and cross-border traders.</p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-6 flex items-start space-x-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Policies Issued', value: '2,840+', icon: BadgeCheck, color: 'text-emerald-400' },
          { label: 'Claims Paid', value: '$4.1M', icon: DollarSign, color: 'text-teal-400' },
          { label: 'Avg Claim Time', value: '48 hrs', icon: Clock, color: 'text-amber-400' },
          { label: 'Countries Covered', value: '5 SADC', icon: ShieldCheck, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 rounded-2xl border border-white/5 text-center">
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className="text-xl font-black text-white">{value}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Insurance product cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading insurance products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-slate-700" />
          <p>No insurance products available. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {products.map(product => {
            const CovIcon = COVERAGE_ICONS[product.coverageType] || ShieldCheck;
            const gradClass = COVERAGE_COLORS[product.coverageType] || '';
            const accent = COVERAGE_ACCENT[product.coverageType] || 'text-emerald-400';
            const activated = activatedPolicies.has(product.id);

            return (
              <div key={product.id} className={`glass-card p-6 rounded-2xl border bg-gradient-to-br ${gradClass} transition-all hover:-translate-y-1 hover:shadow-xl group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <CovIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{product.title}</h3>
                      <p className="text-[10px] text-slate-400">{product.provider}</p>
                    </div>
                  </div>
                  {activated && (
                    <span className="flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/25">
                      <CheckCircle2 className="w-3 h-3" /><span>Active</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Monthly', value: `$${product.monthlyPremiumUSD}` },
                    { label: 'Max Cover', value: `$${(product.maxCoverageUSD / 1000).toFixed(0)}K` },
                    { label: 'Deductible', value: `$${product.deductibleUSD}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl p-2.5 bg-slate-950/30 text-center">
                      <p className="text-sm font-black text-white">{value}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 mb-5">
                  {product.features.slice(0, 3).map(f => (
                    <div key={f} className="flex items-center space-x-2 text-[11px]">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${accent}`} />
                      <span className="text-slate-300">{f}</span>
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <p className={`text-[10px] font-bold pl-5 ${accent}`}>+{product.features.length - 3} more features</p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedQuote(product)}
                  disabled={activated}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                    activated
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-emerald-600 hover:border-emerald-600 hover:text-slate-950'
                  }`}
                >
                  {activated ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /><span>Policy Active</span></>
                  ) : (
                    <><Star className="w-3.5 h-3.5" /><span>Get Quote & Activate</span></>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ Section */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition cursor-pointer"
              >
                <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                {expandedFaq === i
                  ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                }
              </button>
              {expandedFaq === i && (
                <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quote modal */}
      {selectedQuote && (
        <QuoteModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onConfirm={() => handleActivate(selectedQuote)}
        />
      )}

    </section>
  );
};
