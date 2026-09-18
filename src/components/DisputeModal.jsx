import React, { useState } from 'react';
import { X, AlertTriangle, Send, Check, ShieldAlert, ShieldCheck, Key, Lock, Ban, Award, Users, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from './CountdownTimer';

const DISPUTE_REASONS = [
  { id: 'pass', label: 'Sai mật khẩu đăng nhập', icon: Key, desc: 'Mật khẩu sai hoặc đã bị đổi trước đó' },
  { id: '2fa', label: 'Tài khoản bị dính mã 2FA / OTP', icon: Lock, desc: 'Yêu cầu mã xác thực gửi về SĐT/Email lạ' },
  { id: 'ban', label: 'Tài khoản bị cấm / khóa', icon: Ban, desc: 'Game báo acc bị đình chỉ hoặc vi phạm' },
  { id: 'rank', label: 'Sai rank / thiếu skin mô tả', icon: Award, desc: 'Thông tin in-game không đúng như cửa hàng ghi' },
  { id: 'conflict', label: 'Có người khác đăng nhập song song', icon: Users, desc: 'Bị đá văng khi đang chơi game' },
  { id: 'other', label: 'Lý do khác', icon: HelpCircle, desc: 'Sự cố phát sinh khác cần hỗ trợ' }
];

export const DisputeModal = ({ isOpen, onClose, rental }) => {
  const { fileDispute } = useApp();
  const [reason, setReason] = useState('Sai mật khẩu đăng nhập');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !rental) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    fileDispute(rental.id, reason, note);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="modal-overlay"
      id="modal-dispute-overlay"
      data-testid="dispute-modal"
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
          maxWidth: 520,
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
                background: '#FEF2F2',
                border: '1px solid #FECDD3',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Báo Lỗi & Khiếu Nại Sự Cố
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Đơn thuê: <strong style={{ color: '#0F172A' }}>#{rental.id}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-dispute-modal"
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
              Đã Gửi Báo Cáo Sự Cố Thành Công!
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Bộ phận Chăm sóc khách hàng sẽ kiểm tra và hoàn trả 100% tiền đơn thuê vào ví của bạn trong vòng ít phút.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ padding: '20px 22px', maxHeight: '72vh', overflowY: 'auto' }}>
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
                    Tài khoản gặp sự cố
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECDD3', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                    🛡️ Bảo hiểm hoàn tiền 100%
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

              {/* 2. Reason Selection Grid (Thay thế thẻ select thô cứng) */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
                  Chọn lý do bạn gặp sự cố:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {DISPUTE_REASONS.map((r) => {
                    const isSelected = reason === r.label;
                    const IconComponent = r.icon;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setReason(r.label)}
                        style={{
                          border: isSelected ? '2px solid #DC2626' : '1px solid #CBD5E1',
                          background: isSelected ? '#FEF2F2' : '#FFFFFF',
                          borderRadius: 10,
                          padding: '10px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(220, 38, 38, 0.16)' : 'none'
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: isSelected ? '#DC2626' : '#F1F5F9',
                            color: isSelected ? '#FFFFFF' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1
                          }}
                        >
                          <IconComponent size={15} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#991B1B' : '#1E293B', lineHeight: 1.3 }}>
                            {r.label}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 2, lineHeight: 1.2 }}>
                            {r.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hidden select for fallback / form integrity */}
              <select
                id="select-dispute-reason"
                data-testid="select-dispute-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ display: 'none' }}
              >
                {DISPUTE_REASONS.map((r) => (
                  <option key={r.id} value={r.label}>{r.label}</option>
                ))}
              </select>

              {/* 3. Detailed Note Textarea */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label htmlFor="textarea-dispute-note" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Mô tả chi tiết sự cố:
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                    {note.length}/300 ký tự
                  </span>
                </div>
                <textarea
                  id="textarea-dispute-note"
                  data-testid="textarea-dispute-note"
                  rows="3"
                  maxLength={300}
                  placeholder="Ví dụ: Đăng nhập vào báo sai mật khẩu từ phút thứ 5, có ảnh chụp màn hình gửi qua Zalo..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.84rem',
                    fontFamily: 'inherit',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#DC2626')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  required
                />
              </div>

              {/* 4. Policy Guarantee Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  fontSize: '0.78rem',
                  color: '#065F46',
                  background: '#ECFDF5',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #A7F3D0'
                }}
              >
                <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Chính sách Bảo đảm:</strong> Gamerent cam kết hoàn 100% tiền đơn thuê vào ví của bạn nếu tài khoản gặp lỗi thực tế.
                </span>
              </div>
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
                className="btn btn-secondary"
                onClick={onClose}
                style={{ padding: '8px 16px', fontSize: '0.86rem' }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                id="btn-submit-dispute"
                data-testid="btn-submit-dispute"
                className="btn btn-danger"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.86rem',
                  background: '#DC2626',
                  borderColor: '#DC2626',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.28)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Send size={15} />
                <span>Gửi Khiếu Nại Ngay</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
