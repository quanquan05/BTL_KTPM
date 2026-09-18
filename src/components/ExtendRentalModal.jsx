import React, { useState } from 'react';
import { X, Clock, CheckCircle, Wallet, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from './CountdownTimer';

export const ExtendRentalModal = ({ isOpen, onClose, rental, onOpenDeposit, onExtendSuccess }) => {
  const { currentUser, extendRental } = useApp();
  const [extendHours, setExtendHours] = useState(1);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !rental) return null;

  const cost = rental.pricePerHour * extendHours;
  const userBalance = currentUser?.balance || 0;
  const hasEnoughBalance = userBalance >= cost;
  const missingAmount = Math.max(0, cost - userBalance);

  const baseTime = Math.max(rental.endTime, Date.now());
  const newEndTimeDate = new Date(baseTime + (extendHours * 60 * 60 * 1000));
  const formattedTime = newEndTimeDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = newEndTimeDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

  const handleConfirm = () => {
    setError('');
    const res = extendRental(rental.id, extendHours);
    if (!res.success) {
      setError(res.error);
    } else {
      setIsSuccess(true);
      if (onExtendSuccess) {
        onExtendSuccess(`Đã gia hạn thành công thêm ${extendHours} giờ cho đơn #${rental.id}!`);
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modal-extend-overlay"
      data-testid="modal-extend"
      style={{
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <div
        className="modal-card"
        style={{
          maxWidth: 490,
          width: '92%',
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E2E8F0',
            background: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Gia Hạn Thêm Giờ Chơi
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Đơn thuê: <strong style={{ color: '#0F172A' }}>#{rental.id}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-extend-modal"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '36px 24px' }}>
            <div style={{ display: 'inline-flex', padding: 10, borderRadius: '50%', background: '#10B981', color: '#FFFFFF', marginBottom: 12 }}>
              <Check size={28} strokeWidth={3} />
            </div>
            <h4 style={{ color: '#065F46', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0' }}>
              Gia Hạn Thành Công!
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
              Đã cộng thêm <strong>{extendHours} giờ</strong> vào tài khoản. Chúc bạn chơi game vui vẻ!
            </p>
          </div>
        ) : (
          <div style={{ padding: '20px 22px' }}>
            {/* 1. Account Snapshot (Đồng nhất ở cả 3 Modal) */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  Tài khoản đang thuê
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                  ⚡ Cộng giờ tức thì
                </span>
              </div>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, marginBottom: 8 }}>
                {rental.accountTitle}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px dashed #E2E8F0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Thời gian còn lại hiện tại:</span>
                <CountdownTimer endTime={rental.endTime} isCompact={true} />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: '#FEF2F2',
                  border: '1px solid #FECDD3',
                  color: '#DC2626',
                  fontSize: '0.82rem',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* 2. Choose Hours (Quick Chips) */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Chọn gói giờ muốn gia hạn:
                </label>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>
                  Đơn giá: <strong>{rental.pricePerHour.toLocaleString('vi-VN')} đ</strong>/h
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[1, 2, 4, 8].map((h) => {
                  const isSelected = extendHours === h;
                  const chipPrice = rental.pricePerHour * h;
                  return (
                    <button
                      key={h}
                      type="button"
                      id={`btn-modal-chip-extend-${h}h`}
                      onClick={() => setExtendHours(h)}
                      style={{
                        border: isSelected ? '2px solid #059669' : '1px solid #CBD5E1',
                        background: isSelected ? '#ECFDF5' : '#FFFFFF',
                        borderRadius: 10,
                        padding: '10px 4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.2)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: isSelected ? '#065F46' : '#1E293B' }}>
                        +{h} Giờ
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#059669' : '#64748B' }}>
                        {chipPrice.toLocaleString('vi-VN')} đ
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Summary Calculation Box */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 14,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Hạn mới dự kiến:</span>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Clock size={12} color="#059669" />
                  {formattedTime} ({formattedDate})
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Số dư ví hiện tại:</span>
                <strong style={{ fontSize: '0.82rem', color: hasEnoughBalance ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Wallet size={12} color={hasEnoughBalance ? '#059669' : '#DC2626'} />
                  {userBalance.toLocaleString('vi-VN')} đ
                </strong>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Cần thanh toán:</span>
                <strong style={{ fontSize: '1.05rem', color: '#059669', fontWeight: 800, display: 'block', marginTop: 1 }}>
                  {cost.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            </div>

            {/* 4. Insufficient Balance Warning */}
            {!hasEnoughBalance && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECDD3',
                  borderRadius: 8,
                  padding: '9px 12px',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  fontSize: '0.78rem',
                  color: '#B91C1C'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={15} color="#DC2626" />
                  <span>Ví không đủ tiền (thiếu <strong>{missingAmount.toLocaleString('vi-VN')} đ</strong>).</span>
                </div>
                {onOpenDeposit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDeposit();
                    }}
                    style={{
                      background: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Nạp Tiền Ngay
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        {!isSuccess && (
          <div
            className="modal-footer"
            style={{
              padding: '14px 22px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              background: '#F8FAFC'
            }}
          >
            <button
              type="button"
              id="btn-cancel-extend"
              data-testid="btn-cancel-extend"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              id={`btn-confirm-extend-${rental.id}`}
              data-testid={`btn-confirm-extend-${rental.id}`}
              onClick={handleConfirm}
              disabled={!hasEnoughBalance}
              className="btn btn-primary"
              style={{
                padding: '8px 20px',
                fontSize: '0.86rem',
                background: hasEnoughBalance ? '#059669' : '#94A3B8',
                borderColor: hasEnoughBalance ? '#059669' : '#94A3B8',
                boxShadow: hasEnoughBalance ? '0 2px 8px rgba(5, 150, 105, 0.28)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <CheckCircle size={15} />
              <span>Xác Nhận Gia Hạn (+{extendHours} Giờ)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
