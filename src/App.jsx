import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingTesterToolbar } from './components/FloatingTesterToolbar';
import { DepositModal } from './components/DepositModal';
import { RentConfirmModal } from './components/RentConfirmModal';
import { AuthModal } from './components/AuthModal';

import { OverviewDashboard } from './pages/OverviewDashboard';
import { HomePage } from './pages/HomePage';
import { AccountDetailPage } from './pages/AccountDetailPage';
import { MyRentalsPage } from './pages/MyRentalsPage';
import { WalletPage } from './pages/WalletPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { RevenuePage } from './pages/RevenuePage';
import { SettingsPage } from './pages/SettingsPage';

const MainApp = () => {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Khách thuê mặc định vào Cửa hàng thuê ('home'), Admin mặc định vào Tổng quan ('overview')
  const [currentView, setCurrentView] = useState(() => {
    return currentUser?.role === 'admin' ? 'overview' : 'home';
  }); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Bảo vệ route: Nếu khách thuê đang ở các trang quản trị admin, tự động chuyển về 'home'
  React.useEffect(() => {
    const adminOnlyViews = ['overview', 'customers', 'revenue', 'reports', 'settings', 'admin'];
    if (!isAdmin && adminOnlyViews.includes(currentView)) {
      setCurrentView('home');
    }
  }, [isAdmin, currentView]);

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
    <div className="app-dashboard-layout">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="app-main-content">
        {/* Top Header / Navbar */}
        <Navbar
          currentView={currentView}
          setView={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDeposit={() => handleOpenDeposit()}
          onOpenAuth={() => setIsAuthOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main style={{ flex: 1 }}>
          {currentView === 'overview' && (
            <OverviewDashboard
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectAccount={handleSelectAccount}
            />
          )}

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
              onSelectAccount={handleSelectAccount}
            />
          )}

          {currentView === 'my-rentals' && (
            <MyRentalsPage
              onExploreMore={() => setCurrentView('home')}
              onOpenDeposit={handleOpenDeposit}
            />
          )}

          {currentView === 'wallet' && (
            <WalletPage
              onOpenDeposit={() => handleOpenDeposit()}
            />
          )}

          {currentView === 'customers' && (
            <CustomersPage />
          )}

          {currentView === 'revenue' && (
            <RevenuePage />
          )}

          {currentView === 'reports' && (
            <AdminDashboardPage initialTab="disputes" />
          )}

          {currentView === 'admin' && (
            <AdminDashboardPage initialTab="accounts" />
          )}

          {currentView === 'settings' && (
            <SettingsPage />
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: '#1e293b',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Đã xảy ra sự cố hiển thị
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              Dữ liệu tạm trong bộ nhớ trình duyệt có thể không tương thích. Vui lòng bấm nút dưới đây để làm mới hệ thống.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              🔄 Khôi Phục Dữ Liệu & Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
