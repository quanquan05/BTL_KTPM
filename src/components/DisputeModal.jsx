import React, { useState } from 'react';
import { X, AlertTriangle, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
    <div className="modal-overlay" id="modal-dispute-overlay" data-testid="dispute-modal">
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--accent-red-bg)', color: 'var(--accent-red-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Báo Lỗi & Khiếu Nại</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Đơn hàng: #{rental.id}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ display: 'inline-flex', padding: 8, borderRadius: '50%', background: 'var(--accent-green)', color: '#FFFFFF', marginBottom: 10 }}>
              <Check size={22} />
            </div>
            <h4 style={{ color: 'var(--accent-green-text)', fontSize: '1.05rem', fontWeight: 700 }}>Đã Gửi Báo Cáo Sự Cố!</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Admin sẽ đối chiếu thông tin và hoàn trả 100% tiền vào ví của bạn trong thời gian sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: '20px 24px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="select-dispute-reason" style={{ fontSize: '0.82rem' }}>
                  Lý do khiếu nại:
                </label>
                <select
                  id="select-dispute-reason"
                  data-testid="select-dispute-reason"
                  className="form-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="Sai mật khẩu đăng nhập">Sai mật khẩu đăng nhập</option>
                  <option value="Tài khoản bị dính mã 2FA / OTP">Tài khoản bị dính mã 2FA / OTP</option>
                  <option value="Tài khoản bị nhà phát hành khóa / cấm">Tài khoản bị nhà phát hành khóa / cấm</option>
                  <option value="Tài khoản không đúng rank / thiếu skin mô tả">Tài khoản không đúng rank / thiếu skin mô tả</option>
                  <option value="Có người khác đang đăng nhập song song">Có người khác đang đăng nhập song song</option>
                  <option value="Khác">Lý do khác</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="textarea-dispute-note" style={{ fontSize: '0.82rem' }}>
                  Mô tả chi tiết sự cố:
                </label>
                <textarea
                  id="textarea-dispute-note"
                  data-testid="textarea-dispute-note"
                  rows="3"
                  className="form-textarea"
                  placeholder="Mô tả cụ thể lỗi gặp phải..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: 'var(--accent-red-bg)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--accent-red-border)', fontSize: '0.76rem', color: 'var(--accent-red-text)' }}>
                Chính sách: Hệ thống cam kết hoàn 100% tiền đơn thuê nếu acc gặp lỗi thực tế.
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ fontSize: '0.86rem' }}>
                Hủy
              </button>
              <button type="submit" id="btn-submit-dispute" data-testid="btn-submit-dispute" className="btn btn-danger" style={{ fontSize: '0.86rem' }}>
                <Send size={14} /> Gửi Khiếu Nại
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
