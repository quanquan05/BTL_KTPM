import React from 'react';
import { X, AlertTriangle, LogOut, ShieldAlert } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const ReturnEarlyModal = ({ isOpen, onClose, rental, onConfirm }) => {
  if (!isOpen || !rental) return null;

  return (
    <div
      className="modal-overlay"
      id="modal-return-early-overlay"
      data-testid="modal-return-early"
      style={{ zIndex: 1000 }}
    >
      <div className="modal-card" style={{ maxWidth: 480 }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                background: 'var(--accent-red-bg)',
                color: '#F87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Xác Nhận Trả Acc Sớm
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Đơn thuê: <strong style={{ color: 'var(--text-main)' }}>#{rental.id}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-return-modal"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '18px 22px' }}>
          {/* Account Snapshot */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 12,
              marginBottom: 16
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tài khoản đang thuê
            </span>
            <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 2, lineHeight: 1.4 }}>
              {rental.accountTitle}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thời gian còn lại:</span>
              <CountdownTimer endTime={rental.endTime} isCompact={true} />
            </div>
          </div>

          {/* Warning Notices Box */}
          <div
            style={{
              background: 'var(--accent-red-bg)',
              border: '1px solid var(--accent-red-border)',
              borderRadius: 10,
              padding: 14,
              marginBottom: 14
            }}
          >
            <div style={{ color: '#F87171', fontWeight: 600, fontSize: '0.86rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} /> Lưu ý trước khi kết thúc ca:
            </div>
            <ul style={{ color: 'var(--text-muted)', fontSize: '0.82rem', paddingLeft: 18, lineHeight: 1.6, margin: 0 }}>
              <li>
                <strong>Thu hồi mật khẩu tức thì</strong>: Hệ thống sẽ khóa thông tin đăng nhập ngay sau khi bạn xác nhận.
              </li>
              <li>
                <strong>Không hoàn lại tiền còn dư</strong>: Thời gian chưa sử dụng trong ca này sẽ bị hủy bỏ khi bạn tự ý trả sớm.
              </li>
            </ul>
          </div>

          {/* Tip Note for issues */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: '0.8rem',
              color: 'var(--text-subtle)',
              background: 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)'
            }}
          >
            <ShieldAlert size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Nếu tài khoản gặp lỗi sai pass hoặc dính 2FA, vui lòng bấm <strong>"Báo Sự Cố"</strong> thay vì trả sớm để được hỗ trợ hoàn tiền ví 100%.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ gap: 8 }}>
          <button
            type="button"
            id="btn-cancel-return-early"
            data-testid="btn-cancel-return-early"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.86rem' }}
          >
            Giữ Ca Thuê & Chơi Tiếp
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
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.86rem' }}
          >
            <LogOut size={15} /> Xác Nhận Trả Acc
          </button>
        </div>
      </div>
    </div>
  );
};
