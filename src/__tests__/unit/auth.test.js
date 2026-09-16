import { describe, it, expect } from 'vitest';
import { validateRegistration, validateLogin } from '../../utils/validation';

describe('1. Module Xác thực & Đăng ký (F_AUTH_REG - Unit Test Cases)', () => {
  const existingUsers = [
    { username: 'renter_demo', email: 'renter_demo@gmail.com' }
  ];

  it('[UTCID01] Đăng ký hợp lệ đầy đủ thông tin chuẩn (Normal case)', () => {
    const res = validateRegistration('gamer', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(true);
    expect(res.error).toBeNull();
  });

  it('[UTCID02] BVA Username dưới biên (3 ký tự)', () => {
    const res = validateRegistration('gam', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('từ 4 ký tự trở lên');
  });

  it('[UTCID03] EP Username để trống', () => {
    const res = validateRegistration('', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không được để trống');
  });

  it('[UTCID04] BVA Username tại biên trên (30 ký tự)', () => {
    const username30 = 'user12345678901234567890123456';
    const res = validateRegistration(username30, '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID05] BVA Username vượt biên trên (31 ký tự)', () => {
    const username31 = 'user123456789012345678901234567';
    const res = validateRegistration(username31, '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không được vượt quá 30 ký tự');
  });

  it('[UTCID06] EP Username chứa khoảng trắng', () => {
    const res = validateRegistration('user name', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không chứa khoảng trắng');
  });

  it('[UTCID07] EP Username chứa ký tự đặc biệt', () => {
    const res = validateRegistration('user@123', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('chỉ gồm chữ và số');
  });

  it('[UTCID08] BVA Mật khẩu tại biên dưới (6 ký tự)', () => {
    const res = validateRegistration('validuser', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID09] BVA Mật khẩu dưới biên (5 ký tự)', () => {
    const res = validateRegistration('validuser', '12345', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('ít nhất 6 ký tự');
  });

  it('[UTCID10] EP Số điện thoại 10 số di động chuẩn (0987654321)', () => {
    const res = validateRegistration('validuser', '123456', '0987654321', existingUsers);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID11] EP Số điện thoại sai đầu số di động (0123456789)', () => {
    const res = validateRegistration('validuser', '123456', '0123456789', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('đầu số di động');
  });

  it('[UTCID12] EP Số điện thoại thiếu chữ số (9 số)', () => {
    const res = validateRegistration('validuser', '123456', '098765432', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('đúng 10 chữ số');
  });

  it('[UTCID13] EP Số điện thoại thừa chữ số (11 số)', () => {
    const res = validateRegistration('validuser', '123456', '09876543210', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không được vượt quá 10 chữ số');
  });

  it('[UTCID14] EP Số điện thoại chứa ký tự chữ', () => {
    const res = validateRegistration('validuser', '123456', '0987654abc', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('chỉ gồm chữ số');
  });

  it('[UTCID15] Decision Table: Trùng lặp username đã có trong CSDL', () => {
    const res = validateRegistration('renter_demo', '123456', '0912345678', existingUsers);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('đã tồn tại trong hệ thống');
  });

  it('[UTCID16] Đăng ký thành công với đầu số 08 và username có dấu gạch dưới', () => {
    const res = validateRegistration('alpha_123', 'mypassword', '0868889999', existingUsers);
    expect(res.isValid).toBe(true);
  });
});

describe('2. Module Xác thực & Đăng nhập (F_AUTH_LOGIN - Unit Test Cases)', () => {
  const users = [
    { email: 'tester@gamerent.vn', password: 'tester123', isBlocked: false, name: 'Khách Hàng Tester' },
    { email: 'blocked@test.com', password: '123456', isBlocked: true, name: 'Tài khoản vi phạm' }
  ];

  it('[UTCID01] Đăng nhập thành công với thông tin chính xác', () => {
    const res = validateLogin('tester@gamerent.vn', 'tester123', users);
    expect(res.success).toBe(true);
    expect(res.user.name).toBe('Khách Hàng Tester');
  });

  it('[UTCID02] Báo lỗi khi sai mật khẩu', () => {
    const res = validateLogin('tester@gamerent.vn', 'wrongpass', users);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Mật khẩu không chính xác');
  });

  it('[UTCID03] Báo lỗi khi email không tồn tại', () => {
    const res = validateLogin('unknown@gmail.com', '123456', users);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Email không tồn tại');
  });

  it('[UTCID04] Báo lỗi khi để trống email', () => {
    const res = validateLogin('', 'tester123', users);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Email không được để trống');
  });

  it('[UTCID05] Báo lỗi khi để trống mật khẩu', () => {
    const res = validateLogin('tester@gamerent.vn', '', users);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Mật khẩu không được để trống');
  });

  it('[UTCID06] Chặn đăng nhập với tài khoản bị khóa vi phạm quy chế (isBlocked=true)', () => {
    const res = validateLogin('blocked@test.com', '123456', users);
    expect(res.success).toBe(false);
    expect(res.error).toContain('đang bị khóa do vi phạm');
  });
});
