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
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginTabMode, setLoginTabMode] = useState<'login' | 'register'>('login');

  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('ZW');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('apex_theme') || 'dark-midnight');

  // Sync theme class on <html> element
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

  // Load user session on mount (verify token still valid)
  useEffect(() => {
    const savedUser = localStorage.getItem('apex_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Silently verify session against server
        if (user.token) {
          fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${user.token}` },
            credentials: 'include'
          }).then(res => {
            if (!res.ok) {
              // Session expired — clear gracefully
              localStorage.removeItem('apex_user');
              setCurrentUser(null);
            }
          }).catch(() => {}); // network error — keep local session
        }
      } catch {
        localStorage.removeItem('apex_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('apex_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    // Clear server-side cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setCurrentUser(null);
    localStorage.removeItem('apex_user');
    setActiveTab('home');
  };

  // Route protection filter
  const handleSetActiveTab = (tab: NavigationTab) => {
    const protectedTabs: NavigationTab[] = ['uber-loans', 'institutional', 'admin-dashboard', 'dashboard'];
    if (protectedTabs.includes(tab) && !currentUser) {
      setLoginTabMode('login');
      setIsLoginOpen(true);
      return;
    }
    // Admin-only protection
    if (tab === 'admin-dashboard' && currentUser?.role !== 'admin') return;
    setActiveTab(tab);
  };

  const handleOpenLoginModal = (tab: 'login' | 'register' = 'login') => {
    setLoginTabMode(tab);
    setIsLoginOpen(true);
  };

  // Tabs that show the Hero banner
  const showHero = !['home', 'dashboard'].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">

      {/* Navigation Bar */}
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

      {/* Hero Showcase Header (Hidden on Home & Dashboard pages) */}
      {showHero && (
        <Hero
          onStartLoanRequest={() => handleSetActiveTab('uber-loans')}
          onBrowseProjects={() => handleSetActiveTab('projects')}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onStartLoanRequest={() => handleSetActiveTab('uber-loans')}
            onBrowseProjects={() => handleSetActiveTab('projects')}
            onNavigateToTab={(tab) => handleSetActiveTab(tab)}
          />
        )}
        {activeTab === 'dashboard' && currentUser && (
          <UserDashboard
            currentUser={currentUser}
            onNavigate={(tab) => handleSetActiveTab(tab)}
          />
        )}
        {activeTab === 'uber-loans' && <UberForLoansSimulator currentUser={currentUser} />}
        {activeTab === 'projects' && <ProjectMarketplace currentUser={currentUser} />}
        {activeTab === 'institutional' && <InstitutionalPortal />}
        {activeTab === 'services' && <FinancialServicesSuite />}
        {activeTab === 'sadc-map' && <SADCExpansionMap />}
        {activeTab === 'admin-dashboard' && <AdminPortal />}

        {/* Escrow Ledger Transaction Feed */}
        {!['dashboard', 'admin-dashboard'].includes(activeTab) && <LiveLedgerFeed />}
      </main>

      {/* Mobile App Simulator Drawer */}
      <MobileAppPreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
      />

      {/* Financial Calculator Drawer */}
      <FinancialCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Authentication Overlay */}
      {isLoginOpen && (
        <LoginModal
          initialTab={loginTabMode}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Floating AI Advisor */}
      <AiAdvisorWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
