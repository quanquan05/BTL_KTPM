# -*- coding: utf-8 -*-
"""
Script vẽ Sơ đồ Kiểm thử chuyển trạng thái (State Transition Testing Diagram)
Chuẩn quốc tế ISTQB & UML 2.5 State Machine Diagram:
1. Vòng đời tài khoản game (Account State Lifecycle)
2. Vòng đời đơn hàng thuê (Order State Lifecycle)
Chất lượng đồ họa cao cấp 300 DPI, hỗ trợ tiếng Việt đầy đủ, bố cục cân đối hoàn hảo.
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch

# Cấu hình font chữ hỗ trợ tiếng Việt
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'Tahoma', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def draw_state_box(ax, x, y, code, vn_title, subtitle="", border_color="#2563EB", bg_color="#EFF6FF", text_color="#1E3A8A", w=3.4, h=1.15):
    """Vẽ một trạng thái (State Node) bo tròn chuẩn UML, có đổ bóng mờ và typography sắc nét"""
    # Đổ bóng nhẹ
    shadow = FancyBboxPatch((x - w/2 + 0.05, y - h/2 - 0.05), w, h,
                            boxstyle="round,pad=0.08,rounding_size=0.3",
                            facecolor="#CBD5E1", edgecolor="none", alpha=0.4, zorder=4)
    ax.add_patch(shadow)

    # Khung chính
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle="round,pad=0.08,rounding_size=0.3",
                         facecolor=bg_color, edgecolor=border_color, linewidth=2.0, zorder=5)
    ax.add_patch(box)

    # Header code [code]
    ax.text(x, y + h*0.24, f"[{code}]", ha='center', va='center',
            fontsize=11.0, fontweight='bold', color=border_color, zorder=7)

    # Tiêu đề tiếng Việt
    ax.text(x, y - h*0.06, vn_title, ha='center', va='center',
            fontsize=11.5, fontweight='bold', color=text_color, zorder=7)

    # Phụ đề / Ý nghĩa nghiệp vụ
    if subtitle:
        ax.text(x, y - h*0.31, subtitle, ha='center', va='center',
                fontsize=8.8, fontstyle='italic', color="#475569", zorder=7)

def draw_uml_start(ax, x, y, label=""):
    """Vẽ nút khởi đầu UML (Start State - Solid dark circle)"""
    circle = Circle((x, y), 0.22, facecolor="#0F172A", edgecolor="#334155", linewidth=1.8, zorder=6)
    ax.add_patch(circle)
    if label:
        ax.text(x, y - 0.38, label, ha='center', va='top', fontsize=9.0, fontweight='bold', color="#334155", zorder=7)

def draw_uml_end(ax, x, y, label=""):
    """Vẽ nút kết thúc UML (Final State - Bullseye circle)"""
    outer = Circle((x, y), 0.26, facecolor="#FFFFFF", edgecolor="#0F172A", linewidth=2.0, zorder=6)
    inner = Circle((x, y), 0.15, facecolor="#0F172A", edgecolor="none", zorder=7)
    ax.add_patch(outer)
    ax.add_patch(inner)
    if label:
        ax.text(x, y - 0.40, label, ha='center', va='top', fontsize=9.0, fontweight='bold', color="#334155", zorder=8)

def draw_transition_arrow(ax, start_xy, end_xy, event_text, cond_text="", rad=0.0,
                          text_pos=None, arrow_color="#2563EB", label_align='center', label_bg="#FFFFFF"):
    """Vẽ mũi tên chuyển trạng thái chuẩn, thanh thoát kèm hộp chú thích sự kiện"""
    arrow = FancyArrowPatch(start_xy, end_xy,
                            connectionstyle=f"arc3,rad={rad}",
                            arrowstyle='-|>',
                            mutation_scale=16,
                            color=arrow_color,
                            linewidth=2.0,
                            zorder=8)
    ax.add_patch(arrow)

    # Tính tọa độ đặt nhãn (nếu có chỉ định vị trí cụ thể)
    if text_pos:
        mx, my = text_pos
    else:
        mx = (start_xy[0] + end_xy[0]) / 2
        my = (start_xy[1] + end_xy[1]) / 2

    # Nội dung nhãn
    if cond_text:
        label_str = f"{event_text}\n[{cond_text}]"
    else:
        label_str = f"{event_text}"

    # Hộp chú thích sự kiện
    if event_text:
        ax.text(mx, my, label_str, ha=label_align, va='center',
                fontsize=9.0, fontweight='bold', color="#0F172A", zorder=12,
                bbox=dict(boxstyle="round,pad=0.32,rounding_size=0.18",
                          facecolor=label_bg, edgecolor=arrow_color, linewidth=1.3,
                          alpha=0.98))

def generate_diagram():
    # Kích thước khung hình 24 x 16 inches chuẩn 300 DPI
    fig, ax = plt.subplots(figsize=(24, 16), dpi=300)
    ax.set_xlim(0, 24)
    ax.set_ylim(0, 16)
    ax.axis('off')

    # Nền canvas tổng thể
    bg = FancyBboxPatch((0.2, 0.2), 23.6, 15.6, boxstyle="square,pad=0",
                        facecolor="#F8FAFC", edgecolor="none", zorder=0)
    ax.add_patch(bg)

    # =========================================================================
    # BANNER TIÊU ĐỀ CHÍNH (TOP BANNER)
    # =========================================================================
    title_card = FancyBboxPatch((0.8, 14.3), 22.4, 1.3,
                                boxstyle="round,pad=0.15,rounding_size=0.35",
                                facecolor="#1E3A8A", edgecolor="#1D4ED8", linewidth=2.0, zorder=2)
    ax.add_patch(title_card)

    ax.text(11.5, 15.15, "SƠ ĐỒ KIỂM THỬ CHUYỂN TRẠNG THÁI (STATE TRANSITION DIAGRAM)",
            ha='center', va='center', fontsize=20, fontweight='bold', color="#FFFFFF", zorder=3)
    ax.text(11.5, 14.65, "HỆ THỐNG CHO THUÊ TÀI KHOẢN GAME TỰ ĐỘNG 24/7 (GAMERENT) - BÀI TẬP LỚN KIỂM THỬ PHẦN MỀM",
            ha='center', va='center', fontsize=12.0, fontstyle='italic', color="#93C5FD", zorder=3)

    # Thẻ thông tin nhóm
    info_tag = FancyBboxPatch((18.6, 14.5), 4.2, 0.7,
                              boxstyle="round,pad=0.1,rounding_size=0.25",
                              facecolor="#059669", edgecolor="none", zorder=4)
    ax.add_patch(info_tag)
    ax.text(20.7, 14.85, "Nhóm 15  ·  Lớp N05\nChuẩn ISTQB & UML 2.5",
            ha='center', va='center', fontsize=10.0, fontweight='bold', color="#FFFFFF", zorder=5)

    # =========================================================================
    # PHÂN HỆ 1: VÒNG ĐỜI TÀI KHOẢN GAME (ACCOUNT STATE MACHINE)
    # Tọa độ: y = 7.1 đến 14.0 (Height = 6.9)
    # =========================================================================
    card1 = FancyBboxPatch((0.8, 7.1), 22.4, 6.9,
                           boxstyle="round,pad=0.15,rounding_size=0.35",
                           facecolor="#FFFFFF", edgecolor="#CBD5E1", linewidth=2.0, zorder=1)
    ax.add_patch(card1)

    # Header Card 1
    header1 = FancyBboxPatch((0.8, 13.35), 22.4, 0.65,
                             boxstyle="round,pad=0.15,rounding_size=0.3",
                             facecolor="#DBEAFE", edgecolor="#93C5FD", linewidth=1.5, zorder=2)
    ax.add_patch(header1)
    ax.text(1.3, 13.68, "PHÂN HỆ 1: VÒNG ĐỜI TRẠNG THÁI TÀI KHOẢN GAME (ACCOUNT STATE LIFECYCLE)",
            ha='left', va='center', fontsize=13.0, fontweight='bold', color="#1E3A8A", zorder=3)
    ax.text(14.5, 13.68, "Quy trình: Sẵn sàng → Đang thuê → Đổi pass mới / Báo lỗi khiếu nại → Bảo trì",
            ha='left', va='center', fontsize=10.0, fontstyle='italic', color="#1E40AF", zorder=3)

    # Khởi tạo trạng thái bắt đầu (UML Start)
    draw_uml_start(ax, 1.5, 10.6, label="Khởi tạo acc")

    # Các Node trạng thái của Account
    # 1. available (Sẵn sàng)
    draw_state_box(ax, 4.3, 10.6,
                   code="available",
                   vn_title="SẴN SÀNG CHO THUÊ",
                   subtitle="Acc hiển thị trên Cửa hàng",
                   border_color="#059669", bg_color="#ECFDF5", text_color="#065F46",
                   w=3.4, h=1.15)

    # 2. rented (Đang thuê)
    draw_state_box(ax, 11.8, 10.6,
                   code="rented",
                   vn_title="ĐANG ĐƯỢC THUÊ",
                   subtitle="Cấp pass in-game cho khách",
                   border_color="#2563EB", bg_color="#EFF6FF", text_color="#1E40AF",
                   w=3.4, h=1.15)

    # 3. need_change_pass (Cần đổi mật khẩu) - Luồng kết thúc bình thường
    draw_state_box(ax, 19.5, 12.0,
                   code="need_change_pass",
                   vn_title="CẦN ĐỔI MẬT KHẨU",
                   subtitle="Hết giờ hoặc Trả sớm",
                   border_color="#D97706", bg_color="#FFFBEB", text_color="#92400E",
                   w=3.5, h=1.15)

    # 4. disputed (Đang khiếu nại) - Luồng phát sinh sự cố
    draw_state_box(ax, 11.8, 8.8,
                   code="disputed",
                   vn_title="ĐANG KHIẾU NẠI",
                   subtitle="Khách báo sai pass / lỗi 2FA",
                   border_color="#DC2626", bg_color="#FEF2F2", text_color="#991B1B",
                   w=3.4, h=1.15)

    # 5. maintenance (Bảo trì an ninh)
    draw_state_box(ax, 19.5, 8.8,
                   code="maintenance",
                   vn_title="ĐANG BẢO TRÌ",
                   subtitle="Admin duyệt bồi thường 100%",
                   border_color="#7C3AED", bg_color="#F5F3FF", text_color="#5B21B6",
                   w=3.5, h=1.15)

    # --- Mũi tên chuyển trạng thái của Account ---
    # 0. Start -> available
    draw_transition_arrow(ax, (1.75, 10.6), (2.6, 10.6),
                          event_text="Nhập kho",
                          cond_text="Form UC1 hợp lệ",
                          rad=0.0, text_pos=(2.15, 11.05), arrow_color="#059669")

    # 1. available -> rented (Khách thuê)
    draw_transition_arrow(ax, (6.0, 10.6), (10.1, 10.6),
                          event_text="Khách thuê",
                          cond_text="Ví đủ tiền & Xác nhận thuê",
                          rad=0.0, text_pos=(8.05, 11.05), arrow_color="#2563EB")

    # 2. rented -> need_change_pass (Hết giờ / Trả sớm)
    draw_transition_arrow(ax, (13.5, 11.0), (17.75, 12.0),
                          event_text="Hết giờ / Trả sớm",
                          cond_text="Countdown về 0 hoặc Return early",
                          rad=-0.10, text_pos=(15.6, 11.95), arrow_color="#D97706")

    # 3. need_change_pass -> available (Đổi pass mới - Vòng lặp trên)
    # Vòng cung lên trên đỉnh need_change_pass về đỉnh available
    draw_transition_arrow(ax, (19.5, 12.6), (4.3, 11.2),
                          event_text="Đổi pass mới",
                          cond_text="generateSecurePassword() thành công",
                          rad=0.12, text_pos=(11.9, 12.75), arrow_color="#059669")

    # 4. rented -> disputed (Báo lỗi)
    draw_transition_arrow(ax, (11.8, 10.0), (11.8, 9.4),
                          event_text="Báo lỗi",
                          cond_text="Khách gửi khiếu nại",
                          rad=0.0, text_pos=(13.35, 9.7), arrow_color="#DC2626")

    # 5. disputed -> maintenance (Admin duyệt hoàn tiền)
    draw_transition_arrow(ax, (13.5, 8.8), (17.75, 8.8),
                          event_text="Admin duyệt hoàn tiền",
                          cond_text="Bồi thường bảo hiểm 100%",
                          rad=0.0, text_pos=(15.6, 9.25), arrow_color="#7C3AED")

    # 6. maintenance -> available (Xử lý xong - Vòng lặp dưới)
    # Vòng cung luồn bên dưới disputed về đáy available
    draw_transition_arrow(ax, (19.5, 8.2), (4.3, 10.0),
                          event_text="Xử lý xong",
                          cond_text="Kỹ thuật đổi pass & reset bảo mật",
                          rad=-0.12, text_pos=(11.9, 7.55), arrow_color="#059669")

    # =========================================================================
    # PHÂN HỆ 2: VÒNG ĐỜI ĐƠN HÀNG THUÊ (ORDER STATE MACHINE)
    # Tọa độ: y = 0.4 đến 6.9 (Height = 6.5)
    # =========================================================================
    card2 = FancyBboxPatch((0.8, 0.4), 22.4, 6.5,
                           boxstyle="round,pad=0.15,rounding_size=0.35",
                           facecolor="#FFFFFF", edgecolor="#CBD5E1", linewidth=2.0, zorder=1)
    ax.add_patch(card2)

    # Header Card 2
    header2 = FancyBboxPatch((0.8, 6.25), 22.4, 0.65,
                             boxstyle="round,pad=0.15,rounding_size=0.3",
                             facecolor="#FEF3C7", edgecolor="#FCD34D", linewidth=1.5, zorder=2)
    ax.add_patch(header2)
    ax.text(1.3, 6.58, "PHÂN HỆ 2: VÒNG ĐỜI TRẠNG THÁI ĐƠN HÀNG THUÊ (ORDER STATE LIFECYCLE)",
            ha='left', va='center', fontsize=13.0, fontweight='bold', color="#92400E", zorder=3)
    ax.text(14.5, 6.58, "Quy trình: active → completed (hết giờ / hoàn 50%) / disputed → refunded (hoàn 100%)",
            ha='left', va='center', fontsize=10.0, fontstyle='italic', color="#B45309", zorder=3)

    # Khởi tạo trạng thái bắt đầu (UML Start)
    draw_uml_start(ax, 1.5, 3.7, label="Tạo đơn")

    # 1. active (Đơn đang hiệu lực)
    draw_state_box(ax, 4.3, 3.7,
                   code="active",
                   vn_title="ĐƠN ĐANG HIỆU LỰC",
                   subtitle="Đang đếm ngược thời gian",
                   border_color="#2563EB", bg_color="#EFF6FF", text_color="#1E40AF",
                   w=3.4, h=1.15)

    # 2. completed (Hết giờ tiêu chuẩn) - Nhánh trên
    draw_state_box(ax, 12.8, 5.2,
                   code="completed",
                   vn_title="HOÀN THÀNH TIÊU CHUẨN",
                   subtitle="Hết giờ ca chơi bình thường",
                   border_color="#059669", bg_color="#ECFDF5", text_color="#065F46",
                   w=3.8, h=1.1)
    draw_uml_end(ax, 15.6, 5.2, label="Kết thúc")

    # 3. completed (hoàn 50%) - Nhánh giữa
    draw_state_box(ax, 12.8, 3.7,
                   code="completed (hoàn 50%)",
                   vn_title="TRẢ NICK SỚM",
                   subtitle="Hoàn lại 50% tiền giờ thừa",
                   border_color="#0D9488", bg_color="#F0FDFA", text_color="#115E59",
                   w=3.8, h=1.1)
    draw_uml_end(ax, 15.6, 3.7, label="Kết thúc")

    # 4. disputed (Đang khiếu nại) - Nhánh dưới
    draw_state_box(ax, 11.8, 1.7,
                   code="disputed",
                   vn_title="ĐANG KHIẾU NẠI",
                   subtitle="Chờ Admin tiếp nhận xử lý",
                   border_color="#DC2626", bg_color="#FEF2F2", text_color="#991B1B",
                   w=3.4, h=1.1)

    # 5. refunded (hoàn 100%) - Sau khi Admin duyệt khiếu nại
    draw_state_box(ax, 18.8, 1.7,
                   code="refunded (hoàn 100%)",
                   vn_title="ĐÃ HOÀN TIỀN 100%",
                   subtitle="Bảo hiểm sự cố toàn diện",
                   border_color="#E11D48", bg_color="#FFF1F2", text_color="#9F1239",
                   w=3.8, h=1.1)
    draw_uml_end(ax, 21.6, 1.7, label="Kết thúc")

    # --- Mũi tên chuyển trạng thái của Order ---
    # 0. Start -> active
    draw_transition_arrow(ax, (1.75, 3.7), (2.6, 3.7),
                          event_text="Thanh toán ví",
                          cond_text="Trừ ví thành công",
                          rad=0.0, text_pos=(2.15, 4.15), arrow_color="#2563EB")

    # 1. active -> completed (Hết giờ)
    draw_transition_arrow(ax, (6.0, 4.1), (10.9, 5.2),
                          event_text="Hết giờ",
                          cond_text="CountdownTimer về 00:00:00",
                          rad=-0.10, text_pos=(8.2, 5.0), arrow_color="#059669")

    # completed -> End
    draw_transition_arrow(ax, (14.7, 5.2), (15.3, 5.2), event_text="", rad=0.0, arrow_color="#059669")

    # 2. active -> completed (hoàn 50%) (Trả sớm)
    draw_transition_arrow(ax, (6.0, 3.7), (10.9, 3.7),
                          event_text="Trả sớm",
                          cond_text="refund = unusedHours × price × 50%",
                          rad=0.0, text_pos=(8.45, 4.15), arrow_color="#0D9488")

    # completed (hoàn 50%) -> End
    draw_transition_arrow(ax, (14.7, 3.7), (15.3, 3.7), event_text="", rad=0.0, arrow_color="#0D9488")

    # 3. active -> disputed (Khiếu nại)
    draw_transition_arrow(ax, (6.0, 3.3), (10.1, 1.7),
                          event_text="Khiếu nại",
                          cond_text="Gửi Dispute sự cố in-game",
                          rad=0.10, text_pos=(8.0, 2.05), arrow_color="#DC2626")

    # 4. disputed -> refunded (hoàn 100%) (Admin duyệt)
    draw_transition_arrow(ax, (13.5, 1.7), (16.9, 1.7),
                          event_text="Admin duyệt",
                          cond_text="Cộng 100% tiền đơn vào ví",
                          rad=0.0, text_pos=(15.2, 2.15), arrow_color="#E11D48")

    # refunded -> End
    draw_transition_arrow(ax, (20.7, 1.7), (21.3, 1.7), event_text="", rad=0.0, arrow_color="#E11D48")

    # =========================================================================
    # BẢNG CHÚ GIẢI (LEGEND & SYMBOLOGY) TẠI GÓC PHẢI PANEL 2
    # =========================================================================
    leg_box = FancyBboxPatch((17.0, 3.35), 6.0, 2.5,
                             boxstyle="round,pad=0.1,rounding_size=0.25",
                             facecolor="#F1F5F9", edgecolor="#CBD5E1", linewidth=1.5, zorder=3)
    ax.add_patch(leg_box)
    ax.text(20.0, 5.50, "CHÚ THÍCH KÝ HIỆU CHUẨN UML", ha='center', va='center',
            fontsize=10.0, fontweight='bold', color="#0F172A", zorder=4)

    # Item 1: Start
    draw_uml_start(ax, 17.6, 4.95)
    ax.text(18.1, 4.95, "Khởi đầu (Initial State)", va='center', fontsize=9.2, color="#334155", zorder=4)

    # Item 2: End
    draw_uml_end(ax, 17.6, 4.40)
    ax.text(18.1, 4.40, "Kết thúc (Final State)", va='center', fontsize=9.2, color="#334155", zorder=4)

    # Item 3: Transition Arrow
    ax.add_patch(FancyArrowPatch((17.3, 3.85), (18.1, 3.85), arrowstyle='-|>', mutation_scale=14, color="#2563EB", lw=2.0, zorder=4))
    ax.text(18.3, 3.85, "Chuyển trạng thái (Transition)", va='center', fontsize=9.2, color="#334155", zorder=4)

    # Item 4: State node
    box_s = FancyBboxPatch((17.3, 3.35), 1.0, 0.35, boxstyle="round,pad=0.05,rounding_size=0.1", facecolor="#DBEAFE", edgecolor="#2563EB", lw=1.2, zorder=4)
    ax.add_patch(box_s)
    ax.text(17.8, 3.52, "[state]", ha='center', va='center', fontsize=8.0, fontweight='bold', color="#1E40AF", zorder=5)
    ax.text(18.6, 3.52, "Nút trạng thái đối tượng", va='center', fontsize=9.2, color="#334155", zorder=4)

    # Footer note
    ax.text(12.0, 0.20, "Dự án: Website cho thuê tài khoản game tự động 24/7 (GameRent)  ·  Khoa CNTT - Trường Đại học Công nghệ Đông Á (EAUT)",
            ha='center', va='center', fontsize=9.5, fontstyle='italic', color="#64748B", zorder=2)

    plt.tight_layout()

    # Đường dẫn xuất file
    out_dir_1 = r"e:\BTL_KTPM\Hinh_Anh_Du_An"
    out_dir_2 = r"e:\BTL_KTPM\public"
    os.makedirs(out_dir_1, exist_ok=True)
    os.makedirs(out_dir_2, exist_ok=True)

    png_path_1 = os.path.join(out_dir_1, "so_do_chuyen_trang_thai_state_transition.png")
    svg_path_1 = os.path.join(out_dir_1, "so_do_chuyen_trang_thai_state_transition.svg")
    png_path_2 = os.path.join(out_dir_2, "so_do_chuyen_trang_thai_state_transition.png")
    svg_path_2 = os.path.join(out_dir_2, "so_do_chuyen_trang_thai_state_transition.svg")

    plt.savefig(png_path_1, dpi=300, bbox_inches='tight')
    plt.savefig(svg_path_1, format='svg', bbox_inches='tight')
    plt.savefig(png_path_2, dpi=300, bbox_inches='tight')
    plt.savefig(svg_path_2, format='svg', bbox_inches='tight')
    plt.close(fig)

    print(f"[OK] Đã xuất thành công Sơ đồ chuyển trạng thái (PNG 300 DPI):\n  -> {png_path_1}\n  -> {png_path_2}")
    print(f"[OK] Đã xuất thành công Sơ đồ chuyển trạng thái (Vector SVG):\n  -> {svg_path_1}\n  -> {svg_path_2}")

if __name__ == "__main__":
    generate_diagram()
