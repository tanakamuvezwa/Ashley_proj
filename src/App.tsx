import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UberForLoansSimulator } from './components/UberForLoansSimulator';
import { ProjectMarketplace } from './components/ProjectMarketplace';
import { InstitutionalPortal } from './components/InstitutionalPortal';
import { FinancialServicesSuite } from './components/FinancialServicesSuite';
import { SADCExpansionMap } from './components/SADCExpansionMap';
import { MobileAppPreviewModal } from './components/MobileAppPreviewModal';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { FinancialCalculatorModal } from './components/FinancialCalculatorModal';
import { LiveLedgerFeed } from './components/LiveLedgerFeed';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('uber-loans');
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('ZW');
  const [userRole, setUserRole] = useState<'borrower' | 'investor' | 'merchant'>('borrower');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Hero Showcase Header */}
      <Hero
        onStartLoanRequest={() => setActiveTab('uber-loans')}
        onBrowseProjects={() => setActiveTab('projects')}
      />

      {/* Main Interactive Marketplace Tab Content */}
      <main className="flex-1">
        {activeTab === 'uber-loans' && <UberForLoansSimulator />}
        {activeTab === 'projects' && <ProjectMarketplace />}
        {activeTab === 'institutional' && <InstitutionalPortal />}
        {activeTab === 'services' && <FinancialServicesSuite />}
        {activeTab === 'sadc-map' && <SADCExpansionMap />}

        {/* Audit & Escrow Ledger Feed */}
        <LiveLedgerFeed />
      </main>

      {/* Mobile App View Simulator Modal */}
      <MobileAppPreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
      />

      {/* Financial Calculator Modal */}
      <FinancialCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Floating MBONGO AI Financial Advisor Widget */}
      <AiAdvisorWidget />

      {/* Corporate Footer */}
      <Footer />

    </div>
  );
};

export default App;
