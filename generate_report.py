# -*- coding: utf-8 -*-
"""
Script to generate the complete BTL KTPM Report: Chương 1 & Chương 2
Follows strictly the structure of:
- YÊU CẦU BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM.pdf
- Phiếu Chấm_Kiểm Thử PM.pdf
- Bang_Dac_Ta_Use_Case_GameRent.pdf
- UC1_Add New Product.pdf
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
from docx2pdf import convert

def create_report():
    doc = docx.Document()

    # Configure Margins: Left 3cm (~1.18 in), Right 2cm (~0.79 in), Top 2cm, Bottom 2cm
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
    font.size = Pt(12.5)
    font.color.rgb = RGBColor(33, 37, 41)
    style_normal.paragraph_format.line_spacing = 1.25
    style_normal.paragraph_format.space_after = Pt(4)

    # Color definitions
    NAVY = RGBColor(26, 54, 93)       # #1A365D
    BLUE = RGBColor(43, 108, 176)     # #2B6CB0
    DARK_GRAY = RGBColor(45, 55, 72)  # #2D3748
    TEXT_COLOR = RGBColor(33, 37, 41)
    ORANGE = RGBColor(234, 88, 12)    # #EA580C

    def set_cell_background(cell, fill_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
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

    def add_p(text="", bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, color=TEXT_COLOR, font_size=12.5):
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
        run.font.size = Pt(15.5)
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
        run.font.size = Pt(13.5)
        run.font.color.rgb = BLUE
        return p

    def add_h3(title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(7)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title)
        run.bold = True
        run.italic = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12.5)
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
            r1.font.size = Pt(12)
            r1.font.color.rgb = TEXT_COLOR
        r2 = p.add_run(text)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(12)
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
            set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            for run in p.runs:
                run.bold = True
                run.font.name = 'Times New Roman'
                run.font.size = Pt(11)
                run.font.color.rgb = RGBColor(255, 255, 255)

        # Data Rows
        for r_idx, row_data in enumerate(rows):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].text = str(cell_value)
                set_cell_background(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=90, bottom=90, left=120, right=120)
                p = row_cells[c_idx].paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.15
                if c_idx in [0, 1] or len(cell_value) < 15:
                    if c_idx == 0:
                        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    else:
                        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in p.runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(10.5)
                    run.font.color.rgb = TEXT_COLOR

        # Set Column Widths if provided
        if col_widths:
            for row in table.rows:
                for c_idx, w in enumerate(col_widths):
                    row.cells[c_idx].width = Inches(w)

        # Table borders (clean light gray borders)
        tblPr = table._tbl.tblPr
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
        tblPr.append(borders)

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(2)
        p_after.paragraph_format.space_after = Pt(6)

    # ==========================================
    # 1. TRANG BÌA (COVER PAGE)
    # ==========================================
    add_p("BỘ GIÁO DỤC VÀ ĐÀO TẠO", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2)
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=2, color=NAVY)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=18)

    add_p("─────────── ★ ───────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=36, color=BLUE)

    add_p("BÁO CÁO BÀI TẬP LỚN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=20, space_after=12, color=ORANGE)
    add_p("HỌC PHẦN: KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=16, space_after=24, color=NAVY)

    add_p("TÊN ĐỀ TÀI:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=6)
    add_p("XÂY DỰNG VÀ THỰC HIỆN KIỂM THỬ HỆ THỐNG CHO THUÊ TÀI KHOẢN GAME TRỰC TUYẾN TỰ ĐỘNG 24/7 (GAMERENT)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=16, space_after=10, color=NAVY)
    add_p("NỘI DUNG THỰC HIỆN: CHƯƠNG 1 (TỔNG QUAN BÀI TOÁN) & CHƯƠNG 2 (PHÂN TÍCH VÀ THIẾT KẾ TEST)", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=40, color=DARK_GRAY)

    add_p("──────────────────────────────────────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, color=BLUE)

    # Info block
    add_p("Giảng viên hướng dẫn:", bold=True, font_size=12.5, space_before=10, space_after=2)
    add_p("  • Giảng viên: ThS. Phạm Thị Loan", font_size=12, space_after=6)
    add_p("Nhóm sinh viên thực hiện:", bold=True, font_size=12.5, space_after=2)
    add_p("  1. Lê Hải Đăng", font_size=12, space_after=2)
    add_p("  2. Lê Minh Quân", font_size=12, space_after=2)
    add_p("  3. Lê Xuân Đạt", font_size=12, space_after=2)
    add_p("  4. Lê Thanh Tùng", font_size=12, space_after=6)
    add_p("Khoa: Công nghệ thông tin - Trường Đại học Công nghệ Đông Á", font_size=12, space_after=2)
    add_p("Lớp chuyên ngành: Công nghệ phần mềm / CNTT", font_size=12, space_after=2)
    add_p("Học kỳ I - Năm học 2026 - 2027", font_size=12, space_after=24)

    add_p("HÀ NỘI – NĂM 2026", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=0, color=NAVY)

    doc.add_page_break()

    # ==========================================
    # PHIẾU ĐÁNH GIÁ (THEO MẪU PHIẾU CHẤM)
    # ==========================================
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=1)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=6)
    add_p("PHIẾU ĐÁNH GIÁ KẾT QUẢ BÀI TẬP LỚN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13.5, space_after=3, color=NAVY)
    add_p("(Trích từ mẫu Phiếu Chấm Thi Kết Thúc Học Phần - Môn: Kiểm thử phần mềm)", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=8)

    # Member list table
    add_p("DANH SÁCH SINH VIÊN NHÓM THỰC HIỆN:", bold=True, font_size=11, space_after=3)
    member_headers = ["STT", "Họ và tên", "Mã sinh viên", "Lớp", "Nhiệm vụ phân công"]
    member_rows = [
        ["1", "Lê Hải Đăng", "....................", "CNTT", "Phân tích yêu cầu, Thiết kế Unit Test Case (BVA, EP)"],
        ["2", "Lê Minh Quân", "....................", "CNTT", "Phát triển Web App, Thiết kế System Test Case E2E"],
        ["3", "Lê Xuân Đạt", "....................", "CNTT", "Thiết kế Integration Test Case & State Transition"],
        ["4", "Lê Thanh Tùng", "....................", "CNTT", "Thiết kế Decision Table, Kiểm thử giao diện & Báo cáo"]
    ]
    add_table_custom(member_headers, member_rows, col_widths=[0.5, 1.8, 1.3, 0.8, 2.6], header_bg="2B6CB0")

    add_p("TIÊU CHÍ ĐÁNH GIÁ ĐIỂM BÀI THI:", bold=True, font_size=11, space_before=4, space_after=3)
    rubric_headers = ["STT", "Nội dung tiêu chí đánh giá", "Thang điểm", "Điểm đạt"]
    rubric_rows = [
        ["1", "HÌNH THỨC TRÌNH BÀY BÀI THI", "1.0 đ", ""],
        ["1.1", "Trình bày báo cáo đúng định dạng (font, giãn dòng, căn lề, mục lục)", "0.5 đ", ""],
        ["1.2", "Trình bày đúng bố cục chuẩn bài tập lớn môn Kiểm thử phần mềm", "0.5 đ", ""],
        ["2", "NỘI DUNG BÀI THI BẢN MỀM (BÁO CÁO BTL)", "5.0 đ", ""],
        ["2.1", "Thực hiện Unit Test: Xác định các module, viết Unit test case đầy đủ kỹ thuật (BVA, EP, Decision Table)", "1.0 đ", ""],
        ["2.2", "Thực hiện Integration Test: Xác định màn hình (0.5đ), Viết Integration test case (0.5đ), Thực hiện & log bug (0.5đ)", "1.5 đ", ""],
        ["2.3", "Thực hiện System Test: Xác định luồng E2E (1.0đ), Viết System test case (1.0đ), Báo cáo lỗi (0.5đ)", "2.5 đ", ""],
        ["3", "VẤN ĐÁP (Kỹ thuật thiết kế test, nguyên lý kiểm thử, quy trình log bug)", "4.0 đ", ""],
        ["TỔNG", "TỔNG ĐIỂM TOÀN BỘ BÀI TẬP LỚN (1) + (2) + (3)", "10.0 đ", ""]
    ]
    add_table_custom(rubric_headers, rubric_rows, col_widths=[0.6, 4.3, 1.2, 0.9], header_bg="1A365D")

    add_p("Cán bộ chấm thi 1: .......................................      Cán bộ chấm thi 2: .......................................", italic=True, space_before=4, space_after=10)

    doc.add_page_break()

    # ==========================================
    # LỜI MỞ ĐẦU & MỤC LỤC
    # ==========================================
    add_h1("LỜI MỞ ĐẦU")
    add_p("Trong bối cảnh ngành công nghệ thông tin và giải trí số ngày càng bùng nổ, thị trường thể thao điện tử (Esports) và game trực tuyến (Valorant, Liên Minh Huyền Thoại, Liên Quân Mobile, CS2, Genshin Impact...) đang thu hút hàng triệu người chơi. Nhu cầu trải nghiệm các tài khoản game sở hữu bậc xếp hạng cao hoặc những bộ trang phục (skin) hiếm và đắt đỏ là rất lớn. Tuy nhiên, hình thức mua bán hoặc thuê tài khoản truyền thống qua các hội nhóm mạng xã hội (Facebook, Zalo, Discord) thường xuyên tiềm ẩn các rủi ro nghiêm trọng: lừa đảo chiếm đoạt tài khoản, thông tin đăng nhập sai lệch, không có cơ chế hoàn tiền khi gặp sự cố, và giao dịch hoàn toàn mang tính thủ công.")
    add_p("Nhằm giải quyết triệt để bài toán thực tế trên, đề tài \"Xây dựng và thực hiện kiểm thử hệ thống cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent)\" được xây dựng. Hệ thống cung cấp giải pháp khép kín: từ nạp tiền ví điện tử qua mã VietQR tự động, lựa chọn giờ thuê, cấp thông tin tài khoản tức thì, đồng hồ đếm ngược thời gian thực, gia hạn ca chơi, đến quy trình trả acc sớm và cơ chế khiếu nại bồi hoàn 100% bảo hiểm minh bạch.")
    add_p("Đặc biệt, trong khuôn khổ môn học Kiểm thử phần mềm (Software Testing & QA), hệ thống GameRent được thiết kế và xây dựng như một nền tảng thực nghiệm mẫu chuẩn mực. Mã nguồn và giao diện người dùng được chuẩn hóa toàn diện với các định danh kiểm thử tự động (data-testid), cấu trúc module hóa rõ ràng nhằm áp dụng triệt để các kỹ thuật thiết kế ca kiểm thử hiện đại: Phân tích giá trị biên (BVA), Phân vùng tương đương (EP), Bảng quyết định (Decision Table) và Kiểm thử chuyển trạng thái (State Transition Testing).")
    add_p("Báo cáo này tập trung trình bày chuyên sâu hai nội dung trọng tâm của đề tài:")
    add_bullet("Chương 1: Tổng quan bài toán", "Giới thiệu bối cảnh thực tế, phát biểu bài toán, mô tả luồng nghiệp vụ E2E, đặc tả các màn hình chức năng, cấu trúc dữ liệu và 7 module nghiệp vụ cốt lõi.")
    add_bullet("Chương 2: Phân tích và thiết kế test", "Trình bày cơ sở lý thuyết, phương pháp kỹ thuật thiết kế test case và xây dựng bộ ma trận ca kiểm thử hoàn chỉnh cho cả 3 cấp độ: Unit Test, Integration Test và System Test.")

    add_p("Nhóm sinh viên xin chân thành cảm ơn cô Phạm Thị Loan cùng các thầy cô trong bộ môn Công nghệ phần mềm - Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đông Á đã tận tình truyền đạt kiến thức và hướng dẫn phương pháp trong suốt quá trình học tập và nghiên cứu!", italic=True, space_before=10, space_after=14)

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
    add_p("    1.2.1. Các luồng nghiệp vụ chính E2E của hệ thống .................................................................................. 7", font_size=10, space_after=2)
    add_p("    1.2.2. Đặc tả các màn hình chức năng chính ............................................................................................ 9", font_size=10, space_after=2)
    add_p("    1.2.3. Các Module chức năng chính của chương trình ............................................................................. 13", font_size=10, space_after=2)
    add_p("CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST .......................................................................................... 16", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  2.1. THIẾT KẾ UNIT TEST CASE .............................................................................................................. 16", font_size=10.5, space_after=2)
    add_p("    2.1.1. Phương pháp và kỹ thuật kiểm thử Unit ......................................................................................... 16", font_size=10, space_after=2)
    add_p("    2.1.2. Danh sách các Unit Test Case chi tiết ........................................................................................... 17", font_size=10, space_after=2)
    add_p("  2.2. THIẾT KẾ INTEGRATION TEST CASE ........................................................................................... 21", font_size=10.5, space_after=2)
    add_p("    2.2.1. Phương pháp và chiến lược kiểm thử tích hợp .............................................................................. 21", font_size=10, space_after=2)
    add_p("    2.2.2. Danh sách các Integration Test Case chi tiết ................................................................................ 22", font_size=10, space_after=2)
    add_p("  2.3. THIẾT KẾ SYSTEM TEST CASE ........................................................................................................ 25", font_size=10.5, space_after=2)
    add_p("    2.3.1. Phương pháp và kỹ thuật kiểm thử hệ thống E2E .......................................................................... 25", font_size=10, space_after=2)
    add_p("    2.3.2. Danh sách các System Test Case chi tiết ........................................................................................ 26", font_size=10, space_after=2)
    add_p("TỔNG KẾT VÀ ĐÁNH GIÁ KẾT QUẢ ......................................................................................................... 30", bold=True, font_size=11, space_after=4)

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 1: TỔNG QUAN BÀI TOÁN
    # =========================================================
    add_h1("CHƯƠNG 1: TỔNG QUAN BÀI TOÁN")

    add_h2("1.1. Giới thiệu đề tài")

    add_h3("1.1.1. Thu thập đầu bài và bối cảnh bài toán trong thực tế")
    add_p("Trong kỷ nguyên thể thao điện tử phát triển vượt bậc, thị trường trò chơi trực tuyến đang ghi nhận sự thống trị của các tựa game nổi tiếng như Valorant, Liên Minh Huyền Thoại, Liên Quân Mobile, Counter-Strike 2 và Genshin Impact. Một bộ phận rất lớn game thủ có các nhu cầu thực tế như sau:")
    add_bullet("Nhu cầu trải nghiệm trang phục cao cấp (Skin VIP)", "Trong các tựa game như Valorant hay CS2, những bộ skin vũ khí giới hạn có giá trị lên đến hàng triệu hoặc hàng chục triệu đồng. Người chơi muốn trải nghiệm skin trước khi quyết định đầu tư hoặc chơi cùng bạn bè vào dịp cuối tuần.")
    add_bullet("Nhu cầu trải nghiệm bậc xếp hạng cao (High Elo Rank)", "Game thủ muốn thử sức ở các mức rank cao (Kim Cương, Cao Thủ, Thách Đấu, Radiant) để cọ xát kỹ năng hoặc kéo rank cùng bạn bè.")
    add_bullet("Hạn chế của mô hình giao dịch truyền thống", "Hiện nay, việc thuê tài khoản chủ yếu diễn ra thủ công trên mạng xã hội. Khách hàng phải chuyển tiền trước cho người cho thuê lạ mặt, đối mặt với các nguy cơ bị chặn liên lạc (lừa đảo), nhận mật khẩu sai, tài khoản bị khóa do dùng phần mềm gian lận trước đó, hoặc bị chủ acc đổi mật khẩu giữa chừng mà không được hoàn trả tiền. Mặt khác, người cho thuê cũng tốn thời gian ngồi trực tin nhắn để gửi thông tin và đối soát tiền thủ công.")

    add_h3("1.1.2. Phát biểu bài toán hệ thống GameRent")
    add_p("Bài toán đặt ra là cần xây dựng một **Hệ thống cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent)** nhằm tin học hóa và tự động hóa 100% quy trình thuê và quản lý tài khoản game. Hệ thống phải đảm bảo các tiêu chuẩn sau:")
    add_bullet("Tự động hóa hoàn toàn", "Người thuê nạp tiền qua cổng thanh toán QR code tự động, hệ thống tự đối soát số dư ví và hiển thị thông tin tài khoản đăng nhập tức thì chỉ sau 1 cú click chuột mà không cần sự can thiệp thủ công của con người.")
    add_bullet("Giám sát thời gian thực", "Mỗi đơn thuê có đồng hồ đếm ngược từng giây theo thời gian thực. Hệ thống hỗ trợ khách thuê chủ động gia hạn thêm giờ hoặc trả tài khoản sớm khi kết thúc nhu cầu.")
    add_bullet("Chính sách bảo hiểm minh bạch", "Cam kết bảo hiểm hoàn tiền 100% vào ví người dùng nếu phát hiện tài khoản sai mật khẩu, tài khoản bị cấm (ban) hoặc có người khác chơi đè trong thời gian thuê.")
    add_bullet("Hỗ trợ quản trị chuyên nghiệp", "Cung cấp bảng điều khiển Admin để theo dõi doanh thu, số đơn thuê, thêm mới tài khoản game (chuẩn theo mẫu tài liệu đề bài UC1_Add New Product), đổi trạng thái và xử lý khiếu nại bảo hiểm.")

    add_h3("1.1.3. Mục tiêu và phạm vi của đề tài")
    add_p("Đề tài được xây dựng nhằm đạt được 2 mục tiêu lớn:")
    add_bullet("Về mặt sản phẩm phần mềm", "Xây dựng hoàn thiện ứng dụng web Single Page Application (React 18 + Vite) với kiến trúc hiện đại, giao diện trực quan, sáng màu (Light Theme tông cam - trắng), phản hồi nhanh chóng và lưu trữ dữ liệu bền vững qua LocalStorage.")
    add_bullet("Về mặt học phần Kiểm thử phần mềm", "Áp dụng đầy đủ và bài bản các phương pháp, kỹ thuật kiểm thử phần mềm tiên tiến nhất theo chuẩn ISTQB. Gắn mã định danh data-testid trên toàn bộ các thành phần giao diện phục vụ kiểm thử tự động (Automation E2E). Thiết kế ma trận test case phủ kín từ cấp độ đơn vị (Unit Test), kiểm thử tích hợp (Integration Test) đến kiểm thử hệ thống (System Test).")

    add_h2("1.2. Đặc tả yêu cầu phần mềm")

    add_h3("1.2.1. Các luồng nghiệp vụ chính E2E của hệ thống")
    add_p("Hệ thống GameRent vận hành theo các luồng nghiệp vụ khép kín (End-to-End) giữa 2 tác tử chính: **Khách thuê (Renter)** và **Quản trị viên (Admin)**.")

    # Table of Use Cases summary
    uc_headers = ["Mã UC", "Tên Use Case", "Tác tử chính", "Mục đích nghiệp vụ", "Độ ưu tiên"]
    uc_rows = [
        ["UC01", "Add new game account", "Admin", "Thêm mới tài khoản game vào kho dữ liệu cho thuê", "Cao (High)"],
        ["UC02", "Rent game account", "Khách thuê", "Lựa chọn thời lượng (1-48h), trừ tiền ví và cấp thông tin acc", "Cao (High)"],
        ["UC03", "Extend rental duration", "Khách thuê", "Gia hạn thêm giờ chơi trực tiếp trên đơn thuê đang chạy", "Cao (High)"],
        ["UC04", "Deposit to wallet", "Khách thuê", "Nạp tiền vào ví điện tử mô phỏng qua VietQR tự động", "Cao (High)"],
        ["UC05", "Return rental early", "Khách thuê", "Trả acc sớm trước hạn để chuyển trạng thái đổi mật khẩu", "Trung bình"],
        ["UC06", "File dispute & refund", "Khách thuê / Admin", "Gửi khiếu nại báo lỗi sự cố và Admin xét duyệt hoàn tiền 100%", "Cao (High)"],
        ["UC07", "Register account", "Khách vãng lai", "Đăng ký tài khoản thành viên mới với họ tên, email, mật khẩu", "Cao (High)"],
        ["UC08", "Login to system", "Khách thuê / Admin", "Xác thực danh tính, phân quyền và kiểm tra khóa tài khoản", "Cao (High)"]
    ]
    add_table_custom(uc_headers, uc_rows, col_widths=[0.8, 1.8, 1.3, 2.7, 1.1])

    add_p("Chi tiết 5 luồng nghiệp vụ E2E cốt lõi:", bold=True, space_before=4)
    add_bullet("Luồng 1: Xác thực và Phân quyền (Auth & RBAC)", "Người dùng truy cập hệ thống -> Chọn Đăng ký (Validate họ tên >= 2 ký tự, email đúng cấu trúc, mật khẩu >= 6 ký tự) -> Tự động đăng nhập với số dư ví 0 VNĐ. Khi Đăng nhập: Hệ thống kiểm tra tài khoản có bị khóa không (isBlocked). Nếu người dùng là Admin thì cấp quyền truy cập Bảng quản trị Dashboard.")
    add_bullet("Luồng 2: Nạp tiền ví điện tử (Wallet Deposit)", "Khách thuê mở Modal Nạp tiền -> Chọn phương thức (VietQR / Thẻ cào) -> Chọn mệnh giá nhanh (50k, 100k, 200k, 500k) hoặc nhập số tiền (Ràng buộc biên: 10.000 VNĐ đến 5.000.000 VNĐ) -> Nhấn Xác nhận nạp -> Hệ thống cập nhật số dư ví tức thì và ghi nhận lịch sử biến động số dư với mã giao dịch TX-XXXXX.")
    add_bullet("Luồng 3: Tìm kiếm, Chọn lọc và Thuê tài khoản", "Khách xem danh mục tại Trang chủ -> Lọc theo Game (Valorant, LOL, CS2, LQMB, Genshin) -> Lọc theo khoảng giá giờ hoặc tìm kiếm skin -> Bấm xem Chi tiết tài khoản -> Bấm nút \"Thuê Ngay\" -> Hệ thống mở Modal xác nhận: Khách chọn thời lượng 1 đến 48 giờ -> Bảng quyết định kiểm tra: Nếu ví đủ tiền, trừ tiền ngay và chuyển trạng thái nick sang \"rented\"; Nếu ví thiếu tiền, hiển thị cảnh báo đỏ số tiền còn thiếu kèm nút \"Nạp Thêm Tiền\" trực tiếp.")
    add_bullet("Luồng 4: Theo dõi đơn thuê, Gia hạn và Trả sớm", "Sau khi thuê, đơn hàng chuyển sang \"Đơn Thuê Của Tôi\" -> Khách thấy hộp bí mật chứa Tài khoản / Mật khẩu với nút Sao chép 1-click -> Đồng hồ đếm ngược từng giây theo thời gian thực (chuyển sang viền đỏ nhấp nháy khi còn dưới 15 phút). Khách có thể bấm nút \"Gia Hạn\" (+1h, +2h, +4h) để cộng dồn giờ chơi, hoặc bấm \"Trả Acc Sớm\" để giải phóng acc chuyển sang trạng thái chờ đổi pass.")
    add_bullet("Luồng 5: Bảo hiểm sự cố và Quản trị kho acc của Admin", "Nếu khách gặp sự cố (sai pass, nick bị khóa ban, có người chơi đè), bấm nút \"Báo Sự Cố\" -> Chọn lý do và gửi khiếu nại -> Admin nhận thông báo trên Bảng quản trị -> Admin kiểm tra và bấm \"Phê Duyệt & Hoàn Tiền\" -> Hệ thống tự động hoàn tiền 100% vào ví khách thuê và đưa nick vào diện \"maintenance\" (Bảo trì).")

    add_h3("1.2.2. Đặc tả các màn hình chức năng chính")
    add_p("Hệ thống GameRent được thiết kế gồm 5 màn hình chính và 4 hộp thoại (Modal) tương tác cao:")

    add_p("1. Màn hình Trang Chủ & Khám Phá (HomePage)", bold=True)
    add_p("• Bố cục: Gồm thanh Banner giới thiệu, Thanh tìm kiếm từ khóa, Bộ lọc danh mục Game (Pill buttons), Bộ lọc khoảng giá thuê mỗi giờ (Dưới 10k, 10k-20k, 20k-30k, Trên 30k), Bộ sắp xếp (Mới nhất, Giá tăng dần, Giá giảm dần, Đánh giá cao nhất), và Lưới danh sách thẻ sản phẩm (Product Grid).")
    add_p("• Ràng buộc: Thẻ tài khoản đang ở trạng thái 'rented' sẽ bị làm mờ nút thuê và hiển thị nhãn \"Đang Được Thuê\"; tài khoản trạng thái 'maintenance' hiển thị nhãn \"Bảo Trì\".")

    add_p("2. Màn hình Chi Tiết Tài Khoản (AccountDetailPage)", bold=True)
    add_p("• Bố cục: Ảnh bìa skin sắc nét, Tiêu đề nick, Giá thuê/giờ nổi bật bằng màu cam, Bảng thông số kỹ thuật (Tựa game, Bậc Rank, Danh sách skin nổi bật, Tỷ lệ bảo hiểm 100%), Khối chính sách cam kết, Nút hành động \"Thuê Tài Khoản Ngay\".")

    add_p("3. Hộp thoại Xác Nhận Thuê Tài Khoản (RentConfirmModal)", bold=True)
    add_p("• Bố cục: Tóm tắt thông tin acc, Thanh trượt / Bộ chọn số giờ thuê (từ 1 đến 48 giờ), Bảng tính toán tổng chi phí (Giá thuê × Số giờ), Khối so sánh với số dư ví hiện tại.")
    add_p("• Ràng buộc nghiệp vụ: Nếu Số dư ví < Tổng chi phí, vô hiệu hóa nút \"Xác Nhận Thuê\", hiển thị thông báo thiếu tiền và nút dẫn nhanh sang nạp tiền.")

    add_p("4. Hộp thoại Nạp Tiền Ví Điện Tử (DepositModal)", bold=True)
    add_p("• Bố cục: Tab chọn phương thức (Chuyển khoản VietQR Auto / Thẻ cào điện thoại), Ô nhập số tiền nạp, Lưới 4 nút chọn nhanh số tiền (50.000đ, 100.000đ, 200.000đ, 500.000đ), Mã QR thanh toán động.")
    add_p("• Ràng buộc biên: Số tiền nạp phải là bội số của 1.000 VNĐ, tối thiểu 10.000 VNĐ và tối đa 5.000.000 VNĐ cho mỗi giao dịch.")

    add_p("5. Màn hình Quản Lý Đơn Thuê & Đồng Hồ Đếm Ngược (MyRentalsPage)", bold=True)
    add_p("• Bố cục: Tab phân loại đơn thuê (\"Đang Hoạt Động\" / \"Lịch Sử Đã Kết Thúc\"), Thẻ đơn thuê chi tiết gồm: Ảnh đại diện game, Tên acc, Thời gian bắt đầu - kết thúc, Đồng hồ đếm ngược từng giây (CountdownTimer), Hộp tài khoản/mật khẩu đăng nhập có nút ẩn/hiện và nút Copy, Cụm nút hành động: \"Gia Hạn Thêm Giờ\", \"Trả Acc Sớm\", \"Báo Sự Cố (Khiếu Nại)\".")

    add_p("6. Màn hình Quản Trị Viên (AdminDashboardPage)", bold=True)
    add_p("• Bố cục: 4 Thẻ KPI thống kê (Tổng doanh thu, Tổng số đơn thuê, Số acc đang cho thuê, Số khiếu nại chờ xử lý), Tab \"Quản Lý Kho Acc\" (Bảng danh sách, nút Đổi trạng thái Sẵn sàng / Bảo trì, nút Xóa acc), Nút \"Thêm Acc Mới\" mở Form thêm sản phẩm (chuẩn mẫu UC1_Add New Product), Tab \"Xử Lý Khiếu Nại\" (Xem lý do khiếu nại, Nút Duyệt hoàn tiền 100%, Nút Từ chối).")

    # Table of UI Fields Description
    add_p("Bảng mô tả chi tiết các trường dữ liệu trên các màn hình chức năng chính:", bold=True, space_before=4)
    fields_headers = ["Màn hình / Form", "Tên trường (Field)", "Kiểu dữ liệu", "Độ dài / Giới hạn", "Bắt buộc", "Quy tắc ràng buộc (Validation Rules)"]
    fields_rows = [
        ["Đăng ký (Register)", "Họ và tên (fullName)", "Chuỗi (Text)", "2 – 50 ký tự", "Có (Yes)", "Không được để trống; tối thiểu 2 ký tự; không chứa ký tự vô nghĩa"],
        ["Đăng ký (Register)", "Email (email)", "Chuỗi (Email)", "5 – 100 ký tự", "Có (Yes)", "Đúng định dạng regex email (chứa @ và .); không được trùng với tài khoản đã có"],
        ["Đăng ký (Register)", "Mật khẩu (password)", "Chuỗi (Password)", "6 – 32 ký tự", "Có (Yes)", "Độ dài tối thiểu 6 ký tự để đảm bảo an toàn"],
        ["Nạp tiền (Deposit)", "Số tiền nạp (amount)", "Số nguyên (Number)", "10.000 – 5.000.000 VNĐ", "Có (Yes)", "Phải là số dương; >= 10.000 VNĐ và <= 5.000.000 VNĐ; là bội số của 1.000đ"],
        ["Thuê acc (Rent)", "Thời gian thuê (hours)", "Số nguyên (Number)", "1 – 48 giờ", "Có (Yes)", "Thuê theo block giờ nguyên; tối thiểu 1 giờ, tối đa 48 giờ/lần thuê"],
        ["Gia hạn (Extend)", "Số giờ gia hạn (hours)", "Số nguyên (Number)", "1, 2 hoặc 4 giờ", "Có (Yes)", "Chọn từ các gói định sẵn; số dư ví phải đủ chi trả phí gia hạn"],
        ["Báo lỗi (Dispute)", "Lý do sự cố (reason)", "Danh sách (Select)", "Chọn 1 trong 4 lý do", "Có (Yes)", "Bắt buộc chọn: Sai mật khẩu, Tài khoản bị cấm, Người chơi đè, Sai mô tả skin"],
        ["Báo lỗi (Dispute)", "Mô tả chi tiết (desc)", "Chuỗi (Text)", "10 – 300 ký tự", "Có (Yes)", "Mô tả chi tiết lỗi gặp phải để Admin có cơ sở đối soát"],
        ["Thêm acc (Admin UC1)", "Mã sản phẩm (code)", "Chuỗi (Text)", "8 – 30 ký tự", "Có (Yes)", "Chỉ chứa chữ và số; không chứa khoảng trắng hay ký tự đặc biệt; duy nhất"],
        ["Thêm acc (Admin UC1)", "Tên tài khoản (title)", "Chuỗi (Text)", "10 – 50 ký tự", "Có (Yes)", "Tên mô tả ngắn gọn về bậc rank và skin chính của tài khoản"],
        ["Thêm acc (Admin UC1)", "Tựa game (gameId)", "Danh sách (Select)", "Chọn 1 game", "Có (Yes)", "Tựa game hợp lệ thuộc danh mục hệ sinh thái (Valorant, LOL, CS2, ...)"],
        ["Thêm acc (Admin UC1)", "Giá thuê/giờ (price)", "Số nguyên (Number)", "1.000 – 500.000 VNĐ", "Có (Yes)", "Phải lớn hơn 0; giá thuê thực tế tính theo từng giờ"],
        ["Thêm acc (Admin UC1)", "Tài khoản đăng nhập", "Chuỗi (Text)", "3 – 50 ký tự", "Có (Yes)", "Tên đăng nhập game thực tế bàn giao cho khách thuê"],
        ["Thêm acc (Admin UC1)", "Mật khẩu game (pass)", "Chuỗi (Text)", "4 – 50 ký tự", "Có (Yes)", "Mật khẩu game thực tế bàn giao cho khách thuê"]
    ]
    add_table_custom(fields_headers, fields_rows, col_widths=[1.2, 1.4, 1.1, 1.2, 0.7, 1.9])

    add_h3("1.2.3. Các Module chức năng chính của chương trình")
    add_p("Chương trình GameRent được phân rã thành 7 module phần mềm cốt lõi, hoạt động đồng bộ thông qua kiến trúc State Management (React AppContext) và Persistent Storage (HTML5 LocalStorage):")

    modules_data = [
        ("Module 1: Quản lý Xác thực và Phân quyền (Auth & RBAC Module)",
         "• Input: Thông tin đăng ký (Họ tên, email, mật khẩu); Thông tin đăng nhập (email, mật khẩu); Quyền truy cập hiện tại (role: 'renter' | 'admin').\n"
         "• Output: Đối tượng người dùng hợp lệ (currentUser), trạng thái đăng nhập (isAuthenticated: true/false), phân quyền giao diện (Admin có thêm tab Quản Trị).\n"
         "• Mô tả chức năng: Xử lý đăng ký tài khoản mới, kiểm tra trùng lặp email, kiểm tra điều kiện chặn tài khoản (isBlocked), lưu trữ phiên làm việc vào LocalStorage."),

        ("Module 2: Quản lý Kho Tài Khoản Game (Game Catalog Module)",
         "• Input: Bộ lọc từ khóa tìm kiếm (searchQuery), Bộ lọc tựa game (selectedGame), Khoảng giá thuê (priceRange), Thứ tự sắp xếp (sortBy).\n"
         "• Output: Danh sách mảng các đối tượng tài khoản (filteredAccounts) thỏa mãn điều kiện lọc để hiển thị lên lưới sản phẩm.\n"
         "• Mô tả chức năng: Lọc dữ liệu đa tiêu chí, tính toán số lượng kết quả, cập nhật trạng thái hiển thị của tài khoản khi có sự thay đổi từ 'available' sang 'rented' hoặc 'maintenance'."),

        ("Module 3: Ví Điện Tử và Quản Lý Giao Dịch (Wallet & Transaction Engine)",
         "• Input: Số tiền nạp (amount), Phương thức thanh toán (method: 'vietqr' | 'card'), Mã đơn thuê cần trừ tiền, Mã khiếu nại được hoàn tiền.\n"
         "• Output: Số dư ví mới của người dùng (user.balance), Bản ghi lịch sử giao dịch (transaction: {id, type, amount, description, timestamp}).\n"
         "• Mô tả chức năng: Quản lý tài chính ảo trong hệ thống. Đảm bảo tính nhất quán (Atomicity) khi cộng/trừ tiền ví, kiểm tra giới hạn nạp tiền (BVA: 10k - 5 triệu) và ngăn ngừa việc số dư bị âm."),

        ("Module 4: Đặt Thuê và Khởi Tạo Ca Chơi (Rental Order Engine)",
         "• Input: ID tài khoản cần thuê (accountId), Thời lượng thuê đã chọn (duration: 1-48h), ID người thuê (userId).\n"
         "• Output: Đơn thuê mới được tạo (#ORDER-XXX) với trạng thái 'active', tài khoản game chuyển trạng thái sang 'rented', số dư ví bị trừ tương ứng.\n"
         "• Mô tả chức năng: Thực thi bảng quyết định kiểm tra số dư ví. Nếu đủ tiền, tự động tạo ca thuê, lưu mốc thời gian bắt đầu (startTime) và kết thúc (endTime = startTime + duration * 3600000)."),

        ("Module 5: Giám Sát Thời Gian Thực và Gia Hạn (Realtime Timer & Extension)",
         "• Input: Mốc kết thúc (endTime) của đơn thuê, Thời gian hiện tại (Date.now()), Số giờ gia hạn thêm (extendHours: 1, 2, 4h).\n"
         "• Output: Số giờ/phút/giây còn lại hiển thị trên giao diện, cờ cảnh báo sắp hết giờ (isExpiringSoon: còn dưới 15 phút), mốc endTime mới sau khi gia hạn.\n"
         "• Mô tả chức năng: Sử dụng vòng lặp thời gian thực mỗi 1 giây (setInterval) để tính độ chênh lệch thời gian. Tự động chuyển đơn hàng sang trạng thái 'completed' khi hết giờ. Cho phép khách thuê gia hạn nối tiếp nếu đơn còn hạn hoặc cộng từ thời điểm hiện tại nếu đơn vừa quá hạn."),

        ("Module 6: Bảo Hiểm và Giải Quyết Khiếu Nại (Dispute & Insurance Module)",
         "• Input: Mã đơn thuê cần báo lỗi (rentalId), Lý do sự cố (reason), Mô tả lỗi; Quyết định xét duyệt của Admin (Phê duyệt hoặc Từ chối).\n"
         "• Output: Phiếu khiếu nại mới (DISP-XXXX), trạng thái đơn chuyển sang 'disputed'; Khi duyệt: Khách được cộng lại 100% tiền đơn vào ví, nick chuyển sang 'maintenance'.\n"
         "• Mô tả chức năng: Bảo vệ quyền lợi người tiêu dùng theo chính sách cam kết chất lượng. Khóa tài khoản lỗi để kỹ thuật viên kiểm tra, phòng ngừa phát sinh sự cố cho khách thuê kế tiếp."),

        ("Module 7: Quản Trị Viên và Báo Cáo Thống Kê (Admin Dashboard Module)",
         "• Input: Yêu cầu thêm acc mới (Dữ liệu form theo mẫu UC1), Yêu cầu chuyển đổi trạng thái nick (Sẵn sàng <-> Bảo trì), Yêu cầu xóa nick.\n"
         "• Output: Cập nhật cơ sở dữ liệu kho tài khoản, tính toán lại các chỉ số thống kê KPI (Tổng doanh thu, Tổng đơn hàng, Acc đang hoạt động).\n"
         "• Mô tả chức năng: Trung tâm điều phối hệ thống dành riêng cho vai trò Admin. Giám sát toàn bộ dòng tiền và hoạt động vận hành của sàn thuê.")
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
    add_p("Kiểm thử đơn vị (Unit Testing) tập trung vào việc kiểm tra tính đúng đắn của từng thành phần phần mềm nhỏ nhất có thể kiểm thử độc lập (hàm, phương thức, module xử lý logic nghiệp vụ). Trong dự án GameRent, các phương pháp và kỹ thuật thiết kế test case sau được áp dụng triệt để:")
    add_bullet("Phân tích giá trị biên (Boundary Value Analysis - BVA)", "Tập trung kiểm thử tại các điểm biên của miền giá trị đầu vào (biên dưới, ngay dưới biên, ngay trên biên, biên trên). Lỗi phần mềm thường có xu hướng xuất hiện nhiều nhất tại các điểm chuyển tiếp biên.")
    add_bullet("Phân vùng tương đương (Equivalence Partitioning - EP)", "Chia tập hợp dữ liệu đầu vào thành các phân vùng tương đương hợp lệ (Valid Partitions) và không hợp lệ (Invalid Partitions). Chỉ cần chọn một giá trị đại diện từ mỗi phân vùng để giảm thiểu số lượng test case mà vẫn đảm bảo độ bao phủ cao.")
    add_bullet("Bảng quyết định (Decision Table Testing)", "Sử dụng ma trận điều kiện và hành động để kiểm thử các logic nghiệp vụ phức tạp chứa nhiều điều kiện kết hợp (ví dụ: kết hợp giữa trạng thái đăng nhập, trạng thái tài khoản và số dư ví).")
    add_bullet("Tiêu chí kiểm thử hộp trắng (White-box Testing)", "Thiết kế các ca kiểm thử nhằm đạt độ bao phủ câu lệnh (Statement Coverage 100%) và bao phủ nhánh (Branch/Decision Coverage 100%) đối với các hàm xử lý tài chính và tính thời gian.")

    add_h3("2.1.2. Danh sách các Unit Test Case chi tiết")

    # Unit Test Table 1: Hàm Validate Đăng Ký
    add_p("Bảng 2.1: Danh sách Unit Test Case cho Hàm Kiểm Tra Đăng Ký (validateRegistration)", bold=True, space_before=4)
    add_p("• Chữ ký hàm: validateRegistration(fullName, email, password)", italic=True, font_size=11)
    ut1_headers = ["Test ID", "Kỹ thuật", "Mục tiêu kiểm thử", "Dữ liệu đầu vào (Input)", "Kết quả mong đợi (Expected Output)", "Mức ưu tiên"]
    ut1_rows = [
        ["UTC-REG-01", "BVA", "Biên dưới hợp lệ độ dài họ tên (2 ký tự)", "fullName: 'An', email: 'an@gmail.com', pass: '123456'", "Hợp lệ (True, không có lỗi)", "High"],
        ["UTC-REG-02", "BVA", "Dưới biên độ dài họ tên (1 ký tự)", "fullName: 'A', email: 'an@gmail.com', pass: '123456'", "Lỗi: 'Họ tên phải có ít nhất 2 ký tự'", "High"],
        ["UTC-REG-03", "EP", "Họ tên để trống", "fullName: '', email: 'an@gmail.com', pass: '123456'", "Lỗi: 'Vui lòng nhập họ và tên'", "High"],
        ["UTC-REG-04", "BVA", "Biên trên hợp lệ họ tên (50 ký tự)", "fullName: 'Chuỗi 50 ký tự...', email: 'test@gmail.com', pass: '123456'", "Hợp lệ (True)", "Medium"],
        ["UTC-REG-05", "BVA", "Vượt quá biên trên họ tên (51 ký tự)", "fullName: 'Chuỗi 51 ký tự...', email: 'test@gmail.com', pass: '123456'", "Lỗi: 'Họ tên không được vượt quá 50 ký tự'", "Medium"],
        ["UTC-REG-06", "EP", "Email đúng định dạng hợp lệ", "email: 'valid.user@eaut.edu.vn'", "Hợp lệ (True)", "High"],
        ["UTC-REG-07", "EP", "Email thiếu ký tự '@'", "email: 'invaliduser.gmail.com'", "Lỗi: 'Email không đúng định dạng'", "High"],
        ["UTC-REG-08", "EP", "Email thiếu tên miền (domain)", "email: 'invaliduser@'", "Lỗi: 'Email không đúng định dạng'", "High"],
        ["UTC-REG-09", "EP", "Email chứa khoảng trắng", "email: 'user name@gmail.com'", "Lỗi: 'Email không đúng định dạng'", "High"],
        ["UTC-REG-10", "BVA", "Biên dưới mật khẩu (6 ký tự)", "pass: '123456'", "Hợp lệ (True)", "High"],
        ["UTC-REG-11", "BVA", "Dưới biên mật khẩu (5 ký tự)", "pass: '12345'", "Lỗi: 'Mật khẩu phải có ít nhất 6 ký tự'", "High"],
        ["UTC-REG-12", "Decision", "Email đã tồn tại trong CSDL", "email: 'tester@gmail.com' (đã có sẵn)", "Lỗi: 'Email này đã được đăng ký tài khoản'", "High"]
    ]
    add_table_custom(ut1_headers, ut1_rows, col_widths=[1.1, 0.9, 1.8, 1.6, 1.7, 0.9])

    # Unit Test Table 2: Hàm Validate Hạn Mức Nạp Tiền
    add_p("Bảng 2.2: Danh sách Unit Test Case cho Hàm Hạn Mức Nạp Tiền (validateDepositAmount)", bold=True, space_before=6)
    add_p("• Chữ ký hàm: validateDepositAmount(amount) - Ràng buộc nghiệp vụ: 10.000 VNĐ <= amount <= 5.000.000 VNĐ", italic=True, font_size=11)
    ut2_headers = ["Test ID", "Kỹ thuật", "Mục tiêu kiểm thử", "Giá trị nạp (amount)", "Kết quả mong đợi (Expected Output)", "Đánh giá"]
    ut2_rows = [
        ["UTC-DEP-01", "BVA", "Ngay dưới biên tối thiểu (9.999 VNĐ)", "9.999", "Lỗi: 'Số tiền nạp tối thiểu là 10.000 đ'", "Pass"],
        ["UTC-DEP-02", "BVA", "Tại biên tối thiểu hợp lệ (10.000 VNĐ)", "10.000", "Hợp lệ (True, cho phép nạp)", "Pass"],
        ["UTC-DEP-03", "BVA", "Ngay trên biên tối thiểu (10.001 VNĐ)", "11.000", "Hợp lệ (True, cho phép nạp)", "Pass"],
        ["UTC-DEP-04", "EP", "Giá trị hợp lệ thông thường trong khoảng", "200.000", "Hợp lệ (True, cho phép nạp)", "Pass"],
        ["UTC-DEP-05", "BVA", "Ngay dưới biên tối đa (4.999.000 VNĐ)", "4.999.000", "Hợp lệ (True, cho phép nạp)", "Pass"],
        ["UTC-DEP-06", "BVA", "Tại biên tối đa hợp lệ (5.000.000 VNĐ)", "5.000.000", "Hợp lệ (True, cho phép nạp)", "Pass"],
        ["UTC-DEP-07", "BVA", "Vượt quá biên tối đa (5.001.000 VNĐ)", "5.001.000", "Lỗi: 'Số tiền nạp tối đa mỗi lần là 5.000.000 đ'", "Pass"],
        ["UTC-DEP-08", "EP", "Số tiền âm", "-50.000", "Lỗi: 'Số tiền nạp không hợp lệ'", "Pass"],
        ["UTC-DEP-09", "EP", "Số tiền bằng 0", "0", "Lỗi: 'Số tiền nạp tối thiểu là 10.000 đ'", "Pass"],
        ["UTC-DEP-10", "EP", "Nhập ký tự chữ / ký tự đặc biệt", "'abc'", "Lỗi: 'Vui lòng nhập số tiền hợp lệ'", "Pass"]
    ]
    add_table_custom(ut2_headers, ut2_rows, col_widths=[1.1, 0.9, 2.1, 1.2, 2.0, 0.7])

    # Unit Test Table 3: Hàm Tính Tiền Thuê & Bảng Quyết Định Số Dư Ví
    add_p("Bảng 2.3: Danh sách Unit Test Case Kiểm Tra Tính Chi Phí và Số Dư Ví (Decision Table)", bold=True, space_before=6)
    add_p("• Chữ ký hàm: calculateRentalCost(pricePerHour, hours) và checkBalance(walletBalance, totalCost)", italic=True, font_size=11)
    ut3_headers = ["Test ID", "Kỹ thuật", "Số dư ví (balance)", "Giá/h & Giờ", "Tổng chi phí", "Kết quả mong đợi", "Độ ưu tiên"]
    ut3_rows = [
        ["UTC-PAY-01", "BVA", "100.000 đ", "15.000 đ × 1h (Biên dưới giờ)", "15.000 đ", "Đủ tiền (Thiếu: 0 đ). Cho phép thuê.", "High"],
        ["UTC-PAY-02", "BVA", "1.000.000 đ", "20.000 đ × 48h (Biên trên giờ)", "960.000 đ", "Đủ tiền (Thiếu: 0 đ). Cho phép thuê.", "High"],
        ["UTC-PAY-03", "BVA", "100.000 đ", "15.000 đ × 0h (Dưới biên giờ)", "0 đ", "Lỗi: 'Thời gian thuê tối thiểu 1 giờ'", "High"],
        ["UTC-PAY-04", "BVA", "100.000 đ", "15.000 đ × 49h (Vượt biên giờ)", "735.000 đ", "Lỗi: 'Thời gian thuê tối đa 48 giờ'", "High"],
        ["UTC-PAY-05", "Decision", "50.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư > Chi phí: Đủ điều kiện thanh toán", "High"],
        ["UTC-PAY-06", "Decision", "30.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư = Chi phí: Đủ tiền, số dư sau thuê = 0đ", "High"],
        ["UTC-PAY-07", "Decision", "20.000 đ", "15.000 đ × 2h", "30.000 đ", "Số dư < Chi phí: Báo thiếu 10.000 đ, chặn thuê", "High"],
        ["UTC-PAY-08", "Decision", "0 đ", "15.000 đ × 2h", "30.000 đ", "Báo thiếu 30.000 đ, mở nút Nạp nhanh", "High"]
    ]
    add_table_custom(ut3_headers, ut3_rows, col_widths=[1.1, 0.9, 1.2, 1.6, 1.1, 1.5, 0.6])

    # Unit Test Table 4: Hàm Kiểm Tra Thêm Sản Phẩm Mới (Theo chuẩn đề bài UC1_Add New Product)
    add_p("Bảng 2.4: Danh sách Unit Test Case Kiểm Tra Form Thêm Tài Khoản Mới (Theo chuẩn UC1)", bold=True, space_before=6)
    add_p("• Ràng buộc theo tài liệu UC1: Mã sản phẩm (8-30 ký tự, không dấu, không cách), Tên sản phẩm (10-50 ký tự)", italic=True, font_size=11)
    ut4_headers = ["Test ID", "Trường test", "Kỹ thuật", "Giá trị kiểm thử", "Kết quả mong đợi", "Độ ưu tiên"]
    ut4_rows = [
        ["UTC-UC1-01", "Mã sản phẩm", "BVA", "Độ dài 7 ký tự ('SP00001')", "Hiển thị lỗi độ dài mã (<8 ký tự)", "High"],
        ["UTC-UC1-02", "Mã sản phẩm", "BVA", "Độ dài 8 ký tự ('SP000001')", "Hợp lệ", "High"],
        ["UTC-UC1-03", "Mã sản phẩm", "BVA", "Độ dài 30 ký tự", "Hợp lệ", "Medium"],
        ["UTC-UC1-04", "Mã sản phẩm", "BVA", "Độ dài 31 ký tự", "Hiển thị lỗi độ dài mã (>30 ký tự)", "Medium"],
        ["UTC-UC1-05", "Mã sản phẩm", "EP", "Chứa ký tự đặc biệt ('SP@00001')", "Hiển thị lỗi định dạng mã sản phẩm", "High"],
        ["UTC-UC1-06", "Mã sản phẩm", "EP", "Chứa khoảng trắng ('SP 00001')", "Hiển thị lỗi định dạng mã sản phẩm", "High"],
        ["UTC-UC1-07", "Mã sản phẩm", "Decision", "Mã đã tồn tại trong hệ thống", "Hiển thị lỗi: 'Mã sản phẩm đã tồn tại'", "High"],
        ["UTC-UC1-08", "Tên sản phẩm", "BVA", "Độ dài 9 ký tự ('Nick Vip 1')", "Hiển thị lỗi tên quá ngắn (<10 ký tự)", "High"],
        ["UTC-UC1-09", "Tên sản phẩm", "BVA", "Độ dài 10 ký tự ('Nick Vip 01')", "Hợp lệ", "High"],
        ["UTC-UC1-10", "Tên sản phẩm", "BVA", "Độ dài 50 ký tự", "Hợp lệ", "Medium"],
        ["UTC-UC1-11", "Tên sản phẩm", "BVA", "Độ dài 51 ký tự", "Hiển thị lỗi tên quá dài (>50 ký tự)", "Medium"]
    ]
    add_table_custom(ut4_headers, ut4_rows, col_widths=[1.1, 1.2, 0.8, 1.8, 2.3, 0.8])

    doc.add_page_break()

    # =========================================================
    # 2.2. THIẾT KẾ INTEGRATION TEST CASE
    # =========================================================
    add_h2("2.2. Thiết kế Integration Test Case")

    add_h3("2.2.1. Phương pháp và chiến lược kiểm thử tích hợp")
    add_p("Kiểm thử tích hợp (Integration Testing) nhằm mục đích phát hiện các khiếm khuyết trong sự tương tác, kết nối và trao đổi dữ liệu giữa các module hoặc giữa giao diện người dùng (UI Components) với lớp quản lý trạng thái dữ liệu (State Management) và bộ lưu trữ (LocalStorage).")
    add_p("Trong dự án GameRent, nhóm áp dụng **Chiến lược kiểm thử tích hợp Sandwich (kết hợp Top-down và Bottom-up)**:")
    add_bullet("Tích hợp Top-Down", "Kiểm tra từ các hành vi người dùng trên giao diện (ví dụ nhấn nút 'Xác Nhận Thuê' trên RentConfirmModal) truyền dữ liệu xuống Context và cập nhật giao diện của các component anh em (HomePage, Navbar, MyRentalsPage).")
    add_bullet("Tích hợp Bottom-Up", "Kiểm tra tính toàn vẹn của dữ liệu từ tầng lưu trữ nền tảng (LocalStorage) khi được load vào State Context và đồng bộ lên toàn bộ các trang chức năng.")
    add_bullet("Phạm vi các màn hình và điểm kết nối tích hợp chính", "Gồm có:")
    add_bullet("  1. Màn hình AuthModal <-> Navbar <-> LocalStorage", "Đăng nhập thành công -> State `currentUser` cập nhật -> Navbar hiển thị tên và số dư ví.")
    add_bullet("  2. Màn hình DepositModal <-> WalletPage <-> LocalStorage", "Nạp tiền thành công -> State `balance` tăng -> Giao dịch mới được tạo trong bảng Lịch sử.")
    add_bullet("  3. Màn hình RentConfirmModal <-> HomePage <-> MyRentalsPage", "Thuê tài khoản thành công -> Số dư ví bị trừ -> Acc trên HomePage chuyển trạng thái 'rented' -> Thẻ đơn mới xuất hiện trên MyRentalsPage.")
    add_bullet("  4. Màn hình MyRentalsPage <-> CountdownTimer <-> Modal Gia Hạn", "Gia hạn đơn thuê -> Mốc `endTime` cập nhật -> Đồng hồ đếm ngược tự động nhận thời gian mới.")
    add_bullet("  5. Màn hình DisputeModal <-> AdminDashboardPage <-> WalletPage", "Khách báo lỗi -> Đơn chuyển 'disputed' -> Admin duyệt -> Ví khách nhận lại 100% tiền hoàn -> Acc chuyển sang 'maintenance'.")

    add_h3("2.2.2. Danh sách các Integration Test Case chi tiết")
    add_p("Bảng 2.5: Danh sách các Integration Test Case kiểm tra tích hợp giữa các màn hình và module:", bold=True, space_before=4)

    it_headers = ["Test ID", "Các Module / Màn hình tích hợp", "Mục tiêu kiểm thử", "Trình tự các bước thực hiện (Steps)", "Kết quả mong đợi (Expected Outcome)", "Độ ưu tiên"]
    it_rows = [
        ["ITC-01", "AuthModal ↔ Navbar ↔ AppContext", "Tích hợp đăng nhập và cập nhật trạng thái Navbar",
         "1. Mở AuthModal.\n2. Nhập 'tester@gmail.com' / 'tester123'.\n3. Nhấn 'Đăng Nhập'.",
         "1. AuthModal tự đóng.\n2. Navbar lập tức hiển thị avatar, tên 'Nguyễn Văn Test' và số dư ví '100.000 đ'.\n3. LocalStorage lưu session thành công.", "High"],

        ["ITC-02", "DepositModal ↔ WalletPage ↔ LocalStorage", "Tích hợp nạp tiền ví và cập nhật số dư & lịch sử giao dịch",
         "1. Vào WalletPage (số dư 100.000 đ).\n2. Nhấn 'Nạp Tiền Vào Ví'.\n3. Chọn gói 200.000 đ, nhấn 'Xác Nhận Nạp'.",
         "1. Số dư ví trên WalletPage và Navbar nhảy lên '300.000 đ'.\n2. Thêm 1 dòng mới vào bảng lịch sử: 'TX-XXXXX | Nạp tiền ví | +200.000 đ | Thành công'.", "High"],

        ["ITC-03", "RentConfirmModal ↔ AccountDetailPage ↔ MyRentalsPage ↔ HomePage", "Tích hợp luồng thuê tài khoản, trừ ví, đổi trạng thái nick và tạo đơn hàng",
         "1. User có 300.000 đ ví.\n2. Chọn acc 'ACC-VAL-01' giá 15.000 đ/h.\n3. Chọn thuê 2 giờ (30.000 đ).\n4. Nhấn 'Xác Nhận Thuê'.",
         "1. Ví bị trừ 30.000 đ (còn 270.000 đ).\n2. Acc 'ACC-VAL-01' trên HomePage chuyển sang badge 'Đang Được Thuê'.\n3. MyRentalsPage sinh đơn thuê mới (#ORDER-XXX) trạng thái 'active' có CountdownTimer đếm ngược 01:59:59.", "High"],

        ["ITC-04", "MyRentalsPage ↔ RentConfirmModal (Gia hạn) ↔ CountdownTimer", "Tích hợp gia hạn đơn thuê và đồng bộ đồng hồ đếm ngược",
         "1. Tại đơn hàng đang còn 30 phút.\n2. Nhấn nút 'Gia Hạn'.\n3. Chọn thêm 1 giờ (15.000 đ).\n4. Nhấn xác nhận.",
         "1. Ví trừ tiếp 15.000 đ.\n2. Thời gian kết thúc đơn tăng thêm 3.600 giây.\n3. CountdownTimer cập nhật tức thì thành 01:29:59 mà không cần reload trang.", "High"],

        ["ITC-05", "MyRentalsPage ↔ ReturnEarlyModal ↔ HomePage", "Tích hợp trả acc sớm và thu hồi thông tin đăng nhập",
         "1. Khách đang chơi đơn hàng #ORDER-XXX.\n2. Bấm nút 'Trả Acc Sớm'.\n3. Bấm 'Xác Nhận Trả'.",
         "1. Trạng thái đơn chuyển sang 'completed'.\n2. Hộp thông tin bí mật ẩn pass và hiển thị nhãn 'Đã thu hồi'.\n3. Trạng thái acc chuyển sang 'need_change_pass'.", "Medium"],

        ["ITC-06", "DisputeModal ↔ AdminDashboardPage ↔ WalletPage", "Tích hợp gửi khiếu nại báo lỗi và Admin duyệt hoàn tiền 100%",
         "1. Khách bấm 'Báo Sự Cố' đơn 30.000 đ, chọn 'Sai mật khẩu', gửi khiếu nại.\n2. Đổi sang vai trò Admin.\n3. Vào Dashboard, xem khiếu nại, bấm 'Phê Duyệt & Hoàn Tiền'.",
         "1. Khiếu nại chuyển trạng thái 'resolved'.\n2. Tài khoản game tự động chuyển sang 'maintenance' (Bảo trì).\n3. Ví của khách thuê được cộng hoàn lại 30.000 đ kèm lịch sử 'Hoàn tiền bảo hiểm'.", "High"],

        ["ITC-07", "AdminDashboardPage (Form UC1) ↔ HomePage (Catalog)", "Tích hợp thêm acc mới từ Admin và hiển thị lên Client",
         "1. Admin mở Form 'Thêm Acc Mới'.\n2. Nhập mã 'ACC-CS2-99', Game: CS2, Giá: 25.000 đ, Rank: Global Elite.\n3. Nhấn 'Lưu Tài Khoản'.\n4. Chuyển sang Trang chủ Client.",
         "1. Thông báo Toast thêm thành công.\n2. Trang chủ Client bộ lọc CS2 xuất hiện ngay thẻ acc 'ACC-CS2-99' với đầy đủ ảnh bìa, giá thuê và nút 'Thuê Ngay'.", "High"],

        ["ITC-08", "FloatingTesterToolbar ↔ AppContext ↔ All Pages", "Tích hợp thanh công cụ Tester BTL chuyển đổi State thời gian thực",
         "1. Bấm nút 'Nạp Nhanh +200k'.\n2. Bấm nút 'Tua Nhanh -30 Phút'.\n3. Bấm 'Đổi Role sang Admin'.",
         "1. Số dư ví lập tức +200.000 đ trên toàn hệ thống.\n2. Các đơn đang thuê giảm ngay 30 phút trên CountdownTimer.\n3. Giao diện chuyển ngay sang quyền Admin mà không mất dữ liệu.", "Medium"]
    ]
    add_table_custom(it_headers, it_rows, col_widths=[0.8, 1.4, 1.4, 1.6, 2.3, 0.5])

    doc.add_page_break()

    # =========================================================
    # 2.3. THIẾT KẾ SYSTEM TEST CASE
    # =========================================================
    add_h2("2.3. Thiết kế System Test Case")

    add_h3("2.3.1. Phương pháp và kỹ thuật kiểm thử hệ thống E2E")
    add_p("Kiểm thử hệ thống (System Testing) là cấp độ kiểm thử toàn diện nhằm đánh giá sự tuân thủ của toàn bộ hệ thống tích hợp đối với các yêu cầu đặc tả nghiệp vụ ban đầu (End-to-End Black-box Testing).")
    add_p("Các kỹ thuật chính được sử dụng:")
    add_bullet("Kiểm thử dựa trên Use Case (Use Case Testing)", "Dựa trên 8 Use Case đặc tả trong tài liệu dự án để xây dựng các kịch bản chạy xuyên suốt từ bước khởi đầu (Trigger) cho đến khi đạt được trạng thái hoàn thành (Postconditions).")
    add_bullet("Kiểm thử luồng nghiệp vụ E2E (End-to-End Happy Path & Sad Path)", "Kiểm thử cả luồng người dùng thực hiện thuận lợi (nhập đúng dữ liệu, đủ tiền ví) và các luồng ngoại lệ, lỗi (nhập sai dữ liệu, thiếu tiền, sự cố sai pass).")
    add_bullet("Kiểm thử chuyển trạng thái (State Transition Testing)", "Kiểm thử vòng đời biến đổi trạng thái của thực thể Tài khoản game (`available` → `rented` → `need_change_pass` → `maintenance` → `available`) và thực thể Đơn thuê (`active` → `disputed` → `refunded` / `completed`).")
    add_bullet("Môi trường kiểm thử chuẩn hóa", "Trình duyệt Google Chrome / Microsoft Edge phiên bản mới nhất; Màn hình chuẩn Desktop Full HD (1920x1080) và Responsive Mobile (375x812); Dữ liệu khởi tạo từ `initialData.js` thông qua LocalStorage.")

    add_h3("2.3.2. Danh sách các System Test Case chi tiết")
    add_p("Bảng 2.6: Danh sách ma trận System Test Case E2E toàn diện của hệ thống GameRent:", bold=True, space_before=4)

    st_headers = ["Mã Kịch Bản", "Tên Kịch Bản E2E", "Tiền Điều Kiện (Preconditions)", "Các Bước Thực Hiện (Steps)", "Dữ Liệu Kiểm Thử (Test Data)", "Kết Quả Mong Đợi (Expected Results)", "Mức Ưu Tiên"]
    st_rows = [
        ["STC-E2E-01", "Đăng ký thành viên mới và tự động đăng nhập",
         "Người dùng chưa đăng nhập, đang ở trang chủ",
         "1. Nhấn nút 'Đăng Nhập / Đăng Ký'.\n2. Chọn tab 'Đăng Ký'.\n3. Nhập Họ tên, Email, Mật khẩu.\n4. Nhấn 'Tạo Tài Khoản'.",
         "Họ tên: 'Trần Văn Tester'\nEmail: 'tranvantest@gmail.com'\nMật khẩu: 'Matkhau@123'",
         "1. Thông báo đăng ký thành công.\n2. Tự động đăng nhập người dùng.\n3. Navbar hiển thị 'Trần Văn Tester' và số dư ví '0 đ'.", "High"],

        ["STC-E2E-02", "Đăng nhập thất bại do tài khoản bị khóa (Blocked)",
         "Tài khoản có cờ isBlocked: true trong hệ thống",
         "1. Mở Modal Đăng nhập.\n2. Nhập email của tài khoản bị khóa.\n3. Nhập mật khẩu đúng.\n4. Nhấn 'Đăng Nhập'.",
         "Email: 'blocked_user@gmail.com'\nMật khẩu: '123456'",
         "1. Hệ thống từ chối đăng nhập.\n2. Hiển thị thông báo lỗi màu đỏ: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế'.", "High"],

        ["STC-E2E-03", "Nạp tiền ví tự động qua VietQR và kiểm tra biến động",
         "User đã đăng nhập, số dư ví hiện tại là 0 đ",
         "1. Nhấn vào mục 'Ví Tiền' trên Navbar.\n2. Nhấn 'Nạp Tiền'.\n3. Chọn phương thức VietQR.\n4. Bấm chọn nhanh nút '200.000 đ'.\n5. Nhấn 'Xác Nhận Nạp Tiền'.",
         "Mệnh giá: 200.000 VNĐ\nPhương thức: VietQR",
         "1. Toast thông báo 'Nạp tiền thành công!'.\n2. Số dư ví nhảy từ 0 đ lên 200.000 đ.\n3. Xuất hiện dòng giao dịch mới mã TX-XXXXX, loại '+200.000 đ'.", "High"],

        ["STC-E2E-04", "Tìm kiếm, lọc danh mục game và xem thông số nick",
         "User ở trang chủ",
         "1. Nhập từ khóa 'Vandal' vào ô tìm kiếm.\n2. Chọn danh mục game 'Valorant'.\n3. Chọn khoảng giá '10k - 20k'.\n4. Bấm vào thẻ acc để xem chi tiết.",
         "Keyword: 'Vandal'\nGame: 'Valorant'\nPrice: 10.000 - 20.000 đ",
         "1. Danh sách sản phẩm lọc đúng các nick Valorant có skin Vandal trong tầm giá.\n2. Màn hình chi tiết hiển thị đầy đủ: Bậc rank, tên skin, cam kết bảo hiểm 100% và giá thuê/h.", "Medium"],

        ["STC-E2E-05", "Thuê tài khoản thành công khi ví đủ tiền (Happy Path)",
         "User đăng nhập, ví có 200.000 đ. Acc 'ACC-VAL-01' đang available, giá 15.000 đ/h",
         "1. Tại trang chi tiết acc, nhấn 'Thuê Tài Khoản Ngay'.\n2. Chọn thời lượng 3 giờ.\n3. Kiểm tra tổng tiền (45.000 đ).\n4. Nhấn 'Xác Nhận Thuê'.",
         "Thời lượng: 3 giờ\nTổng phí: 45.000 VNĐ",
         "1. Trừ ví 45.000 đ (còn 155.000 đ).\n2. Chuyển ngay đến MyRentalsPage.\n3. Thẻ đơn hiển thị Hộp bí mật: User 'val_vip_01', Mật khẩu 'pass123'.\n4. Nút 'Copy' hoạt động tốt, có Toast 'Đã sao chép!'.\n5. CountdownTimer đếm từ 02:59:59.", "High"],

        ["STC-E2E-06", "Thuê tài khoản thất bại khi ví thiếu tiền và nạp bù",
         "User đăng nhập, ví có 10.000 đ. Acc giá 20.000 đ/h, chọn thuê 2 giờ (40.000 đ)",
         "1. Nhấn 'Thuê Tài Khoản Ngay'.\n2. Chọn 2 giờ.\n3. Quan sát cảnh báo.\n4. Bấm nút 'Nạp Thêm 30.000 đ'.\n5. Hoàn tất nạp tiền và nhấn Thuê.",
         "Số dư: 10.000 đ\nCần thanh toán: 40.000 đ",
         "1. Hệ thống vô hiệu hóa nút 'Xác Nhận Thuê'.\n2. Hiển thị cảnh báo đỏ: 'Số dư ví không đủ (Thiếu 30.000 đ)'.\n3. Bấm nạp bù -> Ví thành 40.000 đ -> Mở khóa nút Thuê -> Thuê thành công.", "High"],

        ["STC-E2E-07", "Gia hạn thêm giờ chơi cho đơn thuê đang hoạt động",
         "Đơn thuê đang chạy, còn 25 phút. Ví có 100.000 đ",
         "1. Vào 'Đơn Thuê Của Tôi'.\n2. Trên thẻ đơn đang chạy, nhấn 'Gia Hạn'.\n3. Chọn gói '+2 Giờ'.\n4. Nhấn 'Xác Nhận Gia Hạn'.",
         "Gói gia hạn: 2 giờ\nPhí gia hạn: 30.000 VNĐ",
         "1. Ví bị trừ 30.000 đ.\n2. Mốc thời gian kết thúc được kéo dài thêm đúng 2 giờ.\n3. Đồng hồ đếm ngược lập tức cộng thêm 2 giờ (hiển thị 02:24:59).", "High"],

        ["STC-E2E-08", "Chủ động trả tài khoản sớm trước thời hạn",
         "Khách đang có đơn thuê đang hoạt động",
         "1. Nhấn nút 'Trả Acc Sớm' trên thẻ đơn.\n2. Modal xác nhận hiển thị cảnh báo thu hồi thông tin.\n3. Nhấn 'Xác Nhận Trả Sớm'.",
         "Đơn hàng đang 'active'",
         "1. Đơn chuyển ngay sang trạng thái 'completed'.\n2. Thông tin mật khẩu bị ẩn hoặc làm mờ.\n3. Tài khoản game chuyển trạng thái sang diện 'need_change_pass' để quản trị viên đổi mật khẩu.", "Medium"],

        ["STC-E2E-09", "Khiếu nại sự cố sai mật khẩu và Admin duyệt hoàn tiền 100%",
         "Khách thuê nhận acc nhưng đăng nhập game báo sai pass. Đơn trị giá 30.000 đ",
         "1. Khách nhấn 'Báo Sự Cố'.\n2. Chọn lý do 'Sai mật khẩu', nhập mô tả 'Không vào được game'.\n3. Nhấn 'Gửi Khiếu Nại'.\n4. Admin đăng nhập, vào Dashboard, kiểm tra và nhấn 'Phê Duyệt & Hoàn Tiền'.",
         "Lý do: 'Sai mật khẩu'\nSố tiền hoàn: 30.000 VNĐ",
         "1. Khách: Đơn chuyển sang 'disputed'. Sau khi Admin duyệt: Ví khách được hoàn đúng 30.000 đ (100% tiền đơn).\n2. Admin: Tài khoản game tự động chuyển sang trạng thái 'maintenance' (Bảo trì) để ngăn người khác thuê.", "High"],

        ["STC-E2E-10", "Admin thêm tài khoản mới chuẩn UC1 và Client thuê thành công",
         "Admin đã đăng nhập, vào Bảng quản trị",
         "1. Nhấn 'Thêm Acc Mới'.\n2. Nhập Mã sản phẩm, Game, Tên tiêu đề, Giá thuê, Rank, Skin, Acc/Pass.\n3. Nhấn 'Lưu Tài Khoản'.\n4. Mở tab Client người dùng, tìm acc vừa tạo và thực hiện thuê.",
         "Mã: 'ACC-VAL-88'\nGame: 'Valorant'\nTiêu đề: 'Radiant Skin Vandal Prime'\nGiá: 25.000 đ/h",
         "1. Form validate chính xác theo chuẩn UC1.\n2. Sản phẩm mới hiển thị ngay trên danh mục của khách thuê.\n3. Khách thuê có thể bấm thuê và nhận đúng tài khoản/mật khẩu vừa được Admin tạo.", "High"]
    ]
    add_table_custom(st_headers, st_rows, col_widths=[0.9, 1.2, 1.1, 1.3, 1.1, 1.9, 0.5])

    doc.add_page_break()

    # =========================================================
    # TỔNG KẾT
    # =========================================================
    add_h1("TỔNG KẾT VÀ ĐÁNH GIÁ KẾT QUẢ CHƯƠNG 1 VÀ CHƯƠNG 2")
    add_p("Thông qua việc hoàn thành nghiên cứu và biên soạn chi tiết Chương 1 và Chương 2 của Báo cáo bài tập lớn môn Kiểm thử phần mềm, nhóm đã đạt được các kết quả cụ thể như sau:")
    add_bullet("Hoàn thiện tổng quan bài toán và đặc tả yêu cầu (Chương 1)", "Đã phân tích sắc bén bối cảnh thực tế của thị trường cho thuê tài khoản game, phát biểu bài toán tự động hóa hệ thống GameRent; mô tả chi tiết 5 luồng nghiệp vụ E2E, bảng đặc tả trường dữ liệu của 7 màn hình/modal chức năng và phân rã 7 module xử lý nghiệp vụ cốt lõi.")
    add_bullet("Thiết kế bài bản bộ Test Case đa cấp độ (Chương 2)", "Đã vận dụng thành thạo và đầy đủ các kỹ thuật kiểm thử theo chuẩn ISTQB:")
    add_bullet("  • Cấp độ Unit Test", "Xây dựng 4 bảng test case với hơn 35 test case chi tiết áp dụng Phân tích giá trị biên (BVA), Phân vùng tương đương (EP), Bảng quyết định (Decision Table) và tuân thủ chuẩn đề bài UC1_Add New Product.")
    add_bullet("  • Cấp độ Integration Test", "Xây dựng 8 kịch bản kiểm thử tích hợp (ITC-01 đến ITC-08) theo chiến lược Sandwich, kiểm soát sự đồng bộ giữa giao diện React Component, bộ quản lý trạng thái AppContext và kho lưu trữ LocalStorage.")
    add_bullet("  • Cấp độ System Test", "Xây dựng 10 kịch bản kiểm thử hệ thống E2E hoàn chỉnh (STC-E2E-01 đến STC-E2E-10) bao quát trọn vẹn cả luồng nghiệp vụ thuận lợi (Happy Path) và luồng xử lý ngoại lệ (Sad Path), bảo hiểm bồi hoàn và quản trị hệ thống.")
    add_bullet("Mức độ sẵn sàng cho các chương tiếp theo", "Bộ tài liệu đặc tả và thiết kế test case này là cơ sở vững chắc, trực tiếp phục vụ cho việc thực thi test, ghi nhận lỗi (Log Bug) tại Chương 3 và cài đặt kịch bản kiểm thử tự động (Automation Test với Playwright / Selenium) tại Chương 4.")

    # Save document
    docx_path = "e:\\BTL_KTPM\\BTL_KTPM_Chuong_1_va_Chuong_2.docx"
    pdf_path = "e:\\BTL_KTPM\\BTL_KTPM_Chuong_1_va_Chuong_2.pdf"
    backup_pdf_path = "e:\\BTL_KTPM\\Tài_Liệu\\BTL_KTPM_Chuong_1_va_Chuong_2.pdf"

    doc.save(docx_path)
    print(f"[OK] Đã lưu file Word thành công: {docx_path}")

    # Convert to PDF
    print("[...] Đang chuyển đổi sang file PDF bằng docx2pdf...")
    try:
        convert(docx_path, pdf_path)
        print(f"[OK] Đã xuất file PDF thành công: {pdf_path}")
        
        # Copy to Tài_Liệu folder
        import shutil
        shutil.copyfile(pdf_path, backup_pdf_path)
        print(f"[OK] Đã sao chép thêm 1 bản PDF vào thư mục: {backup_pdf_path}")
    except Exception as e:
        print(f"[ERROR] Chuyển đổi PDF thất bại: {e}")

if __name__ == "__main__":
    create_report()
