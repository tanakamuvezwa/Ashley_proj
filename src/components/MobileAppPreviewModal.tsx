import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Briefcase, 
  ArrowRightLeft, 
  User, 
  Smartphone, 
  Wifi, 
  Battery, 
  CheckCircle,
  Bell,
  Sparkles,
  Search
} from 'lucide-react';

interface MobileAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppPreviewModal: React.FC<MobileAppPreviewModalProps> = ({
  isOpen,
  onClose
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'loans' | 'pitches' | 'wallet'>('home');
  const [mobileLoanAmt, setMobileLoanAmt] = useState<number>(5000);
  const [isMobileMatching, setIsMobileMatching] = useState<boolean>(false);
  const [mobileMatched, setMobileMatched] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleMobileLoanRequest = () => {
    setIsMobileMatching(true);
    setTimeout(() => {
      setIsMobileMatching(false);
      setMobileMatched(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      
      {/* Modal Container */}
      <div className="relative max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-8 p-4">
        
        {/* Left Side: Context & Description */}
        <div className="text-left space-y-4 max-w-md">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Native iOS / Android Preview</span>
          </div>

          <h3 className="text-3xl font-extrabold text-white">
            MBONGOCIRCLE Mobile App
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Experience the "Uber for Loans" mobile interface. Designed for seamless performance on smartphones across Zimbabwe & SADC with offline PWA support, push notifications, and instant EcoCash / Bank wallet disburser.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Instant push alerts when banks bid on your loan</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Biometric fingerprint login & wallet security</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Built for low data consumption in African markets</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            Return to Web App Dashboard
          </button>
        </div>

        {/* Right Side: Realistic Mobile Phone Mockup Frame */}
        <div className="relative w-[340px] h-[680px] bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col shrink-0">
          
          {/* Phone Speaker Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-800 rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-900 rounded-full" />
          </div>

          {/* Status Bar */}
          <div className="pt-6 px-6 pb-2 flex justify-between items-center text-[10px] text-slate-300 z-30 font-medium">
            <span>09:41</span>
            <div className="flex items-center space-x-1.5">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* App Header Bar */}
          <div className="px-4 py-2 bg-[#0B0F17] border-b border-slate-800/80 flex items-center justify-between z-20">
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-xs font-black text-white">MBONGOCIRCLE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">ZW</span>
            </div>
          </div>

          {/* Mobile Screen Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F17] text-slate-100 text-left">
            
            {mobileTab === 'home' && (
              <>
                {/* Live Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Instant Capital Match</span>
                  <h4 className="text-sm font-extrabold mt-0.5">Need a Quick Project Loan?</h4>
                  <p className="text-[11px] opacity-90 mt-1">Get 3 bank quotes in under 2 minutes.</p>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono">$</span>
                    <input
                      type="number"
                      value={mobileLoanAmt}
                      onChange={(e) => setMobileLoanAmt(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-black/30 text-white font-mono text-xs border border-white/20 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleMobileLoanRequest}
                    disabled={isMobileMatching}
                    className="w-full mt-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-md hover:bg-amber-300 transition"
                  >
                    {isMobileMatching ? 'Matching...' : 'Request Loan Bids'}
                  </button>
                </div>

                {/* Match Result inside mobile */}
                {mobileMatched && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-300 space-y-1 animate-fade-in">
                    <p className="font-bold text-white">🎉 2 Banks Bidding!</p>
                    <p className="text-[10px]">Stanbic Zim: 7.8% APR • CBZ: 7.2% APR</p>
                  </div>
                )}

                {/* Quick Services Icons */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Uber Loans</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>Idea Pitch</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1">
                    <ArrowRightLeft className="w-4 h-4 text-teal-400" />
                    <span>FX Convert</span>
                  </div>
                </div>

                {/* Live Feed snippet */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live Bids</h5>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                    <div className="flex justify-between font-bold text-white">
                      <span>Solar Array 150kW</span>
                      <span className="text-amber-400">$85,000</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Harare • 2 Bids Active</p>
                  </div>
                </div>
              </>
            )}

            {mobileTab === 'loans' && (
              <div className="text-xs space-y-3">
                <h4 className="font-bold text-white text-sm">Active Loan Requests</h4>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="font-bold text-emerald-400">$25,000 USD - Drip Irrigation</p>
                  <p className="text-[10px] text-slate-400">Mutare, Zimbabwe • Rate 7.9%</p>
                </div>
              </div>
            )}

            {mobileTab === 'pitches' && (
              <div className="text-xs space-y-3">
                <h4 className="font-bold text-white text-sm">Pitch Room</h4>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="font-bold text-amber-400">Organic Blueberry Export</p>
                  <p className="text-[10px] text-slate-300">Target $150k • ROI +22%</p>
                </div>
              </div>
            )}

            {mobileTab === 'wallet' && (
              <div className="text-xs space-y-3">
                <h4 className="font-bold text-white text-sm">MBONGOCIRCLE Wallet</h4>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Available Balance</span>
                  <p className="text-xl font-bold text-emerald-400 font-mono">$12,450.00 USD</p>
                  <p className="text-[10px] text-slate-400 mt-1">Linked: EcoCash USD Wallet</p>
                </div>
              </div>
            )}

          </div>

          {/* Smartphone Bottom Navigation Bar */}
          <div className="p-2 bg-[#0B0F17] border-t border-slate-800/80 flex items-center justify-around text-[10px]">
            <button 
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center ${mobileTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              <Zap className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => setMobileTab('loans')}
              className={`flex flex-col items-center ${mobileTab === 'loans' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Loans</span>
            </button>
            <button 
              onClick={() => setMobileTab('pitches')}
              className={`flex flex-col items-center ${mobileTab === 'pitches' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Pitch</span>
            </button>
            <button 
              onClick={() => setMobileTab('wallet')}
              className={`flex flex-col items-center ${mobileTab === 'wallet' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              <User className="w-4 h-4" />
              <span>Wallet</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
