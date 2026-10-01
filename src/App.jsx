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
import { AccountInventoryPage } from './pages/AccountInventoryPage';
import { ReportsDisputesPage } from './pages/ReportsDisputesPage';
import { CustomersPage } from './pages/CustomersPage';
import { RevenuePage } from './pages/RevenuePage';
import { SettingsPage } from './pages/SettingsPage';

const MainApp = () => {
  const { currentUser, accounts } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Khởi động mặc định vào Cửa hàng thuê ('home') nếu mở mới; giữ view qua sessionStorage khi reload trang
  const [currentView, setCurrentView] = useState(() => {
    try {
      return sessionStorage.getItem('gamerent_current_view') || 'home';
    } catch {
      return 'home';
    }
  }); 
  const [selectedAccount, setSelectedAccount] = useState(() => {
    try {
      const savedId = sessionStorage.getItem('gamerent_selected_acc_id');
      if (savedId && Array.isArray(accounts)) {
        return accounts.find(a => a.id === savedId) || null;
      }
    } catch {
      return null;
    }
    return null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Lưu view hiện tại vào sessionStorage
  React.useEffect(() => {
    try {
      sessionStorage.setItem('gamerent_current_view', currentView);
    } catch {
      // ignore
    }
  }, [currentView]);

  // Bảo vệ route: Nếu khách thuê hoặc chưa đăng nhập đang ở các trang quản trị admin, tự động chuyển về 'home'
  React.useEffect(() => {
    const adminOnlyViews = ['overview', 'customers', 'revenue', 'reports', 'admin'];
    if (!isAdmin && adminOnlyViews.includes(currentView)) {
      setCurrentView('home');
    }
    // Nếu chưa đăng nhập mà truy cập trang settings thì chuyển về home
    if (!currentUser && currentView === 'settings') {
      setCurrentView('home');
    }
  }, [isAdmin, currentUser, currentView]);

  // Nếu đang ở view 'detail' mà không có selectedAccount (ví dụ do reload trang), tự khôi phục từ accounts hoặc quay về 'home'
  React.useEffect(() => {
    if (currentView === 'detail') {
      if (!selectedAccount) {
        const savedId = sessionStorage.getItem('gamerent_selected_acc_id');
        if (savedId && Array.isArray(accounts) && accounts.length > 0) {
          const matched = accounts.find(a => a.id === savedId);
          if (matched) {
            setSelectedAccount(matched);
            return;
          }
        }
        setCurrentView('home');
      }
    }
  }, [currentView, selectedAccount, accounts]);

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositInitialAmount, setDepositInitialAmount] = useState(50000);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [accountToRent, setAccountToRent] = useState(null);
  const [rentDurationHours, setRentDurationHours] = useState(2);
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('auth') === 'login' || params.get('auth') === 'register';
    } catch {
      return false;
    }
  });
  const [authInitialTab, setAuthInitialTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('auth') === 'register' ? 'register' : 'login';
    } catch {
      return 'login';
    }
  });
  const [pendingRentAfterAuth, setPendingRentAfterAuth] = useState(null);

  const handleOpenDeposit = (missingAmount = 50000) => {
    if (!currentUser) {
      setAuthInitialTab('login');
      setPendingRentAfterAuth(null);
      setIsAuthOpen(true);
      return;
    }
    setDepositInitialAmount(missingAmount > 0 ? missingAmount : 50000);
    setIsDepositOpen(true);
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    try {
      if (account?.id) {
        sessionStorage.setItem('gamerent_selected_acc_id', account.id);
      }
    } catch {
      // ignore
    }
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerRent = (account, customDuration = null) => {
    setAccountToRent(account);
    if (customDuration) {
      setRentDurationHours(customDuration);
    }
    setIsRentModalOpen(true);
  };

  const handleRequireRegisterForRent = ({ account, hours }) => {
    setPendingRentAfterAuth({ account, hours });
    setAccountToRent(account);
    setRentDurationHours(hours || 2);
    setIsRentModalOpen(false);
    setAuthInitialTab('register');
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setIsAuthOpen(false);

    // Nếu khách vãng lai vừa đăng ký hoặc đăng nhập để thuê nick:
    if (pendingRentAfterAuth) {
      const pending = pendingRentAfterAuth;
      setPendingRentAfterAuth(null);
      setAccountToRent(pending.account);
      setRentDurationHours(pending.hours || 2);
      // Trở về cửa sổ xác nhận thuê acc
      setTimeout(() => {
        setIsRentModalOpen(true);
      }, 60);
      return;
    }

    if (user?.role === 'admin') {
      setCurrentView('overview');
    }
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setPendingRentAfterAuth(null);
    setAuthInitialTab('login');
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
          onOpenAuth={() => {
            setAuthInitialTab('login');
            setPendingRentAfterAuth(null);
            setIsAuthOpen(true);
          }}
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
            <ReportsDisputesPage />
          )}

          {currentView === 'admin' && (
            <AccountInventoryPage />
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
        initialDuration={rentDurationHours}
        onRentSuccess={() => {
          setCurrentView('my-rentals');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDeposit={handleOpenDeposit}
        onRequireRegister={handleRequireRegisterForRent}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onLoginSuccess={handleAuthSuccess}
        initialTab={authInitialTab}
        pendingRental={pendingRentAfterAuth}
      />

      {/* Floating Toolbar for Testers */}
      {typeof window !== 'undefined' && !window.location.search.includes('clean=1') && <FloatingTesterToolbar />}
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
