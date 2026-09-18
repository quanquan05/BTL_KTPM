import React, { useState } from 'react';
import {
  Menu,
  Wallet,
  Bell,
  LogOut,
  ChevronDown,
  Plus,
  LogIn,
  LayoutDashboard,
  Store,
  Clock,
  Users,
  BarChart3,
  FileText,
  Settings,
  Gamepad2,
  Activity,
  CheckCircle2,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ currentView = 'overview', setView, onOpenDeposit, onOpenAuth, onToggleSidebar }) => {
  const { currentUser, logout, switchRole, disputes, accounts, rentals, returnRentalEarly } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showServerStatus, setShowServerStatus] = useState(false);

  const pendingDisputes = disputes ? disputes.filter(d => d.status === 'pending') : [];

  // Metadata theo từng phân hệ trang hiển thị
  const VIEW_CONFIG = {
    overview: { title: 'Bảng Điều Khiển Tổng Quan', section: 'Hệ Thống', icon: LayoutDashboard },
    home: { title: 'Cửa Hàng Thuê Tài Khoản', section: 'Cửa Hàng', icon: Store },
    detail: { title: 'Chi Tiết Tài Khoản Game', section: 'Cửa Hàng', icon: Gamepad2 },
    'my-rentals': { title: currentUser?.role === 'admin' ? 'Quản Lý Đơn Thuê' : 'Đơn Thuê Của Tôi', section: 'Đơn Hàng', icon: Clock },
    wallet: { title: 'Ví & Lịch Sử Giao Dịch', section: 'Tài Chính', icon: Wallet },
    customers: { title: 'Danh Sách Khách Hàng', section: 'Người Dùng', icon: Users },
    revenue: { title: 'Báo Cáo Doanh Thu', section: 'Tài Chính', icon: BarChart3 },
    reports: { title: 'Khiếu Nại & Sự Cố', section: 'Báo Cáo', icon: FileText },
    admin: { title: 'Kho Quản Lý Tài Khoản', section: 'Quản Trị', icon: Settings },
    settings: { title: 'Cài Đặt Hệ Thống', section: 'Cấu Hình', icon: Settings }
  };

  const activeViewMeta = VIEW_CONFIG[currentView] || VIEW_CONFIG.overview;
  const ActiveIcon = activeViewMeta.icon;
  const isAdmin = currentUser?.role === 'admin';

  const handleNavigateToRental = (rentalId) => {
    localStorage.setItem('gamerent_highlight_order', rentalId);
    window.dispatchEvent(new CustomEvent('gamerent_highlight_order_changed', { detail: { orderId: rentalId } }));
    setView('my-rentals');
    setShowNotifications(false);
  };

  return (
    <header className="app-header" id="app-header" data-testid="app-header">
      {/* Left section: Hamburger & Breadcrumb / Live Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          type="button"
          id="btn-toggle-sidebar"
          data-testid="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--transition-fast)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Menu size={20} />
        </button>

        {/* Thay thế thanh tìm kiếm thừa bằng Breadcrumb & Live Server Status Badge */}
        <div className="header-breadcrumb-container">
          <div className="header-breadcrumb-main">
            <div className="header-breadcrumb-path">
              <span>GameRent</span>
              <ChevronRight size={11} />
              <span>{activeViewMeta.section}</span>
            </div>
            <div className="header-breadcrumb-title">
              <ActiveIcon size={15} color="#059669" />
              <span>{activeViewMeta.title}</span>
            </div>
          </div>

          {/* Chip Trạng thái Máy chủ Realtime */}
          <div style={{ position: 'relative' }}>
            <div
              className="header-status-badge"
              id="badge-server-live-status"
              title="Hệ thống đang trực tuyến và vận hành ổn định. Nhấp để xem thông số hạ tầng."
              onClick={() => setShowServerStatus(!showServerStatus)}
            >
              <span className="status-dot-pulse" />
              <span>Hệ thống: Trực tuyến</span>
              <span style={{ fontSize: '0.68rem', color: '#047857', opacity: 0.85 }}>• 18ms</span>
            </div>

            {/* Popover thông số hạ tầng máy chủ */}
            {showServerStatus && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  left: 0,
                  width: 280,
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                  padding: '12px 14px',
                  zIndex: 200,
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #F1F5F9', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Activity size={15} color="#10B981" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Trạng Thái Máy Chủ</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', background: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    99.9% Uptime
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: '0.74rem', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Máy chủ WebSocket:</span>
                    <strong style={{ color: '#059669' }}>● Đang kết nối (18ms)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cổng VietQR / Nạp ví:</span>
                    <strong style={{ color: '#059669' }}>✓ Sẵn sàng 24/7</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bot cấp acc tự động:</span>
                    <strong style={{ color: '#059669' }}>✓ 100% Hoạt động</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cơ chế đổi mật khẩu:</span>
                    <strong style={{ color: '#059669' }}>✓ Tự động bảo vệ</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nút Lối Tắt Nhanh (Quick Switch) */}
          {isAdmin && (
            <button
              type="button"
              id="btn-quick-switch-view"
              className="header-quick-switch-btn"
              onClick={() => setView(currentView === 'overview' ? 'home' : 'overview')}
              title={currentView === 'overview' ? 'Xem giao diện Cửa hàng của khách' : 'Quay về Bảng điều khiển Quản trị'}
            >
              {currentView === 'overview' ? (
                <>
                  <Store size={13} color="#059669" />
                  <span>Cửa hàng</span>
                </>
              ) : (
                <>
                  <LayoutDashboard size={13} color="#3B82F6" />
                  <span>Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Right section: Balance, Notifications & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {currentUser ? (
          <>
            {/* Balance Pill */}
            <div
              className="header-wallet-pill"
              id="user-balance-box"
              data-testid="user-balance-box"
              onClick={onOpenDeposit}
              title="Nhấn để nạp tiền vào ví"
            >
              <Wallet size={16} color="#059669" />
              <span id="user-balance-display" data-testid="user-balance-display">
                Ví: {currentUser.balance ? currentUser.balance.toLocaleString('vi-VN') : '0'}đ
              </span>
            </div>

            {/* Notification Bell (3 Mức độ: Xanh, Vàng, Đỏ) */}
            {(() => {
              const now = Date.now();
              const isAdmin = currentUser?.role === 'admin';

              // DÀNH CHO ADMIN: Giám sát toàn bộ hệ thống
              const pendingDisputes = disputes ? disputes.filter(d => d.status === 'pending') : [];
              const errorAccounts = accounts ? accounts.filter(a => a.status === 'maintenance' || a.status === 'need_change_pass' || a.status === 'reported') : [];
              
              // Tách riêng ca thuê đã hết hạn (MỨC ĐỎ) và ca thuê sắp hết hạn trong vòng 1h (MỨC VÀNG)
              const adminExpiredRentals = rentals ? rentals.filter(r => r.status === 'active' && r.endTime <= now) : [];
              const adminExpiringRentals = rentals ? rentals.filter(r => r.status === 'active' && r.endTime > now && (r.endTime - now <= 60 * 60 * 1000)) : [];
              
              const adminRedCount = pendingDisputes.length + errorAccounts.length + adminExpiredRentals.length;
              const adminYellowCount = adminExpiringRentals.length;

              // DÀNH CHO KHÁCH HÀNG: Chỉ theo dõi đơn của chính khách hàng
              const myRentals = rentals ? rentals.filter(r => r.userId === currentUser?.id) : [];
              const myActiveRentals = myRentals.filter(r => r.status === 'active');
              const myActiveSorted = [...myActiveRentals].sort((a, b) => a.endTime - b.endTime);
              const myExpiredRentals = myActiveSorted.filter(r => r.endTime <= now);
              const myExpiringSoonRentals = myActiveSorted.filter(r => r.endTime > now && (r.endTime - now <= 60 * 60 * 1000));
              const myAlertRentals = [...myExpiredRentals, ...myExpiringSoonRentals];

              // Xác định cấp độ cảnh báo (Severity) & số lượng cảnh báo
              let severity = 'green';
              let totalAlerts = 0;

              if (isAdmin) {
                severity = adminRedCount > 0 ? 'red' : adminYellowCount > 0 ? 'yellow' : 'green';
                totalAlerts = adminRedCount > 0 ? adminRedCount : adminYellowCount;
              } else {
                if (myExpiredRentals.length > 0) {
                  severity = 'red';
                  totalAlerts = myAlertRentals.length;
                } else if (myExpiringSoonRentals.length > 0) {
                  severity = 'yellow';
                  totalAlerts = myExpiringSoonRentals.length;
                } else {
                  severity = 'green';
                  totalAlerts = 0;
                }
              }

              const bellColors = {
                red: { color: '#EF4444', bg: '#FEF2F2', border: '#FECDD3', badgeBg: '#DC2626' },
                yellow: { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', badgeBg: '#D97706' },
                green: { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', badgeBg: '#059669' }
              }[severity];

              const buttonTitle = isAdmin
                ? `Thông báo hệ thống: Mức ${severity === 'red' ? 'Đỏ (Khẩn cấp)' : severity === 'yellow' ? 'Vàng (Cảnh báo)' : 'Xanh (An toàn)'}`
                : totalAlerts > 0
                ? `Bạn có ${totalAlerts} đơn thuê cần chú ý (sắp hết hạn hoặc đã hết giờ)`
                : 'Thông báo: Tất cả đơn thuê đang hoạt động bình thường';

              return (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="header-notif-btn"
                    id="btn-header-notifications"
                    data-testid="btn-header-notifications"
                    title={buttonTitle}
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      background: bellColors.bg,
                      borderColor: bellColors.border,
                      color: bellColors.color
                    }}
                  >
                    <Bell size={18} strokeWidth={2.3} />
                    <span
                      className="header-notif-badge"
                      style={{
                        background: bellColors.badgeBg,
                        boxShadow: severity === 'red' ? '0 0 0 2px #FFFFFF, 0 0 8px rgba(239, 68, 68, 0.6)' : 'none'
                      }}
                    >
                      {severity === 'green' ? '✓' : totalAlerts}
                    </span>
                  </button>

                  {/* Notification Popover Dropdown */}
                  {showNotifications && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '115%',
                        right: -10,
                        width: 360,
                        background: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 16,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        padding: '14px',
                        zIndex: 300,
                        animation: 'slideUp 0.18s ease'
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: '50%',
                              background: bellColors.color,
                              boxShadow: `0 0 6px ${bellColors.color}`
                            }}
                          />
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                            {isAdmin ? 'Thông Báo Hệ Thống' : 'Thông Báo Đơn Thuê'}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 20,
                            background: bellColors.bg,
                            color: bellColors.color,
                            border: `1px solid ${bellColors.border}`
                          }}
                        >
                          {isAdmin ? (
                            severity === 'red' ? '🔴 Mức Đỏ: Khẩn cấp' : severity === 'yellow' ? '🟡 Mức Vàng: Cảnh báo' : '🟢 Mức Xanh: An toàn'
                          ) : (
                            myExpiredRentals.length > 0 ? '🔴 Đã hết giờ' : myExpiringSoonRentals.length > 0 ? '🟡 Sắp hết hạn' : '🟢 Đang an toàn'
                          )}
                        </span>
                      </div>

                      {/* Notification Items List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 350, overflowY: 'auto', paddingRight: 2 }}>
                        {/* ================= GIAO DIỆN KHÁCH HÀNG ================= */}
                        {!isAdmin && (
                          <>
                            {myAlertRentals.length > 0 ? (
                              myAlertRentals.map(r => {
                                const remainingMs = Math.max(0, r.endTime - now);
                                const remainingMins = Math.floor(remainingMs / (1000 * 60));
                                const isExpired = remainingMs === 0;

                                return (
                                  <div
                                    key={r.id}
                                    style={{
                                      background: isExpired ? '#FEF2F2' : '#FFFBEB',
                                      border: `1px solid ${isExpired ? '#FECDD3' : '#FDE68A'}`,
                                      borderRadius: 10,
                                      padding: '11px 12px',
                                      fontSize: '0.78rem',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <span style={{ color: isExpired ? '#DC2626' : '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: isExpired ? '#EF4444' : '#F59E0B' }} />
                                        {isExpired ? 'Đơn thuê đã hết giờ' : 'Đơn thuê sắp hết giờ'}
                                      </span>
                                      <span style={{ fontSize: '0.7rem', color: isExpired ? '#991B1B' : '#B45309', fontWeight: 800 }}>
                                        {isExpired ? 'Đã hết giờ' : `Còn ${remainingMins} phút`}
                                      </span>
                                    </div>

                                    <div style={{ color: '#0F172A', fontWeight: 700, marginBottom: 3 }}>
                                      Đơn #{r.id} • {r.accountTitle || r.accountCode}
                                    </div>

                                    <div style={{ color: '#64748B', fontSize: '0.73rem', marginBottom: 8, lineHeight: 1.35 }}>
                                      {isExpired
                                        ? 'Thời gian thuê đã hết. Vui lòng vào trang Đơn của tôi để gia hạn thêm giờ hoặc trả tài khoản.'
                                        : 'Thời gian chơi sắp hết! Nhấp vào để gia hạn thêm giờ, trả acc sớm hoặc báo lỗi nếu gặp sự cố.'}
                                    </div>

                                    {isExpired ? (
                                      <button
                                        type="button"
                                        id={`btn-revoke-my-rental-${r.id}`}
                                        data-testid={`btn-revoke-my-rental-${r.id}`}
                                        onClick={() => {
                                          returnRentalEarly(r.id);
                                          setShowNotifications(false);
                                          localStorage.setItem('gamerent_highlight_order', r.id);
                                          window.dispatchEvent(new CustomEvent('gamerent_highlight_order_changed', { detail: { orderId: r.id } }));
                                          setView('my-rentals');
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: '7px 10px',
                                          borderRadius: 6,
                                          background: '#DC2626',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          fontSize: '0.74rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: 5,
                                          boxShadow: '0 1px 3px rgba(220, 38, 38, 0.25)'
                                        }}
                                      >
                                        <LogOut size={13} color="#FFFFFF" />
                                        <span>Thu hồi acc</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        id={`btn-goto-my-rental-${r.id}`}
                                        onClick={() => handleNavigateToRental(r.id)}
                                        style={{
                                          width: '100%',
                                          padding: '7px 10px',
                                          borderRadius: 6,
                                          background: '#F59E0B',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          fontSize: '0.74rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: 5,
                                          boxShadow: '0 1px 3px rgba(245, 158, 11, 0.25)'
                                        }}
                                      >
                                        <span>Xem đơn (Gia hạn / Trả sớm / Báo lỗi)</span>
                                        <span>→</span>
                                      </button>
                                    )}
                                  </div>
                                );
                              })
                            ) : myActiveSorted.length > 0 ? (
                              <>
                                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, padding: '2px 4px' }}>
                                  Đơn đang thuê hoạt động bình thường:
                                </div>
                                {myActiveSorted.map(r => {
                                  const remainingMs = Math.max(0, r.endTime - now);
                                  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
                                  const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

                                  return (
                                    <div
                                      key={r.id}
                                      style={{
                                        background: '#F0FDF4',
                                        border: '1px solid #BBF7D0',
                                        borderRadius: 10,
                                        padding: '10px 12px',
                                        fontSize: '0.78rem'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <span style={{ color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                                          Đang chơi ổn định
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 700 }}>
                                          Còn {remainingHours}h {remainingMins}p
                                        </span>
                                      </div>
                                      <div style={{ color: '#0F172A', fontWeight: 600, marginBottom: 4 }}>
                                        Đơn #{r.id} • {r.accountTitle || r.accountCode}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleNavigateToRental(r.id)}
                                        style={{
                                          width: '100%',
                                          padding: '5px',
                                          borderRadius: 6,
                                          background: '#10B981',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Vào xem thông tin đăng nhập & đơn thuê →
                                      </button>
                                    </div>
                                  );
                                })}
                              </>
                            ) : (
                              <div
                                style={{
                                  background: '#ECFDF5',
                                  border: '1px solid #A7F3D0',
                                  borderRadius: 10,
                                  padding: '16px 12px',
                                  textAlign: 'center'
                                }}
                              >
                                <div style={{ fontSize: '24px', marginBottom: 6 }}>🎮</div>
                                <div style={{ color: '#065F46', fontWeight: 800, fontSize: '0.84rem', marginBottom: 4 }}>
                                  Không Có Đơn Sắp Hết Hạn
                                </div>
                                <div style={{ color: '#047857', fontSize: '0.76rem', lineHeight: 1.4, marginBottom: 10 }}>
                                  Bạn hiện không có ca thuê nào sắp hết giờ. Hãy khám phá thêm các tài khoản game vip giá rẻ!
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setView('home');
                                    setShowNotifications(false);
                                  }}
                                  style={{
                                    background: '#059669',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '6px 14px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Khám phá kho acc game →
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        {/* ================= GIAO DIỆN QUẢN TRỊ VIÊN (ADMIN) ================= */}
                        {isAdmin && (
                          <>
                            {/* 1. MỨC ĐỎ: Khiếu nại từ khách hàng & Tài khoản lỗi */}
                            {pendingDisputes.map(d => (
                              <div
                                key={d.id}
                                style={{
                                  background: '#FEF2F2',
                                  border: '1px solid #FECDD3',
                                  borderRadius: 10,
                                  padding: '10px 12px',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <span style={{ color: '#E11D48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                                    Khiếu nại #{d.id} • Đơn #{d.orderId}
                                  </span>
                                  <span style={{ fontSize: '0.68rem', color: '#9F1239', fontWeight: 600 }}>Mới</span>
                                </div>
                                <div style={{ color: '#0F172A', fontWeight: 600, marginBottom: 2 }}>
                                  Lý do: {d.reason}
                                </div>
                                <div style={{ color: '#64748B', fontSize: '0.74rem', marginBottom: 6 }}>
                                  Khách: <strong>{d.userName || d.userId}</strong> - &quot;{d.note}&quot;
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setView('reports');
                                    setShowNotifications(false);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '6px',
                                    borderRadius: 6,
                                    background: '#E11D48',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4
                                  }}
                                >
                                  <span>Xử lý & Hoàn tiền ngay</span>
                                  <span>→</span>
                                </button>
                              </div>
                            ))}

                            {/* Tài khoản lỗi / cần đổi pass */}
                            {errorAccounts.map(acc => (
                              <div
                                key={acc.id}
                                style={{
                                  background: '#FFF1F2',
                                  border: '1px solid #FDA4AF',
                                  borderRadius: 10,
                                  padding: '10px 12px',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#BE123C', fontWeight: 700, marginBottom: 3 }}>
                                  <span>⚠️ Tài khoản cần đổi mật khẩu / Bảo trì</span>
                                </div>
                                <div style={{ color: '#0F172A', fontWeight: 600, marginBottom: 4 }}>
                                  #{acc.id} - {acc.title}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setView('admin');
                                    setShowNotifications(false);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '5px',
                                    borderRadius: 6,
                                    background: '#E11D48',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Vào kho quản lý đổi mật khẩu →
                                </button>
                              </div>
                            ))}

                            {/* Ca thuê của khách đã hết hạn: CẢNH BÁO ĐỎ & CHỈ CÓ 1 NÚT THU HỒI ACC */}
                            {adminExpiredRentals.map(r => (
                              <div
                                key={r.id}
                                style={{
                                  background: '#FEF2F2',
                                  border: '1px solid #FECDD3',
                                  borderRadius: 10,
                                  padding: '10px 12px',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <span style={{ color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                                    Ca thuê đã hết hạn
                                  </span>
                                  <span style={{ fontSize: '0.68rem', color: '#991B1B', fontWeight: 800, background: '#FEE2E2', padding: '1px 6px', borderRadius: 4 }}>
                                    Đã hết giờ
                                  </span>
                                </div>
                                <div style={{ color: '#0F172A', fontWeight: 600, marginBottom: 2 }}>
                                  Đơn #{r.id} • {r.accountTitle || r.accountCode}
                                </div>
                                <div style={{ color: '#64748B', fontSize: '0.74rem', marginBottom: 6 }}>
                                  Người thuê: <strong>{r.customerName || r.userId}</strong>
                                </div>
                                <button
                                  type="button"
                                  id={`btn-revoke-rental-${r.id}`}
                                  data-testid={`btn-revoke-rental-${r.id}`}
                                  onClick={() => {
                                    returnRentalEarly(r.id);
                                    setShowNotifications(false);
                                    localStorage.setItem('gamerent_highlight_order', r.id);
                                    window.dispatchEvent(new CustomEvent('gamerent_highlight_order_changed', { detail: { orderId: r.id } }));
                                    setView('my-rentals');
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '7px',
                                    borderRadius: 6,
                                    background: '#DC2626',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 5,
                                    boxShadow: '0 1px 3px rgba(220, 38, 38, 0.25)'
                                  }}
                                >
                                  <LogOut size={13} color="#FFFFFF" />
                                  <span>Thu hồi acc</span>
                                </button>
                              </div>
                            ))}

                            {/* 2. MỨC VÀNG: Ca thuê của khách sắp hết hạn (< 1h) */}
                            {adminExpiringRentals.map(r => {
                              const remainingMs = Math.max(0, r.endTime - now);
                              const remainingMins = Math.floor(remainingMs / (1000 * 60));
                              return (
                                <div
                                  key={r.id}
                                  style={{
                                    background: '#FFFBEB',
                                    border: '1px solid #FDE68A',
                                    borderRadius: 10,
                                    padding: '10px 12px',
                                    fontSize: '0.78rem'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                                      Ca thuê sắp hết hạn
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 800 }}>
                                      {remainingMins > 0 ? `Còn ${remainingMins} phút` : 'Đã hết giờ'}
                                    </span>
                                  </div>
                                  <div style={{ color: '#0F172A', fontWeight: 600, marginBottom: 2 }}>
                                    Đơn #{r.id} • {r.accountTitle || r.accountCode}
                                  </div>
                                  <div style={{ color: '#64748B', fontSize: '0.74rem', marginBottom: 6 }}>
                                    Người thuê: <strong>{r.customerName || r.userId}</strong>
                                  </div>
                                  <button
                                    type="button"
                                    id={`btn-inspect-rental-${r.id}`}
                                    onClick={() => handleNavigateToRental(r.id)}
                                    style={{
                                      width: '100%',
                                      padding: '6px',
                                      borderRadius: 6,
                                      background: '#F59E0B',
                                      color: '#FFFFFF',
                                      border: 'none',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 4,
                                      boxShadow: '0 1px 3px rgba(245, 158, 11, 0.25)'
                                    }}
                                  >
                                    <span>Giám sát ca thuê #{r.id} ({r.customerName || r.userId})</span>
                                    <span>→</span>
                                  </button>
                                </div>
                              );
                            })}

                            {/* 3. MỨC XANH: Hệ thống an toàn */}
                            {severity === 'green' && (
                              <div
                                style={{
                                  background: '#ECFDF5',
                                  border: '1px solid #A7F3D0',
                                  borderRadius: 10,
                                  padding: '14px',
                                  textAlign: 'center'
                                }}
                              >
                                <div style={{ fontSize: '24px', marginBottom: 6 }}>🛡️</div>
                                <div style={{ color: '#065F46', fontWeight: 800, fontSize: '0.84rem', marginBottom: 4 }}>
                                  Hệ Thống An Toàn 100%
                                </div>
                                <div style={{ color: '#047857', fontSize: '0.76rem', lineHeight: 1.4 }}>
                                  Không có tài khoản nào bị lỗi hoặc khiếu nại. Tất cả các ca thuê đều vận hành ổn định.
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Footer */}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                          Cập nhật thời gian thực
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setView(isAdmin ? 'overview' : 'my-rentals');
                            setShowNotifications(false);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#3B82F6',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {isAdmin ? 'Xem báo cáo tổng quan →' : 'Xem trang Đơn của tôi →'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* User Profile */}
            <div style={{ position: 'relative' }}>
              <div
                className="header-user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="header-user-dropdown-btn"
                data-testid="header-user-dropdown-btn"
              >
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                  alt={currentUser.name}
                  className="header-user-avatar"
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>
                    {currentUser.role === 'admin' ? 'Admin' : 'Khách thuê'}
                  </span>
                </div>
                <ChevronDown size={14} color="#94A3B8" />
              </div>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: 210,
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    zIndex: 100,
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{currentUser.email}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setView('wallet');
                      setShowUserMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Wallet size={15} color="#10B981" />
                    <span>Quản lý Ví tiền</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextRole = currentUser.role === 'admin' ? 'renter' : 'admin';
                      switchRole(nextRole);
                      setShowUserMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Plus size={15} color="#3B82F6" />
                    <span>Đổi vai trò ({currentUser.role === 'admin' ? 'Khách' : 'Admin'})</span>
                  </button>

                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                  <button
                    type="button"
                    id="btn-logout"
                    data-testid="btn-logout"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: '#EF4444',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF1F2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            id="btn-nav-login"
            data-testid="btn-nav-login"
            onClick={onOpenAuth}
            className="btn btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.84rem' }}
          >
            <LogIn size={14} /> Đăng Nhập
          </button>
        )}
      </div>
    </header>
  );
};
