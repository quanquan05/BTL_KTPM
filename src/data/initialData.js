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
    status: "rented", // Đang có khách thuê
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
    status: "rented", // Đang có khách thuê
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
  },
  {
    id: "ACC-LQ-03",
    gameId: "lien-quan",
    title: "Acc Tinh Anh 1 - Nakroth Quán Quân + Raz Muay Thái + Bảng Ngọc Chuẩn 90",
    rank: "Tinh Anh",
    server: "Mặt Trời (VN)",
    skinsCount: 135,
    highlightSkins: ["Raz Muay Thái", "Nakroth Thứ Nguyên Vệ Thần", "Airi Kiếm Sakura"],
    skinDetails: [
      { name: "Raz Muay Thái", tier: "Bậc SS Tuyệt Sắc", image: "/images/skins/raz-muay-thai.jpg" },
      { name: "Nakroth Thứ Nguyên Vệ Thần", tier: "Bậc SSS Hữu Hạn", image: "/images/skins/nakroth-thu-nguyen.jpg" },
      { name: "Airi Kiếm Sakura", tier: "Bậc SS Hữu Hạn", image: "/images/skins/airi-sakura.png" }
    ],
    galleryImages: [
      { id: 0, title: "Raz Muay Thái Thần Cước", url: "/images/skins/raz-muay-thai.jpg" },
      { id: 1, title: "Nakroth Thứ Nguyên Siêu Ảo Diệu", url: "/images/skins/nakroth-thu-nguyen.jpg" },
      { id: 2, title: "Airi Kiếm Sakura Mộng Ảo", url: "/images/skins/airi-sakura.png" },
      { id: 3, title: "Bảng Ngọc Chuẩn 90 Viên Đi Rừng", url: "/images/accounts/acc-lq-02.jpg" }
    ],
    pricePerHour: 9000,
    status: "available",
    thumbnail: "/images/skins/raz-muay-thai.jpg",
    secretAccount: "lq_tinhanh_raz",
    secretPassword: "RazMuayThai@2026",
    winRate: "61.8%",
    description: "Acc Tinh Anh leo rank dễ thở, full 90 ngọc sát thương chí mạng + xuyên giáp. Có bảo hiểm tài khoản và hỗ trợ 24/7.",
    rating: 4.8,
    rentCount: 36
  },
  {
    id: "ACC-LQ-04",
    gameId: "lien-quan",
    title: "Acc Kim Cương - Murad Siêu Việt + Florentino Tinh Hệ Full Combo Sát Thủ",
    rank: "Kim Cương",
    server: "Mặt Trời (VN)",
    skinsCount: 110,
    highlightSkins: ["Murad Siêu Việt", "Florentino Tinh Hệ", "Tulen Tân Thần Thiên Hà"],
    skinDetails: [
      { name: "Murad Siêu Việt", tier: "Bậc SSS Công Nghệ", image: "/images/skins/murad-sieu-viet.jpg" },
      { name: "Florentino Tinh Hệ", tier: "Bậc SSS Hữu Hạn", image: "/images/skins/florentino-tinh-he.jpg" },
      { name: "Tulen Tân Thần Thiên Hà", tier: "Bậc SSS Huyền Thoại", image: "/images/skins/tulen-thien-ha.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "Murad Siêu Việt Lả Lướt Chiêu Thức", url: "/images/skins/murad-sieu-viet.jpg" },
      { id: 1, title: "Florentino Tinh Hệ Đỉnh Cao Múa Kiếm", url: "/images/skins/florentino-tinh-he.jpg" },
      { id: 2, title: "Tulen Tân Thần Lôi Quang Bão Tố", url: "/images/skins/tulen-thien-ha.jpg" },
      { id: 3, title: "Chiến Tích Kim Cương 1 Thăng Hạng", url: "/images/accounts/acc-lq-01.jpg" }
    ],
    pricePerHour: 8000,
    status: "rented",
    thumbnail: "/images/skins/murad-sieu-viet.jpg",
    secretAccount: "lq_kimcuong_murad",
    secretPassword: "MuradSieuViet@99",
    winRate: "58.4%",
    description: "Tài khoản thích hợp kéo bạn bè hoặc cày chuỗi thắng. Đầy đủ tướng sát thủ hot meta mùa này.",
    rating: 4.7,
    rentCount: 22
  },
  {
    id: "ACC-VAL-03",
    gameId: "valorant",
    title: "Acc Ascendant 3 - Kuronami Vandal + Oni Katana + Sovereign Ghost",
    rank: "Ascendant",
    server: "Asia / Singapore",
    skinsCount: 28,
    highlightSkins: ["Kuronami Vandal", "Oni Katana", "Sovereign Ghost"],
    skinDetails: [
      { name: "Kuronami Vandal", tier: "Exclusive Edition", image: "/images/skins/kuronami-vandal.png" },
      { name: "Oni Katana", tier: "Premium Melee", image: "/images/skins/oni-katana.png" },
      { name: "Sovereign Ghost", tier: "Deluxe Edition", image: "/images/skins/sovereign-ghost.png" }
    ],
    galleryImages: [
      { id: 0, title: "Kuronami Vandal Full Upgrade Finisher", url: "/images/skins/kuronami-vandal.png" },
      { id: 1, title: "Oni Katana Kiếm Quỷ Đỏ Múa Cực Mượt", url: "/images/skins/oni-katana.png" },
      { id: 2, title: "Sovereign Ghost Âm Thanh Thanh Thoát", url: "/images/skins/sovereign-ghost.png" },
      { id: 3, title: "Rank Ascendant 3 MMR Cực Cao", url: "/images/accounts/acc-val-02.png" }
    ],
    pricePerHour: 16000,
    status: "available",
    thumbnail: "/images/skins/kuronami-vandal.png",
    secretAccount: "val_ascendant_kuronami",
    secretPassword: "KuronamiOni@2026",
    winRate: "63.2%",
    description: "Acc MMR cực tốt, chuyên đấu rank Singapore ping 25ms. Nhiều skin nâng cấp tối đa hiệu ứng kết liễu đỉnh chóp.",
    rating: 4.9,
    rentCount: 48
  },
  {
    id: "ACC-VAL-04",
    gameId: "valorant",
    title: "Acc Kim Cương 2 - Champions 2023 Vandal + Reaver Karambit",
    rank: "Kim Cương",
    server: "Asia / Hong Kong",
    skinsCount: 19,
    highlightSkins: ["Champions 2023 Vandal", "Reaver Karambit", "Glitchpop Dagger"],
    skinDetails: [
      { name: "Champions 2023 Vandal", tier: "Limited Champions", image: "/images/skins/champions-vandal.png" },
      { name: "Reaver Karambit", tier: "Premium Melee", image: "/images/skins/reaver-karambit.png" },
      { name: "Glitchpop Dagger", tier: "Ultra Edition", image: "/images/skins/glitchpop-dagger.png" }
    ],
    galleryImages: [
      { id: 0, title: "Champions 2023 Vandal Ánh Kim", url: "/images/skins/champions-vandal.png" },
      { id: 1, title: "Reaver Karambit Xoay Dao Huyền Ảo", url: "/images/skins/reaver-karambit.png" },
      { id: 2, title: "Glitchpop Dagger Màu Sắc Sống Động", url: "/images/skins/glitchpop-dagger.png" },
      { id: 3, title: "Rank Kim Cương 2 Dễ Bắn", url: "/images/games/valorant.jpg" }
    ],
    pricePerHour: 13000,
    status: "available",
    thumbnail: "/images/skins/champions-vandal.png",
    secretAccount: "val_diamond_champ",
    secretPassword: "ReaverKarambit#77",
    winRate: "57.8%",
    description: "Tài khoản có skin giới hạn Champions 2023 phát sáng khi top frag. Cam kết không voice toxic, rank sạch.",
    rating: 4.8,
    rentCount: 31
  },
  {
    id: "ACC-GEN-02",
    gameId: "genshin",
    title: "Acc AR 58 - Zhongli Trấn + Kaedehara Kazuha + Hu Tao C1 Trấn Hộ Ma",
    rank: "AR 58",
    server: "Asia",
    skinsCount: 22,
    highlightSkins: ["Zhongli Trấn Giáo Nham", "Kaedehara Kazuha C2", "Hu Tao C1 Trấn Hộ Ma", "Kamisato Ayaka"],
    skinDetails: [
      { name: "Zhongli Trấn Giáo Nham", tier: "Nham Thần Bất Tử", image: "/images/skins/zhongli.png" },
      { name: "Kaedehara Kazuha", tier: "Hỗ Trợ Toàn Năng 1000 EM", image: "/images/skins/kazuha.png" },
      { name: "Hu Tao C1 Trấn Hộ Ma", tier: "DPS Hỏa Cực Đại", image: "/images/skins/hu-tao.png" },
      { name: "Kamisato Ayaka", tier: "Công Chúa Băng", image: "/images/skins/ayaka.png" }
    ],
    galleryImages: [
      { id: 0, title: "Nham Thần Zhongli Khiên Vững Chắc", url: "/images/skins/zhongli.png" },
      { id: 1, title: "Kazuha Gom Quái Siêu Đỉnh", url: "/images/skins/kazuha.png" },
      { id: 2, title: "Hu Tao Trấn Hộ Ma 100k Sát Thương", url: "/images/skins/hu-tao.png" },
      { id: 3, title: "Bản Đồ Khám Phá 100% Toàn Bộ Vùng Đất", url: "/images/games/genshin.jpg" }
    ],
    pricePerHour: 16000,
    status: "available",
    thumbnail: "/images/skins/zhongli.png",
    secretAccount: "genshin_ar58_zhongli",
    secretPassword: "ZhongliKazuha@2026",
    winRate: "36 Sao La Hoàn",
    description: "Acc AR 58 build chuẩn chỉ từng thánh di vật, khiên Zhongli bất tử đánh boss như đi dạo. Đã mở full teleport Fontaine & Sumeru.",
    rating: 4.9,
    rentCount: 64
  },
  {
    id: "ACC-GEN-03",
    gameId: "genshin",
    title: "Acc AR 55 - Xiao C1 Trấn Hòa Phác Diệp + Raiden Shogun + Lumine",
    rank: "AR 55",
    server: "Asia",
    skinsCount: 15,
    highlightSkins: ["Xiao C1 Trấn Hòa Phác Diệp", "Raiden Shogun", "Lumine", "Kamisato Ayaka"],
    skinDetails: [
      { name: "Xiao C1 Trấn Hòa Phác Diệp", tier: "Hộ Pháp Dạ Xoa", image: "/images/skins/xiao.png" },
      { name: "Raiden Shogun", tier: "Lôi Thần Điện Hạ", image: "/images/skins/raiden-shogun.png" },
      { name: "Lumine", tier: "Nhà Lữ Hành Đa Nguyên Tố", image: "/images/skins/lumine.png" },
      { name: "Kamisato Ayaka", tier: "5 Sao Trấn Tuyệt Kỹ", image: "/images/skins/ayaka.png" }
    ],
    galleryImages: [
      { id: 0, title: "Xiao Trấn Giáo Hòa Phác Diệp Cắm Đất", url: "/images/skins/xiao.png" },
      { id: 1, title: "Raiden Shogun Tụ Năng Lượng Đội Hình", url: "/images/skins/raiden-shogun.png" },
      { id: 2, title: "Lumine Khám Phá Thế Giới Teyvat", url: "/images/skins/lumine.png" },
      { id: 3, title: "Đội Hình Đánh Boss Thế Giới Cực Nhanh", url: "/images/accounts/acc-gen-01.png" }
    ],
    pricePerHour: 12000,
    status: "available",
    thumbnail: "/images/skins/xiao.png",
    secretAccount: "genshin_ar55_xiao",
    secretPassword: "XiaoDada@Genshin26",
    winRate: "36 Sao La Hoàn",
    description: "Acc AR 55 có Xiao nhảy dậm sát thương diện rộng cực đã tay. Đi kèm nguyên bảo thạch tích lũy sẵn để quay tướng mới.",
    rating: 4.7,
    rentCount: 41
  },
  {
    id: "ACC-FO4-02",
    gameId: "fo4",
    title: "Đội Hình Chelsea 180 Trăm Tỷ - Shevchenko LN +8, Gullit EBS +8, Courtois +8",
    rank: "Tinh Anh",
    server: "Garena VN",
    skinsCount: 14,
    highlightSkins: ["Gullit EBS +8", "Zidane ICON +5", "Courtois 23TS +8", "Ronaldo BTB +5"],
    skinDetails: [
      { name: "Gullit EBS +8", tier: "Cỗ Máy Tuyến Giữa Mạ Vàng", image: "/images/skins/gullit-icon.png" },
      { name: "Zidane ICON +5", tier: "Thiên Tài Kiến Tạo", image: "/images/skins/zidane-icon.png" },
      { name: "Courtois 23TS +8", tier: "Người Nhện Chelsea", image: "/images/skins/courtois-ts.png" },
      { name: "Ronaldo BTB +5", tier: "Chân Sút Huyền Thoại", image: "/images/skins/ronaldo-btb.png" }
    ],
    galleryImages: [
      { id: 0, title: "Ruud Gullit EBS +8 Cân Mọi Tranh Chấp Tuyến Giữa", url: "/images/skins/gullit-icon.png" },
      { id: 1, title: "Zinedine Zidane ICON +5 Mượt Mà Đảo Chân", url: "/images/skins/zidane-icon.png" },
      { id: 2, title: "Thibaut Courtois 23TS +8 Phản Xạ Xuất Thần", url: "/images/skins/courtois-ts.png" },
      { id: 3, title: "Đội Hình Team Color Chelsea Đầy Đủ Buff Chỉ Số", url: "/images/games/fo4.jpg" }
    ],
    pricePerHour: 14000,
    status: "available",
    thumbnail: "/images/skins/gullit-icon.png",
    secretAccount: "fo4_chelsea_180t",
    secretPassword: "ChelseaGullit@88",
    winRate: "62.5%",
    description: "Team Color Chelsea full mạ vàng đè người cực rát, sút xa ZD bao cong. Phù hợp leo rank Tinh Anh - Siêu Sao.",
    rating: 4.8,
    rentCount: 52
  },
  {
    id: "ACC-FO4-03",
    gameId: "fo4",
    title: "Đội Hình Siêu Sao Quốc Dân 120 Trăm Tỷ - Zidane ICON +7, Ronaldo BTB +8",
    rank: "Siêu Sao",
    server: "Garena VN",
    skinsCount: 11,
    highlightSkins: ["Zidane ICON +7", "Ronaldo BTB +8", "Courtois 23TS +8", "Gullit ICON"],
    skinDetails: [
      { name: "Zidane ICON +7", tier: "Nghệ Sĩ Sân Cỏ", image: "/images/skins/zidane-icon.png" },
      { name: "Ronaldo BTB +8", tier: "Cỗ Máy Ghi Bàn Mạ Vàng", image: "/images/skins/ronaldo-btb.png" },
      { name: "Courtois 23TS +8", tier: "Thủ Thành Khổng Lồ", image: "/images/skins/courtois-ts.png" },
      { name: "Gullit ICON +5", tier: "Huyền Thoại", image: "/images/skins/gullit-icon.png" }
    ],
    galleryImages: [
      { id: 0, title: "Zinedine Zidane ICON +7 Chuyền Chọc Khe Hoàn Hảo", url: "/images/skins/zidane-icon.png" },
      { id: 1, title: "Cristiano Ronaldo BTB +8 Bứt Tốc Thần Sầu", url: "/images/skins/ronaldo-btb.png" },
      { id: 2, title: "Thủ Thành Courtois 23TS +8 Bay Người Cản Phá", url: "/images/skins/courtois-ts.png" },
      { id: 3, title: "Chiến Thuật Giả Lập Xếp Hạng Siêu Sao", url: "/images/accounts/acc-fo4-01.png" }
    ],
    pricePerHour: 15000,
    status: "available",
    thumbnail: "/images/skins/zidane-icon.png",
    secretAccount: "fo4_sieusao_zidane",
    secretPassword: "ZidaneRonaldo@2026",
    winRate: "66.0%",
    description: "Đội hình quốc dân toàn sao ICON và 23TS mạ vàng, chỉ số tổng trên 125, sút góc hẹp cũng vào.",
    rating: 4.9,
    rentCount: 47
  },
  {
    id: "ACC-PUBG-02",
    gameId: "pubg",
    title: "Acc Steam Cao Thủ - Beryl Bướm Đêm Lv8 + M416 Phượng Hoàng + Set Streamer",
    rank: "Cao Thủ",
    server: "Steam Asia / SEA",
    skinsCount: 52,
    highlightSkins: ["Beryl Bướm Đêm Lv8", "M416 Phượng Hoàng", "Set Trang Phục Streamer"],
    skinDetails: [
      { name: "Beryl Bướm Đêm Lv8", tier: "Progressive Tia Lửa Tím", image: "/images/skins/pubg-beryl-owl.jpg" },
      { name: "M416 Phượng Hoàng Lv10", tier: "Progressive Max Level", image: "/images/skins/pubg-m416-phoenix.jpg" },
      { name: "Bộ đồ B.Duck", tier: "Set Trang Phục Hiếm", image: "/images/accounts/acc-pubg-01.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "Beryl M762 Bướm Đêm Hiệu Ứng Khói Tím", url: "/images/skins/pubg-beryl-owl.jpg" },
      { id: 1, title: "M416 Phượng Hoàng Bắn Cháy Nòng", url: "/images/skins/pubg-m416-phoenix.jpg" },
      { id: 2, title: "Trang Phục B.Duck Cực Dễ Thương", url: "/images/accounts/acc-pubg-01.jpg" },
      { id: 3, title: "Rank Cao Thủ K/D 4.2 Cực Đỉnh", url: "/images/games/pubg.jpg" }
    ],
    pricePerHour: 17000,
    status: "available",
    thumbnail: "/images/skins/pubg-beryl-owl.jpg",
    secretAccount: "steam_pubg_caothu",
    secretPassword: "BerylM762Purple#99",
    winRate: "4.2 K/D",
    description: "Acc Cao Thủ PUBG Steam đầy đủ vũ khí nâng cấp xịn, hòm xác nảy lửa độc đáo. Đã bật Steam Guard và sẵn sàng chiến.",
    rating: 4.9,
    rentCount: 58
  },
  {
    id: "ACC-PUBG-03",
    gameId: "pubg",
    title: "Acc Steam Bạch Kim - M416 Phượng Hoàng + Beryl Cực Chiến + Full Plus",
    rank: "Bạch Kim",
    server: "Steam Asia / SEA",
    skinsCount: 34,
    highlightSkins: ["M416 Phượng Hoàng", "Beryl Bướm Đêm", "Chảo Vàng Tri Ân"],
    skinDetails: [
      { name: "M416 Phượng Hoàng", tier: "Progressive Skin", image: "/images/skins/pubg-m416-phoenix.jpg" },
      { name: "Beryl Bướm Đêm", tier: "Progressive Skin", image: "/images/skins/pubg-beryl-owl.jpg" },
      { name: "Bộ đồ B.Duck", tier: "Set Hiếm", image: "/images/accounts/acc-pubg-01.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "M416 Phượng Hoàng Lửa Bất Diệt", url: "/images/skins/pubg-m416-phoenix.jpg" },
      { id: 1, title: "Beryl Bướm Đêm Sấy Cực Đầm", url: "/images/skins/pubg-beryl-owl.jpg" },
      { id: 2, title: "Gói PUBG Plus Trọn Đời Sẵn Sàng", url: "/images/accounts/acc-pubg-01.jpg" },
      { id: 3, title: "Rank Bạch Kim Bắn Cực Thoải Mái", url: "/images/games/pubg.jpg" }
    ],
    pricePerHour: 12000,
    status: "available",
    thumbnail: "/images/skins/pubg-m416-phoenix.jpg",
    secretAccount: "steam_pubg_bachkim",
    secretPassword: "M416PhoenixFire@2026",
    winRate: "2.9 K/D",
    description: "Acc sạch giá sinh viên, có gói PUBG Plus vĩnh viễn, chơi rank không gặp bot. Tự động cấp mã đăng nhập Steam Guard.",
    rating: 4.7,
    rentCount: 33
  },
  {
    id: "ACC-TC-02",
    gameId: "toc-chien",
    title: "Acc Đại Cao Thủ - Yone Hoa Linh Lục Địa + Yasuo Ma Kiếm + Zed Tử Thần",
    rank: "Đại Cao Thủ",
    server: "VNG Vietnam",
    skinsCount: 76,
    highlightSkins: ["Yone Hoa Linh Lục Địa", "Yasuo Ma Kiếm", "Zed Tử Thần Không Gian", "Akali K/DA ALL OUT"],
    skinDetails: [
      { name: "Yone Hoa Linh Lục Địa", tier: "Huyền Thoại Song Kiếm", image: "/images/skins/yone-hoa-linh.jpg" },
      { name: "Yasuo Ma Kiếm", tier: "Trang Phục Huyền Thoại", image: "/images/skins/yasuo-ma-kiem.jpg" },
      { name: "Zed Tử Thần Không Gian", tier: "Huyền Thoại Vũ Trụ", image: "/images/skins/zed-tu-than.jpg" },
      { name: "Akali K/DA ALL OUT", tier: "Tuyệt Phẩm Âm Nhạc", image: "/images/skins/akali-kda.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "Yone Hoa Linh Lục Địa Múa Kiếm Đoạt Hồn", url: "/images/skins/yone-hoa-linh.jpg" },
      { id: 1, title: "Yasuo Ma Kiếm Chém Gió Đỏ Rực", url: "/images/skins/yasuo-ma-kiem.jpg" },
      { id: 2, title: "Zed Tử Thần Không Gian Sát Thủ Bóng Đêm", url: "/images/skins/zed-tu-than.jpg" },
      { id: 3, title: "Chiến Tích Đại Cao Thủ 45 Điểm", url: "/images/games/toc-chien.jpg" }
    ],
    pricePerHour: 13000,
    status: "available",
    thumbnail: "/images/skins/yone-hoa-linh.jpg",
    secretAccount: "tc_daicaothu_yone",
    secretPassword: "YoneHoaLinh@2026",
    winRate: "62.0%",
    description: "Acc Đại Cao Thủ tướng sát thủ đường giữa và đường baron cực mạnh. Skin hiệu ứng mượt mà combo không trượt phát nào.",
    rating: 4.9,
    rentCount: 45
  },
  {
    id: "ACC-TC-03",
    gameId: "toc-chien",
    title: "Acc Cao Thủ - Akali K/DA ALL OUT + Zed Tử Thần + Full Tướng Đấu Sĩ",
    rank: "Cao Thủ",
    server: "VNG Vietnam",
    skinsCount: 58,
    highlightSkins: ["Akali K/DA ALL OUT", "Zed Tử Thần Không Gian", "Yasuo Ma Kiếm", "Yone Hoa Linh"],
    skinDetails: [
      { name: "Akali K/DA ALL OUT", tier: "Tuyệt Phẩm Âm Nhạc", image: "/images/skins/akali-kda.jpg" },
      { name: "Zed Tử Thần Không Gian", tier: "Huyền Thoại Vũ Trụ", image: "/images/skins/zed-tu-than.jpg" },
      { name: "Yasuo Ma Kiếm", tier: "Trang Phục Huyền Thoại", image: "/images/skins/yasuo-ma-kiem.jpg" },
      { name: "Yone Hoa Linh Lục Địa", tier: "Huyền Thoại Song Kiếm", image: "/images/skins/yone-hoa-linh.jpg" }
    ],
    galleryImages: [
      { id: 0, title: "Akali K/DA ALL OUT Ánh Sáng Neon", url: "/images/skins/akali-kda.jpg" },
      { id: 1, title: "Zed Tử Thần Phi Tiêu Bóng Ma", url: "/images/skins/zed-tu-than.jpg" },
      { id: 2, title: "Yasuo Ma Kiếm Bão Tố", url: "/images/skins/yasuo-ma-kiem.jpg" },
      { id: 3, title: "Khung Rank Cao Thủ Danh Giá", url: "/images/accounts/acc-tc-01.jpg" }
    ],
    pricePerHour: 11000,
    status: "available",
    thumbnail: "/images/skins/akali-kda.jpg",
    secretAccount: "tc_caothu_akali",
    secretPassword: "AkaliKDA@PopStars9",
    winRate: "59.6%",
    description: "Acc Cao Thủ thích hợp solo leo rank, full tướng hot meta sát thủ. Thuê nhận tài khoản ngay lập tức.",
    rating: 4.8,
    rentCount: 38
  }
];

export const INITIAL_USERS = [
  {
    id: "ADMIN-01",
    name: "Quản Lý",
    email: "admin@gamerent.vn",
    password: "admin123",
    role: "admin",
    balance: 3000000,
    isBlocked: false,
    phone: "0909999999",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "KH002",
    name: "Nguyễn Văn Hùng",
    phone: "0912345678",
    email: "hung.nguyen@gmail.com",
    totalOrders: 8,
    totalSpent: 165000,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80",
    createdAt: Date.now() - 15 * 86400000
  },
  {
    id: "KH004",
    name: "Phạm Tuấn Minh",
    phone: "0933445566",
    email: "minh.tuan@yahoo.com",
    totalOrders: 5,
    totalSpent: 95000,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80",
    createdAt: Date.now() - 10 * 86400000
  },
  {
    id: "KH008",
    name: "Vũ Thành Long",
    phone: "0988776655",
    email: "long.vu@gmail.com",
    totalOrders: 4,
    totalSpent: 112000,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
    createdAt: Date.now() - 5 * 86400000
  }
];

// Dữ liệu đơn thuê mẫu khớp với bảng "Danh sách tài khoản thuê" trong Dashboard
const now = Date.now();
export const INITIAL_RENTALS = [
  {
    id: "RENT-001",
    accountId: "ACC-LQ-01",
    accountCode: "ACC-LQ-01",
    accountTitle: "Acc Chiến Tướng 50 Sao - Full Tướng - Flo Tinh Hệ + Nak Thứ Nguyên Vệ Thần",
    publisher: "Garena",
    rank: "Chiến Tướng",
    customerName: "Nguyễn Văn Hùng",
    customerCode: "#KH002",
    gameId: "lien-quan",
    userId: "USER-02",
    startTime: now - (45 * 60 * 1000),
    rentalTimeFormatted: new Date(now - 45 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
    durationHours: 3,
    endTime: now + (2 * 60 * 60 * 1000 + 15 * 60 * 1000), // Còn 2h15m (màu xanh lá)
    pricePerHour: 15000,
    totalPrice: 45000,
    secretAccount: "lq_chientuong_01",
    secretPassword: "GameRentPassLQ@2026",
    status: "active",
    disputeReason: null,
    rating: null
  },
  {
    id: "RENT-002",
    accountId: "ACC-LQ-02",
    accountCode: "ACC-LQ-02",
    accountTitle: "Acc Cao Thủ 15 Sao - Ngộ Không Nhóc Tì + All Tướng Sát Thủ",
    publisher: "Garena",
    rank: "Cao Thủ",
    customerName: "Phạm Tuấn Minh",
    customerCode: "#KH004",
    gameId: "lien-quan",
    userId: "USER-04",
    startTime: now - (75 * 60 * 1000),
    rentalTimeFormatted: new Date(now - 75 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
    durationHours: 2,
    endTime: now + (45 * 60 * 1000), // Còn 45m (màu vàng cam: sắp hết hạn < 1h)
    remainingText: null,
    pricePerHour: 10000,
    totalPrice: 20000,
    secretAccount: "lq_caothu_ngokhong",
    secretPassword: "PassKTPM#LQ99",
    status: "active",
    disputeReason: null,
    rating: null
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
    accountCode: "ACC-VAL-02",
    accountTitle: "Acc Immortal 2 - Champion 2023 Vandal + Oni 2.0 Katana",
    publisher: "Riot Games",
    rank: "Immortal",
    customerName: "Vũ Thành Long",
    customerCode: "#KH008",
    gameId: "valorant",
    userId: "USER-08",
    startTime: now - (30 * 60 * 1000),
    rentalTimeFormatted: new Date(now - 30 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
    durationHours: 2,
    endTime: now + (90 * 60 * 1000), // Còn 1h30m (màu xanh lá)
    pricePerHour: 18000,
    totalPrice: 36000,
    secretAccount: "val_immortal_champ",
    secretPassword: "OniKatana#888",
    status: "active",
    disputeReason: null,
    rating: null
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
