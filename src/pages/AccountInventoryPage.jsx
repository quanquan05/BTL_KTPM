import React, { useState, useEffect } from 'react';
import {
  Layers,
  Gamepad2,
  ShieldCheck,
  Plus,
  Check,
  X,
  Trash2,
  Edit3,
  Search,
  Filter,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Tag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const AccountInventoryPage = () => {
  const {
    accounts,
    categories,
    addAccount,
    updateAccount,
    deleteAccount
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [isGameFilterOpen, setIsGameFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [openRowStatusAccId, setOpenRowStatusAccId] = useState(null);

  // Xem mật khẩu trên bảng
  const [revealedPassAccId, setRevealedPassAccId] = useState(null);

  // State Modal Thêm & Xóa & Sửa
  const [isAddingAcc, setIsAddingAcc] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [editingAcc, setEditingAcc] = useState(null);

  // Form Thêm tài khoản
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
  const [isNewGameDropdownOpen, setIsNewGameDropdownOpen] = useState(false);
  const [showSecretPassInModal, setShowSecretPassInModal] = useState(false);

  // Form Sửa tài khoản
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
  const [isEditGameDropdownOpen, setIsEditGameDropdownOpen] = useState(false);
  const [isEditStatusDropdownOpen, setIsEditStatusDropdownOpen] = useState(false);

  // Danh mục trạng thái tài khoản
  const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'Tất cả trạng thái', dotColor: '#10B981' },
    { value: 'available', label: 'Sẵn sàng', dotColor: '#10B981' },
    { value: 'rented', label: 'Đang thuê', dotColor: '#3B82F6' },
    { value: 'maintenance', label: 'Bảo trì', dotColor: '#F59E0B' },
    { value: 'need_change_pass', label: 'Cần đổi pass', dotColor: '#EF4444' }
  ];

  const ACCOUNT_STATUS_OPTIONS = [
    { value: 'available', label: 'Sẵn sàng', fullLabel: 'Sẵn sàng cho thuê', dotColor: '#10B981', bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    { value: 'rented', label: 'Đang thuê', fullLabel: 'Đang thuê', dotColor: '#3B82F6', bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    { value: 'maintenance', label: 'Bảo trì', fullLabel: 'Đang bảo trì', dotColor: '#F59E0B', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    { value: 'need_change_pass', label: 'Cần đổi pass', fullLabel: 'Cần đổi mật khẩu', dotColor: '#EF4444', bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
  ];

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#container-inventory-game-filter')) {
        setIsGameFilterOpen(false);
      }
      if (!e.target.closest('#container-inventory-status-filter')) {
        setIsStatusFilterOpen(false);
      }
      if (!e.target.closest('.account-row-status-container')) {
        setOpenRowStatusAccId(null);
      }
      if (!e.target.closest('#container-new-game-dropdown')) {
        setIsNewGameDropdownOpen(false);
      }
      if (!e.target.closest('#container-edit-game-dropdown')) {
        setIsEditGameDropdownOpen(false);
      }
      if (!e.target.closest('#container-edit-status-dropdown')) {
        setIsEditStatusDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Mở modal sửa tài khoản
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

  // Lưu chỉnh sửa tài khoản
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

  // Xử lý gửi Form Thêm Tài Khoản (UC1)
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
      }, 900);
    } else {
      setAddError(res.error || 'Có lỗi xảy ra khi thêm tài khoản.');
    }
  };

  // Lọc danh sách tài khoản
  const filteredAccounts = accounts.filter(acc => {
    if (selectedGameFilter !== 'all' && acc.gameId !== selectedGameFilter) return false;
    if (selectedStatusFilter !== 'all' && acc.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (acc.title || '').toLowerCase().includes(q);
      const matchId = (acc.id || '').toLowerCase().includes(q);
      const matchUser = (acc.secretAccount || '').toLowerCase().includes(q);
      const matchRank = (acc.rank || '').toLowerCase().includes(q);
      const matchGame = (categories.find(c => c.id === acc.gameId)?.name || '').toLowerCase().includes(q);
      return matchTitle || matchId || matchUser || matchRank || matchGame;
    }
    return true;
  });

  // Thống kê nhanh trạng thái kho
  const availableCount = accounts.filter(a => a.status === 'available').length;
  const rentedCount = accounts.filter(a => a.status === 'rented').length;
  const maintenanceCount = accounts.filter(a => a.status === 'maintenance' || a.status === 'need_change_pass').length;

  const selectedCategoryLabel = selectedGameFilter === 'all'
    ? `Tất cả tựa game (${accounts.length})`
    : categories.find(c => c.id === selectedGameFilter)?.name || selectedGameFilter;

  const selectedStatusLabel = STATUS_FILTER_OPTIONS.find(o => o.value === selectedStatusFilter)?.label || 'Tất cả trạng thái';

  return (
    <div className="dashboard-container" style={{ paddingBottom: 60 }}>
      {/* Top Banner & Title Bar */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#ECFDF5', color: '#059669', fontSize: '0.74rem', fontWeight: 700, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            QUẢN TRỊ KHO HỆ THỐNG
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Layers size={24} color="#10B981" />
            <span>Kho Quản Lý Tài Khoản</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
            Theo dõi, phân loại và quản lý toàn bộ kho tài khoản game cho thuê 24/7
          </p>
        </div>

        {/* Nút Thêm Tài Khoản Mới */}
        <button
          type="button"
          id="btn-admin-add-account"
          data-testid="btn-admin-add-account"
          onClick={() => setIsAddingAcc(true)}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            fontSize: '0.84rem',
            fontWeight: 700,
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}
        >
          <Plus size={16} /> Thêm Tài Khoản Mới
        </button>
      </div>

      {/* ================= KHỐI THỐNG KÊ KHO TÀI KHOẢN (ĐỒNG BỘ DESIGN SYSTEM) ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 20
        }}
      >
        {/* Card 1: Tổng Kho */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tổng Số Tài Khoản
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)', marginTop: 2 }}>
                {accounts.length} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748B' }}>acc</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F8F0', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gamepad2 size={22} />
            </div>
          </div>
        </div>

        {/* Card 2: Sẵn Sàng Cho Thuê */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Sẵn Sàng Cho Thuê
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-heading)', marginTop: 2 }}>
                {availableCount} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748B' }}>acc</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Card 3: Đang Thuê */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Đang Có Khách Thuê
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#2563EB', fontFamily: 'var(--font-heading)', marginTop: 2 }}>
                {rentedCount} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748B' }}>acc</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* Card 4: Bảo Trì / Cần Đổi Pass */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Bảo Trì / Cần Đổi Pass
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: maintenanceCount > 0 ? '#D97706' : '#64748B', fontFamily: 'var(--font-heading)', marginTop: 2 }}>
                {maintenanceCount} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748B' }}>acc</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BẢNG DANH SÁCH TÀI KHOẢN (CHUẨN RENTAL-TABLE-CARD) ================= */}
      <div className="rental-table-card">
        {/* Table Card Header with 2-Row Unified Layout */}
        <div className="rental-table-header">
          {/* Top Row: Title */}
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
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Danh Sách Tài Khoản Trong Kho ({filteredAccounts.length})
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                Quản lý thông tin đăng nhập, mức rank và trạng thái cho thuê thời gian thực
              </p>
            </div>
          </div>

          {/* Bottom Row: Unified Custom Filters & Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Tìm theo mã acc, tựa game, tiêu đề, rank hoặc user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 34px',
                  fontSize: '0.82rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
            </div>

            {/* Custom Filter Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Custom Game Dropdown */}
              <div id="container-inventory-game-filter" style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="btn-inventory-game-filter"
                  onClick={() => setIsGameFilterOpen(!isGameFilterOpen)}
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
                  <Tag size={13} color="var(--primary)" />
                  <span>{selectedCategoryLabel}</span>
                  <ChevronDown
                    size={14}
                    color="#64748B"
                    style={{
                      transform: isGameFilterOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}
                  />
                </button>

                {isGameFilterOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      right: 0,
                      minWidth: 200,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                      padding: '5px',
                      zIndex: 100
                    }}
                  >
                    <div
                      onClick={() => {
                        setSelectedGameFilter('all');
                        setIsGameFilterOpen(false);
                      }}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 6,
                        fontSize: '0.78rem',
                        color: selectedGameFilter === 'all' ? '#059669' : '#334155',
                        background: selectedGameFilter === 'all' ? '#ECFDF5' : 'transparent',
                        fontWeight: selectedGameFilter === 'all' ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>Tất cả tựa game ({accounts.length})</span>
                      {selectedGameFilter === 'all' && <Check size={13} color="#10B981" />}
                    </div>
                    {categories.map((c) => {
                      const isSelected = selectedGameFilter === c.id;
                      const count = accounts.filter(a => a.gameId === c.id).length;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedGameFilter(c.id);
                            setIsGameFilterOpen(false);
                          }}
                          style={{
                            padding: '7px 10px',
                            borderRadius: 6,
                            fontSize: '0.78rem',
                            color: isSelected ? '#059669' : '#334155',
                            background: isSelected ? '#ECFDF5' : 'transparent',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.badgeColor || '#10B981' }} />
                            <span>{c.name}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>({count})</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom Status Dropdown */}
              <div id="container-inventory-status-filter" style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="btn-inventory-status-filter"
                  onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
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
                        background: STATUS_FILTER_OPTIONS.find(o => o.value === selectedStatusFilter)?.dotColor || '#10B981'
                      }}
                    />
                    <span>{selectedStatusLabel}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    color="#64748B"
                    style={{
                      transform: isStatusFilterOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}
                  />
                </button>

                {isStatusFilterOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      right: 0,
                      minWidth: 175,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                      padding: '5px',
                      zIndex: 100
                    }}
                  >
                    {STATUS_FILTER_OPTIONS.map((opt) => {
                      const isSelected = selectedStatusFilter === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setSelectedStatusFilter(opt.value);
                            setIsStatusFilterOpen(false);
                          }}
                          style={{
                            padding: '7px 10px',
                            borderRadius: 6,
                            fontSize: '0.78rem',
                            color: isSelected ? '#059669' : '#334155',
                            background: isSelected ? '#ECFDF5' : 'transparent',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check size={13} color="#10B981" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Body using `.rental-table` */}
        <div style={{ overflowX: 'auto' }}>
          <table className="rental-table">
            <thead>
              <tr>
                <th style={{ width: 95 }}>MÃ ACC</th>
                <th style={{ minWidth: 130 }}>TỰA GAME</th>
                <th style={{ minWidth: 220 }}>TIÊU ĐỀ & RANK</th>
                <th style={{ minWidth: 110 }}>GIÁ THUÊ</th>
                <th style={{ minWidth: 180 }}>TÀI KHOẢN / MẬT KHẨU</th>
                <th style={{ width: 130, textAlign: 'center' }}>TRẠNG THÁI</th>
                <th style={{ width: 130, textAlign: 'center' }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-subtle)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🔍</div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>Không tìm thấy tài khoản phù hợp</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 4 }}>
                      Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Thêm Tài Khoản Mới"
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc, index) => {
                  const isPassRevealed = revealedPassAccId === acc.id;
                  return (
                    <tr key={acc.id}>
                      <td style={{ fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>
                        #{acc.id}
                      </td>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>
                        {categories.find(c => c.id === acc.gameId)?.name || acc.gameId}
                      </td>
                      <td style={{ maxWidth: 260 }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {acc.title}
                        </div>
                        <span className="badge badge-rank" style={{ marginTop: 4 }}>{acc.rank}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>
                        {acc.pricePerHour.toLocaleString('vi-VN')} đ/h
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        <div style={{ color: '#0F172A' }}>User: <strong>{acc.secretAccount}</strong></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', marginTop: 2 }}>
                          <span>Pass: {isPassRevealed ? acc.secretPassword : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => setRevealedPassAccId(isPassRevealed ? null : acc.id)}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                            title={isPassRevealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {isPassRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }} className="account-row-status-container">
                        {(() => {
                          const currentStatusObj = ACCOUNT_STATUS_OPTIONS.find(o => o.value === acc.status) || ACCOUNT_STATUS_OPTIONS[0];
                          const isOpen = openRowStatusAccId === acc.id;
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
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <span
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    background: currentStatusObj.dotColor
                                  }}
                                />
                                <span>{currentStatusObj.label}</span>
                                <ChevronDown
                                  size={12}
                                  style={{
                                    transform: isOpen ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.18s ease'
                                  }}
                                />
                              </button>

                              {/* Hidden native select for test automation */}
                              <select
                                id={`select-status-${acc.id}`}
                                value={acc.status}
                                onChange={(e) => updateAccount(acc.id, { status: e.target.value })}
                                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                                tabIndex={-1}
                              >
                                {ACCOUNT_STATUS_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.fullLabel}</option>
                                ))}
                              </select>

                              {/* Custom Status Popup */}
                              {isOpen && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: index >= filteredAccounts.length - 2 && filteredAccounts.length > 3 ? 'auto' : 'calc(100% + 4px)',
                                    bottom: index >= filteredAccounts.length - 2 && filteredAccounts.length > 3 ? 'calc(100% + 4px)' : 'auto',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    minWidth: 155,
                                    background: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: 10,
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                                    padding: '4px',
                                    zIndex: 100,
                                    animation: 'slideUp 0.15s ease'
                                  }}
                                >
                                  {ACCOUNT_STATUS_OPTIONS.map((opt) => {
                                    const isSelected = acc.status === opt.value;
                                    return (
                                      <div
                                        key={opt.value}
                                        onClick={() => {
                                          updateAccount(acc.id, { status: opt.value });
                                          setOpenRowStatusAccId(null);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          gap: 8,
                                          padding: '6px 10px',
                                          borderRadius: 6,
                                          fontSize: '0.78rem',
                                          fontWeight: isSelected ? 700 : 500,
                                          color: isSelected ? opt.text : '#334155',
                                          background: isSelected ? opt.bg : 'transparent',
                                          cursor: 'pointer',
                                          transition: 'all 0.12s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                                          <span>{opt.label}</span>
                                        </div>
                                        {isSelected && <Check size={13} color={opt.text} strokeWidth={2.5} />}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td style={{ textAlign: 'center' }}>
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
                            title="Xóa tài khoản khỏi kho"
                          >
                            <Trash2 size={12} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL THÊM TÀI KHOẢN MỚI (CHUẨN UC1) ================= */}
      {isAddingAcc && (() => {
        const selectedCategoryObj = categories.find(c => c.id === newGameId) || categories[0];
        return (
          <div
            id="modal-add-account"
            data-testid="modal-add-account"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsAddingAcc(false);
            }}
          >
            <div
              className="modal-content"
              style={{
                width: '100%',
                maxWidth: 580,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                maxHeight: '92vh',
                overflowY: 'auto'
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
                  background: '#F8FAFC',
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
                      Chuẩn đặc tả UC1_Add New Product - Kiểm soát BVA/EP
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
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Tag size={13} color="var(--primary)" /> Tựa Game
                      </label>
                      <div id="container-new-game-dropdown" style={{ position: 'relative' }}>
                        <button
                          type="button"
                          id="btn-select-new-game"
                          onClick={() => setIsNewGameDropdownOpen(!isNewGameDropdownOpen)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '7px 12px',
                            borderRadius: 8,
                            border: isNewGameDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                            background: '#FFFFFF',
                            color: 'var(--text-main)',
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            height: 38
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: selectedCategoryObj?.badgeColor || 'var(--primary)'
                              }}
                            />
                            <span style={{ fontWeight: 600 }}>{selectedCategoryObj?.name || 'Chọn tựa game'}</span>
                          </div>
                          <ChevronDown size={14} color="#64748B" />
                        </button>

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

                        {isNewGameDropdownOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: 0,
                              right: 0,
                              background: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: 12,
                              boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.15)',
                              padding: '6px',
                              zIndex: 1000
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 200, overflowY: 'auto' }}>
                              {categories.map(c => {
                                const isSelected = newGameId === c.id;
                                return (
                                  <div
                                    key={c.id}
                                    onClick={() => {
                                      setNewGameId(c.id);
                                      setIsNewGameDropdownOpen(false);
                                    }}
                                    style={{
                                      padding: '8px 10px',
                                      borderRadius: 8,
                                      background: isSelected ? '#ECFDF5' : 'transparent',
                                      color: isSelected ? '#059669' : '#1E293B',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 700 : 500 }}>{c.name}</span>
                                    {isSelected && <Check size={14} color="#10B981" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

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
                    </div>
                  </div>

                  {/* Row 2: Account Title */}
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6 }}>
                      Tiêu Đề Tài Khoản <span style={{ color: '#EF4444' }}>*</span> (5 - 100 ký tự)
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
                              cursor: 'pointer'
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
                    </div>
                  </div>

                  {/* Row 4: Highlight Skins List */}
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Sparkles size={13} color="var(--primary)" /> Danh Sách Trang Phục Nổi Bật
                    </label>
                    <input
                      type="text"
                      id="input-new-skins-list"
                      data-testid="input-new-skins-list"
                      className="form-input"
                      placeholder="VD: Flo Tinh Hệ, Kuronami Vandal, Prime Phantom..."
                      value={newSkinsList}
                      onChange={(e) => setNewSkinsList(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  {/* Security Notice Card */}
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 10,
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                      <Lock size={14} color="var(--primary)" />
                      Thông Tin Bàn Giao Đăng Nhập (Bảo Mật)
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
                              padding: 4
                            }}
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
                    style={{ fontSize: '0.86rem', fontWeight: 700, padding: '8px 20px' }}
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
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingAcc(null);
          }}
        >
          <div
            className="modal-content"
            style={{
              width: '100%',
              maxWidth: 580,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
                borderRadius: '16px 16px 0 0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit3 size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Chỉnh Sửa Tài Khoản #{editingAcc.id}
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                    Cập nhật thông tin chi tiết tài khoản trong kho
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAcc(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditAccount}>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Tựa Game</label>
                    <select
                      id="select-edit-game"
                      data-testid="select-edit-game"
                      value={editGameId}
                      onChange={(e) => setEditGameId(e.target.value)}
                      className="form-input"
                      style={{ height: 38, fontSize: '0.84rem' }}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Trạng Thái</label>
                    <select
                      id="select-edit-status"
                      data-testid="select-edit-status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="form-input"
                      style={{ height: 38, fontSize: '0.84rem' }}
                    >
                      {ACCOUNT_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.fullLabel}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Tiêu Đề Tài Khoản</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Rank</label>
                    <input
                      type="text"
                      id="input-edit-rank"
                      data-testid="input-edit-rank"
                      className="form-input"
                      value={editRank}
                      onChange={(e) => setEditRank(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Giá Thuê / Giờ (VNĐ)</label>
                    <input
                      type="number"
                      id="input-edit-price"
                      data-testid="input-edit-price"
                      className="form-input"
                      value={editPricePerHour}
                      onChange={(e) => setEditPricePerHour(e.target.value)}
                      required
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Tài Khoản Đăng Nhập</label>
                    <input
                      type="text"
                      id="input-edit-secret-account"
                      data-testid="input-edit-secret-account"
                      className="form-input"
                      value={editSecretAccount}
                      onChange={(e) => setEditSecretAccount(e.target.value)}
                      required
                      style={{ height: 36, fontSize: '0.82rem', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Mật Khẩu</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showEditSecretPass ? 'text' : 'password'}
                        id="input-edit-secret-password"
                        data-testid="input-edit-secret-password"
                        className="form-input"
                        value={editSecretPassword}
                        onChange={(e) => setEditSecretPassword(e.target.value)}
                        required
                        style={{ height: 36, fontSize: '0.82rem', fontFamily: 'monospace', paddingRight: 32 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditSecretPass(!showEditSecretPass)}
                        style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                      >
                        {showEditSecretPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>Skins Nổi Bật (Phân cách bởi dấu phẩy)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editSkinsList}
                    onChange={(e) => setEditSkinsList(e.target.value)}
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>
              </div>

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
                  style={{ fontSize: '0.84rem', fontWeight: 700, padding: '7px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={14} /> Lưu Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
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
