import React, { useState } from 'react';
import { RefreshCw, PlusCircle, FastForward, UserCheck, ShieldCheck, ChevronUp, ChevronDown, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingTesterToolbar = () => {
  const { currentUser, switchRole, resetToDefaultData, addTestBalance, fastForwardRentalTime, rentals } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notify, setNotify] = useState('');

  const showToast = (msg) => {
    setNotify(msg);
    setTimeout(() => setNotify(''), 2500);
  };

  const activeRental = rentals.find(r => r.status === 'active');

  return (
    <aside
      id="floating-tester-toolbar"
      data-testid="floating-tester-toolbar"
      aria-label="Thanh công cụ kiểm thử BTL"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        background: '#FFFFFF',
        border: '1px solid var(--border-medium)',
        borderRadius: 12,
        boxShadow: 'var(--shadow-lg)',
        width: 280,
        overflow: 'hidden',
        fontSize: '0.82rem'
      }}
    >
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: '#FFFFFF',
          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700 }}>
          <Wrench size={15} />
          <span>BTL Tester Tools</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.66rem', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-main)', fontWeight: 700 }}>
            {currentUser?.role === 'admin' ? 'ADMIN' : 'USER'}
          </span>
          {isOpen ? <ChevronDown size={14} color="var(--text-subtle)" /> : <ChevronUp size={14} color="var(--text-subtle)" />}
        </div>
      </div>

      {notify && (
        <div style={{ background: 'var(--accent-green)', color: '#FFFFFF', padding: '4px 10px', fontWeight: 600, fontSize: '0.74rem', textAlign: 'center' }}>
          {notify}
        </div>
      )}

      {/* Body tools */}
      {isOpen && (
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: 2 }}>
            Phím tắt kiểm thử nhanh:
          </div>

          {/* Switch Role */}
          <button
            type="button"
            id="btn-tester-switch-role"
            data-testid="btn-tester-switch-role"
            onClick={() => {
              const nextRole = currentUser?.role === 'admin' ? 'renter' : 'admin';
              switchRole(nextRole);
              showToast(`Đổi sang: ${nextRole === 'admin' ? 'Quản Trị Viên' : 'Khách Thuê'}`);
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            {currentUser?.role === 'admin' ? (
              <>
                <UserCheck size={14} color="var(--primary)" /> Sang vai trò: <strong>Khách Thuê</strong>
              </>
            ) : (
              <>
                <ShieldCheck size={14} color="var(--primary)" /> Sang vai trò: <strong>Admin</strong>
              </>
            )}
          </button>

          {/* Nạp nhanh 200k */}
          <button
            type="button"
            id="btn-tester-quick-deposit"
            data-testid="btn-tester-quick-deposit"
            onClick={() => {
              addTestBalance(200000);
              showToast('Đã cộng +200.000 đ vào ví!');
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <PlusCircle size={14} color="var(--accent-green-text)" /> Nạp nhanh: <strong>+200.000 đ</strong>
          </button>

          {/* Tua nhanh thời gian đơn thuê */}
          <button
            type="button"
            id="btn-tester-fast-forward"
            data-testid="btn-tester-fast-forward"
            disabled={!activeRental}
            onClick={() => {
              if (activeRental) {
                fastForwardRentalTime(activeRental.id, 30);
                showToast('Đã tua nhanh -30 phút!');
              }
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <FastForward size={14} color="var(--accent-amber-text)" /> Tua giờ: <strong>-30 phút hạn thuê</strong>
          </button>

          {/* Reset toàn bộ dữ liệu mẫu */}
          <button
            type="button"
            id="btn-tester-reset-db"
            data-testid="btn-tester-reset-db"
            onClick={() => {
              if (window.confirm('Khôi phục toàn bộ tài khoản và số dư ví về mặc định?')) {
                resetToDefaultData();
                showToast('Đã khôi phục dữ liệu gốc!');
              }
            }}
            className="btn btn-danger"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={14} /> <strong>Reset Dữ Liệu Về Gốc</strong>
          </button>
        </div>
      )}
    </aside>
  );
};
