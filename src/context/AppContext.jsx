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
    const saved = safeGetJSON('gamerent_accounts', INITIAL_ACCOUNTS).filter(a => a.id !== 'ACC-LQ-REAL');
    const existingIds = new Set(saved.map(a => a.id));
    const merged = [
      ...INITIAL_ACCOUNTS.filter(init => !existingIds.has(init.id)),
      ...saved
    ];
    // Luôn đồng bộ thumbnail, skinDetails và galleryImages chân thực từ INITIAL_ACCOUNTS
    return merged.map(acc => {
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

  const [users, setUsers] = useState(() => {
    const rawUsers = safeGetJSON('gamerent_users', INITIAL_USERS);
    const cleaned = rawUsers
      .filter(u => u.email !== 'user@demo.com' && u.id !== 'USER-01')
      .map(u => (u.id === 'ADMIN-01' ? { ...u, name: 'Quản Lý' } : u));
    return cleaned.length > 0 ? cleaned : INITIAL_USERS;
  });


  const [currentUser, setCurrentUser] = useState(() => {
    // Khởi tạo từ localStorage nếu có phiên đăng nhập trước đó; nếu chưa có thì mặc định null (chưa đăng nhập)
    const savedUser = safeGetJSON('gamerent_current_user', null);
    if (!savedUser) return null;
    const rawUsers = safeGetJSON('gamerent_users', INITIAL_USERS);
    const matched = rawUsers.find(
      u => u.id === savedUser.id || (u.email && savedUser.email && u.email.toLowerCase() === savedUser.email.toLowerCase())
    );
    return matched ? { ...savedUser, ...matched } : savedUser;
  });

  const [rentals, setRentals] = useState(() => {
    const raw = safeGetJSON('gamerent_rentals', INITIAL_RENTALS);
    // Đồng bộ đúng thực tế: Nếu đơn đã qua thời gian kết thúc thì trạng thái là completed
    return raw.map(r => (r.status === 'active' && r.endTime <= Date.now() ? { ...r, status: 'completed' } : r));
  });
  const [transactions, setTransactions] = useState(() => safeGetJSON('gamerent_transactions', INITIAL_TRANSACTIONS));
  const [disputes, setDisputes] = useState(() => safeGetJSON('gamerent_disputes', INITIAL_DISPUTES));
  const [customers, setCustomers] = useState(() => {
    const saved = safeGetJSON('gamerent_customers', INITIAL_CUSTOMERS);
    const sampleEmails = ['admin_kh01@gmail.com', 'hung.nguyen@gmail.com', 'gia.tran@hotmail.com', 'minh.tuan@yahoo.com'];
    return saved.filter(c => !sampleEmails.includes(c.email));
  });
  const [notifications, setNotifications] = useState(() => safeGetJSON('gamerent_notifications', []));

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
    if (currentUser) {
      localStorage.setItem('gamerent_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gamerent_current_user');
    }
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

  useEffect(() => {
    localStorage.setItem('gamerent_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
  // HỆ THỐNG TỰ ĐỘNG THU HỒI & ĐỔI MẬT KHẨU KHI HẾT GIỜ (REALTIME CRON)
  // ==========================================
  const autoExpireAndResetPassword = (rentalId) => {
    setRentals(prevRentals => {
      const rental = prevRentals.find(r => r.id === rentalId);
      if (!rental || rental.status !== 'active') return prevRentals;

      const targetAccount = accounts.find(a => a.id === rental.accountId);
      const oldPassword = targetAccount ? targetAccount.secretPassword : (rental.secretPassword || '');
      const newPassword = generateRandomPassword(oldPassword);
      const now = Date.now();

      // 1. Chuyển trạng thái đơn thuê sang 'completed' (đã thu hồi)
      const updatedRentals = prevRentals.map(r =>
        r.id === rentalId
          ? {
              ...r,
              status: 'completed',
              isRevoked: true,
              revokedAt: now,
              revocationReason: 'expired_auto',
              previousPassword: oldPassword
            }
          : r
      );

      // 2. Tự động đổi mật khẩu ngẫu nhiên mới và chuyển tài khoản về 'available'
      setAccounts(prevAccs =>
        prevAccs.map(a =>
          a.id === rental.accountId
            ? {
                ...a,
                status: 'available',
                secretPassword: newPassword,
                previousPassword: oldPassword,
                lastPasswordChangedAt: now
              }
            : a
        )
      );

      // 3. Ghi log kiểm toán bảo mật
      const newTx = {
        id: `TX-REVOKE-${now.toString().slice(-5)}`,
        userId: 'SYSTEM',
        type: 'password_reset',
        amount: 0,
        paymentMethod: 'Tự Động Hệ Thống',
        status: 'completed',
        timestamp: now,
        note: `Hết hạn thuê: Tự động thu hồi acc #${rental.accountId} (${targetAccount?.secretAccount || rental.secretAccount}) & đổi mật khẩu mới`
      };
      setTransactions(prevTx => [newTx, ...prevTx]);

      // 4. Lưu vết thông báo vào chuông thông báo cho khách hàng
      const accTitle = targetAccount?.title || rental.accountTitle || 'Tài khoản game';
      const secAcc = targetAccount?.secretAccount || rental.secretAccount || 'acc_game';
      const newNotification = {
        id: `NOTIF-${now}-${Math.floor(100 + Math.random() * 900)}`,
        userId: rental.userId,
        rentalId: rental.id,
        accountId: rental.accountId,
        accountTitle: accTitle,
        secretAccount: secAcc,
        oldPassword,
        newPassword,
        type: 'rental_expired_auto',
        title: 'Ca thuê đã hết giờ & Hệ thống tự động thu hồi',
        message: `Ca thuê "${accTitle}" (${secAcc}) đã hết thời gian thuê. Hệ thống đã tự động thu hồi tài khoản, vô hiệu mật khẩu cũ (${oldPassword}) và cập nhật mật khẩu mới (${newPassword}).`,
        timestamp: now,
        isRead: false
      };

      setNotifications(prevNotifs => {
        if (prevNotifs.some(n => n.rentalId === rental.id && n.type === 'rental_expired_auto')) {
          return prevNotifs;
        }
        return [newNotification, ...prevNotifs];
      });

      // Bắn Custom Event để UI nhận thông báo ngay
      window.dispatchEvent(
        new CustomEvent('gamerent_account_revoked', {
          detail: {
            rentalId,
            accountId: rental.accountId,
            accountTitle: targetAccount?.title || rental.accountTitle,
            secretAccount: targetAccount?.secretAccount || rental.secretAccount,
            oldPassword,
            newPassword,
            rentalUserId: rental.userId,
            reason: 'expired_auto'
          }
        })
      );

      return updatedRentals;
    });
  };

  // Quét các đơn thuê hết hạn theo thời gian thực (chu kỳ 1 giây)
  useEffect(() => {
    const checkExpiredRentals = () => {
      const now = Date.now();
      const expiredList = rentals.filter(r => r.status === 'active' && r.endTime <= now);
      if (expiredList.length === 0) return;

      expiredList.forEach(expiredRental => {
        autoExpireAndResetPassword(expiredRental.id);
      });
    };

    const timer = setInterval(checkExpiredRentals, 1000);
    return () => clearInterval(timer);
  }, [rentals, accounts]);

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
    try {
      localStorage.removeItem('gamerent_current_user');
    } catch (e) {
      console.warn('Lỗi xóa gamerent_current_user:', e);
    }
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
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'renter',
      balance: 50000, // Tặng 50.000 VNĐ cho tài khoản mới trải nghiệm test
      isBlocked: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    setUsers(prev => [newUser, ...prev]);

    // Yêu cầu 3: Tự động thêm khách hàng mới vào danh sách quản trị (CRM)
    const customerCode = `KH${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer = {
      id: customerCode,
      name: newUser.name,
      phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      email: newUser.email,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      avatar: newUser.avatar,
      createdAt: Date.now()
    };
    setCustomers(prev => [newCustomer, ...prev]);

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
    setCurrentUser(prev => (prev ? { ...prev, balance: prev.balance - totalPrice } : prev));

    // 2. Chuyển trạng thái tài khoản sang rented
    setAccounts(prev =>
      prev.map(a =>
        a.id === accountId
          ? { ...a, status: 'rented', rentCount: (a.rentCount || 0) + 1 }
          : a
      )
    );

    // 3. Tạo đơn thuê
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const isAdminUser = currentUser.role === 'admin' || currentUser.id === 'ADMIN-01';
    const matchingCustomer = customers.find(c => c.email && c.email.toLowerCase() === (currentUser.email || '').toLowerCase());
    const assignedCode = isAdminUser ? '#ADMIN-01' : (matchingCustomer ? `#${matchingCustomer.id}` : '#KH001');

    const newOrder = {
      id: `ORDER-${account.gameId.toUpperCase()}-${Date.now().toString().slice(-4)}${randomSuffix}`,
      accountId: account.id,
      accountTitle: account.title,
      gameId: account.gameId,
      userId: currentUser.id,
      customerName: isAdminUser ? (currentUser.name || 'Quản Lý (Admin)') : (currentUser.name || 'Khách Hàng'),
      customerCode: assignedCode,
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

    // Tự động cập nhật số đơn và chi tiêu cho khách hàng trong CRM
    if (!isAdminUser && matchingCustomer) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === matchingCustomer.id
            ? {
                ...c,
                totalOrders: (c.totalOrders || 0) + 1,
                totalSpent: (c.totalSpent || 0) + totalPrice
              }
            : c
        )
      );
    }

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
    const oldPassword = targetAccount ? targetAccount.secretPassword : (rental.secretPassword || '');
    const newPassword = generateRandomPassword(oldPassword);
    const now = Date.now();
    const isByAdmin = currentUser?.role === 'admin';

    // 1. Chuyển trạng thái đơn thuê sang 'completed'
    setRentals(prev =>
      prev.map(r =>
        r.id === rentalId
          ? {
              ...r,
              status: 'completed',
              isRevoked: true,
              revokedAt: now,
              revocationReason: isByAdmin ? 'admin_revoked' : 'user_returned_early',
              previousPassword: oldPassword
            }
          : r
      )
    );

    // 2. Tự động đổi mật khẩu ngẫu nhiên mới và chuyển tài khoản về 'available' (Sẵn sàng)
    setAccounts(prev =>
      prev.map(a =>
        a.id === rental.accountId
          ? {
              ...a,
              status: 'available',
              secretPassword: newPassword,
              previousPassword: oldPassword,
              lastPasswordChangedAt: now
            }
          : a
      )
    );

    // 3. Ghi nhận nhật ký bảo mật hệ thống
    const newTx = {
      id: `TX-${now.toString().slice(-5)}`,
      userId: currentUser ? currentUser.id : 'SYSTEM',
      type: 'password_reset',
      amount: 0,
      paymentMethod: isByAdmin ? 'Quản Trị Viên Thu Hồi' : 'Khách Trả Sớm',
      status: 'completed',
      timestamp: now,
      note: `${isByAdmin ? 'Admin thu hồi' : 'Khách trả sớm'} acc #${rental.accountId} (${targetAccount?.secretAccount || rental.secretAccount}) & tự động đổi mật khẩu mới bảo vệ tài khoản`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Lưu vết thông báo vào chuông nếu Admin thu hồi tài khoản của khách
    if (isByAdmin && rental.userId) {
      const accTitle = targetAccount?.title || rental.accountTitle || 'Tài khoản game';
      const secAcc = targetAccount?.secretAccount || rental.secretAccount || 'acc_game';
      const adminNotif = {
        id: `NOTIF-${now}-${Math.floor(100 + Math.random() * 900)}`,
        userId: rental.userId,
        rentalId: rental.id,
        accountId: rental.accountId,
        accountTitle: accTitle,
        secretAccount: secAcc,
        oldPassword,
        newPassword,
        type: 'rental_revoked_by_admin',
        title: 'Quản trị viên đã thu hồi ca thuê',
        message: `Ca thuê "${accTitle}" (${secAcc}) đã được quản trị viên thu hồi. Mật khẩu cũ (${oldPassword}) đã bị vô hiệu hóa.`,
        timestamp: now,
        isRead: false
      };
      setNotifications(prevNotifs => [adminNotif, ...prevNotifs]);
    }

    window.dispatchEvent(
      new CustomEvent('gamerent_account_revoked', {
        detail: {
          rentalId,
          accountId: rental.accountId,
          accountTitle: targetAccount ? targetAccount.title : rental.accountTitle,
          secretAccount: targetAccount ? targetAccount.secretAccount : rental.secretAccount,
          oldPassword,
          newPassword,
          rentalUserId: rental.userId,
          reason: isByAdmin ? 'admin_revoked' : 'user_returned_early'
        }
      })
    );

    return {
      success: true,
      oldPassword,
      newPassword,
      accountId: rental.accountId,
      accountTitle: targetAccount ? targetAccount.title : rental.accountTitle,
      secretAccount: targetAccount ? targetAccount.secretAccount : rental.secretAccount
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
  // QUẢN LÝ THÔNG BÁO (NOTIFICATIONS)
  // ==========================================
  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = (userId) => {
    setNotifications(prev =>
      prev.map(n => (n.userId === userId ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearUserNotifications = (userId) => {
    setNotifications(prev => prev.filter(n => n.userId !== userId));
  };

  // ==========================================
  // TESTER UTILITY: HỖ TRỢ KIỂM THỬ 1-CLICK
  // ==========================================
  const resetToDefaultData = () => {
    localStorage.clear();
    setAccounts(INITIAL_ACCOUNTS);
    setUsers(INITIAL_USERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCurrentUser(null);
    setRentals(INITIAL_RENTALS.map(r => ({ ...r, status: 'completed' })));
    setTransactions(INITIAL_TRANSACTIONS);
    setDisputes(INITIAL_DISPUTES);
    setNotifications([]);
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
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearUserNotifications,
        login,
        logout,
        register,
        switchRole,
        deposit,
        rentAccount,
        extendRental,
        returnRentalEarly,
        autoExpireAndResetPassword,
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
