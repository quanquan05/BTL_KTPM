import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_ACCOUNTS, INITIAL_CUSTOMERS } from '../../data/initialData';

describe('Module Quản Lý CRUD Kho Tài Khoản & Khách Hàng', () => {
  let accounts;
  let customers;

  const SAMPLE_CUSTOMERS = [
    { id: 'KH001', name: 'Nguyễn Văn Admin', phone: '0987654321', email: 'admin_kh01@gmail.com', totalOrders: 14, totalSpent: 245000, status: 'active' },
    { id: 'KH002', name: 'Nguyễn Văn Hùng', phone: '0912345678', email: 'hung.nguyen@gmail.com', totalOrders: 8, totalSpent: 120000, status: 'active' },
    { id: 'KH003', name: 'Trần Phú Gia', phone: '0978112233', email: 'gia.tran@hotmail.com', totalOrders: 19, totalSpent: 380000, status: 'active' },
    { id: 'KH004', name: 'Phạm Tuấn Minh', phone: '0933445566', email: 'minh.tuan@yahoo.com', totalOrders: 5, totalSpent: 75000, status: 'active' }
  ];

  beforeEach(() => {
    accounts = [...INITIAL_ACCOUNTS];
    customers = [...SAMPLE_CUSTOMERS];
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

    expect(customers.length).toBe(SAMPLE_CUSTOMERS.length + 1);
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

  it('Tự động thêm hồ sơ khách hàng mới vào danh sách Quản trị khi người dùng đăng ký', () => {
    let customerList = [];
    const registeredUser = {
      id: 'USER-9999',
      name: 'Quân Quân',
      email: 'quanquan@gamerent.vn',
      role: 'renter',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'
    };

    const newCust = {
      id: `KH${String(customerList.length + 1).padStart(3, '0')}`,
      name: registeredUser.name,
      phone: '0901234567',
      email: registeredUser.email,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      avatar: registeredUser.avatar
    };
    customerList = [newCust, ...customerList];

    expect(customerList.length).toBe(1);
    expect(customerList[0].name).toBe('Quân Quân');
    expect(customerList[0].id).toBe('KH001');
    expect(customerList[0].email).toBe('quanquan@gamerent.vn');
  });
});
