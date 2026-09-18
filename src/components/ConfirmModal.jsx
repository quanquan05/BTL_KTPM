import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, LogOut, RotateCcw, X, ShieldAlert } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận thao tác',
  message = 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
  subMessage = null,
  confirmText = 'Xác Nhận',
  cancelText = 'Hủy Bỏ',
  type = 'danger', // 'danger' | 'warning' | 'primary'
  icon = null
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  const themeColors = {
    danger: {
      bg: '#FEF2F2',
      border: '#FECDD3',
      color: '#DC2626',
      btnBg: '#DC2626',
      btnHover: '#B91C1C',
      shadow: 'rgba(220, 38, 38, 0.28)'
    },
    warning: {
      bg: '#FFFBEB',
      border: '#FDE68A',
      color: '#D97706',
      btnBg: '#D97706',
      btnHover: '#B45309',
      shadow: 'rgba(217, 119, 6, 0.28)'
    },
    primary: {
      bg: '#ECFDF5',
      border: '#A7F3D0',
      color: '#059669',
      btnBg: 'var(--primary)',
      btnHover: 'var(--primary-hover)',
      shadow: 'rgba(16, 185, 129, 0.28)'
    }
  };

  const currentTheme = themeColors[type] || themeColors.danger;

  const getDefaultIcon = () => {
    if (icon) return icon;
    if (isDanger) return <Trash2 size={20} strokeWidth={2.4} />;
    if (isWarning) return <AlertTriangle size={20} strokeWidth={2.4} />;
    return <ShieldAlert size={20} strokeWidth={2.4} />;
  };

  return (
    <div
      className="modal-overlay"
      id="modal-confirm-overlay"
      data-testid="modal-confirm-dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        zIndex: 1100,
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
          maxWidth: 440,
          width: '92%',
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
            background: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: currentTheme.bg,
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {getDefaultIcon()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                {title}
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Hệ thống xác nhận bảo mật GameRent
              </span>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-confirm-modal"
            data-testid="btn-close-confirm-modal"
            onClick={onClose}
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
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px' }}>
          <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
            {message}
          </p>

          {subMessage && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 10,
                background: currentTheme.bg,
                border: `1px solid ${currentTheme.border}`,
                fontSize: '0.8rem',
                color: currentTheme.color,
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{subMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            background: '#F8FAFC'
          }}
        >
          <button
            type="button"
            id="btn-cancel-action"
            data-testid="btn-cancel-action"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            id="btn-confirm-action"
            data-testid="btn-confirm-action"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: currentTheme.btnBg,
              borderColor: currentTheme.btnBg,
              color: '#FFFFFF',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 2px 8px ${currentTheme.shadow}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
