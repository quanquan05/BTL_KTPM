/**
 * Trả về storage key cho danh sách tài khoản yêu thích (thả tim) dựa trên tài khoản người dùng
 * Đảm bảo tách riêng hoàn toàn dữ liệu giữa Quản lý (Admin), Khách hàng (User/Renter) và Khách vãng lai
 * 
 * @param {Object|null} user - Thông tin người dùng hiện tại
 * @returns {string} Key định danh localStorage tương ứng
 */
export const getFavoritesStorageKey = (user) => {
  if (!user) return 'gamerent_fav_accounts_guest';
  if (user.role === 'admin' || user.id === 'ADMIN-01') return 'gamerent_fav_accounts_admin';
  return `gamerent_fav_accounts_${user.id || 'renter'}`;
};
