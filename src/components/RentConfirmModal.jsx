import React, { useState } from 'react';
import { X, Check, Copy, Key, ExternalLink, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RentConfirmModal = ({ isOpen, onClose, account, onRentSuccess, onOpenDeposit }) => {
  const { currentUser, rentAccount } = useApp();
  const [durationHours, setDurationHours] = useState(2);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [error, setError] = useState('');
  const [rentResult, setRentResult] = useState(null);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen || !account) return null;

  const hours = Number(durationHours) || 0;
  const totalPrice = account.pricePerHour * hours;
  const userBalance = currentUser?.balance || 0;
  const isEnoughBalance = userBalance >= totalPrice;

  const handleConfirmRent = (e) => {
    e.preventDefault();
    setError('');

    if (!agreedTerms) {
      setError('Bạn cần đồng ý với điều khoản cấm sử dụng hack/tool để tiếp tục.');
      return;
    }

    const res = rentAccount(account.id, hours);
    if (!res.success) {
      setError(res.error);
      return;
    }

    setRentResult(res);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" id="modal-rent-overlay" data-testid="rent-confirm-modal">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 7, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {rentResult ? 'Thuê Tài Khoản Thành Công!' : 'Xác Nhận Thuê Tài Khoản'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã acc: #{account.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-rent-modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {rentResult ? (
          <div className="modal-body" style={{ padding: '22px 20px' }}>
            <div
              style={{
                background: 'var(--accent-green-bg)',
                border: '1px solid var(--accent-green-border)',
                padding: 14,
                borderRadius: 10,
                textAlign: 'center',
                marginBottom: 18
              }}
            >
              <div style={{ display: 'inline-flex', padding: 6, borderRadius: '50%', background: 'var(--accent-green)', color: '#FFFFFF', marginBottom: 6 }}>
                <Check size={20} />
              </div>
              <h4 style={{ color: 'var(--accent-green)', fontSize: '1.05rem', fontWeight: 700 }}>Đơn thuê đã được kích hoạt!</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Thời gian thuê: <strong>{hours} Giờ</strong> | Hạn kết thúc được đếm ngược tại mục Đơn thuê.
              </p>
            </div>

            {/* Khung hiển thị thông tin đăng nhập bí mật */}
            <div
              id="revealed-credentials-box"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 18
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Thông tin đăng nhập Game:
              </span>

              {/* Tài khoản */}
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>Tài khoản / Tên đăng nhập:</span>
                  <strong id="revealed-account-name" style={{ color: 'var(--text-main)', fontSize: '0.98rem', fontFamily: 'monospace' }}>
                    {rentResult.secretAccount}
                  </strong>
                </div>
                <button
                  type="button"
                  id="btn-copy-account"
                  onClick={() => copyToClipboard(rentResult.secretAccount, 'acc')}
                  className="btn btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  {copiedAcc ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                  {copiedAcc ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>

              {/* Mật khẩu */}
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>Mật khẩu đăng nhập:</span>
                  <strong id="revealed-account-password" style={{ color: 'var(--primary)', fontSize: '0.98rem', fontFamily: 'monospace' }}>
                    {rentResult.secretPassword}
                  </strong>
                </div>
                <button
                  type="button"
                  id="btn-copy-password"
                  onClick={() => copyToClipboard(rentResult.secretPassword, 'pass')}
                  className="btn btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  {copiedPass ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                  {copiedPass ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-primary"
                id="btn-go-to-rentals"
                onClick={() => {
                  onClose();
                  if (onRentSuccess) onRentSuccess();
                }}
                style={{ flex: 1, padding: '10px' }}
              >
                <ExternalLink size={15} /> Xem Đơn Thuê & Đồng Hồ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmRent}>
            <div className="modal-body">
              {/* Thông tin tài khoản */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, background: 'var(--bg-surface)', padding: 10, borderRadius: 8 }}>
                <img
                  src={account.thumbnail}
                  alt={account.title}
                  style={{ width: 64, height: 64, borderRadius: 6, objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {account.title}
                  </h4>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span className="badge badge-rank">{account.rank}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {account.pricePerHour.toLocaleString('vi-VN')} đ/h
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  id="rent-error-msg"
                  data-testid="rent-error-msg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--accent-red-bg)',
                    border: '1px solid var(--accent-red-border)',
                    color: '#DC2626',
                    fontSize: '0.85rem',
                    marginBottom: 14
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Chọn số giờ thuê */}
              <div className="form-group">
                <label className="form-label" htmlFor="select-rent-duration" style={{ fontSize: '0.85rem' }}>
                  Thời lượng thuê tài khoản:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 8 }}>
                  {[1, 2, 4, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      id={`btn-choose-duration-${h}h`}
                      onClick={() => setDurationHours(h)}
                      style={{
                        padding: '7px 0',
                        background: hours === h ? 'var(--primary)' : '#FFFFFF',
                        border: hours === h ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                        borderRadius: 6,
                        color: hours === h ? '#FFFFFF' : 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {h} Giờ
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tùy chọn số giờ:</span>
                  <input
                    type="number"
                    id="input-rent-duration"
                    data-testid="input-rent-duration"
                    min="1"
                    max="48"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="form-input"
                    style={{ width: 80, padding: '5px 8px', textAlign: 'center', fontSize: '0.88rem' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>(Tối đa 48h)</span>
                </div>
              </div>

              {/* Bảng tính chi phí */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 14
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Chi phí thuê:</span>
                  <span>{hours}h × {account.pricePerHour.toLocaleString('vi-VN')} đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                  <span>Tổng thanh toán:</span>
                  <span id="text-total-rent-price" style={{ color: 'var(--primary)' }}>
                    {totalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border-medium)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Số dư ví hiện tại:</span>
                  <span style={{ fontWeight: 600, color: isEnoughBalance ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {userBalance.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {!isEnoughBalance && (
                  <div
                    id="warning-insufficient-balance"
                    style={{
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 6,
                      background: 'var(--accent-red-bg)',
                      color: '#DC2626',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Còn thiếu {(totalPrice - userBalance).toLocaleString('vi-VN')} đ</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="btn-rent-trigger-deposit"
                      onClick={() => {
                        onClose();
                        if (onOpenDeposit) onOpenDeposit(totalPrice - userBalance);
                      }}
                      style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                    >
                      + Nạp ngay
                    </button>
                  </div>
                )}
              </div>

              {/* Cam kết quy tắc */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  id="checkbox-rent-terms"
                  data-testid="checkbox-rent-terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  style={{ marginTop: 2, accentColor: 'var(--primary)' }}
                />
                <span>
                  Tôi cam kết <strong>không sử dụng hack/cheat/tool</strong>, không đổi thông tin tài khoản và không phá rank.
                </span>
              </label>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                id="btn-cancel-rent"
                onClick={onClose}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="btn-confirm-rent-action"
                data-testid="btn-confirm-rent-action"
                disabled={!isEnoughBalance || !agreedTerms}
              >
                <Key size={16} /> Xác Nhận Thuê ({totalPrice.toLocaleString('vi-VN')} đ)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
