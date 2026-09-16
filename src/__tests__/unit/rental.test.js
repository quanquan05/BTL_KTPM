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
});
