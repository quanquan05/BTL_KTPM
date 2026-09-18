import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, Key, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const SettingsPage = () => {
  const { currentUser, resetToDefaultData } = useApp();
  const [siteName, setSiteName] = useState('GameRent');
  const [siteSlogan, setSiteSlogan] = useState('Thuê tài khoản game');
  const [autoRefund, setAutoRefund] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState('');
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess('Lưu cài đặt hệ thống thành công!');
    setTimeout(() => setSavedSuccess(''), 2500);
  };

  const handleConfirmReset = () => {
    resetToDefaultData();
    setSavedSuccess('Đã khôi phục toàn bộ dữ liệu kiểm thử ban đầu thành công!');
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={22} color="#10B981" />
          <span>Cài Đặt Hệ Thống</span>
        </h1>
        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
          Tùy chỉnh thông số vận hành website, chính sách hoàn tiền và dữ liệu thử nghiệm
        </p>
      </div>

      <div style={{ maxWidth: 700 }}>
        <form onSubmit={handleSave} className="rental-table-card" style={{ padding: '24px' }}>
          {savedSuccess && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '10px 14px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 700, marginBottom: 16 }}>
              {savedSuccess}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 6, display: 'block' }}>
              Tên Nền Tảng
            </label>
            <input
              type="text"
              className="form-input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 6, display: 'block' }}>
              Khẩu Hiệu / Slogan
            </label>
            <input
              type="text"
              className="form-input"
              value={siteSlogan}
              onChange={(e) => setSiteSlogan(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={autoRefund}
                onChange={(e) => setAutoRefund(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#10B981' }}
              />
              <span>Tự động hoàn tiền 100% khi khiếu nại được duyệt trong vòng 15 phút đầu</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px' }}>
              <Save size={15} /> Lưu Cài Đặt
            </button>

            <button
              type="button"
              id="btn-trigger-reset-data"
              data-testid="btn-trigger-reset-data"
              className="btn btn-secondary"
              onClick={() => setIsConfirmResetOpen(true)}
              style={{ padding: '8px 18px' }}
            >
              <RefreshCw size={15} /> Khôi Phục Dữ Liệu
            </button>
          </div>
        </form>
      </div>

      {/* Modal Xác Nhận Khôi Phục Dữ Liệu Đồng Bộ */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleConfirmReset}
        title="Khôi Phục Dữ Liệu Mặc Định"
        message="Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu kiểm thử về mặc định?"
        subMessage="Lưu ý: Tất cả tài khoản game, khách hàng, số dư và đơn thuê sẽ được thiết lập lại ban đầu."
        confirmText="Khôi Phục Dữ Liệu"
        cancelText="Hủy Bỏ"
        type="warning"
        icon={<RefreshCw size={20} strokeWidth={2.4} />}
      />
    </div>
  );
};
