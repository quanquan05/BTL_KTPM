# -*- coding: utf-8 -*-
"""
Generator for File 2:
2_Tai_Lieu_Yeu_Cau_He_Thong.docx & 2_Tai_Lieu_Yeu_Cau_He_Thong.pdf
Tương ứng Cột 2: "2. Tài liệu yêu cầu hệ thống" trong Bảng theo dõi sản phẩm BTL Kiểm thử phần mềm.
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
    add_table_custom, add_cover_page,
    NAVY, BLUE, EMERALD, DARK_GRAY, TEXT_COLOR, RED
)

def build_doc2():
    doc = create_doc_base()

    # 1. Trang bìa
    add_cover_page(
        doc,
        doc_title_main="TÀI LIỆU YÊU CẦU HỆ THỐNG\n(SYSTEM REQUIREMENTS DOCUMENT - SRD)",
        doc_sub_title="Tài liệu thiết kế và đặc tả toàn diện yêu cầu chức năng, phi chức năng, kiến trúc kỹ thuật và mô hình dữ liệu hệ thống GameRent",
        col_label="2: 2. TÀI LIỆU YÊU CẦU HỆ THỐNG"
    )

    # 2. Lời mở đầu
    add_h1(doc, "LỜI MỞ ĐẦU & CĂN CỨ TÀI LIỆU")
    add_p(doc, "Tài liệu này được biên soạn bởi Nhóm 16 – Lớp tín chỉ Kiểm thử phần mềm-1-1-26(N05), Trường Đại học Công nghệ Đông Á (EAUT), đóng vai trò là Sản phẩm công việc có sẵn số 2: 'Tài liệu yêu cầu hệ thống' (System Requirements Document - SRD) theo đúng đề cương phân công bài tập lớn của bộ môn Kiểm thử phần mềm.")
    add_p(doc, "Mục đích tài liệu:", bold=True)
    add_p(doc, "• Thiết lập tiêu chuẩn kỹ thuật hoàn chỉnh về kiến trúc, luồng dữ liệu, môi trường triển khai cho hệ thống Website Cho thuê tài khoản game trực tuyến tự động (GameRent).\n"
               "• Định nghĩa chi tiết danh mục Yêu cầu chức năng (FR-01 đến FR-10) và Yêu cầu phi chức năng (NFR) làm cơ sở thiết kế các kịch bản kiểm thử tích hợp (Integration Test) và kiểm thử hệ thống (System Test).\n"
               "• Xây dựng Từ điển dữ liệu (Data Dictionary), Ma trận phân quyền RBAC và Ma trận truy vết yêu cầu (Requirements Traceability Matrix - RTM) kết nối chặt chẽ giữa tài liệu đặc tả, mã nguồn ứng dụng và kế hoạch kiểm thử.")

    doc.add_page_break()

    # CHƯƠNG 1
    add_h1(doc, "CHƯƠNG 1: TỔNG QUAN HỆ THỐNG VÀ BỐI CẢNH DỰ ÁN")
    add_h2(doc, "1.1. Bối cảnh thị trường và tính cấp thiết")
    add_p(doc, "Thị trường thể thao điện tử (Esports) và game trực tuyến tại Việt Nam đang phát triển bùng nổ với các tựa game đình đám: Liên Quân Mobile, Valorant, Genshin Impact, FIFA Online 4 (FC Online), PUBG... Nhu cầu trải nghiệm các tài khoản sở hữu rank cao, trang phục (skin) hiếm và vật phẩm giới hạn của cộng đồng game thủ là cực kỳ lớn.")
    add_p(doc, "Tuy nhiên, phương thức thuê acc truyền thống qua mạng xã hội (Facebook groups, Zalo, Discord) tồn tại vô số bất cập nguy hiểm:")
    add_p(doc, "• Lừa đảo, chiếm đoạt tiền đặt cọc hoặc nạp thẻ cào nhưng không nhận được thông tin đăng nhập.\n"
               "• Bàn giao tài khoản thủ công chậm trễ, thời gian chờ đợi lâu, tài khoản thường xuyên bị sai pass hoặc dính mã bảo vệ 2 lớp (2FA).\n"
               "• Tranh chấp giờ chơi, bên cho thuê đổi mật khẩu trước thời hạn mà khách hàng không có cơ chế khiếu nại hay hoàn tiền.")
    add_p(doc, "Do đó, dự án xây dựng Hệ thống Website Cho thuê tài khoản game trực tuyến tự động 24/7 (GameRent) là giải pháp công nghệ cấp thiết, loại bỏ hoàn toàn trung gian con người và đảm bảo minh bạch tài chính tuyệt đối.")

    add_h2(doc, "1.2. Mục tiêu chiến lược của hệ thống")
    add_p(doc, "• Tự động hóa 100% chu trình thuê: Khách hàng chỉ cần bấm thuê -> Hệ thống trừ ví -> Tự động bàn giao tài khoản và mật khẩu in-game ngay lập tức.\n"
               "• Giám sát thời gian thực: Đồng hồ đếm ngược từng giây (HH:MM:SS), tự động thu hồi mật khẩu và khóa phiên khi hết giờ.\n"
               "• Thanh toán hiện đại qua VietQR: Tạo mã QR động chuẩn ngân hàng MBBank, nạp tiền tự động 24/7 không cần chờ duyệt thủ công.\n"
               "• Cơ chế hoàn tiền tự động 100%: Bảo vệ quyền lợi khách hàng tuyệt đối khi gặp sự cố đăng nhập hoặc nick bị khóa.")

    add_h2(doc, "1.3. Phạm vi hệ thống (System Scope)")
    add_p(doc, "• Trong phạm vi (In-Scope):\n"
               "  - Quản lý định danh, xác thực và phân quyền RBAC (Khách vãng lai, Khách hàng, Admin).\n"
               "  - Cửa hàng hiển thị danh mục acc, bộ lọc game, lọc giá, tìm kiếm thông minh.\n"
               "  - Ví điện tử cá nhân, nạp tiền tự động qua VietQR, lịch sử biến động số dư.\n"
               "  - Động cơ thuê nick tự động, khóa trạng thái nick độc quyền, bàn giao mật khẩu in-game.\n"
               "  - Đồng hồ đếm ngược phiên thuê, chức năng gia hạn giờ chơi, trả nick sớm.\n"
               "  - Cơ chế khiếu nại báo lỗi và hoàn tiền ví tự động.\n"
               "  - Dashboard quản trị kho nick chuẩn UC1, giám sát phiên thuê live và điều phối nghiệp vụ của Admin.\n"
               "• Ngoài phạm vi (Out-of-Scope):\n"
               "  - Can thiệp trực tiếp vào máy chủ game nội bộ của nhà phát hành (Riot Games, Garena, Mihoyo) để tự đổi mật khẩu in-game (hệ thống xử lý cấp độ bàn giao bí mật thông tin và đổi pass ca trực).")

    doc.add_page_break()

    # CHƯƠNG 2
    add_h1(doc, "CHƯƠNG 2: MÔI TRƯỜNG VẬN HÀNH VÀ KIẾN TRÚC HỆ THỐNG")
    add_h2(doc, "2.1. Mô hình kiến trúc phần mềm tổng thể")
    add_p(doc, "Hệ thống GameRent được thiết kế theo kiến trúc Single Page Application (SPA) hiện đại kết hợp cơ chế dịch vụ bất đồng bộ:")
    add_p(doc, "• Tầng giao diện người dùng (Frontend Presentation Layer): Xây dựng trên nền tảng React 18 kết hợp Vite build tool tốc độ cao. Giao diện thiết kế theo phong cách Dark Mode Cyberpunk Gaming tối ưu trải nghiệm thị giác game thủ, đáp ứng hoàn hảo trên cả Desktop, Tablet và Mobile.\n"
               "• Tầng quản lý trạng thái (State Management Layer): Ứng dụng React Context API (AppContext) quản lý tập trung toàn bộ state toàn cục (CurrentUser, AccountsList, ActiveRentals, WalletBalance, Notifications) đảm bảo dữ liệu đồng bộ tức thì trên mọi component.\n"
               "• Tầng mô phỏng dịch vụ & CSDL (Mock Service & LocalStorage Engine): Đóng gói các module dịch vụ chuẩn RESTful (authService, accountService, rentalService, walletService) tương tác trực tiếp với LocalStorage có cơ chế khởi tạo dữ liệu mẫu (Seed Data) tự động, giúp hệ thống hoạt động độc lập, sẵn sàng cho việc kiểm thử tự động và kiểm thử thủ công không bị phụ thuộc mạng ngoài.\n"
               "• Tầng tích hợp thanh toán (VietQR Gateway): Tích hợp chuẩn mã QR Napas247, sinh payload VietQR động theo thời gian thực chứa số tài khoản, mã ngân hàng và cú pháp nội dung chuyển khoản.")

    add_h2(doc, "2.2. Yêu cầu môi trường triển khai và kiểm thử")
    env_headers = ["Thành phần", "Cấu hình / Yêu cầu kỹ thuật"]
    env_rows = [
        ["Trình duyệt Client", "Google Chrome (>= v90), Microsoft Edge (>= v90), Mozilla Firefox (>= v88), Safari (>= v14)"],
        ["Độ phân giải màn hình", "Tối thiểu 375px (Mobile Portrait), Tối ưu 1366x768 (Laptop) và 1920x1080 (Desktop Full HD)"],
        ["Môi trường chạy ứng dụng", "Node.js (>= v18.x), Trình quản lý gói npm (>= v9.x), Vite Dev Server (Port 5173/3000)"],
        ["Công cụ kiểm thử", "Selenium WebDriver, Pytest / Vitest, Chrome DevTools, Postman"],
        ["Hệ điều hành hỗ trợ", "Windows 10/11, macOS, Linux (Ubuntu/Debian)"]
    ]
    add_table_custom(doc, env_headers, env_rows, col_widths=[2.2, 4.4])

    doc.add_page_break()

    # CHƯƠNG 3
    add_h1(doc, "CHƯƠNG 3: MÔ HÌNH TÁC TỬ VÀ MA TRẬN PHÂN QUYỀN (RBAC MATRIX)")
    add_h2(doc, "3.1. Các vai trò người dùng trong hệ thống")
    add_p(doc, "Hệ thống thiết lập 4 vai trò cụ thể:")
    add_p(doc, "1. Khách vãng lai (Guest): Người truy cập chưa đăng nhập.\n"
               "2. Khách hàng (Customer / Renter): Game thủ đăng ký tài khoản và thuê nick.\n"
               "3. Quản trị viên (Admin): Ban quản trị điều hành toàn bộ sàn.\n"
               "4. Tiến trình hệ thống (System Scheduler): Engine tự động chạy ngầm cập nhật timer và trạng thái.")

    add_h2(doc, "3.2. Ma trận phân quyền truy cập chức năng (RBAC Matrix)")
    rbac_headers = ["Chức Năng Hệ Thống", "Khách Vãng Lai", "Khách Hàng", "Quản Trị Viên", "Tiến Trình Ngầm"]
    rbac_rows = [
        ["Xem danh mục acc & chi tiết", "Cho phép (Read)", "Cho phép (Read)", "Cho phép (Read)", "Không"],
        ["Tìm kiếm & Lọc tài khoản", "Cho phép", "Cho phép", "Cho phép", "Không"],
        ["Đăng ký & Đăng nhập", "Cho phép", "Cho phép (Đổi pass)", "Cho phép", "Không"],
        ["Nạp tiền ví qua VietQR", "Yêu cầu đăng nhập", "Cho phép (Tạo QR)", "Cho phép (Test/Nạp)", "Khớp lệnh tự động"],
        ["Đặt thuê tài khoản game", "Yêu cầu đăng nhập", "Cho phép", "Cho phép", "Không"],
        ["Xem thông tin nick & Mật khẩu", "Bị chặn", "Chỉ nick đang thuê", "Xem toàn bộ kho", "Không"],
        ["Gia hạn thời gian thuê", "Bị chặn", "Chỉ nick đang thuê", "Bù giờ (+1h)", "Không"],
        ["Trả nick sớm & Báo lỗi khiếu nại", "Bị chặn", "Cho phép", "Xử lý khiếu nại", "Không"],
        ["Thêm mới nick kho (Chuẩn UC1)", "Bị chặn", "Bị chặn", "Toàn quyền (CRUD)", "Không"],
        ["Giám sát Live Session & Đổi pass", "Bị chặn", "Bị chặn", "Toàn quyền can thiệp", "Thu hồi khi hết giờ"]
    ]
    add_table_custom(doc, rbac_headers, rbac_rows, col_widths=[2.2, 1.1, 1.1, 1.1, 1.1])

    doc.add_page_break()

    # CHƯƠNG 4
    add_h1(doc, "CHƯƠNG 4: YÊU CẦU CHỨC NĂNG HỆ THỐNG (FUNCTIONAL REQUIREMENTS - FR)")
    add_p(doc, "Toàn bộ hệ thống GameRent được cấu thành từ 10 Yêu cầu chức năng cốt lõi (FR-01 đến FR-10), được mô tả chi tiết theo cấu trúc Input - Processing Logic - Output:")

    fr_data = [
        {
            "id": "FR-01",
            "name": "Quản lý Định danh & Xác thực (Authentication & RBAC)",
            "module": "Phân hệ Người dùng & Bảo mật",
            "desc": "Cho phép người dùng đăng ký tài khoản mới, đăng nhập hệ thống, duy trì phiên làm việc và phân định quyền hạn theo vai trò (Customer hoặc Admin).",
            "input": "Username, Password, Confirm Password, Phone number.",
            "logic": "Kiểm tra độ dài, kiểm tra trùng lặp username, mã hóa/lưu phiên, phân quyền truy cập.",
            "output": "Phiên đăng nhập hợp lệ, JWT/LocalStorage Token, cập nhật Navbar, thông báo Toast."
        },
        {
            "id": "FR-02",
            "name": "Duyệt danh mục, Tìm kiếm & Lọc tài khoản game (Game Catalog)",
            "module": "Phân hệ Cửa hàng",
            "desc": "Hiển thị kho tài khoản theo từng tựa game, tìm kiếm theo tên/skin/rank, lọc theo khoảng giá và sắp xếp linh hoạt.",
            "input": "Từ khóa tìm kiếm, tab Game được chọn, khoảng giá (min - max), tiêu chí sắp xếp.",
            "logic": "Lọc mảng dữ liệu accounts theo thời gian thực (< 100ms), ưu tiên hiển thị nick available.",
            "output": "Danh sách thẻ tài khoản game khớp điều kiện, gắn nhãn trạng thái và giá thuê rõ ràng."
        },
        {
            "id": "FR-03",
            "name": "Quản lý Ví điện tử & Nạp tiền tự động VietQR (Wallet & Deposit)",
            "module": "Phân hệ Tài chính & Ví",
            "desc": "Cung cấp ví tiền ảo cá nhân, hỗ trợ nạp tiền tự động qua mã VietQR chuẩn ngân hàng MBBank.",
            "input": "Số tiền nạp (10.000đ - 5.000.000đ), phương thức nạp (VietQR).",
            "logic": "Xác thực số tiền, sinh mã VietQR động với cú pháp 'NAP {USERNAME}', cập nhật số dư ví.",
            "output": "Mã VietQR hiển thị trực tiếp, biến động số dư ví (+ tiền), lịch sử giao dịch nạp."
        },
        {
            "id": "FR-04",
            "name": "Động cơ Đặt thuê tài khoản tức thì (Instant Rental Engine)",
            "module": "Phân hệ Giao dịch Cho thuê",
            "desc": "Xử lý đặt thuê tài khoản, trừ tiền ví, khóa trạng thái nick độc quyền và bàn giao thông tin.",
            "input": "Account ID, Số giờ thuê (1 - 72 giờ), Mã voucher giảm giá (nếu có).",
            "logic": "Kiểm tra nick available, kiểm tra ví >= Tổng tiền = (Giá/h * Giờ) - Giảm giá. Trừ ví, set status='rented'.",
            "output": "Đơn thuê RentalOrder mới trạng thái 'active', tài khoản game chuyển 'rented', bàn giao mật khẩu."
        },
        {
            "id": "FR-05",
            "name": "Đếm ngược thời gian thực & Bàn giao nick (Live Countdown)",
            "module": "Phân hệ Phiên thuê",
            "desc": "Đồng hồ đếm ngược từng giây (HH:MM:SS), hiển thị tài khoản, bật/tắt mật khẩu và copy 1-click.",
            "input": "Rental Order ID của khách hàng đang đăng nhập.",
            "logic": "Tính RemainingTime = expiresAt - currentTime. Cập nhật state mỗi 1s. Mở khóa xem secretPassword.",
            "output": "Hiển thị đồng hồ đếm ngược trực quan, sao chép tài khoản/mật khẩu vào clipboard."
        },
        {
            "id": "FR-06",
            "name": "Gia hạn thời gian thuê liền mạch (Rental Extension Engine)",
            "module": "Phân hệ Phiên thuê",
            "desc": "Cho phép khách hàng đang thuê mua thêm giờ chơi nối tiếp mà không bị gián đoạn hay đổi pass.",
            "input": "Rental Order ID, Số giờ muốn gia hạn (+1h, +2h, +3h...).",
            "logic": "Kiểm tra số dư ví >= (Giá/h * Số giờ gia hạn), trừ tiền ví, cộng trực tiếp vào expiresAt của đơn hiện tại.",
            "output": "Thời gian hết hạn mới, đồng hồ tăng tương ứng, ghi nhận giao dịch ví."
        },
        {
            "id": "FR-07",
            "name": "Trả tài khoản sớm & Chốt thời lượng (Early Return Protocol)",
            "module": "Phân hệ Phiên thuê",
            "desc": "Hỗ trợ khách hàng hoàn trả tài khoản trước hạn, hoàn lại 50% tiền số giờ chưa chơi.",
            "input": "Rental Order ID, Xác nhận trả nick sớm.",
            "logic": "Tính số giờ trọn vẹn còn lại, tính tiền hoàn = (Giờ_còn_lại * Giá/h) * 50%, cộng tiền vào ví, đổi status nick sang 'need_change_pass'.",
            "output": "Đóng phiên thuê, hoàn tiền vào ví khách, nick được thu hồi an toàn."
        },
        {
            "id": "FR-08",
            "name": "Quản lý Khiếu nại, Báo lỗi & Hoàn tiền tự động (Dispute Resolution)",
            "module": "Phân hệ Chăm sóc & Bảo vệ",
            "desc": "Khách hàng báo lỗi nick (sai pass, dính 2FA, bị cấm), hệ thống tự động hoàn 100% tiền phiên thuê.",
            "input": "Rental Order ID, Lý do lỗi (dropdown), Mô tả chi tiết, Ảnh chụp màn hình sự cố.",
            "logic": "Ghi nhận báo lỗi, khóa nick tạm thời, hoàn 100% tiền đơn vào ví khách, gửi thông báo Admin.",
            "output": "Hoàn tiền 100% vào ví khách hàng tức thì, tạo DisputeReport trong hệ thống."
        },
        {
            "id": "FR-09",
            "name": "Bàn làm việc Admin & Điều phối phiên thuê (Admin Live Session)",
            "module": "Phân hệ Quản trị Vận hành",
            "desc": "Admin theo dõi toàn bộ phiên thuê thời gian thực, can thiệp bù giờ, đổi pass, bảo trì và hoàn tiền.",
            "input": "Lệnh điều phối từ Admin: Bù giờ (+1h), Thu hồi & đổi pass, Bảo trì nick, Hoàn tiền.",
            "logic": "Kiểm tra quyền Admin, thực thi cập nhật trạng thái đơn thuê và tài khoản tương ứng.",
            "output": "Cập nhật trạng thái tức thì, thông báo Toast thành công, lưu nhật ký điều phối."
        },
        {
            "id": "FR-10",
            "name": "Quản lý Kho acc chuẩn UC1 & Báo cáo (Warehouse Management)",
            "module": "Phân hệ Quản trị Kho hàng",
            "desc": "Admin thực hiện thêm mới tài khoản game vào kho theo chuẩn UC1 của cô giáo, sửa/xóa và xem thống kê.",
            "input": "Mã sản phẩm (8-30 ký tự), Tên nick (10-50 ký tự), Game, Giá thuê, Rank, Server, User, Pass, Ảnh.",
            "logic": "Validate toàn bộ ràng buộc UC1 (duy nhất mã, độ dài, giá > 0, ảnh <= 1MB), lưu trữ vào kho.",
            "output": "Tài khoản mới xuất hiện trên Cửa hàng với trạng thái 'available', sẵn sàng cho thuê."
        }
    ]

    for fr in fr_data:
        add_h2(doc, f"{fr['id']}: {fr['name']}")
        fr_tbl_headers = ["Thuộc Tính", "Nội Dung Yêu Cầu Chức Năng"]
        fr_tbl_rows = [
            ["Mã Yêu Cầu (FR ID)", fr["id"]],
            ["Phân Hệ Quản Lý", fr["module"]],
            ["Mô Tả Nghiệp Vụ", fr["desc"]],
            ["Dữ Liệu Đầu Vào (Input)", fr["input"]],
            ["Quy Tắc Xử Lý Logic", fr["logic"]],
            ["Dữ Liệu Đầu Ra (Output)", fr["output"]],
            ["Mức Độ Ưu Tiên", "High / Critical"]
        ]
        add_table_custom(doc, fr_tbl_headers, fr_tbl_rows, col_widths=[1.8, 4.8], header_bg="1A365D")

    doc.add_page_break()

    # CHƯƠNG 5
    add_h1(doc, "CHƯƠNG 5: YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)")
    add_p(doc, "Các tiêu chuẩn phi chức năng đảm bảo hệ thống vận hành bền bỉ, an toàn và tối ưu trải nghiệm người dùng:")

    nfr_headers = ["Nhóm Yêu Cầu", "Mã NFR", "Tiêu Chuẩn Định Lượng & Kỹ Thuật Đạt Được"]
    nfr_rows = [
        ["Hiệu năng (Performance)", "NFR-P01", "Thời gian phản hồi các thao tác click, lọc danh mục, mở modal phải dưới 200ms."],
        ["Hiệu năng (Performance)", "NFR-P02", "Đồng hồ đếm ngược CountdownTimer cập nhật state chuẩn xác từng chu kỳ 1.000ms không gây giật lag."],
        ["Hiệu năng (Performance)", "NFR-P03", "Tốc độ nạp trang ban đầu (First Contentful Paint) < 1.2 giây nhờ đóng gói Vite tối ưu."],
        ["Bảo mật (Security)", "NFR-S01", "Mật khẩu in-game (secretPassword) của tài khoản được ẩn dạng '••••••••' mặc định."],
        ["Bảo mật (Security)", "NFR-S02", "Khách hàng chỉ được phép xem mật khẩu của các phiên thuê do chính mình sở hữu và còn trong hạn."],
        ["Bảo mật (Security)", "NFR-S03", "Trang AdminDashboard được bảo vệ bởi Admin Guard; chặn mọi truy cập trái phép của người dùng thường."],
        ["Bảo mật (Security)", "NFR-S04", "Sanitize toàn bộ dữ liệu form nhập liệu chống tấn công XSS (Cross-Site Scripting)."],
        ["Độ tin cậy (Reliability)", "NFR-R01", "Hệ thống tự động lưu trữ và phục hồi dữ liệu hoàn chỉnh qua LocalStorage Engine khi F5 tải lại trang."],
        ["Độ tin cậy (Reliability)", "NFR-R02", "Cơ chế khóa độc quyền: 1 tài khoản game chỉ cho phép tối đa 1 người thuê tại một thời điểm."],
        ["Độ tin cậy (Reliability)", "NFR-R03", "Chính sách hoàn tiền tự động 100% giúp giảm tỷ lệ tranh chấp tài chính xuống 0%."],
        ["Khả năng sử dụng (Usability)", "NFR-U01", "Giao diện chuẩn Dark Mode Cyberpunk sắc nét, màu sắc tương phản cao hỗ trợ game thủ chơi ban đêm."],
        ["Khả năng sử dụng (Usability)", "NFR-U02", "Hỗ trợ nút Copy 1-click cho tài khoản và mật khẩu kèm Toast thông báo trực quan."],
        ["Khả năng sử dụng (Usability)", "NFR-U03", "Thiết kế Responsive tương thích mượt mà trên cả Mobile, Tablet và Desktop."],
        ["Tương thích (Compatibility)", "NFR-C01", "Tương thích 100% với các trình duyệt hiện đại: Chrome, Edge, Firefox, Safari, Opera."]
    ]
    add_table_custom(doc, nfr_headers, nfr_rows, col_widths=[1.6, 1.0, 4.0])

    doc.add_page_break()

    # CHƯƠNG 6
    add_h1(doc, "CHƯƠNG 6: MÔ HÌNH DỮ LIỆU & TỪ ĐIỂN DỮ LIỆU (DATA DICTIONARY)")
    add_h2(doc, "6.1. Danh mục các Thực thể dữ liệu trong hệ thống")
    add_p(doc, "Cơ sở dữ liệu hệ thống GameRent được tổ chức thành 5 thực thể chính:")
    add_p(doc, "1. Users: Lưu trữ thông tin tài khoản người dùng, phân quyền (role) và số dư ví (balance).\n"
               "2. GameAccounts: Lưu trữ thông tin tài khoản game trong kho, tựa game, giá thuê, rank, server, mật khẩu và trạng thái.\n"
               "3. RentalOrders: Lưu trữ các đơn thuê, thời gian bắt đầu, thời gian kết thúc, tổng tiền và trạng thái phiên.\n"
               "4. Transactions: Lưu trữ lịch sử giao dịch ví (nạp tiền, trừ tiền thuê, hoàn tiền, gia hạn).\n"
               "5. DisputeReports: Lưu trữ khiếu nại báo lỗi sự cố của khách hàng kèm bằng chứng.")

    add_h2(doc, "6.2. Từ điển dữ liệu chi tiết (Data Dictionary)")

    add_h3(doc, "6.2.1. Bảng Users (Người dùng)")
    user_schema_headers = ["Tên Cột (Field)", "Kiểu Dữ Liệu", "Khóa", "Bắt Buộc", "Mô Tả & Quy Tắc"]
    user_schema_rows = [
        ["id", "String / UUID", "PK", "Yes", "Mã định danh duy nhất của người dùng (ví dụ: 'usr_001')"],
        ["username", "String (30)", "Unique", "Yes", "Tên đăng nhập hệ thống (4-30 ký tự, không dấu)"],
        ["fullName", "String (50)", "", "Yes", "Họ và tên hiển thị"],
        ["password", "String (100)", "", "Yes", "Mật khẩu đăng nhập (tối thiểu 6 ký tự)"],
        ["phone", "String (10)", "", "Yes", "Số điện thoại liên hệ chuẩn 10 số di động"],
        ["role", "String (10)", "", "Yes", "Phân quyền vai trò: 'admin' hoặc 'user'"],
        ["balance", "Number (VND)", "", "Yes", "Số dư ví điện tử hiện tại (>= 0, mặc định tặng 50.000đ khi đăng ký)"]
    ]
    add_table_custom(doc, user_schema_headers, user_schema_rows, col_widths=[1.2, 1.2, 0.6, 0.8, 2.8])

    add_h3(doc, "6.2.2. Bảng GameAccounts (Kho tài khoản game - Chuẩn UC1)")
    acc_schema_headers = ["Tên Cột", "Kiểu Dữ Liệu", "Khóa", "Bắt Buộc", "Mô Tả & Quy Tắc"]
    acc_schema_rows = [
        ["id", "String / UUID", "PK", "Yes", "Mã định danh hệ thống"],
        ["code", "String (30)", "Unique", "Yes", "Mã sản phẩm hiển thị (8-30 ký tự, ví dụ: 'VALO_ASC01')"],
        ["title", "String (50)", "", "Yes", "Tên tài khoản mô tả rank/skin (10-50 ký tự)"],
        ["gameId", "String (20)", "", "Yes", "Mã tựa game: 'valorant', 'lienquan', 'genshin', 'fo4'"],
        ["pricePerHour", "Number (Integer)", "", "Yes", "Giá thuê mỗi giờ (1.000đ - 500.000đ)"],
        ["rank", "String (20)", "", "Yes", "Bậc xếp hạng hiện tại của nick"],
        ["server", "String (20)", "", "Yes", "Máy chủ tài khoản (Việt Nam, Asia, Global)"],
        ["secretAccount", "String (50)", "", "Yes", "Tên tài khoản login vào game"],
        ["secretPassword", "String (50)", "", "Yes", "Mật khẩu in-game bảo mật bàn giao cho khách"],
        ["image", "String (URL)", "", "Yes", "Đường dẫn ảnh preview đại diện nick"],
        ["status", "String (20)", "", "Yes", "Trạng thái: 'available', 'rented', 'maintenance', 'need_change_pass'"]
    ]
    add_table_custom(doc, acc_schema_headers, acc_schema_rows, col_widths=[1.2, 1.2, 0.6, 0.8, 2.8])

    add_h3(doc, "6.2.3. Bảng RentalOrders (Đơn thuê tài khoản)")
    order_schema_headers = ["Tên Cột", "Kiểu Dữ Liệu", "Khóa", "Bắt Buộc", "Mô Tả & Quy Tắc"]
    order_schema_rows = [
        ["id", "String / UUID", "PK", "Yes", "Mã đơn thuê duy nhất (ví dụ: 'ord_123456')"],
        ["userId", "String", "FK", "Yes", "Mã khách hàng thực hiện thuê"],
        ["accountId", "String", "FK", "Yes", "Mã tài khoản game được thuê"],
        ["hours", "Number", "", "Yes", "Số giờ thuê ban đầu (1 - 72 giờ)"],
        ["totalAmount", "Number (VND)", "", "Yes", "Tổng tiền thanh toán đã trừ khuyến mãi"],
        ["startTime", "DateTime", "", "Yes", "Thời điểm bắt đầu phiên thuê"],
        ["expiresAt", "DateTime", "", "Yes", "Thời điểm kết thúc phiên thuê (dùng cho countdown timer)"],
        ["status", "String (20)", "", "Yes", "Trạng thái: 'active', 'completed', 'returned_early', 'disputed'"]
    ]
    add_table_custom(doc, order_schema_headers, order_schema_rows, col_widths=[1.2, 1.2, 0.6, 0.8, 2.8])

    doc.add_page_break()

    # CHƯƠNG 7
    add_h1(doc, "CHƯƠNG 7: CÁC QUY TẮC NGHIỆP VỤ HỆ THỐNG (SYSTEM BUSINESS RULES)")
    add_p(doc, "Các quy tắc nghiệp vụ ràng buộc cấp độ toàn hệ thống (System-Wide Business Rules):")

    sys_br_headers = ["Mã Quy Tắc", "Tên Quy Tắc", "Nội Dung Quy Chuẩn Bắt Buộc"]
    sys_br_rows = [
        ["BR-SYS-01", "Ràng buộc số dư ví khi thuê", "Khách hàng bắt buộc phải có số dư ví >= Tổng tiền thanh toán đơn thuê. Hệ thống không hỗ trợ cho nợ hoặc số dư âm."],
        ["BR-SYS-02", "Khóa nick độc quyền", "Ngay khi một giao dịch thuê được xác nhận thành công, tài khoản game lập tức chuyển status='rented'. Mọi yêu cầu thuê đồng thời từ người khác đều bị từ chối."],
        ["BR-SYS-03", "Xử lý hết giờ tự động", "Khi expiresAt <= currentTime, phiên thuê lập tức chuyển sang 'completed', làm mờ mật khẩu và kích hoạt cờ 'need_change_pass' để quản trị viên thu hồi mật khẩu."],
        ["BR-SYS-04", "Chính sách hoàn tiền khiếu nại", "Nếu khách hàng báo lỗi sự cố hợp lệ (sai pass, dính 2FA) trong vòng 15 phút đầu tiên, hệ thống tự động hoàn tiền 100% vào ví khách hàng tức thì."],
        ["BR-SYS-05", "Chính sách trả nick sớm", "Khách hàng chủ động trả nick sớm sẽ được hoàn lại 50% số tiền của các giờ chơi trọn vẹn chưa sử dụng nhằm khuyến khích trả nick sớm cho người khác thuê."]
    ]
    add_table_custom(doc, sys_br_headers, sys_br_rows, col_widths=[1.2, 1.8, 3.6])

    doc.add_page_break()

    # CHƯƠNG 8
    add_h1(doc, "CHƯƠNG 8: MA TRẬN TRUY VẾT YÊU CẦU (REQUIREMENTS TRACEABILITY MATRIX - RTM)")
    add_p(doc, "Bảng Ma trận truy vết yêu cầu (RTM) đối soát 2 chiều giữa Yêu cầu chức năng (FR), Use Case đặc tả, Màn hình / Component cài đặt và Cấp độ kiểm thử tương ứng:")

    rtm_headers = ["Mã Yêu Cầu (FR)", "Tên Yêu Cầu Chức Năng", "Use Case", "Component Cài Đặt", "Cấp Độ Kiểm Thử"]
    rtm_rows = [
        ["FR-01", "Quản lý Định danh & Xác thực RBAC", "UC01, UC02", "AuthModal.jsx, Navbar.jsx", "Unit Test, Integration Test"],
        ["FR-02", "Duyệt & Lọc danh mục game", "UC03", "HomePage.jsx, AccountDetailPage.jsx", "Integration Test, System Test"],
        ["FR-03", "Quản lý ví & Nạp tiền VietQR", "UC04", "WalletPage.jsx, DepositModal.jsx", "Unit Test, Integration Test"],
        ["FR-04", "Động cơ Đặt thuê tài khoản tức thì", "UC05", "RentConfirmModal.jsx, AppContext.jsx", "Integration Test, System Test"],
        ["FR-05", "Đồng hồ đếm ngược & Xem pass", "UC06", "MyRentalsPage.jsx, CountdownTimer.jsx", "Unit Test, Integration Test"],
        ["FR-06", "Gia hạn thời gian thuê nối tiếp", "UC07", "MyRentalsPage.jsx, RentConfirmModal.jsx", "Integration Test, System Test"],
        ["FR-07", "Trả tài khoản sớm", "UC08", "MyRentalsPage.jsx, ReturnEarlyModal.jsx", "Integration Test, System Test"],
        ["FR-08", "Báo lỗi sự cố & Hoàn tiền 100%", "UC08, UC09", "DisputeModal.jsx, AdminDashboardPage.jsx", "Integration Test, System Test"],
        ["FR-09", "Giám sát phiên thuê & Điều phối Admin", "UC09", "OverviewDashboard.jsx, SessionModal.jsx", "Integration Test, System Test"],
        ["FR-10", "Quản trị kho acc chuẩn UC1 & Thống kê", "UC10", "AdminDashboardPage.jsx, AddAccountModal.jsx", "Unit Test, Integration Test, Automation"]
    ]
    add_table_custom(doc, rtm_headers, rtm_rows, col_widths=[0.9, 1.9, 0.9, 1.7, 1.2])

    # Save
    out_dir = "e:\\BTL_KTPM"
    docx_file = os.path.join(out_dir, "2_Tai_Lieu_Yeu_Cau_He_Thong.docx")
    pdf_file = os.path.join(out_dir, "2_Tai_Lieu_Yeu_Cau_He_Thong.pdf")
    doc.save(docx_file)
    print(f"[OK] Đã tạo file: {docx_file}")

    # Copy to Tài_Liệu
    tl_dir = os.path.join(out_dir, "Tài_Liệu")
    if os.path.exists(tl_dir):
        dest_docx = os.path.join(tl_dir, "2_Tai_Lieu_Yeu_Cau_He_Thong.docx")
        shutil.copyfile(docx_file, dest_docx)
        print(f"[OK] Đã copy sang: {dest_docx}")

    # Convert to PDF
    try:
        print("[...] Đang xuất PDF cho File 2...")
        convert(docx_file, pdf_file)
        dest_pdf = os.path.join(tl_dir, "2_Tai_Lieu_Yeu_Cau_He_Thong.pdf")
        shutil.copyfile(pdf_file, dest_pdf)
        print(f"[OK] Xuất PDF thành công: {pdf_file}")
    except Exception as e:
        print(f"[WARNING] Xuất PDF File 2: {e}")

if __name__ == "__main__":
    build_doc2()
