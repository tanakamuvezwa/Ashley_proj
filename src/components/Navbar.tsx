import React, { useState } from 'react';
import { 
  Home, 
  Zap, 
  Briefcase, 
  ArrowRightLeft, 
  Lock, 
  Building2, 
  Globe2, 
  UserCheck, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { NavigationTab, UserAccount } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenMobilePreview: () => void;
  onOpenCalculator: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  currentUser: UserAccount | null;
  onOpenLogin: (tab?: 'login' | 'register') => void;
  onLogout: () => void;
  theme: string;
  onChangeTheme: (theme: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout,
  theme,
  onChangeTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Rebrand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-950/20">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-wide leading-none">
              ApexLend
            </h1>
            <span className="text-[9px] text-slate-500 font-bold tracking-widest block mt-0.5 uppercase">
              SADC Credit Corridor
            </span>
          </div>
        </div>

        {/* Clean Navigation Bar Stack */}
        <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/40 p-1 rounded-xl border border-white/5">
          
          {/* Guest/Unauthenticated Navigation */}
          {!currentUser ? (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'home'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Features</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'projects'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Markets</span>
              </button>
            </>
          ) : (
            /* Authenticated Navigation */
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'home'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              {currentUser.role === 'borrower' && (
                <button
                  onClick={() => setActiveTab('uber-loans')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'uber-loans'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Solutions</span>
                </button>
              )}

              {currentUser.role === 'lender' && (
                <button
                  onClick={() => setActiveTab('institutional')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'institutional'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Lender Desk</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'projects'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-350 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Markets</span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-amber-600 text-slate-950 shadow-md font-bold'
                      : 'text-amber-400 hover:bg-slate-800/40'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin workbench</span>
                </button>
              )}
            </>
          )}

        </nav>

        {/* Right Actions Block */}
        <div className="flex items-center space-x-3">
          
          {/* Ambience Switcher Dropdown */}
          <div className="relative group shrink-0">
            <button className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-350 hover:text-white transition cursor-pointer flex items-center space-x-1">
              {theme === 'dark-midnight' && <Moon className="w-4 h-4 text-emerald-400" />}
              {theme === 'light-aura' && <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" style={{ animationDuration: '8s' }} />}
              {theme === 'nordic-forest' && <Compass className="w-4 h-4 text-teal-400" />}
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl p-1.5 hidden group-hover:block transition duration-200 z-50 text-[10.5px] font-sans">
              <button 
                onClick={() => onChangeTheme('dark-midnight')}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition ${
                  theme === 'dark-midnight' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Midnight Dark</span>
              </button>
              <button 
                onClick={() => onChangeTheme('light-aura')}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition ${
                  theme === 'light-aura' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Aura Light</span>
              </button>
              <button 
                onClick={() => onChangeTheme('nordic-forest')}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition ${
                  theme === 'nordic-forest' ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Nordic Forest</span>
              </button>
            </div>
          </div>

          {!currentUser ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenLogin('login')}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/15 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenLogin('register')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-emerald-950/20"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 rounded-xl text-xs text-white transition shrink-0 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-200 max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              
              {/* Dropdown Card */}
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl p-2 hidden group-hover:block transition duration-200 z-50">
                <div className="px-3.5 py-2.5 border-b border-white/5 mb-1.5">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider leading-none">Active Profile</p>
                  <p className="text-xs text-white font-bold mt-1 max-w-[150px] truncate">{currentUser.email}</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 mt-1.5 inline-block uppercase font-bold">
                    {currentUser.role}
                  </span>
                </div>
                
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs text-rose-450 hover:bg-rose-950/20 hover:text-rose-300 transition text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-450 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950 px-4 py-4 space-y-3 font-sans text-xs">
          
          {!currentUser ? (
            <>
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white block text-left"
              >
                Features
              </button>
              <button
                onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white block text-left"
              >
                Markets
              </button>
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => { onOpenLogin('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 text-center rounded-lg bg-slate-900 border border-white/5 text-white font-bold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenLogin('register'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 text-center rounded-lg bg-emerald-600 text-slate-950 font-black"
                >
                  Register
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white block text-left"
              >
                Dashboard
              </button>
              {currentUser.role === 'borrower' && (
                <button
                  onClick={() => { setActiveTab('uber-loans'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white block text-left"
                >
                  Solutions
                </button>
              )}
              {currentUser.role === 'lender' && (
                <button
                  onClick={() => { setActiveTab('institutional'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white block text-left"
                >
                  Lender Desk
                </button>
              )}
              <button
                onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover:bg-slate-900 hover:text-white block text-left"
              >
                Markets
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 rounded-lg text-amber-400 hover:bg-slate-900 block text-left font-bold"
                >
                  Admin Workbench
                </button>
              )}
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 rounded-lg text-rose-450 hover:bg-rose-950/20 hover:text-rose-300 block text-left"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </header>
  );
};
