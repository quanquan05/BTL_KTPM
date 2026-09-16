import React, { useState } from 'react';
import { Menu, Search, Wallet, Bell, LogOut, ChevronDown, Plus, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ setView, onOpenDeposit, onOpenAuth, onToggleSidebar }) => {
  const { currentUser, logout, switchRole, disputes } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const pendingDisputes = disputes ? disputes.filter(d => d.status === 'pending') : [];
  const notifCount = pendingDisputes.length > 0 ? pendingDisputes.length : 3;

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setView('home');
    }
  };

  return (
    <header className="app-header" id="app-header" data-testid="app-header">
      {/* Left section: Hamburger & Search Box */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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

        <div className="header-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            id="header-global-search"
            data-testid="header-global-search"
            className="header-search-input"
            placeholder="Tìm kiếm tài khoản, game, người dùng..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <div className="header-search-badge">Ctrl + K</div>
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

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="header-notif-btn"
                id="btn-header-notifications"
                data-testid="btn-header-notifications"
                title="Thông báo hệ thống"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                <span className="header-notif-badge">{notifCount}</span>
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: -10,
                    width: 320,
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    boxShadow: 'var(--shadow-xl)',
                    padding: '12px',
                    zIndex: 200,
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)', marginBottom: 8 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                      Thông Báo Hệ Thống ({notifCount})
                    </div>
                    {pendingDisputes.length > 0 && (
                      <span style={{ fontSize: '0.68rem', background: '#FEE2E2', color: '#E11D48', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>
                        {pendingDisputes.length} khiếu nại mới
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                    {pendingDisputes.length > 0 ? (
                      pendingDisputes.map(d => (
                        <div
                          key={d.id}
                          style={{
                            background: '#FFF1F2',
                            border: '1px solid #FECDD3',
                            borderRadius: 10,
                            padding: '10px',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#E11D48', fontWeight: 700, marginBottom: 3 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                            <span>Khiếu nại #{d.id} • Đơn #{d.orderId}</span>
                          </div>
                          <div style={{ color: '#0F172A', fontWeight: 600, marginBottom: 2 }}>
                            {d.reason}
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
                              padding: '5px',
                              borderRadius: 6,
                              background: '#E11D48',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Xử lý & Hoàn tiền ngay →
                          </button>
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 8, fontSize: '0.78rem', color: '#475569' }}>
                          <strong style={{ color: '#10B981' }}>✓ Hệ thống ổn định:</strong> Tất cả tài khoản đang cho thuê hoạt động bình thường.
                        </div>
                        <div style={{ padding: '8px 10px', background: '#FFFBEB', borderRadius: 8, fontSize: '0.78rem', color: '#B45309' }}>
                          <strong>⚠️ Cảnh báo ca thuê:</strong> Tài khoản GI_Asia_728 sắp hết hạn cần gia hạn hoặc thu hồi.
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setView('reports');
                        setShowNotifications(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#10B981',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Xem tất cả khiếu nại trong Báo cáo →
                    </button>
                  </div>
                </div>
              )}
            </div>

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
