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
    <div className="container" style={{ padding: '36px 20px 70px 20px' }}>
      {/* Back button */}
      <button
        type="button"
        id="btn-back-to-home"
        data-testid="btn-back-to-home"
        onClick={onBack}
        className="btn btn-secondary"
        style={{ marginBottom: 20, padding: '7px 14px', fontSize: '0.88rem' }}
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.1fr)', gap: 28 }}>
        {/* Left Column: Account Details & Gallery */}
        <div>
          {/* Main Showcase Image */}
          <div
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              height: 400,
              marginBottom: 20,
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
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
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.75) 100%)'
              }}
            />

            {/* Top Badges */}
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
              <span className={`badge ${isAvailable ? 'badge-available' : 'badge-rented'}`} style={{ fontSize: '0.84rem', padding: '5px 12px', background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
                {isAvailable ? '● Sẵn Sàng Cho Thuê' : '● Đang Có Người Thuê'}
              </span>
              <span className="badge badge-rank" style={{ fontSize: '0.84rem', padding: '5px 12px', background: '#FFFFFF', color: '#0F172A' }}>
                {account.rank}
              </span>
            </div>

            {/* Bottom Info Overlay */}
            <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20 }}>
              <span style={{ fontSize: '0.8rem', color: '#FED7AA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Mã tài khoản: #{account.id}
              </span>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 4, lineHeight: 1.3, color: '#FFFFFF' }}>
                {account.title}
              </h1>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              marginBottom: 24
            }}
          >
            <div className="glass-panel" style={{ padding: '14px', textAlign: 'center', borderRadius: 10, background: '#FFFFFF' }}>
              <Award size={18} color="var(--primary)" style={{ margin: '0 auto 6px auto' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', display: 'block' }}>Mức Rank</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{account.rank}</strong>
            </div>

            <div className="glass-panel" style={{ padding: '14px', textAlign: 'center', borderRadius: 10, background: '#FFFFFF' }}>
              <Sparkles size={18} color="var(--primary)" style={{ margin: '0 auto 6px auto' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', display: 'block' }}>Tổng Trang Phục</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{account.skinsCount} Skins</strong>
            </div>

            <div className="glass-panel" style={{ padding: '14px', textAlign: 'center', borderRadius: 10, background: '#FFFFFF' }}>
              <Globe size={18} color="var(--primary)" style={{ margin: '0 auto 6px auto' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', display: 'block' }}>Máy Chủ</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{account.server}</strong>
            </div>

            <div className="glass-panel" style={{ padding: '14px', textAlign: 'center', borderRadius: 10, background: '#FFFFFF' }}>
              <Flame size={18} color="var(--primary)" style={{ margin: '0 auto 6px auto' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', display: 'block' }}>Tỷ Lệ Thắng</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{account.winRate}</strong>
            </div>
          </div>

          {/* Skins Highlight Section */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 12, marginBottom: 24, background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
              <Sparkles size={17} color="var(--primary)" /> Danh Sách Trang Phục / Vũ Khí Nổi Bật
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
              {account.highlightSkins.map((skin, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <Check size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>{skin}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Rules */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 12, background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-main)' }}>Mô Tả & Quy Định Chung</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16, fontSize: '0.92rem' }}>
              {account.description}
            </p>
            <div style={{ background: 'var(--accent-red-bg)', border: '1px solid var(--accent-red-border)', borderRadius: 10, padding: 14 }}>
              <div style={{ color: '#DC2626', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
                <ShieldCheck size={16} /> Cảnh báo an toàn và chính sách:
              </div>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.84rem', paddingLeft: 18, lineHeight: 1.6 }}>
                <li>Tuyệt đối không sử dụng phần mềm thứ 3 can thiệp (Hack, Mod Skin, Auto click).</li>
                <li>Không tự ý liên kết số điện thoại, đổi mật khẩu hoặc phá bảng ngọc.</li>
                <li>Hệ thống tự động đổi mật khẩu sau khi kết thúc ca thuê.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Rental Checkout Card */}
        <div>
          <div
            className="glass-panel"
            style={{
              padding: 22,
              borderRadius: 14,
              position: 'sticky',
              top: 90,
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Đơn giá thuê theo giờ:
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {account.pricePerHour.toLocaleString('vi-VN')} đ
              </span>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>/ 1 giờ</span>
            </div>

            {/* Select Duration */}
            <div style={{ marginBottom: 18 }}>
              <label className="form-label" style={{ marginBottom: 8, display: 'block', fontSize: '0.86rem' }}>
                Chọn thời gian thuê:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
                {[1, 2, 4, 8].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDuration(h)}
                    style={{
                      padding: '8px 0',
                      borderRadius: 8,
                      background: hours === h ? 'var(--primary)' : '#FFFFFF',
                      border: hours === h ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                      color: hours === h ? '#FFFFFF' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tùy chọn:</span>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                  style={{ width: 75, padding: '5px 8px', textAlign: 'center', fontSize: '0.88rem' }}
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>giờ (tối đa 48h)</span>
              </div>
            </div>

            {/* Total Calculation */}
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 10,
                padding: 14,
                border: '1px solid var(--border-subtle)',
                marginBottom: 18
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Thời gian:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{hours} Giờ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                <span>Tổng tiền:</span>
                <span style={{ color: 'var(--primary)' }}>{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-medium)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Số dư ví hiện tại:</span>
                <span style={{ fontWeight: 600, color: userBalance >= totalPrice ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {userBalance.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {userBalance < totalPrice && (
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onOpenDeposit(totalPrice - userBalance)}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.82rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
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
              style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
            >
              <Key size={17} />
              {isAvailable ? `Thuê Ngay (${totalPrice.toLocaleString('vi-VN')} đ)` : 'Tài Khoản Đang Bận'}
            </button>

            <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
              Nhận thông tin đăng nhập tự động ngay sau khi xác nhận.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
