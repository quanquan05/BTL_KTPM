import React from 'react';
import { ShieldCheck, Zap, Lock, RefreshCw } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 40,
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 0 20px 0',
        color: 'var(--text-muted)'
      }}
    >
      <div className="container">
        {/* 4 Feature Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 16
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Zap size={16} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: 600 }}>Tự Động 100%</h5>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>Cấp thông tin đăng nhập tức thì</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Lock size={16} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: 600 }}>Đổi Pass Tự Động</h5>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>Thu hồi pass khi hết giờ thuê</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: 600 }}>Bảo Hiểm 100%</h5>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>Hoàn tiền ngay nếu acc gặp sự cố</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <RefreshCw size={16} />
            </div>
            <div>
              <h5 style={{ color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: 600 }}>BTL Kiểm Thử PM</h5>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>Hỗ trợ data-testid cho Automation Test</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: '0.78rem' }}>
          <div>
            © 2026 <strong>GameRent</strong>. Đề tài BTL Môn Kiểm Thử Phần Mềm (KTPM).
          </div>
          <div style={{ display: 'flex', gap: 14, color: 'var(--text-subtle)' }}>
            <span>Quy định sử dụng</span>
            <span>Chính sách bồi hoàn 100%</span>
            <span>Hỗ trợ kỹ thuật 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
