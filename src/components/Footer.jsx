import React from 'react';
import { ShieldCheck, Zap, Lock, RefreshCw } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 60,
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 0 26px 0',
        color: 'var(--text-muted)',
        boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.02)'
      }}
    >
      <div className="container">
        {/* 4 Feature Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            paddingBottom: 30,
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 24
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ padding: 8, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Zap size={20} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>Giao Dịch Tự Động 100%</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Nhận pass ngay sau khi thanh toán</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ padding: 8, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Lock size={20} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>Bảo Mật & Tự Đổi Pass</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Thu hồi pass tự động khi hết giờ thuê</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ padding: 8, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>Bảo Hiểm Tranh Chấp</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Hoàn tiền 100% nếu acc sai mật khẩu</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ padding: 8, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <RefreshCw size={20} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>BTL Kiểm Thử Phần Mềm</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Tích hợp Test IDs & Bộ dữ liệu kiểm thử</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem' }}>
          <div>
            © 2026 <strong>GameRent Platform</strong>. Đề tài BTL Môn Kiểm Thử Phần Mềm (KTPM).
          </div>
          <div style={{ display: 'flex', gap: 16, color: 'var(--text-subtle)' }}>
            <span>Quy định sử dụng</span>
            <span>Chính sách đền bù</span>
            <span>Báo cáo sự cố</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
