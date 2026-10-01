# -*- coding: utf-8 -*-
"""
Script khởi tạo và chuẩn hóa toàn diện file IT_Test Case.xlsx cho dự án GameRent
Đảm bảo đồng bộ 100% với:
- Báo cáo Word: Bao_Cao_Bai_Tap_Lon_Kiem_Thu_Phan_Mem.docx (Chương 2.2 & Chương 3.1)
- Hồ sơ dự án: CHI_TIET_DU_AN_GAMERENT.md
- Chiến lược tích hợp Sandwich (Hybrid Integration Strategy)
- Mã nguồn chạy thực tế và bộ kiểm thử tự động Vitest (integrationFlows.test.js)
- Nhóm thực hiện: Nhóm 15 (Lớp: Kiểm thử phần mềm-1-1-26(N05))
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

EXCEL_PATH = r"e:\BTL_KTPM\Tài_Liệu\IT_Test Case.xlsx"

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

def update_cover_sheet(ws):
    """Cập nhật trang bìa Cover chuẩn xác cho Nhóm 15"""
    ws["A2"] = "INTEGRATION TEST CASE (ITC) - CHIẾN LƯỢC SANDWICH"
    ws["A2"].font = Font(name="Tahoma", size=14, bold=True, color="000080")
    ws["A2"].alignment = Alignment(horizontal="center", vertical="center")

    # Project Information
    ws["A4"] = "Project Name"
    ws["B4"] = "GameRent - Website Cho Thuê Tài Khoản Game Tự Động 24/7"
    ws["D4"] = "Creator"
    ws["E4"] = "Nhóm 15 - Lớp Kiểm thử phần mềm-1-1-26(N05)"

    ws["A5"] = "Project Code"
    ws["B5"] = "GAMERENT"
    ws["D5"] = "Reviewer/Approver"
    ws["E5"] = "ThS. Phạm Thị Loan"

    ws["A6"] = "Document Code"
    ws["B6"] = '=B5&"_"&"ITC_v1.0"'
    ws["D6"] = "Issue Date"
    ws["E6"] = "26/09/2026"

    ws["A7"] = "Version"
    ws["B7"] = "1.0"
    ws["D7"] = "Status"
    ws["E7"] = "Approved"

    # Styling info cells
    for r in range(4, 8):
        ws[f"A{r}"].font = BLACK_BOLD_FONT
        ws[f"D{r}"].font = BLACK_BOLD_FONT
        if ws[f"E{r}"].value is not None:
            ws[f"E{r}"].font = BLACK_BOLD_FONT

    # Record of change
    ws["A10"] = "Record of change"
    ws["A10"].font = Font(name="Tahoma", size=11, bold=True, color="000080")

    ws["A12"] = "26/09/2026"
    ws["B12"] = "1.0"
    ws["C12"] = "Integration Test Cases"
    ws["D12"] = "A"
    ws["E12"] = "Khởi tạo và hoàn thiện đầy đủ bộ 10 kịch bản Integration Test Cases (ITC-01 đến ITC-10) theo chiến lược tích hợp Sandwich (Hybrid) cho dự án GameRent do Nhóm 15 thực hiện (kiểm soát tương tác đồng bộ giữa React Components ↔ AppContext Global State ↔ LocalStorage Database)."
    ws["F12"] = "SRS, Kiến trúc Sandwich, Vitest integrationFlows.test.js, Báo cáo BTL KTPM"

    for c in ["A12", "B12", "C12", "D12", "E12", "F12"]:
        ws[c].font = BLACK_REGULAR_FONT
        ws[c].alignment = Alignment(vertical="top", wrap_text=True)

    ws.column_dimensions["B"].width = 18
    ws.column_dimensions["C"].width = 28
    ws.column_dimensions["D"].width = 24
    ws.column_dimensions["E"].width = 10
    ws.column_dimensions["F"].width = 38
    ws.column_dimensions["G"].width = 35

def update_strategy_sheet(ws):
    """Cập nhật Sheet Chiến lược tích hợp (Sandwich / Hybrid Strategy)"""
    # Unmerge cũ nếu có
    merged_to_remove = [str(rng) for rng in ws.merged_cells.ranges]
    for rng in merged_to_remove:
        try:
            ws.unmerge_cells(rng)
        except Exception:
            pass

    # Xóa nội dung cũ
    for r in range(1, max(ws.max_row + 1, 40)):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    ws["B2"] = "CHIẾN LƯỢC KIỂM THỬ TÍCH HỢP SANDWICH (HYBRID INTEGRATION STRATEGY)"
    ws["B2"].font = HEADER_TITLE_FONT

    # Khái niệm và Kiến trúc 3 tầng
    ws["B4"] = "1. MÔ HÌNH KIẾN TRÚC 3 TẦNG TRONG KIỂM THỬ TÍCH HỢP DỰ ÁN GAMERENT"
    ws["B4"].font = SECTION_FONT
    ws["B4"].fill = LIGHT_BLUE_FILL

    layers = [
        ("Tầng Thượng tầng (Top-Down Layer)", "Giao diện người dùng React 19 UI Components", "AuthModal, DepositModal, RentConfirmModal, ExtendRentalModal, DisputeModal, ReturnEarlyModal, CountdownTimer, OverviewDashboard."),
        ("Tầng Trung gian (Target Middle Layer)", "Bộ quản lý trạng thái toàn cục & Điều phối nghiệp vụ", "React Context API (AppContext), Custom Hooks (useAuth, useWallet, useRentals, useAccounts), cơ chế Pub/Sub và State Dispatcher."),
        ("Tầng Hạ tầng (Bottom-Up Layer)", "Kho lưu trữ dữ liệu & Thư viện hàm xử lý lõi", "LocalStorage Atomic Mock Database (gamerent_users, gamerent_accounts, gamerent_rentals, gamerent_transactions), validationUtils, passwordGenerator.")
    ]

    r = 5
    ws.cell(r, 2, "Tầng tích hợp").font = WHITE_BOLD_FONT
    ws.cell(r, 2).fill = SUBHEADER_FILL
    ws.cell(r, 3, "Thành phần hệ thống").font = WHITE_BOLD_FONT
    ws.cell(r, 3).fill = SUBHEADER_FILL
    ws.cell(r, 4, "Chi tiết các module / hàm nghiệp vụ tham gia").font = WHITE_BOLD_FONT
    ws.cell(r, 4).fill = SUBHEADER_FILL

    for layer_name, comp_name, desc in layers:
        r += 1
        ws.cell(r, 2, layer_name).font = BLACK_BOLD_FONT
        ws.cell(r, 2).border = THIN_BORDER
        ws.cell(r, 2).alignment = Alignment(vertical="top")

        ws.cell(r, 3, comp_name).font = BLACK_BOLD_FONT
        ws.cell(r, 3).border = THIN_BORDER
        ws.cell(r, 3).alignment = Alignment(vertical="top")

        ws.cell(r, 4, desc).font = BLACK_REGULAR_FONT
        ws.cell(r, 4).border = THIN_BORDER
        ws.cell(r, 4).alignment = Alignment(vertical="top", wrap_text=True)

    # Nguyên lý kiểm thử Sandwich
    r += 2
    ws.cell(r, 2, "2. NGUYÊN LÝ VẬN HÀNH CHIẾN LƯỢC SANDWICH TRONG DỰ ÁN").font = SECTION_FONT
    ws.cell(r, 2).fill = LIGHT_BLUE_FILL

    principles = [
        ("Tích hợp Top-down", "Kiểm thử từ giao diện tương tác người dùng xuống tầng quản lý trạng thái", "Kiểm tra xem khi người dùng tương tác trên Modal (bấm nút Thuê, Nạp tiền, Gia hạn, Khiếu nại), UI Component có truyền đúng payload tham số vào AppContext hay không."),
        ("Tích hợp Bottom-up", "Kiểm thử từ tầng CSDL và các hàm tiện ích ngược lên AppContext", "Kiểm tra xem các hàm tiện ích lõi (validateRegistration, calculateRentalCost, calculateRefundAndExtension, generateSecurePassword) khi xử lý xong có cập nhật chuẩn xác vào LocalStorage hay không."),
        ("Điểm hội tụ (Target Middle)", "Bộ quản trị trạng thái AppContext làm trung gian kết nối", "Đảm bảo tính toàn vẹn dữ liệu: khi LocalStorage thay đổi, AppContext lập tức broadcast dữ liệu mới đến tất cả các Component đang hiển thị mà không cần reload trang.")
    ]

    r += 1
    ws.cell(r, 2, "Hướng tích hợp").font = WHITE_BOLD_FONT
    ws.cell(r, 2).fill = SUBHEADER_FILL
    ws.cell(r, 3, "Mục tiêu kiểm thử").font = WHITE_BOLD_FONT
    ws.cell(r, 3).fill = SUBHEADER_FILL
    ws.cell(r, 4, "Phương pháp kiểm chứng thực tế").font = WHITE_BOLD_FONT
    ws.cell(r, 4).fill = SUBHEADER_FILL

    for h, m, p in principles:
        r += 1
        ws.cell(r, 2, h).font = BLACK_BOLD_FONT
        ws.cell(r, 2).border = THIN_BORDER
        ws.cell(r, 2).alignment = Alignment(vertical="top")

        ws.cell(r, 3, m).font = BLACK_BOLD_FONT
        ws.cell(r, 3).border = THIN_BORDER
        ws.cell(r, 3).alignment = Alignment(vertical="top")

        ws.cell(r, 4, p).font = BLACK_REGULAR_FONT
        ws.cell(r, 4).border = THIN_BORDER
        ws.cell(r, 4).alignment = Alignment(vertical="top", wrap_text=True)

    # 6 Phân hệ tích hợp chính
    r += 2
    ws.cell(r, 2, "3. MA TRẬN 6 PHÂN HỆ TÍCH HỢP CỐT LÕI (10 CA KIỂM THỬ ITC)").font = SECTION_FONT
    ws.cell(r, 2).fill = LIGHT_BLUE_FILL

    subsystems = [
        ("IT_AUTH_SYNC", "F_AUTH ↔ AppContext ↔ LocalStorage", "ITC-01, ITC-08, ITC-10", "Tích hợp luồng Xác thực, Khởi tạo ví 50k, Tự động đồng bộ CRM khách hàng Admin và Đổi mật khẩu cập nhật LocalStorage."),
        ("IT_WALLET_FLOW", "F_WAL ↔ WalletPage ↔ AppContext", "ITC-02", "Tích hợp cổng nạp tiền VietQR tự động, cộng số dư ví thời gian thực và ghi nhận Transaction History."),
        ("IT_RENT_DELIVER", "F_RENT ↔ AccountCard ↔ AppContext", "ITC-03", "Tích hợp luồng thuê tài khoản game tức thì: trừ số dư ví, đổi trạng thái acc sang 'rented' và bàn giao mật khẩu bí mật 1-click."),
        ("IT_TIMER_EXT", "F_TIMER ↔ CountdownTimer ↔ AppContext", "ITC-04, ITC-07", "Tích hợp gia hạn nối tiếp giờ chơi trên CountdownTimer và cơ chế thu hồi tự động đổi mật khẩu ngẫu nhiên khi hết hạn."),
        ("IT_REFUND_DISPUTE", "F_REF_EXT ↔ Dispute & Return ↔ AppContext", "ITC-05, ITC-06", "Tích hợp chính sách hoàn tiền: Khách báo lỗi in-game được bồi thường bảo hiểm 100% và Trả nick sớm nhận hoàn 50% tiền giờ thừa."),
        ("IT_FAV_SEP", "F_FAV ↔ LocalStorage Separation", "ITC-09", "Tích hợp cơ chế phân tách danh sách tài khoản yêu thích (Favorites) độc lập tuyệt đối giữa các người dùng.")
    ]

    r += 1
    ws.cell(r, 2, "Mã phân hệ").font = WHITE_BOLD_FONT
    ws.cell(r, 2).fill = SUBHEADER_FILL
    ws.cell(r, 3, "Tương tác thành phần").font = WHITE_BOLD_FONT
    ws.cell(r, 3).fill = SUBHEADER_FILL
    ws.cell(r, 4, "Ca kiểm thử bao phủ").font = WHITE_BOLD_FONT
    ws.cell(r, 4).fill = SUBHEADER_FILL

    for code, comp, itcs, desc in subsystems:
        r += 1
        ws.cell(r, 2, code).font = BLACK_BOLD_FONT
        ws.cell(r, 2).border = THIN_BORDER
        ws.cell(r, 2).alignment = Alignment(vertical="top")

        ws.cell(r, 3, f"{comp}\n({itcs})").font = BLACK_BOLD_FONT
        ws.cell(r, 3).border = THIN_BORDER
        ws.cell(r, 3).alignment = Alignment(vertical="top", wrap_text=True)

        ws.cell(r, 4, desc).font = BLACK_REGULAR_FONT
        ws.cell(r, 4).border = THIN_BORDER
        ws.cell(r, 4).alignment = Alignment(vertical="top", wrap_text=True)

    ws.column_dimensions["B"].width = 24
    ws.column_dimensions["C"].width = 35
    ws.column_dimensions["D"].width = 75

def update_test_case_list_sheet(ws):
    """Cập nhật Sheet Test case List cho cấp độ Integration Testing"""
    for r in range(8, ws.max_row + 1):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    ws["B1"] = "DANH SÁCH CÁC PHÂN HỆ KIỂM THỬ TÍCH HỢP (INTEGRATION TEST CASE LIST)"
    ws["B1"].font = HEADER_TITLE_FONT

    ws["B3"] = "Project Name"
    ws["D3"] = "=Cover!C4"
    ws["B4"] = "Project Code"
    ws["D4"] = "=Cover!C5"
    ws["B5"] = "Test Environment Setup Description"
    ws["D5"] = (
        "1. Integration Strategy: Chiến lược tích hợp Sandwich (Hybrid) kết hợp Top-down và Bottom-up quanh trục AppContext.\n"
        "2. Client Application: React 19.x, Vite 5.x, React Context API, Web Workers / Timers.\n"
        "3. Storage Engine: LocalStorage Mock Database mô phỏng giao dịch Atomic Check & Lock.\n"
        "4. Automated Test Runner: Vitest v5.0, Happy-DOM, jsdom, Node.js v20.x LTS (integrationFlows.test.js passing 100%)."
    )
    ws["D5"].alignment = Alignment(vertical="top", wrap_text=True)
    ws.row_dimensions[5].height = 65

    headers = ["No", "Mã phân hệ IT", "Tên phân hệ kiểm thử tích hợp", "Tên Sheet", "Mô tả phạm vi tích hợp", "Kịch bản ITC bao phủ", "Số ca ITC", "Mức ưu tiên"]
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
        (1, "IT_AUTH_SYNC", "Xác thực ↔ AppContext ↔ CRM", "IT_AUTH_SYNC", "Tích hợp luồng Đăng ký tự động đăng nhập, khởi tạo ví 50k, đồng bộ CRM khách hàng Admin và đổi mật khẩu an toàn.", "ITC-01, ITC-08, ITC-10", 3, "High"),
        (2, "IT_WALLET_FLOW", "Nạp tiền VietQR ↔ Ví ↔ Lịch sử", "IT_WALLET_FLOW", "Tích hợp cổng nạp tiền VietQR chuẩn NAPAS, cộng số dư ví thời gian thực và ghi vết lịch sử giao dịch.", "ITC-02", 1, "High"),
        (3, "IT_RENT_DELIVER", "Thuê acc ↔ Trừ ví ↔ Cấp mật khẩu", "IT_RENT_DELIVER", "Tích hợp luồng thuê tài khoản game tức thì, kiểm tra số dư ví, trừ tiền, đổi trạng thái nick và bàn giao pass 1-click.", "ITC-03", 1, "Critical"),
        (4, "IT_TIMER_EXT", "Đếm ngược ↔ Gia hạn ↔ Thu hồi đổi pass", "IT_TIMER_EXT", "Tích hợp gia hạn nối tiếp giờ chơi trên CountdownTimer và cơ chế thu hồi tự động sinh mật khẩu ngẫu nhiên khi hết hạn.", "ITC-04, ITC-07", 2, "High"),
        (5, "IT_REFUND_DISPUTE", "Báo lỗi bồi thường 100% ↔ Trả sớm hoàn 50%", "IT_REFUND_DISPUTE", "Tích hợp hai chính sách hoàn trả: Khách khiếu nại được hoàn bảo hiểm 100% và Trả nick sớm nhận hoàn 50% tiền giờ thừa.", "ITC-05, ITC-06", 2, "High"),
        (6, "IT_FAV_SEP", "Phân tách Yêu thích ↔ LocalStorage", "IT_FAV_SEP", "Tích hợp cơ chế phân tách danh sách tài khoản yêu thích (Favorites) độc lập tuyệt đối giữa các tài khoản người dùng.", "ITC-09", 1, "Medium")
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
    ws.column_dimensions["D"].width = 32
    ws.column_dimensions["E"].width = 20
    ws.column_dimensions["F"].width = 50
    ws.column_dimensions["G"].width = 24
    ws.column_dimensions["H"].width = 12
    ws.column_dimensions["I"].width = 14

# Dữ liệu 10 kịch bản ITC chi tiết
ITC_MODULES_DATA = {
    "IT_AUTH_SYNC": {
        "code": "IT_AUTH_SYNC",
        "req": "Kiểm thử tích hợp giữa UI Authentication Modal, State Management AppContext và CSDL LocalStorage (Đăng ký mới, Đồng bộ CRM, Đổi mật khẩu).",
        "tester": "Nhóm 15 (Lê Xuân Đạt, Lê Minh Quân)",
        "cases": [
            {
                "id": "ITC-01",
                "desc": "Tích hợp Đăng ký mới -> Tự động đăng nhập -> Khởi tạo ví 50.000 VNĐ.\nKiểm tra tương tác AuthModal ↔ AppContext ↔ LocalStorage gamerent_users và gamerent_wallet_balance.",
                "pre": "Trình duyệt ở trạng thái Chưa đăng nhập, LocalStorage chưa có session người dùng.",
                "steps": "1. Nhập thông tin đăng ký hợp lệ: username = 'gamer_new', pass = 'pass123456', sdt = '0912345678'.\n2. Nhấn nút 'Đăng ký ngay'.\n3. Kiểm tra biến đổi trong LocalStorage và trạng thái toàn cục AppContext.",
                "expected": "1. Dữ liệu User mới được ghi nhận vào mảng gamerent_users trong LocalStorage.\n2. Hệ thống tự động kích hoạt phiên đăng nhập: currentUser trong AppContext được cập nhật với role = 'renter'.\n3. Số dư ví khởi tạo được gán chính xác 50.000 VNĐ, Header cập nhật tên và số dư ví.",
                "post": "User có trạng thái Active trong LocalStorage; ví có 50.000 VNĐ; phiên làm việc mở.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã tự động hóa trong integrationFlows.test.js ([ITC-01])."
            },
            {
                "id": "ITC-08",
                "desc": "Tích hợp Đăng ký khách mới -> Tự động đồng bộ CRM khách hàng Admin.\nKiểm tra tương tác AuthModal ↔ CustomersPage ↔ AppContext mà không cần reload trang.",
                "pre": "Admin đang mở trang Quản lý khách hàng CRM trên một tab; khách hàng vãng lai đăng ký tại trang chủ.",
                "steps": "1. Khách hàng thực hiện đăng ký tài khoản mới thành công tại AuthModal.\n2. Chuyển sang phiên làm việc của Quản trị viên (Admin) tại CustomersPage.\n3. Quan sát danh sách khách hàng CRM và số liệu tổng quan.",
                "expected": "1. Khách hàng mới lập tức xuất hiện trong bảng danh sách thành viên CRM với mã KHxxx.\n2. Số dư hiển thị đúng 50.000 VNĐ, số đơn thuê khởi tạo = 0, trạng thái tài khoản = 'Hoạt động'.\n3. Thẻ thống kê Tổng khách hàng trên Dashboard tự động tăng thêm 1 thành viên.",
                "post": "Tính nhất quán dữ liệu giữa Client và Admin Dashboard đạt 100%.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã kiểm thử tự động trong crudManagement.test.js."
            },
            {
                "id": "ITC-10",
                "desc": "Tích hợp Đổi mật khẩu khách thuê -> Cập nhật LocalStorage -> Xác thực lại.\nKiểm tra tương tác SettingsPage ↔ AuthModal ↔ AppContext bảo mật thông tin đăng nhập.",
                "pre": "Khách hàng đang đăng nhập với mật khẩu hiện tại '123456'.",
                "steps": "1. Vào trang Cài đặt (SettingsPage) -> Tab Đổi mật khẩu.\n2. Nhập Mật khẩu cũ: '123456', Mật khẩu mới: 'newpass123', Nhập lại: 'newpass123'.\n3. Bấm 'Lưu thay đổi'.\n4. Đăng xuất khỏi hệ thống và thực hiện đăng nhập lại bằng mật khẩu cũ '123456'.\n5. Thực hiện đăng nhập lại bằng mật khẩu mới 'newpass123'.",
                "expected": "1. Đổi mật khẩu thành công, LocalStorage cập nhật hash mật khẩu mới của user.\n2. Đăng nhập bằng pass cũ '123456' bị hệ thống từ chối với thông báo: 'Sai tên đăng nhập hoặc mật khẩu'.\n3. Đăng nhập bằng pass mới 'newpass123' thành công, khôi phục đầy đủ phiên làm việc.",
                "post": "Mật khẩu mới có hiệu lực vĩnh viễn, mật khẩu cũ bị vô hiệu hóa hoàn toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã kiểm thử tự động trong changePassword.test.js (8/8 Passed)."
            }
        ]
    },
    "IT_WALLET_FLOW": {
        "code": "IT_WALLET_FLOW",
        "req": "Kiểm thử tích hợp cổng nạp tiền VietQR tự động, tính hợp lệ hạn mức BVA, đồng bộ số dư ví và lưu vết lịch sử giao dịch.",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Xuân Đạt)",
        "cases": [
            {
                "id": "ITC-02",
                "desc": "Tích hợp Nạp tiền VietQR Auto -> Cộng số dư ví -> Ghi nhận Transaction History.\nKiểm tra tương tác DepositModal ↔ WalletPage ↔ AppContext và hàm validateDepositAmount().",
                "pre": "Khách hàng đã đăng nhập, số dư ví hiện tại là 50.000 VNĐ.",
                "steps": "1. Mở modal nạp tiền, chọn mệnh giá nạp 200.000 VNĐ (hạn mức BVA hợp lệ).\n2. Hệ thống sinh mã VietQR động NAPAS kèm mã giao dịch GR_NAP_XXXXX.\n3. Nhấn xác nhận hoàn tất nạp tiền.\n4. Kiểm tra cập nhật số dư ví trên Header và kiểm tra bảng Lịch sử giao dịch tại WalletPage.",
                "expected": "1. Số dư ví trong AppContext và LocalStorage tự động cộng dồn lên đúng 250.000 VNĐ (50.000 + 200.000).\n2. Bảng Lịch sử giao dịch ghi nhận 1 bản ghi mới với mã TX-XXXXX, loại 'Nạp tiền VietQR Auto', số tiền '+200.000 VNĐ', trạng thái 'Thành công'.\n3. Không xảy ra lỗi làm tròn số thực dạng thập phân (Fixed BUG-IT-001).",
                "post": "Số dư ví cập nhật chính xác 250.000 VNĐ, giao dịch lưu vết vĩnh viễn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã tự động hóa trong integrationFlows.test.js ([ITC-02])."
            }
        ]
    },
    "IT_RENT_DELIVER": {
        "code": "IT_RENT_DELIVER",
        "req": "Kiểm thử tích hợp quy trình thuê nick: tính toán chi phí, trừ ví người dùng, chuyển đổi trạng thái tài khoản in-game và cấp thông tin bảo mật.",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Thanh Tùng)",
        "cases": [
            {
                "id": "ITC-03",
                "desc": "Tích hợp Thuê acc -> Trừ ví -> Cấp pass in-game -> Đổi status acc sang 'rented'.\nKiểm tra tương tác RentConfirmModal ↔ AccountCard ↔ AppContext và hàm calculateRentalCost().",
                "pre": "Ví khách có 250.000 VNĐ, tài khoản game 'ACCVAL001' giá 15.000 VNĐ/h đang ở trạng thái 'available'.",
                "steps": "1. Bấm nút 'Thuê Ngay' trên thẻ 'ACCVAL001', chọn thuê 2 giờ (tổng tiền 30.000 VNĐ).\n2. Tick cam kết quy chế dịch vụ, nhấn button 'Xác Nhận Thuê'.\n3. Quan sát modal bàn giao thông tin và kiểm tra trạng thái thẻ tài khoản trên Cửa hàng.",
                "expected": "1. Số dư ví khách hàng bị trừ chính xác 30.000 VNĐ (còn lại 220.000 VNĐ).\n2. Modal bàn giao hiển thị Tên tài khoản in-game và Mật khẩu bí mật kèm nút sao chép 1-click.\n3. Trạng thái tài khoản 'ACCVAL001' trong CSDL chuyển từ 'available' sang 'rented'.\n4. Sinh đơn thuê mới mã ORDER-XXXXX trong danh sách gamerent_rentals với thời hạn 7.200 giây.",
                "post": "Tài khoản game được khóa độc quyền cho khách hàng; ví trừ đúng 30k.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã tự động hóa trong integrationFlows.test.js ([ITC-03])."
            }
        ]
    },
    "IT_TIMER_EXT": {
        "code": "IT_TIMER_EXT",
        "req": "Kiểm thử tích hợp giữa đồng hồ đếm ngược thời gian thực, cơ chế gia hạn cộng dồn thời gian và luồng thu hồi tự động đổi mật khẩu khi hết giờ.",
        "tester": "Nhóm 15 (Lê Hải Đăng, Lê Thanh Tùng)",
        "cases": [
            {
                "id": "ITC-04",
                "desc": "Tích hợp Gia hạn giờ thuê -> Trừ ví -> Nối tiếp CountdownTimer.\nKiểm tra tương tác ExtendRentalModal ↔ CountdownTimer ↔ AppContext và hàm calculateRefundAndExtension().",
                "pre": "Đơn hàng đang active, thời gian còn lại là 30 phút (1.800s), ví khách có 220.000 VNĐ.",
                "steps": "1. Tại thẻ đơn thuê trên MyRentalsPage, bấm 'Gia hạn thêm giờ'.\n2. Chọn gia hạn thêm 1 giờ (15.000 VNĐ), bấm 'Xác Nhận Gia Hạn'.\n3. Kiểm tra đồng hồ CountdownTimer và số dư ví.",
                "expected": "1. Ví khách bị trừ đúng 15.000 VNĐ (còn 205.000 VNĐ).\n2. Mốc thời gian kết thúc expiresAt được cộng nối tiếp thêm 3.600 giây vào mốc thời gian cũ (không đè mốc Date.now(), Fixed BUG-IT-002).\n3. Đồng hồ đếm ngược lập tức hiển thị 01:30:00 (1 giờ 30 phút), không làm gián đoạn phiên chơi.",
                "post": "Thời gian chơi được gia hạn liền mạch; số dư ví cập nhật chính xác.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã tự động hóa trong integrationFlows.test.js ([ITC-04])."
            },
            {
                "id": "ITC-07",
                "desc": "Tích hợp Thu hồi tự động -> Sinh pass ngẫu nhiên -> Sẵn sàng cho thuê.\nKiểm tra tương tác CountdownTimer ↔ AutoResetEngine ↔ AppContext khi hết giờ.",
                "pre": "Đơn thuê đếm ngược về 00:00:00 (hết thời gian thuê).",
                "steps": "1. Chờ CountdownTimer đếm về 0 hoặc dùng công cụ Fast Forward tua hết giờ.\n2. Quan sát phản ứng tự động của hệ thống và kiểm tra tài khoản game trong kho.",
                "expected": "1. Đơn hàng tự động chuyển trạng thái từ 'active' sang 'completed'.\n2. Hàm generateSecurePassword() kích hoạt sinh mật khẩu ngẫu nhiên mới (đảm bảo khác mật khẩu cũ, Fixed BUG-IT-005).\n3. Tài khoản game tự động chuyển về trạng thái 'available' sẵn sàng phục vụ khách hàng tiếp theo.",
                "post": "Tài khoản game được bảo mật an toàn tuyệt đối, chu trình tự động hóa khép kín 24/7.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã kiểm thử tự động trong autoPasswordReset.test.js (10/10 Passed)."
            }
        ]
    },
    "IT_REFUND_DISPUTE": {
        "code": "IT_REFUND_DISPUTE",
        "req": "Kiểm thử tích hợp hai luồng hoàn tiền: Trả nick sớm hoàn 50% thời gian thừa và Khách báo lỗi in-game được Admin phê duyệt hoàn bảo hiểm 100%.",
        "tester": "Nhóm 15 (Lê Xuân Đạt, Lê Minh Quân)",
        "cases": [
            {
                "id": "ITC-05",
                "desc": "Tích hợp Khách báo lỗi -> Admin duyệt -> Hoàn tiền 100% -> Khóa acc vào diện bảo trì.\nKiểm tra tương tác DisputeModal ↔ OverviewDashboard ↔ AppContext.",
                "pre": "Khách hàng thuê acc gặp sự cố sai mật khẩu, số dư ví hiện tại là 20.000 VNĐ.",
                "steps": "1. Khách hàng gửi khiếu nại tại DisputeModal với lý do 'Sai mật khẩu in-game'.\n2. Admin mở OverviewDashboard (tab Khiếu nại sự cố) và bấm 'Phê duyệt hoàn tiền 100%'.\n3. Kiểm tra biến động ví khách hàng và trạng thái tài khoản game.",
                "expected": "1. Đơn thuê chuyển trạng thái từ 'disputed' sang 'refunded'.\n2. Số dư ví khách hàng được cộng lại đầy đủ 100% tiền đơn thuê (Fixed BUG-IT-003).\n3. Tài khoản game tự động đổi sang trạng thái 'maintenance' để kỹ thuật kiểm tra, không cho khách khác thuê.",
                "post": "Khách hàng nhận lại tiền 100%; tài khoản lỗi được cách ly an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã tự động hóa trong integrationFlows.test.js ([ITC-05])."
            },
            {
                "id": "ITC-06",
                "desc": "Tích hợp Trả nick sớm -> Hoàn 50% tiền thừa -> Chuyển đổi trạng thái đổi pass.\nKiểm tra tương tác ReturnEarlyModal ↔ MyRentalsPage ↔ AppContext.",
                "pre": "Đơn thuê 3 giờ (45.000 VNĐ), khách mới chơi 1 giờ (thời gian thừa 2 giờ), ví khách có 50.000 VNĐ.",
                "steps": "1. Khách bấm 'Trả Nick Sớm' tại ReturnEarlyModal.\n2. Hệ thống tính toán hoàn 50% tiền 2h thừa: 2 x 15.000 x 50% = 15.000 VNĐ.\n3. Khách bấm 'Xác Nhận Trả Sớm'.\n4. Kiểm tra cập nhật ví và trạng thái tài khoản.",
                "expected": "1. Ví khách hàng được cộng thêm đúng 15.000 VNĐ (lên 65.000 VNĐ).\n2. Đơn thuê chuyển sang trạng thái 'completed' (Đã trả sớm).\n3. Tài khoản game lập tức chuyển sang trạng thái 'need_change_pass' (Fixed BUG-IT-004).",
                "post": "Khách hàng nhận đủ tiền hoàn; acc được thu hồi để reset mật khẩu.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã kiểm thử tự động trong refund.test.js (8/8 Passed)."
            }
        ]
    },
    "IT_FAV_SEP": {
        "code": "IT_FAV_SEP",
        "req": "Kiểm thử tích hợp cơ chế phân tách dữ liệu yêu thích (Favorites) độc lập theo định danh người dùng trong LocalStorage.",
        "tester": "Nhóm 15 (Lê Hải Đăng, Lê Xuân Đạt)",
        "cases": [
            {
                "id": "ITC-09",
                "desc": "Tích hợp Phân tách danh sách Yêu thích độc lập theo từng tài khoản.\nKiểm tra tương tác FavoriteButton ↔ LocalStorage ↔ AppContext.",
                "pre": "Hai tài khoản 'renter01' và 'admin' cùng sử dụng chung một trình duyệt web.",
                "steps": "1. Đăng nhập tài khoản 'renter01', nhấn thả tim lưu tài khoản ACC01 và ACC02.\n2. Đăng xuất, sau đó đăng nhập tài khoản 'admin', nhấn thả tim lưu tài khoản ACC03.\n3. Đăng xuất và đăng nhập lại bằng tài khoản 'renter01'.",
                "expected": "1. LocalStorage lưu 2 key tách biệt: gamerent_favorites_renter01 và gamerent_favorites_admin.\n2. Khi 'renter01' đăng nhập, chỉ thấy ACC01 và ACC02 trong danh sách yêu thích, không có ACC03.\n3. Không xảy ra hiện tượng ghi đè hoặc lộ thông tin quan tâm giữa các tài khoản người dùng khác nhau.",
                "post": "Dữ liệu cá nhân hóa của từng người dùng được bảo vệ độc lập tuyệt đối.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đã kiểm thử tự động trong favoritesSeparation.test.js (5/5 Passed)."
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
    headers_itc = [
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
    for col_letter, title in headers_itc:
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

        for col_letter, _ in headers_itc:
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
    """Cập nhật Sheet Test Report động kết nối toàn bộ 6 phân hệ kiểm thử tích hợp"""
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

    ws["B1"] = "BÁO CÁO KẾT QUẢ KIỂM THỬ TÍCH HỢP (INTEGRATION TEST REPORT)"
    ws["B1"].font = HEADER_TITLE_FONT
    ws["B1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 30

    ws["B3"] = "Project Name"
    ws["C3"] = "=Cover!C4"
    ws["E3"] = "Creator"
    ws["G3"] = "=Cover!G4"

    ws["B4"] = "Project Code"
    ws["C4"] = "=Cover!C5"
    ws["E4"] = "Reviewer/Approver"
    ws["G4"] = "=Cover!G5"

    ws["B5"] = "Document Code"
    ws["C5"] = '=C4&"_"&"Test Report"&"_"&"v1.0"'
    ws["E5"] = "Issue Date"
    ws["H5"] = "26/09/2026"

    ws["B6"] = "Notes"
    ws["C6"] = "Báo cáo tổng hợp kết quả thực thi 10 kịch bản Kiểm thử tích hợp (ITC-01 đến ITC-10) theo chiến lược Sandwich bao phủ 6 phân hệ cốt lõi của dự án GameRent."

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

    # Danh sách 6 module liên kết công thức động
    module_sheets = [
        (1, "IT_AUTH_SYNC"),
        (2, "IT_WALLET_FLOW"),
        (3, "IT_RENT_DELIVER"),
        (4, "IT_TIMER_EXT"),
        (5, "IT_REFUND_DISPUTE"),
        (6, "IT_FAV_SEP")
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

    # Dòng Tổng cộng (Sub total) tại dòng 17
    ws.row_dimensions[17].height = 24
    ws["B17"] = ""
    ws["C17"] = "Sub total"
    ws["D17"] = "=SUM(D11:D16)"
    ws["E17"] = "=SUM(E11:E16)"
    ws["F17"] = "=SUM(F11:F16)"
    ws["G17"] = "=SUM(G11:G16)"
    ws["H17"] = "=SUM(H11:H16)"

    ws["C17"].font = BLACK_BOLD_FONT
    for col_letter, _ in table_headers:
        c = ws[f"{col_letter}17"]
        c.font = BLACK_BOLD_FONT
        c.fill = LIGHT_BLUE_FILL
        c.border = DOUBLE_BOTTOM_BORDER
        if col_letter != "C":
            c.alignment = Alignment(horizontal="center", vertical="center")

    # Dòng Đánh giá Tỷ lệ bao phủ (Coverage)
    ws["C19"] = "Test coverage"
    ws["C19"].font = BLACK_BOLD_FONT
    ws["E19"] = "=(D17+E17)*100/(H17-G17)"
    ws["E19"].font = Font(name="Tahoma", size=10, bold=True, color="1A365D")
    ws["E19"].alignment = Alignment(horizontal="right", vertical="center")
    ws["F19"] = "%"
    ws["F19"].font = BLACK_BOLD_FONT

    ws["C20"] = "Test successful coverage"
    ws["C20"].font = BLACK_BOLD_FONT
    ws["E20"] = "=D17*100/(H17-G17)"
    ws["E20"].font = Font(name="Tahoma", size=10, bold=True, color="22543D")
    ws["E20"].alignment = Alignment(horizontal="right", vertical="center")
    ws["F20"] = "%"
    ws["F20"].font = BLACK_BOLD_FONT

    # Đánh giá chất lượng tổng thể
    ws["C22"] = "ĐÁNH GIÁ CHẤT LƯỢNG TÍCH HỢP HỆ THỐNG:"
    ws["C22"].font = BLACK_BOLD_FONT
    ws["C23"] = "✓ 10/10 Integration Test Cases (Sandwich Strategy) đạt kết quả Pass 100%, không còn lỗi tồn đọng."
    ws["C23"].font = Font(name="Tahoma", size=9.5, color="22543D", bold=True)
    ws["C24"] = "✓ Toàn bộ 5 lỗi tích hợp (Bug Log BUG-IT-001 -> 005) đã được khắc phục triệt để và kiểm thử hồi quy thành công."
    ws["C24"].font = Font(name="Tahoma", size=9.5, color="1A365D")
    ws["C25"] = "✓ Bộ kiểm thử tự động hóa Vitest integrationFlows.test.js thực thi đạt 100% trong 13ms."
    ws["C25"].font = Font(name="Tahoma", size=9.5, color="1A365D")

    ws.column_dimensions["B"].width = 6
    ws.column_dimensions["C"].width = 25
    ws.column_dimensions["D"].width = 12
    ws.column_dimensions["E"].width = 12
    ws.column_dimensions["F"].width = 12
    ws.column_dimensions["G"].width = 12
    ws.column_dimensions["H"].width = 22

def create_bug_log_sheet(wb):
    """Tạo Sheet Bug Log quản lý 5 lỗi Integration Bug theo đúng chuẩn 8 nội dung của bộ môn"""
    sheet_name = "Bug Log"
    if sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
    else:
        ws = wb.create_sheet(title=sheet_name)

    # Xóa nội dung cũ nếu có
    for r in range(1, max(ws.max_row + 1, 20)):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if not isinstance(cell, openpyxl.cell.cell.MergedCell):
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    ws["B2"] = "DANH SÁCH LỖI TÍCH HỢP PHÁT HIỆN TRONG INTEGRATION TEST (BUG LOG)"
    ws["B2"].font = HEADER_TITLE_FONT

    headers = [
        ("B", "Bug ID"),
        ("C", "Tiêu đề lỗi (Bug Title)"),
        ("D", "Mức ưu tiên (Severity / Priority)"),
        ("E", "Phân hệ tích hợp phát sinh"),
        ("F", "Tester phát hiện"),
        ("G", "Ngày phát hiện"),
        ("H", "Mã ITC liên quan"),
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
            "BUG-IT-001",
            "Số dư ví bị lỗi số thực dạng thập phân (Floating-point precision) khi thực hiện nạp tiền và gia hạn nhiều lần",
            "Medium",
            "WalletPage ↔ AppContext",
            "Lê Minh Quân",
            "19/09/2026",
            "ITC-04",
            "Đã sửa (Fixed)",
            "Áp dụng chuẩn hóa Math.round(balance) và xử lý chuỗi số nguyên VND trước khi lưu vào LocalStorage và cập nhật AppContext."
        ),
        (
            "BUG-IT-002",
            "Gia hạn giờ thuê bị đè mốc Date.now() làm mất thời gian chơi còn lại của khách hàng thay vì cộng dồn nối tiếp",
            "High",
            "ExtendRentalModal ↔ CountdownTimer",
            "Lê Hải Đăng",
            "18/09/2026",
            "ITC-04",
            "Đã sửa (Fixed)",
            "Sửa lại thuật toán cộng dồn: newEndTime = Math.max(rental.endTime, Date.now()) + (hours * 3600000), đảm bảo giữ nguyên thời gian cũ còn thừa."
        ),
        (
            "BUG-IT-003",
            "Admin phê duyệt khiếu nại sự cố không cộng lại tiền vào ví tài khoản khách hàng do thiếu hàm dispatch",
            "Critical",
            "DisputeModal ↔ OverviewDashboard",
            "Lê Xuân Đạt",
            "19/09/2026",
            "ITC-05",
            "Đã sửa (Fixed)",
            "Bổ sung hàm updateWalletBalance(dispute.userId, dispute.amount) trong AppContext khi Admin bấm duyệt khiếu nại, đồng thời ghi log hoàn tiền."
        ),
        (
            "BUG-IT-004",
            "Trả nick sớm không cập nhật trạng thái tài khoản sang 'need_change_pass' dẫn đến nguy cơ khách khác thuê phải pass cũ",
            "High",
            "ReturnEarlyModal ↔ Inventory",
            "Lê Thanh Tùng",
            "20/09/2026",
            "ITC-06",
            "Đã sửa (Fixed)",
            "Cập nhật hàm returnEarly() tự động chuyển đổi status tài khoản thành 'need_change_pass' ngay khi xác nhận trả sớm, ngăn chặn việc hiển thị trên Cửa hàng."
        ),
        (
            "BUG-IT-005",
            "Mật khẩu ngẫu nhiên tự động sinh bởi hệ thống có thể trùng với mật khẩu cũ nếu không kiểm tra điều kiện trùng lặp",
            "Medium",
            "AutoResetEngine ↔ Crypto",
            "Lê Hải Đăng",
            "20/09/2026",
            "ITC-07",
            "Đã sửa (Fixed)",
            "Thêm vòng lặp do-while đảm bảo newPassword !== oldPassword và áp dụng bảng ký tự đa dạng (hoa, thường, số, ký tự đặc biệt) độ dài 12 ký tự."
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

def main():
    print(f"=== Đang tải file Excel: {EXCEL_PATH} ===")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=False)

    print("Các sheet hiện tại:", wb.sheetnames)

    # 1. Cập nhật Cover
    if "Cover" in wb.sheetnames:
        print("[1/5] Đang cập nhật Sheet 'Cover'...")
        update_cover_sheet(wb["Cover"])

    # 2. Cập nhật Sheet Chiến lược tích hợp (đổi tên từ Requrirement)
    strategy_sheet_name = "Chiến lược tích hợp"
    if "Requrirement" in wb.sheetnames:
        ws_strat = wb["Requrirement"]
        ws_strat.title = strategy_sheet_name
    elif strategy_sheet_name in wb.sheetnames:
        ws_strat = wb[strategy_sheet_name]
    else:
        ws_strat = wb.create_sheet(title=strategy_sheet_name)

    print("[2/5] Đang cập nhật Sheet 'Chiến lược tích hợp' (Sandwich Strategy)...")
    update_strategy_sheet(ws_strat)

    # 3. Cập nhật Test case List
    if "Test case List" in wb.sheetnames:
        print("[3/5] Đang cập nhật Sheet 'Test case List'...")
        update_test_case_list_sheet(wb["Test case List"])

    # 4. Gỡ bỏ sheet Login cũ không liên quan
    if "Login" in wb.sheetnames:
        print("[-] Đang gỡ bỏ Sheet mẫu cũ không liên quan: 'Login'...")
        wb.remove(wb["Login"])

    # 5. Tạo 6 sheet module IT
    print("[4/5] Đang tạo và định dạng 6 Sheet module Integration Test Cases (ITC-01 -> 10)...")
    for sname, sdata in ITC_MODULES_DATA.items():
        print(f"  -> Tạo/Cập nhật Sheet: {sname} ({len(sdata['cases'])} ITCs)")
        create_module_test_sheet(wb, sname, sdata)

    # 6. Cập nhật Test Report
    if "Test Report" in wb.sheetnames:
        print("[5/5] Đang cập nhật Sheet 'Test Report'...")
        update_test_report_sheet(wb["Test Report"])

    # 7. Tạo thêm Sheet Bug Log
    print("[+] Đang tạo thêm Sheet 'Bug Log' ghi nhận 5 Integration Bugs...")
    create_bug_log_sheet(wb)

    # Sắp xếp lại thứ tự sheet trực quan nhất
    desired_order = [
        "Cover",
        "Chiến lược tích hợp",
        "Test case List",
        "IT_AUTH_SYNC",
        "IT_WALLET_FLOW",
        "IT_RENT_DELIVER",
        "IT_TIMER_EXT",
        "IT_REFUND_DISPUTE",
        "IT_FAV_SEP",
        "Test Report",
        "Bug Log"
    ]
    wb._sheets = [wb[s] for s in desired_order if s in wb.sheetnames]

    # Lưu file
    wb.save(EXCEL_PATH)
    print(f"\n[HOÀN TẤT THÀNH CÔNG] File Excel IT_Test Case.xlsx đã được lưu tại:\n{EXCEL_PATH}")
    print(f"Tổng số sheet: {len(wb.sheetnames)}")
    print("Danh sách sheet:", wb.sheetnames)

if __name__ == "__main__":
    main()
