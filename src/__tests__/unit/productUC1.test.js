import { describe, it, expect } from 'vitest';
import { validateProductUC1 } from '../../utils/validation';

describe('5. Module Thêm Tài Khoản Game (F_ADM_PROD - Chuẩn UC1_Add New Product)', () => {
  const existingAccounts = [
    { id: 'ACCVAL001', title: 'Nick Valorant Prime Vandal' }
  ];

  const validBase = {
    code: 'SP000001',
    title: 'Nick Valorant Prime Vandal VIP',
    imageType: 'image/jpeg',
    imageSize: 500 * 1024, // 500KB
    pricePerHour: 15000
  };

  it('[UTCID01] BVA Mã sản phẩm dưới biên min (7 ký tự)', () => {
    const res = validateProductUC1({ ...validBase, code: 'SP00001' }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('từ 8 ký tự trở lên');
  });

  it('[UTCID02] BVA Mã sản phẩm tại biên min (8 ký tự)', () => {
    const res = validateProductUC1({ ...validBase, code: 'SP000001' }, existingAccounts);
    expect(res.isValid).toBe(true);
    expect(res.error).toBeNull();
  });

  it('[UTCID03] BVA Mã sản phẩm tại biên trên (30 ký tự)', () => {
    const code30 = 'PROD_VAL_123456789012345678901';
    const res = validateProductUC1({ ...validBase, code: code30 }, existingAccounts);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID04] BVA Mã sản phẩm vượt biên trên (31 ký tự)', () => {
    const code31 = 'PROD_VAL_1234567890123456789012';
    const res = validateProductUC1({ ...validBase, code: code31 }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không vượt quá 30 ký tự');
  });

  it('[UTCID05] EP Mã sản phẩm chứa ký tự đặc biệt (@)', () => {
    const res = validateProductUC1({ ...validBase, code: 'SP@00001' }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('chỉ gồm chữ và số');
  });

  it('[UTCID06] EP Mã sản phẩm chứa khoảng trắng', () => {
    const res = validateProductUC1({ ...validBase, code: 'SP 00001' }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không chứa khoảng trắng');
  });

  it('[UTCID07] Decision Table: Mã sản phẩm đã tồn tại trong CSDL (ACCVAL001)', () => {
    const res = validateProductUC1({ ...validBase, code: 'ACCVAL001' }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('đã tồn tại trong hệ thống');
  });

  it('[UTCID08] BVA Tên sản phẩm dưới biên min (9 ký tự)', () => {
    const res = validateProductUC1({ ...validBase, title: 'Nick Vip1' }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('từ 10 ký tự trở lên');
  });

  it('[UTCID09] BVA Tên sản phẩm tại biên min (10 ký tự)', () => {
    const res = validateProductUC1({ ...validBase, title: 'Nick Vip 1' }, existingAccounts);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID10] BVA Tên sản phẩm tại biên trên (50 ký tự)', () => {
    const title50 = 'Nick Valorant Prime Vandal VIP Full Skin Rank Asc';
    const res = validateProductUC1({ ...validBase, title: title50 }, existingAccounts);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID11] BVA Tên sản phẩm vượt biên trên (51 ký tự)', () => {
    const title51 = 'Nick Valorant Prime Vandal VIP Full Skin Rank Asce1';
    const res = validateProductUC1({ ...validBase, title: title51 }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('không quá 50 ký tự');
  });

  it('[UTCID12] EP Upload ảnh sai định dạng (.pdf / .zip)', () => {
    const res = validateProductUC1({ ...validBase, imageType: 'application/pdf' }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('đúng định dạng (.jpg, .png, .gif)');
  });

  it('[UTCID13] BVA Upload ảnh dung lượng 1.5MB (> 1MB)', () => {
    const res = validateProductUC1({ ...validBase, imageSize: 1.5 * 1024 * 1024 }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('vượt quá 1MB');
  });

  it('[UTCID14] EP Upload ảnh PNG hợp lệ dung lượng 800KB (<= 1MB)', () => {
    const res = validateProductUC1({ ...validBase, imageType: 'image/png', imageSize: 800 * 1024 }, existingAccounts);
    expect(res.isValid).toBe(true);
  });

  it('[UTCID15] EP Giá thuê mỗi giờ <= 0 (nhập số âm)', () => {
    const res = validateProductUC1({ ...validBase, pricePerHour: -10000 }, existingAccounts);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('phải lớn hơn 0');
  });
});
