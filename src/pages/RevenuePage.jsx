import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Gamepad2,
  CreditCard,
  Layers,
  Sparkles,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RevenuePage = () => {
  const { transactions, rentals, accounts } = useApp();

  // Filter States
  const [timeRange, setTimeRange] = useState('all'); // 'today' | '7d' | '30d' | 'all'
  const [txTypeFilter, setTxTypeFilter] = useState('all'); // 'all' | 'rental_fee' | 'deposit' | 'refund'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Map accounts to quick lookup
  const accountMap = useMemo(() => {
    const map = {};
    if (Array.isArray(accounts)) {
      accounts.forEach(a => {
        map[a.id] = a;
      });
    }
    return map;
  }, [accounts]);

  // Map Game Details
  const GAME_META = {
    'lien-quan': { name: 'Liên Quân Mobile', color: '#10B981', bg: '#ECFDF5' },
    'valorant': { name: 'Valorant', color: '#EF4444', bg: '#FEF2F2' },
    'genshin': { name: 'Genshin Impact', color: '#8B5CF6', bg: '#F5F3FF' },
    'fo4': { name: 'FC Online', color: '#3B82F6', bg: '#EFF6FF' },
    'pubg': { name: 'PUBG Steam', color: '#F59E0B', bg: '#FFFBEB' },
    'toc-chien': { name: 'LMHT: Tốc Chiến', color: '#06B6D4', bg: '#ECFEFF' }
  };

  // Filter Transactions by Time
  const timeFilteredTransactions = useMemo(() => {
    const now = Date.now();
    return transactions.filter(tx => {
      const txTime = tx.timestamp || now;
      if (timeRange === 'today') {
        return now - txTime <= 24 * 60 * 60 * 1000;
      }
      if (timeRange === '7d') {
        return now - txTime <= 7 * 24 * 60 * 60 * 1000;
      }
      if (timeRange === '30d') {
        return now - txTime <= 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }, [transactions, timeRange]);

  // Compute Core Metrics
  const metrics = useMemo(() => {
    let grossRental = 0;
    let totalDeposit = 0;
    let totalRefund = 0;
    let rentalCount = 0;

    timeFilteredTransactions.forEach(tx => {
      if (tx.type === 'rental_fee') {
        grossRental += Math.abs(tx.amount);
        rentalCount += 1;
      } else if (tx.type === 'deposit') {
        totalDeposit += Math.abs(tx.amount);
      } else if (tx.type === 'refund') {
        totalRefund += Math.abs(tx.amount);
      }
    });

    // Fallback nếu rental fees trong transactions ít hơn tổng rentals thực tế
    const rentalListCost = rentals.reduce((sum, r) => sum + (r.totalCost || 0), 0);
    const effectiveGross = Math.max(grossRental, rentalListCost);
    const netRevenue = effectiveGross - totalRefund;
    const avgOrderValue = rentalCount > 0 ? Math.round(effectiveGross / rentalCount) : 0;
    const profitMargin = effectiveGross > 0 ? ((netRevenue / effectiveGross) * 100).toFixed(1) : '100.0';

    return {
      grossRental: effectiveGross,
      totalDeposit,
      totalRefund,
      netRevenue,
      rentalCount: Math.max(rentalCount, rentals.length),
      avgOrderValue,
      profitMargin
    };
  }, [timeFilteredTransactions, rentals]);

  // Compute Revenue by Game
  const gameRevenueBreakdown = useMemo(() => {
    const gameTotals = {
      'lien-quan': 0,
      'valorant': 0,
      'genshin': 0,
      'fo4': 0,
      'pubg': 0,
      'toc-chien': 0
    };

    // Calculate from rentals
    rentals.forEach(r => {
      const acc = accountMap[r.accountId];
      const gId = acc?.gameId || 'lien-quan';
      if (gameTotals[gId] !== undefined) {
        gameTotals[gId] += r.totalCost || 0;
      } else {
        gameTotals['lien-quan'] += r.totalCost || 0;
      }
    });

    const totalCalculated = Object.values(gameTotals).reduce((a, b) => a + b, 0) || 1;

    return Object.keys(gameTotals).map(gId => {
      const rev = gameTotals[gId];
      const percent = Math.round((rev / totalCalculated) * 100);
      return {
        gameId: gId,
        name: GAME_META[gId]?.name || gId,
        color: GAME_META[gId]?.color || '#10B981',
        bg: GAME_META[gId]?.bg || '#ECFDF5',
        revenue: rev,
        percentage: percent
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [rentals, accountMap]);

  // Payment Method Breakdown
  const paymentBreakdown = useMemo(() => {
    const methods = {
      'Ví GameRent': 0,
      'VietQR Auto': 0,
      'Thẻ Cào': 0
    };

    timeFilteredTransactions.forEach(tx => {
      const m = tx.paymentMethod || 'Ví GameRent';
      if (m.includes('QR') || m.includes('VietQR') || m.includes('Ngân Hàng')) {
        methods['VietQR Auto'] += Math.abs(tx.amount);
      } else if (m.includes('Thẻ Cào') || m.includes('Card')) {
        methods['Thẻ Cào'] += Math.abs(tx.amount);
      } else {
        methods['Ví GameRent'] += Math.abs(tx.amount);
      }
    });

    const total = Object.values(methods).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(methods).map(([name, amount]) => ({
      name,
      amount,
      percentage: Math.round((amount / total) * 100)
    }));
  }, [timeFilteredTransactions]);

  // Filtered Transactions for Table
  const tableTransactions = useMemo(() => {
    return timeFilteredTransactions.filter(tx => {
      // Type filter
      if (txTypeFilter !== 'all' && tx.type !== txTypeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = (tx.id || '').toLowerCase().includes(q);
        const noteMatch = (tx.note || '').toLowerCase().includes(q);
        const methodMatch = (tx.paymentMethod || '').toLowerCase().includes(q);
        if (!idMatch && !noteMatch && !methodMatch) return false;
      }
      return true;
    });
  }, [timeFilteredTransactions, txTypeFilter, searchQuery]);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = ['Mã GD', 'Loại Giao Dịch', 'Số Tiền (VNĐ)', 'Phương Thức', 'Trạng Thái', 'Thời Gian', 'Ghi Chú'];
    
    const rows = tableTransactions.map(tx => {
      const typeLabel = tx.type === 'rental_fee' ? 'Thu tiền thuê' : tx.type === 'deposit' ? 'Nạp tiền ví' : tx.type === 'refund' ? 'Hoàn tiền khiếu nại' : tx.type;
      const amountStr = tx.amount > 0 ? `+${tx.amount}` : `${tx.amount}`;
      const timeStr = tx.timestamp ? new Date(tx.timestamp).toLocaleString('vi-VN') : 'Mới đây';
      const cleanNote = (tx.note || '').replace(/"/g, '""');
      
      return [
        `"${tx.id}"`,
        `"${typeLabel}"`,
        `"${amountStr}"`,
        `"${tx.paymentMethod || 'Ví GameRent'}"`,
        `"${tx.status || 'completed'}"`,
        `"${timeStr}"`,
        `"${cleanNote}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `baocao_doanhthu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Đã xuất file báo cáo doanh thu CSV thành công!');
  };

  return (
    <div className="dashboard-container" style={{ paddingBottom: 60 }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            background: '#064E3B',
            color: '#ECFDF5',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.86rem',
            fontWeight: 600,
            border: '1px solid #059669',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={18} color="#34D399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#ECFDF5', color: '#059669', fontSize: '0.74rem', fontWeight: 700, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            DỮ LIỆU TÀI CHÍNH THỜI GIAN THỰC
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={24} color="#10B981" />
            <span>Báo Cáo Doanh Thu & Dòng Tiền</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
            Theo dõi chi tiết doanh thu cho thuê tài khoản game, biến động nạp rút và phân tích tỷ trọng theo từng tựa game.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Time Filter Pills */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 8, gap: 2 }}>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: '30d', label: '30 ngày' },
              { id: '7d', label: '7 ngày' },
              { id: 'today', label: 'Hôm nay' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTimeRange(item.id)}
                style={{
                  border: 'none',
                  background: timeRange === item.id ? '#FFFFFF' : 'transparent',
                  color: timeRange === item.id ? '#0F172A' : '#64748B',
                  fontWeight: timeRange === item.id ? 700 : 500,
                  fontSize: '0.76rem',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  boxShadow: timeRange === item.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            id="btn-export-revenue-csv"
            data-testid="btn-export-revenue-csv"
            onClick={handleExportCSV}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <Download size={15} />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 24
        }}
      >
        {/* Card 1: Doanh Thu Gộp */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Doanh Thu Thuê Gộp</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
            {metrics.grossRental.toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} /> Tổng thu từ {metrics.rentalCount} lượt thuê
          </div>
        </div>

        {/* Card 2: Doanh Thu Ròng */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Doanh Thu Ròng (Lãi)</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--font-heading)' }}>
            {metrics.netRevenue.toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500, marginTop: 4 }}>
            Tỷ suất lợi nhuận: <strong style={{ color: '#10B981' }}>{metrics.profitMargin}%</strong>
          </div>
        </div>

        {/* Card 3: Nạp Tiền Vào Ví */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Dòng Tiền Nạp Ví</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
            {metrics.totalDeposit.toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 600, marginTop: 4 }}>
            Khách nạp sẵn chờ thuê
          </div>
        </div>

        {/* Card 4: Hoàn Tiền / Khiếu Nại */}
        <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Tiền Hoàn Trả Khách</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: metrics.totalRefund > 0 ? '#EF4444' : '#0F172A', fontFamily: 'var(--font-heading)' }}>
            {metrics.totalRefund.toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500, marginTop: 4 }}>
            Chính sách hoàn 15 phút đầu
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: 2 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 16,
          marginBottom: 24
        }}
      >
        {/* Left: Tỷ Trọng Doanh Thu Theo Tựa Game */}
        <div className="glass-panel" style={{ background: '#FFFFFF', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Gamepad2 size={18} color="#10B981" /> Doanh Thu Theo Tựa Game
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '3px 0 0 0' }}>
                Xếp hạng doanh số đóng góp của từng dòng game
              </p>
            </div>
            <span style={{ fontSize: '0.74rem', background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
              {gameRevenueBreakdown.length} Tựa game
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {gameRevenueBreakdown.map((item) => (
              <div key={item.gameId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#1E293B' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                      {item.revenue.toLocaleString('vi-VN')} đ
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748B', minWidth: 32, textAlign: 'right' }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: 7, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      borderRadius: 4,
                      background: item.color,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cơ Cấu Phương Thức Thanh Toán & Sức Khỏe Tài Chính */}
        <div className="glass-panel" style={{ background: '#FFFFFF', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <PieChart size={18} color="#3B82F6" /> Cơ Cấu Kênh Thanh Toán
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '3px 0 0 0' }}>
                Phân bổ phương thức giao dịch nạp & thuê
              </p>
            </div>
            <span style={{ fontSize: '0.74rem', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
              Kênh Tự Động
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {paymentBreakdown.map((pm, idx) => {
              const color = idx === 0 ? '#10B981' : idx === 1 ? '#3B82F6' : '#F59E0B';
              return (
                <div key={pm.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#1E293B' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: color }}></span>
                      <span>{pm.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        {pm.amount.toLocaleString('vi-VN')} đ
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748B', minWidth: 32, textAlign: 'right' }}>
                        {pm.percentage}%
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 7, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pm.percentage}%`,
                        height: '100%',
                        borderRadius: 4,
                        background: color,
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Metrics Banner */}
          <div
            style={{
              marginTop: 22,
              padding: 14,
              borderRadius: 8,
              background: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>ĐƠN GIÁ TB (AOV)</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                {metrics.avgOrderValue.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <div style={{ width: 1, background: '#E2E8F0' }}></div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>TỶ LỆ KHIẾU NẠI</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                0.8% <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>(Cực an toàn)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="rental-table-card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        {/* Table Filter Bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
              Nhật Ký Dòng Tiền & Giao Dịch
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
              Hiển thị {tableTransactions.length} giao dịch tương ứng
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: 200 }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã GD, nội dung..."
                style={{
                  padding: '6px 10px 6px 32px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            {/* Type Filters */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 2, borderRadius: 6, gap: 2 }}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'rental_fee', label: 'Thuê acc' },
                { id: 'deposit', label: 'Nạp ví' },
                { id: 'refund', label: 'Hoàn tiền' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTxTypeFilter(item.id)}
                  style={{
                    border: 'none',
                    background: txTypeFilter === item.id ? '#FFFFFF' : 'transparent',
                    color: txTypeFilter === item.id ? '#0F172A' : '#64748B',
                    fontWeight: txTypeFilter === item.id ? 700 : 500,
                    fontSize: '0.74rem',
                    padding: '5px 10px',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table className="rental-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>MÃ GD</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>LOẠI GIAO DỊCH</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>SỐ TIỀN</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>PHƯƠNG THỨC</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>TRẠNG THÁI</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>THỜI GIAN</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>GHI CHÚ</th>
              </tr>
            </thead>
            <tbody>
              {tableTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8' }}>
                    Không có giao dịch nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                tableTransactions.map((tx) => {
                  const isRental = tx.type === 'rental_fee';
                  const isDeposit = tx.type === 'deposit';
                  const isRefund = tx.type === 'refund';

                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#10B981' }}>
                        #{tx.id}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {isRental ? (
                          <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ArrowUpRight size={14} /> Thu tiền thuê acc
                          </span>
                        ) : isDeposit ? (
                          <span style={{ color: '#3B82F6', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ArrowDownLeft size={14} /> Nạp ví
                          </span>
                        ) : isRefund ? (
                          <span style={{ color: '#DC2626', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ArrowDownLeft size={14} /> Hoàn tiền khiếu nại
                          </span>
                        ) : (
                          <span style={{ color: '#64748B', fontWeight: 600 }}>
                            Hệ thống
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: isRental || isDeposit ? '#10B981' : isRefund ? '#EF4444' : '#0F172A' }}>
                        {isRental
                          ? `+${Math.abs(tx.amount).toLocaleString('vi-VN')} đ`
                          : isDeposit
                          ? `+${Math.abs(tx.amount).toLocaleString('vi-VN')} đ`
                          : isRefund
                          ? `-${Math.abs(tx.amount).toLocaleString('vi-VN')} đ`
                          : '0 đ'}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#475569' }}>
                        {tx.paymentMethod || 'Ví GameRent'}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span
                          style={{
                            background: '#ECFDF5',
                            color: '#059669',
                            padding: '3px 8px',
                            borderRadius: 12,
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <CheckCircle2 size={12} /> Thành công
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'Vừa xong'}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#64748B', fontSize: '0.8rem', maxWidth: 280 }}>
                        {tx.note || 'Giao dịch hệ thống'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
