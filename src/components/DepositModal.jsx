import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Check, AlertCircle, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DepositModal = ({ isOpen, onClose, initialAmount = 50000 }) => {
  const { deposit, currentUser } = useApp();
  const [amount, setAmount] = useState(initialAmount);
  const [method, setMethod] = useState('VietQR Auto');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSimulatingQR, setIsSimulatingQR] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [20000, 50000, 100000, 200000, 500000, 1000000];

  const handleStep = (delta) => {
    setError('');
    setAmount((prev) => {
      const current = Number(prev) || 0;
      const next = Math.max(10000, Math.min(5000000, current + delta));
      return next;
    });
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const res = deposit(amount, method);
    if (!res.success) {
      setError(res.error);
      return;
    }

    setIsSimulatingQR(true);
    setTimeout(() => {
      setSuccessMsg(`Nạp thành công ${Number(amount).toLocaleString('vi-VN')} đ vào ví!`);
      setTimeout(() => {
        setIsSimulatingQR(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="modal-overlay" id="modal-deposit-overlay" data-testid="deposit-modal">
      <div className="modal-card" style={{ maxWidth: 480 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Nạp Tiền Vào Ví</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                Số dư hiện tại: <strong style={{ color: 'var(--primary)' }}>{currentUser?.balance?.toLocaleString('vi-VN')} đ</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-deposit-modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {isSimulatingQR ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: 16,
                background: successMsg ? '#F0FDF4' : '#FFFFFF',
                borderRadius: 14,
                border: successMsg ? '1.5px solid #86EFAC' : '1px solid var(--border-subtle)',
                boxShadow: successMsg ? '0 8px 24px rgba(16, 185, 129, 0.18)' : 'var(--shadow-sm)',
                marginBottom: 16,
                transition: 'all 0.3s ease'
              }}
            >
              {successMsg ? (
                /* Tích V màu trắng tròn xanh thay cho cái mã */
                <div
                  style={{
                    width: 140,
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    id="deposit-success-check-circle"
                    data-testid="deposit-success-check-circle"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.38)',
                      animation: 'scaleBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Check size={48} color="#FFFFFF" strokeWidth={3.5} />
                  </div>
                </div>
              ) : (
                /* Giả lập QR Code ban đầu */
                <div
                  style={{
                    width: 140,
                    height: 140,
                    background: 'repeating-linear-gradient(45deg, #0f172a, #0f172a 8px, #ffffff 8px, #ffffff 16px)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ background: 'var(--primary)', padding: '5px 10px', borderRadius: 6, color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem' }}>
                    VietQR Pay
                  </div>
                </div>
              )}
            </div>

            {successMsg ? (
              <div id="deposit-success-alert" style={{ color: '#047857', fontWeight: 700, fontSize: '1rem', marginTop: 4 }}>
                <Check size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {successMsg}
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Hệ thống đang kiểm tra thanh toán...</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Số tiền nạp: <strong style={{ color: 'var(--primary)' }}>{Number(amount).toLocaleString('vi-VN')} đ</strong>
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleDepositSubmit}>
            <div className="modal-body" style={{ padding: '20px 24px' }}>
              {error && (
                <div
                  id="deposit-error-msg"
                  data-testid="deposit-error-msg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--accent-red-bg)',
                    border: '1px solid var(--accent-red-border)',
                    color: 'var(--accent-red-text)',
                    fontSize: '0.84rem',
                    marginBottom: 14
                  }}
                >
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Input */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" htmlFor="input-deposit-amount" style={{ margin: 0, fontSize: '0.84rem' }}>
                    Số tiền cần nạp (VNĐ) <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  {Number(amount) > 0 && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {Number(amount).toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>

                {/* Amount stepper */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    id="btn-decrease-deposit"
                    data-testid="btn-decrease-deposit"
                    title="Giảm 10.000 đ"
                    onClick={() => handleStep(-10000)}
                    disabled={Number(amount) <= 10000}
                    style={{
                      padding: '0 12px',
                      background: 'var(--bg-surface)',
                      border: 'none',
                      borderRight: '1px solid var(--border-subtle)',
                      color: Number(amount) <= 10000 ? 'var(--text-subtle)' : 'var(--text-main)',
                      cursor: Number(amount) <= 10000 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    <Minus size={14} /> -10k
                  </button>

                  <input
                    type="number"
                    id="input-deposit-amount"
                    data-testid="input-deposit-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    step="1000"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      padding: '8px 12px',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      textAlign: 'center'
                    }}
                  />

                  <button
                    type="button"
                    id="btn-increase-deposit"
                    data-testid="btn-increase-deposit"
                    title="Tăng 10.000 đ"
                    onClick={() => handleStep(10000)}
                    disabled={Number(amount) >= 5000000}
                    style={{
                      padding: '0 12px',
                      background: 'var(--bg-surface)',
                      border: 'none',
                      borderLeft: '1px solid var(--border-subtle)',
                      color: Number(amount) >= 5000000 ? 'var(--text-subtle)' : 'var(--text-main)',
                      cursor: Number(amount) >= 5000000 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    +10k <Plus size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    Hạn mức: 10.000 đ - 5.000.000 đ
                  </span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Chọn nhanh mệnh giá:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      id={`btn-quick-amount-${q}`}
                      onClick={() => setAmount(q)}
                      className={`quick-chip ${Number(amount) === q ? 'active' : ''}`}
                      style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                    >
                      +{q.toLocaleString('vi-VN')} đ
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>Phương thức nạp tiền:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { id: 'VietQR Auto', title: 'VietQR Chuyển Khoản Tự Động 24/7 (Khuyên Dùng)' },
                    { id: 'MoMo Auto', title: 'Ví Điện Tử MoMo' },
                    { id: 'ATM Domestic', title: 'Thẻ ATM Nội Địa / Internet Banking' }
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        background: method === pm.id ? 'var(--primary-light)' : '#FFFFFF',
                        border: method === pm.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={method === pm.id}
                        onChange={(e) => setMethod(e.target.value)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.84rem', fontWeight: method === pm.id ? 700 : 500, color: 'var(--text-main)' }}>
                        {pm.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                id="btn-cancel-deposit"
                onClick={onClose}
                style={{ fontSize: '0.86rem' }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="btn-confirm-deposit"
                data-testid="btn-confirm-deposit"
                style={{ fontSize: '0.86rem' }}
              >
                <ShieldCheck size={16} /> Xác Nhận Nạp Tiền
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
