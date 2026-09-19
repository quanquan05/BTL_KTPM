import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Check,
  X,
  Trash2,
  Edit3,
  DollarSign,
  Clock,
  RefreshCw,
  CheckCircle2,
  Activity,
  Filter,
  Search,
  ArrowUpRight,
  Wallet,
  ArrowDownLeft,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Tag,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminDashboardPage = ({ initialTab = 'disputes' }) => {
  const {
    accounts,
    categories,
    rentals,
    disputes,
    transactions,
    addAccount,
    updateAccount,
    toggleAccountStatus,
    deleteAccount,
    resolveDispute
  } = useApp();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('gamerent_admin_initial_tab') || initialTab;
  });
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isAddingAcc, setIsAddingAcc] = useState(false);

  // State cho Sửa Tài Khoản
  const [editingAcc, setEditingAcc] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGameId, setEditGameId] = useState('lien-quan');
  const [editRank, setEditRank] = useState('');
  const [editPricePerHour, setEditPricePerHour] = useState(15000);
  const [editSecretAccount, setEditSecretAccount] = useState('');
  const [editSecretPassword, setEditSecretPassword] = useState('');
  const [editSkinsList, setEditSkinsList] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('available');
  const [showEditSecretPass, setShowEditSecretPass] = useState(false);

  const handleOpenEditModal = (acc) => {
    setEditingAcc(acc);
    setEditTitle(acc.title || '');
    setEditGameId(acc.gameId || 'lien-quan');
    setEditRank(acc.rank || '');
    setEditPricePerHour(acc.pricePerHour || 15000);
    setEditSecretAccount(acc.secretAccount || '');
    setEditSecretPassword(acc.secretPassword || '');
    setEditSkinsList(Array.isArray(acc.highlightSkins) ? acc.highlightSkins.join(', ') : (acc.highlightSkins || ''));
    setEditDescription(acc.description || '');
    setEditStatus(acc.status || 'available');
    setShowEditSecretPass(false);
    setIsEditGameDropdownOpen(false);
    setIsEditStatusDropdownOpen(false);
  };

  const handleSaveEditAccount = (e) => {
    e.preventDefault();
    if (!editingAcc) return;
    const skinsArr = editSkinsList
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateAccount(editingAcc.id, {
      title: editTitle,
      gameId: editGameId,
      rank: editRank,
      pricePerHour: Number(editPricePerHour) || editingAcc.pricePerHour,
      secretAccount: editSecretAccount,
      secretPassword: editSecretPassword,
      highlightSkins: skinsArr,
      description: editDescription,
      status: editStatus
    });

    setEditingAcc(null);
  };

  // Dropdown states & password visibility
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isEditGameDropdownOpen, setIsEditGameDropdownOpen] = useState(false);
  const [isEditStatusDropdownOpen, setIsEditStatusDropdownOpen] = useState(false);
  const [openRowStatusAccId, setOpenRowStatusAccId] = useState(null);
  const [showSecretPassInModal, setShowSecretPassInModal] = useState(false);

  // Trạng thái tài khoản chuẩn với màu sắc đồng bộ
  const ACCOUNT_STATUS_OPTIONS = [
    { value: 'available', label: 'Sẵn sàng', fullLabel: 'Sẵn sàng cho thuê', dotColor: '#10B981', bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    { value: 'rented', label: 'Đang thuê', fullLabel: 'Đang thuê', dotColor: '#3B82F6', bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    { value: 'maintenance', label: 'Bảo trì', fullLabel: 'Đang bảo trì', dotColor: '#F59E0B', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    { value: 'need_change_pass', label: 'Cần đổi pass', fullLabel: 'Cần đổi mật khẩu', dotColor: '#EF4444', bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
  ];

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#container-new-game-dropdown')) {
        setIsGameDropdownOpen(false);
      }
      if (!e.target.closest('#container-edit-game-dropdown')) {
        setIsEditGameDropdownOpen(false);
      }
      if (!e.target.closest('#container-edit-status-dropdown')) {
        setIsEditStatusDropdownOpen(false);
      }
      if (!e.target.closest('.account-row-status-container')) {
        setOpenRowStatusAccId(null);
      }
      if (!e.target.closest('#container-admin-activity-filter')) {
        setIsActivityDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Bộ lọc cho tab Lịch sử hoạt động hệ thống
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'rent' | 'extend' | 'deposit' | 'dispute' | 'completed'
  const [activitySearch, setActivitySearch] = useState('');
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);

  const ACTIVITY_OPTIONS = [
    { value: 'all', label: 'Tất cả hoạt động', dotColor: '#10B981' },
    { value: 'rent', label: 'Thuê mới acc', dotColor: '#3B82F6' },
    { value: 'extend', label: 'Gia hạn thời gian', dotColor: '#8B5CF6' },
    { value: 'deposit', label: 'Khách nạp tiền', dotColor: '#10B981' },
    { value: 'dispute', label: 'Khiếu nại / Báo lỗi', dotColor: '#EF4444' },
    { value: 'completed', label: 'Hoàn tất & Trả acc', dotColor: '#64748B' }
  ];

  useEffect(() => {
    const savedTab = localStorage.getItem('gamerent_admin_initial_tab');
    if (savedTab) {
      setActiveTab(savedTab);
      localStorage.removeItem('gamerent_admin_initial_tab');
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Form state thêm tài khoản
  const [newGameId, setNewGameId] = useState('lien-quan');
  const [newTitle, setNewTitle] = useState('');
  const [newRank, setNewRank] = useState('');
  const [newPrice, setNewPrice] = useState(15000);
  const [newSkinsCount, setNewSkinsCount] = useState(50);
  const [newSkinsList, setNewSkinsList] = useState('');
  const [newSecretAccount, setNewSecretAccount] = useState('');
  const [newSecretPassword, setNewSecretPassword] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Tính toán số liệu thống kê
  const totalRevenue = transactions
    .filter(t => t.type === 'rental_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const activeRentalsCount = rentals.filter(r => r.status === 'active').length;
  const pendingDisputesCount = disputes.filter(d => d.status === 'pending').length;

  const handleAddAccountSubmit = (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!newTitle || !newSecretAccount || !newSecretPassword) {
      setAddError('Vui lòng điền đầy đủ tiêu đề, tài khoản và mật khẩu.');
      return;
    }

    const skinsArr = newSkinsList.split(',').map(s => s.trim()).filter(Boolean);

    const res = addAccount({
      gameId: newGameId,
      title: newTitle,
      rank: newRank || 'Chưa xếp hạng',
      server: 'Việt Nam',
      skinsCount: Number(newSkinsCount) || 0,
      highlightSkins: skinsArr.length > 0 ? skinsArr : ['Skin mặc định'],
      pricePerHour: Number(newPrice) || 10000,
      secretAccount: newSecretAccount,
      secretPassword: newSecretPassword,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      winRate: '60.0%',
      description: 'Tài khoản mới thêm bởi Quản trị viên hệ thống.'
    });

    if (res.success) {
      setAddSuccess('Thêm tài khoản mới thành công!');
      setTimeout(() => {
        setIsAddingAcc(false);
        setAddSuccess('');
        setNewTitle('');
        setNewSecretAccount('');
        setNewSecretPassword('');
        setNewSkinsList('');
      }, 1000);
    }
  };

  // Danh sách toàn bộ hoạt động của hệ thống (Thuê acc, Gia hạn, Nạp tiền ví, Khiếu nại, Hoàn tất đơn)
  const baseActivities = [
    // 1. Gia hạn ca thuê
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
    // 2. Nạp tiền ví
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
    // 3. Đơn thuê từ rentals trong AppContext
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
    // 4. Ca thuê đã kết thúc và thu hồi mật khẩu
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
    // 5. Nạp tiền từ transactions trong AppContext
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
    // 6. Khiếu nại từ disputes trong AppContext
    ...disputes.map(d => ({
      id: `ACT-DISP-${d.id}`,
      type: 'dispute',
      actionName: 'Báo lỗi / Khiếu nại',
      customerName: d.userName || (d.userId === 'USER-01' ? 'Nguyễn Văn Admin' : (d.userId || 'Hoàng Mai Trang')),
      customerCode: '#KH006',
      target: `Đơn #${d.orderId} - Acc #${d.accountId}`,
      details: `Lý do: "${d.reason || d.note}"`,
      amount: -(d.amount || 0),
      timeText: 'Hôm qua 21:00',
      timestamp: d.createdAt || Date.now(),
      status: d.status === 'pending' ? 'Chờ duyệt' : 'Đã giải quyết',
      statusColor: d.status === 'pending' ? '#EF4444' : '#10B981'
    }))
  ];

  // Sắp xếp thời gian giảm dần
  const allActivities = [...baseActivities].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Lọc hoạt động theo type và search keyword
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

  // Thống kê nhanh cho tab Lịch sử
  const totalDepositAmount = allActivities
    .filter(a => a.type === 'deposit')
    .reduce((sum, a) => sum + Math.abs(a.amount), 0);

  const totalRentExtensionsCount = allActivities.filter(a => a.type === 'extend').length;
  const totalRentNewCount = allActivities.filter(a => a.type === 'rent').length;

  return (
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>
            <ShieldCheck size={13} /> QUẢN TRỊ VIÊN HỆ THỐNG
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>Báo Cáo & Quản Trị Hệ Thống</h1>
        </div>

        <button
          type="button"
          id="btn-admin-add-account"
          data-testid="btn-admin-add-account"
          onClick={() => setIsAddingAcc(true)}
          className="btn btn-primary"
          style={{ padding: '7px 14px', fontSize: '0.84rem' }}
        >
          <Plus size={15} /> Thêm Tài Khoản Mới
        </button>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 20
        }}
      >
        <div className="glass-panel" style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Doanh Thu Thuê</span>
            <DollarSign size={15} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Acc Đang Thuê</span>
            <Clock size={15} color="var(--accent-green-text)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green-text)' }}>
            {activeRentalsCount} tài khoản
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Tổng Kho Acc</span>
            <Gamepad2 size={15} color="var(--text-subtle)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {accounts.length} acc
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Khiếu Nại Chờ Duyệt</span>
            <AlertTriangle size={15} color={pendingDisputesCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)'} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pendingDisputesCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {pendingDisputesCount} đơn
          </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div style={{ marginBottom: 16 }}>
        <div className="segmented-nav" style={{ flexWrap: 'wrap', gap: 4 }}>
          {/* Tab 4 Mới: Lịch Sử Hoạt Động Toàn Trang */}
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
            id="tab-admin-accounts"
            onClick={() => setActiveTab('accounts')}
            className={`segmented-nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
          >
            Kho Tài Khoản ({accounts.length})
          </button>

          <button
            type="button"
            id="tab-admin-disputes"
            onClick={() => setActiveTab('disputes')}
            className={`segmented-nav-btn ${activeTab === 'disputes' ? 'active' : ''}`}
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <span>Xử Lý Khiếu Nại</span>
            {pendingDisputesCount > 0 && (
              <span style={{ background: 'var(--accent-red)', color: '#fff', fontSize: '0.64rem', fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>
                {pendingDisputesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            id="tab-admin-orders"
            onClick={() => setActiveTab('orders')}
            className={`segmented-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          >
            Giám Sát Đơn ({rentals.length})
          </button>
        </div>
      </div>

      {/* ================= TAB 1: KHO ACC ================= */}
      {activeTab === 'accounts' && (
        <div className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Mã Acc</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tựa Game</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tiêu Đề & Rank</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Giá Thuê</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tài Khoản / Mật Khẩu</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Trạng Thái</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600 }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, index) => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>
                      #{acc.id}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                      {categories.find(c => c.id === acc.gameId)?.name || acc.gameId}
                    </td>
                    <td style={{ padding: '10px 14px', maxWidth: 220 }}>
                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {acc.title}
                      </div>
                      <span className="badge badge-rank" style={{ marginTop: 2 }}>{acc.rank}</span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--primary)' }}>
                      {acc.pricePerHour.toLocaleString('vi-VN')} đ/h
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <div>User: {acc.secretAccount}</div>
                      <div>Pass: {acc.secretPassword}</div>
                    </td>
                    <td style={{ padding: '10px 14px', position: 'relative' }} className="account-row-status-container">
                      {(() => {
                        const currentStatusObj = ACCOUNT_STATUS_OPTIONS.find(o => o.value === acc.status) || ACCOUNT_STATUS_OPTIONS[0];
                        const isOpen = openRowStatusAccId === acc.id;
                        const isNearBottom = index >= accounts.length - 2 && accounts.length > 3;
                        return (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              type="button"
                              id={`btn-row-status-${acc.id}`}
                              onClick={() => setOpenRowStatusAccId(isOpen ? null : acc.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '4px 10px',
                                borderRadius: 20,
                                fontSize: '0.76rem',
                                fontWeight: 600,
                                background: currentStatusObj.bg,
                                color: currentStatusObj.text,
                                border: `1px solid ${currentStatusObj.border}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: isOpen ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none'
                              }}
                            >
                              <span
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  background: currentStatusObj.dotColor,
                                  boxShadow: `0 0 5px ${currentStatusObj.dotColor}`
                                }}
                              />
                              <span>{currentStatusObj.label}</span>
                              <ChevronDown
                                size={12}
                                style={{
                                  transform: isOpen ? 'rotate(180deg)' : 'none',
                                  transition: 'transform 0.18s ease',
                                  opacity: 0.7
                                }}
                              />
                            </button>

                            {/* Hidden native select for test automation & form binding */}
                            <select
                              id={`select-status-${acc.id}`}
                              data-testid={`select-status-${acc.id}`}
                              value={acc.status}
                              onChange={(e) => toggleAccountStatus(acc.id, e.target.value)}
                              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                              tabIndex={-1}
                            >
                              {ACCOUNT_STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>

                            {isOpen && (
                              <div
                                style={{
                                  position: 'absolute',
                                  ...(isNearBottom
                                    ? { bottom: 'calc(100% + 5px)' }
                                    : { top: 'calc(100% + 5px)' }),
                                  left: 0,
                                  minWidth: 140,
                                  background: '#FFFFFF',
                                  border: '1px solid #E2E8F0',
                                  borderRadius: 10,
                                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                  padding: '5px',
                                  zIndex: 200
                                }}
                              >
                                {ACCOUNT_STATUS_OPTIONS.map((opt) => (
                                  <div
                                    key={opt.value}
                                    id={`opt-status-${acc.id}-${opt.value}`}
                                    onClick={() => {
                                      toggleAccountStatus(acc.id, opt.value);
                                      setOpenRowStatusAccId(null);
                                    }}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: 6,
                                      fontSize: '0.78rem',
                                      color: acc.status === opt.value ? opt.text : '#334155',
                                      background: acc.status === opt.value ? opt.bg : 'transparent',
                                      fontWeight: acc.status === opt.value ? 700 : 500,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (acc.status !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (acc.status !== opt.value) e.currentTarget.style.background = 'transparent';
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                                      <span>{opt.label}</span>
                                    </div>
                                    {acc.status === opt.value && <Check size={13} color={opt.text} />}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          id={`btn-edit-acc-${acc.id}`}
                          data-testid={`btn-edit-acc-${acc.id}`}
                          onClick={() => handleOpenEditModal(acc)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Sửa thông tin tài khoản"
                        >
                          <Edit3 size={12} /> Sửa
                        </button>
                        <button
                          type="button"
                          id={`btn-delete-acc-${acc.id}`}
                          data-testid={`btn-delete-acc-${acc.id}`}
                          onClick={() => setAccountToDelete(acc)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Xóa tài khoản"
                        >
                          <Trash2 size={12} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: XỬ LÝ KHIẾU NẠI ================= */}
      {activeTab === 'disputes' && (
        <div>
          {disputes.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '36px 20px', borderRadius: 12, background: '#FFFFFF' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>✅</div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 2 }}>Không có khiếu nại nào</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>Tất cả các phiên thuê đều hoạt động ổn định!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {disputes.map((disp) => (
                <div
                  key={disp.id}
                  id={`dispute-card-${disp.id}`}
                  data-testid={`dispute-card-${disp.id}`}
                  className="glass-panel"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 10,
                    padding: 14,
                    border: disp.status === 'pending' ? '1px solid var(--accent-red-border)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--accent-red-text)', fontWeight: 700 }}>
                        Khiếu Nại #{disp.id} • Đơn Thuê #{disp.orderId}
                      </span>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                        Lý do: {disp.reason}
                      </h4>
                    </div>

                    <div>
                      {disp.status === 'pending' ? (
                        <span className="badge badge-rented">Chờ giải quyết</span>
                      ) : disp.status === 'resolved' ? (
                        <span className="badge badge-available">Đã hoàn tiền</span>
                      ) : (
                        <span className="badge badge-maintenance">Đã từ chối</span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: 8, borderRadius: 6, fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                    <div><strong>Nội dung:</strong> {disp.note}</div>
                    <div style={{ marginTop: 2, fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                      Số tiền hoàn: <strong style={{ color: 'var(--primary)' }}>{disp.amount?.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  </div>

                  {disp.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        id={`btn-reject-dispute-${disp.id}`}
                        data-testid={`btn-reject-dispute-${disp.id}`}
                        onClick={() => resolveDispute(disp.id, 'reject')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      >
                        <X size={13} /> Bác Bỏ
                      </button>

                      <button
                        type="button"
                        id={`btn-refund-dispute-${disp.id}`}
                        data-testid={`btn-refund-dispute-${disp.id}`}
                        onClick={() => resolveDispute(disp.id, 'refund')}
                        className="btn btn-success"
                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      >
                        <Check size={13} /> Chấp Nhận & Hoàn 100%
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: GIÁM SÁT ĐƠN ================= */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Mã Đơn</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tài Khoản</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Khách Thuê</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Thời Lượng</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tổng Tiền</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>#{r.id}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.accountTitle}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{r.userId}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{r.durationHours} giờ</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>{r.totalPrice.toLocaleString('vi-VN')} đ</td>
                    <td style={{ padding: '10px 14px' }}>
                      {r.status === 'active' ? (
                        <span className="badge badge-rented">Đang chơi</span>
                      ) : r.status === 'completed' ? (
                        <span className="badge badge-available">Đã trả</span>
                      ) : (
                        <span className="badge badge-maintenance">Khiếu nại</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LỊCH SỬ HOẠT ĐỘNG TOÀN TRANG ================= */}
      {activeTab === 'activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Thanh bộ lọc & Tìm kiếm đồng bộ với toàn trang */}
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
              gap: 12
            }}
          >
            {/* Custom Dropdown: Trạng thái hoạt động */}
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
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: ACTIVITY_OPTIONS.find(o => o.value === activityFilter)?.dotColor || '#10B981'
                    }}
                  />
                  <span>{ACTIVITY_OPTIONS.find(o => o.value === activityFilter)?.label || 'Tất cả hoạt động'}</span>
                </div>
                <ChevronDown
                  size={14}
                  color="#64748B"
                  style={{
                    transform: isActivityDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.18s ease'
                  }}
                />
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
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                    padding: '5px',
                    zIndex: 100
                  }}
                >
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      id={`option-activity-${opt.value}`}
                      onClick={() => {
                        setActivityFilter(opt.value);
                        setIsActivityDropdownOpen(false);
                      }}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 6,
                        fontSize: '0.78rem',
                        color: activityFilter === opt.value ? '#059669' : '#334155',
                        background: activityFilter === opt.value ? '#ECFDF5' : 'transparent',
                        fontWeight: activityFilter === opt.value ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (activityFilter !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (activityFilter !== opt.value) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                        <span>{opt.label}</span>
                      </div>
                      {activityFilter === opt.value && <Check size={13} color="#059669" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ô tìm kiếm */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#F8FAFC',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '4px 10px',
                height: 34,
                minWidth: 260
              }}
            >
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                id="input-search-activities"
                data-testid="input-search-activities"
                placeholder="Tìm khách hàng, mã đơn, tựa game..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.8rem',
                  color: '#0F172A',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Bảng Nhật Ký Hoạt Động Chi Tiết */}
          <div className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600, width: 140 }}>Thời Gian</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, width: 150 }}>Loại Hoạt Động</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, width: 170 }}>Khách Hàng</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Tài Khoản & Chi Tiết Hoạt Động</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right', width: 140 }}>Biến Động Tiền</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center', width: 120 }}>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-subtle)' }}>
                        Không có hoạt động nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act) => {
                      const isDeposit = act.type === 'deposit';
                      const isExtend = act.type === 'extend';
                      const isDispute = act.type === 'dispute';
                      const isRent = act.type === 'rent';

                      return (
                        <tr key={act.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          {/* Thời gian */}
                          <td style={{ padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.timeText}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>{act.id}</div>
                          </td>

                          {/* Loại Hoạt Động */}
                          <td style={{ padding: '10px 14px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: isDeposit
                                  ? '#ECFDF5'
                                  : isExtend
                                  ? '#F3E8FF'
                                  : isDispute
                                  ? '#FFF1F2'
                                  : isRent
                                  ? '#EFF6FF'
                                  : '#F1F5F9',
                                color: isDeposit
                                  ? '#059669'
                                  : isExtend
                                  ? '#7C3AED'
                                  : isDispute
                                  ? '#E11D48'
                                  : isRent
                                  ? '#2563EB'
                                  : '#475569'
                              }}
                            >
                              {isDeposit && <ArrowDownLeft size={12} />}
                              {isExtend && <RefreshCw size={12} />}
                              {isDispute && <AlertTriangle size={12} />}
                              {isRent && <Gamepad2 size={12} />}
                              {act.type === 'completed' && <CheckCircle2 size={12} />}
                              {act.actionName}
                            </span>
                          </td>

                          {/* Khách hàng */}
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{act.customerName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{act.customerCode}</div>
                          </td>

                          {/* Chi tiết tài khoản / dịch vụ */}
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>
                              {act.target}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              {act.details}
                            </div>
                          </td>

                          {/* Biến động tiền */}
                          <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {act.amount > 0 ? (
                              <span style={{ fontWeight: 800, color: '#10B981' }}>
                                +{act.amount.toLocaleString('vi-VN')} đ
                              </span>
                            ) : act.amount < 0 ? (
                              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                {act.amount.toLocaleString('vi-VN')} đ
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-subtle)' }}>0 đ</span>
                            )}
                          </td>

                          {/* Trạng thái */}
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 10,
                                background: `${act.statusColor}18`,
                                color: act.statusColor,
                                border: `1px solid ${act.statusColor}30`
                              }}
                            >
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isAddingAcc && (() => {
        const selectedCategoryObj = categories.find(c => c.id === newGameId) || categories[0];

        return (
          <div
            className="modal-overlay"
            id="modal-add-account-overlay"
            data-testid="modal-add-account"
            style={{
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(5px)'
            }}
          >
            <div
              className="modal-card"
              style={{
                maxWidth: 580,
                borderRadius: 16,
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                animation: 'slideUp 0.18s ease-out',
                position: 'relative'
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header"
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'var(--primary-light)',
                      border: '1px solid var(--primary-border)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      Thêm Tài Khoản Mới Vào Kho
                    </h3>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      Đăng ký tài khoản game vào hệ thống cho thuê tự động của GameRent
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingAcc(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    padding: 6,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddAccountSubmit}>
                <div className="modal-body" style={{ padding: '20px' }}>
                  {addError && (
                    <div
                      style={{
                        background: '#FFF1F2',
                        border: '1px solid #FECDD3',
                        color: '#E11D48',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <AlertTriangle size={14} />
                      <span>{addError}</span>
                    </div>
                  )}

                  {addSuccess && (
                    <div
                      style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        marginBottom: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <CheckCircle2 size={15} />
                      <span>{addSuccess}</span>
                    </div>
                  )}

                  {/* Row 1: Game & Rank */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 14 }}>
                    {/* Custom Game Dropdown */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Tag size={13} color="var(--primary)" /> Tựa Game
                      </label>
                      <div id="container-new-game-dropdown" style={{ position: 'relative' }}>
                        <button
                          type="button"
                          id="btn-select-new-game"
                          onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '7px 12px',
                            borderRadius: 8,
                            border: isGameDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                            background: '#FFFFFF',
                            color: 'var(--text-main)',
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            height: 38,
                            boxShadow: isGameDropdownOpen ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: selectedCategoryObj?.badgeColor || 'var(--primary)',
                                boxShadow: `0 0 6px ${selectedCategoryObj?.badgeColor || 'var(--primary)'}`
                              }}
                            />
                            <span style={{ fontWeight: 600 }}>{selectedCategoryObj?.name || 'Chọn tựa game'}</span>
                            {selectedCategoryObj?.publisher && (
                              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>({selectedCategoryObj.publisher})</span>
                            )}
                          </div>
                          <ChevronDown
                            size={14}
                            color="#64748B"
                            style={{
                              transform: isGameDropdownOpen ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.18s ease'
                            }}
                          />
                        </button>

                        {/* Hidden native select to preserve test automation & form binding */}
                        <select
                          id="input-new-game-id"
                          data-testid="input-new-game-id"
                          value={newGameId}
                          onChange={(e) => setNewGameId(e.target.value)}
                          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                          tabIndex={-1}
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        {/* Custom Dropdown Popup List */}
                        {isGameDropdownOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: 0,
                              right: 0,
                              background: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: 12,
                              boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.15), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
                              padding: '6px',
                              zIndex: 1000,
                              animation: 'slideUp 0.15s ease'
                            }}
                          >
                            <div style={{ padding: '4px 8px 6px 8px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Chọn tựa game
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 220, overflowY: 'auto' }}>
                              {categories.map(c => {
                                const isSelected = newGameId === c.id;
                                return (
                                  <div
                                    key={c.id}
                                    onClick={() => {
                                      setNewGameId(c.id);
                                      setIsGameDropdownOpen(false);
                                    }}
                                    style={{
                                      padding: '8px 10px',
                                      borderRadius: 8,
                                      background: isSelected ? '#ECFDF5' : 'transparent',
                                      color: isSelected ? '#059669' : '#1E293B',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      transition: 'all 0.12s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span
                                        style={{
                                          width: 8,
                                          height: 8,
                                          borderRadius: '50%',
                                          background: c.badgeColor || '#10B981'
                                        }}
                                      />
                                      <div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: isSelected ? 700 : 500 }}>{c.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: isSelected ? '#047857' : '#94A3B8' }}>{c.publisher}</div>
                                      </div>
                                    </div>
                                    {isSelected && <Check size={14} color="#10B981" strokeWidth={2.5} />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rank Input with Quick Suggestions */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>
                        Mức Rank
                      </label>
                      <input
                        type="text"
                        id="input-new-rank"
                        data-testid="input-new-rank"
                        className="form-input"
                        placeholder="VD: Cao Thủ, Radiant..."
                        value={newRank}
                        onChange={(e) => setNewRank(e.target.value)}
                        style={{ height: 38, fontSize: '0.84rem' }}
                      />
                      {selectedCategoryObj?.ranks && selectedCategoryObj.ranks.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                          {selectedCategoryObj.ranks.slice(-4).map(r => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setNewRank(r)}
                              style={{
                                background: newRank === r ? '#ECFDF5' : '#F1F5F9',
                                border: newRank === r ? '1px solid #10B981' : '1px solid #E2E8F0',
                                color: newRank === r ? '#059669' : '#475569',
                                fontSize: '0.68rem',
                                fontWeight: newRank === r ? 700 : 500,
                                borderRadius: 4,
                                padding: '2px 6px',
                                cursor: 'pointer',
                                transition: 'all 0.12s ease'
                              }}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Account Title */}
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>
                      Tiêu Đề Tài Khoản <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="input-new-title"
                      data-testid="input-new-title"
                      className="form-input"
                      placeholder="VD: Acc Chiến Tướng 50 Sao - Full Tướng - Flo Tinh Hệ"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  {/* Row 3: Price & Skins Count */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>
                        Giá Thuê / Giờ (VNĐ) <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="number"
                        id="input-new-price"
                        data-testid="input-new-price"
                        className="form-input"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        required
                        style={{ height: 38, fontSize: '0.84rem' }}
                      />
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                        {[10000, 15000, 20000, 25000].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewPrice(p)}
                            style={{
                              background: Number(newPrice) === p ? '#ECFDF5' : '#F1F5F9',
                              border: Number(newPrice) === p ? '1px solid #10B981' : '1px solid #E2E8F0',
                              color: Number(newPrice) === p ? '#059669' : '#475569',
                              fontSize: '0.68rem',
                              fontWeight: Number(newPrice) === p ? 700 : 500,
                              borderRadius: 4,
                              padding: '2px 6px',
                              cursor: 'pointer',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            {p.toLocaleString('vi-VN')} đ
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>
                        Số Lượng Skin
                      </label>
                      <input
                        type="number"
                        id="input-new-skins-count"
                        data-testid="input-new-skins-count"
                        className="form-input"
                        value={newSkinsCount}
                        onChange={(e) => setNewSkinsCount(e.target.value)}
                        style={{ height: 38, fontSize: '0.84rem' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                        Tổng số trang phục trong tủ đồ
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Highlight Skins List */}
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Sparkles size={13} color="var(--primary)" /> Danh Sách Trang Phục / Vũ Khí Nổi Bật
                    </label>
                    <input
                      type="text"
                      id="input-new-skins-list"
                      data-testid="input-new-skins-list"
                      className="form-input"
                      placeholder="VD: Kuronami Vandal, Prime Phantom, Flo Tinh Hệ..."
                      value={newSkinsList}
                      onChange={(e) => setNewSkinsList(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                      Phân tách các skin nổi bật bằng dấu phẩy (,) để hiển thị dạng thẻ tag trên trang chi tiết
                    </span>
                  </div>

                  {/* Security Notice Card */}
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 10,
                      padding: '12px 14px',
                      marginBottom: 16
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                      <Lock size={14} color="var(--primary)" />
                      Thông Tin Bảo Mật Đăng Nhập (Cấp Cho Khách Khi Thuê)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.76rem', marginBottom: 4 }}>
                          Tài Khoản Đăng Nhập <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="input-new-secret-account"
                          data-testid="input-new-secret-account"
                          className="form-input"
                          placeholder="account_login"
                          value={newSecretAccount}
                          onChange={(e) => setNewSecretAccount(e.target.value)}
                          required
                          style={{ height: 36, fontSize: '0.82rem', fontFamily: 'monospace', background: '#FFFFFF' }}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.76rem', marginBottom: 4 }}>
                          Mật Khẩu Đăng Nhập <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showSecretPassInModal ? 'text' : 'password'}
                            id="input-new-secret-password"
                            data-testid="input-new-secret-password"
                            className="form-input"
                            placeholder="password@123"
                            value={newSecretPassword}
                            onChange={(e) => setNewSecretPassword(e.target.value)}
                            required
                            style={{ height: 36, fontSize: '0.82rem', fontFamily: 'monospace', paddingRight: 32, background: '#FFFFFF' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecretPassInModal(!showSecretPassInModal)}
                            style={{
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={showSecretPassInModal ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {showSecretPassInModal ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  className="modal-footer"
                  style={{
                    padding: '14px 20px',
                    borderTop: '1px solid var(--border-subtle)',
                    background: '#F8FAFC',
                    borderRadius: '0 0 16px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 10
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAddingAcc(false)}
                    style={{ fontSize: '0.84rem', padding: '8px 16px' }}
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    id="btn-submit-new-account"
                    data-testid="btn-submit-new-account"
                    className="btn btn-primary"
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      padding: '8px 20px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    <Plus size={15} /> Lưu Tài Khoản Vào Kho
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ================= MODAL CHỈNH SỬA TÀI KHOẢN ================= */}
      {editingAcc && (
        <div
          id="modal-edit-account"
          data-testid="modal-edit-account"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingAcc(null);
          }}
        >
          <div
            className="glass-panel"
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              width: '100%',
              maxWidth: 580,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Chỉnh Sửa Tài Khoản #{editingAcc.id}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                    Cập nhật thông tin chi tiết tài khoản trong kho hệ thống
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingAcc(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEditAccount}>
              <div style={{ padding: '18px 20px', maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Chọn game & Trạng thái */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Tựa Game <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div id="container-edit-game-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        id="btn-select-edit-game"
                        onClick={() => setIsEditGameDropdownOpen(!isEditGameDropdownOpen)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: isEditGameDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                          background: '#FFFFFF',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          height: 38,
                          boxShadow: isEditGameDropdownOpen ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {(() => {
                          const currentEditGame = categories.find(c => c.id === editGameId);
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  flexShrink: 0,
                                  background: currentEditGame?.badgeColor || 'var(--primary)',
                                  boxShadow: `0 0 6px ${currentEditGame?.badgeColor || 'var(--primary)'}`
                                }}
                              />
                              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {currentEditGame?.name || 'Chọn tựa game'}
                              </span>
                              {currentEditGame?.publisher && (
                                <span style={{ fontSize: '0.72rem', color: '#94A3B8', flexShrink: 0 }}>({currentEditGame.publisher})</span>
                              )}
                            </div>
                          );
                        })()}
                        <ChevronDown
                          size={14}
                          color="#64748B"
                          style={{
                            transform: isEditGameDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.18s ease',
                            flexShrink: 0,
                            marginLeft: 4
                          }}
                        />
                      </button>

                      {/* Hidden native select to preserve test automation & form binding */}
                      <select
                        id="select-edit-game"
                        data-testid="select-edit-game"
                        value={editGameId}
                        onChange={(e) => setEditGameId(e.target.value)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                        tabIndex={-1}
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>

                      {/* Custom Dropdown Popup List */}
                      {isEditGameDropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 5px)',
                            left: 0,
                            right: 0,
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 10,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                            padding: '5px',
                            zIndex: 100,
                            maxHeight: 220,
                            overflowY: 'auto'
                          }}
                        >
                          {categories.map((c) => (
                            <div
                              key={c.id}
                              id={`opt-edit-game-${c.id}`}
                              onClick={() => {
                                setEditGameId(c.id);
                                setIsEditGameDropdownOpen(false);
                              }}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 6,
                                fontSize: '0.82rem',
                                color: editGameId === c.id ? '#059669' : '#334155',
                                background: editGameId === c.id ? '#ECFDF5' : 'transparent',
                                fontWeight: editGameId === c.id ? 700 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                              onMouseEnter={(e) => {
                                if (editGameId !== c.id) e.currentTarget.style.background = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                if (editGameId !== c.id) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.badgeColor || '#10B981' }} />
                                <span>{c.name}</span>
                                {c.publisher && <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>({c.publisher})</span>}
                              </div>
                              {editGameId === c.id && <Check size={14} color="#059669" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Trạng Thái Kho <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div id="container-edit-status-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        id="btn-select-edit-status"
                        onClick={() => setIsEditStatusDropdownOpen(!isEditStatusDropdownOpen)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: isEditStatusDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                          background: '#FFFFFF',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          height: 38,
                          boxShadow: isEditStatusDropdownOpen ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {(() => {
                          const currentEditStatusObj = ACCOUNT_STATUS_OPTIONS.find(o => o.value === editStatus) || ACCOUNT_STATUS_OPTIONS[0];
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  flexShrink: 0,
                                  background: currentEditStatusObj.dotColor,
                                  boxShadow: `0 0 6px ${currentEditStatusObj.dotColor}`
                                }}
                              />
                              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {currentEditStatusObj.fullLabel}
                              </span>
                            </div>
                          );
                        })()}
                        <ChevronDown
                          size={14}
                          color="#64748B"
                          style={{
                            transform: isEditStatusDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.18s ease',
                            flexShrink: 0,
                            marginLeft: 4
                          }}
                        />
                      </button>

                      {/* Hidden native select to preserve test automation & form binding */}
                      <select
                        id="select-edit-status"
                        data-testid="select-edit-status"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                        tabIndex={-1}
                      >
                        {ACCOUNT_STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.fullLabel}</option>
                        ))}
                      </select>

                      {/* Custom Dropdown Popup List */}
                      {isEditStatusDropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 5px)',
                            left: 0,
                            right: 0,
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 10,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                            padding: '5px',
                            zIndex: 100
                          }}
                        >
                          {ACCOUNT_STATUS_OPTIONS.map((opt) => (
                            <div
                              key={opt.value}
                              id={`opt-edit-status-${opt.value}`}
                              onClick={() => {
                                setEditStatus(opt.value);
                                setIsEditStatusDropdownOpen(false);
                              }}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 6,
                                fontSize: '0.82rem',
                                color: editStatus === opt.value ? '#059669' : '#334155',
                                background: editStatus === opt.value ? '#ECFDF5' : 'transparent',
                                fontWeight: editStatus === opt.value ? 700 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                              onMouseEnter={(e) => {
                                if (editStatus !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                if (editStatus !== opt.value) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.dotColor }} />
                                <span>{opt.fullLabel}</span>
                              </div>
                              {editStatus === opt.value && <Check size={14} color="#059669" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tiêu đề acc */}
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                    Tiêu Đề Hiển Thị <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="input-edit-title"
                    data-testid="input-edit-title"
                    className="form-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>

                {/* Rank & Giá thuê/h */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Cấp Bậc (Rank) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="input-edit-rank"
                      data-testid="input-edit-rank"
                      className="form-input"
                      value={editRank}
                      onChange={(e) => setEditRank(e.target.value)}
                      required
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Giá Thuê (VNĐ / Giờ) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      id="input-edit-price"
                      data-testid="input-edit-price"
                      className="form-input"
                      value={editPricePerHour}
                      onChange={(e) => setEditPricePerHour(e.target.value)}
                      min={1000}
                      step={1000}
                      required
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                {/* Skin nổi bật */}
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Sparkles size={13} color="var(--primary)" /> Danh Sách Trang Phục / Skins (Phân tách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    id="input-edit-skins"
                    data-testid="input-edit-skins"
                    className="form-input"
                    value={editSkinsList}
                    onChange={(e) => setEditSkinsList(e.target.value)}
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>

                {/* Tài khoản & Mật khẩu bí mật */}
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginBottom: 14
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                    <Lock size={14} color="var(--primary)" />
                    Thông Tin Đăng Nhập Game (Cấp Cho Khách Khi Thuê)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.76rem', marginBottom: 4 }}>
                        Tài Khoản <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="input-edit-secret-account"
                        data-testid="input-edit-secret-account"
                        className="form-input"
                        value={editSecretAccount}
                        onChange={(e) => setEditSecretAccount(e.target.value)}
                        required
                        style={{ height: 36, fontSize: '0.82rem', fontFamily: 'monospace', background: '#FFFFFF' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.76rem', marginBottom: 4 }}>
                        Mật Khẩu <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showEditSecretPass ? 'text' : 'password'}
                          id="input-edit-secret-password"
                          data-testid="input-edit-secret-password"
                          className="form-input"
                          value={editSecretPassword}
                          onChange={(e) => setEditSecretPassword(e.target.value)}
                          required
                          style={{ height: 36, fontSize: '0.82rem', fontFamily: 'monospace', paddingRight: 32, background: '#FFFFFF' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowEditSecretPass(!showEditSecretPass)}
                          style={{
                            position: 'absolute',
                            right: 6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {showEditSecretPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                    Mô Tả Tài Khoản
                  </label>
                  <textarea
                    id="input-edit-description"
                    data-testid="input-edit-description"
                    className="form-input"
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ fontSize: '0.82rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '12px 20px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: '#F8FAFC',
                  borderRadius: '0 0 16px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 10
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingAcc(null)}
                  style={{ fontSize: '0.84rem', padding: '7px 14px' }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  id="btn-save-edit-account"
                  data-testid="btn-save-edit-account"
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    padding: '7px 18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Check size={14} /> Lưu Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Tài Khoản Đồng Bộ */}
      <ConfirmModal
        isOpen={Boolean(accountToDelete)}
        onClose={() => setAccountToDelete(null)}
        onConfirm={() => {
          if (accountToDelete) {
            deleteAccount(accountToDelete.id);
            setAccountToDelete(null);
          }
        }}
        title="Xác Nhận Xóa Tài Khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${accountToDelete?.title}" (#${accountToDelete?.id}) khỏi kho hệ thống?`}
        subMessage="Lưu ý: Thao tác này sẽ gỡ bỏ tài khoản vĩnh viễn và không thể hoàn tác."
        confirmText="Xóa Tài Khoản"
        cancelText="Hủy Bỏ"
        type="danger"
        icon={<Trash2 size={20} strokeWidth={2.4} />}
      />
    </div>
  );
};

