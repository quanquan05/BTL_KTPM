import { describe, it, expect } from 'vitest';
import { validateDepositAmount } from '../../utils/validation';

describe('3. Module Nạp tiền Ví điện tử (F_WAL_DEP - BVA & EP Unit Test Cases)', () => {
  it('[UTCID01] BVA Ngay dưới biên tối thiểu (9.999 VNĐ)', () => {
    const res = validateDepositAmount(9999);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('tối thiểu là 10.000 VNĐ');
  });

  it('[UTCID02] BVA Tại biên tối thiểu hợp lệ (10.000 VNĐ)', () => {
    const res = validateDepositAmount(10000);
    expect(res.isValid).toBe(true);
    expect(res.amount).toBe(10000);
    expect(res.error).toBeNull();
  });

  it('[UTCID03] BVA Ngay trên biên tối thiểu (11.000 VNĐ)', () => {
    const res = validateDepositAmount(11000);
    expect(res.isValid).toBe(true);
    expect(res.amount).toBe(11000);
  });

  it('[UTCID04] EP Mệnh giá chọn nhanh hợp lệ trong khoảng (200.000 VNĐ)', () => {
    const res = validateDepositAmount(200000);
    expect(res.isValid).toBe(true);
    expect(res.amount).toBe(200000);
  });

  it('[UTCID05] EP Mệnh giá lớn thông dụng (1.000.000 VNĐ)', () => {
    const res = validateDepositAmount(1000000);
    expect(res.isValid).toBe(true);
    expect(res.amount).toBe(1000000);
  });

  it('[UTCID06] BVA Ngay dưới biên tối đa (4.999.000 VNĐ)', () => {
    const res = validateDepositAmount(4999000);
    expect(res.isValid).toBe(true);
    expect(res.amount).toBe(4999000);
  });

  it('[UTCID07] BVA Tại biên tối đa hợp lệ (5.000.000 VNĐ)', () => {
    const res = validateDepositAmount(5000000);
    expect(res.isValid).toBe(true);
    expect(res.amount).toBe(5000000);
  });

  it('[UTCID08] BVA Vượt quá biên tối đa (5.001.000 VNĐ)', () => {
    const res = validateDepositAmount(5001000);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('tối đa là 5.000.000 VNĐ');
  });

  it('[UTCID09] EP Báo lỗi khi nạp số tiền âm (-50.000 VNĐ)', () => {
    const res = validateDepositAmount(-50000);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('số nguyên dương');
  });

  it('[UTCID10] EP Báo lỗi khi nhập ký tự chữ hoặc ký tự đặc biệt ("abc@123")', () => {
    const res = validateDepositAmount('abc@123');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('số tiền hợp lệ');
  });
});
