import { describe, it, expect, beforeEach } from 'vitest';

describe('9. Module Đổi Mật Khẩu Khách Thuê (F_AUTH_CHANGE_PASSWORD - BVA & EP Unit Tests)', () => {
  let mockUser;
  let mockUsers;

  beforeEach(() => {
    mockUser = {
      id: 'USER-TEST-01',
      username: 'gamer_khach',
      name: 'Nguyễn Văn Khách',
      email: 'khach@gamerent.vn',
      password: 'oldPassword123',
      role: 'renter',
      balance: 100000
    };
    mockUsers = [mockUser];
  });

  // Hàm mô phỏng logic changePassword trong AppContext
  const changePasswordService = (currentPass, newPass, confirmPass, user) => {
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập.' };
    if (!currentPass) return { success: false, error: 'Vui lòng nhập mật khẩu hiện tại.' };
    if (user.password && user.password !== currentPass) {
      return { success: false, error: 'Mật khẩu hiện tại không chính xác.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự (Quy tắc BVA).' };
    }
    if (newPass === currentPass) {
      return { success: false, error: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.' };
    }
    if (newPass !== confirmPass) {
      return { success: false, error: 'Mật khẩu xác nhận không trùng khớp.' };
    }

    user.password = newPass;
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  };

  it('[CP-01] Đổi mật khẩu thành công khi nhập đúng thông tin chuẩn (Normal Case)', () => {
    const res = changePasswordService('oldPassword123', 'newPassword456', 'newPassword456', mockUser);
    expect(res.success).toBe(true);
    expect(mockUser.password).toBe('newPassword456');
  });

  it('[CP-02] BVA Mật khẩu mới dưới biên (5 ký tự) -> Báo lỗi', () => {
    const res = changePasswordService('oldPassword123', '12345', '12345', mockUser);
    expect(res.success).toBe(false);
    expect(res.error).toContain('ít nhất 6 ký tự');
    expect(mockUser.password).toBe('oldPassword123');
  });

  it('[CP-03] BVA Mật khẩu mới tại biên dưới hợp lệ (6 ký tự) -> Chấp nhận', () => {
    const res = changePasswordService('oldPassword123', 'pass06', 'pass06', mockUser);
    expect(res.success).toBe(true);
    expect(mockUser.password).toBe('pass06');
  });

  it('[CP-04] EP Mật khẩu hiện tại không chính xác -> Báo lỗi', () => {
    const res = changePasswordService('wrongPass', 'newPassword456', 'newPassword456', mockUser);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Mật khẩu hiện tại không chính xác');
    expect(mockUser.password).toBe('oldPassword123');
  });

  it('[CP-05] EP Mật khẩu mới trùng với mật khẩu hiện tại -> Báo lỗi', () => {
    const res = changePasswordService('oldPassword123', 'oldPassword123', 'oldPassword123', mockUser);
    expect(res.success).toBe(false);
    expect(res.error).toContain('không được trùng với mật khẩu hiện tại');
  });

  it('[CP-06] EP Mật khẩu xác nhận không khớp -> Báo lỗi', () => {
    const res = changePasswordService('oldPassword123', 'newPassword456', 'differentPass', mockUser);
    expect(res.success).toBe(false);
    expect(res.error).toContain('không trùng khớp');
  });

  it('[CP-07] EP Mật khẩu hiện tại để trống -> Báo lỗi', () => {
    const res = changePasswordService('', 'newPassword456', 'newPassword456', mockUser);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Vui lòng nhập mật khẩu hiện tại');
  });

  it('[CP-08] Chưa đăng nhập (user = null) -> Chặn thao tác', () => {
    const res = changePasswordService('oldPassword123', 'newPassword456', 'newPassword456', null);
    expect(res.success).toBe(false);
    expect(res.error).toContain('chưa đăng nhập');
  });
});
