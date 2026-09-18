import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CATEGORIES,
  INITIAL_ACCOUNTS,
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_RENTALS,
  INITIAL_TRANSACTIONS,
  INITIAL_DISPUTES
} from '../data/initialData';
import { generateRandomPassword } from '../utils/validation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Quản lý trạng thái từ LocalStorage hoặc dữ liệu ban đầu
  // Helper đọc LocalStorage an toàn tuyệt đối chống lỗi crash màn hình trắng
  const safeGetJSON = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === 'undefined' || saved === 'null') return fallback;
      const parsed = JSON.parse(saved);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      console.warn(`Lỗi đọc localStorage key "${key}":`, e);
      return fallback;
    }
  };

  const [categories] = useState(() => CATEGORIES);

  const [accounts, setAccounts] = useState(() => {

    const saved = safeGetJSON('gamerent_accounts', INITIAL_ACCOUNTS);
    // Luôn đồng bộ thumbnail, skinDetails và galleryImages chân thực từ INITIAL_ACCOUNTS
    return saved.map(acc => {
      const init = INITIAL_ACCOUNTS.find(i => i.id === acc.id);
      if (init) {
        return {
          ...acc,
          thumbnail: init.thumbnail,
          highlightSkins: init.highlightSkins,
          skinDetails: init.skinDetails,
          galleryImages: init.galleryImages
        };
      }
      return acc;
    });
  });

  const [users, setUsers] = useState(() => safeGetJSON('gamerent_users', INITIAL_USERS));


  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gamerent_current_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.role === 'admin' || parsed.id === 'ADMIN-01') {
            return { ...parsed, name: 'Lê Minh Quân', balance: 3000000 };
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc currentUser:', e);
    }
    return INITIAL_USERS[0]; // Mặc định Lê Minh Quân (Admin)
  });

  const [rentals, setRentals] = useState(() => {
    const raw = safeGetJSON('gamerent_rentals', INITIAL_RENTALS);
    // Đồng bộ đúng thực tế: Nếu đơn đã qua thời gian kết thúc thì trạng thái là completed
    return raw.map(r => (r.status === 'active' && r.endTime <= Date.now() ? { ...r, status: 'completed' } : r));
  });
  const [transactions, setTransactions] = useState(() => safeGetJSON('gamerent_transactions', INITIAL_TRANSACTIONS));
  const [disputes, setDisputes] = useState(() => safeGetJSON('gamerent_disputes', INITIAL_DISPUTES));
  const [customers, setCustomers] = useState(() => safeGetJSON('gamerent_customers', INITIAL_CUSTOMERS));

  // Tự động lưu vào LocalStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem('gamerent_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('gamerent_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gamerent_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('gamerent_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gamerent_rentals', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem('gamerent_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('gamerent_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Cập nhật số dư currentUser khi users thay đổi
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && updated.balance !== currentUser.balance) {
        setCurrentUser(updated);
      }
    }
  }, [users]);

  // ==========================================
  // NGHIỆP VỤ 1: XÁC THỰC & ĐĂNG NHẬP (AUTH)
  // ==========================================
  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Email không tồn tại trên hệ thống.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Mật khẩu không chính xác.' };
    }
    if (user.isBlocked) {
      return { success: false, error: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế.' };
    }
    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (targetRole) => {
    const targetUser = users.find(u => u.role === targetRole);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const register = (name, email, password) => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Họ tên phải có ít nhất 2 ký tự.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Email không đúng định dạng.' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email này đã được đăng ký tài khoản.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Mật khẩu phải có độ dài từ 6 ký tự trở lên.' };
    }

    const newUser = {
      id: `USER-${Date.now().toString().slice(-4)}`,
      name,
      email,
      password,
      role: 'renter',
      balance: 50000, // Tặng 50.000 VNĐ cho tài khoản mới trải nghiệm test
      isBlocked: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // ==========================================
  // NGHIỆP VỤ 2: VÍ & NẠP TIỀN (BVA / EP TEST)
  // ==========================================
  const deposit = (amount, paymentMethod = 'VietQR Auto') => {
    if (!currentUser) {
      return { success: false, error: 'Vui lòng đăng nhập trước khi nạp tiền.' };
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || !Number.isInteger(numAmount)) {
      return { success: false, error: 'Số tiền nạp phải là số nguyên hợp lệ.' };
    }

    // Kiểm tra biên dưới (Boundary Value: min 10,000)
    if (numAmount < 10000) {
      return { success: false, error: 'Số tiền nạp tối thiểu là 10.000 VNĐ.' };
    }

    // Kiểm tra biên trên (Boundary Value: max 5,000,000)
    if (numAmount > 5000000) {
      return { success: false, error: 'Số tiền nạp tối đa mỗi lần là 5.000.000 VNĐ.' };
    }

    // Cộng tiền vào tài khoản người dùng
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === currentUser.id ? { ...u, balance: u.balance + numAmount } : u
      )
    );

    // Ghi nhận lịch sử giao dịch
    const newTx = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      userId: currentUser.id,
      type: 'deposit',
      amount: numAmount,
      paymentMethod,
      status: 'completed',
      timestamp: Date.now(),
      note: `Nạp tiền thành công qua ${paymentMethod}`
    };

    setTransactions(prev => [newTx, ...prev]);
    return { success: true, newBalance: currentUser.balance + numAmount };
  };

  // ==========================================
  // NGHIỆP VỤ 3: THUÊ TÀI KHOẢN GAME
  // ==========================================
  const rentAccount = (accountId, durationHours) => {
    if (!currentUser) {
      return { success: false, error: 'Vui lòng đăng nhập để thuê tài khoản.' };
    }
    if (currentUser.isBlocked) {
      return { success: false, error: 'Tài khoản của bạn đã bị khóa, không thể thuê.' };
    }

    const account = accounts.find(a => a.id === accountId);
    if (!account) {
      return { success: false, error: 'Không tìm thấy tài khoản game.' };
    }

    // Kiểm tra trạng thái tài khoản (Decision Table)
    if (account.status !== 'available') {
      return {
        success: false,
        error: account.status === 'rented'
          ? 'Tài khoản này hiện đang có người thuê. Vui lòng chọn tài khoản khác hoặc quay lại sau.'
          : 'Tài khoản đang trong quá trình bảo trì / đổi mật khẩu.'
      };
    }

    const hours = Number(durationHours);
    if (isNaN(hours) || hours < 1 || hours > 48) {
      return { success: false, error: 'Thời gian thuê phải từ 1 đến 48 giờ.' };
    }

    const totalPrice = account.pricePerHour * hours;

    // Kiểm tra số dư ví (Decision Table: Balance Check)
    if (currentUser.balance < totalPrice) {
      return {
        success: false,
        error: `Số dư ví không đủ (${currentUser.balance.toLocaleString('vi-VN')} đ). Cần thêm ${(totalPrice - currentUser.balance).toLocaleString('vi-VN')} đ để thuê.`,
        needDeposit: true,
        missingAmount: totalPrice - currentUser.balance
      };
    }

    const now = Date.now();
    const endTime = now + (hours * 60 * 60 * 1000);

    // 1. Trừ tiền ví
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id ? { ...u, balance: u.balance - totalPrice } : u
      )
    );

    // 2. Chuyển trạng thái tài khoản sang rented
    setAccounts(prev =>
      prev.map(a =>
        a.id === accountId
          ? { ...a, status: 'rented', rentCount: (a.rentCount || 0) + 1 }
          : a
      )
    );

    // 3. Tạo đơn thuê
    const newOrder = {
      id: `ORDER-${account.gameId.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      accountId: account.id,
      accountTitle: account.title,
      gameId: account.gameId,
      userId: currentUser.id,
      startTime: now,
      durationHours: hours,
      endTime,
      pricePerHour: account.pricePerHour,
      totalPrice,
      secretAccount: account.secretAccount,
      secretPassword: account.secretPassword,
      status: 'active',
      disputeReason: null,
      rating: null
    };

    setRentals(prev => [newOrder, ...prev]);

    // 4. Ghi nhận giao dịch trừ tiền
    const newTx = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      userId: currentUser.id,
      type: 'rental_fee',
      amount: -totalPrice,
      paymentMethod: 'Ví GameRent',
      status: 'completed',
      timestamp: now,
      note: `Thanh toán thuê tài khoản #${account.id} (${hours} giờ)`
    };

    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      order: newOrder,
      secretAccount: account.secretAccount,
      secretPassword: account.secretPassword
    };
  };

  // ==========================================
  // NGHIỆP VỤ 4: GIA HẠN THỜI GIAN THUÊ
  // ==========================================
  const extendRental = (rentalId, extraHours) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental || rental.status !== 'active') {
      return { success: false, error: 'Đơn thuê không hợp lệ hoặc đã kết thúc.' };
    }

    const hours = Number(extraHours);
    if (isNaN(hours) || hours < 1) {
      return { success: false, error: 'Số giờ gia hạn tối thiểu là 1 giờ.' };
    }

    const cost = rental.pricePerHour * hours;
    if (currentUser.balance < cost) {
      return {
        success: false,
        error: `Số dư ví không đủ để gia hạn (Cần thêm ${(cost - currentUser.balance).toLocaleString('vi-VN')} đ).`
      };
    }

    // Trừ tiền ví
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id ? { ...u, balance: u.balance - cost } : u
      )
    );

    // Cập nhật endTime của đơn thuê
    // Nếu đơn thuê đã hết hạn (r.endTime <= Date.now()), gia hạn tính từ thời điểm hiện tại (Date.now())
    // Nếu đơn thuê vẫn còn hạn (r.endTime > Date.now()), cộng nối tiếp vào r.endTime
    setRentals(prev =>
      prev.map(r => {
        if (r.id !== rentalId) return r;
        const baseTime = Math.max(r.endTime, Date.now());
        return {
          ...r,
          durationHours: r.durationHours + hours,
          endTime: baseTime + (hours * 60 * 60 * 1000),
          totalPrice: r.totalPrice + cost
        };
      })
    );

    // Ghi giao dịch
    setTransactions(prev => [
      {
        id: `TX-${Date.now().toString().slice(-5)}`,
        userId: currentUser.id,
        type: 'rental_fee',
        amount: -cost,
        paymentMethod: 'Ví GameRent',
        status: 'completed',
        timestamp: Date.now(),
        note: `Gia hạn đơn thuê #${rental.id} thêm ${hours} giờ`
      },
      ...prev
    ]);

    return { success: true };
  };

  // ==========================================
  // NGHIỆP VỤ 5: THU HỒI / TRẢ ACC SỚM & TỰ ĐỘNG ĐỔI MẬT KHẨU NGẪU NHIÊN
  // ==========================================
  const returnRentalEarly = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return { success: false, error: 'Không tìm thấy đơn thuê.' };

    const targetAccount = accounts.find(a => a.id === rental.accountId);
    const oldPassword = targetAccount ? targetAccount.secretPassword : '';
    const newPassword = generateRandomPassword(oldPassword);

    // 1. Chuyển trạng thái đơn thuê sang 'completed'
    setRentals(prev =>
      prev.map(r => (r.id === rentalId ? { ...r, status: 'completed' } : r))
    );

    // 2. Tự động đổi mật khẩu ngẫu nhiên mới và chuyển tài khoản về 'available' (Sẵn sàng)
    setAccounts(prev =>
      prev.map(a =>
        a.id === rental.accountId
          ? {
              ...a,
              status: 'available',
              secretPassword: newPassword,
              lastPasswordChangedAt: Date.now()
            }
          : a
      )
    );

    // 3. Ghi nhận nhật ký bảo mật hệ thống
    const now = Date.now();
    const newTx = {
      id: `TX-${now.toString().slice(-5)}`,
      userId: currentUser ? currentUser.id : 'SYSTEM',
      type: 'password_reset',
      amount: 0,
      paymentMethod: 'Tự Động Hệ Thống',
      status: 'completed',
      timestamp: now,
      note: `Thu hồi acc #${rental.accountId} & tự động đổi mật khẩu ngẫu nhiên mới bảo vệ tài khoản`
    };
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      newPassword,
      accountId: rental.accountId,
      accountTitle: targetAccount ? targetAccount.title : rental.accountId
    };
  };

  // ==========================================
  // NGHIỆP VỤ 6: KHIẾU NẠI & TRANH CHẤP
  // ==========================================
  const fileDispute = (rentalId, reason, note) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return { success: false, error: 'Không tìm thấy đơn thuê.' };

    const newDispute = {
      id: `DISP-${Date.now().toString().slice(-4)}`,
      orderId: rental.id,
      accountId: rental.accountId,
      userId: currentUser.id,
      userName: currentUser.name,
      reason,
      note,
      createdAt: Date.now(),
      status: 'pending',
      amount: rental.totalPrice
    };

    setDisputes(prev => [newDispute, ...prev]);

    setRentals(prev =>
      prev.map(r =>
        r.id === rentalId ? { ...r, status: 'disputed', disputeReason: reason } : r
      )
    );

    return { success: true };
  };

  const resolveDispute = (disputeId, action) => {
    // action: 'refund' | 'reject'
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    if (action === 'refund') {
      // Hoàn tiền cho người dùng
      setUsers(prev =>
        prev.map(u =>
          u.id === dispute.userId ? { ...u, balance: u.balance + dispute.amount } : u
        )
      );

      // Ghi log hoàn tiền
      setTransactions(prev => [
        {
          id: `TX-RF-${Date.now().toString().slice(-4)}`,
          userId: dispute.userId,
          type: 'refund',
          amount: dispute.amount,
          paymentMethod: 'Hệ thống hoàn tiền',
          status: 'completed',
          timestamp: Date.now(),
          note: `Hoàn tiền tranh chấp đơn #${dispute.orderId} (${dispute.reason})`
        },
        ...prev
      ]);

      // Chuyển acc sang bảo trì
      setAccounts(prev =>
        prev.map(a =>
          a.id === dispute.accountId ? { ...a, status: 'maintenance' } : a
        )
      );
    }

    setDisputes(prev =>
      prev.map(d =>
        d.id === disputeId
          ? { ...d, status: action === 'refund' ? 'resolved' : 'rejected' }
          : d
      )
    );
  };

  // ==========================================
  // NGHIỆP VỤ 7: QUẢN LÝ ACC DÀNH CHO ADMIN
  // ==========================================
  const addAccount = (accountData) => {
    const newAcc = {
      ...accountData,
      id: `ACC-${accountData.gameId.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-3)}`,
      status: 'available',
      rating: 5.0,
      rentCount: 0
    };
    setAccounts(prev => [newAcc, ...prev]);
    return { success: true, account: newAcc };
  };

  const updateAccount = (accountId, updatedData) => {
    setAccounts(prev =>
      prev.map(a => (a.id === accountId ? { ...a, ...updatedData } : a))
    );
    return { success: true };
  };

  const toggleAccountStatus = (accountId, newStatus) => {
    setAccounts(prev =>
      prev.map(a => (a.id === accountId ? { ...a, status: newStatus } : a))
    );
  };

  const deleteAccount = (accountId) => {
    setAccounts(prev => prev.filter(a => a.id !== accountId));
  };

  // ==========================================
  // NGHIỆP VỤ 8: QUẢN LÝ KHÁCH HÀNG
  // ==========================================
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: customerData.id || `KH${String(customers.length + 1).padStart(3, '0')}`,
      totalOrders: Number(customerData.totalOrders) || 0,
      totalSpent: Number(customerData.totalSpent) || 0,
      status: customerData.status || 'active',
      avatar: customerData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return { success: true, customer: newCustomer };
  };

  const updateCustomer = (customerId, updatedData) => {
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, ...updatedData } : c))
    );
    return { success: true };
  };

  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    return { success: true };
  };

  // ==========================================
  // TESTER UTILITY: HỖ TRỢ KIỂM THỬ 1-CLICK
  // ==========================================
  const resetToDefaultData = () => {
    localStorage.clear();
    setAccounts(INITIAL_ACCOUNTS);
    setUsers(INITIAL_USERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCurrentUser(INITIAL_USERS[0]);
    setRentals(INITIAL_RENTALS.map(r => ({ ...r, status: 'completed' })));
    setTransactions(INITIAL_TRANSACTIONS);
    setDisputes(INITIAL_DISPUTES);
  };

  const addTestBalance = (amount = 200000) => {
    if (!currentUser) return;
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id ? { ...u, balance: u.balance + amount } : u
      )
    );
  };

  const fastForwardRentalTime = (rentalId, minutes = 60) => {
    setRentals(prev =>
      prev.map(r =>
        r.id === rentalId
          ? { ...r, endTime: r.endTime - (minutes * 60 * 1000) }
          : r
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        accounts,
        users,
        customers,
        currentUser,
        rentals,
        transactions,
        disputes,
        login,
        logout,
        register,
        switchRole,
        deposit,
        rentAccount,
        extendRental,
        returnRentalEarly,
        fileDispute,
        resolveDispute,
        addAccount,
        updateAccount,
        toggleAccountStatus,
        deleteAccount,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        resetToDefaultData,
        addTestBalance,
        fastForwardRentalTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
