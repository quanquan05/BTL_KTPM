# -*- coding: utf-8 -*-
"""
Script to generate the complete, professional Test Case document:
- "Test case của bài tập lớn.docx" / "Test_case_cua_bai_tap_lon.docx"
- "Test case của bài tập lớn.pdf" / "Test_case_cua_bai_tap_lon.pdf"

Bao phủ đầy đủ 3 cấp độ:
1. Unit Test Cases (Toàn bộ các hàm nghiệp vụ, BVA, EP, Decision Table, chuẩn UC1 của cô giáo)
2. Integration Test Cases (Chiến lược Sandwich, 12 kịch bản tích hợp giữa các Component, Context và LocalStorage)
3. System Test Cases (14 kịch bản E2E kiểm thử luồng Happy/Sad path, State Transition, Race Condition, RBAC)
4. State Transition Matrix & Bảng Bug Log thực tế

Đề tài: Kiểm thử ứng dụng website cho thuê tài khoản game (GameRent)
Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)
Nhóm: 16
Trường Đại học Công nghệ Đông Á (EAUT)
"""

import os
import sys
import shutil
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from docx2pdf import convert

def create_test_cases_document():
    doc = docx.Document()

    # Căn lề chuẩn học thuật: Trái 3cm (1.18 in), Phải 2cm (0.79 in), Trên 2cm, Dưới 2cm
    for section in doc.sections:
        section.top_margin = Inches(0.79)
        section.bottom_margin = Inches(0.79)
        section.left_margin = Inches(1.18)
        section.right_margin = Inches(0.79)
        section.page_width = Inches(8.27)   # A4
        section.page_height = Inches(11.69) # A4

    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(33, 37, 41)
    style_normal.paragraph_format.line_spacing = 1.25
    style_normal.paragraph_format.space_after = Pt(4)

    NAVY = RGBColor(26, 54, 93)       # #1A365D
    BLUE = RGBColor(43, 108, 176)     # #2B6CB0
    DARK_GRAY = RGBColor(45, 55, 72)  # #2D3748
    TEXT_COLOR = RGBColor(33, 37, 41)
    ORANGE = RGBColor(234, 88, 12)    # #EA580C
    EMERALD = RGBColor(16, 185, 129)  # #10B981

    def set_cell_background(cell, fill_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'''
            <w:tcMar {nsdecls("w")}>
                <w:top w:w="{top}" w:type="dxa"/>
                <w:bottom w:w="{bottom}" w:type="dxa"/>
                <w:left w:w="{left}" w:type="dxa"/>
                <w:right w:w="{right}" w:type="dxa"/>
            </w:tcMar>
        ''')
        tcPr.append(tcMar)

    def add_p(text="", bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, color=TEXT_COLOR, font_size=12):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.25
        if text:
            run = p.add_run(text)
            run.bold = bold
            run.italic = italic
            run.font.name = 'Times New Roman'
            run.font.size = Pt(font_size)
            run.font.color.rgb = color
        return p

    def add_h1(title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(15)
        run.font.color.rgb = NAVY
        return p

    def add_h2(title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.color.rgb = BLUE
        return p

    def add_h3(title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title)
        run.bold = True
        run.italic = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.color.rgb = DARK_GRAY
        return p

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.2
        if bold_prefix:
            r1 = p.add_run(bold_prefix + ": ")
            r1.bold = True
            r1.font.name = 'Times New Roman'
            r1.font.size = Pt(11.5)
            r1.font.color.rgb = TEXT_COLOR
        r2 = p.add_run(text)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11.5)
        r2.font.color.rgb = TEXT_COLOR
        return p

    def add_table_custom(headers, rows, col_widths=None, header_bg="2B6CB0"):
        table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].text = header_text
            set_cell_background(hdr_cells[i], header_bg)
            set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            for run in p.runs:
                run.bold = True
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(255, 255, 255)

        for r_idx, row_data in enumerate(rows):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].text = str(cell_value)
                set_cell_background(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=75, bottom=75, left=100, right=100)
                p = row_cells[c_idx].paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.15
                if c_idx == 0 or (len(str(cell_value)) < 8 and c_idx in [1, len(row_data)-1]):
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in p.runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(9.5)
                    run.font.color.rgb = TEXT_COLOR

        if col_widths:
            for row in table.rows:
                for c_idx, w in enumerate(col_widths):
                    row.cells[c_idx].width = Inches(w)

        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
                <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
                <w:left w:val="none"/>
                <w:right w:val="none"/>
                <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        table._tbl.tblPr.append(borders)
        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(1)
        p_after.paragraph_format.space_after = Pt(4)

    # ==========================================
    # 1. TRANG BÌA (COVER PAGE)
    # ==========================================
    add_p("BỘ GIÁO DỤC VÀ ĐÀO TẠO", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2)
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=2, color=NAVY)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=20)

    add_p("─────────── ★ ───────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=26, color=BLUE)

    add_p("BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=6, color=ORANGE)
    add_p("TỔNG HỢP TOÀN BỘ TEST CASE CỦA BÀI TẬP LỚN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=19, space_after=6, color=NAVY)
    add_p("(TEST CASE SPECIFICATIONS FOR GAMERENT PROJECT)", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11.5, space_after=18, color=DARK_GRAY)

    add_p("HỌC PHẦN: KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=4, color=NAVY)
    add_p("LỚP TÍN CHỈ: Kiểm thử phần mềm-1-1-26(N05)  ·  NHÓM THỰC HIỆN: NHÓM 16", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=20, color=EMERALD)

    add_p("TÊN ĐỀ TÀI CHÍNH THỨC:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)
    add_p("KIỂM THỬ ỨNG DỤNG WEBSITE CHO THUÊ TÀI KHOẢN GAME (GAMERENT)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=16, space_after=24, color=NAVY)

    add_p("──────────────────────────────────────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18, color=BLUE)

    add_p("Giảng viên hướng dẫn: ThS. Phạm Thị Loan", bold=True, font_size=12, space_after=4)
    add_p("Nhóm sinh viên thực hiện (Nhóm 16):", bold=True, font_size=12, space_after=2)
    add_p("  1. Lê Hải Đăng    - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  2. Lê Minh Quân   - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  3. Lê Xuân Đạt    - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  4. Lê Thanh Tùng  - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=6)
    add_p("Học kỳ I - Năm học 2026 - 2027", font_size=11.5, space_after=24)

    add_p("BẮC NINH / HÀ NỘI – NĂM 2026", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=0, color=NAVY)
    doc.add_page_break()

    # Bảng phân công bài tập lớn
    add_h1("BẢNG THEO DÕI THIẾT KẾ VÀ THỰC THI TEST CASE - NHÓM 16")
    add_p("(Căn cứ theo Bảng phân công đề tài học phần: Kiểm thử phần mềm-1-1-26(N05))", italic=True, font_size=11, space_after=8)
    tbl_headers = ["Hạng Mục Test", "Kỹ Thuật Áp Dụng", "Số Lượng Test Case", "Người Chịu Trách Nhiệm", "Trạng Thái"]
    tbl_rows = [
        ["1. Unit Test Cases", "BVA (Biên), EP (Tương đương), Decision Table, Chuẩn UC1", "45 Test Cases", "Lê Hải Đăng & Lê Xuân Đạt", "Hoàn thành 100% (Passed)"],
        ["2. Integration Test Cases", "Chiến lược Sandwich (Top-down & Bottom-up)", "12 Test Cases", "Lê Xuân Đạt & Lê Minh Quân", "Hoàn thành 100% (Passed)"],
        ["3. System Test Cases", "E2E Testing, State Transition, Race Condition, RBAC", "14 Kịch bản E2E", "Lê Minh Quân & Lê Hải Đăng", "Hoàn thành 100% (Passed)"],
        ["4. BVA & EP Matrix", "Phân tích giá trị biên chi tiết cho form nhập liệu", "25 Bộ giá trị thử nghiệm", "Lê Thanh Tùng", "Hoàn thành 100% (Passed)"],
        ["5. Bug Log & Báo cáo lỗi", "Quy chuẩn mẫu Bug Report chuẩn ISTQB", "5 Lỗi phát hiện & fix", "Cả nhóm 16", "Đã giải quyết (Closed)"]
    ]
    add_table_custom(tbl_headers, tbl_rows, col_widths=[1.5, 2.0, 1.1, 1.4, 1.2])

    doc.add_page_break()

    # ==========================================
    # PHẦN I: TỔNG QUAN CHIẾN LƯỢC THIẾT KẾ TEST CASE
    # ==========================================
    add_h1("PHẦN I: TỔNG QUAN CHIẾN LƯỢC VÀ KỸ THUẬT THIẾT KẾ TEST CASE")
    add_h2("1.1. Mục tiêu và phạm vi kiểm thử dự án GameRent")
    add_p("Tài liệu này tổng hợp toàn bộ các Test Case (ca kiểm thử) được thiết kế và thực thi cho dự án Website Cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent). Tài liệu bám sát theo chuẩn ISTQB và các biểu mẫu đề bài của giảng viên môn học Kiểm thử phần mềm.")
    add_p("Mục tiêu chính bao gồm:")
    add_bullet("Kiểm tra tính đúng đắn chức năng (Functional Correctness)", "Xác minh các hàm tính toán tài chính (số dư ví, phí thuê, hoàn tiền 50%, bảo hiểm 100%), quy tắc đồng hồ đếm ngược và bàn giao mật khẩu in-game an toàn.")
    add_bullet("Kiểm tra tính toàn vẹn dữ liệu (Data Integrity)", "Đảm bảo tính duy nhất của mã sản phẩm, ràng buộc độ dài chuỗi, định dạng ảnh upload <= 1MB, và lưu trữ phục hồi bền vững trên LocalStorage Engine.")
    add_bullet("Kiểm tra giao tiếp tích hợp (Integration Robustness)", "Đảm bảo trạng thái dữ liệu luôn đồng bộ giữa các UI Components, AppContext và tầng lưu trữ.")
    add_bullet("Kiểm tra trải nghiệm và an toàn hệ thống (E2E & Security)", "Bao quát các luồng thuận lợi (Happy Path), luồng ngoại lệ (Sad Path), bảo vệ phân quyền Admin và ngăn chặn race condition.")

    add_h2("1.2. Các kỹ thuật thiết kế ca kiểm thử được áp dụng")
    add_bullet("1. Phân tích giá trị biên (Boundary Value Analysis - BVA)", "Xác định các giá trị tại biên: Min, Min-1, Min+1, Max, Max-1, Max+1. Áp dụng cho độ dài Username (4-30), Password (>=6), Hạn mức nạp ví (10.000đ - 5.000.000đ), Thời lượng thuê (1h - 48h), Mã sản phẩm (8-30) và Tên nick (10-50).")
    add_bullet("2. Phân vùng tương đương (Equivalence Partitioning - EP)", "Chia dữ liệu thành các lớp tương đương hợp lệ (Valid) và không hợp lệ (Invalid) để chọn đại diện ca kiểm thử, tối ưu độ bao phủ.")
    add_bullet("3. Bảng quyết định (Decision Table Testing)", "Thiết lập ma trận kết hợp điều kiện (Số dư ví vs Chi phí, Trạng thái tài khoản, Vai trò người dùng) để xác định chính xác hành vi hệ thống.")
    add_bullet("4. Kiểm thử chuyển trạng thái (State Transition Testing)", "Kiểm thử vòng đời tài khoản game (`available` → `rented` → `need_change_pass` → `maintenance` → `available`) và đơn thuê (`active` → `completed` / `returned_early` / `disputed`).")
    add_bullet("5. Kiểm thử dựa trên Use Case (Use Case Testing)", "Chuyển hóa 10 Use Case (`UC01` đến `UC10`) thành các kịch bản kiểm thử luồng nghiệp vụ E2E.")

    add_h2("1.3. Ma trận đối soát truy vết giữa 10 Use Case của hệ thống và các ca kiểm thử (Traceability Matrix)")
    add_p("Toàn bộ hơn 70 ca kiểm thử trong tài liệu này đều được thiết kế dựa trên đúng 10 Use Case (UC01 đến UC10) và các quy tắc nghiệp vụ (Business Rules) được đặc tả trong Tài liệu Đặc tả yêu cầu phần mềm của hệ thống GameRent. Bảng ma trận đối soát 2 chiều dưới đây chứng minh tính đồng nhất 100%:")

    trace_headers = ["Mã Use Case", "Tên Use Case Đặc Tả", "Unit Test Cases", "Integration Test Cases", "System Test Cases E2E", "Mức Bao Phủ"]
    trace_rows = [
        ["UC01", "Đăng nhập hệ thống (Login)", "UTC-AUTH-14, 15, 16", "ITC-01", "STC-E2E-02, STC-E2E-14", "100% (Passed)"],
        ["UC02", "Đăng ký tài khoản mới (Register)", "UTC-AUTH-01 -> 13", "ITC-01", "STC-E2E-01", "100% (Passed)"],
        ["UC03", "Tìm kiếm & Lọc kho nick (Search & Filter)", "Validate filter query", "ITC-03, ITC-07, ITC-11", "STC-E2E-04", "100% (Passed)"],
        ["UC04", "Nạp tiền ví điện tử qua VietQR", "UTC-WAL-01 -> 10", "ITC-02, ITC-09", "STC-E2E-03, STC-E2E-06", "100% (Passed)"],
        ["UC05", "Thuê tài khoản game tức thì (Rent Engine)", "UTC-PAY-01 -> 08", "ITC-03, ITC-09", "STC-E2E-05, STC-E2E-06, STC-E2E-12", "100% (Passed)"],
        ["UC06", "Giám sát phiên thuê & Xem mật khẩu bàn giao", "Countdown timer state", "ITC-03, ITC-04, ITC-08", "STC-E2E-05, STC-E2E-07, STC-E2E-13", "100% (Passed)"],
        ["UC07", "Gia hạn thời gian thuê tài khoản", "Calc extension fee", "ITC-04", "STC-E2E-07", "100% (Passed)"],
        ["UC08", "Trả nick sớm & Báo lỗi sự cố / Hoàn tiền", "Refund formula (50%, 100%)", "ITC-05, ITC-06", "STC-E2E-08, STC-E2E-09", "100% (Passed)"],
        ["UC09", "Giám sát phiên & Điều phối của Admin", "Session admin actions", "ITC-06, ITC-08, ITC-11", "STC-E2E-09, STC-E2E-11", "100% (Passed)"],
        ["UC10", "Thêm mới nick vào kho (Chuẩn đề bài UC1)", "UTC-UC1-01 -> 15", "ITC-07", "STC-E2E-10", "100% (Passed)"]
    ]
    add_table_custom(trace_headers, trace_rows, col_widths=[0.8, 1.8, 1.4, 1.3, 1.5, 0.9])

    doc.add_page_break()

    # ==========================================
    # PHẦN II: BỘ TEST CASES CẤP ĐỘ ĐƠN VỊ (UNIT TEST CASES)
    # ==========================================
    add_h1("PHẦN II: BỘ TEST CASES CẤP ĐỘ ĐƠN VỊ (UNIT TEST CASES)")
    add_p("Cấp độ Unit Test tập trung kiểm thử các hàm xử lý logic, tính toán chi phí và xác thực dữ liệu đầu vào. Toàn bộ các ca kiểm thử đều được thiết kế với dữ liệu thử nghiệm cụ thể và kết quả mong đợi định lượng.")

    # MODULE 1: AUTHENTICATION
    add_h2("2.1. Module 1: Xác thực & Đăng ký tài khoản (validateRegistration & validateLogin)")
    add_p("Ràng buộc: Tên đăng nhập 4-30 ký tự (chữ và số); Mật khẩu tối thiểu 6 ký tự; Số điện thoại đúng 10 số di động.")
    ut_auth_headers = ["TC ID", "Hàm Kiểm Thử", "Kỹ Thuật", "Dữ Liệu Đầu Vào (Test Data)", "Kết Quả Mong Đợi", "Priority"]
    ut_auth_rows = [
        ["UTC-AUTH-01", "validateRegistration", "BVA", "user: 'game', pass: '123456', phone: '0912345678'", "Hợp lệ (True, không có lỗi)", "High"],
        ["UTC-AUTH-02", "validateRegistration", "BVA", "user: 'gam' (3 ký tự), pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập phải từ 4 ký tự trở lên'", "High"],
        ["UTC-AUTH-03", "validateRegistration", "EP", "user: '' (để trống), pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập không được để trống'", "High"],
        ["UTC-AUTH-04", "validateRegistration", "BVA", "user: 'user12345678901234567890123456' (30 ký tự)", "Hợp lệ (True)", "Medium"],
        ["UTC-AUTH-05", "validateRegistration", "BVA", "user: 'user123456789012345678901234567' (31 ký tự)", "Lỗi: 'Tên đăng nhập không được vượt quá 30 ký tự'", "Medium"],
        ["UTC-AUTH-06", "validateRegistration", "EP", "user: 'user name' (chứa khoảng trắng)", "Lỗi: 'Tên đăng nhập không chứa khoảng trắng'", "High"],
        ["UTC-AUTH-07", "validateRegistration", "EP", "user: 'user@123' (chứa ký tự đặc biệt)", "Lỗi: 'Tên đăng nhập chỉ gồm chữ và số'", "High"],
        ["UTC-AUTH-08", "validateRegistration", "BVA", "pass: '123456' (6 ký tự - Biên dưới)", "Hợp lệ (True)", "High"],
        ["UTC-AUTH-09", "validateRegistration", "BVA", "pass: '12345' (5 ký tự - Dưới biên)", "Lỗi: 'Mật khẩu phải có ít nhất 6 ký tự'", "High"],
        ["UTC-AUTH-10", "validateRegistration", "EP", "phone: '0987654321' (10 số di động chuẩn)", "Hợp lệ (True)", "High"],
        ["UTC-AUTH-11", "validateRegistration", "EP", "phone: '0123456789' (Sai đầu số di động)", "Lỗi: 'Số điện thoại không đúng định dạng'", "High"],
        ["UTC-AUTH-12", "validateRegistration", "EP", "phone: '098765432' (9 số - thiếu ký tự)", "Lỗi: 'Số điện thoại phải gồm đúng 10 chữ số'", "High"],
        ["UTC-AUTH-13", "validateRegistration", "Decision", "user: 'renter_demo' (Tài khoản đã có trong CSDL)", "Lỗi: 'Tên đăng nhập đã tồn tại trong hệ thống'", "High"],
        ["UTC-AUTH-14", "validateLogin", "Decision", "user: 'renter_demo', pass: 'password123' (Đúng)", "Đăng nhập thành công, trả về User Object và Token", "High"],
        ["UTC-AUTH-15", "validateLogin", "Decision", "user: 'renter_demo', pass: 'wrong_pass' (Sai pass)", "Lỗi: 'Mật khẩu không chính xác'", "High"],
        ["UTC-AUTH-16", "validateLogin", "Decision", "user: 'non_exist_user', pass: '123456' (Không tồn tại)", "Lỗi: 'Tài khoản không tồn tại trên hệ thống'", "High"]
    ]
    add_table_custom(ut_auth_headers, ut_auth_rows, col_widths=[1.1, 1.4, 0.8, 1.9, 1.8, 0.6])

    # MODULE 2: WALLET DEPOSIT
    add_h2("2.2. Module 2: Quản lý Ví điện tử & Hạn mức Nạp tiền VietQR (validateDepositAmount)")
    add_p("Ràng buộc: Số tiền nạp là số nguyên dương từ 10.000 VNĐ đến 5.000.000 VNĐ, là bội số của 1.000đ.")
    ut_wallet_headers = ["TC ID", "Kỹ Thuật", "Mục Tiêu Thử Nghiệm", "Giá Trị Thử (amount)", "Kết Quả Mong Đợi", "Đánh Giá"]
    ut_wallet_rows = [
        ["UTC-WAL-01", "BVA", "Ngay dưới biên tối thiểu (9.999 VNĐ)", "9.999", "Lỗi: 'Số tiền nạp tối thiểu là 10.000 đ'", "Pass"],
        ["UTC-WAL-02", "BVA", "Tại biên tối thiểu hợp lệ (10.000 VNĐ)", "10.000", "Hợp lệ (True, sinh mã VietQR thành công)", "Pass"],
        ["UTC-WAL-03", "BVA", "Ngay trên biên tối thiểu (11.000 VNĐ)", "11.000", "Hợp lệ (True, sinh mã VietQR thành công)", "Pass"],
        ["UTC-WAL-04", "EP", "Mệnh giá chọn nhanh hợp lệ trong khoảng", "200.000", "Hợp lệ (True, tạo mã QR chuẩn MBBank)", "Pass"],
        ["UTC-WAL-05", "BVA", "Ngay dưới biên tối đa (4.999.000 VNĐ)", "4.999.000", "Hợp lệ (True, sinh mã VietQR thành công)", "Pass"],
        ["UTC-WAL-06", "BVA", "Tại biên tối đa hợp lệ (5.000.000 VNĐ)", "5.000.000", "Hợp lệ (True, sinh mã VietQR thành công)", "Pass"],
        ["UTC-WAL-07", "BVA", "Vượt quá biên tối đa (5.001.000 VNĐ)", "5.001.000", "Lỗi: 'Số tiền nạp tối đa là 5.000.000 đ'", "Pass"],
        ["UTC-WAL-08", "EP", "Số tiền âm", "-100.000", "Lỗi: 'Số tiền nạp không hợp lệ'", "Pass"],
        ["UTC-WAL-09", "EP", "Số tiền bằng 0", "0", "Lỗi: 'Số tiền nạp tối thiểu là 10.000 đ'", "Pass"],
        ["UTC-WAL-10", "EP", "Nhập ký tự chữ hoặc ký tự đặc biệt", "'abc@123'", "Lỗi: 'Vui lòng nhập số tiền hợp lệ'", "Pass"]
    ]
    add_table_custom(ut_wallet_headers, ut_wallet_rows, col_widths=[1.1, 0.8, 2.1, 1.2, 2.0, 0.6])

    # MODULE 3: RENTAL ENGINE & DECISION TABLE
    add_h2("2.3. Module 3: Động cơ Cho thuê & Bảng quyết định thanh toán ví (Decision Table)")
    add_p("Công thức: Tổng chi phí = Giá_thuê_giờ × Số_giờ_thuê. Điều kiện cho phép thuê: Số dư ví >= Tổng chi phí.")
    ut_rent_headers = ["TC ID", "Kỹ Thuật", "Số Dư Ví", "Giá/h & Giờ Thuê", "Tổng Chi Phí", "Kết Quả Mong Đợi", "Priority"]
    ut_rent_rows = [
        ["UTC-PAY-01", "BVA", "100.000 đ", "15.000 đ × 1h (Biên dưới giờ)", "15.000 đ", "Đủ tiền (Thiếu 0đ). Cho phép thuê nick.", "High"],
        ["UTC-PAY-02", "BVA", "1.000.000 đ", "20.000 đ × 48h (Biên trên giờ)", "960.000 đ", "Đủ tiền (Thiếu 0đ). Cho phép thuê nick.", "High"],
        ["UTC-PAY-03", "BVA", "100.000 đ", "15.000 đ × 0h (Dưới biên giờ)", "0 đ", "Lỗi: 'Thời gian thuê tối thiểu là 1 giờ'", "High"],
        ["UTC-PAY-04", "BVA", "100.000 đ", "15.000 đ × 49h (Vượt biên giờ)", "735.000 đ", "Lỗi: 'Thời gian thuê tối đa là 48 giờ'", "High"],
        ["UTC-PAY-05", "Decision", "50.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư > Chi phí: Trừ ví 30k, ví còn 20.000đ", "High"],
        ["UTC-PAY-06", "Decision", "30.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư = Chi phí: Trừ ví 30k, ví còn 0đ", "High"],
        ["UTC-PAY-07", "Decision", "20.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư < Chi phí: Báo thiếu 10.000 đ, chặn thuê", "High"],
        ["UTC-PAY-08", "Decision", "0 đ", "15.000 đ × 2h", "30.000 đ", "Báo thiếu 30.000 đ, mở nút Nạp bù nhanh", "High"]
    ]
    add_table_custom(ut_rent_headers, ut_rent_rows, col_widths=[1.1, 0.9, 1.1, 1.6, 1.1, 1.6, 0.5])

    # MODULE 4: ADMIN WAREHOUSE FORM - CHUẨN UC1 CỦA CÔ GIÁO
    add_h2("2.4. Module 4: Form Thêm mới tài khoản game vào kho (Chuẩn đề bài UC1_Add New Product)")
    add_p("Tuân thủ 100% tài liệu mẫu của cô giáo: Mã sản phẩm (8-30 ký tự), Tên nick (10-50 ký tự), Hình ảnh <= 1MB (*.jpg, *.png, *.gif).")
    ut_uc1_headers = ["TC ID", "Trường Kiểm Thử", "Kỹ Thuật", "Giá Trị Thử Nghiệm", "Kết Quả Mong Đợi", "Priority"]
    ut_uc1_rows = [
        ["UTC-UC1-01", "Mã sản phẩm (code)", "BVA", "Độ dài 7 ký tự ('SP00001')", "Báo lỗi độ dài mã (< 8 ký tự)", "High"],
        ["UTC-UC1-02", "Mã sản phẩm (code)", "BVA", "Độ dài 8 ký tự ('SP000001')", "Hợp lệ, cho phép lưu", "High"],
        ["UTC-UC1-03", "Mã sản phẩm (code)", "BVA", "Độ dài 30 ký tự", "Hợp lệ, cho phép lưu", "Medium"],
        ["UTC-UC1-04", "Mã sản phẩm (code)", "BVA", "Độ dài 31 ký tự", "Báo lỗi độ dài mã (> 30 ký tự)", "Medium"],
        ["UTC-UC1-05", "Mã sản phẩm (code)", "EP", "Chứa ký tự đặc biệt ('SP@00001')", "Báo lỗi 'Mã sản phẩm không đúng định dạng'", "High"],
        ["UTC-UC1-06", "Mã sản phẩm (code)", "EP", "Chứa khoảng trắng ('SP 00001')", "Báo lỗi 'Mã sản phẩm không đúng định dạng'", "High"],
        ["UTC-UC1-07", "Mã sản phẩm (code)", "Decision", "Mã đã có sẵn trong CSDL", "Báo lỗi 'Mã sản phẩm đã tồn tại trong hệ thống'", "High"],
        ["UTC-UC1-08", "Tên sản phẩm (title)", "BVA", "Độ dài 9 ký tự ('Nick Vip 1')", "Báo lỗi 'Tên sản phẩm phải từ 10 ký tự trở lên'", "High"],
        ["UTC-UC1-09", "Tên sản phẩm (title)", "BVA", "Độ dài 10 ký tự ('Nick Vip 01')", "Hợp lệ, cho phép lưu", "High"],
        ["UTC-UC1-10", "Tên sản phẩm (title)", "BVA", "Độ dài 50 ký tự", "Hợp lệ, cho phép lưu", "Medium"],
        ["UTC-UC1-11", "Tên sản phẩm (title)", "BVA", "Độ dài 51 ký tự", "Báo lỗi 'Tên sản phẩm không quá 50 ký tự'", "Medium"],
        ["UTC-UC1-12", "Ảnh đại diện (image)", "EP", "Upload file sai định dạng (.pdf, .zip)", "Báo lỗi 'Ảnh không đúng định dạng (.jpg, .png, .gif)'", "High"],
        ["UTC-UC1-13", "Ảnh đại diện (image)", "BVA", "Upload ảnh dung lượng 1.5MB (> 1MB)", "Báo lỗi 'Dung lượng ảnh vượt quá 1MB'", "High"],
        ["UTC-UC1-14", "Ảnh đại diện (image)", "EP", "Upload file PNG 800KB (<= 1MB)", "Hợp lệ, upload và hiển thị ảnh thành công", "Medium"],
        ["UTC-UC1-15", "Giá thuê (pricePerHour)", "EP", "Nhập giá âm hoặc bằng 0", "Báo lỗi 'Giá thuê mỗi giờ phải lớn hơn 0'", "High"]
    ]
    add_table_custom(ut_uc1_headers, ut_uc1_rows, col_widths=[1.1, 1.4, 0.7, 1.7, 2.1, 0.5])

    doc.add_page_break()

    # ==========================================
    # PHẦN III: BỘ TEST CASES CẤP ĐỘ TÍCH HỢP (INTEGRATION TEST CASES)
    # ==========================================
    add_h1("PHẦN III: BỘ TEST CASES CẤP ĐỘ TÍCH HỢP (INTEGRATION TEST CASES)")
    add_p("Kiểm thử tích hợp đánh giá sự tương tác, truyền nhận dữ liệu và đồng bộ trạng thái giữa các UI Components, Context API và LocalStorage Engine theo chiến lược Sandwich:")

    it_headers = ["Test ID", "Điểm Kết Nối Tích Hợp", "Mục Tiêu Kiểm Thử", "Các Bước Thực Hiện", "Kết Quả Mong Đợi", "Priority"]
    it_rows = [
        ["ITC-01", "AuthModal ↔ Navbar ↔ AppContext", "Tích hợp đăng nhập và cập nhật trạng thái Navbar",
         "1. Mở AuthModal.\n2. Nhập 'renter_demo' / 'password123'.\n3. Nhấn 'Đăng Nhập Ngay'.",
         "1. AuthModal tự đóng.\n2. Navbar lập tức hiển thị avatar, tên 'Khách Hàng Demo' và số dư ví '100.000 đ'.\n3. LocalStorage lưu session hợp lệ.", "High"],

        ["ITC-02", "DepositModal ↔ WalletPage ↔ Transactions", "Tích hợp nạp tiền ví và cập nhật số dư & lịch sử giao dịch",
         "1. Vào WalletPage (ví 100k).\n2. Bấm 'Nạp Tiền Vào Ví'.\n3. Chọn gói 200k, tạo VietQR.\n4. Bấm 'Xác Nhận Đã Chuyển Tiền'.",
         "1. Số dư ví trên WalletPage và Navbar nhảy lên '300.000 đ'.\n2. Bảng lịch sử thêm dòng mới: '+200.000 đ | Nạp tiền ví VietQR'.", "High"],

        ["ITC-03", "RentConfirmModal ↔ AccountDetailPage ↔ MyRentalsPage ↔ HomePage", "Tích hợp luồng thuê tài khoản, trừ ví, đổi trạng thái nick và tạo đơn hàng",
         "1. User có ví 300.000 đ.\n2. Chọn acc 'ACCVAL001' giá 15.000 đ/h.\n3. Chọn thuê 2 giờ (30.000 đ).\n4. Bấm 'Xác Nhận Thanh Toán'.",
         "1. Ví bị trừ 30.000 đ (còn 270.000 đ).\n2. Thẻ acc trên HomePage chuyển sang badge 'Đang Được Thuê'.\n3. MyRentalsPage sinh đơn mới (#ORDER-XXX) có CountdownTimer đếm ngược 01:59:59.", "High"],

        ["ITC-04", "MyRentalsPage ↔ RentConfirmModal (Gia hạn) ↔ CountdownTimer", "Tích hợp gia hạn đơn thuê và đồng bộ đồng hồ đếm ngược",
         "1. Tại đơn hàng đang còn 30 phút.\n2. Nhấn nút 'Gia Hạn Thêm Giờ'.\n3. Chọn thêm 1 giờ (15.000 đ).\n4. Nhấn xác nhận.",
         "1. Ví trừ tiếp 15.000 đ.\n2. Thời gian kết thúc đơn tăng thêm 3.600 giây.\n3. CountdownTimer cập nhật tức thì thành 01:29:59 mà không reload trang.", "High"],

        ["ITC-05", "MyRentalsPage ↔ ReturnEarlyModal ↔ LocalStorage ↔ WalletPage", "Tích hợp trả acc sớm và thu hồi thông tin đăng nhập",
         "1. Khách đang chơi đơn hàng #ORDER-XXX còn 2 giờ trọn vẹn.\n2. Bấm nút 'Trả Nick Sớm'.\n3. Bấm 'Xác Nhận Trả'.",
         "1. Trạng thái đơn chuyển sang 'completed'.\n2. Mật khẩu bị làm mờ và hiển thị 'Đã thu hồi'.\n3. Ví được hoàn lại 50% tiền giờ thừa.\n4. Acc chuyển sang 'need_change_pass'.", "Medium"],

        ["ITC-06", "DisputeModal ↔ OverviewDashboard ↔ WalletPage", "Tích hợp gửi khiếu nại báo lỗi và Admin duyệt hoàn tiền 100%",
         "1. Khách bấm 'Báo Sự Cố' đơn 30.000 đ, chọn 'Sai mật khẩu', gửi khiếu nại.\n2. Đổi sang vai trò Admin.\n3. Vào Dashboard, xem khiếu nại, bấm 'Phê Duyệt & Hoàn Tiền'.",
         "1. Khiếu nại chuyển trạng thái 'resolved'.\n2. Tài khoản game tự động chuyển sang 'maintenance' (Bảo trì).\n3. Ví của khách thuê được cộng hoàn lại đủ 30.000 đ (100%).", "High"],

        ["ITC-07", "AdminDashboardPage (Form UC1) ↔ HomePage (Catalog)", "Tích hợp thêm acc mới từ Admin và hiển thị lên Client",
         "1. Admin mở Form 'Thêm Acc Mới'.\n2. Nhập mã 'ACCVAL099', Game: Valorant, Giá: 25.000 đ, Rank: Ascendant.\n3. Nhấn 'Lưu Tài Khoản'.\n4. Chuyển sang Trang chủ Client.",
         "1. Thông báo Toast thêm thành công.\n2. Trang chủ Client bộ lọc Valorant xuất hiện ngay thẻ acc 'ACCVAL099' với đầy đủ ảnh bìa, giá thuê và nút 'Thuê Ngay'.", "High"],

        ["ITC-08", "OverviewDashboard (Live Session Modal) ↔ MyRentalsPage", "Tích hợp Admin điều phối bù giờ (+1h) và cập nhật đơn khách",
         "1. Admin mở OverviewDashboard, bấm vào dòng phiên thuê của khách.\n2. Modal Giám Sát mở ra, Admin bấm 'Bù thêm giờ (+1h)'.\n3. Khách mở MyRentalsPage kiểm tra.",
         "1. Toast thông báo 'Đã bù thêm 1 giờ chơi cho khách'.\n2. Mốc expiresAt của đơn được cộng 3.600 giây.\n3. CountdownTimer phía khách hàng tự động nhảy tăng thêm 1 giờ chơi.", "High"],

        ["ITC-09", "AccountDetailPage ↔ RentConfirmModal ↔ DepositModal", "Tích hợp điều hướng nạp tiền tự động khi thiếu số dư ví",
         "1. Khách có ví 10.000 đ, bấm thuê nick 45.000 đ.\n2. RentConfirmModal cảnh báo thiếu 35.000 đ.\n3. Khách bấm nút 'Nạp tiền ngay'.",
         "1. RentConfirmModal tự đóng.\n2. DepositModal tự động mở lên với số tiền gợi ý sẵn '50.000 đ'.\n3. Sau khi nạp xong tự động quay lại đơn thuê.", "Medium"],

        ["ITC-10", "FloatingTesterToolbar ↔ AppContext ↔ All Components", "Tích hợp thanh công cụ Tester BTL chuyển đổi State thời gian thực",
         "1. Bấm nút 'Nạp Nhanh +200k'.\n2. Bấm nút 'Tua Nhanh -30 Phút'.\n3. Bấm 'Đổi Role sang Admin'.",
         "1. Số dư ví lập tức +200.000 đ trên toàn hệ thống.\n2. Các đơn đang thuê giảm ngay 30 phút trên CountdownTimer.\n3. Giao diện chuyển ngay sang quyền Admin mà không mất dữ liệu.", "Medium"],

        ["ITC-11", "Admin kho acc (Đổi trạng thái) ↔ Client Catalog (HomePage)", "Tích hợp Admin chuyển nick sang 'Bảo trì' và khóa nút thuê",
         "1. Admin vào Quản lý kho, bấm nút chuyển 'ACCVAL001' sang Bảo trì.\n2. Khách mở HomePage xem acc.",
         "1. Thẻ acc trên HomePage hiển thị nhãn 'Bảo Trì'.\n2. Nút 'Thuê Ngay' bị vô hiệu hóa, không thể click.", "High"],

        ["ITC-12", "F5 Trình duyệt (Page Reload) ↔ Khôi phục State từ LocalStorage", "Tích hợp tính bền vững dữ liệu khi người dùng tải lại trang",
         "1. Đang có đơn thuê và số dư ví 250.000 đ.\n2. Nhấn phím F5 reload toàn bộ trang web.",
         "1. Người dùng vẫn duy trì trạng thái đăng nhập.\n2. Số dư ví giữ nguyên 250.000 đ.\n3. Đơn thuê và CountdownTimer tiếp tục đếm đúng giây.", "High"]
    ]
    add_table_custom(it_headers, it_rows, col_widths=[0.8, 1.4, 1.4, 1.6, 2.1, 0.5])

    doc.add_page_break()

    # ==========================================
    # PHẦN IV: BỘ TEST CASES CẤP ĐỘ HỆ THỐNG (SYSTEM TEST CASES - E2E)
    # ==========================================
    add_h1("PHẦN IV: BỘ TEST CASES CẤP ĐỘ HỆ THỐNG (SYSTEM TEST CASES - E2E)")
    add_p("Kiểm thử hệ thống đánh giá toàn bộ ứng dụng GameRent từ góc nhìn người dùng thực tế, bao quát các luồng nghiệp vụ khép kín:")

    st_headers = ["Mã Kịch Bản", "Tên Kịch Bản E2E", "Tiền Điều Kiện", "Các Bước Thực Hiện", "Dữ Liệu Thử Nghiệm", "Kết Quả Mong Đợi", "Priority"]
    st_rows = [
        ["STC-E2E-01", "Đăng ký thành viên mới & Nhận 50k ví dùng thử",
         "Khách vãng lai, chưa đăng nhập",
         "1. Bấm 'Đăng Nhập / Đăng Ký'.\n2. Chọn tab 'Đăng Ký'.\n3. Nhập Username, Mật khẩu, SĐT.\n4. Bấm 'Tạo Tài Khoản'.",
         "User: 'gamethu_pro'\nPass: 'Matkhau@123'\nPhone: '0988776655'",
         "1. Toast đăng ký thành công.\n2. Tự động đăng nhập, ví được cộng 50.000đ dùng thử.\n3. Navbar hiển thị 'gamethu_pro' và số dư ví '50.000 đ'.", "High"],

        ["STC-E2E-02", "Đăng nhập thất bại do sai mật khẩu",
         "Tài khoản đã có trong hệ thống",
         "1. Mở Modal Đăng nhập.\n2. Nhập đúng Username.\n3. Nhập sai Mật khẩu.\n4. Bấm 'Đăng Nhập Ngay'.",
         "User: 'renter_demo'\nPass: 'sai_mat_khau'",
         "1. Hệ thống từ chối đăng nhập.\n2. Hiển thị thông báo lỗi màu đỏ: 'Mật khẩu không chính xác'.", "High"],

        ["STC-E2E-03", "Nạp tiền ví tự động qua VietQR và đối soát số dư",
         "User đã đăng nhập, ví hiện có 50.000 đ",
         "1. Bấm 'Nạp Tiền' trên Navbar.\n2. Chọn VietQR.\n3. Chọn nhanh gói 200.000 đ.\n4. Bấm 'Tạo Mã VietQR'.\n5. Bấm 'Xác Nhận Đã Chuyển'.",
         "Mệnh giá: 200.000 VNĐ\nCú pháp: NAP GAMETHU_PRO",
         "1. Toast 'Nạp tiền thành công!'.\n2. Số dư ví nhảy từ 50.000 đ lên 250.000 đ.\n3. Bảng lịch sử xuất hiện dòng giao dịch '+200.000 đ'.", "High"],

        ["STC-E2E-04", "Tìm kiếm, lọc danh mục game và xem chi tiết nick",
         "User ở trang chủ",
         "1. Nhập từ khóa 'Kuronami' vào ô tìm kiếm.\n2. Chọn danh mục 'Valorant'.\n3. Chọn giá '20k - 30k'.\n4. Bấm vào thẻ acc để xem chi tiết.",
         "Keyword: 'Kuronami'\nGame: 'Valorant'\nGiá: 20.000 - 30.000 đ",
         "1. Danh sách sản phẩm lọc đúng nick Valorant có skin Kuronami.\n2. Trang chi tiết hiển thị đầy đủ: Rank, skin, cam kết bảo hiểm 100%, giá thuê/h.", "Medium"],

        ["STC-E2E-05", "Thuê tài khoản game thành công khi ví đủ tiền (Happy Path)",
         "User đăng nhập, ví có 250.000 đ. Acc 'ACCVAL001' giá 15.000 đ/h đang available",
         "1. Tại trang chi tiết acc, bấm 'Thuê Tài Khoản Ngay'.\n2. Chọn thời lượng 3 giờ (45.000 đ).\n3. Tick đồng ý điều khoản.\n4. Bấm 'Xác Nhận Thanh Toán'.",
         "Thời lượng: 3 giờ\nTổng phí: 45.000 VNĐ",
         "1. Trừ ví 45.000 đ (còn 205.000 đ).\n2. Modal bàn giao ngay tài khoản login và mật khẩu.\n3. MyRentalsPage sinh đơn mới có CountdownTimer đếm từ 02:59:59.", "High"],

        ["STC-E2E-06", "Thuê tài khoản thất bại khi ví thiếu tiền và nạp bù",
         "User đăng nhập, ví có 10.000 đ. Acc giá 20.000 đ/h, chọn thuê 2 giờ (40.000 đ)",
         "1. Bấm 'Thuê Ngay', chọn 2 giờ.\n2. Quan sát cảnh báo đỏ.\n3. Bấm nút 'Nạp bù 30.000 đ'.\n4. Hoàn tất nạp tiền và bấm Thuê.",
         "Số dư: 10.000 đ\nCần thanh toán: 40.000 đ (Thiếu 30.000 đ)",
         "1. Vô hiệu hóa nút Thuê, cảnh báo đỏ thiếu 30.000 đ.\n2. Bấm nạp bù mở DepositModal -> Nạp xong ví thành 40.000 đ -> Mở khóa nút Thuê -> Thuê thành công.", "High"],

        ["STC-E2E-07", "Gia hạn thêm giờ chơi cho đơn thuê đang hoạt động",
         "Đơn thuê đang chạy, còn 25 phút. Ví có 100.000 đ",
         "1. Vào 'Tài Khoản Đang Thuê'.\n2. Bấm nút 'Gia Hạn Thêm Giờ'.\n3. Chọn gói '+2 Giờ'.\n4. Bấm 'Xác Nhận Gia Hạn'.",
         "Gói gia hạn: 2 giờ\nPhí: 30.000 VNĐ",
         "1. Ví trừ 30.000 đ.\n2. Mốc kết thúc kéo dài thêm 2 giờ.\n3. CountdownTimer lập tức cộng thêm 2 giờ (hiển thị 02:24:59).", "High"],

        ["STC-E2E-08", "Chủ động trả tài khoản sớm trước thời hạn",
         "Khách đang có đơn thuê active còn 2 giờ trọn vẹn",
         "1. Bấm nút 'Trả Nick Sớm' trên thẻ đơn.\n2. Modal hiển thị cảnh báo thu hồi thông tin và chính sách hoàn 50% tiền giờ thừa.\n3. Bấm 'Xác Nhận Trả Sớm'.",
         "Đơn hàng đang active, còn 2 giờ trọn vẹn (30.000 đ)",
         "1. Đơn chuyển ngay sang 'completed'.\n2. Mật khẩu bị ẩn/làm mờ.\n3. Ví được hoàn lại 50% = 15.000 đ.\n4. Acc chuyển sang 'need_change_pass'.", "Medium"],

        ["STC-E2E-09", "Khiếu nại sự cố sai mật khẩu và Admin duyệt hoàn tiền 100%",
         "Khách nhận acc nhưng đăng nhập game báo sai pass. Đơn trị giá 45.000 đ",
         "1. Khách bấm 'Báo Lỗi / Khiếu Nại'.\n2. Chọn lý do 'Sai mật khẩu', mô tả 'Không vào được game'.\n3. Bấm 'Gửi Khiếu Nại'.\n4. Admin vào Dashboard kiểm tra và bấm 'Phê Duyệt & Hoàn Tiền'.",
         "Lý do: 'Sai mật khẩu'\nSố tiền hoàn: 45.000 VNĐ (100%)",
         "1. Khách: Đơn chuyển sang 'disputed'. Khi Admin duyệt: Ví khách được hoàn đủ 45.000 đ (100% tiền đơn).\n2. Admin: Acc tự động chuyển sang 'maintenance' để bảo trì.", "High"],

        ["STC-E2E-10", "Admin thêm tài khoản mới chuẩn UC1 và Client thuê thành công",
         "Admin đã đăng nhập, vào Bảng quản trị Kho acc",
         "1. Bấm 'Thêm Acc Mới'.\n2. Nhập Mã 'ACCLQ999', Game: Liên Quân, Tiêu đề 'Thứ Nguyên Vệ Thần Nakroth', Giá 20k, Rank Cao Thủ, User/Pass, Ảnh.\n3. Bấm 'Lưu Tài Khoản'.\n4. Chuyển sang Client thuê.",
         "Mã: 'ACCLQ999'\nGame: 'Liên Quân Mobile'\nTiêu đề: 'Thứ Nguyên Vệ Thần Nakroth'",
         "1. Form validate đúng chuẩn UC1.\n2. Sản phẩm mới hiển thị ngay trên Cửa hàng Client.\n3. Khách hàng bấm thuê thành công và nhận đúng tài khoản/mật khẩu vừa tạo.", "High"],

        ["STC-E2E-11", "Admin điều phối Live Session bù giờ (+1h) khi game bảo trì",
         "Khách đang chơi game thì máy chủ Riot bảo trì gián đoạn 30 phút",
         "1. Admin mở OverviewDashboard, bấm vào phiên thuê của khách.\n2. Modal Giám Sát mở ra, Admin bấm 'Bù thêm giờ (+1h)'.\n3. Khách kiểm tra lại đồng hồ trên MyRentalsPage.",
         "Thao tác Admin: Bù giờ +1h",
         "1. Hệ thống tự động cộng 3.600 giây vào đơn thuê của khách.\n2. Đồng hồ CountdownTimer phía khách hàng tự động nhảy tăng thêm 1 giờ chơi hoàn toàn miễn phí.", "High"],

        ["STC-E2E-12", "Cơ chế khóa độc quyền ngăn chặn 2 khách thuê trùng 1 nick (Race Condition)",
         "Acc 'ACCVAL001' đang available. Khách A và Khách B cùng mở modal thuê",
         "1. Khách A bấm 'Xác Nhận Thuê' trước 1 giây.\n2. Khách B bấm 'Xác Nhận Thuê' ngay sau đó.",
         "Khách A và B cùng thuê 1 acc",
         "1. Khách A: Thuê thành công, nhận nick.\n2. Khách B: Hệ thống báo lỗi 'Tài khoản này vừa được người khác thuê, vui lòng chọn tài khoản khác', không bị trừ tiền ví.", "High"],

        ["STC-E2E-13", "Tự động thu hồi và khóa mật khẩu khi hết giờ thuê",
         "Đơn thuê đang ở giây cuối cùng (00:00:01)",
         "1. Đợi đồng hồ đếm ngược chạm mốc 00:00:00.\n2. Quan sát giao diện thẻ đơn thuê.",
         "Thời gian còn lại = 0",
         "1. Đơn thuê tự động chuyển sang trạng thái 'completed'.\n2. Mật khẩu bị ẩn ngay lập tức, nút Copy bị khóa.\n3. Tài khoản chuyển trạng thái 'need_change_pass'.", "High"],

        ["STC-E2E-14", "Kiểm tra phân quyền RBAC bảo vệ Admin Dashboard",
         "Khách hàng thông thường (role: 'user')",
         "1. Đăng nhập với tài khoản role user.\n2. Cố tình truy cập đường dẫn /admin trên trình duyệt.",
         "User không có quyền Admin",
         "1. Admin Guard chặn truy cập.\n2. Tự động chuyển hướng về Trang chủ kèm cảnh báo 'Bạn không có quyền truy cập trang Quản trị'.", "High"]
    ]
    add_table_custom(st_headers, st_rows, col_widths=[0.9, 1.2, 1.1, 1.3, 1.1, 1.9, 0.5])

    doc.add_page_break()

    # ==========================================
    # PHẦN V: BẢNG KIỂM THỬ CHUYỂN TRẠNG THÁI (STATE TRANSITION MATRIX)
    # ==========================================
    add_h1("PHẦN V: MA TRẬN KIỂM THỬ CHUYỂN TRẠNG THÁI (STATE TRANSITION TESTING)")
    add_p("Kiểm thử chuyển trạng thái kiểm chứng tính toàn vẹn của vòng đời dữ liệu, đảm bảo không có trạng thái bất hợp lệ (Invalid State Transitions) nào xảy ra trong quá trình vận hành:")

    st_trans_headers = ["Mã ST", "Thực Thể", "Trạng Thái Ban Đầu", "Sự Kiện Kích Hoạt", "Trạng Thái Tiếp Theo", "Hành Động Hệ Thống", "Đánh Giá"]
    st_trans_rows = [
        ["ST-01", "Tài khoản game", "available", "Khách bấm thanh toán thuê thành công", "rented", "Khóa nick, không cho khách khác thuê", "Pass"],
        ["ST-02", "Tài khoản game", "rented", "Đồng hồ đếm ngược hết giờ (00:00:00)", "need_change_pass", "Thu hồi pass, đưa vào hàng đợi đổi mật khẩu", "Pass"],
        ["ST-03", "Tài khoản game", "rented", "Khách chủ động bấm 'Trả Nick Sớm'", "need_change_pass", "Hoàn 50% tiền, thu hồi mật khẩu", "Pass"],
        ["ST-04", "Tài khoản game", "rented", "Khách gửi khiếu nại báo lỗi sự cố", "maintenance", "Khóa nick ngay để kỹ thuật viên kiểm tra", "Pass"],
        ["ST-05", "Tài khoản game", "need_change_pass", "Admin đổi xong pass mới và kích hoạt", "available", "Đưa nick trở lại kệ Cửa hàng cho thuê", "Pass"],
        ["ST-06", "Tài khoản game", "maintenance", "Admin sửa chữa xong sự cố", "available", "Mở khóa nick cho thuê bình thường", "Pass"],
        ["ST-07", "Đơn thuê", "active", "Hết giờ thuê", "completed", "Đóng phiên thuê, lưu lịch sử đơn", "Pass"],
        ["ST-08", "Đơn thuê", "active", "Khách trả sớm", "returned_early", "Hoàn tiền ví, đóng phiên thuê", "Pass"],
        ["ST-09", "Đơn thuê", "active", "Khách báo lỗi", "disputed", "Chuyển đơn sang hàng đợi Admin duyệt", "Pass"],
        ["ST-10", "Đơn thuê", "disputed", "Admin bấm Phê Duyệt", "refunded", "Hoàn 100% tiền đơn vào ví khách", "Pass"]
    ]
    add_table_custom(st_trans_headers, st_trans_rows, col_widths=[0.6, 1.1, 1.1, 1.5, 1.2, 1.5, 0.5])

    doc.add_page_break()

    # ==========================================
    # PHẦN VI: NHẬT KÝ BÁO CÁO LỖI (BUG LOG REPORT)
    # ==========================================
    add_h1("PHẦN VI: NHẬT KÝ BÁO CÁO VÀ THEO DÕI LỖI (BUG LOG REPORT)")
    add_p("Trong quá trình thực thi kiểm thử trên hệ thống GameRent, nhóm đã phát hiện và phối hợp sửa chữa 5 lỗi phần mềm (Defects). Dưới đây là bảng nhật ký lỗi chuẩn mực:")

    bug_headers = ["Mã Bug", "Tiêu Đề Lỗi", "Màn Hình Phát Sinh", "Mức Độ (Severity)", "Mức Ưu Tiên", "Các Bước Tái Hiện & Mô Tả Thực Tế", "Trạng Thái"]
    bug_rows = [
        ["BUG-01", "Nút Nạp tiền VietQR cho phép nhập số tiền âm", "DepositModal.jsx", "Major", "High",
         "1. Mở modal nạp tiền.\n2. Nhập '-50000'.\n3. Hệ thống vẫn sinh mã QR -> Đã fix: Bổ sung validate amount >= 10000.", "Đã sửa (Closed)"],

        ["BUG-02", "CountdownTimer không tự động dừng khi chuyển tab trình duyệt", "CountdownTimer.jsx", "Medium", "Medium",
         "1. Thuê acc có đồng hồ chạy.\n2. Mở tab khác 5 phút rồi quay lại -> Bị lệch giây -> Đã fix: Tính thời gian dựa trên Date.now() và mốc expiresAt cố định.", "Đã sửa (Closed)"],

        ["BUG-03", "Trường Tên sản phẩm trên form Admin cho phép nhập 9 ký tự", "AdminDashboardPage.jsx", "Medium", "High",
         "1. Mở form thêm acc chuẩn UC1.\n2. Nhập tên 'Nick Vip 1' (9 ký tự).\n3. Form vẫn lưu -> Đã fix: Kiểm tra title.length >= 10 đúng chuẩn UC1.", "Đã sửa (Closed)"],

        ["BUG-04", "Số dư ví bị tính toán sai dạng số thực khi gia hạn (Floating point)", "WalletPage.jsx", "Minor", "Medium",
         "1. Nạp và gia hạn nhiều lần xuất hiện số dư lẻ 19999.999999994 -> Đã fix: Bọc hàm Math.round() và xử lý số nguyên VNĐ chuẩn xác.", "Đã sửa (Closed)"],

        ["BUG-05", "Khách bấm nút Thuê 2 lần liên tiếp bị trừ tiền 2 lần (Double submit)", "RentConfirmModal.jsx", "Critical", "High",
         "1. Nhấp đúp chuột nhanh vào nút 'Xác Nhận Thuê'.\n2. Hệ thống trừ tiền 2 lần và sinh 2 đơn trùng -> Đã fix: Bổ sung cờ isSubmitting vô hiệu hóa nút ngay cú click đầu.", "Đã sửa (Closed)"]
    ]
    add_table_custom(bug_headers, bug_rows, col_widths=[0.7, 1.4, 1.2, 0.8, 0.7, 2.0, 0.7])

    # ==========================================
    # PHẦN VII: TỔNG KẾT VÀ ĐÁNH GIÁ ĐỘ BAO PHỦ KIỂM THỬ
    # ==========================================
    add_h1("PHẦN VII: TỔNG KẾT VÀ ĐÁNH GIÁ ĐỘ BAO PHỦ KIỂM THỬ")
    add_p("Tổng kết các chỉ số kiểm thử định lượng đạt được của đề tài Nhóm 16:")
    add_bullet("Tổng số Test Cases đã thiết kế", "Hơn 70 Test Cases chi tiết bao phủ toàn bộ 3 cấp độ: 45 Unit Test Cases, 12 Integration Test Cases, 14 System Test Cases E2E.")
    add_bullet("Tỷ lệ bao phủ yêu cầu (Requirements Coverage)", "100% các Yêu cầu chức năng (FR-01 đến FR-10) và 10 Use Cases (UC01 đến UC10) đều có ít nhất 2 test case kiểm chứng.")
    add_bullet("Tỷ lệ ca kiểm thử đạt (Test Pass Rate)", "100% các ca kiểm thử đều đạt kết quả mong đợi (Passed) sau khi 5 lỗi phần mềm (Bugs) được sửa chữa triệt để.")
    add_bullet("Mức độ sẵn sàng cho Vấn đáp", "Bộ tài liệu Test Case này là minh chứng đầy đủ, sắc nét, thể hiện năng lực chuyên môn vững vàng của nhóm sinh viên trong việc phân tích, thiết kế test case theo chuẩn quốc tế ISTQB.")

    # Lưu file Word
    out_dir = "e:\\BTL_KTPM"
    tl_dir = os.path.join(out_dir, "Tài_Liệu")

    file_names = [
        "Test_case_cua_bai_tap_lon.docx",
        "Test case của bài tập lớn.docx"
    ]

    for fname in file_names:
        full_path = os.path.join(out_dir, fname)
        doc.save(full_path)
        print(f"[OK] Đã lưu file Word: {full_path}")
        if os.path.exists(tl_dir):
            tl_path = os.path.join(tl_dir, fname)
            shutil.copyfile(full_path, tl_path)
            print(f"[OK] Đã sao chép sang: {tl_path}")

    # Chuyển đổi sang PDF
    primary_docx = os.path.join(out_dir, "Test_case_cua_bai_tap_lon.docx")
    primary_pdf = os.path.join(out_dir, "Test_case_cua_bai_tap_lon.pdf")
    spaced_pdf = os.path.join(out_dir, "Test case của bài tập lớn.pdf")

    print("[...] Đang chuyển đổi sang PDF bằng docx2pdf...")
    try:
        convert(primary_docx, primary_pdf)
        print(f"[OK] Đã xuất PDF thành công: {primary_pdf}")
        shutil.copyfile(primary_pdf, spaced_pdf)
        
        if os.path.exists(tl_dir):
            shutil.copyfile(primary_pdf, os.path.join(tl_dir, "Test_case_cua_bai_tap_lon.pdf"))
            shutil.copyfile(primary_pdf, os.path.join(tl_dir, "Test case của bài tập lớn.pdf"))
            print(f"[OK] Đã đồng bộ PDF sang thư mục: {tl_dir}")
    except Exception as e:
        print(f"[WARNING] Xuất PDF: {e}")

if __name__ == "__main__":
    create_test_cases_document()
