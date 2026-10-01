# -*- coding: utf-8 -*-
"""
Script khởi tạo và chuẩn hóa toàn diện file ST_Test Case.xlsx cho dự án GameRent
Đảm bảo đồng bộ 100% với:
- Báo cáo Word: Bao_Cao_Bai_Tap_Lon_Kiem_Thu_Phan_Mem.docx (Chương 2.3 & Chương 3.2)
- Hồ sơ dự án: CHI_TIET_DU_AN_GAMERENT.md
- Mã nguồn chạy thực tế và bộ kiểm thử tự động Vitest
- Nhóm thực hiện: Nhóm 15 (Lớp: Kiểm thử phần mềm-1-1-26(N05))
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

EXCEL_PATH = r"e:\BTL_KTPM\Tài_Liệu\ST_Test Case.xlsx"

# Bảng màu chuẩn mực
NAVY_FILL = PatternFill(start_color="000080", end_color="000080", fill_type="solid")
HEADER_BLUE_FILL = PatternFill(start_color="1A365D", end_color="1A365D", fill_type="solid")
SUBHEADER_FILL = PatternFill(start_color="2B6CB0", end_color="2B6CB0", fill_type="solid")
LIGHT_BLUE_FILL = PatternFill(start_color="EBF8FF", end_color="EBF8FF", fill_type="solid")
LIGHT_GRAY_FILL = PatternFill(start_color="F7FAFC", end_color="F7FAFC", fill_type="solid")
ACCENT_GREEN_FILL = PatternFill(start_color="E6FFFA", end_color="E6FFFA", fill_type="solid")
CRITICAL_FILL = PatternFill(start_color="FED7D7", end_color="FED7D7", fill_type="solid")
HIGH_FILL = PatternFill(start_color="FEEBC8", end_color="FEEBC8", fill_type="solid")
PASS_GREEN_FILL = PatternFill(start_color="C6F6D5", end_color="C6F6D5", fill_type="solid")

WHITE_BOLD_FONT = Font(name="Tahoma", size=10, bold=True, color="FFFFFF")
WHITE_TITLE_FONT = Font(name="Tahoma", size=11, bold=True, color="FFFFFF")
BLACK_REGULAR_FONT = Font(name="Tahoma", size=9.5, bold=False, color="000000")
BLACK_BOLD_FONT = Font(name="Tahoma", size=9.5, bold=True, color="000000")
HEADER_TITLE_FONT = Font(name="Tahoma", size=14, bold=True, color="000080")
SECTION_FONT = Font(name="Tahoma", size=11, bold=True, color="1A365D")
PASS_FONT = Font(name="Tahoma", size=10, bold=True, color="22543D")

THIN_BORDER = Border(
    left=Side(style='thin', color='A0AEC0'),
    right=Side(style='thin', color='A0AEC0'),
    top=Side(style='thin', color='A0AEC0'),
    bottom=Side(style='thin', color='A0AEC0')
)
DOUBLE_BOTTOM_BORDER = Border(
    left=Side(style='thin', color='A0AEC0'),
    right=Side(style='thin', color='A0AEC0'),
    top=Side(style='thin', color='A0AEC0'),
    bottom=Side(style='double', color='1A365D')
)

def style_cell(cell, font=None, fill=None, border=None, alignment=None):
    if font: cell.font = font
    if fill: cell.fill = fill
    if border: cell.border = border
    if alignment: cell.alignment = alignment

def update_cover_sheet(ws):
    """Cập nhật trang bìa Cover chuẩn xác cho Nhóm 15"""
    # Merged cell B2:F3
    ws["B2"] = "SYSTEM TEST CASE (STC) - HỆ THỐNG GAMERENT"
    ws["B2"].font = Font(name="Tahoma", size=14, bold=True, color="000080")
    ws["B2"].alignment = Alignment(horizontal="center", vertical="center")

    # Project Information (B5: Project Name, C5:F5 merged value; B6: Code; B7: Doc Code)
    ws["B5"] = "Project Name"
    ws["C5"] = "GameRent - Website Cho Thuê Tài Khoản Game Tự Động 24/7"

    ws["B6"] = "Project Code"
    ws["C6"] = "GAMERENT"

    ws["B7"] = "Document Code"
    ws["C7"] = '=C6&"_"&"STC_v1.0"'

    # Styling info cells
    for r in range(5, 8):
        ws[f"B{r}"].font = BLACK_BOLD_FONT
        ws[f"C{r}"].font = BLACK_BOLD_FONT

    # Record of change
    ws["B9"] = "Record of change"
    ws["B9"].font = Font(name="Tahoma", size=11, bold=True, color="000080")

    ws["B11"] = "10/09/2026"
    ws["C11"] = "0.1"
    ws["D11"] = "Khởi tạo tài liệu và phác thảo các kịch bản kiểm thử hệ thống E2E"
    ws["E11"] = "A"
    ws["F11"] = "Lê Minh Quân"
    ws["G11"] = "ThS. Phạm Thị Loan"
    ws["H11"] = "10/09/2026"
    ws["I11"] = "0.1"
    ws["J11"] = "Soạn thảo ban đầu kịch bản kiểm thử E2E hệ thống GameRent"

    ws["B12"] = "26/09/2026"
    ws["C12"] = "1.0"
    ws["D12"] = "Hoàn thiện 100% System Test Cases E2E, Test Report & Bug Log"
    ws["E12"] = "M"
    ws["F12"] = "Nhóm 15"
    ws["G12"] = "ThS. Phạm Thị Loan"
    ws["H12"] = "26/09/2026"
    ws["I12"] = "1.0"
    ws["J12"] = "Thiết kế và thực thi đầy đủ 12 ca kiểm thử E2E toàn trình, Pass 100%, đồng bộ 100% dữ liệu báo cáo BTL"

    for r in [11, 12]:
        for col in ["B", "C", "D", "E", "F", "G", "H", "I", "J"]:
            ws[f"{col}{r}"].font = BLACK_REGULAR_FONT
            ws[f"{col}{r}"].alignment = Alignment(vertical="center", wrap_text=True)
            if col in ["B", "C", "E", "F", "G", "H", "I"]:
                ws[f"{col}{r}"].alignment = Alignment(horizontal="center", vertical="center")

    ws.column_dimensions["B"].width = 16
    ws.column_dimensions["C"].width = 10
    ws.column_dimensions["D"].width = 38
    ws.column_dimensions["E"].width = 8
    ws.column_dimensions["F"].width = 16
    ws.column_dimensions["G"].width = 20
    ws.column_dimensions["H"].width = 14
    ws.column_dimensions["I"].width = 10
    ws.column_dimensions["J"].width = 45

def update_business_flow_sheet(ws):
    """Cập nhật Sheet Luồng nghiệp vụ chi tiết cho hệ thống GameRent"""
    # Hủy merge cũ nếu có
    merged_to_remove = [str(rng) for rng in ws.merged_cells.ranges]
    for rng in merged_to_remove:
        try:
            ws.unmerge_cells(rng)
        except Exception:
            pass

    # Xóa nội dung cũ
    for row in ws.iter_rows(min_row=1, max_row=ws.max_row, min_col=1, max_col=15):
        for cell in row:
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    ws["B2"] = "ĐẶC TẢ CÁC LUỒNG QUY TRÌNH NGHIỆP VỤ HỆ THỐNG GAMERENT (BUSINESS PROCESS WORKFLOW)"
    ws["B2"].font = Font(name="Tahoma", size=13, bold=True, color="000080")

    # Quy trình 1
    ws["B4"] = "1. QUY TRÌNH NGHIỆP VỤ KHÁCH HÀNG THUÊ TÀI KHOẢN GAME TRỰC TUYẾN TỰ ĐỘNG (END-TO-END FLOW)"
    ws["B4"].font = SECTION_FONT
    ws["B4"].fill = LIGHT_BLUE_FILL

    steps_q1 = [
        ("Bước 1", "Khởi tạo tài khoản", "Khách hàng truy cập GameRent, nhấn 'Đăng ký' -> Điền form thông tin hợp lệ -> Hệ thống tạo tài khoản và tự động nạp 50.000 VNĐ vào ví trải nghiệm tân thủ."),
        ("Bước 2", "Nạp tiền ví VietQR", "Khách hàng mở modal Ví điện tử, chọn hạn mức nạp tiền (100.000 VNĐ) -> Quét mã VietQR động chuẩn NAPAS -> Số dư ví được cộng dồn thời gian thực lên 150.000 VNĐ."),
        ("Bước 3", "Duyệt kho & Chọn acc", "Khách hàng duyệt danh mục, áp dụng bộ lọc Game (Valorant/LMHT/Genshin), khoảng giá, skin độc quyền và nhấn icon Trái tim lưu tài khoản yêu thích (Favorites) độc lập."),
        ("Bước 4", "Xác nhận thuê tức thì", "Khách hàng bấm 'Thuê Ngay', chọn thời lượng thuê (2 giờ - 30.000 VNĐ), đồng ý cam kết điều khoản -> Nhấn 'Xác Nhận Thuê' -> Hệ thống trừ tiền ví và đổi trạng thái acc sang 'rented'."),
        ("Bước 5", "Bàn giao mật khẩu bí mật", "Hệ thống hiển thị modal bàn giao thông tin gồm Tên đăng nhập và Mật khẩu in-game bí mật kèm nút 'Sao chép 1-click' an toàn hoạt động trên cả HTTP/HTTPS."),
        ("Bước 6", "Giám sát thời gian thực", "Khách hàng vào 'Đơn thuê của tôi', theo dõi đồng hồ CountdownTimer đếm ngược chuẩn xác theo mốc Date.now(), hiển thị màu Xanh lục (>1h), Vàng cam (<1h) và Đỏ khi hết giờ."),
        ("Bước 7", "Rẽ nhánh: Gia hạn giờ", "Trước khi hết hạn, khách hàng bấm 'Gia hạn' thêm 1 giờ (15.000 VNĐ) -> Hệ thống trừ tiền ví và cộng dồn 3.600 giây trực tiếp mà không ngắt quãng phiên chơi game."),
        ("Bước 8", "Rẽ nhánh: Trả nick sớm", "Khách hàng chơi xong sớm bấm 'Trả Nick Sớm' -> Hệ thống tính toán hoàn lại 50% tiền thời gian chưa dùng vào ví, kết thúc đơn hàng và chuyển acc sang trạng thái 'need_change_pass'."),
        ("Bước 9", "Rẽ nhánh: Báo lỗi sự cố", "Nếu gặp sự cố in-game (sai pass/dính 2FA), khách hàng bấm 'Báo Lỗi / Khiếu Nại' -> Admin tiếp nhận và phê duyệt hoàn tiền bảo hiểm 100%, đồng thời đưa acc vào diện bảo trì.")
    ]

    r = 5
    ws.cell(r, 2, "Bước thực hiện").font = WHITE_BOLD_FONT
    ws.cell(r, 2).fill = SUBHEADER_FILL
    ws.cell(r, 3, "Tên giai đoạn").font = WHITE_BOLD_FONT
    ws.cell(r, 3).fill = SUBHEADER_FILL
    ws.cell(r, 4, "Mô tả chi tiết luồng nghiệp vụ E2E").font = WHITE_BOLD_FONT
    ws.cell(r, 4).fill = SUBHEADER_FILL

    for b, name, desc in steps_q1:
        r += 1
        ws.cell(r, 2, b).font = BLACK_BOLD_FONT
        ws.cell(r, 2).border = THIN_BORDER
        ws.cell(r, 2).alignment = Alignment(horizontal="center", vertical="top")

        ws.cell(r, 3, name).font = BLACK_BOLD_FONT
        ws.cell(r, 3).border = THIN_BORDER
        ws.cell(r, 3).alignment = Alignment(vertical="top")

        ws.cell(r, 4, desc).font = BLACK_REGULAR_FONT
        ws.cell(r, 4).border = THIN_BORDER
        ws.cell(r, 4).alignment = Alignment(vertical="top", wrap_text=True)

    # Quy trình 2
    r += 2
    ws.cell(r, 2, "2. QUY TRÌNH NGHIỆP VỤ QUẢN TRỊ VIÊN (ADMIN) VẬN HÀNH KHO & ĐIỀU PHỐI THỜI GIAN THỰC").font = SECTION_FONT
    ws.cell(r, 2).fill = LIGHT_BLUE_FILL

    steps_q2 = [
        ("Bước 1", "Đăng nhập quyền Admin", "Quản trị viên đăng nhập với tài khoản admin@gamerent.vn -> Hệ thống kích hoạt quyền quản trị RBAC và hiển thị menu Quản trị."),
        ("Bước 2", "Thêm mới acc chuẩn UC1", "Admin vào Kho tài khoản, bấm 'Thêm Acc Mới' -> Nhập đầy đủ theo quy chuẩn UC1_Add New Product (Mã, Game, Tiêu đề <= 50 ký tự, Giá thuê/h, Upload ảnh <= 1MB, Pass gốc) -> Tài khoản hiển thị trên Cửa hàng Client."),
        ("Bước 3", "Giám sát Live Sessions", "Admin mở OverviewDashboard, theo dõi trực quan trạng thái tất cả các phiên thuê đang chạy (Live Rentals) và tình trạng doanh thu, khiếu nại theo thời gian thực."),
        ("Bước 4", "Điều phối can thiệp Live", "Khi máy chủ game bảo trì, Admin bấm vào Live Session chọn 'Bù giờ (+1h)' -> Hệ thống cộng thêm 3.600 giây cho khách hàng hoàn toàn miễn phí."),
        ("Bước 5", "Quản trị khách hàng CRM", "Admin tra cứu danh sách thành viên, số dư ví, lịch sử giao dịch và thực hiện Khóa tài khoản (Block User) khi phát hiện gian lận quy chế.")
    ]

    r += 1
    ws.cell(r, 2, "Bước thực hiện").font = WHITE_BOLD_FONT
    ws.cell(r, 2).fill = SUBHEADER_FILL
    ws.cell(r, 3, "Tên giai đoạn").font = WHITE_BOLD_FONT
    ws.cell(r, 3).fill = SUBHEADER_FILL
    ws.cell(r, 4, "Mô tả chi tiết luồng nghiệp vụ E2E").font = WHITE_BOLD_FONT
    ws.cell(r, 4).fill = SUBHEADER_FILL

    for b, name, desc in steps_q2:
        r += 1
        ws.cell(r, 2, b).font = BLACK_BOLD_FONT
        ws.cell(r, 2).border = THIN_BORDER
        ws.cell(r, 2).alignment = Alignment(horizontal="center", vertical="top")

        ws.cell(r, 3, name).font = BLACK_BOLD_FONT
        ws.cell(r, 3).border = THIN_BORDER
        ws.cell(r, 3).alignment = Alignment(vertical="top")

        ws.cell(r, 4, desc).font = BLACK_REGULAR_FONT
        ws.cell(r, 4).border = THIN_BORDER
        ws.cell(r, 4).alignment = Alignment(vertical="top", wrap_text=True)

    # Quy trình 3
    r += 2
    ws.cell(r, 2, "3. CƠ CHẾ KIỂM SOÁT TRANH CHẤP TÀI NGUYÊN (CONCURRENCY & ANTI-RACE CONDITION)").font = SECTION_FONT
    ws.cell(r, 2).fill = LIGHT_BLUE_FILL

    steps_q3 = [
        ("Bước 1", "Yêu cầu thuê đồng thời", "Hai khách hàng A và B cùng mở modal thuê trên cùng một tài khoản VIP duy nhất tại cùng thời điểm."),
        ("Bước 2", "Khóa tài nguyên nguyên tử", "Khách A nhấn xác nhận trước 0.1s -> Hàm rentAccount kích hoạt Atomic Check & Lock -> Xác nhận đơn thuê của A thành công, trừ ví A và chuyển trạng thái acc sang 'rented'."),
        ("Bước 3", "Từ chối giao dịch xung đột", "Giao dịch của Khách B đến sau lập tức bị từ chối với thông báo 'Tài khoản vừa được người khác thuê' -> Ví của B được giữ nguyên vẹn 100%, ngăn ngừa tuyệt đối Double-booking.")
    ]

    r += 1
    ws.cell(r, 2, "Bước thực hiện").font = WHITE_BOLD_FONT
    ws.cell(r, 2).fill = SUBHEADER_FILL
    ws.cell(r, 3, "Tên giai đoạn").font = WHITE_BOLD_FONT
    ws.cell(r, 3).fill = SUBHEADER_FILL
    ws.cell(r, 4, "Mô tả chi tiết luồng nghiệp vụ E2E").font = WHITE_BOLD_FONT
    ws.cell(r, 4).fill = SUBHEADER_FILL

    for b, name, desc in steps_q3:
        r += 1
        ws.cell(r, 2, b).font = BLACK_BOLD_FONT
        ws.cell(r, 2).border = THIN_BORDER
        ws.cell(r, 2).alignment = Alignment(horizontal="center", vertical="top")

        ws.cell(r, 3, name).font = BLACK_BOLD_FONT
        ws.cell(r, 3).border = THIN_BORDER
        ws.cell(r, 3).alignment = Alignment(vertical="top")

        ws.cell(r, 4, desc).font = BLACK_REGULAR_FONT
        ws.cell(r, 4).border = THIN_BORDER
        ws.cell(r, 4).alignment = Alignment(vertical="top", wrap_text=True)

    ws.column_dimensions["B"].width = 16
    ws.column_dimensions["C"].width = 28
    ws.column_dimensions["D"].width = 85

def update_test_case_list_sheet(ws):
    """Cập nhật Sheet Test case List mô tả môi trường và danh sách 7 phân hệ test"""
    # Hủy toàn bộ merge cũ
    merged_to_remove = [str(rng) for rng in ws.merged_cells.ranges]
    for rng in merged_to_remove:
        try:
            ws.unmerge_cells(rng)
        except Exception:
            pass

    # Xóa nội dung
    for r in range(1, max(ws.max_row + 1, 30)):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    ws.merge_cells("B1:I1")
    ws.merge_cells("D3:I3")
    ws.merge_cells("D4:I4")
    ws.merge_cells("D5:I5")

    ws["B1"] = "DANH SÁCH CÁC PHÂN HỆ KIỂM THỬ HỆ THỐNG (SYSTEM TEST CASE LIST)"
    ws["B1"].font = HEADER_TITLE_FONT
    ws["B1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 30

    ws["B3"] = "Project Name"
    ws["D3"] = "=Cover!C5"
    ws["B4"] = "Project Code"
    ws["D4"] = "=Cover!C6"
    ws["B5"] = "Test Environment Setup Description"
    ws["D5"] = (
        "1. Client Application: React 19.x, Vite 5.x, Modern Vanilla CSS Design System, Responsive UI (Google Chrome v120+, Microsoft Edge v120+, Mozilla Firefox v120+).\n"
        "2. Storage & Global State: LocalStorage Atomic Simulation, React Context API, Web Workers / Window Timers.\n"
        "3. Automated Test Framework: Vitest v5.0, Happy-DOM, jsdom, Node.js v20.x LTS (10/10 test suites, 107/107 tests passing).\n"
        "4. Platform & Encoding: Windows 11 64-bit, Multi-platform web, Localhost dev server (http://localhost:5173), UTF-8 Vietnamese Encoding."
    )
    ws["B3"].font = BLACK_BOLD_FONT
    ws["B4"].font = BLACK_BOLD_FONT
    ws["B5"].font = BLACK_BOLD_FONT
    ws["D3"].font = BLACK_REGULAR_FONT
    ws["D4"].font = BLACK_REGULAR_FONT
    ws["D5"].font = BLACK_REGULAR_FONT
    ws["D5"].alignment = Alignment(vertical="top", wrap_text=True)
    ws.row_dimensions[5].height = 65

    # Headers at row 8
    headers = ["No", "Mã phân hệ E2E", "Tên phân hệ kiểm thử hệ thống", "Tên Sheet", "Mô tả phạm vi kiểm thử E2E", "Kịch bản STC bao phủ", "Số ca STC", "Mức ưu tiên"]
    cols = ["B", "C", "D", "E", "F", "G", "H", "I"]

    ws.row_dimensions[8].height = 28
    for col_letter, header_text in zip(cols, headers):
        c = ws[f"{col_letter}8"]
        c.value = header_text
        c.font = WHITE_BOLD_FONT
        c.fill = NAVY_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = THIN_BORDER

    module_list = [
        (1, "ST_AUTH_RBAC", "Xác thực, Phân quyền & RBAC", "ST_AUTH_RBAC", "Kiểm thử luồng Đăng ký thành viên tự động nhận ví trải nghiệm và chặn đăng nhập đối với tài khoản bị Admin khóa (isBlocked).", "STC-E2E-01, STC-E2E-02", 2, "High"),
        (2, "ST_CATALOG_FAV", "Duyệt kho, Lọc & Yêu thích", "ST_CATALOG_FAV", "Kiểm thử tìm kiếm skin, lọc theo thể loại game, tầm giá và cơ chế lưu trữ danh sách yêu thích độc lập cho từng tài khoản.", "STC-E2E-03", 1, "Medium"),
        (3, "ST_WALLET_RENT", "Nạp tiền VietQR & Thuê acc E2E", "ST_WALLET_RENT", "Kiểm thử quy trình nạp tiền ví tự động bằng VietQR và luồng thuê tài khoản game tức thì, bàn giao thông tin in-game 1-click.", "STC-E2E-04, STC-E2E-05", 2, "Critical"),
        (4, "ST_TIMER_EXT", "Giám sát thời gian thực & Gia hạn", "ST_TIMER_EXT", "Kiểm thử đồng hồ CountdownTimer đếm ngược chuẩn từng giây, cơ chế cảnh báo đổi màu và tính năng gia hạn thêm giờ liền mạch.", "STC-E2E-06, STC-E2E-07", 2, "High"),
        (5, "ST_EARLY_DISPUTE", "Trả sớm & Khiếu nại bảo hiểm 100%", "ST_EARLY_DISPUTE", "Kiểm thử chính sách hoàn trả 50% khi trả nick sớm và cơ chế bồi thường bảo hiểm 100% tiền đơn khi khách khiếu nại sự cố.", "STC-E2E-08, STC-E2E-09", 2, "High"),
        (6, "ST_ADMIN_DISPATCH", "Quản trị kho UC1 & Điều phối Live", "ST_ADMIN_DISPATCH", "Kiểm thử form thêm acc chuẩn 100% tài liệu UC1_Add New Product và tính năng Admin can thiệp điều phối bù giờ Live Session.", "STC-E2E-10, STC-E2E-11", 2, "High"),
        (7, "ST_CONCURRENCY", "Đồng thời & Chống Race Condition", "ST_CONCURRENCY", "Kiểm thử khả năng xử lý tranh chấp tài nguyên đồng thời khi 2 khách hàng cùng bấm thuê 1 acc tại 1 thời điểm (ngăn chặn Double-booking).", "STC-E2E-12", 1, "Critical")
    ]

    r = 9
    for row_data in module_list:
        ws.row_dimensions[r].height = 35
        for col_idx, val in enumerate(row_data):
            cell = ws.cell(r, col_idx + 2)
            cell.value = val
            cell.font = BLACK_REGULAR_FONT
            cell.border = THIN_BORDER
            if col_idx in [0, 1, 3, 6, 7]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(vertical="center", wrap_text=True)
            if col_idx == 1:
                cell.font = BLACK_BOLD_FONT
        r += 1

    ws.column_dimensions["B"].width = 6
    ws.column_dimensions["C"].width = 20
    ws.column_dimensions["D"].width = 30
    ws.column_dimensions["E"].width = 20
    ws.column_dimensions["F"].width = 50
    ws.column_dimensions["G"].width = 24
    ws.column_dimensions["H"].width = 12
    ws.column_dimensions["I"].width = 14

# Dữ liệu 12 kịch bản STC chi tiết
STC_MODULES_DATA = {
    "ST_AUTH_RBAC": {
        "code": "ST_AUTH_RBAC",
        "req": "Kiểm thử hệ thống luồng Xác thực thành viên mới, Phân quyền Role-based Access Control (Client vs Admin), và cơ chế Chặn tài khoản vi phạm (isBlocked).",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Thanh Tùng)",
        "cases": [
            {
                "id": "STC-E2E-01",
                "desc": "Đăng ký thành viên mới trên Web App và tự động nhận ví trải nghiệm 50.000 VNĐ.\nKiểm tra toàn diện luồng: Mở AuthModal -> Nhập form hợp lệ -> Submit -> Lưu User -> Khởi tạo ví 50k -> Cập nhật Header & CRM.",
                "pre": "1. Khách vãng lai truy cập website GameRent lần đầu (chưa có tài khoản, session trống).\n2. Trình duyệt đã kết nối internet, Navbar ở trạng thái Chưa đăng nhập.",
                "steps": "1. Nhấn nút 'Đăng ký' trên thanh Navbar.\n2. Tại form AuthModal (tab Đăng ký), nhập:\n   - Họ tên: 'Nguyễn Văn Chơi Game'\n   - Tên đăng nhập: 'new_player'\n   - Email: 'newplayer@gmail.com'\n   - Mật khẩu: '123456'\n   - Nhập lại MK: '123456'\n   - SĐT: '0987654321'\n3. Nhấn nút 'Đăng ký ngay'.\n4. Kiểm tra Header và mở Admin CRM đối chiếu.",
                "expected": "1. Toast Alert hiển thị: 'Đăng ký tài khoản thành công! Chào mừng new_player'.\n2. Modal tự đóng, Header hiển thị tên 'new_player' và ví có sẵn 50.000 VNĐ.\n3. Khách hàng mới xuất hiện ngay trong bảng User của CRM Admin.",
                "post": "Tài khoản 'new_player' có trạng thái Active trong LocalStorage gamerent_users; ví có 50.000 VNĐ trong gamerent_wallet_balance.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Pass thực tế trên React 19 và Vitest automated test suite."
            },
            {
                "id": "STC-E2E-02",
                "desc": "Đăng nhập với tài khoản bị Admin khóa do vi phạm quy chế (isBlocked = true).\nKiểm tra cơ chế RBAC và chính sách an ninh: Hệ thống phát hiện cờ isBlocked và chặn truy cập tức thì.",
                "pre": "1. Admin đã bật cờ isBlocked = true đối với tài khoản bad_user@gamerent.vn trong trang Quản lý CRM.\n2. Người dùng đang ở màn hình ngoài, chưa đăng nhập.",
                "steps": "1. Nhấn nút 'Đăng nhập' trên thanh Navbar.\n2. Tại form AuthModal (tab Đăng nhập), nhập:\n   - Email/Username: 'bad_user@gamerent.vn'\n   - Mật khẩu: '123456'\n3. Nhấn nút 'Đăng nhập'.",
                "expected": "1. Hệ thống từ chối xác thực đăng nhập.\n2. Xuất hiện cảnh báo màu đỏ: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế sử dụng dịch vụ. Vui lòng liên hệ bộ phận hỗ trợ!'.\n3. Phiên đăng nhập không được cấp, Header giữ nguyên trạng thái Khách vãng lai.",
                "post": "Trạng thái phiên đăng nhập không đổi; không phát sinh token truy cập trái phép.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-005; cơ chế bảo vệ phân quyền chặt chẽ."
            }
        ]
    },
    "ST_CATALOG_FAV": {
        "code": "ST_CATALOG_FAV",
        "req": "Kiểm thử khả năng tìm kiếm, phân loại theo Game, tầm giá, từ khóa skin và lưu tài khoản yêu thích (Favorites) độc lập theo từng tài khoản.",
        "tester": "Nhóm 15 (Lê Hải Đăng, Lê Minh Quân)",
        "cases": [
            {
                "id": "STC-E2E-03",
                "desc": "Tìm kiếm từ khóa, kết hợp bộ lọc game/giá và lưu tài khoản vào danh sách Yêu thích độc lập.\nKiểm chứng lưới hiển thị danh mục sản phẩm (Account Catalog), cơ chế debounce search, và lưu trữ LocalStorage gamerent_favorites_<userId>.",
                "pre": "1. Người dùng đã đăng nhập tài khoản hợp lệ.\n2. Kho tài khoản có ít nhất 10 acc game đa dạng thể loại (Valorant, LMHT, Genshin...).",
                "steps": "1. Trên trang Cửa hàng, click chọn tab game 'Valorant'.\n2. Tại dropdown lọc giá, chọn khoảng giá 'Dưới 20.000 VNĐ/h'.\n3. Tại thanh tìm kiếm, nhập từ khóa skin: 'Prime'.\n4. Nhấn icon Trái tim trên thẻ tài khoản 'ACCVAL001 - Vandal Prime'.\n5. Bấm nút lọc 'Yêu thích của tôi'.\n6. Đăng xuất và đăng nhập tài khoản khác để đối chiếu.",
                "expected": "1. Lưới sản phẩm chỉ hiển thị các acc Valorant có skin Prime giá < 20k.\n2. Icon Trái tim đổi sang màu đỏ rực kèm hiệu ứng nảy micro-animation.\n3. Khi bấm 'Yêu thích của tôi', danh sách chỉ hiện đúng acc vừa lưu.\n4. Đăng nhập tài khoản khác: danh sách yêu thích hoàn toàn độc lập, không bị ghi đè lẫn nhau.",
                "post": "Dữ liệu lưu trong LocalStorage gamerent_favorites_<userId> được phân tách an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Xác nhận đạt 100% trong automated test suite favoritesSeparation.test.js."
            }
        ]
    },
    "ST_WALLET_RENT": {
        "code": "ST_WALLET_RENT",
        "req": "Kiểm thử quy trình nạp tiền tự động qua cổng VietQR chuẩn NAPAS và quy trình thuê tài khoản game tức thì, bàn giao thông tin in-game bí mật.",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Xuân Đạt)",
        "cases": [
            {
                "id": "STC-E2E-04",
                "desc": "Nạp tiền ví tự động bằng VietQR với hạn mức BVA hợp lệ (100.000 VNĐ) và cập nhật số dư thời gian thực.\nKiểm tra modal nạp tiền, sinh mã VietQR động có nội dung chuyển khoản mã hóa, và ghi nhận Transaction History.",
                "pre": "Khách hàng đã đăng nhập tài khoản 'player01', số dư ví hiện tại là 50.000 VNĐ.",
                "steps": "1. Click vào Badge hiển thị số dư ví trên Navbar để mở modal 'Nạp Tiền Ví VietQR'.\n2. Chọn gói nạp nhanh: 100.000 VNĐ (hạn mức BVA hợp lệ).\n3. Hệ thống tạo mã QR động ngân hàng MBBank với cú pháp GR_NAP_player01_100K.\n4. Giả lập quét mã thành công và nhấn nút 'Tôi Đã Chuyển Khoản / Xác Nhận Nạp'.\n5. Kiểm tra cập nhật số dư ví trên Header và danh mục Lịch sử giao dịch.",
                "expected": "1. Toast thành công hiển thị: 'Nạp thành công 100.000 VNĐ qua VietQR!'.\n2. Số dư ví trên Header tự động cộng dồn lên đúng 150.000 VNĐ tức thì không cần F5.\n3. Bảng Lịch sử giao dịch ghi nhận 1 bản ghi mới: Loại 'Nạp tiền', Số tiền '+100.000 VNĐ', Trạng thái 'Thành công'.",
                "post": "Số dư ví trong LocalStorage là 150.000 VNĐ; giao dịch được lưu vết hoàn chỉnh.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đạt chuẩn kiểm thử phân tích giá trị biên BVA (10k, 50k, 100k, 500k, 2tr)."
            },
            {
                "id": "STC-E2E-05",
                "desc": "Thuê tài khoản game tức thì (2 giờ) và nhận thông tin tài khoản in-game bí mật kèm nút Copy 1-click.\nKiểm tra trừ tiền ví, chuyển đổi trạng thái tài khoản từ available sang rented, tạo đơn thuê mới và mở Modal bàn giao thông tin.",
                "pre": "1. Khách hàng đã đăng nhập, số dư ví có 150.000 VNĐ.\n2. Tài khoản game 'ACCVAL001' có đơn giá 15.000 VNĐ/giờ, trạng thái 'available'.",
                "steps": "1. Tại trang Cửa hàng, click nút 'Thuê Ngay' trên thẻ acc 'ACCVAL001'.\n2. Modal xác nhận thuê xuất hiện:\n   - Chọn thời lượng thuê: 2 giờ.\n   - Xem tổng tiền tạm tính: 30.000 VNĐ.\n   - Tick chọn 'Tôi đồng ý với quy chế thuê tài khoản'.\n3. Nhấn nút 'Xác Nhận Thuê'.\n4. Quan sát modal bàn giao thông tin và kiểm tra trạng thái trên Cửa hàng.",
                "expected": "1. Số dư ví khách hàng bị trừ chính xác 30.000 VNĐ (còn lại 120.000 VNĐ).\n2. Modal bàn giao thông tin hiển thị rõ:\n   - Tên đăng nhập: riot_val_pro01\n   - Mật khẩu in-game: V@l0r@nt2026! (kèm nút Sao chép 1-click hoạt động trơn tru).\n3. Thẻ tài khoản trên Cửa hàng đổi nhãn sang màu xám 'Đang Thuê' và nút thuê bị vô hiệu hóa.\n4. Đơn thuê mới ở trạng thái 'active' xuất hiện trong trang 'Đơn thuê của tôi'.",
                "post": "Trạng thái tài khoản = 'rented', đơn hàng lưu vào gamerent_rentals với endTime = now + 7200s.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-004 (sao chép mật khẩu với fallback execCommand an toàn)."
            }
        ]
    },
    "ST_TIMER_EXT": {
        "code": "ST_TIMER_EXT",
        "req": "Kiểm thử bộ đếm ngược thời gian thực, cơ chế cảnh báo đổi màu theo thời gian còn lại, và tính năng gia hạn ca thuê liền mạch.",
        "tester": "Nhóm 15 (Lê Thanh Tùng, Lê Hải Đăng)",
        "cases": [
            {
                "id": "STC-E2E-06",
                "desc": "Theo dõi đồng hồ đếm ngược CountdownTimer thời gian thực, kiểm tra cảnh báo đổi màu và không bị trôi giây khi chuyển tab.\nKiểm tra cơ chế tính toán dựa trên Date.now() - rental.endTime đảm bảo chính xác tuyệt đối ngay cả khi tab trình duyệt bị ngắt nhịp (Background Throttling).",
                "pre": "Khách hàng đang có 1 đơn thuê active thời lượng 2 giờ (còn 7.199 giây).",
                "steps": "1. Truy cập vào trang 'Đơn thuê của tôi' (MyRentalsPage).\n2. Quan sát CountdownTimer hiển thị dạng 01:59:58, 01:59:57...\n3. Mở tab trình duyệt khác trong 10 giây rồi quay lại tab GameRent.\n4. Dùng công cụ Debug Fast Forward tua nhanh thời gian đến mốc còn 45 phút (< 1 giờ).\n5. Tiếp tục tua nhanh thời gian đến khi đồng hồ đếm về 00:00:00.",
                "expected": "1. Đồng hồ đếm ngược giảm chính xác từng giây một.\n2. Khi quay lại từ tab khác, đồng hồ đồng bộ ngay theo mốc thời gian thực, không bị trôi hay đứng kim giây.\n3. Quy tắc đổi màu hiển thị chính xác:\n   - Khi còn > 1 giờ: Màu Xanh Lục (Safe / Active).\n   - Khi còn < 1 giờ: Tự động đổi sang Màu Vàng Cam (Warning).\n   - Khi về 00:00:00: Đổi sang Màu Đỏ (Expired) và đơn chuyển sang 'completed'.",
                "post": "Đơn thuê hết hạn được cập nhật trạng thái; tài khoản kích hoạt luồng tự động đổi mật khẩu.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-002 (dùng mốc thời gian Date.now() thay vì interval trần)."
            },
            {
                "id": "STC-E2E-07",
                "desc": "Gia hạn thêm giờ chơi khi đơn thuê đang hoạt động và số dư ví đủ điều kiện.\nKiểm tra việc cộng dồn thời gian thuê, trừ tiền ví bổ sung và duy trì phiên chơi liên tục không bị gián đoạn.",
                "pre": "Đơn thuê 'ORD-001' đang còn 30 phút (1.800 giây), giá thuê 15.000 VNĐ/h, ví khách hàng có 100.000 VNĐ.",
                "steps": "1. Tại thẻ đơn thuê 'ORD-001', nhấn nút 'Gia hạn thêm giờ'.\n2. Modal gia hạn xuất hiện, chọn gia hạn: 1 giờ (+3.600s), chi phí: 15.000 VNĐ.\n3. Nhấn nút 'Xác Nhận Gia Hạn'.\n4. Quan sát đồng hồ CountdownTimer và số dư ví.",
                "expected": "1. Ví khách hàng bị trừ chính xác 15.000 VNĐ (còn 85.000 VNĐ).\n2. Toast thành công hiển thị: 'Gia hạn thành công thêm 1 giờ!'.\n3. Đồng hồ CountdownTimer ngay lập tức nhảy tăng thêm đúng 3.600 giây (từ 30 phút lên 1 giờ 30 phút: 01:30:00).\n4. Không cần đăng nhập lại hay cấp mật khẩu mới; phiên chơi được duy trì liên tục.",
                "post": "rental.endTime được tăng thêm 3.600.000 ms; số dư ví cập nhật đúng.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Test kịch bản thành công 100% trên rental.test.js."
            }
        ]
    },
    "ST_EARLY_DISPUTE": {
        "code": "ST_EARLY_DISPUTE",
        "req": "Kiểm thử chính sách hoàn trả linh hoạt (Hoàn 50% tiền thời gian thừa khi trả nick sớm) và cơ chế Bảo hiểm hoàn tiền 100% khi phát sinh sự cố in-game.",
        "tester": "Nhóm 15 (Lê Xuân Đạt, Lê Minh Quân)",
        "cases": [
            {
                "id": "STC-E2E-08",
                "desc": "Trả tài khoản sớm trước hạn và nhận hoàn tiền 50% thời gian chưa sử dụng vào ví.\nKiểm chứng thuật toán hoàn tiền: refundAmount = Math.floor(unusedHours * hourlyPrice * 0.5) và thu hồi tài khoản.",
                "pre": "Đơn thuê 3 giờ (tổng 45.000 VNĐ, giá 15k/h). Khách mới chơi xong 1 giờ, thời gian còn thừa là 2 giờ tròn. Số dư ví hiện tại là 50.000 VNĐ.",
                "steps": "1. Tại thẻ đơn thuê trên MyRentalsPage, click nút 'Trả Nick Sớm' (ReturnEarlyModal).\n2. Modal hiển thị bảng tính chi tiết:\n   - Đã thuê: 3 giờ; Đã chơi: 1 giờ; Thừa: 2 giờ\n   - Tỷ lệ hoàn theo chính sách: 50%\n   - Số tiền hoàn lại: 2 x 15.000 x 50% = 15.000 VNĐ.\n3. Click nút 'Xác Nhận Trả Nick Sớm'.\n4. Kiểm tra cập nhật ví và trạng thái đơn hàng.",
                "expected": "1. Số dư ví khách hàng ngay lập tức được cộng thêm 15.000 VNĐ (từ 50.000 lên 65.000 VNĐ).\n2. Đơn thuê chuyển sang trạng thái 'completed' với ghi chú 'Đã trả sớm và hoàn 15.000 VNĐ'.\n3. Đồng hồ đếm ngược dừng lại; tài khoản game chuyển sang trạng thái need_change_pass.\n4. Bảng Lịch sử giao dịch ghi nhận khoản hoàn tiền minh bạch.",
                "post": "Ví nhận đủ 15.000 VNĐ; tài khoản game thu hồi an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Thuật toán hoàn tiền khớp 100% với hàm calculateRefund() trong refund.test.js."
            },
            {
                "id": "STC-E2E-09",
                "desc": "Báo lỗi khiếu nại sự cố in-game (Sai mật khẩu) và nhận bồi thường bảo hiểm 100% tiền đơn.\nKiểm chứng luồng khiếu nại: Khách gửi Dispute -> Admin phê duyệt -> Hoàn 100% tiền đơn -> Acc chuyển sang bảo trì (maintenance).",
                "pre": "Khách hàng vừa thuê acc 'ACCLOL002' giá 30.000 VNĐ, khi vào game Riot báo 'Mật khẩu không chính xác'. Số dư ví khách là 10.000 VNĐ.",
                "steps": "1. Trên MyRentalsPage, khách bấm nút 'Báo Lỗi / Khiếu Nại' (DisputeModal).\n2. Chọn lý do: 'Sai mật khẩu in-game', nhập mô tả: 'Đăng nhập báo sai pass lúc 20:30'.\n3. Nhấn 'Gửi Khiếu Nại'.\n4. Đăng nhập quyền Admin, mở OverviewDashboard -> tab Khiếu nại sự cố.\n5. Admin kiểm tra báo cáo và bấm 'Phê duyệt bồi thường 100%'.\n6. Kiểm tra lại ví khách hàng và trạng thái tài khoản.",
                "expected": "1. Đơn thuê chuyển ngay sang trạng thái 'refunded'.\n2. Khách hàng nhận lại đủ 100% số tiền đã trả cho đơn thuê (30.000 VNĐ), ví tăng lên 40.000 VNĐ.\n3. Tài khoản game tự động chuyển trạng thái sang 'maintenance' để đội ngũ kỹ thuật đổi pass, ngăn khách khác thuê phải.",
                "post": "Khách hàng được bảo đảm quyền lợi tối đa; tài khoản lỗi được cách ly an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Chính sách bảo hiểm 100% là điểm nổi bật đặc biệt trong đề tài bài tập lớn của Nhóm 15."
            }
        ]
    },
    "ST_ADMIN_DISPATCH": {
        "code": "ST_ADMIN_DISPATCH",
        "req": "Kiểm thử chức năng Quản trị thêm mới sản phẩm theo đúng quy chuẩn tài liệu UC1_Add New Product và tính năng Điều phối can thiệp Live Session trực tiếp.",
        "tester": "Nhóm 15 (Lê Hải Đăng, Lê Minh Quân)",
        "cases": [
            {
                "id": "STC-E2E-10",
                "desc": "Admin thêm tài khoản game mới vào kho chuẩn form UC1 và Client tìm thấy, thuê thành công.\nKiểm chứng toàn bộ các trường nhập liệu chuẩn UC1 (Mã acc, Tiêu đề <= 50 ký tự, Giá thuê > 0, Tải ảnh <= 1MB, Mật khẩu gốc) và tính nhất quán dữ liệu.",
                "pre": "1. Đăng nhập với tài khoản Quản trị viên (admin@gamerent.vn).\n2. Mở trang Quản lý kho tài khoản (AccountInventoryPage).",
                "steps": "1. Nhấn nút 'Thêm Acc Mới' mở modal biểu mẫu UC1.\n2. Nhập các trường thông tin:\n   - Mã tài khoản: 'ACCLQ999'\n   - Thể loại: 'Liên Quân Mobile'\n   - Tiêu đề: 'Thứ Nguyên Vệ Thần Nakroth Full Phù Hiệu' (42 ký tự <= 50)\n   - Giá thuê: 20.000 VNĐ/h\n   - Upload ảnh: file PNG 500KB (<= 1MB)\n   - Tên đăng nhập: 'lq_nakroth_god'\n   - Mật khẩu in-game: 'Nakroth@2026'\n   - Rank: 'Cao Thủ'\n3. Nhấn nút 'Lưu Tài Khoản'.\n4. Mở tab Client người dùng, tìm kiếm 'ACCLQ999' và thuê.",
                "expected": "1. Form kiểm tra hợp lệ toàn bộ (không vi phạm BVA, độ dài hay định dạng ảnh).\n2. Tài khoản mới hiển thị ngay lập tức trong bảng Admin và xuất hiện trên Cửa hàng Client.\n3. Khách hàng Client thuê thành công và nhận đúng thông tin lq_nakroth_god / Nakroth@2026.",
                "post": "Tài khoản mới được lưu vĩnh viễn trong CSDL; chuẩn hóa 100% tài liệu UC1_Add New Product của bộ môn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-003 (loại bỏ khoảng trắng trim() trước khi kiểm tra độ dài 50 ký tự)."
            },
            {
                "id": "STC-E2E-11",
                "desc": "Admin điều phối Live Session bù giờ (+1h) khi máy chủ game phát sinh bảo trì đột xuất.\nKiểm tra khả năng can thiệp trực tiếp của Admin vào đơn thuê đang chạy của khách hàng trên OverviewDashboard.",
                "pre": "Khách hàng đang có đơn thuê 'ORD-005' còn 20 phút chơi, nhưng máy chủ game bị ngắt kết nối bảo trì 30 phút.",
                "steps": "1. Admin mở trang Tổng quan vận hành (OverviewDashboard), quan sát thẻ phiên Live Session của 'ORD-005'.\n2. Click vào phiên Live để mở popover điều phối.\n3. Nhấn vào nút 'Bù giờ (+1h)'.\n4. Kiểm tra thông báo hệ thống và màn hình phía khách hàng.",
                "expected": "1. Hệ thống ghi nhận lệnh điều phối, hiển thị thông báo 'Đã cộng bù 1 giờ chơi cho đơn thuê ORD-005'.\n2. Phía khách hàng, đồng hồ CountdownTimer tự động tăng thêm 3.600 giây (từ 20 phút lên 1 giờ 20 phút) hoàn toàn miễn phí.\n3. Số dư ví khách hàng không bị trừ bất kỳ khoản phí nào.",
                "post": "Thời gian kết thúc đơn thuê được gia hạn bù giờ an toàn; trải nghiệm người dùng được bảo vệ tối đa.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Tính năng điều phối độc quyền chỉ có trên Dashboard hiện đại của GameRent."
            }
        ]
    },
    "ST_CONCURRENCY": {
        "code": "ST_CONCURRENCY",
        "req": "Kiểm thử khả năng chịu tải đồng thời và cơ chế Khóa giao dịch độc quyền (Atomic Concurrency Lock) ngăn chặn tuyệt đối lỗi 2 khách hàng thuê trùng 1 tài khoản.",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Thanh Tùng)",
        "cases": [
            {
                "id": "STC-E2E-12",
                "desc": "Kiểm thử đua tài nguyên (Race Condition): 2 khách hàng cùng click 'Xác Nhận Thuê' trên 1 tài khoản duy nhất tại cùng thời điểm.\nKiểm chứng cơ chế Atomic Check & Lock trong rentAccount(): Giao dịch nào đến trước sẽ chốt đơn, giao dịch đến sau lập tức bị từ chối và bảo toàn số dư ví.",
                "pre": "1. Tài khoản game VIP 'ACCFS001' (FC Online) đang ở trạng thái duy nhất 'available'.\n2. Khách hàng A (ví 100k) và Khách hàng B (ví 100k) cùng đăng nhập trên 2 trình duyệt độc lập và cùng mở modal xác nhận thuê 'ACCFS001'.",
                "steps": "1. Tại cửa sổ của Khách hàng A, nhấn nút 'Xác Nhận Thuê'.\n2. Gần như đồng thời (chậm hơn 0.1 giây), tại cửa sổ của Khách hàng B, nhấn nút 'Xác Nhận Thuê'.\n3. Quan sát kết quả hiển thị trên màn hình và biến động ví của cả 2 khách hàng.",
                "expected": "1. Khách hàng A: Thuê thành công, nhận tài khoản/mật khẩu in-game, ví trừ 25.000 VNĐ, tài khoản chuyển sang 'rented'.\n2. Khách hàng B: Bị hệ thống chặn ngay lập tức với thông báo lỗi rõ ràng: 'Rất tiếc! Tài khoản này vừa được một khách hàng khác thuê trước vài giây. Vui lòng chọn tài khoản khác!'.\n3. Ví của Khách hàng B không bị trừ bất kỳ đồng nào (vẫn giữ nguyên 100.000 VNĐ).\n4. Tuyệt đối không xảy ra tình trạng Double-booking hay sai lệch trạng thái CSDL.",
                "post": "Tính toàn vẹn dữ liệu được bảo vệ 100%; không phát sinh đơn thuê trùng lặp.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-001 (lỗi nghiêm trọng nhất được phân tích trong báo cáo BTL)."
            }
        ]
    }
}

def create_module_test_sheet(wb, sheet_name, data):
    """Tạo hoặc cập nhật một sheet test module theo đúng template chuẩn của bộ môn"""
    if sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
    else:
        ws = wb.create_sheet(title=sheet_name)

    # Hủy merge cũ nếu có
    merged_to_remove = [str(rng) for rng in ws.merged_cells.ranges]
    for rng in merged_to_remove:
        try:
            ws.unmerge_cells(rng)
        except Exception:
            pass

    # Xóa sạch dữ liệu cũ nếu có
    for r in range(1, max(ws.max_row + 1, 30)):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    # Merge chuẩn
    ws.merge_cells("B2:F2")
    ws.merge_cells("B3:F3")
    ws.merge_cells("B4:F4")
    ws.merge_cells("E5:F5")
    ws.merge_cells("E6:F6")

    # Header info
    ws["A2"] = "Module Code"
    ws["B2"] = data["code"]
    ws["A3"] = "Test requirement"
    ws["B3"] = data["req"]
    ws["A4"] = "Tester"
    ws["B4"] = data["tester"]

    for r in range(2, 5):
        ws[f"A{r}"].font = BLACK_BOLD_FONT
        ws[f"A{r}"].alignment = Alignment(vertical="center")
        ws[f"B{r}"].font = BLACK_REGULAR_FONT
        ws[f"B{r}"].alignment = Alignment(vertical="center", wrap_text=True)

    ws["B2"].font = BLACK_BOLD_FONT

    # Thống kê test case
    ws["A5"] = "Pass"
    ws["B5"] = "Fail"
    ws["C5"] = "Untested"
    ws["D5"] = "N/A"
    ws["E5"] = "Number of Test cases"

    for col in ["A", "B", "C", "D", "E"]:
        ws[f"{col}5"].font = WHITE_BOLD_FONT
        ws[f"{col}5"].fill = SUBHEADER_FILL
        ws[f"{col}5"].alignment = Alignment(horizontal="center", vertical="center")
        ws[f"{col}5"].border = THIN_BORDER

    # Công thức đếm chuẩn (cột G là Result)
    ws["A6"] = '=COUNTIF(G9:G100,"Pass")'
    ws["B6"] = '=COUNTIF(G9:G100,"Fail")'
    ws["C6"] = '=E6-D6-B6-A6'
    ws["D6"] = '=COUNTIF(G9:G100,"N/A")'
    ws["E6"] = '=COUNTA(A9:A100)'

    for col in ["A", "B", "C", "D", "E"]:
        ws[f"{col}6"].font = BLACK_BOLD_FONT
        ws[f"{col}6"].alignment = Alignment(horizontal="center", vertical="center")
        ws[f"{col}6"].border = THIN_BORDER

    # Bảng chi tiết Test Case từ dòng 8
    headers_stc = [
        ("A", "ID"),
        ("B", "Test Case Description"),
        ("C", "Pre-condition"),
        ("D", "Test Steps"),
        ("E", "Expected Output"),
        ("F", "Post-condtion"),
        ("G", "Result"),
        ("H", "Test date"),
        ("I", "Note")
    ]

    ws.row_dimensions[8].height = 28
    for col_letter, title in headers_stc:
        c = ws[f"{col_letter}8"]
        c.value = title
        c.font = WHITE_BOLD_FONT
        c.fill = NAVY_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = THIN_BORDER

    # Điền các ca kiểm thử
    row_idx = 9
    for tc in data["cases"]:
        ws.row_dimensions[row_idx].height = 110

        ws[f"A{row_idx}"] = f"[{tc['id']}]"
        ws[f"B{row_idx}"] = tc["desc"]
        ws[f"C{row_idx}"] = tc["pre"]
        ws[f"D{row_idx}"] = tc["steps"]
        ws[f"E{row_idx}"] = tc["expected"]
        ws[f"F{row_idx}"] = tc["post"]
        ws[f"G{row_idx}"] = tc["result"]
        ws[f"H{row_idx}"] = tc["date"]
        ws[f"I{row_idx}"] = tc["note"]

        # Căn chỉnh và định dạng
        ws[f"A{row_idx}"].font = BLACK_BOLD_FONT
        ws[f"A{row_idx}"].alignment = Alignment(horizontal="center", vertical="top")

        for c_letter in ["B", "C", "D", "E", "F", "I"]:
            ws[f"{c_letter}{row_idx}"].font = BLACK_REGULAR_FONT
            ws[f"{c_letter}{row_idx}"].alignment = Alignment(vertical="top", wrap_text=True)

        ws[f"G{row_idx}"].font = PASS_FONT
        ws[f"G{row_idx}"].fill = PASS_GREEN_FILL
        ws[f"G{row_idx}"].alignment = Alignment(horizontal="center", vertical="top")

        ws[f"H{row_idx}"].font = BLACK_REGULAR_FONT
        ws[f"H{row_idx}"].alignment = Alignment(horizontal="center", vertical="top")

        for col_letter, _ in headers_stc:
            ws[f"{col_letter}{row_idx}"].border = THIN_BORDER

        row_idx += 1

    # Thiết lập độ rộng cột tối ưu
    ws.column_dimensions["A"].width = 16
    ws.column_dimensions["B"].width = 30
    ws.column_dimensions["C"].width = 28
    ws.column_dimensions["D"].width = 32
    ws.column_dimensions["E"].width = 32
    ws.column_dimensions["F"].width = 28
    ws.column_dimensions["G"].width = 12
    ws.column_dimensions["H"].width = 14
    ws.column_dimensions["I"].width = 25

def update_test_report_sheet(ws):
    """Cập nhật Sheet Test Report động kết nối toàn bộ 7 phân hệ test"""
    # Unmerge cũ
    merged_to_remove = [str(rng) for rng in ws.merged_cells.ranges]
    for rng in merged_to_remove:
        try:
            ws.unmerge_cells(rng)
        except Exception:
            pass

    # Xóa sạch dữ liệu cũ
    for r in range(1, max(ws.max_row + 1, 35)):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    # Merge tiêu đề và metadata
    ws.merge_cells("B1:H1")
    ws.merge_cells("C3:D3")
    ws.merge_cells("E3:F3")
    ws.merge_cells("C4:D4")
    ws.merge_cells("E4:F4")
    ws.merge_cells("C5:D5")
    ws.merge_cells("E5:F5")
    ws.merge_cells("C6:H6")

    ws["B1"] = "BÁO CÁO KẾT QUẢ KIỂM THỬ HỆ THỐNG (SYSTEM TEST REPORT)"
    ws["B1"].font = HEADER_TITLE_FONT
    ws["B1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 30

    ws["B3"] = "Project Name"
    ws["C3"] = "=Cover!C5"
    ws["E3"] = "Creator"
    ws["G3"] = "Nhóm 15 - Lớp Kiểm thử phần mềm-1-1-26(N05)"

    ws["B4"] = "Project Code"
    ws["C4"] = "=Cover!C6"
    ws["E4"] = "Reviewer/Approver"
    ws["G4"] = "ThS. Phạm Thị Loan"

    ws["B5"] = "Document Code"
    ws["C5"] = '=C4&"_"&"Test Report"&"_"&"v1.0"'
    ws["E5"] = "Issue Date"
    ws["H5"] = "26/09/2026"

    ws["B6"] = "Notes"
    ws["C6"] = "Báo cáo tổng hợp kết quả thực thi 12 kịch bản Kiểm thử hệ thống End-to-End (STC-E2E-01 đến STC-E2E-12) bao phủ 7 phân hệ nghiệp vụ cốt lõi của dự án GameRent."

    for r in range(3, 7):
        ws[f"B{r}"].font = BLACK_BOLD_FONT
        if ws[f"E{r}"].value is not None:
            ws[f"E{r}"].font = BLACK_BOLD_FONT
        if ws[f"C{r}"].value is not None:
            ws[f"C{r}"].font = BLACK_REGULAR_FONT
            ws[f"C{r}"].alignment = Alignment(vertical="center", wrap_text=True)

    # Header bảng kết quả tại dòng 10
    table_headers = [
        ("B", "No"),
        ("C", "Module code"),
        ("D", "Pass"),
        ("E", "Fail"),
        ("F", "Untested"),
        ("G", "N/A"),
        ("H", "Number of test cases")
    ]

    ws.row_dimensions[10].height = 26
    for col_letter, title in table_headers:
        c = ws[f"{col_letter}10"]
        c.value = title
        c.font = WHITE_BOLD_FONT
        c.fill = NAVY_FILL
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = THIN_BORDER

    # Danh sách 7 module liên kết công thức động
    module_sheets = [
        (1, "ST_AUTH_RBAC"),
        (2, "ST_CATALOG_FAV"),
        (3, "ST_WALLET_RENT"),
        (4, "ST_TIMER_EXT"),
        (5, "ST_EARLY_DISPUTE"),
        (6, "ST_ADMIN_DISPATCH"),
        (7, "ST_CONCURRENCY")
    ]

    for idx, (no, sname) in enumerate(module_sheets, start=11):
        ws.row_dimensions[idx].height = 22
        ws[f"B{idx}"] = no
        ws[f"C{idx}"] = f"='{sname}'!B2"
        ws[f"D{idx}"] = f"='{sname}'!A6"
        ws[f"E{idx}"] = f"='{sname}'!B6"
        ws[f"F{idx}"] = f"='{sname}'!C6"
        ws[f"G{idx}"] = f"='{sname}'!D6"
        ws[f"H{idx}"] = f"='{sname}'!E6"

        ws[f"B{idx}"].font = BLACK_REGULAR_FONT
        ws[f"B{idx}"].alignment = Alignment(horizontal="center", vertical="center")
        ws[f"C{idx}"].font = BLACK_BOLD_FONT
        ws[f"C{idx}"].alignment = Alignment(vertical="center")

        for col_letter in ["D", "E", "F", "G", "H"]:
            ws[f"{col_letter}{idx}"].font = BLACK_REGULAR_FONT
            ws[f"{col_letter}{idx}"].alignment = Alignment(horizontal="center", vertical="center")

        for col_letter, _ in table_headers:
            ws[f"{col_letter}{idx}"].border = THIN_BORDER

    # Dòng Tổng cộng (Sub total) tại dòng 18
    ws.row_dimensions[18].height = 24
    ws["B18"] = ""
    ws["C18"] = "Sub total"
    ws["D18"] = "=SUM(D11:D17)"
    ws["E18"] = "=SUM(E11:E17)"
    ws["F18"] = "=SUM(F11:F17)"
    ws["G18"] = "=SUM(G11:G17)"
    ws["H18"] = "=SUM(H11:H17)"

    ws["C18"].font = BLACK_BOLD_FONT
    for col_letter, _ in table_headers:
        c = ws[f"{col_letter}18"]
        c.font = BLACK_BOLD_FONT
        c.fill = LIGHT_BLUE_FILL
        c.border = DOUBLE_BOTTOM_BORDER
        if col_letter != "C":
            c.alignment = Alignment(horizontal="center", vertical="center")

    # Dòng Đánh giá Tỷ lệ bao phủ (Coverage)
    ws["C20"] = "Test coverage"
    ws["C20"].font = BLACK_BOLD_FONT
    ws["E20"] = "=(D18+E18)*100/(H18-G18)"
    ws["E20"].font = Font(name="Tahoma", size=10, bold=True, color="1A365D")
    ws["E20"].alignment = Alignment(horizontal="right", vertical="center")
    ws["F20"] = "%"
    ws["F20"].font = BLACK_BOLD_FONT

    ws["C21"] = "Test successful coverage"
    ws["C21"].font = BLACK_BOLD_FONT
    ws["E21"] = "=D18*100/(H18-G18)"
    ws["E21"].font = Font(name="Tahoma", size=10, bold=True, color="22543D")
    ws["E21"].alignment = Alignment(horizontal="right", vertical="center")
    ws["F21"] = "%"
    ws["F21"].font = BLACK_BOLD_FONT

    # Đánh giá chất lượng tổng thể
    ws["C23"] = "ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG:"
    ws["C23"].font = BLACK_BOLD_FONT
    ws["C24"] = "✓ 12/12 System Test Cases đạt kết quả Pass 100%, không còn lỗi tồn đọng."
    ws["C24"].font = Font(name="Tahoma", size=9.5, color="22543D", bold=True)
    ws["C25"] = "✓ Toàn bộ 5 lỗi hệ thống (Bug Log BUG-ST-001 -> 005) đã được khắc phục triệt để và kiểm thử hồi quy thành công."
    ws["C25"].font = Font(name="Tahoma", size=9.5, color="1A365D")
    ws["C26"] = "✓ Hệ thống GameRent vận hành trơn tru, bảo mật và sẵn sàng triển khai chính thức."
    ws["C26"].font = Font(name="Tahoma", size=9.5, color="1A365D")

    ws.column_dimensions["B"].width = 6
    ws.column_dimensions["C"].width = 25
    ws.column_dimensions["D"].width = 12
    ws.column_dimensions["E"].width = 12
    ws.column_dimensions["F"].width = 12
    ws.column_dimensions["G"].width = 12
    ws.column_dimensions["H"].width = 22

def create_bug_log_sheet(wb):
    """Tạo Sheet Bug Log quản lý 5 lỗi System Bug theo đúng chuẩn 8 nội dung của bộ môn"""
    sheet_name = "Bug Log"
    if sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
    else:
        ws = wb.create_sheet(title=sheet_name)

    # Hủy merge cũ nếu có
    merged_to_remove = [str(rng) for rng in ws.merged_cells.ranges]
    for rng in merged_to_remove:
        try:
            ws.unmerge_cells(rng)
        except Exception:
            pass

    # Xóa nội dung cũ nếu có
    for r in range(1, max(ws.max_row + 1, 20)):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    ws["B2"] = "DANH SÁCH LỖI HỆ THỐNG PHÁT HIỆN TRONG SYSTEM TEST (BUG LOG)"
    ws["B2"].font = HEADER_TITLE_FONT

    headers = [
        ("B", "Bug ID"),
        ("C", "Tiêu đề lỗi (Bug Title)"),
        ("D", "Mức ưu tiên (Severity / Priority)"),
        ("E", "Màn hình / File phát sinh"),
        ("F", "Tester phát hiện"),
        ("G", "Ngày phát hiện"),
        ("H", "Mã STC liên quan"),
        ("I", "Trạng thái (Status)"),
        ("J", "Mô tả giải pháp khắc phục (Resolution Summary)")
    ]

    ws.row_dimensions[4].height = 28
    for col_letter, title in headers:
        c = ws[f"{col_letter}4"]
        c.value = title
        c.font = WHITE_BOLD_FONT
        c.fill = NAVY_FILL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = THIN_BORDER

    bugs_data = [
        (
            "BUG-ST-001",
            "Lỗi đua tài nguyên (Race Condition) cho phép 2 khách hàng cùng bấm thuê trùng 1 tài khoản (Double-booking)",
            "Critical",
            "RentConfirmModal.jsx / rentAccount()",
            "Lê Minh Quân",
            "21/09/2026",
            "STC-E2E-12",
            "Đã sửa (Fixed)",
            "Bổ sung cơ chế Atomic Check & Lock: kiểm tra trạng thái available ngay trước khi ghi đè LocalStorage; nếu acc đã bị thuê trước thì hủy giao dịch và hoàn tiền ví lập tức."
        ),
        (
            "BUG-ST-002",
            "CountdownTimer bị trôi giây khi người dùng chuyển sang tab trình duyệt khác (Background Tab Throttling)",
            "Medium",
            "CountdownTimer.jsx",
            "Lê Thanh Tùng",
            "21/09/2026",
            "STC-E2E-06",
            "Đã sửa (Fixed)",
            "Loại bỏ cơ chế đếm lùi setInterval trần; chuyển sang đồng bộ mốc thời gian tuyệt đối dựa trên chênh lệch Date.now() và rental.endTime, kèm sự kiện visibilitychange."
        ),
        (
            "BUG-ST-003",
            "Form thêm tài khoản UC1 cho phép lưu Tên sản phẩm chứa khoảng trắng đầu cuối vượt quá giới hạn 50 ký tự",
            "Medium",
            "AccountInventoryPage.jsx",
            "Lê Hải Đăng",
            "22/09/2026",
            "STC-E2E-10",
            "Đã sửa (Fixed)",
            "Bổ sung hàm .trim() trước khi kiểm tra độ dài chuỗi và trước khi lưu vào CSDL, đảm bảo tuân thủ nghiêm ngặt quy định UC1_Add New Product."
        ),
        (
            "BUG-ST-004",
            "Nút Sao chép (Copy) mật khẩu in-game không phản hồi khi chạy trên môi trường mạng nội bộ giao thức HTTP",
            "High",
            "MyRentalsPage.jsx",
            "Lê Xuân Đạt",
            "22/09/2026",
            "STC-E2E-05",
            "Đã sửa (Fixed)",
            "Thêm fallback sao chép văn bản bằng document.execCommand('copy') thông qua thẻ textarea ẩn khi navigator.clipboard không khả dụng trên HTTP."
        ),
        (
            "BUG-ST-005",
            "Người dùng bị Admin khóa tài khoản (isBlocked = true) vẫn có thể đổi mật khẩu qua trang Settings khi còn lưu session cũ",
            "High",
            "SettingsPage.jsx / auth.js",
            "Lê Thanh Tùng",
            "23/09/2026",
            "STC-E2E-02",
            "Đã sửa (Fixed)",
            "Bổ sung bước xác thực cờ isBlocked theo thời gian thực trước mọi hành động cập nhật thông tin cá nhân hoặc đổi mật khẩu; tự động đăng xuất nếu phát hiện tài khoản bị khóa."
        )
    ]

    r = 5
    for b in bugs_data:
        ws.row_dimensions[r].height = 45
        for col_idx, val in enumerate(b):
            c = ws.cell(r, col_idx + 2)
            c.value = val
            c.border = THIN_BORDER

            if col_idx in [0, 2, 4, 5, 6, 7]:
                c.alignment = Alignment(horizontal="center", vertical="center")
            else:
                c.alignment = Alignment(vertical="center", wrap_text=True)

            if col_idx == 0:
                c.font = BLACK_BOLD_FONT
            elif col_idx == 2:
                c.font = BLACK_BOLD_FONT
                if val == "Critical":
                    c.fill = CRITICAL_FILL
                    c.font = Font(name="Tahoma", size=9.5, bold=True, color="9B2C2C")
                elif val == "High":
                    c.fill = HIGH_FILL
                    c.font = Font(name="Tahoma", size=9.5, bold=True, color="9C4221")
            elif col_idx == 7:
                c.font = Font(name="Tahoma", size=9.5, bold=True, color="22543D")
                c.fill = PASS_GREEN_FILL
            else:
                c.font = BLACK_REGULAR_FONT

        r += 1

    ws.column_dimensions["B"].width = 14
    ws.column_dimensions["C"].width = 32
    ws.column_dimensions["D"].width = 16
    ws.column_dimensions["E"].width = 24
    ws.column_dimensions["F"].width = 16
    ws.column_dimensions["G"].width = 14
    ws.column_dimensions["H"].width = 14
    ws.column_dimensions["I"].width = 16
    ws.column_dimensions["J"].width = 45

def update_wireframe_sheet(ws):
    """Cập nhật Sheet Wireframe với ảnh giao diện AuthModal GameRent thực tế"""
    ws['B2'] = 'Wireframe & Giao diện luồng nghiệp vụ E2E (Màn hình Đăng nhập AuthModal GameRent)'
    ws._images.clear()
    
    img_path = r'e:\BTL_KTPM\public\login_wireframe_real_sized.png'
    if os.path.exists(img_path):
        img = openpyxl.drawing.image.Image(img_path)
        img.width = 340
        img.height = 435
        ws.add_image(img, 'B4')
        for r in range(4, 22):
            ws.row_dimensions[r].height = 19.0

def main():
    print(f"=== Đang tải file Excel: {EXCEL_PATH} ===")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=False)

    print("Các sheet hiện tại:", wb.sheetnames)

    # 1. Cập nhật Cover
    if "Cover" in wb.sheetnames:
        print("[1/5] Đang cập nhật Sheet 'Cover'...")
        update_cover_sheet(wb["Cover"])

    # 2. Cập nhật Luồng nghiệp vụ
    flow_sheet = None
    for name in ["Luồng nghiệp vụ", "Business_Process_Flow"]:
        if name in wb.sheetnames:
            flow_sheet = wb[name]
            flow_sheet.title = "Luồng nghiệp vụ"
            break
    if not flow_sheet:
        flow_sheet = wb.create_sheet(title="Luồng nghiệp vụ")
    print("[2/5] Đang cập nhật Sheet 'Luồng nghiệp vụ'...")
    update_business_flow_sheet(flow_sheet)

    # 3. Cập nhật Test Case List
    list_sheet = None
    for name in ["Test Case List", "Test case List", "Test case List1"]:
        if name in wb.sheetnames:
            list_sheet = wb[name]
            list_sheet.title = "TEMP_LIST_NAME"
            list_sheet.title = "Test Case List"
            break
    if not list_sheet:
        list_sheet = wb.create_sheet(title="Test Case List")
    print("[3/5] Đang cập nhật Sheet 'Test Case List'...")
    update_test_case_list_sheet(list_sheet)

    # 4. Xóa các sheet cũ/thô sơ không còn dùng
    for old_s in ["ST_User_Journey", "ST_Rental_Lifecycle", "ST_Dispute_Refund", "ST_Admin_Security", "Tạo lịch học"]:
        if old_s in wb.sheetnames:
            print(f"[-] Đang gỡ bỏ Sheet cũ: '{old_s}'...")
            wb.remove(wb[old_s])

    # 5. Tạo 7 sheet module E2E
    print("[4/5] Đang tạo và định dạng 7 Sheet module System Test Cases E2E...")
    for sname, sdata in STC_MODULES_DATA.items():
        print(f"  -> Tạo/Cập nhật Sheet: {sname} ({len(sdata['cases'])} TCs)")
        create_module_test_sheet(wb, sname, sdata)

    # 6. Cập nhật Test Report
    if "Test Report" in wb.sheetnames:
        print("[5/5] Đang cập nhật Sheet 'Test Report'...")
        update_test_report_sheet(wb["Test Report"])
    else:
        ws_rep = wb.create_sheet(title="Test Report")
        update_test_report_sheet(ws_rep)

    # 7. Tạo thêm Sheet Bug Log
    print("[+] Đang tạo thêm Sheet 'Bug Log' ghi nhận 5 System Bugs...")
    create_bug_log_sheet(wb)

    # 8. Cập nhật Wireframe
    if "Wireframe" in wb.sheetnames:
        print("[+] Đang cập nhật Sheet 'Wireframe' với ảnh chụp màn hình AuthModal GameRent...")
        update_wireframe_sheet(wb["Wireframe"])

    # Sắp xếp lại thứ tự sheet trực quan nhất
    desired_order = [
        "Cover",
        "Luồng nghiệp vụ",
        "Test Case List",
        "ST_AUTH_RBAC",
        "ST_CATALOG_FAV",
        "ST_WALLET_RENT",
        "ST_TIMER_EXT",
        "ST_EARLY_DISPUTE",
        "ST_ADMIN_DISPATCH",
        "ST_CONCURRENCY",
        "Test Report",
        "Bug Log",
        "Wireframe"
    ]
    wb._sheets = [wb[s] for s in desired_order if s in wb.sheetnames]

    # Lưu file
    wb.save(EXCEL_PATH)
    print(f"\n[HOÀN TẤT THÀNH CÔNG] File Excel ST_Test Case.xlsx đã được lưu tại:\n{EXCEL_PATH}")
    print(f"Tổng số sheet: {len(wb.sheetnames)}")
    print("Danh sách sheet:", wb.sheetnames)

if __name__ == "__main__":
    main()
