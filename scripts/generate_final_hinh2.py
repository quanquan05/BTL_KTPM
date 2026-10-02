import plantuml
from PIL import Image
import shutil
import os

puml_code = """@startuml
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam roundcorner 8
skinparam shadowing false
skinparam dpi 180
skinparam backgroundColor #FFFFFF

skinparam rectangle {
    BorderColor #0F172A
    BorderThickness 1.5
    FontSize 13
    FontStyle bold
    BackgroundColor #FFFFFF
}

skinparam package {
    BorderColor #334155
    BorderThickness 1.3
    FontSize 12
    FontStyle bold
    BackgroundColor #F8FAFC
}

skinparam card {
    BorderColor #A80036
    BorderThickness 1.1
    FontSize 10
    BackgroundColor #FEFECE
}

skinparam arrow {
    Color #A80036
    Thickness 1.3
    FontSize 9
    FontColor #0F172A
}

left to right direction

rectangle "SƠ ĐỒ LUỒNG NGHIỆP VỤ CHÍNH END-TO-END (E2E) - HỆ THỐNG GAMERENT" as System {

    ' ================= CỘT TRÁI: HÀNH TRÌNH KHÁCH HÀNG (CLIENT JOURNEY) =================
    package "1. PHÍA KHÁCH HÀNG (CLIENT JOURNEY)" as ColClient #F0F9FF {
        card "<b>Bước 1: Khám Phá & Lọc Sản Phẩm</b>\\n• Khách truy cập Trang Chủ, duyệt banner hero hot\\n• Lọc đa tiêu chí: 6 game, tầm giá, bậc rank, skin" as U1
        card "<b>Bước 2: Chọn Tài Khoản Ưng Ý</b>\\n• Xem thẻ chi tiết, cấu hình rank & thư viện ảnh\\n• Nhấn nút <b>'Thuê Ngay'</b> để khởi động quy trình" as U2
        card "<b>Bước 3: Xác Thực Thành Viên (AuthModal)</b>\\n• Đăng ký mới: Cấp ngay ví 50.000 VNĐ trải nghiệm\\n• Đăng nhập tài khoản cũ & lưu thông tin phiên" as U3 #FEF3C7
        card "<b>Bước 4: Thiết Lập Đơn Thuê (RentConfirmModal)</b>\\n• Lựa chọn số giờ thuê linh hoạt: 1h đến 48h\\n• Kiểm tra bảng tính tổng chi phí tự động" as U4
        card "<b>Bước 5: Nạp Tiền Ví VietQR (Nếu thiếu số dư)</b>\\n• Mở DepositModal: Quét mã QR Napas247 động\\n• Tiền được nạp tự động, không cần chờ duyệt" as U5
        card "<b>Bước 6: Xác Nhận Thuê Tài Khoản</b>\\n• Tick xác nhận chấp thuận điều khoản dịch vụ\\n• Nhấn nút <b>'Xác Nhận Thuê Ngay'</b>" as U6 #DCFCE7
        card "<b>Bước 7: Giám Sát Ca Chơi Live</b>\\n• Tự động chuyển sang màn hình <i>'Đơn thuê của tôi'</i>\\n• CountdownTimer đếm ngược từng giây (HH:MM:SS)\\n• Màu cảnh báo: Xanh (>1h) · Vàng (<1h) · Đỏ (Hết giờ)" as U7
        card "<b>Bước 8: Tùy Chọn Phát Sinh / Kết Thúc Ca:</b>\\n• <b>[Gia hạn]:</b> Bấm 'Gia Hạn' (+3.600s/h, trừ ví tự động)\\n• <b>[Trả sớm]:</b> Bấm 'Trả Nick' (Tự hoàn 50% tiền vào ví)\\n• <b>[Sự cố]:</b> Mở DisputeModal báo lỗi (Hoàn 100% tiền)" as U8 #FEF3C7

        U1 -left-> U2
        U2 -left-> U3
        U3 -left-> U4
        U4 -left-> U5
        U5 -left-> U6
        U6 -left-> U7
        U7 -left-> U8
    }

    ' ================= CỘT PHẢI: XỬ LÝ HỆ THỐNG & ĐỘNG CƠ NỀN (SYSTEM AUTOMATION) =================
    package "2. PHÍA HỆ THỐNG & ĐỘNG CƠ NỀN (SYSTEM AUTOMATION)" as ColSystem #FAF5FF {
        card "<b>Tự Động Đồng Bộ Khách Hàng Sang CRM</b>\\n• Lưu vết khách hàng mới vào cơ sở dữ liệu\\n• Khởi tạo số dư ví điện tử mặc định 50.000 VNĐ" as S1
        card "<b>Webhook VietQR Xử Lý Nạp Tự Động 24/7</b>\\n• Xác thực biến động số dư ngân hàng qua API\\n• Tự động cộng tiền ví khách hàng tức thời" as S2
        card "<b>KÍCH HOẠT ATOMIC CHECK & LOCK (CHỐNG RACE):</b>\\n• Kiểm tra nghiêm ngặt: account.status === 'available'\\n• Trừ tiền ví: remainingBalance = balance - cost\\n• Khóa trạng thái tài khoản: 'rented' tức thì\\n• Khởi tạo mã đơn hàng duy nhất ORDER-XXXX" as S3 #FEE2E2
        card "<b>Bàn Giao Tài Khoản Bảo Mật Tức Thì (1 Giây):</b>\\n• Hiển thị Tên đăng nhập game công khai\\n• Bàn giao Mật khẩu in-game bí mật cho khách" as S4 #DCFCE7
        card "<b>Thuật Toán Cảnh Báo Trôi Giây Live:</b>\\n• Đồng bộ thời gian thực theo chuẩn UTC/Local\\n• Tự động đổi màu cảnh báo trực quan cho khách" as S5
        card "<b>TỰ ĐỘNG THU HỒI & ĐỔI PASS MỚI (00:00:00):</b>\\n• Đóng đơn thuê (chuyển trạng thái 'completed')\\n• Thuật toán sinh mật khẩu ngẫu nhiên mới (12-14 ký tự)\\n• Vô hiệu hóa mật khẩu cũ đã bàn giao cho khách\\n• Đưa tài khoản về 'available' sẵn sàng cho khách mới" as S6 #EDE9FE
        card "<b>Xử Lý Hoàn Tiền Tự Động Vào Ví Cá Nhân:</b>\\n• Trả sớm: Tự hoàn 50% tiền của các giờ chưa dùng\\n• Khiếu nại lỗi: Admin duyệt hoàn 100% tiền bảo hiểm\\n• Chuyển trạng thái acc sang 'need_change_pass' / bảo trì" as S7 #FFEDD5

        S1 -left-> S2
        S2 -left-> S3
        S3 -left-> S4
        S4 -left-> S5
        S5 -left-> S6
        S6 -left-> S7
    }

    ColClient -[hidden]down- ColSystem

    ' ================= CÁC MŨI TÊN TƯƠNG TÁC TỪ TRÁI SANG PHẢI =================
    U3 -down-> S1 : "Tự đồng bộ CRM\\n& cấp ví 50k"
    U5 -down-> S2 : "Quét mã VietQR"
    U6 -down-> S3 : "Kích hoạt Atomic Lock\\nngay khi bấm Thuê"
    S4 -up-> U7 : "Bàn giao User/Pass (1s)\\nBắt đầu tính giờ"
    U8 -down-> S7 : "Trả sớm / Khiếu nại"
}
@enduml"""

server = plantuml.PlantUML(url='http://www.plantuml.com/plantuml/img/')
png_data = server.processes(puml_code)

final_path = 'Tài_Liệu/Hinh_2_Luong_Nghiep_Vu_Chinh_E2E.png'
with open(final_path, 'wb') as f:
    f.write(png_data)

im = Image.open(final_path)
w, h = im.size
print(f'Final Figure 2 dimensions: {w}x{h}, Ratio: {w/h:.2f}')

# Copy to brain artifact directory for preview
brain_dir = r'C:\Users\quan1\.gemini\antigravity-ide\brain\cd52d2d4-321f-422a-bc37-2b5aa4b3c958'
brain_path = os.path.join(brain_dir, 'Hinh_2_Luong_Nghiep_Vu_Chinh_E2E.png')
shutil.copy2(final_path, brain_path)
print(f'Copied to brain artifact: {brain_path}')
