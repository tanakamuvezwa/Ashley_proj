import React, { useState, useEffect } from 'react';
import { NavigationTab, UserAccount } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LandingPage } from './components/LandingPage';
import { UberForLoansSimulator } from './components/UberForLoansSimulator';
import { ProjectMarketplace } from './components/ProjectMarketplace';
import { InstitutionalPortal } from './components/InstitutionalPortal';
import { FinancialServicesSuite } from './components/FinancialServicesSuite';
import { SADCExpansionMap } from './components/SADCExpansionMap';
import { MobileAppPreviewModal } from './components/MobileAppPreviewModal';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { FinancialCalculatorModal } from './components/FinancialCalculatorModal';
import { LiveLedgerFeed } from './components/LiveLedgerFeed';
import { LoginModal } from './components/LoginModal';
import { AdminPortal } from './components/AdminPortal';
import { UserDashboard } from './components/UserDashboard';
import { FXExchangePage } from './components/FXExchangePage';
import { InsurancePage } from './components/InsurancePage';
import { Footer } from './components/Footer';

// Hash ↔ Tab mapping
const HASH_TO_TAB: Record<string, NavigationTab> = {
 'uber-loans': 'uber-loans',
 'projects': 'projects',
 'institutional': 'institutional',
 'fx': 'fx',
 'insurance': 'insurance',
 'services': 'services',
 'sadc-map': 'sadc-map',
 'admin-dashboard': 'admin-dashboard',
 'dashboard': 'dashboard',
};

const TAB_TO_HASH: Record<NavigationTab, string> = {
 'home': '',
 'uber-loans': 'uber-loans',
 'projects': 'projects',
 'institutional': 'institutional',
 'fx': 'fx',
 'insurance': 'insurance',
 'services': 'services',
 'sadc-map': 'sadc-map',
 'admin-dashboard': 'admin-dashboard',
 'dashboard': 'dashboard',
};

export const App: React.FC = () => {
 const [activeTab, setActiveTab] = useState<NavigationTab>('home');
 const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

 const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
 const [loginTabMode, setLoginTabMode] = useState<'login' | 'register'>('login');

 const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
 const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
 const [selectedRegion, setSelectedRegion] = useState<string>('ZW');
  const [theme, setTheme] = useState<string>(() => {
    const saved = localStorage.getItem('apex_theme');
    return saved || 'theme-midnight';
  });

  // ── Theme sync ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Remove all existing theme-related classes dynamically
    const classes = Array.from(document.documentElement.classList);
    classes.forEach(cls => {
      if (cls.startsWith('theme-') || cls.endsWith('-aura') || cls.endsWith('-forest') || cls.endsWith('-midnight')) {
        document.documentElement.classList.remove(cls);
      }
    });
    
    // Apply the active theme
    document.documentElement.classList.add(theme);
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

 // ── Session restore + server verification ──────────────────────────────────
 useEffect(() => {
 const savedUser = localStorage.getItem('apex_user');
 if (savedUser) {
 try {
 const user = JSON.parse(savedUser);
 setCurrentUser(user);
 if (user.token) {
 fetch('/api/auth/me', {
 headers: { Authorization: `Bearer ${user.token}` },
 credentials: 'include'
 }).then(res => {
 if (!res.ok) {
 localStorage.removeItem('apex_user');
 setCurrentUser(null);
 }
 }).catch(() => {});
 }
 } catch {
 localStorage.removeItem('apex_user');
 }
 }
 }, []);

 // ── Hash routing — read hash on mount ─────────────────────────────────────
 useEffect(() => {
 const hash = window.location.hash.replace('#', '');
 if (hash && HASH_TO_TAB[hash]) {
 const target = HASH_TO_TAB[hash];
 const protectedTabs: NavigationTab[] = ['uber-loans', 'institutional', 'admin-dashboard', 'dashboard'];
 if (protectedTabs.includes(target) && !localStorage.getItem('apex_user')) {
 setLoginTabMode('login');
 setIsLoginOpen(true);
 } else {
 setActiveTab(target);
 }
 }
 }, []);

 // ── Hash routing — update URL when tab changes ─────────────────────────────
 useEffect(() => {
 const hash = TAB_TO_HASH[activeTab];
 if (hash) {
 window.history.replaceState(null, '', `#${hash}`);
 } else {
 window.history.replaceState(null, '', window.location.pathname);
 }
 }, [activeTab]);

 // ── Listen for browser back/forward ───────────────────────────────────────
 useEffect(() => {
 const handleHashChange = () => {
 const hash = window.location.hash.replace('#', '');
 const tab = HASH_TO_TAB[hash];
 if (tab) setActiveTab(tab);
 else setActiveTab('home');
 };
 window.addEventListener('hashchange', handleHashChange);
 return () => window.removeEventListener('hashchange', handleHashChange);
 }, []);

 const handleLoginSuccess = (user: UserAccount) => {
 setCurrentUser(user);
 localStorage.setItem('apex_user', JSON.stringify(user));
 };

 const handleLogout = async () => {
 try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
 setCurrentUser(null);
 localStorage.removeItem('apex_user');
 setActiveTab('home');
 };

 const handleSetActiveTab = (tab: NavigationTab) => {
 const protectedTabs: NavigationTab[] = ['uber-loans', 'institutional', 'admin-dashboard', 'dashboard'];
 if (protectedTabs.includes(tab) && !currentUser) {
 setLoginTabMode('login');
 setIsLoginOpen(true);
 return;
 }
 if (tab === 'admin-dashboard' && currentUser?.role !== 'admin') return;
 setActiveTab(tab);
 };

 const handleOpenLoginModal = (tab: 'login' | 'register' = 'login') => {
 setLoginTabMode(tab);
 setIsLoginOpen(true);
 };

 const hiddenHeroTabs: NavigationTab[] = ['home', 'dashboard'];

 return (
 <div className="min-h-screen flex flex-col theme-bg theme-text selection:bg-emerald-500 selection:text-slate-950 font-sans">

 <Navbar
 activeTab={activeTab}
 setActiveTab={handleSetActiveTab}
 onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
 onOpenCalculator={() => setIsCalculatorOpen(true)}
 selectedRegion={selectedRegion}
 setSelectedRegion={setSelectedRegion}
 currentUser={currentUser}
 onOpenLogin={handleOpenLoginModal}
 onLogout={handleLogout}
 theme={theme}
 onChangeTheme={setTheme}
 />

 {!hiddenHeroTabs.includes(activeTab) && (
 <Hero
 onStartLoanRequest={() => handleSetActiveTab('uber-loans')}
 onBrowseProjects={() => handleSetActiveTab('projects')}
 />
 )}

 <main className="flex-1">
 {activeTab === 'home' && (
 <LandingPage
 onStartLoanRequest={() => handleSetActiveTab('uber-loans')}
 onBrowseProjects={() => handleSetActiveTab('projects')}
 onNavigateToTab={(tab) => handleSetActiveTab(tab)}
 />
 )}
 {activeTab === 'dashboard' && currentUser && (
 <UserDashboard currentUser={currentUser} onNavigate={(tab) => handleSetActiveTab(tab)} />
 )}
 {activeTab === 'uber-loans' && <UberForLoansSimulator currentUser={currentUser} />}
 {activeTab === 'projects' && <ProjectMarketplace currentUser={currentUser} />}
 {activeTab === 'institutional' && <InstitutionalPortal />}
 {activeTab === 'fx' && <FXExchangePage />}
 {activeTab === 'insurance' && <InsurancePage />}
 {activeTab === 'services' && <FinancialServicesSuite />}
 {activeTab === 'sadc-map' && <SADCExpansionMap />}
 {activeTab === 'admin-dashboard' && <AdminPortal />}

 {!['dashboard', 'admin-dashboard'].includes(activeTab) && <LiveLedgerFeed />}
 </main>

 <MobileAppPreviewModal isOpen={isMobilePreviewOpen} onClose={() => setIsMobilePreviewOpen(false)} />
 <FinancialCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
 {isLoginOpen && (
 <LoginModal
 initialTab={loginTabMode}
 onClose={() => setIsLoginOpen(false)}
 onLoginSuccess={handleLoginSuccess}
 />
 )}

 <AiAdvisorWidget />
 <Footer />
 </div>
 );
};

export default App;
