import React, { useState, useRef } from 'react';
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
  Sparkles
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
    exportAllData,
    importAllData,
    resetToDefaultData
  } = useApp();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'bva' | 'admin' | 'backup'
  const [toastMessage, setToastMessage] = useState('');
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Form State: Tab 1 (Chung)
  const [siteName, setSiteName] = useState(systemSettings?.siteName || 'GameRent');
  const [siteSlogan, setSiteSlogan] = useState(systemSettings?.siteSlogan || 'Thuê tài khoản game');
  const [supportHotline, setSupportHotline] = useState(systemSettings?.supportHotline || '1900 6868');
  const [supportEmail, setSupportEmail] = useState(systemSettings?.supportEmail || 'hotro@gamerent.vn');
  const [maintenanceMode, setMaintenanceMode] = useState(systemSettings?.maintenanceMode || false);

  // Form State: Tab 2 (BVA & Nghiệp vụ)
  const [minDeposit, setMinDeposit] = useState(systemSettings?.minDeposit || 10000);
  const [maxDeposit, setMaxDeposit] = useState(systemSettings?.maxDeposit || 5000000);
  const [minRentalHours, setMinRentalHours] = useState(systemSettings?.minRentalHours || 1);
  const [maxRentalHours, setMaxRentalHours] = useState(systemSettings?.maxRentalHours || 48);
  const [warningThresholdMins, setWarningThresholdMins] = useState(systemSettings?.warningThresholdMins || 60);
  const [autoRevokeOnExpiry, setAutoRevokeOnExpiry] = useState(systemSettings?.autoRevokeOnExpiry !== false);
  const [autoRefundFirst15m, setAutoRefundFirst15m] = useState(systemSettings?.autoRefundFirst15m !== false);

  // Form State: Tab 3 (Admin Profile)
  const [adminName, setAdminName] = useState(currentUser?.name || 'Quản Lý');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || 'admin@gamerent.vn');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phone || '0909999999');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Lưu Tab 1: Cấu hình chung
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

  // Lưu Tab 2: Quy tắc BVA & Kiểm thử
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

  // Lưu Tab 3: Hồ sơ Admin
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

  // Tab 4: Export JSON
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

  // Tab 4: Import JSON
  const handleImportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const res = importAllData(parsed);
        if (res.success) {
          showToast('Khôi phục dữ liệu từ file backup JSON thành công!');
        } else {
          alert('Lỗi import dữ liệu: ' + res.error);
        }
      } catch (err) {
        alert('File không hợp lệ hoặc sai định dạng JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Tab 4: Reset Default
  const handleConfirmReset = () => {
    resetToDefaultData();
    showToast('Đã khôi phục toàn bộ CSDL demo & tham số kiểm thử về ban đầu!');
  };

  const TABS = [
    { id: 'general', label: 'Nền Tảng & Thương Hiệu', icon: Globe },
    { id: 'bva', label: 'Quy Tắc BVA & Kiểm Thử', icon: Sliders },
    { id: 'admin', label: 'Hồ Sơ Quản Trị Viên', icon: User },
    { id: 'backup', label: 'Dữ Liệu & Sao Lưu', icon: Database },
  ];

  return (
    <div className="dashboard-container" style={{ paddingBottom: 60 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>
            <Settings size={13} /> CẤU HÌNH HỆ THỐNG
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Cài Đặt Vận Hành & Tham Số Kiểm Thử</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
            Quản lý nhận diện thương hiệu, tham số giá trị biên BVA, hồ sơ quản trị và sao lưu CSDL
          </p>
        </div>

        {/* Global Live Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', fontSize: '0.78rem', fontWeight: 700 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          <span>Hệ thống: Trực tuyến 24/7</span>
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

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-subtle)', marginBottom: 22, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-settings-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: isActive ? '3px solid #10B981' : '3px solid transparent',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#059669' : '#64748B',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#10B981' : '#94A3B8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: NỀN TẢNG & THƯƠNG HIỆU ================= */}
      {activeTab === 'general' && (
        <div style={{ maxWidth: 800 }}>
          <form onSubmit={handleSaveGeneral} className="rental-table-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ paddingBottom: 14, borderBottom: '1px solid #F1F5F9', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={18} color="#10B981" />
                <span>Nhận Diện Thương Hiệu & Thông Tin Liên Hệ</span>
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                Các thông số này sẽ tự động đồng bộ lên Logo Sidebar, Header và trang chủ website
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Tên Nền Tảng (Website Brand Name)
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="input-settings-site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Ví dụ: GameRent"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Khẩu Hiệu / Slogan
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="input-settings-site-slogan"
                  value={siteSlogan}
                  onChange={(e) => setSiteSlogan(e.target.value)}
                  placeholder="Ví dụ: Thuê tài khoản game"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Hotline Hỗ Trợ 24/7
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={supportHotline}
                    onChange={(e) => setSupportHotline(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                  <Phone size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Email Chăm Sóc Khách Hàng
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  />
                  <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>
            </div>

            {/* Chế độ Bảo trì */}
            <div style={{ padding: '14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>Chế Độ Bảo Trì Hệ Thống</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: 2 }}>Tạm ngưng nhận đơn thuê mới để nâng cấp máy chủ</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#10B981' }}
                />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" id="btn-save-general-settings" className="btn btn-primary" style={{ padding: '9px 22px', fontSize: '0.86rem' }}>
                <Save size={16} /> Lưu Cài Đặt Chung
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 2: QUY TẮC BVA & KIỂM THỬ ================= */}
      {activeTab === 'bva' && (
        <div style={{ maxWidth: 800 }}>
          <form onSubmit={handleSaveBvaRules} className="rental-table-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ paddingBottom: 14, borderBottom: '1px solid #F1F5F9', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563EB', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Sliders size={14} /> QUY TẮC PHÂN TÍCH GIÁ TRỊ BIÊN (BVA) & EP
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                Tham Số Giới Hạn Nghiệp Vụ Toàn Hệ Thống
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                Quy định các ngưỡng min/max phục vụ kiểm thử hộp đen chuẩn ISTQB cho phân hệ Ví và Thuê acc
              </p>
            </div>

            {/* Group 1: Nạp tiền ví BVA */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                <Coins size={16} color="#10B981" />
                <span>Hạn Mức Nạp Tiền Ví Điện Tử (VNĐ)</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: 12 }}>
                Áp dụng kiểm thử biên BVA: <code>deposit(amount)</code>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Biên Dưới Tối Thiểu (Min)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.86rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: 2, display: 'block' }}>Mặc định: 10.000 VNĐ</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Biên Trên Tối Đa (Max)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={maxDeposit}
                    onChange={(e) => setMaxDeposit(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.86rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: 2, display: 'block' }}>Mặc định: 5.000.000 VNĐ</span>
                </div>
              </div>
            </div>

            {/* Group 2: Thời lượng thuê BVA */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                <Clock size={16} color="#3B82F6" />
                <span>Thời Lượng Thuê Ca Chơi (Giờ)</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: 12 }}>
                Áp dụng kiểm thử biên BVA: <code>durationHours</code> từ 1h đến 48h
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Thời Lượng Tối Thiểu (Min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={minRentalHours}
                    onChange={(e) => setMinRentalHours(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.86rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#2563EB', marginTop: 2, display: 'block' }}>Mặc định: 1 Giờ</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Thời Lượng Tối Đa (Max)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="168"
                    value={maxRentalHours}
                    onChange={(e) => setMaxRentalHours(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.86rem', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#2563EB', marginTop: 2, display: 'block' }}>Mặc định: 48 Giờ</span>
                </div>
              </div>
            </div>

            {/* Group 3: Cảnh báo khẩn cấp & Tự động thu hồi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>Ngưỡng Cảnh Báo Vàng (Sắp hết hạn)</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Khoảng thời gian kích hoạt thông báo ca chơi sắp kết thúc</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="15"
                    value={warningThresholdMins}
                    onChange={(e) => setWarningThresholdMins(e.target.value)}
                    style={{ width: 75, padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '0.84rem', fontWeight: 700, textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>phút</span>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                <input
                  type="checkbox"
                  checked={autoRevokeOnExpiry}
                  onChange={(e) => setAutoRevokeOnExpiry(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#10B981' }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>Tự Động Đổi Pass & Thu Hồi Khi Hết Giờ</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Bot tự sinh mật khẩu ngẫu nhiên mới và chuyển trạng thái về Kho Sẵn Sàng</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                <input
                  type="checkbox"
                  checked={autoRefundFirst15m}
                  onChange={(e) => setAutoRefundFirst15m(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#10B981' }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>Bảo Hiểm Hoàn Tiền 100% Trong 15 Phút Đầu</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Áp dụng chính sách hoàn trả tức thì vào ví khi khách khiếu nại acc có lỗi</div>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" id="btn-save-bva-rules" className="btn btn-primary" style={{ padding: '9px 22px', fontSize: '0.86rem' }}>
                <Save size={16} /> Lưu Quy Tắc Kiểm Thử
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 3: HỒ SƠ QUẢN TRỊ VIÊN ================= */}
      {activeTab === 'admin' && (
        <div style={{ maxWidth: 800 }}>
          <form onSubmit={handleSaveAdminProfile} className="rental-table-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ paddingBottom: 14, borderBottom: '1px solid #F1F5F9', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} color="#10B981" />
                <span>Tài Khoản Quản Trị Viên (Admin Profile)</span>
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                Cập nhật thông tin định danh và bảo mật đăng nhập cho tài khoản Quản Lý
              </p>
            </div>

            {adminError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, marginBottom: 16 }}>
                {adminError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Tên Hiển Thị
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Email Quản Trị (Tài khoản đăng nhập)
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                Số Điện Thoại Quản Lý
              </label>
              <input
                type="text"
                className="form-input"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}
              />
            </div>

            {/* Đổi Mật Khẩu */}
            <div style={{ padding: '16px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
                <Lock size={15} color="#F59E0B" />
                <span>Đổi Mật Khẩu Admin (Để trống nếu không thay đổi)</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Nhập Lại Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Xác nhận lại mật khẩu"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" id="btn-save-admin-profile" className="btn btn-primary" style={{ padding: '9px 22px', fontSize: '0.86rem' }}>
                <Save size={16} /> Cập Nhật Hồ Sơ Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 4: DỮ LIỆU & SAO LƯU (BACKUP & RESTORE) ================= */}
      {activeTab === 'backup' && (
        <div style={{ maxWidth: 800 }}>
          <div className="rental-table-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ paddingBottom: 14, borderBottom: '1px solid #F1F5F9', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Database size={18} color="#10B981" />
                <span>Quản Lý CSDL Kiểm Thử & Sao Lưu Toàn Hệ Thống</span>
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                Xuất/Nhập dữ liệu dự án ra file JSON để phục vụ thuyết trình hoặc di chuyển dữ liệu sang thiết bị khác
              </p>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{accounts.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Tài khoản kho</div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB' }}>{rentals.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Đơn thuê acc</div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{customers.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Khách hàng CRM</div>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>{transactions.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Giao dịch ví</div>
              </div>
            </div>

            {/* Actions Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Export Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Download size={16} color="#10B981" />
                    <span>Xuất Bản Sao Lưu Dữ Liệu (Export JSON)</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: 2 }}>
                    Tải về toàn bộ kho acc, đơn thuê, lịch sử giao dịch và cài đặt thành file <code>gamerent_backup.json</code>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-export-backup-json"
                  onClick={handleExportData}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                >
                  <Download size={14} /> Xuất File JSON
                </button>
              </div>

              {/* Import Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Upload size={16} color="#3B82F6" />
                    <span>Khôi Phục Từ File Sao Lưu (Import JSON)</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: 2 }}>
                    Nạp dữ liệu từ file backup JSON đã xuất trước đó vào hệ thống
                  </div>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImportFileChange}
                  />
                  <button
                    type="button"
                    id="btn-import-backup-json"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                  >
                    <Upload size={14} /> Tải Lên File JSON
                  </button>
                </div>
              </div>

              {/* Reset to Default */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 10, border: '1px solid #FEE2E2', background: '#FEF2F2' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RotateCcw size={16} color="#EF4444" />
                    <span>Khôi Phục CSDL Mặc Định Ban Đầu</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#7F1D1D', marginTop: 2 }}>
                    Đưa toàn bộ 8 tài khoản kho, 3 ca thuê hoạt động, lịch sử ví và tham số về chuẩn BTL ban đầu
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-trigger-reset-data"
                  data-testid="btn-trigger-reset-data"
                  onClick={() => setIsConfirmResetOpen(true)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    borderRadius: 6,
                    border: '1px solid #DC2626',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <RefreshCw size={14} /> Khôi Phục Dữ Liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Khôi Phục Dữ Liệu Đồng Bộ */}
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
