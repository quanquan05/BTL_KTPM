# -*- coding: utf-8 -*-
"""
Script chuẩn hóa giao diện, bố cục, căn chỉnh và kiểu chữ cho 3 file Excel:
- Unit Test Case.xlsx
- IT_Test Case.xlsx
- ST_Test Case.xlsx

Đặc điểm nâng cấp:
1. Kiểu chữ hiện đại: Segoe UI (chuẩn Microsoft 365, open counters, dấu tiếng Việt rõ nét, tuyệt đối không bị bể chữ).
2. Bảng màu hài hòa: Deep Slate Blue (#1E3A8A) làm Header chính, Royal Blue (#2563EB) làm Sub-Header, Soft Sky (#EFF6FF) làm nhãn, Zebra (#F8FAFC) dịu mắt.
3. Badges chuyên nghiệp: Soft Mint (#DCFCE7) với chữ Xanh lá đậm (#15803D) cho Pass; Soft Red (#FEE2E2 / #991B1B) cho Critical; Soft Amber (#FEF3C7 / #92400E) cho Medium.
4. Bố cục rộng rãi: Cột D (Steps) và E (Expected) rộng 48.0, wrap text chuẩn xác, row height tính động theo số dòng (không bị cắt xén chữ).
5. Lưới hiển thị (Gridlines): Bật hiển thị 100% trên tất cả các sheet (showGridLines = True).
6. Khắc phục triệt để lỗi va chạm đè ô (collision) trong Unit Test Case: Result block được định vị động sau tất cả các điều kiện, công thức dòng 7 tự động tham chiếu chuẩn xác.
7. Bảo toàn hình ảnh Wireframe đăng nhập trong ST_Test Case.xlsx với khoảng cách an toàn không đè lên bảng dữ liệu bên dưới.
"""

import os
import sys
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

if sys.stdout:
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if sys.stderr:
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ==================== DESIGN SYSTEM TOKENS ====================
FONT_NAME = "Segoe UI"

FONT_TITLE = Font(name=FONT_NAME, size=15, bold=True, color="1E3A8A")
FONT_SECTION = Font(name=FONT_NAME, size=11.5, bold=True, color="1E3A8A")
FONT_HEADER_WHITE = Font(name=FONT_NAME, size=10, bold=True, color="FFFFFF")
FONT_HEADER_SUB = Font(name=FONT_NAME, size=9.5, bold=True, color="FFFFFF")
FONT_DATA_BOLD = Font(name=FONT_NAME, size=9.5, bold=True, color="1E293B")
FONT_DATA_REGULAR = Font(name=FONT_NAME, size=9.5, bold=False, color="1E293B")
FONT_DATA_ITALIC = Font(name=FONT_NAME, size=9.0, italic=True, color="64748B")
FONT_BADGE_PASS = Font(name=FONT_NAME, size=9.5, bold=True, color="15803D")
FONT_BADGE_FAIL = Font(name=FONT_NAME, size=9.5, bold=True, color="B91C1C")
FONT_BADGE_WARN = Font(name=FONT_NAME, size=9.5, bold=True, color="B45309")

FILL_NAVY_HEADER = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
FILL_ROYAL_HEADER = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid")
FILL_LIGHT_BLUE = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
FILL_ZEBRA = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
FILL_WHITE = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

FILL_PASS_BG = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
FILL_FAIL_BG = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
FILL_WARN_BG = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
FILL_HIGH_BG = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")

BORDER_SIDE_SUBTLE = Side(style="thin", color="CBD5E1")
BORDER_SUBTLE = Border(
    left=BORDER_SIDE_SUBTLE, right=BORDER_SIDE_SUBTLE,
    top=BORDER_SIDE_SUBTLE, bottom=BORDER_SIDE_SUBTLE
)
BORDER_DOUBLE_BOTTOM = Border(
    left=Side(style="thin", color="CBD5E1"),
    right=Side(style="thin", color="CBD5E1"),
    top=Side(style="thin", color="CBD5E1"),
    bottom=Side(style="double", color="1E3A8A")
)

def apply_gridlines(ws):
    """Bật hiển thị lưới ô rõ ràng, chuyên nghiệp trên sheet"""
    try:
        if ws.views.sheetView:
            ws.views.sheetView[0].showGridLines = True
    except Exception:
        pass

# ==================== 1. BEAUTIFY UNIT TEST CASE.XLSX ====================
def beautify_unit_test():
    p = r"e:\BTL_KTPM\Tài_Liệu\Unit Test Case.xlsx"
    print("=== Đang tinh chỉnh giao diện file: Unit Test Case.xlsx ===")
    
    # 1. Tái sinh toàn bộ cấu trúc dữ liệu chuẩn mực, không va chạm
    import update_unit_test_cases_excel as u_script
    u_script.main()
    
    # 2. Mở file để tinh chỉnh trau chuốt Cover và các thuộc tính vi mô
    wb = openpyxl.load_workbook(p)
    
    # Sheet Cover
    ws_cover = wb["Cover"]
    apply_gridlines(ws_cover)
    ws_cover["A2"].font = FONT_TITLE
    ws_cover.row_dimensions[2].height = 28.0
    
    for r in range(4, 8):
        ws_cover.row_dimensions[r].height = 23.0
        ws_cover[f"A{r}"].font = FONT_DATA_BOLD
        ws_cover[f"A{r}"].fill = FILL_LIGHT_BLUE
        ws_cover[f"B{r}"].font = FONT_DATA_REGULAR
        ws_cover[f"D{r}"].font = FONT_DATA_BOLD
        ws_cover[f"D{r}"].fill = FILL_LIGHT_BLUE
        ws_cover[f"E{r}"].font = FONT_DATA_REGULAR
    
    ws_cover.row_dimensions[9].height = 26.0
    ws_cover["A9"].font = FONT_SECTION
    
    ws_cover.row_dimensions[10].height = 26.0
    for col in ["A", "B", "C", "D", "E", "F"]:
        cell = ws_cover[f"{col}10"]
        cell.font = FONT_HEADER_WHITE
        cell.fill = FILL_NAVY_HEADER
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = BORDER_SUBTLE
        
    ws_cover.row_dimensions[11].height = 45.0
    ws_cover["A11"] = "2026-03-24"
    ws_cover["B11"] = "v1.0"
    ws_cover["C11"] = "Initial Release"
    ws_cover["D11"] = "A"
    ws_cover["E11"] = "Khởi tạo và hoàn thiện đầy đủ bộ 100 Unit Test Cases cho 10 Module chức năng cốt lõi của dự án GameRent do Nhóm 15 thực hiện (áp dụng kỹ thuật BVA, EP, Decision Table, đặc tả UC1)."
    ws_cover["F11"] = "CHI_TIET_DU_AN_GAMERENT.md, UC1_Add New Product.pdf"

    for col in ["A", "B", "C", "D", "E", "F"]:
        cell = ws_cover[f"{col}11"]
        cell.font = FONT_DATA_REGULAR
        cell.border = BORDER_SUBTLE
        if col in ["A", "B", "C", "D"]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.alignment = Alignment(vertical="center", wrap_text=True)

    # Xóa dòng 12 nếu còn sót
    for col in ["A", "B", "C", "D", "E", "F"]:
        ws_cover[f"{col}12"].value = None
        ws_cover[f"{col}12"].border = Border()
        ws_cover[f"{col}12"].fill = PatternFill(fill_type=None)

    # Bật gridlines trên 100% các sheet
    for s in wb.sheetnames:
        apply_gridlines(wb[s])

    wb.save(p)
    print("-> Đã lưu hoàn tất file Unit Test Case.xlsx!")

# ==================== 2. BEAUTIFY IT_TEST CASE.XLSX ====================
def beautify_it_test():
    p = r"e:\BTL_KTPM\Tài_Liệu\IT_Test Case.xlsx"
    print("\n=== Đang tinh chỉnh giao diện file: IT_Test Case.xlsx ===")
    wb = openpyxl.load_workbook(p)
    
    # 1. Cover
    ws_cover = wb["Cover"]
    apply_gridlines(ws_cover)
    ws_cover["A2"].font = FONT_TITLE
    ws_cover.row_dimensions[2].height = 28.0
    for r in range(4, 8):
        ws_cover.row_dimensions[r].height = 23.0
        ws_cover[f"A{r}"].font = FONT_DATA_BOLD
        ws_cover[f"A{r}"].fill = FILL_LIGHT_BLUE
        ws_cover[f"B{r}"].font = FONT_DATA_REGULAR
        ws_cover[f"D{r}"].font = FONT_DATA_BOLD
        ws_cover[f"D{r}"].fill = FILL_LIGHT_BLUE
        ws_cover[f"E{r}"].font = FONT_DATA_REGULAR
    
    ws_cover.row_dimensions[10].height = 26.0
    ws_cover["A10"].font = FONT_SECTION
    ws_cover.row_dimensions[11].height = 26.0
    for col in ["A", "B", "C", "D", "E", "F"]:
        cell = ws_cover[f"{col}11"]
        cell.font = FONT_HEADER_WHITE
        cell.fill = FILL_NAVY_HEADER
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = BORDER_SUBTLE
    ws_cover.row_dimensions[12].height = 45.0
    for col in ["A", "B", "C", "D", "E", "F"]:
        cell = ws_cover[f"{col}12"]
        cell.font = FONT_DATA_REGULAR
        cell.border = BORDER_SUBTLE
        if col in ["A", "B", "C", "D"]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.alignment = Alignment(vertical="center", wrap_text=True)

    # 2. Chiến lược tích hợp
    if "Chiến lược tích hợp" in wb.sheetnames:
        ws_strat = wb["Chiến lược tích hợp"]
        apply_gridlines(ws_strat)
        ws_strat["B2"].font = FONT_TITLE
        ws_strat.row_dimensions[2].height = 28.0
        ws_strat.row_dimensions[4].height = 24.0
        ws_strat["B4"].font = FONT_SECTION
        ws_strat.row_dimensions[5].height = 26.0
        for col in ["B", "C", "D"]:
            cell = ws_strat[f"{col}5"]
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
        for r in range(6, 9):
            ws_strat.row_dimensions[r].height = 44.0
            fill_r = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            for col in ["B", "C", "D"]:
                cell = ws_strat[f"{col}{r}"]
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_r
                cell.border = BORDER_SUBTLE
                cell.alignment = Alignment(vertical="center", wrap_text=True)

    # 3. Các Sheet IT Module Test Cases
    it_sheets = [s for s in wb.sheetnames if s.startswith("IT_") and s != "IT_BUG_LOG"]
    for sname in it_sheets:
        ws = wb[sname]
        apply_gridlines(ws)
        
        ws["A2"].font = FONT_TITLE
        ws.row_dimensions[2].height = 28.0
        
        # Metadata row 4
        ws.row_dimensions[4].height = 23.0
        ws["A4"].font = FONT_DATA_BOLD
        ws["A4"].fill = FILL_LIGHT_BLUE
        ws["B4"].font = FONT_DATA_REGULAR
        ws["D4"].font = FONT_DATA_BOLD
        ws["D4"].fill = FILL_LIGHT_BLUE
        ws["E4"].font = FONT_DATA_REGULAR
        
        # Summary Box row 5-6
        ws.row_dimensions[5].height = 24.0
        ws.row_dimensions[6].height = 24.0
        ws["A5"].font = FONT_HEADER_WHITE
        ws["A5"].fill = FILL_NAVY_HEADER
        ws["A5"].alignment = Alignment(horizontal="center", vertical="center")
        ws["B5"].font = FONT_HEADER_WHITE
        ws["B5"].fill = FILL_NAVY_HEADER
        ws["B5"].alignment = Alignment(horizontal="center", vertical="center")
        
        ws["A6"].font = FONT_BADGE_PASS
        ws["A6"].fill = FILL_PASS_BG
        ws["A6"].alignment = Alignment(horizontal="center", vertical="center")
        ws["B6"].font = FONT_BADGE_FAIL
        ws["B6"].fill = FILL_FAIL_BG
        ws["B6"].alignment = Alignment(horizontal="center", vertical="center")
        
        # Header Row 8
        ws.row_dimensions[8].height = 28.0
        for col_idx in range(1, 8):
            cell = ws.cell(8, col_idx)
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
            
        # Test Case Rows (Row 9 trở đi)
        for r in range(9, ws.max_row + 1):
            val_id = ws.cell(r, 1).value
            if not val_id:
                continue
                
            fill_row = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            
            # Tính chiều cao dòng tối ưu để văn bản thông thoáng, dễ đọc
            steps_txt = str(ws.cell(r, 4).value or "")
            exp_txt = str(ws.cell(r, 5).value or "")
            max_lines = max(len(steps_txt.split("\n")), len(exp_txt.split("\n")), 3)
            dyn_height = max(55.0, max_lines * 18.0 + 16)
            ws.row_dimensions[r].height = dyn_height
            
            # Format từng ô trong dòng
            for c in range(1, 8):
                cell = ws.cell(r, c)
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_row
                cell.border = BORDER_SUBTLE
                
                # Căn lề & Kiểu dáng
                if c == 1: # ID
                    cell.font = FONT_DATA_BOLD
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                elif c in [2, 3]: # Description, Preconditions
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c in [4, 5]: # Steps, Expected
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c == 6: # Actual
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c == 7: # Status
                    st_val = str(cell.value or "").strip().lower()
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    if "pass" in st_val:
                        cell.font = FONT_BADGE_PASS
                        cell.fill = FILL_PASS_BG
                    elif "fail" in st_val:
                        cell.font = FONT_BADGE_FAIL
                        cell.fill = FILL_FAIL_BG
                        
        # Đặt độ rộng cột tiêu chuẩn thoáng đãng
        ws.column_dimensions["A"].width = 12.0
        ws.column_dimensions["B"].width = 32.0
        ws.column_dimensions["C"].width = 28.0
        ws.column_dimensions["D"].width = 48.0
        ws.column_dimensions["E"].width = 48.0
        ws.column_dimensions["F"].width = 32.0
        ws.column_dimensions["G"].width = 12.0

    # 4. Sheet Bug Log
    if "Bug Log" in wb.sheetnames or "IT_BUG_LOG" in wb.sheetnames:
        b_name = "Bug Log" if "Bug Log" in wb.sheetnames else "IT_BUG_LOG"
        ws_bug = wb[b_name]
        apply_gridlines(ws_bug)
        
        ws_bug["A2"].font = FONT_TITLE
        ws_bug.row_dimensions[2].height = 28.0
        ws_bug.row_dimensions[4].height = 28.0
        
        for c in range(1, 10):
            cell = ws_bug.cell(4, c)
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
            
        for r in range(5, ws_bug.max_row + 1):
            if not ws_bug.cell(r, 1).value:
                continue
            fill_r = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            ws_bug.row_dimensions[r].height = 42.0
            
            for c in range(1, 10):
                cell = ws_bug.cell(r, c)
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_r
                cell.border = BORDER_SUBTLE
                
                if c == 1: # Bug ID
                    cell.font = FONT_DATA_BOLD
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                elif c in [2, 3]:
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                elif c in [4, 7]: # Title, Resolution
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c == 5: # Severity
                    sev = str(cell.value or "").strip().lower()
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    if "critical" in sev:
                        cell.fill = FILL_FAIL_BG
                        cell.font = FONT_BADGE_FAIL
                    elif "high" in sev:
                        cell.fill = FILL_HIGH_BG
                        cell.font = Font(name=FONT_NAME, size=9.5, bold=True, color="9A3412")
                    elif "medium" in sev:
                        cell.fill = FILL_WARN_BG
                        cell.font = FONT_BADGE_WARN
                elif c == 6: # Status
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    cell.fill = FILL_PASS_BG
                    cell.font = FONT_BADGE_PASS
                else:
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    
        ws_bug.column_dimensions["A"].width = 12.0
        ws_bug.column_dimensions["B"].width = 14.0
        ws_bug.column_dimensions["C"].width = 16.0
        ws_bug.column_dimensions["D"].width = 38.0
        ws_bug.column_dimensions["E"].width = 14.0
        ws_bug.column_dimensions["F"].width = 14.0
        ws_bug.column_dimensions["G"].width = 38.0
        ws_bug.column_dimensions["H"].width = 15.0
        ws_bug.column_dimensions["I"].width = 15.0

    # 5. Sheet Test Report
    if "Test Report" in wb.sheetnames:
        ws_tr = wb["Test Report"]
        apply_gridlines(ws_tr)
        ws_tr["A2"].font = FONT_TITLE
        ws_tr.row_dimensions[2].height = 28.0
        ws_tr.row_dimensions[4].height = 26.0
        for c in range(1, 10):
            cell = ws_tr.cell(4, c)
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
        for r in range(5, ws_tr.max_row + 1):
            if not ws_tr.cell(r, 1).value:
                continue
            ws_tr.row_dimensions[r].height = 24.0
            fill_r = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            for c in range(1, 10):
                cell = ws_tr.cell(r, c)
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_r
                cell.border = BORDER_SUBTLE
                cell.alignment = Alignment(horizontal="center", vertical="center")

    wb.save(p)
    print("-> Đã lưu hoàn tất file IT_Test Case.xlsx!")

# ==================== 3. BEAUTIFY ST_TEST CASE.XLSX ====================
def beautify_st_test():
    p = r"e:\BTL_KTPM\Tài_Liệu\ST_Test Case.xlsx"
    print("\n=== Đang tinh chỉnh giao diện file: ST_Test Case.xlsx ===")
    wb = openpyxl.load_workbook(p)
    
    # 1. Cover
    ws_cover = wb["Cover"]
    apply_gridlines(ws_cover)
    ws_cover["A2"].font = FONT_TITLE
    ws_cover.row_dimensions[2].height = 28.0
    for r in range(4, 8):
        ws_cover.row_dimensions[r].height = 23.0
        ws_cover[f"A{r}"].font = FONT_DATA_BOLD
        ws_cover[f"A{r}"].fill = FILL_LIGHT_BLUE
        ws_cover[f"B{r}"].font = FONT_DATA_REGULAR
        ws_cover[f"D{r}"].font = FONT_DATA_BOLD
        ws_cover[f"D{r}"].fill = FILL_LIGHT_BLUE
        ws_cover[f"E{r}"].font = FONT_DATA_REGULAR
    
    ws_cover.row_dimensions[10].height = 26.0
    ws_cover["A10"].font = FONT_SECTION
    ws_cover.row_dimensions[11].height = 26.0
    for col in ["A", "B", "C", "D", "E", "F"]:
        cell = ws_cover[f"{col}11"]
        cell.font = FONT_HEADER_WHITE
        cell.fill = FILL_NAVY_HEADER
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = BORDER_SUBTLE
    ws_cover.row_dimensions[12].height = 45.0
    for col in ["A", "B", "C", "D", "E", "F"]:
        cell = ws_cover[f"{col}12"]
        cell.font = FONT_DATA_REGULAR
        cell.border = BORDER_SUBTLE
        if col in ["A", "B", "C", "D"]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.alignment = Alignment(vertical="center", wrap_text=True)

    # 2. Sheet Luồng nghiệp vụ
    if "Luồng nghiệp vụ" in wb.sheetnames:
        ws_flow = wb["Luồng nghiệp vụ"]
        apply_gridlines(ws_flow)
        ws_flow["B2"].font = FONT_TITLE
        ws_flow.row_dimensions[2].height = 28.0
        ws_flow.row_dimensions[4].height = 26.0
        for col in ["B", "C", "D"]:
            cell = ws_flow[f"{col}4"]
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
        for r in range(5, ws_flow.max_row + 1):
            if not ws_flow.cell(r, 2).value:
                continue
            ws_flow.row_dimensions[r].height = 36.0
            fill_r = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            for col in ["B", "C", "D"]:
                cell = ws_flow[f"{col}{r}"]
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_r
                cell.border = BORDER_SUBTLE
                cell.alignment = Alignment(vertical="center", wrap_text=True)

    # 3. Các Sheet ST Module Test Cases
    st_sheets = [s for s in wb.sheetnames if s.startswith("ST_") and s != "ST_BUG_LOG"]
    for sname in st_sheets:
        ws = wb[sname]
        apply_gridlines(ws)
        
        ws["A2"].font = FONT_TITLE
        ws.row_dimensions[2].height = 28.0
        
        # Metadata row 4
        ws.row_dimensions[4].height = 23.0
        ws["A4"].font = FONT_DATA_BOLD
        ws["A4"].fill = FILL_LIGHT_BLUE
        ws["B4"].font = FONT_DATA_REGULAR
        ws["D4"].font = FONT_DATA_BOLD
        ws["D4"].fill = FILL_LIGHT_BLUE
        ws["E4"].font = FONT_DATA_REGULAR
        
        # Summary Box row 5-6
        ws.row_dimensions[5].height = 24.0
        ws.row_dimensions[6].height = 24.0
        ws["A5"].font = FONT_HEADER_WHITE
        ws["A5"].fill = FILL_NAVY_HEADER
        ws["A5"].alignment = Alignment(horizontal="center", vertical="center")
        ws["B5"].font = FONT_HEADER_WHITE
        ws["B5"].fill = FILL_NAVY_HEADER
        ws["B5"].alignment = Alignment(horizontal="center", vertical="center")
        
        ws["A6"].font = FONT_BADGE_PASS
        ws["A6"].fill = FILL_PASS_BG
        ws["A6"].alignment = Alignment(horizontal="center", vertical="center")
        ws["B6"].font = FONT_BADGE_FAIL
        ws["B6"].fill = FILL_FAIL_BG
        ws["B6"].alignment = Alignment(horizontal="center", vertical="center")
        
        # Header Row 8
        ws.row_dimensions[8].height = 28.0
        for col_idx in range(1, 8):
            cell = ws.cell(8, col_idx)
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
            
        # Test Case Rows (Row 9 trở đi)
        for r in range(9, ws.max_row + 1):
            val_id = ws.cell(r, 1).value
            if not val_id:
                continue
                
            fill_row = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            steps_txt = str(ws.cell(r, 4).value or "")
            exp_txt = str(ws.cell(r, 5).value or "")
            max_lines = max(len(steps_txt.split("\n")), len(exp_txt.split("\n")), 3)
            dyn_height = max(55.0, max_lines * 18.0 + 16)
            ws.row_dimensions[r].height = dyn_height
            
            for c in range(1, 8):
                cell = ws.cell(r, c)
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_row
                cell.border = BORDER_SUBTLE
                
                if c == 1: # ID
                    cell.font = FONT_DATA_BOLD
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                elif c in [2, 3]: # Description, Preconditions
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c in [4, 5]: # Steps, Expected
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c == 6: # Actual
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c == 7: # Status
                    st_val = str(cell.value or "").strip().lower()
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    if "pass" in st_val:
                        cell.font = FONT_BADGE_PASS
                        cell.fill = FILL_PASS_BG
                    elif "fail" in st_val:
                        cell.font = FONT_BADGE_FAIL
                        cell.fill = FILL_FAIL_BG
                        
        ws.column_dimensions["A"].width = 12.0
        ws.column_dimensions["B"].width = 32.0
        ws.column_dimensions["C"].width = 28.0
        ws.column_dimensions["D"].width = 48.0
        ws.column_dimensions["E"].width = 48.0
        ws.column_dimensions["F"].width = 32.0
        ws.column_dimensions["G"].width = 12.0

    # 4. Sheet Bug Log
    if "Bug Log" in wb.sheetnames or "ST_BUG_LOG" in wb.sheetnames:
        b_name = "Bug Log" if "Bug Log" in wb.sheetnames else "ST_BUG_LOG"
        ws_bug = wb[b_name]
        apply_gridlines(ws_bug)
        
        ws_bug["A2"].font = FONT_TITLE
        ws_bug.row_dimensions[2].height = 28.0
        ws_bug.row_dimensions[4].height = 28.0
        
        for c in range(1, 10):
            cell = ws_bug.cell(4, c)
            cell.font = FONT_HEADER_WHITE
            cell.fill = FILL_NAVY_HEADER
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = BORDER_SUBTLE
            
        for r in range(5, ws_bug.max_row + 1):
            if not ws_bug.cell(r, 1).value:
                continue
            fill_r = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            ws_bug.row_dimensions[r].height = 42.0
            
            for c in range(1, 10):
                cell = ws_bug.cell(r, c)
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_r
                cell.border = BORDER_SUBTLE
                
                if c == 1:
                    cell.font = FONT_DATA_BOLD
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                elif c in [2, 3]:
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                elif c in [4, 7]:
                    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                elif c == 5: # Severity
                    sev = str(cell.value or "").strip().lower()
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    if "critical" in sev:
                        cell.fill = FILL_FAIL_BG
                        cell.font = FONT_BADGE_FAIL
                    elif "high" in sev:
                        cell.fill = FILL_HIGH_BG
                        cell.font = Font(name=FONT_NAME, size=9.5, bold=True, color="9A3412")
                    elif "medium" in sev:
                        cell.fill = FILL_WARN_BG
                        cell.font = FONT_BADGE_WARN
                elif c == 6: # Status
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    cell.fill = FILL_PASS_BG
                    cell.font = FONT_BADGE_PASS
                else:
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    
        ws_bug.column_dimensions["A"].width = 12.0
        ws_bug.column_dimensions["B"].width = 14.0
        ws_bug.column_dimensions["C"].width = 16.0
        ws_bug.column_dimensions["D"].width = 38.0
        ws_bug.column_dimensions["E"].width = 14.0
        ws_bug.column_dimensions["F"].width = 14.0
        ws_bug.column_dimensions["G"].width = 38.0
        ws_bug.column_dimensions["H"].width = 15.0
        ws_bug.column_dimensions["I"].width = 15.0

    # 5. Sheet Wireframe (Bảo toàn hình ảnh Wireframe đăng nhập)
    if "Wireframe" in wb.sheetnames:
        ws_wf = wb["Wireframe"]
        apply_gridlines(ws_wf)
        
        ws_wf["B2"].font = FONT_TITLE
        ws_wf.row_dimensions[2].height = 28.0
        
        # Bảo toàn chiều cao dòng 4-21 cho hình ảnh wireframe (340x435 px)
        for r in range(4, 22):
            ws_wf.row_dimensions[r].height = 19.0
            
        ws_wf["B22"].font = FONT_SECTION
        ws_wf.row_dimensions[22].height = 26.0
        
        ws_wf.row_dimensions[23].height = 26.0
        for col in ["B", "C", "D", "E", "F"]:
            c = ws_wf[f"{col}23"]
            c.font = FONT_HEADER_WHITE
            c.fill = FILL_NAVY_HEADER
            c.alignment = Alignment(horizontal="center", vertical="center")
            c.border = BORDER_SUBTLE
            
        for r in range(24, 30):
            ws_wf.row_dimensions[r].height = 24.0
            fill_r = FILL_ZEBRA if r % 2 == 0 else FILL_WHITE
            for col in ["B", "C", "D", "E", "F"]:
                cell = ws_wf[f"{col}{r}"]
                cell.font = FONT_DATA_REGULAR
                cell.fill = fill_r
                cell.border = BORDER_SUBTLE
                if col in ["B", "C", "D", "E"]:
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    if col == "B":
                        cell.font = FONT_DATA_BOLD
                else:
                    cell.alignment = Alignment(vertical="center", wrap_text=True)
                    
        ws_wf["B31"].font = FONT_SECTION
        ws_wf.row_dimensions[31].height = 26.0
        for r in range(32, 38):
            ws_wf.row_dimensions[r].height = 24.0
            cell = ws_wf[f"B{r}"]
            cell.font = FONT_DATA_REGULAR
            cell.alignment = Alignment(vertical="center")

    wb.save(p)
    print("-> Đã lưu hoàn tất file ST_Test Case.xlsx!")

if __name__ == "__main__":
    beautify_unit_test()
    beautify_it_test()
    beautify_st_test()
    print("\n[THÀNH CÔNG RỰC RỠ] Đã hoàn tất nâng cấp giao diện, kiểu chữ và bố cục cho cả 3 file Excel!")
