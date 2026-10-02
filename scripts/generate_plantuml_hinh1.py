import plantuml
import os
import shutil

puml_code = """@startuml
skinparam packageStyle rectangle
skinparam roundcorner 12
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 11
skinparam shadowing false
skinparam dpi 110
skinparam backgroundColor #FFFFFF

' Styling
skinparam arrow {
    Color #334155
    FontSize 10
    FontColor #475569
}

skinparam actor {
    BorderColor #0F172A
    FontColor #0F172A
    FontSize 11
    FontStyle bold
}

skinparam usecase {
    BorderColor #0284C7
    FontColor #0F172A
    FontSize 10.5
}

left to right direction

' ================= ACTORS (LEFT) =================
actor "Khách vãng lai\\n(Guest)" as Guest #E0F2FE
actor "Khách thuê\\n(Renter)" as Renter #BAE6FD

Renter -[#0284C7,plain]-|> Guest : "<<generalization>>\\n(Kế thừa quyền)"
Guest -[hidden]down- Renter

' ================= SYSTEM BOUNDARY =================
rectangle "HỆ THỐNG CHO THUÊ TÀI KHOẢN GAME TRỰC TUYẾN 24/7 (GAMERENT)" as System #F8FAFC {

    ' CỘT TRÁI (LEFT COLUMN)
    package "1. CỬA HÀNG & KHÁM PHÁ (Guest & Thành viên)" as P1 #F0F9FF {
        usecase "Xem danh mục tài khoản\\n(Browse Catalog)" as UC_Catalog #E0F2FE
        usecase "Tìm kiếm & Lọc đa tiêu chí\\n(Search, Game, Rank, Price)" as UC_Search #E0F2FE
        usecase "Xem chi tiết & Thư viện ảnh\\n(Detail Specs & Gallery)" as UC_Detail #E0F2FE
        usecase "Đăng ký / Đăng nhập\\n(Register & Login)" as UC_Auth #E0F2FE
        usecase "Quản lý mục Yêu thích\\n(Favorites Separation)" as UC_Fav #E0F2FE
        usecase "Đổi mật khẩu cá nhân\\n(Change Password)" as UC_Pass #E0F2FE
    }

    package "2. VÍ ĐIỆN TỬ & THUÊ CA CHƠI (Dành cho Khách thuê)" as P2 #F0FDF4 {
        usecase "Xem biến động số dư ví\\n(Wallet & Transactions)" as UC_Wallet #DCFCE7
        usecase "Nạp tiền ví qua VietQR\\n(Deposit VietQR Auto)" as UC_Deposit #DCFCE7
        usecase "Sinh mã VietQR động\\n(Dynamic QR Generator)" as UC_QR #DCFCE7
        usecase "Thuê tài khoản game\\n(Instant Account Rental)" as UC_Rent #DCFCE7
        usecase "Kiểm tra ví & Khóa nick\\n(Atomic Check & Lock)" as UC_Lock #DCFCE7
        usecase "Quản lý ca thuê & Đếm ngược\\n(Live Countdown Timer)" as UC_Timer #DCFCE7
        usecase "Gia hạn / Trả sớm / Khiếu nại\\n(Extend / Early / Dispute)" as UC_Extend #FEE2E2
    }

    ' CỘT PHẢI (RIGHT COLUMN)
    package "3. QUẢN TRỊ & VẬN HÀNH (ADMIN) (Toàn quyền Admin)" as P3 #FEF2F2 {
        usecase "Quản trị kho tài khoản\\n(Stock Inventory)" as UC_Stock #FFE4E6
        usecase "Thêm tài khoản chuẩn UC1\\n(Add Product - BR1-BR6)" as UC_AddProd #FFEDD5
        usecase "Xử lý khiếu nại (Hoàn 100%)\\n(Dispute Claim Resolution)" as UC_Dispute #FFE4E6
        usecase "Quản lý khách hàng CRM\\n(CRM Customer Management)" as UC_CRM #FFE4E6
        usecase "Điều phối Live & Bù giờ +1h\\n(Live Session Dispatch)" as UC_Dispatch #FFE4E6
        usecase "Báo cáo doanh thu & KPI\\n(Revenue Financial Report)" as UC_Report #FFE4E6
        usecase "Cài đặt & Sao lưu JSON\\n(Settings & Backup Data)" as UC_Backup #FFE4E6
    }

    package "4. TÁC VỤ NỀN TỰ ĐỘNG (BACKGROUND ENGINE) (System Daemon 24/7)" as P4 #FAF5FF {
        usecase "Tự thu hồi & Đổi Pass mới khi hết giờ\\n(Auto Reset Password Engine)" as UC_AutoReset #EDE9FE
        usecase "Tự động đồng bộ khách mới sang CRM\\n(Auto Sync Customers & Orders)" as UC_AutoSync #EDE9FE
    }

    ' Relationships within Left
    UC_Deposit .[#059669].> UC_QR : "<<include>>"
    UC_Rent .[#059669].> UC_Lock : "<<include>>"
    UC_Extend .[#D97706].> UC_Timer : "<<extend>>"

    ' Relationships within Right
    UC_AddProd .[#D97706].> UC_Stock : "<<extend>>"

    ' Layout alignment between Left & Right packages
    P1 -[hidden]right- P3
    P2 -[hidden]right- P4
    P1 -[hidden]down- P2
    P3 -[hidden]down- P4
}

' ================= ACTORS (RIGHT) =================
actor "Quản trị viên\\n(Admin)" as Admin #FECACA
actor "Hệ thống tự động\\n(System Engine)" as Engine #E9D5FF
Admin -[hidden]down- Engine

' ================= CONNECTIONS =================
' 1. Khách vãng lai (Guest) -> P1
Guest --- UC_Catalog
Guest --- UC_Search
Guest --- UC_Detail
Guest --- UC_Auth

' 2. Khách thuê (Renter) -> P1 & P2
Renter --- UC_Fav
Renter --- UC_Pass
Renter --- UC_Wallet
Renter --- UC_Deposit
Renter --- UC_Rent
Renter --- UC_Timer

' 3. Quản trị viên (Admin) -> P3 (Connecting from UC to Actor to keep Admin on right)
UC_Stock --- Admin
UC_Dispute --- Admin
UC_CRM --- Admin
UC_Dispatch --- Admin
UC_Report --- Admin
UC_Backup --- Admin

' 4. Hệ thống nền (Engine) -> P4
UC_AutoReset --- Engine
UC_AutoSync --- Engine

@enduml"""

server = plantuml.PlantUML(url='http://www.plantuml.com/plantuml/img/')
raw_png = server.processes(puml_code)

out_file = os.path.abspath('Tài_Liệu/Hinh_1_PlantUML_UseCase.png')
with open(out_file, 'wb') as f:
    f.write(raw_png)

artifact_dir = r'C:\Users\quan1\.gemini\antigravity-ide\brain\cd52d2d4-321f-422a-bc37-2b5aa4b3c958'
shutil.copyfile(out_file, os.path.join(artifact_dir, 'Hinh_1_PlantUML_UseCase.png'))
