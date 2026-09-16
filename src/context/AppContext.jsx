import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CATEGORIES,
  INITIAL_ACCOUNTS,
  INITIAL_USERS,
  INITIAL_RENTALS,
  INITIAL_TRANSACTIONS,
  INITIAL_DISPUTES
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Quản lý trạng thái từ LocalStorage hoặc dữ liệu ban đầu
  const [categories] = useState(CATEGORIES);

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('gamerent_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('gamerent_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gamerent_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.role === 'admin' || parsed.id === 'ADMIN-01') {
        return { ...parsed, name: 'Lê Minh Quân', balance: 3000000 };
      }
      return parsed;
    }
    return INITIAL_USERS[0]; // Mặc định Lê Minh Quân (Admin)
  });

  const [rentals, setRentals] = useState(() => {
    const saved = localStorage.getItem('gamerent_rentals');
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('gamerent_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem('gamerent_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  // Tự động lưu vào LocalStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem('gamerent_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('gamerent_users', JSON.stringify(users));
  }, [users]);

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
  // NGHIỆP VỤ 5: TRẢ ACC SỚM & KẾT THÚC ĐƠN
  // ==========================================
  const returnRentalEarly = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return { success: false, error: 'Không tìm thấy đơn thuê.' };

    setRentals(prev =>
      prev.map(r => (r.id === rentalId ? { ...r, status: 'completed' } : r))
    );

    // Chuyển tài khoản sang trạng thái need_change_pass (Cần đổi pass)
    setAccounts(prev =>
      prev.map(a =>
        a.id === rental.accountId ? { ...a, status: 'need_change_pass' } : a
      )
    );

    return { success: true };
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

  const toggleAccountStatus = (accountId, newStatus) => {
    setAccounts(prev =>
      prev.map(a => (a.id === accountId ? { ...a, status: newStatus } : a))
    );
  };

  const deleteAccount = (accountId) => {
    setAccounts(prev => prev.filter(a => a.id !== accountId));
  };

  // ==========================================
  // TESTER UTILITY: HỖ TRỢ KIỂM THỬ 1-CLICK
  // ==========================================
  const resetToDefaultData = () => {
    localStorage.clear();
    const freshNow = Date.now();
    const freshRentals = INITIAL_RENTALS.map(r => ({
      ...r,
      startTime: freshNow - (45 * 60 * 1000),
      endTime: freshNow + (75 * 60 * 1000)
    }));
    setAccounts(INITIAL_ACCOUNTS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setRentals(freshRentals);
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
        toggleAccountStatus,
        deleteAccount,
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
