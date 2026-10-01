import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  Activity,
  Check,
  X,
  Search,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  User,
  ShieldAlert,
  RotateCcw,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const ReportsDisputesPage = ({ initialTab = 'disputes' }) => {
  const {
    rentals,
    disputes,
    transactions,
    accounts,
    resolveDispute
  } = useApp();

  const [activeTab, setActiveTab] = useState(() => {
    return initialTab || 'disputes';
  });

  // Bộ lọc trạng thái cho Tab Khiếu Nại
  const [disputeFilter, setDisputeFilter] = useState('all'); // 'all' | 'pending' | 'resolved' | 'rejected'
  const [disputeSearch, setDisputeSearch] = useState('');

  // Toast thông báo kết quả
  const [toastMessage, setToastMessage] = useState('');

  // Modal xử lý nghiệp vụ khiếu nại
  const [disputeToRefund, setDisputeToRefund] = useState(null);
  const [disputeToReject, setDisputeToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('Đã kiểm tra thông tin đăng nhập hoạt động chính xác 100%');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Bộ lọc cho tab Lịch sử hoạt động hệ thống
  const [activityFilter, setActivityFilter] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#container-admin-activity-filter')) {
        setIsActivityDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Tự động tắt Toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Tính toán số liệu thống kê
  const totalRevenue = transactions
    .filter(t => t.type === 'rental_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const activeRentalsCount = rentals.filter(r => r.status === 'active').length;
  const pendingDisputesCount = disputes.filter(d => d.status === 'pending').length;
  const resolvedDisputesCount = disputes.filter(d => d.status === 'resolved').length;
  const rejectedDisputesCount = disputes.filter(d => d.status === 'rejected').length;

  const ACTIVITY_OPTIONS = [
    { value: 'all', label: 'Tất cả hoạt động', dotColor: '#10B981' },
    { value: 'rent', label: 'Thuê mới acc', dotColor: '#3B82F6' },
    { value: 'extend', label: 'Gia hạn thời gian', dotColor: '#8B5CF6' },
    { value: 'deposit', label: 'Khách nạp tiền', dotColor: '#10B981' },
    { value: 'dispute', label: 'Khiếu nại / Báo lỗi', dotColor: '#EF4444' },
    { value: 'completed', label: 'Hoàn tất & Trả acc', dotColor: '#64748B' }
  ];

  // Danh sách toàn bộ hoạt động của hệ thống
  const baseActivities = [
    {
      id: 'ACT-EXT-01',
      type: 'extend',
      actionName: 'Gia hạn ca thuê',
      customerName: 'Nguyễn Văn Hùng',
      customerCode: '#KH012',
      target: 'Valorant - VNT#592 (#ACC-VAL-01)',
      details: 'Gia hạn thêm +2 giờ chơi. Trừ số dư ví thành công.',
      amount: -30000,
      timeText: '22:28 (Hôm nay)',
      timestamp: Date.now() - 32 * 60 * 1000,
      status: 'Thành công',
      statusColor: '#10B981'
    },
    {
      id: 'ACT-EXT-02',
      type: 'extend',
      actionName: 'Gia hạn ca thuê',
      customerName: 'Lê Quốc Bảo',
      customerCode: '#KH005',
      target: 'Genshin Impact (#ACC-GEN-01)',
      details: 'Gia hạn thêm +1 giờ chơi. Cập nhật thời hạn mới trên hệ thống.',
      amount: -20000,
      timeText: '19:40 (Hôm nay)',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      status: 'Thành công',
      statusColor: '#10B981'
    },
    {
      id: 'ACT-DEP-01',
      type: 'deposit',
      actionName: 'Khách nạp tiền ví',
      customerName: 'Trần Phú Gia',
      customerCode: '#KH003',
      target: 'Ví GameRent (VietQR Auto)',
      details: 'Nạp tiền tự động qua QR ngân hàng VCB. Hệ thống ghi nhận số dư tức thì.',
      amount: 100000,
      timeText: '18:30 (Hôm nay)',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      status: 'Thành công',
      statusColor: '#10B981'
    },
    {
      id: 'ACT-DEP-02',
      type: 'deposit',
      actionName: 'Khách nạp tiền ví',
      customerName: 'Đỗ Minh Đức',
      customerCode: '#KH007',
      target: 'Ví GameRent (MBBank VietQR)',
      details: 'Khách quét mã VietQR tự động cộng tiền sau 5 giây.',
      amount: 200000,
      timeText: '17:15 (Hôm nay)',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      status: 'Thành công',
      statusColor: '#10B981'
    },
    ...rentals.map(r => ({
      id: `ACT-RENT-${r.id}`,
      type: 'rent',
      actionName: 'Thuê mới tài khoản',
      customerName: r.customerName || (r.userId === 'ADMIN-01' ? 'Quản Lý (Admin)' : r.userId),
      customerCode: r.customerCode || '#KH001',
      target: `${r.accountTitle || r.gameId} (${r.accountCode || '#' + r.accountId})`,
      details: `Thời lượng: ${r.durationHours} giờ | Mật khẩu bàn giao: ${r.secretAccount}`,
      amount: -Number(r.totalPrice || 0),
      timeText: r.rentalTimeFormatted || '18:14',
      timestamp: r.startTime || Date.now(),
      status: r.status === 'active' ? 'Đang chơi' : 'Hoàn tất',
      statusColor: r.status === 'active' ? '#3B82F6' : '#10B981'
    })),
    ...rentals.filter(r => r.status === 'completed').map(r => ({
      id: `ACT-CMP-${r.id}`,
      type: 'completed',
      actionName: 'Hoàn tất & Thu hồi pass',
      customerName: r.customerName || r.userId,
      customerCode: r.customerCode || '#KH002',
      target: `${r.accountTitle || r.gameId} (${r.accountCode || '#' + r.accountId})`,
      details: `Hết thời lượng ca thuê #${r.id}. Hệ thống tự động đổi mật khẩu và trả lại kho có sẵn.`,
      amount: 0,
      timeText: r.remainingText ? 'Đã hoàn tất' : '15:30',
      timestamp: (r.endTime || Date.now() - 3600000),
      status: 'Đã thu hồi pass',
      statusColor: '#64748B'
    })),
    ...transactions.filter(t => t.type === 'deposit' || t.amount > 0).map(t => ({
      id: `ACT-TX-${t.id}`,
      type: 'deposit',
      actionName: 'Khách nạp tiền ví',
      customerName: t.userId === 'USER-01' ? 'Nguyễn Văn Admin' : 'Quản Lý',
      customerCode: t.userId === 'USER-01' ? '#KH001' : '#KH000',
      target: `Ví GameRent (${t.paymentMethod || 'VietQR Auto'})`,
      details: t.note || 'Nạp tiền tự động qua QR ngân hàng',
      amount: Math.abs(t.amount),
      timeText: '16:00 (Hôm nay)',
      timestamp: t.timestamp || Date.now(),
      status: 'Thành công',
      statusColor: '#10B981'
    })),
    ...disputes.map(d => ({
      id: `ACT-DISP-${d.id}`,
      type: 'dispute',
      actionName: 'Báo lỗi / Khiếu nại',
      customerName: d.userName || (d.userId === 'USER-01' ? 'Nguyễn Văn Admin' : (d.userId || 'Khách thuê')),
      customerCode: '#KH006',
      target: `Đơn #${d.orderId} - Acc #${d.accountId}`,
      details: `Lý do: "${d.reason || d.note}"`,
      amount: -(d.amount || 0),
      timeText: d.createdAt ? new Date(d.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Hôm nay',
      timestamp: d.createdAt || Date.now(),
      status: d.status === 'pending' ? 'Chờ duyệt' : d.status === 'resolved' ? 'Đã hoàn tiền 100%' : 'Đã từ chối',
      statusColor: d.status === 'pending' ? '#EF4444' : d.status === 'resolved' ? '#10B981' : '#64748B'
    }))
  ];

  const allActivities = [...baseActivities].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const filteredActivities = allActivities.filter(act => {
    if (activityFilter !== 'all' && act.type !== activityFilter) return false;
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      const matchName = act.customerName.toLowerCase().includes(q);
      const matchCode = (act.customerCode || '').toLowerCase().includes(q);
      const matchTarget = act.target.toLowerCase().includes(q);
      const matchDetails = act.details.toLowerCase().includes(q);
      const matchAction = act.actionName.toLowerCase().includes(q);
      return matchName || matchCode || matchTarget || matchDetails || matchAction;
    }
    return true;
  });

  // Lọc khiếu nại theo tab trạng thái & từ khóa
  const filteredDisputes = disputes.filter(d => {
    if (disputeFilter !== 'all' && d.status !== disputeFilter) return false;
    if (disputeSearch.trim()) {
      const q = disputeSearch.toLowerCase();
      const matchId = (d.id || '').toLowerCase().includes(q);
      const matchOrder = (d.orderId || '').toLowerCase().includes(q);
      const matchReason = (d.reason || '').toLowerCase().includes(q);
      const matchNote = (d.note || '').toLowerCase().includes(q);
      const matchUser = (d.userName || d.userId || '').toLowerCase().includes(q);
      return matchId || matchOrder || matchReason || matchNote || matchUser;
    }
    return true;
  });

  // Xử lý Phê duyệt hoàn tiền 100%
  const handleExecuteRefund = (disp) => {
    const res = resolveDispute(disp.id, 'refund', 'Đã thẩm định và duyệt hoàn 100% tiền đơn thuê về ví khách hàng.');
    setDisputeToRefund(null);
    setToastMessage(`✅ Đã phê duyệt hoàn tiền 100% (${(disp.amount || 0).toLocaleString('vi-VN')} đ) cho đơn #${disp.orderId} thành công!`);
  };

  // Xử lý Bác bỏ khiếu nại
  const handleExecuteReject = (disp) => {
    const finalReason = customRejectReason.trim() || rejectReason;
    resolveDispute(disp.id, 'reject', finalReason);
    setDisputeToReject(null);
    setCustomRejectReason('');
    setToastMessage(`❌ Đã bác bỏ khiếu nại #${disp.id} thành công.`);
  };

  return (
    <div className="dashboard-container" style={{ paddingBottom: 60 }}>
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 99999,
            background: '#064E3B',
            color: '#ECFDF5',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.86rem',
            fontWeight: 600,
            border: '1px solid #059669',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={18} color="#34D399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Báo Cáo & Khiếu Nại */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#ECFDF5', color: '#059669', fontSize: '0.74rem', fontWeight: 700, marginBottom: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          BÁO CÁO & XỬ LÝ SỰ CỐ
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <FileText size={24} color="#10B981" />
          <span>Báo Cáo & Xử Lý Khiếu Nại</span>
        </h1>
        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
          Giải quyết khiếu nại bảo hiểm hoàn tiền 100%, tự động thu hồi acc và giám sát nhật ký hoạt động hệ thống
        </p>
      </div>

      {/* ================= STATS CARDS CHO PHẦN BÁO CÁO ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12,
          marginBottom: 20
        }}
      >
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Doanh Thu Thuê</span>
            <DollarSign size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Acc Đang Thuê</span>
            <Clock size={16} color="var(--accent-green-text)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green-text)' }}>
            {activeRentalsCount} tài khoản
          </div>
        </div>

        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Khiếu Nại Chờ Duyệt</span>
            <AlertTriangle size={16} color={pendingDisputesCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)'} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pendingDisputesCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {pendingDisputesCount} đơn
          </div>
        </div>

        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Tổng Lượt Thuê</span>
            <Activity size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3B82F6' }}>
            {rentals.length} ca thuê
          </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div style={{ marginBottom: 16 }}>
        <div className="segmented-nav" style={{ flexWrap: 'wrap', gap: 4 }}>
          <button
            type="button"
            id="tab-admin-disputes"
            data-testid="tab-admin-disputes"
            onClick={() => setActiveTab('disputes')}
            className={`segmented-nav-btn ${activeTab === 'disputes' ? 'active' : ''}`}
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <AlertTriangle size={14} color={activeTab === 'disputes' ? 'var(--accent-red)' : 'inherit'} />
            <span>Xử Lý Khiếu Nại ({disputes.length})</span>
            {pendingDisputesCount > 0 && (
              <span style={{ background: 'var(--accent-red)', color: '#fff', fontSize: '0.64rem', fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>
                {pendingDisputesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            id="tab-admin-activities"
            data-testid="tab-admin-activities"
            onClick={() => setActiveTab('activities')}
            className={`segmented-nav-btn ${activeTab === 'activities' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Activity size={14} color={activeTab === 'activities' ? 'var(--primary)' : 'inherit'} />
            <span>Lịch Sử Hoạt Động Toàn Trang ({allActivities.length})</span>
          </button>

          <button
            type="button"
            id="tab-admin-orders"
            data-testid="tab-admin-orders"
            onClick={() => setActiveTab('orders')}
            className={`segmented-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Clock size={14} color={activeTab === 'orders' ? 'var(--primary)' : 'inherit'} />
            <span>Giám Sát Đơn Thuê ({rentals.length})</span>
          </button>
        </div>
      </div>

      {/* ================= NỘI DUNG TAB 1: XỬ LÝ KHIẾU NẠI ================= */}
      {activeTab === 'disputes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Sub-Filters cho Tab Khiếu nại */}
          <div
            className="glass-panel"
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Filter Buttons */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 8, gap: 3, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `Tất cả (${disputes.length})` },
                { id: 'pending', label: `Chờ duyệt (${pendingDisputesCount})`, badgeColor: '#EF4444' },
                { id: 'resolved', label: `Đã hoàn tiền (${resolvedDisputesCount})` },
                { id: 'rejected', label: `Đã từ chối (${rejectedDisputesCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDisputeFilter(tab.id)}
                  style={{
                    border: 'none',
                    background: disputeFilter === tab.id ? '#FFFFFF' : 'transparent',
                    color: disputeFilter === tab.id ? '#0F172A' : '#64748B',
                    fontWeight: disputeFilter === tab.id ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '5px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    boxShadow: disputeFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Tìm mã khiếu nại, đơn, lý do..."
                value={disputeSearch}
                onChange={(e) => setDisputeSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
            </div>
          </div>

          {/* Danh sách khiếu nại */}
          {filteredDisputes.length === 0 ? (
            <div
              id="empty-disputes-view"
              data-testid="empty-disputes-view"
              className="glass-panel"
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                borderRadius: 16,
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Layered circular icon badge */}
              <div
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: disputeFilter === 'pending'
                    ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                    : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  border: disputeFilter === 'pending'
                    ? '2px solid #A7F3D0'
                    : '2px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  boxShadow: disputeFilter === 'pending'
                    ? '0 10px 25px -5px rgba(16, 185, 129, 0.22)'
                    : '0 8px 16px -4px rgba(148, 163, 184, 0.15)'
                }}
              >
                {disputeFilter === 'pending' ? (
                  <>
                    <ShieldCheck size={40} color="#059669" strokeWidth={2.2} />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: '#10B981',
                        border: '2.5px solid #FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  </>
                ) : (
                  <Search size={34} color="#64748B" strokeWidth={2} />
                )}
              </div>

              {/* Status pill badge */}
              {disputeFilter === 'pending' && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 14px',
                    borderRadius: 20,
                    background: '#ECFDF5',
                    color: '#047857',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid #A7F3D0',
                    marginBottom: 12
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#10B981',
                      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)'
                    }}
                  />
                  Hệ thống ổn định • An toàn 100%
                </div>
              )}

              {/* Heading */}
              <h4
                style={{
                  fontSize: '1.18rem',
                  color: '#0F172A',
                  marginBottom: 6,
                  fontWeight: 800,
                  letterSpacing: '-0.01em'
                }}
              >
                {disputeFilter === 'pending'
                  ? 'Không có khiếu nại nào đang chờ duyệt'
                  : disputeSearch
                    ? `Không tìm thấy khiếu nại khớp với "${disputeSearch}"`
                    : 'Không tìm thấy khiếu nại phù hợp'}
              </h4>

              {/* Description */}
              <p
                style={{
                  color: '#64748B',
                  fontSize: '0.88rem',
                  maxWidth: 520,
                  lineHeight: 1.6,
                  margin: '0 0 20px 0'
                }}
              >
                {disputeFilter === 'pending'
                  ? 'Tất cả các ca thuê tài khoản đang hoạt động ổn định hoặc các yêu cầu đã được xử lý xong. Hệ thống tự động giám sát và bảo hiểm 100% cho khách hàng.'
                  : 'Không có kết quả nào khớp với điều kiện lọc hiện tại. Bạn có thể xóa từ khóa hoặc chuyển tab trạng thái khác để xem lịch sử.'}
              </p>

              {/* Action Buttons if filtered or searched */}
              {(disputeFilter !== 'all' || disputeSearch.trim() !== '') && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {disputeSearch.trim() !== '' && (
                    <button
                      type="button"
                      onClick={() => setDisputeSearch('')}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: 8 }}
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                  {disputeFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setDisputeFilter('all')}
                      className="btn btn-secondary"
                      style={{
                        fontSize: '0.82rem',
                        padding: '6px 16px',
                        borderRadius: 8,
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#1E293B',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Xem tất cả khiếu nại ({disputes.length})
                    </button>
                  )}
                </div>
              )}

              {/* Features Guarantee Footer Pills */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 12,
                  paddingTop: 18,
                  borderTop: '1px dashed #E2E8F0',
                  maxWidth: 580,
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569', background: '#F8FAFC', padding: '5px 12px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Bảo hiểm hoàn tiền 100%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569', background: '#F8FAFC', padding: '5px 12px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <RotateCcw size={14} color="#0284C7" />
                  <span>Tự động thu hồi & đổi mật khẩu</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569', background: '#F8FAFC', padding: '5px 12px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <Clock size={14} color="#8B5CF6" />
                  <span>Giám sát hệ thống 24/7</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredDisputes.map((disp) => {
                const targetAccount = accounts.find(a => a.id === disp.accountId);
                const isPending = disp.status === 'pending';
                const isResolved = disp.status === 'resolved';

                return (
                  <div
                    key={disp.id}
                    id={`dispute-card-${disp.id}`}
                    data-testid={`dispute-card-${disp.id}`}
                    className="glass-panel"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 12,
                      padding: '16px 20px',
                      border: isPending ? '1px solid var(--accent-red-border)' : '1px solid var(--border-subtle)',
                      boxShadow: isPending ? '0 4px 14px rgba(239, 68, 68, 0.08)' : 'var(--shadow-xs)'
                    }}
                  >
                    {/* Header Thẻ Khiếu Nại */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.76rem', color: isPending ? 'var(--accent-red-text)' : '#059669', fontWeight: 800 }}>
                            Khiếu Nại #{disp.id}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>•</span>
                          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                            Đơn Thuê: <strong style={{ color: '#0F172A' }}>#{disp.orderId}</strong>
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>•</span>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            Khách hàng: <strong style={{ color: '#0F172A' }}>{disp.userName || disp.userId}</strong>
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                          Lý do: {disp.reason}
                        </h4>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isPending ? (
                          <span className="badge" style={{ background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', fontWeight: 700, padding: '4px 10px' }}>
                            Chờ giải quyết
                          </span>
                        ) : isResolved ? (
                          <span className="badge badge-available" style={{ padding: '4px 10px' }}>
                            Đã hoàn tiền 100%
                          </span>
                        ) : (
                          <span className="badge badge-maintenance" style={{ padding: '4px 10px' }}>
                            Đã từ chối
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nội dung khiếu nại & Thông tin hoàn tiền */}
                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 10, fontSize: '0.84rem', border: '1px solid #E2E8F0', marginBottom: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
                        <div>
                          <strong style={{ color: '#0F172A', display: 'block', marginBottom: 2 }}>Nội dung phản ánh từ khách:</strong>
                          <span style={{ color: '#334155', lineHeight: 1.4 }}>
                            {disp.note ? `"${disp.note}"` : 'Khách không nhập thêm ghi chú.'}
                          </span>
                          {targetAccount && (
                            <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#64748B' }}>
                              Tài khoản game: <strong>{targetAccount.title}</strong> (#{targetAccount.id})
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: 'right', borderLeft: '1px dashed #CBD5E1', paddingLeft: 12 }}>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Số tiền bảo hiểm 100%:</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-heading)', marginTop: 2 }}>
                            {(disp.amount || 0).toLocaleString('vi-VN')} đ
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 2 }}>
                            {disp.createdAt ? new Date(disp.createdAt).toLocaleString('vi-VN') : 'Hôm nay'}
                          </div>
                        </div>
                      </div>

                      {/* Log giải quyết của Admin nếu đã xử lý */}
                      {disp.adminNote && (
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #E2E8F0', fontSize: '0.78rem', color: isResolved ? '#065F46' : '#991B1B', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Info size={14} />
                          <span><strong>Ghi chú xử lý:</strong> {disp.adminNote}</span>
                        </div>
                      )}
                    </div>

                    {/* Các nút hành động xử lý nghiệp vụ */}
                    {isPending && (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          type="button"
                          id={`btn-reject-dispute-${disp.id}`}
                          data-testid={`btn-reject-dispute-${disp.id}`}
                          onClick={() => setDisputeToReject(disp)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        >
                          <X size={14} /> Bác Bỏ Khiếu Nại
                        </button>

                        <button
                          type="button"
                          id={`btn-refund-dispute-${disp.id}`}
                          data-testid={`btn-refund-dispute-${disp.id}`}
                          onClick={() => setDisputeToRefund(disp)}
                          className="btn btn-success"
                          style={{
                            fontSize: '0.8rem',
                            padding: '6px 16px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <Check size={14} strokeWidth={2.6} /> Chấp Nhận & Hoàn 100%
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= NỘI DUNG TAB 2: LỊCH SỬ HOẠT ĐỘNG TOÀN TRANG ================= */}
      {activeTab === 'activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            className="glass-panel"
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#FFFFFF',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div id="container-admin-activity-filter" style={{ position: 'relative' }}>
              <button
                type="button"
                id="btn-filter-activity-dropdown"
                data-testid="select-activity-filter"
                onClick={() => setIsActivityDropdownOpen(!isActivityDropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: isActivityDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Filter size={14} color="var(--primary)" />
                <span>{ACTIVITY_OPTIONS.find(o => o.value === activityFilter)?.label}</span>
                <ChevronDown size={13} color="#64748B" />
              </button>

              {isActivityDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 5px)',
                    left: 0,
                    minWidth: 190,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '4px',
                    zIndex: 100
                  }}
                >
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setActivityFilter(opt.value);
                        setIsActivityDropdownOpen(false);
                      }}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                        fontWeight: activityFilter === opt.value ? 700 : 500,
                        color: activityFilter === opt.value ? '#059669' : '#334155',
                        background: activityFilter === opt.value ? '#ECFDF5' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                        <span>{opt.label}</span>
                      </div>
                      {activityFilter === opt.value && <Check size={13} color="#10B981" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                placeholder="Tìm khách hàng, mã đơn, tựa game..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Nhật Ký Dòng Thời Gian ({filteredActivities.length} sự kiện)
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                Tự động cập nhật thời gian thực
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                  Không tìm thấy hoạt động nào phù hợp với bộ lọc
                </div>
              ) : (
                filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.12s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: act.type === 'deposit' ? '#ECFDF5' : act.type === 'extend' ? '#F5F3FF' : act.type === 'dispute' ? '#FFF1F2' : '#EFF6FF',
                          color: act.statusColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {act.type === 'deposit' ? <ArrowDownLeft size={16} /> : act.type === 'dispute' ? <AlertTriangle size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>{act.actionName}</strong>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>• {act.customerName} ({act.customerCode})</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {act.target} - {act.details}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {act.amount !== 0 && (
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: act.amount > 0 ? '#10B981' : '#E11D48' }}>
                          {act.amount > 0 ? `+${act.amount.toLocaleString('vi-VN')} đ` : `${act.amount.toLocaleString('vi-VN')} đ`}
                        </div>
                      )}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 2 }}>{act.timeText}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= NỘI DUNG TAB 3: GIÁM SÁT ĐƠN THUÊ ================= */}
      {activeTab === 'orders' && (
        <div className="rental-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="rental-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>MÃ ĐƠN</th>
                  <th style={{ minWidth: 200 }}>TÀI KHOẢN</th>
                  <th style={{ minWidth: 160 }}>KHÁCH THUÊ</th>
                  <th style={{ minWidth: 120 }}>THỜI LƯỢNG</th>
                  <th style={{ minWidth: 130 }}>TỔNG TIỀN</th>
                  <th style={{ width: 130, textAlign: 'center' }}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-subtle)' }}>
                      Chưa có đơn thuê nào trong hệ thống
                    </td>
                  </tr>
                ) : (
                  rentals.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>#{r.id}</td>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{r.accountTitle || r.gameId}</td>
                      <td style={{ color: '#475569' }}>{r.userId}</td>
                      <td style={{ color: '#475569' }}>{r.durationHours} giờ</td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>{r.totalPrice?.toLocaleString('vi-VN')} đ</td>
                      <td style={{ textAlign: 'center' }}>
                        {r.status === 'active' ? (
                          <span className="badge badge-rented">Đang chơi</span>
                        ) : r.status === 'completed' ? (
                          <span className="badge badge-available">Đã trả</span>
                        ) : (
                          <span className="badge badge-maintenance">Khiếu nại</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN HOÀN TIỀN 100% ================= */}
      {disputeToRefund && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDisputeToRefund(null);
          }}
        >
          <div
            className="modal-card"
            style={{ maxWidth: 460, width: '100%', borderRadius: 16, overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 20px', background: '#ECFDF5', borderBottom: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={18} strokeWidth={3} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065F46', margin: 0 }}>
                  Xác Nhận Phê Duyệt Hoàn Tiền 100%
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#047857', margin: 0 }}>
                  Chính sách bảo hiểm sự cố GameRent
                </p>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 14, fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#64748B' }}>Số tiền hoàn trả:</span>
                  <strong style={{ color: '#10B981', fontSize: '1.05rem' }}>{(disputeToRefund.amount || 0).toLocaleString('vi-VN')} đ</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#64748B' }}>Khách hàng nhận:</span>
                  <strong style={{ color: '#0F172A' }}>{disputeToRefund.userName || disputeToRefund.userId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Đơn thuê sự cố:</span>
                  <strong style={{ color: '#0F172A' }}>#{disputeToRefund.orderId}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, background: '#EFF6FF', padding: 10, borderRadius: 8, border: '1px solid #BFDBFE' }}>
                <strong>Quy trình hệ thống tự động:</strong>
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  <li>Cộng trực tiếp 100% tiền vào số dư ví của khách hàng.</li>
                  <li>Tự động chuyển tài khoản game sang trạng thái <strong>Bảo trì</strong> và sinh mật khẩu mới ngẫu nhiên.</li>
                  <li>Thu hồi phiên đơn thuê và gửi thông báo xác nhận cho khách.</li>
                </ul>
              </div>
            </div>

            <div style={{ padding: '14px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDisputeToRefund(null)}
                style={{ fontSize: '0.84rem' }}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleExecuteRefund(disputeToRefund)}
                style={{ fontSize: '0.84rem', fontWeight: 700 }}
              >
                Xác Nhận Hoàn Tiền 100%
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN BÁC BỎ KHIẾU NẠI ================= */}
      {disputeToReject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDisputeToReject(null);
          }}
        >
          <div
            className="modal-card"
            style={{ maxWidth: 480, width: '100%', borderRadius: 16, overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 20px', background: '#FEF2F2', borderBottom: '1px solid #FECDD3', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#DC2626', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} strokeWidth={3} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                  Xác Nhận Bác Bỏ Khiếu Nại #{disputeToReject.id}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#B91C1C', margin: 0 }}>
                  Đơn thuê #{disputeToReject.orderId}
                </p>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                Chọn lý do từ chối (sẽ thông báo đến khách hàng):
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {[
                  'Đã kiểm tra thông tin đăng nhập hoạt động chính xác 100%',
                  'Tài khoản không phát hiện lỗi như mô tả, skin và rank đầy đủ',
                  'Khách hàng không cung cấp đủ bằng chứng xác thực sự cố',
                  'Khách tự ý hủy hoặc vi phạm quy định thuê tài khoản'
                ].map(r => (
                  <label
                    key={r}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: rejectReason === r ? '#FEF2F2' : '#F8FAFC',
                      border: rejectReason === r ? '1px solid #FECDD3' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: rejectReason === r ? 600 : 400
                    }}
                  >
                    <input
                      type="radio"
                      name="rejectReasonRadio"
                      checked={rejectReason === r}
                      onChange={() => setRejectReason(r)}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              <label style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginBottom: 4 }}>
                Hoặc nhập lý do tùy chỉnh:
              </label>
              <input
                type="text"
                placeholder="Nhập lý do chi tiết nếu cần..."
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ padding: '14px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDisputeToReject(null)}
                style={{ fontSize: '0.84rem' }}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleExecuteReject(disputeToReject)}
                style={{ fontSize: '0.84rem', fontWeight: 700 }}
              >
                Xác Nhận Bác Bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
