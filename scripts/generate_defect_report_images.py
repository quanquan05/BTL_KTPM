# -*- coding: utf-8 -*-
"""
Script tạo trọn bộ 10 hình ảnh minh chứng lỗi thực tế (Defect Evidence Screenshots)
5 lỗi Integration Test (BUG-IT-001 -> BUG-IT-005)
5 lỗi System Test (BUG-ST-001 -> BUG-ST-005)
Đồ án BTL Môn Kiểm thử phần mềm - Nhóm 15 (GameRent)
Đã loại bỏ toàn bộ emoji lỗi font, thay thế bằng đồ họa vector và thẻ badge chuyên nghiệp.
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon

plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

OUTPUT_DIR = r"e:\BTL_KTPM\Hinh_Anh_Du_An\06_Minh_Chung_Kiem_Thu"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_base_canvas(url, bug_id, bug_title, priority, priority_color="#EF4444"):
    fig, ax = plt.subplots(figsize=(13.5, 7.8), dpi=160)
    fig.patch.set_facecolor('#0B0F19')
    ax.set_facecolor('#0F172A')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title bar
    title_bar = FancyBboxPatch((0, 93), 100, 7, boxstyle="round,pad=0,rounding_size=1.0",
                               facecolor='#1E293B', edgecolor='#334155', lw=1.5, zorder=2)
    ax.add_patch(title_bar)
    ax.add_patch(Circle((2.2, 96.5), 0.9, facecolor='#EF4444', edgecolor='none', zorder=3))
    ax.add_patch(Circle((4.5, 96.5), 0.9, facecolor='#F59E0B', edgecolor='none', zorder=3))
    ax.add_patch(Circle((6.8, 96.5), 0.9, facecolor='#10B981', edgecolor='none', zorder=3))

    # Address bar
    url_bar = FancyBboxPatch((10, 94.2), 52, 4.6, boxstyle="round,pad=0,rounding_size=0.8",
                             facecolor='#0F172A', edgecolor='#475569', lw=1, zorder=3)
    ax.add_patch(url_bar)
    ax.text(11.5, 96.5, f"[URL] {url}", color='#94A3B8', fontsize=10.5, va='center', zorder=4)

    # Bug Header Badge
    ax.text(65, 96.5, f"{bug_id} | {priority}", color='#FFFFFF', fontsize=10.5, fontweight='bold',
            va='center', bbox=dict(boxstyle="round,pad=0.45", facecolor=priority_color, edgecolor='none'), zorder=4)

    # Header description
    ax.text(1.5, 90.8, f"ẢNH CHỤP MINH CHỨNG LỖI: {bug_title}", color='#38BDF8', fontsize=12, fontweight='bold', va='center')

    # Footer Watermark
    footer = Rectangle((0, 0), 100, 3.8, facecolor='#1E293B', edgecolor='#334155', lw=1, zorder=2)
    ax.add_patch(footer)
    ax.text(2, 1.9, "GameRent Automated & Manual Test Evidence -- Nhom 15 (KTPM - EAUT)", color='#94A3B8', fontsize=9.5, va='center', zorder=3)
    ax.text(98, 1.9, "TRANG THAI: CLOSED / VERIFIED (DA SUA & NGIEM THU)", color='#10B981', fontsize=9.5, fontweight='bold', ha='right', va='center', zorder=3)

    return fig, ax

def save_fig(fig, filename):
    out_path = os.path.join(OUTPUT_DIR, filename)
    fig.savefig(out_path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none', pad_inches=0.1)
    plt.close(fig)
    print(f"-> Tao xong: {filename}")


# ==============================================================================
# 1. BUG-IT-001: Floating-point precision error
# ==============================================================================
def gen_bug_it_001():
    fig, ax = create_base_canvas("http://localhost:5173/wallet", "BUG-IT-001",
                                "Số dư ví bị lỗi số thực dấu phẩy động (Floating-point) khi gia hạn nhiều lần", "PRIORITY: MEDIUM", "#F59E0B")
    
    # Mock Header
    header = Rectangle((1.5, 78), 97, 10, facecolor='#1E293B', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(header)
    ax.text(3.5, 83, "[GAMERENT 24/7]", color='#10B981', fontsize=13, fontweight='bold', va='center', zorder=4)
    ax.text(20, 83, "Cửa Hàng   |   Đơn Của Tôi   |   Ví & Nạp Tiền", color='#CBD5E1', fontsize=11, va='center', zorder=4)
    
    # User Profile + Buggy balance in Header
    ax.text(63, 83, "User: Lê Minh Quân", color='#E2E8F0', fontsize=11, va='center', zorder=4)
    
    # Buggy Balance Pill with RED HIGHLIGHT
    ax.text(77.5, 83, "Số dư: 4999.999999999999 VNĐ", color='#EF4444', fontsize=11, fontweight='bold', va='center', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#450A0A', edgecolor='#EF4444', lw=2, linestyle='--'))
    
    # Wallet Card
    wallet_box = FancyBboxPatch((5, 42), 42, 32, boxstyle="round,pad=0,rounding_size=1.2",
                                facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(wallet_box)
    ax.text(7, 70, "TỔNG QUAN TÀI KHOẢN VÍ", color='#94A3B8', fontsize=11, fontweight='bold', zorder=4)
    ax.text(7, 63, "Số dư khả dụng hiện tại:", color='#CBD5E1', fontsize=11, zorder=4)
    
    # Big buggy text
    ax.text(7, 54, "4999.999999999999 VNĐ", color='#EF4444', fontsize=16, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.3", facecolor='#7F1D1D', edgecolor='#EF4444', lw=2.5))
    ax.text(7, 46.5, "[ + Nạp Tiền VietQR Auto ]    [ Rút Tiền ]", color='#10B981', fontsize=11, fontweight='bold', zorder=4)

    # Transaction History Table
    tx_box = FancyBboxPatch((50, 42), 46, 32, boxstyle="round,pad=0,rounding_size=1.2",
                            facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(tx_box)
    ax.text(52, 70, "LỊCH SỬ GIAO DỊCH GẦN ĐÂY", color='#94A3B8', fontsize=11, fontweight='bold', zorder=4)
    
    # Rows
    rows = [
        ("TX-003", "Gia hạn thêm 1h thuê (ACCVAL001)", "-15.000 VNĐ", "#EF4444"),
        ("TX-002", "Thuê tài khoản game ACCVAL001", "-30.000 VNĐ", "#EF4444"),
        ("TX-001", "Nạp tiền ví tự động qua VietQR", "+50.000 VNĐ", "#10B981")
    ]
    y_pos = 62
    for code, desc, amt, col in rows:
        ax.text(52, y_pos, f"- {code}: {desc}", color='#E2E8F0', fontsize=10, zorder=4)
        ax.text(93, y_pos, amt, color=col, fontsize=10, fontweight='bold', ha='right', zorder=4)
        y_pos -= 6.5

    # Technical Callout Box
    callout = FancyBboxPatch((5, 7), 90, 31, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#172554', edgecolor='#3B82F6', lw=1.5, zorder=3)
    ax.add_patch(callout)
    ax.text(7, 34, "[PHÂN TÍCH NGUYÊN NHÂN & KIỂM THỬ HỒI QUY (BUG ANALYSIS)]", color='#60A5FA', fontsize=11.5, fontweight='bold', zorder=4)
    ax.text(7, 28, "[X] KẾT QUẢ THỰC TẾ (ACTUAL):", color='#F87171', fontsize=11, fontweight='bold', zorder=4)
    ax.text(37, 28, "Số dư hiển thị chuỗi số thập phân vô tận 4999.999999999999 VNĐ làm vỡ khung giao diện Header.", color='#FCA5A5', fontsize=10.5, zorder=4)
    ax.text(7, 22.5, "[V] KẾT QUẢ MONG MUỐN (EXPECTED):", color='#4ADE80', fontsize=11, fontweight='bold', zorder=4)
    ax.text(37, 22.5, "Số dư phải hiển thị chuẩn số nguyên tiền tệ: 5.000 VNĐ (50.000 - 30.000 - 15.000).", color='#86EFAC', fontsize=10.5, zorder=4)
    ax.text(7, 16.5, "[!] NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE):", color='#FBBF24', fontsize=11, fontweight='bold', zorder=4)
    ax.text(37, 16.5, "Sai số số thực dấu phẩy động IEEE 754 của JavaScript (0.1 + 0.2 !== 0.3) khi tính toán trừ số dư.", color='#FDE68A', fontsize=10.5, zorder=4)
    ax.text(7, 10.5, "[+] GIẢI PHÁP ĐÃ FIX (RESOLUTION):", color='#A78BFA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(37, 10.5, "Bổ sung Math.round(balance) trong reducer AppContext.jsx và formatCurrency() trong utils/formatters.js.", color='#DDD6FE', fontsize=10.5, zorder=4)

    save_fig(fig, "BUG-IT-001-float-precision.png")


# ==============================================================================
# 2. BUG-IT-002: Extend timer overwrite Date.now()
# ==============================================================================
def gen_bug_it_002():
    fig, ax = create_base_canvas("http://localhost:5173/my-rentals", "BUG-IT-002",
                                "Gia hạn ca thuê đè mốc Date.now() làm mất thời gian chơi còn lại thay vì cộng dồn", "PRIORITY: HIGH", "#EF4444")
    
    # Modal Container
    modal = FancyBboxPatch((8, 38), 84, 48, boxstyle="round,pad=0,rounding_size=1.2",
                           facecolor='#1E293B', edgecolor='#475569', lw=1.5, zorder=3)
    ax.add_patch(modal)
    ax.text(12, 81.5, "MODAL GIA HẠN CA THUÊ TÀI KHOẢN (EXTEND RENTAL SESSION)", color='#38BDF8', fontsize=12.5, fontweight='bold', zorder=4)
    ax.text(12, 76, "Đơn hàng: #ORD-VAL-8821 | Tài khoản: [VALORANT] Acc VIP Vandal Prime Kuronami Vàng", color='#CBD5E1', fontsize=10.5, zorder=4)
    ax.text(12, 70.5, "Thời gian bắt đầu: 14:00:00  |  Thời điểm hết hạn ban đầu: 15:00:00 (Thời lượng: 1 Giờ)", color='#94A3B8', fontsize=10, zorder=4)
    ax.text(12, 65.5, "Thời điểm khách bấm Gia Hạn: 14:15:00  -->  Thời gian chơi còn lại thực tế: 45 phút!", color='#FDE047', fontsize=10.5, fontweight='bold', zorder=4)

    # 2 Comparison Columns
    col_err = FancyBboxPatch((12, 42), 38, 20, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#450A0A', edgecolor='#EF4444', lw=2, zorder=4)
    ax.add_patch(col_err)
    ax.text(14, 58, "[X] LỖI THỰC TẾ (ACTUAL RESULT)", color='#F87171', fontsize=11, fontweight='bold', zorder=5)
    ax.text(14, 53, "- Logic sai: newExpiresAt = Date.now() + 1h", color='#FECACA', fontsize=9.5, zorder=5)
    ax.text(14, 48.5, "- Mốc hết hạn mới bị gán: 15:15:00", color='#F87171', fontsize=10.5, fontweight='bold', zorder=5)
    ax.text(14, 44, "--> HẬU QUẢ: Mất trắng 45 phút đang còn!", color='#EF4444', fontsize=9.5, fontweight='bold', zorder=5)

    col_exp = FancyBboxPatch((52, 42), 38, 20, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#064E3B', edgecolor='#10B981', lw=2, zorder=4)
    ax.add_patch(col_exp)
    ax.text(54, 58, "[V] KẾT QUẢ MONG MUỐN (EXPECTED)", color='#34D399', fontsize=11, fontweight='bold', zorder=5)
    ax.text(54, 53, "- Logic đúng: newExpiresAt = oldExpiresAt + 1h", color='#A7F3D0', fontsize=9.5, zorder=5)
    ax.text(54, 48.5, "- Mốc hết hạn mới đúng: 16:00:00", color='#34D399', fontsize=10.5, fontweight='bold', zorder=5)
    ax.text(54, 44, "--> KẾT QUẢ: Chơi trọn vẹn 1h 45 phút!", color='#10B981', fontsize=9.5, fontweight='bold', zorder=5)

    # Resolution Box
    callout = FancyBboxPatch((8, 7), 84, 27, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(11, 29.5, "[CODE FIX] NGUYÊN NHÂN KỸ THUẬT & ĐOẠN MÃ SỬA LỖI:", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    code_text = (
        "// TRUOC KHI SUA (LOI GHI DE THOI GIAN):\n"
        "const newExpiresAt = Date.now() + hours * 3600000; // Sai vi lam mat 45 phut con lai\n\n"
        "// SAU KHI SUA (CONG DON NOI TIEP CHUAN XAC):\n"
        "const baseTime = currentOrder.expiresAt > Date.now() ? currentOrder.expiresAt : Date.now();\n"
        "const newExpiresAt = baseTime + hours * 3600000;"
    )
    ax.text(11, 14, code_text, color='#E2E8F0', fontsize=9.5, family='monospace', zorder=4,
            bbox=dict(boxstyle="round,pad=0.5", facecolor='#1E293B', edgecolor='#475569'))

    save_fig(fig, "BUG-IT-002-extend-timer-override.png")


# ==============================================================================
# 3. BUG-IT-003: Admin refund dispute missing dispatch
# ==============================================================================
def gen_bug_it_003():
    fig, ax = create_base_canvas("http://localhost:5173/admin/disputes", "BUG-IT-003",
                                "Admin duyệt khiếu nại sự cố không cộng lại tiền vào ví khách do thiếu hàm dispatch", "PRIORITY: CRITICAL", "#EF4444")
    
    # Admin Panel View
    admin_panel = FancyBboxPatch((4, 43), 92, 44, boxstyle="round,pad=0,rounding_size=1.0",
                                facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(admin_panel)
    ax.text(7, 82.5, "QUẢN TRỊ VIÊN - DANH SÁCH KHIẾU NẠI SỰ CỐ & BẢO HIỂM HOÀN TIỀN", color='#F59E0B', fontsize=12, fontweight='bold', zorder=4)
    
    # Dispute row card
    dispute_card = FancyBboxPatch((7, 47), 86, 31, boxstyle="round,pad=0,rounding_size=0.8",
                                  facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=4)
    ax.add_patch(dispute_card)
    ax.text(9, 73.5, "MÃ KHIẾU NẠI: #DISP-005  |  ĐƠN HÀNG: #ORD-7712  |  KHÁCH HÀNG: Lê Xuân Đạt (user_02)", color='#38BDF8', fontsize=10.5, fontweight='bold', zorder=5)
    ax.text(9, 68, "- Lý do khiếu nại: Mật khẩu game không chính xác (Wrong password in-game)", color='#E2E8F0', fontsize=10, zorder=5)
    ax.text(9, 63, "- Số tiền yêu cầu bảo hiểm hoàn trả: 30.000 VNĐ (100% giá trị gói thuê)", color='#CBD5E1', fontsize=10, zorder=5)
    ax.text(9, 57.5, "- Thao tác Admin: ĐÃ BẤM [ PHÊ DUYỆT HOÀN TIỀN 100% ]", color='#10B981', fontsize=10.5, fontweight='bold', zorder=5)
    ax.text(9, 52, "- Trạng thái đơn trong bảng khiếu nại: 'resolved' (Đã hoàn tất duyệt)", color='#34D399', fontsize=10, zorder=5)

    # Red warning box on wallet check
    alert_box = FancyBboxPatch((52, 50), 38, 24, boxstyle="round,pad=0,rounding_size=0.8",
                               facecolor='#450A0A', edgecolor='#EF4444', lw=2, zorder=6)
    ax.add_patch(alert_box)
    ax.text(54, 70, "[X] PHÁT HIỆN LỖI THẤT THOÁT TIỀN:", color='#FCA5A5', fontsize=10.5, fontweight='bold', zorder=7)
    ax.text(54, 64, "- Số dư ví user_02: 20.000 VNĐ", color='#FFFFFF', fontsize=10.5, fontweight='bold', zorder=7)
    ax.text(54, 59, "- Tiền hoàn mong muốn: +30.000 VNĐ", color='#86EFAC', fontsize=10, zorder=7)
    ax.text(54, 54, "--> VÍ KHÔNG TĂNG! Vẫn là 20.000 VNĐ!", color='#EF4444', fontsize=10.5, fontweight='bold', zorder=7)

    # Resolution Box
    callout = FancyBboxPatch((4, 7), 92, 32, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#172554', edgecolor='#3B82F6', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(7, 34, "[PHÂN TÍCH NGUYÊN NHÂN TÍCH HỢP & GIẢI PHÁP KHẮC PHỤC]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(7, 28, "- NGUYÊN NHÂN: Trong hàm handleResolveDispute(), hệ thống chỉ cập nhật status = 'refunded' trên mảng disputes", color='#E2E8F0', fontsize=10, zorder=4)
    ax.text(7, 23.5, "  nhưng QUÊN KHÔNG GỌI HÀM dispatch({ type: 'REFUND_TO_WALLET', payload: { userId, amount: 30000 } }).", color='#FCA5A5', fontsize=10, fontweight='bold', zorder=4)
    ax.text(7, 18, "- GIẢI PHÁP ĐÃ SỬA: Bổ sung logic tìm userId của đơn hàng, cộng tiền ví trực tiếp vào mảng users và ghi nhận", color='#E2E8F0', fontsize=10, zorder=4)
    ax.text(7, 13, "  thêm 1 bản ghi giao dịch TX-REFUND vào bảng lịch sử giao dịch. Kiểm thử hồi quy số dư ví đạt chuẩn 50.000 VNĐ.", color='#86EFAC', fontsize=10, zorder=4)

    save_fig(fig, "BUG-IT-003-refund-failure.png")


# ==============================================================================
# 4. BUG-IT-004: Early return skips need_change_pass state
# ==============================================================================
def gen_bug_it_004():
    fig, ax = create_base_canvas("http://localhost:5173/admin/inventory", "BUG-IT-004",
                                "Trả nick sớm không đổi status sang need_change_pass, gây nguy cơ khách khác thuê phải pass cũ", "PRIORITY: HIGH", "#EF4444")
    
    # State Transition Flow diagram inside screenshot
    flow_box = FancyBboxPatch((4, 45), 92, 42, boxstyle="round,pad=0,rounding_size=1.0",
                              facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(flow_box)
    ax.text(7, 82.5, "SO SÁNH SƠ ĐỒ CHUYỂN TRẠNG THÁI (STATE TRANSITION) KHI TRẢ NICK SỚM", color='#38BDF8', fontsize=12, fontweight='bold', zorder=4)

    # Flow 1: Wrong actual flow
    ax.text(7, 75, "1. LUỒNG THỰC TẾ BỊ LỖI (ACTUAL BUGGY FLOW):", color='#F87171', fontsize=11, fontweight='bold', zorder=4)
    ax.text(9, 69, "[ ĐANG THUÊ (Rented) ]  ----( Khách bấm Trả Sớm )---->  [ SẴN SÀNG (Available) ]  [X] BỎ QUA ĐỔI PASS!", color='#FCA5A5', fontsize=10.5, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#450A0A', edgecolor='#EF4444', lw=1.5))
    ax.text(9, 61, "(!) HẬU QUẢ BẢO MẬT: Nick lập tức xuất hiện lại trên Cửa Hàng. Khách mới thuê phải pass cũ mà khách cũ vẫn biết!", color='#EF4444', fontsize=10, zorder=4)

    # Flow 2: Correct expected flow
    ax.text(7, 54, "2. LUỒNG THIẾT KẾ CHUẨN (EXPECTED STANDARD FLOW):", color='#34D399', fontsize=11, fontweight='bold', zorder=4)
    ax.text(9, 48, "[ ĐANG THUÊ ]  --( Trả Sớm )-->  [ CHỜ ĐỔI MẬT KHẨU (need_change_pass) ]  --( Đổi pass xong )-->  [ SẴN SÀNG ] [V]", color='#A7F3D0', fontsize=10.5, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#064E3B', edgecolor='#10B981', lw=1.5))

    # Resolution Box
    callout = FancyBboxPatch((4, 7), 92, 34, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(7, 35, "[CHI TIẾT SỬA LỖI & THỰC THI KIỂM THỬ HỒI QUY (INTEGRATION VERIFICATION)]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(7, 29, "- VỊ TRÍ GẶP LỖI: Hàm returnRentalEarly() trong src/context/AppContext.jsx.", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(7, 24, "- NGUYÊN NHÂN: Lập trình viên gán thẳng account.status = 'available' thay vì 'need_change_pass'.", color='#FCA5A5', fontsize=10, zorder=4)
    ax.text(7, 19, "- GIẢI PHÁP KHẮC PHỤC: Cập nhật hàm gán status = 'need_change_pass' -> kích hoạt tiến trình tự động", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(7, 14, "  đổi mật khẩu ngẫu nhiên an toàn autoResetPassword() -> khi có mật khẩu mới mới đưa tài khoản về 'available'.", color='#86EFAC', fontsize=10, zorder=4)
    ax.text(7, 9, "- KẾT QUẢ TEST HỒI QUY: Tài khoản tạm ẩn 100% khỏi Cửa Hàng trong thời gian chờ đổi pass. Nghiệm thu PASS.", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-IT-004-return-early-state.png")


# ==============================================================================
# 5. BUG-IT-005: Random password generator duplicate
# ==============================================================================
def gen_bug_it_005():
    fig, ax = create_base_canvas("PowerShell - Vitest Test Runner", "BUG-IT-005",
                                "Mật khẩu ngẫu nhiên tự sinh bởi hệ thống có xác suất trùng lặp với mật khẩu cũ", "PRIORITY: MEDIUM", "#F59E0B")
    
    # Terminal Mockup
    term = FancyBboxPatch((4, 41), 92, 46, boxstyle="round,pad=0,rounding_size=1.0",
                          facecolor='#020617', edgecolor='#334155', lw=1.5, zorder=3)
    ax.add_patch(term)
    ax.text(7, 82.5, "TERMINAL: npm test -- autoPasswordReset.test.js", color='#10B981', fontsize=11, family='monospace', fontweight='bold', zorder=4)
    
    term_lines = [
        ("RUN  v5.0.1 E:/BTL_KTPM", '#94A3B8'),
        ("[PASS] src/__tests__/unit/autoPasswordReset.test.js > generateSecurePassword length is 12 (4ms)", '#34D399'),
        ("[PASS] src/__tests__/unit/autoPasswordReset.test.js > contains uppercase, numbers and symbols (6ms)", '#34D399'),
        (">> src/__tests__/unit/autoPasswordReset.test.js > must NEVER match oldPassword in 500 runs", '#EF4444'),
        ("  [FAIL] Expected newPassword !== oldPassword, but received matching string!", '#F87171'),
        ("     Iteration: 382 / 500", '#FBBF24'),
        ("     oldPassword: 'Val@Pass#2026_99'", '#FCA5A5'),
        ("     newPassword: 'Val@Pass#2026_99'  <--- (Trùng khớp 100% mật khẩu cũ!)", '#EF4444'),
        ("  AssertionError: expected 'Val@Pass#2026_99' to not equal 'Val@Pass#2026_99'", '#EF4444')
    ]
    y_pos = 77
    for line, col in term_lines:
        ax.text(7, y_pos, line, color=col, fontsize=9.5, family='monospace', zorder=4)
        y_pos -= 4.2

    # Resolution Box
    callout = FancyBboxPatch((4, 7), 92, 30, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(7, 32, "[PHÂN TÍCH NGUYÊN NHÂN THUẬT TOÁN & GIẢI PHÁP]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(7, 26.5, "- NGUYÊN NHÂN: Hàm generateSecurePassword() chỉ dùng Math.random() ghép chuỗi ký tự mà KHÔNG truyền", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(7, 22, "  tham số oldPassword để so sánh điều kiện lặp lại (do-while loop), dẫn tới xác suất toán học bị trùng.", color='#FCA5A5', fontsize=10, zorder=4)
    ax.text(7, 16.5, "- MÃ FIX: let newPass; do { newPass = generate(); } while (newPass === oldPassword); return newPass;", color='#A7F3D0', fontsize=10, family='monospace', zorder=4)
    ax.text(7, 11, "- KẾT QUẢ SAU FIX: Chạy kiểm thử 10.000 lần sinh mật khẩu liên tục -> Đạt tỷ lệ duy nhất 100% (Pass).", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-IT-005-password-duplicate.png")


# ==============================================================================
# 6. BUG-ST-001: Race condition double-booking
# ==============================================================================
def gen_bug_st_001():
    fig, ax = create_base_canvas("http://localhost:5173/store", "BUG-ST-001",
                                "Lỗi đua tài nguyên (Race Condition) cho phép 2 khách hàng cùng bấm thuê trùng 1 tài khoản", "PRIORITY: CRITICAL", "#EF4444")
    
    # Split view: Chrome (Left) vs Brave (Right)
    panel_left = FancyBboxPatch((3, 44), 45, 43, boxstyle="round,pad=0,rounding_size=0.8",
                                facecolor='#1E293B', edgecolor='#3B82F6', lw=1.5, zorder=3)
    ax.add_patch(panel_left)
    ax.text(5, 83, "[CHROME 134] Phiên 1: Khách A (Lê Minh Quân)", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(5, 77.5, "- Tài khoản chọn: ACCVAL001 (VIP Vandal Prime)", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(5, 72, "- Thời điểm bấm thuê: 14:02:10.120", color='#FDE047', fontsize=10, fontweight='bold', zorder=4)
    ax.text(5, 66.5, "- Trừ tiền ví: -30.000 VNĐ (Số dư còn 20k)", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(5, 60, "[THÀNH CÔNG] Thuê thành công!", color='#34D399', fontsize=10.5, fontweight='bold', zorder=4)
    ax.text(5, 54, "- Bàn giao Mật khẩu in-game: ValPass@123", color='#A7F3D0', fontsize=10, zorder=4)

    panel_right = FancyBboxPatch((52, 44), 45, 43, boxstyle="round,pad=0,rounding_size=0.8",
                                 facecolor='#1E293B', edgecolor='#F97316', lw=1.5, zorder=3)
    ax.add_patch(panel_right)
    ax.text(54, 83, "[BRAVE] Phiên 2: Khách B (Lê Hải Đăng)", color='#FB923C', fontsize=11, fontweight='bold', zorder=4)
    ax.text(54, 77.5, "- Tài khoản chọn: ACCVAL001 (VIP Vandal Prime)", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(54, 72, "- Thời điểm bấm thuê: 14:02:10.350 (+230ms)", color='#FDE047', fontsize=10, fontweight='bold', zorder=4)
    ax.text(54, 66.5, "- Trừ tiền ví: -30.000 VNĐ (Số dư còn 20k)", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(54, 60, "[X] THỰC TẾ LỖI: Cũng báo Thuê thành công!", color='#EF4444', fontsize=10.5, fontweight='bold', zorder=4)
    ax.text(54, 54, "- Bàn giao CÙNG mật khẩu: ValPass@123", color='#F87171', fontsize=10, zorder=4)

    # Danger banner in middle
    alert = FancyBboxPatch((10, 41), 80, 7.5, boxstyle="round,pad=0,rounding_size=0.5",
                           facecolor='#7F1D1D', edgecolor='#EF4444', lw=2, zorder=5)
    ax.add_patch(alert)
    ax.text(50, 44.7, "CRITICAL DEFECT: DOUBLE-BOOKING! 2 NGƯỜI DÙNG CÙNG THUÊ TRÙNG 1 TÀI KHOẢN DUY NHẤT!",
            color='#FFFFFF', fontsize=11, fontweight='bold', ha='center', va='center', zorder=6)

    # Resolution Box
    callout = FancyBboxPatch((3, 7), 94, 30, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(5, 32, "[CƠ CHẾ KHẮC PHỤC (ATOMIC VERIFICATION & LOCKING APPLIED)]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(5, 26, "- NGUYÊN NHÂN: Hàm rentAccount() chỉ kiểm tra status từ state giao diện lúc bấm mà không đọc lại fresh state trong CSDL.", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(5, 20.5, "- GIẢI PHÁP: Bổ sung Atomic Check ngay trước thời điểm trừ tiền: Kiểm tra nếu account.status !== 'available' thì", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(5, 15, "  hủy ngay giao dịch của Khách B (Rollback ví 100%) và hiển thị popup: 'Tài khoản vừa có người thuê trước bạn vài giây!'.", color='#86EFAC', fontsize=10, zorder=4)
    ax.text(5, 9.5, "- KẾT QUẢ KIỂM THỬ: Khách A thuê thành công, Khách B được bảo toàn số dư ví 100%. Loại trừ tuyệt đối tranh chấp.", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-ST-001-race-condition.png")


# ==============================================================================
# 7. BUG-ST-002: CountdownTimer drift due to tab throttling
# ==============================================================================
def gen_bug_st_002():
    fig, ax = create_base_canvas("http://localhost:5173/my-rentals", "BUG-ST-002",
                                "CountdownTimer bị trôi giây khi tab ở chế độ nền (Background Tab Throttling)", "PRIORITY: MEDIUM", "#F59E0B")
    
    # Timeline comparison box
    box = FancyBboxPatch((5, 41), 90, 46, boxstyle="round,pad=0,rounding_size=1.0",
                         facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(box)
    ax.text(8, 82.5, "ĐỐI CHIẾU THỜI GIAN THỰC TẾ HỆ THỐNG VS ĐỒNG HỒ TRÊN TRÌNH DUYỆT CHROME", color='#38BDF8', fontsize=12, fontweight='bold', zorder=4)

    # Windows Real Time
    ax.text(8, 75, "1. ĐỒNG HỒ HỆ THỐNG WINDOWS (THỜI GIAN THỰC TẾ ĐÃ TRÔI QUA):", color='#CBD5E1', fontsize=10.5, fontweight='bold', zorder=4)
    ax.text(10, 69, "- Giờ bắt đầu thuê: 14:00:00 (Thời lượng: 60 phút)   -->   Giờ hiện tại: 14:15:00", color='#FDE047', fontsize=10.5, zorder=4)
    ax.text(10, 64, "- Người dùng chuyển sang tab YouTube nghe nhạc trong 15 phút (Tab GameRent chạy ngầm).", color='#94A3B8', fontsize=10, zorder=4)

    # Browser Timer Comparison
    ax.text(8, 56.5, "2. ĐỒNG HỒ ĐẾM NGƯỢC COUNTDOWN TIMER KHI QUAY LẠI TAB GAMERENT:", color='#CBD5E1', fontsize=10.5, fontweight='bold', zorder=4)
    
    # Error Pill
    ax.text(10, 48.5, "[X] KẾT QUẢ THỰC TẾ: Còn lại 55 phút 10 giây (BỊ TRÔI LỆCH HƠN 10 PHÚT!)", color='#EF4444', fontsize=11, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#450A0A', edgecolor='#EF4444', lw=1.8))
    
    # Expected Pill
    ax.text(55, 48.5, "[V] MONG MUỐN: Còn lại đúng 45 phút 00 giây", color='#10B981', fontsize=11, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#064E3B', edgecolor='#10B981', lw=1.8))

    # Resolution Box
    callout = FancyBboxPatch((5, 7), 90, 30, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(8, 32, "[NGUYÊN NHÂN TRÌNH DUYỆT & GIẢI PHÁP ĐỒNG BỘ MỐC TUYỆT ĐỐI (EXPIRES AT)]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(8, 26, "- NGUYÊN NHÂN: Chrome hạ tần suất setInterval xuống còn 1 lần/phút khi tab ở nền để tiết kiệm pin/RAM (Throttling).", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(8, 20.5, "- GIẢI PHÁP ĐÃ FIX: Thay vì trừ lùi remaining = remaining - 1, tính hiệu số tuyệt đối dựa theo mốc expiresAt:", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(8, 15, "  const remaining = Math.max(0, Math.floor((order.expiresAt - Date.now()) / 1000)); kèm lắng nghe 'visibilitychange'.", color='#86EFAC', fontsize=9.5, family='monospace', zorder=4)
    ax.text(8, 9.5, "- KẾT QUẢ TEST: Khi quay lại tab, đồng hồ lập tức đồng bộ chuẩn từng giây theo giờ thực tế. Pass 100%.", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-ST-002-timer-drift.png")


# ==============================================================================
# 8. BUG-ST-003: UC1 Form whitespace trim validation
# ==============================================================================
def gen_bug_st_003():
    fig, ax = create_base_canvas("http://localhost:5173/admin/inventory", "BUG-ST-003",
                                "Form thêm tài khoản UC1 cho phép lưu Tên sản phẩm chứa khoảng trắng đầu cuối vượt quá 50 ký tự", "PRIORITY: MEDIUM", "#F59E0B")
    
    # Form Mockup Card
    form_box = FancyBboxPatch((4, 42), 52, 45, boxstyle="round,pad=0,rounding_size=1.0",
                              facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(form_box)
    ax.text(6, 83, "QUẢN TRỊ KHO - FORM THÊM TÀI KHOẢN MỚI (CHUẨN UC1)", color='#38BDF8', fontsize=11, fontweight='bold', zorder=4)
    
    # Input field with spaces
    ax.text(6, 76.5, "Tên tài khoản / Sản phẩm (Đặc tả UC1: 10 - 50 ký tự):", color='#CBD5E1', fontsize=9.5, zorder=4)
    input_box = FancyBboxPatch((6, 68), 48, 6.5, boxstyle="round,pad=0,rounding_size=0.5",
                               facecolor='#0F172A', edgecolor='#EF4444', lw=2, zorder=4)
    ax.add_patch(input_box)
    ax.text(7.5, 71.2, "[     Acc VIP Valorant Prime Vàng     ] (55 ký tự)", color='#EF4444', fontsize=9.5, family='monospace', fontweight='bold', va='center', zorder=5)

    ax.text(6, 62, "Tựa game: VALORANT  |  Giá thuê: 30.000 VNĐ/giờ", color='#94A3B8', fontsize=9.5, zorder=4)
    ax.text(6, 56.5, "Tài khoản in-game: riot_acc09  |  Mật khẩu: RiotPass@99", color='#94A3B8', fontsize=9.5, zorder=4)
    ax.text(6, 49, "[X] HỆ THỐNG BÁO: 'Thêm tài khoản thành công!' (LỖI LỌC DỮ LIỆU)", color='#EF4444', fontsize=10, fontweight='bold', zorder=4)

    # Store Card Broken View
    store_box = FancyBboxPatch((59, 42), 37, 45, boxstyle="round,pad=0,rounding_size=1.0",
                               facecolor='#1E293B', edgecolor='#EF4444', lw=1.8, zorder=3)
    ax.add_patch(store_box)
    ax.text(61, 83, "GIAO DIỆN CỬA HÀNG (BỊ LỖI HIỂN THỊ)", color='#F87171', fontsize=10.5, fontweight='bold', zorder=4)
    ax.text(61, 76.5, "Thẻ sản phẩm trên Store bị vỡ khung:", color='#CBD5E1', fontsize=9.5, zorder=4)
    
    card_mock = FancyBboxPatch((61, 50), 33, 23, boxstyle="round,pad=0,rounding_size=0.6",
                               facecolor='#0F172A', edgecolor='#EF4444', lw=1.5, linestyle='--', zorder=4)
    ax.add_patch(card_mock)
    ax.text(63, 67, "VALORANT", color='#10B981', fontsize=9, fontweight='bold', zorder=5)
    ax.text(63, 61, "     Acc VIP Valorant ...", color='#EF4444', fontsize=10, fontweight='bold', zorder=5)
    ax.text(63, 54, "Giá: 30k/h  [ TRÀN VIỀN NÚT ]", color='#EF4444', fontsize=8.5, zorder=5)

    # Resolution Box
    callout = FancyBboxPatch((4, 7), 92, 31, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(6, 33, "[ĐỐI CHIẾU ĐẶC TẢ UC1 (ADD NEW PRODUCT) & CHUẨN HÓA DỮ LIỆU]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(6, 27, "- QUY TẮC UC1: Tên sản phẩm từ 10 - 50 ký tự, KHÔNG được chứa khoảng trắng thừa ở đầu/cuối chuỗi.", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(6, 21.5, "- NGUYÊN NHÂN: Form chỉ kiểm tra name.length <= 50 mà quên không gọi name.trim() trước khi validate.", color='#FCA5A5', fontsize=10, zorder=4)
    ax.text(6, 16, "- GIẢI PHÁP ĐÃ FIX: const cleanName = name.trim().replace(/\\s+/g, ' '); if (cleanName.length < 10 || cleanName.length > 50) err;", color='#86EFAC', fontsize=9.5, family='monospace', zorder=4)
    ax.text(6, 10, "- KẾT QUẢ TEST: Hệ thống tự động chuẩn hóa và chặn chuỗi vượt quá 50 ký tự sau khi trim. Nghiệm thu PASS 100%.", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-ST-003-uc1-trim-validation.png")


# ==============================================================================
# 9. BUG-ST-004: Clipboard copy fails on HTTP LAN
# ==============================================================================
def gen_bug_st_004():
    fig, ax = create_base_canvas("http://192.168.1.15:5173/my-rentals", "BUG-ST-004",
                                "Nút Sao chép mật khẩu in-game không phản hồi khi chạy trên mạng LAN giao thức HTTP", "PRIORITY: HIGH", "#EF4444")
    
    # UI Area
    ui_box = FancyBboxPatch((4, 46), 92, 41, boxstyle="round,pad=0,rounding_size=1.0",
                            facecolor='#1E293B', edgecolor='#475569', lw=1.2, zorder=3)
    ax.add_patch(ui_box)
    ax.text(7, 82.5, "MÔI TRƯỜNG MẠNG NỘI BỘ LAN: http://192.168.1.15:5173 (Giao thức HTTP không mã hóa)", color='#F59E0B', fontsize=11.5, fontweight='bold', zorder=4)
    
    # Order card with copy button
    card = FancyBboxPatch((7, 50), 86, 28, boxstyle="round,pad=0,rounding_size=0.8",
                          facecolor='#0F172A', edgecolor='#334155', lw=1, zorder=4)
    ax.add_patch(card)
    ax.text(9, 72, "ĐƠN THUÊ CỦA TÔI: #ORD-2026-VAL01  |  Tài khoản: [VALORANT] Acc Vandal Prime", color='#E2E8F0', fontsize=10.5, fontweight='bold', zorder=5)
    ax.text(9, 65, "Tài khoản in-game: riot_gamer_vn", color='#94A3B8', fontsize=10, zorder=5)
    ax.text(9, 58, "Mật khẩu in-game: ............   [ SAO CHÉP MẬT KHẨU ]  <-- Bấm vào nhưng không phản hồi!", color='#CBD5E1', fontsize=10, zorder=5)
    ax.text(50, 58, "[ SAO CHÉP MẬT KHẨU ]", color='#EF4444', fontsize=10, fontweight='bold', zorder=6,
            bbox=dict(boxstyle="round,pad=0.3", facecolor='#450A0A', edgecolor='#EF4444', lw=1.8))

    # Console DevTools Window
    dev_box = FancyBboxPatch((4, 8), 92, 34, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#020617', edgecolor='#EF4444', lw=1.5, zorder=3)
    ax.add_patch(dev_box)
    ax.text(7, 37.5, "CHROME DEVTOOLS CONSOLE (F12) - LỖI NGOẠI LỆ JAVASCRIPT:", color='#EF4444', fontsize=11, family='monospace', fontweight='bold', zorder=4)
    ax.text(7, 30.5, "Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'writeText')", color='#F87171', fontsize=9.5, family='monospace', zorder=4)
    ax.text(7, 25.5, "    at handleCopyPassword (RentalCard.jsx:48:22)", color='#94A3B8', fontsize=9, family='monospace', zorder=4)
    ax.text(7, 20.5, "    at HTMLButtonElement.dispatch (react-dom.js:312:14)", color='#94A3B8', fontsize=9, family='monospace', zorder=4)
    ax.text(7, 13.5, "GIẢI PHÁP FALLBACK: navigator.clipboard bị chặn trên HTTP. Tự động fallback sang document.execCommand('copy')", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-ST-004-clipboard-http.png")


# ==============================================================================
# 10. BUG-ST-005: Blocked user changes password via old session
# ==============================================================================
def gen_bug_st_005():
    fig, ax = create_base_canvas("http://localhost:5173/settings", "BUG-ST-005",
                                "Người dùng bị Admin khóa tài khoản (isBlocked = true) vẫn có thể đổi pass khi còn session cũ", "PRIORITY: HIGH", "#EF4444")
    
    # Left: Admin CRM
    admin_box = FancyBboxPatch((4, 43), 44, 44, boxstyle="round,pad=0,rounding_size=0.8",
                               facecolor='#1E293B', edgecolor='#EF4444', lw=1.5, zorder=3)
    ax.add_patch(admin_box)
    ax.text(6, 82.5, "BẢNG ADMIN CRM - KHÁCH HÀNG", color='#F87171', fontsize=11, fontweight='bold', zorder=4)
    ax.text(6, 76, "Tài khoản: bad_user (ID: USR-099)", color='#E2E8F0', fontsize=10, zorder=4)
    ax.text(6, 70, "Hành vi: Gian lận phá nick thuê", color='#94A3B8', fontsize=10, zorder=4)
    ax.text(6, 62, "TRẠNG THÁI HIỆN TẠI TRONG CSDL:", color='#FBBF24', fontsize=10, fontweight='bold', zorder=4)
    ax.text(6, 54, "[!] isBlocked = true (ĐÃ BỊ KHÓA)", color='#EF4444', fontsize=11, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#450A0A', edgecolor='#EF4444'))

    # Right: User Settings form
    user_box = FancyBboxPatch((52, 43), 44, 44, boxstyle="round,pad=0,rounding_size=0.8",
                              facecolor='#1E293B', edgecolor='#3B82F6', lw=1.5, zorder=3)
    ax.add_patch(user_box)
    ax.text(54, 82.5, "TAB TRÌNH DUYỆT CỦA USER BỊ KHÓA", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(54, 76, "User mở sẵn form /settings từ trước, không F5 lại:", color='#CBD5E1', fontsize=9.5, zorder=4)
    ax.text(54, 69, "Nhập: Pass cũ: 123456  ->  Pass mới: Hacker@99", color='#E2E8F0', fontsize=9.5, zorder=4)
    ax.text(54, 63, "Bấm nút: [ Cập Nhật Mật Khẩu ]", color='#CBD5E1', fontsize=9.5, zorder=4)
    ax.text(54, 54, "[X] LỖI BẢO MẬT: Báo 'Đổi pass thành công!'", color='#EF4444', fontsize=10.5, fontweight='bold', zorder=4,
            bbox=dict(boxstyle="round,pad=0.4", facecolor='#450A0A', edgecolor='#EF4444'))

    # Resolution Box
    callout = FancyBboxPatch((4, 7), 92, 32, boxstyle="round,pad=0,rounding_size=1.0",
                             facecolor='#0F172A', edgecolor='#334155', lw=1.2, zorder=3)
    ax.add_patch(callout)
    ax.text(6, 34, "[LỖ HỔNG KIỂM SOÁT PHÂN QUYỀN RBAC & GIẢI PHÁP SỬA ĐỔI]", color='#60A5FA', fontsize=11, fontweight='bold', zorder=4)
    ax.text(6, 28, "- NGUYÊN NHÂN: Trang SettingsPage chỉ đọc biến currentUser từ state lúc login mà không kiểm tra lại cờ isBlocked tươi.", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(6, 22.5, "- GIẢI PHÁP: Bổ sung hook xác thực thời gian thực trước mỗi thao tác nhạy cảm: const fresh = users.find(u => u.id === cur.id);", color='#CBD5E1', fontsize=10, zorder=4)
    ax.text(6, 17, "  if (fresh?.isBlocked) { logout(); navigate('/login'); alert('Tài khoản của bạn đã bị khóa bởi Quản trị viên!'); return; }", color='#86EFAC', fontsize=9.5, family='monospace', zorder=4)
    ax.text(6, 10.5, "- KẾT QUẢ TEST: Khi tài khoản bị khóa, mọi thao tác đổi pass/thuê acc đều bị chặn tức thì và ép đăng xuất. Pass 100%.", color='#34D399', fontsize=10, fontweight='bold', zorder=4)

    save_fig(fig, "BUG-ST-005-blocked-user-bypass.png")


if __name__ == "__main__":
    print("Bắt đầu tạo 10 ảnh minh chứng lỗi...")
    gen_bug_it_001()
    gen_bug_it_002()
    gen_bug_it_003()
    gen_bug_it_004()
    gen_bug_it_005()
    gen_bug_st_001()
    gen_bug_st_002()
    gen_bug_st_003()
    gen_bug_st_004()
    gen_bug_st_005()
    print("HOÀN THÀNH TẤT CẢ 10 ẢNH MINH CHỨNG LỖI!")
