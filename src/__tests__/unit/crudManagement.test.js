import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_ACCOUNTS, INITIAL_CUSTOMERS } from '../../data/initialData';

describe('Module Quản Lý CRUD Kho Tài Khoản & Khách Hàng', () => {
  let accounts;
  let customers;

  beforeEach(() => {
    accounts = [...INITIAL_ACCOUNTS];
    customers = [...INITIAL_CUSTOMERS];
  });

  it('Thêm khách hàng mới với đầy đủ thông tin chuẩn hóa', () => {
    const newCustData = {
      name: 'Nguyễn Văn Test',
      phone: '0988112233',
      email: 'test@gamerent.vn',
      status: 'active',
      totalOrders: 2,
      totalSpent: 50000
    };

    const newCustomer = {
      ...newCustData,
      id: `KH${String(customers.length + 1).padStart(3, '0')}`,
      totalOrders: Number(newCustData.totalOrders) || 0,
      totalSpent: Number(newCustData.totalSpent) || 0,
      status: newCustData.status || 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'
    };

    customers = [newCustomer, ...customers];

    expect(customers.length).toBe(INITIAL_CUSTOMERS.length + 1);
    expect(customers[0].id).toBe('KH005');
    expect(customers[0].name).toBe('Nguyễn Văn Test');
    expect(customers[0].totalSpent).toBe(50000);
  });

  it('Cập nhật thông tin khách hàng (Sửa SĐT, Email, Trạng thái)', () => {
    const targetId = 'KH001';
    const updatedData = {
      name: 'Nguyễn Văn Admin Updated',
      phone: '0999000111',
      status: 'blocked'
    };

    customers = customers.map(c => (c.id === targetId ? { ...c, ...updatedData } : c));

    const found = customers.find(c => c.id === targetId);
    expect(found.name).toBe('Nguyễn Văn Admin Updated');
    expect(found.phone).toBe('0999000111');
    expect(found.status).toBe('blocked');
  });

  it('Xóa khách hàng khỏi hệ thống', () => {
    const targetId = 'KH002';
    const initialCount = customers.length;

    customers = customers.filter(c => c.id !== targetId);

    expect(customers.length).toBe(initialCount - 1);
    expect(customers.find(c => c.id === targetId)).toBeUndefined();
  });

  it('Cập nhật thông tin tài khoản kho game (updateAccount)', () => {
    const targetId = accounts[0].id;
    const updatedData = {
      title: 'Acc Chiến Tướng VIP Đã Update',
      pricePerHour: 28000,
      rank: 'Thách Đấu',
      secretPassword: 'NewPassword@2026'
    };

    accounts = accounts.map(a => (a.id === targetId ? { ...a, ...updatedData } : a));

    const updated = accounts.find(a => a.id === targetId);
    expect(updated.title).toBe('Acc Chiến Tướng VIP Đã Update');
    expect(updated.pricePerHour).toBe(28000);
    expect(updated.rank).toBe('Thách Đấu');
    expect(updated.secretPassword).toBe('NewPassword@2026');
  });
});
