import React, { useState } from 'react';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WalletPage = ({ onOpenDeposit }) => {
  const { currentUser, transactions } = useApp();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'deposit' | 'rental_fee' | 'refund'

  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);

  const filteredTransactions = userTransactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const totalDeposited = userTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = userTransactions
    .filter(t => t.type === 'rental_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalRefunded = userTransactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container" style={{ padding: '36px 20px 70px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Quản Lý <span style={{ color: 'var(--primary)' }}>Ví Điện Tử</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Xem số dư khả dụng, lịch sử nạp tiền và theo dõi các khoản khấu trừ khi thuê tài khoản game.
        </p>
      </div>

      {/* ================= WALLET SUMMARY CARDS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}
      >
        {/* Main Balance Card */}
        <div
          className="glass-panel"
          style={{
            padding: 22,
            borderRadius: 14,
            background: '#FFFFFF',
            border: '1px solid var(--border-active)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.08)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                Số dư khả dụng
              </span>
              <Wallet size={18} color="var(--primary)" />
            </div>
            <div id="wallet-balance-big-display" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {currentUser?.balance?.toLocaleString('vi-VN')} đ
            </div>
          </div>

          <button
            type="button"
            id="btn-wallet-page-deposit"
            data-testid="btn-wallet-page-deposit"
            onClick={() => onOpenDeposit()}
            className="btn btn-primary"
            style={{ marginTop: 18, width: '100%', padding: '10px' }}
          >
            <PlusCircle size={16} /> Nạp Tiền Vào Ví
          </button>
        </div>

        {/* Total Deposited */}
        <div className="glass-panel" style={{ padding: 20, borderRadius: 14, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tổng Tiền Đã Nạp</span>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
              <ArrowDownLeft size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-green)' }}>
            +{totalDeposited.toLocaleString('vi-VN')} đ
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
            Qua VietQR Auto / Thẻ ATM
          </span>
        </div>

        {/* Total Spent */}
        <div className="glass-panel" style={{ padding: 20, borderRadius: 14, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tổng Chi Thuê Acc</span>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--accent-red-bg)', color: 'var(--accent-red)' }}>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-red)' }}>
            -{totalSpent.toLocaleString('vi-VN')} đ
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
            Khấu trừ theo giờ thuê tài khoản
          </span>
        </div>

        {/* Total Refunded */}
        <div className="glass-panel" style={{ padding: 20, borderRadius: 14, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Được Hoàn Trả</span>
            <div style={{ padding: 6, borderRadius: 6, background: 'var(--accent-amber-bg)', color: 'var(--accent-amber)' }}>
              <RefreshCcw size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
            +{totalRefunded.toLocaleString('vi-VN')} đ
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
            Tiền bồi hoàn từ khiếu nại sự cố
          </span>
        </div>
      </div>

      {/* ================= TRANSACTIONS TABLE ================= */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Biến Động Số Dư & Lịch Sử Giao Dịch</h2>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'deposit', label: 'Nạp tiền' },
              { id: 'rental_fee', label: 'Thuê acc' },
              { id: 'refund', label: 'Hoàn tiền' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                id={`btn-filter-tx-${tab.id}`}
                onClick={() => setFilterType(tab.id)}
                className={`btn ${filterType === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ borderRadius: 12, overflowX: 'auto', background: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Mã GD</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Thời Gian</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Nội Dung / Ghi Chú</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Phương Thức</th>
                <th style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 600 }}>Số Tiền</th>
                <th style={{ padding: '12px 18px', textAlign: 'center', fontWeight: 600 }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isPositive = tx.amount > 0;
                const dateStr = new Date(tx.timestamp).toLocaleString('vi-VN');

                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 18px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>
                      #{tx.id}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-muted)' }}>
                      {dateStr}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 500, color: 'var(--text-main)' }}>
                      {tx.note}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-muted)' }}>
                      {tx.paymentMethod}
                    </td>
                    <td
                      style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)'
                      }}
                    >
                      {isPositive ? `+${tx.amount.toLocaleString('vi-VN')}` : tx.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                      <span className="badge badge-available">
                        Thành công
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
