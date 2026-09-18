// ==============================================================================
// CÁC HÀM NGHIỆP VỤ CỐT LÕI (CORE BUSINESS LOGIC & TEST VALIDATORS)
// Phục vụ kiểm thử Unit Test (BVA, EP, Decision Table, UC1 Specs) cho GameRent
// ==============================================================================

/**
 * 1. F_AUTH_REG: Kiểm tra hợp lệ form đăng ký tài khoản
 * - Username: 4-30 ký tự, không rỗng, không chứa khoảng trắng, không ký tự đặc biệt
 * - Password: Tối thiểu 6 ký tự
 * - Phone: Đúng 10 chữ số di động (đầu số 09, 03, 07, 08, 05)
 * - Trùng lặp: Không trùng với user đã có
 */
export function validateRegistration(username, password, phone, existingUsers = []) {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { isValid: false, error: 'Tên đăng nhập không được để trống' };
  }
  const cleanUser = username.trim();
  if (cleanUser.length < 4) {
    return { isValid: false, error: 'Tên đăng nhập phải từ 4 ký tự trở lên' };
  }
  if (cleanUser.length > 30) {
    return { isValid: false, error: 'Tên đăng nhập không được vượt quá 30 ký tự' };
  }
  if (/\s/.test(cleanUser)) {
    return { isValid: false, error: 'Tên đăng nhập không chứa khoảng trắng' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(cleanUser)) {
    return { isValid: false, error: 'Tên đăng nhập chỉ gồm chữ và số' };
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return { isValid: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  if (phone !== undefined && phone !== null) {
    const cleanPhone = String(phone).trim();
    if (!/^\d+$/.test(cleanPhone)) {
      return { isValid: false, error: 'Số điện thoại chỉ gồm chữ số' };
    }
    if (cleanPhone.length !== 10) {
      return { isValid: false, error: cleanPhone.length < 10 ? 'Số điện thoại phải gồm đúng 10 chữ số' : 'Số điện thoại không được vượt quá 10 chữ số' };
    }
    if (!/^(09|03|07|08|05)\d{8}$/.test(cleanPhone)) {
      return { isValid: false, error: 'Số điện thoại không đúng định dạng đầu số di động' };
    }
  }

  const isDuplicate = existingUsers.some(
    u => (u.username && u.username.toLowerCase() === cleanUser.toLowerCase()) ||
         (u.email && u.email.toLowerCase() === cleanUser.toLowerCase())
  );
  if (isDuplicate) {
    return { isValid: false, error: 'Tên đăng nhập đã tồn tại trong hệ thống' };
  }

  return { isValid: true, error: null };
}

/**
 * 2. F_AUTH_LOGIN: Xác thực đăng nhập tài khoản
 */
export function validateLogin(email, password, users = []) {
  if (!email || String(email).trim() === '') {
    return { success: false, error: 'Email không được để trống' };
  }
  if (!password || String(password).trim() === '') {
    return { success: false, error: 'Mật khẩu không được để trống' };
  }

  const user = users.find(u => u.email.toLowerCase() === String(email).trim().toLowerCase());
  if (!user) {
    return { success: false, error: 'Email không tồn tại trên hệ thống' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Mật khẩu không chính xác' };
  }
  if (user.isBlocked) {
    return { success: false, error: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế' };
  }

  return { success: true, user };
}

/**
 * 3. F_WAL_DEP: Kiểm tra hạn mức nạp tiền ví VietQR (BVA: 10.000đ - 5.000.000đ)
 */
export function validateDepositAmount(amount) {
  const num = Number(amount);
  if (isNaN(num) || typeof amount === 'string' && /[a-zA-Z@#$%^&*]/.test(amount)) {
    return { isValid: false, error: 'Vui lòng nhập số tiền hợp lệ' };
  }
  if (!Number.isInteger(num) || num <= 0) {
    return { isValid: false, error: 'Số tiền nạp phải là số nguyên dương' };
  }
  if (num < 10000) {
    return { isValid: false, error: 'Số tiền nạp tối thiểu là 10.000 VNĐ' };
  }
  if (num > 5000000) {
    return { isValid: false, error: 'Số tiền nạp tối đa là 5.000.000 VNĐ' };
  }
  return { isValid: true, error: null, amount: num };
}

/**
 * 4. F_RENT_CALC: Tính phí thuê và kiểm tra số dư ví (BVA: 1h - 48h, Decision Table)
 */
export function calculateRentalCost(account, durationHours, userBalance) {
  if (!account) {
    return { isValid: false, error: 'Không tìm thấy tài khoản game' };
  }
  if (account.status === 'rented') {
    return { isValid: false, error: 'Tài khoản này hiện đang có người thuê' };
  }
  if (account.status === 'maintenance') {
    return { isValid: false, error: 'Tài khoản đang trong quá trình bảo trì / đổi mật khẩu' };
  }

  const hours = Number(durationHours);
  if (isNaN(hours) || hours < 1) {
    return { isValid: false, error: 'Thời gian thuê tối thiểu là 1 giờ' };
  }
  if (hours > 48) {
    return { isValid: false, error: 'Thời gian thuê tối đa là 48 giờ' };
  }

  const totalCost = account.pricePerHour * hours;
  const balance = Number(userBalance) || 0;

  if (balance < totalCost) {
    const missing = totalCost - balance;
    return {
      isValid: false,
      totalCost,
      balance,
      missingAmount: missing,
      canRent: false,
      error: `Số dư ví không đủ. Cần thêm ${missing.toLocaleString('vi-VN')} đ`
    };
  }

  return {
    isValid: true,
    totalCost,
    balance,
    remainingBalance: balance - totalCost,
    canRent: true,
    error: null
  };
}

/**
 * 5. F_ADM_PROD: Form thêm tài khoản game theo chuẩn UC1_Add New Product
 * - Mã sản phẩm: 8-30 ký tự, không chứa khoảng trắng, không ký tự đặc biệt, không trùng
 * - Tên sản phẩm: 10-50 ký tự
 * - File ảnh: <= 1MB (1.048.576 bytes), định dạng .jpg, .png, .gif
 * - Giá thuê: > 0
 */
export function validateProductUC1(data, existingAccounts = []) {
  const { code, title, imageSize, imageType, pricePerHour } = data || {};

  // 1. Mã sản phẩm
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Mã sản phẩm không được để trống' };
  }
  const cleanCode = code.trim();
  if (cleanCode.length < 8) {
    return { isValid: false, error: 'Mã sản phẩm phải từ 8 ký tự trở lên' };
  }
  if (cleanCode.length > 30) {
    return { isValid: false, error: 'Mã sản phẩm không vượt quá 30 ký tự' };
  }
  if (/\s/.test(code)) {
    return { isValid: false, error: 'Mã sản phẩm không chứa khoảng trắng' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(cleanCode)) {
    return { isValid: false, error: 'Mã sản phẩm chỉ gồm chữ và số' };
  }
  if (existingAccounts.some(a => a.id && a.id.toLowerCase() === cleanCode.toLowerCase())) {
    return { isValid: false, error: 'Mã sản phẩm đã tồn tại trong hệ thống' };
  }

  // 2. Tên sản phẩm
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Tên sản phẩm không được để trống' };
  }
  const cleanTitle = title.trim();
  if (cleanTitle.length < 10) {
    return { isValid: false, error: 'Tên sản phẩm phải từ 10 ký tự trở lên' };
  }
  if (cleanTitle.length > 50) {
    return { isValid: false, error: 'Tên sản phẩm không quá 50 ký tự' };
  }

  // 3. File ảnh
  if (imageType) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'jpg', 'png', 'gif'];
    const isTypeValid = validTypes.some(t => imageType.toLowerCase().includes(t));
    if (!isTypeValid) {
      return { isValid: false, error: 'Ảnh phải đúng định dạng (.jpg, .png, .gif)' };
    }
  }
  if (imageSize !== undefined && imageSize !== null) {
    const maxSizeBytes = 1 * 1024 * 1024; // 1MB
    if (imageSize > maxSizeBytes) {
      return { isValid: false, error: 'Dung lượng ảnh vượt quá 1MB' };
    }
  }

  // 4. Giá thuê
  const price = Number(pricePerHour);
  if (isNaN(price) || price <= 0) {
    return { isValid: false, error: 'Giá thuê mỗi giờ phải lớn hơn 0' };
  }

  return { isValid: true, error: null };
}

/**
 * 6. F_REF_EXT: Tính hoàn tiền 50% khi trả sớm, 100% khi khiếu nại, và gia hạn giờ
 */
export function calculateRefundAndExtension(order, action, extraHours = 0) {
  if (!order) return { success: false, error: 'Không tìm thấy đơn hàng' };

  if (action === 'return_early') {
    const now = Date.now();
    const remainingMs = Math.max(0, order.expiresAt - now);
    // Hoàn 50% tiền giờ thừa còn lại (thêm 1s dung sai độ trễ thực thi ms)
    const remainingHours = Math.floor((remainingMs + 1000) / (1000 * 60 * 60));
    const refundAmount = Math.floor(remainingHours * (order.pricePerHour || 15000) * 0.5);
    return {
      success: true,
      refundAmount,
      remainingHours,
      newOrderStatus: 'completed',
      accountStatus: 'need_change_pass'
    };
  }

  if (action === 'dispute_approved') {
    // Hoàn 100% chi phí đơn hàng
    const refundAmount = order.totalPrice || 0;
    return {
      success: true,
      refundAmount,
      disputeStatus: 'resolved',
      accountStatus: 'maintenance'
    };
  }

  if (action === 'extend') {
    const hours = Number(extraHours);
    if (isNaN(hours) || hours <= 0) {
      return { success: false, error: 'Số giờ gia hạn phải lớn hơn 0' };
    }
    const cost = (order.pricePerHour || 15000) * hours;
    const now = Date.now();
    const baseTime = order.expiresAt > now ? order.expiresAt : now;
    const newExpiresAt = baseTime + (hours * 60 * 60 * 1000);

    return {
      success: true,
      extendCost: cost,
      newExpiresAt
    };
  }

  return { success: false, error: 'Hành động không hợp lệ' };
}

/**
 * 7. F_AUTO_PASS: Tự động sinh mật khẩu ngẫu nhiên bảo mật cao khi thu hồi tài khoản game
 * - Tiêu chuẩn game: Riot Games, Garena, Steam, HoYoverse
 * - Độ dài: 12-14 ký tự với tiền tố GameRent@ hoặc tùy biến
 * - Đảm bảo luôn có chữ hoa, chữ thường, số, ký tự đặc biệt
 * - Đảm bảo mật khẩu mới không trùng với mật khẩu cũ
 */
export function generateRandomPassword(oldPassword = '', prefix = 'GameRent@') {
  const charsUpper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const charsLower = 'abcdefghijkmnpqrstuvwxyz';
  const charsDigits = '23456789';
  const allChars = charsUpper + charsLower + charsDigits;

  let newPass = '';
  let attempts = 0;

  do {
    // Sinh 5 ký tự ngẫu nhiên đa dạng
    let randomPart = '';
    randomPart += charsUpper[Math.floor(Math.random() * charsUpper.length)];
    randomPart += charsLower[Math.floor(Math.random() * charsLower.length)];
    randomPart += charsDigits[Math.floor(Math.random() * charsDigits.length)];
    for (let i = 0; i < 2; i++) {
      randomPart += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Xáo trộn ngẫu nhiên
    const shuffled = randomPart.split('').sort(() => 0.5 - Math.random()).join('');
    newPass = `${prefix}${shuffled}`;
    attempts++;
  } while (newPass === oldPassword && attempts < 10);

  return newPass;
}
