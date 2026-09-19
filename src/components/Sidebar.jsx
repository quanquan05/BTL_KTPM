import React from 'react';
import {
  LayoutDashboard,
  Store,
  Clock,
  Wallet,
  Users,
  BarChart3,
  FileText,
  Settings,
  Gamepad2
} from 'lucide-react';

import { useApp } from '../context/AppContext';

export const Sidebar = ({ currentView, setView, isOpen = true }) => {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Menu dành riêng cho Admin và Khách thuê
  const adminMenuItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'home', label: 'Cửa hàng thuê', icon: Store },
    { id: 'my-rentals', label: 'Quản lý đơn thuê', icon: Clock },
    { id: 'wallet', label: 'Ví & Nạp tiền', icon: Wallet },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'revenue', label: 'Doanh thu', icon: BarChart3 },
    { id: 'reports', label: 'Báo cáo', icon: FileText },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const renterMenuItems = [
    { id: 'home', label: 'Cửa hàng thuê', icon: Store },
    { id: 'my-rentals', label: 'Đơn của tôi', icon: Clock },
    { id: 'wallet', label: 'Ví & Nạp tiền', icon: Wallet },
  ];

  const menuItems = isAdmin ? adminMenuItems : renterMenuItems;

  return (
    <aside
      className="app-sidebar"
      id="app-sidebar"
      data-testid="app-sidebar"
      style={{
        display: isOpen ? 'flex' : 'none',
      }}
    >
      {/* Brand Header */}
      <div
        className="sidebar-header"
        onClick={() => setView(isAdmin ? 'overview' : 'home')}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        id="sidebar-logo"
        data-testid="sidebar-logo"
      >
        <div className="sidebar-logo-icon">
          <Gamepad2 size={22} strokeWidth={2.2} />
        </div>
        <div>
          <div className="sidebar-brand-name">GameRent</div>
          <div className="sidebar-brand-sub">Thuê tài khoản game</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`sidebar-link-${item.id}`}
              data-testid={`sidebar-link-${item.id}`}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.3 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Version Tag */}
      <div className="sidebar-version">v1.0.0</div>
    </aside>
  );
};
