import { describe, it, expect, beforeEach } from 'vitest';
import { getFavoritesStorageKey } from '../../utils/favoriteUtils';

describe('Kiểm thử Tách biệt Dữ liệu Yêu Thích (Thả Tim) Giữa Quản Lý và Khách Hàng', () => {
  const adminUser = {
    id: 'ADMIN-01',
    name: 'Quản Lý',
    role: 'admin'
  };

  const customerUser = {
    id: 'KH002',
    name: 'Nguyễn Văn Hùng',
    role: 'renter'
  };

  const anotherCustomer = {
    id: 'KH003',
    name: 'Trần Thị Mai',
    role: 'renter'
  };

  // Mock Storage cho môi trường Vitest Node
  let storageMock = {};

  beforeEach(() => {
    storageMock = {};
  });

  const mockSetItem = (key, val) => {
    storageMock[key] = String(val);
  };

  const mockGetItem = (key) => {
    return storageMock[key] || null;
  };

  it('[FAV-01] Xác định chính xác storage key cho Quản lý (Admin)', () => {
    const key = getFavoritesStorageKey(adminUser);
    expect(key).toBe('gamerent_fav_accounts_admin');
  });

  it('[FAV-02] Xác định chính xác storage key cho Khách hàng (User/Renter)', () => {
    const key = getFavoritesStorageKey(customerUser);
    expect(key).toBe('gamerent_fav_accounts_KH002');
  });

  it('[FAV-03] Xác định chính xác storage key cho Khách vãng lai (Chưa đăng nhập)', () => {
    const key = getFavoritesStorageKey(null);
    expect(key).toBe('gamerent_fav_accounts_guest');
  });

  it('[FAV-04] Dữ liệu thả tim của Admin không bị dính sang Khách hàng khi chuyển tài khoản', () => {
    const adminKey = getFavoritesStorageKey(adminUser);
    const customerKey = getFavoritesStorageKey(customerUser);

    // 1. Admin thả tim tài khoản ACC-LQ-01 và ACC-VAL-01
    const adminFavorites = ['ACC-LQ-01', 'ACC-VAL-01'];
    mockSetItem(adminKey, JSON.stringify(adminFavorites));

    // 2. Chuyển sang Khách hàng: Danh sách tim của khách phải hoàn toàn độc lập và rỗng
    const customerStored = JSON.parse(mockGetItem(customerKey) || '[]');
    expect(customerStored).toEqual([]);
    expect(customerStored).not.toContain('ACC-LQ-01');
    expect(customerStored).not.toContain('ACC-VAL-01');

    // 3. Khách hàng thả tim tài khoản ACC-GEN-01
    const customerFavorites = ['ACC-GEN-01'];
    mockSetItem(customerKey, JSON.stringify(customerFavorites));

    // 4. Kiểm tra lại: Admin vẫn chỉ có các acc của Admin, không bị lẫn acc của Khách
    const adminCheck = JSON.parse(mockGetItem(adminKey) || '[]');
    expect(adminCheck).toEqual(['ACC-LQ-01', 'ACC-VAL-01']);
    expect(adminCheck).not.toContain('ACC-GEN-01');
  });

  it('[FAV-05] Hai khách hàng khác nhau có danh sách yêu thích tách biệt hoàn toàn', () => {
    const key1 = getFavoritesStorageKey(customerUser);
    const key2 = getFavoritesStorageKey(anotherCustomer);

    mockSetItem(key1, JSON.stringify(['ACC-PUBG-01']));
    mockSetItem(key2, JSON.stringify(['ACC-TC-01']));

    const fav1 = JSON.parse(mockGetItem(key1) || '[]');
    const fav2 = JSON.parse(mockGetItem(key2) || '[]');

    expect(fav1).toEqual(['ACC-PUBG-01']);
    expect(fav2).toEqual(['ACC-TC-01']);
    expect(fav1).not.toContain('ACC-TC-01');
  });
});
