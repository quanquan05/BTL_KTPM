import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, CheckCircle, Clock, Eye, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomePage = ({ onSelectAccount, onRentAccount }) => {
  const { categories, accounts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under12' | '12to20' | 'above20'
  const [rankFilter, setRankFilter] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

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
    <div style={{ paddingBottom: 60 }}>
      {/* ================= HERO BANNER SECTION ================= */}
      <section
        style={{
          position: 'relative',
          padding: '50px 0 42px 0',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, rgba(248, 250, 252, 0.2) 100%)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 20,
              background: '#FFFFFF',
              border: '1px solid var(--border-active)',
              color: 'var(--primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: 16,
              boxShadow: '0 2px 6px rgba(249, 115, 22, 0.1)'
            }}
          >
            <Sparkles size={15} /> NỀN TẢNG CHO THUÊ ACC GAME TỰ ĐỘNG 24/7
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 14,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)'
            }}
          >
            Trải Nghiệm Mọi Acc Game <br />
            <span style={{ color: 'var(--primary)' }}>Skin Vip - Rank Cao</span> Trong Tích Tắc
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              maxWidth: 640,
              margin: '0 auto 26px auto',
              lineHeight: 1.6
            }}
          >
            Hệ thống cấp tài khoản tự động ngay sau khi thanh toán. Đồng hồ đếm giờ theo thời gian thực, bảo mật hai đầu và hoàn tiền tức thì nếu gặp sự cố.
          </p>

          {/* Quick Search Bar */}
          <div
            style={{
              maxWidth: 620,
              margin: '0 auto',
              background: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: 12,
              padding: '6px 8px',
              display: 'flex',
              gap: 10,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, paddingLeft: 10 }}>
              <Search size={18} color="var(--primary)" />
              <input
                type="text"
                id="input-hero-search"
                data-testid="input-hero-search"
                placeholder="Tìm acc theo tên skin, rank (Vandal Kuronami, Flo Tinh Hệ, Radiant...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '0.92rem'
                }}
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', paddingRight: 8, fontSize: '0.85rem' }}
              >
                Xóa
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= GAME TABS & FILTER BAR ================= */}
      <section className="container" style={{ marginTop: 36 }}>
        {/* Game Category Tabs */}
        <div
          id="category-tabs-container"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 20,
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            id="tab-category-all"
            data-testid="tab-category-all"
            onClick={() => { setSelectedCategory('all'); setRankFilter('all'); }}
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 10, padding: '9px 16px', whiteSpace: 'nowrap', fontSize: '0.88rem' }}
          >
            Tất Cả Game ({accounts.length})
          </button>

          {categories.map((cat) => {
            const count = accounts.filter(a => a.gameId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                id={`tab-category-${cat.id}`}
                data-testid={`tab-category-${cat.id}`}
                onClick={() => { setSelectedCategory(cat.id); setRankFilter('all'); }}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 10, padding: '9px 16px', whiteSpace: 'nowrap', fontSize: '0.88rem' }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div
          id="filter-controls-bar"
          data-testid="filter-controls-bar"
          className="glass-panel"
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 26,
            background: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
              <Filter size={16} color="var(--primary)" />
              <span>Bộ lọc:</span>
            </div>

            {/* Filter Price */}
            <select
              id="select-filter-price"
              data-testid="select-filter-price"
              className="form-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <option value="all">Khoảng giá: Tất cả</option>
              <option value="under12">Dưới 12.000 đ/h</option>
              <option value="12to20">12.000 đ - 20.000 đ/h</option>
              <option value="above20">Trên 20.000 đ/h</option>
            </select>

            {/* Filter Rank */}
            {currentCategoryRanks.length > 0 && (
              <select
                id="select-filter-rank"
                data-testid="select-filter-rank"
                className="form-select"
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value="all">Mức Rank: Tất cả</option>
                {currentCategoryRanks.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            )}

            {/* Checkbox Only Available */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.86rem',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                id="checkbox-filter-available"
                data-testid="checkbox-filter-available"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
              />
              <span>Chỉ hiển thị Acc đang rảnh</span>
            </label>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Tìm thấy <strong id="filter-result-count" style={{ color: 'var(--primary)' }}>{filteredAccounts.length}</strong> tài khoản phù hợp
          </div>
        </div>

        {/* ================= ACCOUNTS GRID ================= */}
        {filteredAccounts.length === 0 ? (
          <div
            id="empty-accounts-view"
            className="glass-panel"
            style={{ textAlign: 'center', padding: '50px 20px', borderRadius: 14, background: '#FFFFFF' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎮</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: 8 }}>Không tìm thấy tài khoản phù hợp</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc giá/rank.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceFilter('all');
                setRankFilter('all');
                setOnlyAvailable(false);
                setSelectedCategory('all');
              }}
              className="btn btn-secondary"
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20
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
                    borderRadius: 14,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    border: '1px solid var(--border-subtle)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 115, 22, 0.12)';
                    e.currentTarget.style.borderColor = 'var(--border-active)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Thumbnail Container */}
                  <div style={{ position: 'relative', height: 175, overflow: 'hidden' }}>
                    <img
                      src={acc.thumbnail}
                      alt={acc.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%)'
                      }}
                    />

                    {/* Status Badge */}
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      {isAvailable ? (
                        <span className="badge badge-available">
                          <CheckCircle size={12} /> Sẵn sàng
                        </span>
                      ) : isRented ? (
                        <span className="badge badge-rented">
                          <Clock size={12} /> Đang thuê
                        </span>
                      ) : (
                        <span className="badge badge-maintenance">
                          Đang bảo trì
                        </span>
                      )}
                    </div>

                    {/* Rank Badge */}
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className="badge badge-rank">
                        {acc.rank}
                      </span>
                    </div>

                    {/* Hourly Price Overlay */}
                    <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 6,
                          padding: '3px 8px',
                          display: 'inline-flex',
                          alignItems: 'baseline',
                          gap: 4,
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {acc.pricePerHour.toLocaleString('vi-VN')} đ
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/giờ</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                        marginBottom: 8,
                        height: 44,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: 'var(--text-main)'
                      }}
                    >
                      {acc.title}
                    </h3>

                    {/* Skins highlight list */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                      {acc.highlightSkins.slice(0, 3).map((skin, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'var(--bg-surface)',
                            fontSize: '0.73rem',
                            color: 'var(--text-muted)',
                            padding: '2px 7px',
                            borderRadius: 4,
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {skin}
                        </span>
                      ))}
                      {acc.highlightSkins.length > 3 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', alignSelf: 'center' }}>
                          +{acc.highlightSkins.length - 3}
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        id={`btn-view-detail-${acc.id}`}
                        data-testid={`btn-view-detail-${acc.id}`}
                        onClick={() => onSelectAccount(acc)}
                        className="btn btn-secondary"
                        style={{ padding: '7px 11px', fontSize: '0.85rem' }}
                        title="Xem chi tiết tài khoản"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        id={`btn-rent-card-${acc.id}`}
                        data-testid={`btn-rent-card-${acc.id}`}
                        disabled={!isAvailable}
                        onClick={() => onRentAccount(acc)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '7px 12px', fontSize: '0.86rem' }}
                      >
                        <Key size={15} />
                        {isAvailable ? 'Thuê Ngay' : 'Đã Thuê'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
