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
    <div className="container" style={{ padding: '20px 20px 60px 20px' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Ví Điện Tử Của Tôi
        </h1>
        <p style={{ color: 'var(--text-subtle)', fontSize: '0.84rem' }}>
          Xem số dư khả dụng, lịch sử nạp tiền và các khoản thanh toán ca thuê.
        </p>
      </div>

      {/* ================= DIGITAL WALLET SUMMARY ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 12,
          marginBottom: 20
        }}
      >
        {/* Main Digital Card */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
            border: '1px solid #FFEDD5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Số Dư Khả Dụng
              </span>
              <Wallet size={16} color="var(--primary)" />
            </div>
            <div id="wallet-balance-big-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
              {currentUser?.balance?.toLocaleString('vi-VN')} đ
            </div>
          </div>

          <button
            type="button"
            id="btn-wallet-page-deposit"
            data-testid="btn-wallet-page-deposit"
            onClick={() => onOpenDeposit()}
            className="btn btn-primary"
            style={{ marginTop: 12, width: '100%', padding: '8px 12px', fontSize: '0.84rem' }}
          >
            <PlusCircle size={15} /> Nạp Tiền Vào Ví
          </button>
        </div>

        {/* Total Deposited */}
        <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Tiền Đã Nạp</span>
            <div style={{ padding: '4px 6px', borderRadius: 6, background: 'var(--accent-green-bg)', color: 'var(--accent-green-text)' }}>
              <ArrowDownLeft size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-green-text)' }}>
            +{totalDeposited.toLocaleString('vi-VN')} đ
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 2, display: 'block' }}>
            VietQR tự động & thẻ cào
          </span>
        </div>

        {/* Total Spent */}
        <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chi Phí Đã Thuê</span>
            <div style={{ padding: '4px 6px', borderRadius: 6, background: 'var(--accent-red-bg)', color: 'var(--accent-red-text)' }}>
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
            -{totalSpent.toLocaleString('vi-VN')} đ
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 2, display: 'block' }}>
            Phí thuê & gia hạn giờ
          </span>
        </div>

        {/* Total Refunded */}
        <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bồi Hoàn Khiếu Nại</span>
            <div style={{ padding: '4px 6px', borderRadius: 6, background: 'var(--accent-blue-bg)', color: 'var(--accent-blue-text)' }}>
              <RefreshCcw size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-blue-text)' }}>
            +{totalRefunded.toLocaleString('vi-VN')} đ
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 2, display: 'block' }}>
            Bảo hiểm hoàn tiền 100%
          </span>
        </div>
      </div>

      {/* ================= TRANSACTION HISTORY ================= */}
      <div className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', background: '#FFFFFF' }}>
        {/* Table Filter Toolbar */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Lịch Sử Biến Động Số Dư ({filteredTransactions.length})
          </h3>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'deposit', label: 'Nạp tiền' },
              { id: 'rental_fee', label: 'Tiền thuê' },
              { id: 'refund', label: 'Hoàn tiền' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`quick-chip ${filterType === f.id ? 'active' : ''}`}
                style={{ padding: '3px 8px', fontSize: '0.76rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Không có giao dịch nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Mã GD</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Thời Gian</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Loại GD</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Mô Tả</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>Số Tiền</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>Số Dư Sau</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-subtle)', fontWeight: 600 }}>
                        {tx.id}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(tx.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {tx.type === 'deposit' ? (
                          <span className="badge badge-available">Nạp tiền</span>
                        ) : tx.type === 'rental_fee' ? (
                          <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>Thuê acc</span>
                        ) : (
                          <span className="badge" style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue-text)' }}>Hoàn tiền</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-main)', fontWeight: 500 }}>
                        {tx.description}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: isPositive ? 'var(--accent-green-text)' : 'var(--accent-red-text)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isPositive ? `+${tx.amount.toLocaleString('vi-VN')}` : tx.amount.toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-main)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {tx.balanceAfter?.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
