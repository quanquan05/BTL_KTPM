import React from 'react';
import { X, AlertTriangle, LogOut, ShieldAlert } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const ReturnEarlyModal = ({ isOpen, onClose, rental, onConfirm }) => {
  if (!isOpen || !rental) return null;

  const isExpired = rental.endTime <= Date.now();

  return (
    <div
      className="modal-overlay"
      id="modal-return-early-overlay"
      data-testid="modal-return-early"
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
                background: isExpired ? '#FEF2F2' : '#FFFBEB',
                border: `1px solid ${isExpired ? '#FECDD3' : '#FDE68A'}`,
                color: isExpired ? '#DC2626' : '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isExpired ? 'Xác Nhận Thu Hồi Acc' : 'Xác Nhận Trả Acc Sớm'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Đơn thuê: <strong style={{ color: '#0F172A' }}>#{rental.id}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-return-modal"
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
              <span style={{ 
                fontSize: '0.72rem', 
                color: isExpired ? '#DC2626' : '#D97706', 
                background: isExpired ? '#FEF2F2' : '#FFFBEB', 
                border: `1px solid ${isExpired ? '#FECDD3' : '#FDE68A'}`, 
                padding: '2px 8px', 
                borderRadius: 20, 
                fontWeight: 700 
              }}>
                {isExpired ? '⚠️ Đã hết hạn thuê' : '⏳ Đang chơi'}
              </span>
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4, marginBottom: 8 }}>
              {rental.accountTitle}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px dashed #E2E8F0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Thời gian còn lại:</span>
              <CountdownTimer endTime={rental.endTime} isCompact={true} />
            </div>
          </div>

          {/* 2. Warning Notices Box */}
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECDD3',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 14
            }}
          >
            <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.86rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} /> {isExpired ? 'Lưu ý khi thu hồi tài khoản đã hết hạn:' : 'Lưu ý trước khi kết thúc ca thuê sớm:'}
            </div>
            <ul style={{ color: '#475569', fontSize: '0.82rem', paddingLeft: 18, lineHeight: 1.6, margin: 0 }}>
              <li>
                <strong>Tự động đổi mật khẩu ngẫu nhiên mới tức thì:</strong> Hệ thống sẽ kết thúc ca thuê và tự động sinh mật khẩu ngẫu nhiên mới bảo mật cao, cập nhật vào kho để sẵn sàng cho lượt thuê tiếp theo.
              </li>
              {!isExpired && (
                <li>
                  <strong>Không hoàn lại tiền thời gian dư:</strong> Thời gian còn lại trong ca thuê sẽ bị hủy bỏ khi bạn tự ý trả sớm.
                </li>
              )}
            </ul>
          </div>

          {/* 3. Tip note for issues */}
          {!isExpired && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: '0.8rem',
                color: '#047857',
                background: '#ECFDF5',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #A7F3D0'
              }}
            >
              <ShieldAlert size={16} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Nếu tài khoản gặp lỗi sai pass hoặc dính mã 2FA, vui lòng bấm <strong>&quot;Báo Lỗi&quot;</strong> thay vì trả sớm để được hỗ trợ kiểm tra và hoàn tiền ví 100%.
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
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
            id="btn-cancel-return-early"
            data-testid="btn-cancel-return-early"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            {isExpired ? 'Hủy Bỏ' : 'Giữ Ca Thuê & Chơi Tiếp'}
          </button>
          <button
            type="button"
            id="btn-confirm-return-early"
            data-testid="btn-confirm-return-early"
            onClick={() => {
              onConfirm(rental.id);
              onClose();
            }}
            className="btn btn-danger"
            style={{
              padding: '8px 18px',
              fontSize: '0.86rem',
              background: '#DC2626',
              color: '#FFFFFF',
              borderColor: '#DC2626',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.28)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <LogOut size={15} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{isExpired ? 'Xác Nhận Thu Hồi Acc' : 'Xác Nhận Trả Acc'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
