import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateRegistration,
  validateLogin,
  validateDepositAmount,
  calculateRentalCost,
  validateProductUC1,
  calculateRefundAndExtension
} from '../../utils/validation';

describe('INTEGRATION TEST SUITE (ITC-01 -> ITC-05: Sandwich Strategy)', () => {
  let mockDatabase;

  beforeEach(() => {
    // Khởi tạo trạng thái mô phỏng LocalStorage Database
    mockDatabase = {
      users: [
        { id: 'USER-01', username: 'renter_test', email: 'tester@gamerent.vn', password: 'password123', balance: 100000, role: 'renter', isBlocked: false },
        { id: 'ADMIN-01', username: 'admin_test', email: 'admin@gamerent.vn', password: 'admin123', balance: 5000000, role: 'admin', isBlocked: false }
      ],
      accounts: [
        { id: 'ACCVAL001', game: 'Valorant', title: 'Nick Valorant Prime Vandal', pricePerHour: 15000, status: 'available', accountId: 'riot_user_01', password: 'riot_pass_01' },
        { id: 'ACCLOL001', game: 'League of Legends', title: 'Nick LMHT Full Tướng', pricePerHour: 20000, status: 'available', accountId: 'riot_user_02', password: 'riot_pass_02' }
      ],
      rentals: [],
      transactions: [],
      disputes: []
    };
  });

  it('[ITC-01] Tích hợp Đăng ký mới -> Tự động đăng nhập -> Khởi tạo ví 50.000 đ', () => {
    // 1. Kiểm tra validation đăng ký
    const regCheck = validateRegistration('new_customer', 'pass123456', '0912345678', mockDatabase.users);
    expect(regCheck.isValid).toBe(true);

    // 2. Tạo User mới trong DB
    const newUser = {
      id: 'USER-02',
      username: 'new_customer',
      email: 'new_customer@gmail.com',
      password: 'pass123456',
      balance: 50000, // Cấp ví dùng thử
      role: 'renter',
      isBlocked: false
    };
    mockDatabase.users.push(newUser);

    // 3. Tự động đăng nhập
    const loginRes = validateLogin(newUser.email, 'pass123456', mockDatabase.users);
    expect(loginRes.success).toBe(true);
    expect(loginRes.user.balance).toBe(50000);
    expect(loginRes.user.role).toBe('renter');
  });

  it('[ITC-02] Tích hợp Nạp tiền VietQR Auto -> Cộng ví -> Tạo giao dịch TX-XXXX', () => {
    const user = mockDatabase.users[0]; // balance: 100k
    const depositAmount = 200000;

    // 1. Validate hạn mức nạp
    const depCheck = validateDepositAmount(depositAmount);
    expect(depCheck.isValid).toBe(true);

    // 2. Cộng tiền ví
    user.balance += depositAmount;
    expect(user.balance).toBe(300000);

    // 3. Ghi log giao dịch
    const tx = {
      id: 'TX-00001',
      userId: user.id,
      amount: depositAmount,
      type: 'deposit',
      paymentMethod: 'VietQR Auto',
      status: 'completed',
      timestamp: Date.now()
    };
    mockDatabase.transactions.push(tx);

    expect(mockDatabase.transactions.length).toBe(1);
    expect(mockDatabase.transactions[0].amount).toBe(200000);
  });

  it('[ITC-03] Tích hợp Luồng Thuê nick -> Trừ ví -> Đổi trạng thái Rented -> Cấp mật khẩu in-game', () => {
    const user = mockDatabase.users[0]; // balance: 100k
    const account = mockDatabase.accounts[0]; // 15k/h, status: available
    const durationHours = 2; // total: 30k

    // 1. Tính toán chi phí & kiểm tra số dư
    const rentCheck = calculateRentalCost(account, durationHours, user.balance);
    expect(rentCheck.isValid).toBe(true);
    expect(rentCheck.totalCost).toBe(30000);

    // 2. Trừ ví người dùng
    user.balance -= rentCheck.totalCost;
    expect(user.balance).toBe(70000);

    // 3. Đổi trạng thái nick sang rented
    account.status = 'rented';

    // 4. Sinh đơn thuê mới
    const now = Date.now();
    const newRental = {
      id: 'ORDER-001',
      userId: user.id,
      accountId: account.id,
      game: account.game,
      title: account.title,
      pricePerHour: account.pricePerHour,
      totalPrice: rentCheck.totalCost,
      hours: durationHours,
      createdAt: now,
      expiresAt: now + (durationHours * 60 * 60 * 1000),
      status: 'active',
      inGameCredentials: {
        username: account.accountId,
        password: account.password
      }
    };
    mockDatabase.rentals.push(newRental);

    expect(mockDatabase.rentals.length).toBe(1);
    expect(account.status).toBe('rented');
    expect(newRental.inGameCredentials.password).toBe('riot_pass_01');

    // 5. Kiểm tra người thứ 2 cố tình thuê nick này -> Bị chặn
    const secondRentCheck = calculateRentalCost(account, 1, 500000);
    expect(secondRentCheck.isValid).toBe(false);
    expect(secondRentCheck.error).toContain('hiện đang có người thuê');
  });

  it('[ITC-04] Tích hợp Gia hạn thêm giờ và Trả nick sớm hoàn 50%', () => {
    const user = mockDatabase.users[0]; // balance: 100k
    const now = Date.now();
    const order = {
      id: 'ORDER-002',
      userId: user.id,
      accountId: 'ACCVAL001',
      pricePerHour: 15000,
      totalPrice: 30000,
      expiresAt: now + (1 * 60 * 60 * 1000), // còn 1h
      status: 'active'
    };
    mockDatabase.rentals.push(order);

    // 1. Gia hạn thêm 1 giờ (15k)
    const extCheck = calculateRefundAndExtension(order, 'extend', 1);
    expect(extCheck.success).toBe(true);
    expect(extCheck.extendCost).toBe(15000);
    user.balance -= extCheck.extendCost;
    order.expiresAt = extCheck.newExpiresAt;

    // 2. Khách bận đột xuất muốn trả nick sớm (còn thừa 2h = 30k -> hoàn 50% = 15k)
    const returnCheck = calculateRefundAndExtension(order, 'return_early');
    expect(returnCheck.success).toBe(true);
    expect(returnCheck.refundAmount).toBe(15000);

    // Hoàn tiền vào ví
    user.balance += returnCheck.refundAmount;
    order.status = returnCheck.newOrderStatus;

    expect(order.status).toBe('completed');
    expect(returnCheck.accountStatus).toBe('need_change_pass');
  });

  it('[ITC-05] Tích hợp Khách khiếu nại sai pass -> Admin duyệt hoàn 100% -> Nick vào bảo trì', () => {
    const user = mockDatabase.users[0]; // balance: 100k
    const account = mockDatabase.accounts[0];
    const order = {
      id: 'ORDER-003',
      userId: user.id,
      accountId: account.id,
      pricePerHour: 15000,
      totalPrice: 45000, // Thuê 3h
      status: 'active'
    };

    // 1. Khách gửi khiếu nại
    const dispute = {
      id: 'DISP-001',
      orderId: order.id,
      userId: user.id,
      reason: 'Sai mật khẩu',
      description: 'Không thể đăng nhập vào Riot Client',
      status: 'pending'
    };
    mockDatabase.disputes.push(dispute);
    expect(mockDatabase.disputes[0].status).toBe('pending');

    // 2. Admin thẩm định & duyệt hoàn tiền 100%
    const resolveRes = calculateRefundAndExtension(order, 'dispute_approved');
    expect(resolveRes.success).toBe(true);
    expect(resolveRes.refundAmount).toBe(45000);

    // Cập nhật trạng thái
    dispute.status = resolveRes.disputeStatus;
    account.status = resolveRes.accountStatus;
    user.balance += resolveRes.refundAmount;

    expect(dispute.status).toBe('resolved');
    expect(account.status).toBe('maintenance');
    expect(user.balance).toBe(145000);
  });

  it('[ITC-06] Tích hợp Admin thêm tài khoản game mới chuẩn Form UC1 -> Hiển thị trên Kho', () => {
    const newProduct = {
      code: 'ACCVAL099',
      title: 'Nick Valorant Vandal Prime VIP Full Skin',
      imageType: 'image/jpeg',
      imageSize: 650 * 1024,
      pricePerHour: 25000
    };

    // 1. Validate dữ liệu form theo chuẩn đề bài UC1
    const valResult = validateProductUC1(newProduct, mockDatabase.accounts);
    expect(valResult.isValid).toBe(true);

    // 2. Thêm vào kho
    mockDatabase.accounts.push({
      id: newProduct.code,
      title: newProduct.title,
      pricePerHour: newProduct.pricePerHour,
      status: 'available',
      game: 'Valorant'
    });

    expect(mockDatabase.accounts.length).toBe(3);
    const addedAcc = mockDatabase.accounts.find(a => a.id === 'ACCVAL099');
    expect(addedAcc).toBeDefined();
    expect(addedAcc.status).toBe('available');
  });
});
