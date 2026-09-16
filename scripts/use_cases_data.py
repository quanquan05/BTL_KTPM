# -*- coding: utf-8 -*-
"""
Full Generator for:
1. 1_Dac_Ta_Yeu_Cau_Phan_Mem.docx & .pdf (Cột 1: Đặc tả yêu cầu)
2. 2_Tai_Lieu_Yeu_Cau_He_Thong.docx & .pdf (Cột 2: Tài liệu yêu cầu hệ thống)
3. Dac_Ta_Yeu_Cau_Va_Tai_Lieu_Yeu_Cau_He_Thong.docx & .pdf (Bản gộp 2-in-1 hoàn chỉnh)

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

NAVY = RGBColor(26, 54, 93)       # #1A365D
BLUE = RGBColor(43, 108, 176)     # #2B6CB0
EMERALD = RGBColor(16, 185, 129)  # #10B981
DARK_GRAY = RGBColor(45, 55, 72)  # #2D3748
TEXT_COLOR = RGBColor(33, 37, 41)
ORANGE = RGBColor(234, 88, 12)
RED = RGBColor(225, 29, 72)

def set_cell_background(cell, fill_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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

def create_doc_base():
    doc = docx.Document()
    for section in doc.sections:
        section.top_margin = Inches(0.79)     # 2cm
        section.bottom_margin = Inches(0.79)  # 2cm
        section.left_margin = Inches(1.18)    # 3cm
        section.right_margin = Inches(0.79)   # 2cm
        section.page_width = Inches(8.27)     # A4
        section.page_height = Inches(11.69)   # A4
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = TEXT_COLOR
    style_normal.paragraph_format.line_spacing = 1.25
    style_normal.paragraph_format.space_after = Pt(4)
    return doc

def add_p(doc, text="", bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, color=TEXT_COLOR, font_size=12):
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

def add_h1(doc, title):
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

def add_h2(doc, title):
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

def add_h3(doc, title):
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

def add_table_custom(doc, headers, rows, col_widths=None, header_bg="1A365D"):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=110, bottom=110, left=130, right=130)
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
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=110, right=110)
            p = row_cells[c_idx].paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            if c_idx == 0:
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

def add_cover_page(doc, doc_title_main, doc_sub_title, col_label):
    add_p(doc, "BỘ GIÁO DỤC VÀ ĐÀO TẠO", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2)
    add_p(doc, "TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=2, color=NAVY)
    add_p(doc, "KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=24)

    add_p(doc, "─────────── ★ ───────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, color=BLUE)

    add_p(doc, "BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=4, color=ORANGE)
    add_p(doc, f"SẢN PHẨM CÔNG VIỆC CÓ SẴN (CỘT {col_label})", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=10, color=BLUE)
    add_p(doc, doc_title_main, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=17, space_after=10, color=NAVY)
    add_p(doc, doc_sub_title, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=20, color=DARK_GRAY)

    add_p(doc, "HỌC PHẦN: KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=4, color=NAVY)
    add_p(doc, "LỚP TÍN CHỈ: Kiểm thử phần mềm-1-1-26(N05)  ·  NHÓM: 16", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=20, color=EMERALD)

    add_p(doc, "TÊN ĐỀ TÀI PHÂN CÔNG:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)
    add_p(doc, "KIỂM THỬ ỨNG DỤNG WEBSITE CHO THUÊ TÀI KHOẢN GAME (GAMERENT)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=15, space_after=24, color=NAVY)

    add_p(doc, "──────────────────────────────────────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16, color=BLUE)

    add_p(doc, "Giảng viên hướng dẫn: ThS. Phạm Thị Loan", bold=True, font_size=12, space_after=4)
    add_p(doc, "Nhóm sinh viên thực hiện (Nhóm 16):", bold=True, font_size=12, space_after=2)
    add_p(doc, "  1. Lê Hải Đăng    - Mã SV: .................... - Lớp: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p(doc, "  2. Lê Minh Quân   - Mã SV: .................... - Lớp: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p(doc, "  3. Lê Xuân Đạt    - Mã SV: .................... - Lớp: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p(doc, "  4. Lê Thanh Tùng  - Mã SV: .................... - Lớp: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=8)
    add_p(doc, "Học kỳ I - Năm học 2026 - 2027", font_size=11.5, space_after=24)

    add_p(doc, "BẮC NINH / HÀ NỘI – NĂM 2026", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=0, color=NAVY)
    doc.add_page_break()

    # Bảng phân công bài tập lớn
    add_h1(doc, "BẢNG THEO DÕI SẢN PHẨM CÔNG VIỆC THEO PHÂN CÔNG GIẢNG VIÊN")
    add_p(doc, "(Căn cứ Danh sách phân công bài tập lớn lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05))", italic=True, font_size=11, space_after=8)
    tbl_headers = ["Tiêu chí phân công", "Thông tin chi tiết của Nhóm 16"]
    tbl_rows = [
        ["Lớp tín chỉ", "Kiểm thử phần mềm-1-1-26(N05)"],
        ["Số thứ tự nhóm", "Nhóm 16 (Được giảng viên phân công chính thức)"],
        ["Tên đề tài chính thức", "Kiểm thử ứng dụng website cho thuê tài khoản game (GameRent)"],
        ["Sản phẩm có sẵn - Cột 1", "Đặc tả yêu cầu (Tài liệu đặc tả ca sử dụng Use Case Specifications) - ĐÃ HOÀN THIỆN 100%"],
        ["Sản phẩm có sẵn - Cột 2", "Tài liệu yêu cầu hệ thống (System Requirements Document - SRD) - ĐÃ HOÀN THIỆN 100%"],
        ["Sản phẩm có sẵn - Cột 3", "Code chương trình chạy được (Website GameRent - React, Vite, LocalStorage Engine, VietQR) - ĐÃ HOÀN THIỆN 100%"],
        ["Đã viết Chương 1", "Chương 1: Tổng quan bài toán & Đặc tả hệ thống - ĐÃ HOÀN THIỆN 100%"],
        ["Đã viết Chương 2", "Chương 2: Phân tích và thiết kế test (Unit, Integration, System Test) - ĐÃ HOÀN THIỆN 100%"]
    ]
    add_table_custom(doc, tbl_headers, tbl_rows, col_widths=[2.2, 4.4])
    doc.add_page_break()

def add_use_case_form_table(doc, uc):
    headers = ["Mục thông tin", "Chi tiết đặc tả (Chuẩn form mẫu giảng viên)"]
    rows = [
        ["Chức năng (Function)", uc.get("function", "")],
        ["Mã & Tên Use Case (UC ID & Name)", f"{uc.get('id', '')}: {uc.get('name', '')}"],
        ["Người tạo & Ngày tạo (Created By & Date)", f"Nhóm 16 - Lớp Kiểm thử PM-1-1-26(N05) | Ngày tạo: {uc.get('date', '15/09/2026')}"],
        ["Tác tử chính (Primary Actor)", uc.get("primary_actor", "")],
        ["Tác tử phụ (Secondary Actor)", uc.get("secondary_actor", "None")],
        ["Sự kiện kích hoạt (Trigger)", uc.get("trigger", "")],
        ["Mô tả tóm tắt (Description)", uc.get("description", "")],
        ["Tiền điều kiện (Preconditions)", uc.get("preconditions", "")],
        ["Hậu điều kiện (Postconditions)", uc.get("postconditions", "")],
        ["Luồng sự kiện chính (Normal Flow)", uc.get("normal_flow", "")],
        ["Luồng thay thế (Alternative Flows)", uc.get("alt_flow", "N/A")],
        ["Các ngoại lệ (Exceptions)", uc.get("exceptions", "")],
        ["Độ ưu tiên (Priority)", uc.get("priority", "High")],
        ["Quy tắc nghiệp vụ (Business Rules)", uc.get("business_rules", "")],
        ["Ghi chú QA & Kiểm thử (Other Info / QA Notes)", uc.get("other_info", "Thực hiện kiểm thử Unit, Integration và System Test tương ứng theo kịch bản.")]
    ]
    add_table_custom(doc, headers, rows, col_widths=[1.9, 4.7], header_bg="2B6CB0")

# ==============================================================================
# DATA DEFINITIONS FOR ALL 10 USE CASES (CHUẨN FORM GIẢNG VIÊN NHƯ UC1_ADD NEW PRODUCT)
# ==============================================================================
USE_CASES_DATA = [
    {
        "id": "UC01",
        "name": "Đăng nhập hệ thống (Login)",
        "function": "Xác thực người dùng và phân quyền truy cập hệ thống (Authentication & RBAC)",
        "primary_actor": "Người dùng (Khách hàng hoặc Quản trị viên - Admin)",
        "secondary_actor": "None",
        "trigger": "Người dùng bấm nút 'Đăng nhập' trên thanh điều hướng (Navbar).",
        "description": "Người dùng đăng nhập vào hệ thống GameRent bằng Tên đăng nhập và Mật khẩu để thực hiện các chức năng thành viên (nạp tiền, thuê nick, quản trị kho acc).",
        "preconditions": "PRE-1: Người dùng đã mở website GameRent trên trình duyệt.\nPRE-2: Người dùng đã có tài khoản hợp lệ được lưu trữ trong CSDL.",
        "postconditions": "POST-1: Người dùng đăng nhập thành công, phiên đăng nhập được lưu trữ (LocalStorage/Auth Token).\nPOST-2: Giao diện chuyển đổi sang trạng thái đã đăng nhập (hiển thị Avatar, Tên, Số dư ví, Menu quản trị nếu là Admin).",
        "normal_flow": "1.0: Đăng nhập vào hệ thống\n"
                       "1. Người dùng bấm nút 'Đăng nhập' trên thanh Navbar.\n"
                       "2. Hệ thống hiển thị Modal Đăng nhập với các trường: Tên đăng nhập / Email và Mật khẩu.\n"
                       "3. Người dùng nhập tên đăng nhập và mật khẩu hợp lệ, sau đó bấm nút 'Đăng Nhập Ngay'.\n"
                       "4. Hệ thống kiểm tra tính hợp lệ dữ liệu và đối soát tài khoản trong CSDL (xem 1.0.E1, 1.0.E2, 1.0.E3).\n"
                       "5. Hệ thống xác thực thành công, ghi nhận phiên đăng nhập, đóng Modal và hiển thị Toast thông báo 'Đăng nhập thành công! Chào mừng trở lại'.",
        "alt_flow": "1.0.A1: Đăng nhập nhanh bằng tài khoản Demo\n"
                    "Tại bước 3, người dùng có thể bấm các nút đăng nhập nhanh 'Khách hàng Demo' hoặc 'Quản trị viên Admin' có sẵn trên modal. Hệ thống tự động điền thông tin tương ứng và đăng nhập tức thì.",
        "exceptions": "1.0.E1 Bỏ trống trường bắt buộc:\n"
                      "1. Hệ thống hiển thị thông báo lỗi màu đỏ dưới trường tương ứng: '{Tên trường} không được để trống'.\n"
                      "2. Người dùng nhập lại thông tin và quay lại bước 4 của Normal Flow.\n"
                      "1.0.E2 Tài khoản không tồn tại:\n"
                      "1. Hệ thống hiển thị lỗi 'Tài khoản không tồn tại trên hệ thống, vui lòng kiểm tra lại'.\n"
                      "1.0.E3 Sai mật khẩu:\n"
                      "1. Hệ thống hiển thị thông báo 'Mật khẩu không chính xác'.\n"
                      "1.0.E4 Tài khoản bị khóa:\n"
                      "1. Hệ thống hiển thị 'Tài khoản của bạn đã bị tạm khóa do vi phạm chính sách'.",
        "priority": "High",
        "business_rules": "BR1. Tên đăng nhập có độ dài từ 4 đến 30 ký tự, không chứa ký tự đặc biệt.\n"
                          "BR2. Mật khẩu có độ dài tối thiểu 6 ký tự.\n"
                          "BR3. Phân quyền người dùng (Role): role='admin' được truy cập Dashboard quản trị; role='user' chỉ truy cập các tính năng thuê và ví cá nhân.\n"
                          "BR4. Mật khẩu được ẩn mặc định dạng password, có nút con mắt bật/tắt xem mật khẩu.",
        "other_info": "Tần suất thực hiện rất cao. Cần đảm bảo thời gian xác thực dưới 500ms."
    },
    {
        "id": "UC02",
        "name": "Đăng ký tài khoản mới (Register)",
        "function": "Tạo tài khoản người dùng mới tham gia hệ thống",
        "primary_actor": "Khách vãng lai (Guest)",
        "secondary_actor": "None",
        "trigger": "Khách vãng lai bấm nút 'Đăng ký' hoặc chuyển tab Đăng ký trong AuthModal.",
        "description": "Khách hàng nhập thông tin đăng ký (Tên đăng nhập, Mật khẩu, Nhập lại mật khẩu, Số điện thoại) để tạo tài khoản mới và nhận 50.000đ tiền thưởng chào mừng.",
        "preconditions": "PRE-1: Khách hàng chưa đăng nhập vào hệ thống.",
        "postconditions": "POST-1: Tài khoản mới được ghi nhận vào CSDL với số dư ví khởi tạo 50.000đ.\nPOST-2: Hệ thống tự động đăng nhập tài khoản vừa tạo và chuyển hướng về trang chủ.",
        "normal_flow": "1.0: Nhập thông tin đăng ký\n"
                       "1. Khách bấm nút 'Đăng ký' trên thanh Navbar.\n"
                       "2. Hệ thống hiển thị tab Đăng ký tài khoản mới.\n"
                       "3. Khách nhập các trường: Tên đăng nhập, Mật khẩu, Xác nhận mật khẩu, Số điện thoại.\n"
                       "4. Khách bấm nút 'Tạo Tài Khoản'.\n"
                       "5. Hệ thống kiểm tra ràng buộc dữ liệu (xem 1.0.E1 -> 1.0.E4).\n"
                       "6. Hệ thống lưu tài khoản mới, cấp 50.000đ khuyến mãi ví, tự động đăng nhập và hiển thị thông báo chúc mừng.",
        "alt_flow": "N/A",
        "exceptions": "1.0.E1 Trường thông tin bắt buộc để trống:\n"
                      "1. Hệ thống báo lỗi: '{Tên trường} không được để trống'.\n"
                      "1.0.E2 Tên đăng nhập đã tồn tại:\n"
                      "1. Hệ thống báo lỗi: 'Tên đăng nhập đã tồn tại trong hệ thống, vui lòng chọn tên khác'.\n"
                      "1.0.E3 Mật khẩu xác nhận không khớp:\n"
                      "1. Hệ thống báo lỗi: 'Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập'.\n"
                      "1.0.E4 Định dạng số điện thoại không hợp lệ:\n"
                      "1. Hệ thống báo lỗi: 'Số điện thoại phải gồm đúng 10 chữ số hợp lệ'.",
        "priority": "High",
        "business_rules": "BR1. Tên đăng nhập là duy nhất, độ dài 4 - 30 ký tự, không chứa khoảng trắng.\n"
                          "BR2. Mật khẩu tối thiểu 6 ký tự.\n"
                          "BR3. Số điện thoại đúng định dạng chuẩn di động Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09, độ dài 10 chữ số).\n"
                          "BR4. Mỗi tài khoản đăng ký mới được cộng 50.000đ tiền thưởng vào ví dùng thử.",
        "other_info": "Bao phủ đầy đủ các ca kiểm thử BVA độ dài username, password và phone number."
    },
    {
        "id": "UC03",
        "name": "Tìm kiếm và lọc kho tài khoản game (Search & Filter Accounts)",
        "function": "Tra cứu và hiển thị danh sách nick game theo tiêu chí",
        "primary_actor": "Khách hàng & Khách vãng lai",
        "secondary_actor": "None",
        "trigger": "Người dùng thao tác thanh tìm kiếm hoặc bộ lọc game tại trang chủ.",
        "description": "Người dùng tìm kiếm theo tên/skin/rank, lọc theo tựa game (Valorant, Liên Quân, Genshin...), lọc theo khoảng giá thuê và sắp xếp giá tăng/giảm.",
        "preconditions": "PRE-1: Người dùng đang truy cập trang chủ Cửa hàng (HomePage).",
        "postconditions": "POST-1: Danh sách tài khoản game hiển thị chính xác tương ứng với bộ lọc đã chọn.",
        "normal_flow": "1.0: Lọc danh sách tài khoản\n"
                       "1. Người dùng chọn tab tựa game (ví dụ: 'Liên Quân Mobile').\n"
                       "2. Người dùng nhập từ khóa tìm kiếm (ví dụ: 'Nakroth Thứ Nguyên').\n"
                       "3. Người dùng chọn khoảng giá thuê (ví dụ: '10.000đ - 25.000đ/h').\n"
                       "4. Hệ thống lọc danh sách nick trong kho thời gian thực (< 100ms).\n"
                       "5. Hiển thị danh sách thẻ tài khoản kèm ảnh đại diện, giá/giờ, rank, server, trạng thái 'Sẵn sàng' và nút 'Thuê Ngay'.",
        "alt_flow": "1.0.A1: Không tìm thấy kết quả phù hợp\n"
                    "Nếu không có tài khoản nào thỏa mãn bộ lọc, hệ thống hiển thị Empty State: 'Không tìm thấy tài khoản phù hợp với từ khóa đã chọn. Vui lòng thử lại!'",
        "exceptions": "1.0.E1 Từ khóa chứa ký tự nguy hiểm / script injection:\n"
                      "Hệ thống tự động sanitize và loại bỏ thẻ HTML, không gây lỗi hệ thống.",
        "priority": "High",
        "business_rules": "BR1. Chỉ hiển thị các nick có trạng thái 'available' lên đầu trang.\n"
                          "BR2. Các nick đang thuê 'rented' hoặc bảo trì 'maintenance' vẫn hiển thị nhưng gắn nhãn trạng thái và làm mờ nút thuê.\n"
                          "BR3. Phân trang tối đa 12 nick mỗi trang, hỗ trợ cuộn mượt mà.",
        "other_info": "Là màn hình chính tiếp cận người dùng, kiểm thử giao diện Responsive và tốc độ lọc tức thì."
    },
    {
        "id": "UC04",
        "name": "Nạp tiền ví điện tử qua VietQR (Deposit Wallet via VietQR)",
        "function": "Quản lý số dư ví và tạo mã QR chuyển khoản ngân hàng tự động",
        "primary_actor": "Khách hàng (Customer)",
        "secondary_actor": "Hệ thống Cổng thanh toán VietQR",
        "trigger": "Khách hàng bấm nút 'Nạp tiền' tại trang Ví hoặc thanh Navbar.",
        "description": "Khách hàng nhập số tiền muốn nạp (từ 10.000đ đến 5.000.000đ), hệ thống sinh mã VietQR chuẩn ngân hàng kèm nội dung chuyển khoản tự động để cộng tiền vào ví.",
        "preconditions": "PRE-1: Khách hàng đã đăng nhập tài khoản vào hệ thống.",
        "postconditions": "POST-1: Giao dịch nạp tiền được tạo với mã GD duy nhất.\nPOST-2: Số dư ví của khách hàng được cộng thêm số tiền nạp tương ứng ngay sau khi xác nhận.",
        "normal_flow": "1.0: Tạo yêu cầu nạp tiền\n"
                       "1. Khách hàng bấm nút 'Nạp Tiền' để mở Modal Nạp tiền VietQR.\n"
                       "2. Khách hàng chọn mệnh giá nhanh (20k, 50k, 100k, 200k, 500k) hoặc tự nhập số tiền tùy ý.\n"
                       "3. Khách hàng chọn phương thức thanh toán: 'Chuyển khoản VietQR 24/7' hoặc 'Thẻ cào tự động'.\n"
                       "4. Khách hàng bấm 'Tạo Mã Thanh Toán VietQR'.\n"
                       "5. Hệ thống kiểm tra số tiền nạp hợp lệ (xem 1.0.E1, 1.0.E2) và sinh mã VietQR động chứa số tài khoản, tên ngân hàng MBBank, số tiền và nội dung chuyển khoản 'NAP [UserID]'.\n"
                       "6. Khách hàng quét mã QR trên App Ngân hàng và bấm 'Xác nhận đã chuyển tiền'.\n"
                       "7. Hệ thống cập nhật số dư ví, lưu lịch sử giao dịch và hiển thị Toast thành công.",
        "alt_flow": "N/A",
        "exceptions": "1.0.E1 Số tiền nạp nhỏ hơn hạn mức tối thiểu 10.000đ:\n"
                      "1. Hệ thống báo lỗi: 'Số tiền nạp tối thiểu là 10.000đ'.\n"
                      "1.0.E2 Số tiền nạp vượt quá hạn mức 5.000.000đ:\n"
                      "1. Hệ thống báo lỗi: 'Số tiền nạp tối đa cho một lần là 5.000.000đ'.\n"
                      "1.0.E3 Số tiền nạp không phải số nguyên dương:\n"
                      "1. Hệ thống báo lỗi: 'Vui lòng nhập số tiền hợp lệ'.",
        "priority": "High",
        "business_rules": "BR1. Số tiền nạp tối thiểu: 10.000đ; Tối đa: 5.000.000đ trên mỗi giao dịch.\n"
                          "BR2. Nội dung chuyển khoản bắt buộc theo cú pháp chuẩn để hệ thống tự động khớp lệnh: NAP {USERNAME}.\n"
                          "BR3. Số dư ví không được phép âm trong mọi tình huống.",
        "other_info": "Cần kiểm thử Unit Test cho hàm tính số dư và hàm sinh nội dung chuyển khoản."
    },
    {
        "id": "UC05",
        "name": "Thuê tài khoản game tức thì (Rent Game Account)",
        "function": "Đặt thuê tài khoản game, trừ tiền ví và bàn giao thông tin đăng nhập tự động",
        "primary_actor": "Khách hàng (Customer)",
        "secondary_actor": "Tiến trình định thời (Timer Engine)",
        "trigger": "Khách hàng bấm nút 'Thuê Ngay' trên thẻ tài khoản game.",
        "description": "Khách hàng chọn số giờ thuê (1h, 2h, 3h, 5h, 12h, 24h), xem chi tiết thanh toán, bấm xác nhận thuê. Hệ thống trừ tiền ví, chuyển trạng thái nick sang 'rented', khởi động đồng hồ đếm ngược và bàn giao tài khoản/mật khẩu ngay lập tức.",
        "preconditions": "PRE-1: Khách hàng đã đăng nhập hệ thống.\nPRE-2: Tài khoản game đang ở trạng thái 'available'.",
        "postconditions": "POST-1: Đơn thuê mới (RentalOrder) được tạo với trạng thái 'active'.\nPOST-2: Số dư ví bị trừ đúng bằng: (Giá/h * Số giờ thuê) - Giảm giá.\nPOST-3: Tài khoản game chuyển trạng thái sang 'rented' để ngăn người khác thuê trùng.\nPOST-4: Khách hàng được chuyển sang trang 'Tài khoản đang thuê' để nhận mật khẩu.",
        "normal_flow": "1.0: Xác nhận đặt thuê tài khoản\n"
                       "1. Khách hàng bấm 'Thuê Ngay' tại trang chi tiết tài khoản hoặc danh sách.\n"
                       "2. Hệ thống hiển thị Modal Xác nhận thuê: Tên nick, Game, Giá/h, Bộ chọn số giờ thuê, Ô nhập mã giảm giá và Tổng tiền thanh toán.\n"
                       "3. Khách hàng điều chỉnh số giờ thuê (mặc định 2 giờ) và nhập mã voucher (nếu có).\n"
                       "4. Khách hàng bấm 'Xác Nhận Thanh Toán & Thuê Nick'.\n"
                       "5. Hệ thống kiểm tra tính khả dụng của nick và số dư ví (xem 1.0.E1, 1.0.E2, 1.0.E3).\n"
                       "6. Hệ thống thực hiện trừ tiền ví, tạo đơn thuê, chuyển trạng thái nick sang 'rented', kích hoạt Timer đếm ngược.\n"
                       "7. Hệ thống đóng modal, chuyển hướng đến trang 'Tài Khoản Đang Thuê' và hiển thị Toast chúc mừng.",
        "alt_flow": "1.0.A1: Khách hàng chưa đăng nhập\n"
                    "Tại bước 1, nếu khách chưa đăng nhập, hệ thống tự động mở AuthModal yêu cầu đăng nhập trước khi tiếp tục.",
        "exceptions": "1.0.E1 Số dư ví không đủ:\n"
                      "1. Hệ thống báo lỗi: 'Số dư ví không đủ để thanh toán. Vui lòng nạp thêm tiền!'.\n"
                      "2. Hiển thị nút bấm 'Nạp tiền ngay' mở trực tiếp DepositModal.\n"
                      "1.0.E2 Tài khoản game vừa bị người khác thuê trước (Race condition):\n"
                      "1. Hệ thống báo lỗi: 'Rất tiếc! Tài khoản này vừa được khách hàng khác thuê. Vui lòng chọn tài khoản khác!'.\n"
                      "1.0.E3 Số giờ thuê không hợp lệ (nhỏ hơn 1 hoặc lớn hơn 72 giờ):\n"
                      "1. Hệ thống báo lỗi: 'Thời gian thuê phải từ 1 đến 72 giờ'.",
        "priority": "Critical",
        "business_rules": "BR1. Công thức tính tiền: Tổng tiền = (Giá_mỗi_giờ * Số_giờ_thuê) - Giảm_giá.\n"
                          "BR2. Chỉ tài khoản có status == 'available' mới được phép khởi tạo đơn thuê.\n"
                          "BR3. Khi thanh toán thành công, hệ thống khóa nick ngay lập tức để đảm bảo tính độc quyền.",
        "other_info": "Đây là Use Case lõi của toàn bộ hệ thống GameRent, kiểm thử kỹ thuật phân vùng tương đương và kiểm thử chịu tải."
    },
    {
        "id": "UC06",
        "name": "Giám sát phiên thuê & Xem thông tin đăng nhập (Live Timer & Account Secret)",
        "function": "Hiển thị đồng hồ đếm ngược thời gian thực, tài khoản và mật khẩu nick game cho khách thuê",
        "primary_actor": "Khách hàng (Customer)",
        "secondary_actor": "None",
        "trigger": "Khách hàng truy cập trang 'Tài khoản đang thuê' (MyRentalsPage).",
        "description": "Khách hàng xem danh sách các phiên thuê còn hiệu lực, theo dõi đồng hồ đếm ngược từng giây (HH:MM:SS), xem tên tài khoản, bật/tắt hiện mật khẩu và bấm nút Copy 1-click để vào game.",
        "preconditions": "PRE-1: Khách hàng đã đăng nhập và có ít nhất 1 phiên thuê đang hoạt động (active).",
        "postconditions": "POST-1: Khách hàng nắm bắt được thông tin đăng nhập chính xác để chơi game mà không bị gián đoạn.",
        "normal_flow": "1.0: Xem thông tin phiên thuê\n"
                       "1. Khách hàng mở trang 'Tài khoản đang thuê'.\n"
                       "2. Hệ thống tải danh sách các đơn thuê active của người dùng.\n"
                       "3. Đồng hồ đếm ngược CountdownTimer hiển thị thời gian còn lại, tự động giảm mỗi 1 giây.\n"
                       "4. Khách hàng bấm biểu tượng con mắt để xem mật khẩu bàn giao.\n"
                       "5. Khách hàng bấm nút 'Copy Mật Khẩu' hoặc 'Copy Tài Khoản'. Hệ thống lưu vào Clipboard và hiển thị Toast 'Đã sao chép thành công'.",
        "alt_flow": "1.0.A1: Phiên thuê hết hạn trong lúc đang xem trang\n"
                    "Khi đồng hồ đếm ngược về 00:00:00, hệ thống tự động chuyển trạng thái đơn sang 'expired', làm mờ mật khẩu và hiển thị nhãn 'Đã hết giờ thuê'.",
        "exceptions": "1.0.E1 Không có phiên thuê nào:\n"
                      "Hệ thống hiển thị màn hình trống kèm nút 'Khám phá kho acc ngay' dẫn về trang chủ.",
        "priority": "High",
        "business_rules": "BR1. Mật khẩu hiển thị ẩn dạng '••••••••' mặc định để bảo mật.\n"
                          "BR2. Tính năng Copy chỉ kích hoạt khi phiên thuê còn thời hạn hợp lệ.\n"
                          "BR3. Khi còn dưới 15 phút, đồng hồ chuyển sang màu đỏ cảnh báo sắp hết giờ.",
        "other_info": "Kiểm thử Unit test cho component CountdownTimer và cơ chế cập nhật state mỗi giây."
    },
    {
        "id": "UC07",
        "name": "Gia hạn thời gian thuê tài khoản (Extend Rental Duration)",
        "function": "Cộng thêm giờ chơi cho phiên thuê hiện tại mà không bị đổi mật khẩu hoặc ngắt quãng",
        "primary_actor": "Khách hàng (Customer)",
        "secondary_actor": "None",
        "trigger": "Khách hàng bấm nút 'Gia Hạn Giờ' trên thẻ phiên thuê tại MyRentalsPage.",
        "description": "Khách hàng chọn số giờ muốn gia hạn thêm (1h, 2h, 3h...). Hệ thống kiểm tra số dư ví, trừ tiền tương ứng và cộng trực tiếp số giờ vào thời gian hết hạn (expiresAt).",
        "preconditions": "PRE-1: Phiên thuê của tài khoản đang ở trạng thái 'active'.\nPRE-2: Số dư ví của khách hàng đủ để trả tiền số giờ gia hạn.",
        "postconditions": "POST-1: Thời gian kết thúc đơn thuê (expiresAt) được cộng thêm số giờ vừa mua.\nPOST-2: Số dư ví khách hàng bị trừ tương ứng.\nPOST-3: Giao dịch gia hạn được lưu vào lịch sử giao dịch ví.",
        "normal_flow": "1.0: Thực hiện gia hạn giờ thuê\n"
                       "1. Khách hàng bấm nút 'Gia Hạn Thêm Giờ' trên thẻ phiên thuê.\n"
                       "2. Hệ thống hiển thị Modal Gia Hạn kèm số giờ muốn cộng thêm và tổng tiền.\n"
                       "3. Khách hàng chọn số giờ cần gia hạn (ví dụ: +2 giờ).\n"
                       "4. Khách hàng bấm 'Xác Nhận Gia Hạn'.\n"
                       "5. Hệ thống kiểm tra số dư ví (xem 1.0.E1).\n"
                       "6. Hệ thống trừ tiền ví, cộng thêm thời gian vào đơn thuê hiện tại, cập nhật đồng hồ đếm ngược và hiển thị Toast thành công.",
        "alt_flow": "N/A",
        "exceptions": "1.0.E1 Số dư ví không đủ để gia hạn:\n"
                      "1. Hệ thống báo lỗi: 'Số dư ví không đủ để gia hạn. Vui lòng nạp thêm tiền!'.\n"
                      "1.0.E2 Phiên thuê đã hết hạn trước khi kịp bấm gia hạn:\n"
                      "1. Hệ thống báo: 'Phiên thuê đã kết thúc. Vui lòng tạo đơn thuê mới'.",
        "priority": "Medium",
        "business_rules": "BR1. Đơn giá gia hạn mỗi giờ bằng đúng đơn giá thuê gốc của tài khoản.\n"
                          "BR2. Không thay đổi thông tin đăng nhập trong suốt quá trình gia hạn nối tiếp.",
        "other_info": "Bảo đảm trải nghiệm chơi game liên tục cho game thủ khi đang leo rank."
    },
    {
        "id": "UC08",
        "name": "Trả tài khoản sớm & Báo lỗi sự cố / Khiếu nại hoàn tiền (Return Early & Dispute)",
        "function": "Hỗ trợ khách hàng trả nick khi không còn nhu cầu chơi hoặc khiếu nại hoàn tiền khi nick gặp lỗi",
        "primary_actor": "Khách hàng (Customer)",
        "secondary_actor": "Quản trị viên (Admin)",
        "trigger": "Khách bấm nút 'Trả Nick Sớm' hoặc 'Báo Lỗi / Khiếu Nại' trên phiên thuê.",
        "description": "Khách hàng hoàn trả nick trước hạn (hệ thống đổi pass, hoàn lại 50% số giờ chưa chơi) hoặc gửi khiếu nại báo lỗi (sai pass, dính 2FA, nick bị cấm) để nhận hoàn tiền 100% tự động.",
        "preconditions": "PRE-1: Phiên thuê đang ở trạng thái 'active'.",
        "postconditions": "POST-1: Phiên thuê được đóng với trạng thái 'returned_early' hoặc 'disputed'.\nPOST-2: Tiền hoàn được cộng vào ví khách hàng (nếu hợp lệ).\nPOST-3: Tài khoản game được gắn cờ 'need_change_pass' để quản trị viên kiểm tra.",
        "normal_flow": "1.0: Trả nick sớm hoặc báo lỗi\n"
                       "1. Khách hàng chọn 'Trả Nick Sớm' hoặc 'Báo Lỗi / Khiếu Nại'.\n"
                       "2. Trường hợp Trả sớm: Hệ thống hiển thị số giờ còn lại và số tiền hoàn lại theo chính sách (50% giá trị giờ còn lại). Khách bấm xác nhận -> Hệ thống hoàn tiền ví và đóng đơn.\n"
                       "3. Trường hợp Báo lỗi sự cố: Hệ thống mở DisputeModal, khách chọn lý do (Sai mật khẩu, Bị xác minh 2FA, Nick bị ban/khóa trong game, Nick không đúng mô tả), nhập mô tả chi tiết và tải ảnh chụp màn hình.\n"
                       "4. Khách bấm 'Gửi Khiếu Nại & Yêu Cầu Hoàn Tiền'.\n"
                       "5. Hệ thống ghi nhận báo lỗi, khóa tạm thời nick để bảo vệ, tự động hoàn 100% tiền phiên thuê vào ví khách hàng và gửi thông báo tới Admin.",
        "alt_flow": "N/A",
        "exceptions": "1.0.E1 Báo lỗi khi phiên thuê đã quá 50% thời lượng:\n"
                      "Hệ thống chuyển khiếu nại sang trạng thái 'Chờ Admin duyệt thủ công' thay vì hoàn tiền tự động tức thì để phòng chống gian lận.",
        "priority": "High",
        "business_rules": "BR1. Hoàn tiền 100% tự động nếu khách báo lỗi trong vòng 15 phút đầu kể từ lúc thuê.\n"
                          "BR2. Trả nick sớm hoàn lại 50% số tiền của các giờ chơi trọn vẹn chưa sử dụng.\n"
                          "BR3. Tài khoản sau khi trả sớm hoặc bị báo lỗi lập tức chuyển sang trạng thái 'need_change_pass' để Admin đổi mật khẩu mới.",
        "other_info": "Use Case kiểm thử tính toàn vẹn tài chính và luồng xử lý ngoại lệ nghiệp vụ."
    },
    {
        "id": "UC09",
        "name": "Giám sát phiên thuê & Điều phối của Admin (Admin Live Session Monitoring)",
        "function": "Bảng điều khiển trung tâm dành cho quản trị viên theo dõi và xử lý các phiên thuê trực tiếp",
        "primary_actor": "Quản trị viên (Admin)",
        "secondary_actor": "None",
        "trigger": "Admin truy cập mục 'Tổng quan' trên AdminDashboardPage.",
        "description": "Admin xem bảng danh sách phiên thuê thời gian thực, lọc theo game/trạng thái, mở modal chi tiết để thực hiện 4 tác vụ can thiệp: Bù thêm giờ (+1h), Thu hồi & đổi pass, Đưa vào bảo trì, Hoàn tiền khiếu nại.",
        "preconditions": "PRE-1: Người dùng đã đăng nhập với tài khoản có quyền Admin (role='admin').",
        "postconditions": "POST-1: Toàn bộ thao tác điều phối được thực thi tức thì và cập nhật trạng thái đơn thuê thời gian thực.",
        "normal_flow": "1.0: Điều phối phiên thuê Admin\n"
                       "1. Admin mở trang Tổng quan trên Admin Dashboard.\n"
                       "2. Bảng hiển thị thông tin từng phiên: Game, Mã acc, Rank, Khách thuê, Bắt đầu, Thời gian còn lại, Trạng thái chuẩn tiếng Việt ('Đang thuê', 'Đã hoàn tất', 'Báo lỗi').\n"
                       "3. Admin bấm vào một dòng phiên thuê để mở SessionModal chi tiết.\n"
                       "4. Admin thực hiện một trong các thao tác nghiệp vụ:\n"
                       "   - 'Bù thêm giờ (+1h)': Tự động cộng thêm 1 giờ chơi cho khách khi máy chủ game gián đoạn.\n"
                       "   - 'Thu hồi & Đổi pass': Kết thúc cưỡng chế phiên chơi khi phát hiện dấu hiệu gian lận.\n"
                       "   - 'Đưa vào bảo trì': Đặt nick về trạng thái bảo dưỡng.\n"
                       "   - 'Hoàn tiền & Đổi pass': Hoàn 100% tiền đơn thuê vào ví khách khi khiếu nại chính xác.\n"
                       "5. Hệ thống thực thi tác vụ và hiển thị Toast thông báo thành công.",
        "alt_flow": "N/A",
        "exceptions": "1.0.E1 Người dùng không có quyền Admin cố tình truy cập:\n"
                      "Hệ thống chặn truy cập (Admin Guard) và chuyển hướng về trang chủ kèm cảnh báo.",
        "priority": "High",
        "business_rules": "BR1. Chỉ tài khoản có role='admin' mới có quyền can thiệp vào phiên thuê của người khác.\n"
                          "BR2. Mọi thao tác hoàn tiền hoặc cộng giờ đều phải sinh log giao dịch đối soát.",
        "other_info": "Kiểm thử Integration Test giữa quyền Admin và trạng thái của Customer."
    },
    {
        "id": "UC10",
        "name": "Thêm mới tài khoản game vào kho (Add New Account - Chuẩn UC1)",
        "function": "Quản trị viên thêm tài khoản game mới vào kho bán/cho thuê (Tuân thủ nghiêm ngặt theo tài liệu mẫu UC1_Add New Product của giảng viên)",
        "primary_actor": "Quản trị viên (Admin)",
        "secondary_actor": "None",
        "trigger": "Admin bấm nút 'Thêm Acc Mới' trên thanh công cụ Quản lý kho acc.",
        "description": "Admin nhập thông tin chi tiết tài khoản game mới (Mã sản phẩm, Tên nick, Tựa game, Giá thuê/giờ, Rank, Server, Tài khoản đăng nhập, Mật khẩu, Ảnh đại diện) để đưa lên kệ cho khách thuê.",
        "preconditions": "PRE-1: Admin đã đăng nhập hệ thống với quyền Quản trị viên (role='admin').\nPRE-2: Admin đang ở trang Quản lý kho nick (AdminDashboardPage).",
        "postconditions": "POST-1: Tài khoản game mới được lưu trữ trong CSDL với trạng thái 'available'.\nPOST-2: Khách hàng có thể nhìn thấy và đặt thuê sản phẩm từ trang Client.",
        "normal_flow": "1.0: Nhập thông tin tài khoản game mới\n"
                       "1. Admin tới trang Quản lý kho tài khoản và bấm nút 'Thêm Acc Mới'.\n"
                       "2. Hệ thống hiển thị form thêm mới tài khoản (AddAccountModal).\n"
                       "3. Admin nhập đầy đủ thông tin: Mã sản phẩm, Tên tài khoản, Tựa game, Giá thuê/giờ, Rank, Server, Tài khoản bí mật, Mật khẩu bí mật, chọn Ảnh đại diện.\n"
                       "4. Admin nhấn nút 'Lưu Tài Khoản'.\n"
                       "5. Hệ thống kiểm tra tính hợp lệ của toàn bộ thông tin (xem 1.0.E1, 1.0.E2, 1.0.E3, 1.0.E4, 1.0.E5).\n"
                       "6. Hệ thống lưu tài khoản mới vào CSDL, đóng form và hiển thị thông báo 'Thêm mới tài khoản thành công'.",
        "alt_flow": "N/A",
        "exceptions": "1.0.E1 Các trường thông tin bắt buộc để trống:\n"
                      "1. Hệ thống thông báo yêu cầu bắt buộc nhập với các trường đang để trống: '{Tên trường} không được để trống'.\n"
                      "2. Nếu người dùng nhập lại thông tin thì quay lại bước 4 của Normal Flow.\n"
                      "1.0.E2 Các trường thông tin không đúng định dạng:\n"
                      "1. Hệ thống thông báo các trường thông tin đang không đúng định dạng: '{Tên trường} không đúng định dạng'.\n"
                      "2. Nếu người dùng nhập lại thông tin thì quay lại bước 4 của Normal Flow.\n"
                      "1.0.E3 Sản phẩm đã tồn tại:\n"
                      "1. Hệ thống thông báo lỗi: 'Mã sản phẩm đã tồn tại trong hệ thống, vui lòng nhập mã khác'.\n"
                      "2. Nếu người dùng nhập lại thông tin thì quay lại bước 4 của Normal Flow.\n"
                      "1.0.E4 Giá thuê không hợp lệ:\n"
                      "1. Hệ thống thông báo: 'Giá thuê mỗi giờ phải là số nguyên dương từ 1.000đ đến 500.000đ'.\n"
                      "1.0.E5 Dung lượng hoặc định dạng ảnh không hợp lệ:\n"
                      "1. Hệ thống thông báo: 'Ảnh đại diện phải có định dạng .jpg, .png, .gif và dung lượng tối đa 1MB'.",
        "priority": "High",
        "business_rules": "BR1. Mã sản phẩm là duy nhất trong hệ thống, không được trùng lặp.\n"
                          "BR2. Các trường thông tin: Mã sản phẩm, Tên sản phẩm, Giá thuê, Tài khoản bí mật, Mật khẩu, Hình ảnh không được để trống.\n"
                          "BR3. Mã sản phẩm có độ dài từ 8 đến 30 ký tự chữ cái và/hoặc chữ số (Ví dụ: ACCVAL001, GRENT12345), không chứa ký tự đặc biệt hoặc khoảng trắng.\n"
                          "BR4. Tên sản phẩm có độ dài từ 10 đến 50 ký tự mô tả rank và skin nổi bật.\n"
                          "BR5. Hình ảnh sản phẩm có dung lượng tối đa 1MB, định dạng cho phép: *.jpg, *.png, *.gif.\n"
                          "BR6. Thông báo lỗi màu đỏ hiển thị dưới các trường tương ứng khi có lỗi theo format: {Tên trường} + nội dung thông báo lỗi.",
        "other_info": "Dự kiến tần suất thực thi trường hợp sử dụng này sẽ cao trong vòng 2 tuần đầu tiên sau khi hệ thống được phát hành để cập nhật kho nick. Dựa trên tài liệu Use Case chuẩn 'UC1: Add new Product' của giảng viên, nhóm đã xây dựng đầy đủ bộ 20 Test Cases QA chuẩn quốc tế."
    }
]

print("[OK] Loaded 10 Use Cases Data.")
