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
      }, 1500);
    }, 1200);
  };

  return (
    <div className="modal-overlay" id="modal-deposit-overlay" data-testid="deposit-modal">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 7, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Nạp Tiền Vào Ví</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Số dư hiện tại: <strong style={{ color: 'var(--primary)' }}>{currentUser?.balance?.toLocaleString('vi-VN')} đ</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-deposit-modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {isSimulatingQR ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '26px 20px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: 14,
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: 16
              }}
            >
              {/* Giả lập QR Code */}
              <div
                style={{
                  width: 150,
                  height: 150,
                  background: 'repeating-linear-gradient(45deg, #0f172a, #0f172a 10px, #ffffff 10px, #ffffff 20px)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ background: 'var(--primary)', padding: '6px 12px', borderRadius: 6, color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem' }}>
                  VietQR Pay
                </div>
              </div>
            </div>

            {successMsg ? (
              <div id="deposit-success-alert" style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '1rem', marginTop: 10 }}>
                <Check size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                {successMsg}
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>Đang xác thực giao dịch tự động...</p>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Số tiền: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Number(amount).toLocaleString('vi-VN')} đ</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleDepositSubmit}>
            <div className="modal-body">
              {error && (
                <div
                  id="deposit-error-msg"
                  data-testid="deposit-error-msg"
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

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="form-label" htmlFor="input-deposit-amount" style={{ margin: 0, fontSize: '0.85rem' }}>
                    Số tiền muốn nạp (VNĐ) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  {Number(amount) > 0 && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                      = {Number(amount).toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>

                {/* Bộ điều khiển tăng giảm số tiền */}
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
                  {/* Nút giảm 10.000 đ */}
                  <button
                    type="button"
                    id="btn-decrease-deposit"
                    data-testid="btn-decrease-deposit"
                    title="Giảm 10.000 đ"
                    onClick={() => handleStep(-10000)}
                    disabled={Number(amount) <= 10000}
                    style={{
                      padding: '0 14px',
                      background: 'var(--bg-surface)',
                      border: 'none',
                      borderRight: '1px solid var(--border-subtle)',
                      color: Number(amount) <= 10000 ? 'var(--text-subtle)' : 'var(--text-main)',
                      cursor: Number(amount) <= 10000 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <Minus size={15} />
                    <span>-10k</span>
                  </button>

                  {/* Ô nhập số tiền trực tiếp */}
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
                      padding: '10px 12px',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      textAlign: 'center'
                    }}
                  />

                  {/* Nút tăng 10.000 đ */}
                  <button
                    type="button"
                    id="btn-increase-deposit"
                    data-testid="btn-increase-deposit"
                    title="Tăng 10.000 đ"
                    onClick={() => handleStep(10000)}
                    disabled={Number(amount) >= 5000000}
                    style={{
                      padding: '0 14px',
                      background: 'var(--bg-surface)',
                      border: 'none',
                      borderLeft: '1px solid var(--border-subtle)',
                      color: Number(amount) >= 5000000 ? 'var(--text-subtle)' : 'var(--text-main)',
                      cursor: Number(amount) >= 5000000 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <span>+10k</span>
                    <Plus size={15} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                    Tối thiểu 10.000 đ - Tối đa 5.000.000 đ
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Bước nhảy: ±10.000 đ
                  </span>
                </div>
              </div>

              {/* Phím chọn nhanh số tiền */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Chọn nhanh mệnh giá:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      id={`btn-quick-amount-${q}`}
                      onClick={() => setAmount(q)}
                      style={{
                        padding: '7px 8px',
                        background: Number(amount) === q ? 'var(--primary)' : '#FFFFFF',
                        border: Number(amount) === q ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                        borderRadius: 6,
                        color: Number(amount) === q ? '#FFFFFF' : 'var(--text-main)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      +{q.toLocaleString('vi-VN')} đ
                    </button>
                  ))}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.84rem' }}>Phương thức thanh toán</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { id: 'VietQR Auto', title: 'VietQR Chuyển Khoản Tự Động (Khuyên dùng)', sub: 'Xử lý tự động 24/7 trong vài giây' },
                    { id: 'MoMo Auto', title: 'Ví Điện Tử MoMo', sub: 'Quét mã MoMo nạp tiền tức thì' },
                    { id: 'ATM Domestic', title: 'Thẻ ATM / Internet Banking', sub: 'Hỗ trợ các ngân hàng nội địa' }
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 12px',
                        background: method === pm.id ? 'var(--primary-light)' : '#FFFFFF',
                        border: method === pm.id ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                        borderRadius: 8,
                        cursor: 'pointer'
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
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>{pm.title}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{pm.sub}</div>
                      </div>
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
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="btn-confirm-deposit"
                data-testid="btn-confirm-deposit"
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
