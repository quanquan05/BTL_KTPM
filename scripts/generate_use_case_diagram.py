# -*- coding: utf-8 -*-
"""
Script vẽ Sơ đồ Use Case tổng quát dự án GameRent chuẩn UML
Phiên bản HOÀN HẢO TUYỆT ĐỐI (Master Edition):
- Cỡ chữ to đậm, rõ nét, dễ đọc nhất
- Tiêu đề và Legend không chạm nhau, khoảng cách thoáng đãng
- Bố cục 4 phân hệ cân xứng tuyệt đối, triệt tiêu mọi đường cắt ngang
- Tỷ lệ hiển thị tối ưu cho báo cáo Word và Slide thuyết trình
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse

# Cấu hình font chữ hỗ trợ tiếng Việt
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def draw_actor(ax, x, y, name, role_subtitle="", color="#1E293B", scale=1.0):
    """Vẽ biểu tượng UML Actor rõ ràng, nổi bật kèm thẻ tên to dễ đọc"""
    r = 0.28 * scale
    head = plt.Circle((x, y + 0.72 * scale), r, color=color, fill=False, lw=3.0, zorder=12)
    ax.add_patch(head)
    
    # Thân
    ax.plot([x, x], [y + 0.44 * scale, y - 0.22 * scale], color=color, lw=3.0, zorder=12)
    # Tay
    ax.plot([x - 0.42 * scale, x + 0.42 * scale], [y + 0.20 * scale, y + 0.20 * scale], color=color, lw=3.0, zorder=12)
    # Chân trái & phải
    ax.plot([x, x - 0.38 * scale], [y - 0.22 * scale, y - 0.85 * scale], color=color, lw=3.0, zorder=12)
    ax.plot([x, x + 0.38 * scale], [y - 0.22 * scale, y - 0.85 * scale], color=color, lw=3.0, zorder=12)
    
    # Thẻ tên Actor với nền màu nổi bật
    ax.text(x, y - 1.15 * scale, name, ha='center', va='top', fontsize=12.5, fontweight='bold', color="#FFFFFF", zorder=14,
            bbox=dict(boxstyle="round,pad=0.35,rounding_size=0.3", facecolor=color, edgecolor="none", alpha=1.0))
    if role_subtitle:
        ax.text(x, y - 1.68 * scale, role_subtitle, ha='center', va='top', fontsize=9.5, fontstyle='italic', fontweight='bold', color=color, zorder=14)

def draw_use_case(ax, x, y, title, subtitle="", w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#2563EB", text_color="#1E3A8A"):
    """Vẽ oval Use Case chuẩn UML to rõ, chữ 2 dòng cân đối"""
    shadow = Ellipse((x + 0.05, y - 0.05), w, h, facecolor="#94A3B8", edgecolor="none", alpha=0.32, zorder=5)
    ax.add_patch(shadow)
    
    ellipse = Ellipse((x, y), w, h, facecolor=bg_color, edgecolor=border_color, linewidth=2.2, zorder=6)
    ax.add_patch(ellipse)
    
    if subtitle:
        ax.text(x, y + 0.14, title, ha='center', va='center', fontsize=11.2, fontweight='bold', color=text_color, zorder=8)
        ax.text(x, y - 0.18, subtitle, ha='center', va='center', fontsize=9.0, fontstyle='italic', color="#475569", zorder=8)
    else:
        ax.text(x, y, title, ha='center', va='center', fontsize=11.8, fontweight='bold', color=text_color, zorder=8)

def draw_card(ax, x, y, w, h, title, subtitle="", bg_color="#F8FAFC", border_color="#CBD5E1", header_bg="#E2E8F0", header_color="#0F172A"):
    """Vẽ Card phân hệ nghiệp vụ có thanh tiêu đề to đẹp"""
    card = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2,rounding_size=0.45",
                          facecolor=bg_color, edgecolor=border_color, linewidth=2.0, alpha=0.98, zorder=2)
    ax.add_patch(card)
    
    hh = 0.90
    h_card = FancyBboxPatch((x, y + h - hh), w, hh, boxstyle="round,pad=0.2,rounding_size=0.45",
                            facecolor=header_bg, edgecolor="none", zorder=3)
    ax.add_patch(h_card)
    
    ax.text(x + 0.4, y + h - 0.45, title, ha='left', va='center', fontsize=12.5, fontweight='bold', color=header_color, zorder=4)
    if subtitle:
        ax.text(x + w - 0.4, y + h - 0.45, subtitle, ha='right', va='center', fontsize=9.5, fontstyle='italic', color=header_color, zorder=4)

def draw_line(ax, x1, y1, x2, y2, color="#475569", lw=1.6, zorder=4):
    """Đường kết nối Actor với Use Case"""
    ax.plot([x1, x2], [y1, y2], color=color, lw=lw, zorder=zorder)

def draw_relation(ax, x1, y1, x2, y2, label="<<include>>", color="#059669", lw=1.6, style='--', label_offset=(0, 0)):
    """Đường quan hệ include/extend có mũi tên nét đứt sắc nét"""
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", color=color, lw=lw, linestyle=style), zorder=8)
    mx = (x1 + x2) / 2 + label_offset[0]
    my = (y1 + y2) / 2 + label_offset[1]
    ax.text(mx, my, label, ha='center', va='center', fontsize=9.2, fontweight='bold', color=color,
            bbox=dict(boxstyle="round,pad=0.2", facecolor="#FFFFFF", edgecolor=color, lw=1.0, alpha=0.96), zorder=9)

def generate_master_diagram():
    fig, ax = plt.subplots(figsize=(24, 15), dpi=300)
    ax.set_xlim(-0.5, 24.5)
    ax.set_ylim(-0.5, 15.5)
    ax.axis('off')

    # ================= 1. KHUNG RANH GIỚI HỆ THỐNG (SYSTEM BOUNDARY) =================
    sys_x, sys_y, sys_w, sys_h = 3.6, 0.4, 16.8, 14.4
    system_border = FancyBboxPatch((sys_x, sys_y), sys_w, sys_h,
                                   boxstyle="round,pad=0.2,rounding_size=0.6",
                                   facecolor="#FCFDFF", edgecolor="#1E3A8A", linewidth=3.0, zorder=1)
    ax.add_patch(system_border)

    # Tiêu đề hệ thống căn trái rõ ràng, không bị cấn Legend
    ax.text(sys_x + 0.5, sys_y + sys_h - 0.45, "HỆ THỐNG CHO THUÊ TÀI KHOẢN GAME TRỰC TUYẾN 24/7 (GAMERENT)",
            ha='left', va='top', fontsize=14.5, fontweight='bold', color="#1E3A8A", zorder=3)
    ax.text(sys_x + 0.5, sys_y + sys_h - 0.90, "SƠ ĐỒ USE CASE TỔNG QUÁT KIẾN TRÚC NGHIỆP VỤ (UML USE CASE DIAGRAM)",
            ha='left', va='top', fontsize=10.5, fontstyle='italic', color="#475569", zorder=3)

    # Khung chú thích ký hiệu (Legend) ở góc trên bên phải
    leg_x, leg_y = 14.8, sys_y + sys_h - 1.0
    leg_box = FancyBboxPatch((leg_x, leg_y), 5.2, 0.72, boxstyle="round,pad=0.1,rounding_size=0.22",
                             facecolor="#F1F5F9", edgecolor="#94A3B8", linewidth=1.2, zorder=3)
    ax.add_patch(leg_box)
    ax.text(leg_x + 0.22, leg_y + 0.36, "CHÚ THÍCH:", fontsize=8.5, fontweight='bold', color="#0F172A", va='center')
    ax.plot([leg_x + 1.25, leg_x + 1.6], [leg_y + 0.36, leg_y + 0.36], color="#1D4ED8", lw=1.8)
    ax.text(leg_x + 1.72, leg_y + 0.36, "Nối", fontsize=8.0, color="#334155", va='center')

    ax.annotate("", xy=(leg_x + 2.8, leg_y + 0.36), xytext=(leg_x + 2.35, leg_y + 0.36),
                arrowprops=dict(arrowstyle="->", color="#059669", lw=1.3, linestyle="--"))
    ax.text(leg_x + 2.92, leg_y + 0.36, "<<include>>", fontsize=8.0, color="#059669", fontweight='bold', va='center')

    ax.annotate("", xy=(leg_x + 4.15, leg_y + 0.36), xytext=(leg_x + 3.7, leg_y + 0.36),
                arrowprops=dict(arrowstyle="->", color="#D97706", lw=1.3, linestyle="--"))
    ax.text(leg_x + 4.25, leg_y + 0.36, "<<extend>>", fontsize=8.0, color="#D97706", fontweight='bold', va='center')

    # ================= 2. CÁC ACTORS =================
    draw_actor(ax, 1.8, 11.8, "Khách vãng lai", "Actor: Guest", color="#0284C7", scale=1.1)
    draw_actor(ax, 1.8, 4.6, "Khách thuê", "Actor: Renter", color="#1D4ED8", scale=1.15)

    # Generalization (Kế thừa vai trò)
    ax.annotate("", xy=(1.8, 10.3), xytext=(1.8, 6.7),
                arrowprops=dict(arrowstyle="-|>", color="#0284C7", lw=2.4, mutation_scale=16), zorder=10)
    ax.text(2.35, 8.5, "<<generalization>>\n(Kế thừa quyền)", ha='left', va='center', fontsize=9.0, color="#0284C7", fontweight='bold')

    draw_actor(ax, 22.2, 10.2, "Quản trị viên", "Actor: Admin", color="#BE123C", scale=1.15)
    draw_actor(ax, 22.2, 3.2, "Hệ thống tự động", "Actor: System Engine", color="#6D28D9", scale=1.1)

    # ================= 3. KHỐI TRÁI - TRÊN: CỬA HÀNG & KHÁM PHÁ (GUEST & THÀNH VIÊN) =================
    # x = 4.2, y = 8.5, w = 7.7, h = 4.6
    draw_card(ax, 4.2, 8.5, 7.7, 4.6,
              "1. CỬA HÀNG & KHÁM PHÁ", "(Guest & Thành viên)",
              bg_color="#F0F9FF", border_color="#7DD3FC", header_bg="#BAE6FD", header_color="#0369A1")

    # Cột 1 (x = 6.2 - Gần Guest): Chức năng công khai
    uc_browse = (6.2, 11.6, "Xem danh mục tài khoản", "(Browse Accounts Catalog)")
    uc_filter = (6.2, 10.3, "Tìm kiếm & Lọc đa tiêu chí", "(Search, Game, Rank, Price)")
    uc_detail = (6.2, 9.0, "Xem chi tiết & Thư viện ảnh", "(Detail Specs & Gallery)")

    # Cột 2 (x = 9.8): Chức năng tài khoản công khai & yêu thích
    uc_auth = (9.8, 11.6, "Đăng ký / Đăng nhập", "(Register & Login)")
    uc_fav = (9.8, 10.3, "Quản lý mục Yêu thích", "(Favorites Separation)")
    uc_pwd = (9.8, 9.0, "Đổi mật khẩu cá nhân", "(Change Password)")

    draw_use_case(ax, uc_browse[0], uc_browse[1], uc_browse[2], uc_browse[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#0284C7", text_color="#0369A1")
    draw_use_case(ax, uc_filter[0], uc_filter[1], uc_filter[2], uc_filter[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#0284C7", text_color="#0369A1")
    draw_use_case(ax, uc_detail[0], uc_detail[1], uc_detail[2], uc_detail[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#0284C7", text_color="#0369A1")

    draw_use_case(ax, uc_auth[0], uc_auth[1], uc_auth[2], uc_auth[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#0284C7", text_color="#0369A1")
    draw_use_case(ax, uc_fav[0], uc_fav[1], uc_fav[2], uc_fav[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#0284C7", text_color="#0369A1")
    draw_use_case(ax, uc_pwd[0], uc_pwd[1], uc_pwd[2], uc_pwd[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#0284C7", text_color="#0369A1")

    # ================= 4. KHỐI TRÁI - DƯỚI: VÍ ĐIỆN TỬ & DỊCH VỤ THUÊ =================
    # x = 4.2, y = 0.8, w = 7.7, h = 7.2
    draw_card(ax, 4.2, 0.8, 7.7, 7.2,
              "2. VÍ ĐIỆN TỬ & THUÊ CA CHƠI", "(Dành cho Khách thuê)",
              bg_color="#F0FDF4", border_color="#86EFAC", header_bg="#BBF7D0", header_color="#15803D")

    # Cột 1 (x = 6.2): Ví tiền
    uc_wallet = (6.2, 6.6, "Xem biến động số dư ví", "(Wallet & Transactions)")
    uc_deposit = (6.2, 5.0, "Nạp tiền ví qua VietQR", "(Deposit VietQR Auto)")
    uc_qr = (6.2, 3.4, "Sinh mã VietQR động", "(Dynamic QR Generator)")

    draw_use_case(ax, uc_wallet[0], uc_wallet[1], uc_wallet[2], uc_wallet[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#16A34A", text_color="#14532D")
    draw_use_case(ax, uc_deposit[0], uc_deposit[1], uc_deposit[2], uc_deposit[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#16A34A", text_color="#14532D")
    draw_use_case(ax, uc_qr[0], uc_qr[1], uc_qr[2], uc_qr[3], w=3.4, h=0.96, bg_color="#ECFDF5", border_color="#059669", text_color="#047857")

    draw_relation(ax, 6.2, 4.5, 6.2, 3.9, label="<<include>>", color="#15803D")

    # Cột 2 (x = 9.8): Thuê & Ca chơi
    uc_rent = (9.8, 6.6, "Thuê tài khoản game", "(Instant Account Rental)")
    uc_lock = (9.8, 5.0, "Kiểm tra ví & Khóa nick", "(Atomic Check & Lock)")
    uc_timer = (9.8, 3.4, "Quản lý ca thuê & Đếm ngược", "(Live Countdown Timer)")
    uc_post_rental = (9.8, 1.8, "Gia hạn / Trả sớm / Khiếu nại", "(Extend / Early / Dispute)")

    draw_use_case(ax, uc_rent[0], uc_rent[1], uc_rent[2], uc_rent[3], w=3.4, h=0.96, bg_color="#EFF6FF", border_color="#2563EB", text_color="#1E40AF")
    draw_use_case(ax, uc_lock[0], uc_lock[1], uc_lock[2], uc_lock[3], w=3.4, h=0.96, bg_color="#EFF6FF", border_color="#4F46E5", text_color="#3730A3")
    draw_use_case(ax, uc_timer[0], uc_timer[1], uc_timer[2], uc_timer[3], w=3.4, h=0.96, bg_color="#FFFBEB", border_color="#D97706", text_color="#92400E")
    draw_use_case(ax, uc_post_rental[0], uc_post_rental[1], uc_post_rental[2], uc_post_rental[3], w=3.4, h=0.96, bg_color="#FEF2F2", border_color="#DC2626", text_color="#991B1B")

    draw_relation(ax, 9.8, 6.1, 9.8, 5.5, label="<<include>>", color="#4F46E5")
    draw_relation(ax, 9.8, 2.3, 9.8, 2.9, label="<<extend>>", color="#D97706")

    # ================= 5. KHỐI PHẢI - TRÊN: QUẢN TRỊ ADMIN =================
    # x = 12.3, y = 5.2, w = 7.7, h = 7.9
    draw_card(ax, 12.3, 5.2, 7.7, 7.9,
              "3. QUẢN TRỊ & VẬN HÀNH (ADMIN)", "(Toàn quyền Quản trị viên)",
              bg_color="#FFF1F2", border_color="#FDA4AF", header_bg="#FECDD3", header_color="#BE123C")

    # Cột Admin 1 (Kho nick & Thao tác kỹ thuật)
    uc_inv = (14.2, 11.6, "Quản trị kho tài khoản", "(Stock Inventory)")
    uc_add_uc1 = (14.2, 9.8, "Thêm tài khoản chuẩn UC1", "(Add Product - BR1-BR6)")
    uc_live = (14.2, 8.0, "Điều phối Live & Bù giờ +1h", "(Live Session Dispatch)")
    uc_backup = (14.2, 6.2, "Cài đặt & Sao lưu JSON", "(Settings & Backup Data)")

    draw_use_case(ax, uc_inv[0], uc_inv[1], uc_inv[2], uc_inv[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#E11D48", text_color="#9F1239")
    draw_use_case(ax, uc_add_uc1[0], uc_add_uc1[1], uc_add_uc1[2], uc_add_uc1[3], w=3.4, h=0.96, bg_color="#FFFBEB", border_color="#D97706", text_color="#B45309")
    draw_use_case(ax, uc_live[0], uc_live[1], uc_live[2], uc_live[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#E11D48", text_color="#9F1239")
    draw_use_case(ax, uc_backup[0], uc_backup[1], uc_backup[2], uc_backup[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#E11D48", text_color="#9F1239")

    draw_relation(ax, 14.2, 10.3, 14.2, 11.1, label="<<extend>>", color="#D97706")

    # Cột Admin 2 (Khiếu nại, CRM, Doanh thu)
    uc_dispute_adm = (18.1, 11.6, "Xử lý khiếu nại (Hoàn 100%)", "(Dispute Claim Resolution)")
    uc_crm = (18.1, 9.8, "Quản lý khách hàng CRM", "(CRM Customer Management)")
    uc_rev = (18.1, 8.0, "Báo cáo doanh thu & KPI", "(Revenue Financial Report)")

    draw_use_case(ax, uc_dispute_adm[0], uc_dispute_adm[1], uc_dispute_adm[2], uc_dispute_adm[3], w=3.4, h=0.96, bg_color="#FEF2F2", border_color="#DC2626", text_color="#991B1B")
    draw_use_case(ax, uc_crm[0], uc_crm[1], uc_crm[2], uc_crm[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#E11D48", text_color="#9F1239")
    draw_use_case(ax, uc_rev[0], uc_rev[1], uc_rev[2], uc_rev[3], w=3.4, h=0.96, bg_color="#FFFFFF", border_color="#E11D48", text_color="#9F1239")

    # ================= 6. KHỐI PHẢI - DƯỚI: TỰ ĐỘNG HÓA HỆ THỐNG =================
    # x = 12.3, y = 0.8, w = 7.7, h = 4.0
    draw_card(ax, 12.3, 0.8, 7.7, 4.0,
              "4. TÁC VỤ NỀN TỰ ĐỘNG (BACKGROUND ENGINE)", "(System Daemon 24/7)",
              bg_color="#FAF5FF", border_color="#D8B4FE", header_bg="#E9D5FF", header_color="#6D28D9")

    uc_autopass = (16.15, 3.4, "Tự thu hồi & Đổi Pass mới khi hết giờ", "(Auto Reset Secret Password Engine)")
    uc_sync_crm = (16.15, 1.8, "Tự động đồng bộ khách mới sang CRM", "(Auto Sync Customers & Orders)")

    draw_use_case(ax, uc_autopass[0], uc_autopass[1], uc_autopass[2], uc_autopass[3], w=5.4, h=0.96, bg_color="#FFFFFF", border_color="#9333EA", text_color="#6B21A8")
    draw_use_case(ax, uc_sync_crm[0], uc_sync_crm[1], uc_sync_crm[2], uc_sync_crm[3], w=5.4, h=0.96, bg_color="#FFFFFF", border_color="#9333EA", text_color="#6B21A8")

    # ================= 7. KẾT NỐI ACTORS (ĐƯỜNG NỐI GỌN GÀNG, KHÔNG CẮT CHÉO HỘP) =================
    
    # --- Guest (Chỉ kết nối với 4 Use Case công khai) ---
    draw_line(ax, 2.5, 12.1, 4.5, 11.6, color="#0284C7", lw=1.8) # Xem danh mục
    draw_line(ax, 2.5, 11.8, 4.5, 10.3, color="#0284C7", lw=1.8) # Tìm kiếm lọc
    draw_line(ax, 2.5, 11.5, 4.5, 9.0, color="#0284C7", lw=1.8)  # Chi tiết
    # Nối thoáng phía trên sang Đăng ký/đăng nhập
    draw_line(ax, 2.5, 12.4, 8.1, 11.6, color="#0284C7", lw=1.5)  # Đăng ký/đăng nhập

    # --- Renter (Đi theo khoảng cách giữa 2 hộp hoặc kết nối trực tiếp, không cắt xuyên qua oval) ---
    # Đi vào Hộp 1:
    draw_line(ax, 2.5, 5.6, 8.1, 10.3, color="#1D4ED8", lw=1.5)  # Yêu thích
    draw_line(ax, 2.5, 5.3, 8.1, 9.0, color="#1D4ED8", lw=1.5)   # Đổi pass
    
    # Đi vào Hộp 2:
    draw_line(ax, 2.5, 5.0, 4.5, 6.6, color="#1D4ED8", lw=1.8)   # Xem ví
    draw_line(ax, 2.5, 4.7, 4.5, 5.0, color="#1D4ED8", lw=1.8)   # Nạp tiền
    draw_line(ax, 2.5, 4.4, 8.1, 6.6, color="#1D4ED8", lw=2.0)   # Thuê acc
    draw_line(ax, 2.5, 4.0, 8.1, 3.4, color="#1D4ED8", lw=1.8)   # Đồng hồ đếm ngược
    draw_line(ax, 2.5, 3.6, 8.1, 1.8, color="#1D4ED8", lw=1.8)   # Gia hạn/Trả sớm/Khiếu nại

    # --- Admin (Nối trực tiếp vào Hộp 3) ---
    draw_line(ax, 21.4, 11.0, 19.8, 11.6, color="#BE123C", lw=1.8) # Khiếu nại
    draw_line(ax, 21.4, 10.5, 19.8, 9.8, color="#BE123C", lw=1.8)  # CRM
    draw_line(ax, 21.4, 10.0, 19.8, 8.0, color="#BE123C", lw=1.8)  # Doanh thu
    draw_line(ax, 21.4, 11.3, 15.9, 11.6, color="#BE123C", lw=1.5) # Kho acc
    draw_line(ax, 21.4, 9.6, 15.9, 8.0, color="#BE123C", lw=1.5)   # Live dispatch
    draw_line(ax, 21.4, 9.2, 15.9, 6.2, color="#BE123C", lw=1.5)   # Backup

    # --- System Engine (Nối thẳng vào Hộp 4) ---
    draw_line(ax, 21.4, 3.5, 18.9, 3.4, color="#6D28D9", lw=2.0)  # Tự đổi pass
    draw_line(ax, 21.4, 3.0, 18.9, 1.8, color="#6D28D9", lw=2.0)  # Tự đồng bộ CRM

    plt.tight_layout()

    # Xuất ảnh
    png_path1 = "Hinh_Anh_Du_An/so_do_use_case_tong_quat.png"
    svg_path1 = "Hinh_Anh_Du_An/so_do_use_case_tong_quat.svg"
    png_path2 = "public/so_do_use_case_tong_quat.png"
    svg_path2 = "public/so_do_use_case_tong_quat.svg"

    fig.savefig(png_path1, dpi=300, bbox_inches='tight')
    fig.savefig(svg_path1, format='svg', bbox_inches='tight')
    fig.savefig(png_path2, dpi=300, bbox_inches='tight')
    fig.savefig(svg_path2, format='svg', bbox_inches='tight')

    print("✅ Đã hoàn thiện sơ đồ Use Case Master Edition!")

if __name__ == '__main__':
    generate_master_diagram()
