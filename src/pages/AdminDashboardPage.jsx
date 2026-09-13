import React, { useState } from 'react';
import { Gamepad2, AlertTriangle, ShieldCheck, Plus, Check, X, Trash2, DollarSign, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage = () => {
  const {
    accounts,
    categories,
    rentals,
    disputes,
    transactions,
    addAccount,
    toggleAccountStatus,
    deleteAccount,
    resolveDispute
  } = useApp();

  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'disputes' | 'orders'
  const [isAddingAcc, setIsAddingAcc] = useState(false);

  // Form state thêm tài khoản
  const [newGameId, setNewGameId] = useState('lien-quan');
  const [newTitle, setNewTitle] = useState('');
  const [newRank, setNewRank] = useState('');
  const [newPrice, setNewPrice] = useState(15000);
  const [newSkinsCount, setNewSkinsCount] = useState(50);
  const [newSkinsList, setNewSkinsList] = useState('');
  const [newSecretAccount, setNewSecretAccount] = useState('');
  const [newSecretPassword, setNewSecretPassword] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Tính toán số liệu thống kê
  const totalRevenue = transactions
    .filter(t => t.type === 'rental_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const activeRentalsCount = rentals.filter(r => r.status === 'active').length;
  const pendingDisputesCount = disputes.filter(d => d.status === 'pending').length;

  const handleAddAccountSubmit = (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!newTitle || !newSecretAccount || !newSecretPassword) {
      setAddError('Vui lòng điền đầy đủ tiêu đề, tài khoản và mật khẩu.');
      return;
    }

    const skinsArr = newSkinsList.split(',').map(s => s.trim()).filter(Boolean);

    const res = addAccount({
      gameId: newGameId,
      title: newTitle,
      rank: newRank || 'Chưa xếp hạng',
      server: 'Việt Nam',
      skinsCount: Number(newSkinsCount) || 0,
      highlightSkins: skinsArr.length > 0 ? skinsArr : ['Skin mặc định'],
      pricePerHour: Number(newPrice) || 10000,
      secretAccount: newSecretAccount,
      secretPassword: newSecretPassword,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      winRate: '60.0%',
      description: 'Tài khoản mới thêm bởi Quản trị viên hệ thống.'
    });

    if (res.success) {
      setAddSuccess('Thêm tài khoản mới thành công!');
      setTimeout(() => {
        setIsAddingAcc(false);
        setAddSuccess('');
        setNewTitle('');
        setNewSecretAccount('');
        setNewSecretPassword('');
        setNewSkinsList('');
      }, 1000);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px 70px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>
            <ShieldCheck size={14} /> BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Admin Portal</h1>
        </div>

        <button
          type="button"
          id="btn-admin-add-account"
          data-testid="btn-admin-add-account"
          onClick={() => setIsAddingAcc(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> + Thêm Tài Khoản Mới
        </button>
      </div>

      {/* ================= THỐNG KÊ METRICS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}
      >
        <div className="glass-panel" style={{ padding: 18, borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.82rem' }}>Doanh Thu Thuê Acc</span>
            <DollarSign size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.82rem' }}>Acc Đang Thuê</span>
            <Clock size={18} color="var(--accent-green)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-green)' }}>
            {activeRentalsCount} tài khoản
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.82rem' }}>Tổng Acc Trong Kho</span>
            <Gamepad2 size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {accounts.length} acc
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 12, background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.82rem' }}>Khiếu Nại Chờ Xử Lý</span>
            <AlertTriangle size={18} color={pendingDisputesCount > 0 ? '#DC2626' : 'var(--accent-green)'} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: pendingDisputesCount > 0 ? '#DC2626' : 'var(--accent-green)' }}>
            {pendingDisputesCount} đơn
          </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 22 }}>
        <button
          type="button"
          id="tab-admin-accounts"
          onClick={() => setActiveTab('accounts')}
          className={`btn ${activeTab === 'accounts' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '7px 16px', fontSize: '0.86rem' }}
        >
          Quản Lý Kho Acc ({accounts.length})
        </button>

        <button
          type="button"
          id="tab-admin-disputes"
          onClick={() => setActiveTab('disputes')}
          className={`btn ${activeTab === 'disputes' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '7px 16px', fontSize: '0.86rem', position: 'relative' }}
        >
          Xử Lý Khiếu Nại
          {pendingDisputesCount > 0 && (
            <span style={{ background: 'var(--accent-red)', color: '#fff', fontSize: '0.68rem', padding: '1px 6px', borderRadius: 6, marginLeft: 6 }}>
              {pendingDisputesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          id="tab-admin-orders"
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '7px 16px', fontSize: '0.86rem' }}
        >
          Giám Sát Đơn Thuê ({rentals.length})
        </button>
      </div>

      {/* ================= TAB 1: QUẢN LÝ KHO ACC ================= */}
      {activeTab === 'accounts' && (
        <div>
          <div className="glass-panel" style={{ borderRadius: 12, overflowX: 'auto', background: '#FFFFFF' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Mã Acc</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tựa Game</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tiêu Đề / Rank</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Giá Thuê/h</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tài Khoản / Mật Khẩu</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Trạng Thái</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>
                      #{acc.id}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      {categories.find(c => c.id === acc.gameId)?.name || acc.gameId}
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: 220 }}>
                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {acc.title}
                      </div>
                      <span className="badge badge-rank" style={{ marginTop: 4 }}>{acc.rank}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                      {acc.pricePerHour.toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <div>User: {acc.secretAccount}</div>
                      <div>Pass: {acc.secretPassword}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        id={`select-status-${acc.id}`}
                        data-testid={`select-status-${acc.id}`}
                        className="form-select"
                        value={acc.status}
                        onChange={(e) => toggleAccountStatus(acc.id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        <option value="available">Sẵn sàng</option>
                        <option value="rented">Đang thuê</option>
                        <option value="maintenance">Bảo trì</option>
                        <option value="need_change_pass">Cần đổi pass</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        type="button"
                        id={`btn-delete-acc-${acc.id}`}
                        data-testid={`btn-delete-acc-${acc.id}`}
                        onClick={() => {
                          if (window.confirm(`Xóa tài khoản ${acc.title}?`)) {
                            deleteAccount(acc.id);
                          }
                        }}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                      >
                        <Trash2 size={13} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: XỬ LÝ KHIẾU NẠI ================= */}
      {activeTab === 'disputes' && (
        <div>
          {disputes.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '44px 20px', borderRadius: 12, background: '#FFFFFF' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🎉</div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Không có khiếu nại nào cần xử lý</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Tất cả các phiên thuê đều diễn ra suôn sẻ!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {disputes.map((disp) => (
                <div
                  key={disp.id}
                  id={`dispute-card-${disp.id}`}
                  data-testid={`dispute-card-${disp.id}`}
                  className="glass-panel"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 12,
                    padding: 18,
                    border: disp.status === 'pending' ? '1px solid var(--accent-red-border)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 600 }}>
                        Mã Khiếu Nại: #{disp.id} | Đơn Thuê: #{disp.orderId}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                        Lý do: {disp.reason}
                      </h4>
                    </div>

                    <div>
                      {disp.status === 'pending' ? (
                        <span className="badge badge-rented">Chờ giải quyết</span>
                      ) : disp.status === 'resolved' ? (
                        <span className="badge badge-available">Đã hoàn tiền</span>
                      ) : (
                        <span className="badge badge-maintenance">Đã từ chối</span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 8, fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                    <strong>Nội dung phản ánh từ khách:</strong> {disp.note}
                    <div style={{ marginTop: 4, fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      Số tiền yêu cầu hoàn: <strong style={{ color: 'var(--primary)' }}>{disp.amount?.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  </div>

                  {disp.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        id={`btn-reject-dispute-${disp.id}`}
                        data-testid={`btn-reject-dispute-${disp.id}`}
                        onClick={() => resolveDispute(disp.id, 'reject')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                      >
                        <X size={14} /> Bác Bỏ Khiếu Nại
                      </button>

                      <button
                        type="button"
                        id={`btn-refund-dispute-${disp.id}`}
                        data-testid={`btn-refund-dispute-${disp.id}`}
                        onClick={() => resolveDispute(disp.id, 'refund')}
                        className="btn btn-success"
                        style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                      >
                        <Check size={14} /> Chấp Nhận & Hoàn Tiền 100%
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: GIÁM SÁT ĐƠN THUÊ ================= */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ borderRadius: 12, overflowX: 'auto', background: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Mã Đơn</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tài Khoản Game</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Người Thuê</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Thời Lượng</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tổng Tiền</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>#{r.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.accountTitle}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{r.userId}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{r.durationHours} giờ</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>{r.totalPrice.toLocaleString('vi-VN')} đ</td>
                  <td style={{ padding: '12px 16px' }}>
                    {r.status === 'active' ? (
                      <span className="badge badge-rented">Đang chơi</span>
                    ) : r.status === 'completed' ? (
                      <span className="badge badge-available">Đã trả</span>
                    ) : (
                      <span className="badge badge-maintenance">Khiếu nại</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL THÊM MỚI TÀI KHOẢN ================= */}
      {isAddingAcc && (
        <div className="modal-overlay" id="modal-add-account-overlay" data-testid="modal-add-account">
          <div className="modal-card" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Thêm Tài Khoản Mới Vào Kho</h3>
              <button onClick={() => setIsAddingAcc(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAccountSubmit}>
              <div className="modal-body">
                {addError && <div className="form-error" style={{ marginBottom: 12 }}>{addError}</div>}
                {addSuccess && <div style={{ color: 'var(--accent-green)', marginBottom: 12, fontSize: '0.88rem' }}>{addSuccess}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Tựa Game</label>
                    <select
                      id="input-new-game-id"
                      data-testid="input-new-game-id"
                      className="form-select"
                      value={newGameId}
                      onChange={(e) => setNewGameId(e.target.value)}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mức Rank</label>
                    <input
                      type="text"
                      id="input-new-rank"
                      data-testid="input-new-rank"
                      className="form-input"
                      placeholder="VD: Cao Thủ, Radiant, AR 60..."
                      value={newRank}
                      onChange={(e) => setNewRank(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tiêu Đề Tài Khoản</label>
                  <input
                    type="text"
                    id="input-new-title"
                    data-testid="input-new-title"
                    className="form-input"
                    placeholder="VD: Acc Full Tướng Full Skin Florentino Tinh Hệ"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Giá Thuê / Giờ (VNĐ)</label>
                    <input
                      type="number"
                      id="input-new-price"
                      data-testid="input-new-price"
                      className="form-input"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số Lượng Skin</label>
                    <input
                      type="number"
                      id="input-new-skins-count"
                      data-testid="input-new-skins-count"
                      className="form-input"
                      value={newSkinsCount}
                      onChange={(e) => setNewSkinsCount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Danh Sách Skin Nổi Bật (cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    id="input-new-skins-list"
                    data-testid="input-new-skins-list"
                    className="form-input"
                    placeholder="Kuronami Vandal, Reaver Karambit, Prime Phantom..."
                    value={newSkinsList}
                    onChange={(e) => setNewSkinsList(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Tài Khoản Đăng Nhập Game</label>
                    <input
                      type="text"
                      id="input-new-secret-account"
                      data-testid="input-new-secret-account"
                      className="form-input"
                      placeholder="account_login"
                      value={newSecretAccount}
                      onChange={(e) => setNewSecretAccount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mật Khẩu Đăng Nhập Game</label>
                    <input
                      type="text"
                      id="input-new-secret-password"
                      data-testid="input-new-secret-password"
                      className="form-input"
                      placeholder="password@123"
                      value={newSecretPassword}
                      onChange={(e) => setNewSecretPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddingAcc(false)}>
                  Hủy
                </button>
                <button type="submit" id="btn-submit-new-account" data-testid="btn-submit-new-account" className="btn btn-primary">
                  <Plus size={15} /> Lưu & Đưa Lên Sàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
