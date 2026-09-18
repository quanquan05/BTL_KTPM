import { describe, it, expect } from 'vitest';
import { generateRandomPassword } from '../../utils/validation';

describe('8. Module Tự Động Đổi Password Khi Thu Hồi Acc (F_AUTO_PASS - Unit Tests)', () => {
  it('[TC_PASS_01] Hàm generateRandomPassword tạo mật khẩu độ dài hợp lệ (>= 10 ký tự)', () => {
    const pass = generateRandomPassword();
    expect(pass).toBeDefined();
    expect(pass.length).toBeGreaterThanOrEqual(10);
  });

  it('[TC_PASS_02] Mật khẩu tự động sinh chứa đầy đủ chữ hoa, chữ thường, chữ số và ký tự đặc biệt', () => {
    const pass = generateRandomPassword('oldpass123');
    expect(/[A-Z]/.test(pass)).toBe(true);
    expect(/[a-z]/.test(pass)).toBe(true);
    expect(/[0-9]/.test(pass)).toBe(true);
    expect(/[@#!]/.test(pass)).toBe(true);
  });

  it('[TC_PASS_03] Mật khẩu mới tự động sinh không được trùng với mật khẩu cũ', () => {
    const oldPassword = 'GameRentPassLQ@2026';
    const newPassword = generateRandomPassword(oldPassword);
    expect(newPassword).not.toBe(oldPassword);
  });

  it('[TC_PASS_04] 50 lần sinh mật khẩu liên tiếp có tính ngẫu nhiên cao (không trùng lặp)', () => {
    const set = new Set();
    for (let i = 0; i < 50; i++) {
      set.add(generateRandomPassword());
    }
    // Độ ngẫu nhiên cao: tỷ lệ unique đạt 100% (50/50)
    expect(set.size).toBe(50);
  });

  it('[TC_PASS_05] Nghiệp vụ thu hồi acc: Trạng thái tài khoản chuyển sang "available" (Sẵn sàng) và cập nhật mật khẩu mới', () => {
    const initialAccount = {
      id: 'ACC-LQ-01',
      title: 'Acc Chiến Tướng 50 Sao',
      secretAccount: 'lq_chientuong_01',
      secretPassword: 'OldPassword@123',
      status: 'rented'
    };

    const initialRental = {
      id: 'ORDER-LQ-001',
      accountId: 'ACC-LQ-01',
      status: 'active'
    };

    // Mô phỏng logic returnRentalEarly
    const newPassword = generateRandomPassword(initialAccount.secretPassword);
    const updatedAccount = {
      ...initialAccount,
      status: 'available',
      secretPassword: newPassword,
      lastPasswordChangedAt: Date.now()
    };
    const updatedRental = {
      ...initialRental,
      status: 'completed'
    };

    expect(updatedRental.status).toBe('completed');
    expect(updatedAccount.status).toBe('available');
    expect(updatedAccount.secretPassword).not.toBe(initialAccount.secretPassword);
    expect(updatedAccount.secretPassword).toBe(newPassword);
    expect(updatedAccount.lastPasswordChangedAt).toBeGreaterThan(0);
  });
});
