import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RevenuePage = () => {
  const { transactions } = useApp();

  const rentalFees = transactions.filter(t => t.type === 'rental_fee');
  const totalRevenue = rentalFees.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={22} color="#10B981" />
          <span>Báo Cáo Doanh Thu Hệ Thống</span>
        </h1>
        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
          Thống kê dòng tiền cho thuê tài khoản game theo thời gian thực
        </p>
      </div>

      <div className="dashboard-stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Doanh thu tuần này</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
              {(totalRevenue + 125000).toLocaleString('vi-VN')} đ
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600, marginTop: 4 }}>
              ↗ +18.4% so với tuần trước
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Doanh thu tháng này</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
              {(totalRevenue + 1450000).toLocaleString('vi-VN')} đ
            </div>
            <div style={{ fontSize: '0.74rem', color: '#3B82F6', fontWeight: 600, marginTop: 4 }}>
              ↗ Đạt 92% chỉ tiêu tháng
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Tỷ suất lợi nhuận ròng</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>85.2%</div>
            <div style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 600, marginTop: 4 }}>
              Đã trừ chi phí vận hành & bảo trì
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Revenue Table */}
      <div className="rental-table-card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Lịch Sử Dòng Tiền Giao Dịch</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="rental-table">
            <thead>
              <tr>
                <th>MÃ GD</th>
                <th>LOẠI GIAO DỊCH</th>
                <th>SỐ TIỀN</th>
                <th>PHƯƠNG THỨC</th>
                <th>TRẠNG THÁI</th>
                <th>GHI CHÚ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10B981' }}>#{tx.id}</td>
                  <td>
                    {tx.type === 'rental_fee' ? (
                      <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <ArrowUpRight size={14} /> Thu tiền thuê acc
                      </span>
                    ) : (
                      <span style={{ color: '#3B82F6', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <ArrowDownRight size={14} /> Nạp ví
                      </span>
                    )}
                  </td>
                  <td style={{ fontWeight: 700, color: tx.amount > 0 ? '#10B981' : '#0F172A' }}>
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString('vi-VN')} đ` : `${tx.amount.toLocaleString('vi-VN')} đ`}
                  </td>
                  <td style={{ color: '#475569' }}>{tx.paymentMethod}</td>
                  <td>
                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 10, fontSize: '0.74rem', fontWeight: 700 }}>
                      Thành công
                    </span>
                  </td>
                  <td style={{ color: '#64748B', fontSize: '0.8rem' }}>{tx.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
