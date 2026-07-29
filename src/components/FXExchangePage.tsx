import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft, TrendingUp, TrendingDown, RefreshCw,
  Globe2, Zap, Clock, DollarSign, ChevronDown, Info,
  BarChart3, Activity
} from 'lucide-react';

interface FXRate {
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  change24h: number;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  ZWG: 'Zimbabwe Gold',
  ZAR: 'South African Rand',
  BWP: 'Botswana Pula',
  ZMW: 'Zambian Kwacha',
  MZN: 'Mozambican Metical',
};

const CURRENCY_FLAGS: Record<string, string> = {
  USD: '🇺🇸', ZWG: '🇿🇼', ZAR: '🇿🇦', BWP: '🇧🇼', ZMW: '🇿🇲', MZN: '🇲🇿'
};

const CURRENCY_COLORS: Record<string, string> = {
  ZAR: 'from-green-600 to-yellow-600',
  ZWG: 'from-yellow-600 to-red-600',
  BWP: 'from-blue-600 to-slate-600',
  ZMW: 'from-orange-600 to-red-700',
  MZN: 'from-red-600 to-yellow-700',
};

export const FXExchangePage: React.FC = () => {
  const [rates, setRates] = useState<FXRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Converter state
  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ZAR');

  const fetchRates = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/fx-rates');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRates(data);
          setLastRefresh(new Date());
        }
      }
    } catch (err) {
      console.error('Failed to load FX rates:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRates(); }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRate = (from: string, to: string): number => {
    if (from === to) return 1;
    if (from === 'USD') {
      return rates.find(r => r.quoteCurrency === to)?.rate || 1;
    }
    if (to === 'USD') {
      const r = rates.find(r => r.quoteCurrency === from)?.rate;
      return r ? 1 / r : 1;
    }
    const fromUSD = rates.find(r => r.quoteCurrency === from)?.rate || 1;
    const toUSD = rates.find(r => r.quoteCurrency === to)?.rate || 1;
    return toUSD / fromUSD;
  };

  const converted = (fromAmount * getRate(fromCurrency, toCurrency)).toFixed(2);
  const allCurrencies = ['USD', ...rates.map(r => r.quoteCurrency)];

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-white/5">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Cross-Border FX Exchange</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px]">LIVE RATES</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white">SADC Currency Corridor</h2>
            <p className="text-slate-400 text-sm mt-1">Real-time interbank exchange rates across Southern Africa. Zero broker margin.</p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Updated {lastRefresh.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={fetchRates}
              disabled={refreshing}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer transition disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Rate Ticker Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl animate-pulse h-28 bg-slate-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {rates.map(rate => {
            const change = parseFloat(String(rate.change24h));
            const isUp = change >= 0;
            return (
              <div key={rate.pair} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg">{CURRENCY_FLAGS[rate.quoteCurrency]}</span>
                    <span className="text-[10px] font-black text-slate-400 font-mono">{rate.pair}</span>
                  </div>
                  {isUp
                    ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  }
                </div>
                <p className="text-xl font-black text-white tabular-nums">
                  {rate.rate.toFixed(4)}
                </p>
                <p className={`text-[10px] font-bold mt-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? '+' : ''}{change.toFixed(4)} (24h)
                </p>
                <div className="mt-3 pt-2 border-t border-white/5 grid grid-cols-2 gap-1 text-[8px] font-mono text-slate-500">
                  <div>Buy<br /><span className="text-slate-300 font-bold">{rate.buyRate.toFixed(3)}</span></div>
                  <div>Sell<br /><span className="text-slate-300 font-bold">{rate.sellRate.toFixed(3)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Currency Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Currency Converter</h3>
              <p className="text-[10px] text-slate-500">Live mid-market rate — no hidden fees</p>
            </div>
          </div>

          {/* From */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">You Send</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min={1}
                value={fromAmount}
                onChange={e => setFromAmount(Math.max(0, Number(e.target.value)))}
                className="flex-1 glass-input px-4 py-3 rounded-xl text-base font-bold text-white outline-none tabular-nums"
              />
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="glass-input px-3 py-3 rounded-xl text-xs font-bold text-white outline-none cursor-pointer w-28"
              >
                {allCurrencies.map(c => (
                  <option key={c} value={c}>{CURRENCY_FLAGS[c]} {c}</option>
                ))}
              </select>
            </div>
            <p className="text-[9px] text-slate-500 font-mono pl-1">{CURRENCY_NAMES[fromCurrency]}</p>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-slate-950 hover:border-emerald-600 transition cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">You Receive</label>
            <div className="flex space-x-2">
              <div className="flex-1 glass-input px-4 py-3 rounded-xl text-base font-black text-emerald-400 tabular-nums bg-emerald-500/5 border-emerald-500/20 flex items-center">
                {loading ? '—' : Number(converted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="glass-input px-3 py-3 rounded-xl text-xs font-bold text-white outline-none cursor-pointer w-28"
              >
                {allCurrencies.map(c => (
                  <option key={c} value={c}>{CURRENCY_FLAGS[c]} {c}</option>
                ))}
              </select>
            </div>
            <p className="text-[9px] text-slate-500 font-mono pl-1">{CURRENCY_NAMES[toCurrency]}</p>
          </div>

          {/* Rate summary */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-500">Mid-market rate</span>
            <span className="text-white font-bold">1 {fromCurrency} = {getRate(fromCurrency, toCurrency).toFixed(6)} {toCurrency}</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-white/5">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Why ApexLend FX?</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: DollarSign, label: 'Zero Broker Margin', desc: 'We pass the true interbank rate directly to you' },
                { icon: Activity, label: 'Live Data', desc: 'Rates refresh every 60 seconds from global liquidity desks' },
                { icon: Globe2, label: 'Full SADC Coverage', desc: 'ZAR, ZWG, BWP, ZMW, MZN — all corridors supported' },
                { icon: BarChart3, label: 'Loan-Embedded FX', desc: 'Automatic FX conversion when disbursing cross-border loans' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-amber-500/10 bg-amber-500/5">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-300/80 leading-relaxed">
                Rates shown are mid-market rates sourced live from open.er-api.com. Actual transaction rates may include a small settlement spread applied at disbursement. ZWG rate is pegged data pending central bank release.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full rate table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">Live Rate Table — vs USD Base</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Currency</th>
                <th className="text-right px-4 py-3">Rate (1 USD =)</th>
                <th className="text-right px-4 py-3">Buy</th>
                <th className="text-right px-4 py-3">Sell</th>
                <th className="text-right px-4 py-3">24h Change</th>
                <th className="text-right px-6 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rates.map(rate => {
                const change = parseFloat(String(rate.change24h));
                const isUp = change >= 0;
                return (
                  <tr key={rate.pair} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-base">{CURRENCY_FLAGS[rate.quoteCurrency]}</span>
                        <div>
                          <p className="font-bold text-white">{rate.quoteCurrency}</p>
                          <p className="text-[9px] text-slate-500">{CURRENCY_NAMES[rate.quoteCurrency]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right px-4 py-3.5 font-black text-white tabular-nums">{rate.rate.toFixed(4)}</td>
                    <td className="text-right px-4 py-3.5 text-emerald-400 tabular-nums font-mono">{rate.buyRate.toFixed(4)}</td>
                    <td className="text-right px-4 py-3.5 text-rose-400 tabular-nums font-mono">{rate.sellRate.toFixed(4)}</td>
                    <td className="text-right px-4 py-3.5">
                      <span className={`flex items-center justify-end space-x-1 font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isUp ? '+' : ''}{change.toFixed(4)}</span>
                      </span>
                    </td>
                    <td className="text-right px-6 py-3.5 text-slate-500 text-[9px] font-mono">
                      {new Date(rate.lastUpdated).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
};
