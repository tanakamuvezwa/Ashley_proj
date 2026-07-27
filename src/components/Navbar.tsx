import React from 'react';
import { NavigationTab } from '../types';
import { 
  Zap, 
  Briefcase, 
  Building2, 
  ArrowRightLeft, 
  Globe2, 
  Smartphone,
  ShieldCheck,
  ChevronDown,
  Calculator,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenMobilePreview: () => void;
  onOpenCalculator: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  userRole: 'borrower' | 'investor' | 'merchant';
  setUserRole: (role: 'borrower' | 'investor' | 'merchant') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobilePreview,
  onOpenCalculator,
  selectedRegion,
  setSelectedRegion,
  userRole,
  setUserRole
}) => {
  const regions = [
    { code: 'ZW', name: 'Zimbabwe (HQ)', flag: '🇿🇼' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
    { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
    { code: 'SADC', name: 'SADC Unified Region', flag: '🌍' }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0F17]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('uber-loans')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-1 ring-white/20">
                <Zap className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  MBONGO<span className="gold-gradient-text">CIRCLE</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-wider">
                  AI FinTech
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Holdings Limited • SADC Marketplace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('uber-loans')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'uber-loans'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Uber for Loans</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Idea & Project Pitch</span>
            </button>

            <button
              onClick={() => setActiveTab('institutional')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'institutional'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bank & Investor Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>FX & Insurance Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('sadc-map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'sadc-map'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>SADC Network</span>
            </button>
          </nav>

          {/* Right Action Controls: Calculator, Region Selector & Mobile App Preview */}
          <div className="flex items-center space-x-2.5">
            
            {/* Financial Calculator Trigger Button */}
            <button
              onClick={onOpenCalculator}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition cursor-pointer"
              title="Open Financial Amortization Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>

            {/* Region Selector dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 transition">
                <span>{regions.find(r => r.code === selectedRegion)?.flag}</span>
                <span className="hidden sm:inline">{regions.find(r => r.code === selectedRegion)?.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#131B2E] border border-slate-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Market Region</p>
                {regions.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => setSelectedRegion(r.code)}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-left text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition"
                  >
                    <span>{r.flag}</span>
                    <span>{r.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Mobile App View Trigger */}
            <button
              onClick={onOpenMobilePreview}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition shadow-lg shadow-amber-900/10"
            >
              <Smartphone className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Try Mobile App</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar for small screens */}
        <div className="lg:hidden flex items-center justify-around py-2.5 border-t border-slate-800/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('uber-loans')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'uber-loans' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Loans</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Pitches</span>
          </button>
          <button
            onClick={() => setActiveTab('institutional')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'institutional' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Banks</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'services' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>FX/Services</span>
          </button>
          <button
            onClick={() => setActiveTab('sadc-map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'sadc-map' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>SADC</span>
          </button>
        </div>
      </div>
    </header>
  );
};
