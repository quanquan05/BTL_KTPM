// Dữ liệu ban đầu cho ứng dụng Website Cho Thuê Tài Khoản Game (Hỗ trợ BTL Kiểm thử phần mềm)

export const CATEGORIES = [
  {
    id: "lien-quan",
    name: "Liên Quân Mobile",
    publisher: "Garena",
    icon: "Shield",
    badgeColor: "#FF8C00",
    ranks: ["Vàng", "Bạch Kim", "Kim Cương", "Tinh Anh", "Cao Thủ", "Chiến Tướng"],
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    icon: "Crosshair",
    badgeColor: "#FF4655",
    ranks: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Ascendant", "Immortal", "Radiant"],
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    icon: "Sparkles",
    badgeColor: "#7928CA",
    ranks: ["AR 50", "AR 55", "AR 58", "AR 60 (Max Level)"],
    banner: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fo4",
    name: "FC Online (FO4)",
    publisher: "Garena / Nexon",
    icon: "Trophy",
    badgeColor: "#10B981",
    ranks: ["Nghiệp Dư", "Bán Chuyên", "Chuyên Nghiệp", "Thế Giới", "Tinh Anh", "Siêu Sao"],
    banner: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pubg",
    name: "PUBG PC / Steam",
    publisher: "Krafton",
    icon: "Flame",
    badgeColor: "#F59E0B",
    ranks: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ"],
    banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "toc-chien",
    name: "LMHT: Tốc Chiến",
    publisher: "VNG Games",
    icon: "Zap",
    badgeColor: "#00F2FE",
    ranks: ["Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Đại Cao Thủ", "Thách Đấu"],
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_ACCOUNTS = [
  {
    id: "ACC-LQ-01",
    gameId: "lien-quan",
    title: "Acc Chiến Tướng 50 Sao - Full Tướng - Flo Tinh Hệ + Nak Thứ Nguyên Vệ Thần",
    rank: "Chiến Tướng",
    server: "Mặt Trời (VN)",
    skinsCount: 245,
    highlightSkins: ["Florentino Tinh Hệ", "Nakroth Thứ Nguyên Vệ Thần", "Raz Muay Thái", "Tulen Tân Thần Thiên Hà"],
    pricePerHour: 15000,
    status: "available", // available | rented | maintenance | need_change_pass
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    secretAccount: "lq_chientuong_01",
    secretPassword: "GameRentPassLQ@2026",
    winRate: "68.5%",
    description: "Tài khoản sạch 100% tự cày, full ngọc 90 viên chuẩn đi rừng, đầy đủ skin bậc SSS hữu hạn. Cam kết không tool hack.",
    rating: 4.9,
    rentCount: 84
  },
  {
    id: "ACC-LQ-02",
    gameId: "lien-quan",
    title: "Acc Cao Thủ 15 Sao - Ngộ Không Nhóc Tì + All Tướng Sát Thủ",
    rank: "Cao Thủ",
    server: "Mặt Trời (VN)",
    skinsCount: 160,
    highlightSkins: ["Ngộ Không Nhóc Tì Bá Đạo", "Murad Siêu Việt", "Airi Kiem Sakura"],
    pricePerHour: 10000,
    status: "available",
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    secretAccount: "lq_caothu_ngokhong",
    secretPassword: "PassKTPM#LQ99",
    winRate: "59.2%",
    description: "Chuyên trị leo rank đơn, bảng ngọc hoàn chỉnh cho xạ thủ và sát thủ. Đổi pass tự động sau ca thuê.",
    rating: 4.8,
    rentCount: 42
  },
  {
    id: "ACC-VAL-01",
    gameId: "valorant",
    title: "Acc Radiant Top 200 - Kuronami Vandal + Reaver Karambit + Prime Phantom",
    rank: "Radiant",
    server: "Asia / Hong Kong",
    skinsCount: 38,
    highlightSkins: ["Kuronami Vandal", "Reaver Karambit", "Prime Phantom", "Sovereign Ghost"],
    pricePerHour: 25000,
    status: "available",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    secretAccount: "val_radiant_kuronami",
    secretPassword: "VandalKuronami@2026",
    winRate: "72.1%",
    description: "Tài khoản tuyển thủ thi đấu, MMR cực cao bắn sướng tay. Có sẵn nhiều Skin nâng cấp tối đa hiệu ứng âm thanh và kết liễu.",
    rating: 5.0,
    rentCount: 115
  },
  {
    id: "ACC-VAL-02",
    gameId: "valorant",
    title: "Acc Immortal 2 - Champion 2023 Vandal + Oni 2.0 Katana",
    rank: "Immortal",
    server: "Asia / Singapore",
    skinsCount: 22,
    highlightSkins: ["Champions 2023 Vandal", "Oni Katana", "Glitchpop Dagger"],
    pricePerHour: 18000,
    status: "rented", // Đang có người thuê để test hiển thị
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
    secretAccount: "val_immortal_champ",
    secretPassword: "OniKatana#888",
    winRate: "61.4%",
    description: "Acc leo rank tryhard, skin hiệu ứng độc quyền Champions không mở bán lại. Tặng kèm skin súng lục Ghost Sovereign.",
    rating: 4.7,
    rentCount: 63
  },
  {
    id: "ACC-GEN-01",
    gameId: "genshin",
    title: "Acc AR 60 Max - Raiden Shogun C2 Trấn R5 + Furina C6 + Neuvillette",
    rank: "AR 60 (Max Level)",
    server: "Asia",
    skinsCount: 18,
    highlightSkins: ["Raiden C2 Trấn", "Furina C6 R1", "Arlecchino Trấn", "Kazuha"],
    pricePerHour: 20000,
    status: "available",
    thumbnail: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
    secretAccount: "genshin_ar60_whale",
    secretPassword: "FurinaWhaleC6@2026",
    winRate: "100% La Hoàn",
    description: "Acc Whale siêu khủng, vét sạch La Hoàn Tầng 12 trong 1 nốt nhạc. Hơn 40 nhân vật 5 sao full thánh di vật thần thánh.",
    rating: 5.0,
    rentCount: 97
  },
  {
    id: "ACC-FO4-01",
    gameId: "fo4",
    title: "Đội Hình Real Madrid 250 Trăm Tỷ - Ronaldo BTB +8, Gullit Icon +5",
    rank: "Thế Giới",
    server: "Garena VN",
    skinsCount: 11,
    highlightSkins: ["Ronaldo BTB +8", "Gullit ICON +5", "Zidane +7", "Courtois 23TS +8"],
    pricePerHour: 12000,
    status: "available",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    secretAccount: "fo4_real_250t",
    secretPassword: "GullitRealMadrid@99",
    winRate: "64.0%",
    description: "Đội hình toàn siêu sao mạ bạc mạ vàng, đè người bao sút xa. Giá trị đội hình khủng test cảm giác đập bóng siêu mượt.",
    rating: 4.9,
    rentCount: 55
  },
  {
    id: "ACC-PUBG-01",
    gameId: "pubg",
    title: "Acc Steam PUBG - M416 Phượng Hoàng Cấp 10 + Beryl Bướm Đêm",
    rank: "Kim Cương",
    server: "Steam Asia / SEA",
    skinsCount: 45,
    highlightSkins: ["M416 Phượng Hoàng Lv10", "Beryl Bướm Đêm", "Bộ đồ B.Duck"],
    pricePerHour: 15000,
    status: "available",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    secretAccount: "steam_pubg_phoenix",
    secretPassword: "PubgM416Lv10#2026",
    winRate: "3.8 K/D",
    description: "Acc PUBG Steam có sẵn gói Plus, súng nâng cấp hiệu ứng khói màu và hòm xác cực đẹp. Chơi không lo ban nick.",
    rating: 4.8,
    rentCount: 39
  },
  {
    id: "ACC-TC-01",
    gameId: "toc-chien",
    title: "Acc Tốc Chiến Thách Đấu - Yasuo Ma Kiếm + Yone Hoa Linh Lục Địa",
    rank: "Thách Đấu",
    server: "VNG Vietnam",
    skinsCount: 88,
    highlightSkins: ["Yasuo Ma Kiếm", "Yone Hoa Linh", "Zed Tử Thần Không Gian"],
    pricePerHour: 8000,
    status: "maintenance", // Đang bảo trì để test logic kiểm thử
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    secretAccount: "tc_thachdau_yasuo",
    secretPassword: "HasagiHasagi@2026",
    winRate: "63.5%",
    description: "Tài khoản đang được bảo trì cập nhật mật khẩu 2FA. Tạm thời không thể đặt thuê.",
    rating: 4.6,
    rentCount: 28
  }
];

export const INITIAL_USERS = [
  {
    id: "USER-01",
    name: "Nguyễn Văn Tester",
    email: "user@demo.com",
    password: "password123",
    role: "renter",
    balance: 150000, // 150.000 VNĐ sẵn trong ví để test thuê
    isBlocked: false,
    phone: "0987654321",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ADMIN-01",
    name: "Quản Trị Viên Shop",
    email: "admin@gamerent.vn",
    password: "admin123",
    role: "admin",
    balance: 9999000,
    isBlocked: false,
    phone: "0909999999",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
  }
];

// Tạo sẵn 1 đơn thuê đang hoạt động để khi mở web lên thấy ngay đồng hồ đếm ngược
const now = Date.now();
export const INITIAL_RENTALS = [
  {
    id: "ORDER-VAL-7721",
    accountId: "ACC-VAL-02",
    accountTitle: "Acc Immortal 2 - Champion 2023 Vandal + Oni 2.0 Katana",
    gameId: "valorant",
    userId: "USER-01",
    startTime: now - (45 * 60 * 1000), // đã thuê 45 phút trước
    durationHours: 2,
    endTime: now + (75 * 60 * 1000), // còn lại 1h 15 phút
    pricePerHour: 18000,
    totalPrice: 36000,
    secretAccount: "val_immortal_champ",
    secretPassword: "OniKatana#888",
    status: "active", // active | completed | disputed
    disputeReason: null,
    rating: null
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TX-9901",
    userId: "USER-01",
    type: "deposit",
    amount: 200000,
    paymentMethod: "VietQR Auto",
    status: "completed",
    timestamp: now - (2 * 60 * 60 * 1000),
    note: "Nạp tiền tự động qua VietQR"
  },
  {
    id: "TX-9902",
    userId: "USER-01",
    type: "rental_fee",
    amount: -36000,
    paymentMethod: "Ví GameRent",
    status: "completed",
    timestamp: now - (45 * 60 * 1000),
    note: "Thanh toán thuê tài khoản #ACC-VAL-02 (2 giờ)"
  }
];

export const INITIAL_DISPUTES = [
  {
    id: "DISP-101",
    orderId: "ORDER-OLD-55",
    accountId: "ACC-TC-01",
    userId: "USER-01",
    reason: "Sai mật khẩu đăng nhập",
    note: "Mật khẩu báo không đúng khi đăng nhập vào client VNG lúc 21h.",
    createdAt: now - (24 * 60 * 60 * 1000),
    status: "pending", // pending | resolved | rejected
    amount: 16000
  }
];
