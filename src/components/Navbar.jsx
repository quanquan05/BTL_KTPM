import React from 'react';
import { Gamepad2, Wallet, Clock, LogIn, LogOut, Plus, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ currentView, setView, onOpenDeposit, onOpenAuth }) => {
  const { currentUser, logout, rentals } = useApp();

  const activeRentalsCount = rentals.filter(r => r.status === 'active').length;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <div
          onClick={() => setView('home')}
          id="nav-logo"
          data-testid="nav-logo"
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
            }}
          >
            <Gamepad2 size={22} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              GAME<span style={{ color: 'var(--primary)' }}>RENT</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.66rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Hệ Thống Thuê Acc Tự Động
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setView('home')}
            id="nav-link-home"
            data-testid="nav-link-home"
            className={`btn ${currentView === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 15px', fontSize: '0.88rem' }}
          >
            Trang Chủ
          </button>

          <button
            onClick={() => setView('my-rentals')}
            id="nav-link-rentals"
            data-testid="nav-link-rentals"
            className={`btn ${currentView === 'my-rentals' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 15px', fontSize: '0.88rem', position: 'relative' }}
          >
            <Clock size={16} />
            Đơn Thuê
            {activeRentalsCount > 0 && (
              <span
                id="badge-active-rentals-count"
                style={{
                  background: 'var(--accent-red)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 8,
                  marginLeft: 4
                }}
              >
                {activeRentalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('wallet')}
            id="nav-link-wallet"
            data-testid="nav-link-wallet"
            className={`btn ${currentView === 'wallet' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 15px', fontSize: '0.88rem' }}
          >
            <Wallet size={16} />
            Lịch Sử Ví
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setView('admin')}
              id="nav-link-admin"
              data-testid="nav-link-admin"
              className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '7px 15px',
                fontSize: '0.88rem',
                border: currentView === 'admin' ? 'none' : '1px solid var(--border-medium)',
                color: currentView === 'admin' ? '#FFFFFF' : 'var(--text-main)'
              }}
            >
              <LayoutDashboard size={16} />
              Quản Trị Admin
            </button>
          )}
        </nav>

        {/* Right Section: Balance & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {currentUser ? (
            <>
              {/* Balance Box */}
              <div
                id="user-balance-box"
                data-testid="user-balance-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Số dư ví</span>
                  <span
                    id="user-balance-display"
                    data-testid="user-balance-display"
                    style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}
                  >
                    {currentUser.balance?.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-nav-deposit"
                  data-testid="btn-nav-deposit"
                  onClick={onOpenDeposit}
                  title="Nạp thêm tiền vào ví"
                  style={{
                    background: 'var(--primary)',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)'; }}
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* User Avatar & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-medium)', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: currentUser.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Khách Thuê'}
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-logout"
                  data-testid="btn-logout"
                  onClick={logout}
                  title="Đăng xuất"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 5,
                    marginLeft: 2
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <LogOut size={17} />
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              id="btn-nav-login"
              data-testid="btn-nav-login"
              onClick={onOpenAuth}
              className="btn btn-primary"
            >
              <LogIn size={16} /> Đăng Nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
