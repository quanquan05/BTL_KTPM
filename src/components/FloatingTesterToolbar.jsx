import React, { useState } from 'react';
import { RefreshCw, PlusCircle, FastForward, UserCheck, ShieldCheck, ChevronUp, ChevronDown, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from './ConfirmModal';

export const FloatingTesterToolbar = () => {
  const { currentUser, switchRole, resetToDefaultData, addTestBalance, fastForwardRentalTime, rentals, users } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notify, setNotify] = useState('');
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const showToast = (msg) => {
    setNotify(msg);
    setTimeout(() => setNotify(''), 2500);
  };

  const [selectedRentalId, setSelectedRentalId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userActiveRentals = rentals.filter(r =>
    r.status === 'active' && (currentUser?.role === 'admin' ? true : r.userId === currentUser?.id)
  );
  const selectedRental = userActiveRentals.find(r => r.id === selectedRentalId);

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
              if (nextRole === 'renter' && !users?.some(u => u.role === 'renter')) {
                showToast('Chưa có khách nào. Hãy đăng ký tài khoản khách trước!');
                return;
              }
              switchRole(nextRole);
              showToast(`Đổi sang: ${nextRole === 'admin' ? 'Quản Trị Viên (Admin)' : 'Khách Thuê'}`);
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

          {/* Tua nhanh thời gian đơn thuê (giao diện đồng nhất, đẹp mắt) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              background: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: 8,
              padding: '8px 10px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>
                <FastForward size={14} color="#D97706" />
                <span>Tua giờ ca thuê</span>
              </div>
              <span
                style={{
                  fontSize: '0.67rem',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontWeight: 700,
                  background: userActiveRentals.length > 0 ? '#ECFDF5' : '#F1F5F9',
                  color: userActiveRentals.length > 0 ? '#059669' : '#64748B'
                }}
              >
                {userActiveRentals.length > 0 ? `${userActiveRentals.length} ca đang chơi` : 'Chưa có ca'}
              </span>
            </div>

            {/* Custom Dropdown Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                id="btn-trigger-select-rental"
                data-testid="btn-trigger-select-rental"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={userActiveRentals.length === 0}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  borderRadius: 6,
                  border: isDropdownOpen ? '1px solid #3B82F6' : '1px solid var(--border-medium)',
                  background: userActiveRentals.length > 0 ? '#F8FAFC' : '#F1F5F9',
                  color: selectedRental ? '#0F172A' : '#64748B',
                  cursor: userActiveRentals.length > 0 ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  boxShadow: isDropdownOpen ? '0 0 0 2px rgba(59, 130, 246, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                  {selectedRental
                    ? `#${selectedRental.id.slice(-6)} • ${selectedRental.accountTitle || selectedRental.secretAccount}`
                    : userActiveRentals.length > 0
                    ? 'Chọn tài khoản muốn tua...'
                    : 'Không có ca thuê đang chơi'}
                </span>
                <ChevronDown
                  size={13}
                  color="#64748B"
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {/* Menu danh sách tài khoản thả nổi tinh tế */}
              {isDropdownOpen && userActiveRentals.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '110%',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 8,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    maxHeight: 180,
                    overflowY: 'auto',
                    zIndex: 10001,
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.67rem', color: '#94A3B8', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase' }}>
                    Chọn ca thuê cần tua:
                  </div>
                  {userActiveRentals.map(r => {
                    const remainingMs = Math.max(0, r.endTime - Date.now());
                    const remainingMins = Math.floor(remainingMs / 60000);
                    const hrs = Math.floor(remainingMins / 60);
                    const mins = remainingMins % 60;
                    const isSelected = r.id === selectedRentalId;

                    return (
                      <div
                        key={r.id}
                        id={`option-rental-${r.id}`}
                        data-testid={`option-rental-${r.id}`}
                        onClick={() => {
                          setSelectedRentalId(r.id);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: 6,
                          fontSize: '0.73rem',
                          cursor: 'pointer',
                          background: isSelected ? '#EFF6FF' : 'transparent',
                          border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
                          color: isSelected ? '#1D4ED8' : '#1E293B',
                          fontWeight: isSelected ? 700 : 500,
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingRight: 6 }}>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            #{r.id.slice(-6)} • {r.accountTitle || r.secretAccount}
                          </span>
                          <span style={{ fontSize: '0.66rem', color: isSelected ? '#3B82F6' : '#64748B' }}>
                            Nick: {r.secretAccount}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.67rem',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: 4,
                            background: isSelected ? '#DBEAFE' : '#F1F5F9',
                            color: isSelected ? '#1E40AF' : '#475569',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {hrs}h {mins}p
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fallback hidden select for programmatic interactions & testing */}
              <select
                id="select-rental-to-fast-forward"
                data-testid="select-rental-to-fast-forward"
                value={selectedRentalId}
                onChange={(e) => setSelectedRentalId(e.target.value)}
                style={{ display: 'none' }}
              >
                <option value="">-- Chọn tài khoản muốn tua --</option>
                {userActiveRentals.map(r => (
                  <option key={r.id} value={r.id}>
                    #{r.id.slice(-6)} • {r.accountTitle || r.secretAccount}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút bấm tua giờ đồng bộ phong cách các phím tắt */}
            <button
              type="button"
              id="btn-tester-fast-forward"
              data-testid="btn-tester-fast-forward"
              disabled={!selectedRentalId}
              onClick={() => {
                if (selectedRentalId) {
                  fastForwardRentalTime(selectedRentalId, 30);
                  const target = userActiveRentals.find(r => r.id === selectedRentalId);
                  showToast(`Đã tua -30 phút cho acc "${target?.secretAccount || selectedRentalId.slice(-6)}"!`);
                }
              }}
              className="btn btn-secondary"
              style={{
                justifyContent: 'center',
                padding: '6px 10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                opacity: selectedRentalId ? 1 : 0.45,
                cursor: selectedRentalId ? 'pointer' : 'not-allowed',
                background: selectedRentalId ? '#FEF3C7' : '#FFFFFF',
                borderColor: selectedRentalId ? '#FDE68A' : 'var(--border-medium)',
                color: selectedRentalId ? '#92400E' : 'var(--text-subtle)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedRentalId) e.currentTarget.style.backgroundColor = '#FDE68A';
              }}
              onMouseLeave={(e) => {
                if (selectedRentalId) e.currentTarget.style.backgroundColor = '#FEF3C7';
              }}
            >
              <FastForward size={13} color={selectedRentalId ? '#D97706' : 'var(--text-subtle)'} />
              <span>Tua: <strong>-30 phút hạn thuê</strong></span>
            </button>
          </div>

          {/* Reset toàn bộ dữ liệu mẫu */}
          <button
            type="button"
            id="btn-tester-reset-db"
            data-testid="btn-tester-reset-db"
            onClick={() => setIsConfirmResetOpen(true)}
            className="btn btn-danger"
            style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={14} /> <strong>Reset Dữ Liệu Về Gốc</strong>
          </button>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={() => {
          resetToDefaultData();
          showToast('Đã khôi phục dữ liệu gốc!');
        }}
        title="Khôi Phục Dữ Liệu Gốc"
        message="Bạn có chắc chắn muốn khôi phục toàn bộ danh sách tài khoản, khách hàng và số dư ví về trạng thái mẫu ban đầu không?"
        confirmText="Khôi phục ngay"
        type="danger"
      />
    </aside>
  );
};
