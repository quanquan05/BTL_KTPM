import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Check,
  X,
  UserCheck,
  UserX,
  ChevronDown,
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const CustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isNewCustStatusDropdownOpen, setIsNewCustStatusDropdownOpen] = useState(false);
  const [isEditCustStatusDropdownOpen, setIsEditCustStatusDropdownOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Modal States
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form States for Add
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustStatus, setNewCustStatus] = useState('active');
  const [newCustOrders, setNewCustOrders] = useState(0);
  const [newCustSpent, setNewCustSpent] = useState(0);

  // Form States for Edit
  const [editCustName, setEditCustName] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');
  const [editCustStatus, setEditCustStatus] = useState('active');
  const [editCustOrders, setEditCustOrders] = useState(0);
  const [editCustSpent, setEditCustSpent] = useState(0);

  const STATUS_OPTIONS = [
    { value: 'all', label: 'Tất cả trạng thái', dotColor: '#10B981' },
    { value: 'active', label: 'Hoạt động', dotColor: '#10B981' },
    { value: 'blocked', label: 'Tạm khóa', dotColor: '#EF4444' }
  ];

  // Handlers
  const handleOpenAdd = () => {
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustStatus('active');
    setNewCustOrders(0);
    setNewCustSpent(0);
    setIsAddingCustomer(true);
  };

  const handleSaveNewCustomer = (e) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: newCustEmail.trim(),
      status: newCustStatus,
      totalOrders: Number(newCustOrders) || 0,
      totalSpent: Number(newCustSpent) || 0
    });

    setIsAddingCustomer(false);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setEditCustName(c.name || '');
    setEditCustPhone(c.phone || '');
    setEditCustEmail(c.email || '');
    setEditCustStatus(c.status || 'active');
    setEditCustOrders(c.totalOrders || 0);
    setEditCustSpent(c.totalSpent || 0);
  };

  const handleSaveEditCustomer = (e) => {
    e.preventDefault();
    if (!editingCustomer || !editCustName.trim()) return;

    updateCustomer(editingCustomer.id, {
      name: editCustName.trim(),
      phone: editCustPhone.trim(),
      email: editCustEmail.trim(),
      status: editCustStatus,
      totalOrders: Number(editCustOrders) || 0,
      totalSpent: Number(editCustSpent) || 0
    });

    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (c) => {
    setCustomerToDelete(c);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#container-customer-status-filter')) {
        setIsStatusDropdownOpen(false);
      }
      if (!e.target.closest('#container-new-cust-status-dropdown')) {
        setIsNewCustStatusDropdownOpen(false);
      }
      if (!e.target.closest('#container-edit-cust-status-dropdown')) {
        setIsEditCustStatusDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filtered List
  const customerList = customers || [];
  const filtered = customerList.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Top Banner & Title */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={24} color="#10B981" />
            <span>Quản Lý Khách Hàng</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
            Theo dõi, thêm mới và quản trị thông tin khách thuê tài khoản game trên hệ thống
          </p>
        </div>

        <button
          type="button"
          id="btn-add-customer"
          data-testid="btn-add-customer"
          onClick={handleOpenAdd}
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
          <Plus size={16} /> Thêm Khách Hàng Mới
        </button>
      </div>

      {/* Main Table Card */}
      <div className="rental-table-card">
        {/* Table Card Header with Unified 2-Row Layout */}
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
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Danh sách khách hàng ({filtered.length})
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                Lịch sử thuê tài khoản và chi tiêu của từng khách hàng
              </p>
            </div>
          </div>

          {/* Bottom Row: Unified Filters & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Custom Dropdown: Trạng thái */}
            <div id="container-customer-status-filter" style={{ position: 'relative' }}>
              <button
                type="button"
                id="btn-customer-status-filter"
                data-testid="select-customer-status-filter"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
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
                      background: STATUS_OPTIONS.find((o) => o.value === statusFilter)?.dotColor || '#10B981'
                    }}
                  />
                  <span>{STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label || 'Tất cả trạng thái'}</span>
                </div>
                <ChevronDown
                  size={14}
                  color="#64748B"
                  style={{
                    transform: isStatusDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </button>

              {isStatusDropdownOpen && (
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
                  {STATUS_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setIsStatusDropdownOpen(false);
                      }}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 6,
                        fontSize: '0.78rem',
                        color: statusFilter === opt.value ? '#059669' : '#334155',
                        background: statusFilter === opt.value ? '#ECFDF5' : 'transparent',
                        fontWeight: statusFilter === opt.value ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (statusFilter !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (statusFilter !== opt.value) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dotColor }} />
                        <span>{opt.label}</span>
                      </div>
                      {statusFilter === opt.value && <Check size={13} color="#059669" />}
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
                id="input-search-customers"
                data-testid="input-search-customers"
                placeholder="Tìm khách hàng theo tên, SĐT, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="rental-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>MÃ KH</th>
                <th style={{ minWidth: 200 }}>KHÁCH HÀNG</th>
                <th style={{ minWidth: 200 }}>LIÊN HỆ</th>
                <th style={{ minWidth: 120 }}>SỐ ĐƠN THUÊ</th>
                <th style={{ minWidth: 140 }}>TỔNG CHI TIÊU</th>
                <th style={{ width: 110, textAlign: 'center' }}>TRẠNG THÁI</th>
                <th style={{ width: 130, textAlign: 'center' }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-subtle)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>👥</div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>Không tìm thấy khách hàng nào</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 4 }}>
                      Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Thêm Khách Hàng Mới"
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>
                      #{c.id}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                          alt={c.name}
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{c.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Khách hàng thân thiết</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={12} color="#94A3B8" /> {c.phone || 'Chưa cập nhật'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Mail size={12} color="#94A3B8" /> {c.email || 'Chưa cập nhật'}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <ShoppingBag size={13} color="#64748B" />
                        <span>{c.totalOrders || 0} đơn</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CreditCard size={13} color="#059669" />
                        <span>{(c.totalSpent || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {c.status === 'active' ? (
                        <span
                          style={{
                            background: '#ECFDF5',
                            color: '#059669',
                            padding: '3px 9px',
                            borderRadius: 12,
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <UserCheck size={12} /> Hoạt động
                        </span>
                      ) : (
                        <span
                          style={{
                            background: '#FEF2F2',
                            color: '#EF4444',
                            padding: '3px 9px',
                            borderRadius: 12,
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <UserX size={12} /> Tạm khóa
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          id={`btn-edit-customer-${c.id}`}
                          data-testid={`btn-edit-customer-${c.id}`}
                          onClick={() => handleOpenEdit(c)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Sửa thông tin khách hàng"
                        >
                          <Edit3 size={12} /> Sửa
                        </button>
                        <button
                          type="button"
                          id={`btn-delete-customer-${c.id}`}
                          data-testid={`btn-delete-customer-${c.id}`}
                          onClick={() => handleDeleteCustomer(c)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Xóa khách hàng"
                        >
                          <Trash2 size={12} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL THÊM KHÁCH HÀNG MỚI ================= */}
      {isAddingCustomer && (
        <div
          id="modal-add-customer"
          data-testid="modal-add-customer"
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
            if (e.target === e.currentTarget) setIsAddingCustomer(false);
          }}
        >
          <div
            className="glass-panel"
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              width: '100%',
              maxWidth: 500,
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
                  <Plus size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Thêm Khách Hàng Mới
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                    Nhập thông tin để tạo hồ sơ khách hàng mới
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingCustomer(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNewCustomer}>
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                    Họ và Tên Khách Hàng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="input-new-cust-name"
                    data-testid="input-new-cust-name"
                    className="form-input"
                    placeholder="VD: Trần Văn Nam"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    required
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Số Điện Thoại <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="input-new-cust-phone"
                      data-testid="input-new-cust-phone"
                      className="form-input"
                      placeholder="0912345678"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      required
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Trạng Thái
                    </label>
                    <div id="container-new-cust-status-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        id="btn-select-new-cust-status"
                        onClick={() => setIsNewCustStatusDropdownOpen(!isNewCustStatusDropdownOpen)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: isNewCustStatusDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                          background: '#FFFFFF',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          height: 38,
                          boxShadow: isNewCustStatusDropdownOpen ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: newCustStatus === 'active' ? '#10B981' : '#EF4444',
                              boxShadow: `0 0 6px ${newCustStatus === 'active' ? '#10B981' : '#EF4444'}`
                            }}
                          />
                          <span style={{ fontWeight: 600 }}>{newCustStatus === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span>
                        </div>
                        <ChevronDown
                          size={14}
                          color="#64748B"
                          style={{
                            transform: isNewCustStatusDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.18s ease'
                          }}
                        />
                      </button>

                      {/* Hidden native select to preserve test automation & form binding */}
                      <select
                        id="select-new-cust-status"
                        data-testid="select-new-cust-status"
                        value={newCustStatus}
                        onChange={(e) => setNewCustStatus(e.target.value)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                        tabIndex={-1}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="blocked">Tạm khóa</option>
                      </select>

                      {/* Custom Dropdown Popup List */}
                      {isNewCustStatusDropdownOpen && (
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
                          {[
                            { value: 'active', label: 'Hoạt động', dotColor: '#10B981' },
                            { value: 'blocked', label: 'Tạm khóa', dotColor: '#EF4444' }
                          ].map((opt) => (
                            <div
                              key={opt.value}
                              id={`opt-new-cust-status-${opt.value}`}
                              onClick={() => {
                                setNewCustStatus(opt.value);
                                setIsNewCustStatusDropdownOpen(false);
                              }}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 6,
                                fontSize: '0.84rem',
                                color: newCustStatus === opt.value ? '#059669' : '#334155',
                                background: newCustStatus === opt.value ? '#ECFDF5' : 'transparent',
                                fontWeight: newCustStatus === opt.value ? 700 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                              onMouseEnter={(e) => {
                                if (newCustStatus !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                if (newCustStatus !== opt.value) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.dotColor }} />
                                <span>{opt.label}</span>
                              </div>
                              {newCustStatus === opt.value && <Check size={14} color="#059669" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                    Email Liên Hệ
                  </label>
                  <input
                    type="email"
                    id="input-new-cust-email"
                    data-testid="input-new-cust-email"
                    className="form-input"
                    placeholder="khachhang@gmail.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Số Đơn Thuê Ban Đầu
                    </label>
                    <input
                      type="number"
                      id="input-new-cust-orders"
                      data-testid="input-new-cust-orders"
                      className="form-input"
                      min={0}
                      value={newCustOrders}
                      onChange={(e) => setNewCustOrders(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Tổng Chi Tiêu Ban Đầu (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="input-new-cust-spent"
                      data-testid="input-new-cust-spent"
                      className="form-input"
                      min={0}
                      step={1000}
                      value={newCustSpent}
                      onChange={(e) => setNewCustSpent(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>
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
                  onClick={() => setIsAddingCustomer(false)}
                  style={{ fontSize: '0.84rem', padding: '7px 14px' }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  id="btn-submit-new-customer"
                  data-testid="btn-submit-new-customer"
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
                  <Plus size={14} /> Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CHỈNH SỬA KHÁCH HÀNG ================= */}
      {editingCustomer && (
        <div
          id="modal-edit-customer"
          data-testid="modal-edit-customer"
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
            if (e.target === e.currentTarget) setEditingCustomer(null);
          }}
        >
          <div
            className="glass-panel"
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              width: '100%',
              maxWidth: 500,
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
                    Sửa Khách Hàng #{editingCustomer.id}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                    Cập nhật thông tin chi tiết khách thuê
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditCustomer}>
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                    Họ và Tên Khách Hàng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="input-edit-cust-name"
                    data-testid="input-edit-cust-name"
                    className="form-input"
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                    required
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Số Điện Thoại <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="input-edit-cust-phone"
                      data-testid="input-edit-cust-phone"
                      className="form-input"
                      value={editCustPhone}
                      onChange={(e) => setEditCustPhone(e.target.value)}
                      required
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Trạng Thái
                    </label>
                    <div id="container-edit-cust-status-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        id="btn-select-edit-cust-status"
                        onClick={() => setIsEditCustStatusDropdownOpen(!isEditCustStatusDropdownOpen)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: isEditCustStatusDropdownOpen ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                          background: '#FFFFFF',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          height: 38,
                          boxShadow: isEditCustStatusDropdownOpen ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: editCustStatus === 'active' ? '#10B981' : '#EF4444',
                              boxShadow: `0 0 6px ${editCustStatus === 'active' ? '#10B981' : '#EF4444'}`
                            }}
                          />
                          <span style={{ fontWeight: 600 }}>{editCustStatus === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span>
                        </div>
                        <ChevronDown
                          size={14}
                          color="#64748B"
                          style={{
                            transform: isEditCustStatusDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.18s ease'
                          }}
                        />
                      </button>

                      {/* Hidden native select to preserve test automation & form binding */}
                      <select
                        id="select-edit-cust-status"
                        data-testid="select-edit-cust-status"
                        value={editCustStatus}
                        onChange={(e) => setEditCustStatus(e.target.value)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
                        tabIndex={-1}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="blocked">Tạm khóa</option>
                      </select>

                      {/* Custom Dropdown Popup List */}
                      {isEditCustStatusDropdownOpen && (
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
                          {[
                            { value: 'active', label: 'Hoạt động', dotColor: '#10B981' },
                            { value: 'blocked', label: 'Tạm khóa', dotColor: '#EF4444' }
                          ].map((opt) => (
                            <div
                              key={opt.value}
                              id={`opt-edit-cust-status-${opt.value}`}
                              onClick={() => {
                                setEditCustStatus(opt.value);
                                setIsEditCustStatusDropdownOpen(false);
                              }}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 6,
                                fontSize: '0.84rem',
                                color: editCustStatus === opt.value ? '#059669' : '#334155',
                                background: editCustStatus === opt.value ? '#ECFDF5' : 'transparent',
                                fontWeight: editCustStatus === opt.value ? 700 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                              onMouseEnter={(e) => {
                                if (editCustStatus !== opt.value) e.currentTarget.style.background = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                if (editCustStatus !== opt.value) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.dotColor }} />
                                <span>{opt.label}</span>
                              </div>
                              {editCustStatus === opt.value && <Check size={14} color="#059669" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                    Email Liên Hệ
                  </label>
                  <input
                    type="email"
                    id="input-edit-cust-email"
                    data-testid="input-edit-cust-email"
                    className="form-input"
                    value={editCustEmail}
                    onChange={(e) => setEditCustEmail(e.target.value)}
                    style={{ height: 38, fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Số Đơn Thuê
                    </label>
                    <input
                      type="number"
                      id="input-edit-cust-orders"
                      data-testid="input-edit-cust-orders"
                      className="form-input"
                      min={0}
                      value={editCustOrders}
                      onChange={(e) => setEditCustOrders(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
                      Tổng Chi Tiêu (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="input-edit-cust-spent"
                      data-testid="input-edit-cust-spent"
                      className="form-input"
                      min={0}
                      step={1000}
                      value={editCustSpent}
                      onChange={(e) => setEditCustSpent(e.target.value)}
                      style={{ height: 38, fontSize: '0.84rem' }}
                    />
                  </div>
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
                  onClick={() => setEditingCustomer(null)}
                  style={{ fontSize: '0.84rem', padding: '7px 14px' }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  id="btn-save-edit-customer"
                  data-testid="btn-save-edit-customer"
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

      {/* Modal Xác Nhận Xóa Khách Hàng Đồng Bộ */}
      <ConfirmModal
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete) {
            deleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
          }
        }}
        title="Xác Nhận Xóa Khách Hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDelete?.name}" (#${customerToDelete?.id}) khỏi danh sách hệ thống?`}
        subMessage="Lưu ý: Thao tác này sẽ gỡ bỏ dữ liệu khách hàng và không thể hoàn tác."
        confirmText="Xóa Khách Hàng"
        cancelText="Hủy Bỏ"
        type="danger"
        icon={<Trash2 size={20} strokeWidth={2.4} />}
      />
    </div>
  );
};
