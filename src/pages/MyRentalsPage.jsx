import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, AlertTriangle, RefreshCw, CheckCircle, ExternalLink, ShieldAlert, User, ShieldCheck, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from '../components/CountdownTimer';
import { DisputeModal } from '../components/DisputeModal';
import { ReturnEarlyModal } from '../components/ReturnEarlyModal';
import { ExtendRentalModal } from '../components/ExtendRentalModal';

export const MyRentalsPage = ({ onExploreMore, onOpenDeposit }) => {
  const { rentals, currentUser, returnRentalEarly, users } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const [selectedRentalForExtend, setSelectedRentalForExtend] = useState(null);
  const [selectedRentalForDispute, setSelectedRentalForDispute] = useState(null);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Tab cho Admin: 'all-active' (Đơn của khách hàng) | 'my-active' (Đơn của tôi) | 'all-history' (Lịch sử hệ thống)
  // Tab cho Renter: 'active' (Đang chơi) | 'history' (Lịch sử thuê)
  const [activeTab, setActiveTab] = useState(() => {
    if (isAdmin) {
      const preferred = localStorage.getItem('gamerent_admin_preferred_tab');
      if (preferred) {
        localStorage.removeItem('gamerent_admin_preferred_tab');
        return preferred;
      }
      return 'all-active';
    }
    return 'active';
  });

  // Nhận biết đơn cần highlight khi chuyển từ thông báo Navbar
  const [highlightOrderId, setHighlightOrderId] = useState(() => {
    return localStorage.getItem('gamerent_highlight_order') || null;
  });

  // Phân biệt đơn do Admin thuê (đơn cá nhân) vs đơn do Khách Hàng thuê
  const isAdminRental = (r) => {
    if (!r) return false;
    if (r.userId === 'ADMIN-01' || r.userId === 'admin') return true;
    if (currentUser?.role === 'admin' && r.userId === currentUser?.id) return true;
    const orderUser = users?.find(u => u.id === r.userId);
    if (orderUser && orderUser.role === 'admin') return true;
    return false;
  };

  const isCustomerRental = (r) => !isAdminRental(r);

  // Lắng nghe sự kiện highlight kể cả khi người dùng đang ở sẵn trên trang MyRentalsPage
  useEffect(() => {
    const handleHighlightEvent = (e) => {
      const orderId = e?.detail?.orderId || localStorage.getItem('gamerent_highlight_order');
      if (orderId) {
        setHighlightOrderId(orderId);
        if (isAdmin) {
          const target = rentals.find(r => r.id === orderId);
          setActiveTab(target && isAdminRental(target) ? 'my-active' : 'all-active');
        } else {
          setActiveTab('active');
        }
        setTimeout(() => {
          const el = document.getElementById(`rental-card-${orderId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    };

    // Lắng nghe sự kiện thu hồi / đổi mật khẩu thời gian thực
    const handleAccountRevoked = (e) => {
      const { rentalUserId, secretAccount, reason } = e.detail || {};
      // 1. Loại bỏ hoàn toàn dòng thông báo xanh khi hệ thống tự động thu hồi do hết giờ (thông báo đã lưu ở chuông)
      if (reason === 'expired_auto') return;

      // 2. Tách riêng rõ ràng giữa admin và khách: chỉ hiện toast trả sớm nếu đúng đơn của tài khoản đang đăng nhập
      if (rentalUserId && rentalUserId !== currentUser?.id && !isAdmin) return;

      setSuccessToast(`🔒 Đã thu hồi acc "${secretAccount}" thành công!`);
      setTimeout(() => setSuccessToast(''), 4000);
    };

    window.addEventListener('gamerent_highlight_order_changed', handleHighlightEvent);
    window.addEventListener('gamerent_account_revoked', handleAccountRevoked);
    window.addEventListener('storage', handleHighlightEvent);

    return () => {
      window.removeEventListener('gamerent_highlight_order_changed', handleHighlightEvent);
      window.removeEventListener('gamerent_account_revoked', handleAccountRevoked);
      window.removeEventListener('storage', handleHighlightEvent);
    };
  }, [isAdmin, rentals, currentUser?.id, users]);

  // Tự động xóa highlight sau 6s
  useEffect(() => {
    if (highlightOrderId) {
      const timer = setTimeout(() => {
        setHighlightOrderId(null);
        localStorage.removeItem('gamerent_highlight_order');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [highlightOrderId, isAdmin]);

  // Đơn của khách hàng (loại trừ hoàn toàn các đơn do Admin thuê)
  const customerActiveRentals = rentals.filter(r => r.status === 'active' && isCustomerRental(r));
  const customerPastRentals = rentals.filter(r => r.status !== 'active' && isCustomerRental(r));

  // Đơn cá nhân của Admin (khi Admin tự thuê acc để chơi hoặc test)
  const adminActiveRentals = rentals.filter(r => r.status === 'active' && isAdminRental(r));
  const adminPastRentals = rentals.filter(r => r.status !== 'active' && isAdminRental(r));

  // Đơn cá nhân của user thông thường (khi là Renter đăng nhập)
  const userRentals = rentals.filter(r => r.userId === currentUser?.id);
  const userActiveRentals = userRentals.filter(r => r.status === 'active');
  const userPastRentals = userRentals.filter(r => r.status !== 'active');

  // Đơn lịch sử toàn hệ thống dành cho Admin
  const allPastRentals = rentals.filter(r => r.status !== 'active');

  // Xác định danh sách đơn đang hiển thị
  const isViewingCustomers = isAdmin && activeTab === 'all-active';
  const isViewingAdminSelf = isAdmin && activeTab === 'my-active';
  const isViewingHistory = activeTab === 'history' || activeTab === 'all-history';
  
  let activeList = [];
  if (isAdmin) {
    if (activeTab === 'all-active') {
      activeList = customerActiveRentals;
    } else if (activeTab === 'my-active') {
      activeList = adminActiveRentals;
    } else {
      activeList = customerActiveRentals;
    }
  } else {
    activeList = userActiveRentals;
  }

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
      setSuccessToast(`Đã thu hồi acc #${res.accountId} (${res.secretAccount || ''}) & tự động đổi pass mới: ${res.newPassword} (Tài khoản đã chuyển sang Sẵn sàng).`);
    } else {
      setSuccessToast('Đã kết thúc ca thuê và thu hồi thông tin tài khoản thành công.');
    }
    setTimeout(() => setSuccessToast(''), 7000);
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
                <span>Đơn Của Khách Hàng ({customerActiveRentals.length})</span>
              </button>
              <button
                type="button"
                id="tab-my-active-rentals"
                onClick={() => setActiveTab('my-active')}
                className={`segmented-nav-btn ${activeTab === 'my-active' ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <User size={14} />
                <span>Đơn Của Tôi ({adminActiveRentals.length})</span>
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
                {isAdmin 
                  ? (activeTab === 'all-active' 
                      ? 'Hiện không có đơn thuê nào của khách hàng đang hoạt động' 
                      : 'Bạn chưa có đơn thuê cá nhân nào đang hoạt động')
                  : 'Bạn không có ca thuê cá nhân nào đang hoạt động'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 16 }}>
                {isAdmin 
                  ? (activeTab === 'all-active'
                      ? 'Khi khách hàng thuê tài khoản từ cửa hàng, ca thuê sẽ xuất hiện tại đây theo thời gian thực.'
                      : 'Khám phá kho acc game và nhận mật khẩu chơi ngay trong 30 giây!')
                  : 'Khám phá kho acc game và nhận mật khẩu chơi ngay trong 30 giây!'}
              </p>
              <button type="button" onClick={onExploreMore} className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
                <ExternalLink size={14} /> Khám Phá Kho Acc
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
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
                    style={{
                      borderRadius: 16,
                      background: isExpired ? '#FFFBFB' : isHighlighted ? '#FFFDF5' : '#FFFFFF',
                      border: isExpired
                        ? '2px solid #EF4444'
                        : isHighlighted 
                        ? '2px solid #F59E0B' 
                        : isExpiringSoon 
                        ? '2px solid #F59E0B' 
                        : '1.5px solid #CBD5E1',
                      borderLeft: isExpired
                        ? '6px solid #DC2626'
                        : isHighlighted
                        ? '6px solid #F59E0B'
                        : isExpiringSoon
                        ? '6px solid #D97706'
                        : '6px solid #0284C7',
                      boxShadow: isExpired 
                        ? '0 10px 25px -5px rgba(239, 68, 68, 0.18), 0 4px 6px -2px rgba(239, 68, 68, 0.08)' 
                        : isHighlighted 
                        ? '0 10px 25px -5px rgba(245, 158, 11, 0.18), 0 4px 6px -2px rgba(245, 158, 11, 0.08)' 
                        : '0 6px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Card Header Bar: Đậm nét, có nền phân biệt rõ ranh giới */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                        padding: '14px 20px',
                        background: isExpired
                          ? '#FEE2E2'
                          : isHighlighted
                          ? '#FEF3C7'
                          : isExpiringSoon
                          ? '#FFFBEB'
                          : '#F8FAFC',
                        borderBottom: isExpired
                          ? '1px solid #FECDD3'
                          : isHighlighted
                          ? '1px solid #FDE68A'
                          : isExpiringSoon
                          ? '1px solid #FDE68A'
                          : '1px solid #E2E8F0'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', color: '#0369A1', fontWeight: 800, background: '#E0F2FE', border: '1px solid #BAE6FD', padding: '3px 8px', borderRadius: 6, letterSpacing: '0.3px' }}>
                            ĐƠN #{rental.id}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600, background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: 6 }}>
                            Thuê {rental.durationHours} giờ
                          </span>
                          {/* Badge người thuê cho Admin / Khách */}
                          {isAdmin && activeTab === 'my-active' ? (
                            <span style={{ fontSize: '0.74rem', background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', padding: '3px 8px', borderRadius: 6, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <User size={12} /> Đơn cá nhân của Admin
                            </span>
                          ) : (isAdmin || isViewingCustomers) ? (
                            <span style={{ fontSize: '0.74rem', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                              Khách hàng: {rental.customerName || (rental.userId === 'USER-01' ? 'Nguyễn Văn Khách' : rental.userId)} ({rental.customerCode || '#KH001'})
                            </span>
                          ) : null}
                          {isExpired ? (
                            <span style={{ fontSize: '0.72rem', background: '#DC2626', color: '#FFFFFF', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                              ⚠️ Đã hết hạn thuê
                            </span>
                          ) : isExpiringSoon ? (
                            <span style={{ fontSize: '0.72rem', background: '#D97706', color: '#FFFFFF', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                              ⏳ Sắp hết hạn (&lt; 1h)
                            </span>
                          ) : null}
                        </div>
                        <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0F172A', marginTop: 6, marginBottom: 0 }}>
                          {rental.accountTitle}
                        </h3>
                      </div>

                      {/* Realtime Countdown Box */}
                      <div style={{ textAlign: 'right', background: '#FFFFFF', padding: '6px 14px', borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <span style={{ fontSize: '0.66rem', color: '#64748B', textTransform: 'uppercase', display: 'block', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 2 }}>
                          Thời gian còn lại:
                        </span>
                        <CountdownTimer endTime={rental.endTime} />
                      </div>
                    </div>

                    {/* Card Body: Chứa thông tin đăng nhập và các tác vụ */}
                    <div style={{ padding: '16px 20px' }}>
                      {/* Banner cảnh báo đỏ khi hết hạn hoặc vàng khi sắp hết hạn */}
                      {isExpired ? (
                        <div
                          style={{
                            background: '#FEE2E2',
                            border: '1px solid #FECDD3',
                            color: '#991B1B',
                            padding: '8px 14px',
                            borderRadius: 8,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            marginBottom: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                        >
                          <AlertTriangle size={16} color="#DC2626" />
                          <span>
                            {isAdmin 
                              ? (activeTab === 'my-active'
                                  ? <>Cảnh báo đỏ: Ca thuê của bạn đã hết hạn thời gian chơi! Vui lòng bấm <strong>&quot;Thu Hồi Acc&quot;</strong> để kết thúc ca thuê.</>
                                  : <>Cảnh báo đỏ: Ca thuê của khách hàng <strong>{rental.customerName || rental.userId}</strong> đã hết hạn thời gian thuê! Vui lòng bấm <strong>&quot;Thu Hồi Acc&quot;</strong> để đổi mật khẩu bảo vệ tài khoản.</>)
                              : <>Cảnh báo đỏ: Ca thuê này đã hết hạn thời gian thuê! Vui lòng bấm <strong>&quot;Thu Hồi Acc&quot;</strong> bên dưới để hoàn tất ca thuê.</>
                            }
                          </span>
                        </div>
                      ) : isHighlighted && (
                        <div
                          style={{
                            background: '#FEF3C7',
                            color: '#B45309',
                            padding: '6px 14px',
                            borderRadius: 8,
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            marginBottom: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                        >
                          <AlertTriangle size={15} color="#D97706" />
                          <span>
                            {isAdmin 
                              ? (activeTab === 'my-active'
                                  ? <>Ca thuê của bạn vừa chọn từ thông báo!</>
                                  : <>Ca thuê bạn vừa chọn từ thông báo: Khách hàng <strong>{rental.customerName || rental.userId}</strong> sắp hết hạn!</>)
                              : <>Đơn thuê này sắp hết giờ! Bạn có thể nhấn <strong>&quot;Gia Hạn&quot;</strong> để chơi tiếp, <strong>&quot;Trả Sớm&quot;</strong> hoặc <strong>&quot;Báo Lỗi&quot;</strong> ngay bên dưới.</>
                            }
                          </span>
                        </div>
                      )}

                      {/* Secret Credentials Box */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: 12,
                          background: '#F8FAFC',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 14
                        }}
                      >
                        {/* Username */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', fontWeight: 600 }}>Tài khoản:</span>
                            <strong id={`account-user-${rental.id}`} style={{ color: '#0F172A', fontSize: '0.94rem', fontFamily: 'monospace' }}>
                              {rental.secretAccount}
                            </strong>
                          </div>
                          <button
                            type="button"
                            id={`btn-copy-acc-${rental.id}`}
                            data-testid={`btn-copy-acc-${rental.id}`}
                            onClick={() => copyText(rental.secretAccount, `acc-${rental.id}`)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                          >
                            {copiedId === `acc-${rental.id}` ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                            {copiedId === `acc-${rental.id}` ? 'Đã chép' : 'Sao chép'}
                          </button>
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: isExpired ? '#DC2626' : '#64748B', display: 'block', fontWeight: isExpired ? 700 : 600 }}>
                              {isExpired ? 'Mật khẩu (Đã vô hiệu hóa):' : 'Mật khẩu:'}
                            </span>
                            {isExpired ? (
                              <strong id={`account-pass-${rental.id}`} style={{ color: '#DC2626', fontSize: '0.9rem', fontFamily: 'monospace', textDecoration: 'line-through' }}>
                                •••••••• (Hết hạn)
                              </strong>
                            ) : (
                              <strong id={`account-pass-${rental.id}`} style={{ color: 'var(--primary)', fontSize: '0.94rem', fontFamily: 'monospace' }}>
                                {rental.secretPassword}
                              </strong>
                            )}
                          </div>
                          <button
                            type="button"
                            id={`btn-copy-pass-${rental.id}`}
                            data-testid={`btn-copy-pass-${rental.id}`}
                            onClick={() => {
                              if (isExpired) {
                                setActionError('Mật khẩu ca thuê này đã hết hiệu lực. Hệ thống đã tự động đổi mật khẩu mới để thu hồi tài khoản.');
                                setTimeout(() => setActionError(''), 4000);
                                return;
                              }
                              copyText(rental.secretPassword, `pass-${rental.id}`);
                            }}
                            className={`btn ${isExpired ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ padding: '4px 10px', fontSize: '0.76rem', opacity: isExpired ? 0.7 : 1 }}
                            title={isExpired ? 'Mật khẩu đã bị vô hiệu hóa do hết hạn' : 'Sao chép mật khẩu'}
                          >
                            {isExpired ? (
                              <span>Vô hiệu</span>
                            ) : copiedId === `pass-${rental.id}` ? (
                              <Check size={12} color="var(--accent-green)" />
                            ) : (
                              <Copy size={12} />
                            )}
                            {!isExpired && (copiedId === `pass-${rental.id}` ? 'Đã chép' : 'Sao chép')}
                          </button>
                        </div>
                      </div>

                      {/* Actions Footer: Rõ ràng và tách bạch */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 14, marginTop: 6 }}>
                        <div style={{ fontSize: '0.86rem', color: '#64748B' }}>
                          Tổng tiền: <strong style={{ color: '#0F172A', fontSize: '1rem', fontWeight: 800 }}>{rental.totalPrice.toLocaleString('vi-VN')} đ</strong>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          {isExpired ? (
                            /* Khi đơn thuê hết hạn thời gian thuê: CẢNH BÁO ĐỎ VÀ CHỈ CÓ 1 NÚT THU HỒI ACC */
                            <button
                              type="button"
                              id={`btn-return-early-${rental.id}`}
                              data-testid={`btn-return-early-${rental.id}`}
                              onClick={() => handleReturnEarly(rental)}
                              className="btn btn-danger"
                              style={{
                                fontSize: '0.82rem',
                                padding: '6px 16px',
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
                                style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: '#CBD5E1' }}
                              >
                                <RefreshCw size={12} /> {isAdmin && activeTab === 'all-active' ? 'Gia Hạn / Bù Giờ' : 'Gia Hạn'}
                              </button>

                              <button
                                type="button"
                                id={`btn-return-early-${rental.id}`}
                                data-testid={`btn-return-early-${rental.id}`}
                                onClick={() => handleReturnEarly(rental)}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: '#CBD5E1' }}
                              >
                                {isAdmin && activeTab === 'all-active' ? 'Thu Hồi Sớm' : 'Trả Sớm'}
                              </button>

                              <button
                                type="button"
                                id={`btn-dispute-${rental.id}`}
                                data-testid={`btn-dispute-${rental.id}`}
                                onClick={() => setSelectedRentalForDispute(rental)}
                                className="btn btn-danger"
                                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                              >
                                <ShieldAlert size={12} /> Báo Lỗi
                              </button>
                            </>
                          )}
                        </div>
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
