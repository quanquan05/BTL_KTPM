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
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

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
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* Top Header & Tab switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Quản Lý Đơn Thuê
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.84rem' }}>
            Lấy thông tin đăng nhập và theo dõi thời gian chơi còn lại.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="segmented-nav">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`segmented-nav-btn ${activeTab === 'active' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Clock size={14} />
            <span>Đang Chơi ({activeRentals.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`segmented-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            <span>Lịch Sử Thuê ({pastRentals.length})</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionError && (
        <div
          style={{
            padding: '8px 12px',
            background: 'var(--accent-red-bg)',
            border: '1px solid var(--accent-red-border)',
            borderRadius: 8,
            color: 'var(--accent-red-text)',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.84rem'
          }}
        >
          <AlertTriangle size={15} />
          <span>{actionError}</span>
        </div>
      )}

      {successToast && (
        <div
          id="toast-return-early-success"
          style={{
            padding: '8px 12px',
            background: 'var(--accent-green-bg)',
            border: '1px solid var(--accent-green-border)',
            borderRadius: 8,
            color: 'var(--accent-green-text)',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.84rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle size={15} color="var(--accent-green)" />
          <span style={{ fontWeight: 600 }}>{successToast}</span>
        </div>
      )}

      {/* ================= ACTIVE RENTALS ================= */}
      {activeTab === 'active' && (
        <div>
          {activeRentals.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '44px 20px', borderRadius: 12 }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🎮</div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 4 }}>Không có tài khoản nào đang hoạt động</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 16 }}>
                Khám phá kho acc game và nhận mật khẩu chơi ngay trong 30 giây!
              </p>
              <button type="button" onClick={onExploreMore} className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
                <ExternalLink size={14} /> Khám Phá Kho Acc
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {activeRentals.map((rental) => (
                <div
                  key={rental.id}
                  id={`rental-card-${rental.id}`}
                  data-testid={`rental-card-${rental.id}`}
                  className="glass-panel"
                  style={{
                    borderRadius: 12,
                    padding: '16px 18px',
                    border: '1px solid var(--border-subtle)',
                    background: '#FFFFFF',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                      paddingBottom: 12,
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: 14
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-light)', padding: '2px 6px', borderRadius: 4 }}>
                          ĐƠN #{rental.id}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
                          Thuê {rental.durationHours} giờ
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                        {rental.accountTitle}
                      </h3>
                    </div>

                    {/* Realtime Countdown */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', textTransform: 'uppercase', display: 'block' }}>
                        Thời gian còn lại:
                      </span>
                      <CountdownTimer endTime={rental.endTime} />
                    </div>
                  </div>

                  {/* Secret Credentials Box */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 10,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 14
                    }}
                  >
                    {/* Username */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Tài khoản:</span>
                        <strong id={`account-user-${rental.id}`} style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          {rental.secretAccount}
                        </strong>
                      </div>
                      <button
                        type="button"
                        id={`btn-copy-acc-${rental.id}`}
                        data-testid={`btn-copy-acc-${rental.id}`}
                        onClick={() => copyText(rental.secretAccount, `acc-${rental.id}`)}
                        className="btn btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                      >
                        {copiedId === `acc-${rental.id}` ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                        {copiedId === `acc-${rental.id}` ? 'Đã chép' : 'Sao chép'}
                      </button>
                    </div>

                    {/* Password */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Mật khẩu:</span>
                        <strong id={`account-pass-${rental.id}`} style={{ color: 'var(--primary)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          {rental.secretPassword}
                        </strong>
                      </div>
                      <button
                        type="button"
                        id={`btn-copy-pass-${rental.id}`}
                        data-testid={`btn-copy-pass-${rental.id}`}
                        onClick={() => copyText(rental.secretPassword, `pass-${rental.id}`)}
                        className="btn btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                      >
                        {copiedId === `pass-${rental.id}` ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                        {copiedId === `pass-${rental.id}` ? 'Đã chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>

                  {/* Extend Option */}
                  {extendingOrderId === rental.id && (
                    <div style={{ background: 'var(--bg-surface)', padding: 10, borderRadius: 8, border: '1px solid var(--border-medium)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Gia hạn thêm:</span>
                      <select
                        className="form-select"
                        value={extendHours}
                        onChange={(e) => setExtendHours(Number(e.target.value))}
                        style={{ padding: '4px 8px', fontSize: '0.8rem', height: 30 }}
                      >
                        <option value={1}>+1 Giờ ({(rental.pricePerHour * 1).toLocaleString('vi-VN')} đ)</option>
                        <option value={2}>+2 Giờ ({(rental.pricePerHour * 2).toLocaleString('vi-VN')} đ)</option>
                        <option value={4}>+4 Giờ ({(rental.pricePerHour * 4).toLocaleString('vi-VN')} đ)</option>
                      </select>
                      <button
                        type="button"
                        id={`btn-confirm-extend-${rental.id}`}
                        onClick={() => handleExtend(rental.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        Xác nhận gia hạn
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtendingOrderId(null)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        Hủy
                      </button>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Tổng tiền: <strong style={{ color: 'var(--text-main)' }}>{rental.totalPrice.toLocaleString('vi-VN')} đ</strong>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        id={`btn-trigger-extend-${rental.id}`}
                        data-testid={`btn-trigger-extend-${rental.id}`}
                        onClick={() => setExtendingOrderId(extendingOrderId === rental.id ? null : rental.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                      >
                        <RefreshCw size={12} /> Gia Hạn
                      </button>

                      <button
                        type="button"
                        id={`btn-return-early-${rental.id}`}
                        data-testid={`btn-return-early-${rental.id}`}
                        onClick={() => handleReturnEarly(rental)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                      >
                        Trả Sớm
                      </button>

                      <button
                        type="button"
                        id={`btn-dispute-${rental.id}`}
                        data-testid={`btn-dispute-${rental.id}`}
                        onClick={() => setSelectedRentalForDispute(rental)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                      >
                        <ShieldAlert size={12} /> Báo Lỗi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= HISTORY ================= */}
      {activeTab === 'history' && (
        <div>
          {pastRentals.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '36px 20px', borderRadius: 12 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Chưa có đơn thuê nào trong lịch sử.</p>
            </div>
          ) : (
            <div className="glass-panel" style={{ borderRadius: 12, overflowX: 'auto', background: '#FFFFFF' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Mã Đơn</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tài Khoản Game</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Thời Lượng</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tổng Tiền</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {pastRentals.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>#{p.id}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 500, color: 'var(--text-main)' }}>{p.accountTitle}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{p.durationHours} giờ</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>{p.totalPrice.toLocaleString('vi-VN')} đ</td>
                      <td style={{ padding: '10px 14px' }}>
                        {p.status === 'completed' ? (
                          <span className="badge badge-available">Đã hoàn tất</span>
                        ) : p.status === 'disputed' ? (
                          <span className="badge badge-rented">Khiếu nại: {p.disputeReason}</span>
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
      )}

      {/* Modals */}
      {selectedRentalForDispute && (
        <DisputeModal
          isOpen={!!selectedRentalForDispute}
          onClose={() => setSelectedRentalForDispute(null)}
          rental={selectedRentalForDispute}
        />
      )}

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
