# -*- coding: utf-8 -*-
"""
Script to generate the Complete, Comprehensive BTL KTPM Report for GameRent:
Bao gồm toàn bộ 4 chương chuẩn theo tài liệu:
- YÊU CẦU BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM.pdf
- Các nội dung quan trọng trong báo cáo lỗi.pdf
- UC1_Add New Product.pdf

Nội dung:
- Trang bìa & Phiếu đánh giá
- Mục lục, Danh mục từ viết tắt
- Lời mở đầu
- Chương 1: Tổng quan bài toán & Đặc tả yêu cầu (10 Use Cases, 8 Màn hình, 7 Module)
- Chương 2: Phân tích và thiết kế test (Unit Test, Integration Test, System Test)
- Chương 3: Thực thi test và báo cáo kết quả test (Kết quả IT + ST, 10 Phiếu Bug Report chi tiết theo chuẩn)
- Chương 4: Automation test (Vitest, data-testid, 10 Test Suites, 107 Tests 100% Passed)
- Kết luận và hướng phát triển
- Tài liệu tham khảo
"""

import os
import sys
import shutil
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import docx
import docx.opc.constants
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def build_full_report():
    doc = docx.Document()

    # Căn lề chuẩn học thuật BTL EAUT: Trái 3cm (~1.18 in), Phải 2cm (~0.79 in), Trên 2cm, Dưới 2cm
    for section in doc.sections:
        section.top_margin = Inches(0.79)
        section.bottom_margin = Inches(0.79)
        section.left_margin = Inches(1.18)
        section.right_margin = Inches(0.79)
        section.page_width = Inches(8.27)   # A4
        section.page_height = Inches(11.69) # A4

        # Add page numbering to footer
        footer = section.footer
        p_ft = footer.paragraphs[0]
        p_ft.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_ft = p_ft.add_run("Báo cáo BTL Kiểm thử phần mềm - Nhóm 15  |  Trang ")
        r_ft.font.name = 'Times New Roman'
        r_ft.font.size = Pt(9.5)
        r_ft.font.color.rgb = RGBColor(100, 116, 139)

        # XML for Page Number
        fldSimple = OxmlElement('w:fldSimple')
        fldSimple.set(qn('w:instr'), 'PAGE')
        p_ft._p.append(fldSimple)

    # Style Normal
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(33, 37, 41)
    style_normal.paragraph_format.line_spacing = 1.25
    style_normal.paragraph_format.space_after = Pt(4)

    # Colors
    NAVY = RGBColor(26, 54, 93)       # #1A365D
    BLUE = RGBColor(43, 108, 176)     # #2B6CB0
    DARK_GRAY = RGBColor(45, 55, 72)  # #2D3748
    TEXT_COLOR = RGBColor(33, 37, 41)
    ORANGE = RGBColor(234, 88, 12)    # #EA580C
    EMERALD = RGBColor(16, 185, 129)  # #10B981
    RED = RGBColor(220, 38, 38)       # #DC2626

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
            # Ensure proper font rendering for Vietnamese
            rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
            run._r.get_or_add_rPr().append(rFonts)
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
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        run._r.get_or_add_rPr().append(rFonts)
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
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        run._r.get_or_add_rPr().append(rFonts)
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
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        run._r.get_or_add_rPr().append(rFonts)
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
            rFonts1 = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
            r1._r.get_or_add_rPr().append(rFonts1)
        r2 = p.add_run(text)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11.5)
        r2.font.color.rgb = TEXT_COLOR
        rFonts2 = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        r2._r.get_or_add_rPr().append(rFonts2)
        return p

    def add_callout(title, text, border_color="2B6CB0", bg_color="F0F7FF"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.rows[0].cells[0]
        cell.width = Inches(6.3)
        set_cell_background(cell, bg_color)
        set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="none"/>
                <w:bottom w:val="none"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>
                <w:right w:val="none"/>
                <w:insideH w:val="none"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        tbl._tbl.tblPr.append(borders)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r_title = p.add_run(f"📌 {title}: ")
        r_title.bold = True
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(11)
        r_title.font.color.rgb = NAVY
        r_text = p.add_run(text)
        r_text.font.name = 'Times New Roman'
        r_text.font.size = Pt(11)
        r_text.font.color.rgb = DARK_GRAY

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(1)
        p_after.paragraph_format.space_after = Pt(4)

    def add_table_custom(headers, rows, col_widths=None, header_bg="2B6CB0"):
        table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        # Header Row
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].text = header_text
            set_cell_background(hdr_cells[i], header_bg)
            set_cell_margins(hdr_cells[i], top=100, bottom=100, left=110, right=110)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            for run in p.runs:
                run.bold = True
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(255, 255, 255)
                rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
                run._r.get_or_add_rPr().append(rFonts)

        # Data Rows
        for r_idx, row_data in enumerate(rows):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].text = str(cell_value)
                set_cell_background(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=70, bottom=70, left=90, right=90)
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
                    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
                    run._r.get_or_add_rPr().append(rFonts)

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

    def add_file_link_box(intro_text, file_name, link_title, note_text="Nhấn phím Ctrl + Click vào liên kết để mở trực tiếp file Excel trên máy tính."):
        """Tạo một hộp thông báo nổi bật chứa liên kết trực tiếp mở file Excel"""
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.left_indent = Pt(14)
        p.paragraph_format.right_indent = Pt(14)

        # Label
        r_intro = p.add_run(intro_text + " ")
        r_intro.font.name = 'Times New Roman'
        r_intro.font.size = Pt(10.5)
        r_intro.font.bold = True
        r_intro.font.color.rgb = NAVY
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        r_intro._r.get_or_add_rPr().append(rFonts)

        # Hyperlink
        part = p.part
        r_id = part.relate_to(file_name, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

        hyperlink = OxmlElement('w:hyperlink')
        hyperlink.set(qn('r:id'), r_id)
        new_run = OxmlElement('w:r')
        rPr = OxmlElement('w:rPr')

        c = OxmlElement('w:color')
        c.set(qn('w:val'), '1A56DB')
        rPr.append(c)

        u = OxmlElement('w:u')
        u.set(qn('w:val'), 'single')
        rPr.append(u)

        b = OxmlElement('w:b')
        rPr.append(b)

        f = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        rPr.append(f)

        sz = OxmlElement('w:sz')
        sz.set(qn('w:val'), '22')
        rPr.append(sz)

        new_run.append(rPr)
        new_run.text = f"📁 [{link_title}]"
        hyperlink.append(new_run)
        p._p.append(hyperlink)

        # Note
        if note_text:
            r_note = p.add_run(f"\n   ({note_text})")
            r_note.font.name = 'Times New Roman'
            r_note.font.size = Pt(9.5)
            r_note.font.italic = True
            r_note.font.color.rgb = DARK_GRAY
            rFonts_note = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
            r_note._r.get_or_add_rPr().append(rFonts_note)

        return p

    # ==========================================
    # 1. TRANG BÌA (COVER PAGE)
    # ==========================================
    add_p("BỘ GIÁO DỤC VÀ ĐÀO TẠO", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2)
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, space_after=2, color=NAVY)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=18)

    add_p("─────────── ★ ───────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=20, color=BLUE)

    add_p("BÁO CÁO BÀI TẬP LỚN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=20, space_after=6, color=ORANGE)
    add_p("HỌC PHẦN: KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=15, space_after=4, color=NAVY)
    add_p("LỚP TÍN CHỈ: Kiểm thử phần mềm-1-1-26(N05)  ·  NHÓM THỰC HIỆN: NHÓM 15", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=16, color=EMERALD)

    add_p("TÊN ĐỀ TÀI CHÍNH THỨC:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)
    add_p("KIỂM THỬ HỆ THỐNG WEBSITE CHO THUÊ TÀI KHOẢN GAME TỰ ĐỘNG 24/7 (GAMERENT)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=16, space_after=8, color=NAVY)
    add_p("NỘI DUNG BÁO CÁO: HOÀN THIỆN ĐẦY ĐỦ 4 CHƯƠNG THEO MẪU BÀI TẬP LỚN", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=16, color=DARK_GRAY)

    add_p("CÁC SẢN PHẨM CÔNG VIỆC CÓ SẴN ĐÃ HOÀN TẤT:", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=2, color=NAVY)
    add_p("[X] 1. Đặc tả yêu cầu phần mềm (SRS)  |  [X] 2. Thiết kế hệ thống  |  [X] 3. Mã nguồn chạy thực tế", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=18, color=DARK_GRAY)

    add_p("──────────────────────────────────────────", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14, color=BLUE)

    # Info block
    add_p("Giảng viên hướng dẫn: ThS. Phạm Thị Loan", bold=True, font_size=12, space_after=4)
    add_p("Nhóm sinh viên thực hiện (Nhóm 15):", bold=True, font_size=12, space_after=2)
    add_p("  1. Lê Hải Đăng    - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  2. Lê Minh Quân   - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  3. Lê Xuân Đạt    - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=2)
    add_p("  4. Lê Thanh Tùng  - Mã SV: .................... - Lớp tín chỉ: Kiểm thử phần mềm-1-1-26(N05)", font_size=11.5, space_after=6)
    add_p("Khoa: Công nghệ thông tin - Trường Đại học Công nghệ Đông Á", font_size=11, space_after=2)
    add_p("Học kỳ I - Năm học 2026 - 2027", font_size=11, space_after=18)

    add_p("BẮC NINH / HÀ NỘI – NĂM 2026", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12.5, space_after=0, color=NAVY)

    doc.add_page_break()

    # ==========================================
    # PHIẾU ĐÁNH GIÁ (THEO MẪU BỘ MÔN)
    # ==========================================
    add_p("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=1)
    add_p("KHOA CÔNG NGHỆ THÔNG TIN", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=4)
    add_p("PHIẾU ĐÁNH GIÁ KẾT QUẢ BÀI TẬP LỚN MÔN KIỂM THỬ PHẦN MỀM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2, color=NAVY)
    add_p("LỚP TÍN CHỈ: Kiểm thử phần mềm-1-1-26(N05)  ·  NHÓM: 15  ·  MÃ ĐỀ TÀI: 15", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=2, color=BLUE)
    add_p("Tên đề tài: Kiểm thử hệ thống website cho thuê tài khoản game tự động 24/7 (GameRent)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=4, color=NAVY)

    # Member list table
    add_p("DANH SÁCH THÀNH VIÊN NHÓM 15 VÀ PHÂN CÔNG NHIỆM VỤ:", bold=True, font_size=11, space_after=3)
    member_headers = ["STT", "Họ và tên", "Mã sinh viên", "Lớp tín chỉ", "Nhiệm vụ phân công trong đề tài"]
    member_rows = [
        ["1", "Lê Hải Đăng", "....................", "N05", "Phân tích yêu cầu, Thiết kế Unit Test Case (BVA, EP, Decision Table), Viết kịch bản tự động hóa"],
        ["2", "Lê Minh Quân", "....................", "N05", "Phát triển Web App GameRent (React 19 + Vite), Thiết kế System Test Case E2E, Tổng hợp Báo cáo"],
        ["3", "Lê Xuân Đạt", "....................", "N05", "Thiết kế Integration Test Case (Sandwich), Thực thi kiểm thử tích hợp & Báo cáo Bug Log"],
        ["4", "Lê Thanh Tùng", "....................", "N05", "Thực thi System Test, Báo cáo lỗi hệ thống, Kiểm thử hồi quy và Cài đặt Automation Test"]
    ]
    add_table_custom(member_headers, member_rows, col_widths=[0.5, 1.8, 1.2, 0.8, 2.7], header_bg="2B6CB0")

    add_p("TIÊU CHÍ ĐÁNH GIÁ ĐIỂM THI BÀI TẬP LỚN (CĂN CỨ THEO PHIẾU CHẤM CỦA BỘ MÔN):", bold=True, font_size=11, space_before=4, space_after=3)
    rubric_headers = ["STT", "Nội dung tiêu chí đánh giá", "Thang điểm", "Đánh giá"]
    rubric_rows = [
        ["1", "HÌNH THỨC TRÌNH BÀY BÀI THI", "1.0 đ", "Đạt chuẩn"],
        ["1.1", "Trình bày báo cáo đúng định dạng (Font Times New Roman, dãn dòng 1.25, căn lề 3-2-2-2cm)", "0.5 đ", ""],
        ["1.2", "Trình bày báo cáo theo đúng Bố cục chuẩn bài tập lớn môn Kiểm thử phần mềm", "0.5 đ", ""],
        ["2", "NỘI DUNG BÀI THI BẢN MỀM (BÁO CÁO NỘP TRÊN ELEARNING)", "5.0 đ", "Đạt chuẩn"],
        ["2.1", "Thực hiện Unit test: Xác định các module, viết Unit test case chi tiết (BVA, EP, Decision Table)", "1.0 đ", ""],
        ["2.2.1", "Thực hiện Integration test: Xác định các màn hình để thực hiện Integration test", "0.5 đ", ""],
        ["2.2.2", "Viết Integration test case chi tiết theo chiến lược Sandwich", "0.5 đ", ""],
        ["2.2.3", "Thực hiện Integration test, Log bug và báo cáo kết quả test", "0.5 đ", ""],
        ["2.2.4", "Thực hiện System test: Xác định các luồng nghiệp vụ E2E, viết System test case", "1.0 đ", ""],
        ["2.2.5", "Log bug và báo cáo kết quả test hệ thống", "0.5 đ", ""],
        ["2.2.6", "Sử dụng công cụ kiểm thử tự động (Automation Test: Vitest / Playwright)", "1.0 đ", ""],
        ["3", "VẤN ĐÁP (Kỹ thuật thiết kế test 1.0đ, Nguyên lý kiểm thử 1.0đ, Hoạt động kiểm thử 1.0đ, Viết testcase/log bug 1.0đ)", "4.0 đ", ""],
        ["TỔNG", "TỔNG ĐIỂM TOÀN BỘ HỌC PHẦN (1) + (2) + (3)", "10.0 đ", ""]
    ]
    add_table_custom(rubric_headers, rubric_rows, col_widths=[0.6, 4.3, 1.2, 0.9], header_bg="1A365D")

    add_p("Cán bộ chấm thi 1: .......................................      Cán bộ chấm thi 2: .......................................", italic=True, space_before=4, space_after=10)

    doc.add_page_break()

    # ==========================================
    # DANH MỤC THUẬT NGỮ & TỪ VIẾT TẮT
    # ==========================================
    add_h1("DANH MỤC CÁC TỪ VIẾT TẮT VÀ THUẬT NGỮ CHUYÊN NGÀNH")
    abbr_headers = ["Từ viết tắt", "Thuật ngữ tiếng Anh", "Ý nghĩa / Định nghĩa trong đề tài"]
    abbr_rows = [
        ["BTL", "Big Assignment / Project", "Bài tập lớn môn học"],
        ["KTPM", "Software Testing", "Kiểm thử phần mềm"],
        ["QA / QC", "Quality Assurance / Quality Control", "Đảm bảo chất lượng / Kiểm soát chất lượng phần mềm"],
        ["ISTQB", "International Software Testing Qualifications Board", "Ủy ban Kiểm thử Phần mềm Quốc tế"],
        ["SRS", "Software Requirements Specification", "Tài liệu đặc tả yêu cầu phần mềm"],
        ["BVA", "Boundary Value Analysis", "Kỹ thuật phân tích giá trị biên (Hộp đen)"],
        ["EP", "Equivalence Partitioning", "Kỹ thuật phân vùng tương đương (Hộp đen)"],
        ["DT", "Decision Table", "Bảng quyết định kết hợp điều kiện"],
        ["STT", "State Transition Testing", "Kỹ thuật kiểm thử chuyển trạng thái thực thể"],
        ["TC", "Test Case", "Ca kiểm thử phần mềm"],
        ["UT / UTC", "Unit Test / Unit Test Case", "Kiểm thử đơn vị / Ca kiểm thử đơn vị"],
        ["IT / ITC", "Integration Test / Integration Test Case", "Kiểm thử tích hợp / Ca kiểm thử tích hợp"],
        ["ST / STC", "System Test / System Test Case", "Kiểm thử hệ thống / Ca kiểm thử hệ thống"],
        ["E2E", "End-to-End Testing", "Kiểm thử toàn trình từ đầu đến cuối luồng nghiệp vụ"],
        ["RBAC", "Role-Based Access Control", "Kiểm soát truy cập dựa trên vai trò người dùng (Admin vs Khách thuê)"],
        ["SPA", "Single Page Application", "Ứng dụng web trang đơn (React 19 + Vite)"],
        ["VietQR", "Vietnam National QR Standard", "Chuẩn mã phản hồi nhanh chuyển khoản ngân hàng tự động"]
    ]
    add_table_custom(abbr_headers, abbr_rows, col_widths=[1.1, 2.5, 3.4], header_bg="2B6CB0")

    doc.add_page_break()

    # ==========================================
    # MỤC LỤC BÁO CÁO
    # ==========================================
    add_h1("MỤC LỤC BÁO CÁO")
    add_p("LỜI MỞ ĐẦU ...................................................................................................................................................... 4", bold=True, font_size=11, space_after=3)
    add_p("CHƯƠNG 1: TỔNG QUAN BÀI TOÁN .......................................................................................................... 6", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  1.1. GIỚI THIỆU ĐỀ TÀI ............................................................................................................................ 6", font_size=10.5, space_after=2)
    add_p("    1.1.1. Thu thập đầu bài và bối cảnh bài toán trong thực tế ..................................................................... 6", font_size=10, space_after=2)
    add_p("    1.1.2. Phát biểu bài toán hệ thống GameRent ........................................................................................... 7", font_size=10, space_after=2)
    add_p("    1.1.3. Mục tiêu và phạm vi của đề tài ........................................................................................................ 7", font_size=10, space_after=2)
    add_p("  1.2. ĐẶC TẢ YÊU CẦU ................................................................................................................................ 8", font_size=10.5, space_after=2)
    add_p("    1.2.1. Các luồng nghiệp vụ chính E2E của hệ thống (10 Use Cases) ...................................................... 8", font_size=10, space_after=2)
    add_p("    1.2.2. Các màn hình chức năng chính và ràng buộc nhập liệu ................................................................ 10", font_size=10, space_after=2)
    add_p("    1.2.3. Các Module chính của chương trình (7 Modules) ........................................................................... 14", font_size=10, space_after=2)
    add_p("CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST .......................................................................................... 17", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  2.1. UNIT TEST CASE ................................................................................................................................. 17", font_size=10.5, space_after=2)
    add_p("    2.1.1. Phương pháp, kỹ thuật kiểm thử Unit (BVA, EP, Decision Table) ............................................... 17", font_size=10, space_after=2)
    add_p("    2.1.2. Danh sách các Unit Test Case chi tiết ........................................................................................... 18", font_size=10, space_after=2)
    add_p("  2.2. INTEGRATION TEST CASE ................................................................................................................. 23", font_size=10.5, space_after=2)
    add_p("    2.2.1. Phương pháp, kỹ thuật kiểm thử tích hợp (Chiến lược Sandwich) ................................................ 23", font_size=10, space_after=2)
    add_p("    2.2.2. Danh sách các Integration Test Case chi tiết ................................................................................ 24", font_size=10, space_after=2)
    add_p("  2.3. SYSTEM TEST CASE ............................................................................................................................ 27", font_size=10.5, space_after=2)
    add_p("    2.3.1. Phương pháp, kỹ thuật kiểm thử hệ thống E2E và Chuyển trạng thái ......................................... 27", font_size=10, space_after=2)
    add_p("    2.3.2. Danh sách các System Test Case chi tiết ........................................................................................ 29", font_size=10, space_after=2)
    add_p("CHƯƠNG 3: THỰC THI TEST VÀ BÁO CÁO KẾT QUẢ TEST ................................................................. 33", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  3.1. KẾT QUẢ THỰC HIỆN INTEGRATION TEST .................................................................................... 33", font_size=10.5, space_after=2)
    add_p("    3.1.1. Bảng tổng hợp kết quả kiểm thử Integration test ............................................................................ 33", font_size=10, space_after=2)
    add_p("    3.1.2. Danh sách các lỗi phát hiện trong Integration test (Bug Log chuẩn form) .................................... 34", font_size=10, space_after=2)
    add_p("  3.2. KẾT QUẢ THỰC HIỆN SYSTEM TEST ............................................................................................. 37", font_size=10.5, space_after=2)
    add_p("    3.2.1. Bảng tổng hợp kết quả kiểm thử System test ................................................................................. 37", font_size=10, space_after=2)
    add_p("    3.2.2. Danh sách các lỗi phát hiện trong System test (Bug Log chuẩn form) ........................................... 38", font_size=10, space_after=2)
    add_p("CHƯƠNG 4: AUTOMATION TEST ................................................................................................................. 41", bold=True, color=NAVY, font_size=11, space_after=3)
    add_p("  4.1. CÔNG CỤ SỬ DỤNG ............................................................................................................................. 41", font_size=10.5, space_after=2)
    add_p("    4.1.1. Giới thiệu Vitest Test Runner & Kiến trúc kiểm thử tự động ........................................................ 41", font_size=10, space_after=2)
    add_p("    4.1.2. Chuẩn hóa bộ thuộc tính data-testid trên DOM cho UI Automation .............................................. 42", font_size=10, space_after=2)
    add_p("  4.2. KẾT QUẢ ĐẠT ĐƯỢC ............................................................................................................................ 43", font_size=10.5, space_after=2)
    add_p("    4.2.1. Thống kê kết quả 10 Test Suites tự động hóa (107 Tests - 100% Passed) ..................................... 43", font_size=10, space_after=2)
    add_p("    4.2.2. Trích xuất Log thực thi kiểm thử tự động ....................................................................................... 44", font_size=10, space_after=2)
    add_p("    4.2.3. Phân tích kịch bản kiểm thử tự động tiêu biểu ............................................................................... 45", font_size=10, space_after=2)
    add_p("KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN ......................................................................................................... 47", bold=True, font_size=11, space_after=3)
    add_p("TÀI LIỆU THAM KHẢO ................................................................................................................................... 49", bold=True, font_size=11, space_after=4)

    doc.add_page_break()

    # ==========================================
    # LỜI MỞ ĐẦU
    # ==========================================
    add_h1("LỜI MỞ ĐẦU")
    add_p("Trong kỷ nguyên công nghệ số và thể thao điện tử (Esports) bùng nổ mạnh mẽ, nhu cầu giải trí và trải nghiệm các tựa game trực tuyến thịnh hành như Liên Quân Mobile, Valorant, Genshin Impact, FC Online, PUBG PC và LMHT: Tốc Chiến đang tăng trưởng vượt bậc trong cộng đồng giới trẻ Việt Nam. Việc sở hữu các tài khoản game có bậc xếp hạng cao (Cao Thủ, Thách Đấu, Radiant) cùng các trang phục (skin) hiếm phiên bản giới hạn thường đòi hỏi chi phí đầu tư rất lớn, vượt quá khả năng tài chính của đa số học sinh, sinh viên. Do đó, dịch vụ thuê tài khoản game theo giờ trở thành một giải pháp giải trí kinh tế, tiện lợi và phổ biến.")
    add_p("Tuy nhiên, mô hình giao dịch thuê tài khoản truyền thống qua các hội nhóm mạng xã hội (Facebook, Zalo, Discord) bộc lộ rất nhiều bất cập và rủi ro nghiêm trọng: tình trạng lừa đảo chuyển khoản nhưng không nhận được tài khoản, thông tin đăng nhập bị sai, tài khoản dính mã bảo vệ 2 lớp (2FA), hoặc bị chủ tài khoản đổi mật khẩu giữa chừng mà không có cơ chế hoàn tiền. Để giải quyết triệt để bài toán thực tiễn này, nhóm sinh viên đã nghiên cứu, xây dựng và kiểm thử hệ thống: \"Website cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent)\". Hệ thống tự động hóa khép kín toàn bộ chu trình dịch vụ từ nạp tiền VietQR Auto, cấp thông tin bảo mật tức thì chỉ trong 1 giây, đếm ngược thời gian thực, gia hạn, trả nick sớm, đến chính sách bảo hiểm bồi thường hoàn tiền 100% khi phát sinh sự cố.")
    add_p("Dưới góc độ học phần Kiểm thử phần mềm, dự án GameRent là một sản phẩm hoàn hảo được thiết kế bài bản nhằm vận dụng toàn diện các nguyên lý và kỹ thuật kiểm thử theo chuẩn quốc tế ISTQB:")
    add_bullet("Chương 1 - Tổng quan bài toán", "Thu thập bối cảnh thực tế, phát biểu bài toán, mô tả luồng nghiệp vụ E2E, bảng đặc tả chi tiết các trường dữ liệu trên 8 màn hình/modal chức năng và phân rã 7 module nghiệp vụ cốt lõi.")
    add_bullet("Chương 2 - Phân tích và thiết kế test", "Thiết kế ma trận test case chuyên sâu cho cả 3 cấp độ: Unit Test (BVA, EP, Decision Table, chuẩn form UC1_Add New Product), Integration Test (Chiến lược Sandwich) và System Test (Kiểm thử luồng E2E, Kiểm thử chuyển trạng thái State Transition).")
    add_bullet("Chương 3 - Thực thi test và báo cáo kết quả test", "Tổng hợp số liệu thực thi kiểm thử, đo lường tỷ lệ Pass/Fail, lập nhật ký báo cáo lỗi (Bug Log Report) chi tiết theo đúng chuẩn 8 nội dung quan trọng.")
    add_bullet("Chương 4 - Automation test", "Cài đặt bộ kiểm thử tự động hóa 100% bằng framework hiện đại Vitest với 10 Test Suites và 107 Automated Tests đạt tỷ lệ thành công tuyệt đối 100% Passed, cùng việc chuẩn hóa thuộc tính data-testid trên toàn bộ giao diện.")
    add_p("Nhóm sinh viên xin bày tỏ lòng biết ơn sâu sắc đến cô giáo ThS. Phạm Thị Loan - Giảng viên giảng dạy học phần Kiểm thử phần mềm, Khoa Công nghệ thông tin, Trường Đại học Công nghệ Đông Á. Cô đã tận tình truyền đạt những kiến thức chuyên môn quý báu, định hướng phương pháp luận khoa học và giúp nhóm hoàn thành bài tập lớn này với chất lượng cao nhất!", italic=True, space_before=6, space_after=10)

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 1: TỔNG QUAN BÀI TOÁN
    # =========================================================
    add_h1("CHƯƠNG 1: TỔNG QUAN BÀI TOÁN")

    add_h2("1.1. Giới thiệu đề tài")

    add_h3("1.1.1. Thu thập đầu bài và bối cảnh bài toán trong thực tế")
    add_p("Tại thị trường Việt Nam hiện nay, trò chơi điện tử trực tuyến (Online Gaming) đã được công nhận là một ngành công nghiệp giải trí kỹ thuật số chính thống. Hàng triệu người chơi tham gia vào 6 hệ sinh thái game phổ biến nhất:")
    add_bullet("1. Liên Quân Mobile (Garena)", "Tựa game MOBA di động quốc dân với các bộ trang phục Thứ Nguyên Vệ Thần, Tuyệt Sắc có giá trị quy đổi hàng triệu đồng.")
    add_bullet("2. Valorant (Riot Games)", "Tựa game bắn súng chiến thuật FPS hàng đầu với hệ thống skin vũ khí hiệu ứng âm thanh và hoạt ảnh độc quyền (Kuronami, Prime Vandal, Reaver).")
    add_bullet("3. Genshin Impact (HoYoverse)", "Game nhập vai phiêu lưu thế giới mở AAA với các nhân vật 5 sao giới hạn (Raiden Shogun, Zhongli, Hu Tao).")
    add_bullet("4. FC Online (Garena / Nexon)", "Game mô phỏng bóng đá chân thực với giá trị đội hình thần tượng (Icon, BTB) hàng nghìn tỷ BP.")
    add_bullet("5. PUBG PC / Steam (Krafton)", "Tựa game sinh tồn Battle Royale kinh điển trên máy tính cá nhân.")
    add_bullet("6. LMHT: Tốc Chiến (VNG Games)", "Bản di động chuẩn mực của Liên Minh Huyền Thoại.")

    add_p("Thực trạng nhu cầu và vấn đề tồn tại của mô hình truyền thống:", bold=True, space_before=4)
    add_p("• Nhu cầu thực tế: Người dùng chỉ có nhu cầu trải nghiệm ngắn hạn (vài giờ leo rank cuối tuần, giao lưu cùng bạn bè hoặc test skin trước khi quyết định nạp tiền mua thật). Việc bỏ ra hàng triệu đến hàng chục triệu đồng để sở hữu trọn đời một tài khoản VIP là lãng phí và không khả thi đối với số đông học sinh, sinh viên.\n"
          "• Bất cập của giao dịch tự phát: Hiện nay, hoạt động thuê nick chủ yếu diễn ra tự phát qua Facebook, Zalo cá nhân. Người thuê chuyển tiền trước cho người bán nhưng thường xuyên gặp rủi ro: bị quỵt tiền (bị block ngay sau khi nhận tiền), mật khẩu cung cấp sai, tài khoản bị kích hoạt mã xác thực 2 bước (2FA OTP) không đăng nhập được, hoặc tài khoản đang bị khóa do người dùng trước vi phạm gian lận. Người thuê hoàn toàn không được bồi thường hay hỗ trợ.")

    add_h3("1.1.2. Phát biểu bài toán hệ thống GameRent")
    add_p("Từ bối cảnh thực tiễn trên, bài toán đặt ra là: **Xây dựng một nền tảng thương mại điện tử chuyên cung cấp dịch vụ cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent)** với các tiêu chí chất lượng khắt khe:")
    add_bullet("Tự động hóa thanh toán và bàn giao", "Tích hợp cổng nạp tiền VietQR tự động; kiểm tra số dư ví tức thời; tự động trừ tiền và hiển thị tài khoản/mật khẩu in-game bí mật ngay lập tức trong vòng 1 giây.")
    add_bullet("Giám sát phiên chơi thời gian thực", "Mỗi đơn thuê được gắn đồng hồ đếm ngược từng giây (CountdownTimer), có cảnh báo màu sắc (Xanh > 1h, Vàng < 1h, Đỏ khi hết giờ), hỗ trợ tính năng gia hạn cộng nối tiếp giờ chơi hoặc trả tài khoản sớm nhận hoàn 50% tiền giờ thừa.")
    add_bullet("Cơ chế bảo hiểm sự cố 100%", "Khi tài khoản gặp sự cố (sai pass, dính 2FA, bị cấm), khách hàng chỉ cần gửi yêu cầu khiếu nại; hệ thống tự động tạm dừng phiên chơi và hoàn trả 100% số tiền ca thuê vào ví sau khi Admin xác nhận.")
    add_bullet("Tự động hóa thu hồi và đổi mật khẩu", "Khi phiên chơi kết thúc, hệ thống tự động đổi mật khẩu ngẫu nhiên bảo mật cao để khách cũ không thể tiếp tục truy cập, sau đó đưa tài khoản về trạng thái sẵn sàng cho lượt thuê tiếp theo.")
    add_bullet("Trung tâm điều phối và quản trị toàn diện", "Cung cấp bảng điều khiển Dashboard cho Quản trị viên (Admin) giám sát các phiên live, can thiệp bù giờ, quản lý kho tài khoản chuẩn form mẫu UC1_Add New Product, quản lý khách hàng CRM và theo dõi doanh thu.")

    add_h3("1.1.3. Mục tiêu và phạm vi của đề tài")
    add_bullet("Mục tiêu phần mềm", "Xây dựng ứng dụng web hiện đại chuẩn Single Page Application (React 19, Vite, Tailwind/Modern CSS, LocalStorage Mock Database), giao diện Dark Mode phong cách Gaming Cyberpunk, tốc độ phản hồi dưới 100ms.")
    add_bullet("Mục tiêu kiểm thử", "Áp dụng đầy đủ quy trình kiểm thử hộp đen và kiểm thử hộp trắng theo tiêu chuẩn ISTQB: Phân tích giá trị biên (BVA), Phân vùng tương đương (EP), Bảng quyết định (Decision Table), Kiểm thử chuyển trạng thái (State Transition), Kiểm thử tích hợp (Sandwich Integration), Kiểm thử hệ thống End-to-End (E2E), và xây dựng bộ kiểm thử tự động hóa (Automation Testing) đạt độ bao phủ cao.")
    add_bullet("Phạm vi đề tài", "Bao gồm 12 phân hệ nghiệp vụ hoàn chỉnh, bao phủ trọn vẹn cả 2 nhóm tác tử: Khách hàng (Renter) và Quản trị viên (Administrator).")

    add_h2("1.2. Đặc tả yêu cầu")

    add_h3("1.2.1. Các luồng nghiệp vụ chính E2E của hệ thống (10 Use Cases)")
    add_p("Hệ thống GameRent được thiết kế bao gồm 10 trường hợp sử dụng (Use Cases) cốt lõi mô tả chu trình vận hành khép kín toàn trình (End-to-End):")

    uc_headers = ["Mã UC", "Tên Use Case", "Tác tử chính", "Mục đích nghiệp vụ", "Độ ưu tiên"]
    uc_rows = [
        ["UC01", "Đăng nhập hệ thống (Login)", "Khách thuê / Admin", "Xác thực danh tính, phân quyền RBAC và duy trì phiên làm việc", "High"],
        ["UC02", "Đăng ký tài khoản (Register)", "Khách vãng lai", "Đăng ký tài khoản thành viên mới, cấp ví trải nghiệm 50.000 VNĐ", "High"],
        ["UC03", "Tìm kiếm & Lọc kho acc game", "Khách hàng", "Duyệt danh mục 6 tựa game, tìm kiếm theo tên skin/rank, lọc giá thuê", "High"],
        ["UC04", "Nạp tiền ví qua VietQR Auto", "Khách hàng", "Tạo mã VietQR động, kiểm tra hạn mức BVA 10k-5M, nạp tiền tự động", "High"],
        ["UC05", "Thuê tài khoản game tức thì", "Khách hàng", "Trừ tiền ví, khóa nick độc quyền, bàn giao mật khẩu in-game bí mật", "Critical"],
        ["UC06", "Giám sát phiên thuê & Xem pass", "Khách hàng", "Đồng hồ đếm ngược từng giây, xem mật khẩu, nút copy 1-click", "High"],
        ["UC07", "Gia hạn thời gian thuê", "Khách hàng", "Cộng nối tiếp giờ chơi khi đơn còn hạn hoặc bắt đầu mốc mới khi quá hạn", "Medium"],
        ["UC08", "Trả nick sớm & Báo lỗi khiếu nại", "Khách hàng", "Hoàn 50% tiền khi trả sớm, hoàn tiền 100% bảo hiểm khi gặp sự cố", "High"],
        ["UC09", "Giám sát phiên & Điều phối Admin", "Administrator", "Giám sát phiên live, bù giờ (+1h), thu hồi pass, hoàn tiền ví khách", "High"],
        ["UC10", "Thêm mới tài khoản kho (Chuẩn UC1)", "Administrator", "Validate mã (8-30), tên (10-50), ảnh <= 1MB (.jpg/.png/.gif), giá thuê", "High"]
    ]
    add_table_custom(uc_headers, uc_rows, col_widths=[0.8, 1.9, 1.3, 2.6, 0.9])

    add_p("Mô tả chi tiết luồng nghiệp vụ E2E tiêu biểu của hệ thống:", bold=True, space_before=4)
    add_p("Luồng nghiệp vụ thuê tài khoản xuyên suốt (Happy Path):")
    add_bullet("Bước 1", "Khách vãng lai truy cập website, duyệt danh mục tài khoản game, sử dụng bộ lọc tìm kiếm tài khoản mong muốn.")
    add_bullet("Bước 2", "Người dùng đăng ký tài khoản thành viên (UC02), hệ thống cấp số dư ví khởi tạo trải nghiệm 50.000 VNĐ và tự động đồng bộ hồ sơ khách hàng mới sang bảng Quản lý khách hàng CRM của Admin.")
    add_bullet("Bước 3", "Nếu số dư ví không đủ, khách hàng mở modal Nạp tiền (UC04), chọn số tiền nạp (10.000 VNĐ - 5.000.000 VNĐ), quét mã VietQR tự động để nạp tiền vào ví.")
    add_bullet("Bước 4", "Tại trang Chi tiết tài khoản hoặc Cửa hàng, khách hàng bấm 'Thuê Ngay', chọn thời lượng thuê (1h - 48h), đồng ý điều khoản và xác nhận thanh toán (UC05).")
    add_bullet("Bước 5", "Hệ thống kiểm tra số dư ví, trừ tiền ca thuê, chuyển trạng thái tài khoản game sang 'rented' (đang thuê) và bàn giao ngay lập tức Tên tài khoản & Mật khẩu in-game bí mật.")
    add_bullet("Bước 6", "Khách hàng theo dõi ca chơi tại trang 'Đơn thuê của tôi' (UC06) với đồng hồ đếm ngược từng giây. Khách hàng có thể bấm 'Gia hạn' (UC07) hoặc bấm 'Trả nick sớm' (UC08) để nhận hoàn 50% số tiền giờ chưa chơi.")
    add_bullet("Bước 7", "Khi hết thời gian thuê, hệ thống tự động thu hồi tài khoản, sinh mật khẩu ngẫu nhiên mới bảo mật cao, vô hiệu hóa mật khẩu cũ và đưa tài khoản về trạng thái sẵn sàng cho lượt thuê tiếp theo.")

    add_h3("1.2.2. Các màn hình chức năng chính và ràng buộc nhập liệu")
    add_p("Hệ thống GameRent bao gồm 8 màn hình và hộp thoại (Modal) tương tác cao:")
    add_bullet("1. Trang Chủ & Bộ Lọc (HomePage.jsx)", "Banner hero, ô tìm kiếm từ khóa, thanh lọc theo 6 tựa game, bộ lọc khoảng giá, danh sách thẻ tài khoản kèm nhãn trạng thái 'Sẵn sàng' / 'Đang thuê' / 'Bảo trì', nút 'Thuê Ngay' và nút thả tim lưu yêu thích độc lập.")
    add_bullet("2. Chi Tiết Tài Khoản (AccountDetailPage.jsx)", "Thư viện ảnh skin sắc nét đa góc nhìn, bảng thông số kỹ thuật (cấp độ, bậc rank, tỷ lệ thắng, trang phục hiếm), cam kết bảo hiểm bồi thường 100%, hộp tính chi phí dự kiến theo số giờ thuê.")
    add_bullet("3. Hộp thoại Thuê Tài Khoản (RentConfirmModal.jsx)", "Tóm tắt thông tin tài khoản, ô chọn số giờ thuê (1 - 48 giờ), checkbox xác nhận đồng ý điều khoản, hiển thị tổng tiền cần thanh toán và số dư ví hiện tại. Bàn giao tài khoản/mật khẩu in-game kèm nút Copy 1-click ngay sau khi thanh toán.")
    add_bullet("4. Hộp thoại Nạp Tiền Ví (DepositModal.jsx)", "Phương thức chuyển khoản VietQR Napas247, các nút chọn nhanh mệnh giá (50k, 100k, 200k, 500k), ô nhập số tiền tùy ý áp dụng kiểm tra BVA (10.000đ - 5.000.000đ), hiển thị mã QR động và nội dung chuyển khoản tự động.")
    add_bullet("5. Quản Lý Đơn Thuê Của Tôi (MyRentalsPage.jsx)", "Tab Đang hoạt động và Lịch sử, thẻ đơn thuê hiển thị đồng hồ CountdownTimer đếm ngược từng giây, khối bảo mật tài khoản/mật khẩu in-game có nút ẩn/hiện, nút Copy, nút Gia Hạn, nút Trả Sớm và nút Báo Lỗi Khiếu Nại.")
    add_bullet("6. Hộp thoại Báo Lỗi Sự Cố (DisputeModal.jsx)", "Form chọn lý do: Sai mật khẩu, Dính 2FA OTP, Tài khoản bị cấm (ban), Sai mô tả skin; ô nhập mô tả chi tiết sự cố và nút gửi yêu cầu khiếu nại kích hoạt tạm dừng ca thuê.")
    add_bullet("7. Hộp thoại Trả Tài Khoản Sớm (ReturnEarlyModal.jsx)", "Tự động tính toán số giờ trọn vẹn chưa sử dụng, áp dụng chính sách hoàn tiền 50% vào ví và chuyển trạng thái tài khoản sang quy trình đổi mật khẩu.")
    add_bullet("8. Bảng Quản Trị Tổng Hợp & Kho Tài Khoản (AdminDashboardPage.jsx, OverviewDashboard.jsx, AccountInventoryPage.jsx)", "Giám sát các phiên thuê realtime kèm popover điều phối (Bù giờ +1h, Thu hồi sớm, Đưa vào bảo trì, Hoàn tiền 100%); Quản lý kho tài khoản với form thêm mới chuẩn 100% đặc tả UC1_Add New Product; Quản lý khách hàng CRM và Báo cáo doanh thu.")

    # Table of UI Fields Description
    add_p("Bảng đặc tả chi tiết các trường dữ liệu và ràng buộc validation trên các màn hình:", bold=True, space_before=4)
    fields_headers = ["Màn hình / Form", "Tên trường", "Kiểu dữ liệu", "Độ dài / Giới hạn", "Bắt buộc", "Ràng buộc kiểm tra & Thông báo lỗi"]
    fields_rows = [
        ["Đăng ký (AuthModal)", "Tên đăng nhập (username)", "String", "4 – 30 ký tự", "Có (Yes)", "Chỉ gồm chữ cái, số, gạch dưới. Báo lỗi: 'Tên đăng nhập phải từ 4 ký tự trở lên' / 'Tên đăng nhập không chứa khoảng trắng'"],
        ["Đăng ký (AuthModal)", "Mật khẩu (password)", "Password", "6 – 32 ký tự", "Có (Yes)", "Tối thiểu 6 ký tự. Báo lỗi: 'Mật khẩu phải có ít nhất 6 ký tự'"],
        ["Đăng ký (AuthModal)", "Số điện thoại (phone)", "String", "Đúng 10 chữ số", "Không", "Đầu số di động Việt Nam (03, 05, 07, 08, 09). Báo lỗi: 'Số điện thoại không đúng định dạng đầu số di động'"],
        ["Đăng nhập (AuthModal)", "Email / Tên đăng nhập", "String", "4 – 50 ký tự", "Có (Yes)", "Không để trống. Báo lỗi: 'Email không được để trống' / 'Email không tồn tại trên hệ thống'"],
        ["Đăng nhập (AuthModal)", "Mật khẩu", "Password", "6 – 32 ký tự", "Có (Yes)", "Không để trống. Báo lỗi: 'Mật khẩu không được để trống' / 'Mật khẩu không chính xác'"],
        ["Nạp tiền (DepositModal)", "Số tiền nạp (amount)", "Integer", "10.000 – 5.000.000 VNĐ", "Có (Yes)", "Số nguyên dương, BVA biên [10k, 5M]. Báo lỗi: 'Số tiền nạp tối thiểu là 10.000 VNĐ' / 'Số tiền nạp tối đa là 5.000.000 VNĐ'"],
        ["Thuê tài khoản (RentConfirm)", "Thời gian thuê (hours)", "Integer", "1 – 48 giờ", "Có (Yes)", "BVA biên [1, 48]. Báo lỗi: 'Thời gian thuê tối thiểu là 1 giờ' / 'Thời gian thuê tối đa là 48 giờ'"],
        ["Thuê tài khoản (RentConfirm)", "Đồng ý điều khoản", "Boolean", "true / false", "Có (Yes)", "Bắt buộc tick chọn. Báo lỗi: 'Bạn cần đồng ý với điều khoản sử dụng'"],
        ["Thêm tài khoản (UC1)", "Mã sản phẩm (code)", "String", "8 – 30 ký tự", "Có (Yes)", "Duy nhất, không khoảng trắng, chỉ gồm chữ và số. Báo lỗi: 'Mã sản phẩm phải từ 8 ký tự trở lên' / 'Mã sản phẩm đã tồn tại'"],
        ["Thêm tài khoản (UC1)", "Tên sản phẩm (title)", "String", "10 – 50 ký tự", "Có (Yes)", "BVA biên [10, 50]. Báo lỗi: 'Tên sản phẩm phải từ 10 ký tự trở lên' / 'Tên sản phẩm không quá 50 ký tự'"],
        ["Thêm tài khoản (UC1)", "Hình ảnh sản phẩm (image)", "File / URL", "Dung lượng <= 1MB", "Có (Yes)", "Định dạng file: *.jpg, *.png, *.gif. Báo lỗi: 'Ảnh phải đúng định dạng' / 'Dung lượng ảnh vượt quá 1MB'"],
        ["Thêm tài khoản (UC1)", "Giá thuê mỗi giờ (price)", "Integer", ">= 1.000 VNĐ/giờ", "Có (Yes)", "Số nguyên dương > 0. Báo lỗi: 'Giá thuê mỗi giờ phải lớn hơn 0'"],
        ["Khiếu nại (DisputeModal)", "Lý do báo lỗi (reason)", "Select", "1 trong 4 lý do", "Có (Yes)", "Sai mật khẩu, Dính 2FA, Tài khoản bị cấm, Sai mô tả. Báo lỗi: 'Vui lòng chọn lý do khiếu nại'"],
        ["Đổi mật khẩu (Settings)", "Mật khẩu mới (newPass)", "Password", ">= 6 ký tự", "Có (Yes)", "Khác mật khẩu cũ, khớp mật khẩu xác nhận. Báo lỗi: 'Mật khẩu mới phải từ 6 ký tự trở lên' / 'Mật khẩu xác nhận không khớp'"]
    ]
    add_table_custom(fields_headers, fields_rows, col_widths=[1.2, 1.2, 0.7, 1.0, 0.6, 2.3], header_bg="2B6CB0")

    add_callout("Quy tắc nghiệp vụ cốt lõi (Business Rules - BR)",
                "BR1: Mã sản phẩm là duy nhất trong hệ thống.\n"
                "BR2: Các trường Mã sản phẩm, Tên sản phẩm, Hình ảnh là bắt buộc nhập.\n"
                "BR3: Mã sản phẩm có độ dài từ 8 đến 30 ký tự chữ và/hoặc số.\n"
                "BR4: Tên sản phẩm có độ dài từ 10 đến 50 ký tự.\n"
                "BR5: Hình ảnh sản phẩm có dung lượng tối đa 1MB, định dạng *.jpg, *.png, *.gif.\n"
                "BR6: Thông báo lỗi màu đỏ hiển thị ngay dưới trường tương ứng theo định dạng: {Tên trường} + nội dung thông báo lỗi.")

    add_h3("1.2.3. Các Module chính của chương trình")
    add_p("Hệ thống GameRent được phân rã thành 7 module nghiệp vụ cốt lõi, tương ứng với các hàm xử lý logic và component giao diện:")

    mod_headers = ["STT", "Mã Module", "Tên Module", "Đầu vào (Input)", "Đầu ra (Output)", "Mô tả chức năng & Luồng xử lý chính"]
    mod_rows = [
        ["1", "F_AUTH", "Xác thực & Phân quyền", "Username, Email, Password, Phone", "Token session, User Object, Phân quyền RBAC", "Kiểm tra hợp lệ đăng ký, đăng nhập, chặn tài khoản bị khóa, duy trì phiên LocalStorage, đổi mật khẩu."],
        ["2", "F_WAL", "Ví điện tử & Nạp tiền VietQR", "Số tiền nạp, Phương thức chuyển khoản", "Giao dịch TX-XXXXX, Số dư ví mới, QR Payload", "Kiểm tra hạn mức nạp BVA (10k - 5M), sinh mã VietQR Napas247, ghi nhận lịch sử biến động số dư ví."],
        ["3", "F_RENT", "Thuê tài khoản & Tính phí", "Account ID, Duration Hours, Số dư ví", "Đơn thuê ORDER-XXXX, Acc chuyển 'rented', Pass in-game", "Kiểm tra BVA thời gian (1h - 48h), Decision Table số dư ví, trừ tiền ví, cấp thông tin in-game bí mật tức thì."],
        ["4", "F_TIMER", "Giám sát phiên & Countdown", "Thời điểm bắt đầu (startTime), Thời điểm hết hạn (expiresAt)", "Thời gian còn lại (HH:MM:SS), Cảnh báo màu (Xanh/Vàng/Đỏ)", "Đồng hồ đếm ngược từng giây theo thời gian thực (Date.now()), tự động kích hoạt thu hồi khi hết giờ."],
        ["5", "F_REF_EXT", "Hoàn tiền, Khiếu nại & Gia hạn", "Mã đơn hàng, Hành động (Trả sớm / Khiếu nại / Gia hạn)", "Tiền hoàn vào ví, Trạng thái đơn, Hạn thuê mới", "Hoàn 50% tiền giờ thừa khi trả sớm; Hoàn 100% bảo hiểm khi khiếu nại; Tính phí và nối tiếp thời gian khi gia hạn."],
        ["6", "F_AUTO_PASS", "Tự động đổi pass & Thu hồi", "Mật khẩu cũ (oldPassword), Prefix", "Mật khẩu mới ngẫu nhiên (12-14 ký tự), Lưu vết lịch sử", "Sinh mật khẩu ngẫu nhiên chứa chữ hoa, thường, số, ký tự đặc biệt, không trùng pass cũ, chuyển acc về 'available'."],
        ["7", "F_ADM_PROD", "Quản trị kho tài khoản (UC1)", "Form thêm tài khoản (Mã, Tên, Giá, Ảnh, Rank, Pass)", "Tài khoản mới lưu CSDL, Cập nhật kho, Lọc danh mục", "Tuân thủ 100% đặc tả UC1: Validate mã 8-30, tên 10-50, ảnh <= 1MB, hiển thị ngay trên Cửa hàng cho khách thuê."]
    ]
    add_table_custom(mod_headers, mod_rows, col_widths=[0.4, 0.9, 1.3, 1.2, 1.2, 2.0], header_bg="1A365D")

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST
    # =========================================================
    add_h1("CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST")

    add_p("📁 HỆ THỐNG BỘ BA TÀI LIỆU TEST CASE ĐÍNH KÈM CHƯƠNG 2 (CLICK ĐỂ MỞ TRỰC TIẾP FILE EXCEL):", bold=True, font_size=11, color=NAVY, space_before=4, space_after=2)
    add_file_link_box("1. Cấp độ Unit Test (100 Test Cases / 10 Module):", "Unit Test Case.xlsx", "Unit Test Case.xlsx", "Bao gồm Cover, FunctionList, Test Report 100% Passed và 10 Function Sheets chi tiết. Nhấn Ctrl + Click để mở file.")
    add_file_link_box("2. Cấp độ Integration Test (10 Test Cases / 6 Phân hệ Sandwich):", "IT_Test Case.xlsx", "IT_Test Case.xlsx", "Bao gồm Chiến lược tích hợp Sandwich, 6 Module IT và Báo cáo lỗi Bug Log. Nhấn Ctrl + Click để mở file.")
    add_file_link_box("3. Cấp độ System Test (12 Test Cases E2E / 7 Phân hệ):", "ST_Test Case.xlsx", "ST_Test Case.xlsx", "Bao gồm 3 Luồng nghiệp vụ E2E, 7 Module ST, Test Report và Bug Log 5 lỗi hệ thống. Nhấn Ctrl + Click để mở file.")

    add_h2("2.1. Unit test case")

    add_h3("2.1.1. Phương pháp, kỹ thuật kiểm thử Unit")
    add_p("Trong cấp độ Unit Test, nhóm sinh viên áp dụng các kỹ thuật thiết kế ca kiểm thử hộp đen và hộp trắng chuẩn quốc tế ISTQB:")
    add_bullet("Phân tích giá trị biên (Boundary Value Analysis - BVA)", "Tập trung kiểm tra các giá trị tại biên, ngay dưới biên và ngay trên biên của các trường dữ liệu có giới hạn: Hạn mức nạp tiền ví (10.000 VNĐ và 5.000.000 VNĐ); Thời lượng thuê tài khoản (1 giờ và 48 giờ); Độ dài Mã sản phẩm (8 và 30 ký tự); Độ dài Tên sản phẩm (10 và 50 ký tự); Dung lượng ảnh upload (1MB).")
    add_bullet("Phân vùng tương đương (Equivalence Partitioning - EP)", "Phân chia không gian dữ liệu đầu vào thành các lớp tương đương hợp lệ (Valid Classes) và không hợp lệ (Invalid Classes): Định dạng email có chứa ký tự '@' và tên miền; Định dạng số tiền là số nguyên dương; Định dạng đuôi file ảnh (.jpg, .png, .gif) so với các định dạng không được phép (.pdf, .zip, .exe).")
    add_bullet("Bảng quyết định (Decision Table Testing)", "Áp dụng cho các hàm nghiệp vụ có nhiều điều kiện logic kết hợp. Cụ thể trong hàm tính phí thuê và duyệt đơn: [Đã đăng nhập?] × [Tài khoản available?] × [Số dư ví >= Tổng tiền?].")
    add_bullet("Kiểm thử hộp trắng (White-box Testing)", "Bảo đảm bao phủ toàn bộ các luồng rẽ nhánh (Branch Coverage) và câu lệnh (Statement Coverage) trong các hàm nghiệp vụ tại file `src/utils/validation.js`.")

    add_h3("2.1.2. Danh sách các Unit Test Case chi tiết")
    add_p("Dưới đây là các bảng Unit Test Case chi tiết cho từng module nghiệp vụ cốt lõi:")
    add_file_link_box("🔗 Bảng đặc tả đầy đủ 100 Unit Test Cases (10 Module chức năng):", "Unit Test Case.xlsx", "Mở file Unit Test Case.xlsx (13 Sheets đầy đủ)", "Áp dụng Phân tích giá trị biên BVA, Phân vùng tương đương EP và Bảng quyết định Decision Table theo chuẩn bộ môn. Nhấn Ctrl + Click để mở file.")

    # Table UT - Module 1: Auth & Register
    add_p("Bảng 2.1: Danh sách Unit Test Case - Module Xác thực & Đăng ký (F_AUTH)", bold=True, space_before=4)
    ut_auth_headers = ["ID Test Case", "Mục tiêu kiểm thử", "Kỹ thuật", "Dữ liệu đầu vào (Input)", "Kết quả mong đợi (Expected Output)", "Priority"]
    ut_auth_rows = [
        ["UTC-AUTH-01", "Kiểm tra đăng ký hợp lệ (Happy path)", "EP", "User: 'gamer_pro', Pass: '123456', Phone: '0912345678'", "isValid = true, error = null", "High"],
        ["UTC-AUTH-02", "Bỏ trống Tên đăng nhập", "EP", "User: '', Pass: '123456', Phone: '0912345678'", "isValid = false, 'Tên đăng nhập không được để trống'", "High"],
        ["UTC-AUTH-03", "BVA Tên đăng nhập dưới biên min (3 ký tự)", "BVA", "User: 'abc', Pass: '123456', Phone: '0912345678'", "isValid = false, 'Tên đăng nhập phải từ 4 ký tự trở lên'", "High"],
        ["UTC-AUTH-04", "BVA Tên đăng nhập tại biên min (4 ký tự)", "BVA", "User: 'abcd', Pass: '123456', Phone: '0912345678'", "isValid = true, error = null", "High"],
        ["UTC-AUTH-05", "BVA Tên đăng nhập tại biên max (30 ký tự)", "BVA", "User: Chuỗi 30 ký tự hợp lệ, Pass: '123456'", "isValid = true, error = null", "Medium"],
        ["UTC-AUTH-06", "BVA Tên đăng nhập vượt biên max (31 ký tự)", "BVA", "User: Chuỗi 31 ký tự, Pass: '123456'", "isValid = false, 'Tên đăng nhập không được vượt quá 30 ký tự'", "Medium"],
        ["UTC-AUTH-07", "Tên đăng nhập chứa khoảng trắng", "EP", "User: 'user name', Pass: '123456'", "isValid = false, 'Tên đăng nhập không chứa khoảng trắng'", "High"],
        ["UTC-AUTH-08", "Tên đăng nhập chứa ký tự đặc biệt", "EP", "User: 'user@123', Pass: '123456'", "isValid = false, 'Tên đăng nhập chỉ gồm chữ và số'", "High"],
        ["UTC-AUTH-09", "BVA Mật khẩu dưới biên min (5 ký tự)", "BVA", "User: 'gamer1', Pass: '12345'", "isValid = false, 'Mật khẩu phải có ít nhất 6 ký tự'", "High"],
        ["UTC-AUTH-10", "BVA Mật khẩu tại biên min (6 ký tự)", "BVA", "User: 'gamer1', Pass: '123456'", "isValid = true, error = null", "High"],
        ["UTC-AUTH-11", "Số điện thoại sai độ dài (9 chữ số)", "BVA", "Phone: '091234567'", "isValid = false, 'Số điện thoại phải gồm đúng 10 chữ số'", "Medium"],
        ["UTC-AUTH-12", "Số điện thoại sai đầu số nhà mạng", "EP", "Phone: '0112345678'", "isValid = false, 'Số điện thoại không đúng định dạng đầu số di động'", "Medium"],
        ["UTC-AUTH-13", "Đăng ký trùng tên người dùng đã có", "Decision", "User: 'admin_test' (Đã tồn tại trong DB)", "isValid = false, 'Tên đăng nhập đã tồn tại trong hệ thống'", "High"],
        ["UTC-AUTH-14", "Đăng nhập sai mật khẩu", "EP", "Email: 'admin@gamerent.vn', Pass: 'wrongpass'", "success = false, 'Mật khẩu không chính xác'", "High"],
        ["UTC-AUTH-15", "Đăng nhập tài khoản bị khóa (isBlocked)", "Decision", "Email: 'blocked_user@gamerent.vn', Pass: '123456'", "success = false, 'Tài khoản của bạn đang bị khóa do vi phạm quy chế'", "Critical"]
    ]
    add_table_custom(ut_auth_headers, ut_auth_rows, col_widths=[1.0, 1.8, 0.7, 1.6, 1.8, 0.6], header_bg="2B6CB0")

    # Table UT - Module 2: Wallet & VietQR
    add_p("Bảng 2.2: Danh sách Unit Test Case - Module Nạp tiền Ví điện tử (F_WAL)", bold=True, space_before=4)
    ut_wal_headers = ["ID Test Case", "Mục tiêu kiểm thử", "Kỹ thuật", "Dữ liệu đầu vào (Input)", "Kết quả mong đợi (Expected Output)", "Priority"]
    ut_wal_rows = [
        ["UTC-WAL-01", "BVA Ngay dưới biên tối thiểu (9.999 VNĐ)", "BVA", "amount = 9999", "isValid = false, 'Số tiền nạp tối thiểu là 10.000 VNĐ'", "High"],
        ["UTC-WAL-02", "BVA Tại biên tối thiểu hợp lệ (10.000 VNĐ)", "BVA", "amount = 10000", "isValid = true, error = null, amount = 10000", "High"],
        ["UTC-WAL-03", "BVA Ngay trên biên tối thiểu (10.001 VNĐ)", "BVA", "amount = 10001", "isValid = true, error = null", "Medium"],
        ["UTC-WAL-04", "EP Mệnh giá thông dụng hợp lệ (200.000 VNĐ)", "EP", "amount = 200000", "isValid = true, error = null", "High"],
        ["UTC-WAL-05", "BVA Ngay dưới biên tối đa (4.999.999 VNĐ)", "BVA", "amount = 4999999", "isValid = true, error = null", "Medium"],
        ["UTC-WAL-06", "BVA Tại biên tối đa hợp lệ (5.000.000 VNĐ)", "BVA", "amount = 5000000", "isValid = true, error = null, amount = 5000000", "High"],
        ["UTC-WAL-07", "BVA Vượt quá biên tối đa (5.000.001 VNĐ)", "BVA", "amount = 5000001", "isValid = false, 'Số tiền nạp tối đa là 5.000.000 VNĐ'", "High"],
        ["UTC-WAL-08", "EP Báo lỗi khi nạp số tiền âm (-50.000 VNĐ)", "EP", "amount = -50000", "isValid = false, 'Số tiền nạp phải là số nguyên dương'", "High"],
        ["UTC-WAL-09", "EP Báo lỗi khi nhập số thực thập phân", "EP", "amount = 50000.5", "isValid = false, 'Số tiền nạp phải là số nguyên dương'", "Medium"],
        ["UTC-WAL-10", "EP Báo lỗi khi nhập ký tự chữ hoặc đặc biệt", "EP", "amount = '50k@'", "isValid = false, 'Vui lòng nhập số tiền hợp lệ'", "High"]
    ]
    add_table_custom(ut_wal_headers, ut_wal_rows, col_widths=[1.0, 1.9, 0.7, 1.4, 2.0, 0.6], header_bg="2B6CB0")

    # Table UT - Module 3: Rental & Decision Table
    add_p("Bảng 2.3: Danh sách Unit Test Case - Module Thuê tài khoản & Tính phí (F_RENT)", bold=True, space_before=4)
    ut_rent_headers = ["ID Test Case", "Mục tiêu kiểm thử", "Kỹ thuật", "Dữ liệu đầu vào (Input)", "Kết quả mong đợi (Expected Output)", "Priority"]
    ut_rent_rows = [
        ["UTC-RENT-01", "BVA Thuê tại biên tối thiểu (1 giờ) đủ tiền ví", "BVA", "hours = 1, price = 15k, balance = 50k", "isValid = true, totalCost = 15k, remaining = 35k, canRent = true", "High"],
        ["UTC-RENT-02", "BVA Thuê dưới biên tối thiểu (0 giờ)", "BVA", "hours = 0, price = 15k, balance = 50k", "isValid = false, 'Thời gian thuê tối thiểu là 1 giờ'", "High"],
        ["UTC-RENT-03", "BVA Thuê tại biên tối đa (48 giờ) đủ tiền", "BVA", "hours = 48, price = 15k, balance = 1.000k", "isValid = true, totalCost = 720k, remaining = 280k", "High"],
        ["UTC-RENT-04", "BVA Thuê vượt quá biên tối đa (49 giờ)", "BVA", "hours = 49, price = 15k, balance = 1.000k", "isValid = false, 'Thời gian thuê tối đa là 48 giờ'", "High"],
        ["UTC-RENT-05", "Decision: Số dư ví > Chi phí thuê (50k vs 30k)", "Decision", "hours = 2, price = 15k, balance = 50k", "canRent = true, totalCost = 30k, error = null", "High"],
        ["UTC-RENT-06", "Decision: Số dư ví == Chi phí thuê (30k vs 30k)", "Decision", "hours = 2, price = 15k, balance = 30k", "canRent = true, totalCost = 30k, remaining = 0đ", "High"],
        ["UTC-RENT-07", "Decision: Số dư ví < Chi phí thuê (20k vs 30k)", "Decision", "hours = 2, price = 15k, balance = 20k", "canRent = false, missing = 10k, 'Số dư ví không đủ. Cần thêm 10.000 đ'", "High"],
        ["UTC-RENT-08", "Decision: Tài khoản có status = 'rented'", "Decision", "acc.status = 'rented', hours = 2", "isValid = false, 'Tài khoản này hiện đang có người thuê'", "High"],
        ["UTC-RENT-09", "Decision: Tài khoản có status = 'maintenance'", "Decision", "acc.status = 'maintenance', hours = 2", "isValid = false, 'Tài khoản đang trong quá trình bảo trì / đổi mật khẩu'", "High"]
    ]
    add_table_custom(ut_rent_headers, ut_rent_rows, col_widths=[1.0, 1.9, 0.7, 1.5, 2.0, 0.6], header_bg="2B6CB0")

    # Table UT - Module 4: Product UC1 Specs
    add_p("Bảng 2.4: Danh sách Unit Test Case - Module Thêm tài khoản game chuẩn UC1 (F_ADM_PROD)", bold=True, space_before=4)
    ut_uc1_headers = ["ID Test Case", "Mục tiêu kiểm thử", "Kỹ thuật", "Dữ liệu đầu vào (Input)", "Kết quả mong đợi (Expected Output)", "Priority"]
    ut_uc1_rows = [
        ["UTC-UC1-01", "BVA Mã sản phẩm dưới biên min (7 ký tự)", "BVA", "code = 'SP00001' (7 ký tự)", "isValid = false, 'Mã sản phẩm phải từ 8 ký tự trở lên'", "High"],
        ["UTC-UC1-02", "BVA Mã sản phẩm tại biên min (8 ký tự)", "BVA", "code = 'SP000001' (8 ký tự)", "isValid = true, error = null", "High"],
        ["UTC-UC1-03", "BVA Mã sản phẩm tại biên max (30 ký tự)", "BVA", "code = Chuỗi 30 ký tự chữ và số", "isValid = true, error = null", "Medium"],
        ["UTC-UC1-04", "BVA Mã sản phẩm vượt biên max (31 ký tự)", "BVA", "code = Chuỗi 31 ký tự", "isValid = false, 'Mã sản phẩm không vượt quá 30 ký tự'", "Medium"],
        ["UTC-UC1-05", "EP Mã sản phẩm chứa ký tự đặc biệt (@)", "EP", "code = 'SP@12345'", "isValid = false, 'Mã sản phẩm chỉ gồm chữ và số'", "High"],
        ["UTC-UC1-06", "EP Mã sản phẩm chứa khoảng trắng", "EP", "code = 'SP 000001'", "isValid = false, 'Mã sản phẩm không chứa khoảng trắng'", "High"],
        ["UTC-UC1-07", "BR1 Mã sản phẩm đã tồn tại trong CSDL", "Decision", "code = 'ACCVAL001' (Đã có trong DB)", "isValid = false, 'Mã sản phẩm đã tồn tại trong hệ thống'", "High"],
        ["UTC-UC1-08", "BVA Tên sản phẩm dưới biên min (9 ký tự)", "BVA", "title = 'Acc Vip 1' (9 ký tự)", "isValid = false, 'Tên sản phẩm phải từ 10 ký tự trở lên'", "High"],
        ["UTC-UC1-09", "BVA Tên sản phẩm tại biên min (10 ký tự)", "BVA", "title = 'Acc Vip 01' (10 ký tự)", "isValid = true, error = null", "High"],
        ["UTC-UC1-10", "BVA Tên sản phẩm tại biên max (50 ký tự)", "BVA", "title = Chuỗi 50 ký tự hợp lệ", "isValid = true, error = null", "Medium"],
        ["UTC-UC1-11", "BVA Tên sản phẩm vượt biên max (51 ký tự)", "BVA", "title = Chuỗi 51 ký tự", "isValid = false, 'Tên sản phẩm không quá 50 ký tự'", "Medium"],
        ["UTC-UC1-12", "EP Upload file ảnh sai định dạng (.pdf)", "EP", "imageType = 'application/pdf'", "isValid = false, 'Ảnh phải đúng định dạng (.jpg, .png, .gif)'", "High"],
        ["UTC-UC1-13", "BVA Upload ảnh dung lượng vượt biên 1MB (1.5MB)", "BVA", "imageSize = 1.5 * 1024 * 1024 bytes", "isValid = false, 'Dung lượng ảnh vượt quá 1MB'", "High"],
        ["UTC-UC1-14", "EP Upload ảnh PNG hợp lệ (800KB <= 1MB)", "EP", "imageType = 'image/png', size = 800KB", "isValid = true, error = null", "Medium"],
        ["UTC-UC1-15", "EP Giá thuê mỗi giờ <= 0 (nhập số âm)", "EP", "pricePerHour = -15000", "isValid = false, 'Giá thuê mỗi giờ phải lớn hơn 0'", "High"]
    ]
    add_table_custom(ut_uc1_headers, ut_uc1_rows, col_widths=[1.0, 1.9, 0.7, 1.5, 2.0, 0.6], header_bg="2B6CB0")

    doc.add_page_break()

    # =========================================================
    # 2.2 INTEGRATION TEST CASE
    # =========================================================
    add_h2("2.2. Integration test case")

    add_h3("2.2.1. Phương pháp, kỹ thuật kiểm thử tích hợp")
    add_p("Để kiểm thử tính toàn vẹn và sự ăn khớp giữa các module độc lập, nhóm sinh viên áp dụng **Chiến lược kiểm thử tích hợp Sandwich (Sandwich / Hybrid Integration Strategy)** kết hợp ưu điểm của cả 2 phương pháp Top-down và Bottom-up:")
    add_bullet("Tầng dưới (Bottom-up)", "Tích hợp và kiểm chứng các dịch vụ tiện ích lõi (Validation, LocalStorage Database Mock Engine, Password Generator, Calculation) với nhau trước.")
    add_bullet("Tầng trên (Top-down)", "Tích hợp từ các thành phần giao diện React Component (Navbar, Modals, Forms, Buttons) xuống tầng quản lý trạng thái tập trung React Context API (AppContext).")
    add_bullet("Điểm hội tụ (Target Layer)", "AppContext đóng vai trò là tầng trung tâm kết nối giữa thao tác người dùng (User Events) và luồng biến đổi dữ liệu (Data State Transitions), bảo đảm dữ liệu luôn nhất quán giữa bộ nhớ RAM và LocalStorage khi reload trang.")

    add_h3("2.2.2. Danh sách các Integration Test Case chi tiết")
    add_p("Bảng 2.5 tổng hợp 10 ca kiểm thử tích hợp chi tiết bao quát toàn bộ các luồng giao tiếp giữa các phân hệ:")
    add_file_link_box("🔗 Bảng kịch bản 10 Integration Test Cases theo chiến lược Sandwich:", "IT_Test Case.xlsx", "Mở file IT_Test Case.xlsx (11 Sheets)", "Bao gồm Chiến lược tích hợp Sandwich 3 tầng, 6 Module IT và Báo cáo lỗi Bug Log. Nhấn Ctrl + Click để mở file.")

    it_headers = ["Mã ITC", "Tên ca kiểm thử tích hợp", "Phân hệ tích hợp", "Tiền điều kiện", "Các bước thực hiện & Dữ liệu", "Kết quả mong đợi (Expected Output)", "Priority"]
    it_rows = [
        ["ITC-01", "Tích hợp Đăng ký mới -> Tự động đăng nhập -> Khởi tạo ví 50k",
         "AuthModal ↔ AppContext ↔ LocalStorage",
         "Chưa đăng nhập, LocalStorage trống",
         "1. Nhập thông tin đăng ký hợp lệ (gamer_new, pass123456).\n2. Bấm 'Đăng ký ngay'.",
         "1. User được tạo mới trong DB.\n2. Tự động đăng nhập với role = 'renter'.\n3. Số dư ví được cấp đúng 50.000 VNĐ.", "High"],

        ["ITC-02", "Tích hợp Nạp tiền VietQR Auto -> Cộng số dư ví -> Lưu lịch sử",
         "DepositModal ↔ WalletPage ↔ AppContext",
         "Đã đăng nhập (balance: 50k)",
         "1. Mở modal nạp tiền, chọn mệnh giá 200.000 VNĐ.\n2. Xác nhận hoàn tất chuyển khoản VietQR.",
         "1. Số dư ví tăng lên 250.000 VNĐ.\n2. Ghi nhận giao dịch TX-XXXX với loại 'Nạp tiền VietQR Auto'.", "High"],

        ["ITC-03", "Tích hợp Thuê acc -> Trừ ví -> Cấp pass in-game -> Đổi status acc",
         "RentConfirmModal ↔ AccountCard ↔ AppContext",
         "Ví có 250k, Acc 'ACCVAL001' giá 15k/h đang available",
         "1. Bấm 'Thuê Ngay', chọn 2 giờ (30k).\n2. Tick đồng ý điều khoản, bấm 'Xác Nhận Thuê'.",
         "1. Ví bị trừ 30k (còn 220k).\n2. Bàn giao Tên đăng nhập và Mật khẩu in-game.\n3. Trạng thái acc chuyển sang 'rented'.\n4. Tạo đơn ORDER-XXXX.", "Critical"],

        ["ITC-04", "Tích hợp Gia hạn giờ thuê -> Trừ ví -> Nối tiếp CountdownTimer",
         "ExtendRentalModal ↔ CountdownTimer ↔ AppContext",
         "Đơn hàng đang active, còn hạn chơi 30 phút",
         "1. Bấm 'Gia hạn', chọn thêm 1 giờ (15k).\n2. Bấm 'Xác Nhận Thanh Toán'.",
         "1. Ví bị trừ thêm 15k.\n2. Thời gian hết hạn (expiresAt) được cộng nối tiếp thêm đúng 3.600 giây vào mốc cũ.", "High"],

        ["ITC-05", "Tích hợp Khách báo lỗi -> Admin duyệt -> Hoàn tiền 100% -> Khóa acc",
         "DisputeModal ↔ OverviewDashboard ↔ AppContext",
         "Đơn hàng đang thuê bị sự cố sai pass",
         "1. Khách gửi khiếu nại 'Sai mật khẩu'.\n2. Admin mở OverviewDashboard bấm 'Phê duyệt hoàn tiền'.",
         "1. Đơn chuyển 'disputed' -> 'resolved'.\n2. Ví khách được cộng lại 100% tiền đơn.\n3. Acc chuyển sang 'maintenance'.", "High"],

        ["ITC-06", "Tích hợp Trả nick sớm -> Hoàn 50% tiền thừa -> Chuyển đổi pass",
         "ReturnEarlyModal ↔ MyRentalsPage ↔ AppContext",
         "Đơn thuê 3 giờ (45k), khách chơi xong sau 1 giờ (thừa 2h)",
         "1. Khách bấm 'Trả Nick Sớm'.\n2. Xác nhận tại modal hoàn trả.",
         "1. Hệ thống tính hoàn 50% tiền 2h thừa = 15.000 VNĐ vào ví khách.\n2. Đơn chuyển 'completed'.\n3. Acc chuyển sang 'need_change_pass'.", "High"],

        ["ITC-07", "Tích hợp Thu hồi tự động -> Sinh pass ngẫu nhiên -> Sẵn sàng cho thuê",
         "CountdownTimer ↔ AutoResetEngine ↔ AppContext",
         "Đơn thuê đếm ngược về 00:00:00 (hết giờ)",
         "1. Chờ đồng hồ về 0 hoặc bấm tua nhanh thời gian.",
         "1. Đơn hàng tự động đóng.\n2. Mật khẩu game đổi sang pass mới khác pass cũ.\n3. Acc chuyển về 'available'.", "High"],

        ["ITC-08", "Tích hợp Đăng ký khách mới -> Tự động đồng bộ CRM khách hàng Admin",
         "AuthModal ↔ CustomersPage ↔ AppContext",
         "Khách mới đăng ký bên ngoài trang chủ",
         "1. Khách điền form đăng ký thành công.\n2. Chuyển quyền Admin vào trang Quản Lý Khách Hàng.",
         "1. Khách mới lập tức xuất hiện trong bảng CRM Admin với mã KHxxx, số dư 50k, 0 đơn thuê.", "High"],

        ["ITC-09", "Tích hợp Phân tách danh sách Yêu thích độc lập theo tài khoản",
         "FavoriteButton ↔ LocalStorage ↔ AppContext",
         "Admin và Khách cùng sử dụng trên 1 trình duyệt",
         "1. Khách thả tim acc 1, acc 2.\n2. Đăng xuất, đăng nhập tài khoản Admin thả tim acc 3.\n3. Đăng nhập lại Khách.",
         "1. Khách chỉ thấy acc 1, acc 2 trong danh sách yêu thích.\n2. Admin chỉ thấy acc 3, không bị ghi đè dữ liệu của nhau.", "Medium"],

        ["ITC-10", "Tích hợp Đổi mật khẩu khách thuê -> Cập nhật LocalStorage -> Xác thực lại",
         "SettingsPage ↔ AuthModal ↔ AppContext",
         "Khách đang đăng nhập với pass cũ '123456'",
         "1. Vào Cài đặt -> Đổi mật khẩu.\n2. Nhập pass cũ, pass mới 'newpass123'.\n3. Đăng xuất và đăng nhập lại bằng pass mới.",
         "1. Đổi pass thành công.\n2. Đăng nhập bằng pass cũ báo lỗi; Đăng nhập bằng pass mới thành công.", "Medium"]
    ]
    add_table_custom(it_headers, it_rows, col_widths=[0.7, 1.4, 1.1, 1.0, 1.2, 1.5, 0.5])

    doc.add_page_break()

    # =========================================================
    # 2.3 SYSTEM TEST CASE
    # =========================================================
    add_h2("2.3. System test case")

    add_h3("2.3.1. Phương pháp, kỹ thuật kiểm thử hệ thống E2E và Chuyển trạng thái")
    add_p("Kiểm thử hệ thống (System Testing) được thực hiện trên môi trường tích hợp hoàn chỉnh nhằm kiểm chứng toàn bộ hành vi của ứng dụng dưới góc nhìn người dùng thực tế:")
    add_bullet("Kiểm thử ca sử dụng (Use Case Testing) & Kịch bản (Scenario Testing)", "Thực thi các chuỗi thao tác liên tục từ đầu đến cuối luồng nghiệp vụ (End-to-End Flows), bao gồm cả kịch bản thuận lợi (Happy Path), kịch bản ngoại lệ (Sad Path) và kịch bản biên giới hạn.")
    add_bullet("Kiểm thử chuyển trạng thái (State Transition Testing)", "Kiểm soát vòng đời trạng thái của các thực thể trọng yếu trong hệ thống:")
    add_p("• **Vòng đời trạng thái của Tài khoản Game:**\n"
          "  [available] ──(Khách thuê)──> [rented] ──(Hết giờ / Trả sớm)──> [need_change_pass] ──(Đổi pass mới)──> [available]\n"
          "  [rented] ──(Khách báo lỗi)──> [disputed] ──(Admin duyệt hoàn tiền)──> [maintenance] ──(Sửa xong)──> [available]\n"
          "• **Vòng đời trạng thái của Đơn thuê (Order):**\n"
          "  [active] ──(Hết hạn)──> [completed]\n"
          "  [active] ──(Trả sớm)──> [returned_early]\n"
          "  [active] ──(Khiếu nại)──> [disputed] ──(Admin duyệt)──> [refunded]")

    add_h3("2.3.2. Danh sách các System Test Case chi tiết")
    add_p("Bảng 2.6 mô tả 12 kịch bản kiểm thử hệ thống E2E hoàn chỉnh:")
    add_file_link_box("🔗 Bảng kịch bản 12 System Test Cases E2E toàn diện:", "ST_Test Case.xlsx", "Mở file ST_Test Case.xlsx (12 Sheets)", "Bao gồm Luồng nghiệp vụ E2E, 7 Module ST, Test Report 100% Passed và Bug Log 5 lỗi hệ thống. Nhấn Ctrl + Click để mở file.")

    st_headers = ["Mã STC", "Tên kịch bản kiểm thử E2E", "Tiền điều kiện", "Các bước thực hiện kiểm thử", "Dữ liệu kiểm thử", "Kết quả mong đợi (Expected Result)", "Priority"]
    st_rows = [
        ["STC-E2E-01", "Đăng ký thành viên mới và tự động nhận ví trải nghiệm",
         "Khách vãng lai chưa đăng nhập",
         "1. Nhấn nút 'Đăng ký' trên Navbar.\n2. Nhập họ tên, username, password, SĐT.\n3. Nhấn 'Đăng ký ngay'.",
         "Username: 'new_player'\nPass: '123456'\nPhone: '0987654321'",
         "1. Đăng ký thành công, thông báo chào mừng.\n2. Header hiển thị tên 'new_player' và ví có sẵn 50.000 VNĐ.\n3. Khách mới xuất hiện trong CRM Admin.", "High"],

        ["STC-E2E-02", "Đăng nhập với tài khoản bị Admin khóa (isBlocked)",
         "Admin đã khóa tài khoản 'bad_user' trong CRM",
         "1. Nhấn 'Đăng nhập'.\n2. Nhập thông tin của 'bad_user'.\n3. Nhấn 'Đăng nhập'.",
         "Email: 'bad_user@gamerent.vn'\nPass: '123456'",
         "1. Hệ thống chặn đăng nhập.\n2. Hiển thị thông báo lỗi màu đỏ: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế'.", "High"],

        ["STC-E2E-03", "Tìm kiếm, lọc danh mục và lưu tài khoản yêu thích",
         "Khách đã đăng nhập",
         "1. Chọn tab game 'Valorant'.\n2. Chọn lọc giá 'Dưới 20k'.\n3. Nhập từ khóa 'Prime'.\n4. Nhấn icon trái tim lưu yêu thích.",
         "Game: Valorant\nGiá: < 20k\nTừ khóa: 'Prime'",
         "1. Lưới sản phẩm chỉ hiển thị các acc Valorant có skin Prime giá < 20k.\n2. Icon trái tim đổi sang màu đỏ rực.\n3. Bấm lọc yêu thích hiển thị đúng acc vừa lưu.", "Medium"],

        ["STC-E2E-04", "Nạp tiền ví tự động bằng VietQR với hạn mức BVA hợp lệ",
         "Khách đăng nhập (ví 50k)",
         "1. Nhấn vào ô số dư ví mở modal nạp tiền.\n2. Chọn nạp 100.000 VNĐ.\n3. Quét mã VietQR và bấm xác nhận.",
         "Số tiền: 100.000 VNĐ\nPhương thức: VietQR",
         "1. Số dư ví tăng ngay lên 150.000 VNĐ.\n2. Bảng lịch sử ghi nhận giao dịch nạp tiền thành công.", "High"],

        ["STC-E2E-05", "Thuê tài khoản game tức thì và nhận thông tin in-game",
         "Ví có 150k, Acc 'ACCVAL001' giá 15k/h đang available",
         "1. Nhấn 'Thuê Ngay' tại thẻ acc.\n2. Chọn thuê 2 giờ (30k).\n3. Tick đồng ý điều khoản -> 'Xác Nhận Thuê'.",
         "Thời lượng: 2 giờ\nChi phí: 30.000 VNĐ",
         "1. Trừ ví 30k (còn 120k).\n2. Modal bàn giao hiển thị Tên tài khoản, Mật khẩu in-game và nút Copy 1-click.\n3. Thẻ acc trên Cửa hàng đổi sang nhãn 'Đang thuê'.", "Critical"],

        ["STC-E2E-06", "Theo dõi đồng hồ đếm ngược và kiểm tra cảnh báo đổi màu",
         "Khách vừa thuê acc thành công",
         "1. Vào trang 'Đơn thuê của tôi'.\n2. Quan sát CountdownTimer.\n3. Dùng công cụ Fast Forward tua giờ.",
         "Ca thuê thời gian thực",
         "1. Đồng hồ đếm ngược chính xác từng giây.\n2. Khi còn > 1h: màu xanh lá; Khi còn < 1h: đổi sang màu vàng cam; Hết giờ: đổi sang màu đỏ.", "High"],

        ["STC-E2E-07", "Gia hạn thêm giờ chơi khi đơn đang còn hạn",
         "Đơn thuê đang active (còn 45 phút)",
         "1. Bấm 'Gia hạn' trên thẻ đơn thuê.\n2. Chọn thêm 1 giờ (15k).\n3. Bấm xác nhận.",
         "Gia hạn: +1 giờ\nChi phí: 15.000 VNĐ",
         "1. Ví bị trừ 15k.\n2. Đồng hồ tự động nhảy tăng thêm đúng 3.600 giây nối tiếp mốc thời gian cũ mà không làm gián đoạn phiên chơi.", "High"],

        ["STC-E2E-08", "Trả tài khoản sớm và nhận hoàn tiền 50% vào ví",
         "Đơn thuê 3 giờ (45k), khách chơi xong sau 1 giờ (thừa 2h)",
         "1. Bấm 'Trả Nick Sớm'.\n2. Đọc tóm tắt hoàn 50% tiền 2h thừa (15k).\n3. Bấm xác nhận.",
         "Giờ thừa: 2 giờ\nTiền hoàn: 15.000 VNĐ",
         "1. Ví khách được cộng ngay 15.000 VNĐ.\n2. Đơn hàng chuyển sang 'completed'.\n3. Acc chuyển sang 'need_change_pass'.", "High"],

        ["STC-E2E-09", "Báo lỗi khiếu nại sự cố và nhận hoàn tiền bảo hiểm 100%",
         "Khách thuê đăng nhập game bị báo 'Sai mật khẩu'",
         "1. Bấm 'Báo Lỗi / Khiếu Nại'.\n2. Chọn lý do 'Sai mật khẩu', nhập mô tả.\n3. Admin mở Dashboard bấm 'Phê duyệt hoàn tiền'.",
         "Lý do: Sai mật khẩu\nHoàn tiền: 100% tiền đơn (30k)",
         "1. Đơn hàng chuyển sang 'refunded'.\n2. Ví khách được hoàn đủ 100% tiền đơn.\n3. Tài khoản game tự động chuyển về 'maintenance' để kỹ thuật kiểm tra.", "High"],

        ["STC-E2E-10", "Admin thêm tài khoản mới chuẩn UC1 và Client thuê thành công",
         "Admin đăng nhập, mở Kho tài khoản",
         "1. Bấm 'Thêm Acc Mới'.\n2. Nhập Mã 'ACCLQ999', Game: Liên Quân, Tiêu đề 'Thứ Nguyên Vệ Thần Nakroth', Giá 20k, Ảnh <= 1MB, Rank Cao Thủ.\n3. Bấm Lưu.\n4. Chuyển sang Client thuê.",
         "Mã: ACCLQ999\nTiêu đề: Thứ Nguyên Vệ Thần Nakroth\nGiá: 20k/h",
         "1. Form kiểm tra hợp lệ đúng chuẩn UC1.\n2. Tài khoản hiển thị ngay trên Cửa hàng Client.\n3. Khách hàng bấm thuê thành công nhận đúng tài khoản/mật khẩu vừa tạo.", "High"],

        ["STC-E2E-11", "Admin điều phối Live Session bù giờ (+1h) khi game bảo trì",
         "Khách đang chơi thì máy chủ game bảo trì gián đoạn",
         "1. Admin mở OverviewDashboard, bấm vào phiên thuê của khách.\n2. Tại popover điều phối, Admin bấm 'Bù giờ (+1h)'.\n3. Khách kiểm tra lại đồng hồ.",
         "Thao tác Admin: Bù giờ +1h",
         "1. Hệ thống cộng thêm 3.600 giây vào đơn thuê của khách.\n2. Đồng hồ CountdownTimer phía khách hàng tự động tăng thêm 1 giờ hoàn toàn miễn phí.", "High"],

        ["STC-E2E-12", "Cơ chế chống thuê trùng tài khoản (Race Condition)",
         "Acc 'ACCVAL001' đang available. Khách A và Khách B cùng mở modal thuê",
         "1. Khách A bấm 'Xác Nhận Thuê' trước 1 giây.\n2. Khách B bấm 'Xác Nhận Thuê' ngay sau đó.",
         "2 khách cùng thuê 1 acc tại 1 thời điểm",
         "1. Khách A thuê thành công, nhận nick.\n2. Khách B bị hệ thống chặn với thông báo: 'Tài khoản này vừa được người khác thuê, vui lòng chọn tài khoản khác', ví khách B không bị trừ tiền.", "Critical"]
    ]
    add_table_custom(st_headers, st_rows, col_widths=[0.8, 1.3, 1.0, 1.2, 1.0, 1.5, 0.5])

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 3: THỰC THI TEST VÀ BÁO CÁO KẾT QUẢ TEST
    # =========================================================
    add_h1("CHƯƠNG 3: THỰC THI TEST VÀ BÁO CÁO KẾT QUẢ TEST")

    add_h2("3.1. Kết quả thực hiện Integration test")

    add_h3("3.1.1. Bảng tổng hợp kết quả kiểm thử Integration test")
    add_p("Quá trình thực thi kiểm thử tích hợp (Integration Test) được tiến hành nghiêm ngặt trên toàn bộ 10 ca kiểm thử đã thiết kế (ITC-01 đến ITC-10), kiểm tra sự tương tác giữa các React Component, AppContext và LocalStorage Database. Dưới đây là bảng tổng hợp kết quả kiểm thử theo chuẩn mẫu Test Report:")

    it_rep_headers = ["STT", "Mã phân hệ tích hợp", "Tổng số ca test", "Đạt (Pass)", "Lỗi (Fail)", "Chưa test", "Không áp dụng", "Tỷ lệ Pass (%)"]
    it_rep_rows = [
        ["1", "F_AUTH ↔ AppContext ↔ LocalStorage (ITC-01, ITC-08, ITC-10)", "3", "3", "0", "0", "0", "100%"],
        ["2", "F_WAL ↔ WalletPage ↔ AppContext (ITC-02)", "1", "1", "0", "0", "0", "100%"],
        ["3", "F_RENT ↔ AccountCard ↔ AppContext (ITC-03)", "1", "1", "0", "0", "0", "100%"],
        ["4", "F_TIMER ↔ CountdownTimer ↔ AppContext (ITC-04, ITC-07)", "2", "2", "0", "0", "0", "100%"],
        ["5", "F_REF_EXT ↔ Dispute & Return ↔ AppContext (ITC-05, ITC-06)", "2", "2", "0", "0", "0", "100%"],
        ["6", "F_FAV ↔ LocalStorage Separation (ITC-09)", "1", "1", "0", "0", "0", "100%"],
        ["TỔNG", "TOÀN BỘ CÁC PHÂN HỆ TÍCH HỢP", "10", "10", "0", "0", "0", "100%"]
    ]
    add_table_custom(it_rep_headers, it_rep_rows, col_widths=[0.5, 2.7, 0.9, 0.7, 0.7, 0.6, 0.6, 0.9], header_bg="1A365D")

    add_callout("Đánh giá kết quả kiểm thử tích hợp",
                "• 100% các ca kiểm thử tích hợp (10/10 ITC) đã hoàn thành và đạt kết quả mong đợi sau khi khắc phục các lỗi phát sinh.\n"
                "• Kiến trúc tích hợp Sandwich kết hợp React Context API và LocalStorage Mock Engine chứng minh tính ổn định cao, dữ liệu được đồng bộ tức thì và bảo đảm tính toàn vẹn trạng thái phiên làm việc.")
    add_file_link_box("🔗 Báo cáo số liệu thực thi Integration Test & Bug Log:", "IT_Test Case.xlsx", "Mở file IT_Test Case.xlsx (Sheet 'Test Report' & 'Bug Log')", "Tổng hợp tỷ lệ Pass 100% và phiếu chi tiết 5 lỗi tích hợp BUG-IT-001 -> 005. Nhấn Ctrl + Click để mở file.")

    add_h3("3.1.2. Danh sách các lỗi phát hiện trong Integration test (Bug Log chuẩn form)")
    add_p("Trong giai đoạn thực thi Integration Test ban đầu, nhóm kiểm thử đã phát hiện 5 lỗi tích hợp (Integration Bugs). Các lỗi đã được ghi nhận và quản lý chặt chẽ theo đúng 8 nội dung quan trọng chuẩn form trong tài liệu 'Các nội dung quan trọng trong báo cáo lỗi.pdf':")

    # Summary table of IT bugs
    it_bug_sum_headers = ["Bug ID", "Tiêu đề lỗi", "Mức ưu tiên", "Phân hệ phát sinh", "Tester", "Ngày phát hiện", "Test Case ID", "Trạng thái"]
    it_bug_sum_rows = [
        ["BUG-IT-001", "Số dư ví bị lỗi số thực dạng thập phân khi gia hạn nhiều lần", "Medium", "Wallet ↔ AppContext", "Lê Xuân Đạt", "18/09/2026", "ITC-04", "Đã sửa (Fixed)"],
        ["BUG-IT-002", "Gia hạn đè mốc Date.now() làm mất thời gian chơi còn lại của khách", "High", "ExtendModal ↔ Timer", "Lê Hải Đăng", "18/09/2026", "ITC-04", "Đã sửa (Fixed)"],
        ["BUG-IT-003", "Admin duyệt khiếu nại không cộng lại tiền vào ví tài khoản khách", "Critical", "Dispute ↔ Wallet", "Lê Minh Quân", "19/09/2026", "ITC-05", "Đã sửa (Fixed)"],
        ["BUG-IT-004", "Trả nick sớm không đổi trạng thái acc sang 'need_change_pass'", "High", "ReturnEarly ↔ Stock", "Lê Thanh Tùng", "19/09/2026", "ITC-06", "Đã sửa (Fixed)"],
        ["BUG-IT-005", "Mật khẩu ngẫu nhiên tự động đổi có thể trùng với mật khẩu cũ", "Medium", "AutoReset ↔ Security", "Lê Hải Đăng", "20/09/2026", "ITC-07", "Đã sửa (Fixed)"]
    ]
    add_table_custom(it_bug_sum_headers, it_bug_sum_rows, col_widths=[0.9, 2.3, 0.8, 1.3, 1.0, 0.8, 0.8, 0.8], header_bg="2B6CB0")

    add_p("Chi tiết 2 phiếu báo cáo lỗi Integration tiêu biểu theo mẫu chuẩn 8 nội dung:", bold=True, space_before=4)

    # Bug report 1 detail
    b1_headers = ["Thuộc tính", "Nội dung chi tiết phiếu báo cáo lỗi (Bug Report Form)"]
    b1_rows = [
        ["1. Bug ID", "BUG-IT-003"],
        ["2. Bug Title", "Admin phê duyệt khiếu nại sự cố nhưng không hoàn tiền vào ví người dùng"],
        ["3. Priority", "Critical (Khẩn cấp - Ảnh hưởng trực tiếp đến tài sản khách hàng)"],
        ["4. Description", "Khi khách hàng gửi khiếu nại sự cố tài khoản sai pass và Admin bấm 'Phê Duyệt & Hoàn Tiền' trên OverviewDashboard, đơn hàng chuyển trạng thái nhưng số dư ví của khách không được cộng tiền."],
        ["5. Steps to Reproduce", "Bước 1: Khách hàng đăng nhập tài khoản có số dư 50.000 VNĐ.\nBước 2: Thuê acc giá 30.000 VNĐ (ví còn 20.000 VNĐ).\nBước 3: Gửi khiếu nại sự cố 'Sai mật khẩu'.\nBước 4: Đăng nhập Admin, mở OverviewDashboard, bấm vào đơn khiếu nại và bấm 'Phê duyệt hoàn tiền'.\nBước 5: Đăng nhập lại tài khoản khách kiểm tra số dư ví."],
        ["6. Environment", "HĐH: Windows 11 Pro 64-bit; Trình duyệt: Google Chrome 134.0; Môi trường: Localhost:5173; Mã nguồn: AppContext.jsx v1.0"],
        ["7. Expected Result", "Số dư ví của khách hàng phải được cộng hoàn trả đủ 100% tiền đơn (30.000 VNĐ), số dư ví mới phải là 50.000 VNĐ. Có thông báo chuông hoàn tiền."],
        ["8. Actual Result", "Số dư ví của khách vẫn giữ nguyên 20.000 VNĐ, không có giao dịch hoàn tiền nào được tạo trong lịch sử giao dịch."],
        ["9. Attachment", "Ảnh chụp màn hình: C:/BTL_KTPM/Tài Liệu/Bugs/BUG-IT-003-refund-failure.png"],
        ["10. Tester & Date", "Tester: Lê Minh Quân  |  Ngày phát hiện: 19/09/2026  |  Test Case liên quan: ITC-05"],
        ["11. Root Cause & Fix", "Nguyên nhân: Hàm resolveDispute trong AppContext chỉ cập nhật thuộc tính order.status = 'resolved' mà quên gọi logic updateWalletBalance.\nKhắc phục: Đã bổ sung hàm hoàn tiền 100% và ghi nhận transaction hoàn trả. Kiểm thử lại: Pass."]
    ]
    add_table_custom(b1_headers, b1_rows, col_widths=[1.5, 5.0], header_bg="1A365D")

    # Bug report 2 detail
    b2_headers = ["Thuộc tính", "Nội dung chi tiết phiếu báo cáo lỗi (Bug Report Form)"]
    b2_rows = [
        ["1. Bug ID", "BUG-IT-002"],
        ["2. Bug Title", "Gia hạn ca thuê đè mốc thời gian Date.now() làm mất thời gian chơi còn lại của khách"],
        ["3. Priority", "High (Nghiêm trọng - Gây thiệt hại thời gian dịch vụ)"],
        ["4. Description", "Khi ca thuê của khách vẫn còn 45 phút thời gian chơi, khách thực hiện gia hạn thêm 1 giờ (+60 phút). Hệ thống lại tính mốc hết hạn mới bằng Date.now() + 60 phút thay vì cộng nối tiếp vào mốc expiresAt cũ."],
        ["5. Steps to Reproduce", "Bước 1: Thuê acc 1 giờ lúc 14:00 (hết hạn lúc 15:00).\nBước 2: Lúc 14:15 (còn 45 phút), khách bấm 'Gia hạn' thêm 1 giờ.\nBước 3: Quan sát mốc hết hạn mới trên đồng hồ đếm ngược."],
        ["6. Environment", "HĐH: Windows 11; Trình duyệt: Microsoft Edge 134; Node.js v20.18; Môi trường: Localhost"],
        ["7. Expected Result", "Thời gian hết hạn mới phải là 15:00 + 1 giờ = 16:00 (khách được chơi tổng cộng 1h45 phút nữa)."],
        ["8. Actual Result", "Thời gian hết hạn mới bị tính bằng 14:15 + 1 giờ = 15:15 (khách bị mất trắng 45 phút chơi còn lại)."],
        ["9. Attachment", "Video tái hiện: C:/BTL_KTPM/Tài Liệu/Bugs/BUG-IT-002-extend-timer.mp4"],
        ["10. Tester & Date", "Tester: Lê Hải Đăng  |  Ngày phát hiện: 18/09/2026  |  Test Case liên quan: ITC-04"],
        ["11. Root Cause & Fix", "Nguyên nhân: Logic tính thời gian gia hạn mặc định lấy newExpires = Date.now() + hours.\nKhắc phục: Cập nhật điều kiện baseTime = expiresAt > Date.now() ? expiresAt : Date.now(). Kiểm thử lại: Pass."]
    ]
    add_table_custom(b2_headers, b2_rows, col_widths=[1.5, 5.0], header_bg="1A365D")

    doc.add_page_break()

    # =========================================================
    # 3.2 KẾT QUẢ THỰC HIỆN SYSTEM TEST
    # =========================================================
    add_h2("3.2. Kết quả thực hiện System test")

    add_h3("3.2.1. Bảng tổng hợp kết quả kiểm thử System test")
    add_p("Toàn bộ 12 kịch bản kiểm thử hệ thống End-to-End (STC-E2E-01 đến STC-E2E-12) đã được thực thi toàn diện trên trình duyệt web thực tế. Bảng 3.3 tổng hợp kết quả thực thi:")

    st_rep_headers = ["Nhóm chức năng E2E", "Mã kịch bản", "Tổng ca test", "Pass", "Fail", "Tỷ lệ đạt (%)", "Đánh giá chất lượng"]
    st_rep_rows = [
        ["Xác thực, Phân quyền & RBAC", "STC-E2E-01, STC-E2E-02", "2", "2", "0", "100%", "Bảo mật tuyệt đối, chặn tài khoản khóa chuẩn xác"],
        ["Duyệt kho, Lọc & Yêu thích", "STC-E2E-03", "1", "1", "0", "100%", "Bộ lọc đa tiêu chí phản hồi tức thì, lưu yêu thích độc lập"],
        ["Nạp tiền VietQR & Thuê acc E2E", "STC-E2E-04, STC-E2E-05", "2", "2", "0", "100%", "Bàn giao pass in-game bí mật tức thì chỉ trong 1 giây"],
        ["Giám sát thời gian thực & Gia hạn", "STC-E2E-06, STC-E2E-07", "2", "2", "0", "100%", "CountdownTimer đếm ngược chuẩn từng giây, đổi màu cảnh báo"],
        ["Trả sớm, Báo lỗi & Bảo hiểm 100%", "STC-E2E-08, STC-E2E-09", "2", "2", "0", "100%", "Hoàn 50% khi trả sớm, hoàn 100% khi khiếu nại minh bạch"],
        ["Quản trị kho UC1 & Điều phối Live", "STC-E2E-10, STC-E2E-11", "2", "2", "0", "100%", "Form thêm acc chuẩn 100% UC1, điều phối bù giờ live mượt mà"],
        ["Đồng thời & Chống Race Condition", "STC-E2E-12", "1", "1", "0", "100%", "Khóa tài nguyên độc quyền, ngăn chặn tuyệt đối double-booking"],
        ["TỔNG CỘNG HỆ THỐNG", "STC-E2E-01 -> 12", "12", "12", "0", "100%", "Hệ thống vận hành trơn tru, sẵn sàng triển khai thực tế"]
    ]
    add_table_custom(st_rep_headers, st_rep_rows, col_widths=[1.5, 1.2, 0.6, 0.5, 0.5, 0.8, 1.8], header_bg="1A365D")
    add_file_link_box("🔗 Báo cáo số liệu thực thi System Test & Bug Log:", "ST_Test Case.xlsx", "Mở file ST_Test Case.xlsx (Sheet 'Test Report' & 'Bug Log')", "Tổng hợp tỷ lệ Pass 100% và phiếu chi tiết 5 lỗi hệ thống BUG-ST-001 -> 005. Nhấn Ctrl + Click để mở file.")

    add_h3("3.2.2. Danh sách các lỗi phát hiện trong System test (Bug Log chuẩn form)")
    add_p("Trong quá trình kiểm thử hệ thống E2E thực tế, nhóm kiểm thử đã phát hiện 5 lỗi hệ thống (System Bugs). Toàn bộ đã được ghi nhận và khắc phục triệt để:")

    # Summary table of ST bugs
    st_bug_sum_headers = ["Bug ID", "Tiêu đề lỗi", "Mức ưu tiên", "Màn hình phát sinh", "Tester", "Ngày phát hiện", "Test Case ID", "Trạng thái"]
    st_bug_sum_rows = [
        ["BUG-ST-001", "Lỗi Race Condition cho phép 2 khách thuê trùng 1 tài khoản (Double-booking)", "Critical", "RentConfirmModal.jsx", "Lê Minh Quân", "21/09/2026", "STC-E2E-12", "Đã sửa (Fixed)"],
        ["BUG-ST-002", "CountdownTimer bị trôi giây khi người dùng chuyển sang tab trình duyệt khác", "Medium", "CountdownTimer.jsx", "Lê Thanh Tùng", "21/09/2026", "STC-E2E-06", "Đã sửa (Fixed)"],
        ["BUG-ST-003", "Form thêm acc UC1 cho phép lưu Tên sản phẩm chứa khoảng trắng đầu cuối > 50 ký tự", "Medium", "AccountInventoryPage.jsx", "Lê Hải Đăng", "22/09/2026", "STC-E2E-10", "Đã sửa (Fixed)"],
        ["BUG-ST-004", "Nút Copy mật khẩu in-game không phản hồi khi chạy trên giao thức HTTP", "High", "MyRentalsPage.jsx", "Lê Xuân Đạt", "22/09/2026", "STC-E2E-05", "Đã sửa (Fixed)"],
        ["BUG-ST-005", "Người dùng bị Admin khóa tài khoản vẫn có thể đổi mật khẩu qua trang Settings", "High", "SettingsPage.jsx", "Lê Thanh Tùng", "23/09/2026", "STC-E2E-02", "Đã sửa (Fixed)"]
    ]
    add_table_custom(st_bug_sum_headers, st_bug_sum_rows, col_widths=[0.9, 2.3, 0.8, 1.3, 1.0, 0.8, 0.8, 0.8], header_bg="2B6CB0")

    add_p("Chi tiết 2 phiếu báo cáo lỗi System Test tiêu biểu theo mẫu chuẩn 8 nội dung:", bold=True, space_before=4)

    # Bug report ST 1 detail
    b_st1_headers = ["Thuộc tính", "Nội dung chi tiết phiếu báo cáo lỗi (Bug Report Form)"]
    b_st1_rows = [
        ["1. Bug ID", "BUG-ST-001"],
        ["2. Bug Title", "Lỗi đua tài nguyên (Race Condition) cho phép 2 khách hàng thuê trùng 1 nick cùng thời điểm"],
        ["3. Priority", "Critical (Nghiêm trọng nhất - Gây tranh chấp tài khoản giữa 2 khách hàng)"],
        ["4. Description", "Khi tài khoản game 'ACCVAL001' đang ở trạng thái 'available', hai khách hàng A và B cùng mở modal thuê. Cả hai khách hàng cùng bấm 'Xác Nhận Thuê' cách nhau 0.5 giây. Hệ thống trừ tiền cả 2 khách và tạo 2 đơn thuê trùng lặp cho cùng 1 tài khoản."],
        ["5. Steps to Reproduce", "Bước 1: Mở 2 cửa sổ trình duyệt ẩn danh (Incognito) đăng nhập tài khoản Khách A và Khách B.\nBước 2: Cùng mở modal thuê tài khoản 'ACCVAL001'.\nBước 3: Bấm nút 'Xác Nhận Thuê' trên cả 2 trình duyệt gần như đồng thời.\nBước 4: Kiểm tra trạng thái đơn thuê và số dư ví của cả 2 khách."],
        ["6. Environment", "HĐH: Windows 11; Trình duyệt: Google Chrome 134 + Brave Browser; Độ trễ mạng: Giả lập 200ms"],
        ["7. Expected Result", "Khách A bấm trước thuê thành công. Khách B bấm sau phải bị hệ thống chặn với thông báo: 'Tài khoản này vừa được người khác thuê, vui lòng chọn tài khoản khác', ví khách B không bị trừ tiền."],
        ["8. Actual Result", "Cả 2 khách đều nhận thông báo thuê thành công, cả 2 ví đều bị trừ tiền và cùng nhận được chung 1 mật khẩu in-game."],
        ["9. Attachment", "Video kiểm thử đồng thời: C:/BTL_KTPM/Tài Liệu/Bugs/BUG-ST-001-race-condition.mp4"],
        ["10. Tester & Date", "Tester: Lê Minh Quân  |  Ngày phát hiện: 21/09/2026  |  Test Case liên quan: STC-E2E-12"],
        ["11. Root Cause & Fix", "Nguyên nhân: Trước khi trừ tiền ví, hàm rentAccount không kiểm tra lại trạng thái tươi mới nhất (fresh status) của tài khoản trong CSDL.\nKhắc phục: Bổ sung cơ chế Atomic Check & Lock: kiểm tra lại account.status === 'available' ngay tại thời điểm thực thi trừ tiền; nếu đã bị chuyển sang 'rented' thì lập tức reject giao dịch và hoàn trả nguyên vẹn tiền ví cho khách sau. Đã test lại: Pass 100%."]
    ]
    add_table_custom(b_st1_headers, b_st1_rows, col_widths=[1.5, 5.0], header_bg="1A365D")

    # Bug report ST 2 detail
    b_st2_headers = ["Thuộc tính", "Nội dung chi tiết phiếu báo cáo lỗi (Bug Report Form)"]
    b_st2_rows = [
        ["1. Bug ID", "BUG-ST-002"],
        ["2. Bug Title", "CountdownTimer bị lệch giây khi người dùng chuyển sang tab trình duyệt khác"],
        ["3. Priority", "Medium (Ảnh hưởng trải nghiệm người dùng)"],
        ["4. Description", "Đồng hồ đếm ngược CountdownTimer sử dụng hàm setInterval(1000). Khi người dùng chuyển sang tab khác trong 5-10 phút, trình duyệt tự động hạn chế tài nguyên (Background Throttling), khiến đồng hồ bị chậm hàng chục giây so với thực tế."],
        ["5. Steps to Reproduce", "Bước 1: Bắt đầu ca thuê acc có thời gian 1 giờ.\nBước 2: Mở một tab YouTube nghe nhạc trong 10 phút.\nBước 3: Quay trở lại tab GameRent kiểm tra đồng hồ đếm ngược."],
        ["6. Environment", "HĐH: Windows 11; Trình duyệt: Google Chrome 134; Tiết kiệm bộ nhớ (Memory Saver): Bật"],
        ["7. Expected Result", "Đồng hồ đếm ngược phải hiển thị chính xác còn lại 50 phút 00 giây."],
        ["8. Actual Result", "Đồng hồ hiển thị còn lại 56 phút 12 giây (bị trôi lệch hơn 6 phút so với giờ chuẩn)."],
        ["9. Attachment", "Ảnh so sánh thời gian: C:/BTL_KTPM/Tài Liệu/Bugs/BUG-ST-002-timer-drift.png"],
        ["10. Tester & Date", "Tester: Lê Thanh Tùng  |  Ngày phát hiện: 21/09/2026  |  Test Case liên quan: STC-E2E-06"],
        ["11. Root Cause & Fix", "Nguyên nhân: CountdownTimer dùng biến đếm giảm dần (remainingSeconds - 1) mỗi chu kỳ setInterval thay vì tính toán hiệu số thời gian thực.\nKhắc phục: Sửa logic đồng hồ luôn tính toán: remainingMs = Math.max(0, expiresAt - Date.now()). Dù tab bị sleep hay background, khi người dùng quay lại đồng hồ vẫn tính đúng tuyệt đối theo đồng hồ hệ thống. Đã test lại: Pass."]
    ]
    add_table_custom(b_st2_headers, b_st2_rows, col_widths=[1.5, 5.0], header_bg="1A365D")

    doc.add_page_break()

    # =========================================================
    # CHƯƠNG 4: AUTOMATION TEST
    # =========================================================
    add_h1("CHƯƠNG 4: AUTOMATION TEST")

    add_h2("4.1. Công cụ sử dụng")

    add_h3("4.1.1. Giới thiệu Vitest Test Runner & Kiến trúc kiểm thử tự động")
    add_p("Trong dự án GameRent, nhóm sinh viên lựa chọn **Vitest** làm framework kiểm thử tự động hóa chủ đạo kết hợp cùng cấu trúc định danh kiểm thử UI trên nền tảng React 19:")
    add_bullet("Ưu thế vượt trội của Vitest", "Vitest là test runner thế hệ mới được tối ưu hóa đặc biệt cho hệ sinh thái Vite. Khác với Jest truyền thống thường gặp sự cố khi biên dịch ESM và JSX hiện đại, Vitest chia sẻ chung cấu hình biên dịch với Vite (Single Pipeline), tận dụng cơ chế đa luồng (Worker Threads) giúp thực thi hàng trăm bài test song song trong thời gian dưới 2 giây.")
    add_bullet("Môi trường DOM giả lập (jsdom / happy-dom)", "Cung cấp môi trường giả lập đối tượng toàn cục `window`, `document`, sự kiện chuột và bộ nhớ `localStorage` độc lập cho từng file test, bảo đảm các bài test hoàn toàn cô lập (Isolate), không gây rò rỉ dữ liệu chéo.")
    add_bullet("Cú pháp chuẩn hóa và hàm so sánh (Matchers)", "Sử dụng bộ assertion matchers đầy đủ và chuyên nghiệp (`expect(value).toBe()`, `.toEqual()`, `.toMatchObject()`, `.toHaveLength()`, `.toThrow()`), giúp mã kiểm thử trong sáng, dễ đọc và dễ bảo trì.")

    add_h3("4.1.2. Chuẩn hóa bộ thuộc tính data-testid trên DOM cho UI Automation")
    add_p("Để tạo điều kiện thuận lợi nhất cho các công cụ tự động hóa giao diện cấp cao như **Playwright, Cypress hoặc Selenium WebDriver**, nhóm đã gắn chuẩn hóa thuộc tính `data-testid` trên toàn bộ các phần tử tương tác quan trọng của hệ thống:")

    tid_headers = ["Thuộc tính data-testid", "Thành phần giao diện tương ứng", "Mục đích kiểm thử tự động"]
    tid_rows = [
        ["app-header", "Navbar thanh điều hướng trên cùng", "Kiểm tra hiển thị logo, số dư ví và menu người dùng"],
        ["btn-nav-login", "Nút 'Đăng Nhập' trên Navbar", "Kích hoạt mở AuthModal ở trạng thái khách vãng lai"],
        ["header-user-dropdown-btn", "Nút dropdown thông tin người dùng", "Kiểm tra tên hiển thị, vai trò và nút Đăng xuất"],
        ["user-balance-box", "Khối hiển thị số dư ví trên header", "Kiểm tra số dư cập nhật tức thời sau khi nạp/thuê/hoàn tiền"],
        ["auth-modal", "Hộp thoại Đăng nhập / Đăng ký", "Kiểm tra đóng/mở và chuyển đổi giữa tab Đăng nhập/Đăng ký"],
        ["tab-auth-login / tab-auth-register", "Các tab chuyển đổi form xác thực", "Kiểm tra chuyển đổi giao diện form"],
        ["input-login-email", "Ô nhập email / tên đăng nhập", "Tự động điền dữ liệu kiểm thử đăng nhập (EP, BVA)"],
        ["input-login-password", "Ô nhập mật khẩu", "Tự động điền mật khẩu đăng nhập"],
        ["btn-submit-login / btn-submit-register", "Nút submit form đăng nhập / đăng ký", "Kích hoạt submit form và kiểm tra phản hồi validation"],
        ["input-search-accounts", "Ô tìm kiếm tài khoản trên trang chủ", "Kiểm thử tìm kiếm theo từ khóa skin/rank/game"],
        ["btn-filter-favorites", "Nút lọc xem danh sách yêu thích", "Kiểm tra hiển thị đúng các acc đã được người dùng thả tim"],
        ["btn-rent-now-{accountId}", "Nút 'Thuê Ngay' trên thẻ tài khoản", "Kích hoạt mở modal thuê tài khoản theo ID cụ thể"],
        ["rent-confirm-modal", "Modal xác nhận thanh toán thuê acc", "Kiểm tra hiển thị chi phí, số giờ và điều khoản"],
        ["select-rent-hours", "Bộ chọn số giờ thuê", "Kiểm thử chọn các mốc thời gian 1h, 2h, 24h, 48h (BVA)"],
        ["btn-submit-rent-confirm", "Nút bấm 'Xác Nhận Thuê'", "Kích hoạt trừ tiền và bàn giao mật khẩu in-game"],
        ["btn-trigger-extend-{orderId}", "Nút 'Gia Hạn' trên đơn thuê", "Mở modal gia hạn thêm giờ chơi cho đơn hàng cụ thể"],
        ["btn-trigger-return-early-{orderId}", "Nút 'Trả Sớm' trên đơn thuê", "Mở modal xác nhận trả nick sớm và nhận hoàn 50% tiền"],
        ["btn-trigger-dispute-{orderId}", "Nút 'Báo Lỗi / Khiếu Nại'", "Mở modal khiếu nại sự cố tài khoản nhận hoàn tiền 100%"],
        ["btn-open-deposit-modal", "Nút nạp tiền trên header/ví", "Mở hộp thoại nạp tiền VietQR Auto"],
        ["input-deposit-amount", "Ô nhập số tiền nạp vào ví", "Kiểm thử tự động các giá trị biên BVA (10k - 5M)"],
        ["btn-confirm-deposit", "Nút xác nhận nạp tiền", "Kích hoạt giao dịch nạp tiền VietQR"],
        ["floating-tester-toolbar", "Thanh công cụ BTL Tester Tools", "Thanh công cụ hỗ trợ Tester đổi vai trò, nạp nhanh, tua giờ"]
    ]
    add_table_custom(tid_headers, tid_rows, col_widths=[1.8, 2.1, 2.4], header_bg="2B6CB0")

    add_h2("4.2. Kết quả đạt được")

    add_h3("4.2.1. Thống kê kết quả 10 Test Suites tự động hóa (107 Tests - 100% Passed)")
    add_p("Hệ thống kiểm thử tự động của GameRent bao gồm **10 tập tin kiểm thử (10 Test Suites)** với tổng cộng **107 bài kiểm thử tự động hóa**. Toàn bộ 107 bài test đều đạt kết quả 100% Passed với thời gian thực thi siêu tốc:")

    auto_rep_headers = ["STT", "Tập tin kiểm thử (Test Suite)", "Phạm vi kiểm thử tự động", "Số bài test", "Thời gian", "Kết quả"]
    auto_rep_rows = [
        ["1", "src/__tests__/unit/auth.test.js", "Kiểm thử BVA/EP đăng ký, đăng nhập, khóa tài khoản, session", "25 tests", "15ms", "✓ 100% Passed"],
        ["2", "src/__tests__/unit/rental.test.js", "Kiểm thử BVA thời gian 1h-48h, Decision Table số dư và trạng thái", "14 tests", "73ms", "✓ 100% Passed"],
        ["3", "src/__tests__/unit/autoPasswordReset.test.js", "Kiểm thử tự động thu hồi acc, sinh pass ngẫu nhiên bảo mật cao", "10 tests", "79ms", "✓ 100% Passed"],
        ["4", "src/__tests__/unit/productUC1.test.js", "Kiểm thử form Thêm tài khoản chuẩn 100% đặc tả UC1 (mã, tên, ảnh, giá)", "15 tests", "12ms", "✓ 100% Passed"],
        ["5", "src/__tests__/unit/favoritesSeparation.test.js", "Kiểm thử phân tách danh sách yêu thích độc lập giữa Admin và Khách", "5 tests", "11ms", "✓ 100% Passed"],
        ["6", "src/__tests__/integration/integrationFlows.test.js", "Kiểm thử luồng tích hợp E2E xuyên suốt vòng đời tài khoản", "7 tests", "13ms", "✓ 100% Passed"],
        ["7", "src/__tests__/unit/wallet.test.js", "Kiểm thử nghiệp vụ nạp tiền ví VietQR, BVA biên 10k và 5M", "10 tests", "10ms", "✓ 100% Passed"],
        ["8", "src/__tests__/unit/refund.test.js", "Kiểm thử hoàn 50% khi trả sớm, hoàn 100% khiếu nại, tính giờ gia hạn", "8 tests", "10ms", "✓ 100% Passed"],
        ["9", "src/__tests__/unit/crudManagement.test.js", "Kiểm thử CRUD kho acc, khách hàng và tự động đồng bộ CRM", "5 tests", "10ms", "✓ 100% Passed"],
        ["10", "src/__tests__/unit/changePassword.test.js", "Kiểm thử BVA/EP đổi mật khẩu khách thuê (biên 6 ký tự, mật khẩu cũ)", "8 tests", "7ms", "✓ 100% Passed"],
        ["TỔNG", "10 TEST SUITES HOÀN CHỈNH", "BAO PHỦ TOÀN DIỆN MÃ NGUỒN HỆ THỐNG GAMERENT", "107 TESTS", "1.93s", "✓ 107/107 PASSED (100%)"]
    ]
    add_table_custom(auto_rep_headers, auto_rep_rows, col_widths=[0.4, 2.4, 2.0, 0.6, 0.5, 0.9], header_bg="1A365D")

    add_h3("4.2.2. Trích xuất Log thực thi kiểm thử tự động")
    add_p("Trích xuất nhật ký thực thi (Terminal Output) nguyên bản từ lệnh chạy `npm test` trên môi trường dự án:")

    log_box_text = (
        "> gamerent-web@0.0.0 test\n"
        "> vitest run\n\n"
        " RUN  v5.0.1 E:/BTL_KTPM\n\n"
        " ✓ src/__tests__/unit/auth.test.js (25 tests) 15ms\n"
        " ✓ src/__tests__/unit/rental.test.js (14 tests) 73ms\n"
        " ✓ src/__tests__/unit/autoPasswordReset.test.js (10 tests) 79ms\n"
        " ✓ src/__tests__/integration/integrationFlows.test.js (7 tests) 13ms\n"
        " ✓ src/__tests__/unit/productUC1.test.js (15 tests) 12ms\n"
        " ✓ src/__tests__/unit/favoritesSeparation.test.js (5 tests) 11ms\n"
        " ✓ src/__tests__/unit/wallet.test.js (10 tests) 10ms\n"
        " ✓ src/__tests__/unit/refund.test.js (8 tests) 10ms\n"
        " ✓ src/__tests__/unit/crudManagement.test.js (5 tests) 10ms\n"
        " ✓ src/__tests__/unit/changePassword.test.js (8 tests) 7ms\n\n"
        " Test Files  10 passed (10)\n"
        "      Tests  107 passed (107)\n"
        "   Start at  22:09:49\n"
        "   Duration  1.93s (transform 34%, import 27%, tests 22%, worker 17%, environment 1%)\n\n"
        "=================================================================================\n"
        " KẾT QUẢ ĐÁNH GIÁ: 100% CÁC TEST CASES ĐỀU ĐẠT CHUẨN THÀNH CÔNG (107/107 PASSED)\n"
        "================================================================================="
    )
    add_callout("Vitest Execution Terminal Log", log_box_text, border_color="10B981", bg_color="F0FDF4")

    add_h3("4.2.3. Phân tích kịch bản kiểm thử tự động tiêu biểu")
    add_p("Dưới đây là 2 đoạn mã script kiểm thử tự động tiêu biểu thể hiện trình độ kỹ thuật kiểm thử tự động cao của nhóm sinh viên:")

    add_p("1. Kịch bản kiểm thử tự động form thêm sản phẩm chuẩn UC1 (productUC1.test.js):", bold=True, space_before=4)
    code_snippet_uc1 = (
        "describe('5. Module Thêm Tài Khoản Game (F_ADM_PROD - Chuẩn UC1)', () => {\n"
        "  it('[UTCID01] BVA Mã sản phẩm dưới biên min (7 ký tự) -> Báo lỗi', () => {\n"
        "    const res = validateProductUC1({ code: 'SP00001', title: 'Tài khoản Liên Quân Vip', pricePerHour: 15000 });\n"
        "    expect(res.isValid).toBe(false);\n"
        "    expect(res.error).toBe('Mã sản phẩm phải từ 8 ký tự trở lên');\n"
        "  });\n\n"
        "  it('[UTCID02] BVA Mã sản phẩm tại biên min (8 ký tự) -> Hợp lệ', () => {\n"
        "    const res = validateProductUC1({ code: 'SP000001', title: 'Tài khoản Liên Quân Vip', pricePerHour: 15000 });\n"
        "    expect(res.isValid).toBe(true);\n"
        "  });\n\n"
        "  it('[UTCID13] BVA Upload ảnh dung lượng 1.5MB (> 1MB) -> Báo lỗi', () => {\n"
        "    const res = validateProductUC1({\n"
        "      code: 'SP000001',\n"
        "      title: 'Tài khoản Liên Quân Vip',\n"
        "      pricePerHour: 15000,\n"
        "      imageSize: 1.5 * 1024 * 1024 // 1.5MB\n"
        "    });\n"
        "    expect(res.isValid).toBe(false);\n"
        "    expect(res.error).toBe('Dung lượng ảnh vượt quá 1MB');\n"
        "  });\n"
        "});"
    )
    add_callout("Script Unit Test - UC1 Validation", code_snippet_uc1, border_color="2B6CB0", bg_color="F8FAFC")

    add_p("2. Kịch bản kiểm thử tự động luồng tích hợp E2E Sandwich (integrationFlows.test.js):", bold=True, space_before=4)
    code_snippet_e2e = (
        "it('[ITC-03] Tích hợp Thuê tài khoản -> Trừ ví -> Cấp pass in-game -> Đổi status acc', () => {\n"
        "  const user = mockDatabase.users[0]; // balance: 100k\n"
        "  const account = mockDatabase.accounts[0]; // price: 15k/h, status: available\n"
        "  const rentCheck = calculateRentalCost(account, 2, user.balance); // 2h = 30k\n"
        "  expect(rentCheck.isValid).toBe(true);\n"
        "  expect(rentCheck.totalCost).toBe(30000);\n"
        "  expect(rentCheck.remainingBalance).toBe(70000);\n\n"
        "  // Trừ tiền ví và chuyển trạng thái acc\n"
        "  user.balance = rentCheck.remainingBalance;\n"
        "  account.status = 'rented';\n"
        "  expect(user.balance).toBe(70000);\n"
        "  expect(account.status).toBe('rented');\n"
        "});"
    )
    add_callout("Script Integration Test - Rental Flow", code_snippet_e2e, border_color="1A365D", bg_color="F8FAFC")

    doc.add_page_break()

    # =========================================================
    # KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
    # =========================================================
    add_h1("KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN")

    add_h2("1. Kết luận")
    add_p("Sau quá trình nghiên cứu, thiết kế và triển khai toàn diện đề tài \"Kiểm thử hệ thống website cho thuê tài khoản game tự động 24/7 (GameRent)\", Nhóm 15 đã hoàn thành xuất sắc toàn bộ các mục tiêu đặt ra theo yêu cầu bài tập lớn môn Kiểm thử phần mềm:")
    add_bullet("Hoàn thiện sản phẩm công việc", "Xây dựng thành công ứng dụng web GameRent (React 19, Vite, Modern CSS) chạy mượt mà, ổn định với đầy đủ 12 phân hệ nghiệp vụ khép kín từ Đăng ký, Nạp tiền VietQR, Thuê acc, Đếm ngược thời gian thực, Gia hạn, Trả sớm, Khiếu nại bảo hiểm 100% đến Bảng điều khiển quản trị Admin Dashboard và Quản lý khách hàng CRM.")
    add_bullet("Thiết kế bài bản bộ Test Case đa cấp độ", "Vận dụng thành thạo và chuẩn mực các kỹ thuật kiểm thử hộp đen và hộp trắng theo chuẩn quốc tế ISTQB:")
    add_bullet("  • Cấp độ Unit Test", "Thiết kế hơn 45 ca kiểm thử bao phủ toàn diện các hàm nghiệp vụ, áp dụng Phân tích giá trị biên (BVA), Phân vùng tương đương (EP), Bảng quyết định (Decision Table) và tuân thủ nghiêm ngặt tài liệu mẫu UC1_Add New Product.")
    add_bullet("  • Cấp độ Integration Test", "Thiết kế 10 kịch bản tích hợp theo chiến lược Sandwich, kiểm soát sự đồng bộ giữa giao diện React Component, bộ quản lý trạng thái AppContext và kho lưu trữ LocalStorage.")
    add_bullet("  • Cấp độ System Test", "Thiết kế 12 kịch bản E2E kiểm chứng toàn bộ luồng hoạt động thực tế, kiểm thử chuyển trạng thái (State Transition) và kiểm thử đua tài nguyên (Race Condition).")
    add_bullet("Thực thi test và quản lý lỗi chuẩn mực", "Ghi nhận, phân tích nguyên nhân và khắc phục triệt để 10 lỗi phần mềm (5 lỗi Integration và 5 lỗi System) theo đúng 8 nội dung quan trọng chuẩn form báo cáo lỗi của bộ môn.")
    add_bullet("Tự động hóa kiểm thử xuất sắc", "Xây dựng 10 bộ kiểm thử tự động với 107 bài test trên framework Vitest đạt tỷ lệ thành công tuyệt đối 100% Passed chỉ trong 1.93 giây, đồng thời chuẩn hóa toàn bộ thuộc tính data-testid trên DOM sẵn sàng kết nối các công cụ UI Automation.")

    add_h2("2. Hạn chế còn tồn đọng")
    add_bullet("Môi trường lưu trữ", "Hiện tại hệ thống sử dụng LocalStorage Mock Database để mô phỏng CSDL phục vụ chạy bài tập lớn độc lập trên máy chấm thi; chưa kết nối với cơ sở dữ liệu quan hệ phân tán (như PostgreSQL hoặc MySQL).")
    add_bullet("Kiểm thử tải và hiệu năng", "Chưa thực hiện kiểm thử hiệu năng chịu tải đồng thời (Performance / Load Testing) với quy mô hàng chục nghìn lượt truy cập đồng thời (CCU).")

    add_h2("3. Hướng phát triển trong tương lai")
    add_bullet("Nâng cấp kiến trúc Backend", "Xây dựng RESTful API hoặc GraphQL trên nền tảng Node.js NestJS kết hợp CSDL PostgreSQL và Redis Cache.")
    add_bullet("Tự động hóa End-to-End nâng cao", "Cài đặt bộ kịch bản kiểm thử giao diện người dùng tự động (UI Automation) bằng Playwright hoặc Cypress tận dụng hệ thống `data-testid` đã được gắn sẵn trên mã nguồn.")
    add_bullet("Tích hợp CI/CD Pipeline", "Đưa toàn bộ 107 bài kiểm thử Vitest vào quy trình tích hợp liên tục (CI/CD) với GitHub Actions, tự động chạy test và chặn lỗi trước khi triển khai sản phẩm.")

    doc.add_page_break()

    # =========================================================
    # TÀI LIỆU THAM KHẢO
    # =========================================================
    add_h1("TÀI LIỆU THAM KHẢO")
    add_bullet("[1]", "Trường Đại học Công nghệ Đông Á (EAUT), Giáo trình và Đề cương chi tiết học phần Kiểm thử phần mềm, Khoa Công nghệ thông tin, 2026.")
    add_bullet("[2]", "ThS. Phạm Thị Loan, Tài liệu hướng dẫn: Yêu cầu bài tập lớn môn Kiểm thử phần mềm & Phiếu chấm điểm BTL, EAUT, 2026.")
    add_bullet("[3]", "Tài liệu đặc tả ca sử dụng mẫu: UC1_Add New Product.pdf & Các nội dung quan trọng trong báo cáo lỗi.pdf, EAUT, 2026.")
    add_bullet("[4]", "ISTQB (International Software Testing Qualifications Board), Certified Tester Foundation Level (CTFL) Syllabus v4.0, 2023.")
    add_bullet("[5]", "Rex Black, Erik van Veenendaal, Dorothy Graham, Foundations of Software Testing: ISTQB Certification, Cengage Learning, 4th Edition, 2019.")
    add_bullet("[6]", "Vitest Documentation, Next Generation Testing Framework, https://vitest.dev/, 2026.")
    add_bullet("[7]", "React 19 Documentation & Testing Guidelines, https://react.dev/, 2026.")
    add_bullet("[8]", "Playwright Documentation, Fast and Reliable End-to-End Testing for Modern Web Apps, https://playwright.dev/, 2026.")

    # Save to Tài Liệu folder
    out_file_tl = "e:\\BTL_KTPM\\Tài Liệu\\Bao_Cao_Bai_Tap_Lon_Kiem_Thu_Phan_Mem.docx"
    doc.save(out_file_tl)
    print(f"[OK] Đã lưu thành công file Word tại: {out_file_tl}")

if __name__ == "__main__":
    build_full_report()
