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
 LayoutDashboard,
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
 <header className="sticky top-0 z-40 w-full border-b theme-border theme-nav backdrop-blur-md">
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
 <h1 className="font-extrabold text-sm theme-text tracking-wide leading-none">
 ApexLend
 </h1>
 <span className="text-[9px] theme-muted font-bold tracking-widest block mt-0.5 uppercase">
 SADC Credit Corridor
 </span>
 </div>
 </div>

 {/* Clean Navigation Bar Stack */}
 <nav className={`hidden md:flex items-center space-x-1.5 p-1 rounded-xl border theme-border `}>
 
 {/* Guest/Unauthenticated Navigation */}
 {!currentUser ? (
 <>
 <button
 onClick={() => setActiveTab('home')}
 className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
 activeTab === 'home'
 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:'
 }`}
 >
 <Home className="w-3.5 h-3.5" />
 <span>Features</span>
 </button>
 <button
 onClick={() => setActiveTab('projects')}
 className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
 activeTab === 'projects'
 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:'
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
 onClick={() => setActiveTab('dashboard')}
 className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
 activeTab === 'dashboard'
 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:'
 }`}
 >
 <LayoutDashboard className="w-3.5 h-3.5" />
 <span>My Workspace</span>
 </button>

 {currentUser.role === 'borrower' && (
 <button
 onClick={() => setActiveTab('uber-loans')}
 className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
 activeTab === 'uber-loans'
 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:'
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
 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:'
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
 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:'
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
 : 'text-amber-400 hover:'
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
 
 {/* Theme toggle */}
 <div className="relative group shrink-0">
 <button className={`p-2.5 rounded-xl border theme-border transition cursor-pointer flex items-center space-x-1.5 theme-surface theme-text`} title="Switch theme">
 <Sun className="w-4 h-4 text-emerald-400" />
 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
 </button>
 <div className={`absolute right-0 mt-2 w-48 rounded-2xl border theme-border shadow-2xl p-2 hidden group-hover:block transition duration-200 z-50 theme-surface`}>
 {[
 { id: 'theme-midnight', label: 'Midnight Dark', icon: Moon },
 { id: 'theme-slate', label: 'Slate Blue', icon: Moon },
 { id: 'theme-charcoal', label: 'Warm Charcoal', icon: Moon },
 { id: 'theme-light', label: 'Clean Light', icon: Sun },
 { id: 'theme-forest', label: 'Deep Forest', icon: Compass }
 ].map(t => (
 <button
 key={t.id}
 onClick={() => onChangeTheme(t.id)}
 className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-left transition cursor-pointer ${theme === t.id ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:'}`}
 >
 <t.icon className={`w-3.5 h-3.5 ${theme === t.id ? 'text-emerald-400' : 'text-slate-400'}`} />
 <span className="text-xs">{t.label}</span>
 </button>
 ))}
 </div>
 </div>

 {!currentUser ? (
 <div className="flex items-center space-x-2">
 <button
 onClick={() => onOpenLogin('login')}
 className="px-4 py-2 rounded-xl border theme-border hover:border-[var(--accent)] theme-text text-xs font-bold transition cursor-pointer theme-surface"
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
 <button className={`flex items-center space-x-2 px-3 py-2 border theme-border hover:border-[var(--accent)] rounded-xl text-xs theme-text transition shrink-0 cursor-pointer theme-surface`}>
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
 <span className="font-semibold max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name}</span>
 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
 </button>
 
 {/* Dropdown Card */}
 <div className={`absolute right-0 mt-2 w-48 rounded-2xl border theme-border shadow-2xl p-2 hidden group-hover:block transition duration-200 z-50 theme-surface`}>
 <div className="px-3.5 py-2.5 border-b theme-border mb-1.5">
 <p className="text-[10px] theme-muted uppercase font-black tracking-wider leading-none">Active Profile</p>
 <p className="text-xs theme-text font-bold mt-1 max-w-[150px] truncate">{currentUser.email}</p>
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
 className="md:hidden p-2 rounded-xl border text-slate-450 hover:text-white"
 >
 {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
 </button>
 </div>

 </div>

 {/* Mobile Drawer Menu */}
 {mobileMenuOpen && (
 <div className={`md:hidden border-t theme-border theme-nav px-4 py-4 space-y-3 font-sans text-xs`}>
 
 {!currentUser ? (
 <>
 <button
 onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
 className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover: hover:text-white block text-left"
 >
 Features
 </button>
 <button
 onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
 className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover: hover:text-white block text-left"
 >
 Markets
 </button>
 <div className="flex gap-2 pt-2 border-t ">
 <button
 onClick={() => { onOpenLogin('login'); setMobileMenuOpen(false); }}
 className="flex-1 py-2.5 text-center rounded-lg border text-white font-bold"
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
 className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover: hover:text-white block text-left"
 >
 Dashboard
 </button>
 {currentUser.role === 'borrower' && (
 <button
 onClick={() => { setActiveTab('uber-loans'); setMobileMenuOpen(false); }}
 className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover: hover:text-white block text-left"
 >
 Solutions
 </button>
 )}
 {currentUser.role === 'lender' && (
 <button
 onClick={() => { setActiveTab('institutional'); setMobileMenuOpen(false); }}
 className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover: hover:text-white block text-left"
 >
 Lender Desk
 </button>
 )}
 <button
 onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
 className="w-full py-2.5 px-3 rounded-lg text-slate-350 hover: hover:text-white block text-left"
 >
 Markets
 </button>
 {currentUser.role === 'admin' && (
 <button
 onClick={() => { setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
 className="w-full py-2.5 px-3 rounded-lg text-amber-400 hover: block text-left font-bold"
 >
 Admin Workbench
 </button>
 )}
 <div className="pt-2 border-t ">
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
