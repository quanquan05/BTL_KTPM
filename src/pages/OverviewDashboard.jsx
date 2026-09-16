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
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OverviewDashboard = ({ onNavigate, onSelectAccount }) => {
  const {
    rentals,
    accounts,
    currentUser,
    disputes,
    extendRental,
    returnRentalEarly,
    toggleAccountStatus,
    resolveDispute
  } = useApp();
  const [selectedGameFilter, setSelectedGameFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSecretPass, setShowSecretPass] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null); // 'game' | 'status' | null

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
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang thuê', dotColor: '#10B981' },
    { value: 'disputed', label: 'Báo lỗi / Khiếu nại', dotColor: '#EF4444' },
    { value: 'completed', label: 'Đã hoàn tất', dotColor: '#94A3B8' }
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

  const pendingDisputes = disputes ? disputes.filter(d => d.status === 'pending') : [];
  const needChangePass = accounts ? accounts.filter(a => a.status === 'need_change_pass') : [];
  const urgentCount = pendingDisputes.length > 0 ? (pendingDisputes.length + needChangePass.length) : 7;

  // Live timer tick so remaining times update every second
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format remaining time nicely
  const formatRemaining = (endTime, defaultText) => {
    if (defaultText) return defaultText;
    if (!endTime) return '00:00:00';
    const diff = endTime - Date.now();
    if (diff <= 0) {
      const absSec = Math.floor(Math.abs(diff) / 1000);
      const h = String(Math.floor(absSec / 3600)).padStart(2, '0');
      const m = String(Math.floor((absSec % 3600) / 60)).padStart(2, '0');
      const s = String(absSec % 60).padStart(2, '0');
      return `-${h}:${m}:${s}`;
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
    if (window.confirm(`Thu hồi tài khoản ${session.accountCode} và kết thúc phiên thuê sớm?`)) {
      returnRentalEarly(session.orderId);
      setToastMessage(`Đã thu hồi tài khoản #${session.accountCode} và chuyển sang cần đổi mật khẩu!`);
      setTimeout(() => setToastMessage(''), 3000);
      setSelectedSession(null);
    }
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
      remainingText: r.status === 'disputed' ? 'Đang tạm dừng' : formatRemaining(r.endTime, r.remainingText),
      status: r.status, // 'active' | 'completed' | 'disputed'
      disputeReason: r.disputeReason,
      secretAccount: r.secretAccount || acc.secretAccount || 'lq_caothu_ngokhong',
      secretPassword: r.secretPassword || acc.secretPassword || 'PassKTPM#LQ99',
      endTime: r.endTime,
      isPill: r.status === 'active'
    };
  });

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
            Chào mừng trở lại, {currentUser?.name || 'Lê Minh Quân'} 👋
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
              15,000đ
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <span>↗ 12.5% so với tuần trước</span>
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
              2 <span style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600 }}>/ 8 tài khoản</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#3B82F6', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <span>↗ 8.3% so với hôm qua</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cảnh báo khẩn cấp */}
        <div className="stat-urgent-card" id="stat-card-urgent-alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Bell size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#E11D48', fontWeight: 700, marginBottom: 1 }}>
                Cảnh báo khẩn cấp
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E11D48', lineHeight: 1.2 }}>
                {urgentCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9F1239', fontWeight: 500, marginTop: 2 }}>
                {pendingDisputes.length > 0 
                  ? `${pendingDisputes.length} khiếu nại báo lỗi cần xử lý ngay!` 
                  : 'tài khoản sắp hết hạn / quá hạn'}
              </div>
            </div>
          </div>

          <button
            type="button"
            id="btn-urgent-details"
            data-testid="btn-urgent-details"
            onClick={() => onNavigate('reports')}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: '1px solid #FDA4AF',
              background: '#FFFFFF',
              color: '#E11D48',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(225, 29, 72, 0.1)'
            }}
          >
            <span>Xem chi tiết</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* ================= 2-COLUMN MAIN DASHBOARD GRID ================= */}
      <div className="dashboard-content-grid">
        {/* ================= LEFT COLUMN: DANH SÁCH TÀI KHOẢN THUÊ ================= */}
        <div className="rental-table-card">
          {/* Table Card Header */}
          <div className="rental-table-header">
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
                  justifyContent: 'center'
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
                    fontSize: '0.78rem',
                    color: '#0F172A',
                    outline: 'none',
                    width: 100
                  }}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="rental-table" id="dashboard-rental-table">
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
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                      Không có phiên thuê nào phù hợp với bộ lọc.
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
                                ? '#06B6D4'
                                : row.gameName.includes('Online') || row.gameName.includes('FO4')
                                ? '#10B981'
                                : row.gameName.includes('PUBG')
                                ? '#F59E0B'
                                : '#6366F1',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              flexShrink: 0
                            }}
                          >
                            {row.gameName.includes('Liên Quân')
                              ? 'C'
                              : row.gameName.includes('Valorant')
                              ? 'V'
                              : row.gameName.includes('Genshin')
                              ? 'G'
                              : row.gameName.includes('Online') || row.gameName.includes('FO4')
                              ? 'F'
                              : row.gameName.includes('PUBG')
                              ? 'P'
                              : 'T'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>
                              {row.gameName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                              {row.publisher}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TÀI KHOẢN */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                          {row.accountCode}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                          {row.rank}
                        </div>
                      </td>

                      {/* KHÁCH HÀNG */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                          {row.customerName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
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
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="table-pagination">
            <span>
              Hiển thị {filteredRows.length > 0 ? (safeCurrentPage - 1) * PAGE_SIZE + 1 : 0} -{' '}
              {Math.min(safeCurrentPage * PAGE_SIZE, filteredRows.length)} trong {filteredRows.length} tài khoản thuê
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
              <select
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>

            {/* Item 1: Valorant */}
            <div className="game-stat-row">
              <div className="game-stat-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Flame size={14} color="#EF4444" />
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Valorant</span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', fontSize: '0.76rem', marginRight: 8 }}>18 tài khoản</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>37.5%</span>
                </div>
              </div>
              <div className="game-progress-bar">
                <div className="game-progress-fill" style={{ width: '37.5%', background: '#EF4444' }} />
              </div>
            </div>

            {/* Item 2: Steam */}
            <div className="game-stat-row">
              <div className="game-stat-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={14} color="#3B82F6" />
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Steam</span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', fontSize: '0.76rem', marginRight: 8 }}>16 tài khoản</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>33.3%</span>
                </div>
              </div>
              <div className="game-progress-bar">
                <div className="game-progress-fill" style={{ width: '33.3%', background: '#3B82F6' }} />
              </div>
            </div>

            {/* Item 3: Genshin Impact */}
            <div className="game-stat-row" style={{ marginBottom: 4 }}>
              <div className="game-stat-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="#06B6D4" />
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Genshin Impact</span>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', fontSize: '0.76rem', marginRight: 8 }}>14 tài khoản</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>29.2%</span>
                </div>
              </div>
              <div className="game-progress-bar">
                <div className="game-progress-fill" style={{ width: '29.2%', background: '#06B6D4' }} />
              </div>
            </div>
          </div>

          {/* Widget 2: Biểu đồ doanh thu */}
          <div className="dashboard-widget-card" id="widget-revenue-chart">
            <div className="dashboard-widget-header">
              <div className="dashboard-widget-title">
                <TrendingUp size={16} color="#10B981" />
                <span>Biểu đồ doanh thu</span>
              </div>
              <select
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option>7 ngày qua</option>
                <option>Tháng này</option>
              </select>
            </div>

            {/* 7 Vertical Bar Columns matching the screenshot */}
            <div className="revenue-bars-container">
              {[
                { date: '08/06', height: '35%' },
                { date: '09/06', height: '65%' },
                { date: '10/06', height: '45%' },
                { date: '11/06', height: '70%' },
                { date: '12/06', height: '55%' },
                { date: '13/06', height: '85%' },
                { date: '14/06', height: '100%' },
              ].map((bar, i) => (
                <div key={i} className="revenue-bar-col" title={`${bar.date}: Doanh thu cao`}>
                  <div
                    className="revenue-bar-stick"
                    style={{
                      height: bar.height,
                      background: bar.height === '100%' ? '#6EE7B7' : '#A7F3D0'
                    }}
                  />
                  <div className="revenue-bar-label">{bar.date}</div>
                </div>
              ))}
            </div>
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
                onClick={() => onNavigate('reports')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#10B981',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <span>Xem tất cả</span>
                <span>→</span>
              </button>
            </div>

            {/* Khiếu nại sự cố mới nhất nếu có */}
            {pendingDisputes.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, background: '#FFF1F2', padding: '10px 12px', borderRadius: 10, border: '1px solid #FECDD3' }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#FEE2E2',
                    color: '#E11D48',
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
                  <strong>Khách hàng {pendingDisputes[0].userName || pendingDisputes[0].userId}</strong> - Báo lỗi đơn #{pendingDisputes[0].orderId} ({pendingDisputes[0].reason})
                  <div style={{ fontSize: '0.72rem', color: '#BE123C', marginTop: 2 }}>&quot;{pendingDisputes[0].note}&quot;</div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('reports')}
                  style={{
                    border: 'none',
                    background: '#E11D48',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Xử lý ↗
                </button>
              </div>
            )}

            {/* Activity Item 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
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
                  marginTop: 2
                }}
              >
                <RefreshCw size={13} />
              </div>
              <div style={{ flex: 1, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                <strong>Khách hàng Nguyễn Văn Hùng</strong> - Gia hạn tài khoản Valorant (2h)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                - 22:28
              </div>
            </div>

            {/* Activity Item 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
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
                  marginTop: 2
                }}
              >
                <AlertTriangle size={13} />
              </div>
              <div style={{ flex: 1, fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                <strong>Tài khoản GI_Asia_728</strong> - Gia hạn hết hạn (6h)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                - 21:45
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
