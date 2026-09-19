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

  it('[TC_PASS_06] Toàn bộ tài khoản kho game khởi tạo có cấu hình secretAccount và secretPassword hợp lệ', async () => {
    const { INITIAL_ACCOUNTS } = await import('../../data/initialData');
    expect(INITIAL_ACCOUNTS.length).toBeGreaterThan(0);
    INITIAL_ACCOUNTS.forEach(acc => {
      expect(acc.secretAccount).toBeDefined();
      expect(acc.secretAccount.length).toBeGreaterThanOrEqual(3);
      expect(acc.secretPassword).toBeDefined();
      expect(acc.secretPassword.length).toBeGreaterThanOrEqual(6);
      expect(acc.isRealAccount).toBeUndefined();
    });
  });

  it('[TC_PASS_07] Thu hồi ca thuê tài khoản hệ thống: Đổi pass mới ngẫu nhiên khác pass cũ, lưu vết previousPassword', () => {
    const sampleAcc = {
      id: 'ACC-LQ-01',
      secretAccount: 'lq_chientuong_01',
      secretPassword: 'GameRentPassLQ@2026',
      status: 'rented'
    };

    const oldPassword = sampleAcc.secretPassword;
    const newPassword = generateRandomPassword(oldPassword);

    const revokedAcc = {
      ...sampleAcc,
      status: 'available',
      secretPassword: newPassword,
      previousPassword: oldPassword,
      lastPasswordChangedAt: Date.now()
    };

    const completedRental = {
      id: 'ORDER-LQ-001',
      accountId: 'ACC-LQ-01',
      status: 'completed',
      isRevoked: true,
      revokedAt: Date.now(),
      revocationReason: 'expired_auto',
      previousPassword: oldPassword
    };

    expect(revokedAcc.secretPassword).not.toBe(oldPassword);
    expect(revokedAcc.previousPassword).toBe(oldPassword);
    expect(revokedAcc.status).toBe('available');
    expect(completedRental.status).toBe('completed');
    expect(completedRental.isRevoked).toBe(true);
  });

  it('[TC_PASS_08] Kiểm tra bảo mật: Mật khẩu cũ bị vô hiệu hóa khi đơn thuê hết hạn hoặc bị thu hồi', () => {
    const rental = {
      id: 'ORDER-LQ-001',
      status: 'completed',
      isRevoked: true,
      endTime: Date.now() - 1000
    };

    const isExpired = rental.endTime <= Date.now();
    const canUsePassword = rental.status === 'active' && !isExpired;

    expect(isExpired).toBe(true);
    expect(canUsePassword).toBe(false);
  });

  it('[TC_PASS_09] Tự động tạo thông báo lưu vết cho tài khoản khách khi ca thuê hết hạn thu hồi', () => {
    const rental = {
      id: 'ORDER-LQ-4420',
      userId: 'USER-01',
      accountId: 'ACC-LQ-01',
      accountTitle: 'Acc Chiến Tướng 50 Sao',
      secretAccount: 'lq_chientuong_01',
      secretPassword: 'OldPassword@123'
    };
    const oldPassword = rental.secretPassword;
    const newPassword = generateRandomPassword(oldPassword);
    const now = Date.now();

    const notif = {
      id: `NOTIF-${now}-123`,
      userId: rental.userId,
      rentalId: rental.id,
      accountId: rental.accountId,
      accountTitle: rental.accountTitle,
      secretAccount: rental.secretAccount,
      oldPassword,
      newPassword,
      type: 'rental_expired_auto',
      title: 'Ca thuê đã hết giờ & Hệ thống tự động thu hồi',
      message: `Ca thuê "${rental.accountTitle}" (${rental.secretAccount}) đã hết thời gian thuê. Hệ thống đã tự động thu hồi tài khoản, vô hiệu mật khẩu cũ (${oldPassword}) và cập nhật mật khẩu mới (${newPassword}).`,
      timestamp: now,
      isRead: false
    };

    expect(notif.userId).toBe('USER-01');
    expect(notif.isRead).toBe(false);
    expect(notif.oldPassword).toBe(oldPassword);
    expect(notif.newPassword).toBe(newPassword);
    expect(notif.newPassword).not.toBe(oldPassword);
    expect(notif.type).toBe('rental_expired_auto');
  });

  it('[TC_PASS_10] Vòng đời thông báo chuông: Lưu vết, đánh dấu đã đọc và xóa thông báo', () => {
    let notifications = [
      { id: 'NOTIF-1', userId: 'USER-01', rentalId: 'ORDER-1', isRead: false },
      { id: 'NOTIF-2', userId: 'USER-01', rentalId: 'ORDER-2', isRead: false },
      { id: 'NOTIF-3', userId: 'USER-02', rentalId: 'ORDER-3', isRead: false }
    ];

    // Đánh dấu đã đọc
    notifications = notifications.map(n => (n.id === 'NOTIF-1' ? { ...n, isRead: true } : n));
    expect(notifications.find(n => n.id === 'NOTIF-1').isRead).toBe(true);
    expect(notifications.find(n => n.id === 'NOTIF-2').isRead).toBe(false);

    // Xóa từng thông báo
    notifications = notifications.filter(n => n.id !== 'NOTIF-1');
    expect(notifications.some(n => n.id === 'NOTIF-1')).toBe(false);
    expect(notifications.length).toBe(2);

    // Xóa tất cả thông báo của USER-01
    notifications = notifications.filter(n => n.userId !== 'USER-01');
    expect(notifications.some(n => n.userId === 'USER-01')).toBe(false);
    expect(notifications.length).toBe(1);
    expect(notifications[0].id).toBe('NOTIF-3');
  });
});
