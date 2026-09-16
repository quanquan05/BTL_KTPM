import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Check, Key, Sparkles, Award, Globe, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountDetailPage = ({ account, onBack, onRentNow, onOpenDeposit }) => {
  const { currentUser } = useApp();
  const [duration, setDuration] = useState(2);

  if (!account) return null;

  const hours = Number(duration) || 1;
  const totalPrice = account.pricePerHour * hours;
  const userBalance = currentUser?.balance || 0;
  const isAvailable = account.status === 'available';

  return (
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* Back Button */}
      <button
        type="button"
        id="btn-back-to-home"
        data-testid="btn-back-to-home"
        onClick={onBack}
        className="btn btn-secondary"
        style={{ marginBottom: 16, padding: '6px 12px', fontSize: '0.84rem' }}
      >
        <ArrowLeft size={15} /> Quay lại kho tài khoản
      </button>

      {/* 2-Column Golden Ratio Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(310px, 1.1fr)', gap: 20, alignItems: 'start' }}>
        {/* Left Column: Specs & Showcase */}
        <div>
          {/* Main Showcase Image */}
          <div
            style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              height: 350,
              marginBottom: 16,
              border: '1px solid var(--border-subtle)',
              background: '#0F172A'
            }}
          >
            <img
              src={account.thumbnail}
              alt={account.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.75) 100%)'
              }}
            />

            {/* Badges on Top */}
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
              <span className={`badge ${isAvailable ? 'badge-available' : 'badge-rented'}`} style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-xs)' }}>
                {isAvailable ? '● Sẵn Sàng' : '● Đang Có Người Thuê'}
              </span>
              <span className="badge badge-rank" style={{ background: '#FFFFFF', color: '#0F172A', fontWeight: 700 }}>
                {account.rank}
              </span>
            </div>

            {/* Title on Bottom Overlay */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
              <span style={{ fontSize: '0.72rem', color: '#FFEDD5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {account.gameName} • #{account.id}
              </span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 2, lineHeight: 1.3, color: '#FFFFFF' }}>
                {account.title}
              </h1>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 16
            }}
          >
            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', borderRadius: 10 }}>
              <Award size={16} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Mức Rank</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{account.rank}</strong>
            </div>

            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', borderRadius: 10 }}>
              <Sparkles size={16} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Trang Phục</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{account.skinsCount} Skins</strong>
            </div>

            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', borderRadius: 10 }}>
              <Globe size={16} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Máy Chủ</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{account.server}</strong>
            </div>

            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', borderRadius: 10 }}>
              <Flame size={16} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Tỷ Lệ Thắng</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{account.winRate}</strong>
            </div>
          </div>

          {/* Highlight Skins */}
          <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: 12, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-main)' }}>
              <Sparkles size={15} color="var(--primary)" /> Trang Phục / Vũ Khí Nổi Bật
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 6 }}>
              {account.highlightSkins.map((skin, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Check size={13} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{skin}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Safe Policy */}
          <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: 12 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-main)' }}>Mô Tả Chi Tiết</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12, fontSize: '0.88rem' }}>
              {account.description}
            </p>
            <div style={{ background: 'var(--accent-red-bg)', border: '1px solid var(--accent-red-border)', borderRadius: 8, padding: 10 }}>
              <div style={{ color: 'var(--accent-red-text)', fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem' }}>
                <ShieldCheck size={14} /> Quy định an toàn & Cam kết hoàn tiền 100%:
              </div>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingLeft: 16, lineHeight: 1.5 }}>
                <li>Nghiêm cấm hành vi sử dụng hack/cheat/can thiệp làm khóa nick.</li>
                <li>Không thay đổi thông tin liên kết tài khoản.</li>
                <li>Bảo hiểm 100%: Hoàn tiền ngay nếu nick bị sai mật khẩu hoặc cấm chơi trước đó.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Checkout Box */}
        <div style={{ position: 'sticky', top: 72 }}>
          <div
            className="glass-panel"
            style={{
              padding: 18,
              borderRadius: 12,
              boxShadow: 'var(--shadow-md)',
              background: '#FFFFFF'
            }}
          >
            <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', display: 'block', marginBottom: 2 }}>
              Giá thuê theo giờ:
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 14 }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {account.pricePerHour.toLocaleString('vi-VN')} đ
              </span>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>/ giờ</span>
            </div>

            {/* Quick Hours */}
            <div style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ marginBottom: 6, display: 'block', fontSize: '0.82rem' }}>
                Chọn thời gian thuê:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, marginBottom: 8 }}>
                {[1, 2, 4, 8].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDuration(h)}
                    className={`quick-chip ${hours === h ? 'active' : ''}`}
                    style={{ padding: '6px 0', fontSize: '0.82rem' }}
                  >
                    {h} Giờ
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tùy chỉnh:</span>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                  style={{ width: 65, padding: '3px 6px', textAlign: 'center', fontSize: '0.84rem', height: 30 }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>giờ (tối đa 48h)</span>
              </div>
            </div>

            {/* Summary */}
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 8,
                padding: 10,
                border: '1px solid var(--border-subtle)',
                marginBottom: 14
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Thời gian:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{hours} Giờ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                <span>Tổng tiền:</span>
                <span style={{ color: 'var(--primary)' }}>{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-medium)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Số dư ví:</span>
                <span style={{ fontWeight: 700, color: userBalance >= totalPrice ? 'var(--accent-green-text)' : 'var(--accent-red-text)' }}>
                  {userBalance.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {userBalance < totalPrice && (
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => onOpenDeposit(totalPrice - userBalance)}
                    className="btn btn-outline-primary"
                    style={{ width: '100%', padding: '5px 8px', fontSize: '0.78rem' }}
                  >
                    + Nạp thêm {(totalPrice - userBalance).toLocaleString('vi-VN')} đ
                  </button>
                </div>
              )}
            </div>

            {/* Rent Button */}
            <button
              type="button"
              id="btn-detail-rent-now"
              data-testid="btn-detail-rent-now"
              disabled={!isAvailable}
              onClick={() => onRentNow(account)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
            >
              <Key size={15} />
              {isAvailable ? `Thuê Ngay (${totalPrice.toLocaleString('vi-VN')} đ)` : 'Acc Đang Bận'}
            </button>

            <div style={{ marginTop: 8, textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
              Nhận tài khoản & mật khẩu tức thì sau khi thanh toán.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
