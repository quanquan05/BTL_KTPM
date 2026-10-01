import { describe, it, expect } from 'vitest';
import { calculateRentalCost } from '../../utils/validation';

describe('4. Module Thuê Tài Khoản & Bảng Quyết Định (F_RENT_CALC - Unit Test Cases)', () => {
  const mockAccount = {
    id: 'ACCVAL001',
    title: 'Nick Valorant Prime Vandal',
    pricePerHour: 15000,
    status: 'available'
  };

  it('[UTCID01] BVA Thời gian thuê biên dưới (1 giờ) & Đủ tiền ví', () => {
    const res = calculateRentalCost(mockAccount, 1, 100000);
    expect(res.isValid).toBe(true);
    expect(res.totalCost).toBe(15000);
    expect(res.remainingBalance).toBe(85000);
    expect(res.canRent).toBe(true);
  });

  it('[UTCID02] BVA Thời gian thuê dưới biên min (0 giờ)', () => {
    const res = calculateRentalCost(mockAccount, 0, 100000);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('tối thiểu là 1 giờ');
  });

  it('[UTCID03] BVA Thời gian thuê biên trên (48 giờ) & Đủ tiền ví', () => {
    const res = calculateRentalCost(mockAccount, 48, 1000000);
    expect(res.isValid).toBe(true);
    expect(res.totalCost).toBe(15000 * 48); // 720.000đ
    expect(res.remainingBalance).toBe(1000000 - 720000);
    expect(res.canRent).toBe(true);
  });

  it('[UTCID04] BVA Thời gian thuê vượt biên trên (49 giờ)', () => {
    const res = calculateRentalCost(mockAccount, 49, 1000000);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('tối đa là 48 giờ');
  });

  it('[UTCID05] Decision Table: Số dư ví > Chi phí thuê (50k vs 30k)', () => {
    const res = calculateRentalCost(mockAccount, 2, 50000);
    expect(res.isValid).toBe(true);
    expect(res.totalCost).toBe(30000);
    expect(res.remainingBalance).toBe(20000);
    expect(res.canRent).toBe(true);
  });

  it('[UTCID06] Decision Table: Số dư ví == Chi phí thuê (30k vs 30k)', () => {
    const res = calculateRentalCost(mockAccount, 2, 30000);
    expect(res.isValid).toBe(true);
    expect(res.totalCost).toBe(30000);
    expect(res.remainingBalance).toBe(0);
    expect(res.canRent).toBe(true);
  });

  it('[UTCID07] Decision Table: Số dư ví < Chi phí thuê (20k vs 30k -> Thiếu 10k)', () => {
    const res = calculateRentalCost(mockAccount, 2, 20000);
    expect(res.isValid).toBe(false);
    expect(res.canRent).toBe(false);
    expect(res.missingAmount).toBe(10000);
    expect(res.error).toContain('Số dư ví không đủ');
  });

  it('[UTCID08] Decision Table: Số dư ví = 0đ (Thiếu toàn bộ 30k)', () => {
    const res = calculateRentalCost(mockAccount, 2, 0);
    expect(res.isValid).toBe(false);
    expect(res.canRent).toBe(false);
    expect(res.missingAmount).toBe(30000);
  });

  it('[UTCID09] Decision Table: Tài khoản có status = rented (Đang có người thuê)', () => {
    const rentedAcc = { ...mockAccount, status: 'rented' };
    const res = calculateRentalCost(rentedAcc, 2, 100000);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('hiện đang có người thuê');
  });

  it('[UTCID10] Decision Table: Tài khoản có status = maintenance (Bảo trì)', () => {
    const maintAcc = { ...mockAccount, status: 'maintenance' };
    const res = calculateRentalCost(maintAcc, 2, 100000);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('bảo trì');
  });

  it('[UTCID11] Phân loại đơn thuê theo tựa game (Liên Quân, Valorant, Genshin)', () => {
    const mockRentals = [
      { id: 'RENT-001', gameId: 'genshin', accountTitle: 'Acc Genshin AR 60' },
      { id: 'RENT-002', gameId: 'lien-quan', accountTitle: 'Acc Cao Thủ Liên Quân' },
      { id: 'RENT-003', gameId: 'valorant', accountTitle: 'Acc Valorant Immortal' }
    ];

    const lqRentals = mockRentals.filter(r => r.gameId === 'lien-quan');
    expect(lqRentals).toHaveLength(1);
    expect(lqRentals[0].id).toBe('RENT-002');
  });

  it('[UTCID12] Tìm kiếm nhanh đơn thuê theo mã đơn, tài khoản, khách hàng', () => {
    const mockRentals = [
      { id: 'ORDER-GENSHIN-315926', secretAccount: 'genshin_ar60', customerName: 'Đăng', gameName: 'Genshin Impact' },
      { id: 'RENT-002', secretAccount: 'lq_caothu', customerName: 'Phạm Tuấn Minh', gameName: 'Liên Quân Mobile' }
    ];

    const query = '315926';
    const found = mockRentals.filter(r => 
      r.id.toLowerCase().includes(query) || 
      r.secretAccount.toLowerCase().includes(query) || 
      r.customerName.toLowerCase().includes(query)
    );
    expect(found).toHaveLength(1);
    expect(found[0].id).toBe('ORDER-GENSHIN-315926');
  });

  it('[UTCID13] Tìm kiếm đơn thuê theo tên khách hàng (có dấu và không dấu)', () => {
    const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const mockRentals = [
      { id: 'RENT-001', customerName: 'Vũ Thành Long' },
      { id: 'RENT-002', customerName: 'Phạm Tuấn Minh' },
      { id: 'RENT-003', customerName: 'Đăng' }
    ];

    // Tìm kiếm không dấu "dang"
    const q1 = normalize('dang');
    const found1 = mockRentals.filter(r => normalize(r.customerName).includes(q1));
    expect(found1).toHaveLength(1);
    expect(found1[0].customerName).toBe('Đăng');

    // Tìm kiếm có dấu "Minh"
    const q2 = normalize('Minh');
    const found2 = mockRentals.filter(r => normalize(r.customerName).includes(q2));
    expect(found2).toHaveLength(1);
    expect(found2[0].id).toBe('RENT-002');
  });

  it('[UTCID14] Tìm kiếm đơn thuê theo tên game (Liên Quân, Genshin, Valorant)', () => {
    const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const mockRentals = [
      { id: 'RENT-001', gameName: 'Genshin Impact' },
      { id: 'RENT-002', gameName: 'Liên Quân Mobile' },
      { id: 'RENT-003', gameName: 'Valorant' }
    ];

    // Tìm kiếm "lien quan" không dấu
    const q1 = normalize('lien quan');
    const found1 = mockRentals.filter(r => normalize(r.gameName).includes(q1));
    expect(found1).toHaveLength(1);
    expect(found1[0].id).toBe('RENT-002');

    // Tìm kiếm "Genshin"
    const q2 = normalize('Genshin');
    const found2 = mockRentals.filter(r => normalize(r.gameName).includes(q2));
    expect(found2).toHaveLength(1);
    expect(found2[0].id).toBe('RENT-001');
  });
});

