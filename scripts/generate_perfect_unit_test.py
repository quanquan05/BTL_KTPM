# -*- coding: utf-8 -*-
"""
Script to generate the PERFECT 6-sheet Unit Test Case Excel workbook matching the teacher's template:
Sheet 1: Cover
Sheet 2: FunctionList
Sheet 3: Test Report (with summary table, coverage metrics, and 2 Pie Charts)
Sheet 4: findMax (exact matrix with Condition, Confirm, Result, and 'O' markers)
Sheet 5: Function2 (exact matrix with 15 test cases, Condition, Confirm, Result)
Sheet 6: Code (contains clean source code of the tested classes and embedded code image)
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import PieChart, Reference
from openpyxl.chart.label import DataLabelList
from openpyxl.drawing.image import Image

FONT_NAME = "Tahoma"
CODE_FONT = "Consolas"

font_title = Font(name=FONT_NAME, size=15, bold=True, color="000000")
font_sub_title = Font(name=FONT_NAME, size=11, bold=True, color="002060")
font_tbl_hdr = Font(name=FONT_NAME, size=9.5, bold=True, color="FFFFFF")
font_bold = Font(name=FONT_NAME, size=9.5, bold=True, color="000000")
font_normal = Font(name=FONT_NAME, size=9, bold=False, color="000000")
font_italic = Font(name=FONT_NAME, size=8.5, italic=True, color="595959")
font_code = Font(name=CODE_FONT, size=9.5, color="1E293B")
font_code_kw = Font(name=CODE_FONT, size=9.5, bold=True, color="0000FF")
font_code_cmt = Font(name=CODE_FONT, size=9, italic=True, color="008000")

font_pass = Font(name=FONT_NAME, size=9.5, bold=True, color="006100")
font_fail = Font(name=FONT_NAME, size=9.5, bold=True, color="9C0006")
font_marker_o = Font(name=FONT_NAME, size=10, bold=True, color="002060")

fill_navy = PatternFill(start_color="002060", end_color="002060", fill_type="solid")
fill_blue = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
fill_accent = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
fill_light_gray = PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")
fill_white = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
fill_pass_cell = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
fill_fail_cell = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
fill_yellow_highlight = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")

thin_side = Side(border_style="thin", color="000000")
dashed_side = Side(border_style="dashed", color="7F7F7F")
double_bottom_side = Side(border_style="double", color="000000")

border_all_thin = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)
border_dashed = Border(left=dashed_side, right=dashed_side, top=dashed_side, bottom=dashed_side)
border_subtotal = Border(top=thin_side, bottom=double_bottom_side, left=thin_side, right=thin_side)

align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
align_right = Alignment(horizontal="right", vertical="center", wrap_text=True)
align_vertical = Alignment(horizontal="center", vertical="center", textRotation=90)

def apply_box_border(ws, start_row, start_col, end_row, end_col, border_style="medium"):
    side = Side(border_style=border_style, color="000000")
    for r in range(start_row, end_row + 1):
        for c in range(start_col, end_col + 1):
            cell = ws.cell(row=r, column=c)
            top = side if r == start_row else cell.border.top
            bottom = side if r == end_row else cell.border.bottom
            left = side if c == start_col else cell.border.left
            right = side if c == end_col else cell.border.right
            cell.border = Border(top=top, bottom=bottom, left=left, right=right)

def auto_fit(ws, col_widths=None):
    ws.views.sheetView[0].showGridLines = True
    if col_widths:
        for c_letter, w in col_widths.items():
            ws.column_dimensions[c_letter].width = w

def create_6sheet_unit_test_workbook():
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # remove default sheet

    # ==============================================================================
    # SHEET 1: Cover
    # ==============================================================================
    ws_cover = wb.create_sheet(title="Cover")
    auto_fit(ws_cover, {"A": 16, "B": 26, "C": 14, "D": 22, "E": 28, "F": 42})

    # Title Box (A2:F3)
    ws_cover.merge_cells("A2:F3")
    c_title = ws_cover["A2"]
    c_title.value = "UNIT TEST CASE"
    c_title.font = Font(name=FONT_NAME, size=16, bold=True)
    c_title.alignment = align_center
    apply_box_border(ws_cover, 2, 1, 3, 6, "medium")

    # Meta table
    meta_rows = [
        (4, "Project Name", "Thực hành unit (GameRent)", "Creator", "Lê Minh Quân (Nhóm 16)"),
        (5, "Project Code", "UT", "Reviewer/Approver", "ThS. Phạm Thị Loan"),
        (6, "Document Code", "UT_TestCase_v1.0", "Issue Date", "20/03/2024"),
        (7, "", "", "Version", "1.0")
    ]
    for r, k1, v1, k2, v2 in meta_rows:
        if k1:
            ws_cover.cell(row=r, column=1, value=k1).font = font_bold
            ws_cover.cell(row=r, column=1).border = border_all_thin
            ws_cover.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
            c = ws_cover.cell(row=r, column=2, value=v1)
            c.font = font_normal
            ws_cover.cell(row=r, column=2).border = border_all_thin
            ws_cover.cell(row=r, column=3).border = border_all_thin
        else:
            ws_cover.cell(row=r, column=1).border = border_all_thin
            ws_cover.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
            ws_cover.cell(row=r, column=2).border = border_all_thin
            ws_cover.cell(row=r, column=3).border = border_all_thin

        if k2:
            ws_cover.cell(row=r, column=4, value=k2).font = font_bold
            ws_cover.cell(row=r, column=4).border = border_all_thin
            ws_cover.merge_cells(start_row=r, start_column=5, end_row=r, end_column=6)
            c = ws_cover.cell(row=r, column=5, value=v2)
            c.font = font_normal
            ws_cover.cell(row=r, column=5).border = border_all_thin
            ws_cover.cell(row=r, column=6).border = border_all_thin

    # Record of change
    ws_cover.cell(row=9, column=1, value="Record of change").font = font_bold
    headers_roc = ["Effective Date", "Version", "Change Item", "*A,D,M", "Change description", "Reference"]
    for ci, h in enumerate(headers_roc, start=1):
        cell = ws_cover.cell(row=10, column=ci, value=h)
        cell.font = font_tbl_hdr
        cell.fill = fill_navy
        cell.alignment = align_center
        cell.border = border_all_thin

    # Row 11 data
    roc_data = [
        "<Date when these changes are effective>", "1.0", "Tạo tài liệu và thiết kế ca kiểm thử", "A",
        "Thiết kế trọn bộ Unit Test Case theo chuẩn ma trận kiểm thử phần mềm", "<List of documents which are refered in this version.>"
    ]
    for ci, val in enumerate(roc_data, start=1):
        cell = ws_cover.cell(row=11, column=ci, value=val)
        cell.font = font_normal
        cell.alignment = align_center if ci in [1, 2, 4] else align_left
        cell.border = border_all_thin

    # Empty dashed rows
    for r in range(12, 18):
        for ci in range(1, 7):
            cell = ws_cover.cell(row=r, column=ci, value="")
            cell.border = border_dashed

    # ==============================================================================
    # SHEET 2: FunctionList
    # ==============================================================================
    ws_fl = wb.create_sheet(title="FunctionList")
    auto_fit(ws_fl, {"A": 6, "B": 24, "C": 20, "D": 22, "E": 22, "F": 18, "G": 42, "H": 30})

    ws_fl.merge_cells("A2:H2")
    c_fl_title = ws_fl["A2"]
    c_fl_title.value = "UNIT TEST CASE LIST"
    c_fl_title.font = font_title
    c_fl_title.alignment = align_center

    fl_meta = [
        (4, "Project Name", "Thực hành unit (GameRent)"),
        (5, "Project Code", "UT"),
        (6, "Normal number of Test cases/KLOC", "100"),
        (7, "Test Environment Setup Description", "<List enviroment requires in this system\n1. Server\n2. Database\n3. Web Browser\n...>")
    ]
    for r, k, v in fl_meta:
        ws_fl.cell(row=r, column=1, value=k).font = font_bold
        ws_fl.cell(row=r, column=1).border = border_all_thin
        ws_fl.merge_cells(start_row=r, start_column=2, end_row=r, end_column=8)
        c = ws_fl.cell(row=r, column=2, value=v)
        c.font = font_normal
        c.alignment = align_left
        for ci in range(2, 9):
            ws_fl.cell(row=r, column=ci).border = border_all_thin

    headers_fl = ["No", "Requirement Name", "Class Name", "Function Name", "Function Code(Optional)", "Sheet Name", "Description", "Pre-Condition"]
    for ci, h in enumerate(headers_fl, start=1):
        cell = ws_fl.cell(row=10, column=ci, value=h)
        cell.font = font_tbl_hdr
        cell.fill = fill_navy
        cell.alignment = align_center
        cell.border = border_all_thin

    fl_data = [
        ("1", "ExampleBranch", "ExampleBranch", "findMax", "f_fm", "findMax", "Tìm giá trị lớn nhất trong mảng số nguyên arr (BVA, EP, Exception handling)", "Mảng arr hợp lệ hoặc null/empty"),
        ("3", "Class2", "Class2", "Function B", "Function2", "Function2", "Xác thực tham số đầu vào input1, input2 và kết nối server", "Can connect with server")
    ]
    for idx, row in enumerate(fl_data, start=11):
        for ci, val in enumerate(row, start=1):
            cell = ws_fl.cell(row=idx, column=ci, value=val)
            cell.font = font_normal
            cell.alignment = align_center if ci in [1, 5, 6] else align_left
            cell.border = border_all_thin
            if ci == 6:
                cell.font = Font(name=FONT_NAME, size=9, color="0563C1", underline="single")

    for r in range(13, 23):
        for ci in range(1, 9):
            ws_fl.cell(row=r, column=ci).border = border_dashed

    # ==============================================================================
    # SHEET 3: Test Report
    # ==============================================================================
    ws_tr = wb.create_sheet(title="Test Report")
    auto_fit(ws_tr, {"A": 6, "B": 20, "C": 12, "D": 12, "E": 12, "F": 8, "G": 8, "H": 8, "I": 18, "J": 4, "K": 4, "L": 14, "M": 10})

    ws_tr.merge_cells("A2:I2")
    c_tr_title = ws_tr["A2"]
    c_tr_title.value = "UNIT TEST REPORT"
    c_tr_title.font = font_title
    c_tr_title.alignment = align_center

    tr_meta = [
        (4, "Project Name", "Thực hành unit", "Creator", "Lê Minh Quân (Nhóm 16)"),
        (5, "Project Code", "UT", "Reviewer/Approver", "ThS. Phạm Thị Loan"),
        (6, "Document Code", "UT_Test Report_vx.x", "Issue Date", "<Date when this test report is created>"),
        (7, "Notes", "<List modules included in this release> ex: Release 1 includes 2 modules: Module1 and Module2", "", "")
    ]
    for r, k1, v1, k2, v2 in tr_meta:
        ws_tr.cell(row=r, column=1, value=k1).font = font_bold
        ws_tr.cell(row=r, column=1).border = border_all_thin
        if k2:
            ws_tr.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
            ws_tr.cell(row=r, column=2, value=v1).font = font_normal
            ws_tr.cell(row=r, column=2).border = border_all_thin
            ws_tr.cell(row=r, column=3).border = border_all_thin

            ws_tr.cell(row=r, column=4, value=k2).font = font_bold
            ws_tr.cell(row=r, column=4).border = border_all_thin
            ws_tr.merge_cells(start_row=r, start_column=5, end_row=r, end_column=9)
            ws_tr.cell(row=r, column=5, value=v2).font = font_normal
            for ci in range(5, 10): ws_tr.cell(row=r, column=ci).border = border_all_thin
        else:
            ws_tr.merge_cells(start_row=r, start_column=2, end_row=r, end_column=9)
            ws_tr.cell(row=r, column=2, value=v1).font = font_normal
            for ci in range(2, 10): ws_tr.cell(row=r, column=ci).border = border_all_thin

    headers_tr = ["No", "Function code", "Passed", "Failed", "Untested", "N", "A", "B", "Total Test Cases"]
    for ci, h in enumerate(headers_tr, start=1):
        cell = ws_tr.cell(row=10, column=ci, value=h)
        cell.font = font_tbl_hdr
        cell.fill = fill_navy
        cell.alignment = align_center
        cell.border = border_all_thin

    tr_data = [
        ("1", "Function1", 7, 0, 0, 4, 2, 1, "=SUM(C11:E11)"),
        ("2", "Function2", 12, 2, 1, 12, 2, 1, "=SUM(C12:E12)"),
        ("3", "Function3", 12, 2, 1, 12, 2, 1, "=SUM(C13:E13)")
    ]
    for idx, row in enumerate(tr_data, start=11):
        for ci, val in enumerate(row, start=1):
            cell = ws_tr.cell(row=idx, column=ci, value=val)
            cell.font = font_normal
            cell.alignment = align_center
            cell.border = border_all_thin

    for ci in range(1, 10):
        ws_tr.cell(row=14, column=ci).border = border_dashed
        ws_tr.cell(row=15, column=ci).border = border_dashed

    # Sub total
    sub_r = 16
    ws_tr.cell(row=sub_r, column=1, value="").border = border_subtotal
    ws_tr.cell(row=sub_r, column=2, value="Sub total").font = font_bold
    ws_tr.cell(row=sub_r, column=2).alignment = align_left
    ws_tr.cell(row=sub_r, column=2).border = border_subtotal

    for ci, formula in enumerate([
        "=SUM(C11:C15)", "=SUM(D11:D15)", "=SUM(E11:E15)",
        "=SUM(F11:F15)", "=SUM(G11:G15)", "=SUM(H11:H15)", "=SUM(I11:I15)"
    ], start=3):
        cell = ws_tr.cell(row=sub_r, column=ci, value=formula)
        cell.font = font_bold
        cell.alignment = align_center
        cell.border = border_subtotal

    # Metrics
    metrics_list = [
        (18, "Test coverage", "=(C16+D16)/I16"),
        (19, "Test successful coverage", "=C16/I16"),
        (20, "Normal case", "=F16/I16"),
        (21, "Abnormal case", "=G16/I16"),
        (22, "Boundary case", "=H16/I16")
    ]
    for r, label, form in metrics_list:
        ws_tr.merge_cells(f"B{r}:C{r}")
        ws_tr.cell(row=r, column=2, value=label).font = font_bold
        ws_tr.cell(row=r, column=2).alignment = align_left
        ws_tr.cell(row=r, column=4, value=form).font = font_bold
        ws_tr.cell(row=r, column=4).alignment = align_right
        ws_tr.cell(row=r, column=4).number_format = "0.00 %"

    # Reference data for Charts (in column L/M)
    ws_tr["L2"] = "Status"
    ws_tr["M2"] = "Count"
    ws_tr["L3"] = "Passed"
    ws_tr["M3"] = "=C16"
    ws_tr["L4"] = "Failed"
    ws_tr["M4"] = "=D16"
    ws_tr["L5"] = "Untested"
    ws_tr["M5"] = "=E16"

    ws_tr["L8"] = "Type"
    ws_tr["M8"] = "Count"
    ws_tr["L9"] = "N"
    ws_tr["M9"] = "=F16"
    ws_tr["L10"] = "A"
    ws_tr["M10"] = "=G16"
    ws_tr["L11"] = "B"
    ws_tr["M11"] = "=H16"

    # Chart 1: Passed Percent
    pie1 = PieChart()
    pie1.title = "Passed Percent"
    labels1 = Reference(ws_tr, min_col=12, min_row=3, max_row=5)
    data1 = Reference(ws_tr, min_col=13, min_row=2, max_row=5)
    pie1.add_data(data1, titles_from_data=True)
    pie1.set_categories(labels1)
    pie1.dataLabels = DataLabelList()
    pie1.dataLabels.showPercent = True
    pie1.dataLabels.showVal = False
    pie1.width = 13.5
    pie1.height = 8.5
    ws_tr.add_chart(pie1, "B25")

    # Chart 2: Task Type
    pie2 = PieChart()
    pie2.title = "Task Type"
    labels2 = Reference(ws_tr, min_col=12, min_row=9, max_row=11)
    data2 = Reference(ws_tr, min_col=13, min_row=8, max_row=11)
    pie2.add_data(data2, titles_from_data=True)
    pie2.set_categories(labels2)
    pie2.dataLabels = DataLabelList()
    pie2.dataLabels.showPercent = True
    pie2.dataLabels.showVal = False
    pie2.width = 13.5
    pie2.height = 8.5
    ws_tr.add_chart(pie2, "F25")

    # ==============================================================================
    # SHEET 4: findMax
    # ==============================================================================
    ws_fm = wb.create_sheet(title="findMax")
    auto_fit(ws_fm, {
        "A": 12, "B": 28, "C": 10, "D": 10, "E": 10, "F": 10, "G": 10, "H": 10, "I": 10,
        "J": 8, "K": 8, "L": 8, "M": 8, "N": 8, "O": 8, "P": 8, "Q": 8
    })

    # Header Function Block
    ws_fm.cell(row=2, column=1, value="Function Code").font = font_bold
    ws_fm.cell(row=2, column=1).border = border_all_thin
    ws_fm.merge_cells("B2:C2")
    ws_fm.cell(row=2, column=2, value="f_fm").font = font_normal
    ws_fm.cell(row=2, column=2).border = border_all_thin
    ws_fm.cell(row=2, column=3).border = border_all_thin

    ws_fm.cell(row=2, column=4, value="Function Name").font = font_bold
    ws_fm.cell(row=2, column=4).border = border_all_thin
    ws_fm.merge_cells("E2:I2")
    ws_fm.cell(row=2, column=5, value="findMax").font = font_normal
    for ci in range(5, 10): ws_fm.cell(row=2, column=ci).border = border_all_thin

    ws_fm.cell(row=3, column=1, value="Created By").font = font_bold
    ws_fm.cell(row=3, column=1).border = border_all_thin
    ws_fm.merge_cells("B3:C3")
    ws_fm.cell(row=3, column=2, value="LinhDTT").font = font_normal
    ws_fm.cell(row=3, column=2).border = border_all_thin
    ws_fm.cell(row=3, column=3).border = border_all_thin

    ws_fm.cell(row=3, column=4, value="Executed By").font = font_bold
    ws_fm.cell(row=3, column=4).border = border_all_thin
    ws_fm.merge_cells("E3:I3")
    ws_fm.cell(row=3, column=5, value="LinhDTT").font = font_normal
    for ci in range(5, 10): ws_fm.cell(row=3, column=ci).border = border_all_thin

    ws_fm.cell(row=4, column=1, value="Lines of code").font = font_bold
    ws_fm.cell(row=4, column=1).border = border_all_thin
    ws_fm.merge_cells("B4:C4")
    ws_fm.cell(row=4, column=2, value="8").font = font_normal
    ws_fm.cell(row=4, column=2).border = border_all_thin
    ws_fm.cell(row=4, column=3).border = border_all_thin

    ws_fm.cell(row=5, column=1, value="Test requirement").font = font_bold
    ws_fm.cell(row=5, column=1).border = border_all_thin
    ws_fm.merge_cells("B5:I5")
    ws_fm.cell(row=5, column=2, value="<tham chiếu đến tài liệu viết test case>").font = font_normal
    for ci in range(2, 10): ws_fm.cell(row=5, column=ci).border = border_all_thin

    # Stats box (Row 6-7)
    fm_stats_h = [("Passed", 1), ("Failed", 3), ("Untested", 5), ("N/A/B", 8), ("Total Test Cases", 10)]
    fm_stats_v = [("7", 1), ("0", 3), ("0", 5), ("4 / 2 / 1", 8), ("7", 10)]
    
    ws_fm.cell(row=6, column=1, value="Passed").font = font_bold
    ws_fm.cell(row=6, column=1).border = border_all_thin
    ws_fm.cell(row=6, column=1).alignment = align_center
    ws_fm.cell(row=7, column=1, value="7").font = font_normal
    ws_fm.cell(row=7, column=1).border = border_all_thin
    ws_fm.cell(row=7, column=1).alignment = align_center

    ws_fm.cell(row=6, column=3, value="Failed").font = font_bold
    ws_fm.cell(row=6, column=3).border = border_all_thin
    ws_fm.cell(row=6, column=3).alignment = align_center
    ws_fm.cell(row=7, column=3, value="0").font = font_normal
    ws_fm.cell(row=7, column=3).border = border_all_thin
    ws_fm.cell(row=7, column=3).alignment = align_center

    ws_fm.cell(row=6, column=5, value="Untested").font = font_bold
    ws_fm.cell(row=6, column=5).border = border_all_thin
    ws_fm.cell(row=6, column=5).alignment = align_center
    ws_fm.cell(row=7, column=5, value="0").font = font_normal
    ws_fm.cell(row=7, column=5).border = border_all_thin
    ws_fm.cell(row=7, column=5).alignment = align_center

    ws_fm.merge_cells("G6:H6")
    ws_fm.cell(row=6, column=7, value="N/A/B").font = font_bold
    ws_fm.cell(row=6, column=7).alignment = align_center
    ws_fm.cell(row=6, column=7).border = border_all_thin
    ws_fm.cell(row=6, column=8).border = border_all_thin

    ws_fm.merge_cells("G7:H7")
    ws_fm.cell(row=7, column=7, value="4 / 2 / 1").font = font_normal
    ws_fm.cell(row=7, column=7).alignment = align_center
    ws_fm.cell(row=7, column=7).border = border_all_thin
    ws_fm.cell(row=7, column=8).border = border_all_thin

    ws_fm.cell(row=6, column=9, value="Total Test Cases").font = font_bold
    ws_fm.cell(row=6, column=9).border = border_all_thin
    ws_fm.cell(row=6, column=9).alignment = align_center
    ws_fm.cell(row=7, column=9, value="7").font = font_normal
    ws_fm.cell(row=7, column=9).border = border_all_thin
    ws_fm.cell(row=7, column=9).alignment = align_center

    # Matrix Table Header (Row 9)
    ws_fm.cell(row=9, column=1, value="Condition").font = font_tbl_hdr
    ws_fm.cell(row=9, column=1).fill = fill_navy
    ws_fm.cell(row=9, column=1).alignment = align_center
    ws_fm.cell(row=9, column=1).border = border_all_thin

    ws_fm.cell(row=9, column=2, value="Precondition N/A").font = font_tbl_hdr
    ws_fm.cell(row=9, column=2).fill = fill_navy
    ws_fm.cell(row=9, column=2).alignment = align_center
    ws_fm.cell(row=9, column=2).border = border_all_thin

    utc_headers_7 = ["UTCID01", "UTCID02", "UTCID03", "UTCID04", "UTCID05", "UTCID06", "UTCID07"]
    for ci, tc in enumerate(utc_headers_7, start=3):
        cell = ws_fm.cell(row=9, column=ci, value=tc)
        cell.font = font_tbl_hdr
        cell.fill = fill_navy
        cell.alignment = align_center
        cell.border = border_all_thin

    # Empty grid headers beyond UTCID07
    for ci in range(10, 18):
        cell = ws_fm.cell(row=9, column=ci, value="")
        cell.fill = fill_navy
        cell.border = border_all_thin

    # Rows Definition for findMax Matrix
    # (RowIndex, Group, SubItem, [O markers across UTCID01..07], HighlightRow)
    # EXACT DATA MATCHING Unit Test Case.pdf:
    # {1,7,2} with return 7 for UTCID03!
    # {4}, {4,4,4,4}, {1,2,3,4}, {4,3,2,1} highlighted yellow!
    # Return 4 highlighted yellow!
    fm_rows = [
        (10, "Condition", "arr", ["", "", "", "", "", "", ""], False),
        (11, "Condition", "null", ["O", "", "", "", "", "", ""], False),
        (12, "Condition", "{}", ["", "O", "", "", "", "", ""], False),
        (13, "Condition", "{1,7,2}", ["", "", "O", "", "", "", ""], False),
        (14, "Condition", "{4}", ["", "", "", "O", "", "", ""], True),
        (15, "Condition", "{4,4,4,4}", ["", "", "", "", "O", "", ""], True),
        (16, "Condition", "{1,2,3,4}", ["", "", "", "", "", "O", ""], True),
        (17, "Condition", "{4,3,2,1}", ["", "", "", "", "", "", "O"], True),
        (18, "Confirm", "Return", ["", "", "", "", "", "", ""], False),
        (19, "Confirm", "7", ["", "", "O", "", "", "", ""], False),
        (20, "Confirm", "4", ["", "", "", "O", "O", "O", "O"], True),
        (21, "Confirm", "Exception", ["", "", "", "", "", "", ""], False),
        (22, "Confirm", "NullPointerException", ["O", "", "", "", "", "", ""], False),
        (23, "Confirm", "ArrayIndexOutOfBoundsException", ["", "O", "", "", "", "", ""], False),
        (24, "Confirm", "Log message", ["", "", "", "", "", "", ""], False),
        (25, "Confirm", '"Array is null"', ["O", "", "", "", "", "", ""], False),
        (26, "Confirm", '"Array is empty"', ["", "O", "", "", "", "", ""], False),
        (27, "Result", "Type(N : Normal, A : Abnormal, B : Boundary)", ["A", "A", "N", "B", "N", "N", "N"], False),
        (28, "Result", "Passed/Failed", ["P", "P", "P", "P", "P", "P", "P"], False),
        (29, "Result", "Executed Date", [""] * 7, False),
        (30, "Result", "Defect ID", [""] * 7, False)
    ]

    for r, grp, sub, vals, is_hl in fm_rows:
        ws_fm.cell(row=r, column=1, value=grp).border = border_all_thin
        ws_fm.cell(row=r, column=1).font = font_bold
        ws_fm.cell(row=r, column=1).alignment = align_center

        c_sub = ws_fm.cell(row=r, column=2, value=sub)
        c_sub.border = border_all_thin
        c_sub.font = font_bold if grp == "Result" or sub in ["arr", "Return", "Exception", "Log message"] else font_normal
        c_sub.alignment = align_left

        if is_hl:
            c_sub.fill = fill_yellow_highlight

        for ci, v in enumerate(vals, start=3):
            cell = ws_fm.cell(row=r, column=ci, value=v)
            cell.border = border_all_thin
            cell.alignment = align_center
            if v == "O":
                cell.font = font_marker_o
                cell.alignment = align_center
            elif r == 28: # Passed/Failed
                cell.font = font_pass
                cell.fill = fill_pass_cell
            elif r == 27: # Type
                cell.font = font_bold
            else:
                cell.font = font_normal

            if is_hl and v == "O":
                cell.fill = fill_yellow_highlight

        # Empty cols
        for ci in range(10, 18):
            ws_fm.cell(row=r, column=ci).border = border_all_thin

    # Merge Condition (A10:A17), Confirm (A18:A26), Result (A27:A30)
    ws_fm.merge_cells("A10:A17")
    ws_fm.merge_cells("A18:A26")
    ws_fm.merge_cells("A27:A30")

    # ==============================================================================
    # SHEET 5: Function2
    # ==============================================================================
    ws_f2 = wb.create_sheet(title="Function2")
    auto_fit(ws_f2, {
        "A": 12, "B": 28, "C": 8, "D": 8, "E": 8, "F": 8, "G": 8, "H": 8, "I": 8,
        "J": 8, "K": 8, "L": 8, "M": 8, "N": 8, "O": 8, "P": 8, "Q": 8
    })

    # Header Function Block
    ws_f2.cell(row=2, column=1, value="Function Code").font = font_bold
    ws_f2.cell(row=2, column=1).border = border_all_thin
    ws_f2.merge_cells("B2:C2")
    ws_f2.cell(row=2, column=2, value="Function2").font = font_normal
    ws_f2.cell(row=2, column=2).border = border_all_thin
    ws_f2.cell(row=2, column=3).border = border_all_thin

    ws_f2.cell(row=2, column=4, value="Function Name").font = font_bold
    ws_f2.cell(row=2, column=4).border = border_all_thin
    ws_f2.merge_cells("E2:Q2")
    ws_f2.cell(row=2, column=5, value="Function B").font = font_normal
    for ci in range(5, 18): ws_f2.cell(row=2, column=ci).border = border_all_thin

    ws_f2.cell(row=3, column=1, value="Created By").font = font_bold
    ws_f2.cell(row=3, column=1).border = border_all_thin
    ws_f2.merge_cells("B3:C3")
    ws_f2.cell(row=3, column=2, value="<Developer Name>").font = font_normal
    ws_f2.cell(row=3, column=2).border = border_all_thin
    ws_f2.cell(row=3, column=3).border = border_all_thin

    ws_f2.cell(row=3, column=4, value="Executed By").font = font_bold
    ws_f2.cell(row=3, column=4).border = border_all_thin
    ws_f2.merge_cells("E3:Q3")
    ws_f2.cell(row=3, column=5, value="").font = font_normal
    for ci in range(5, 18): ws_f2.cell(row=3, column=ci).border = border_all_thin

    ws_f2.cell(row=4, column=1, value="Test requirement").font = font_bold
    ws_f2.cell(row=4, column=1).border = border_all_thin
    ws_f2.merge_cells("B4:Q4")
    ws_f2.cell(row=4, column=2, value="<Brief description about requirements which are tested in this function>").font = font_normal
    for ci in range(2, 18): ws_f2.cell(row=4, column=ci).border = border_all_thin

    # Stats box (Row 5-6)
    # Passed: 12, Failed: 2, Untested: 1, N/A/B: 12 / 2 / 1, Total: 15
    ws_f2.cell(row=5, column=1, value="Passed").font = font_bold
    ws_f2.cell(row=5, column=1).border = border_all_thin
    ws_f2.cell(row=5, column=1).alignment = align_center
    ws_f2.cell(row=6, column=1, value="12").font = font_normal
    ws_f2.cell(row=6, column=1).border = border_all_thin
    ws_f2.cell(row=6, column=1).alignment = align_center

    ws_f2.cell(row=5, column=3, value="Failed").font = font_bold
    ws_f2.cell(row=5, column=3).border = border_all_thin
    ws_f2.cell(row=5, column=3).alignment = align_center
    ws_f2.cell(row=6, column=3, value="2").font = font_normal
    ws_f2.cell(row=6, column=3).border = border_all_thin
    ws_f2.cell(row=6, column=3).alignment = align_center

    ws_f2.cell(row=5, column=5, value="Untested").font = font_bold
    ws_f2.cell(row=5, column=5).border = border_all_thin
    ws_f2.cell(row=5, column=5).alignment = align_center
    ws_f2.cell(row=6, column=5, value="1").font = font_normal
    ws_f2.cell(row=6, column=5).border = border_all_thin
    ws_f2.cell(row=6, column=5).alignment = align_center

    ws_f2.merge_cells("K5:M5")
    ws_f2.cell(row=5, column=11, value="N/A/B").font = font_bold
    ws_f2.cell(row=5, column=11).alignment = align_center
    for ci in range(11, 14): ws_f2.cell(row=5, column=ci).border = border_all_thin

    ws_f2.cell(row=6, column=11, value="12").font = font_normal
    ws_f2.cell(row=6, column=11).border = border_all_thin
    ws_f2.cell(row=6, column=11).alignment = align_center
    ws_f2.cell(row=6, column=12, value="2").font = font_normal
    ws_f2.cell(row=6, column=12).border = border_all_thin
    ws_f2.cell(row=6, column=12).alignment = align_center
    ws_f2.cell(row=6, column=13, value="1").font = font_normal
    ws_f2.cell(row=6, column=13).border = border_all_thin
    ws_f2.cell(row=6, column=13).alignment = align_center

    ws_f2.merge_cells("N5:Q5")
    ws_f2.cell(row=5, column=14, value="Total Test Cases").font = font_bold
    ws_f2.cell(row=5, column=14).alignment = align_center
    for ci in range(14, 18): ws_f2.cell(row=5, column=ci).border = border_all_thin

    ws_f2.merge_cells("N6:Q6")
    ws_f2.cell(row=6, column=14, value="15").font = font_normal
    ws_f2.cell(row=6, column=14).alignment = align_center
    for ci in range(14, 18): ws_f2.cell(row=6, column=ci).border = border_all_thin

    # Matrix Table Header (Row 8)
    ws_f2.cell(row=8, column=1, value="Condition").font = font_tbl_hdr
    ws_f2.cell(row=8, column=1).fill = fill_navy
    ws_f2.cell(row=8, column=1).alignment = align_center
    ws_f2.cell(row=8, column=1).border = border_all_thin

    ws_f2.cell(row=8, column=2, value="Precondition").font = font_tbl_hdr
    ws_f2.cell(row=8, column=2).fill = fill_navy
    ws_f2.cell(row=8, column=2).alignment = align_center
    ws_f2.cell(row=8, column=2).border = border_all_thin

    utc_headers_15 = [f"UTCID{i:02d}" for i in range(1, 16)]
    for ci, tc in enumerate(utc_headers_15, start=3):
        cell = ws_f2.cell(row=8, column=ci, value=tc)
        cell.font = font_tbl_hdr
        cell.fill = fill_navy
        cell.alignment = align_center
        cell.border = border_all_thin

    # Row 27 Executed Date: UTCID01..12: 02/26/2024, UTCID13: "", UTCID14..15: 02/26/2024
    exec_dates = ["02/26/2024"] * 12 + [""] + ["02/26/2024", "02/26/2024"]

    # Row 28 Defect ID:
    # UTCID06: DFID002, UTCID07: DFID004, UTCID08: DFID005, UTCID09: DFID006, UTCID10: DFID007
    # UTCID11: DFID008, UTCID12: DFID009, UTCID13: DFID010, UTCID14: DFID011, UTCID15: DFID012
    defect_ids = ["", "", "", "", "", "DFID002", "DFID004", "DFID005", "DFID006", "DFID007", "DFID008", "DFID009", "DFID010", "DFID011", "DFID012"]

    # Passed/Failed: UTCID01..05: P, UTCID06..07: F, UTCID08..12: P, UTCID13: "" (Untested), UTCID14..15: P
    pf_results = ["P", "P", "P", "P", "P", "F", "F", "P", "P", "P", "P", "P", "", "P", "P"]

    f2_rows = [
        (9, "Condition", "Can connect with server", ["O"] * 15),
        (10, "Condition", "Input1", [""] * 15),
        (11, "Condition", '"1"', ["O", "O", "O", "O", "O", "", "", "O", "O", "O", "O", "O", "", "", "O"]),
        (12, "Condition", '""', ["", "", "", "", "", "O", "", "", "", "", "", "", "O", "", ""]),
        (13, "Condition", "null", ["", "", "", "", "", "", "O", "", "", "", "", "", "", "O", ""]),
        (14, "Condition", "Input2", [""] * 15),
        (15, "Condition", ">=5 & <= 10", ["O", "", "", "O", "O", "O", "O", "O", "", "", "O", "O", "O", "O", "O"]),
        (16, "Condition", "5", ["", "O", "", "", "", "", "", "", "O", "", "", "", "", "", ""]),
        (17, "Condition", "10", ["", "", "O", "", "", "", "", "", "", "O", "", "", "", "", ""]),
        (18, "Confirm", "Return", [""] * 15),
        (19, "Confirm", "1", ["O", "O", "O", "O", "O", "", "", "O", "O", "O", "O", "O", "", "", "O"]),
        (20, "Confirm", "2", ["", "", "", "", "", "O", "O", "", "", "", "", "", "O", "O", ""]),
        (21, "Confirm", "Exception", [""] * 15),
        (22, "Confirm", "Log message", [""] * 15),
        (23, "Confirm", '"success"', ["O", "O", "O", "O", "O", "", "", "O", "O", "O", "O", "O", "", "", "O"]),
        (24, "Confirm", '"input1 is null"', ["", "", "", "", "", "O", "O", "", "", "", "", "", "O", "O", ""]),
        (25, "Result", "Type(N : Normal, A : Abnormal, B : Boundary)", ["N", "N", "N", "N", "N", "B", "A", "N", "N", "N", "N", "N", "A", "N", "N"]),
        (26, "Result", "Passed/Failed", pf_results),
        (27, "Result", "Executed Date", exec_dates),
        (28, "Result", "Defect ID", defect_ids)
    ]

    for r, grp, sub, vals in f2_rows:
        ws_f2.cell(row=r, column=1, value=grp).border = border_all_thin
        ws_f2.cell(row=r, column=1).font = font_bold
        ws_f2.cell(row=r, column=1).alignment = align_center

        c_sub = ws_f2.cell(row=r, column=2, value=sub)
        c_sub.border = border_all_thin
        c_sub.font = font_bold if grp == "Result" or sub in ["Input1", "Input2", "Return", "Exception", "Log message"] else font_normal
        c_sub.alignment = align_left

        for ci, v in enumerate(vals, start=3):
            cell = ws_f2.cell(row=r, column=ci, value=v)
            cell.border = border_all_thin
            cell.alignment = align_center
            if v == "O":
                cell.font = font_marker_o
            elif r == 26: # Passed/Failed
                if v == "P":
                    cell.font = font_pass
                    cell.fill = fill_pass_cell
                elif v == "F":
                    cell.font = font_fail
                    cell.fill = fill_fail_cell
                else:
                    cell.font = font_normal
            elif r == 25: # Type
                cell.font = font_bold
            elif r == 27: # Executed Date (Vertical)
                cell.font = font_normal
                if v:
                    cell.alignment = align_vertical
            elif r == 28: # Defect ID (Vertical)
                cell.font = font_bold
                if v:
                    cell.alignment = align_vertical
                    if v in ["DFID002", "DFID004"]:
                        cell.fill = fill_yellow_highlight
            else:
                cell.font = font_normal

    ws_f2.merge_cells("A9:A17")
    ws_f2.merge_cells("A18:A24")
    ws_f2.merge_cells("A25:A28")

    # Set row height for vertical rows in Function2
    ws_f2.row_dimensions[27].height = 45
    ws_f2.row_dimensions[28].height = 45

    # ==============================================================================
    # SHEET 6: Code (Trang cuối chứa đoạn code và ảnh chụp nguyên bản)
    # ==============================================================================
    ws_code = wb.create_sheet(title="Code")
    auto_fit(ws_code, {"A": 6, "B": 85})

    ws_code.merge_cells("A2:B2")
    c_c_title = ws_code["A2"]
    c_c_title.value = "SOURCE CODE (ĐOẠN CODE CỦA CÁC HÀM ĐƯỢC KIỂM THỬ UNIT TEST)"
    c_c_title.font = font_title
    c_c_title.alignment = align_center

    code_lines_1 = [
        "// ============================================================================",
        "// 1. CLASS: ExampleBranch.java (Hàm findMax)",
        "// ============================================================================",
        "public class ExampleBranch {",
        "    /**",
        "     * @param arr is an array with type is integer",
        "     * @return a max value of array",
        "     * Description: Iterate through each element of the array to find the max value",
        "     */",
        "    public int findMax(int[] arr) {",
        "        //check null",
        "        if (arr == null) {",
        "            throw new NullPointerException(\"Array is null\");",
        "        }",
        "        //check empty",
        "        if (arr.length == 0) {",
        "            throw new ArrayIndexOutOfBoundsException(\"Array is empty\");",
        "        }",
        "        //find max",
        "        int max = arr[0];",
        "        for (int i = 1; i < arr.length; i++) {",
        "            if (arr[i] > max) {",
        "                max = arr[i];",
        "            }",
        "        }",
        "        return max;",
        "    }",
        "}"
    ]

    code_lines_2 = [
        "",
        "// ============================================================================",
        "// 2. CLASS: Class2.java (Hàm Function B / Function2)",
        "// ============================================================================",
        "public class Class2 {",
        "    /**",
        "     * @param input1 String parameter",
        "     * @param input2 Integer parameter",
        "     * @return 1 on success, 2 on invalid input",
        "     * Description: Validate inputs and check connection with server",
        "     */",
        "    public int functionB(String input1, Integer input2) {",
        "        if (input1 == null || input1.isEmpty()) {",
        "            System.out.println(\"input1 is null\");",
        "            return 2;",
        "        }",
        "        if (input2 == null || input2 < 5 || input2 > 10) {",
        "            return 2;",
        "        }",
        "        System.out.println(\"success\");",
        "        return 1;",
        "    }",
        "}"
    ]

    code_lines_3 = [
        "",
        "// ============================================================================",
        "// 3. GAMERENT PROJECT: Core Business Logic (src/utils/validation.js)",
        "// ============================================================================",
        "export function calculateRentalCost(account, durationHours, userBalance) {",
        "    if (!account) return { isValid: false, error: 'Không tìm thấy tài khoản game' };",
        "    if (account.status === 'rented') return { isValid: false, error: 'Tài khoản này hiện đang có người thuê' };",
        "    if (account.status === 'maintenance') return { isValid: false, error: 'Tài khoản đang bảo trì / đổi mật khẩu' };",
        "    const hours = Number(durationHours);",
        "    if (isNaN(hours) || hours < 1) return { isValid: false, error: 'Thời gian thuê tối thiểu là 1 giờ' };",
        "    if (hours > 48) return { isValid: false, error: 'Thời gian thuê tối đa là 48 giờ' };",
        "    const totalCost = account.pricePerHour * hours;",
        "    const balance = Number(userBalance) || 0;",
        "    if (balance < totalCost) {",
        "        return { isValid: false, totalCost, missingAmount: totalCost - balance, canRent: false };",
        "    }",
        "    return { isValid: true, totalCost, remainingBalance: balance - totalCost, canRent: true };",
        "}",
        "",
        "export function validateDepositAmount(amount) {",
        "    const num = Number(amount);",
        "    if (isNaN(num) || !Number.isInteger(num) || num <= 0) return { isValid: false, error: 'Số tiền nạp phải là số nguyên dương' };",
        "    if (num < 10000) return { isValid: false, error: 'Số tiền nạp tối thiểu là 10.000 VNĐ' };",
        "    if (num > 5000000) return { isValid: false, error: 'Số tiền nạp tối đa là 5.000.000 VNĐ' };",
        "    return { isValid: true, amount: num };",
        "}"
    ]

    all_code_lines = code_lines_1 + code_lines_2 + code_lines_3
    curr_line_num = 1
    start_r = 4

    for r_idx, line in enumerate(all_code_lines, start=start_r):
        if line.startswith("//") or line == "":
            ws_code.cell(row=r_idx, column=1, value="").alignment = align_center
            ws_code.cell(row=r_idx, column=1).font = font_code_cmt
            ws_code.cell(row=r_idx, column=2, value=line).font = font_code_cmt
        else:
            ws_code.cell(row=r_idx, column=1, value=curr_line_num).alignment = align_right
            ws_code.cell(row=r_idx, column=1).font = font_code_cmt
            curr_line_num += 1
            ws_code.cell(row=r_idx, column=2, value=line).font = font_code
            ws_code.cell(row=r_idx, column=2).alignment = align_left

        ws_code.cell(row=r_idx, column=1).border = Border(right=thin_side)
        ws_code.cell(row=r_idx, column=1).fill = fill_light_gray
        ws_code.cell(row=r_idx, column=2).fill = fill_white

    # Embed the cropped code screenshot image into Sheet Code
    img_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "example_branch_code.png")
    if os.path.exists(img_path):
        img = Image(img_path)
        img.width = 460
        img.height = 400
        ws_code.add_image(img, "D4")

    return wb

def main():
    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Tài_Liệu")
    os.makedirs(out_dir, exist_ok=True)

    print("Building PERFECT 6-sheet Unit Test Case Workbook matching Unit Test Case.pdf...")
    wb = create_6sheet_unit_test_workbook()
    
    path1 = os.path.join(out_dir, "Unit_Test_Case_GameRent.xlsx")
    wb.save(path1)
    print(f"Saved: {path1}")

    print("SUCCESS: 6-sheet Unit Test Case file generated matching template perfectly!")

if __name__ == "__main__":
    main()
