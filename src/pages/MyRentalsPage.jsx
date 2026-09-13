import React, { useState } from 'react';
import { Clock, Copy, Check, AlertTriangle, RefreshCw, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from '../components/CountdownTimer';
import { DisputeModal } from '../components/DisputeModal';
import { ReturnEarlyModal } from '../components/ReturnEarlyModal';

export const MyRentalsPage = ({ onExploreMore }) => {
  const { rentals, currentUser, extendRental, returnRentalEarly } = useApp();
  const [selectedRentalForDispute, setSelectedRentalForDispute] = useState(null);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [extendHours, setExtendHours] = useState(1);
  const [extendingOrderId, setExtendingOrderId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Lọc các đơn thuê của user hiện tại
  const userRentals = rentals.filter(r => r.userId === currentUser?.id);
  const activeRentals = userRentals.filter(r => r.status === 'active');
  const pastRentals = userRentals.filter(r => r.status !== 'active');

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExtend = (rentalId) => {
    setActionError('');
    const res = extendRental(rentalId, extendHours);
    if (!res.success) {
      setActionError(res.error);
    } else {
      setExtendingOrderId(null);
      setSuccessToast(`Đã gia hạn thành công thêm ${extendHours} giờ cho đơn #${rentalId}!`);
      setTimeout(() => setSuccessToast(''), 3500);
    }
  };

  const handleReturnEarly = (rental) => {
    setSelectedRentalForReturn(rental);
  };

  const handleConfirmReturnEarly = (rentalId) => {
    returnRentalEarly(rentalId);
    setSuccessToast('Đã kết thúc ca thuê và thu hồi thông tin tài khoản thành công.');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  return (
    <div className="container" style={{ padding: '36px 20px 70px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Quản Lý <span style={{ color: 'var(--primary)' }}>Đơn Thuê Của Tôi</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Theo dõi thời gian chơi theo thời gian thực, lấy thông tin đăng nhập và hỗ trợ giải quyết sự cố.
        </p>
      </div>

      {actionError && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--accent-red-bg)',
            border: '1px solid var(--accent-red-border)',
            borderRadius: 8,
            color: '#DC2626',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem'
          }}
        >
          <AlertTriangle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {successToast && (
        <div
          id="toast-return-early-success"
          style={{
            padding: '12px 16px',
            background: 'var(--accent-green-bg)',
            border: '1px solid var(--accent-green-border)',
            borderRadius: 8,
            color: '#059669',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle size={18} color="var(--accent-green)" />
          <span style={{ fontWeight: 600 }}>{successToast}</span>
        </div>
      )}

      {/* ================= ĐƠN THUÊ ĐANG HOẠT ĐỘNG ================= */}
      <div style={{ marginBottom: 44 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
          <Clock size={18} color="var(--primary)" />
          Đang Hoạt Động ({activeRentals.length})
        </h2>

        {activeRentals.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '44px 20px', borderRadius: 12, background: '#FFFFFF' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>⏳</div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6 }}>Hiện không có tài khoản nào đang thuê</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
              Chọn ngay một tài khoản game để trải nghiệm Skin VIP và leo rank ngay hôm nay.
            </p>
            <button onClick={onExploreMore} className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <ExternalLink size={15} /> Khám Phá Kho Tài Khoản
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {activeRentals.map((rental) => (
              <div
                key={rental.id}
                id={`rental-card-${rental.id}`}
                data-testid={`rental-card-${rental.id}`}
                className="glass-panel"
                style={{
                  borderRadius: 14,
                  padding: 20,
                  border: '1px solid var(--border-medium)',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Header Card: Title & Timer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 14,
                    paddingBottom: 14,
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: 16
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Đơn hàng: #{rental.id}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                      {rental.accountTitle}
                    </h3>
                  </div>

                  {/* Realtime Countdown Timer */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                      Thời gian còn lại:
                    </span>
                    <CountdownTimer endTime={rental.endTime} />
                  </div>
                </div>

                {/* Credentials Reveal Box */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 12,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 16
                  }}
                >
                  {/* Account Name */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>Tài khoản game:</span>
                      <strong id={`account-user-${rental.id}`} style={{ color: 'var(--text-main)', fontSize: '0.98rem', fontFamily: 'monospace' }}>
                        {rental.secretAccount}
                      </strong>
                    </div>
                    <button
                      type="button"
                      id={`btn-copy-acc-${rental.id}`}
                      data-testid={`btn-copy-acc-${rental.id}`}
                      onClick={() => copyText(rental.secretAccount, `acc-${rental.id}`)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                    >
                      {copiedId === `acc-${rental.id}` ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                      {copiedId === `acc-${rental.id}` ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>

                  {/* Password */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>Mật khẩu:</span>
                      <strong id={`account-pass-${rental.id}`} style={{ color: 'var(--primary)', fontSize: '0.98rem', fontFamily: 'monospace' }}>
                        {rental.secretPassword}
                      </strong>
                    </div>
                    <button
                      type="button"
                      id={`btn-copy-pass-${rental.id}`}
                      data-testid={`btn-copy-pass-${rental.id}`}
                      onClick={() => copyText(rental.secretPassword, `pass-${rental.id}`)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                    >
                      {copiedId === `pass-${rental.id}` ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                      {copiedId === `pass-${rental.id}` ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>

                {/* Extend Box (If triggered) */}
                {extendingOrderId === rental.id && (
                  <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 8, border: '1px solid var(--border-medium)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Gia hạn thêm:</span>
                    <select
                      className="form-select"
                      value={extendHours}
                      onChange={(e) => setExtendHours(Number(e.target.value))}
                      style={{ padding: '5px 10px', fontSize: '0.82rem' }}
                    >
                      <option value={1}>1 Giờ (+{(rental.pricePerHour * 1).toLocaleString('vi-VN')} đ)</option>
                      <option value={2}>2 Giờ (+{(rental.pricePerHour * 2).toLocaleString('vi-VN')} đ)</option>
                      <option value={4}>4 Giờ (+{(rental.pricePerHour * 4).toLocaleString('vi-VN')} đ)</option>
                    </select>
                    <button
                      type="button"
                      id={`btn-confirm-extend-${rental.id}`}
                      onClick={() => handleExtend(rental.id)}
                      className="btn btn-primary"
                      style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                    >
                      Xác nhận gia hạn
                    </button>
                    <button
                      type="button"
                      onClick={() => setExtendingOrderId(null)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.82rem' }}
                    >
                      Hủy
                    </button>
                  </div>
                )}

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Tổng tiền: <strong style={{ color: 'var(--text-main)' }}>{rental.totalPrice.toLocaleString('vi-VN')} đ</strong> ({rental.durationHours} giờ)
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      id={`btn-trigger-extend-${rental.id}`}
                      data-testid={`btn-trigger-extend-${rental.id}`}
                      onClick={() => setExtendingOrderId(extendingOrderId === rental.id ? null : rental.id)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                    >
                      <RefreshCw size={14} /> Gia Hạn Thêm Giờ
                    </button>

                    <button
                      type="button"
                      id={`btn-return-early-${rental.id}`}
                      data-testid={`btn-return-early-${rental.id}`}
                      onClick={() => handleReturnEarly(rental)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                    >
                      Trả Acc Sớm
                    </button>

                    <button
                      type="button"
                      id={`btn-dispute-${rental.id}`}
                      data-testid={`btn-dispute-${rental.id}`}
                      onClick={() => setSelectedRentalForDispute(rental)}
                      className="btn btn-danger"
                      style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                    >
                      <ShieldAlert size={14} /> Báo Sự Cố
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= LỊCH SỬ ĐƠN THUÊ ĐÃ QUA ================= */}
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 14, color: 'var(--text-muted)' }}>
          Lịch Sử Đơn Thuê Trước Đây ({pastRentals.length})
        </h2>

        {pastRentals.length > 0 && (
          <div className="glass-panel" style={{ borderRadius: 12, overflowX: 'auto', background: '#FFFFFF' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Mã Đơn</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tài Khoản Game</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Thời Lượng</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tổng Tiền</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {pastRentals.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>#{p.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-main)' }}>{p.accountTitle}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{p.durationHours} giờ</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>{p.totalPrice.toLocaleString('vi-VN')} đ</td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.status === 'completed' ? (
                        <span className="badge badge-available">Đã hoàn tất</span>
                      ) : p.status === 'disputed' ? (
                        <span className="badge badge-rented">Đang khiếu nại ({p.disputeReason})</span>
                      ) : (
                        <span className="badge badge-maintenance">Hết giờ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {selectedRentalForDispute && (
        <DisputeModal
          isOpen={!!selectedRentalForDispute}
          onClose={() => setSelectedRentalForDispute(null)}
          rental={selectedRentalForDispute}
        />
      )}

      {/* Return Early Modal */}
      {selectedRentalForReturn && (
        <ReturnEarlyModal
          isOpen={!!selectedRentalForReturn}
          onClose={() => setSelectedRentalForReturn(null)}
          rental={selectedRentalForReturn}
          onConfirm={handleConfirmReturnEarly}
        />
      )}
    </div>
  );
};
