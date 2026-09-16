import { describe, it, expect } from 'vitest';
import { calculateRefundAndExtension } from '../../utils/validation';

describe('6. Module Hoàn Tiền & Gia Hạn (F_REF_EXT - Unit Test Cases)', () => {
  const now = Date.now();

  it('[UTCID01] Trả nick sớm: Còn 2 giờ thừa (30k/h) -> Hoàn 50% = 30.000 đ', () => {
    const order = {
      id: 'ORDER-01',
      pricePerHour: 30000,
      totalPrice: 60000,
      expiresAt: now + (2.5 * 60 * 60 * 1000) // Còn 2.5 giờ (floor = 2h)
    };
    const res = calculateRefundAndExtension(order, 'return_early');
    expect(res.success).toBe(true);
    expect(res.remainingHours).toBe(2);
    expect(res.refundAmount).toBe(30000); // 2h * 30k * 50% = 30k
    expect(res.newOrderStatus).toBe('completed');
    expect(res.accountStatus).toBe('need_change_pass');
  });

  it('[UTCID02] Trả nick sớm khi đã hết giờ chơi (0h thừa) -> Hoàn 0đ', () => {
    const order = {
      id: 'ORDER-02',
      pricePerHour: 20000,
      totalPrice: 40000,
      expiresAt: now - 1000 // Đã hết hạn
    };
    const res = calculateRefundAndExtension(order, 'return_early');
    expect(res.success).toBe(true);
    expect(res.remainingHours).toBe(0);
    expect(res.refundAmount).toBe(0);
  });

  it('[UTCID03] Khiếu nại bảo hiểm sự cố được Admin duyệt -> Hoàn 100% (30.000 đ)', () => {
    const order = {
      id: 'ORDER-03',
      totalPrice: 30000,
      expiresAt: now + (1 * 60 * 60 * 1000)
    };
    const res = calculateRefundAndExtension(order, 'dispute_approved');
    expect(res.success).toBe(true);
    expect(res.refundAmount).toBe(30000);
    expect(res.disputeStatus).toBe('resolved');
    expect(res.accountStatus).toBe('maintenance');
  });

  it('[UTCID04] Khiếu nại bảo hiểm sự cố tài khoản 50k -> Hoàn 100% (50.000 đ)', () => {
    const order = {
      id: 'ORDER-04',
      totalPrice: 50000
    };
    const res = calculateRefundAndExtension(order, 'dispute_approved');
    expect(res.success).toBe(true);
    expect(res.refundAmount).toBe(50000);
    expect(res.disputeStatus).toBe('resolved');
  });

  it('[UTCID05] Gia hạn thêm 1 giờ khi đơn còn hạn -> Nối tiếp 3.600s', () => {
    const futureTime = now + (30 * 60 * 1000); // Còn 30 phút
    const order = {
      id: 'ORDER-05',
      pricePerHour: 15000,
      expiresAt: futureTime
    };
    const res = calculateRefundAndExtension(order, 'extend', 1);
    expect(res.success).toBe(true);
    expect(res.extendCost).toBe(15000);
    expect(res.newExpiresAt).toBe(futureTime + (1 * 60 * 60 * 1000));
  });

  it('[UTCID06] Gia hạn thêm 24 giờ -> Tính đúng chi phí 360.000 đ', () => {
    const futureTime = now + (1 * 60 * 60 * 1000);
    const order = {
      id: 'ORDER-06',
      pricePerHour: 15000,
      expiresAt: futureTime
    };
    const res = calculateRefundAndExtension(order, 'extend', 24);
    expect(res.success).toBe(true);
    expect(res.extendCost).toBe(15000 * 24); // 360.000đ
    expect(res.newExpiresAt).toBe(futureTime + (24 * 60 * 60 * 1000));
  });

  it('[UTCID07] Gia hạn khi đơn đã quá hạn -> Tính mốc mới từ Date.now()', () => {
    const pastTime = now - (10 * 60 * 1000); // Quá hạn 10 phút
    const order = {
      id: 'ORDER-07',
      pricePerHour: 20000,
      expiresAt: pastTime
    };
    const res = calculateRefundAndExtension(order, 'extend', 2);
    expect(res.success).toBe(true);
    expect(res.extendCost).toBe(40000);
    expect(res.newExpiresAt).toBeGreaterThanOrEqual(now + (2 * 60 * 60 * 1000) - 100);
  });

  it('[UTCID08] Gia hạn với số giờ không hợp lệ (<= 0 giờ)', () => {
    const order = {
      id: 'ORDER-08',
      pricePerHour: 15000,
      expiresAt: now + 3600000
    };
    const res = calculateRefundAndExtension(order, 'extend', 0);
    expect(res.success).toBe(false);
    expect(res.error).toContain('phải lớn hơn 0');
  });
});
