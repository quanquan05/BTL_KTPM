import plantuml
from PIL import Image
import shutil
import os
import zipfile
import io

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
    FontSize 11
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

rectangle "SƠ ĐỒ KIỂM THỬ CHUYỂN TRẠNG THÁI (STATE TRANSITION DIAGRAM) - HỆ THỐNG GAMERENT" as GlobalSystem {

    ' ================= CỘT TRÁI: VÒNG ĐỜI TÀI KHOẢN GAME =================
    package "PHÂN HỆ 1: VÒNG ĐỜI TRẠNG THÁI TÀI KHOẢN GAME (ACCOUNT LIFECYCLE)" as ColAcc #F0FDF4 {
        card "● <b>[Khởi tạo]:</b> Nhập kho tài khoản mới theo Form UC1 hợp lệ" as A0 #F1F5F9
        
        card "<b>TRẠNG THÁI 1: [available] - SẴN SÀNG CHO THUÊ</b>\\n• Tài khoản hiển thị công khai trên Shop\\n• Đầy đủ thông số: Game, Tầm giá thuê, Bậc rank, Skin" as A1 #DCFCE7
        
        card "<b>TRẠNG THÁI 2: [rented] - ĐANG ĐƯỢC THUÊ</b>\\n• Kích hoạt cơ chế Atomic Lock chống race condition\\n• Bàn giao Tên đăng nhập & Mật khẩu in-game bí mật (1s)" as A2 #FEF3C7
        
        card "<b>TRẠNG THÁI 3A: [need_change_pass] - CẦN ĐỔI MẬT KHẨU</b>\\n• Hết giờ ca thuê (00:00:00) hoặc Khách bấm Trả Sớm\\n• Thuật toán sinh pass ngẫu nhiên mới (12-14 ký tự)" as A3 #FED7AA
        
        card "<b>TRẠNG THÁI 3B: [disputed] - ĐANG BỊ KHIẾU NẠI SỰ CỐ</b>\\n• Khách mở DisputeModal báo lỗi sai pass / lỗi 2FA\\n• Đóng băng tài khoản và chờ Admin thẩm định" as A4 #FEE2E2
        
        card "<b>TRẠNG THÁI 4: [maintenance] - ĐANG BẢO TRÌ NICK</b>\\n• Admin duyệt bồi thường bảo hiểm 100% cho khách\\n• Đội ngũ kỹ thuật kiểm tra & reset quyền truy cập" as A5 #EDE9FE

        A0 -down-> A1 : " Thêm mới thành công"
        A1 -down-> A2 : " Khách bấm 'Thuê Ngay'\\n [Ví đủ tiền thanh toán]"
        A2 -down-> A3 : " Hết giờ (00:00) hoặc Trả sớm\\n [Timer về 0 hoặc Return early]"
        A2 -down-> A4 : " Khách báo lỗi / Khiếu nại\\n [Mở DisputeModal]"
        A4 -down-> A5 : " Admin xác nhận lỗi\\n [Duyệt bồi thường 100%]"
        
        A3 -up-> A1 : " Đổi mật khẩu mới tự động (1s)\\n [generateSecurePassword()]"
        A5 -up-> A1 : " Kỹ thuật hoàn tất reset pass\\n [Đưa acc về available]"
    }

    ' ================= CỘT PHẢI: VÒNG ĐỜI ĐƠN HÀNG THUÊ =================
    package "PHÂN HỆ 2: VÒNG ĐỜI TRẠNG THÁI ĐƠN HÀNG THUÊ (ORDER LIFECYCLE)" as ColOrder #EFF6FF {
        card "● <b>[Khởi tạo đơn]:</b> Khách tick đồng ý điều khoản & xác nhận thuê" as O0 #F1F5F9
        
        card "<b>TRẠNG THÁI 1: [active] - ĐƠN ĐANG CÓ HIỆU LỰC</b>\\n• Trừ tiền ví thành công, bàn giao thông tin đăng nhập\\n• Đồng hồ CountdownTimer đếm ngược từng giây (Live)" as O1 #FEF3C7
        
        card "<b>KỊCH BẢN 1: [completed] - HOÀN THÀNH TIÊU CHUẨN</b>\\n• CountdownTimer về 00:00:00 (Hết giờ bình thường)\\n• Đóng đơn hợp lệ, chuyển trạng thái completed" as O2 #DCFCE7
        
        card "<b>KỊCH BẢN 2: [completed (hoàn 50%)] - TRẢ NICK SỚM</b>\\n• Khách chủ động bấm 'Trả Nick Sớm' khi bận việc\\n• Tự động hoàn 50% tiền giờ chưa dùng vào ví" as O3 #E0E7FF
        
        card "<b>KỊCH BẢN 3: [disputed] - ĐANG KHIẾU NẠI ĐƠN HÀNG</b>\\n• Khách gửi Dispute sự cố in-game (sai pass/khóa)\\n• Đơn đưa vào danh sách chờ Admin giải quyết" as O4 #FEE2E2
        
        card "<b>KỊCH BẢN 4: [refunded (hoàn 100%)] - ĐÃ HOÀN TIỀN</b>\\n• Admin chấp thuận khiếu nại của khách hàng\\n• Hoàn lại 100% tiền đơn thuê vào ví cá nhân" as O5 #FFEDD5

        card "<b>CHÚ THÍCH KÝ HIỆU CHUẨN UML & ISTQB</b>\\n• ● : Trạng thái khởi đầu (Initial State)\\n• [state] : Khối trạng thái thực thể nghiệp vụ\\n• ──> : Chuyển dịch trạng thái kèm điều kiện [Guard]" as Legend #FFFFFF

        O0 -down-> O1 : " Tạo đơn & trừ ví"
        O1 -down-> O2 : " Hết giờ thuê (00:00:00)"
        O1 -down-> O3 : " Khách bấm 'Trả Nick Sớm'\\n [refund = hours * 50%]"
        O1 -down-> O4 : " Khách gửi khiếu nại lỗi"
        O4 -down-> O5 : " Admin duyệt khiếu nại\\n [Hoàn 100% tiền vào ví]"
        
        O2 -[hidden]down- O3
        O3 -[hidden]down- O4
        O5 -[hidden]down- Legend
    }

    ' Canh 2 cột song song từ trái sang phải
    ColAcc -[hidden]right- ColOrder
}
@enduml"""

server = plantuml.PlantUML(url='http://www.plantuml.com/plantuml/img/')
png_data = server.processes(puml_code)

final_img_path = 'Tài_Liệu/Hinh_11_So_Do_Chuyen_Trang_Thai.png'
with open(final_img_path, 'wb') as f:
    f.write(png_data)

im = Image.open(final_img_path)
w, h = im.size
print(f'Final Figure 11 dimensions: {w}x{h}, Ratio: {w/h:.2f}')

# Copy to brain artifact directory for preview
brain_dir = r'C:\Users\quan1\.gemini\antigravity-ide\brain\cd52d2d4-321f-422a-bc37-2b5aa4b3c958'
brain_path = os.path.join(brain_dir, 'Hinh_11_So_Do_Chuyen_Trang_Thai.png')
shutil.copy2(final_img_path, brain_path)
print(f'Copied to brain artifact: {brain_path}')

# Save PUML source
puml_path = 'Tài_Liệu/Hinh_11_So_Do_Chuyen_Trang_Thai.puml'
with open(puml_path, 'w', encoding='utf-8') as f:
    f.write(puml_code)
print(f'Saved PUML code to: {puml_path}')

# Update Word docx (replace image13.png)
docx_path = 'Tài_Liệu/BTL_KTPM_Nhóm_15.docx'
backup_path = 'Tài_Liệu/BTL_KTPM_Nhóm_15.docx.bak'

with open(final_img_path, 'rb') as f:
    new_img_data = f.read()

zin = zipfile.ZipFile(docx_path, 'r')
buffer = io.BytesIO()
zout = zipfile.ZipFile(buffer, 'w', compression=zipfile.ZIP_DEFLATED)

for item in zin.infolist():
    if item.filename == 'word/media/image13.png':
        zout.writestr(item, new_img_data)
        print('Replaced word/media/image13.png in docx with new Figure 11!')
    else:
        zout.writestr(item, zin.read(item.filename))

zin.close()
zout.close()

with open(docx_path, 'wb') as f:
    f.write(buffer.getvalue())

print('Successfully updated Figure 11 in docx file!')
