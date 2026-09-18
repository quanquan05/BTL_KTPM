import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle, Clock, Eye, Key, X, ChevronDown, Check, Tag, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomePage = ({ onSelectAccount, onRentAccount }) => {
  const { categories, accounts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under12' | '12to20' | 'above20'
  const [rankFilter, setRankFilter] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'price' | 'rank' | null

  // Đóng dropdown khi click ngoài hoặc nhấn Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !e.target.closest('#container-filter-price') &&
        !e.target.closest('#container-filter-rank')
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

  // Lấy danh sách rank của game đang chọn
  const currentCategoryRanks = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const cat = categories.find(c => c.id === selectedCategory);
    return cat ? cat.ranks : [];
  }, [selectedCategory, categories]);

  // Bộ lọc tài khoản
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Lọc theo danh mục game
      if (selectedCategory !== 'all' && acc.gameId !== selectedCategory) {
        return false;
      }

      // 2. Lọc theo từ khóa tìm kiếm (tên, skin, rank)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = acc.title.toLowerCase().includes(q);
        const matchRank = acc.rank.toLowerCase().includes(q);
        const matchSkins = acc.highlightSkins.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchRank && !matchSkins) return false;
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

      return true;
    });
  }, [accounts, selectedCategory, searchQuery, priceFilter, rankFilter, onlyAvailable]);

  return (
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      {/* ================= ALL-IN-ONE EXPLORER STRIP ================= */}
      <div style={{ marginBottom: 20 }}>
        {/* Row 1: Game Category Horizontal Pills */}
        <div
          id="category-tabs-container"
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 12,
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            id="tab-category-all"
            data-testid="tab-category-all"
            onClick={() => { setSelectedCategory('all'); setRankFilter('all'); }}
            className={`quick-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Tất Cả Game ({accounts.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = accounts.filter(a => a.gameId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                id={`tab-category-${cat.id}`}
                data-testid={`tab-category-${cat.id}`}
                onClick={() => { setSelectedCategory(cat.id); setRankFilter('all'); }}
                className={`quick-chip ${isSelected ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Row 2: Search & Filter Toolbar */}
        <div
          id="filter-controls-bar"
          data-testid="filter-controls-bar"
          className="glass-panel"
          style={{
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            background: '#FFFFFF',
            position: 'relative',
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
            {/* Instant Search Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '5px 10px',
                minWidth: 260,
                flex: 1,
                maxWidth: 400
              }}
            >
              <Search size={15} color="var(--primary)" />
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
                  width: '100%',
                  fontSize: '0.86rem',
                  color: 'var(--text-main)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 2 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Custom Dropdown: Price Filter */}
            <div id="container-filter-price" style={{ position: 'relative' }}>
              <button
                type="button"
                id="select-filter-price"
                data-testid="select-filter-price"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === 'price'}
                onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: priceFilter !== 'all' ? 600 : 500,
                  border: priceFilter !== 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: priceFilter !== 'all' ? '#ECFDF5' : '#FFFFFF',
                  color: priceFilter !== 'all' ? '#059669' : '#334155',
                  height: 34,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: openDropdown === 'price' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Tag size={13} color={priceFilter !== 'all' ? '#10B981' : '#64748B'} />
                <span>{PRICE_OPTIONS.find(p => p.value === priceFilter)?.label || 'Khoảng giá: Tất cả'}</span>
                <ChevronDown
                  size={13}
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
                    width: 270,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
                    padding: '6px',
                    zIndex: 100,
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      padding: '6px 8px 6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #F1F5F9',
                      marginBottom: 4
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Khoảng giá thuê
                    </span>
                    {priceFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          setPriceFilter('all');
                          setOpenDropdown(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.72rem',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          padding: 0
                        }}
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
                          id={`option-price-${opt.value}`}
                          data-testid={`option-price-${opt.value}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setPriceFilter(opt.value);
                            setOpenDropdown(null);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: isSelected ? '#ECFDF5' : 'transparent',
                            color: isSelected ? '#059669' : '#1E293B',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.12s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 700 : 500 }}>
                                {opt.title}
                              </span>
                              {opt.badge && (
                                <span
                                  style={{
                                    fontSize: '0.66rem',
                                    fontWeight: 700,
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    background: opt.badge.bg,
                                    color: opt.badge.color
                                  }}
                                >
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

            {/* Custom Dropdown: Rank Filter (if game selected) */}
            {currentCategoryRanks.length > 0 && (
              <div id="container-filter-rank" style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="select-filter-rank"
                  data-testid="select-filter-rank"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'rank'}
                  onClick={() => setOpenDropdown(openDropdown === 'rank' ? null : 'rank')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: rankFilter !== 'all' ? 600 : 500,
                    border: rankFilter !== 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: rankFilter !== 'all' ? '#ECFDF5' : '#FFFFFF',
                    color: rankFilter !== 'all' ? '#059669' : '#334155',
                    height: 34,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: openDropdown === 'rank' ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Shield size={13} color={rankFilter !== 'all' ? '#10B981' : '#64748B'} />
                  <span>{rankFilter === 'all' ? 'Mức Rank: Tất cả' : rankFilter}</span>
                  <ChevronDown
                    size={13}
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
                      minWidth: 200,
                      maxHeight: 280,
                      overflowY: 'auto',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
                      padding: '6px',
                      zIndex: 100,
                      animation: 'slideUp 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 8px 6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Cấp bậc / Rank
                      </span>
                      {rankFilter !== 'all' && (
                        <button
                          type="button"
                          onClick={() => {
                            setRankFilter('all');
                            setOpenDropdown(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.72rem',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: 0
                          }}
                        >
                          Đặt lại
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div
                        onClick={() => {
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
                          justifyContent: 'space-between',
                          transition: 'all 0.12s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (rankFilter !== 'all') e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (rankFilter !== 'all') e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>Mức Rank: Tất cả</span>
                        {rankFilter === 'all' && <Check size={14} color="#10B981" strokeWidth={2.5} />}
                      </div>

                      {currentCategoryRanks.map((r) => {
                        const isSelected = rankFilter === r;
                        return (
                          <div
                            key={r}
                            onClick={() => {
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
                              justifyContent: 'space-between',
                              transition: 'all 0.12s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = 'transparent';
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

            {/* Only Available Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <input
                type="checkbox"
                id="checkbox-filter-available"
                data-testid="checkbox-filter-available"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: 15, height: 15 }}
              />
              <span>Chỉ hiện acc sẵn sàng</span>
            </label>
          </div>

          {/* Results Count */}
          <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
            Hiển thị <strong id="filter-result-count" style={{ color: 'var(--primary)', fontWeight: 700 }}>{filteredAccounts.length}</strong> acc
          </div>
        </div>
      </div>

      {/* ================= ACCOUNTS GRID ================= */}
      {filteredAccounts.length === 0 ? (
        <div
          id="empty-accounts-view"
          className="glass-panel"
          style={{ textAlign: 'center', padding: '50px 20px', borderRadius: 12, background: '#FFFFFF' }}
        >
          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🔍</div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 4 }}>Không tìm thấy tài khoản phù hợp</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: 16 }}>
            Vui lòng thử tìm với từ khóa khác hoặc bỏ các điều kiện lọc.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setPriceFilter('all');
              setRankFilter('all');
              setOnlyAvailable(false);
              setSelectedCategory('all');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem' }}
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div
          id="accounts-grid"
          data-testid="accounts-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16
          }}
        >
          {filteredAccounts.map((acc) => {
            const isAvailable = acc.status === 'available';
            const isRented = acc.status === 'rented';

            return (
              <div
                key={acc.id}
                id={`account-card-${acc.id}`}
                data-testid={`account-card-${acc.id}`}
                className="glass-panel"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                {/* Thumbnail Container (16:9 Aspect Ratio) */}
                <div style={{ position: 'relative', height: 145, overflow: 'hidden', background: '#0F172A' }}>
                  <img
                    src={acc.thumbnail}
                    alt={acc.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)'
                    }}
                  />

                  {/* Status Badge */}
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    {isAvailable ? (
                      <span className="badge badge-available" style={{ background: 'rgba(255,255,255,0.92)' }}>
                        <CheckCircle size={11} /> Sẵn sàng
                      </span>
                    ) : isRented ? (
                      <span className="badge badge-rented" style={{ background: 'rgba(255,255,255,0.92)' }}>
                        <Clock size={11} /> Đang thuê
                      </span>
                    ) : (
                      <span className="badge badge-maintenance" style={{ background: 'rgba(255,255,255,0.92)' }}>
                        Bảo trì
                      </span>
                    )}
                  </div>

                  {/* Rank Badge */}
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span className="badge badge-rank" style={{ background: 'rgba(255,255,255,0.92)', color: '#0F172A', fontWeight: 700 }}>
                      {acc.rank}
                    </span>
                  </div>

                  {/* Game Name Tag */}
                  <div style={{ position: 'absolute', bottom: 6, left: 8 }}>
                    <span style={{ fontSize: '0.68rem', color: '#FFFFFF', fontWeight: 600, background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
                      {acc.gameName}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    title={acc.title}
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      marginBottom: 6,
                      height: 38,
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
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: '#F1F5F9',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {skin}
                      </span>
                    ))}
                    {acc.highlightSkins.length > 2 && (
                      <span style={{ fontSize: '0.7rem', padding: '1px 4px', color: 'var(--text-subtle)' }}>
                        +{acc.highlightSkins.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Bottom Bar: Price & CTA */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 10,
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                        {acc.pricePerHour.toLocaleString('vi-VN')} đ
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: 2 }}>/ 1 giờ</div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        id={`btn-view-detail-${acc.id}`}
                        data-testid={`btn-view-detail-${acc.id}`}
                        onClick={() => onSelectAccount(acc)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                        title="Xem chi tiết"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        type="button"
                        id={`btn-rent-now-${acc.id}`}
                        data-testid={`btn-rent-now-${acc.id}`}
                        onClick={() => onRentAccount(acc)}
                        disabled={!isAvailable}
                        className="btn btn-primary"
                        style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                      >
                        <Key size={13} /> Thuê Ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
