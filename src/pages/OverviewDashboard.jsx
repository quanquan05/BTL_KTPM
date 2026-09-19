import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  DollarSign,
  Clock,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Search,
  Play,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart2,
  RefreshCw,
  AlertTriangle,
  Flame,
  Sparkles,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Key,
  Eye,
  EyeOff,
  User,
  PlusCircle,
  Lock,
  ShieldAlert,
  X,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const OverviewDashboard = ({ onNavigate, onSelectAccount }) => {
  const {
    rentals,
    accounts,
    currentUser,
    disputes,
    transactions,
    extendRental,
    returnRentalEarly,
    toggleAccountStatus,
    resolveDispute
  } = useApp();
  const [selectedGameFilter, setSelectedGameFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('active');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [confirmRevokeSession, setConfirmRevokeSession] = useState(null);
  const [showSecretPass, setShowSecretPass] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null); // 'game' | 'status' | null

  // State tùy chọn 7 ngày / Tháng cho Thống kê game & Biểu đồ doanh thu
  const [gameStatsRange, setGameStatsRange] = useState('7d'); // '7d' | '30d'
  const [hoveredGameId, setHoveredGameId] = useState(null);

  const [revenueRange, setRevenueRange] = useState('7d'); // '7d' | 'month'
  const [hoveredRevenueIndex, setHoveredRevenueIndex] = useState(null);

  const PAGE_SIZE = 5;

  const GAME_OPTIONS = [
    { value: 'all', label: 'Tất cả game' },
    { value: 'lien-quan', label: 'Liên Quân Mobile' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'genshin', label: 'Genshin Impact' },
    { value: 'fo4', label: 'FC Online' },
    { value: 'pubg', label: 'PUBG Steam' },
    { value: 'toc-chien', label: 'LMHT: Tốc Chiến' }
  ];

  const STATUS_OPTIONS = [
    { value: 'active', label: 'Đang thuê', dotColor: '#10B981' },
    { value: 'disputed', label: 'Báo lỗi / Khiếu nại', dotColor: '#EF4444' },
    { value: 'completed', label: 'Đã hoàn tất (Lịch sử)', dotColor: '#94A3B8' },
    { value: 'all', label: 'Tất cả trạng thái' }
  ];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#btn-dashboard-game-filter') && !e.target.closest('#btn-dashboard-status-filter')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Tính toán 3 cấp độ cảnh báo nghiệp vụ: Đỏ, Vàng, Xanh
  const now = Date.now();
  const pendingDisputes = disputes ? disputes.filter(d => d.status === 'pending') : [];
  const errorAccounts = accounts ? accounts.filter(a => a.status === 'maintenance' || a.status === 'need_change_pass' || a.status === 'reported') : [];
  const expiredRentals = rentals ? rentals.filter(r => r.status === 'active' && r.endTime <= now) : [];
  const redCount = pendingDisputes.length + errorAccounts.length + expiredRentals.length;

  // Tài khoản sắp hết hạn (< 1 giờ và còn thời gian)
  const expiringRentals = rentals ? rentals.filter(r => r.status === 'active' && r.endTime > now && (r.endTime - now <= 60 * 60 * 1000)) : [];
  const yellowCount = expiringRentals.length;

  // Cấp độ cảnh báo tổng thể: Đỏ > Vàng > Xanh
  const alertSeverity = redCount > 0 ? 'red' : yellowCount > 0 ? 'yellow' : 'green';
  const urgentCount = redCount > 0 ? redCount : yellowCount;

  // Live timer tick so remaining times update every second
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format remaining time nicely
  const formatRemaining = (endTime, defaultText, status) => {
    if (status === 'completed') return 'Đã kết thúc';
    if (defaultText) return defaultText;
    if (!endTime) return '00:00:00';
    const diff = endTime - Date.now();
    if (diff <= 0) {
      return 'Đã hết giờ';
    }
    const sec = Math.floor(diff / 1000);
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Các hàm nghiệp vụ của Admin xử lý trực tiếp trên phiên thuê
  const handleAdminExtend = (session, hours = 1) => {
    extendRental(session.orderId, hours);
    setToastMessage(`Đã bù +${hours} giờ chơi cho đơn #${session.orderId}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAdminRevoke = (session) => {
    setConfirmRevokeSession(session);
  };

  const handleAdminMaintenance = (session) => {
    if (session.accountId) {
      toggleAccountStatus(session.accountId, 'maintenance');
      setToastMessage(`Đã đưa tài khoản #${session.accountCode} vào trạng thái bảo trì!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleAdminRefund = (session) => {
    const relatedDispute = disputes.find(d => d.orderId === session.orderId && d.status === 'pending');
    if (relatedDispute) {
      resolveDispute(relatedDispute.id, 'refund');
      setToastMessage(`Đã giải quyết khiếu nại và hoàn tiền cho khách ${session.customerName}!`);
    } else {
      returnRentalEarly(session.orderId);
      setToastMessage(`Đã kết thúc phiên thuê và hoàn tất xử lý cho đơn #${session.orderId}!`);
    }
    setTimeout(() => setToastMessage(''), 3000);
    setSelectedSession(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  // Ghép đơn thuê thực tế từ AppContext (đặc biệt là các đơn bị khiếu nại/báo lỗi)
  const realRentalRows = rentals.map((r, idx) => {
    const acc = accounts.find(a => a.id === r.accountId) || {};
    return {
      id: idx + 1,
      orderId: r.id,
      accountId: r.accountId,
      userId: r.userId,
      amount: r.totalPrice,
      gameName: r.accountTitle || acc.title || 'Game Account',
      publisher: r.publisher || acc.server || 'Garena',
      gameIcon: acc.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=60&q=80',
      accountCode: r.accountCode || (acc.id ? `#${acc.id}` : 'VNT#192'),
      rank: r.rank || acc.rank || 'Cao Thủ',
      customerName: r.customerName || (r.userId === 'USER-01' ? 'Nguyễn Văn Admin' : r.userId),
      customerCode: r.customerCode || '#KH001',
      rentalTime: r.rentalTimeFormatted || new Date(r.startTime).toISOString().slice(0, 16).replace('T', ' '),
      remainingText: r.status === 'disputed' ? 'Đang tạm dừng' : formatRemaining(r.endTime, r.remainingText, r.status),
      status: r.status, // 'active' | 'completed' | 'disputed'
      disputeReason: r.disputeReason,
      secretAccount: r.secretAccount || acc.secretAccount || 'lq_caothu_ngokhong',
      secretPassword: r.secretPassword || acc.secretPassword || 'PassKTPM#LQ99',
      endTime: r.endTime,
      isPill: r.status === 'active'
    };
  });

  // Tính toán số liệu thống kê thực tế
  const totalRevenue = rentals
    .filter(r => r.status === 'completed' || r.status === 'active')
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const activeRentalCount = rentals.filter(r => r.status === 'active').length;

  // Đơn bị báo lỗi sẽ được ưu tiên hiển thị ở đầu bảng để Admin dễ thấy
  const allRows = [
    ...realRentalRows.filter(r => r.status === 'disputed'),
    ...realRentalRows.filter(r => r.status !== 'disputed')
  ];

  const filteredRows = allRows.filter(row => {
    if (selectedGameFilter !== 'all') {
      if (selectedGameFilter === 'lien-quan' && !row.gameName.includes('Liên Quân')) return false;
      if (selectedGameFilter === 'valorant' && !row.gameName.includes('Valorant')) return false;
      if (selectedGameFilter === 'genshin' && !row.gameName.includes('Genshin')) return false;
      if (selectedGameFilter === 'fo4' && !row.gameName.includes('FC Online') && !row.gameName.includes('FO4')) return false;
      if (selectedGameFilter === 'pubg' && !row.gameName.includes('PUBG')) return false;
      if (selectedGameFilter === 'toc-chien' && !row.gameName.includes('Tốc Chiến')) return false;
    }
    if (selectedStatusFilter !== 'all') {
      if (selectedStatusFilter === 'active' && row.status !== 'active') return false;
      if (selectedStatusFilter === 'disputed' && row.status !== 'disputed') return false;
      if (selectedStatusFilter === 'completed' && row.status !== 'completed') return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        row.gameName.toLowerCase().includes(q) ||
        row.accountCode.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  return (
    <div className="dashboard-container">
      {/* ================= GREETING BANNER ================= */}
      <div className="dashboard-banner">
        <div>
          <h1 className="dashboard-title">
            Chào mừng trở lại, {currentUser?.name || 'Quản Lý'} 👋
          </h1>
          <p className="dashboard-subtitle">
            Quản lý tài khoản thuê game một cách dễ dàng, nhanh chóng và hiệu quả.
          </p>
        </div>

        <div className="dashboard-date-badge">
          <Calendar size={16} color="#10B981" />
          <span>Thứ 7, 14 tháng 6, 2025 · 22:37</span>
        </div>
      </div>

      {/* ================= 3 TOP STATS CARDS ================= */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Tổng doanh thu */}
        <div className="stat-card" id="stat-card-revenue">
          <div className="stat-icon-box" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginBottom: 2 }}>
              Tổng doanh thu
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {totalRevenue > 0 ? `${totalRevenue.toLocaleString('vi-VN')}đ` : '0đ'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <span>Doanh thu từ đơn thuê thực tế</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tài khoản đang thuê */}
        <div className="stat-card" id="stat-card-active-rentals">
          <div className="stat-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <Gamepad2 size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginBottom: 2 }}>
              Tài khoản đang thuê
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {activeRentalCount} <span style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600 }}>/ {accounts.length} tài khoản</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: activeRentalCount > 0 ? '#10B981' : '#64748B', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <span>{activeRentalCount > 0 ? `${activeRentalCount} ca đang diễn ra` : 'Chưa có ca thuê nào'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cảnh báo khẩn cấp (Hỗ trợ 3 cấp độ: Đỏ - Vàng - Xanh) */}
        {(() => {
          const config = {
            red: {
              cardBg: '#FFF1F2',
              cardBorder: '#FECDD3',
              iconBg: '#FEE2E2',
              iconColor: '#EF4444',
              titleColor: '#E11D48',
              badgeColor: '#E11D48',
              btnBorder: '#FDA4AF',
              btnColor: '#E11D48',
              title: 'Cảnh báo khẩn cấp',
              countText: redCount,
              desc: pendingDisputes.length > 0 
                ? `${pendingDisputes.length} khiếu nại báo lỗi cần xử lý ngay!` 
                : `${errorAccounts.length} tài khoản cần đổi pass/bảo trì!`,
              btnText: 'Xem chi tiết',
              navTarget: 'reports'
            },
            yellow: {
              cardBg: '#FFFBEB',
              cardBorder: '#FDE68A',
              iconBg: '#FEF3C7',
              iconColor: '#F59E0B',
              titleColor: '#D97706',
              badgeColor: '#D97706',
              btnBorder: '#FCD34D',
              btnColor: '#D97706',
              title: 'Cảnh báo sắp hết hạn',
              countText: `${yellowCount} đơn`,
              desc: `${yellowCount} tài khoản sắp hết hạn trong vòng 1h!`,
              btnText: 'Giám sát đơn',
              navTarget: 'my-rentals'
            },
            green: {
              cardBg: '#ECFDF5',
              cardBorder: '#A7F3D0',
              iconBg: '#D1FAE5',
              iconColor: '#10B981',
              titleColor: '#059669',
              badgeColor: '#059669',
              btnBorder: '#6EE7B7',
              btnColor: '#059669',
              title: 'Hệ thống an toàn',
              countText: '0 sự cố',
              desc: 'Tất cả tài khoản hoạt động ổn định và an toàn!',
              btnText: 'Giám sát',
              navTarget: 'my-rentals'
            }
          }[alertSeverity];

          return (
            <div
              className="stat-urgent-card"
              id="stat-card-urgent-alert"
              style={{
                background: config.cardBg,
                borderColor: config.cardBorder
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: config.iconBg,
                    color: config.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {alertSeverity === 'green' ? (
                    <ShieldCheck size={24} strokeWidth={2.5} />
                  ) : alertSeverity === 'yellow' ? (
                    <Clock size={22} strokeWidth={2.5} />
                  ) : (
                    <Bell size={22} strokeWidth={2.5} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: config.titleColor, fontWeight: 700, marginBottom: 1 }}>
                    {config.title}
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: config.badgeColor, lineHeight: 1.2 }}>
                    {config.countText}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: config.titleColor, fontWeight: 500, marginTop: 2 }}>
                    {config.desc}
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-urgent-details"
                data-testid="btn-urgent-details"
                onClick={() => onNavigate(config.navTarget)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: `1px solid ${config.btnBorder}`,
                  background: '#FFFFFF',
                  color: config.btnColor,
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{config.btnText}</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          );
        })()}
      </div>

      {/* ================= 2-COLUMN MAIN DASHBOARD GRID ================= */}
      <div className="dashboard-content-grid">
        {/* ================= LEFT COLUMN: DANH SÁCH TÀI KHOẢN THUÊ ================= */}
        <div className="rental-table-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Table Card Header */}
          <div className="rental-table-header">
            {/* Top row: Title and description */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#E8F8F0',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Gamepad2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Danh sách tài khoản thuê
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                  Theo dõi trạng thái thuê tài khoản game theo thời gian thực
                </p>
              </div>
            </div>

            {/* Bottom row: Thanh lựa chọn bộ lọc & tìm kiếm */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Custom Dropdown: Game */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="btn-dashboard-game-filter"
                  data-testid="select-dashboard-game-filter"
                  onClick={() => setOpenDropdown(openDropdown === 'game' ? null : 'game')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle)',
                    background: '#FFFFFF',
                    color: '#334155',
                    height: 34,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{GAME_OPTIONS.find(o => o.value === selectedGameFilter)?.label || 'Tất cả game'}</span>
                  <ChevronDown
                    size={14}
                    color="#64748B"
                    style={{
                      transform: openDropdown === 'game' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}
                  />
                </button>

                {openDropdown === 'game' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      left: 0,
                      minWidth: 175,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                      padding: '5px',
                      zIndex: 100
                    }}
                  >
                    {GAME_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSelectedGameFilter(opt.value);
                          setCurrentPage(1);
                          setOpenDropdown(null);
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: '0.78rem',
                          color: selectedGameFilter === opt.value ? '#059669' : '#334155',
                          background: selectedGameFilter === opt.value ? '#ECFDF5' : 'transparent',
                          fontWeight: selectedGameFilter === opt.value ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedGameFilter !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (selectedGameFilter !== opt.value) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{opt.label}</span>
                        {selectedGameFilter === opt.value && <Check size={13} color="#059669" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Dropdown: Trạng thái */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="btn-dashboard-status-filter"
                  data-testid="select-dashboard-status-filter"
                  onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle)',
                    background: '#FFFFFF',
                    color: '#334155',
                    height: 34,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {STATUS_OPTIONS.find(o => o.value === selectedStatusFilter)?.dotColor && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: STATUS_OPTIONS.find(o => o.value === selectedStatusFilter).dotColor
                        }}
                      />
                    )}
                    <span>{STATUS_OPTIONS.find(o => o.value === selectedStatusFilter)?.label || 'Tất cả trạng thái'}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    color="#64748B"
                    style={{
                      transform: openDropdown === 'status' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}
                  />
                </button>

                {openDropdown === 'status' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      left: 0,
                      minWidth: 180,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                      padding: '5px',
                      zIndex: 100
                    }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSelectedStatusFilter(opt.value);
                          setCurrentPage(1);
                          setOpenDropdown(null);
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: '0.78rem',
                          color: selectedStatusFilter === opt.value ? '#059669' : '#334155',
                          background: selectedStatusFilter === opt.value ? '#ECFDF5' : 'transparent',
                          fontWeight: selectedStatusFilter === opt.value ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedStatusFilter !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (selectedStatusFilter !== opt.value) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {opt.dotColor && (
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                          )}
                          <span>{opt.label}</span>
                        </div>
                        {selectedStatusFilter === opt.value && <Check size={13} color="#059669" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#F8FAFC',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '4px 10px',
                  height: 34
                }}
              >
                <Search size={14} color="#94A3B8" />
                <input
                  type="text"
                  id="input-dashboard-table-search"
                  data-testid="input-dashboard-table-search"
                  placeholder="Tìm kiếm..."
                  value={searchFilter}
                  onChange={(e) => {
                    setSearchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.8rem',
                    color: '#0F172A',
                    outline: 'none',
                    width: 140
                  }}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ overflowX: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <table className="rental-table" id="dashboard-rental-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>GAME</th>
                  <th>TÀI KHOẢN</th>
                  <th>KHÁCH HÀNG</th>
                  <th>THỜI GIAN THUÊ</th>
                  <th>CÒN LẠI</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '44px 20px', color: '#64748B' }}>
                      <div style={{ fontSize: '32px', marginBottom: 10 }}>🎮</div>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#0F172A', marginBottom: 6 }}>
                        {selectedStatusFilter === 'active'
                          ? 'Hiện tại chưa có tài khoản nào đang được thuê'
                          : selectedStatusFilter === 'disputed'
                          ? 'Hiện tại không có ca thuê nào bị khiếu nại báo lỗi'
                          : 'Không có ca thuê nào phù hợp với bộ lọc'}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#94A3B8', maxWidth: 450, margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                        {selectedStatusFilter === 'active'
                          ? `Tất cả ${accounts.length} tài khoản game trong kho hiện đang ở trạng thái Sẵn Sàng. Khi khách hàng thuê tài khoản từ cửa hàng, phiên thuê sẽ lập tức xuất hiện tại đây theo thời gian thực.`
                          : 'Bạn có thể chọn lại bộ lọc trạng thái hoặc từ khóa tìm kiếm.'}
                      </p>
                      {selectedStatusFilter === 'active' && (
                        <button
                          type="button"
                          onClick={() => onNavigate('home')}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <Gamepad2 size={15} /> Đến Cửa Hàng Thuê Acc →
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedSession(row)}
                      style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                      title="Nhấp để mở bảng giám sát và điều phối phiên thuê này"
                    >
                      <td style={{ color: '#94A3B8', fontWeight: 600 }}>{row.id}</td>

                      {/* GAME */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: row.gameName.includes('Liên Quân')
                                ? '#0284C7'
                                : row.gameName.includes('Valorant')
                                ? '#EF4444'
                                : row.gameName.includes('Genshin')
                                ? '#8B5CF6'
                                : row.gameName.includes('FC') || row.gameName.includes('FO4')
                                ? '#10B981'
                                : row.gameName.includes('PUBG')
                                ? '#F59E0B'
                                : '#6366F1',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              flexShrink: 0
                            }}
                          >
                            {row.gameName.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>{row.gameName}</span>
                              <span style={{ fontSize: '0.64rem', color: '#94A3B8', background: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>
                                {row.rank}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {row.publisher}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TÀI KHOẢN */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {row.accountCode}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          Mật khẩu: ••••••••
                        </div>
                      </td>

                      {/* KHÁCH HÀNG */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                          {row.customerName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {row.customerCode}
                        </div>
                      </td>

                      {/* THỜI GIAN THUÊ */}
                      <td style={{ color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {row.rentalTime}
                      </td>

                      {/* CÒN LẠI */}
                      <td>
                        {row.isPill ? (
                          <span className="table-time-pill">{row.remainingText}</span>
                        ) : (
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: row.status === 'active' ? '#10B981' : '#0F172A'
                            }}
                          >
                            {row.remainingText}
                          </span>
                        )}
                      </td>

                      {/* TRẠNG THÁI */}
                      <td>
                        {row.status === 'disputed' ? (
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              color: '#E11D48',
                              background: '#FFF1F2',
                              padding: '4px 9px',
                              borderRadius: 6,
                              border: '1px solid #FECDD3',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E11D48' }} />
                            Báo lỗi ({row.disputeReason || 'Sự cố'})
                          </span>
                        ) : row.status === 'active' ? (
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.76rem',
                              color: '#059669',
                              background: '#ECFDF5',
                              padding: '4px 9px',
                              borderRadius: 6,
                              border: '1px solid #A7F3D0',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                            Đang thuê
                          </span>
                        ) : (
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.76rem',
                              color: '#475569',
                              background: '#F1F5F9',
                              padding: '4px 9px',
                              borderRadius: 6,
                              border: '1px solid #E2E8F0',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8' }} />
                            Đã hoàn tất
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {/* Giữ nguyên khung cố định đủ 5 hàng khi trang có ít hơn 5 tài khoản */}
                {pagedRows.length > 0 && pagedRows.length < PAGE_SIZE && (
                  Array.from({ length: PAGE_SIZE - pagedRows.length }).map((_, idx) => (
                    <tr
                      key={`empty-filler-row-${idx}`}
                      className="rental-table-filler-row"
                      style={{
                        height: 64,
                        pointerEvents: 'none',
                        background: 'transparent'
                      }}
                    >
                      <td colSpan={7} style={{ height: 64, padding: '14px 14px', borderBottom: idx === PAGE_SIZE - pagedRows.length - 1 ? 'none' : '1px solid var(--border-subtle)', color: 'transparent', userSelect: 'none' }}>
                        &nbsp;
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination: Cố định vị trí đáy */}
          <div className="table-pagination" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', background: '#FFFFFF' }}>
            <span>
              {filteredRows.length === 0 ? (
                selectedStatusFilter === 'active' ? '0 tài khoản đang thuê' : '0 ca thuê'
              ) : (
                <>
                  Hiển thị {(safeCurrentPage - 1) * PAGE_SIZE + 1} -{' '}
                  {Math.min(safeCurrentPage * PAGE_SIZE, filteredRows.length)} trong{' '}
                  {selectedStatusFilter === 'active'
                    ? `${filteredRows.length} tài khoản đang thuê`
                    : selectedStatusFilter === 'completed'
                    ? `${filteredRows.length} ca thuê đã hoàn tất`
                    : `${filteredRows.length} ca thuê`}
                </>
              )}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button
                type="button"
                className="pagination-btn"
                disabled={safeCurrentPage <= 1}
                style={{ opacity: safeCurrentPage <= 1 ? 0.4 : 1, cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer' }}
                onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`pagination-btn ${safeCurrentPage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                className="pagination-btn"
                disabled={safeCurrentPage >= totalPages}
                style={{ opacity: safeCurrentPage >= totalPages ? 0.4 : 1, cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: 3 WIDGETS ================= */}
        <div>
          {/* Widget 1: Thống kê game */}
          <div className="dashboard-widget-card" id="widget-game-stats">
            <div className="dashboard-widget-header">
              <div className="dashboard-widget-title">
                <BarChart2 size={16} color="#10B981" />
                <span>Thống kê game</span>
              </div>
              <div className="widget-segmented-toggle" id="toggle-game-stats-range">
                <button
                  type="button"
                  id="btn-game-stats-7d"
                  className={`widget-toggle-btn ${gameStatsRange === '7d' ? 'active' : ''}`}
                  onClick={() => setGameStatsRange('7d')}
                >
                  7 ngày
                </button>
                <button
                  type="button"
                  id="btn-game-stats-30d"
                  className={`widget-toggle-btn ${gameStatsRange === '30d' ? 'active' : ''}`}
                  onClick={() => setGameStatsRange('30d')}
                >
                  Tháng
                </button>
              </div>
            </div>

            {/* Danh sách thống kê game với Hover Tooltip */}
            {(() => {
              const gameStatsData = gameStatsRange === '7d' ? [
                {
                  id: 'valorant',
                  name: 'Valorant',
                  icon: Flame,
                  iconColor: '#EF4444',
                  barColor: '#EF4444',
                  count: 18,
                  pct: '37.5%',
                  revenue: '360.000đ',
                  activeOrders: 5,
                  trend: '+14.2% tuần này',
                  badge: 'Thịnh hành #1 🔥'
                },
                {
                  id: 'steam',
                  name: 'Steam',
                  icon: Shield,
                  iconColor: '#3B82F6',
                  barColor: '#3B82F6',
                  count: 16,
                  pct: '33.3%',
                  revenue: '320.000đ',
                  activeOrders: 4,
                  trend: '+8.5% ổn định',
                  badge: 'Phổ biến'
                },
                {
                  id: 'genshin',
                  name: 'Genshin Impact',
                  icon: Sparkles,
                  iconColor: '#06B6D4',
                  barColor: '#06B6D4',
                  count: 14,
                  pct: '29.2%',
                  revenue: '280.000đ',
                  activeOrders: 3,
                  trend: '+5.0% đều đặn',
                  badge: 'Yêu thích'
                }
              ] : [
                {
                  id: 'valorant',
                  name: 'Valorant',
                  icon: Flame,
                  iconColor: '#EF4444',
                  barColor: '#EF4444',
                  count: 85,
                  pct: '40.5%',
                  revenue: '1.700.000đ',
                  activeOrders: 24,
                  trend: '+22.4% tháng này',
                  badge: 'Thịnh hành #1 🔥'
                },
                {
                  id: 'steam',
                  name: 'Steam',
                  icon: Shield,
                  iconColor: '#3B82F6',
                  barColor: '#3B82F6',
                  count: 65,
                  pct: '31.0%',
                  revenue: '1.300.000đ',
                  activeOrders: 18,
                  trend: '+15.2% tháng này',
                  badge: 'Phổ biến'
                },
                {
                  id: 'genshin',
                  name: 'Genshin Impact',
                  icon: Sparkles,
                  iconColor: '#06B6D4',
                  barColor: '#06B6D4',
                  count: 60,
                  pct: '28.5%',
                  revenue: '1.200.000đ',
                  activeOrders: 15,
                  trend: '+11.8% tháng này',
                  badge: 'Yêu thích'
                }
              ];

              return gameStatsData.map((g) => {
                const IconComp = g.icon;
                const isHovered = hoveredGameId === g.id;

                return (
                  <div
                    key={g.id}
                    className="game-stat-row"
                    style={{
                      position: 'relative',
                      padding: '4px 6px',
                      borderRadius: 8,
                      background: isHovered ? '#F8FAFC' : 'transparent',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredGameId(g.id)}
                    onMouseLeave={() => setHoveredGameId(null)}
                  >
                    {/* Hover Tooltip cho Game Stats */}
                    {isHovered && (
                      <div className="widget-hover-tooltip" style={{ bottom: 'calc(100% + 2px)' }}>
                        <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: 2 }}>
                          {g.name} • {g.badge}
                        </div>
                        <div>Doanh thu: <strong>{g.revenue}</strong> ({g.count} tài khoản)</div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>
                          Tăng trưởng: {g.trend}
                        </div>
                      </div>
                    )}

                    <div className="game-stat-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IconComp size={14} color={g.iconColor} />
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{g.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#94A3B8', fontSize: '0.76rem' }}>
                          {g.count} tài khoản
                        </span>
                        <span style={{ fontWeight: 800, color: isHovered ? g.iconColor : '#0F172A', transition: 'color 0.15s' }}>
                          {g.pct}
                        </span>
                      </div>
                    </div>
                    <div className="game-progress-bar" style={{ height: isHovered ? 8 : 6, transition: 'height 0.15s' }}>
                      <div
                        className="game-progress-fill"
                        style={{
                          width: g.pct,
                          background: g.barColor,
                          boxShadow: isHovered ? `0 0 8px ${g.barColor}80` : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Widget 2: Biểu đồ doanh thu */}
          <div className="dashboard-widget-card" id="widget-revenue-chart">
            <div className="dashboard-widget-header">
              <div className="dashboard-widget-title">
                <TrendingUp size={16} color="#10B981" />
                <span>Biểu đồ doanh thu</span>
              </div>
              <div className="widget-segmented-toggle" id="toggle-revenue-chart-range">
                <button
                  type="button"
                  id="btn-revenue-range-7d"
                  className={`widget-toggle-btn ${revenueRange === '7d' ? 'active' : ''}`}
                  onClick={() => setRevenueRange('7d')}
                >
                  7 ngày qua
                </button>
                <button
                  type="button"
                  id="btn-revenue-range-month"
                  className={`widget-toggle-btn ${revenueRange === 'month' ? 'active' : ''}`}
                  onClick={() => setRevenueRange('month')}
                >
                  Tháng này
                </button>
              </div>
            </div>

            {/* Các cột biểu đồ với Hover Tooltip tương tác */}
            {(() => {
              const revenueBars = revenueRange === '7d' ? [
                { id: 0, date: '08/06', fullLabel: 'Thứ 2, 08/06', height: '35%', revenue: '45.000đ', orders: 3, trend: '+5%' },
                { id: 1, date: '09/06', fullLabel: 'Thứ 3, 09/06', height: '65%', revenue: '90.000đ', orders: 6, trend: '+12%' },
                { id: 2, date: '10/06', fullLabel: 'Thứ 4, 10/06', height: '45%', revenue: '60.000đ', orders: 4, trend: '+8%' },
                { id: 3, date: '11/06', fullLabel: 'Thứ 5, 11/06', height: '70%', revenue: '105.000đ', orders: 7, trend: '+15%' },
                { id: 4, date: '12/06', fullLabel: 'Thứ 6, 12/06', height: '55%', revenue: '75.000đ', orders: 5, trend: '+10%' },
                { id: 5, date: '13/06', fullLabel: 'Thứ 7, 13/06', height: '85%', revenue: '120.000đ', orders: 8, trend: '+18%' },
                { id: 6, date: '14/06', fullLabel: 'CN, 14/06 (Hôm nay)', height: '100%', revenue: '150.000đ', orders: 10, isPeak: true, trend: '+25% 🔥' },
              ] : [
                { id: 0, date: 'Tuần 1', fullLabel: 'Tuần 1 (01/06 - 07/06)', height: '50%', revenue: '450.000đ', orders: 28, trend: '+14%' },
                { id: 1, date: 'Tuần 2', fullLabel: 'Tuần 2 (08/06 - 14/06)', height: '75%', revenue: '680.000đ', orders: 42, trend: '+20%' },
                { id: 2, date: 'Tuần 3', fullLabel: 'Tuần 3 (15/06 - 21/06)', height: '60%', revenue: '540.000đ', orders: 35, trend: '+12%' },
                { id: 3, date: 'Tuần 4', fullLabel: 'Tuần 4 (22/06 - 30/06)', height: '95%', revenue: '890.000đ', orders: 56, isPeak: true, trend: '+28% 🚀' },
              ];

              return (
                <div className="revenue-bars-container" style={{ position: 'relative' }}>
                  {revenueBars.map((bar) => {
                    const isHovered = hoveredRevenueIndex === bar.id;

                    return (
                      <div
                        key={bar.id}
                        className="revenue-bar-col"
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredRevenueIndex(bar.id)}
                        onMouseLeave={() => setHoveredRevenueIndex(null)}
                      >
                        {/* Hover Tooltip nổi bật */}
                        {isHovered && (
                          <div className="widget-hover-tooltip">
                            <div style={{ fontWeight: 700, color: '#34D399', marginBottom: 2 }}>
                              {bar.fullLabel}
                            </div>
                            <div>Doanh thu: <strong>{bar.revenue}</strong></div>
                            <div>Đã xong: <strong>{bar.orders} đơn thuê</strong></div>
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>
                              {bar.trend}
                            </div>
                          </div>
                        )}

                        <div
                          className="revenue-bar-stick"
                          style={{
                            height: bar.height,
                            background: isHovered
                              ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
                              : bar.isPeak
                              ? '#6EE7B7'
                              : '#A7F3D0',
                            transform: isHovered ? 'scaleY(1.04)' : 'none',
                            boxShadow: isHovered ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none',
                            transformOrigin: 'bottom',
                            transition: 'all 0.18s ease'
                          }}
                        />
                        <div
                          className="revenue-bar-label"
                          style={{
                            color: isHovered ? '#059669' : '#94A3B8',
                            fontWeight: isHovered ? 800 : 600,
                            transition: 'color 0.15s'
                          }}
                        >
                          {bar.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Widget 3: Hoạt động gần đây */}
          <div className="dashboard-widget-card" id="widget-recent-activities" style={{ marginBottom: 0 }}>
            <div className="dashboard-widget-header">
              <div className="dashboard-widget-title">
                <Clock size={16} color="#10B981" />
                <span>Hoạt động gần đây</span>
              </div>
              <button
                type="button"
                id="btn-view-all-activities"
                data-testid="btn-view-all-activities"
                onClick={() => {
                  localStorage.setItem('gamerent_admin_initial_tab', 'activities');
                  onNavigate('reports');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#10B981',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  transition: 'color 0.15s ease'
                }}
              >
                <span>Xem tất cả</span>
                <span>→</span>
              </button>
            </div>

            {/* Khiếu nại sự cố khẩn cấp (Ưu tiên hiển thị nếu có) */}
            {pendingDisputes.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: 12,
                  background: '#FFF1F2',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid #FECDD3'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#FEE2E2',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  }}
                >
                  <AlertTriangle size={13} />
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#9F1239', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700 }}>
                    Khách {pendingDisputes[0].userName || pendingDisputes[0].userId} - Báo lỗi đơn #{pendingDisputes[0].orderId}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#BE123C', marginTop: 1 }}>
                    Lý do: &quot;{pendingDisputes[0].reason || pendingDisputes[0].note}&quot;
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-resolve-recent-dispute"
                  data-testid="btn-resolve-recent-dispute"
                  onClick={() => {
                    localStorage.setItem('gamerent_admin_initial_tab', 'disputes');
                    onNavigate('reports');
                  }}
                  style={{
                    border: 'none',
                    background: '#E11D48',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 3px rgba(225, 29, 72, 0.2)'
                  }}
                >
                  Xử lý ↗
                </button>
              </div>
            )}

            {/* Danh sách hoạt động thực tế với icon và logic nghiệp vụ phân loại */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {/* Hoạt động 1: Gia hạn ca thuê */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '4px 0',
                  borderBottom: '1px solid #F8FAFC'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1
                  }}
                >
                  <RefreshCw size={13} />
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong>Nguyễn Văn Hùng</strong> - Gia hạn tài khoản Valorant (+2h)
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Thanh toán qua số dư ví: 20.000đ</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  22:28
                </div>
              </div>

              {/* Hoạt động 2: Thuê mới tài khoản */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '4px 0',
                  borderBottom: '1px solid #F8FAFC'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    color: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1
                  }}
                >
                  <Gamepad2 size={13} />
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong>Quản Lý</strong> - Thuê tài khoản #ACC-LIE-709 (4h)
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Liên Quân Mobile - 60.000đ</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  21:45
                </div>
              </div>

              {/* Hoạt động 3: Hoàn tất ca thuê */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '4px 0',
                  borderBottom: '1px solid #F8FAFC'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#F1F5F9',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1
                  }}
                >
                  <CheckCircle2 size={13} />
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong>Phạm Tuấn Minh</strong> - Hoàn tất ca thuê #VNT#192
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Tự động thu hồi pass & kiểm tra an toàn</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  20:15
                </div>
              </div>

              {/* Hoạt động 4: Giao dịch nạp ví */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '4px 0'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#FFFBEB',
                    color: '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1
                  }}
                >
                  <DollarSign size={13} />
                </div>
                <div style={{ flex: 1, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong>Trần Phú Gia</strong> - Nạp tiền vào ví GameRent
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>+100.000đ qua VietQR</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  18:30
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL GIÁM SÁT & QUẢN TRỊ PHIÊN THUÊ ================= */}
      {selectedSession && (
        <div className="modal-overlay" id="modal-session-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-card" style={{ maxWidth: 540, borderRadius: 16, overflow: 'hidden', background: '#FFFFFF', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)' }}>
            <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8F8F0', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gamepad2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Giám Sát Phiên Thuê #{selectedSession.orderId || selectedSession.accountCode}
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0 }}>
                    Theo dõi trực tiếp thông tin tài khoản và điều phối phiên chơi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              {toastMessage && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, marginBottom: 14 }}>
                  {toastMessage}
                </div>
              )}

              {/* Status banner */}
              <div style={{
                background: selectedSession.status === 'disputed' ? '#FFF1F2' : selectedSession.status === 'active' ? '#ECFDF5' : '#F1F5F9',
                border: `1px solid ${selectedSession.status === 'disputed' ? '#FECDD3' : selectedSession.status === 'active' ? '#A7F3D0' : '#CBD5E1'}`,
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>TRẠNG THÁI PHIÊN CHƠI</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: selectedSession.status === 'disputed' ? '#E11D48' : selectedSession.status === 'active' ? '#059669' : '#334155' }}>
                    {selectedSession.status === 'disputed' ? `Báo Lỗi: ${selectedSession.disputeReason || 'Sự cố'}` : selectedSession.status === 'active' ? 'Khách đang trong trận (Active)' : 'Phiên thuê đã hoàn tất'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>THỜI GIAN CÒN LẠI</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 800, color: selectedSession.status === 'active' ? '#059669' : '#64748B' }}>
                    {selectedSession.remainingText}
                  </div>
                </div>
              </div>

              {/* 2-column info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Key size={14} color="#10B981" /> THÔNG TIN TÀI KHOẢN
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: 4 }}>
                    Game: <strong>{selectedSession.gameName}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: 4 }}>
                    Mã / Rank: <strong>{selectedSession.accountCode}</strong> ({selectedSession.rank})
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: 6, background: '#FFFFFF', padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>User: <code>{selectedSession.secretAccount}</code></div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedSession.secretAccount)}
                        title="Sao chép tên tài khoản"
                        style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 2 }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <div>Pass: <code>{showSecretPass ? selectedSession.secretPassword : '••••••••'}</code></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedSession.secretPassword)}
                          title="Sao chép mật khẩu"
                          style={{ background: 'none', border: 'none', color: copiedPass ? '#10B981' : '#64748B', cursor: 'pointer', padding: 2 }}
                        >
                          {copiedPass ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSecretPass(!showSecretPass)}
                          title={showSecretPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 2 }}
                        >
                          {showSecretPass ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} color="#3B82F6" /> KHÁCH THUÊ
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: 4 }}>
                    Họ tên: <strong>{selectedSession.customerName}</strong>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: 4 }}>
                    Mã KH: <code>{selectedSession.customerCode}</code>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: 4 }}>
                    Bắt đầu: {selectedSession.rentalTime}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>
                    Tiền thuê: {selectedSession.amount ? selectedSession.amount.toLocaleString('vi-VN') : '15.000'} đ
                  </div>
                </div>
              </div>

              {/* Banner khiếu nại nếu có */}
              {selectedSession.status === 'disputed' && (
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', padding: '10px 12px', borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: '0.78rem', color: '#9F1239', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={14} color="#E11D48" /> Đơn đang có khiếu nại báo lỗi từ khách hàng!
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#BE123C', marginTop: 3 }}>
                    Lý do báo lỗi: <strong>{selectedSession.disputeReason || 'Mật khẩu sai / Không đăng nhập được'}</strong>
                  </div>
                </div>
              )}

              {/* Action Buttons for Admin */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                {selectedSession.status === 'completed' ? (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.84rem', marginBottom: 2 }}>
                      ✓ Phiên thuê đã hoàn tất
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.76rem' }}>
                      Tài khoản game này đã được thu hồi an toàn và lưu trữ trong lịch sử giao dịch.
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B', marginBottom: 8 }}>
                      THAO TÁC NGHIỆP VỤ CỦA ADMIN:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleAdminExtend(selectedSession, 1)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'flex-start' }}
                      >
                        <PlusCircle size={15} color="#10B981" />
                        <span>Bù thêm giờ (+1h)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminRevoke(selectedSession)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'flex-start', color: '#B91C1C' }}
                      >
                        <Lock size={15} color="#EF4444" />
                        <span>Thu hồi & Đổi pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminMaintenance(selectedSession)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'flex-start' }}
                      >
                        <ShieldAlert size={15} color="#F59E0B" />
                        <span>Đưa vào bảo trì</span>
                      </button>

                      {selectedSession.status === 'disputed' ? (
                        <button
                          type="button"
                          onClick={() => handleAdminRefund(selectedSession)}
                          className="btn"
                          style={{ fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'flex-start', background: '#E11D48', color: '#FFFFFF', border: 'none' }}
                        >
                          <RotateCcw size={15} />
                          <span>Hoàn tiền & Đổi pass</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onNavigate('reports');
                            setSelectedSession(null);
                          }}
                          className="btn btn-primary"
                          style={{ fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'flex-start' }}
                        >
                          <AlertTriangle size={15} />
                          <span>Xem mục Khiếu Nại ↗</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Thu Hồi Đồng Bộ */}
      <ConfirmModal
        isOpen={Boolean(confirmRevokeSession)}
        onClose={() => setConfirmRevokeSession(null)}
        onConfirm={() => {
          if (!confirmRevokeSession) return;
          const res = returnRentalEarly(confirmRevokeSession.orderId);
          if (res && res.newPassword) {
            setToastMessage(`Đã thu hồi #${confirmRevokeSession.accountCode} & tự động đổi pass mới: ${res.newPassword} (Tài khoản: Sẵn sàng)!`);
          } else {
            setToastMessage(`Đã thu hồi tài khoản #${confirmRevokeSession.accountCode} và tự động đổi mật khẩu mới!`);
          }
          setTimeout(() => setToastMessage(''), 4000);
          setSelectedSession(null);
          setConfirmRevokeSession(null);
        }}
        title={`Thu Hồi Tài Khoản #${confirmRevokeSession?.accountCode}`}
        message={`Bạn có chắc chắn muốn thu hồi tài khoản #${confirmRevokeSession?.accountCode} và kết thúc phiên thuê của khách ${confirmRevokeSession?.customerName}?`}
        subMessage="Hệ thống sẽ tự động đổi mật khẩu ngẫu nhiên mới bảo vệ tài khoản và chuyển trạng thái về Sẵn sàng cho thuê."
        confirmText="Thu Hồi & Đổi Pass"
        cancelText="Hủy Bỏ"
        type="danger"
        icon={<LogOut size={20} strokeWidth={2.4} />}
      />
    </div>
  );
};
