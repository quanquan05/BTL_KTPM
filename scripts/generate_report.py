# -*- coding: utf-8 -*-
"""
Script to generate the complete, comprehensive BTL KTPM Report: Chương 1 & Chương 2
Đồng nhất 100% với mã nguồn dự án GameRent và tài liệu đặc tả môn học Kiểm thử phần mềm.

Tuân thủ nghiêm ngặt:
- YÊU CẦU BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM.pdf
- Phiếu Chấm_Kiểm Thử PM.pdf
- UC1_Add New Product.pdf
- Cấu trúc thư viện mã nguồn: src/data/initialData.js, src/pages, src/components, src/context/AppContext.jsx

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
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from docx2pdf import convert

def create_report():
    doc = docx.Document()

    # Căn lề chuẩn học thuật BTL EAUT: Trái 3cm (~1.18 in), Phải 2cm (~0.79 in), Trên 2cm, Dưới 2cm
    for section in doc.sections:
        section.top_margin = Inches(0.79)
        section.bottom_margin = Inches(0.79)
        section.left_margin = Inches(1.18)
        section.right_margin = Inches(0.79)
        section.page_width = Inches(8.27)   # A4
        section.page_height = Inches(11.69) # A4

    # Default Normal style font
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(33, 37, 41)
    style_normal.paragraph_format.line_spacing = 1.25
    style_normal.paragraph_format.space_after = Pt(4)

    # Color definitions
    NAVY = RGBColor(26, 54, 93)       # #1A365D
    BLUE = RGBColor(43, 108, 176)     # #2B6CB0
    DARK_GRAY = RGBColor(45, 55, 72)  # #2D3748
    TEXT_COLOR = RGBColor(33, 37, 41)
    ORANGE = RGBColor(234, 88, 12)    # #EA580C
    EMERALD = RGBColor(16, 185, 129)  # #10B981

    def set_cell_background(cell, fill_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_cell_margins(cell, top=100, bottom=100, left=130, right=130):
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

        # Header Row
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

        # Data Rows
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

    # ==========================================
    # 1. TRANG BÌA (COVER PAGE)
    # ==========================================
    add_p("BỘ GIÁO DỤC VÀ ĐÀO TẠO", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2)
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=2, color=NAVY)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=18)

    add_p("─────────── ★ ───────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=26, color=BLUE)

    add_p("BÁO CÁO BÀI TẬP LỚN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=20, space_after=6, color=ORANGE)
    add_p("HỌC PHẦN: KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=15, space_after=4, color=NAVY)
    add_p("LỚP TÍN CHỈ: Kiểm thử phần mềm-1-1-26(N05)  ·  NHÓM THỰC HIỆN: NHÓM 16", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=18, color=EMERALD)

    add_p("TÊN ĐỀ TÀI CHÍNH THỨC:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)
    add_p("KIỂM THỬ ỨNG DỤNG WEBSITE CHO THUÊ TÀI KHOẢN GAME (GAMERENT)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=16, space_after=8, color=NAVY)
    add_p("NỘI DUNG BÁO CÁO: ĐÃ HOÀN THIỆN CHƯƠNG 1 (TỔNG QUAN BÀI TOÁN) & CHƯƠNG 2 (PHÂN TÍCH VÀ THIẾT KẾ TEST)", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=20, color=DARK_GRAY)

    add_p("CÁC SẢN PHẨM CÔNG VIỆC CÓ SẴN ĐÃ HOÀN TẤT:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=2, color=NAVY)
    add_p("[X] 1. Đặc tả yêu cầu (SRS)  |  [X] 2. Tài liệu yêu cầu hệ thống (SRD)  |  [X] 3. Code chương trình chạy được", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=22, color=DARK_GRAY)

    add_p("──────────────────────────────────────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16, color=BLUE)

    # Info block
    add_p("Giảng viên hướng dẫn: ThS. Phạm Thị Loan", bold=True, font_size=12, space_after=4)
    add_p("Nhóm sinh viên thực hiện (Nhóm 16):", bold=True, font_size=12, space_after=2)
    add_p("  1. Lê Hải Đăng    - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  2. Lê Minh Quân   - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  3. Lê Xuân Đạt    - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  4. Lê Thanh Tùng  - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=6)
    add_p("Khoa: Công nghệ thông tin - Trường Đại học Công nghệ Đông Á", font_size=11, space_after=2)
    add_p("Học kỳ I - Năm học 2026 - 2027", font_size=11, space_after=22)

    add_p("BẮC NINH / HÀ NỘI – NĂM 2026", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12.5, space_after=0, color=NAVY)

    doc.add_page_break()

    # ==========================================
    # PHIẾU ĐÁNH GIÁ (THEO MẪU PHIẾU CHẤM CỦA BỘ MÔN)
    # ==========================================
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=1)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=4)
    add_p("PHIẾU ĐÁNH GIÁ KẾT QUẢ BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2, color=NAVY)
    add_p("LỚP TÍN CHỈ: Kiểm thử phần mềm-1-1-26(N05)  ·  NHÓM: 16  ·  MÃ ĐỀ TÀI: 16", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=2, color=BLUE)
    add_p("Tên đề tài: Kiểm thử ứng dụng website cho thuê tài khoản game (GameRent)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=4, color=NAVY)

    # Member list table
    add_p("DANH SÁCH THÀNH VIÊN NHÓM 16 VÀ PHÂN CÔNG NHIỆM VỤ:", bold=True, font_size=11, space_after=3)
    member_headers = ["STT", "Họ và tên", "Mã sinh viên", "Lớp tín chỉ", "Nhiệm vụ phân công trong đề tài"]
    member_rows = [
        ["1", "Lê Hải Đăng", "....................", "N05", "Phân tích yêu cầu, Thiết kế bộ Unit Test Case (BVA, EP, Decision Table)"],
        ["2", "Lê Minh Quân", "....................", "N05", "Phát triển Web App GameRent (React 18 + Vite), Thiết kế System Test Case E2E"],
        ["3", "Lê Xuân Đạt", "....................", "N05", "Thiết kế Integration Test Case (Sandwich) & Kiểm thử chuyển trạng thái"],
        ["4", "Lê Thanh Tùng", "....................", "N05", "Đặc tả các màn hình chức năng, Biên soạn Báo cáo và Kiểm thử giao diện"]
    ]
    add_table_custom(member_headers, member_rows, col_widths=[0.5, 1.8, 1.2, 0.8, 2.7], header_bg="2B6CB0")

    add_p("TIÊU CHÍ ĐÁNH GIÁ ĐIỂM THI BÀI TẬP LỚN (CĂN CỨ THEO PHIẾU CHẤM CỦA BỘ MÔN):", bold=True, font_size=11, space_before=4, space_after=3)
    rubric_headers = ["STT", "Nội dung tiêu chí đánh giá", "Thang điểm", "Đánh giá"]
    rubric_rows = [
        ["1", "HÌNH THỨC TRÌNH BÀY BÀI THI", "1.0 đ", ""],
        ["1.1", "Trình bày báo cáo đúng định dạng (Font Times New Roman, dãn dòng 1.25, căn lề 3-2-2-2cm)", "0.5 đ", ""],
        ["1.2", "Trình bày báo cáo theo đúng Bố cục chuẩn bài tập lớn môn Kiểm thử phần mềm", "0.5 đ", ""],
        ["2", "NỘI DUNG BÀI THI BẢN MỀM (BÁO CÁO NỘP TRÊN ELEARNING)", "5.0 đ", ""],
        ["2.1", "Thực hiện Unit test: Xác định các module, viết Unit test case chi tiết (BVA, EP, Decision Table)", "1.0 đ", ""],
        ["2.2.1", "Thực hiện Integration test: Xác định các màn hình để thực hiện Integration test", "0.5 đ", ""],
        ["2.2.2", "Viết Integration test case chi tiết theo chiến lược Sandwich", "0.5 đ", ""],
        ["2.2.3", "Thực hiện Integration test, Log bug và báo cáo kết quả test", "0.5 đ", ""],
        ["2.2.4", "Thực hiện System test: Xác định các luồng nghiệp vụ E2E, viết System test case", "1.0 đ", ""],
        ["2.2.5", "Log bug và báo cáo kết quả test hệ thống", "0.5 đ", ""],
        ["2.2.6", "Sử dụng công cụ kiểm thử tự động (Automation Test: Playwright / Selenium)", "1.0 đ", ""],
        ["3", "VẤN ĐÁP (Kỹ thuật thiết kế test 1.0đ, Nguyên lý kiểm thử 1.0đ, Hoạt động kiểm thử 1.0đ, Viết testcase/log bug 1.0đ)", "4.0 đ", ""],
        ["TỔNG", "TỔNG ĐIỂM TOÀN BỘ HỌC PHẦN (1) + (2) + (3)", "10.0 đ", ""]
    ]
    add_table_custom(rubric_headers, rubric_rows, col_widths=[0.6, 4.3, 1.2, 0.9], header_bg="1A365D")

    add_p("Cán bộ chấm thi 1: .......................................      Cán bộ chấm thi 2: .......................................", italic=True, space_before=4, space_after=10)

    doc.add_page_break()

    # ==========================================
    # LỜI MỞ ĐẦU & MỤC LỤC
    # ==========================================
    add_h1("LỜI MỞ ĐẦU")
    add_p("Trong kỷ nguyên số hiện nay, ngành công nghiệp trò chơi điện tử và thể thao điện tử (Esports) tại Việt Nam đang có những bước tiến vượt bậc. Các tựa game đình đám như Liên Quân Mobile, Valorant, Genshin Impact, FC Online (FO4), PUBG PC, và LMHT: Tốc Chiến đã thu hút hàng triệu game thủ tham gia thi đấu và giải trí mỗi ngày. Nhu cầu được trải nghiệm các tài khoản sở hữu bậc xếp hạng cao (Cao Thủ, Thách Đấu, Radiant) hoặc những bộ trang phục (skin) phiên bản giới hạn quý hiếm là vô cùng to lớn. Tuy nhiên, hình thức giao dịch thuê nick truyền thống qua các hội nhóm mạng xã hội (Facebook, Zalo, Discord) bộc lộ rất nhiều rủi ro nghiêm trọng: lừa đảo chuyển tiền không nhận được mật khẩu, tài khoản sai pass, tài khoản bị dính xác minh 2 bước (2FA), hoặc bị chủ nick đổi mật khẩu giữa chừng mà không có bất kỳ cơ chế bồi hoàn nào.")
    add_p("Nhằm giải quyết triệt để vấn đề thực tiễn đó, nhóm sinh viên thực hiện đề tài: \"Xây dựng và thực hiện kiểm thử hệ thống cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent)\". Hệ thống mang đến giải pháp chuyển đổi số toàn diện: nạp tiền tự động qua mã VietQR Napas247, tự động kiểm tra số dư và trừ tiền, bàn giao tài khoản và mật khẩu in-game tức thì chỉ sau 1 click chuột, đồng hồ đếm ngược từng giây theo thời gian thực, hỗ trợ gia hạn ca chơi, trả nick sớm và cơ chế tự động hoàn tiền 100% khi gặp sự cố.")
    add_p("Đối với học phần môn Kiểm thử phần mềm, hệ thống GameRent được xây dựng với kiến trúc chuẩn mực (React 18, Vite, LocalStorage Mock Engine), phân tách module rõ ràng và tích hợp đầy đủ mã định danh kiểm thử (data-testid) trên toàn bộ các thành phần giao diện. Điều này tạo điều kiện lý tưởng để áp dụng toàn diện các kỹ thuật kiểm thử phần mềm tiên tiến nhất theo chuẩn quốc tế ISTQB:")
    add_bullet("Chương 1: Tổng quan bài toán", "Trình bày bối cảnh thực tế, phát biểu bài toán, mô tả luồng nghiệp vụ E2E, bảng đặc tả chi tiết các trường dữ liệu trên 8 màn hình/modal chức năng và phân tích cấu trúc 7 module cốt lõi.")
    add_bullet("Chương 2: Phân tích và thiết kế test", "Xây dựng ma trận ca kiểm thử chuyên sâu cho cả 3 cấp độ: Unit Test (BVA, Phân vùng tương đương, Bảng quyết định Decision Table, chuẩn UC1), Integration Test (Chiến lược Sandwich kết hợp Top-down và Bottom-up) và System Test (Kiểm thử luồng E2E, Kiểm thử chuyển trạng thái State Transition).")
    add_p("Nhóm sinh viên xin chân thành cảm ơn cô Phạm Thị Loan cùng các thầy cô trong bộ môn Công nghệ phần mềm - Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đông Á đã nhiệt tình hướng dẫn và định hướng chuyên môn quý báu cho nhóm hoàn thành xuất sắc báo cáo này!", italic=True, space_before=8, space_after=12)

    doc.add_page_break()

    # MỤC LỤC
    add_h1("MỤC LỤC BÁO CÁO")
    add_p("LỜI MỞ ĐẦU ...................................................................................................................................................... 3", bold=True, font_size=11, space_after=3)
    add_p("CHƯƠNG 1: TỔNG QUAN BÀI TOÁN .......................................................................................................... 5", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  1.1. GIỚI THIỆU ĐỀ TÀI ............................................................................................................................ 5", font_size=10.5, space_after=2)
    add_p("    1.1.1. Thu thập đầu bài và bối cảnh bài toán trong thực tế ..................................................................... 5", font_size=10, space_after=2)
    add_p("    1.1.2. Phát biểu bài toán hệ thống GameRent ........................................................................................... 6", font_size=10, space_after=2)
    add_p("    1.1.3. Mục tiêu và phạm vi của đề tài ........................................................................................................ 6", font_size=10, space_after=2)
    add_p("  1.2. ĐẶC TẢ YÊU CẦU PHẦN MỀM ......................................................................................................... 7", font_size=10.5, space_after=2)
    add_p("    1.2.1. Các luồng nghiệp vụ chính E2E của hệ thống (10 Use Cases) ...................................................... 7", font_size=10, space_after=2)
    add_p("    1.2.2. Đặc tả các màn hình chức năng chính và ràng buộc nhập liệu .................................................... 9", font_size=10, space_after=2)
    add_p("    1.2.3. Các Module chức năng chính của chương trình ............................................................................. 13", font_size=10, space_after=2)
    add_p("CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST .......................................................................................... 16", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  2.1. THIẾT KẾ UNIT TEST CASE .............................................................................................................. 16", font_size=10.5, space_after=2)
    add_p("    2.1.1. Phương pháp và kỹ thuật kiểm thử Unit (BVA, EP, Decision Table) ............................................ 16", font_size=10, space_after=2)
    add_p("    2.1.2. Danh sách các Unit Test Case chi tiết ........................................................................................... 17", font_size=10, space_after=2)
    add_p("  2.2. THIẾT KẾ INTEGRATION TEST CASE ........................................................................................... 22", font_size=10.5, space_after=2)
    add_p("    2.2.1. Phương pháp và chiến lược kiểm thử tích hợp (Chiến lược Sandwich) ....................................... 22", font_size=10, space_after=2)
    add_p("    2.2.2. Danh sách các Integration Test Case chi tiết ................................................................................ 23", font_size=10, space_after=2)
    add_p("  2.3. THIẾT KẾ SYSTEM TEST CASE ........................................................................................................ 26", font_size=10.5, space_after=2)
    add_p("    2.3.1. Phương pháp kiểm thử hệ thống E2E và Kiểm thử chuyển trạng thái ....................................... 26", font_size=10, space_after=2)
    add_p("    2.3.2. Danh sách các System Test Case chi tiết ........................................................................................ 28", font_size=10, space_after=2)
    add_p("TỔNG KẾT VÀ ĐÁNH GIÁ KẾT QUẢ ......................................................................................................... 32", bold=True, font_size=11, space_after=4)

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 1: TỔNG QUAN BÀI TOÁN
    # =========================================================
    add_h1("CHƯƠNG 1: TỔNG QUAN BÀI TOÁN")

    add_h2("1.1. Giới thiệu đề tài")

    add_h3("1.1.1. Thu thập đầu bài và bối cảnh bài toán trong thực tế")
    add_p("Trong thời đại công nghệ số 4.0, thể thao điện tử (Esports) và game trực tuyến đã trở thành một phần thiết yếu trong đời sống giải trí của giới trẻ. Thị trường Việt Nam hiện đang chứng kiến sự bùng nổ của 6 hệ sinh thái game trực tuyến lớn nhất:")
    add_bullet("1. Liên Quân Mobile (Garena)", "Tựa game MOBA di động số 1 với hàng chục bậc rank từ Vàng, Bạch Kim, Kim Cương, Tinh Anh, Cao Thủ đến Chiến Tướng cùng các trang phục Thứ Nguyên Vệ Thần đắt đỏ.")
    add_bullet("2. Valorant (Riot Games)", "Tựa game bắn súng chiến thuật FPS hàng đầu thế giới với các bộ skin vũ khí danh tiếng (Kuronami, Vandal Prime, RGX) có giá hàng triệu đồng và bậc rank từ Sắt đến Radiant.")
    add_bullet("3. Genshin Impact (HoYoverse)", "Game thế giới mở nhập vai AAA với hệ thống nhân vật 5 sao (Raiden Shogun, Furina, Zhongli) và cấp độ thám hiểm AR 50 - AR 60.")
    add_bullet("4. FC Online - FO4 (Garena / Nexon)", "Tựa game mô phỏng bóng đá chân thực với giá trị đội hình lên tới hàng nghìn tỷ BP và các mức rank Nghiệp Dư đến Siêu Sao.")
    add_bullet("5. PUBG PC / Steam (Krafton)", "Game sinh tồn Battle Royale kinh điển trên nền tảng máy tính.")
    add_bullet("6. LMHT: Tốc Chiến (VNG Games)", "Bản di động chuẩn mực của Liên Minh Huyền Thoại với bậc rank từ Vàng đến Thách Đấu.")

    add_p("Thực trạng nhu cầu và vấn đề tồn tại:", bold=True, space_before=4)
    add_p("• Nhu cầu trải nghiệm ngắn hạn: Đa số người chơi không đủ điều kiện tài chính để nạp tiền sở hữu vĩnh viễn các bộ skin giới hạn đắt đỏ hoặc cày nick lên mức rank cao. Nhu cầu thuê tài khoản trong vài giờ cuối tuần để chơi cùng bạn bè, leo rank hoặc review trang phục là cực kỳ lớn.\n"
          "• Bất cập của mô hình thuê truyền thống: Việc giao dịch hiện tại diễn ra thủ công trên mạng xã hội tiềm ẩn vô số rủi ro nguy hiểm: chuyển khoản xong bị chặn liên lạc (lừa đảo 100%), mật khẩu gửi sai không vào được, tài khoản bị dính mã bảo vệ 2 lớp (2FA), nick bị cấm chơi (ban) do người thuê trước dùng phần mềm gian lận, hoặc chủ acc tự ý đổi mật khẩu giữa chừng mà người thuê không được hoàn tiền.")

    add_h3("1.1.2. Phát biểu bài toán hệ thống GameRent")
    add_p("Bài toán đặt ra là cần xây dựng một **Hệ thống cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent)** nhằm tự động hóa 100% quy trình kinh doanh và quản lý, đảm bảo an toàn tuyệt đối cho người dùng:")
    add_bullet("Tự động hóa thanh toán và bàn giao", "Khách hàng nạp tiền qua cổng thanh toán QR code VietQR Napas247 tự động; hệ thống tự động kiểm tra số dư ví và hiển thị tài khoản/mật khẩu in-game tức thì chỉ sau 1 click chuột.")
    add_bullet("Giám sát thời gian thực (Realtime Countdown)", "Mỗi phiên thuê được quản lý bởi đồng hồ đếm ngược từng giây theo thời gian thực (HH:MM:SS), tự động chuyển sang màu đỏ cảnh báo khi còn dưới 15 phút, hỗ trợ gia hạn ca chơi hoặc trả acc sớm.")
    add_bullet("Chính sách bảo hiểm minh bạch", "Cam kết tự động hoàn tiền 100% vào ví khách hàng khi gặp sự cố sai mật khẩu, dính 2FA hoặc nick bị cấm; khóa nick tức thì để chuyển vào diện bảo trì.")
    add_bullet("Trung tâm điều phối Admin chuyên nghiệp", "Hỗ trợ quản trị viên giám sát toàn bộ phiên thuê thời gian thực, can thiệp bù giờ, đổi mật khẩu, đưa vào bảo trì, quản lý kho nick chuẩn đề bài UC1_Add New Product và theo dõi doanh thu.")

    add_h3("1.1.3. Mục tiêu và phạm vi của đề tài")
    add_p("Đề tài hướng tới việc hoàn thành xuất sắc 2 mục tiêu lớn:")
    add_bullet("Về mặt ứng dụng phần mềm", "Xây dựng hoàn thiện ứng dụng Web Single Page Application (React 18 + Vite, Dark Mode Cyberpunk sắc nét) kết hợp tầng dịch vụ bất đồng bộ và bộ nhớ lưu trữ LocalStorage Mock Engine hoạt động độc lập, mượt mà và bền vững.")
    add_bullet("Về mặt học phần Kiểm thử phần mềm", "Áp dụng đầy đủ và chuyên nghiệp các nguyên lý và kỹ thuật kiểm thử phần mềm chuẩn quốc tế ISTQB. Toàn bộ các phần tử giao diện được gắn thuộc tính `data-testid` chuẩn mực phục vụ kiểm thử tự động (Automation E2E). Thiết kế ma trận test case bao phủ toàn diện từ Unit Test, Integration Test đến System Test.")

    add_h2("1.2. Đặc tả yêu cầu phần mềm")

    add_h3("1.2.1. Các luồng nghiệp vụ chính E2E của hệ thống (10 Use Cases)")
    add_p("Hệ thống GameRent được thiết kế gồm 10 Use Case hoàn chỉnh phản ánh trọn vẹn chu trình nghiệp vụ khép kín từ Khách hàng đến Quản trị viên:")

    uc_headers = ["Mã UC", "Tên Use Case", "Tác tử chính", "Mục đích nghiệp vụ", "Độ ưu tiên"]
    uc_rows = [
        ["UC01", "Đăng nhập hệ thống (Login)", "Khách thuê / Admin", "Xác thực danh tính, duy trì session và phân quyền RBAC", "High"],
        ["UC02", "Đăng ký tài khoản mới (Register)", "Khách vãng lai", "Tạo tài khoản thành viên mới, tặng 50.000đ dùng thử", "High"],
        ["UC03", "Tìm kiếm & Lọc kho nick game", "Khách hàng", "Duyệt danh mục 6 tựa game, lọc giá, tìm kiếm skin/rank", "High"],
        ["UC04", "Nạp tiền ví điện tử qua VietQR", "Khách hàng", "Tạo mã VietQR động MBBank, nạp tiền tự động 24/7", "High"],
        ["UC05", "Thuê tài khoản game tức thì", "Khách hàng", "Trừ tiền ví, khóa nick độc quyền, bàn giao mật khẩu in-game", "Critical"],
        ["UC06", "Giám sát phiên thuê & Xem mật khẩu", "Khách hàng", "Đồng hồ đếm ngược từng giây, ẩn/hiện pass, nút copy 1-click", "High"],
        ["UC07", "Gia hạn thời gian thuê tài khoản", "Khách hàng", "Cộng thêm giờ chơi nối tiếp (+1h, +2h) không bị đổi pass", "Medium"],
        ["UC08", "Trả nick sớm & Báo lỗi khiếu nại", "Khách hàng", "Hoàn 50% khi trả sớm, hoàn 100% tự động khi báo lỗi sự cố", "High"],
        ["UC09", "Giám sát phiên & Điều phối Admin", "Administrator", "Theo dõi phiên live, bù giờ (+1h), thu hồi pass, hoàn tiền", "High"],
        ["UC10", "Thêm mới nick vào kho (Chuẩn UC1)", "Administrator", "Validate mã (8-30), tên (10-50), giá, rank, pass, ảnh <= 1MB", "High"]
    ]
    add_table_custom(uc_headers, uc_rows, col_widths=[0.8, 1.9, 1.3, 2.6, 0.9])

    add_h3("1.2.2. Đặc tả các màn hình chức năng chính và ràng buộc nhập liệu")
    add_p("Hệ thống GameRent được xây dựng gồm 8 màn hình và hộp thoại (Modal) tương tác cao, được định danh rõ ràng trong cấu trúc mã nguồn:")
    add_bullet("1. Trang Chủ & Bộ Lọc (HomePage.jsx)", "Banner giới thiệu, thanh tìm kiếm từ khóa, danh mục 6 tựa game (Pills button), bộ lọc giá (Dưới 10k, 10k-20k, 20k-30k, Trên 30k), lưới sản phẩm hiển thị ảnh bìa, rank, giá/h, badge 'Sẵn sàng' / 'Đang thuê' / 'Bảo trì' và nút 'Thuê Ngay'.")
    add_bullet("2. Chi Tiết Tài Khoản (AccountDetailPage.jsx)", "Xem ảnh skin độ phân giải cao, thông số chi tiết (rank, server, winrate, số lượng skin), cam kết bảo hiểm hoàn tiền 100%, nút kích hoạt RentConfirmModal.")
    add_bullet("3. Hộp thoại Thuê Nick (RentConfirmModal.jsx)", "Tóm tắt thông tin acc, bộ chọn số giờ (1 - 48h), checkbox đồng ý điều khoản, tính tổng chi phí = Giá/h × Giờ, kiểm tra số dư ví. Bàn giao ngay tài khoản/mật khẩu kèm nút copy sau khi thanh toán.")
    add_bullet("4. Hộp thoại Nạp Tiền (DepositModal.jsx)", "Phương thức Chuyển khoản VietQR 24/7, lưới chọn nhanh mệnh giá (50k, 100k, 200k, 500k), ô nhập số tiền tùy ý (10.000đ - 5.000.000đ), sinh mã VietQR động với cú pháp 'NAP {USERNAME}'.")
    add_bullet("5. Quản Lý Đơn Thuê (MyRentalsPage.jsx)", "Tab 'Đang Hoạt Động' và 'Lịch Sử', thẻ đơn thuê chi tiết gồm CountdownTimer đếm ngược từng giây, hộp bảo mật tài khoản/mật khẩu có nút mắt ẩn/hiện, nút Copy 1-click, các nút hành động 'Gia Hạn', 'Trả Nick Sớm', 'Báo Lỗi / Khiếu Nại'.")
    add_bullet("6. Hộp thoại Báo Lỗi Sự Cố (DisputeModal.jsx)", "Chọn lý do: Sai mật khẩu, Bị xác minh 2FA, Nick bị cấm/ban, Sai mô tả; ô nhập mô tả chi tiết và upload ảnh chụp màn hình bằng chứng.")
    add_bullet("7. Hộp thoại Trả Nick Sớm (ReturnEarlyModal.jsx)", "Tính toán số giờ trọn vẹn chưa sử dụng, chính sách hoàn lại 50% tiền vào ví, đổi trạng thái nick sang 'need_change_pass'.")
    add_bullet("8. Bàn Điều Phối & Quản Trị Kho Acc (OverviewDashboard.jsx & AdminDashboardPage.jsx)", "Bảng theo dõi phiên thuê thời gian thực, custom dropdown lọc theo game/trạng thái, SessionModal với 4 thao tác điều phối (Bù giờ +1h, Thu hồi & đổi pass, Đưa vào bảo trì, Hoàn tiền 100%), Tab Quản trị kho nick thêm mới theo chuẩn UC1 của cô giáo.")

    # Table of UI Fields Description
    add_p("Bảng đặc tả thuộc tính dữ liệu và ràng buộc validation trên các form nhập liệu:", bold=True, space_before=4)
    fields_headers = ["Form / Màn hình", "Tên trường (Field)", "Kiểu dữ liệu", "Độ dài / Giới hạn", "Bắt buộc", "Quy tắc ràng buộc & Thông báo lỗi"]
    fields_rows = [
        ["Đăng ký (AuthModal)", "Tên đăng nhập (username)", "Chuỗi", "4 – 30 ký tự", "Có (Yes)", "Chỉ gồm chữ và số, không khoảng trắng, duy nhất. Báo lỗi: 'Tên đăng nhập không đúng định dạng'"],
        ["Đăng ký (AuthModal)", "Mật khẩu (password)", "Mật khẩu", "6 – 32 ký tự", "Có (Yes)", "Tối thiểu 6 ký tự. Báo lỗi: 'Mật khẩu phải từ 6 ký tự trở lên'"],
        ["Đăng ký (AuthModal)", "Số điện thoại (phone)", "Chuỗi số", "Đúng 10 chữ số", "Có (Yes)", "Đầu số chuẩn 03, 05, 07, 08, 09. Báo lỗi: 'Số điện thoại không hợp lệ'"],
        ["Nạp tiền (DepositModal)", "Số tiền nạp (amount)", "Số nguyên", "10.000 – 5.000.000 VNĐ", "Có (Yes)", "Bội số của 1.000đ. Báo lỗi: 'Số tiền nạp phải từ 10.000đ đến 5.000.000đ'"],
        ["Thuê nick (RentConfirm)", "Thời gian thuê (hours)", "Số nguyên", "1 – 48 giờ", "Có (Yes)", "Thuê theo block giờ nguyên. Báo lỗi: 'Thời gian thuê từ 1 đến 48 giờ'"],
        ["Thuê nick (RentConfirm)", "Điều khoản (agreedTerms)", "Boolean", "true / false", "Có (Yes)", "Bắt buộc tick chọn. Báo lỗi: 'Bạn cần đồng ý với điều khoản quy định'"],
        ["Báo lỗi (DisputeModal)", "Lý do (reason)", "Dropdown", "4 giá trị cố định", "Có (Yes)", "Bắt buộc chọn 1 trong 4 lý do sự cố"],
        ["Báo lỗi (DisputeModal)", "Mô tả lỗi (description)", "Văn bản", "10 – 300 ký tự", "Có (Yes)", "Mô tả chi tiết để phục vụ đối soát hoàn tiền"],
        ["Thêm acc (Admin UC1)", "Mã sản phẩm (code)", "Chuỗi", "8 – 30 ký tự", "Có (Yes)", "Chữ và số, không khoảng trắng/ký tự đặc biệt, duy nhất (Chuẩn UC1)"],
        ["Thêm acc (Admin UC1)", "Tên sản phẩm (title)", "Chuỗi", "10 – 50 ký tự", "Có (Yes)", "Mô tả rank và skin nổi bật (Chuẩn UC1)"],
        ["Thêm acc (Admin UC1)", "Tựa game (gameId)", "Dropdown", "6 tựa game", "Có (Yes)", "Chọn: lien-quan, valorant, genshin, fo4, pubg, toc-chien"],
        ["Thêm acc (Admin UC1)", "Giá thuê/giờ (price)", "Số nguyên", "1.000 – 500.000 VNĐ", "Có (Yes)", "Giá thuê mỗi giờ > 0. Báo lỗi: 'Giá thuê phải lớn hơn 0'"],
        ["Thêm acc (Admin UC1)", "Tài khoản login", "Chuỗi", "3 – 50 ký tự", "Có (Yes)", "Tài khoản đăng nhập in-game thực tế"],
        ["Thêm acc (Admin UC1)", "Mật khẩu login", "Chuỗi", "4 – 50 ký tự", "Có (Yes)", "Mật khẩu in-game bàn giao bảo mật"],
        ["Thêm acc (Admin UC1)", "Ảnh đại diện (image)", "File / URL", "Dung lượng <= 1MB", "Có (Yes)", "Định dạng cho phép: *.jpg, *.png, *.gif (Chuẩn UC1)"]
    ]
    add_table_custom(fields_headers, fields_rows, col_widths=[1.2, 1.4, 0.9, 1.2, 0.6, 2.2])

    add_h3("1.2.3. Các Module chức năng chính của chương trình")
    add_p("Hệ thống GameRent được kiến trúc hóa thành 7 module nghiệp vụ hoạt động đồng bộ qua State Management (AppContext) và LocalStorage Engine:")

    modules_data = [
        ("Module 1: Quản lý Xác thực & Phân quyền (Auth & RBAC Module)",
         "• Input: Thông tin đăng ký (username, password, phone); Thông tin đăng nhập (username/email, password); Quyền hạn (role: 'user' | 'admin').\n"
         "• Output: Đối tượng currentUser, phiên làm việc lưu trong LocalStorage, giao diện Navbar thay đổi trạng thái, cấp quyền truy cập Dashboard cho Admin.\n"
         "• Mô tả logic: Xử lý đăng ký, mã hóa mật khẩu, kiểm tra trùng lặp tên đăng nhập, cấp 50.000đ tiền thưởng ví chào mừng thành viên mới."),

        ("Module 2: Quản lý Kho Tài Khoản Game (Game Catalog Module)",
         "• Input: Từ khóa tìm kiếm (searchQuery), Mã game (selectedGame), Khoảng giá thuê (priceRange), Tiêu chí sắp xếp (sortBy).\n"
         "• Output: Mảng filteredAccounts gồm các tài khoản game khớp điều kiện lọc hiển thị lên giao diện.\n"
         "• Mô tả logic: Lọc dữ liệu thời gian thực (< 100ms) trên mảng tài khoản, ưu tiên đưa nick 'available' lên đầu, gắn nhãn trạng thái 'rented' hoặc 'maintenance'."),

        ("Module 3: Quản lý Ví Điện Tử & Nạp Tiền VietQR (Wallet & VietQR Engine)",
         "• Input: Số tiền nạp (amount: 10.000đ - 5.000.000đ), Phương thức (vietqr / card), Mã đơn cần trừ tiền, Mã khiếu nại được hoàn tiền.\n"
         "• Output: Số dư ví mới của user, bản ghi giao dịch {id, type, amount, description, timestamp} lưu vào bảng Transactions.\n"
         "• Mô tả logic: Xử lý nạp tiền tự động, sinh mã VietQR Napas247 động với cú pháp chuẩn MBBank, đảm bảo tính nhất quán (Atomicity) không bao giờ bị âm ví."),

        ("Module 4: Động Cơ Cho Thuê Tài Khoản Tức Thì (Instant Rental Engine)",
         "• Input: accountId, durationHours (1 - 48 giờ), userId của khách đang đăng nhập.\n"
         "• Output: Đơn thuê mới (#ORDER-XXX) trạng thái 'active', tài khoản game chuyển 'rented', số dư ví bị trừ đúng bằng (Giá/h × Giờ).\n"
         "• Mô tả logic: Kiểm tra điều kiện số dư ví >= Tổng tiền. Nếu đủ tiền, tự động khóa trạng thái nick độc quyền, lưu mốc startTime và expiresAt, mở khóa mật khẩu bàn giao tức thì."),

        ("Module 5: Giám Sát Thời Gian Thực & Gia Hạn (Realtime Timer & Extension)",
         "• Input: Mốc kết thúc (expiresAt), Thời gian hiện tại Date.now(), Gói gia hạn thêm giờ (+1h, +2h, +4h).\n"
         "• Output: Số giờ/phút/giây còn lại trên CountdownTimer, cờ cảnh báo isExpiringSoon (dưới 15 phút), mốc expiresAt mới sau khi gia hạn.\n"
         "• Mô tả logic: Tích hợp vòng lặp đếm ngược mỗi 1 giây (setInterval). Tự động chuyển đơn sang 'completed' khi hết giờ và thu hồi quyền xem mật khẩu."),

        ("Module 6: Bảo Hiểm & Giải Quyết Khiếu Nại (Dispute & Insurance Module)",
         "• Input: rentalId cần khiếu nại, Lý do sự cố (reason), Mô tả lỗi, Quyết định xử lý của Admin (Duyệt hoặc Từ chối).\n"
         "• Output: Phiếu khiếu nại mới trong bảng Disputes; Khách được tự động hoàn lại 100% tiền đơn vào ví; Nick chuyển sang 'maintenance'.\n"
         "• Mô tả logic: Thực thi cam kết bảo hiểm chất lượng dịch vụ. Khóa tài khoản lỗi ngay lập tức để phòng ngừa cho khách thuê tiếp theo."),

        ("Module 7: Quản Trị Viên & Điều Phối Phiên Live (Admin Operations Module)",
         "• Input: Thao tác thêm nick mới chuẩn UC1, Thao tác điều phối phiên live (Bù giờ +1h, Thu hồi & đổi pass, Đưa vào bảo trì, Hoàn tiền khiếu nại).\n"
         "• Output: Cập nhật CSDL kho tài khoản, cập nhật trạng thái đơn thuê thời gian thực, tính toán các chỉ số thống kê KPI doanh thu.\n"
         "• Mô tả logic: Trung tâm điều khiển toàn bộ sàn GameRent, cho phép Admin can thiệp tức thì vào các phiên thuê có sự cố.")
    ]

    for title, desc in modules_data:
        add_p(title, bold=True, space_before=4, space_after=1, color=DARK_GRAY)
        add_p(desc, space_after=6)

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST
    # =========================================================
    add_h1("CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST")

    add_h2("2.1. Thiết kế Unit Test Case")

    add_h3("2.1.1. Phương pháp và kỹ thuật kiểm thử Unit")
    add_p("Kiểm thử đơn vị (Unit Testing) tập trung kiểm tra tính đúng đắn của từng module hàm xử lý logic và tính toán độc lập trong hệ thống. Nhóm áp dụng 4 kỹ thuật thiết kế ca kiểm thử hộp đen và hộp trắng cốt lõi theo chuẩn ISTQB:")
    add_bullet("1. Phân tích giá trị biên (Boundary Value Analysis - BVA)", "Tập trung kiểm thử tại các điểm biên của miền giá trị đầu vào (biên dưới Min, ngay dưới Min-1, ngay trên Min+1, biên trên Max, ngay dưới Max-1, ngay trên Max+1). Kỹ thuật này phát hiện hầu hết các lỗi tiềm ẩn trong câu lệnh so sánh (<, <=, >, >=).")
    add_bullet("2. Phân vùng tương đương (Equivalence Partitioning - EP)", "Chia dữ liệu đầu vào thành các phân vùng hợp lệ (Valid Partitions) và không hợp lệ (Invalid Partitions). Đại diện một giá trị từ mỗi phân vùng được chọn làm test case, tối ưu hóa thời gian kiểm thử.")
    add_bullet("3. Bảng quyết định (Decision Table Testing)", "Áp dụng cho các hàm chứa nhiều điều kiện kết hợp phức tạp (như điều kiện số dư ví so với chi phí thuê, trạng thái tài khoản, thời lượng thuê).")
    add_bullet("4. Tiêu chí kiểm thử hộp trắng (White-box Coverage)", "Đảm bảo độ bao phủ câu lệnh (Statement Coverage 100%) và bao phủ nhánh (Branch Coverage 100%) đối với các hàm tính tiền, tính giờ đếm ngược và hoàn tiền bảo hiểm.")

    add_h3("2.1.2. Danh sách các Unit Test Case chi tiết")

    # Unit Test Table 1: Đăng Ký
    add_p("Bảng 2.1: Danh sách Unit Test Case Kiểm Tra Hàm Đăng Ký (validateRegistration)", bold=True, space_before=4)
    add_p("• Chữ ký hàm: validateRegistration(username, password, phone) - Ràng buộc: username 4-30 ký tự, password >= 6, phone 10 số", italic=True, font_size=11)
    ut1_headers = ["Test ID", "Kỹ thuật", "Mục tiêu kiểm thử", "Dữ liệu đầu vào (Input)", "Kết quả mong đợi", "Mức ưu tiên"]
    ut1_rows = [
        ["UTC-REG-01", "BVA", "Biên dưới hợp lệ tên đăng nhập (4 ký tự)", "user: 'game', pass: '123456', phone: '0912345678'", "Hợp lệ (True, không có lỗi)", "High"],
        ["UTC-REG-02", "BVA", "Dưới biên tên đăng nhập (3 ký tự)", "user: 'gam', pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập phải từ 4 ký tự trở lên'", "High"],
        ["UTC-REG-03", "EP", "Tên đăng nhập để trống", "user: '', pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập không được để trống'", "High"],
        ["UTC-REG-04", "BVA", "Biên trên hợp lệ tên đăng nhập (30 ký tự)", "user: 'Chuỗi 30 ký tự...', pass: '123456', phone: '0912345678'", "Hợp lệ (True)", "Medium"],
        ["UTC-REG-05", "BVA", "Vượt quá biên trên tên đăng nhập (31 ký tự)", "user: 'Chuỗi 31 ký tự...', pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập không quá 30 ký tự'", "Medium"],
        ["UTC-REG-06", "EP", "Tên đăng nhập chứa khoảng trắng", "user: 'user name', pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập không chứa khoảng trắng'", "High"],
        ["UTC-REG-07", "EP", "Tên đăng nhập chứa ký tự đặc biệt", "user: 'user@123', pass: '123456', phone: '0912345678'", "Lỗi: 'Tên đăng nhập chỉ chứa chữ và số'", "High"],
        ["UTC-REG-08", "BVA", "Biên dưới mật khẩu (6 ký tự)", "user: 'validuser', pass: '123456', phone: '0912345678'", "Hợp lệ (True)", "High"],
        ["UTC-REG-09", "BVA", "Dưới biên mật khẩu (5 ký tự)", "user: 'validuser', pass: '12345', phone: '0912345678'", "Lỗi: 'Mật khẩu phải có ít nhất 6 ký tự'", "High"],
        ["UTC-REG-10", "EP", "Số điện thoại đúng 10 số di động", "phone: '0987654321'", "Hợp lệ (True)", "High"],
        ["UTC-REG-11", "EP", "Số điện thoại sai đầu số (bắt đầu bằng 01)", "phone: '0123456789'", "Lỗi: 'Số điện thoại không đúng định dạng di động'", "High"],
        ["UTC-REG-12", "Decision", "Tên đăng nhập đã tồn tại trong CSDL", "user: 'renter_demo' (đã có sẵn trong CSDL)", "Lỗi: 'Tên đăng nhập đã tồn tại trong hệ thống'", "High"]
    ]
    add_table_custom(ut1_headers, ut1_rows, col_widths=[1.1, 0.9, 1.8, 1.6, 1.7, 0.9])

    # Unit Test Table 2: Nạp Tiền
    add_p("Bảng 2.2: Danh sách Unit Test Case Kiểm Tra Hạn Mức Nạp Tiền (validateDepositAmount)", bold=True, space_before=6)
    add_p("• Chữ ký hàm: validateDepositAmount(amount) - Ràng buộc: 10.000 VNĐ <= amount <= 5.000.000 VNĐ", italic=True, font_size=11)
    ut2_headers = ["Test ID", "Kỹ thuật", "Mục tiêu kiểm thử", "Giá trị nạp (amount)", "Kết quả mong đợi", "Đánh giá"]
    ut2_rows = [
        ["UTC-DEP-01", "BVA", "Ngay dưới biên tối thiểu (9.999 VNĐ)", "9.999", "Lỗi: 'Số tiền nạp tối thiểu là 10.000 đ'", "Pass"],
        ["UTC-DEP-02", "BVA", "Tại biên tối thiểu hợp lệ (10.000 VNĐ)", "10.000", "Hợp lệ (True, cho phép tạo QR)", "Pass"],
        ["UTC-DEP-03", "BVA", "Ngay trên biên tối thiểu (11.000 VNĐ)", "11.000", "Hợp lệ (True, cho phép tạo QR)", "Pass"],
        ["UTC-DEP-04", "EP", "Giá trị hợp lệ thông thường trong khoảng", "200.000", "Hợp lệ (True, cho phép tạo QR)", "Pass"],
        ["UTC-DEP-05", "BVA", "Ngay dưới biên tối đa (4.999.000 VNĐ)", "4.999.000", "Hợp lệ (True, cho phép tạo QR)", "Pass"],
        ["UTC-DEP-06", "BVA", "Tại biên tối đa hợp lệ (5.000.000 VNĐ)", "5.000.000", "Hợp lệ (True, cho phép tạo QR)", "Pass"],
        ["UTC-DEP-07", "BVA", "Vượt quá biên tối đa (5.001.000 VNĐ)", "5.001.000", "Lỗi: 'Số tiền nạp tối đa là 5.000.000 đ'", "Pass"],
        ["UTC-DEP-08", "EP", "Số tiền âm", "-50.000", "Lỗi: 'Số tiền nạp không hợp lệ'", "Pass"],
        ["UTC-DEP-09", "EP", "Số tiền bằng 0", "0", "Lỗi: 'Số tiền nạp tối thiểu là 10.000 đ'", "Pass"],
        ["UTC-DEP-10", "EP", "Nhập ký tự chữ / ký tự đặc biệt", "'abc'", "Lỗi: 'Vui lòng nhập số tiền hợp lệ'", "Pass"]
    ]
    add_table_custom(ut2_headers, ut2_rows, col_widths=[1.1, 0.9, 2.1, 1.2, 2.0, 0.7])

    # Unit Test Table 3: Tính Tiền Thuê & Số Dư Ví
    add_p("Bảng 2.3: Danh sách Unit Test Case Kiểm Tra Tính Chi Phí và Số Dư Ví (Decision Table)", bold=True, space_before=6)
    add_p("• Chữ ký hàm: calculateRentalCost(pricePerHour, hours) và checkBalance(walletBalance, totalCost)", italic=True, font_size=11)
    ut3_headers = ["Test ID", "Kỹ thuật", "Số dư ví (balance)", "Giá/h & Giờ", "Tổng chi phí", "Kết quả mong đợi", "Độ ưu tiên"]
    ut3_rows = [
        ["UTC-PAY-01", "BVA", "100.000 đ", "15.000 đ × 1h (Biên dưới giờ)", "15.000 đ", "Đủ tiền (Thiếu: 0 đ). Cho phép thuê.", "High"],
        ["UTC-PAY-02", "BVA", "1.000.000 đ", "20.000 đ × 48h (Biên trên giờ)", "960.000 đ", "Đủ tiền (Thiếu: 0 đ). Cho phép thuê.", "High"],
        ["UTC-PAY-03", "BVA", "100.000 đ", "15.000 đ × 0h (Dưới biên giờ)", "0 đ", "Lỗi: 'Thời gian thuê tối thiểu 1 giờ'", "High"],
        ["UTC-PAY-04", "BVA", "100.000 đ", "15.000 đ × 49h (Vượt biên giờ)", "735.000 đ", "Lỗi: 'Thời gian thuê tối đa 48 giờ'", "High"],
        ["UTC-PAY-05", "Decision", "50.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư > Chi phí: Đủ tiền, ví còn 20.000đ", "High"],
        ["UTC-PAY-06", "Decision", "30.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư = Chi phí: Đủ tiền, ví còn 0đ", "High"],
        ["UTC-PAY-07", "Decision", "20.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư < Chi phí: Báo thiếu 10.000 đ, chặn thuê", "High"],
        ["UTC-PAY-08", "Decision", "0 đ", "15.000 đ × 2h", "30.000 đ", "Báo thiếu 30.000 đ, mở nút Nạp nhanh", "High"]
    ]
    add_table_custom(ut3_headers, ut3_rows, col_widths=[1.1, 0.9, 1.2, 1.6, 1.1, 1.5, 0.6])

    # Unit Test Table 4: Thêm Acc Mới Theo Chuẩn UC1
    add_p("Bảng 2.4: Danh sách Unit Test Case Kiểm Tra Form Thêm Tài Khoản Mới (Theo chuẩn đề bài UC1)", bold=True, space_before=6)
    add_p("• Ràng buộc theo tài liệu mẫu UC1_Add New Product: Mã sản phẩm (8-30 ký tự, chữ/số), Tên sản phẩm (10-50 ký tự), Ảnh <= 1MB", italic=True, font_size=11)
    ut4_headers = ["Test ID", "Trường test", "Kỹ thuật", "Giá trị kiểm thử", "Kết quả mong đợi", "Độ ưu tiên"]
    ut4_rows = [
        ["UTC-UC1-01", "Mã sản phẩm", "BVA", "Độ dài 7 ký tự ('ACC1234')", "Hiển thị lỗi độ dài mã (<8 ký tự)", "High"],
        ["UTC-UC1-02", "Mã sản phẩm", "BVA", "Độ dài 8 ký tự ('ACC12345')", "Hợp lệ", "High"],
        ["UTC-UC1-03", "Mã sản phẩm", "BVA", "Độ dài 30 ký tự", "Hợp lệ", "Medium"],
        ["UTC-UC1-04", "Mã sản phẩm", "BVA", "Độ dài 31 ký tự", "Hiển thị lỗi độ dài mã (>30 ký tự)", "Medium"],
        ["UTC-UC1-05", "Mã sản phẩm", "EP", "Chứa ký tự đặc biệt ('ACC@12345')", "Hiển thị lỗi định dạng mã sản phẩm", "High"],
        ["UTC-UC1-06", "Mã sản phẩm", "EP", "Chứa khoảng trắng ('ACC 12345')", "Hiển thị lỗi định dạng mã sản phẩm", "High"],
        ["UTC-UC1-07", "Mã sản phẩm", "Decision", "Mã đã tồn tại trong CSDL", "Hiển thị lỗi: 'Mã sản phẩm đã tồn tại'", "High"],
        ["UTC-UC1-08", "Tên sản phẩm", "BVA", "Độ dài 9 ký tự ('Nick Vip 1')", "Hiển thị lỗi tên quá ngắn (<10 ký tự)", "High"],
        ["UTC-UC1-09", "Tên sản phẩm", "BVA", "Độ dài 10 ký tự ('Nick Vip 01')", "Hợp lệ", "High"],
        ["UTC-UC1-10", "Tên sản phẩm", "BVA", "Độ dài 50 ký tự", "Hợp lệ", "Medium"],
        ["UTC-UC1-11", "Tên sản phẩm", "BVA", "Độ dài 51 ký tự", "Hiển thị lỗi tên quá dài (>50 ký tự)", "Medium"],
        ["UTC-UC1-12", "Ảnh đại diện", "EP", "Upload file sai định dạng (.pdf, .doc)", "Hiển thị lỗi: 'Định dạng ảnh không hợp lệ'", "High"],
        ["UTC-UC1-13", "Ảnh đại diện", "BVA", "Upload file dung lượng 1.5MB (> 1MB)", "Hiển thị lỗi: 'Dung lượng ảnh vượt quá 1MB'", "High"]
    ]
    add_table_custom(ut4_headers, ut4_rows, col_widths=[1.1, 1.2, 0.8, 1.8, 2.3, 0.8])

    doc.add_page_break()

    # =========================================================
    # 2.2. THIẾT KẾ INTEGRATION TEST CASE
    # =========================================================
    add_h2("2.2. Thiết kế Integration Test Case")

    add_h3("2.2.1. Phương pháp và chiến lược kiểm thử tích hợp (Chiến lược Sandwich)")
    add_p("Kiểm thử tích hợp (Integration Testing) đánh giá tính đúng đắn trong giao tiếp, trao đổi dữ liệu và đồng bộ trạng thái giữa các thành phần giao diện (UI Components), tầng quản lý trạng thái tập trung (AppContext) và kho lưu trữ bền vững (LocalStorage Engine).")
    add_p("Nhóm áp dụng **Chiến lược kiểm thử tích hợp Sandwich (Hybrid Integration Strategy)** kết hợp ưu điểm của cả Top-Down và Bottom-Up:")
    add_bullet("1. Hướng Top-Down", "Kiểm tra từ luồng thao tác sự kiện của người dùng trên UI (click chuột, nhập input, submit modal) truyền dữ liệu xuống Context API và tự động re-render cập nhật giao diện của các component liên quan.")
    add_bullet("2. Hướng Bottom-Up", "Kiểm tra tính nhất quán dữ liệu từ lớp cơ sở LocalStorage khi nạp vào State và truyền dữ liệu ngược lên các component hiển thị.")
    add_bullet("3. Các điểm kết nối tích hợp trọng điểm được kiểm thử", "Bao gồm:")
    add_bullet("  • Điểm 1: AuthModal ↔ Navbar ↔ AppContext ↔ LocalStorage", "Đăng nhập -> Cập nhật currentUser -> Navbar hiển thị tên, số dư ví và menu tương ứng.")
    add_bullet("  • Điểm 2: DepositModal ↔ WalletPage ↔ Transactions", "Xác nhận nạp VietQR -> Cập nhật balance -> Bảng giao dịch xuất hiện dòng mới tức thì.")
    add_bullet("  • Điểm 3: RentConfirmModal ↔ AccountDetailPage ↔ MyRentalsPage ↔ HomePage", "Xác nhận thuê -> Trừ ví -> Acc chuyển status 'rented' -> MyRentalsPage sinh đơn mới có CountdownTimer.")
    add_bullet("  • Điểm 4: MyRentalsPage ↔ CountdownTimer ↔ Modal Gia Hạn", "Gia hạn thêm giờ -> Cập nhật expiresAt -> Đồng hồ đếm ngược tự động nhận thời gian mới mà không reload trang.")
    add_bullet("  • Điểm 5: DisputeModal ↔ OverviewDashboard ↔ WalletPage", "Khách báo lỗi -> Đơn chuyển 'disputed' -> Admin duyệt hoàn tiền -> Ví khách nhận lại 100% tiền đơn -> Nick chuyển 'maintenance'.")
    add_bullet("  • Điểm 6: AdminDashboardPage (Form UC1) ↔ HomePage (Catalog)", "Admin tạo nick mới -> Danh mục Cửa hàng Client xuất hiện ngay sản phẩm sẵn sàng cho thuê.")

    add_h3("2.2.2. Danh sách các Integration Test Case chi tiết")
    add_p("Bảng 2.5: Danh sách 10 Integration Test Case kiểm tra tích hợp đa module trong hệ thống GameRent:", bold=True, space_before=4)

    it_headers = ["Test ID", "Các Module / Màn hình tích hợp", "Mục tiêu kiểm thử", "Trình tự các bước thực hiện (Steps)", "Kết quả mong đợi", "Độ ưu tiên"]
    it_rows = [
        ["ITC-01", "AuthModal ↔ Navbar ↔ AppContext", "Tích hợp đăng nhập và cập nhật trạng thái Navbar",
         "1. Mở AuthModal.\n2. Nhập 'renter_demo' / 'password123'.\n3. Nhấn 'Đăng Nhập Ngay'.",
         "1. AuthModal tự đóng.\n2. Navbar lập tức hiển thị avatar, tên 'Khách Hàng Demo' và số dư ví '100.000 đ'.\n3. LocalStorage lưu session thành công.", "High"],

        ["ITC-02", "DepositModal ↔ WalletPage ↔ LocalStorage", "Tích hợp nạp tiền ví và cập nhật số dư & lịch sử giao dịch",
         "1. Vào WalletPage (số dư 100.000 đ).\n2. Nhấn 'Nạp Tiền Vào Ví'.\n3. Chọn gói 200.000 đ, bấm 'Tạo Mã VietQR'.\n4. Bấm 'Xác Nhận Đã Chuyển Tiền'.",
         "1. Số dư ví trên WalletPage và Navbar nhảy lên '300.000 đ'.\n2. Bảng lịch sử thêm dòng: 'TX-XXXXX | Nạp tiền ví VietQR | +200.000 đ | Thành công'.", "High"],

        ["ITC-03", "RentConfirmModal ↔ AccountDetailPage ↔ MyRentalsPage ↔ HomePage", "Tích hợp luồng thuê tài khoản, trừ ví, đổi trạng thái nick và tạo đơn hàng",
         "1. User có 300.000 đ ví.\n2. Chọn acc 'ACCVAL001' giá 15.000 đ/h.\n3. Chọn thuê 2 giờ (30.000 đ).\n4. Bấm 'Xác Nhận Thanh Toán'.",
         "1. Ví bị trừ 30.000 đ (còn 270.000 đ).\n2. Acc 'ACCVAL001' trên HomePage chuyển sang badge 'Đang Được Thuê'.\n3. MyRentalsPage sinh đơn mới (#ORDER-XXX) có CountdownTimer đếm ngược 01:59:59.", "High"],

        ["ITC-04", "MyRentalsPage ↔ RentConfirmModal (Gia hạn) ↔ CountdownTimer", "Tích hợp gia hạn đơn thuê và đồng bộ đồng hồ đếm ngược",
         "1. Tại đơn hàng đang còn 30 phút.\n2. Nhấn nút 'Gia Hạn Thêm Giờ'.\n3. Chọn thêm 1 giờ (15.000 đ).\n4. Nhấn xác nhận.",
         "1. Ví trừ tiếp 15.000 đ.\n2. Mốc thời gian kết thúc tăng thêm 3.600 giây.\n3. CountdownTimer cập nhật tức thì thành 01:29:59 mà không reload trang.", "High"],

        ["ITC-05", "MyRentalsPage ↔ ReturnEarlyModal ↔ HomePage", "Tích hợp trả acc sớm và thu hồi thông tin đăng nhập",
         "1. Khách đang chơi đơn hàng #ORDER-XXX.\n2. Bấm nút 'Trả Nick Sớm'.\n3. Bấm 'Xác Nhận Trả Sớm'.",
         "1. Trạng thái đơn chuyển sang 'completed'.\n2. Hộp thông tin bí mật ẩn pass và hiển thị 'Đã thu hồi'.\n3. Trạng thái acc chuyển sang 'need_change_pass'.", "Medium"],

        ["ITC-06", "DisputeModal ↔ OverviewDashboard ↔ WalletPage", "Tích hợp gửi khiếu nại báo lỗi và Admin duyệt hoàn tiền 100%",
         "1. Khách bấm 'Báo Sự Cố' đơn 30.000 đ, chọn 'Sai mật khẩu', gửi khiếu nại.\n2. Đổi sang vai trò Admin.\n3. Vào Dashboard, xem khiếu nại, bấm 'Phê Duyệt & Hoàn Tiền'.",
         "1. Khiếu nại chuyển trạng thái 'resolved'.\n2. Tài khoản game tự động chuyển sang 'maintenance' (Bảo trì).\n3. Ví của khách thuê được hoàn đúng 30.000 đ kèm lịch sử 'Hoàn tiền bảo hiểm'.", "High"],

        ["ITC-07", "AdminDashboardPage (Form UC1) ↔ HomePage (Catalog)", "Tích hợp thêm acc mới từ Admin và hiển thị lên Client",
         "1. Admin mở Form 'Thêm Acc Mới'.\n2. Nhập mã 'ACCVAL099', Game: Valorant, Giá: 25.000 đ, Rank: Ascendant.\n3. Nhấn 'Lưu Tài Khoản'.\n4. Chuyển sang Trang chủ Client.",
         "1. Thông báo Toast thêm thành công.\n2. Trang chủ Client bộ lọc Valorant xuất hiện ngay thẻ acc 'ACCVAL099' với đầy đủ ảnh, giá thuê và nút 'Thuê Ngay'.", "High"],

        ["ITC-08", "OverviewDashboard (Live Session Modal) ↔ MyRentalsPage", "Tích hợp Admin điều phối bù giờ (+1h) và cập nhật đơn khách",
         "1. Admin mở OverviewDashboard, bấm vào dòng phiên thuê đang chạy của khách.\n2. Modal Giám Sát mở ra, Admin bấm 'Bù thêm giờ (+1h)'.\n3. Khách mở MyRentalsPage kiểm tra.",
         "1. Toast thông báo 'Đã bù thêm 1 giờ chơi cho khách'.\n2. Mốc expiresAt của đơn được cộng 3.600 giây.\n3. CountdownTimer phía khách hàng tự động nhảy tăng thêm 1 giờ chơi.", "High"],

        ["ITC-09", "AccountDetailPage ↔ RentConfirmModal ↔ DepositModal (Auto Redirect)", "Tích hợp điều hướng nạp tiền tự động khi thiếu số dư ví",
         "1. Khách có ví 10.000 đ, bấm thuê nick 45.000 đ.\n2. RentConfirmModal cảnh báo thiếu 35.000 đ.\n3. Khách bấm nút 'Nạp tiền ngay'.",
         "1. RentConfirmModal tự đóng.\n2. DepositModal tự động mở lên với số tiền gợi ý sẵn '50.000 đ'.\n3. Sau khi nạp xong tự động quay lại đơn thuê.", "Medium"],

        ["ITC-10", "FloatingTesterToolbar ↔ AppContext ↔ All Components", "Tích hợp thanh công cụ Tester BTL chuyển đổi State thời gian thực",
         "1. Bấm nút 'Nạp Nhanh +200k'.\n2. Bấm nút 'Tua Nhanh -30 Phút'.\n3. Bấm 'Đổi Role sang Admin'.",
         "1. Số dư ví lập tức +200.000 đ trên toàn hệ thống.\n2. Các đơn đang thuê giảm ngay 30 phút trên CountdownTimer.\n3. Giao diện chuyển ngay sang quyền Admin mà không mất dữ liệu.", "Medium"]
    ]
    add_table_custom(it_headers, it_rows, col_widths=[0.8, 1.4, 1.4, 1.6, 2.3, 0.5])

    doc.add_page_break()

    # =========================================================
    # 2.3. THIẾT KẾ SYSTEM TEST CASE
    # =========================================================
    add_h2("2.3. Thiết kế System Test Case")

    add_h3("2.3.1. Phương pháp kiểm thử hệ thống E2E và Kiểm thử chuyển trạng thái")
    add_p("Kiểm thử hệ thống (System Testing) là cấp độ kiểm thử toàn diện đánh giá sự tuân thủ của toàn bộ ứng dụng GameRent đối với các yêu cầu đặc tả ban đầu từ góc độ người dùng cuối (End-to-End Black-box Testing).")
    add_p("Nhóm vận dụng 3 phương pháp kiểm thử hệ thống chuẩn mực:")
    add_bullet("1. Kiểm thử luồng nghiệp vụ E2E (End-to-End Testing)", "Bao quát cả luồng thuận lợi (Happy Path - người dùng thao tác tuần tự, đủ tiền, nhập đúng) và luồng xử lý ngoại lệ (Sad Path / Negative Scenarios - thiếu tiền, sai định dạng, sự cố máy chủ game).")
    add_bullet("2. Kiểm thử chuyển trạng thái (State Transition Testing)", "Kiểm thử vòng đời biến đổi trạng thái của 2 thực thể cốt lõi trong hệ thống:")

    st_trans_headers = ["Thực Thể", "Trạng Thái Ban Đầu", "Sự Kiện Kích Hoạt (Trigger Event)", "Trạng Thái Tiếp Theo", "Hành Động Hệ Thống Đi Kèm"]
    st_trans_rows = [
        ["Tài khoản game", "available (Sẵn sàng)", "Khách thanh toán thuê thành công", "rented (Đang thuê)", "Khóa nick, ẩn nút thuê đối với người khác"],
        ["Tài khoản game", "rented (Đang thuê)", "Hết giờ thuê hoặc Khách trả nick sớm", "need_change_pass", "Thu hồi mật khẩu, gắn cờ chờ đổi pass"],
        ["Tài khoản game", "rented (Đang thuê)", "Khách gửi khiếu nại báo lỗi sự cố", "maintenance (Bảo trì)", "Khóa nick để kỹ thuật viên kiểm tra"],
        ["Tài khoản game", "maintenance", "Admin đổi xong mật khẩu và mở lại", "available (Sẵn sàng)", "Mở khóa nick, đưa lên kệ Cửa hàng cho thuê"],
        ["Đơn thuê", "active (Đang chạy)", "Đồng hồ đếm ngược chạm mốc 00:00:00", "completed (Hoàn tất)", "Đóng phiên thuê, chuyển vào Lịch sử đơn"],
        ["Đơn thuê", "active (Đang chạy)", "Khách chủ động bấm Trả Acc Sớm", "returned_early", "Hoàn 50% tiền giờ còn lại, đóng phiên"],
        ["Đơn thuê", "active (Đang chạy)", "Khách bấm Báo Lỗi Sự Cố", "disputed (Khiếu nại)", "Chuyển khiếu nại cho Admin xét duyệt"],
        ["Đơn thuê", "disputed", "Admin bấm Phê Duyệt & Hoàn Tiền", "refunded (Đã hoàn tiền)", "Hoàn 100% tiền đơn vào ví khách hàng"]
    ]
    add_table_custom(st_trans_headers, st_trans_rows, col_widths=[1.2, 1.3, 1.7, 1.4, 1.8])

    add_bullet("3. Môi trường kiểm thử chuẩn hóa", "Trình duyệt Google Chrome (v120+), Microsoft Edge; Màn hình Desktop Full HD (1920x1080) và Mobile Responsive (375x812); CSDL Mock LocalStorage với bộ Seed Data từ `initialData.js`.")

    add_h3("2.3.2. Danh sách các System Test Case chi tiết")
    add_p("Bảng 2.6: Danh sách 12 System Test Case E2E bao phủ toàn diện các luồng nghiệp vụ của GameRent:", bold=True, space_before=4)

    st_headers = ["Mã Kịch Bản", "Tên Kịch Bản E2E", "Tiền Điều Kiện", "Các Bước Thực Hiện (Steps)", "Dữ Liệu Kiểm Thử", "Kết Quả Mong Đợi", "Mức Ưu Tiên"]
    st_rows = [
        ["STC-E2E-01", "Đăng ký thành viên mới và tự động đăng nhập",
         "Khách vãng lai, chưa đăng nhập",
         "1. Bấm 'Đăng nhập / Đăng ký'.\n2. Chọn tab 'Đăng Ký'.\n3. Nhập Username, Mật khẩu, SĐT.\n4. Bấm 'Tạo Tài Khoản'.",
         "User: 'gamethu_pro'\nPass: 'Matkhau@123'\nPhone: '0988776655'",
         "1. Toast đăng ký thành công.\n2. Tự động đăng nhập, ví được cộng 50.000đ dùng thử.\n3. Navbar hiển thị 'gamethu_pro' và số dư ví '50.000 đ'.", "High"],

        ["STC-E2E-02", "Đăng nhập thất bại do sai mật khẩu",
         "Tài khoản đã có trong hệ thống",
         "1. Mở Modal Đăng nhập.\n2. Nhập đúng Username.\n3. Nhập sai Mật khẩu.\n4. Bấm 'Đăng Nhập Ngay'.",
         "User: 'renter_demo'\nPass: 'sai_mat_khau'",
         "1. Hệ thống từ chối đăng nhập.\n2. Hiển thị thông báo lỗi màu đỏ: 'Mật khẩu không chính xác'.", "High"],

        ["STC-E2E-03", "Nạp tiền ví tự động qua VietQR và đối soát số dư",
         "User đã đăng nhập, ví hiện tại có 50.000 đ",
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
         "1. Khách A: Thuê thành công, nhận nick.\n2. Khách B: Hệ thống báo lỗi 'Tài khoản này vừa được người khác thuê, vui lòng chọn tài khoản khác', không bị trừ tiền ví.", "High"]
    ]
    add_table_custom(st_headers, st_rows, col_widths=[0.9, 1.2, 1.1, 1.3, 1.1, 1.9, 0.5])

    doc.add_page_break()

    # =========================================================
    # TỔNG KẾT
    # =========================================================
    add_h1("TỔNG KẾT VÀ ĐÁNH GIÁ KẾT QUẢ CHƯƠNG 1 VÀ CHƯƠNG 2")
    add_p("Thông qua việc nghiên cứu, phân tích và biên soạn chi tiết Chương 1 và Chương 2 của Báo cáo bài tập lớn môn Kiểm thử phần mềm, Nhóm 16 đã hoàn thành toàn diện các mục tiêu đề ra:")
    add_bullet("1. Hoàn thiện tổng quan bài toán và đặc tả yêu cầu (Chương 1)", "Đã phân tích sắc bén bối cảnh 6 tựa game hot nhất hiện nay, phát biểu bài toán tự động hóa sàn GameRent 24/7, mô tả 10 Use Case hoàn chỉnh, đặc tả chi tiết các trường dữ liệu trên 8 màn hình/modal chức năng và phân rã 7 module nghiệp vụ cốt lõi.")
    add_bullet("2. Thiết kế bài bản bộ Test Case đa cấp độ (Chương 2)", "Đã vận dụng thành thạo và chuẩn mực các kỹ thuật kiểm thử hộp đen và hộp trắng theo chuẩn quốc tế ISTQB:")
    add_bullet("  • Cấp độ Unit Test", "Xây dựng 4 bảng test case với hơn 35 test case chi tiết áp dụng Phân tích giá trị biên (BVA), Phân vùng tương đương (EP), Bảng quyết định (Decision Table) và tuân thủ nghiêm ngặt tài liệu mẫu UC1_Add New Product của giảng viên.")
    add_bullet("  • Cấp độ Integration Test", "Xây dựng 10 kịch bản kiểm thử tích hợp (ITC-01 đến ITC-10) theo chiến lược Sandwich, kiểm soát sự đồng bộ giữa giao diện React Component, bộ quản lý trạng thái AppContext và kho lưu trữ LocalStorage.")
    add_bullet("  • Cấp độ System Test", "Xây dựng 12 kịch bản kiểm thử hệ thống E2E hoàn chỉnh (STC-E2E-01 đến STC-E2E-12) cùng Bảng chuyển trạng thái thực thể (State Transition), bao quát trọn vẹn cả luồng thuận lợi (Happy Path), luồng ngoại lệ (Sad Path), bảo hiểm bồi hoàn 100%, chống race condition và điều phối Admin Live Session.")
    add_bullet("3. Mức độ sẵn sàng cho các chương tiếp theo", "Bộ tài liệu đặc tả và thiết kế test case này là cơ sở vững chắc, trực tiếp phục vụ cho việc thực thi test, ghi nhận lỗi (Log Bug) tại Chương 3 và cài đặt kịch bản kiểm thử tự động (Automation Test với Playwright / Selenium) tại Chương 4.")

    # Save document
    docx_path = "e:\\BTL_KTPM\\BTL_KTPM_Chuong_1_va_Chuong_2.docx"
    pdf_path = "e:\\BTL_KTPM\\BTL_KTPM_Chuong_1_va_Chuong_2.pdf"
    backup_docx_path = "e:\\BTL_KTPM\\Tài_Liệu\\BTL_KTPM_Chuong_1_va_Chuong_2.docx"
    backup_pdf_path = "e:\\BTL_KTPM\\Tài_Liệu\\BTL_KTPM_Chuong_1_va_Chuong_2.pdf"

    doc.save(docx_path)
    print(f"[OK] Đã lưu file Word thành công: {docx_path}")

    # Copy Word to Tài_Liệu folder
    shutil.copyfile(docx_path, backup_docx_path)
    print(f"[OK] Đã sao chép 1 bản Word sang: {backup_docx_path}")

    # Convert to PDF
    print("[...] Đang chuyển đổi sang file PDF bằng docx2pdf...")
    try:
        convert(docx_path, pdf_path)
        print(f"[OK] Đã xuất file PDF thành công: {pdf_path}")
        
        # Copy PDF to Tài_Liệu folder
        shutil.copyfile(pdf_path, backup_pdf_path)
        print(f"[OK] Đã sao chép thêm 1 bản PDF vào thư mục: {backup_pdf_path}")
    except Exception as e:
        print(f"[ERROR] Chuyển đổi PDF thất bại: {e}")

if __name__ == "__main__":
    create_report()
