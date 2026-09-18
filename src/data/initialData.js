// Dữ liệu ban đầu cho ứng dụng Website Cho Thuê Tài Khoản Game (Hỗ trợ BTL Kiểm thử phần mềm)

export const CATEGORIES = [
  {
    id: "lien-quan",
    name: "Liên Quân Mobile",
    publisher: "Garena",
    icon: "Shield",
    badgeColor: "#FF8C00",
    ranks: ["Vàng", "Bạch Kim", "Kim Cương", "Tinh Anh", "Cao Thủ", "Chiến Tướng"],
    banner: "/images/games/lien-quan.jpg"
  },
  {
    id: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    icon: "Crosshair",
    badgeColor: "#FF4655",
    ranks: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Ascendant", "Immortal", "Radiant"],
    banner: "/images/games/valorant.jpg"
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    icon: "Sparkles",
    badgeColor: "#7928CA",
    ranks: ["AR 50", "AR 55", "AR 58", "AR 60 (Max Level)"],
    banner: "/images/games/genshin.jpg"
  },
  {
    id: "fo4",
    name: "FC Online (FO4)",
    publisher: "Garena / Nexon",
    icon: "Trophy",
    badgeColor: "#10B981",
    ranks: ["Nghiệp Dư", "Bán Chuyên", "Chuyên Nghiệp", "Thế Giới", "Tinh Anh", "Siêu Sao"],
    banner: "/images/games/fo4.jpg"
  },
  {
    id: "pubg",
    name: "PUBG PC / Steam",
    publisher: "Krafton",
    icon: "Flame",
    badgeColor: "#F59E0B",
    ranks: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ"],
    banner: "/images/games/pubg.jpg"
  },
  {
    id: "toc-chien",
    name: "LMHT: Tốc Chiến",
    publisher: "VNG Games",
    icon: "Zap",
    badgeColor: "#00F2FE",
    ranks: ["Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Đại Cao Thủ", "Thách Đấu"],
    banner: "/images/games/toc-chien.jpg"
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
    skinDetails: [
      { name: "Florentino Tinh Hệ", tier: "Bậc SSS Hữu Hạn", image: "/images/skins/florentino-tinh-he.jpg" },
      { name: "Nakroth Thứ Nguyên Vệ Thần", tier: "Bậc SSS Anime Limited", image: "/images/skins/nakroth-thu-nguyen.jpg" },
      { name: "Raz Muay Thái", tier: "Bậc SS Tuyệt Sắc", image: "/images/skins/raz-muay-thai.jpg" },
      { name: "Tulen Tân Thần Thiên Hà", tier: "Bậc SSS Huyền Thoại", image: "/images/skins/tulen-thien-ha.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "Florentino Tinh Hệ - Kiếm Sư Vũ Trụ", url: "/images/skins/florentino-tinh-he.jpg" },
      { id: 1, title: "Nakroth Thứ Nguyên Vệ Thần Anime", url: "/images/skins/nakroth-thu-nguyen.jpg" },
      { id: 2, title: "Raz Muay Thái & Bộ Ngọc Rừng 90", url: "/images/skins/raz-muay-thai.jpg" },
      { id: 3, title: "Tulen Tân Thần Thiên Hà & WR 68.5%", url: "/images/skins/tulen-thien-ha.jpg" }
    ],
    pricePerHour: 15000,
    status: "available", // available | rented | maintenance | need_change_pass
    thumbnail: "/images/accounts/acc-lq-01.jpg",
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
    highlightSkins: ["Ngộ Không Nhóc Tì Bá Đạo", "Murad Siêu Việt", "Airi Kiếm Sakura"],
    skinDetails: [
      { name: "Ngộ Không Nhóc Tì Bá Đạo", tier: "Bậc SS Tuyệt Sắc", image: "/images/skins/ngo-khong-nhoc-ti.jpg" },
      { name: "Murad Siêu Việt", tier: "Bậc SSS Công Nghệ", image: "/images/skins/murad-sieu-viet.jpg" },
      { name: "Airi Kiếm Sakura", tier: "Bậc SS Hữu Hạn", image: "/images/skins/airi-sakura.png" }
    ],
    galleryImages: [
      { id: 0, title: "Ngộ Không Nhóc Tì Bá Đạo Độc Quyền", url: "/images/skins/ngo-khong-nhoc-ti.jpg" },
      { id: 1, title: "Murad Siêu Việt Cực Phẩm Tàn Ảnh", url: "/images/skins/murad-sieu-viet.jpg" },
      { id: 2, title: "Airi Kiếm Sakura Hoa Anh Đào", url: "/images/skins/airi-sakura.png" },
      { id: 3, title: "Chiến Tích Cao Thủ 15 Sao - WR 59.2%", url: "/images/accounts/acc-lq-02.jpg" }
    ],
    pricePerHour: 10000,
    status: "available",
    thumbnail: "/images/accounts/acc-lq-02.jpg",
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
    skinDetails: [
      { name: "Kuronami Vandal", tier: "Exclusive Edition", image: "/images/skins/kuronami-vandal.png" },
      { name: "Reaver Karambit", tier: "Premium Melee", image: "/images/skins/reaver-karambit.png" },
      { name: "Prime Phantom", tier: "Ultra Edition", image: "/images/skins/prime-phantom.png" },
      { name: "Sovereign Ghost", tier: "Deluxe Edition", image: "/images/skins/sovereign-ghost.png" }
    ],
    galleryImages: [
      { id: 0, title: "Kuronami Bundle - Bộ Nhẫn Giả Sấm Sét", url: "/images/accounts/acc-val-01.png" },
      { id: 1, title: "Kuronami Vandal - Kết Liễu Bão Nước", url: "/images/skins/kuronami-vandal.png" },
      { id: 2, title: "Reaver Karambit Múa Dao Vô Cực", url: "/images/skins/reaver-karambit.png" },
      { id: 3, title: "Prime Phantom & Rank Radiant Top 200", url: "/images/skins/prime-phantom.png" }
    ],
    pricePerHour: 25000,
    status: "available",
    thumbnail: "/images/accounts/acc-val-01.png",
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
    skinDetails: [
      { name: "Champions 2023 Vandal", tier: "Limited Champions", image: "/images/skins/champions-vandal.png" },
      { name: "Oni Katana", tier: "Premium Melee", image: "/images/skins/oni-katana.png" },
      { name: "Glitchpop Dagger", tier: "Ultra Edition", image: "/images/skins/glitchpop-dagger.png" }
    ],
    galleryImages: [
      { id: 0, title: "Champions 2023 Vandal Phát Sáng Hào Quang", url: "/images/skins/champions-vandal.png" },
      { id: 1, title: "Oni Katana Kiếm Quỷ Đỏ Rực", url: "/images/skins/oni-katana.png" },
      { id: 2, title: "Glitchpop Dagger Neon Cyberpunk", url: "/images/skins/glitchpop-dagger.png" },
      { id: 3, title: "Acc Immortal 2 - MMR Tuyển Thủ", url: "/images/accounts/acc-val-02.png" }
    ],
    pricePerHour: 18000,
    status: "rented", // Đang có người thuê để test hiển thị
    thumbnail: "/images/accounts/acc-val-02.png",
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
    highlightSkins: ["Raiden Shogun C2 Trấn", "Hu Tao Trấn Hộ Ma", "Kamisato Ayaka C6", "Kaedehara Kazuha"],
    skinDetails: [
      { name: "Raiden Shogun C2 Trấn", tier: "5 Sao C2 + Trấn R5", image: "/images/skins/raiden-shogun.png" },
      { name: "Hu Tao Trấn Hộ Ma", tier: "5 Sao Trấn R5", image: "/images/skins/hu-tao.png" },
      { name: "Kamisato Ayaka C6", tier: "5 Sao C6 Full Trấn", image: "/images/skins/ayaka.png" },
      { name: "Kaedehara Kazuha", tier: "5 Sao 1000 EM", image: "/images/skins/kazuha.png" }
    ],
    galleryImages: [
      { id: 0, title: "Raiden Shogun Lôi Thần Chém Đứt Không Gian", url: "/images/skins/raiden-shogun.png" },
      { id: 1, title: "Hu Tao Trấn Hộ Ma Bùng Nổ Sát Thương", url: "/images/skins/hu-tao.png" },
      { id: 2, title: "Kamisato Ayaka Băng Giá Tuyệt Mỹ", url: "/images/skins/ayaka.png" },
      { id: 3, title: "Kaedehara Kazuha & 36 Sao La Hoàn", url: "/images/skins/kazuha.png" }
    ],
    pricePerHour: 20000,
    status: "available",
    thumbnail: "/images/accounts/acc-gen-01.png",
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
    highlightSkins: ["Ronaldo BTB +8", "Gullit ICON +5", "Zidane ICON +7", "Courtois 23TS +8"],
    skinDetails: [
      { name: "Ronaldo BTB +8", tier: "Mạ Vàng Real Madrid", image: "/images/skins/ronaldo-btb.png" },
      { name: "Gullit ICON +5", tier: "Huyền Thoại Toàn Năng", image: "/images/skins/gullit-icon.png" },
      { name: "Zidane ICON +7", tier: "Nhạc Trưởng Hào Hoa", image: "/images/skins/zidane-icon.png" },
      { name: "Courtois 23TS +8", tier: "Thủ Thành Xuất Sắc", image: "/images/skins/courtois-ts.png" }
    ],
    galleryImages: [
      { id: 0, title: "Cristiano Ronaldo BTB +8 Đỉnh Cao Real Madrid", url: "/images/skins/ronaldo-btb.png" },
      { id: 1, title: "Ruud Gullit ICON +5 Trùm Tuyến Giữa", url: "/images/skins/gullit-icon.png" },
      { id: 2, title: "Zinedine Zidane ICON +7 Ma Thuật", url: "/images/skins/zidane-icon.png" },
      { id: 3, title: "Thibaut Courtois 23TS +8 Bắt Dính Mọi Cú Sút", url: "/images/skins/courtois-ts.png" }
    ],
    pricePerHour: 12000,
    status: "available",
    thumbnail: "/images/accounts/acc-fo4-01.png",
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
    skinDetails: [
      { name: "M416 Phượng Hoàng Lv10", tier: "Progressive Max Level", image: "/images/skins/pubg-m416-phoenix.jpg" },
      { name: "Beryl Bướm Đêm", tier: "Progressive Skin", image: "/images/skins/pubg-beryl-owl.jpg" },
      { name: "Bộ đồ B.Duck", tier: "Set Trang Phục Hiếm", image: "/images/accounts/acc-pubg-01.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "M416 Phượng Hoàng Lv10 Nâng Cấp Hiệu Ứng Hòm Xác", url: "/images/skins/pubg-m416-phoenix.jpg" },
      { id: 1, title: "Beryl M762 Bướm Đêm Tia Lửa Tím", url: "/images/skins/pubg-beryl-owl.jpg" },
      { id: 2, title: "Bộ Đồ Vịt Vàng B.Duck Độc Quyền", url: "/images/accounts/acc-pubg-01.jpg" },
      { id: 3, title: "Rank Kim Cương - K/D 3.8 Steam SEA", url: "/images/games/pubg.jpg" }
    ],
    pricePerHour: 15000,
    status: "available",
    thumbnail: "/images/accounts/acc-pubg-01.jpg",
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
    highlightSkins: ["Yasuo Ma Kiếm", "Yone Hoa Linh Lục Địa", "Zed Tử Thần Không Gian", "Akali K/DA ALL OUT"],
    skinDetails: [
      { name: "Yasuo Ma Kiếm", tier: "Trang Phục Huyền Thoại", image: "/images/skins/yasuo-ma-kiem.jpg" },
      { name: "Yone Hoa Linh Lục Địa", tier: "Huyền Thoại Song Kiếm", image: "/images/skins/yone-hoa-linh.jpg" },
      { name: "Zed Tử Thần Không Gian", tier: "Huyền Thoại Vũ Trụ", image: "/images/skins/zed-tu-than.jpg" },
      { name: "Akali K/DA ALL OUT", tier: "Tuyệt Phẩm Âm Nhạc", image: "/images/skins/akali-kda.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "Yasuo Ma Kiếm Hắc Ám Lốc Xoáy Quỷ", url: "/images/skins/yasuo-ma-kiem.jpg" },
      { id: 1, title: "Yone Hoa Linh Lục Địa Đoạt Mệnh", url: "/images/skins/yone-hoa-linh.jpg" },
      { id: 2, title: "Zed Tử Thần Không Gian Sát Thủ", url: "/images/skins/zed-tu-than.jpg" },
      { id: 3, title: "Akali K/DA ALL OUT & Rank Thách Đấu", url: "/images/skins/akali-kda.jpg" }
    ],
    pricePerHour: 8000,
    status: "maintenance", // Đang bảo trì để test logic kiểm thử
    thumbnail: "/images/accounts/acc-tc-01.jpg",
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
    id: "ADMIN-01",
    name: "Lê Minh Quân",
    email: "admin@gamerent.vn",
    password: "admin123",
    role: "admin",
    balance: 3000000,
    isBlocked: false,
    phone: "0909999999",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "USER-01",
    name: "Nguyễn Văn Admin",
    email: "user@demo.com",
    password: "password123",
    role: "renter",
    balance: 150000,
    isBlocked: false,
    phone: "0987654321",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'KH001',
    name: 'Nguyễn Văn Admin',
    phone: '0987654321',
    email: 'admin_kh01@gmail.com',
    totalOrders: 14,
    totalSpent: 245000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'
  },
  {
    id: 'KH002',
    name: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    email: 'hung.nguyen@gmail.com',
    totalOrders: 8,
    totalSpent: 120000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80'
  },
  {
    id: 'KH003',
    name: 'Trần Phú Gia',
    phone: '0978112233',
    email: 'gia.tran@hotmail.com',
    totalOrders: 19,
    totalSpent: 380000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'
  },
  {
    id: 'KH004',
    name: 'Phạm Tuấn Minh',
    phone: '0933445566',
    email: 'minh.tuan@yahoo.com',
    totalOrders: 5,
    totalSpent: 75000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80'
  }
];

// Dữ liệu đơn thuê mẫu khớp với bảng "Danh sách tài khoản thuê" trong Dashboard
const now = Date.now();
export const INITIAL_RENTALS = [
  {
    id: "RENT-001",
    accountId: "ACC-LQ-01",
    accountCode: "VNT#192",
    accountTitle: "Liên Quân Mobile",
    publisher: "Garena",
    rank: "Cao Thủ",
    customerName: "Nguyễn Văn Admin",
    customerCode: "#KH001",
    gameId: "lien-quan",
    userId: "ADMIN-01",
    startTime: now - (26 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 18:14",
    durationHours: 1,
    endTime: now - (25 * 60 * 60 * 1000),
    pricePerHour: 15000,
    totalPrice: 15000,
    secretAccount: "vnt192_garena",
    secretPassword: "PassLienQuan@99",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-002",
    accountId: "ACC-LQ-02",
    accountCode: "VNT#192",
    accountTitle: "Liên Quân Mobile",
    publisher: "Garena",
    rank: "Cao Thủ",
    customerName: "Phạm Tuấn Minh",
    customerCode: "#KH004",
    gameId: "lien-quan",
    userId: "USER-04",
    startTime: now - (24 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-14 15:30",
    durationHours: 2,
    endTime: now - (22 * 60 * 60 * 1000),
    remainingText: "Đã kết thúc",
    pricePerHour: 10000,
    totalPrice: 20000,
    secretAccount: "vnt192_sub",
    secretPassword: "PassSub@123",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-003",
    accountId: "ACC-VAL-01",
    accountCode: "VNT#592",
    accountTitle: "Valorant",
    publisher: "Riot Games",
    rank: "Kim Cương",
    customerName: "Trần Phú Gia",
    customerCode: "#KH003",
    gameId: "valorant",
    userId: "USER-03",
    startTime: now - (20 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 15:30",
    durationHours: 2,
    endTime: now - (18 * 60 * 60 * 1000),
    pricePerHour: 25000,
    totalPrice: 50000,
    secretAccount: "vnt592_riot",
    secretPassword: "ValDiamond#2026",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-004",
    accountId: "ACC-GEN-01",
    accountCode: "GEN#881",
    accountTitle: "Genshin Impact",
    publisher: "HoYoverse",
    rank: "AR 60",
    customerName: "Lê Quốc Bảo",
    customerCode: "#KH005",
    gameId: "genshin",
    userId: "USER-05",
    startTime: now - (45 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 16:00",
    durationHours: 3,
    endTime: now - (42 * 60 * 60 * 1000),
    pricePerHour: 20000,
    totalPrice: 60000,
    secretAccount: "genshin_ar60_whale",
    secretPassword: "FurinaWhaleC6@2026",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-005",
    accountId: "ACC-FO4-01",
    accountCode: "FO4#302",
    accountTitle: "FC Online (FO4)",
    publisher: "Garena",
    rank: "Thế Giới",
    customerName: "Hoàng Mai Trang",
    customerCode: "#KH006",
    gameId: "fo4",
    userId: "USER-06",
    startTime: now - (50 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 14:10",
    durationHours: 1,
    endTime: now - (49 * 60 * 60 * 1000),
    pricePerHour: 12000,
    totalPrice: 12000,
    secretAccount: "fo4_real_250t",
    secretPassword: "GullitRealMadrid@99",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-006",
    accountId: "ACC-PUBG-01",
    accountCode: "PBG#109",
    accountTitle: "PUBG Steam",
    publisher: "KRAFTON",
    rank: "Kim Cương",
    customerName: "Đỗ Minh Đức",
    customerCode: "#KH007",
    gameId: "pubg",
    userId: "USER-07",
    startTime: now - (2 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 13:00",
    durationHours: 2,
    endTime: now,
    remainingText: "Đã kết thúc",
    pricePerHour: 15000,
    totalPrice: 30000,
    secretAccount: "steam_pubg_phoenix",
    secretPassword: "PubgM416Lv10#2026",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-007",
    accountId: "ACC-VAL-02",
    accountCode: "VNT#703",
    accountTitle: "Valorant",
    publisher: "Riot Games",
    rank: "Immortal",
    customerName: "Vũ Thành Long",
    customerCode: "#KH008",
    gameId: "valorant",
    userId: "USER-08",
    startTime: now - (15 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 17:00",
    durationHours: 2,
    endTime: now - (13 * 60 * 60 * 1000),
    pricePerHour: 18000,
    totalPrice: 36000,
    secretAccount: "val_immortal_champ",
    secretPassword: "OniKatana#888",
    status: "completed",
    disputeReason: null,
    rating: 5
  },
  {
    id: "RENT-008",
    accountId: "ACC-TC-01",
    accountCode: "TC#441",
    accountTitle: "LMHT: Tốc Chiến",
    publisher: "VNG Games",
    rank: "Thách Đấu",
    customerName: "Ngô Quốc Huy",
    customerCode: "#KH009",
    gameId: "toc-chien",
    userId: "USER-09",
    startTime: now - (3 * 60 * 60 * 1000),
    rentalTimeFormatted: "2026-09-15 11:30",
    durationHours: 2,
    endTime: now - (1 * 60 * 60 * 1000),
    remainingText: "Đã kết thúc",
    pricePerHour: 8000,
    totalPrice: 16000,
    secretAccount: "tc_thachdau_yasuo",
    secretPassword: "HasagiHasagi@2026",
    status: "completed",
    disputeReason: null,
    rating: 4
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
