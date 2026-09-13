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
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 7, borderRadius: 8, background: 'var(--accent-red-bg)', color: '#F87171' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Báo Cáo Sự Cố & Khiếu Nại</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Đơn hàng: #{rental.id}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '26px 20px' }}>
            <div style={{ display: 'inline-flex', padding: 8, borderRadius: '50%', background: 'var(--accent-green)', color: '#FFFFFF', marginBottom: 10 }}>
              <Check size={24} />
            </div>
            <h4 style={{ color: 'var(--accent-green)', fontSize: '1.1rem', fontWeight: 700 }}>Gửi Khiếu Nại Thành Công!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Hệ thống sẽ kiểm tra log đăng nhập và hoàn tiền ví cho bạn trong ít phút nếu phát hiện lỗi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="select-dispute-reason" style={{ fontSize: '0.85rem' }}>
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
                <label className="form-label" htmlFor="textarea-dispute-note" style={{ fontSize: '0.85rem' }}>
                  Mô tả chi tiết sự cố gặp phải:
                </label>
                <textarea
                  id="textarea-dispute-note"
                  data-testid="textarea-dispute-note"
                  rows="3"
                  className="form-textarea"
                  placeholder="Vui lòng nêu rõ tình trạng để Admin hỗ trợ hoàn tiền nhanh nhất..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: 'var(--accent-red-bg)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-red-border)', fontSize: '0.78rem', color: '#F87171' }}>
                Lưu ý: Hành vi cố tình vu khống hoặc spam khiếu nại sai sự thật sẽ bị khóa vĩnh viễn tài khoản ví.
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" id="btn-submit-dispute" data-testid="btn-submit-dispute" className="btn btn-danger">
                <Send size={15} /> Gửi Khiếu Nại
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
