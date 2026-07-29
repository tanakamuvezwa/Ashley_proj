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

  // Sync theme class on HTML element
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('apex_theme', theme);
  }, [theme]);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('apex_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('apex_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('apex_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('apex_user');
    setActiveTab('home');
  };

  // Route protection filter
  const handleSetActiveTab = (tab: NavigationTab) => {
    const protectedTabs: NavigationTab[] = ['uber-loans', 'institutional', 'admin-dashboard'];
    if (protectedTabs.includes(tab) && !currentUser) {
      setLoginTabMode('login');
      setIsLoginOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleOpenLoginModal = (tab: 'login' | 'register' = 'login') => {
    setLoginTabMode(tab);
    setIsLoginOpen(true);
  };

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

      {/* Hero Showcase Header (Hidden on Home Page to keep it clean) */}
      {activeTab !== 'home' && (
        <Hero
          onStartLoanRequest={() => handleSetActiveTab('uber-loans')}
          onBrowseProjects={() => handleSetActiveTab('projects')}
        />
      )}

      {/* Main Interactive Marketplace Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage 
            onStartLoanRequest={() => handleSetActiveTab('uber-loans')}
            onBrowseProjects={() => handleSetActiveTab('projects')}
            onNavigateToTab={(tab) => handleSetActiveTab(tab)}
          />
        )}
        {activeTab === 'uber-loans' && <UberForLoansSimulator />}
        {activeTab === 'projects' && <ProjectMarketplace />}
        {activeTab === 'institutional' && <InstitutionalPortal />}
        {activeTab === 'services' && <FinancialServicesSuite />}
        {activeTab === 'sadc-map' && <SADCExpansionMap />}
        {activeTab === 'admin-dashboard' && <AdminPortal />}

        {/* Escrow Ledger Transaction Feed */}
        <LiveLedgerFeed />
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

      {/* Credentials Authentication Overlay */}
      {isLoginOpen && (
        <LoginModal 
          initialTab={loginTabMode}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Floating AI Advisor Panel */}
      <AiAdvisorWidget />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
