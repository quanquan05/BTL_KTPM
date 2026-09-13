import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingTesterToolbar } from './components/FloatingTesterToolbar';
import { DepositModal } from './components/DepositModal';
import { RentConfirmModal } from './components/RentConfirmModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { AccountDetailPage } from './pages/AccountDetailPage';
import { MyRentalsPage } from './pages/MyRentalsPage';
import { WalletPage } from './pages/WalletPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainApp = () => {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'detail' | 'my-rentals' | 'wallet' | 'admin'
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositInitialAmount, setDepositInitialAmount] = useState(50000);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [accountToRent, setAccountToRent] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenDeposit = (missingAmount = 50000) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setDepositInitialAmount(missingAmount > 0 ? missingAmount : 50000);
    setIsDepositOpen(true);
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerRent = (account) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setAccountToRent(account);
    setIsRentModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDeposit={() => handleOpenDeposit()}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage
            onSelectAccount={handleSelectAccount}
            onRentAccount={handleTriggerRent}
            onOpenDeposit={handleOpenDeposit}
          />
        )}

        {currentView === 'detail' && (
          <AccountDetailPage
            account={selectedAccount}
            onBack={() => setCurrentView('home')}
            onRentNow={handleTriggerRent}
            onOpenDeposit={handleOpenDeposit}
          />
        )}

        {currentView === 'my-rentals' && (
          <MyRentalsPage
            onExploreMore={() => setCurrentView('home')}
          />
        )}

        {currentView === 'wallet' && (
          <WalletPage
            onOpenDeposit={() => handleOpenDeposit()}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        initialAmount={depositInitialAmount}
      />

      <RentConfirmModal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        account={accountToRent}
        onRentSuccess={() => {
          setCurrentView('my-rentals');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDeposit={handleOpenDeposit}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Floating Toolbar for Testers */}
      <FloatingTesterToolbar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
