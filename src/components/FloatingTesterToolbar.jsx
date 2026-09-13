import React, { useState } from 'react';
import { Bug, RefreshCw, PlusCircle, FastForward, UserCheck, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingTesterToolbar = () => {
  const { currentUser, switchRole, resetToDefaultData, addTestBalance, fastForwardRentalTime, rentals } = useApp();
  const [isOpen, setIsOpen] = useState(false); // Default collapsed so it doesn't obstruct view
  const [notify, setNotify] = useState('');

  const showToast = (msg) => {
    setNotify(msg);
    setTimeout(() => setNotify(''), 2500);
  };

  const activeRental = rentals.find(r => r.status === 'active');

  return (
    <div
      id="floating-tester-toolbar"
      data-testid="floating-tester-toolbar"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        background: '#FFFFFF',
        border: '1px solid var(--border-medium)',
        borderRadius: 10,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        width: 300,
        overflow: 'hidden',
        fontSize: '0.84rem'
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
          background: 'var(--bg-surface)',
          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700 }}>
          <Bug size={16} />
          <span>BTL Tester Toolbar</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.68rem', background: '#FFFFFF', border: '1px solid var(--border-subtle)', padding: '2px 5px', borderRadius: 4, color: 'var(--text-main)', fontWeight: 600 }}>
            {currentUser?.role === 'admin' ? 'ADMIN' : 'USER'}
          </span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {notify && (
        <div style={{ background: 'var(--accent-green)', color: '#FFFFFF', padding: '5px 10px', fontWeight: 600, fontSize: '0.75rem', textAlign: 'center' }}>
          {notify}
        </div>
      )}

      {/* Body tools */}
      {isOpen && (
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', marginBottom: 2 }}>
            Phím tắt phục vụ chấm điểm và chạy Test Case:
          </div>

          {/* Switch Role */}
          <button
            type="button"
            id="btn-tester-switch-role"
            data-testid="btn-tester-switch-role"
            onClick={() => {
              const nextRole = currentUser?.role === 'admin' ? 'renter' : 'admin';
              switchRole(nextRole);
              showToast(`Đã chuyển vai trò: ${nextRole === 'admin' ? 'Quản Trị Viên' : 'Khách Thuê'}`);
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            {currentUser?.role === 'admin' ? (
              <>
                <UserCheck size={14} color="var(--primary)" /> Đổi sang: <strong>Khách Thuê (User)</strong>
              </>
            ) : (
              <>
                <ShieldCheck size={14} color="var(--primary)" /> Đổi sang: <strong>Quản Trị Viên (Admin)</strong>
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
              showToast('Đã cộng +200.000 đ vào ví tester!');
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <PlusCircle size={14} color="var(--accent-green)" /> Nạp nhanh: <strong>+200.000 đ vào ví</strong>
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
                showToast('Đã tua nhanh -30 phút hạn đơn thuê!');
              }
            }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <FastForward size={14} color="var(--accent-amber)" /> Tua nhanh: <strong>-30 phút hạn thuê</strong>
          </button>

          {/* Reset toàn bộ dữ liệu mẫu */}
          <button
            type="button"
            id="btn-tester-reset-db"
            data-testid="btn-tester-reset-db"
            onClick={() => {
              if (window.confirm('Khôi phục toàn bộ tài khoản, số dư ví và đơn thuê về trạng thái mẫu ban đầu?')) {
                resetToDefaultData();
                showToast('Đã reset toàn bộ dữ liệu về mặc định!');
              }
            }}
            className="btn btn-danger"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem', marginTop: 2 }}
          >
            <RefreshCw size={14} /> <strong>Reset Data Về Gốc</strong>
          </button>
        </div>
      )}
    </div>
  );
};
