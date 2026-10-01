import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  Eye,
  Key,
  X,
  ChevronDown,
  Check,
  Tag,
  Shield,
  Gamepad2,
  Crosshair,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  Heart,
  LayoutGrid,
  List,
  ArrowUpDown,
  Award,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomePage = ({ onSelectAccount, onRentAccount }) => {
  const { categories, accounts, currentUser, favorites, toggleFavorite } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under12' | '12to20' | 'above20'
  const [rankFilter, setRankFilter] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'name-asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [openDropdown, setOpenDropdown] = useState(null); // 'price' | 'rank' | 'sort' | null
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Dữ liệu các slide banner chuyển cảnh động
  const BANNER_SLIDES = [
    {
      id: 1,
      tag: '⚡ HỆ THỐNG THUÊ ACC TỰ ĐỘNG 100% • SIÊU TỐC 3 GIÂY',
      tagBg: '#ECFDF5',
      tagColor: '#059669',
      tagBorder: '#A7F3D0',
      title: 'Cửa Hàng Cho Thuê Tài Khoản Game Số 1 Việt Nam',
      desc: 'Nhận thông tin đăng nhập tự động ngay sau khi thanh toán • Tự động đổi mật khẩu bảo mật khi hết giờ chơi • Cam kết an toàn & bảo mật tài khoản tuyệt đối.',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 52%, #ECFDF5 100%)',
      borderColor: '#A7F3D0',
      glowColor: 'rgba(16, 185, 129, 0.16)',
      features: [
        { icon: <Zap size={14} color="#059669" fill="#059669" />, title: '100% Tự Động', sub: 'Cấp acc & pass sau 3s', color: '#059669' },
        { icon: <Flame size={14} color="#D97706" />, title: 'Gói Đêm', sub: 'Chỉ từ 30.000đ', color: '#D97706' },
        { icon: <Shield size={14} color="#2563EB" />, title: 'Bảo Hiểm 100%', sub: 'Hoàn tiền nếu acc lỗi', color: '#2563EB' }
      ]
    },
    {
      id: 2,
      tag: '🌙 ƯU ĐÃI GÓI ĐÊM • GIẢM ĐẾN 40% TẤT CẢ TỰA GAME',
      tagBg: '#FFFBEB',
      tagColor: '#D97706',
      tagBorder: '#FDE68A',
      title: 'Combo Thuê Acc Xuyên Đêm - Thả Ga Leo Rank Cực Đã',
      desc: 'Chơi tẹt ga từ 22h00 đêm đến 08h00 sáng hôm sau với mức giá siêu ưu đãi • Áp dụng cho Liên Quân, Valorant, Genshin Impact, FC Online và PUBG.',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 52%, #FEF3C7 100%)',
      borderColor: '#FCD34D',
      glowColor: 'rgba(245, 158, 11, 0.18)',
      features: [
        { icon: <Clock size={14} color="#D97706" />, title: '22h - 8h Sáng', sub: '10 tiếng chơi liên tục', color: '#D97706' },
        { icon: <Tag size={14} color="#059669" />, title: 'Từ 30.000đ', sub: 'Tiết kiệm đến 40%', color: '#059669' },
        { icon: <Star size={14} color="#7E22CE" />, title: 'Acc VIP Full Đồ', sub: 'Tướng & skin giới hạn', color: '#7E22CE' }
      ]
    },
    {
      id: 3,
      tag: '🛡️ CAM KẾT HOÀN TIỀN 100% • BẢO HIỂM TÀI KHOẢN',
      tagBg: '#EFF6FF',
      tagColor: '#1D4ED8',
      tagBorder: '#BFDBFE',
      title: 'Bảo Hiểm Trải Nghiệm - Đổi Acc Hoặc Hoàn Tiền Tức Thì',
      desc: 'Nếu tài khoản gặp sự cố đăng nhập, sai pass hay mất kết nối, hệ thống tự động hoàn 100% số dư về ví ngay lập tức hoặc hỗ trợ đổi nick mới chỉ trong 1 chạm.',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 52%, #E0F2FE 100%)',
      borderColor: '#BAE6FD',
      glowColor: 'rgba(59, 130, 246, 0.16)',
      features: [
        { icon: <Shield size={14} color="#2563EB" />, title: 'Hoàn Tiền 100%', sub: 'Cộng lại ví sau 3 giây', color: '#2563EB' },
        { icon: <Award size={14} color="#059669" />, title: 'Uy Tín 100%', sub: 'Hơn 20.000 ca thuê', color: '#059669' },
        { icon: <Zap size={14} color="#D97706" />, title: 'Hỗ Trợ 24/7', sub: 'Admin trực liên tục', color: '#D97706' }
      ]
    }
  ];

  // Quản lý chuyển cảnh banner động
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHoveredBanner, setIsHoveredBanner] = useState(false);

  useEffect(() => {
    if (isHoveredBanner) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % BANNER_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveredBanner, BANNER_SLIDES.length]);

  const handleNextSlide = (e) => {
    e?.stopPropagation?.();
    setActiveSlide(prev => (prev + 1) % BANNER_SLIDES.length);
  };

  const handlePrevSlide = (e) => {
    e?.stopPropagation?.();
    setActiveSlide(prev => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  // Xóa cờ ẩn banner cũ nếu có để banner luôn cố định hiển thị
  useEffect(() => {
    try {
      localStorage.removeItem('gamerent_hide_hero_banner');
    } catch {
      // ignore
    }
  }, []);

  // Tự động reset bộ lọc chỉ xem đã lưu khi danh sách yêu thích rỗng hoặc chuyển đổi tài khoản (Admin <-> Khách)
  useEffect(() => {
    if (onlyFavorites && favorites.length === 0) {
      setOnlyFavorites(false);
    }
  }, [favorites, onlyFavorites]);

  useEffect(() => {
    setOnlyFavorites(false);
  }, [currentUser?.id, currentUser?.role]);

  // Đóng dropdown khi click ngoài hoặc nhấn Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !e.target.closest('#container-filter-price') &&
        !e.target.closest('#container-filter-rank') &&
        !e.target.closest('#container-filter-sort')
      ) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const PRICE_OPTIONS = [
    {
      value: 'all',
      label: 'Khoảng giá: Tất cả',
      title: 'Tất cả mức giá',
      desc: 'Hiển thị mọi phân khúc tài khoản',
      badge: null
    },
    {
      value: 'under12',
      label: 'Dưới 12.000 đ/h',
      title: 'Dưới 12.000 đ/h',
      desc: 'Tiết kiệm, học sinh - sinh viên',
      badge: { text: 'Tiết kiệm', bg: '#EFF6FF', color: '#2563EB' }
    },
    {
      value: '12to20',
      label: '12.000 đ - 20.000 đ/h',
      title: '12.000 đ - 20.000 đ/h',
      desc: 'Phổ biến, nhiều skin & tướng hot',
      badge: { text: 'Phổ biến', bg: '#ECFDF5', color: '#059669' }
    },
    {
      value: 'above20',
      label: 'Trên 20.000 đ/h',
      title: 'Trên 20.000 đ/h',
      desc: 'Acc VIP, full trang phục, rank cao',
      badge: { text: 'VIP / Cao cấp', bg: '#FEF3C7', color: '#D97706' }
    }
  ];

  const SORT_OPTIONS = [
    { value: 'popular', label: 'Phổ biến nhất', desc: 'Acc sẵn sàng & ưu tiên thuê cao' },
    { value: 'price-asc', label: 'Giá: Thấp ➔ Cao', desc: 'Tiết kiệm chi phí thuê nhất' },
    { value: 'price-desc', label: 'Giá: Cao ➔ Thấp', desc: 'Acc VIP, nhiều skin & tướng độc' },
    { value: 'name-asc', label: 'Tên A ➔ Z', desc: 'Theo thứ tự bảng chữ cái' }
  ];

  // Helper render Icon tựa game
  const renderGameIcon = (iconName, color = 'currentColor', size = 15) => {
    switch (iconName) {
      case 'Shield': return <Shield size={size} color={color} />;
      case 'Crosshair': return <Crosshair size={size} color={color} />;
      case 'Sparkles': return <Sparkles size={size} color={color} />;
      case 'Trophy': return <Trophy size={size} color={color} />;
      case 'Flame': return <Flame size={size} color={color} />;
      case 'Zap': return <Zap size={size} color={color} />;
      default: return <Gamepad2 size={size} color={color} />;
    }
  };

  // Helper render màu và icon cho Rank
  const getRankBadgeStyle = (rank) => {
    const r = (rank || '').toLowerCase();
    if (r.includes('radiant') || r.includes('thách đấu') || r.includes('chiến tướng') || r.includes('immortal')) {
      return {
        bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        color: '#92400E',
        border: '1px solid #FCD34D',
        icon: <Award size={11} color="#B45309" />
      };
    }
    if (r.includes('cao thủ') || r.includes('ascendant') || r.includes('ar 60') || r.includes('đại cao thủ')) {
      return {
        bg: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
        color: '#6B21A8',
        border: '1px solid #D8B4FE',
        icon: <Star size={11} color="#7E22CE" />
      };
    }
    if (r.includes('kim cương') || r.includes('tinh anh') || r.includes('thế giới') || r.includes('ar 58')) {
      return {
        bg: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)',
        color: '#0E7490',
        border: '1px solid #67E8F9',
        icon: <Sparkles size={11} color="#0891B2" />
      };
    }
    return {
      bg: '#F8FAFC',
      color: '#334155',
      border: '1px solid #CBD5E1',
      icon: null
    };
  };

  // Lấy danh sách rank của game đang chọn
  const currentCategoryRanks = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const cat = categories.find(c => c.id === selectedCategory);
    return cat ? cat.ranks : [];
  }, [selectedCategory, categories]);

  // Bộ lọc tài khoản & Sắp xếp
  const filteredAccounts = useMemo(() => {
    const list = accounts.filter((acc) => {
      // 1. Lọc theo danh mục game
      if (selectedCategory !== 'all' && acc.gameId !== selectedCategory) {
        return false;
      }

      // 2. Lọc theo từ khóa tìm kiếm (tên, skin, rank, tên game)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = acc.title.toLowerCase().includes(q);
        const matchRank = acc.rank.toLowerCase().includes(q);
        const matchGame = acc.gameName.toLowerCase().includes(q);
        const matchSkins = acc.highlightSkins.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchRank && !matchGame && !matchSkins) return false;
      }

      // 3. Lọc theo mức giá
      if (priceFilter === 'under12' && acc.pricePerHour >= 12000) return false;
      if (priceFilter === '12to20' && (acc.pricePerHour < 12000 || acc.pricePerHour > 20000)) return false;
      if (priceFilter === 'above20' && acc.pricePerHour <= 20000) return false;

      // 4. Lọc theo rank
      if (rankFilter !== 'all' && acc.rank !== rankFilter) {
        return false;
      }

      // 5. Chỉ hiện tài khoản đang rảnh
      if (onlyAvailable && acc.status !== 'available') {
        return false;
      }

      // 6. Lọc chỉ xem acc yêu thích
      if (onlyFavorites && !favorites.includes(acc.id)) {
        return false;
      }

      return true;
    });

    // Sắp xếp danh sách
    return list.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.pricePerHour - b.pricePerHour;
      }
      if (sortBy === 'price-desc') {
        return b.pricePerHour - a.pricePerHour;
      }
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      // 'popular' (mặc định): ưu tiên acc sẵn sàng lên trước
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (a.status !== 'available' && b.status === 'available') return 1;
      return 0;
    });
  }, [accounts, selectedCategory, searchQuery, priceFilter, rankFilter, onlyAvailable, onlyFavorites, favorites, sortBy]);

  return (
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* ================= FIXED TOP GAMING BANNER (LỚN HƠN & CÓ HIỆU ỨNG CHUYỂN CẢNH ĐỘNG) ================= */}
      <style>{`
        @keyframes bannerSlideIn {
          0% {
            opacity: 0;
            transform: translateX(18px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .banner-nav-btn {
          opacity: 0.6;
          transition: all 0.2s ease;
        }
        .banner-nav-btn:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
        }
      `}</style>

      {(() => {
        const curr = BANNER_SLIDES[activeSlide] || BANNER_SLIDES[0];
        return (
          <div
            id="top-fixed-hero-banner"
            onMouseEnter={() => setIsHoveredBanner(true)}
            onMouseLeave={() => setIsHoveredBanner(false)}
            style={{
              position: 'relative',
              marginBottom: 18,
              borderRadius: 16,
              background: curr.bgGradient,
              padding: '24px 40px 30px 40px',
              border: `1.5px solid ${curr.borderColor}`,
              boxShadow: '0 6px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
              minHeight: 185,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
              gap: 20,
              overflow: 'hidden',
              transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease'
            }}
          >
            {/* Hiệu ứng hào quang nền chuyển động nhẹ nhàng */}
            <div
              style={{
                position: 'absolute',
                top: -30,
                right: 70,
                width: 220,
                height: 220,
                background: `radial-gradient(circle, ${curr.glowColor} 0%, transparent 70%)`,
                borderRadius: '50%',
                pointerEvents: 'none',
                transition: 'background 0.5s ease'
              }}
            />

            {/* Nội dung Slide có hiệu ứng chuyển cảnh mượt mà */}
            <div
              key={curr.id}
              style={{
                flex: 1,
                minWidth: 280,
                zIndex: 1,
                animation: 'bannerSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: curr.tagBg,
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: curr.tagColor,
                  marginBottom: 8,
                  border: `1px solid ${curr.tagBorder}`
                }}
              >
                <Zap size={13} color={curr.tagColor} fill={curr.tagColor} />
                <span>{curr.tag}</span>
              </div>
              <h2
                style={{
                  fontSize: '1.38rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 6px 0',
                  lineHeight: 1.32,
                  letterSpacing: '-0.3px'
                }}
              >
                {curr.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.86rem',
                  color: '#475569',
                  lineHeight: 1.55,
                  maxWidth: 680
                }}
              >
                {curr.desc}
              </p>
            </div>

            {/* 3 Huy hiệu cam kết dịch vụ lớn và nổi bật */}
            <div
              key={`cards-${curr.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
                zIndex: 1,
                animation: 'bannerSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {curr.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '12px 18px',
                    textAlign: 'center',
                    minWidth: 120,
                    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(15, 23, 42, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 3px 10px rgba(15, 23, 42, 0.05)';
                  }}
                >
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5
                    }}
                  >
                    {feat.icon} {feat.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginTop: 4 }}>
                    {feat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Nút lùi slide (<) */}
            <button
              type="button"
              className="banner-nav-btn"
              onClick={handlePrevSlide}
              title="Slide trước"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
                zIndex: 2,
                color: '#334155'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Nút tiến slide (>) */}
            <button
              type="button"
              className="banner-nav-btn"
              onClick={handleNextSlide}
              title="Slide kế tiếp"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
                zIndex: 2,
                color: '#334155'
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Chấm chỉ báo slide (Dot indicators) */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                zIndex: 2
              }}
            >
              {BANNER_SLIDES.map((slide, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide(idx);
                    }}
                    title={`Chuyển đến Slide ${idx + 1}`}
                    style={{
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      width: isActive ? 24 : 7,
                      height: 7,
                      borderRadius: isActive ? 4 : '50%',
                      background: isActive ? '#059669' : '#CBD5E1',
                      transition: 'all 0.25s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ================= ALL-IN-ONE EXPLORER STRIP ================= */}
      <div style={{ marginBottom: 20 }}>
        {/* Row 1: Game Category Horizontal Pills (Có Icon + Badge Count) */}
        <div
          id="category-tabs-container"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 12,
            scrollbarWidth: 'none'
          }}
        >
          {/* Nút Tất Cả Game */}
          <button
            type="button"
            id="tab-category-all"
            data-testid="tab-category-all"
            onClick={() => { setSelectedCategory('all'); setRankFilter('all'); }}
            className={`quick-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              borderRadius: 10,
              transition: 'all 0.15s ease'
            }}
          >
            <Gamepad2 size={16} color={selectedCategory === 'all' ? '#FFFFFF' : '#10B981'} />
            <span>Tất Cả Game</span>
            <span
              style={{
                fontSize: '0.7rem',
                background: selectedCategory === 'all' ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                color: selectedCategory === 'all' ? '#FFFFFF' : '#475569',
                padding: '1px 6px',
                borderRadius: 10,
                fontWeight: 700
              }}
            >
              {accounts.length}
            </span>
          </button>

          {/* Dãy nút từng Game */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = accounts.filter(a => a.gameId === cat.id).length;
            const color = cat.badgeColor || '#10B981';

            return (
              <button
                key={cat.id}
                type="button"
                id={`tab-category-${cat.id}`}
                data-testid={`tab-category-${cat.id}`}
                onClick={() => { setSelectedCategory(cat.id); setRankFilter('all'); }}
                className={`quick-chip ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 600,
                  whiteSpace: 'nowrap',
                  borderRadius: 10,
                  transition: 'all 0.15s ease',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid #E2E8F0'
                }}
              >
                {renderGameIcon(cat.icon, isSelected ? '#FFFFFF' : color, 15)}
                <span>{cat.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: isSelected ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                    padding: '1px 6px',
                    borderRadius: 10,
                    fontWeight: 700
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Search, Filter, Sort Toolbar & View Mode Switcher (LUÔN CÙNG 1 DÒNG NHƯ ẢNH 2) */}
        <div
          id="filter-controls-bar"
          data-testid="filter-controls-bar"
          className="glass-panel"
          style={{
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            gap: 10,
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            position: 'relative',
            zIndex: 50,
            overflow: 'visible',
            minHeight: 56,
            boxSizing: 'border-box'
          }}
        >
          {/* Cụm bộ lọc bên trái (Search + Giá + Sắp xếp + Rank nếu có) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', flexShrink: 0 }}>
            {/* Instant Search Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: 8,
                padding: '5px 10px',
                width: 185,
                flexShrink: 0,
                boxSizing: 'border-box'
              }}
            >
              <Search size={14} color="var(--primary)" />
              <input
                type="text"
                id="input-hero-search"
                data-testid="input-hero-search"
                placeholder="Tìm skin, tên acc, rank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.78rem',
                  color: 'var(--text-main)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Custom Dropdown: Price Filter */}
            <div id="container-filter-price" style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                id="select-filter-price"
                data-testid="select-filter-price"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === 'price'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'price' ? null : 'price');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: priceFilter !== 'all' ? 700 : 500,
                  border: priceFilter !== 'all' ? '1.5px solid var(--primary)' : '1px solid #CBD5E1',
                  background: priceFilter !== 'all' ? '#ECFDF5' : '#FFFFFF',
                  color: priceFilter !== 'all' ? '#059669' : '#334155',
                  height: 33,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: openDropdown === 'price' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Tag size={12} color={priceFilter !== 'all' ? '#10B981' : '#64748B'} />
                <span>{PRICE_OPTIONS.find(p => p.value === priceFilter)?.label || 'Khoảng giá: Tất cả'}</span>
                <ChevronDown
                  size={12}
                  color={priceFilter !== 'all' ? '#10B981' : '#64748B'}
                  style={{
                    transform: openDropdown === 'price' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </button>

              {openDropdown === 'price' && (
                <div
                  role="listbox"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: 240,
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: 12,
                    boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
                    padding: '6px',
                    zIndex: 1000,
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid #F1F5F9', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Phân khúc giá thuê
                    </span>
                    {priceFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPriceFilter('all');
                          setOpenDropdown(null);
                        }}
                        style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                      >
                        Đặt lại
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {PRICE_OPTIONS.map((opt) => {
                      const isSelected = priceFilter === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPriceFilter(opt.value);
                            setOpenDropdown(null);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 8,
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500,
                            background: isSelected ? '#ECFDF5' : 'transparent',
                            color: isSelected ? '#059669' : '#1E293B',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'background 0.12s ease'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F8FAFC'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{opt.title}</span>
                              {opt.badge && (
                                <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: 4, background: opt.badge.bg, color: opt.badge.color, fontWeight: 700 }}>
                                  {opt.badge.text}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: isSelected ? '#047857' : '#64748B' }}>
                              {opt.desc}
                            </span>
                          </div>
                          {isSelected && <Check size={16} color="#10B981" strokeWidth={2.5} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Dropdown: Sắp Xếp (Sort By) - Đặt liền kề Khoảng giá chuẩn như Ảnh 2 */}
            <div id="container-filter-sort" style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                id="select-filter-sort"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === 'sort'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'sort' ? null : 'sort');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: sortBy !== 'popular' ? 700 : 500,
                  border: sortBy !== 'popular' ? '1.5px solid var(--primary)' : '1px solid #CBD5E1',
                  background: sortBy !== 'popular' ? '#ECFDF5' : '#FFFFFF',
                  color: sortBy !== 'popular' ? '#059669' : '#334155',
                  height: 33,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: openDropdown === 'sort' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <ArrowUpDown size={12} color={sortBy !== 'popular' ? '#10B981' : '#64748B'} />
                <span>{SORT_OPTIONS.find(s => s.value === sortBy)?.label || 'Phổ biến nhất'}</span>
                <ChevronDown
                  size={12}
                  color={sortBy !== 'popular' ? '#10B981' : '#64748B'}
                  style={{
                    transform: openDropdown === 'sort' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </button>

              {openDropdown === 'sort' && (
                <div
                  role="listbox"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: 220,
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: 12,
                    boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
                    padding: '6px',
                    zIndex: 1000,
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Thứ tự hiển thị
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortBy(opt.value);
                            setOpenDropdown(null);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 8,
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500,
                            background: isSelected ? '#ECFDF5' : 'transparent',
                            color: isSelected ? '#059669' : '#1E293B',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F8FAFC'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div>
                            <div>{opt.label}</div>
                            <span style={{ fontSize: '0.7rem', color: isSelected ? '#047857' : '#64748B' }}>
                              {opt.desc}
                            </span>
                          </div>
                          {isSelected && <Check size={14} color="#10B981" strokeWidth={2.5} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Dropdown: Rank Filter (xuất hiện khi chọn game có danh sách rank) */}
            {currentCategoryRanks.length > 0 && (
              <div id="container-filter-rank" style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  type="button"
                  id="select-filter-rank"
                  data-testid="select-filter-rank"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'rank'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(prev => prev === 'rank' ? null : 'rank');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: rankFilter !== 'all' ? 700 : 500,
                    border: rankFilter !== 'all' ? '1.5px solid var(--primary)' : '1px solid #CBD5E1',
                    background: rankFilter !== 'all' ? '#ECFDF5' : '#FFFFFF',
                    color: rankFilter !== 'all' ? '#059669' : '#334155',
                    height: 33,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: openDropdown === 'rank' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Shield size={12} color={rankFilter !== 'all' ? '#10B981' : '#64748B'} />
                  <span>{rankFilter === 'all' ? 'Mức Rank: Tất cả' : rankFilter}</span>
                  <ChevronDown
                    size={12}
                    color={rankFilter !== 'all' ? '#10B981' : '#64748B'}
                    style={{
                      transform: openDropdown === 'rank' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}
                  />
                </button>

                {openDropdown === 'rank' && (
                  <div
                    role="listbox"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      minWidth: 190,
                      maxHeight: 280,
                      overflowY: 'auto',
                      background: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: 12,
                      boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
                      padding: '6px',
                      zIndex: 1000,
                      animation: 'slideUp 0.15s ease'
                    }}
                  >
                    <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Cấp bậc / Rank
                      </span>
                      {rankFilter !== 'all' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRankFilter('all');
                            setOpenDropdown(null);
                          }}
                          style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                        >
                          Đặt lại
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setRankFilter('all');
                          setOpenDropdown(null);
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: 8,
                          fontSize: '0.8rem',
                          fontWeight: rankFilter === 'all' ? 700 : 500,
                          background: rankFilter === 'all' ? '#ECFDF5' : 'transparent',
                          color: rankFilter === 'all' ? '#059669' : '#1E293B',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>Tất cả các Rank</span>
                        {rankFilter === 'all' && <Check size={14} color="#10B981" strokeWidth={2.5} />}
                      </div>
                      {currentCategoryRanks.map((r) => {
                        const isSelected = rankFilter === r;
                        return (
                          <div
                            key={r}
                            onClick={(e) => {
                              e.stopPropagation();
                              setRankFilter(r);
                              setOpenDropdown(null);
                            }}
                            style={{
                              padding: '7px 10px',
                              borderRadius: 8,
                              fontSize: '0.8rem',
                              fontWeight: isSelected ? 700 : 500,
                              background: isSelected ? '#ECFDF5' : 'transparent',
                              color: isSelected ? '#059669' : '#1E293B',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{r}</span>
                            {isSelected && <Check size={14} color="#10B981" strokeWidth={2.5} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cụm công cụ bên phải (Sẵn sàng + Đã lưu + Switcher Grid/List + Counter) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap', flexShrink: 0 }}>
            {/* Quick Switch: Sẵn sàng */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.78rem',
                color: onlyAvailable ? '#059669' : '#475569',
                fontWeight: onlyAvailable ? 700 : 500,
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                background: onlyAvailable ? '#ECFDF5' : '#F8FAFC',
                border: onlyAvailable ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                padding: '4px 8px',
                borderRadius: 8,
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="checkbox"
                id="checkbox-filter-available"
                data-testid="checkbox-filter-available"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: 13, height: 13, cursor: 'pointer' }}
              />
              <span>Chỉ hiện acc sẵn sàng</span>
            </label>

            {/* Quick filter: Yêu thích ❤️ */}
            {favorites.length > 0 && (
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: onlyFavorites ? 700 : 500,
                  background: onlyFavorites ? '#FFF1F2' : '#FFFFFF',
                  color: onlyFavorites ? '#E11D48' : '#64748B',
                  border: onlyFavorites ? '1.5px solid #FDA4AF' : '1px solid #CBD5E1',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Heart size={12} fill={onlyFavorites ? '#E11D48' : 'none'} color="#E11D48" />
                <span>Đã lưu ({favorites.length})</span>
              </button>
            )}

            {/* Chuyển đổi Grid (Lưới) vs List (Danh sách) */}
            <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: 2, borderRadius: 8, border: '1px solid #E2E8F0', flexShrink: 0 }}>
              <button
                type="button"
                id="btn-view-grid"
                title="Chế độ xem dạng lưới (Grid)"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 6px',
                  cursor: 'pointer',
                  color: viewMode === 'grid' ? 'var(--primary)' : '#64748B',
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                id="btn-view-list"
                title="Chế độ xem dạng danh sách (List)"
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 6px',
                  cursor: 'pointer',
                  color: viewMode === 'list' ? 'var(--primary)' : '#64748B',
                  boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <List size={14} />
              </button>
            </div>

            {/* Results Count */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Hiển thị <strong id="filter-result-count" style={{ color: 'var(--primary)', fontWeight: 800 }}>{filteredAccounts.length}</strong> / {accounts.length} acc
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACCOUNTS CONTAINER (GRID OR LIST) ================= */}
      {filteredAccounts.length === 0 ? (
        <div
          id="empty-accounts-view"
          className="glass-panel"
          style={{ textAlign: 'center', padding: '50px 20px', borderRadius: 16, background: '#FFFFFF', border: '1.5px dashed #CBD5E1' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔍</div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: 6, fontWeight: 700 }}>
            Không tìm thấy tài khoản phù hợp
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: 18, maxWidth: 450, margin: '0 auto 18px auto' }}>
            Không có kết quả khớp với các tiêu chí tìm kiếm hoặc lọc hiện tại. Thử bỏ bớt điều kiện lọc hoặc đặt lại bộ lọc.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setRankFilter('all');
              setOnlyAvailable(false);
              setOnlyFavorites(false);
              setSelectedCategory('all');
              setSortBy('popular');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem', padding: '8px 16px', fontWeight: 600 }}
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= 1. GRID VIEW ================= */
        <div
          id="accounts-grid"
          data-testid="accounts-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 18
          }}
        >
          {filteredAccounts.map((acc) => {
            const isAvailable = acc.status === 'available';
            const isRented = acc.status === 'rented';
            const rankStyle = getRankBadgeStyle(acc.rank);
            const isFav = favorites.includes(acc.id);

            return (
              <div
                key={acc.id}
                id={`account-card-${acc.id}`}
                data-testid={`account-card-${acc.id}`}
                className="glass-panel"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isAvailable ? '1.5px solid #E2E8F0' : '1.5px solid #F1F5F9',
                  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(15, 23, 42, 0.1)';
                  e.currentTarget.style.borderColor = isAvailable ? '#10B981' : '#CBD5E1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.04)';
                  e.currentTarget.style.borderColor = isAvailable ? '#E2E8F0' : '#F1F5F9';
                }}
              >
                {/* Thumbnail Container (16:9 Aspect Ratio) */}
                <div
                  style={{
                    position: 'relative',
                    height: 155,
                    overflow: 'hidden',
                    background: '#0F172A',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectAccount(acc)}
                >
                  <img
                    src={acc.thumbnail}
                    alt={acc.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.35s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%)'
                    }}
                  />

                  {/* Status Badge (Top-left) */}
                  <div style={{ position: 'absolute', top: 9, left: 9 }}>
                    {isAvailable ? (
                      <span
                        className="badge badge-available"
                        style={{
                          background: 'rgba(255,255,255,0.95)',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: 20,
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', marginRight: 4 }} />
                        Sẵn sàng
                      </span>
                    ) : isRented ? (
                      <span
                        className="badge badge-rented"
                        style={{
                          background: 'rgba(255,255,255,0.95)',
                          color: '#D97706',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: 20,
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                        }}
                      >
                        <Clock size={11} style={{ marginRight: 3 }} />
                        Đang thuê
                      </span>
                    ) : (
                      <span
                        className="badge badge-maintenance"
                        style={{ background: 'rgba(255,255,255,0.95)', fontSize: '0.72rem', padding: '3px 8px' }}
                      >
                        Bảo trì
                      </span>
                    )}
                  </div>

                  {/* Rank Badge + Favorite Heart (Top-right) */}
                  <div style={{ position: 'absolute', top: 9, right: 9, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        background: rankStyle.bg,
                        color: rankStyle.color,
                        border: rankStyle.border,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 16,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                    >
                      {rankStyle.icon}
                      {acc.rank}
                    </span>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      title={isFav ? 'Bỏ lưu tài khoản này' : 'Lưu tài khoản yêu thích'}
                      onClick={(e) => toggleFavorite(acc.id, e)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 26,
                        height: 26,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.88)'; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Heart
                        size={14}
                        fill={isFav ? '#E11D48' : 'none'}
                        color={isFav ? '#E11D48' : '#64748B'}
                      />
                    </button>
                  </div>

                  {/* Game Name Tag & Publisher (Bottom-left) */}
                  <div style={{ position: 'absolute', bottom: 8, left: 9, right: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        background: 'rgba(15, 23, 42, 0.72)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {acc.gameName}
                    </span>

                    {isRented && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          color: '#FEF3C7',
                          background: 'rgba(180, 83, 9, 0.85)',
                          padding: '2px 6px',
                          borderRadius: 6,
                          fontWeight: 600
                        }}
                      >
                        Dự kiến trống: ~30p
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    title={acc.title}
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      lineHeight: 1.4,
                      marginBottom: 8,
                      height: 40,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectAccount(acc)}
                  >
                    {acc.title}
                  </h3>

                  {/* Highlight Skins */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {acc.highlightSkins.slice(0, 2).map((skin, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: '#F1F5F9',
                          color: '#475569',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        {skin}
                      </span>
                    ))}
                    {acc.highlightSkins.length > 2 && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: 6,
                          background: '#E2E8F0',
                          color: '#334155',
                          fontWeight: 700
                        }}
                      >
                        +{acc.highlightSkins.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Bottom Bar: Price & CTA */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 10,
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                        {acc.pricePerHour.toLocaleString('vi-VN')} đ
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 2 }}>/ 1 giờ chơi</div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        id={`btn-view-detail-${acc.id}`}
                        data-testid={`btn-view-detail-${acc.id}`}
                        onClick={() => onSelectAccount(acc)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 8 }}
                        title="Xem chi tiết tài khoản"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        type="button"
                        id={`btn-rent-now-${acc.id}`}
                        data-testid={`btn-rent-now-${acc.id}`}
                        onClick={() => onRentAccount(acc)}
                        disabled={!isAvailable}
                        className="btn btn-primary"
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          borderRadius: 8,
                          opacity: isAvailable ? 1 : 0.65,
                          cursor: isAvailable ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <Key size={13} /> {isAvailable ? 'Thuê Ngay' : 'Đang Bận'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= 2. LIST VIEW (Chế độ xem dạng danh sách ngang) ================= */
        <div
          id="accounts-grid"
          data-testid="accounts-grid"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {filteredAccounts.map((acc) => {
            const isAvailable = acc.status === 'available';
            const isRented = acc.status === 'rented';
            const rankStyle = getRankBadgeStyle(acc.rank);
            const isFav = favorites.includes(acc.id);

            return (
              <div
                key={acc.id}
                id={`account-card-${acc.id}`}
                data-testid={`account-card-${acc.id}`}
                className="glass-panel"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
                }}
              >
                {/* Left: Thumbnail & Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, flex: 2 }}>
                  <div
                    style={{
                      position: 'relative',
                      width: 100,
                      height: 65,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectAccount(acc)}
                  >
                    <img
                      src={acc.thumbnail}
                      alt={acc.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 3, left: 3 }}>
                      <span style={{ fontSize: '0.62rem', color: '#FFFFFF', background: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                        {acc.gameName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          background: rankStyle.bg,
                          color: rankStyle.color,
                          border: rankStyle.border,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 12,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        {rankStyle.icon}
                        {acc.rank}
                      </span>

                      {isAvailable ? (
                        <span style={{ fontSize: '0.68rem', color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: 12, fontWeight: 700, border: '1px solid #A7F3D0' }}>
                          ● Sẵn sàng
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: '#D97706', background: '#FEF3C7', padding: '1px 6px', borderRadius: 12, fontWeight: 700, border: '1px solid #FDE68A' }}>
                          ● Đang thuê (~30p)
                        </span>
                      )}
                    </div>

                    <h4
                      style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0, cursor: 'pointer' }}
                      onClick={() => onSelectAccount(acc)}
                    >
                      {acc.title}
                    </h4>

                    {/* Skin Tags */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {acc.highlightSkins.slice(0, 3).map((skin, idx) => (
                        <span key={idx} style={{ fontSize: '0.68rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1px 5px', borderRadius: 4, color: '#64748B' }}>
                          {skin}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Price & CTA Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {acc.pricePerHour.toLocaleString('vi-VN')} đ
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>/ 1 giờ chơi</div>
                  </div>

                  {/* Favorite button */}
                  <button
                    type="button"
                    title={isFav ? 'Bỏ lưu' : 'Lưu'}
                    onClick={(e) => toggleFavorite(acc.id, e)}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Heart size={14} fill={isFav ? '#E11D48' : 'none'} color={isFav ? '#E11D48' : '#94A3B8'} />
                  </button>

                  <button
                    type="button"
                    id={`btn-view-detail-${acc.id}`}
                    data-testid={`btn-view-detail-${acc.id}`}
                    onClick={() => onSelectAccount(acc)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 8 }}
                  >
                    <Eye size={14} /> Chi tiết
                  </button>

                  <button
                    type="button"
                    id={`btn-rent-now-${acc.id}`}
                    data-testid={`btn-rent-now-${acc.id}`}
                    onClick={() => onRentAccount(acc)}
                    disabled={!isAvailable}
                    className="btn btn-primary"
                    style={{
                      padding: '6px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      borderRadius: 8,
                      opacity: isAvailable ? 1 : 0.6
                    }}
                  >
                    <Key size={13} /> {isAvailable ? 'Thuê Ngay' : 'Đang Bận'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
