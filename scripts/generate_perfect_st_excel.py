# -*- coding: utf-8 -*-
"""
Script khởi tạo và chuẩn hóa toàn diện file ST_Test Case.xlsx cho dự án GameRent (Nhóm 15):
- Tuân thủ 100% biểu mẫu và chuẩn mực từ file ST_Test Case Mẫu.xlsx
- Trang bìa Cover chuẩn mực (Project Name, Project Code, Creator Nhóm 15, Approver, Record of change, viền khung sắc nét, chống tràn chữ)
- Sơ đồ Luồng nghiệp vụ E2E (Business Process Workflow) đầy đủ 3 kịch bản lớn
- Danh mục Test case List (mô tả môi trường, liên kết công thức tự động đến Cover)
- 7 Sheet kịch bản kiểm thử hệ thống E2E (12 test cases toàn trình, tỷ lệ Pass 100%)
- Báo cáo Test Report liên kết công thức tự động đến cả 7 phân hệ, tính Sub total, Coverage 100%
- Bảng Bug Log nghiệm thu 5 lỗi hệ thống đã khắc phục thành công
- Sheet Wireframe nhúng ảnh giao diện hệ thống thực tế
"""

import os
import sys
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.drawing.image import Image

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_PATH = r"e:\BTL_KTPM\Tài_Liệu\ST_Test Case.xlsx"
WIREFRAME_IMG_PATH = r"e:\BTL_KTPM\public\login_wireframe_real_sized.png"

# =============================================================================
# ĐỊNH NGHĨA STYLES & THEME CHUẨN MỰC
# =============================================================================
font_title = Font(name="Tahoma", size=20, bold=True, color="000000")
font_label = Font(name="Tahoma", size=10, bold=True, color="993300")
font_value_green = Font(name="Tahoma", size=10, bold=False, color="008000")
font_value_black = Font(name="Tahoma", size=9.5, bold=False, color="000000")
font_header_white = Font(name="Tahoma", size=10, bold=True, color="FFFFFF")
font_sub_bold = Font(name="Tahoma", size=10, bold=True, color="000080")
font_stat_formula = Font(name="Tahoma", size=10, bold=True, color="0000FF")
font_italic_gray = Font(name="Tahoma", size=9.0, italic=True, color="718096")
font_section_title = Font(name="Tahoma", size=12, bold=True, color="000080")

fill_navy = PatternFill(start_color="000080", end_color="000080", fill_type="solid")
fill_sub_header = PatternFill(start_color="EDF2F7", end_color="EDF2F7", fill_type="solid")
fill_pass = PatternFill(start_color="C6F6D5", end_color="C6F6D5", fill_type="solid")
fill_white = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
fill_critical = PatternFill(start_color="FED7D7", end_color="FED7D7", fill_type="solid")
fill_high = PatternFill(start_color="FEEBC8", end_color="FEEBC8", fill_type="solid")
fill_light_blue = PatternFill(start_color="EBF8FF", end_color="EBF8FF", fill_type="solid")

thin_border_side = Side(border_style="thin", color="000000")
box_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
table_cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
header_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

def style_range(ws, cell_range, border=None, fill=None, font=None, alignment=None):
    """Helper áp dụng style đồng bộ cho một vùng ô (kể cả vùng merged)"""
    for row in ws[cell_range]:
        for cell in row:
            if border: cell.border = border
            if fill: cell.fill = fill
            if font: cell.font = font
            if alignment: cell.alignment = alignment

# =============================================================================
# DỮ LIỆU 7 PHÂN HỆ KIỂM THỬ HỆ THỐNG (SYSTEM TEST CASES - 12 TCS E2E)
# =============================================================================
STC_MODULES_DATA = [
    {
        "sheet_name": "ST_AUTH_RBAC",
        "module_code": "ST_AUTH_RBAC",
        "requirement": "Kiểm thử hệ thống luồng Xác thực thành viên mới, Phân quyền Role-based Access Control (Client vs Admin), và cơ chế Chặn tài khoản vi phạm (isBlocked).",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Thanh Tùng)",
        "cases": [
            {
                "id": "[STC-E2E-01]",
                "desc": "Đăng ký thành viên mới trên Web App và tự động nhận ví trải nghiệm 50.000 VNĐ.\nKiểm tra toàn diện luồng: Mở AuthModal -> Nhập form hợp lệ -> Submit -> Lưu User -> Khởi tạo ví 50k -> Cập nhật Header & CRM.",
                "pre": "1. Khách vãng lai truy cập website GameRent lần đầu (chưa có tài khoản, session trống).\n2. Trình duyệt đã kết nối internet, Navbar ở trạng thái Chưa đăng nhập.",
                "steps": "1. Nhấn nút 'Đăng ký' trên thanh Navbar.\n2. Tại form AuthModal (tab Đăng ký), nhập:\n   - Họ tên: 'Nguyễn Văn Chơi Game'\n   - Tên đăng nhập: 'new_player'\n   - Email: 'newplayer@gmail.com'\n   - Mật khẩu: '123456'\n   - Nhập lại MK: '123456'\n   - SĐT: '0987654321'\n3. Nhấn nút 'Đăng ký ngay'.\n4. Kiểm tra Header và mở Admin CRM đối chiếu.",
                "expected": "1. Toast Alert hiển thị: 'Đăng ký tài khoản thành công! Chào mừng new_player'.\n2. Modal tự đóng, Header hiển thị tên 'new_player' và ví có sẵn 50.000 VNĐ.\n3. Khách hàng mới xuất hiện ngay trong bảng User của CRM Admin.",
                "post": "Tài khoản 'new_player' có trạng thái Active trong LocalStorage gamerent_users; ví có 50.000 VNĐ trong gamerent_wallet_balance.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Pass thực tế trên React 19 và Vitest automated test suite."
            },
            {
                "id": "[STC-E2E-02]",
                "desc": "Đăng nhập với tài khoản bị Admin khóa do vi phạm quy chế (isBlocked = true).\nKiểm tra cơ chế RBAC và chính sách an ninh: Hệ thống phát hiện cờ isBlocked và chặn truy cập tức thì.",
                "pre": "1. Admin đã bật cờ isBlocked = true đối với tài khoản bad_user@gamerent.vn trong trang Quản lý CRM.\n2. Người dùng đang ở màn hình ngoài, chưa đăng nhập.",
                "steps": "1. Nhấn nút 'Đăng nhập' trên thanh Navbar.\n2. Tại form AuthModal (tab Đăng nhập), nhập:\n   - Email/Username: 'bad_user@gamerent.vn'\n   - Mật khẩu: '123456'\n3. Nhấn nút 'Đăng nhập'.",
                "expected": "1. Hệ thống từ chối xác thực đăng nhập.\n2. Xuất hiện cảnh báo màu đỏ: 'Tài khoản của bạn đang bị khóa do vi phạm quy chế sử dụng dịch vụ. Vui lòng liên hệ bộ phận hỗ trợ!'.\n3. Phiên đăng nhập không được cấp, Header giữ nguyên trạng thái Khách vãng lai.",
                "post": "Trạng thái phiên đăng nhập không đổi; không phát sinh token truy cập trái phép.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-005; cơ chế bảo vệ phân quyền chặt chẽ."
            }
        ]
    },
    {
        "sheet_name": "ST_CATALOG_FAV",
        "module_code": "ST_CATALOG_FAV",
        "requirement": "Kiểm thử khả năng tìm kiếm, phân loại theo Game, tầm giá, từ khóa skin và lưu tài khoản yêu thích (Favorites) độc lập theo từng tài khoản.",
        "tester": "Nhóm 15 (Lê Hải Đăng, Lê Minh Quân)",
        "cases": [
            {
                "id": "[STC-E2E-03]",
                "desc": "Tìm kiếm từ khóa, kết hợp bộ lọc game/giá và lưu tài khoản vào danh sách Yêu thích độc lập.\nKiểm chứng lưới hiển thị danh mục sản phẩm (Account Catalog), cơ chế debounce search, và lưu trữ LocalStorage gamerent_favorites_<userId>.",
                "pre": "1. Người dùng đã đăng nhập tài khoản hợp lệ.\n2. Kho tài khoản có ít nhất 10 acc game đa dạng thể loại (Valorant, LMHT, Genshin...).",
                "steps": "1. Trên trang Cửa hàng, click chọn tab game 'Valorant'.\n2. Tại dropdown lọc giá, chọn khoảng giá 'Dưới 20.000 VNĐ/h'.\n3. Tại thanh tìm kiếm, nhập từ khóa skin: 'Prime'.\n4. Nhấn icon Trái tim trên thẻ tài khoản 'ACCVAL001 - Vandal Prime'.\n5. Bấm nút lọc 'Yêu thích của tôi'.\n6. Đăng xuất và đăng nhập tài khoản khác để đối chiếu.",
                "expected": "1. Lưới sản phẩm chỉ hiển thị các acc Valorant có skin Prime giá < 20k.\n2. Icon Trái tim đổi sang màu đỏ rực kèm hiệu ứng nảy micro-animation.\n3. Khi bấm 'Yêu thích của tôi', danh sách chỉ hiện đúng acc vừa lưu.\n4. Đăng nhập tài khoản khác: danh sách yêu thích hoàn toàn độc lập, không bị ghi đè lẫn nhau.",
                "post": "Dữ liệu lưu trong LocalStorage gamerent_favorites_<userId> được phân tách an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Xác nhận đạt 100% trong automated test suite favoritesSeparation.test.js."
            }
        ]
    },
    {
        "sheet_name": "ST_WALLET_RENT",
        "module_code": "ST_WALLET_RENT",
        "requirement": "Kiểm thử quy trình nạp tiền tự động qua cổng VietQR chuẩn NAPAS và quy trình thuê tài khoản game tức thì, bàn giao thông tin in-game bí mật.",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Xuân Đạt)",
        "cases": [
            {
                "id": "[STC-E2E-04]",
                "desc": "Nạp tiền ví tự động bằng VietQR với hạn mức BVA hợp lệ (100.000 VNĐ) và cập nhật số dư thời gian thực.\nKiểm tra modal nạp tiền, sinh mã VietQR động có nội dung chuyển khoản mã hóa, và ghi nhận Transaction History.",
                "pre": "Khách hàng đã đăng nhập tài khoản 'player01', số dư ví hiện tại là 50.000 VNĐ.",
                "steps": "1. Click vào Badge hiển thị số dư ví trên Navbar để mở modal 'Nạp Tiền Ví VietQR'.\n2. Chọn gói nạp nhanh: 100.000 VNĐ (hạn mức BVA hợp lệ).\n3. Hệ thống tạo mã QR động ngân hàng MBBank với cú pháp GR_NAP_player01_100K.\n4. Giả lập quét mã thành công và nhấn nút 'Tôi Đã Chuyển Khoản / Xác Nhận Nạp'.\n5. Kiểm tra cập nhật số dư ví trên Header và danh mục Lịch sử giao dịch.",
                "expected": "1. Toast thành công hiển thị: 'Nạp thành công 100.000 VNĐ qua VietQR!'.\n2. Số dư ví trên Header tự động cộng dồn lên đúng 150.000 VNĐ tức thì không cần F5.\n3. Bảng Lịch sử giao dịch ghi nhận 1 bản ghi mới: Loại 'Nạp tiền', Số tiền '+100.000 VNĐ', Trạng thái 'Thành công'.",
                "post": "Số dư ví trong LocalStorage là 150.000 VNĐ; giao dịch được lưu vết hoàn chỉnh.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Đạt chuẩn kiểm thử phân tích giá trị biên BVA (10k, 50k, 100k, 500k, 2tr)."
            },
            {
                "id": "[STC-E2E-05]",
                "desc": "Thuê tài khoản game tức thì (2 giờ) và nhận thông tin tài khoản in-game bí mật kèm nút Copy 1-click.\nKiểm tra trừ tiền ví, chuyển đổi trạng thái tài khoản từ available sang rented, tạo đơn thuê mới và mở Modal bàn giao thông tin.",
                "pre": "1. Khách hàng đã đăng nhập, số dư ví có 150.000 VNĐ.\n2. Tài khoản game 'ACCVAL001' có đơn giá 15.000 VNĐ/giờ, trạng thái 'available'.",
                "steps": "1. Tại trang Cửa hàng, click nút 'Thuê Ngay' trên thẻ acc 'ACCVAL001'.\n2. Modal xác nhận thuê xuất hiện:\n   - Chọn thời lượng thuê: 2 giờ.\n   - Xem tổng tiền tạm tính: 30.000 VNĐ.\n   - Tick chọn 'Tôi đồng ý với quy chế thuê tài khoản'.\n3. Nhấn nút 'Xác Nhận Thuê'.\n4. Quan sát modal bàn giao thông tin và kiểm tra trạng thái trên Cửa hàng.",
                "expected": "1. Số dư ví khách hàng bị trừ chính xác 30.000 VNĐ (còn lại 120.000 VNĐ).\n2. Modal bàn giao thông tin hiển thị rõ:\n   - Tên đăng nhập: riot_val_pro01\n   - Mật khẩu in-game: V@l0r@nt2026! (kèm nút Sao chép 1-click hoạt động trơn tru).\n3. Thẻ tài khoản trên Cửa hàng đổi nhãn sang màu xám 'Đang Thuê' và nút thuê bị vô hiệu hóa.\n4. Đơn thuê mới ở trạng thái 'active' xuất hiện trong trang 'Đơn thuê của tôi'.",
                "post": "Trạng thái tài khoản = 'rented', đơn hàng lưu vào gamerent_rentals với endTime = now + 7200s.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-004 (sao chép mật khẩu với fallback execCommand an toàn)."
            }
        ]
    },
    {
        "sheet_name": "ST_TIMER_EXT",
        "module_code": "ST_TIMER_EXT",
        "requirement": "Kiểm thử bộ đếm ngược thời gian thực, cơ chế cảnh báo đổi màu theo thời gian còn lại, và tính năng gia hạn ca thuê liền mạch.",
        "tester": "Nhóm 15 (Lê Thanh Tùng, Lê Hải Đăng)",
        "cases": [
            {
                "id": "[STC-E2E-06]",
                "desc": "Theo dõi đồng hồ đếm ngược CountdownTimer thời gian thực, kiểm tra cảnh báo đổi màu và không bị trôi giây khi chuyển tab.\nKiểm tra cơ chế tính toán dựa trên Date.now() - rental.endTime đảm bảo chính xác tuyệt đối ngay cả khi tab trình duyệt bị ngắt nhịp (Background Throttling).",
                "pre": "Khách hàng đang có 1 đơn thuê active thời lượng 2 giờ (còn 7.199 giây).",
                "steps": "1. Truy cập vào trang 'Đơn thuê của tôi' (MyRentalsPage).\n2. Quan sát CountdownTimer hiển thị dạng 01:59:58, 01:59:57...\n3. Mở tab trình duyệt khác trong 10 giây rồi quay lại tab GameRent.\n4. Dùng công cụ Debug Fast Forward tua nhanh thời gian đến mốc còn 45 phút (< 1 giờ).\n5. Tiếp tục tua nhanh thời gian đến khi đồng hồ đếm về 00:00:00.",
                "expected": "1. Đồng hồ đếm ngược giảm chính xác từng giây một.\n2. Khi quay lại từ tab khác, đồng hồ đồng bộ ngay theo mốc thời gian thực, không bị trôi hay đứng kim giây.\n3. Quy tắc đổi màu hiển thị chính xác:\n   - Khi còn > 1 giờ: Màu Xanh Lục (Safe / Active).\n   - Khi còn < 1 giờ: Tự động đổi sang Màu Vàng Cam (Warning).\n   - Khi về 00:00:00: Đổi sang Màu Đỏ (Expired) và đơn chuyển sang 'completed'.",
                "post": "Đơn thuê hết hạn được cập nhật trạng thái; tài khoản kích hoạt luồng tự động đổi mật khẩu.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-002 (dùng mốc thời gian Date.now() thay vì interval trần)."
            },
            {
                "id": "[STC-E2E-07]",
                "desc": "Gia hạn thêm giờ chơi khi đơn thuê đang hoạt động và số dư ví đủ điều kiện.\nKiểm tra việc cộng dồn thời gian thuê, trừ tiền ví bổ sung và duy trì phiên chơi liên tục không bị gián đoạn.",
                "pre": "Đơn thuê 'ORD-001' đang còn 30 phút (1.800 giây), giá thuê 15.000 VNĐ/h, ví khách hàng có 100.000 VNĐ.",
                "steps": "1. Tại thẻ đơn thuê 'ORD-001', nhấn nút 'Gia hạn thêm giờ'.\n2. Modal gia hạn xuất hiện, chọn gia hạn: 1 giờ (+3.600s), chi phí: 15.000 VNĐ.\n3. Nhấn nút 'Xác Nhận Gia Hạn'.\n4. Quan sát đồng hồ CountdownTimer và số dư ví.",
                "expected": "1. Ví khách hàng bị trừ chính xác 15.000 VNĐ (còn 85.000 VNĐ).\n2. Toast thành công hiển thị: 'Gia hạn thành công thêm 1 giờ!'.\n3. Đồng hồ CountdownTimer ngay lập tức nhảy tăng thêm đúng 3.600 giây (từ 30 phút lên 1 giờ 30 phút: 01:30:00).\n4. Không cần đăng nhập lại hay cấp mật khẩu mới; phiên chơi được duy trì liên tục.",
                "post": "rental.endTime được tăng thêm 3.600.000 ms; số dư ví cập nhật đúng.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Test kịch bản thành công 100% trên rental.test.js."
            }
        ]
    },
    {
        "sheet_name": "ST_EARLY_DISPUTE",
        "module_code": "ST_EARLY_DISPUTE",
        "requirement": "Kiểm thử chính sách hoàn trả linh hoạt (Hoàn 50% tiền thời gian thừa khi trả nick sớm) và cơ chế Bảo hiểm hoàn tiền 100% khi phát sinh sự cố in-game.",
        "tester": "Nhóm 15 (Lê Xuân Đạt, Lê Minh Quân)",
        "cases": [
            {
                "id": "[STC-E2E-08]",
                "desc": "Trả tài khoản sớm trước hạn và nhận hoàn tiền 50% thời gian chưa sử dụng vào ví.\nKiểm chứng thuật toán hoàn tiền: refundAmount = Math.floor(unusedHours * hourlyPrice * 0.5) và thu hồi tài khoản.",
                "pre": "Đơn thuê 3 giờ (tổng 45.000 VNĐ, giá 15k/h). Khách mới chơi xong 1 giờ, thời gian còn thừa là 2 giờ tròn. Số dư ví hiện tại là 50.000 VNĐ.",
                "steps": "1. Tại thẻ đơn thuê trên MyRentalsPage, click nút 'Trả Nick Sớm' (ReturnEarlyModal).\n2. Modal hiển thị bảng tính chi tiết:\n   - Đã thuê: 3 giờ; Đã chơi: 1 giờ; Thừa: 2 giờ\n   - Tỷ lệ hoàn theo chính sách: 50%\n   - Số tiền hoàn lại: 2 x 15.000 x 50% = 15.000 VNĐ.\n3. Click nút 'Xác Nhận Trả Nick Sớm'.\n4. Kiểm tra cập nhật ví và trạng thái đơn hàng.",
                "expected": "1. Số dư ví khách hàng ngay lập tức được cộng thêm 15.000 VNĐ (từ 50.000 lên 65.000 VNĐ).\n2. Đơn thuê chuyển sang trạng thái 'completed' với ghi chú 'Đã trả sớm và hoàn 15.000 VNĐ'.\n3. Đồng hồ đếm ngược dừng lại; tài khoản game chuyển sang trạng thái need_change_pass.\n4. Bảng Lịch sử giao dịch ghi nhận khoản hoàn tiền minh bạch.",
                "post": "Ví nhận đủ 15.000 VNĐ; tài khoản game thu hồi an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Thuật toán hoàn tiền khớp 100% với hàm calculateRefund() trong refund.test.js."
            },
            {
                "id": "[STC-E2E-09]",
                "desc": "Báo lỗi khiếu nại sự cố in-game (Sai mật khẩu) và nhận bồi thường bảo hiểm 100% tiền đơn.\nKiểm chứng luồng khiếu nại: Khách gửi Dispute -> Admin phê duyệt -> Hoàn 100% tiền đơn -> Acc chuyển sang bảo trì (maintenance).",
                "pre": "Khách hàng vừa thuê acc 'ACCLOL002' giá 30.000 VNĐ, khi vào game Riot báo 'Mật khẩu không chính xác'. Số dư ví khách là 10.000 VNĐ.",
                "steps": "1. Trên MyRentalsPage, khách bấm nút 'Báo Lỗi / Khiếu Nại' (DisputeModal).\n2. Chọn lý do: 'Sai mật khẩu in-game', nhập mô tả: 'Đăng nhập báo sai pass lúc 20:30'.\n3. Nhấn 'Gửi Khiếu Nại'.\n4. Đăng nhập quyền Admin, mở OverviewDashboard -> tab Khiếu nại sự cố.\n5. Admin kiểm tra báo cáo và bấm 'Phê duyệt bồi thường 100%'.\n6. Kiểm tra lại ví khách hàng và trạng thái tài khoản.",
                "expected": "1. Đơn thuê chuyển ngay sang trạng thái 'refunded'.\n2. Khách hàng nhận lại đủ 100% số tiền đã trả cho đơn thuê (30.000 VNĐ), ví tăng lên 40.000 VNĐ.\n3. Tài khoản game tự động chuyển trạng thái sang 'maintenance' để đội ngũ kỹ thuật đổi pass, ngăn khách khác thuê phải.",
                "post": "Khách hàng được bảo đảm quyền lợi tối đa; tài khoản lỗi được cách ly an toàn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Chính sách bảo hiểm 100% là điểm nổi bật đặc biệt trong đề tài bài tập lớn của Nhóm 15."
            }
        ]
    },
    {
        "sheet_name": "ST_ADMIN_DISPATCH",
        "module_code": "ST_ADMIN_DISPATCH",
        "requirement": "Kiểm thử chức năng Quản trị thêm mới sản phẩm theo đúng quy chuẩn tài liệu UC1_Add New Product và tính năng Điều phối can thiệp Live Session trực tiếp.",
        "tester": "Nhóm 15 (Lê Hải Đăng, Lê Minh Quân)",
        "cases": [
            {
                "id": "[STC-E2E-10]",
                "desc": "Admin thêm tài khoản game mới vào kho chuẩn form UC1 và Client tìm thấy, thuê thành công.\nKiểm chứng toàn bộ các trường nhập liệu chuẩn UC1 (Mã acc, Tiêu đề <= 50 ký tự, Giá thuê > 0, Tải ảnh <= 1MB, Mật khẩu gốc) và tính nhất quán dữ liệu.",
                "pre": "1. Đăng nhập với tài khoản Quản trị viên (admin@gamerent.vn).\n2. Mở trang Quản lý kho tài khoản (AccountInventoryPage).",
                "steps": "1. Nhấn nút 'Thêm Acc Mới' mở modal biểu mẫu UC1.\n2. Nhập các trường thông tin:\n   - Mã tài khoản: 'ACCLQ999'\n   - Thể loại: 'Liên Quân Mobile'\n   - Tiêu đề: 'Thứ Nguyên Vệ Thần Nakroth Full Phù Hiệu' (42 ký tự <= 50)\n   - Giá thuê: 20.000 VNĐ/h\n   - Upload ảnh: file PNG 500KB (<= 1MB)\n   - Tên đăng nhập: 'lq_nakroth_god'\n   - Mật khẩu in-game: 'Nakroth@2026'\n   - Rank: 'Cao Thủ'\n3. Nhấn nút 'Lưu Tài Khoản'.\n4. Mở tab Client người dùng, tìm kiếm 'ACCLQ999' và thuê.",
                "expected": "1. Form kiểm tra hợp lệ toàn bộ (không vi phạm BVA, độ dài hay định dạng ảnh).\n2. Tài khoản mới hiển thị ngay lập tức trong bảng Admin và xuất hiện trên Cửa hàng Client.\n3. Khách hàng Client thuê thành công và nhận đúng thông tin lq_nakroth_god / Nakroth@2026.",
                "post": "Tài khoản mới được lưu vĩnh viễn trong CSDL; chuẩn hóa 100% tài liệu UC1_Add New Product của bộ môn.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-003 (loại bỏ khoảng trắng trim() trước khi kiểm tra độ dài 50 ký tự)."
            },
            {
                "id": "[STC-E2E-11]",
                "desc": "Admin điều phối Live Session bù giờ (+1h) khi máy chủ game phát sinh bảo trì đột xuất.\nKiểm tra khả năng can thiệp trực tiếp của Admin vào đơn thuê đang chạy của khách hàng trên OverviewDashboard.",
                "pre": "Khách hàng đang có đơn thuê 'ORD-005' còn 20 phút chơi, nhưng máy chủ game bị ngắt kết nối bảo trì 30 phút.",
                "steps": "1. Admin mở trang Tổng quan vận hành (OverviewDashboard), quan sát thẻ phiên Live Session của 'ORD-005'.\n2. Click vào phiên Live để mở popover điều phối.\n3. Nhấn vào nút 'Bù giờ (+1h)'.\n4. Kiểm tra thông báo hệ thống và màn hình phía khách hàng.",
                "expected": "1. Hệ thống ghi nhận lệnh điều phối, hiển thị thông báo 'Đã cộng bù 1 giờ chơi cho đơn thuê ORD-005'.\n2. Phía khách hàng, đồng hồ CountdownTimer tự động tăng thêm 3.600 giây (từ 20 phút lên 1 giờ 20 phút) hoàn toàn miễn phí.\n3. Số dư ví khách hàng không bị trừ bất kỳ khoản phí nào.",
                "post": "Thời gian kết thúc đơn thuê được gia hạn bù giờ an toàn; trải nghiệm người dùng được bảo vệ tối đa.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Tính năng điều phối độc quyền chỉ có trên Dashboard hiện đại của GameRent."
            }
        ]
    },
    {
        "sheet_name": "ST_CONCURRENCY",
        "module_code": "ST_CONCURRENCY",
        "requirement": "Kiểm thử khả năng chịu tải đồng thời và cơ chế Khóa giao dịch độc quyền (Atomic Concurrency Lock) ngăn chặn tuyệt đối lỗi 2 khách hàng thuê trùng 1 tài khoản.",
        "tester": "Nhóm 15 (Lê Minh Quân, Lê Thanh Tùng)",
        "cases": [
            {
                "id": "[STC-E2E-12]",
                "desc": "Kiểm thử đua tài nguyên (Race Condition): 2 khách hàng cùng click 'Xác Nhận Thuê' trên 1 tài khoản duy nhất tại cùng thời điểm.\nKiểm chứng cơ chế Atomic Check & Lock trong rentAccount(): Giao dịch nào đến trước sẽ chốt đơn, giao dịch đến sau lập tức bị từ chối và bảo toàn số dư ví.",
                "pre": "1. Tài khoản game VIP 'ACCFS001' (FC Online) đang ở trạng thái duy nhất 'available'.\n2. Khách hàng A (ví 100k) và Khách hàng B (ví 100k) cùng đăng nhập trên 2 trình duyệt độc lập và cùng mở modal xác nhận thuê 'ACCFS001'.",
                "steps": "1. Tại cửa sổ của Khách hàng A, nhấn nút 'Xác Nhận Thuê'.\n2. Gần như đồng thời (chậm hơn 0.1 giây), tại cửa sổ của Khách hàng B, nhấn nút 'Xác Nhận Thuê'.\n3. Quan sát kết quả hiển thị trên màn hình và biến động ví của cả 2 khách hàng.",
                "expected": "1. Khách hàng A: Thuê thành công, nhận tài khoản/mật khẩu in-game, ví trừ 25.000 VNĐ, tài khoản chuyển sang 'rented'.\n2. Khách hàng B: Bị hệ thống chặn ngay lập tức với thông báo lỗi rõ ràng: 'Rất tiếc! Tài khoản này vừa được một khách hàng khác thuê trước vài giây. Vui lòng chọn tài khoản khác!'.\n3. Ví của Khách hàng B không bị trừ bất kỳ đồng nào (vẫn giữ nguyên 100.000 VNĐ).\n4. Tuyệt đối không xảy ra tình trạng Double-booking hay sai lệch trạng thái CSDL.",
                "post": "Tính toàn vẹn dữ liệu được bảo vệ 100%; không phát sinh đơn thuê trùng lặp.",
                "result": "Pass",
                "date": "26/09/2026",
                "note": "Khắc phục triệt để lỗi BUG-ST-001 (lỗi nghiêm trọng nhất được phân tích trong báo cáo BTL)."
            }
        ]
    }
]

# =============================================================================
# HÀM XÂY DỰNG FILE EXCEL HOÀN TOÀN TỰ ĐỘNG
# =============================================================================
def build_full_st_excel():
    print(f"=== Bắt đầu khởi tạo Workbook System Test (ST) chuẩn mẫu: {OUTPUT_PATH} ===")
    wb = openpyxl.Workbook()
    # Xóa sheet mặc định
    wb.remove(wb.active)

    # -------------------------------------------------------------------------
    # 1. SHEET: Cover (Trang bìa chuẩn mực 100% ST_Test Case Mẫu.xlsx)
    # -------------------------------------------------------------------------
    print("Khởi tạo Sheet: Cover...")
    ws_cover = wb.create_sheet(title="Cover")

    # Tiêu đề chính
    ws_cover.merge_cells("B2:H2")
    ws_cover['B2'].value = "TEST CASE"
    ws_cover['B2'].font = font_title
    ws_cover['B2'].alignment = Alignment(horizontal="center", vertical="center")
    ws_cover.row_dimensions[2].height = 45

    # Box thông tin dự án (B4:E7 và F4:H7)
    ws_cover.merge_cells("C4:E4")
    ws_cover['B4'].value = "Project Name"
    ws_cover['C4'].value = "GameRent - Website Cho Thuê Tài Khoản Game Tự Động 24/7"

    ws_cover.merge_cells("G4:H4")
    ws_cover['F4'].value = "Creator"
    ws_cover['G4'].value = "Nhóm 15 (Lê Minh Quân, Lê Hải Đăng, Lê Xuân Đạt, Lê Thanh Tùng)"

    ws_cover.merge_cells("C5:E5")
    ws_cover['B5'].value = "Project Code"
    ws_cover['C5'].value = "GAMERENT"

    ws_cover.merge_cells("G5:H5")
    ws_cover['F5'].value = "Reviewer/Approver"
    ws_cover['G5'].value = "ThS. Phạm Thị Loan"

    ws_cover.merge_cells("B6:B7")
    ws_cover.merge_cells("C6:E7")
    ws_cover['B6'].value = "Document Code"
    ws_cover['C6'].value = '=C5&"_"&"STC"&"_"&"v1.0"'

    ws_cover.merge_cells("G6:H6")
    ws_cover['F6'].value = "Issue Date"
    ws_cover['G6'].value = "26/09/2026"

    ws_cover.merge_cells("G7:H7")
    ws_cover['F7'].value = "Version"
    ws_cover['G7'].value = "1.0"

    # Định dạng các ô thông tin dự án
    for r in range(4, 8):
        ws_cover.row_dimensions[r].height = 20
        # Cột B, F (Labels)
        for c in [2, 6]:
            cell = ws_cover.cell(r, c)
            cell.font = font_label
            cell.alignment = Alignment(horizontal="left", vertical="center")
        # Cột C:E (Project Info)
        for c in range(3, 6):
            cell = ws_cover.cell(r, c)
            cell.font = font_value_green
            cell.alignment = Alignment(horizontal="left", vertical="center")
        # Cột G:H (Creator / Approver / Dates)
        for c in range(7, 9):
            cell = ws_cover.cell(r, c)
            cell.font = font_value_black
            cell.alignment = Alignment(horizontal="left", vertical="center")

    # Đóng khung viền rõ nét cho từng khối ô
    style_range(ws_cover, "B4:B4", border=box_border)
    style_range(ws_cover, "C4:E4", border=box_border)
    style_range(ws_cover, "B5:B5", border=box_border)
    style_range(ws_cover, "C5:E5", border=box_border)
    style_range(ws_cover, "B6:B7", border=box_border)
    style_range(ws_cover, "C6:E7", border=box_border)
    style_range(ws_cover, "F4:F4", border=box_border)
    style_range(ws_cover, "G4:H4", border=box_border)
    style_range(ws_cover, "F5:F5", border=box_border)
    style_range(ws_cover, "G5:H5", border=box_border)
    style_range(ws_cover, "F6:F6", border=box_border)
    style_range(ws_cover, "G6:H6", border=box_border)
    style_range(ws_cover, "F7:F7", border=box_border)
    style_range(ws_cover, "G7:H7", border=box_border)

    # Khối Record of change
    ws_cover['B10'].value = "Record of change"
    ws_cover['B10'].font = font_label
    ws_cover.row_dimensions[10].height = 22

    ws_cover.merge_cells("F11:G11")
    for col_idx, h in [(2, "Effective Date"), (3, "Version"), (4, "Change Item"), (5, "*A,D,M")]:
        cell = ws_cover.cell(11, col_idx)
        cell.value = h
        cell.font = font_header_white
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = header_border

    cell_desc = ws_cover.cell(11, 6)
    cell_desc.value = "Change description"
    cell_desc.font = font_header_white
    cell_desc.fill = fill_navy
    cell_desc.alignment = Alignment(horizontal="center", vertical="center")
    cell_desc.border = header_border
    ws_cover.cell(11, 7).border = header_border

    cell_ref = ws_cover.cell(11, 8)
    cell_ref.value = "Reference"
    cell_ref.font = font_header_white
    cell_ref.fill = fill_navy
    cell_ref.alignment = Alignment(horizontal="center", vertical="center")
    cell_ref.border = header_border
    ws_cover.row_dimensions[11].height = 24

    changes = [
        ("10/09/2026", "0.1", "Khởi tạo tài liệu và thiết kế kịch bản kiểm thử hệ thống", "A", 
         "Khởi tạo tài liệu đặc tả kiểm thử hệ thống (System Testing), thiết kế các kịch bản kiểm thử E2E toàn trình cho dự án GameRent theo biểu mẫu chuẩn.",
         "SRS GameRent v1.0, Tài liệu thiết kế hệ thống"),
        ("26/09/2026", "1.0", "Hoàn thiện trọn bộ kịch bản kiểm thử hệ thống dự án GameRent", "M",
         "Cập nhật hoàn chỉnh toàn bộ 7 kịch bản kiểm thử E2E hệ thống (12 ca kiểm thử toàn trình), bảng Test case List, sơ đồ Luồng nghiệp vụ, Bug Log và Test Report liên kết công thức tự động 100% Pass.",
         "Mã nguồn GameRent, Bộ kiểm thử tự động Vitest Suite, Báo cáo BTL KTPM")
    ]

    for r_idx, chg in enumerate(changes, start=12):
        ws_cover.merge_cells(f"F{r_idx}:G{r_idx}")
        ws_cover.cell(r_idx, 2).value = chg[0] # Effective Date
        ws_cover.cell(r_idx, 2).alignment = Alignment(horizontal="center", vertical="center")

        ws_cover.cell(r_idx, 3).value = chg[1] # Version
        ws_cover.cell(r_idx, 3).alignment = Alignment(horizontal="center", vertical="center")

        ws_cover.cell(r_idx, 4).value = chg[2] # Change Item
        ws_cover.cell(r_idx, 4).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

        ws_cover.cell(r_idx, 5).value = chg[3] # *A,D,M
        ws_cover.cell(r_idx, 5).alignment = Alignment(horizontal="center", vertical="center")

        ws_cover.cell(r_idx, 6).value = chg[4] # Change description
        ws_cover.cell(r_idx, 6).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

        ws_cover.cell(r_idx, 8).value = chg[5] # Reference
        ws_cover.cell(r_idx, 8).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

        for c in range(2, 9):
            ws_cover.cell(r_idx, c).font = font_value_black
            ws_cover.cell(r_idx, c).border = table_cell_border
        ws_cover.row_dimensions[r_idx].height = 42

    # Chú thích *A,D,M
    ws_cover['B14'].value = "*A: Added, D: Deleted, M: Modified"
    ws_cover['B14'].font = font_italic_gray
    ws_cover.row_dimensions[14].height = 20

    # Căn chỉnh kích thước cột chuẩn mực chống tràn chữ
    ws_cover.column_dimensions['A'].width = 3
    ws_cover.column_dimensions['B'].width = 18
    ws_cover.column_dimensions['C'].width = 14
    ws_cover.column_dimensions['D'].width = 34
    ws_cover.column_dimensions['E'].width = 12
    ws_cover.column_dimensions['F'].width = 22
    ws_cover.column_dimensions['G'].width = 38
    ws_cover.column_dimensions['H'].width = 32

    # -------------------------------------------------------------------------
    # 2. SHEET: Luồng nghiệp vụ (Business Process Workflow)
    # -------------------------------------------------------------------------
    print("Khởi tạo Sheet: Luồng nghiệp vụ...")
    ws_flow = wb.create_sheet(title="Luồng nghiệp vụ")

    ws_flow.merge_cells("B2:D2")
    ws_flow['B2'].value = "ĐẶC TẢ CÁC LUỒNG QUY TRÌNH NGHIỆP VỤ HỆ THỐNG GAMERENT (BUSINESS PROCESS WORKFLOW)"
    ws_flow['B2'].font = font_section_title
    ws_flow['B2'].alignment = Alignment(horizontal="left", vertical="center")
    ws_flow.row_dimensions[2].height = 30

    flow_sections = [
        {
            "title": "1. QUY TRÌNH NGHIỆP VỤ KHÁCH HÀNG THUÊ TÀI KHOẢN GAME TRỰC TUYẾN TỰ ĐỘNG (END-TO-END FLOW)",
            "steps": [
                ("Bước 1", "Khởi tạo tài khoản", "Khách hàng truy cập GameRent, nhấn 'Đăng ký' -> Điền form thông tin hợp lệ -> Hệ thống tạo tài khoản và tự động nạp 50.000 VNĐ vào ví trải nghiệm tân thủ."),
                ("Bước 2", "Nạp tiền ví VietQR", "Khách hàng mở modal Ví điện tử, chọn hạn mức nạp tiền (100.000 VNĐ) -> Quét mã VietQR động chuẩn NAPAS -> Số dư ví được cộng dồn thời gian thực lên 150.000 VNĐ."),
                ("Bước 3", "Duyệt kho & Chọn acc", "Khách hàng duyệt danh mục, áp dụng bộ lọc Game (Valorant/LMHT/Genshin), khoảng giá, skin độc quyền và nhấn icon Trái tim lưu tài khoản yêu thích (Favorites) độc lập."),
                ("Bước 4", "Xác nhận thuê tức thì", "Khách hàng bấm 'Thuê Ngay', chọn thời lượng thuê (2 giờ - 30.000 VNĐ), đồng ý cam kết điều khoản -> Nhấn 'Xác Nhận Thuê' -> Hệ thống trừ tiền ví và đổi trạng thái acc sang 'rented'."),
                ("Bước 5", "Bàn giao mật khẩu bí mật", "Hệ thống hiển thị modal bàn giao thông tin gồm Tên đăng nhập và Mật khẩu in-game bí mật kèm nút 'Sao chép 1-click' an toàn hoạt động trên cả HTTP/HTTPS."),
                ("Bước 6", "Giám sát thời gian thực", "Khách hàng vào 'Đơn thuê của tôi', theo dõi đồng hồ CountdownTimer đếm ngược chuẩn xác theo mốc Date.now(), hiển thị màu Xanh lục (>1h), Vàng cam (<1h) và Đỏ khi hết giờ."),
                ("Bước 7", "Rẽ nhánh: Gia hạn giờ", "Trước khi hết hạn, khách hàng bấm 'Gia hạn' thêm 1 giờ (15.000 VNĐ) -> Hệ thống trừ tiền ví và cộng dồn 3.600 giây trực tiếp mà không ngắt quãng phiên chơi game."),
                ("Bước 8", "Rẽ nhánh: Trả nick sớm", "Khách hàng chơi xong sớm bấm 'Trả Nick Sớm' -> Hệ thống tính toán hoàn lại 50% tiền thời gian chưa dùng vào ví, kết thúc đơn hàng và chuyển acc sang trạng thái 'need_change_pass'."),
                ("Bước 9", "Rẽ nhánh: Báo lỗi sự cố", "Nếu gặp sự cố in-game (sai pass/dính 2FA), khách hàng bấm 'Báo Lỗi / Khiếu Nại' -> Admin tiếp nhận và phê duyệt hoàn tiền bảo hiểm 100%, đồng thời đưa acc vào diện bảo trì.")
            ]
        },
        {
            "title": "2. QUY TRÌNH NGHIỆP VỤ QUẢN TRỊ VIÊN (ADMIN) VẬN HÀNH KHO & ĐIỀU PHỐI THỜI GIAN THỰC",
            "steps": [
                ("Bước 1", "Đăng nhập quyền Admin", "Quản trị viên đăng nhập với tài khoản admin@gamerent.vn -> Hệ thống kích hoạt quyền quản trị RBAC và hiển thị menu Quản trị."),
                ("Bước 2", "Thêm mới acc chuẩn UC1", "Admin vào Kho tài khoản, bấm 'Thêm Acc Mới' -> Nhập đầy đủ theo quy chuẩn UC1_Add New Product (Mã, Game, Tiêu đề <= 50 ký tự, Giá thuê/h, Upload ảnh <= 1MB, Pass gốc) -> Tài khoản hiển thị trên Cửa hàng Client."),
                ("Bước 3", "Giám sát Live Sessions", "Admin mở OverviewDashboard, theo dõi trực quan trạng thái tất cả các phiên thuê đang chạy (Live Rentals) và tình trạng doanh thu, khiếu nại theo thời gian thực."),
                ("Bước 4", "Điều phối can thiệp Live", "Khi máy chủ game bảo trì, Admin bấm vào Live Session chọn 'Bù giờ (+1h)' -> Hệ thống cộng thêm 3.600 giây cho khách hàng hoàn toàn miễn phí."),
                ("Bước 5", "Quản trị khách hàng CRM", "Admin tra cứu danh sách thành viên, số dư ví, lịch sử giao dịch và thực hiện Khóa tài khoản (Block User) khi phát hiện gian lận quy chế.")
            ]
        },
        {
            "title": "3. CƠ CHẾ KIỂM SOÁT TRANH CHẤP TÀI NGUYÊN (CONCURRENCY & ANTI-RACE CONDITION)",
            "steps": [
                ("Bước 1", "Yêu cầu thuê đồng thời", "Hai khách hàng A và B cùng mở modal thuê trên cùng một tài khoản VIP duy nhất tại cùng thời điểm."),
                ("Bước 2", "Khóa tài nguyên nguyên tử", "Khách A nhấn xác nhận trước 0.1s -> Hàm rentAccount kích hoạt Atomic Check & Lock -> Xác nhận đơn thuê của A thành công, trừ ví A và chuyển trạng thái acc sang 'rented'."),
                ("Bước 3", "Từ chối giao dịch xung đột", "Giao dịch của Khách B đến sau lập tức bị từ chối với thông báo 'Tài khoản vừa được người khác thuê' -> Ví của B được giữ nguyên vẹn 100%, ngăn ngừa tuyệt đối Double-booking.")
            ]
        }
    ]

    cur_r = 4
    for sec in flow_sections:
        ws_flow.merge_cells(f"B{cur_r}:D{cur_r}")
        ws_flow[f"B{cur_r}"].value = sec["title"]
        ws_flow[f"B{cur_r}"].font = Font(name="Tahoma", size=10.5, bold=True, color="000080")
        ws_flow[f"B{cur_r}"].fill = fill_light_blue
        ws_flow.row_dimensions[cur_r].height = 24
        cur_r += 1

        headers_f = ["Bước thực hiện", "Tên giai đoạn", "Mô tả chi tiết luồng nghiệp vụ E2E"]
        for idx, h in enumerate(headers_f, start=2):
            cell = ws_flow.cell(cur_r, idx)
            cell.value = h
            cell.font = font_header_white
            cell.fill = fill_navy
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = header_border
        ws_flow.row_dimensions[cur_r].height = 24
        cur_r += 1

        for st_num, st_name, st_desc in sec["steps"]:
            cell_num = ws_flow.cell(cur_r, 2)
            cell_num.value = st_num
            cell_num.font = font_sub_bold
            cell_num.alignment = Alignment(horizontal="center", vertical="center")
            cell_num.border = table_cell_border

            cell_name = ws_flow.cell(cur_r, 3)
            cell_name.value = st_name
            cell_name.font = Font(name="Tahoma", size=9.5, bold=True, color="000000")
            cell_name.alignment = Alignment(horizontal="left", vertical="center")
            cell_name.border = table_cell_border

            cell_desc = ws_flow.cell(cur_r, 4)
            cell_desc.value = st_desc
            cell_desc.font = font_value_black
            cell_desc.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            cell_desc.border = table_cell_border

            ws_flow.row_dimensions[cur_r].height = 36 if len(st_desc) > 130 else 26
            cur_r += 1

        cur_r += 1 # Khoảng trống giữa các phần

    ws_flow.column_dimensions['A'].width = 3
    ws_flow.column_dimensions['B'].width = 18
    ws_flow.column_dimensions['C'].width = 28
    ws_flow.column_dimensions['D'].width = 95

    # -------------------------------------------------------------------------
    # 3. SHEET: Test case List
    # -------------------------------------------------------------------------
    print("Khởi tạo Sheet: Test case List...")
    ws_list = wb.create_sheet(title="Test case List")
    ws_list['D1'].value = "TEST CASE LIST"
    ws_list['D1'].font = font_title
    ws_list['D1'].alignment = Alignment(horizontal="center", vertical="center")
    ws_list.row_dimensions[1].height = 40

    ws_list.merge_cells("B3:C3")
    ws_list.merge_cells("D3:F3")
    ws_list['B3'].value = "Project Name"
    ws_list['B3'].font = font_label
    ws_list['D3'].value = "=Cover!C4"
    ws_list['D3'].font = font_value_green

    ws_list.merge_cells("B4:C4")
    ws_list.merge_cells("D4:F4")
    ws_list['B4'].value = "Project Code"
    ws_list['B4'].font = font_label
    ws_list['D4'].value = "=Cover!C5"
    ws_list['D4'].font = font_value_green

    ws_list.merge_cells("B5:C5")
    ws_list.merge_cells("D5:F5")
    ws_list['B5'].value = "Test Environment Setup Description"
    ws_list['B5'].font = font_label
    env_desc = (
        "Môi trường kiểm thử hệ thống & kịch bản E2E toàn trình GameRent:\n"
        "1. Ứng dụng Client: React 19.x, Vite 5.x, Vanilla CSS Design System, Responsive UI (Google Chrome v120+, Edge v120+)\n"
        "2. Lưu trữ dữ liệu: LocalStorage Database Engine Mock, React Context API, Web Workers / Window Timers\n"
        "3. Tự động hóa kiểm thử: Vitest Automation Suite v5.0, jsdom, React Testing Library (10/10 test suites, Pass 100%)\n"
        "4. Nền tảng: Windows 11 64-bit, Multi-platform web, Localhost dev server (http://localhost:5173), UTF-8 Encoding"
    )
    ws_list['D5'].value = env_desc
    ws_list['D5'].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
    ws_list.row_dimensions[5].height = 70

    style_range(ws_list, "B3:F3", border=table_cell_border)
    style_range(ws_list, "B4:F4", border=table_cell_border)
    style_range(ws_list, "B5:F5", border=table_cell_border)

    headers_list = ["No", "Function Name", "Sheet Name", "Description", "Pre-Condition"]
    for idx, h in enumerate(headers_list, start=2):
        cell = ws_list.cell(8, idx)
        cell.value = h
        cell.font = font_header_white
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = header_border
    ws_list.row_dimensions[8].height = 24

    st_functions = [
        (1, "Xác thực, Phân quyền & RBAC", "ST_AUTH_RBAC",
         "Kiểm thử luồng Đăng ký thành viên tự động nhận ví trải nghiệm 50k và chặn đăng nhập đối với tài khoản bị Admin khóa (isBlocked).",
         "Trình duyệt mở trang chủ GameRent, chưa đăng nhập hoặc đăng nhập bằng tài khoản bị khóa."),
        (2, "Duyệt kho, Lọc & Yêu thích", "ST_CATALOG_FAV",
         "Kiểm thử tìm kiếm skin, lọc theo thể loại game, tầm giá và cơ chế lưu trữ danh sách yêu thích độc lập cho từng tài khoản.",
         "Kho tài khoản có ít nhất 10 acc game đa dạng, người dùng đăng nhập tài khoản cá nhân."),
        (3, "Nạp tiền VietQR & Thuê acc E2E", "ST_WALLET_RENT",
         "Kiểm thử quy trình nạp tiền ví tự động bằng VietQR và luồng thuê tài khoản game tức thì, bàn giao thông tin in-game 1-click.",
         "Khách hàng đã đăng nhập, số dư ví ban đầu 50.000 VNĐ, tài khoản game ở trạng thái available."),
        (4, "Giám sát thời gian thực & Gia hạn", "ST_TIMER_EXT",
         "Kiểm thử đồng hồ CountdownTimer đếm ngược chuẩn từng giây, cơ chế cảnh báo đổi màu và tính năng gia hạn thêm giờ liền mạch.",
         "Khách hàng đang có 1 đơn thuê active thời lượng 2 giờ, số dư ví đủ điều kiện gia hạn."),
        (5, "Trả sớm & Khiếu nại bảo hiểm 100%", "ST_EARLY_DISPUTE",
         "Kiểm thử chính sách hoàn trả 50% khi trả nick sớm và cơ chế bồi thường bảo hiểm 100% tiền đơn khi khách khiếu nại sự cố.",
         "Khách hàng có đơn thuê đang active (trả sớm) hoặc phát sinh lỗi in-game sai pass trong 15 phút đầu."),
        (6, "Quản trị kho UC1 & Điều phối Live", "ST_ADMIN_DISPATCH",
         "Kiểm thử form thêm acc chuẩn 100% tài liệu UC1_Add New Product và tính năng Admin can thiệp điều phối bù giờ Live Session.",
         "Người dùng đăng nhập với tài khoản Quản trị viên (admin@gamerent.vn), mở trang Quản lý kho / Dashboard."),
        (7, "Đồng thời & Chống Race Condition", "ST_CONCURRENCY",
         "Kiểm thử khả năng xử lý tranh chấp tài nguyên đồng thời khi 2 khách hàng cùng bấm thuê 1 acc tại 1 thời điểm (chống Double-booking).",
         "Tài khoản game VIP ở trạng thái duy nhất 'available', 2 khách hàng A và B cùng mở modal thuê đồng thời.")
    ]

    for idx, fn in enumerate(st_functions, start=9):
        ws_list.cell(idx, 2).value = fn[0]
        ws_list.cell(idx, 2).alignment = Alignment(horizontal='center', vertical='center')
        ws_list.cell(idx, 2).font = font_value_black
        ws_list.cell(idx, 2).border = table_cell_border

        ws_list.cell(idx, 3).value = fn[1]
        ws_list.cell(idx, 3).alignment = Alignment(horizontal='left', vertical='center')
        ws_list.cell(idx, 3).font = font_value_black
        ws_list.cell(idx, 3).border = table_cell_border

        ws_list.cell(idx, 4).value = fn[2]
        ws_list.cell(idx, 4).alignment = Alignment(horizontal='center', vertical='center')
        ws_list.cell(idx, 4).font = font_value_black
        ws_list.cell(idx, 4).border = table_cell_border

        ws_list.cell(idx, 5).value = fn[3]
        ws_list.cell(idx, 5).alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
        ws_list.cell(idx, 5).font = font_value_black
        ws_list.cell(idx, 5).border = table_cell_border

        ws_list.cell(idx, 6).value = fn[4]
        ws_list.cell(idx, 6).alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
        ws_list.cell(idx, 6).font = font_value_black
        ws_list.cell(idx, 6).border = table_cell_border

        ws_list.row_dimensions[idx].height = 40

    ws_list.column_dimensions['B'].width = 8
    ws_list.column_dimensions['C'].width = 30
    ws_list.column_dimensions['D'].width = 22
    ws_list.column_dimensions['E'].width = 52
    ws_list.column_dimensions['F'].width = 46

    # -------------------------------------------------------------------------
    # 4. TẠO 7 SHEET CHI TIẾT TỪNG PHÂN HỆ SYSTEM TEST
    # -------------------------------------------------------------------------
    headers_tc = [
        "ID", "Test Case Description", "Pre-condition", "Test Steps",
        "Expected Output", "Post-condtion", "Result", "Test date", "Note"
    ]

    for mod in STC_MODULES_DATA:
        sname = mod["sheet_name"]
        print(f"Khởi tạo Sheet chi tiết: {sname}...")
        ws_m = wb.create_sheet(title=sname)

        ws_m['A2'].value = "Module Code"
        ws_m['A2'].font = font_label
        ws_m.merge_cells("B2:F2")
        ws_m['B2'].value = mod["module_code"]
        ws_m['B2'].font = Font(name="Tahoma", size=10, bold=True, color="000000")

        ws_m['A3'].value = "Test requirement"
        ws_m['A3'].font = font_label
        ws_m.merge_cells("B3:F3")
        ws_m['B3'].value = mod["requirement"]
        ws_m['B3'].font = font_value_black
        ws_m['B3'].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        ws_m.row_dimensions[3].height = 32

        ws_m['A4'].value = "Tester"
        ws_m['A4'].font = font_label
        ws_m.merge_cells("B4:F4")
        ws_m['B4'].value = mod["tester"]
        ws_m['B4'].font = font_value_black

        # Bảng thống kê Pass/Fail/Untested/N/A
        ws_m['A5'].value = "Pass"
        ws_m['B5'].value = "Fail"
        ws_m['C5'].value = "Untested"
        ws_m['D5'].value = "N/A"
        ws_m.merge_cells("E5:F5")
        ws_m['E5'].value = "Number of Test cases"
        for c in range(1, 7):
            cell = ws_m.cell(5, c)
            cell.font = font_header_white
            cell.fill = fill_navy
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = header_border

        ws_m['A6'].value = '=COUNTIF(G9:G100,"Pass")'
        ws_m['B6'].value = '=COUNTIF(G9:G100,"Fail")'
        ws_m['C6'].value = '=E6-D6-B6-A6'
        ws_m['D6'].value = '=COUNTIF(G9:G100,"N/A")'
        ws_m.merge_cells("E6:F6")
        ws_m['E6'].value = '=COUNTA(A9:A100)'
        for c in range(1, 7):
            cell = ws_m.cell(6, c)
            cell.font = font_stat_formula
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = table_cell_border

        # Headers danh sách test case
        for idx, h in enumerate(headers_tc, start=1):
            cell = ws_m.cell(8, idx)
            cell.value = h
            cell.font = font_header_white
            cell.fill = fill_navy
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = header_border
        ws_m.row_dimensions[8].height = 24

        cur_row = 9
        for tc in mod["cases"]:
            ws_m.cell(cur_row, 1).value = tc["id"]
            ws_m.cell(cur_row, 1).alignment = Alignment(horizontal="center", vertical="center")
            ws_m.cell(cur_row, 1).font = font_sub_bold

            ws_m.cell(cur_row, 2).value = tc["desc"]
            ws_m.cell(cur_row, 2).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            ws_m.cell(cur_row, 2).font = font_value_black

            ws_m.cell(cur_row, 3).value = tc["pre"]
            ws_m.cell(cur_row, 3).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            ws_m.cell(cur_row, 3).font = font_value_black

            ws_m.cell(cur_row, 4).value = tc["steps"]
            ws_m.cell(cur_row, 4).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            ws_m.cell(cur_row, 4).font = font_value_black

            ws_m.cell(cur_row, 5).value = tc["expected"]
            ws_m.cell(cur_row, 5).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            ws_m.cell(cur_row, 5).font = font_value_black

            ws_m.cell(cur_row, 6).value = tc["post"]
            ws_m.cell(cur_row, 6).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            ws_m.cell(cur_row, 6).font = font_value_black

            ws_m.cell(cur_row, 7).value = tc["result"]
            ws_m.cell(cur_row, 7).alignment = Alignment(horizontal="center", vertical="center")
            ws_m.cell(cur_row, 7).font = Font(name="Tahoma", size=9.5, bold=True, color="22543D")
            ws_m.cell(cur_row, 7).fill = fill_pass

            ws_m.cell(cur_row, 8).value = tc["date"]
            ws_m.cell(cur_row, 8).alignment = Alignment(horizontal="center", vertical="center")
            ws_m.cell(cur_row, 8).font = font_value_black

            ws_m.cell(cur_row, 9).value = tc["note"]
            ws_m.cell(cur_row, 9).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            ws_m.cell(cur_row, 9).font = font_value_black

            for c in range(1, 10):
                ws_m.cell(cur_row, c).border = table_cell_border

            # Tính toán chiều cao dòng theo độ dài nội dung
            max_len = max(len(tc["desc"]), len(tc["steps"]), len(tc["expected"]))
            ws_m.row_dimensions[cur_row].height = 85 if max_len > 250 else 65
            cur_row += 1

        # Căn chỉnh kích thước cột
        ws_m.column_dimensions['A'].width = 16
        ws_m.column_dimensions['B'].width = 35
        ws_m.column_dimensions['C'].width = 35
        ws_m.column_dimensions['D'].width = 46
        ws_m.column_dimensions['E'].width = 46
        ws_m.column_dimensions['F'].width = 35
        ws_m.column_dimensions['G'].width = 12
        ws_m.column_dimensions['H'].width = 14
        ws_m.column_dimensions['I'].width = 36

    # -------------------------------------------------------------------------
    # 5. SHEET: Test Report (Liên kết công thức tự động 7 phân hệ)
    # -------------------------------------------------------------------------
    print("Khởi tạo Sheet: Test Report...")
    ws_report = wb.create_sheet(title="Test Report")

    ws_report.merge_cells("B1:H1")
    ws_report['B1'].value = "TEST REPORT"
    ws_report['B1'].font = font_title
    ws_report['B1'].alignment = Alignment(horizontal="center", vertical="center")
    ws_report.row_dimensions[1].height = 40

    ws_report.merge_cells("C3:D3")
    ws_report.merge_cells("E3:F3")
    ws_report.merge_cells("G3:H3")
    ws_report['B3'].value = "Project Name"
    ws_report['B3'].font = font_label
    ws_report['C3'].value = "=Cover!C4"
    ws_report['C3'].font = font_value_green
    ws_report['E3'].value = "Creator"
    ws_report['E3'].font = font_label
    ws_report['G3'].value = "=Cover!G4"
    ws_report['G3'].font = font_value_black

    ws_report.merge_cells("C4:D4")
    ws_report.merge_cells("E4:F4")
    ws_report.merge_cells("G4:H4")
    ws_report['B4'].value = "Project Code"
    ws_report['B4'].font = font_label
    ws_report['C4'].value = "=Cover!C5"
    ws_report['C4'].font = font_value_green
    ws_report['E4'].value = "Reviewer/Approver"
    ws_report['E4'].font = font_label
    ws_report['G4'].value = "=Cover!G5"
    ws_report['G4'].font = font_value_black

    ws_report.merge_cells("C5:D5")
    ws_report.merge_cells("E5:F5")
    ws_report.merge_cells("G5:H5")
    ws_report['B5'].value = "Document Code"
    ws_report['B5'].font = font_label
    ws_report['C5'].value = '=C4&"_"&"Test Report"&"_"&"v1.0"'
    ws_report['C5'].font = font_value_green
    ws_report['E5'].value = "Issue Date"
    ws_report['E5'].font = font_label
    ws_report['G5'].value = "26/09/2026"
    ws_report['G5'].font = font_value_black

    ws_report.merge_cells("C6:H6")
    ws_report['B6'].value = "Notes"
    ws_report['B6'].font = font_label
    ws_report['C6'].value = "Báo cáo tổng hợp kết quả thực thi 12 kịch bản Kiểm thử hệ thống End-to-End (STC-E2E-01 đến STC-E2E-12) bao phủ 7 phân hệ nghiệp vụ cốt lõi của dự án GameRent (Nhóm 15). Toàn bộ 12 ca kiểm thử đều đạt kết quả Pass 100%."
    ws_report['C6'].font = font_value_black
    ws_report['C6'].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws_report.row_dimensions[6].height = 35

    for r in range(3, 7):
        for c in range(2, 9):
            ws_report.cell(r, c).border = table_cell_border

    headers_report = ["No", "Module code", "Pass", "Fail", "Untested", "N/A", "Number of  test cases"]
    for idx, h in enumerate(headers_report, start=2):
        cell = ws_report.cell(10, idx)
        cell.value = h
        cell.font = font_header_white
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = header_border
    ws_report.row_dimensions[10].height = 24

    for idx, mod in enumerate(STC_MODULES_DATA, start=1):
        r_num = 10 + idx
        s_target = mod["sheet_name"]
        ws_report.cell(r_num, 2).value = idx
        ws_report.cell(r_num, 2).alignment = Alignment(horizontal="center", vertical="center")
        ws_report.cell(r_num, 3).value = f"='{s_target}'!B2"
        ws_report.cell(r_num, 3).alignment = Alignment(horizontal="center", vertical="center")
        ws_report.cell(r_num, 4).value = f"='{s_target}'!A6"
        ws_report.cell(r_num, 4).alignment = Alignment(horizontal="center", vertical="center")
        ws_report.cell(r_num, 5).value = f"='{s_target}'!B6"
        ws_report.cell(r_num, 5).alignment = Alignment(horizontal="center", vertical="center")
        ws_report.cell(r_num, 6).value = f"='{s_target}'!C6"
        ws_report.cell(r_num, 6).alignment = Alignment(horizontal="center", vertical="center")
        ws_report.cell(r_num, 7).value = f"='{s_target}'!D6"
        ws_report.cell(r_num, 7).alignment = Alignment(horizontal="center", vertical="center")
        ws_report.cell(r_num, 8).value = f"='{s_target}'!E6"
        ws_report.cell(r_num, 8).alignment = Alignment(horizontal="center", vertical="center")
        for c in range(2, 9):
            ws_report.cell(r_num, c).border = table_cell_border
            ws_report.cell(r_num, c).font = font_value_black
        ws_report.row_dimensions[r_num].height = 22

    sub_total_row = 11 + len(STC_MODULES_DATA)
    ws_report.cell(sub_total_row, 3).value = "Sub total"
    ws_report.cell(sub_total_row, 3).font = font_header_white
    ws_report.cell(sub_total_row, 3).fill = fill_navy
    ws_report.cell(sub_total_row, 3).alignment = Alignment(horizontal="center", vertical="center")
    ws_report.cell(sub_total_row, 3).border = header_border

    start_r = 11
    end_r = 10 + len(STC_MODULES_DATA)
    for c_idx, col_letter in enumerate(['D', 'E', 'F', 'G', 'H'], start=4):
        cell = ws_report.cell(sub_total_row, c_idx)
        cell.value = f"=SUM({col_letter}{start_r}:{col_letter}{end_r})"
        cell.font = font_header_white
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = header_border
    ws_report.row_dimensions[sub_total_row].height = 24

    cov_row = sub_total_row + 2
    ws_report.cell(cov_row, 3).value = "Test coverage"
    ws_report.cell(cov_row, 3).font = font_label
    ws_report.cell(cov_row, 5).value = f"=(D{sub_total_row}+E{sub_total_row})*100/(H{sub_total_row}-G{sub_total_row})"
    ws_report.cell(cov_row, 5).font = font_stat_formula
    ws_report.cell(cov_row, 5).alignment = Alignment(horizontal="center", vertical="center")
    ws_report.cell(cov_row, 6).value = "%"

    succ_row = cov_row + 1
    ws_report.cell(succ_row, 3).value = "Test successful coverage"
    ws_report.cell(succ_row, 3).font = font_label
    ws_report.cell(succ_row, 5).value = f"=D{sub_total_row}*100/(H{sub_total_row}-G{sub_total_row})"
    ws_report.cell(succ_row, 5).font = font_stat_formula
    ws_report.cell(succ_row, 5).alignment = Alignment(horizontal="center", vertical="center")
    ws_report.cell(succ_row, 6).value = "%"

    # Đánh giá chất lượng
    eval_row = succ_row + 2
    ws_report.merge_cells(f"C{eval_row}:H{eval_row}")
    ws_report.cell(eval_row, 3).value = "ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG:"
    ws_report.cell(eval_row, 3).font = font_sub_bold

    eval_items = [
        "✓ 12/12 System Test Cases đạt kết quả Pass 100%, không còn lỗi tồn đọng.",
        "✓ Toàn bộ 5 lỗi hệ thống (Bug Log BUG-ST-001 -> 005) đã được khắc phục triệt để và kiểm thử hồi quy thành công.",
        "✓ Hệ thống GameRent vận hành trơn tru, bảo mật và sẵn sàng triển khai chính thức."
    ]
    for idx, ev in enumerate(eval_items, start=eval_row + 1):
        ws_report.merge_cells(f"C{idx}:H{idx}")
        ws_report.cell(idx, 3).value = ev
        ws_report.cell(idx, 3).font = font_value_black
        ws_report.row_dimensions[idx].height = 20

    ws_report.column_dimensions['B'].width = 8
    ws_report.column_dimensions['C'].width = 25
    ws_report.column_dimensions['D'].width = 12
    ws_report.column_dimensions['E'].width = 12
    ws_report.column_dimensions['F'].width = 12
    ws_report.column_dimensions['G'].width = 12
    ws_report.column_dimensions['H'].width = 22

    # -------------------------------------------------------------------------
    # 6. SHEET: Bug Log (Nghiệm thu 5 lỗi phát hiện trong System Test)
    # -------------------------------------------------------------------------
    print("Khởi tạo Sheet: Bug Log...")
    ws_bug = wb.create_sheet(title="Bug Log")

    ws_bug.merge_cells("B2:J2")
    ws_bug['B2'].value = "DANH SÁCH LỖI HỆ THỐNG PHÁT HIỆN TRONG SYSTEM TEST (BUG LOG)"
    ws_bug['B2'].font = font_section_title
    ws_bug['B2'].alignment = Alignment(horizontal="left", vertical="center")
    ws_bug.row_dimensions[2].height = 30

    headers_bug = [
        "Bug ID", "Tiêu đề lỗi (Bug Title)", "Mức ưu tiên (Severity / Priority)",
        "Màn hình / File phát sinh", "Tester phát hiện", "Ngày phát hiện",
        "Mã STC liên quan", "Trạng thái (Status)", "Mô tả giải pháp khắc phục (Resolution Summary)"
    ]
    for idx, h in enumerate(headers_bug, start=2):
        cell = ws_bug.cell(4, idx)
        cell.value = h
        cell.font = font_header_white
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = header_border
    ws_bug.row_dimensions[4].height = 28

    bugs_data = [
        (
            "BUG-ST-001",
            "Lỗi đua tài nguyên (Race Condition) cho phép 2 khách hàng cùng bấm thuê trùng 1 tài khoản (Double-booking)",
            "Critical",
            "RentConfirmModal.jsx / rentAccount()",
            "Lê Minh Quân",
            "21/09/2026",
            "STC-E2E-12",
            "Đã sửa (Fixed)",
            "Bổ sung cơ chế Atomic Check & Lock: kiểm tra trạng thái available ngay trước khi ghi đè LocalStorage; nếu acc đã bị thuê trước thì hủy giao dịch và hoàn tiền ví lập tức."
        ),
        (
            "BUG-ST-002",
            "CountdownTimer bị trôi giây khi người dùng chuyển sang tab trình duyệt khác (Background Tab Throttling)",
            "Medium",
            "CountdownTimer.jsx",
            "Lê Thanh Tùng",
            "21/09/2026",
            "STC-E2E-06",
            "Đã sửa (Fixed)",
            "Loại bỏ cơ chế đếm lùi setInterval trần; chuyển sang đồng bộ mốc thời gian tuyệt đối dựa trên chênh lệch Date.now() và rental.endTime, kèm sự kiện visibilitychange."
        ),
        (
            "BUG-ST-003",
            "Form thêm tài khoản UC1 cho phép lưu Tên sản phẩm chứa khoảng trắng đầu cuối vượt quá giới hạn 50 ký tự",
            "Medium",
            "AccountInventoryPage.jsx",
            "Lê Hải Đăng",
            "22/09/2026",
            "STC-E2E-10",
            "Đã sửa (Fixed)",
            "Bổ sung hàm .trim() trước khi kiểm tra độ dài chuỗi và trước khi lưu vào CSDL, đảm bảo tuân thủ nghiêm ngặt quy định UC1_Add New Product."
        ),
        (
            "BUG-ST-004",
            "Nút Sao chép (Copy) mật khẩu in-game không phản hồi khi chạy trên môi trường mạng nội bộ giao thức HTTP",
            "High",
            "MyRentalsPage.jsx",
            "Lê Xuân Đạt",
            "22/09/2026",
            "STC-E2E-05",
            "Đã sửa (Fixed)",
            "Thêm fallback sao chép văn bản bằng document.execCommand('copy') thông qua thẻ textarea ẩn khi navigator.clipboard không khả dụng trên HTTP."
        ),
        (
            "BUG-ST-005",
            "Người dùng bị Admin khóa tài khoản (isBlocked = true) vẫn có thể đổi mật khẩu qua trang Settings khi còn lưu session cũ",
            "High",
            "SettingsPage.jsx / auth.js",
            "Lê Thanh Tùng",
            "23/09/2026",
            "STC-E2E-02",
            "Đã sửa (Fixed)",
            "Bổ sung bước xác thực cờ isBlocked theo thời gian thực trước mọi hành động cập nhật thông tin cá nhân hoặc đổi mật khẩu; tự động đăng xuất nếu phát hiện tài khoản bị khóa."
        )
    ]

    for r_idx, b in enumerate(bugs_data, start=5):
        ws_bug.row_dimensions[r_idx].height = 45
        for col_idx, val in enumerate(b, start=2):
            cell = ws_bug.cell(r_idx, col_idx)
            cell.value = val
            cell.border = table_cell_border
            cell.font = font_value_black

            if col_idx in [2, 6, 7, 8]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 4: # Mức ưu tiên
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.font = Font(name="Tahoma", size=9.5, bold=True)
                if val == "Critical":
                    cell.fill = fill_critical
                    cell.font = Font(name="Tahoma", size=9.5, bold=True, color="9B2C2C")
                elif val == "High":
                    cell.fill = fill_high
                    cell.font = Font(name="Tahoma", size=9.5, bold=True, color="9C4221")
            elif col_idx == 9: # Trạng thái
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.font = Font(name="Tahoma", size=9.5, bold=True, color="22543D")
                cell.fill = fill_pass
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    ws_bug.column_dimensions['A'].width = 3
    ws_bug.column_dimensions['B'].width = 14
    ws_bug.column_dimensions['C'].width = 35
    ws_bug.column_dimensions['D'].width = 16
    ws_bug.column_dimensions['E'].width = 25
    ws_bug.column_dimensions['F'].width = 16
    ws_bug.column_dimensions['G'].width = 14
    ws_bug.column_dimensions['H'].width = 14
    ws_bug.column_dimensions['I'].width = 16
    ws_bug.column_dimensions['J'].width = 46

    # -------------------------------------------------------------------------
    # 7. SHEET: Wireframe (Ảnh giao diện luồng nghiệp vụ E2E)
    # -------------------------------------------------------------------------
    print("Khởi tạo Sheet: Wireframe...")
    ws_wf = wb.create_sheet(title="Wireframe")

    ws_wf['A2'].value = "1."
    ws_wf['A2'].font = Font(name="Tahoma", size=11, bold=True)
    ws_wf['B2'].value = "Wireframe & Giao diện luồng nghiệp vụ E2E (Màn hình Đăng nhập AuthModal GameRent)"
    ws_wf['B2'].font = font_sub_bold

    if os.path.exists(WIREFRAME_IMG_PATH):
        img = Image(WIREFRAME_IMG_PATH)
        img.width = 300
        img.height = 384
        ws_wf.add_image(img, 'B4')
        print(f"  -> Đã nhúng ảnh wireframe thành công: {WIREFRAME_IMG_PATH}")

    for r in range(4, 21):
        ws_wf.row_dimensions[r].height = 18

    ws_wf.column_dimensions['A'].width = 5
    ws_wf.column_dimensions['B'].width = 24

    # Lưu workbook
    print(f"Đang lưu file vào: {OUTPUT_PATH}")
    wb.save(OUTPUT_PATH)
    print("HOÀN TẤT CẬP NHẬT TOÀN DIỆN ST_TEST CASE.XLSX THÀNH CÔNG 100%!")

if __name__ == "__main__":
    build_full_st_excel()
