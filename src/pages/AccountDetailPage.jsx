import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Key,
  Sparkles,
  Award,
  Globe,
  Flame,
  Star,
  Clock,
  UserCheck,
  ThumbsUp,
  AlertCircle,
  BadgeCheck,
  Tag,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Info,
  CheckCircle,
  HelpCircle,
  Layers,
  Percent,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountDetailPage = ({
  account,
  onBack,
  onRentNow,
  onOpenDeposit,
  onSelectAccount
}) => {
  const { currentUser, accounts, categories } = useApp();
  const [duration, setDuration] = useState(2);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'guide' | 'reviews' | 'warranty'
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!account) return null;

  // Gallery images with high quality authentic screenshots per account
  const galleryImages = (account.galleryImages && account.galleryImages.length > 0)
    ? account.galleryImages
    : [
        {
          id: 0,
          title: 'Ảnh Đại Diện & Skin Chính',
          url: account.thumbnail
        },
        {
          id: 1,
          title: 'Kho Đồ & Tủ Trang Phục Đặc Biệt',
          url: account.thumbnail
        },
        {
          id: 2,
          title: 'Bảng Ngọc & Thiết Lập Chiến Đấu',
          url: account.thumbnail
        },
        {
          id: 3,
          title: 'Lịch Sử Thi Đấu & K/D Tỷ Lệ Thắng',
          url: account.thumbnail
        }
      ];


  const hours = Math.max(1, Number(duration) || 1);
  const basePrice = account.pricePerHour * hours;

  // Package discount (Thuê càng nhiều càng giảm)
  let packageDiscountPercent = 0;
  if (hours >= 12) packageDiscountPercent = 0.15; // 15%
  else if (hours >= 8) packageDiscountPercent = 0.10; // 10%
  else if (hours >= 4) packageDiscountPercent = 0.05; // 5%

  const packageDiscountAmount = Math.round(basePrice * packageDiscountPercent);

  // Voucher discount
  const voucherDiscountAmount = appliedVoucher ? appliedVoucher.discount : 0;

  const totalPrice = Math.max(0, basePrice - packageDiscountAmount - voucherDiscountAmount);
  const userBalance = currentUser?.balance || 0;
  const isAvailable = account.status === 'available';

  // Category info
  const categoryInfo = categories?.find(c => c.id === account.gameId);

  // Related accounts from same category
  const relatedAccounts = (accounts || [])
    .filter(a => a.gameId === account.gameId && a.id !== account.id)
    .slice(0, 3);

  // Handle voucher application
  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();

    if (!code) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      return;
    }

    if (code === 'GAMERENT' || code === 'KTPM2026' || code === 'VIP10') {
      setAppliedVoucher({
        code,
        discount: 10000,
        name: 'Voucher Thành Viên Mới (-10.000 đ)'
      });
      setVoucherError('');
    } else if (code === 'SIEUDEAL') {
      setAppliedVoucher({
        code,
        discount: 15000,
        name: 'Mã Siêu Giảm Giá (-15.000 đ)'
      });
      setVoucherError('');
    } else {
      setVoucherError('Mã không hợp lệ hoặc đã hết lượt dùng');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Mock verified customer reviews
  const reviews = [
    {
      id: 1,
      name: 'NguyenT***',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      time: '4 giờ trước',
      rating: 5,
      rentalTime: 'Thuê gói 4 Giờ',
      comment: 'Acc chuẩn rank 50 sao, đồ cực kỳ mượt, full ngọc đi rừng dame khủng. Giao acc 3 giây sau khi thanh toán, cực kỳ uy tín!'
    },
    {
      id: 2,
      name: 'HoangV***',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      time: '1 ngày trước',
      rating: 5,
      rentalTime: 'Thuê gói 2 Giờ',
      comment: 'Skin đẹp múa bao phê, không bị lag giật hay văng game. Hết giờ nick tự ngắt rất an toàn, 10/10.'
    },
    {
      id: 3,
      name: 'MinhK***',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      time: '2 ngày trước',
      rating: 4.8,
      rentalTime: 'Thuê gói 8 Giờ',
      comment: 'Chủ shop hỗ trợ nhiệt tình, nick sạch không tool hack. Được tặng thêm 30 phút khi thuê ca dài, sẽ ủng hộ tiếp!'
    }
  ];

  return (
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* Top Action Bar & Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16
        }}
      >
        <button
          type="button"
          id="btn-back-to-home"
          data-testid="btn-back-to-home"
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={15} /> Quay lại kho tài khoản
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="btn btn-secondary"
            style={{
              padding: '7px 12px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: isFavorite ? '#EF4444' : 'inherit'
            }}
          >
            <Heart size={15} fill={isFavorite ? '#EF4444' : 'none'} color={isFavorite ? '#EF4444' : 'currentColor'} />
            <span>{isFavorite ? 'Đã lưu acc' : 'Lưu tin'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Share2 size={15} />
            <span>{isCopied ? 'Đã copy link!' : 'Chia sẻ'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.9fr) minmax(320px, 1.1fr)',
          gap: 24,
          alignItems: 'start'
        }}
      >
        {/* ================= LEFT COLUMN: SHOWCASE & DETAILS ================= */}
        <div>
          {/* Main Photo Gallery */}
          <div
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              height: 380,
              marginBottom: 12,
              border: '1px solid var(--border-subtle)',
              background: '#0F172A',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <img
              src={galleryImages[activeImageIndex].url}
              alt={account.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
            />

            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%)'
              }}
            />

            {/* Top Badges */}
            <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                className={`badge ${isAvailable ? 'badge-available' : 'badge-rented'}`}
                style={{
                  background: '#FFFFFF',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  fontSize: '0.78rem'
                }}
              >
                {isAvailable ? '● Sẵn Sàng Giao Ngay' : '● Đang Có Người Thuê'}
              </span>

              <span
                className="badge"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.78rem'
                }}
              >
                <Award size={13} color="var(--primary)" style={{ marginRight: 4 }} />
                Rank: {account.rank}
              </span>

              <span
                className="badge"
                style={{
                  background: 'rgba(16, 185, 129, 0.95)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.78rem'
                }}
              >
                ⭐ {account.rating || '4.9'} ({account.rentCount || 84} lượt thuê)
              </span>
            </div>

            {/* Gallery Navigation Arrows */}
            <button
              type="button"
              onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <ChevronLeft size={18} color="#0F172A" />
            </button>

            <button
              type="button"
              onClick={() => setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <ChevronRight size={18} color="#0F172A" />
            </button>

            {/* Bottom Title & Image Label */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.74rem', color: '#A7F3D0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {categoryInfo?.name || account.gameName} • Mã Acc: #{account.id}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontWeight: 600
                  }}
                >
                  Ảnh {activeImageIndex + 1} / {galleryImages.length}: {galleryImages[activeImageIndex].title}
                </span>
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.35, color: '#FFFFFF', margin: 0 }}>
                {account.title}
              </h1>
            </div>
          </div>

          {/* Gallery Thumbnails Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
            {galleryImages.map((img, idx) => {
              const isSelected = activeImageIndex === idx;
              return (
                <div
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: 64,
                    cursor: 'pointer',
                    position: 'relative',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    opacity: isSelected ? 1 : 0.7,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      padding: '2px 4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'center'
                    }}
                  >
                    {img.title.split('&')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ================= EXPANDED 8-METRIC SPECS GRID ================= */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: 14,
              marginBottom: 20,
              background: '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={16} color="var(--primary)" />
                Thông Số Kỹ Thuật & Cấu Hình Tài Khoản
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Đã qua kiểm định an toàn</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
              {/* Metric 1 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Award size={15} color="#F59E0B" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mức Rank</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>{account.rank}</div>
              </div>

              {/* Metric 2 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Sparkles size={15} color="#10B981" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Trang Phục</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>{account.skinsCount} Skins</div>
              </div>

              {/* Metric 3 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Shield size={15} color="#3B82F6" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tướng / Nhân Vật</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>Full Tướng</div>
              </div>

              {/* Metric 4 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Globe size={15} color="#8B5CF6" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Máy Chủ</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>{account.server}</div>
              </div>

              {/* Metric 5 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Flame size={15} color="#EF4444" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tỷ Lệ Thắng</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>{account.winRate}</div>
              </div>

              {/* Metric 6 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <ShieldCheck size={15} color="#10B981" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Điểm Uy Tín</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>100/100 (Tối Đa)</div>
              </div>

              {/* Metric 7 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <BadgeCheck size={15} color="#0284C7" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Loại Tài Khoản</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>Trắng Thông Tin</div>
              </div>

              {/* Metric 8 */}
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={15} color="#6366F1" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lượt Thuê</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>{account.rentCount || 84} Ca Thành Công</div>
              </div>
            </div>
          </div>

          {/* ================= VERIFIED SELLER TRUST CARD ================= */}
          <div
            className="glass-panel"
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              marginBottom: 20,
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              borderLeft: '4px solid var(--primary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BadgeCheck size={24} color="var(--primary)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>GameRent Official Partner</strong>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: '#ECFDF5',
                      color: '#059669'
                    }}
                  >
                    Đã Xác Minh
                  </span>
                </div>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Tỷ lệ phản hồi 100% (&lt; 1 phút) • Tỷ lệ hoàn tất 99.8% • Đổi pass tự động mỗi phiên
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#059669' }}>Hệ Thống Trực Tuyến 24/7</span>
            </div>
          </div>

          {/* ================= INTERACTIVE TABBED SECTIONS ================= */}
          <div className="glass-panel" style={{ borderRadius: 14, overflow: 'hidden', background: '#FFFFFF', marginBottom: 24 }}>
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              {[
                { id: 'inventory', label: 'Kho Đồ & Trang Phục', icon: Sparkles },
                { id: 'guide', label: 'Hướng Dẫn Nhận Acc', icon: Key },
                { id: 'reviews', label: `Đánh Giá (${reviews.length})`, icon: Star },
                { id: 'warranty', label: 'Bảo Hiểm & Cam Kết', icon: ShieldCheck }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 18px',
                      background: isCurrent ? '#FFFFFF' : 'transparent',
                      border: 'none',
                      borderBottom: isCurrent ? '2px solid var(--primary)' : '2px solid transparent',
                      color: isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: isCurrent ? 700 : 500,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComponent size={15} color={isCurrent ? 'var(--primary)' : 'currentColor'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div style={{ padding: '20px' }}>
              {/* TAB 1: INVENTORY & HIGHLIGHT SKINS */}
              {activeTab === 'inventory' && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={16} color="var(--primary)" />
                    Danh Sách Trang Phục & Vũ Khí Đỉnh Cao Sở Hữu ({account.skinsCount} Skins)
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: 12,
                      marginBottom: 16
                    }}
                  >
                    {(account.highlightSkins || []).map((skinName, idx) => {
                      const detail = (account.skinDetails || []).find(s => s.name === skinName) || (account.skinDetails || [])[idx];
                      const skinImg = detail?.image || account.thumbnail;
                      const skinTier = detail?.tier || (idx % 2 === 0 ? 'Bậc SSS Hữu Hạn' : 'Tuyệt Sắc / Limited');

                      return (
                        <div
                          key={idx}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 10,
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 8,
                              overflow: 'hidden',
                              flexShrink: 0,
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              src={skinImg}
                              alt={skinName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = account.thumbnail;
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              title={skinName}
                            >
                              {skinName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                                {skinTier}
                              </span>
                              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-subtle)' }} />
                              <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Check size={12} strokeWidth={3} /> Đã Sở Hữu
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Special Effects & Loadout Details */}
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 10,
                      padding: '14px 16px',
                      marginBottom: 16
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                      ✨ Hiệu Ứng Trận Đấu & Kho Báu Đi Kèm:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={13} color="#10B981" /> Hiệu ứng Biến Về độc quyền
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={13} color="#10B981" /> Âm thanh kết liễu riêng biệt
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={13} color="#10B981" /> Gia tốc tế đàn & Khung viền VIP
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={13} color="#10B981" /> Full bảng ngọc cấp 3 (90 viên chuẩn)
                      </div>
                    </div>
                  </div>

                  {/* Account Text Description */}
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                      Lời Nhắn Từ Chủ Nick:
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                      {account.description}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: INSTANT ACCESS GUIDE */}
              {activeTab === 'guide' && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>
                    Quy Trình 4 Bước Nhận Acc & Đăng Nhập Tự Động Trong 5 Giây
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                        <strong style={{ fontSize: '0.84rem' }}>Chọn Giờ & Thuê Ngay</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        Chọn số giờ bạn muốn trải nghiệm và bấm thanh toán trực tiếp qua số dư ví GameRent.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                        <strong style={{ fontSize: '0.84rem' }}>Nhận Mật Khẩu Tức Thì</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        Hệ thống hiển thị Tên tài khoản & Mật khẩu cấp tốc, kèm nút sao chép 1-click.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                        <strong style={{ fontSize: '0.84rem' }}>Đăng Nhập Vào Game</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        Đăng nhập vào Client chính thức của game, tận hưởng kho skin và leo rank mượt mà.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                        <strong style={{ fontSize: '0.84rem' }}>Kết Thúc Ca Thuê An Toàn</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        Hệ thống tự động ngắt phiên khi hết giờ hoặc bạn có thể trả sớm nhận hoàn tiền phút thừa.
                      </p>
                    </div>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Info size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: '#1E40AF' }}>
                      <strong>Mẹo nhanh:</strong> Bạn có thể theo dõi thời gian thuê còn lại theo thời gian thực và bấm gia hạn thêm giờ tại trang <strong>&quot;Đơn thuê của tôi&quot;</strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 3: REVIEWS & FEEDBACK */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Reviews Summary */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '14px 18px',
                      background: 'var(--bg-surface)',
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                      marginBottom: 16,
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                        {account.rating || '4.9'}
                      </div>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '4px 0' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Dựa trên {account.rentCount || 84} lượt thuê</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem' }}>
                        <span>5 Sao</span>
                        <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: '92%', height: '100%', background: '#10B981' }} />
                        </div>
                        <span style={{ color: 'var(--text-subtle)' }}>92%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem' }}>
                        <span>4 Sao</span>
                        <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: '8%', height: '100%', background: '#F59E0B' }} />
                        </div>
                        <span style={{ color: 'var(--text-subtle)' }}>8%</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          paddingBottom: 12
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img
                              src={rev.avatar}
                              alt={rev.name}
                              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{rev.name}</strong>
                                <span style={{ fontSize: '0.66rem', padding: '1px 6px', borderRadius: 4, background: '#ECFDF5', color: '#059669', fontWeight: 600 }}>
                                  ✓ Đã thuê thành công
                                </span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                                {rev.rentalTime} • {rev.time}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} fill="#F59E0B" color="#F59E0B" />
                            ))}
                          </div>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          &quot;{rev.comment}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SAFETY & WARRANTY */}
              {activeTab === 'warranty' && (
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    Chính Sách Bảo Hiểm Rủi Ro & Cam Kết Hoàn Tiền 100%
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: 10, padding: '12px' }}>
                      <div style={{ color: '#E11D48', fontWeight: 700, fontSize: '0.82rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldAlert size={14} /> Hoàn tiền 100% khi sai mật khẩu
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#9F1239', lineHeight: 1.5 }}>
                        Nếu tài khoản sai pass hoặc có người đăng nhập đè, hệ thống hoàn 100% tiền về ví ngay khi bạn bấm Báo Cáo.
                      </p>
                    </div>

                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '12px' }}>
                      <div style={{ color: '#059669', fontWeight: 700, fontSize: '0.82rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={14} /> Bảo mật thông tin người thuê
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#047857', lineHeight: 1.5 }}>
                        Lịch sử thuê và danh tính người chơi được mã hóa tuyệt đối, không lưu vết hay ảnh hưởng thông tin cá nhân.
                      </p>
                    </div>

                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '12px' }}>
                      <div style={{ color: '#1D4ED8', fontWeight: 700, fontSize: '0.82rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} /> Hoàn tiền khi trả acc sớm
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#1E40AF', lineHeight: 1.5 }}>
                        Chức năng Trả Sớm tự động tính toán thời gian thực tế đã chơi và hoàn trả phần tiền giờ còn lại về ví.
                      </p>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                    * Nghiêm cấm mọi hành vi sử dụng hack/cheat hoặc phá hoại rank trong ca thuê. Hệ thống phát hiện gian lận sẽ khóa tài khoản vĩnh viễn theo Điều Khoản Dịch Vụ GameRent.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RELATED ACCOUNTS CAROUSEL / GRID ================= */}
          {relatedAccounts.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Tài Khoản {categoryInfo?.name || 'Cùng Thể Loại'} Khác
                </h3>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>Dễ dàng so sánh & lựa chọn</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {relatedAccounts.map((relAcc) => (
                  <div
                    key={relAcc.id}
                    onClick={() => onSelectAccount && onSelectAccount(relAcc)}
                    className="glass-panel"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
                      <img src={relAcc.thumbnail} alt={relAcc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span
                        style={{
                          position: 'absolute',
                          top: 6,
                          left: 6,
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: relAcc.status === 'available' ? '#10B981' : '#EF4444',
                          color: '#FFFFFF'
                        }}
                      >
                        {relAcc.status === 'available' ? 'Sẵn Sàng' : 'Đang Thuê'}
                      </span>
                    </div>
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {relAcc.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{relAcc.rank}</span>
                        <strong style={{ fontSize: '0.84rem', color: 'var(--primary)' }}>
                          {relAcc.pricePerHour.toLocaleString('vi-VN')} đ/h
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: STICKY CHECKOUT PANEL ================= */}
        <div style={{ position: 'sticky', top: 72 }}>
          <div
            className="glass-panel"
            style={{
              padding: 20,
              borderRadius: 14,
              boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Price Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>Đơn giá thuê theo giờ:</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: '#ECFDF5',
                  color: '#059669'
                }}
              >
                Giao acc 3s
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {account.pricePerHour.toLocaleString('vi-VN')} đ
              </span>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>/ giờ</span>
            </div>

            {/* Quick Hours Selection */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0, fontSize: '0.82rem' }}>
                  Chọn gói thời gian:
                </label>
                {packageDiscountPercent > 0 && (
                  <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
                    🔥 Tiết kiệm {packageDiscountPercent * 100}%
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
                {[
                  { h: 1, tag: null },
                  { h: 2, tag: null },
                  { h: 4, tag: '-5%' },
                  { h: 8, tag: '-10%' },
                  { h: 12, tag: '-15%' },
                  { h: 24, tag: 'VIP' }
                ].map(({ h, tag }) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDuration(h)}
                    className={`quick-chip ${hours === h ? 'active' : ''}`}
                    style={{
                      padding: '7px 0',
                      fontSize: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <span>{h} Giờ</span>
                    {tag && (
                      <span
                        style={{
                          fontSize: '0.6rem',
                          lineHeight: 1,
                          marginTop: 2,
                          fontWeight: 700,
                          color: hours === h ? '#FFFFFF' : '#10B981'
                        }}
                      >
                        {tag}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Hours Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--bg-surface)',
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Giờ tùy chỉnh:</span>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                  style={{ width: 60, padding: '3px 6px', textAlign: 'center', fontSize: '0.84rem', height: 28 }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>giờ (tối đa 48h)</span>
              </div>
            </div>

            {/* Voucher Coupon Section */}
            <div style={{ marginBottom: 16 }}>
              <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: 6 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Nhập mã GAMERENT"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', padding: '6px 10px', fontSize: '0.8rem', height: 32 }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ padding: '0 12px', fontSize: '0.78rem', height: 32, whiteSpace: 'nowrap' }}
                >
                  Áp dụng
                </button>
              </form>

              {appliedVoucher && (
                <div
                  style={{
                    marginTop: 6,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: '#ECFDF5',
                    color: '#059669',
                    fontSize: '0.74rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>✓ {appliedVoucher.name}</span>
                  <button
                    type="button"
                    onClick={() => setAppliedVoucher(null)}
                    style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    Bỏ mã
                  </button>
                </div>
              )}

              {voucherError && (
                <div style={{ marginTop: 4, fontSize: '0.72rem', color: '#DC2626' }}>
                  {voucherError}
                </div>
              )}
            </div>

            {/* Transparent Bill Breakdown */}
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 10,
                padding: '12px 14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: 16
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 5 }}>
                <span>Thời gian thuê:</span>
                <strong style={{ color: 'var(--text-main)' }}>{hours} Giờ</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 5 }}>
                <span>Giá gốc ({hours}h × {account.pricePerHour.toLocaleString('vi-VN')} đ):</span>
                <span>{basePrice.toLocaleString('vi-VN')} đ</span>
              </div>

              {packageDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#10B981', marginBottom: 5 }}>
                  <span>Ưu đãi gói thuê ({packageDiscountPercent * 100}%):</span>
                  <span>-{packageDiscountAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              {voucherDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#10B981', marginBottom: 5 }}>
                  <span>Voucher giảm giá:</span>
                  <span>-{voucherDiscountAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              <div
                style={{
                  borderTop: '1px dashed var(--border-medium)',
                  paddingTop: 8,
                  marginTop: 6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 8, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Số dư Ví hiện có:</span>
                <span style={{ fontWeight: 700, color: userBalance >= totalPrice ? '#059669' : '#DC2626' }}>
                  {userBalance.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {userBalance < totalPrice && (
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => onOpenDeposit(totalPrice - userBalance)}
                    className="btn btn-outline-primary"
                    style={{ width: '100%', padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    + Nạp thêm {(totalPrice - userBalance).toLocaleString('vi-VN')} đ vào ví
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
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: isAvailable ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
              }}
            >
              <Key size={16} />
              {isAvailable ? `Thuê Ngay (${totalPrice.toLocaleString('vi-VN')} đ)` : 'Acc Đang Có Người Thuê'}
            </button>

            {/* Instant Delivery & Security Commitments */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={13} color="#10B981" />
                <span>Nhận thông tin đăng nhập tự động 100% ngay sau thanh toán.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={13} color="#10B981" />
                <span>Bảo hiểm hoàn tiền 100% nếu nick sai mật khẩu hoặc lỗi.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <Clock size={13} color="#10B981" />
                <span>Hỗ trợ trả acc sớm nhận hoàn tiền phút thừa linh hoạt.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
