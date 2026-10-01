# -*- coding: utf-8 -*-
"""
Script cập nhật và hoàn thiện toàn diện file 'Unit Test Case.xlsx' cho dự án GameRent
Đồng nhất 100% với kiến trúc, mã nguồn (src/utils/validation.js) và bộ 100 Unit Tests Vitest.
"""

import sys
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

FILE_PATH = r"e:\BTL_KTPM\Tài_Liệu\Unit Test Case.xlsx"

# Bảng màu chuẩn mực hiện đại
FONT_NAME = "Segoe UI"
NAVY_HEADER = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
SUB_HEADER = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid")
LIGHT_BLUE = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
ZEBRA_FILL = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
WHITE_FILL = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
GREEN_PASS = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")

FONT_TITLE = Font(name=FONT_NAME, size=15, bold=True, color="1E3A8A")
FONT_HEADER_WHITE = Font(name=FONT_NAME, size=10, bold=True, color="FFFFFF")
FONT_BOLD = Font(name=FONT_NAME, size=9.5, bold=True, color="1E293B")
FONT_NORMAL = Font(name=FONT_NAME, size=9.5, bold=False, color="1E293B")
FONT_ITALIC = Font(name=FONT_NAME, size=9.0, italic=True, color="64748B")
FONT_PASS = Font(name=FONT_NAME, size=9.5, bold=True, color="15803D")

THIN_BORDER_SIDE = Side(style="thin", color="CBD5E1")
MEDIUM_BORDER_SIDE = Side(style="medium", color="1E3A8A")
BORDER_ALL = Border(left=THIN_BORDER_SIDE, right=THIN_BORDER_SIDE, top=THIN_BORDER_SIDE, bottom=THIN_BORDER_SIDE)
BORDER_TOP_BOTTOM = Border(top=THIN_BORDER_SIDE, bottom=THIN_BORDER_SIDE)

ALIGN_CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)
ALIGN_RIGHT = Alignment(horizontal="right", vertical="center")

def style_cell(cell, font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT, border=BORDER_ALL):
    cell.font = font
    cell.fill = fill
    cell.alignment = alignment
    cell.border = border

def update_cover_sheet(wb):
    print("-> Đang cập nhật sheet 'Cover'...")
    ws = wb["Cover"]
    if ws.views.sheetView:
        ws.views.sheetView[0].showGridLines = True
    ws["B4"] = "GameRent - Hệ thống cho thuê tài khoản game trực tuyến tự động 24/7"
    ws["B5"] = "GAMERENT"
    ws["B6"] = '=B5&"_"&"TestCase_v1.0"'
    ws["E4"] = "Nhóm 15 - Lớp Kiểm thử phần mềm-1-1-26(N05)"
    ws["E5"] = "ThS. Phạm Thị Loan"
    ws["E6"] = "2026-03-24"
    ws["E7"] = "v1.0"
    
    # Record of change
    ws["A12"] = "2026-03-24"
    ws["B12"] = "v1.0"
    ws["C12"] = "Initial Release"
    ws["D12"] = "A"
    ws["E12"] = "Khởi tạo và hoàn thiện đầy đủ bộ 100 Unit Test Cases cho 10 Module chức năng cốt lõi của dự án GameRent do Nhóm 15 thực hiện (áp dụng kỹ thuật BVA, EP, Decision Table, đặc tả UC1)."
    ws["F12"] = "CHI_TIET_DU_AN_GAMERENT.md, UC1_Add New Product.pdf"

FUNCTIONS_DATA = [
    {
        "no": 1,
        "req": "Module 1: Xác thực & Đăng ký",
        "class_name": "validation.js",
        "func_name": "validateRegistration",
        "code": "F_AUTH_REG",
        "sheet": "F_AUTH_REG",
        "desc": "Kiểm tra hợp lệ form đăng ký tài khoản (BVA 4-30 ký tự, SĐT 10 chữ số, mật khẩu >= 6 ký tự, kiểm tra trùng lặp)",
        "pre": "Hệ thống hoạt động bình thường, CSDL có sẵn danh sách user mẫu",
        "loc": 52,
        "count": 16,
        "inputs": [
            ("Username", [
                ("Hợp lệ ('user_valid')", [1, 10, 16]),
                ("Dưới biên min (3 ký tự: 'abc')", [2]),
                ("Để trống ('')", [3]),
                ("Tại biên max (30 ký tự)", [4]),
                ("Vượt biên max (31 ký tự)", [5]),
                ("Chứa khoảng trắng ('user name')", [6]),
                ("Chứa ký tự đặc biệt ('user@123')", [7]),
                ("Đã tồn tại trong CSDL ('khach01')", [15]),
                ("Có dấu gạch dưới ('vip_pro_01')", [16])
            ]),
            ("Password", [
                ("Hợp lệ (>= 6 ký tự: 'pass123')", [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16]),
                ("Tại biên min (6 ký tự: '123456')", [8]),
                ("Dưới biên min (5 ký tự: '12345')", [9])
            ]),
            ("Phone", [
                ("10 số di động chuẩn ('0987654321')", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                ("Sai đầu số mạng ('0123456789')", [11]),
                ("Thiếu số (9 số: '098765432')", [12]),
                ("Thừa số (11 số: '09876543210')", [13]),
                ("Chứa ký tự chữ ('0987abc321')", [14]),
                ("Đầu số 08 chuẩn ('0812345678')", [16])
            ])
        ],
        "outputs": [
            ("Return", [
                ("isValid = true", [1, 4, 8, 10, 16]),
                ("error = 'Tên đăng nhập phải từ 4 ký tự trở lên'", [2]),
                ("error = 'Tên đăng nhập không được để trống'", [3]),
                ("error = 'Tên đăng nhập không được vượt quá 30 ký tự'", [5]),
                ("error = 'Tên đăng nhập không chứa khoảng trắng'", [6]),
                ("error = 'Tên đăng nhập chỉ gồm chữ và số'", [7]),
                ("error = 'Mật khẩu phải có ít nhất 6 ký tự'", [9]),
                ("error = 'Số điện thoại không đúng định dạng đầu số di động'", [11]),
                ("error = 'Số điện thoại phải gồm đúng 10 chữ số'", [12]),
                ("error = 'Số điện thoại không được vượt quá 10 chữ số'", [13]),
                ("error = 'Số điện thoại chỉ gồm chữ số'", [14]),
                ("error = 'Tên đăng nhập đã tồn tại trong hệ thống'", [15])
            ])
        ],
        "types": ["N", "B", "A", "B", "B", "A", "A", "B", "B", "N", "A", "B", "B", "A", "A", "N"]
    },
    {
        "no": 2,
        "req": "Module 2: Xác thực & Đăng nhập",
        "class_name": "validation.js",
        "func_name": "validateLogin",
        "code": "F_AUTH_LOGIN",
        "sheet": "F_AUTH_LOGIN",
        "desc": "Xác thực thông tin đăng nhập email/mật khẩu, chặn tài khoản bị khóa isBlocked, quản lý phiên",
        "pre": "Hệ thống có sẵn user thường và user bị khóa (isBlocked=true)",
        "loc": 28,
        "count": 9,
        "inputs": [
            ("Email", [
                ("Email chính xác ('khach01@gmail.com')", [1, 2, 5, 6]),
                ("Email không tồn tại ('notfound@gmail.com')", [3]),
                ("Email để trống ('')", [4]),
                ("Tài khoản đang đăng nhập hợp lệ", [7, 9]),
                ("Chưa có phiên (LocalStorage trống)", [8])
            ]),
            ("Password", [
                ("Đúng mật khẩu ('123456')", [1, 3, 4, 6]),
                ("Sai mật khẩu ('wrongpass')", [2]),
                ("Để trống mật khẩu ('')", [5])
            ]),
            ("Trạng thái", [
                ("Hoạt động bình thường (isBlocked=false)", [1, 2, 3, 4, 5, 7, 8, 9]),
                ("Bị khóa vi phạm (isBlocked=true)", [6])
            ])
        ],
        "outputs": [
            ("Return", [
                ("success = true, user != null", [1]),
                ("error = 'Mật khẩu không chính xác'", [2]),
                ("error = 'Email không tồn tại trên hệ thống'", [3]),
                ("error = 'Email không được để trống'", [4]),
                ("error = 'Mật khẩu không được để trống'", [5]),
                ("error = 'Tài khoản của bạn đang bị khóa do vi phạm quy chế'", [6]),
                ("Khôi phục phiên đăng nhập thành công", [7]),
                ("Khởi động ở trạng thái Guest (chưa đăng nhập)", [8]),
                ("Xóa sạch phiên, chuyển về trạng thái Guest", [9])
            ])
        ],
        "types": ["N", "A", "A", "A", "A", "A", "N", "N", "N"]
    },
    {
        "no": 3,
        "req": "Module 3: Ví điện tử & Nạp tiền",
        "class_name": "validation.js",
        "func_name": "validateDepositAmount",
        "code": "F_WAL_DEP",
        "sheet": "F_WAL_DEP",
        "desc": "Kiểm tra hợp lệ hạn mức nạp tiền ví qua VietQR Auto (BVA 10.000đ - 5.000.000đ, số nguyên dương)",
        "pre": "Người dùng đã đăng nhập, mở modal nạp tiền VietQR",
        "loc": 20,
        "count": 10,
        "inputs": [
            ("Số tiền nạp (VNĐ)", [
                ("9.999 VNĐ (Ngay dưới biên min)", [1]),
                ("10.000 VNĐ (Tại biên min hợp lệ)", [2]),
                ("11.000 VNĐ (Ngay trên biên min)", [3]),
                ("200.000 VNĐ (Gói nạp thông dụng)", [4]),
                ("1.000.000 VNĐ (Gói nạp VIP)", [5]),
                ("4.999.000 VNĐ (Ngay dưới biên max)", [6]),
                ("5.000.000 VNĐ (Tại biên max hợp lệ)", [7]),
                ("5.001.000 VNĐ (Vượt quá biên max)", [8]),
                ("-50.000 VNĐ (Số tiền âm)", [9]),
                ("'abc@123' (Ký tự chữ / ký tự đặc biệt)", [10])
            ])
        ],
        "outputs": [
            ("Return", [
                ("isValid = true, amount xác định", [2, 3, 4, 5, 6, 7]),
                ("error = 'Số tiền nạp tối thiểu là 10.000 VNĐ'", [1]),
                ("error = 'Số tiền nạp tối đa là 5.000.000 VNĐ'", [8]),
                ("error = 'Số tiền nạp phải là số nguyên dương'", [9]),
                ("error = 'Vui lòng nhập số tiền hợp lệ'", [10])
            ])
        ],
        "types": ["B", "B", "B", "N", "N", "B", "B", "B", "A", "A"]
    },
    {
        "no": 4,
        "req": "Module 4: Thuê tài khoản game",
        "class_name": "validation.js",
        "func_name": "calculateRentalCost",
        "code": "F_RENT_CALC",
        "sheet": "F_RENT_CALC",
        "desc": "Tính chi phí thuê và kiểm tra số dư ví theo Decision Table (BVA 1h - 48h, trạng thái acc, đủ/thiếu ví)",
        "pre": "Có tài khoản game trong CSDL, xác định giá thuê/giờ và số dư ví",
        "loc": 42,
        "count": 14,
        "inputs": [
            ("Số giờ thuê", [
                ("1 giờ (Tại biên min)", [1, 5, 6, 7, 8, 9, 10]),
                ("0 giờ (Dưới biên min)", [2]),
                ("48 giờ (Tại biên max)", [3]),
                ("49 giờ (Vượt biên max)", [4]),
                ("Thời gian hợp lệ khác", [11, 12, 13, 14])
            ]),
            ("Số dư ví khách", [
                ("Đủ tiền (> chi phí: 50k > 30k)", [1, 3, 5, 11, 12, 13, 14]),
                ("Vừa đủ tiền (== chi phí: 30k == 30k)", [6]),
                ("Thiếu tiền (< chi phí: 20k < 30k)", [7]),
                ("Hết tiền (0 VNĐ)", [8])
            ]),
            ("Trạng thái tài khoản", [
                ("available (Sẵn sàng)", [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14]),
                ("rented (Đang có người thuê)", [9]),
                ("maintenance (Đang bảo trì)", [10])
            ])
        ],
        "outputs": [
            ("Return", [
                ("canRent = true, tính đúng totalCost", [1, 3, 5, 6]),
                ("error = 'Thời gian thuê tối thiểu là 1 giờ'", [2]),
                ("error = 'Thời gian thuê tối đa là 48 giờ'", [4]),
                ("canRent = false, báo thiếu 10.000 đ", [7]),
                ("canRent = false, báo thiếu 30.000 đ", [8]),
                ("error = 'Tài khoản này hiện đang có người thuê'", [9]),
                ("error = 'Tài khoản đang trong quá trình bảo trì / đổi mật khẩu'", [10]),
                ("Lọc chính xác theo tựa game (LQ, Val, Genshin)", [11]),
                ("Tìm kiếm chính xác theo mã đơn, mã acc", [12]),
                ("Tìm kiếm linh hoạt theo tên khách (có/không dấu)", [13]),
                ("Tìm kiếm chính xác theo tên tựa game", [14])
            ])
        ],
        "types": ["B", "B", "B", "B", "N", "N", "A", "A", "A", "A", "N", "N", "N", "N"]
    },
    {
        "no": 5,
        "req": "Module 5: Quản trị kho tài khoản",
        "class_name": "validation.js",
        "func_name": "validateProductUC1",
        "code": "F_ADM_PROD",
        "sheet": "F_ADM_PROD",
        "desc": "Kiểm tra form Thêm tài khoản game chuẩn 100% tài liệu đặc tả đề bài UC1_Add New Product (BR1-BR6)",
        "pre": "Quản trị viên mở modal Thêm mới tài khoản trong kho",
        "loc": 58,
        "count": 15,
        "inputs": [
            ("Mã sản phẩm", [
                ("7 ký tự (Dưới biên min 8)", [1]),
                ("8 ký tự (Biên min hợp lệ)", [2]),
                ("30 ký tự (Biên max hợp lệ)", [3]),
                ("31 ký tự (Vượt biên max 30)", [4]),
                ("Chứa ký tự đặc biệt ('@')", [5]),
                ("Chứa khoảng trắng", [6]),
                ("Đã tồn tại trong CSDL ('ACCVAL001')", [7]),
                ("Hợp lệ ('ACCVAL01')", [8, 9, 10, 11, 12, 13, 14, 15])
            ]),
            ("Tên sản phẩm", [
                ("9 ký tự (Dưới biên min 10)", [8]),
                ("10 ký tự (Biên min hợp lệ)", [9]),
                ("50 ký tự (Biên max hợp lệ)", [10]),
                ("51 ký tự (Vượt biên max 50)", [11]),
                ("Hợp lệ (10-50 ký tự)", [1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15])
            ]),
            ("Hình ảnh & Giá", [
                ("Sai định dạng ảnh (.pdf, .zip)", [12]),
                ("Dung lượng ảnh 1.5MB (> 1MB)", [13]),
                ("Ảnh PNG 800KB hợp lệ (<= 1MB)", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14]),
                ("Giá thuê âm (-10.000 VNĐ)", [15]),
                ("Giá thuê hợp lệ (> 0)", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
            ])
        ],
        "outputs": [
            ("Return", [
                ("isValid = true (Thêm sản phẩm thành công)", [2, 3, 9, 10, 14]),
                ("error = 'Mã sản phẩm phải từ 8 ký tự trở lên'", [1]),
                ("error = 'Mã sản phẩm không vượt quá 30 ký tự'", [4]),
                ("error = 'Mã sản phẩm chỉ gồm chữ và số'", [5]),
                ("error = 'Mã sản phẩm không chứa khoảng trắng'", [6]),
                ("error = 'Mã sản phẩm đã tồn tại trong hệ thống'", [7]),
                ("error = 'Tên sản phẩm phải từ 10 ký tự trở lên'", [8]),
                ("error = 'Tên sản phẩm không quá 50 ký tự'", [11]),
                ("error = 'Ảnh phải đúng định dạng (.jpg, .png, .gif)'", [12]),
                ("error = 'Dung lượng ảnh vượt quá 1MB'", [13]),
                ("error = 'Giá thuê mỗi giờ phải lớn hơn 0'", [15])
            ])
        ],
        "types": ["B", "B", "B", "B", "A", "A", "A", "B", "B", "B", "B", "A", "B", "N", "A"]
    },
    {
        "no": 6,
        "req": "Module 6: Hoàn tiền & Gia hạn",
        "class_name": "validation.js",
        "func_name": "calculateRefundAndExtension",
        "code": "F_REF_EXT",
        "sheet": "F_REF_EXT",
        "desc": "Tính hoàn tiền 50% khi trả sớm, hoàn tiền 100% khi khiếu nại được duyệt, và gia hạn thêm giờ thuê",
        "pre": "Đơn thuê đang tồn tại trong hệ thống kèm thông tin ca chơi",
        "loc": 48,
        "count": 8,
        "inputs": [
            ("Hành động", [
                ("Trả tài khoản sớm (return_early)", [1, 2]),
                ("Duyệt bồi thường khiếu nại (dispute_approved)", [3, 4]),
                ("Gia hạn thêm giờ (extend)", [5, 6, 7, 8])
            ]),
            ("Thời gian / Điều kiện", [
                ("Còn 2 giờ thừa (30.000 đ/h)", [1]),
                ("Đã hết giờ chơi (0 giờ thừa)", [2]),
                ("Đơn hàng giá trị 30.000 đ", [3]),
                ("Đơn hàng giá trị 50.000 đ", [4]),
                ("Gia hạn thêm 1 giờ khi còn hạn", [5]),
                ("Gia hạn thêm 24 giờ", [6]),
                ("Gia hạn khi đơn đã quá hạn", [7]),
                ("Số giờ gia hạn <= 0", [8])
            ])
        ],
        "outputs": [
            ("Return", [
                ("Hoàn 50% = 30.000 đ, orderStatus = 'completed'", [1]),
                ("Hoàn 0 đ", [2]),
                ("Hoàn 100% = 30.000 đ, accountStatus = 'maintenance'", [3]),
                ("Hoàn 100% = 50.000 đ", [4]),
                ("Cộng nối tiếp 3.600s vào expiresAt, phí 15k", [5]),
                ("Cộng nối tiếp 24h, chi phí 360.000 đ", [6]),
                ("Tính mốc mới bắt đầu từ Date.now()", [7]),
                ("error = 'Số giờ gia hạn phải lớn hơn 0'", [8])
            ])
        ],
        "types": ["N", "B", "N", "N", "N", "N", "B", "A"]
    },
    {
        "no": 7,
        "req": "Module 7: Tự động đổi mật khẩu",
        "class_name": "validation.js",
        "func_name": "generateRandomPassword",
        "code": "F_AUTO_PASS",
        "sheet": "F_AUTO_PASS",
        "desc": "Tự động sinh mật khẩu ngẫu nhiên bảo mật cao (12-14 ký tự) khi thu hồi nick hết giờ, chống trùng pass cũ",
        "pre": "Ca thuê hết hạn hoặc Admin thu hồi bảo mật",
        "loc": 32,
        "count": 10,
        "inputs": [
            ("Mật khẩu cũ", [
                ("Có mật khẩu cũ cụ thể ('OldPass@123')", [1, 2, 3, 4, 7, 8]),
                ("Không truyền mật khẩu cũ ('')", [5, 6, 9, 10])
            ]),
            ("Kịch bản kích hoạt", [
                ("Sinh mật khẩu đơn lẻ", [1, 2, 3]),
                ("50 lần sinh liên tiếp", [4]),
                ("Thu hồi nick chuyển trạng thái available", [5]),
                ("Kiểm tra toàn bộ kho acc", [6]),
                ("Lưu vết lịch sử mật khẩu", [7]),
                ("Vô hiệu hóa mật khẩu cũ", [8]),
                ("Tạo thông báo hết hạn ca thuê", [9]),
                ("Vòng đời đọc/xóa thông báo chuông", [10])
            ])
        ],
        "outputs": [
            ("Return", [
                ("Độ dài mật khẩu chuẩn 12-14 ký tự", [1]),
                ("Chứa đầy đủ [A-Z], [a-z], [0-9], [@#!]", [2]),
                ("newPassword !== oldPassword (không trùng)", [3]),
                ("50 chuỗi mật khẩu hoàn toàn khác biệt", [4]),
                ("Trạng thái acc chuyển sang 'available'", [5]),
                ("secretAccount & secretPassword hợp lệ", [6]),
                ("Lưu vết lịch sử mật khẩu thành công", [7]),
                ("Mật khẩu cũ bị vô hiệu hóa hoàn toàn", [8]),
                ("Tự động tạo notification cho khách", [9]),
                ("Đánh dấu đã đọc và xóa thông báo thành công", [10])
            ])
        ],
        "types": ["N", "N", "N", "N", "N", "N", "N", "A", "A", "A"]
    },
    {
        "no": 8,
        "req": "Module 8: Đổi mật khẩu cá nhân",
        "class_name": "validation.js",
        "func_name": "validatePasswordChange",
        "code": "F_AUTH_CHG_PWD",
        "sheet": "F_AUTH_CHG_PWD",
        "desc": "Kiểm tra hợp lệ form đổi mật khẩu khách thuê (BVA 5-6 ký tự, mật khẩu cũ, khớp mật khẩu xác nhận)",
        "pre": "Khách hàng đã đăng nhập tài khoản cá nhân",
        "loc": 26,
        "count": 8,
        "inputs": [
            ("User đăng nhập", [
                ("Hợp lệ (user != null)", [1, 2, 3, 4, 5, 6, 7]),
                ("Chưa đăng nhập (user = null)", [8])
            ]),
            ("Mật khẩu hiện tại", [
                ("Đúng mật khẩu ('123456')", [1, 2, 3, 5, 6]),
                ("Sai mật khẩu ('wrongpass')", [4]),
                ("Để trống ('')", [7])
            ]),
            ("Mật khẩu mới", [
                ("Hợp lệ ('newpass123')", [1, 4, 7, 8]),
                ("5 ký tự (Dưới biên min 6)", [2]),
                ("6 ký tự (Tại biên min hợp lệ)", [3]),
                ("Trùng mật khẩu cũ ('123456')", [5]),
                ("Không khớp mật khẩu xác nhận", [6])
            ])
        ],
        "outputs": [
            ("Return", [
                ("success = true (Đổi mật khẩu thành công)", [1, 3]),
                ("error = 'Mật khẩu mới phải có ít nhất 6 ký tự'", [2]),
                ("error = 'Mật khẩu hiện tại không chính xác'", [4]),
                ("error = 'Mật khẩu mới không được trùng mật khẩu cũ'", [5]),
                ("error = 'Mật khẩu xác nhận không khớp'", [6]),
                ("error = 'Vui lòng nhập mật khẩu hiện tại'", [7]),
                ("error = 'Bạn chưa đăng nhập'", [8])
            ])
        ],
        "types": ["N", "B", "B", "A", "A", "A", "A", "A"]
    },
    {
        "no": 9,
        "req": "Module 9: Quản lý khách hàng CRM",
        "class_name": "validation.js / context",
        "func_name": "crudAndAutoSyncCRM",
        "code": "F_CRM_SYNC",
        "sheet": "F_CRM_SYNC",
        "desc": "Thao tác CRUD hồ sơ khách hàng và tự động đồng bộ khách mới khi đăng ký",
        "pre": "Đăng ký tài khoản ngoài trang chủ hoặc thao tác trong trang Quản lý khách hàng",
        "loc": 35,
        "count": 5,
        "inputs": [
            ("Thao tác CRM", [
                ("Thêm khách hàng thủ công", [1]),
                ("Cập nhật thông tin khách (SĐT, Email, Status)", [2]),
                ("Xóa khách hàng khỏi hệ thống", [3]),
                ("Cập nhật thông tin tài khoản kho game", [4]),
                ("Khách đăng ký mới ngoài trang chủ", [5])
            ])
        ],
        "outputs": [
            ("Return", [
                ("Thêm thành công khách hàng mới (KH00x)", [1]),
                ("Thông tin khách hàng được cập nhật chính xác", [2]),
                ("Khách hàng bị xóa thành công khỏi CRM", [3]),
                ("Kho tài khoản game được cập nhật thành công", [4]),
                ("Tự động đồng bộ ngay lập tức sang CRM Admin", [5])
            ])
        ],
        "types": ["N", "N", "N", "N", "N"]
    },
    {
        "no": 10,
        "req": "Module 10: Phân tách Yêu thích",
        "class_name": "favoriteUtils.js",
        "func_name": "getFavoritesKey",
        "code": "F_FAV_SEP",
        "sheet": "F_FAV_SEP",
        "desc": "Xác định chính xác storage key phân tách danh sách yêu thích độc lập theo User ID",
        "pre": "Người dùng thao tác thả tim tài khoản game hoặc đăng nhập",
        "loc": 22,
        "count": 5,
        "inputs": [
            ("Vai trò & Người dùng", [
                ("Tài khoản Quản trị viên (Admin)", [1, 4]),
                ("Khách hàng User 1", [2, 4, 5]),
                ("Khách hàng User 2", [5]),
                ("Khách vãng lai (Chưa đăng nhập)", [3])
            ])
        ],
        "outputs": [
            ("Return", [
                ("Key chuẩn: 'gamerent_fav_admin_01'", [1]),
                ("Key chuẩn: 'gamerent_fav_user_02'", [2]),
                ("Key chuẩn: 'gamerent_fav_guest'", [3]),
                ("Dữ liệu tim của Admin không lẫn sang User", [4]),
                ("Hai khách hàng có danh sách tim độc lập 100%", [5])
            ])
        ],
        "types": ["N", "N", "N", "N", "N"]
    }
]

def update_function_list_sheet(wb):
    print("-> Đang cập nhật sheet 'FunctionList'...")
    ws = wb["FunctionList"]
    if ws.views.sheetView:
        ws.views.sheetView[0].showGridLines = True
    ws["B4"] = "=Cover!B4"
    ws["B5"] = "=Cover!B5"
    ws["B7"] = (
        "Môi trường kiểm thử đơn vị (Unit Test Environment):\n"
        "1. Nền tảng: Node.js v20.x, React 19.x, Vite 8.x\n"
        "2. Framework: Vitest v5.0.1, jsdom simulated DOM environment\n"
        "3. Cơ sở dữ liệu: LocalStorage Mock Database Engine\n"
        "4. Tầng logic nghiệp vụ: src/utils/validation.js, favoriteUtils.js\n"
        "5. Tiêu chuẩn áp dụng: BVA, EP, Decision Table, UC1_Add New Product"
    )

    # Xóa dữ liệu cũ từ dòng 11 đến 100
    for r in range(11, 100):
        for c in range(1, 15):
            ws.cell(r, c).value = None

    # Thêm 10 chức năng mới
    for idx, f in enumerate(FUNCTIONS_DATA):
        r = 11 + idx
        fill = WHITE_FILL if idx % 2 == 0 else ZEBRA_FILL
        ws.row_dimensions[r].height = 24.0
        
        ws.cell(r, 1, f["no"])
        ws.cell(r, 2, f["req"])
        ws.cell(r, 3, f["class_name"])
        ws.cell(r, 4, f["func_name"])
        ws.cell(r, 5, f["code"])
        ws.cell(r, 6, f["sheet"])
        ws.cell(r, 7, f["desc"])
        ws.cell(r, 8, f["pre"])

        for c in range(1, 9):
            cell = ws.cell(r, c)
            align = ALIGN_CENTER if c in [1, 5, 6] else ALIGN_LEFT
            style_cell(cell, font=FONT_NORMAL, fill=fill, alignment=align, border=BORDER_ALL)

    ws.column_dimensions["A"].width = 6
    ws.column_dimensions["B"].width = 32
    ws.column_dimensions["C"].width = 20
    ws.column_dimensions["D"].width = 28
    ws.column_dimensions["E"].width = 18
    ws.column_dimensions["F"].width = 18
    ws.column_dimensions["G"].width = 65
    ws.column_dimensions["H"].width = 50

def update_test_report_sheet(wb):
    print("-> Đang cập nhật sheet 'Test Report'...")
    ws = wb["Test Report"]
    if ws.views.sheetView:
        ws.views.sheetView[0].showGridLines = True
    ws["B4"] = "=Cover!B4"
    ws["B5"] = "=Cover!B5"
    ws["E4"] = "=Cover!E4"
    ws["E5"] = "=Cover!E5"
    ws["B6"] = '=B5&"_"&"Test Report_v1.0"'
    ws["E6"] = "2026-03-24"
    ws["B7"] = "Báo cáo tổng hợp kết quả thực thi 100 Unit Test Cases cho 10 Module chức năng cốt lõi của hệ thống GameRent (Vitest Suite - 100% Passed)."

    # Unmerge và xóa các dòng data cũ từ dòng 11 đến 45
    for rng in list(ws.merged_cells.ranges):
        if rng.min_row >= 11:
            ws.unmerge_cells(str(rng))
    for r in range(11, 45):
        for c in range(1, 15):
            cell = ws.cell(r, c)
            if type(cell).__name__ != 'MergedCell':
                cell.value = None

    # Style header dòng 10
    ws.row_dimensions[10].height = 26.0
    for c in range(1, 10):
        style_cell(ws.cell(10, c), font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)

    # Thêm 10 dòng dữ liệu tham chiếu công thức chính xác sang 10 sheets
    for idx, f in enumerate(FUNCTIONS_DATA):
        r = 11 + idx
        fill = WHITE_FILL if idx % 2 == 0 else ZEBRA_FILL
        ws.row_dimensions[r].height = 23.0
        sheet_name = f["sheet"]

        ws.cell(r, 1, f["no"])
        ws.cell(r, 2, f["code"])
        ws.cell(r, 3, f"='{sheet_name}'!A7") # Passed
        ws.cell(r, 4, f"='{sheet_name}'!C7") # Failed
        ws.cell(r, 5, f"='{sheet_name}'!E7") # Untested
        ws.cell(r, 6, f"='{sheet_name}'!K7") # N (Normal)
        ws.cell(r, 7, f"='{sheet_name}'!L7") # A (Abnormal)
        ws.cell(r, 8, f"='{sheet_name}'!M7") # B (Boundary)
        ws.cell(r, 9, f"='{sheet_name}'!N7") # Total

        for c in range(1, 10):
            cell = ws.cell(r, c)
            align = ALIGN_CENTER if c != 2 else ALIGN_LEFT
            style_cell(cell, font=FONT_NORMAL, fill=fill, alignment=align, border=BORDER_ALL)

    # Sub total row (Dòng 21)
    sub_r = 21
    ws.row_dimensions[sub_r].height = 25.0
    ws.cell(sub_r, 2, "Sub total")
    ws.cell(sub_r, 3, f"=SUM(C11:C{sub_r-1})")
    ws.cell(sub_r, 4, f"=SUM(D11:D{sub_r-1})")
    ws.cell(sub_r, 5, f"=SUM(E11:E{sub_r-1})")
    ws.cell(sub_r, 6, f"=SUM(F11:F{sub_r-1})")
    ws.cell(sub_r, 7, f"=SUM(G11:G{sub_r-1})")
    ws.cell(sub_r, 8, f"=SUM(H11:H{sub_r-1})")
    ws.cell(sub_r, 9, f"=SUM(I11:I{sub_r-1})")

    for c in range(1, 10):
        cell = ws.cell(sub_r, c)
        align = ALIGN_CENTER if c != 2 else ALIGN_LEFT
        style_cell(cell, font=FONT_BOLD, fill=LIGHT_BLUE, alignment=align, border=BORDER_ALL)

    # Metric rows
    metrics = [
        (23, "Test coverage", f"=(C{sub_r}+D{sub_r})*100/(I{sub_r})", "%"),
        (24, "Test successful coverage", f"=C{sub_r}*100/(I{sub_r})", "%"),
        (25, "Normal case", f"=F{sub_r}*100/I{sub_r}", "%"),
        (26, "Abnormal case", f"=G{sub_r}*100/I{sub_r}", "%"),
        (27, "Boundary case", f"=H{sub_r}*100/I{sub_r}", "%"),
    ]

    for r_idx, label, formula, unit in metrics:
        ws.row_dimensions[r_idx].height = 23.0
        ws.cell(r_idx, 2, label)
        ws.cell(r_idx, 4, formula)
        ws.cell(r_idx, 5, unit)
        style_cell(ws.cell(r_idx, 2), font=FONT_BOLD, fill=WHITE_FILL, alignment=ALIGN_LEFT, border=BORDER_TOP_BOTTOM)
        style_cell(ws.cell(r_idx, 4), font=FONT_BOLD, fill=WHITE_FILL, alignment=ALIGN_RIGHT, border=BORDER_TOP_BOTTOM)
        style_cell(ws.cell(r_idx, 5), font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT, border=BORDER_TOP_BOTTOM)

    ws.column_dimensions["A"].width = 6
    ws.column_dimensions["B"].width = 24
    for c in ["C", "D", "E", "F", "G", "H"]:
        ws.column_dimensions[c].width = 14
    ws.column_dimensions["I"].width = 18

def create_function_sheet(wb, f_data):
    sheet_name = f_data["sheet"]
    print(f"-> Đang tạo sheet kiểm thử: '{sheet_name}' ({f_data['count']} test cases)...")
    
    if sheet_name in wb.sheetnames:
        del wb[sheet_name]
    ws = wb.create_sheet(title=sheet_name)
    if ws.views.sheetView:
        ws.views.sheetView[0].showGridLines = True

    # 1. Metadata Block
    ws["A2"] = "Function Code"
    ws["C2"] = f_data["code"]
    ws["E2"] = "Function Name"
    ws["G2"] = f_data["func_name"]

    ws["A3"] = "Created By"
    ws["C3"] = "Nhóm 15"
    ws["E3"] = "Executed By"
    ws["G3"] = "Nhóm 15 (Automation)"

    ws["A4"] = "Lines of code"
    ws["C4"] = f_data["loc"]

    ws["A5"] = "Test requirement"
    ws["C5"] = f_data["desc"]

    # Style metadata
    for r in range(2, 6):
        ws.row_dimensions[r].height = 22.0
        style_cell(ws.cell(r, 1), font=FONT_BOLD, fill=LIGHT_BLUE, alignment=ALIGN_LEFT)
        style_cell(ws.cell(r, 3), font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT)
        if r in [2, 3]:
            style_cell(ws.cell(r, 5), font=FONT_BOLD, fill=LIGHT_BLUE, alignment=ALIGN_LEFT)
            style_cell(ws.cell(r, 7), font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT)

    # 2. Metrics Block (Row 6 - 7)
    ws["A6"] = "Passed"
    ws["C6"] = "Failed"
    ws["E6"] = "Untested"
    ws["K6"] = "N/A/B"
    ws["N6"] = "Total Test Cases"

    # End column letter
    end_col_idx = 4 + f_data["count"] # E is 5, so 4 + count
    end_col_letter = get_column_letter(end_col_idx)

    ws.row_dimensions[6].height = 22.0
    ws.row_dimensions[7].height = 24.0

    for c in ["A", "C", "E", "K", "L", "M", "N"]:
        col_i = openpyxl.utils.column_index_from_string(c)
        style_cell(ws.cell(6, col_i), font=FONT_HEADER_WHITE, fill=SUB_HEADER, alignment=ALIGN_CENTER)
        style_cell(ws.cell(7, col_i), font=FONT_BOLD, fill=LIGHT_BLUE, alignment=ALIGN_CENTER)

    # 3. Test Cases Header (Row 9 - 10)
    ws.row_dimensions[8].height = 10.0
    ws.row_dimensions[9].height = 24.0
    ws.row_dimensions[10].height = 22.0

    ws["A10"] = "Condition"
    ws["B10"] = "Precondition"
    ws["D10"] = "N/A"

    style_cell(ws["A10"], font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)
    style_cell(ws["B10"], font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)
    style_cell(ws["D10"], font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)

    for i in range(1, f_data["count"] + 1):
        col = 4 + i
        tcid = f"UTCID{i:02d}"
        cell_9 = ws.cell(9, col, tcid)
        style_cell(cell_9, font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)
        cell_10 = ws.cell(10, col, None)
        style_cell(cell_10, font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)

    # 4. Inputs Block
    curr_row = 12
    for param_name, options in f_data["inputs"]:
        # Tên tham số
        ws.row_dimensions[curr_row].height = 22.0
        cell_p = ws.cell(curr_row, 2, param_name)
        style_cell(cell_p, font=FONT_BOLD, fill=LIGHT_BLUE, alignment=ALIGN_LEFT)
        for c in range(1, end_col_idx + 1):
            if c != 2:
                style_cell(ws.cell(curr_row, c), font=FONT_BOLD, fill=LIGHT_BLUE, alignment=ALIGN_CENTER)
        curr_row += 1

        for opt_label, matched_tcs in options:
            ws.row_dimensions[curr_row].height = 21.0
            cell_opt = ws.cell(curr_row, 4, opt_label)
            style_cell(cell_opt, font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT)
            style_cell(ws.cell(curr_row, 1), fill=WHITE_FILL)
            style_cell(ws.cell(curr_row, 2), fill=WHITE_FILL)
            style_cell(ws.cell(curr_row, 3), fill=WHITE_FILL)

            for i in range(1, f_data["count"] + 1):
                col = 4 + i
                val = "O" if i in matched_tcs else None
                cell_val = ws.cell(curr_row, col, val)
                style_cell(cell_val, font=FONT_BOLD, fill=WHITE_FILL, alignment=ALIGN_CENTER)
            curr_row += 1

    # 5. Confirm / Outputs Block
    confirm_header_row = curr_row + 1
    ws.row_dimensions[confirm_header_row].height = 24.0
    ws.cell(confirm_header_row, 1, "Confirm")
    ws.cell(confirm_header_row, 2, "Return / Exception")
    style_cell(ws.cell(confirm_header_row, 1), font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)
    style_cell(ws.cell(confirm_header_row, 2), font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_LEFT)
    for c in range(3, end_col_idx + 1):
        style_cell(ws.cell(confirm_header_row, c), font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)

    curr_row = confirm_header_row + 1
    for out_group, options in f_data["outputs"]:
        for opt_label, matched_tcs in options:
            ws.row_dimensions[curr_row].height = 21.0
            cell_out = ws.cell(curr_row, 4, opt_label)
            style_cell(cell_out, font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT)
            style_cell(ws.cell(curr_row, 1), fill=WHITE_FILL)
            style_cell(ws.cell(curr_row, 2), fill=WHITE_FILL)
            style_cell(ws.cell(curr_row, 3), fill=WHITE_FILL)

            for i in range(1, f_data["count"] + 1):
                col = 4 + i
                val = "O" if i in matched_tcs else None
                cell_val = ws.cell(curr_row, col, val)
                style_cell(cell_val, font=FONT_BOLD, fill=WHITE_FILL, alignment=ALIGN_CENTER)
            curr_row += 1

    # 6. Result & Execution Rows placed DYNAMICALLY after ALL conditions
    r_type = curr_row + 1
    r_pass = r_type + 1
    r_date = r_pass + 1
    r_bug = r_date + 1

    ws.row_dimensions[r_type].height = 23.0
    ws.row_dimensions[r_pass].height = 23.0
    ws.row_dimensions[r_date].height = 21.0
    ws.row_dimensions[r_bug].height = 21.0

    ws.cell(r_type, 1, "Result")
    ws.cell(r_type, 2, "Type(N : Normal, A : Abnormal, B : Boundary)")
    style_cell(ws.cell(r_type, 1), font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)
    style_cell(ws.cell(r_type, 2), font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_LEFT)
    style_cell(ws.cell(r_type, 3), font=FONT_HEADER_WHITE, fill=NAVY_HEADER)
    style_cell(ws.cell(r_type, 4), font=FONT_HEADER_WHITE, fill=NAVY_HEADER)

    ws.cell(r_pass, 2, "Passed/Failed")
    style_cell(ws.cell(r_pass, 1), fill=WHITE_FILL)
    style_cell(ws.cell(r_pass, 2), font=FONT_BOLD, fill=WHITE_FILL, alignment=ALIGN_LEFT)
    style_cell(ws.cell(r_pass, 3), fill=WHITE_FILL)
    style_cell(ws.cell(r_pass, 4), fill=WHITE_FILL)

    ws.cell(r_date, 2, "Executed Date")
    style_cell(ws.cell(r_date, 1), fill=WHITE_FILL)
    style_cell(ws.cell(r_date, 2), font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT)
    style_cell(ws.cell(r_date, 3), fill=WHITE_FILL)
    style_cell(ws.cell(r_date, 4), fill=WHITE_FILL)

    ws.cell(r_bug, 2, "Defect ID")
    style_cell(ws.cell(r_bug, 1), fill=WHITE_FILL)
    style_cell(ws.cell(r_bug, 2), font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_LEFT)
    style_cell(ws.cell(r_bug, 3), fill=WHITE_FILL)
    style_cell(ws.cell(r_bug, 4), fill=WHITE_FILL)

    for i in range(1, f_data["count"] + 1):
        col = 4 + i
        t_type = f_data["types"][i - 1]
        
        # Type
        cell_t = ws.cell(r_type, col, t_type)
        style_cell(cell_t, font=FONT_HEADER_WHITE, fill=NAVY_HEADER, alignment=ALIGN_CENTER)

        # Passed 'P'
        cell_p = ws.cell(r_pass, col, "P")
        style_cell(cell_p, font=FONT_PASS, fill=GREEN_PASS, alignment=ALIGN_CENTER)

        # Executed Date
        cell_d = ws.cell(r_date, col, "2026-03-24")
        style_cell(cell_d, font=FONT_ITALIC, fill=WHITE_FILL, alignment=ALIGN_CENTER)

        # Defect ID
        cell_b = ws.cell(r_bug, col, "")
        style_cell(cell_b, font=FONT_NORMAL, fill=WHITE_FILL, alignment=ALIGN_CENTER)

    # Dynamic formulas for row 7 based on actual r_pass and r_type rows
    ws["A7"] = f'=COUNTIF(E{r_pass}:{end_col_letter}{r_pass},"P")'
    ws["C7"] = f'=COUNTIF(E{r_pass}:{end_col_letter}{r_pass},"F")'
    ws["E7"] = f'=SUM(N7,-A7,-C7)'
    ws["K7"] = f'=COUNTIF(E{r_type}:{end_col_letter}{r_type},"N")'
    ws["L7"] = f'=COUNTIF(E{r_type}:{end_col_letter}{r_type},"A")'
    ws["M7"] = f'=COUNTIF(E{r_type}:{end_col_letter}{r_type},"B")'
    ws["N7"] = f'=COUNTA(E9:{end_col_letter}9)'

    # Set column widths
    ws.column_dimensions["A"].width = 12
    ws.column_dimensions["B"].width = 24
    ws.column_dimensions["C"].width = 12
    ws.column_dimensions["D"].width = 48
    for i in range(1, f_data["count"] + 1):
        col_letter = get_column_letter(4 + i)
        ws.column_dimensions[col_letter].width = 9.5

def main():
    print(f"=== BẮT ĐẦU CẬP NHẬT FILE: {FILE_PATH} ===")
    wb = openpyxl.load_workbook(FILE_PATH)
    
    # 1. Cập nhật Cover
    update_cover_sheet(wb)

    # 2. Cập nhật FunctionList
    update_function_list_sheet(wb)

    # 3. Tạo 10 Sheets kiểm thử chức năng
    for f in FUNCTIONS_DATA:
        create_function_sheet(wb, f)

    # 4. Cập nhật Test Report
    update_test_report_sheet(wb)

    # 5. Xóa các sheet cũ thừa ('findMax', 'Function2', 'Code')
    for old_s in ["findMax", "Function2", "Code"]:
        if old_s in wb.sheetnames:
            print(f"-> Đang xóa sheet mẫu cũ: '{old_s}'...")
            del wb[old_s]

    # Lưu file
    wb.save(FILE_PATH)
    print(f"✅ ĐÃ HOÀN TẤT CẬP NHẬT VÀ LƯU THÀNH CÔNG VÀO:")
    print(f"   {FILE_PATH}")
    print(f"   - Tổng số Sheet: {len(wb.sheetnames)}")
    print(f"   - Danh sách Sheets: {wb.sheetnames}")

if __name__ == "__main__":
    main()
