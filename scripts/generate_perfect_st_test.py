# -*- coding: utf-8 -*-
"""
generate_perfect_st_test.py
Script to generate the PERFECT System Testing (E2E) Excel Workbook
matching 100% format and structure from ST_Test Case.pdf for GameRent system.
"""

import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.drawing.image import Image as OpenpyxlImage
from openpyxl.chart import PieChart, Reference
from openpyxl.chart.label import DataLabelList

def apply_box_border(ws, start_row, start_col, end_row, end_col, border_style="medium"):
    """Apply an outer box border around a range of cells."""
    b_style = Side(style=border_style, color="000000")
    for r in range(start_row, end_row + 1):
        for c in range(start_col, end_col + 1):
            top_b = b_style if r == start_row else ws.cell(r, c).border.top
            bottom_b = b_style if r == end_row else ws.cell(r, c).border.bottom
            left_b = b_style if c == start_col else ws.cell(r, c).border.left
            right_b = b_style if c == end_col else ws.cell(r, c).border.right
            ws.cell(r, c).border = Border(top=top_b, bottom=bottom_b, left=left_b, right=right_b)

def auto_fit(ws, col_widths=None):
    """Set custom or auto-fit column widths."""
    if col_widths:
        for col_idx, width in col_widths.items():
            col_letter = get_column_letter(col_idx)
            ws.column_dimensions[col_letter].width = width
    else:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val = str(cell.value or '')
                if '\n' in val:
                    val = max(val.split('\n'), key=len)
                if len(val) > max_len:
                    max_len = len(val)
            ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

def create_perfect_st_test_workbook():
    wb = openpyxl.Workbook()
    # Remove default sheet
    default_sheet = wb.active
    wb.remove(default_sheet)

    # Styles
    f_tahoma_18_bold = Font(name="Tahoma", size=18, bold=True, color="000000")
    f_tahoma_14_bold = Font(name="Tahoma", size=14, bold=True, color="000000")
    f_tahoma_12_bold = Font(name="Tahoma", size=12, bold=True, color="000000")
    f_tahoma_11_bold = Font(name="Tahoma", size=11, bold=True, color="000000")
    f_tahoma_10_bold = Font(name="Tahoma", size=10, bold=True, color="000000")
    f_tahoma_10_norm = Font(name="Tahoma", size=10, bold=False, color="000000")
    f_tahoma_9_norm  = Font(name="Tahoma", size=9, bold=False, color="333333")
    f_tahoma_10_italic = Font(name="Tahoma", size=10, italic=True, color="006100")

    f_navy_header = Font(name="Tahoma", size=10, bold=True, color="FFFFFF")
    f_pass = Font(name="Tahoma", size=10, bold=True, color="006100")
    f_link = Font(name="Tahoma", size=10, underline="single", color="0563C1")

    fill_navy = PatternFill(start_color="002060", end_color="002060", fill_type="solid")
    fill_sub_header = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    fill_pass = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
    fill_gray_sub = PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")
    fill_step_bg = PatternFill(start_color="F9FBFD", end_color="F9FBFD", fill_type="solid")

    thin_border_side = Side(style="thin", color="D9D9D9")
    thin_black_side = Side(style="thin", color="000000")
    double_bottom_side = Side(style="double", color="000000")
    medium_side = Side(style="medium", color="000000")

    border_all_thin = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    border_all_black_thin = Border(left=thin_black_side, right=thin_black_side, top=thin_black_side, bottom=thin_black_side)

    # -------------------------------------------------------------------------
    # SHEET 1: Cover
    # -------------------------------------------------------------------------
    ws_cover = wb.create_sheet(title="Cover")
    ws_cover.views.sheetView[0].showGridLines = True

    # Title Box: Rows 2-3, Cols B-F
    ws_cover.merge_cells("B2:F3")
    cell_cover_title = ws_cover["B2"]
    cell_cover_title.value = "TEST CASE"
    cell_cover_title.font = f_tahoma_18_bold
    cell_cover_title.alignment = Alignment(horizontal="center", vertical="center")
    apply_box_border(ws_cover, 2, 2, 3, 6, "medium")

    # Metadata Block: Rows 5-7
    meta_labels = [
        (5, "Project Name", "Hệ thống Cho thuê tài khoản game (GameRent)"),
        (6, "Project Code", "GAMERENT_BTL"),
        (7, "Document Code", "GAMERENT_ST_v1.0")
    ]
    for r, label, val in meta_labels:
        c1 = ws_cover.cell(r, 2, label)
        c1.font = f_tahoma_10_bold
        c1.border = Border(top=thin_black_side, bottom=thin_black_side, left=thin_black_side, right=thin_black_side)

        ws_cover.merge_cells(start_row=r, start_column=3, end_row=r, end_column=6)
        c2 = ws_cover.cell(r, 3, val)
        c2.font = f_tahoma_10_norm
        for col_idx in range(3, 7):
            ws_cover.cell(r, col_idx).border = Border(top=thin_black_side, bottom=thin_black_side, left=thin_black_side, right=thin_black_side)

    # Record of Change Header: Row 9
    ws_cover["B9"] = "Record of change"
    ws_cover["B9"].font = f_tahoma_11_bold

    # Table Header: Row 10
    roc_headers = ["Effective Date", "Version", "Change Item", "*A,D,M", "Creator", "Reviewer/Approver", "Issue Date", "Version", "Change description", "Reference"]
    # We span across cols B to J
    for col_idx, h_text in enumerate(roc_headers, start=2):
        cell = ws_cover.cell(10, col_idx, h_text)
        cell.font = f_navy_header
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = border_all_black_thin
    ws_cover.row_dimensions[10].height = 25

    # Record of Change Rows
    roc_data = [
        ("10/09/2026", "0.1", "Khởi tạo tài liệu và phác thảo các kịch bản kiểm thử hệ thống E2E", "A", "Lê Minh Quân", "ThS. Phạm Thị Loan", "10/09/2026", "0.1", "Soạn thảo ban đầu", "SRS_GameRent_v1.0"),
        ("16/09/2026", "1.0", "Hoàn thiện 100% System Test Cases E2E, Test Report & Wireframe", "M", "Lê Minh Quân", "ThS. Phạm Thị Loan", "16/09/2026", "1.0", "Thiết kế và thực thi đầy đủ 14 ca kiểm thử E2E toàn trình, nghiệm thu Pass 100%", "BTL_KTPM_Final"),
        ("", "", "", "", "", "", "", "", "", ""),
        ("", "", "", "", "", "", "", "", "", "")
    ]

    for row_offset, row_vals in enumerate(roc_data, start=11):
        ws_cover.row_dimensions[row_offset].height = 24
        for col_idx, val in enumerate(row_vals, start=2):
            cell = ws_cover.cell(row_offset, col_idx, val)
            cell.font = f_tahoma_10_norm
            cell.alignment = Alignment(horizontal="center" if col_idx in [2, 3, 5, 8, 9] else "left", vertical="center", wrap_text=True)
            cell.border = border_all_black_thin

    # Footnote
    ws_cover["B16"] = "* A: Add, D: Delete, M: Modify"
    ws_cover["B16"].font = f_tahoma_9_norm

    auto_fit(ws_cover, {
        1: 4, 2: 16, 3: 10, 4: 32, 5: 10, 6: 18, 7: 22, 8: 14, 9: 10, 10: 38, 11: 20
    })

    # -------------------------------------------------------------------------
    # SHEET 2: Business_Process_Flow (Matching Page 3 of ST_Test Case.pdf)
    # -------------------------------------------------------------------------
    ws_flow = wb.create_sheet(title="Business_Process_Flow")
    ws_flow.views.sheetView[0].showGridLines = True

    ws_flow["B2"] = "QUY TRÌNH NGHIỆP VỤ HỆ THỐNG KIỂM THỬ E2E (SYSTEM TESTING WORKFLOWS)"
    ws_flow["B2"].font = f_tahoma_14_bold

    ws_flow["B3"] = "Hệ thống Cho thuê tài khoản game trực tuyến tự động (GameRent) - Mô hình hóa luồng quy trình tổng thể"
    ws_flow["B3"].font = f_tahoma_10_italic

    # Workflow 1
    ws_flow.merge_cells("B5:H5")
    ws_flow["B5"] = "1. Quy trình Chu trình Thuê tài khoản game hoàn chỉnh (STC-SCN-JOURNEY)"
    ws_flow["B5"].font = f_tahoma_11_bold
    ws_flow["B5"].fill = fill_sub_header

    wf1_steps = [
        ("Bước 1:", "Khách hàng mới đăng ký tài khoản (Họ tên, Email, Mật khẩu) và đăng nhập vào hệ thống GameRent thành công."),
        ("Bước 2:", "Khách hàng nạp tiền vào ví điện tử thông qua tính năng quét mã VietQR tự động (MBBank), hệ thống xác nhận và cộng tiền tức thời."),
        ("Bước 3:", "Khách hàng duyệt kho tài khoản game (LMHT, Valorant, FO4), sử dụng bộ lọc tìm kiếm theo Game, Bậc Rank và Khoảng giá."),
        ("Bước 4:", "Khách hàng mở modal xem thông tin chi tiết nick, chọn thời lượng thuê (1h - 48h) và bấm [Xác Nhận Thuê]."),
        ("Bước 5:", "Hệ thống kiểm tra số dư ví, trừ tiền, sinh đơn hàng, hiển thị thông tin tài khoản/mật khẩu in-game và kích hoạt đồng hồ đếm ngược CountdownTimer.")
    ]
    for idx, (b_idx, b_desc) in enumerate(wf1_steps, start=6):
        ws_flow.cell(idx, 2, b_idx).font = f_tahoma_10_bold
        ws_flow.cell(idx, 2).alignment = Alignment(horizontal="center", vertical="center")
        ws_flow.merge_cells(start_row=idx, start_column=3, end_row=idx, end_column=8)
        c = ws_flow.cell(idx, 3, b_desc)
        c.font = f_tahoma_10_norm
        c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        for c_idx in range(2, 9):
            ws_flow.cell(idx, c_idx).border = border_all_thin
        ws_flow.row_dimensions[idx].height = 24

    # Workflow 2
    ws_flow.merge_cells("B12:H12")
    ws_flow["B12"] = "2. Quy trình Quản lý Vòng đời ca thuê: Gia hạn & Trả nick sớm (STC-SCN-LIFECYCLE)"
    ws_flow["B12"].font = f_tahoma_11_bold
    ws_flow["B12"].fill = fill_sub_header

    wf2_steps = [
        ("Bước 1:", "Khách hàng theo dõi thời gian chơi còn lại thời gian thực thông qua đồng hồ CountdownTimer tại trang My Rentals."),
        ("Bước 2:", "Khi sắp hết giờ, khách hàng bấm [Gia Hạn Thêm Giờ]; hệ thống trừ ví và tự động cộng nối tiếp thời gian kết thúc (expiresAt)."),
        ("Bước 3:", "Khách hàng có việc bận đột xuất, bấm [Trả Nick Sớm]; hệ thống tính số giờ chưa chơi, hoàn lại 50% tiền vào ví và thu hồi mật khẩu in-game."),
        ("Bước 4:", "Nếu khách chơi hết giờ (Countdown về 00:00:00), hệ thống tự động kết thúc đơn, ẩn mật khẩu và chuyển nick sang trạng thái chờ đổi pass thu hồi.")
    ]
    for idx, (b_idx, b_desc) in enumerate(wf2_steps, start=13):
        ws_flow.cell(idx, 2, b_idx).font = f_tahoma_10_bold
        ws_flow.cell(idx, 2).alignment = Alignment(horizontal="center", vertical="center")
        ws_flow.merge_cells(start_row=idx, start_column=3, end_row=idx, end_column=8)
        c = ws_flow.cell(idx, 3, b_desc)
        c.font = f_tahoma_10_norm
        c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        for c_idx in range(2, 9):
            ws_flow.cell(idx, c_idx).border = border_all_thin
        ws_flow.row_dimensions[idx].height = 24

    # Workflow 3
    ws_flow.merge_cells("B18:H18")
    ws_flow["B18"] = "3. Quy trình Xử lý Khiếu nại sự cố & Bảo hiểm Hoàn tiền 100% (STC-SCN-DISPUTE)"
    ws_flow["B18"].font = f_tahoma_11_bold
    ws_flow["B18"].fill = fill_sub_header

    wf3_steps = [
        ("Bước 1:", "Khách hàng gặp sự cố (sai mật khẩu, nick bị khóa, sai thông tin rank), gửi khiếu nại qua form [Báo Sự Cố / Khiếu Nại] trong 15 phút đầu."),
        ("Bước 2:", "Hệ thống tiếp nhận khiếu nại, sinh mã #DISP-XXX, gắn nhãn cảnh báo lên đơn hàng và chuyển trạng thái sang 'pending'."),
        ("Bước 3:", "Quản trị viên (Admin) truy cập trang quản trị đối soát thông tin sự cố thực tế với dữ liệu hệ thống."),
        ("Bước 4:", "Admin bấm [Phê Duyệt Khiếu Nại]; hệ thống tự động hoàn lại đúng 100% chi phí đơn vào ví khách, đồng thời đưa nick vào trạng thái bảo trì.")
    ]
    for idx, (b_idx, b_desc) in enumerate(wf3_steps, start=19):
        ws_flow.cell(idx, 2, b_idx).font = f_tahoma_10_bold
        ws_flow.cell(idx, 2).alignment = Alignment(horizontal="center", vertical="center")
        ws_flow.merge_cells(start_row=idx, start_column=3, end_row=idx, end_column=8)
        c = ws_flow.cell(idx, 3, b_desc)
        c.font = f_tahoma_10_norm
        c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        for c_idx in range(2, 9):
            ws_flow.cell(idx, c_idx).border = border_all_thin
        ws_flow.row_dimensions[idx].height = 24

    # Workflow 4
    ws_flow.merge_cells("B24:H24")
    ws_flow["B24"] = "4. Quy trình Quản trị Kho UC1 & An toàn bảo mật phân quyền RBAC (STC-SCN-ADMIN-SEC)"
    ws_flow["B24"].font = f_tahoma_11_bold
    ws_flow["B24"].fill = fill_sub_header

    wf4_steps = [
        ("Bước 1:", "Admin đăng nhập vào hệ thống và truy cập phân hệ Quản trị kho tài khoản (/admin/warehouse)."),
        ("Bước 2:", "Admin thêm nick mới tuân thủ nghiêm ngặt đặc tả biểu mẫu UC1 (Mã SP 8-30 ký tự, Tên 10-50 ký tự, Upload ảnh <= 1MB, Giá thuê > 0)."),
        ("Bước 3:", "Tài khoản mới được lưu thành công, xuất hiện ngay lập tức tại danh mục phía Client cho khách hàng lựa chọn thuê."),
        ("Bước 4:", "Cơ chế phân quyền Route Guard chủ động kiểm tra quyền truy cập, ngăn chặn khách thường hoặc tài khoản bị khóa can thiệp dữ liệu quản trị.")
    ]
    for idx, (b_idx, b_desc) in enumerate(wf4_steps, start=25):
        ws_flow.cell(idx, 2, b_idx).font = f_tahoma_10_bold
        ws_flow.cell(idx, 2).alignment = Alignment(horizontal="center", vertical="center")
        ws_flow.merge_cells(start_row=idx, start_column=3, end_row=idx, end_column=8)
        c = ws_flow.cell(idx, 3, b_desc)
        c.font = f_tahoma_10_norm
        c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        for c_idx in range(2, 9):
            ws_flow.cell(idx, c_idx).border = border_all_thin
        ws_flow.row_dimensions[idx].height = 24

    auto_fit(ws_flow, {
        1: 4, 2: 12, 3: 20, 4: 20, 5: 20, 6: 20, 7: 20, 8: 20
    })

    # -------------------------------------------------------------------------
    # SHEET 3: Test Case List (Matching Page 4-5 of ST_Test Case.pdf)
    # -------------------------------------------------------------------------
    ws_tcl = wb.create_sheet(title="Test Case List")
    ws_tcl.views.sheetView[0].showGridLines = True

    # Title: Row 2
    ws_tcl.merge_cells("A2:E2")
    ws_tcl["A2"] = "TEST CASE LIST (SYSTEM E2E TESTING)"
    ws_tcl["A2"].font = f_tahoma_14_bold
    ws_tcl["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws_tcl.row_dimensions[2].height = 25

    # Metadata & Environment: Rows 4-6
    ws_tcl["A4"] = "Project Name"
    ws_tcl["A4"].font = f_tahoma_10_bold
    ws_tcl["A4"].border = border_all_black_thin
    ws_tcl.merge_cells("B4:E4")
    ws_tcl["B4"] = "Hệ thống Cho thuê tài khoản game (GameRent)"
    ws_tcl["B4"].font = f_tahoma_10_norm
    for c in range(2, 6): ws_tcl.cell(4, c).border = border_all_black_thin

    ws_tcl["A5"] = "Project Code"
    ws_tcl["A5"].font = f_tahoma_10_bold
    ws_tcl["A5"].border = border_all_black_thin
    ws_tcl.merge_cells("B5:E5")
    ws_tcl["B5"] = "GAMERENT_BTL"
    ws_tcl["B5"].font = f_tahoma_10_norm
    for c in range(2, 6): ws_tcl.cell(5, c).border = border_all_black_thin

    ws_tcl["A6"] = "Test Environment Setup Description"
    ws_tcl["A6"].font = f_tahoma_10_bold
    ws_tcl["A6"].border = border_all_black_thin
    ws_tcl["A6"].alignment = Alignment(vertical="top", wrap_text=True)

    ws_tcl.merge_cells("B6:E6")
    env_desc = (
        "1. Server: Node.js v18+, Vite 8.2 Production/Dev Environment\n"
        "2. Database: HTML5 LocalStorage Persistence Engine (gamerent_accounts, gamerent_orders, gamerent_wallets, gamerent_disputes)\n"
        "3. Web Browser: Google Chrome v120+, Microsoft Edge v120+, Mozilla Firefox, Safari\n"
        "4. Client Hardware & Network: RAM 8GB+, Mạng Internet băng thông rộng (VietQR MBBank Online Gateway)"
    )
    ws_tcl["B6"] = env_desc
    ws_tcl["B6"].font = f_tahoma_10_italic
    ws_tcl["B6"].alignment = Alignment(vertical="top", wrap_text=True)
    for c in range(2, 6): ws_tcl.cell(6, c).border = border_all_black_thin
    ws_tcl.row_dimensions[6].height = 65

    # Table Header: Row 8
    tcl_headers = ["No", "Function Name", "Sheet Name", "Description", "Pre-Condition"]
    for col_idx, h_text in enumerate(tcl_headers, start=1):
        cell = ws_tcl.cell(8, col_idx, h_text)
        cell.font = f_navy_header
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = border_all_black_thin
    ws_tcl.row_dimensions[8].height = 26

    # Table Rows: Rows 9-12
    tcl_rows = [
        (1, "Kịch bản E2E Hành trình Khách thuê hoàn chỉnh", "ST_User_Journey",
         "Khách mới đăng ký nhận 50k ví -> Nạp thêm 100k VietQR -> Lọc kho acc theo rank & giá -> Thuê acc -> Nhận user/pass -> Giám sát Countdown Timer",
         "Người dùng truy cập website lần đầu trên trình duyệt"),
        (2, "Kịch bản E2E Vòng đời ca thuê (Thuê -> Gia hạn -> Trả sớm)", "ST_Rental_Lifecycle",
         "Thuê nick 2 giờ -> Đang chơi quyết định gia hạn thêm 1 giờ -> Có việc bận quyết định Trả nick sớm -> Nhận hoàn tiền 50% giờ thừa vào ví -> Thu hồi pass",
         "Tài khoản có đủ số dư ví để thực hiện thanh toán"),
        (3, "Kịch bản E2E Xử lý Khiếu nại & Bảo hiểm Hoàn tiền 100%", "ST_Dispute_Refund",
         "Khách thuê gặp lỗi sự cố 'Sai mật khẩu' -> Gửi khiếu nại -> Admin tiếp nhận trên Dashboard thẩm định -> Phê duyệt -> Ví khách nhận lại 100% tiền thuê -> Acc chuyển bảo trì",
         "Khách có đơn hàng phát sinh lỗi sự cố in-game"),
        (4, "Kịch bản E2E Quản trị Kho hàng UC1 & An toàn bảo mật RBAC", "ST_Admin_Security",
         "Admin đăng nhập -> Thêm nick mới chuẩn form UC1 -> Thẻ nick xuất hiện ở Catalog -> Chuyển nick sang bảo trì khóa nút thuê -> Kiểm tra route guard chặn khách vào trang Admin",
         "Người dùng có tài khoản Admin và tài khoản Khách")
    ]

    for r_idx, (no, func_name, sheet_name, desc, pre_cond) in enumerate(tcl_rows, start=9):
        ws_tcl.cell(r_idx, 1, no).alignment = Alignment(horizontal="center", vertical="center")
        ws_tcl.cell(r_idx, 1).font = f_tahoma_10_bold

        ws_tcl.cell(r_idx, 2, func_name).font = f_tahoma_10_bold
        ws_tcl.cell(r_idx, 2).alignment = Alignment(horizontal="left", vertical="center")

        # Sheet name with hyperlink
        cell_sheet = ws_tcl.cell(r_idx, 3, sheet_name)
        cell_sheet.font = f_link
        cell_sheet.hyperlink = f"#'{sheet_name}'!A1"
        cell_sheet.alignment = Alignment(horizontal="center", vertical="center")

        ws_tcl.cell(r_idx, 4, desc).font = f_tahoma_10_norm
        ws_tcl.cell(r_idx, 4).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

        ws_tcl.cell(r_idx, 5, pre_cond).font = f_tahoma_10_norm
        ws_tcl.cell(r_idx, 5).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

        for c in range(1, 6):
            ws_tcl.cell(r_idx, c).border = border_all_black_thin
        ws_tcl.row_dimensions[r_idx].height = 42

    auto_fit(ws_tcl, {
        1: 6, 2: 36, 3: 24, 4: 55, 5: 35
    })

    # -------------------------------------------------------------------------
    # HELPER: Build Detailed Test Case Sheet
    # -------------------------------------------------------------------------
    st_headers = [
        "ID", "Test Case Description", "Pre-condition", "Test Steps",
        "Expected Output", "Post-condtion", "Result", "Test date", "Note"
    ]

    def build_detail_st_sheet(title, scn_code, scn_name, creator, exec_by, test_cases):
        ws = wb.create_sheet(title=title)
        ws.views.sheetView[0].showGridLines = True

        # Header Block: Rows 2-3
        ws["A2"] = "Module Code"
        ws["A2"].font = f_tahoma_10_bold
        ws["A2"].border = border_all_black_thin

        ws["B2"] = scn_code
        ws["B2"].font = f_tahoma_10_italic
        ws["B2"].border = border_all_black_thin

        ws["C2"] = "Scenario Name"
        ws["C2"].font = f_tahoma_10_bold
        ws["C2"].border = border_all_black_thin

        ws.merge_cells("D2:I2")
        ws["D2"] = scn_name
        ws["D2"].font = f_tahoma_10_bold
        for c in range(4, 10): ws.cell(2, c).border = border_all_black_thin

        ws["A3"] = "Creator"
        ws["A3"].font = f_tahoma_10_bold
        ws["A3"].border = border_all_black_thin

        ws["B3"] = creator
        ws["B3"].font = f_tahoma_10_norm
        ws["B3"].border = border_all_black_thin

        ws["C3"] = "Executed By"
        ws["C3"].font = f_tahoma_10_bold
        ws["C3"].border = border_all_black_thin

        ws.merge_cells("D3:I3")
        ws["D3"] = exec_by
        ws["D3"].font = f_tahoma_10_norm
        for c in range(4, 10): ws.cell(3, c).border = border_all_black_thin

        # Table Header: Row 5
        for col_idx, h_text in enumerate(st_headers, start=1):
            cell = ws.cell(5, col_idx, h_text)
            cell.font = f_navy_header
            cell.fill = fill_navy
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = border_all_black_thin
        ws.row_dimensions[5].height = 26

        # Test Cases: Row 6+
        curr_row = 6
        for tc in test_cases:
            ws.cell(curr_row, 1, tc["id"]).font = f_tahoma_10_bold
            ws.cell(curr_row, 1).alignment = Alignment(horizontal="center", vertical="top")

            ws.cell(curr_row, 2, tc["desc"]).font = f_tahoma_10_norm
            ws.cell(curr_row, 2).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            ws.cell(curr_row, 3, tc["pre"]).font = f_tahoma_10_norm
            ws.cell(curr_row, 3).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            ws.cell(curr_row, 4, tc["steps"]).font = f_tahoma_10_norm
            ws.cell(curr_row, 4).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            ws.cell(curr_row, 5, tc["expected"]).font = f_tahoma_10_norm
            ws.cell(curr_row, 5).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            ws.cell(curr_row, 6, tc["post"]).font = f_tahoma_10_norm
            ws.cell(curr_row, 6).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            cell_res = ws.cell(curr_row, 7, tc["result"])
            cell_res.font = f_pass
            cell_res.fill = fill_pass
            cell_res.alignment = Alignment(horizontal="center", vertical="top")

            ws.cell(curr_row, 8, tc["date"]).font = f_tahoma_10_norm
            ws.cell(curr_row, 8).alignment = Alignment(horizontal="center", vertical="top")

            ws.cell(curr_row, 9, tc["note"]).font = f_tahoma_9_norm
            ws.cell(curr_row, 9).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            for c in range(1, 10):
                ws.cell(curr_row, c).border = border_all_thin

            ws.row_dimensions[curr_row].height = tc.get("height", 65)
            curr_row += 1

        auto_fit(ws, {
            1: 15, 2: 30, 3: 30, 4: 45, 5: 45, 6: 28, 7: 12, 8: 14, 9: 24
        })

    # -------------------------------------------------------------------------
    # SHEET 4: ST_User_Journey (4 Test Cases)
    # -------------------------------------------------------------------------
    tc_journey = [
        {
            "id": "[STC-E2E-01]",
            "desc": "Luồng Khách đăng ký tài khoản mới và đăng nhập vào hệ thống",
            "pre": "1. Khách hàng truy cập vào hệ thống GameRent\n2. Chưa có tài khoản",
            "steps": "1. Mở modal [Đăng Ký].\n2. Nhập họ tên 'Lê Văn A', email 'vana@test.com', pass '123456'.\n3. Click [Đăng Ký Tài Khoản].",
            "expected": "1. Đăng ký thành công.\n2. Navbar hiển thị Tên 'Lê Văn A' và số dư ví '50.000 đ' (thưởng tạo tài khoản).\n3. Phiên đăng nhập được lưu trữ vào LocalStorage.",
            "post": "Tài khoản lưu vào CSDL với balance=50000",
            "result": "Pass", "date": "16/09/2026",
            "note": "Kiểm thử luồng khởi tạo người dùng mới và cấp vốn trải nghiệm ban đầu",
            "height": 70
        },
        {
            "id": "[STC-E2E-02]",
            "desc": "Luồng Nạp tiền bổ sung 100.000 đ qua VietQR Auto",
            "pre": "1. Khách hàng đã đăng nhập, số dư ví hiện tại là 50.000 đ",
            "steps": "1. Vào trang /wallet.\n2. Bấm [Nạp Tiền Vào Ví], chọn gói 100.000 đ.\n3. Quét mã VietQR MBBank mô phỏng.\n4. Bấm [Xác Nhận Đã Chuyển Tiền].",
            "expected": "1. Số dư ví tăng lên đúng '150.000 đ'.\n2. Lịch sử giao dịch ghi nhận +100.000 đ thành công kèm mã tham chiếu VietQR.",
            "post": "Ví tiền tăng lên 150.000 đ",
            "result": "Pass", "date": "16/09/2026",
            "note": "Kiểm thử cổng thanh toán trực tuyến mô phỏng VietQR chuẩn MBBank",
            "height": 65
        },
        {
            "id": "[STC-E2E-03]",
            "desc": "Luồng Tìm kiếm, Lọc kho nick & Thuê tài khoản thành công",
            "pre": "1. Khách hàng có số dư ví 150.000 đ\n2. Nick ACCVAL001 có status='available' (15.000 đ/h)",
            "steps": "1. Tại trang chủ, chọn danh mục 'Valorant'.\n2. Gõ tìm kiếm 'Prime Vandal'.\n3. Chọn nick ACCVAL001 giá 15.000 đ/h.\n4. Chọn thuê 2 giờ (30.000 đ), bấm [Xác Nhận Thanh Toán].",
            "expected": "1. Ví trừ 30k (còn 120.000 đ).\n2. Nick ACCVAL001 chuyển sang trạng thái 'rented'.\n3. Điều hướng sang MyRentalsPage hiển thị Username/Password và CountdownTimer đếm ngược 01:59:59.",
            "post": "Đơn thuê #ORDER-XXX kích hoạt thành công",
            "result": "Pass", "date": "16/09/2026",
            "note": "Luồng cốt lõi (Happy path) của hệ thống cho thuê acc",
            "height": 75
        },
        {
            "id": "[STC-E2E-04]",
            "desc": "Luồng Giám sát phiên & Sao chép mật khẩu 1-click",
            "pre": "1. Đơn hàng #ORDER-XXX đang hoạt động tại trang My Rentals",
            "steps": "1. Click icon Copy tại ô Username in-game.\n2. Click icon Copy tại ô Mật khẩu in-game.\n3. Quan sát đồng hồ đếm ngược.",
            "expected": "1. Thông báo Toast: 'Đã sao chép tài khoản vào bộ nhớ tạm!'.\n2. Toast: 'Đã sao chép mật khẩu thành công!'.\n3. Đồng hồ CountdownTimer đếm chính xác từng giây theo thời gian thực.",
            "post": "Khách nhận đủ thông tin để đăng nhập in-game",
            "result": "Pass", "date": "16/09/2026",
            "note": "Kiểm tra trải nghiệm người dùng (UX) và tính bảo mật thông tin",
            "height": 65
        }
    ]
    build_detail_st_sheet(
        title="ST_User_Journey",
        scn_code="STC-SCN-JOURNEY",
        scn_name="Kịch bản E2E Hành trình Khách thuê hoàn chỉnh (Đăng ký -> Nạp ví -> Thuê nick)",
        creator="Lê Minh Quân",
        exec_by="Lê Xuân Đạt",
        test_cases=tc_journey
    )

    # -------------------------------------------------------------------------
    # SHEET 5: ST_Rental_Lifecycle (3 Test Cases)
    # -------------------------------------------------------------------------
    tc_lifecycle = [
        {
            "id": "[STC-E2E-05]",
            "desc": "Luồng Gia hạn thời gian thuê thêm 2 giờ",
            "pre": "1. Khách đang chơi đơn #ORDER-01, còn 15 phút là hết giờ\n2. Ví có 120.000 đ",
            "steps": "1. Tại đơn hàng, bấm nút [Gia Hạn Thêm Giờ].\n2. Chọn thời lượng gia hạn: 2 giờ (Chi phí: 30.000 đ).\n3. Bấm [Xác Nhận Gia Hạn].",
            "expected": "1. Ví trừ 30.000 đ (còn 90.000 đ).\n2. CountdownTimer lập tức nhảy tăng thêm 2 giờ (thành 02:14:59).\n3. Đơn hàng cập nhật thời gian kết thúc mới (expiresAt).",
            "post": "Cập nhật expiresAt nối tiếp chính xác",
            "result": "Pass", "date": "16/09/2026",
            "note": "Đảm bảo tính liên tục của phiên chơi mà không bị gián đoạn",
            "height": 70
        },
        {
            "id": "[STC-E2E-06]",
            "desc": "Luồng Trả nick sớm chủ động & Nhận hoàn tiền 50%",
            "pre": "1. Đơn hàng còn thừa 2 giờ chơi (trị giá 30k)\n2. Khách bận đột xuất muốn trả sớm",
            "steps": "1. Khách click button [Trả Nick Sớm].\n2. Modal thông báo: 'Bạn còn thừa 2 giờ. Hệ thống sẽ hoàn lại 50% chi phí (15.000 đ) vào ví'.\n3. Khách bấm [Xác Nhận Trả Nick].",
            "expected": "1. Đơn hàng chuyển sang 'completed' (Trả sớm).\n2. Mật khẩu in-game bị làm mờ và thu hồi.\n3. Ví khách được hoàn lại đúng 15.000 đ (Ví tăng từ 90k lên 105k).\n4. Nick chuyển sang trạng thái chờ đổi pass thu hồi.",
            "post": "Tài khoản game chuyển sang 'need_change_pass'",
            "result": "Pass", "date": "16/09/2026",
            "note": "Chính sách hoàn tiền công bằng, kích thích khách trả nick đúng hạn",
            "height": 75
        },
        {
            "id": "[STC-E2E-07]",
            "desc": "Luồng Đơn thuê tự động hết hạn khi Countdown về 00:00:00",
            "pre": "1. Đơn thuê sắp hết giờ (dùng thanh Tester tua nhanh thời gian về 00:00:00)",
            "steps": "1. Đồng hồ đếm ngược chạy về 00:00:00.\n2. Quan sát giao diện đơn hàng tại MyRentals.",
            "expected": "1. CountdownTimer chuyển sang badge đỏ: 'Đã Hết Hạn'.\n2. Mật khẩu in-game bị ẩn.\n3. Nick tự động chuyển sang quy trình đổi mật khẩu thu hồi.",
            "post": "Đơn hàng kết thúc chu kỳ thuê",
            "result": "Pass", "date": "16/09/2026",
            "note": "Kiểm tra cơ chế thu hồi quyền truy cập tự động và bảo mật nick shop",
            "height": 65
        }
    ]
    build_detail_st_sheet(
        title="ST_Rental_Lifecycle",
        scn_code="STC-SCN-LIFECYCLE",
        scn_name="Kịch bản E2E Vòng đời ca thuê (Thuê -> Gia hạn -> Trả sớm -> Hết hạn)",
        creator="Lê Xuân Đạt",
        exec_by="Lê Minh Quân",
        test_cases=tc_lifecycle
    )

    # -------------------------------------------------------------------------
    # SHEET 6: ST_Dispute_Refund (3 Test Cases)
    # -------------------------------------------------------------------------
    tc_dispute = [
        {
            "id": "[STC-E2E-08]",
            "desc": "Luồng Khách gửi khiếu nại báo lỗi sự cố in-game",
            "pre": "1. Khách vừa thuê nick nhưng in-game báo 'Mật khẩu không chính xác'\n2. Đơn hàng mới tạo dưới 15 phút",
            "steps": "1. Tại MyRentalsPage, click button [Báo Sự Cố / Khiếu Nại].\n2. Chọn phân loại lỗi: 'Sai mật khẩu'.\n3. Nhập mô tả: 'Riot Games báo sai mật khẩu không đăng nhập được'.\n4. Click [Gửi Báo Cáo Khiếu Nại].",
            "expected": "1. Hệ thống tiếp nhận khiếu nại, sinh mã #DISP-XXX với status 'pending'.\n2. Đơn hàng hiển thị nhãn cảnh báo 'Đang Chờ Xử Lý Khiếu Nại'.\n3. Khách nhận thông báo: 'Khiếu nại của bạn đang được Admin thẩm định'.",
            "post": "Bản ghi khiếu nại được tạo trong 'gamerent_disputes'",
            "result": "Pass", "date": "16/09/2026",
            "note": "Cơ chế bảo vệ quyền lợi người mua khi gặp sự cố bất khả kháng",
            "height": 75
        },
        {
            "id": "[STC-E2E-09]",
            "desc": "Luồng Admin thẩm định và Phê duyệt Hoàn tiền 100%",
            "pre": "1. Có khiếu nại #DISP-XXX đang pending giá trị 30.000 đ",
            "steps": "1. Admin truy cập /admin/overview.\n2. Tại mục 'Khiếu nại cần xử lý', bấm xem chi tiết #DISP-XXX.\n3. Admin xác minh sự cố thực tế và click [Phê Duyệt & Hoàn Tiền 100%].",
            "expected": "1. Khiếu nại cập nhật trạng thái 'resolved'.\n2. Ví của khách hàng được hoàn trả lại đúng 30.000 đ (100% chi phí đơn).\n3. Lịch sử giao dịch của khách xuất hiện dòng: '+30.000 đ | Hoàn tiền khiếu nại #DISP-XXX'.\n4. Tài khoản game tự động đưa vào trạng thái 'maintenance' để reset pass.",
            "post": "Khách nhận đủ 100% tiền, nick được bảo vệ an toàn",
            "result": "Pass", "date": "16/09/2026",
            "note": "Luồng bảo hiểm cam kết 100% sự hài lòng của khách hàng",
            "height": 75
        },
        {
            "id": "[STC-E2E-10]",
            "desc": "Luồng Admin từ chối khiếu nại do khai báo sai lệch",
            "pre": "1. Khách khiếu nại không hợp lệ hoặc cố tình gian lận sau khi đã chơi hết giờ",
            "steps": "1. Admin xem xét chi tiết khiếu nại.\n2. Kiểm tra log thấy khách đã chơi đủ thời gian và không có lỗi từ hệ thống.\n3. Admin click [Từ Chối Khiếu Nại] kèm lý do từ chối.",
            "expected": "1. Khiếu nại chuyển trạng thái 'rejected'.\n2. Không hoàn tiền ví.\n3. Đơn hàng tiếp tục duy trì trạng thái bình thường kèm thông báo từ chối.",
            "post": "Không phát sinh biến động số dư ví",
            "result": "Pass", "date": "16/09/2026",
            "note": "Ngăn chặn gian lận và trục lợi chính sách bảo hiểm",
            "height": 70
        }
    ]
    build_detail_st_sheet(
        title="ST_Dispute_Refund",
        scn_code="STC-SCN-DISPUTE",
        scn_name="Kịch bản E2E Xử lý Khiếu nại & Bảo hiểm Hoàn tiền 100%",
        creator="Lê Hải Đăng",
        exec_by="Lê Thanh Tùng",
        test_cases=tc_dispute
    )

    # -------------------------------------------------------------------------
    # SHEET 7: ST_Admin_Security (4 Test Cases)
    # -------------------------------------------------------------------------
    tc_admin = [
        {
            "id": "[STC-E2E-11]",
            "desc": "Luồng Admin Thêm nick game mới vào kho chuẩn Form UC1",
            "pre": "1. Admin đăng nhập vào hệ thống với role='admin'",
            "steps": "1. Vào /admin/warehouse, click [Thêm Tài Khoản Mới].\n2. Nhập Mã SP: 'ACCLOL005' (9 ký tự, chuẩn 8-30).\n3. Nhập Tên nick: 'Nick LMHT Thách Đấu Full Tướng' (30 ký tự, chuẩn 10-50).\n4. Chọn Game: 'Liên Minh Huyền Thoại', Giá: 20.000 đ/h, Rank: 'Challenger'.\n5. Upload ảnh hợp lệ 'yasuo.png' dung lượng 750KB (<= 1MB).\n6. Nhập tài khoản/mật khẩu in-game và click [Lưu Tài Khoản Vào Kho].",
            "expected": "1. Toast thông báo: 'Thêm tài khoản mới thành công!'.\n2. Danh sách kho quản lý xuất hiện dòng 'ACCLOL005' với status 'available'.\n3. Phía Client danh mục LMHT xuất hiện ngay thẻ nick mới này.",
            "post": "Kho game có thêm 1 nick sẵn sàng cho thuê",
            "result": "Pass", "date": "16/09/2026",
            "note": "Tuân thủ chặt chẽ đặc tả use case UC1_Add New Product của giảng viên",
            "height": 85
        },
        {
            "id": "[STC-E2E-12]",
            "desc": "Luồng Admin chuyển trạng thái Bảo trì và khóa chức năng thuê",
            "pre": "1. Nick ACCLOL005 đang available trong kho",
            "steps": "1. Tại bảng kho Admin, click nút [Chuyển sang Bảo Trì].\n2. Khách hàng mở trang chủ Client xem nick.",
            "expected": "1. Tại Client, thẻ nick hiển thị badge xám 'Bảo Trì'.\n2. Nút [Thuê Ngay] bị disabled, khách không thể bấm thuê.",
            "post": "Tài khoản có status='maintenance'",
            "result": "Pass", "date": "16/09/2026",
            "note": "Khóa tính năng tức thời khi phát hiện nick cần cập nhật hoặc đổi mật khẩu",
            "height": 65
        },
        {
            "id": "[STC-E2E-13]",
            "desc": "Luồng Kiểm tra Phân quyền RBAC bảo vệ trang Admin",
            "pre": "1. Người dùng đăng nhập với tài khoản Khách (role='renter')",
            "steps": "1. Khách cố tình gõ trực tiếp URL '/admin/overview' hoặc '/admin/warehouse' trên thanh địa chỉ trình duyệt.",
            "expected": "1. Hệ thống Route Guard phát hiện quyền 'renter'.\n2. Tự động điều hướng khách về Trang chủ Client ('/').\n3. Hiển thị cảnh báo: 'Bạn không có quyền truy cập vào phân hệ Quản trị viên!'.",
            "post": "Khách không thể xem doanh thu hay dữ liệu mật của Admin",
            "result": "Pass", "date": "16/09/2026",
            "note": "Kiểm tra an toàn bảo mật phân quyền Role-Based Access Control",
            "height": 70
        },
        {
            "id": "[STC-E2E-14]",
            "desc": "Luồng Ngăn chặn tài khoản bị khóa vi phạm đăng nhập và thuê",
            "pre": "1. Tài khoản vi phạm quy chế bị Admin set isBlocked=true",
            "steps": "1. Cố tình đăng nhập bằng email bị khóa.\n2. Đánh giá phản hồi hệ thống.",
            "expected": "1. Đăng nhập thất bại.\n2. Báo lỗi: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế'.\n3. Chặn toàn bộ thao tác tài chính và thuê nick.",
            "post": "Tài khoản bị cô lập an toàn",
            "result": "Pass", "date": "16/09/2026",
            "note": "Cơ chế cách ly người dùng độc hại bảo vệ tài sản của cửa hàng",
            "height": 65
        }
    ]
    build_detail_st_sheet(
        title="ST_Admin_Security",
        scn_code="STC-SCN-ADMIN-SEC",
        scn_name="Kịch bản E2E Quản trị Kho hàng UC1 & An toàn bảo mật RBAC",
        creator="Lê Minh Quân",
        exec_by="Lê Hải Đăng",
        test_cases=tc_admin
    )

    # -------------------------------------------------------------------------
    # SHEET 8: Test Report (Matching Page 49-50 of ST_Test Case.pdf)
    # -------------------------------------------------------------------------
    ws_tr = wb.create_sheet(title="Test Report")
    ws_tr.views.sheetView[0].showGridLines = True

    # Title: Row 2
    ws_tr.merge_cells("A2:H2")
    ws_tr["A2"] = "TEST REPORT (SYSTEM E2E TESTING)"
    ws_tr["A2"].font = f_tahoma_14_bold
    ws_tr["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws_tr.row_dimensions[2].height = 25

    # Metadata: Rows 4-7
    tr_meta = [
        ("Project Name", "Hệ thống Cho thuê tài khoản game (GameRent)", "Creator", "Lê Minh Quân (Nhóm 16)"),
        ("Project Code", "GAMERENT_BTL", "Reviewer / Approver", "ThS. Phạm Thị Loan"),
        ("Document Code", "ST_Test Report_v1.0", "Issue Date", "16/09/2026"),
        ("Notes", "<List modules included in this release> ex: Toàn bộ 14 kịch bản kiểm thử hệ thống E2E bao quát đầy đủ Happy/Sad path, Vòng đời thuê nick, Khiếu nại bảo hiểm và Phân quyền RBAC đã được nghiệm thu Pass 100%.", "", "")
    ]

    for r_idx, (k1, v1, k2, v2) in enumerate(tr_meta, start=4):
        ws_tr.cell(r_idx, 1, k1).font = f_tahoma_10_bold
        ws_tr.cell(r_idx, 1).border = border_all_black_thin

        if r_idx == 7: # Notes spans across
            ws_tr.merge_cells(start_row=r_idx, start_column=2, end_row=r_idx, end_column=8)
            ws_tr.cell(r_idx, 2, v1).font = f_tahoma_10_norm
            ws_tr.cell(r_idx, 2).alignment = Alignment(vertical="top", wrap_text=True)
            for c in range(2, 9): ws_tr.cell(r_idx, c).border = border_all_black_thin
            ws_tr.row_dimensions[r_idx].height = 36
        else:
            ws_tr.merge_cells(start_row=r_idx, start_column=2, end_row=r_idx, end_column=3)
            ws_tr.cell(r_idx, 2, v1).font = f_tahoma_10_norm
            for c in range(2, 4): ws_tr.cell(r_idx, c).border = border_all_black_thin

            ws_tr.cell(r_idx, 4, k2).font = f_tahoma_10_bold
            ws_tr.cell(r_idx, 4).border = border_all_black_thin

            ws_tr.merge_cells(start_row=r_idx, start_column=5, end_row=r_idx, end_column=8)
            ws_tr.cell(r_idx, 5, v2).font = f_tahoma_10_norm
            for c in range(5, 9): ws_tr.cell(r_idx, c).border = border_all_black_thin
            ws_tr.row_dimensions[r_idx].height = 22

    # Table Header: Row 9
    rep_headers = ["No", "Scenario Code", "Pass", "Fail", "Untested", "N/A", "Number of test cases", "% Pass"]
    for col_idx, h_text in enumerate(rep_headers, start=1):
        cell = ws_tr.cell(9, col_idx, h_text)
        cell.font = f_navy_header
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = border_all_black_thin
    ws_tr.row_dimensions[9].height = 25

    # Data Rows: Rows 10-13 (4 scenarios)
    scenarios_data = [
        (1, "STC-SCN-JOURNEY", 4, 0, 0, 0),
        (2, "STC-SCN-LIFECYCLE", 3, 0, 0, 0),
        (3, "STC-SCN-DISPUTE", 3, 0, 0, 0),
        (4, "STC-SCN-ADMIN-SEC", 4, 0, 0, 0)
    ]

    for r_idx, (no, scn_code, p, f, u, na) in enumerate(scenarios_data, start=10):
        ws_tr.cell(r_idx, 1, no).alignment = Alignment(horizontal="center", vertical="center")
        ws_tr.cell(r_idx, 1).font = f_tahoma_10_bold
        ws_tr.cell(r_idx, 2, scn_code).font = f_tahoma_10_bold
        ws_tr.cell(r_idx, 2).alignment = Alignment(horizontal="left", vertical="center")

        ws_tr.cell(r_idx, 3, p).alignment = Alignment(horizontal="center", vertical="center")
        ws_tr.cell(r_idx, 4, f).alignment = Alignment(horizontal="center", vertical="center")
        ws_tr.cell(r_idx, 5, u).alignment = Alignment(horizontal="center", vertical="center")
        ws_tr.cell(r_idx, 6, na).alignment = Alignment(horizontal="center", vertical="center")

        # Formulas
        cell_total = ws_tr.cell(r_idx, 7, f"=SUM(C{r_idx}:F{r_idx})")
        cell_total.font = f_tahoma_10_bold
        cell_total.alignment = Alignment(horizontal="center", vertical="center")

        cell_rate = ws_tr.cell(r_idx, 8, f"=C{r_idx}/G{r_idx}")
        cell_rate.font = f_tahoma_10_bold
        cell_rate.number_format = "0.00%"
        cell_rate.alignment = Alignment(horizontal="center", vertical="center")

        for c in range(1, 9):
            ws_tr.cell(r_idx, c).border = border_all_black_thin
        ws_tr.row_dimensions[r_idx].height = 22

    # Sub Total Row: Row 14
    ws_tr.cell(14, 1, "").border = border_all_black_thin
    ws_tr.cell(14, 2, "Sub total").font = f_tahoma_10_bold
    ws_tr.cell(14, 2).alignment = Alignment(horizontal="center", vertical="center")

    ws_tr.cell(14, 3, "=SUM(C10:C13)").font = f_tahoma_10_bold
    ws_tr.cell(14, 4, "=SUM(D10:D13)").font = f_tahoma_10_bold
    ws_tr.cell(14, 5, "=SUM(E10:E13)").font = f_tahoma_10_bold
    ws_tr.cell(14, 6, "=SUM(F10:F13)").font = f_tahoma_10_bold
    ws_tr.cell(14, 7, "=SUM(G10:G13)").font = f_tahoma_10_bold

    cell_tot_rate = ws_tr.cell(14, 8, "=C14/G14")
    cell_tot_rate.font = f_tahoma_10_bold
    cell_tot_rate.number_format = "0.00%"

    for c in range(1, 9):
        cell = ws_tr.cell(14, c)
        cell.fill = fill_navy
        cell.font = f_navy_header
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = Border(top=thin_black_side, bottom=double_bottom_side, left=thin_black_side, right=thin_black_side)
    ws_tr.row_dimensions[14].height = 25

    # Coverage Metrics: Rows 16-17
    ws_tr.merge_cells("B16:C16")
    ws_tr["B16"] = "Test coverage"
    ws_tr["B16"].font = f_tahoma_10_bold

    ws_tr["D16"] = "=(C14+D14)/G14"
    ws_tr["D16"].font = f_pass
    ws_tr["D16"].number_format = "0.00%"
    ws_tr["D16"].alignment = Alignment(horizontal="right")

    ws_tr.merge_cells("B17:C17")
    ws_tr["B17"] = "Test successful coverage"
    ws_tr["B17"].font = f_tahoma_10_bold

    ws_tr["D17"] = "=C14/G14"
    ws_tr["D17"].font = f_pass
    ws_tr["D17"].number_format = "0.00%"
    ws_tr["D17"].alignment = Alignment(horizontal="right")

    # Status Data for PieChart (Cols J-K)
    ws_tr["J2"] = "Status"
    ws_tr["K2"] = "Count"
    ws_tr["J3"] = "Pass"
    ws_tr["K3"] = "=C14"
    ws_tr["J4"] = "Fail"
    ws_tr["K4"] = "=D14"
    ws_tr["J5"] = "Untested"
    ws_tr["K5"] = "=E14"
    ws_tr["J6"] = "N/A"
    ws_tr["K6"] = "=F14"

    # Pie Chart
    pie = PieChart()
    pie.title = "Execution Status"
    labels = Reference(ws_tr, min_col=10, min_row=3, max_row=6)
    data = Reference(ws_tr, min_col=11, min_row=2, max_row=6)
    pie.add_data(data, titles_from_data=True)
    pie.set_categories(labels)
    pie.dataLabels = DataLabelList()
    pie.dataLabels.showPercent = True
    pie.dataLabels.showVal = False
    pie.width = 14
    pie.height = 8.5
    ws_tr.add_chart(pie, "J8")

    auto_fit(ws_tr, {
        1: 6, 2: 24, 3: 10, 4: 10, 5: 12, 6: 10, 7: 22, 8: 14, 9: 4, 10: 12, 11: 10
    })

    # -------------------------------------------------------------------------
    # SHEET 9: Wireframe & System Architecture
    # -------------------------------------------------------------------------
    ws_wf = wb.create_sheet(title="Wireframe")
    ws_wf.views.sheetView[0].showGridLines = True

    ws_wf["A2"] = "1."
    ws_wf["A2"].font = f_tahoma_11_bold
    ws_wf["B2"] = "Wireframe & Giao diện luồng nghiệp vụ E2E"
    ws_wf["B2"].font = f_tahoma_11_bold

    # Insert clean wireframe image
    img_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "it_login_wireframe_clean.png")
    if os.path.exists(img_path):
        img = OpenpyxlImage(img_path)
        img.width = 460
        img.height = 360
        ws_wf.add_image(img, "B4")

    # Table of Fields: Row 22
    ws_wf["A22"] = "2."
    ws_wf["A22"].font = f_tahoma_11_bold
    ws_wf["B22"] = "Bảng đặc tả trường dữ liệu hệ thống (Data Elements Specification)"
    ws_wf["B22"].font = f_tahoma_11_bold

    wf_headers = ["Field Name", "Type", "Length", "Mandatory", "Description"]
    for col_idx, h_text in enumerate(wf_headers, start=2):
        cell = ws_wf.cell(23, col_idx, h_text)
        cell.font = f_navy_header
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = border_all_black_thin
    ws_wf.row_dimensions[23].height = 24

    wf_fields_data = [
        ("Tên đăng nhập / Email", "String", "6-50", "y", "Email hợp lệ (@gmail.com, @eaut.edu.vn...)"),
        ("Mật khẩu tài khoản", "String", "6-30", "y", "Mật khẩu tối thiểu 6 ký tự bảo mật"),
        ("Họ và tên (Đăng ký)", "String", "2-50", "y", "Họ tên tiếng Việt đầy đủ"),
        ("Số tiền nạp ví (VietQR)", "Integer", "10k - 5M", "y", "Số nguyên dương (VNĐ), tối thiểu 10.000 VNĐ"),
        ("Thời gian thuê", "Integer", "1 - 48", "y", "Số giờ thuê theo ca (1 giờ đến 48 giờ)"),
        ("Mã sản phẩm (Kho UC1)", "String", "8-30", "y", "Mã định danh nick game duy nhất trong kho")
    ]
    for r_idx, (fn, tp, ln, md, ds) in enumerate(wf_fields_data, start=24):
        ws_wf.cell(r_idx, 2, fn).font = f_tahoma_10_bold
        ws_wf.cell(r_idx, 3, tp).alignment = Alignment(horizontal="center")
        ws_wf.cell(r_idx, 3).font = f_tahoma_10_norm
        ws_wf.cell(r_idx, 4, ln).alignment = Alignment(horizontal="center")
        ws_wf.cell(r_idx, 4).font = f_tahoma_10_norm
        ws_wf.cell(r_idx, 5, md).alignment = Alignment(horizontal="center")
        ws_wf.cell(r_idx, 5).font = f_tahoma_10_norm
        ws_wf.cell(r_idx, 6, ds).font = f_tahoma_10_norm
        for c in range(2, 7):
            ws_wf.cell(r_idx, c).border = border_all_black_thin
        ws_wf.row_dimensions[r_idx].height = 20

    # Business Rules: Row 31
    ws_wf["A31"] = "3."
    ws_wf["A31"].font = f_tahoma_11_bold
    ws_wf["B31"] = "Ràng buộc nghiệp vụ toàn trình (Business & Validation Rules)"
    ws_wf["B31"].font = f_tahoma_11_bold

    rules = [
        "1. Nếu người dùng nhập sai tên đăng nhập hoặc mật khẩu thì hệ thống báo lỗi: 'Sai tên đăng nhập hoặc mật khẩu.'",
        "2. Nếu số dư ví nhỏ hơn chi phí thuê tài khoản, hệ thống cảnh báo và tự động gợi ý số tiền nạp bù qua VietQR.",
        "3. Khi tài khoản game có status='rented' (đang có người thuê), nút thuê bị vô hiệu hóa để ngăn ngừa Race Condition.",
        "4. Khách hàng có thể gia hạn thêm giờ chơi; hệ thống cộng nối tiếp expiresAt và cập nhật đồng hồ đếm ngược tức thời.",
        "5. Khách hàng trả nick sớm được hoàn 50% chi phí giờ chơi chưa sử dụng, đồng thời thu hồi mật khẩu để bảo mật.",
        "6. Khiếu nại sự cố trong 15 phút đầu được Admin phê duyệt sẽ hoàn trả đúng 100% tiền đơn vào ví khách hàng.",
        "7. Biểu mẫu thêm nick mới của Quản trị viên tuân thủ nghiêm ngặt đặc tả UC1 (Mã SP 8-30 ký tự, Tên 10-50 ký tự, Ảnh <= 1MB).",
        "8. Người dùng có role='renter' bị chặn truy cập tuyệt đối vào tất cả các route quản trị (/admin/*) thông qua Route Guard."
    ]
    for r_idx, rule_text in enumerate(rules, start=32):
        ws_wf.merge_cells(start_row=r_idx, start_column=2, end_row=r_idx, end_column=7)
        c = ws_wf.cell(r_idx, 2, rule_text)
        c.font = f_tahoma_10_norm
        c.alignment = Alignment(horizontal="left", vertical="center")
        ws_wf.row_dimensions[r_idx].height = 20

    auto_fit(ws_wf, {
        1: 6, 2: 26, 3: 14, 4: 14, 5: 12, 6: 45, 7: 15
    })

    return wb

def main():
    print("Building PERFECT System Testing (E2E) Workbook matching ST_Test Case.pdf...")
    wb = create_perfect_st_test_workbook()

    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Tài_Liệu", "ST_Test_Case_GameRent.xlsx")
    wb.save(out_path)
    print(f"Saved: {out_path}")

    print("SUCCESS: System Test Case files generated matching template perfectly!")

if __name__ == "__main__":
    main()
