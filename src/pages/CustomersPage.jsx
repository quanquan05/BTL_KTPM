import React, { useState } from 'react';
import { Users, Search, Shield, UserCheck, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomersPage = () => {
  const { users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const customerList = [
    {
      id: 'KH001',
      name: 'Nguyễn Văn Admin',
      phone: '0987654321',
      email: 'admin_kh01@gmail.com',
      totalOrders: 14,
      totalSpent: 245000,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'
    },
    {
      id: 'KH002',
      name: 'Nguyễn Văn Hùng',
      phone: '0912345678',
      email: 'hung.nguyen@gmail.com',
      totalOrders: 8,
      totalSpent: 120000,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80'
    },
    {
      id: 'KH003',
      name: 'Trần Phú Gia',
      phone: '0978112233',
      email: 'gia.tran@hotmail.com',
      totalOrders: 19,
      totalSpent: 380000,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'
    },
    {
      id: 'KH004',
      name: 'Phạm Tuấn Minh',
      phone: '0933445566',
      email: 'minh.tuan@yahoo.com',
      totalOrders: 5,
      totalSpent: 75000,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80'
    }
  ];

  const filtered = customerList.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={22} color="#10B981" />
            <span>Quản Lý Khách Hàng</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4 }}>
            Theo dõi danh sách người dùng thuê tài khoản trên hệ thống GameRent
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '6px 14px' }}>
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '0.82rem', outline: 'none' }}
          />
        </div>
      </div>

      <div className="rental-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="rental-table">
            <thead>
              <tr>
                <th>MÃ KH</th>
                <th>KHÁCH HÀNG</th>
                <th>LIÊN HỆ</th>
                <th>SỐ ĐƠN THUÊ</th>
                <th>TỔNG CHI TIÊU</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>
                    #{c.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={c.avatar} alt={c.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{c.name}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={12} color="#94A3B8" /> {c.phone}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={12} color="#94A3B8" /> {c.email}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.totalOrders} đơn</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{c.totalSpent.toLocaleString('vi-VN')} đ</td>
                  <td>
                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 12, fontSize: '0.74rem', fontWeight: 700 }}>
                      Hoạt động
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
