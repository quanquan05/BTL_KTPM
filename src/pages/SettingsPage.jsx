import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Save,
  Shield,
  RefreshCw,
  Sliders,
  Download,
  Upload,
  User,
  Phone,
  Mail,
  Globe,
  Database,
  CheckCircle2,
  Clock,
  Coins,
  Lock,
  FileJson,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  AlertCircle,
  Key,
  Smartphone,
  Award,
  Gamepad2,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const SettingsPage = () => {
  const {
    currentUser,
    accounts,
    rentals,
    customers,
    transactions,
    systemSettings,
    updateSystemSettings,
    updateCurrentUser,
    changePassword,
    exportAllData,
    importAllData,
    resetToDefaultData
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // State chung
  const [toastMessage, setToastMessage] = useState('');
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // =========================================================================
  // ADMIN SETTINGS STATE
  // =========================================================================
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'bva' | 'admin' | 'backup'

  // Admin Tab 1 (Chung)
  const [siteName, setSiteName] = useState(systemSettings?.siteName || 'GameRent');
  const [siteSlogan, setSiteSlogan] = useState(systemSettings?.siteSlogan || 'Thuê tài khoản game');
  const [supportHotline, setSupportHotline] = useState(systemSettings?.supportHotline || '1900 6868');
  const [supportEmail, setSupportEmail] = useState(systemSettings?.supportEmail || 'hotro@gamerent.vn');
  const [maintenanceMode, setMaintenanceMode] = useState(systemSettings?.maintenanceMode || false);

  // Admin Tab 2 (BVA & Nghiệp vụ)
  const [minDeposit, setMinDeposit] = useState(systemSettings?.minDeposit || 10000);
  const [maxDeposit, setMaxDeposit] = useState(systemSettings?.maxDeposit || 5000000);
  const [minRentalHours, setMinRentalHours] = useState(systemSettings?.minRentalHours || 1);
  const [maxRentalHours, setMaxRentalHours] = useState(systemSettings?.maxRentalHours || 48);
  const [warningThresholdMins, setWarningThresholdMins] = useState(systemSettings?.warningThresholdMins || 60);
  const [autoRevokeOnExpiry, setAutoRevokeOnExpiry] = useState(systemSettings?.autoRevokeOnExpiry !== false);
  const [autoRefundFirst15m, setAutoRefundFirst15m] = useState(systemSettings?.autoRefundFirst15m !== false);

  // Admin Tab 3 (Admin Profile)
  const [adminName, setAdminName] = useState(currentUser?.name || 'Quản Lý');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || 'admin@gamerent.vn');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phone || '0909999999');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // =========================================================================
  // RENTER SETTINGS STATE (Dành cho Khách Thuê)
  // =========================================================================
  const [renterTab, setRenterTab] = useState('profile'); // 'profile' | 'security' | 'preferences'
  const [renterName, setRenterName] = useState(currentUser?.name || '');
  const [renterPhone, setRenterPhone] = useState(currentUser?.phone || '');
  const [renterEmail, setRenterEmail] = useState(currentUser?.email || '');

  // Đổi mật khẩu khách thuê
  const [renterCurrentPass, setRenterCurrentPass] = useState('');
  const [renterNewPass, setRenterNewPass] = useState('');
  const [renterConfirmNewPass, setRenterConfirmNewPass] = useState('');
  const [showRenterCurrentPass, setShowRenterCurrentPass] = useState(false);
  const [showRenterNewPass, setShowRenterNewPass] = useState(false);
  const [showRenterConfirmPass, setShowRenterConfirmPass] = useState(false);
  const [renterPassError, setRenterPassError] = useState('');
  const [renterPassSuccess, setRenterPassSuccess] = useState('');

  // Tùy chọn trải nghiệm khách thuê
  const [notifyExpiring, setNotifyExpiring] = useState(() => {
    try {
      return localStorage.getItem('gamerent_pref_notify_expiring') !== 'false';
    } catch {
      return true;
    }
  });
  const [autoSuggestExtension, setAutoSuggestExtension] = useState(() => {
    try {
      return localStorage.getItem('gamerent_pref_suggest_extension') !== 'false';
    } catch {
      return true;
    }
  });
  const [autoCopyPass, setAutoCopyPass] = useState(() => {
    try {
      return localStorage.getItem('gamerent_pref_autocopy') !== 'false';
    } catch {
      return true;
    }
  });
  const [showInsuranceBadge, setShowInsuranceBadge] = useState(() => {
    try {
      return localStorage.getItem('gamerent_pref_insurance') !== 'false';
    } catch {
      return true;
    }
  });

  // Tự động đồng bộ state khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      if (isAdmin) {
        setAdminName(currentUser.name || 'Quản Lý');
        setAdminEmail(currentUser.email || 'admin@gamerent.vn');
        setAdminPhone(currentUser.phone || '0909999999');
      } else {
        setRenterName(currentUser.name || '');
        setRenterPhone(currentUser.phone || '');
        setRenterEmail(currentUser.email || '');
      }
    }
  }, [currentUser, isAdmin]);

  // =========================================================================
  // ADMIN HANDLERS
  // =========================================================================
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    updateSystemSettings({
      siteName,
      siteSlogan,
      supportHotline,
      supportEmail,
      maintenanceMode
    });
    showToast('Đã lưu cấu hình thương hiệu & nền tảng thành công!');
  };

  const handleSaveBvaRules = (e) => {
    e.preventDefault();
    if (Number(minDeposit) >= Number(maxDeposit)) {
      alert('Hạn mức nạp tối thiểu phải nhỏ hơn hạn mức tối đa!');
      return;
    }
    if (Number(minRentalHours) >= Number(maxRentalHours)) {
      alert('Thời gian thuê tối thiểu phải nhỏ hơn thời gian tối đa!');
      return;
    }
    updateSystemSettings({
      minDeposit: Number(minDeposit),
      maxDeposit: Number(maxDeposit),
      minRentalHours: Number(minRentalHours),
      maxRentalHours: Number(maxRentalHours),
      warningThresholdMins: Number(warningThresholdMins),
      autoRevokeOnExpiry,
      autoRefundFirst15m
    });
    showToast('Đã lưu quy tắc kiểm thử BVA & chính sách nghiệp vụ!');
  };

  const handleSaveAdminProfile = (e) => {
    e.preventDefault();
    setAdminError('');

    if (!adminName.trim()) {
      setAdminError('Tên quản trị viên không được để trống.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setAdminError('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setAdminError('Mật khẩu xác nhận không trùng khớp.');
        return;
      }
    }

    const updateData = {
      name: adminName.trim(),
      email: adminEmail.trim(),
      phone: adminPhone.trim()
    };
    if (newPassword) {
      updateData.password = newPassword;
    }

    updateCurrentUser(updateData);
    setNewPassword('');
    setConfirmNewPassword('');
    showToast('Cập nhật thông tin Quản Trị Viên thành công!');
  };

  const handleExportData = () => {
    const data = exportAllData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gamerent_backup_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã tải xuống file sao lưu hệ thống JSON thành công!');
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        const res = importAllData(json);
        if (res.success) {
          showToast('Phục hồi dữ liệu từ file JSON thành công!');
        } else {
          alert('Lỗi phục hồi dữ liệu: ' + res.error);
        }
      } catch (err) {
        alert('File không hợp lệ hoặc sai định dạng JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    resetToDefaultData();
    setIsConfirmResetOpen(false);
    showToast('Đã khôi phục toàn bộ CSDL và cấu hình về mặc định ban đầu!');
  };

  // =========================================================================
  // RENTER HANDLERS
  // =========================================================================
  const handleSaveRenterProfile = (e) => {
    e.preventDefault();
    if (!renterName.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    updateCurrentUser({
      name: renterName.trim(),
      phone: renterPhone.trim()
    });
    showToast('Đã cập nhật hồ sơ cá nhân thành công!');
  };

  const handleSaveRenterPassword = (e) => {
    e.preventDefault();
    setRenterPassError('');
    setRenterPassSuccess('');

    if (!renterCurrentPass) {
      setRenterPassError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!renterNewPass || renterNewPass.length < 6) {
      setRenterPassError('Mật khẩu mới phải có tối thiểu 6 ký tự (Quy tắc kiểm thử BVA).');
      return;
    }
    if (renterNewPass !== renterConfirmNewPass) {
      setRenterPassError('Mật khẩu xác nhận không trùng khớp với mật khẩu mới.');
      return;
    }
    if (renterNewPass === renterCurrentPass) {
      setRenterPassError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    const res = changePassword(renterCurrentPass, renterNewPass);
    if (!res.success) {
      setRenterPassError(res.error);
      return;
    }

    setRenterPassSuccess('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới để đăng nhập lần sau.');
    setRenterCurrentPass('');
    setRenterNewPass('');
    setRenterConfirmNewPass('');
    showToast('Đã cập nhật mật khẩu mới thành công!');
  };

  const handleSaveRenterPreferences = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('gamerent_pref_notify_expiring', notifyExpiring);
      localStorage.setItem('gamerent_pref_suggest_extension', autoSuggestExtension);
      localStorage.setItem('gamerent_pref_autocopy', autoCopyPass);
      localStorage.setItem('gamerent_pref_insurance', showInsuranceBadge);
    } catch {
      // ignore
    }
    showToast('Đã lưu tùy chọn trải nghiệm thành công!');
  };

  // Thống kê dành cho khách thuê
  const userRentals = Array.isArray(rentals) ? rentals.filter(r => r.userId === currentUser?.id) : [];
  const totalSpent = userRentals.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const activeRentalsCount = userRentals.filter(r => r.status === 'active').length;

  // Tabs admin
  const ADMIN_TABS = [
    { id: 'general', label: 'Cấu Hình Chung', icon: Sliders },
    { id: 'bva', label: 'Quy Tắc Kiểm Thử BVA', icon: Shield },
    { id: 'admin', label: 'Hồ Sơ Quản Trị Viên', icon: User },
    { id: 'backup', label: 'Sao Lưu & Khôi Phục', icon: Database }
  ];

  // Tabs khách thuê
  const RENTER_TABS = [
    { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: User },
    { id: 'security', label: 'Đổi Mật Khẩu & Bảo Mật', icon: Lock },
    { id: 'preferences', label: 'Tùy Chọn & Trải Nghiệm', icon: Sliders }
  ];

  // =========================================================================
  // GIAO DIỆN KHÁCH THUÊ (RENTER SETTINGS)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="dashboard-container" style={{ paddingBottom: 60 }}>
        {/* Page Header */}
        <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>
              <User size={13} /> TÀI KHOẢN KHÁCH THUÊ
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <span>Cài Đặt Tài Khoản & Bảo Mật</span>
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4, marginBottom: 0 }}>
              Quản lý thông tin hồ sơ, thay đổi mật khẩu đăng nhập và tùy chỉnh trải nghiệm thuê nick của bạn
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', fontSize: '0.78rem', fontWeight: 700 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>Tài khoản: Đang hoạt động</span>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '2px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {currentUser?.name || 'Khách Thuê'}
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: '#ECFDF5',
                    color: '#059669',
                    border: '1px solid #A7F3D0'
                  }}
                >
                  MEMBER
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'block', marginTop: 2 }}>
                {currentUser?.email} • Mã ID: <strong>#{currentUser?.id || 'GUEST'}</strong>
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ background: '#FFFFFF', padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', textAlign: 'center', minWidth: 100 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Số dư ví</span>
              <strong style={{ fontSize: '0.94rem', color: 'var(--primary)' }}>
                {(currentUser?.balance || 0).toLocaleString('vi-VN')} đ
              </strong>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', textAlign: 'center', minWidth: 100 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Đơn đã thuê</span>
              <strong style={{ fontSize: '0.94rem', color: 'var(--text-main)' }}>
                {userRentals.length} ca
              </strong>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', textAlign: 'center', minWidth: 100 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Đang chơi</span>
              <strong style={{ fontSize: '0.94rem', color: activeRentalsCount > 0 ? '#059669' : '#64748B' }}>
                {activeRentalsCount} acc
              </strong>
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #059669, #10B981)',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 18,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tabs Switcher */}
        <div
          style={{
            display: 'inline-flex',
            background: '#F1F5F9',
            padding: 4,
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            gap: 4,
            marginBottom: 24,
            overflowX: 'auto',
            maxWidth: '100%'
          }}
        >
          {RENTER_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = renterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-renter-${tab.id}`}
                data-testid={`tab-renter-${tab.id}`}
                onClick={() => setRenterTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  borderRadius: 9,
                  border: 'none',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#0F172A' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary)' : '#94A3B8'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: HỒ SƠ CÁ NHÂN ================= */}
        {renterTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Form chỉnh sửa thông tin */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 22, boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <User size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Cập Nhật Thông Tin Cá Nhân</h3>
              </div>

              <form onSubmit={handleSaveRenterProfile}>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" htmlFor="input-renter-name" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Họ và tên <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      id="input-renter-name"
                      data-testid="input-renter-name"
                      className="form-input"
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      required
                      style={{ width: '100%', paddingLeft: 36 }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" htmlFor="input-renter-phone" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Số điện thoại liên hệ
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Smartphone size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      id="input-renter-phone"
                      data-testid="input-renter-phone"
                      className="form-input"
                      value={renterPhone}
                      onChange={(e) => setRenterPhone(e.target.value)}
                      placeholder="Ví dụ: 0912345678"
                      style={{ width: '100%', paddingLeft: 36 }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label" htmlFor="input-renter-email" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Địa chỉ Email đăng nhập
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      id="input-renter-email"
                      data-testid="input-renter-email"
                      className="form-input"
                      value={renterEmail}
                      disabled
                      style={{ width: '100%', paddingLeft: 36, background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                    Email định danh tài khoản, không thể tự ý thay đổi.
                  </span>
                </div>

                <button
                  type="submit"
                  id="btn-save-renter-profile"
                  data-testid="btn-save-renter-profile"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 18px',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  <Save size={15} /> Lưu Thay Đổi Hồ Sơ
                </button>
              </form>
            </div>

            {/* Chi tiết hoạt động và quyền lợi */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 22, boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Award size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Quyền Lợi & Thông Tin Dịch Vụ</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                  <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block' }}>Chính sách bảo hiểm hoàn tiền 100%</strong>
                    <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                      Toàn bộ các ca thuê tài khoản game đều được hệ thống bảo hiểm 100%. Nếu có lỗi sai mật khẩu hoặc bị khóa, bạn được bồi hoàn tiền ngay.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                  <Clock size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block' }}>Gia hạn nối tiếp linh hoạt</strong>
                    <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                      Bạn có thể bấm Gia hạn thêm giờ bất cứ lúc nào trong khi đang chơi game, thời gian thuê mới sẽ được cộng dồn chính xác theo từng phút.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                  <Coins size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block' }}>Nạp ví VietQR Auto tức thì</strong>
                    <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                      Hỗ trợ kiểm thử nạp ví từ 10.000 đ đến 5.000.000 đ chuẩn kiểm thử BVA, tiền vào ví chỉ trong 1 giây.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ĐỔI MẬT KHẨU & BẢO MẬT ================= */}
        {renterTab === 'security' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Form đổi mật khẩu */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 22, boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Key size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Đổi Mật Khẩu Đăng Nhập</h3>
              </div>

              {renterPassError && (
                <div
                  id="renter-pass-error-alert"
                  data-testid="renter-pass-error-alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 12px',
                    borderRadius: 8,
                    background: 'var(--accent-red-bg)',
                    border: '1px solid var(--accent-red-border)',
                    color: 'var(--accent-red-text)',
                    fontSize: '0.82rem',
                    marginBottom: 14
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{renterPassError}</span>
                </div>
              )}

              {renterPassSuccess && (
                <div
                  id="renter-pass-success-alert"
                  data-testid="renter-pass-success-alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 12px',
                    borderRadius: 8,
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#059669',
                    fontSize: '0.82rem',
                    marginBottom: 14
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{renterPassSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveRenterPassword}>
                {/* Mật khẩu hiện tại */}
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" htmlFor="input-renter-current-password" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Mật khẩu hiện tại <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showRenterCurrentPass ? 'text' : 'password'}
                      id="input-renter-current-password"
                      data-testid="input-renter-current-password"
                      className="form-input"
                      value={renterCurrentPass}
                      onChange={(e) => setRenterCurrentPass(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', paddingLeft: 36, paddingRight: 36 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRenterCurrentPass(!showRenterCurrentPass)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 2 }}
                    >
                      {showRenterCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" htmlFor="input-renter-new-password" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Mật khẩu mới <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showRenterNewPass ? 'text' : 'password'}
                      id="input-renter-new-password"
                      data-testid="input-renter-new-password"
                      className="form-input"
                      value={renterNewPass}
                      onChange={(e) => setRenterNewPass(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự (Quy tắc BVA)"
                      required
                      style={{ width: '100%', paddingLeft: 36, paddingRight: 36 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRenterNewPass(!showRenterNewPass)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 2 }}
                    >
                      {showRenterNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                    Độ dài hợp lệ theo chuẩn kiểm thử: từ 6 ký tự trở lên.
                  </span>
                </div>

                {/* Nhập lại mật khẩu mới */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label" htmlFor="input-renter-confirm-password" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Nhập lại mật khẩu mới <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showRenterConfirmPass ? 'text' : 'password'}
                      id="input-renter-confirm-password"
                      data-testid="input-renter-confirm-password"
                      className="form-input"
                      value={renterConfirmNewPass}
                      onChange={(e) => setRenterConfirmNewPass(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', paddingLeft: 36, paddingRight: 36 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRenterConfirmPass(!showRenterConfirmPass)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 2 }}
                    >
                      {showRenterConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-save-renter-password"
                  data-testid="btn-save-renter-password"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 18px',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  <Lock size={15} /> Cập Nhật Mật Khẩu
                </button>
              </form>
            </div>

            {/* Khuyến nghị bảo mật */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 22, boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Nguyên Tắc Bảo Mật & Thu Hồi Pass</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Sparkles size={14} color="var(--primary)" />
                    <span>Thu hồi và đổi mật khẩu tự động 100%</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                    Mỗi khi ca thuê kết thúc hoặc bạn bấm "Trả sớm", hệ thống GameRent sẽ kích hoạt robot tự động sinh mật khẩu ngẫu nhiên mới và thu hồi acc. Bạn hoàn toàn không cần lo về tranh chấp sau ca chơi.
                  </p>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Shield size={14} color="#2563EB" />
                    <span>Cam kết bảo mật thông tin</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                    Mật khẩu đăng nhập của bạn được lưu trữ an toàn trong LocalStorage Engine theo chuẩn biệt lập. Không chia sẻ tài khoản cho bên thứ ba để đảm bảo số dư ví luôn an toàn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: TÙY CHỌN & TRẢI NGHIỆM ================= */}
        {renterTab === 'preferences' && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, maxWidth: 700, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Sliders size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Tùy Chọn Thông Báo & Trải Nghiệm Khách Thuê</h3>
            </div>

            <form onSubmit={handleSaveRenterPreferences}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 1. Cảnh báo hết giờ */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', background: '#F8FAFC' }}>
                  <input
                    type="checkbox"
                    id="checkbox-pref-notify-expiring"
                    data-testid="checkbox-pref-notify-expiring"
                    checked={notifyExpiring}
                    onChange={(e) => setNotifyExpiring(e.target.checked)}
                    style={{ marginTop: 3, accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'block' }}>
                      Cảnh báo khi ca thuê sắp hết hạn (&lt; 30 phút)
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Chuông thông báo đổi sang màu vàng cam và cảnh báo thời gian chơi sắp kết thúc để bạn kịp gia hạn.
                    </span>
                  </div>
                </label>

                {/* 2. Gợi ý gia hạn */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', background: '#F8FAFC' }}>
                  <input
                    type="checkbox"
                    id="checkbox-pref-suggest-extension"
                    data-testid="checkbox-pref-suggest-extension"
                    checked={autoSuggestExtension}
                    onChange={(e) => setAutoSuggestExtension(e.target.checked)}
                    style={{ marginTop: 3, accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'block' }}>
                      Tự động gợi ý nút gia hạn nhanh trên trang đơn thuê
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Nổi bật nút bấm "Gia hạn thêm giờ" khi ca chơi chỉ còn dưới 1 giờ.
                    </span>
                  </div>
                </label>

                {/* 3. Tự động sao chép mật khẩu */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', background: '#F8FAFC' }}>
                  <input
                    type="checkbox"
                    id="checkbox-pref-autocopy"
                    data-testid="checkbox-pref-autocopy"
                    checked={autoCopyPass}
                    onChange={(e) => setAutoCopyPass(e.target.checked)}
                    style={{ marginTop: 3, accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'block' }}>
                      Ghi nhớ tùy chọn thanh toán nhanh
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Tự động chọn thời lượng thuê mặc định 2 giờ khi mở cửa sổ xác nhận thuê nick mới.
                    </span>
                  </div>
                </label>

                {/* 4. Huy hiệu bảo hiểm */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', background: '#F8FAFC' }}>
                  <input
                    type="checkbox"
                    id="checkbox-pref-insurance"
                    data-testid="checkbox-pref-insurance"
                    checked={showInsuranceBadge}
                    onChange={(e) => setShowInsuranceBadge(e.target.checked)}
                    style={{ marginTop: 3, accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'block' }}>
                      Luôn hiển thị huy hiệu "Bảo hiểm hoàn tiền 100%" trên thẻ acc
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Hiển thị nhãn xanh bảo hiểm cam kết hỗ trợ khách hàng 24/7.
                    </span>
                  </div>
                </label>
              </div>

              <div style={{ marginTop: 22 }}>
                <button
                  type="submit"
                  id="btn-save-renter-preferences"
                  data-testid="btn-save-renter-preferences"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 18px',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  <Save size={15} /> Lưu Cài Đặt Tùy Chọn
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN QUẢN TRỊ VIÊN (ADMIN SETTINGS)
  // =========================================================================
  return (
    <div className="dashboard-container" style={{ paddingBottom: 60 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>
            <Settings size={13} /> CẤU HÌNH HỆ THỐNG
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <span>Cài Đặt Vận Hành & Tham Số Kiểm Thử</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4, marginBottom: 0 }}>
            Quản lý nhận diện thương hiệu, tham số giá trị biên BVA, hồ sơ quản trị và sao lưu CSDL
          </p>
        </div>

        {/* Database & Storage Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 14px', borderRadius: 20, background: '#F8FAFC', border: '1px solid var(--border-subtle)', color: '#475569', fontSize: '0.78rem', fontWeight: 600 }}>
          <Database size={15} color="var(--primary)" />
          <span>Lưu trữ: <strong style={{ color: 'var(--text-main)' }}>LocalStorage Engine</strong></span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          background: 'linear-gradient(135deg, #059669, #10B981)',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: '0.86rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 18,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Navigation (Segmented Pill Switcher) */}
      <div
        style={{
          display: 'inline-flex',
          background: '#F1F5F9',
          padding: 4,
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          gap: 4,
          marginBottom: 24,
          overflowX: 'auto',
          maxWidth: '100%'
        }}
      >
        {ADMIN_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-settings-${tab.id}`}
              data-testid={`tab-settings-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 9,
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#0F172A' : '#64748B',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--primary)' : '#94A3B8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: CẤU HÌNH CHUNG ================= */}
      {activeTab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Form cấu hình nền tảng */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Sliders size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Cấu Hình Nhận Diện Nền Tảng</h3>
            </div>

            <form onSubmit={handleSaveGeneral}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" htmlFor="input-site-name" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Tên nền tảng (Brand Name)
                </label>
                <input
                  type="text"
                  id="input-site-name"
                  data-testid="input-site-name"
                  className="form-input"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="GameRent"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" htmlFor="input-site-slogan" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Khẩu hiệu (Slogan)
                </label>
                <input
                  type="text"
                  id="input-site-slogan"
                  data-testid="input-site-slogan"
                  className="form-input"
                  value={siteSlogan}
                  onChange={(e) => setSiteSlogan(e.target.value)}
                  placeholder="Thuê tài khoản game"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-support-hotline" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Hotline hỗ trợ 24/7
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      id="input-support-hotline"
                      data-testid="input-support-hotline"
                      className="form-input"
                      value={supportHotline}
                      onChange={(e) => setSupportHotline(e.target.value)}
                      placeholder="1900 6868"
                      style={{ width: '100%', paddingLeft: 34 }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-support-email" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                    Email tiếp nhận sự cố
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      id="input-support-email"
                      data-testid="input-support-email"
                      className="form-input"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="hotro@gamerent.vn"
                      style={{ width: '100%', paddingLeft: 34 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    id="checkbox-maintenance-mode"
                    data-testid="checkbox-maintenance-mode"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  <span>Kích hoạt chế độ Bảo Trì Hệ Thống (Maintenance Mode)</span>
                </label>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: 4, marginLeft: 26 }}>
                  Khi bật, chỉ Admin có thể thao tác, khách hàng sẽ nhận được cảnh báo tạm ngưng dịch vụ.
                </span>
              </div>

              <button
                type="submit"
                id="btn-save-general-settings"
                data-testid="btn-save-general-settings"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', fontWeight: 700, fontSize: '0.84rem' }}
              >
                <Save size={15} /> Lưu Cấu Hình Nền Tảng
              </button>
            </form>
          </div>

          {/* Thẻ thông tin kiến trúc nền tảng */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Globe size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Môi Trường & Kiến Trúc Nền Tảng</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Đề tài BTL Môn Kiểm Thử Phần Mềm (KTPM)</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  Hệ thống thuê tài khoản game trực tuyến GameRent v1.0.0. Tích hợp đầy đủ các kịch bản kiểm thử biên (BVA) và phân vùng tương đương (EP).
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Động cơ lưu trữ dữ liệu</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  Browser LocalStorage Engine với cơ chế tự động đồng bộ theo thời gian thực (Zero-refresh Sync) và tự động sinh bản sao lưu JSON.
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Trạng thái vận hành</strong>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  Máy chủ trực tuyến • Sẵn sàng phục vụ kiểm thử
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: QUY TẮC BVA ================= */}
      {activeTab === 'bva' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Form cấu hình BVA */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Shield size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Tham Số Giá Trị Biên & Nghiệp Vụ (BVA)</h3>
            </div>

            <form onSubmit={handleSaveBvaRules}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Coins size={15} color="var(--primary)" /> Hạn Mức Nạp Tiền Vào Ví (BVA: 10.000đ - 5.000.000đ)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-min-deposit" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                      Tối thiểu mỗi lần nạp (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="input-min-deposit"
                      data-testid="input-min-deposit"
                      className="form-input"
                      value={minDeposit}
                      onChange={(e) => setMinDeposit(e.target.value)}
                      min={1000}
                      step={1000}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-max-deposit" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                      Tối đa mỗi lần nạp (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="input-max-deposit"
                      data-testid="input-max-deposit"
                      className="form-input"
                      value={maxDeposit}
                      onChange={(e) => setMaxDeposit(e.target.value)}
                      min={10000}
                      step={10000}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={15} color="#2563EB" /> Thời Lượng Thuê Mỗi Ca (BVA: 1h - 48h)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-min-rental-hours" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                      Số giờ thuê tối thiểu (Giờ)
                    </label>
                    <input
                      type="number"
                      id="input-min-rental-hours"
                      data-testid="input-min-rental-hours"
                      className="form-input"
                      value={minRentalHours}
                      onChange={(e) => setMinRentalHours(e.target.value)}
                      min={1}
                      max={24}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-max-rental-hours" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                      Số giờ thuê tối đa (Giờ)
                    </label>
                    <input
                      type="number"
                      id="input-max-rental-hours"
                      data-testid="input-max-rental-hours"
                      className="form-input"
                      value={maxRentalHours}
                      onChange={(e) => setMaxRentalHours(e.target.value)}
                      min={1}
                      max={168}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-warning-threshold" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                    Ngưỡng cảnh báo sắp hết giờ (Phút)
                  </label>
                  <input
                    type="number"
                    id="input-warning-threshold"
                    data-testid="input-warning-threshold"
                    className="form-input"
                    value={warningThresholdMins}
                    onChange={(e) => setWarningThresholdMins(e.target.value)}
                    min={5}
                    max={180}
                    required
                    style={{ width: '100%', maxWidth: 220 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-save-bva-rules"
                data-testid="btn-save-bva-rules"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', fontWeight: 700, fontSize: '0.84rem' }}
              >
                <Save size={15} /> Lưu Quy Tắc Kiểm Thử
              </button>
            </form>
          </div>

          {/* Thẻ hướng dẫn kiểm thử BVA */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Ma Trận Kiểm Thử Giá Trị Biên</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Kiểm thử nạp ví (BVA)</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  • Điểm biên dưới: 9.999đ (Hợp lệ: Sai), 10.000đ (Đúng)<br />
                  • Điểm biên trên: 5.000.000đ (Đúng), 5.000.001đ (Sai)
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Kiểm thử thời lượng thuê</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  • Biên dưới: 0 giờ (Từ chối), 1 giờ (Chấp nhận)<br />
                  • Biên trên: 48 giờ (Chấp nhận), 49 giờ (Từ chối)
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Độ dài mật khẩu (EP)</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  • Không hợp lệ: dưới 6 ký tự<br />
                  • Hợp lệ: từ 6 ký tự trở lên (Áp dụng cho Admin và Renter)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: HỒ SƠ ADMIN ================= */}
      {activeTab === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Form hồ sơ quản trị */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <User size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Hồ Sơ & Mật Khẩu Quản Trị Viên</h3>
            </div>

            {adminError && (
              <div style={{ padding: '8px 12px', background: '#FEE2E2', border: '1px solid #FECDD3', color: '#DC2626', borderRadius: 8, fontSize: '0.82rem', marginBottom: 14 }}>
                {adminError}
              </div>
            )}

            <form onSubmit={handleSaveAdminProfile}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" htmlFor="input-admin-name" style={{ fontSize: '0.82rem', marginBottom: 4, display: 'block' }}>
                  Tên hiển thị Quản Trị Viên
                </label>
                <input
                  type="text"
                  id="input-admin-name"
                  data-testid="input-admin-name"
                  className="form-input"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-admin-email" style={{ fontSize: '0.82rem', marginBottom: 4, display: 'block' }}>
                    Email đăng nhập Admin
                  </label>
                  <input
                    type="email"
                    id="input-admin-email"
                    data-testid="input-admin-email"
                    className="form-input"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-admin-phone" style={{ fontSize: '0.82rem', marginBottom: 4, display: 'block' }}>
                    Số điện thoại quản trị
                  </label>
                  <input
                    type="tel"
                    id="input-admin-phone"
                    data-testid="input-admin-phone"
                    className="form-input"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: 14, marginTop: 14 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={15} color="#059669" /> Đổi Mật Khẩu Quản Trị Viên
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-admin-new-password" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                      Mật khẩu mới (Tối thiểu 6 ký tự)
                    </label>
                    <input
                      type="password"
                      id="input-admin-new-password"
                      data-testid="input-admin-new-password"
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="input-admin-confirm-password" style={{ fontSize: '0.8rem', marginBottom: 4, display: 'block' }}>
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="input-admin-confirm-password"
                      data-testid="input-admin-confirm-password"
                      className="form-input"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="btn-save-admin-profile"
                data-testid="btn-save-admin-profile"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', fontWeight: 700, fontSize: '0.84rem' }}
              >
                <Save size={15} /> Cập Nhật Hồ Sơ Quản Trị
              </button>
            </form>
          </div>

          {/* Thẻ quyền hạn & chính sách admin */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Key size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Quyền Hạn & Nguyên Tắc An Toàn</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Định danh vai trò</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  Vai trò quản trị viên cấp cao nhất (ROLE_ADMIN). Cho phép truy cập toàn bộ menu tổng quan, kho tài khoản, quản lý đơn thuê, duyệt ví và sao lưu CSDL.
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Bảo mật phiên đăng nhập</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  Thông tin đăng nhập được lưu trữ an toàn trong LocalStorage. Hãy đổi mật khẩu định kỳ để bảo vệ số dư quỹ ví và dữ liệu khách hàng.
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: '#F8FAFC', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0F172A', display: 'block', marginBottom: 2 }}>Trách nhiệm sao lưu dữ liệu</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45, display: 'block' }}>
                  Khuyến nghị quản trị viên xuất file sao lưu JSON trước khi thực hiện các đợt kiểm thử khối lượng lớn hoặc bàn giao hệ thống.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SAO LƯU & KHÔI PHỤC ================= */}
      {activeTab === 'backup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 1. Database Status Overview Strip */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 14,
              padding: '18px 22px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Database size={19} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Hiện Trạng CSDL Hệ Thống
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Thống kê các bản ghi dữ liệu đang lưu trữ trong LocalStorage Engine
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span>ĐỒNG BỘ TỨC THÌ (REALTIME)</span>
              </div>
            </div>

            {/* Quick Counters Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Tài khoản Game</span>
                  <Gamepad2 size={15} color="var(--primary)" />
                </div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)', display: 'block', marginTop: 4 }}>
                  {accounts?.length || 0} <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>nick</span>
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: 2, display: 'block' }}>
                  {accounts?.filter(a => a.status === 'rented')?.length || 0} nick đang thuê
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Lịch sử ca thuê</span>
                  <Clock size={15} color="#2563EB" />
                </div>
                <strong style={{ fontSize: '1.25rem', color: '#2563EB', display: 'block', marginTop: 4 }}>
                  {rentals?.length || 0} <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>đơn</span>
                </strong>
                <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 2, display: 'block' }}>
                  {rentals?.filter(r => r.status === 'active')?.length || 0} ca đang hoạt động
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Hồ sơ khách CRM</span>
                  <Users size={15} color="#7C3AED" />
                </div>
                <strong style={{ fontSize: '1.25rem', color: '#7C3AED', display: 'block', marginTop: 4 }}>
                  {customers?.length || 0} <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>khách</span>
                </strong>
                <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 2, display: 'block' }}>
                  Đồng bộ danh bạ CRM
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Giao dịch ví & BVA</span>
                  <Coins size={15} color="#D97706" />
                </div>
                <strong style={{ fontSize: '1.25rem', color: '#D97706', display: 'block', marginTop: 4 }}>
                  {transactions?.length || 0} <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>lượt</span>
                </strong>
                <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 2, display: 'block' }}>
                  Bao gồm quy tắc BVA
                </span>
              </div>
            </div>
          </div>

          {/* 2. Operations Row: 2 Balanced Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Card Export JSON */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: 24,
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <Download size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569' }}>
                    JSON BACKUP v1.0
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  Xuất File Sao Lưu CSDL (JSON)
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Đóng gói toàn bộ cơ sở dữ liệu hiện tại của hệ thống thành file JSON tiêu chuẩn để lưu trữ an toàn, chuyển giao sang máy khác hoặc nộp bài BTL.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                    <Check size={14} color="#059669" />
                    <span>Toàn bộ {accounts?.length || 0} tài khoản game & mật khẩu mã hóa</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                    <Check size={14} color="#059669" />
                    <span>{rentals?.length || 0} ca thuê, {customers?.length || 0} khách hàng CRM & số dư ví</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#059669' }}>
                    <Check size={14} color="#059669" />
                    <span>Bộ tham số giá trị biên BVA & hồ sơ quản trị</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-export-json-backup"
                data-testid="btn-export-json-backup"
                onClick={handleExportData}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 20px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  borderRadius: 10,
                  width: '100%'
                }}
              >
                <FileJson size={16} /> Tải Xuống File Backup (.json)
              </button>
            </div>

            {/* Card Import JSON */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: 24,
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                    <Upload size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569' }}>
                    1-CLICK RESTORE
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  Phục Hồi Dữ Liệu Từ File JSON
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Khôi phục lại hiện trạng hệ thống từ file backup đã xuất trước đó. Dữ liệu sẽ lập tức được cập nhật đồng bộ sang kho acc, đơn thuê và bảng điều khiển.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                    <Check size={14} color="#2563EB" />
                    <span>Tự động kiểm tra định dạng và cấu trúc JSON hợp lệ</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#2563EB' }}>
                    <Check size={14} color="#2563EB" />
                    <span>Ghi đè an toàn vào LocalStorage của trình duyệt</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#2563EB' }}>
                    <Check size={14} color="#2563EB" />
                    <span>Làm mới toàn bộ state ứng dụng ngay tức thì</span>
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".json,application/json"
                  style={{ display: 'none' }}
                  id="input-file-backup"
                />

                <button
                  type="button"
                  id="btn-trigger-import-json"
                  data-testid="btn-trigger-import-json"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px 20px',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    borderRadius: 10,
                    width: '100%'
                  }}
                >
                  <Upload size={16} /> Chọn File Backup Phục Hồi
                </button>
              </div>
            </div>
          </div>

          {/* 3. Danger Zone Card (Harmonious horizontal layout) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FFF8F8 0%, #FFFFFF 100%)',
              border: '1px solid #FECDD3',
              borderRadius: 14,
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 18,
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, maxWidth: 640 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: '#FEE2E2', border: '1px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', flexShrink: 0, marginTop: 2 }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#991B1B', margin: 0 }}>
                    Vùng Nguy Hiểm: Khôi Phục Dữ Liệu Gốc Ban Đầu
                  </h3>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#FEE2E2', color: '#DC2626' }}>
                    CẢNH BÁO
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>
                  Thao tác này sẽ xóa sạch các thay đổi trong LocalStorage và khôi phục toàn bộ 8 tài khoản game gốc, 3 ca thuê mẫu của BTL, số dư ví Admin và cấu hình kiểm thử mặc định.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-open-confirm-reset"
              data-testid="btn-open-confirm-reset"
              onClick={() => setIsConfirmResetOpen(true)}
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 9,
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}
            >
              <RotateCcw size={16} /> Khôi Phục CSDL Gốc Mặc Định
            </button>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Khôi Phục Dữ Liệu */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleConfirmReset}
        title="Khôi Phục Dữ Liệu Mặc Định"
        message="Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu kiểm thử về mặc định?"
        subMessage="Toàn bộ 8 tài khoản game, 3 ca thuê đang hoạt động, lịch sử giao dịch và tài khoản Admin sẽ được làm mới về dữ liệu gốc ban đầu của BTL."
        confirmText="Xác Nhận Khôi Phục"
        cancelText="Hủy Bỏ"
        type="warning"
        icon={<RefreshCw size={20} strokeWidth={2.4} />}
      />
    </div>
  );
};
