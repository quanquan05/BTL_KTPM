import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, AlertTriangle, RefreshCw, CheckCircle, ExternalLink, ShieldAlert, User, ShieldCheck, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from '../components/CountdownTimer';
import { DisputeModal } from '../components/DisputeModal';
import { ReturnEarlyModal } from '../components/ReturnEarlyModal';
import { ExtendRentalModal } from '../components/ExtendRentalModal';

export const MyRentalsPage = ({ onExploreMore, onOpenDeposit }) => {
  const { rentals, currentUser, returnRentalEarly } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const [selectedRentalForExtend, setSelectedRentalForExtend] = useState(null);
  const [selectedRentalForDispute, setSelectedRentalForDispute] = useState(null);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Tab cho Admin: 'all-active' (Tất cả đơn khách hàng) | 'my-active' (Đơn cá nhân) | 'all-history' (Lịch sử)
  // Tab cho Renter: 'active' | 'history'
  const [activeTab, setActiveTab] = useState(isAdmin ? 'all-active' : 'active');

  // Nhận biết đơn cần highlight khi chuyển từ thông báo Navbar
  const [highlightOrderId, setHighlightOrderId] = useState(() => {
    return localStorage.getItem('gamerent_highlight_order') || null;
  });

  // Lắng nghe sự kiện highlight kể cả khi người dùng đang ở sẵn trên trang MyRentalsPage
  useEffect(() => {
    const handleHighlightEvent = (e) => {
      const orderId = e?.detail?.orderId || localStorage.getItem('gamerent_highlight_order');
      if (orderId) {
        setHighlightOrderId(orderId);
        setActiveTab(isAdmin ? 'all-active' : 'active');
        setTimeout(() => {
          const el = document.getElementById(`rental-card-${orderId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    };

    window.addEventListener('gamerent_highlight_order_changed', handleHighlightEvent);
    window.addEventListener('storage', handleHighlightEvent);

    return () => {
      window.removeEventListener('gamerent_highlight_order_changed', handleHighlightEvent);
      window.removeEventListener('storage', handleHighlightEvent);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (highlightOrderId) {
      localStorage.removeItem('gamerent_highlight_order');
      setActiveTab(isAdmin ? 'all-active' : 'active');
      setTimeout(() => {
        const el = document.getElementById(`rental-card-${highlightOrderId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
      const timer = setTimeout(() => setHighlightOrderId(null), 12000);
      return () => clearTimeout(timer);
    }
  }, [highlightOrderId, isAdmin]);

  // Đơn cá nhân của user đăng nhập
  const userRentals = rentals.filter(r => r.userId === currentUser?.id);
  const userActiveRentals = userRentals.filter(r => r.status === 'active');
  const userPastRentals = userRentals.filter(r => r.status !== 'active');

  // Đơn toàn hệ thống dành cho Admin
  const allActiveRentals = rentals.filter(r => r.status === 'active');
  const allPastRentals = rentals.filter(r => r.status !== 'active');

  // Xác định danh sách đơn đang hiển thị
  const isViewingAll = isAdmin && activeTab === 'all-active';
  const isViewingHistory = activeTab === 'history' || activeTab === 'all-history';
  
  let activeList = isViewingAll ? allActiveRentals : userActiveRentals;
  // Ưu tiên đưa đơn được highlight (từ thông báo) lên đầu danh sách
  if (highlightOrderId) {
    activeList = [
      ...activeList.filter(r => r.id === highlightOrderId),
      ...activeList.filter(r => r.id !== highlightOrderId)
    ];
  }

  const pastList = (isAdmin && activeTab === 'all-history') ? allPastRentals : userPastRentals;

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReturnEarly = (rental) => {
    setSelectedRentalForReturn(rental);
  };

  const handleConfirmReturnEarly = (rentalId) => {
    const res = returnRentalEarly(rentalId);
    if (res && res.newPassword) {
      setSuccessToast(`Đã thu hồi acc #${res.accountId} & tự động đổi pass mới: ${res.newPassword} (Tài khoản đã chuyển sang Sẵn sàng).`);
    } else {
      setSuccessToast('Đã kết thúc ca thuê và thu hồi thông tin tài khoản thành công.');
    }
    setTimeout(() => setSuccessToast(''), 5000);
  };

  return (
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* Top Header & Tab switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {isAdmin ? 'Quản Lý & Giám Sát Đơn Thuê' : 'Đơn Thuê Của Tôi'}
            </h1>
            {isAdmin && (
              <span style={{ fontSize: '0.7rem', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                Chế độ Quản Trị Viên
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.84rem', marginTop: 4, marginBottom: 0 }}>
            {isAdmin 
              ? 'Theo dõi tiến độ, thời gian chơi và điều phối hỗ trợ mọi ca thuê game của khách hàng.'
              : 'Lấy thông tin đăng nhập và theo dõi thời gian chơi còn lại.'}
          </p>
        </div>

        {/* Tab switcher theo phân quyền Admin / Khách */}
        <div className="segmented-nav">
          {isAdmin ? (
            <>
              <button
                type="button"
                id="tab-all-active-rentals"
                onClick={() => setActiveTab('all-active')}
                className={`segmented-nav-btn ${activeTab === 'all-active' ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <Clock size={14} />
                <span>Tất Cả Đơn Khách Hàng ({allActiveRentals.length})</span>
              </button>
              <button
                type="button"
                id="tab-my-active-rentals"
                onClick={() => setActiveTab('my-active')}
                className={`segmented-nav-btn ${activeTab === 'my-active' ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <User size={14} />
                <span>Đơn Của Tôi ({userActiveRentals.length})</span>
              </button>
              <button
                type="button"
                id="tab-history-rentals"
                onClick={() => setActiveTab('all-history')}
                className={`segmented-nav-btn ${activeTab === 'all-history' ? 'active' : ''}`}
              >
                <span>Lịch Sử Hệ Thống ({allPastRentals.length})</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                id="tab-user-active-rentals"
                onClick={() => setActiveTab('active')}
                className={`segmented-nav-btn ${activeTab === 'active' ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <Clock size={14} />
                <span>Đang Chơi ({userActiveRentals.length})</span>
              </button>
              <button
                type="button"
                id="tab-user-history-rentals"
                onClick={() => setActiveTab('history')}
                className={`segmented-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              >
                <span>Lịch Sử Thuê ({userPastRentals.length})</span>
              </button>
            </>
          )}
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
      {!isViewingHistory && (
        <div>
          {activeList.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '44px 20px', borderRadius: 12 }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🎮</div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 4 }}>
                {isViewingAll ? 'Hệ thống hiện không có ca thuê nào đang hoạt động' : 'Bạn không có ca thuê cá nhân nào đang hoạt động'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 16 }}>
                {isViewingAll 
                  ? 'Khi khách hàng thuê tài khoản từ cửa hàng, ca thuê sẽ xuất hiện tại đây theo thời gian thực.'
                  : 'Khám phá kho acc game và nhận mật khẩu chơi ngay trong 30 giây!'}
              </p>
              <button type="button" onClick={onExploreMore} className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
                <ExternalLink size={14} /> Khám Phá Kho Acc
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {activeList.map((rental) => {
                const isHighlighted = rental.id === highlightOrderId;
                const nowMs = Date.now();
                const remainingMs = Math.max(0, rental.endTime - nowMs);
                const isExpired = remainingMs === 0;
                const isExpiringSoon = !isExpired && remainingMs <= 60 * 60 * 1000;

                return (
                  <div
                    key={rental.id}
                    id={`rental-card-${rental.id}`}
                    data-testid={`rental-card-${rental.id}`}
                    className="glass-panel"
                    style={{
                      borderRadius: 12,
                      padding: '16px 18px',
                      border: isExpired
                        ? '2px solid #EF4444'
                        : isHighlighted 
                        ? '2px solid #F59E0B' 
                        : isExpiringSoon 
                        ? '1px solid #FDE68A' 
                        : '1px solid var(--border-subtle)',
                      background: isExpired ? '#FEF2F2' : isHighlighted ? '#FFFDF5' : '#FFFFFF',
                      boxShadow: isExpired 
                        ? '0 0 20px rgba(239, 68, 68, 0.22)' 
                        : isHighlighted 
                        ? '0 0 20px rgba(245, 158, 11, 0.22)' 
                        : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Banner cảnh báo đỏ khi hết hạn hoặc vàng khi sắp hết hạn */}
                    {isExpired ? (
                      <div
                        style={{
                          background: '#FEE2E2',
                          border: '1px solid #FECDD3',
                          color: '#991B1B',
                          padding: '7px 12px',
                          borderRadius: 6,
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          marginBottom: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <AlertTriangle size={15} color="#DC2626" />
                        <span>
                          {isAdmin 
                            ? <>Cảnh báo đỏ: Ca thuê của khách hàng <strong>{rental.customerName || rental.userId}</strong> đã hết hạn thời gian thuê! Vui lòng bấm <strong>&quot;Thu Hồi Acc&quot;</strong> để đổi mật khẩu bảo vệ tài khoản.</>
                            : <>Cảnh báo đỏ: Ca thuê này đã hết hạn thời gian thuê! Vui lòng bấm <strong>&quot;Thu Hồi Acc&quot;</strong> bên dưới để hoàn tất ca thuê.</>
                          }
                        </span>
                      </div>
                    ) : isHighlighted && (
                      <div
                        style={{
                          background: '#FEF3C7',
                          color: '#B45309',
                          padding: '5px 12px',
                          borderRadius: 6,
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          marginBottom: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <AlertTriangle size={14} color="#D97706" />
                        <span>
                          {isAdmin 
                            ? <>Ca thuê bạn vừa chọn từ thông báo: Khách hàng <strong>{rental.customerName || rental.userId}</strong> sắp hết hạn!</>
                            : <>Đơn thuê này sắp hết giờ! Bạn có thể nhấn <strong>&quot;Gia Hạn&quot;</strong> để chơi tiếp, <strong>&quot;Trả Sớm&quot;</strong> hoặc <strong>&quot;Báo Lỗi&quot;</strong> ngay bên dưới.</>
                          }
                        </span>
                      </div>
                    )}

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-light)', padding: '2px 6px', borderRadius: 4 }}>
                            ĐƠN #{rental.id}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
                            Thuê {rental.durationHours} giờ
                          </span>
                          {/* Badge người thuê cho Admin */}
                          {(isAdmin || isViewingAll) && (
                            <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#0F172A', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                              Khách hàng: {rental.customerName || rental.userId} ({rental.customerCode || '#KH001'})
                            </span>
                          )}
                          {isExpired ? (
                            <span style={{ fontSize: '0.7rem', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECDD3', padding: '2px 7px', borderRadius: 6, fontWeight: 700 }}>
                              ⚠️ Đã hết hạn thuê
                            </span>
                          ) : isExpiringSoon ? (
                            <span style={{ fontSize: '0.7rem', background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', padding: '2px 7px', borderRadius: 6, fontWeight: 700 }}>
                              ⏳ Sắp hết hạn (&lt; 1h)
                            </span>
                          ) : null}
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 4, marginBottom: 0 }}>
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

                    {/* Actions Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Tổng tiền: <strong style={{ color: 'var(--text-main)' }}>{rental.totalPrice.toLocaleString('vi-VN')} đ</strong>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        {isExpired ? (
                          /* Khi đơn thuê hết hạn thời gian thuê: CẢNH BÁO ĐỎ VÀ CHỈ CÓ 1 NÚT THU HỒI ACC */
                          <button
                            type="button"
                            id={`btn-return-early-${rental.id}`}
                            data-testid={`btn-return-early-${rental.id}`}
                            onClick={() => handleReturnEarly(rental)}
                            className="btn btn-danger"
                            style={{
                              fontSize: '0.8rem',
                              padding: '6px 14px',
                              background: '#DC2626',
                              borderColor: '#DC2626',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
                            }}
                          >
                            <LogOut size={14} color="#FFFFFF" />
                            <span>Thu Hồi Acc</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              id={`btn-trigger-extend-${rental.id}`}
                              data-testid={`btn-trigger-extend-${rental.id}`}
                              onClick={() => setSelectedRentalForExtend(rental)}
                              className="btn btn-secondary"
                              style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                            >
                              <RefreshCw size={12} /> {isAdmin ? 'Gia Hạn / Bù Giờ' : 'Gia Hạn'}
                            </button>

                            <button
                              type="button"
                              id={`btn-return-early-${rental.id}`}
                              data-testid={`btn-return-early-${rental.id}`}
                              onClick={() => handleReturnEarly(rental)}
                              className="btn btn-secondary"
                              style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                            >
                              {isAdmin ? 'Thu Hồi Sớm' : 'Trả Sớm'}
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= HISTORY ================= */}
      {isViewingHistory && (
        <div>
          {pastList.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '36px 20px', borderRadius: 12 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Chưa có đơn thuê nào trong lịch sử.</p>
            </div>
          ) : (
            <div className="glass-panel" style={{ borderRadius: 12, overflowX: 'auto', background: '#FFFFFF' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Mã Đơn</th>
                    {isAdmin && <th style={{ padding: '10px 14px', fontWeight: 600 }}>Khách Hàng</th>}
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tài Khoản Game</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Thời Lượng</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tổng Tiền</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {pastList.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>#{p.id}</td>
                      {isAdmin && (
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0F172A' }}>
                          {p.customerName || p.userId}
                        </td>
                      )}
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

      {/* Modals - Bộ 3 chức năng đồng bộ: Gia Hạn, Báo Lỗi, Trả Sớm */}
      {selectedRentalForExtend && (
        <ExtendRentalModal
          isOpen={!!selectedRentalForExtend}
          onClose={() => setSelectedRentalForExtend(null)}
          rental={selectedRentalForExtend}
          onOpenDeposit={onOpenDeposit}
          onExtendSuccess={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(''), 3500);
          }}
        />
      )}

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
