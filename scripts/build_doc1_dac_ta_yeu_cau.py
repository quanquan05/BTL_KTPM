# -*- coding: utf-8 -*-
"""
Generator for File 1:
1_Dac_Ta_Yeu_Cau_Phan_Mem.docx & 1_Dac_Ta_Yeu_Cau_Phan_Mem.pdf
Tương ứng Cột 1: "1. Đặc tả yêu cầu" trong Bảng theo dõi sản phẩm BTL Kiểm thử phần mềm.
"""

import os
import sys
import shutil
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx2pdf import convert

from build_requirements_docs import (
    create_doc_base, add_p, add_h1, add_h2, add_h3,
    add_table_custom, add_cover_page, add_use_case_form_table,
    NAVY, BLUE, EMERALD, DARK_GRAY, TEXT_COLOR, RED
)
from use_cases_data import USE_CASES_DATA

def build_doc1():
    doc = create_doc_base()

    # 1. Trang bìa
    add_cover_page(
        doc,
        doc_title_main="TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM\n(SOFTWARE REQUIREMENTS & USE CASE SPECIFICATIONS)",
        doc_sub_title="Tài liệu chi tiết đặc tả ca sử dụng (Use Case) theo chuẩn biểu mẫu giảng viên hướng dẫn môn Kiểm thử phần mềm",
        col_label="1: 1. ĐẶC TẢ YÊU CẦU"
    )

    # 2. Lời mở đầu & Mục tiêu tài liệu
    add_h1(doc, "LỜI MỞ ĐẦU & PHẠM VI TÀI LIỆU ĐẶC TẢ YÊU CẦU")
    add_p(doc, "Tài liệu này được biên soạn bởi Nhóm 16 – Lớp tín chỉ Kiểm thử phần mềm-1-1-26(N05), Trường Đại học Công nghệ Đông Á (EAUT), đóng vai trò là Sản phẩm công việc có sẵn số 1: 'Đặc tả yêu cầu' phục vụ toàn bộ các giai đoạn kiểm thử phần mềm (Unit Test, Integration Test, System Test và Automation Test).")
    add_p(doc, "Mục tiêu của tài liệu:", bold=True)
    add_p(doc, "• Cung cấp bức tranh hoàn chỉnh và chi tiết về các hành vi tương tác của người dùng với hệ thống Cho thuê tài khoản game trực tuyến tự động (GameRent).\n"
               "• Chuẩn hóa các biểu mẫu Use Case theo đúng quy cách giảng viên hướng dẫn quy định trong tài liệu mẫu 'UC1_Add New Product'.\n"
               "• Xác lập các Quy tắc nghiệp vụ (Business Rules - BR), Luồng sự kiện chính (Normal Flow), Luồng sự kiện ngoại lệ (Exceptions) với các mã lỗi chuẩn (1.0.E1, 1.0.E2...) làm căn cứ thiết kế Test Case chất lượng cao.\n"
               "• Xây dựng bộ Test Case mẫu theo các kỹ thuật thiết kế hộp đen cốt lõi: Phân tích giá trị biên (Boundary Value Analysis - BVA) và Phân vùng tương đương (Equivalence Partitioning - EP).")

    doc.add_page_break()

    # 3. Phần I: Danh mục và Tổng quan Use Case
    add_h1(doc, "PHẦN I: DANH MỤC VÀ TỔNG QUAN CÁC USE CASE CỦA HỆ THỐNG")
    add_h2(doc, "1.1. Danh mục các Tác tử tham gia hệ thống (System Actors)")
    add_p(doc, "Hệ thống GameRent phân loại 4 nhóm tác tử chính tham gia tương tác:")

    actor_headers = ["Mã Tác Tử", "Tên Tác Tử", "Vai Trò & Phạm Vi Hoạt Động Trên Hệ Thống"]
    actor_rows = [
        ["ACT-01", "Khách vãng lai (Guest)", "Người dùng chưa đăng nhập, chỉ có quyền duyệt danh mục game, tìm kiếm nick, xem chi tiết mô tả và truy cập form đăng ký/đăng nhập."],
        ["ACT-02", "Khách hàng / Người thuê (Customer / Renter)", "Người dùng đã đăng ký tài khoản thành công, được cấp ví điện tử cá nhân, thực hiện nạp tiền qua VietQR, đặt thuê nick, nhận tài khoản/mật khẩu, gia hạn, trả nick sớm và báo lỗi khiếu nại."],
        ["ACT-03", "Quản trị viên (Administrator - Admin)", "Người điều hành hệ thống có toàn quyền giám sát các phiên thuê trực tiếp, thêm/sửa/xóa nick kho chuẩn UC1, bù giờ, thu hồi mật khẩu, bảo trì nick và duyệt hoàn tiền ví."],
        ["ACT-04", "Tiến trình tự động (Automated Timer Engine)", "Tác tử hệ thống chạy ngầm, tự động đếm ngược phiên thuê từng giây, chuyển trạng thái đơn sang 'expired' khi hết giờ và tự động thu hồi/đổi pass."]
    ]
    add_table_custom(doc, actor_headers, actor_rows, col_widths=[1.2, 2.2, 3.8])

    add_h2(doc, "1.2. Bảng tổng hợp danh mục 10 Use Case chính của GameRent")
    add_p(doc, "Dưới đây là bảng tổng hợp 10 Use Case trọng tâm phản ánh đầy đủ chu trình nghiệp vụ E2E từ Khách hàng đến Quản trị viên:")

    uc_summary_headers = ["Mã UC", "Tên Use Case", "Tác tử chính", "Mức ưu tiên", "Phân hệ tương ứng"]
    uc_summary_rows = [
        ["UC01", "Đăng nhập hệ thống (Login)", "Customer / Admin", "High", "Xác thực & Phân quyền"],
        ["UC02", "Đăng ký tài khoản mới (Register)", "Guest", "High", "Xác thực & Phân quyền"],
        ["UC03", "Tìm kiếm & lọc kho tài khoản game", "Guest / Customer", "High", "Danh mục & Cửa hàng"],
        ["UC04", "Nạp tiền ví điện tử qua VietQR", "Customer", "High", "Quản lý Ví điện tử"],
        ["UC05", "Thuê tài khoản game tức thì", "Customer", "Critical", "Động cơ Cho thuê"],
        ["UC06", "Giám sát phiên thuê & Xem mật khẩu", "Customer", "High", "Quản lý Đơn thuê"],
        ["UC07", "Gia hạn thời gian thuê tài khoản", "Customer", "Medium", "Quản lý Đơn thuê"],
        ["UC08", "Trả nick sớm & Báo lỗi sự cố / Hoàn tiền", "Customer", "High", "Khiếu nại & Sự cố"],
        ["UC09", "Giám sát phiên thuê & Điều phối Admin", "Administrator", "High", "Quản trị Điều hành"],
        ["UC10", "Thêm mới tài khoản game vào kho (Chuẩn UC1)", "Administrator", "High", "Quản trị Kho acc"]
    ]
    add_table_custom(doc, uc_summary_headers, uc_summary_rows, col_widths=[0.9, 2.7, 1.4, 1.0, 1.4])

    add_h2(doc, "1.3. Mô tả quan hệ giữa các Use Case (Use Case Relationships)")
    add_p(doc, "• Quan hệ <<include>>:\n"
               "  - Use Case UC05 (Thuê tài khoản) BẮT BUỘC <<include>> Use Case UC01 (Đăng nhập): Người dùng phải được xác thực trước khi tạo giao dịch.\n"
               "  - Use Case UC05 BẮT BUỘC <<include>> kiểm tra số dư ví (liên kết UC04).\n"
               "  - Use Case UC10 (Thêm mới tài khoản) BẮT BUỘC <<include>> kiểm tra quyền Administrator.\n"
               "• Quan hệ <<extend>>:\n"
               "  - Use Case UC07 (Gia hạn thời gian) mở rộng (<<extend>>) từ Use Case UC06 (Giám sát phiên thuê) khi khách hàng có nhu cầu leo rank tiếp.\n"
               "  - Use Case UC08 (Trả nick sớm / Báo lỗi) mở rộng (<<extend>>) từ UC06 khi phiên chơi kết thúc sớm hoặc gặp sự cố kỹ thuật.")

    doc.add_page_break()

    # 4. Phần II: Đặc tả chi tiết từng Use Case theo chuẩn mẫu của giảng viên
    add_h1(doc, "PHẦN II: ĐẶC TẢ CHI TIẾT TỪNG USE CASE (CHUẨN BIỂU MẪU GIẢNG VIÊN)")
    add_p(doc, "Mỗi Use Case dưới đây được đặc tả theo cấu trúc chuẩn mực như tài liệu mẫu 'UC1_Add New Product' của giảng viên bộ môn Kiểm thử phần mềm, bao gồm đầy đủ các trường thông tin: Function, UC ID & Name, Created By, Actors, Trigger, Description, Preconditions, Postconditions, Normal Flow, Alternative Flows, Exceptions (1.0.E...), Priority, Business Rules (BR...) và Ghi chú QA.")

    for uc in USE_CASES_DATA:
        add_h2(doc, f"Đặc tả Use Case: {uc['id']} - {uc['name']}")
        add_use_case_form_table(doc, uc)
        doc.add_page_break()

    # 5. Phần III: Đặc tả màn hình giao diện & ràng buộc nhập liệu
    add_h1(doc, "PHẦN III: ĐẶC TẢ CÁC MÀN HÌNH GIAO DIỆN & RÀNG BUỘC NHẬP LIỆU")
    add_p(doc, "Nhằm phục vụ kiểm thử Integration Test và kiểm thử tính đúng đắn của dữ liệu trên giao diện (UI Data Validation), bảng dưới đây đặc tả chi tiết thuộc tính từng trường nhập liệu của các form trọng tâm trong hệ thống:")

    add_h2(doc, "3.1. Đặc tả màn hình Thêm mới tài khoản game vào kho (Chuẩn UC1)")
    ui_headers = ["Tên Trường (Field Name)", "Tên Nhãn (Label)", "Kiểu Dữ Liệu", "Độ Dài / Giới Hạn", "Bắt Buộc", "Quy Tắc Ràng Buộc (Validation Rules) & Thông Báo Lỗi"]
    ui_rows = [
        ["code", "Mã sản phẩm", "String", "8 - 30 ký tự", "Có (Yes)", "Chỉ gồm chữ cái và chữ số, không khoảng trắng, duy nhất trong CSDL. Báo lỗi: 'Mã sản phẩm không đúng định dạng' hoặc 'Mã sản phẩm đã tồn tại'."],
        ["title", "Tên tài khoản", "String", "10 - 50 ký tự", "Có (Yes)", "Mô tả tên nick/skin/rank. Báo lỗi: 'Tên sản phẩm phải từ 10 đến 50 ký tự'."],
        ["gameId", "Tựa game", "Dropdown", "Giá trị cố định", "Có (Yes)", "Chọn từ danh mục: Valorant, Liên Quân, Genshin Impact, FO4, PUBG, Tốc Chiến."],
        ["pricePerHour", "Giá thuê / giờ", "Number (Integer)", "1.000 - 500.000", "Có (Yes)", "Số nguyên dương chia hết cho 1.000đ. Báo lỗi: 'Giá thuê phải từ 1.000đ đến 500.000đ/giờ'."],
        ["rank", "Bậc xếp hạng", "String", "3 - 20 ký tự", "Có (Yes)", "Ví dụ: 'Kim Cương', 'Cao Thủ', 'Thách Đấu', 'Ascendant'."],
        ["server", "Máy chủ", "Dropdown", "Giá trị cố định", "Có (Yes)", "Mặc định 'Việt Nam', 'Châu Á (Asia)', 'Bắc Mỹ (NA)'."],
        ["secretAccount", "Tài khoản login", "String", "4 - 30 ký tự", "Có (Yes)", "Tài khoản đăng nhập in-game bàn giao cho khách."],
        ["secretPassword", "Mật khẩu login", "String", "6 - 50 ký tự", "Có (Yes)", "Mật khẩu in-game được mã hóa lưu trữ, bàn giao bảo mật."],
        ["image", "Ảnh đại diện nick", "File / URL", "Dung lượng <= 1MB", "Có (Yes)", "Định dạng cho phép: *.jpg, *.png, *.gif. Báo lỗi: 'Ảnh không đúng định dạng hoặc vượt quá 1MB'."]
    ]
    add_table_custom(doc, ui_headers, ui_rows, col_widths=[1.1, 1.2, 0.9, 1.1, 0.6, 2.3])

    add_h2(doc, "3.2. Đặc tả màn hình Nạp tiền VietQR (Deposit Modal)")
    deposit_ui_headers = ["Tên Trường", "Nhãn Hiển Thị", "Kiểu Dữ Liệu", "Giới Hạn", "Bắt Buộc", "Ràng Buộc & Thông Báo Lỗi"]
    deposit_ui_rows = [
        ["amount", "Số tiền nạp", "Number (VND)", "10.000 - 5.000.000", "Có (Yes)", "Tối thiểu 10.000đ, tối đa 5.000.000đ/lần. Báo lỗi: 'Số tiền nạp phải từ 10.000đ đến 5.000.000đ'."],
        ["method", "Phương thức nạp", "Radio Button", "vietqr / card", "Có (Yes)", "Mặc định chọn 'Chuyển khoản ngân hàng VietQR 24/7'."],
        ["transferContent", "Nội dung chuyển khoản", "Text (Readonly)", "Chuỗi cố định", "Tự sinh", "Cú pháp chuẩn: 'NAP {USERNAME}'. Hệ thống tự sinh kèm mã QR."]
    ]
    add_table_custom(doc, deposit_ui_headers, deposit_ui_rows, col_widths=[1.2, 1.4, 1.0, 1.2, 0.6, 1.8])

    doc.add_page_break()

    # 6. Phần IV: Bộ Test Cases chuẩn QA theo kỹ thuật phân tích
    add_h1(doc, "PHẦN IV: BỘ TEST CASES CHUẨN QA THEO CÁC KỸ THUẬT PHÂN TÍCH HỘP ĐEN")
    add_p(doc, "Để đảm bảo chất lượng đặc tả và tạo nền tảng vững chắc cho quá trình kiểm thử phần mềm, Nhóm 16 áp dụng nghiêm ngặt các kỹ thuật thiết kế kiểm thử hộp đen chuẩn quốc tế (ISTQB), bao gồm Phân tích giá trị biên (Boundary Value Analysis - BVA) và Phân vùng tương đương (Equivalence Partitioning - EP) tương ứng với tài liệu mẫu của cô giáo.")

    add_h2(doc, "4.1. Kỹ thuật Phân tích giá trị biên (Boundary Value Analysis - BVA)")
    add_p(doc, "Áp dụng kỹ thuật BVA cho các trường dữ liệu có giới hạn biên độ dài và giá trị số:")

    add_h3(doc, "4.1.1. BVA đối với trường Mã sản phẩm (Độ dài: 8 - 30 ký tự)")
    bva_code_headers = ["Mã Test Case", "Độ Dài Thử Nghiệm", "Giá Trị Đại Diện", "Kết Quả Mong Đợi", "Đánh Giá Biên"]
    bva_code_rows = [
        ["BVA_C01", "7 ký tự", "ACC1234", "Hệ thống báo lỗi độ dài không hợp lệ", "Biên dưới - 1 (Invalid Min-)"],
        ["BVA_C02", "8 ký tự", "ACC12345", "Hợp lệ, cho phép lưu", "Biên dưới (Valid Min)"],
        ["BVA_C03", "9 ký tự", "ACC123456", "Hợp lệ, cho phép lưu", "Biên dưới + 1 (Valid Min+)"],
        ["BVA_C04", "29 ký tự", "ACC12345678901234567890123456", "Hợp lệ, cho phép lưu", "Biên trên - 1 (Valid Max-)"],
        ["BVA_C05", "30 ký tự", "ACC123456789012345678901234567", "Hợp lệ, cho phép lưu", "Biên trên (Valid Max)"],
        ["BVA_C06", "31 ký tự", "ACC1234567890123456789012345678", "Hệ thống báo lỗi vượt quá 30 ký tự", "Biên trên + 1 (Invalid Max+)"]
    ]
    add_table_custom(doc, bva_code_headers, bva_code_rows, col_widths=[1.1, 1.1, 2.0, 2.0, 1.0])

    add_h3(doc, "4.1.2. BVA đối với trường Tên tài khoản (Độ dài: 10 - 50 ký tự)")
    bva_title_headers = ["Mã Test Case", "Độ Dài Thử Nghiệm", "Giá Trị Đại Diện", "Kết Quả Mong Đợi", "Đánh Giá Biên"]
    bva_title_rows = [
        ["BVA_T01", "9 ký tự", "Acc RankV", "Hệ thống báo lỗi tên dưới 10 ký tự", "Biên dưới - 1 (Invalid Min-)"],
        ["BVA_T02", "10 ký tự", "Acc Rank 1", "Hợp lệ, cho phép lưu", "Biên dưới (Valid Min)"],
        ["BVA_T03", "11 ký tự", "Acc Rank V1", "Hợp lệ, cho phép lưu", "Biên dưới + 1 (Valid Min+)"],
        ["BVA_T04", "49 ký tự", "Acc Valorant Ascendant 3 Full Skin Vandal Prime...", "Hợp lệ, cho phép lưu", "Biên trên - 1 (Valid Max-)"],
        ["BVA_T05", "50 ký tự", "Acc Valorant Ascendant 3 Full Skin Vandal Prime 10", "Hợp lệ, cho phép lưu", "Biên trên (Valid Max)"],
        ["BVA_T06", "51 ký tự", "Acc Valorant Ascendant 3 Full Skin Vandal Prime 100", "Hệ thống báo lỗi tên vượt quá 50 ký tự", "Biên trên + 1 (Invalid Max+)"]
    ]
    add_table_custom(doc, bva_title_headers, bva_title_rows, col_widths=[1.1, 1.1, 2.0, 2.0, 1.0])

    add_h2(doc, "4.2. Kỹ thuật Phân vùng tương đương (Equivalence Partitioning - EP)")
    ep_headers = ["Thuộc Tính", "Phân Vùng Hợp Lệ (Valid Class)", "Phân Vùng Không Hợp Lệ (Invalid Class)"]
    ep_rows = [
        ["Mã sản phẩm (code)", "• Chuỗi 8 - 30 ký tự chỉ gồm chữ và số.", "• Để trống (null/empty)\n• Nhỏ hơn 8 ký tự\n• Lớn hơn 30 ký tự\n• Chứa khoảng trắng\n• Chứa ký tự đặc biệt (!@#$%^&*)\n• Mã đã tồn tại trong CSDL"],
        ["Tên sản phẩm (title)", "• Chuỗi từ 10 đến 50 ký tự.", "• Để trống\n• Nhỏ hơn 10 ký tự\n• Lớn hơn 50 ký tự"],
        ["Giá thuê / giờ (price)", "• Số nguyên từ 1.000đ đến 500.000đ.", "• Để trống\n• Nhỏ hơn hoặc bằng 0\n• Lớn hơn 500.000đ\n• Chứa chữ hoặc ký tự đặc biệt\n• Số thập phân lẻ"],
        ["Hình ảnh (image)", "• Định dạng .jpg, .png, .gif dung lượng <= 1MB.", "• Không chọn file\n• File sai định dạng (.pdf, .exe, .doc, .zip)\n• Dung lượng file > 1MB"]
    ]
    add_table_custom(doc, ep_headers, ep_rows, col_widths=[1.5, 2.5, 3.2])

    add_h2(doc, "4.3. Bảng 20 Test Cases chi tiết cho chức năng Add New Product (Chuẩn mẫu cô giáo)")
    add_p(doc, "Bộ Test Case chuẩn QA bao phủ đầy đủ luồng chính, luồng ngoại lệ, BVA và EP theo đúng định dạng tài liệu mẫu 'UC1_Add New Product.pdf':")

    tc_headers = ["TC ID", "Mục Tiêu Kiểm Thử", "Tiền Điều Kiện", "Dữ Liệu Kiểm Thử (Test Data)", "Các Bước Thực Hiện", "Kết Quả Mong Đợi", "Mức Ưu Tiên"]
    tc_rows = [
        ["TC01", "Thêm mới sản phẩm thành công", "Admin đã đăng nhập", "Mã: SP000001, Tên: Nick Valorant Ascendant, Giá: 15.000, Ảnh: valo.jpg (500KB)", "1. Mở trang Thêm mới\n2. Nhập thông tin hợp lệ\n3. Bấm Thêm mới", "Hiển thị thông báo 'Thêm mới sản phẩm thành công'. Sản phẩm lưu vào CSDL và xuất hiện trên Client.", "High"],
        ["TC02", "Bỏ trống Mã sản phẩm", "Admin đã đăng nhập", "Mã: rỗng, Các trường khác hợp lệ", "Nhập các trường còn lại -> Bấm Thêm mới", "Hiển thị lỗi 'Mã sản phẩm không được để trống' màu đỏ dưới trường Mã sản phẩm.", "High"],
        ["TC03", "Bỏ trống Tên sản phẩm", "Admin đã đăng nhập", "Tên: rỗng, Các trường khác hợp lệ", "Nhập các trường còn lại -> Bấm Thêm mới", "Hiển thị lỗi 'Tên sản phẩm không được để trống' màu đỏ dưới trường Tên sản phẩm.", "High"],
        ["TC04", "Không chọn Hình ảnh", "Admin đã đăng nhập", "Ảnh: không chọn, Các trường khác hợp lệ", "Bấm Thêm mới", "Hiển thị lỗi 'Hình ảnh không được để trống' dưới trường upload ảnh.", "High"],
        ["TC05", "Bỏ trống tất cả các trường", "Admin đã đăng nhập", "Toàn bộ form để trống", "Bấm Thêm mới", "Hiển thị lỗi bắt buộc nhập tại tất cả các trường tương ứng đồng thời.", "High"],
        ["TC06", "Mã sản phẩm ngắn hơn 8 ký tự", "Admin đã đăng nhập", "Mã: SP123 (5 ký tự)", "Nhập form và bấm Thêm mới", "Hiển thị lỗi 'Mã sản phẩm không đúng định dạng (từ 8-30 ký tự)'.", "High"],
        ["TC07", "Mã sản phẩm dài hơn 30 ký tự", "Admin đã đăng nhập", "Mã: Chuỗi 31 ký tự", "Bấm Thêm mới", "Hiển thị lỗi định dạng độ dài mã sản phẩm.", "Medium"],
        ["TC08", "Mã chứa ký tự đặc biệt", "Admin đã đăng nhập", "Mã: SP@12345", "Bấm Thêm mới", "Hiển thị lỗi 'Mã sản phẩm chỉ gồm chữ và số'.", "High"],
        ["TC09", "Mã chứa khoảng trắng", "Admin đã đăng nhập", "Mã: 'SP 000001'", "Bấm Thêm mới", "Hiển thị lỗi không cho phép khoảng trắng.", "Medium"],
        ["TC10", "Tên sản phẩm dưới 10 ký tự", "Admin đã đăng nhập", "Tên: 'Nick Vip' (8 ký tự)", "Bấm Thêm mới", "Hiển thị lỗi 'Tên sản phẩm phải từ 10 ký tự trở lên'.", "High"],
        ["TC11", "Tên sản phẩm dài hơn 50 ký tự", "Admin đã đăng nhập", "Tên: Chuỗi 52 ký tự", "Bấm Thêm mới", "Hiển thị lỗi 'Tên sản phẩm không được quá 50 ký tự'.", "Medium"],
        ["TC12", "Upload file ảnh sai định dạng", "Admin đã đăng nhập", "Ảnh: file word document.pdf", "Bấm Thêm mới", "Hiển thị lỗi 'Định dạng ảnh không hợp lệ (.jpg, .png, .gif)'.", "High"],
        ["TC13", "Upload ảnh dung lượng > 1MB", "Admin đã đăng nhập", "Ảnh: photo_raw.jpg (1.8MB)", "Bấm Thêm mới", "Hiển thị lỗi 'Dung lượng ảnh vượt quá 1MB'.", "High"],
        ["TC14", "Upload file PNG hợp lệ", "Admin đã đăng nhập", "Ảnh: avatar.png (800KB)", "Bấm Thêm mới", "Thêm mới thành công, ảnh hiển thị sắc nét.", "Medium"],
        ["TC15", "Upload file GIF hợp lệ", "Admin đã đăng nhập", "Ảnh: skin_effect.gif (500KB)", "Bấm Thêm mới", "Thêm mới thành công, ảnh động hiển thị mượt mà.", "Medium"],
        ["TC16", "Upload file JPG hợp lệ", "Admin đã đăng nhập", "Ảnh: skin_preview.jpg (900KB)", "Bấm Thêm mới", "Thêm mới thành công.", "Medium"],
        ["TC17", "Mã sản phẩm đã tồn tại trong CSDL", "Admin đã đăng nhập", "Mã: SP000001 (đã có sẵn trong CSDL)", "Bấm Thêm mới", "Hiển thị thông báo: 'Mã sản phẩm đã tồn tại trong hệ thống, vui lòng nhập mã khác'.", "High"],
        ["TC18", "Nhập lại dữ liệu đúng sau khi có lỗi", "Đang hiển thị lỗi", "Sửa lại các trường sai thành hợp lệ", "Bấm Thêm mới", "Hệ thống xóa thông báo lỗi và thêm mới thành công.", "Medium"],
        ["TC19", "Kiểm tra màu sắc thông báo lỗi", "Nhập sai dữ liệu", "Dữ liệu sai", "Bấm Thêm mới", "Thông báo lỗi hiển thị với màu đỏ nổi bật ngay dưới trường tương ứng.", "Medium"],
        ["TC20", "Kiểm tra hiển thị sản phẩm trên Client", "Đã thêm thành công", "Sản phẩm vừa tạo", "Chuyển sang trang Cửa hàng Client", "Sản phẩm vừa tạo xuất hiện ngay ở đầu danh sách với giá và ảnh chính xác, sẵn sàng cho thuê.", "High"]
    ]
    add_table_custom(doc, tc_headers, tc_rows, col_widths=[0.6, 1.2, 1.0, 1.3, 1.0, 1.6, 0.5])

    # Save
    out_dir = "e:\\BTL_KTPM"
    docx_file = os.path.join(out_dir, "1_Dac_Ta_Yeu_Cau_Phan_Mem.docx")
    pdf_file = os.path.join(out_dir, "1_Dac_Ta_Yeu_Cau_Phan_Mem.pdf")
    doc.save(docx_file)
    print(f"[OK] Đã tạo file: {docx_file}")

    # Copy to Tài_Liệu
    tl_dir = os.path.join(out_dir, "Tài_Liệu")
    if os.path.exists(tl_dir):
        dest_docx = os.path.join(tl_dir, "1_Dac_Ta_Yeu_Cau_Phan_Mem.docx")
        shutil.copyfile(docx_file, dest_docx)
        print(f"[OK] Đã copy sang: {dest_docx}")

    # Convert to PDF
    try:
        print("[...] Đang xuất PDF cho File 1...")
        convert(docx_file, pdf_file)
        dest_pdf = os.path.join(tl_dir, "1_Dac_Ta_Yeu_Cau_Phan_Mem.pdf")
        shutil.copyfile(pdf_file, dest_pdf)
        print(f"[OK] Xuất PDF thành công: {pdf_file}")
    except Exception as e:
        print(f"[WARNING] Xuất PDF File 1: {e}")

if __name__ == "__main__":
    build_doc1()
