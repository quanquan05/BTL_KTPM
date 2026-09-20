# 🎮 GameRent - Hệ Thống Cho Thuê Tài Khoản Game Tự Động 24/7

> **BÀI TẬP LỚN MÔN HỌC**: KIỂM THỬ PHẦN MỀM (SOFTWARE TESTING & QUALITY ASSURANCE)  
> **TRƯỜNG**: ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á (EAUT) — **KHOA**: CÔNG NGHỆ THÔNG TIN  
> **GIẢNG VIÊN HƯỚNG DẪN**: **ThS. Phạm Thị Loan**  
>
> **SINH VIÊN THỰC HIỆN**:
> 1. **Lê Hải Đăng**
> 2. **Lê Minh Quân**
> 3. **Lê Xuân Đạt**
> 4. **Lê Thanh Tùng**  
>
> **NỀN TẢNG CÔNG NGHỆ**: React 19 + Vite 8 + Modern CSS + Vitest Automation Suite

---

## 📌 1. Giới Thiệu Dự Án

**GameRent** là nền tảng thương mại điện tử chuyên cung cấp dịch vụ thuê tài khoản game trực tuyến tự động 24/7 (bao gồm các tựa game thịnh hành: *Liên Quân Mobile, Valorant, Genshin Impact, FC Online, PUBG Steam, LMHT: Tốc Chiến*...).

Hệ thống được xây dựng khép kín toàn bộ vòng đời dịch vụ:
1. **Đăng ký & Đăng nhập**: Phân quyền bảo mật giữa Khách thuê và Quản trị viên, tự động đồng bộ khách mới sang CRM.
2. **Nạp tiền ví tự động**: Mô phỏng VietQR Auto với các ngưỡng kiểm soát hạn mức giao dịch (BVA/EP).
3. **Tìm kiếm & Lọc thông minh**: Theo game, khoảng giá, bậc rank và trang phục VIP.
4. **Thuê tài khoản tự động**: Cấp thông tin đăng nhập bí mật tức thì chỉ trong 1 giây.
5. **Giám sát thời gian thực**: Đồng hồ đếm ngược từng giây, gia hạn ca chơi nối tiếp, trả tài khoản sớm.
6. **Thu hồi tự động**: Tự động đổi mật khẩu ngẫu nhiên khi hết giờ chơi và chuyển trạng thái về kho.
7. **Bảo hiểm & Khiếu nại**: Giải quyết báo lỗi sự cố kèm chính sách bảo hiểm hoàn tiền 100%.
8. **Bảng điều khiển quản trị (Admin Dashboard)**: Thống kê KPI doanh thu, cảnh báo 3 cấp độ khẩn cấp (Xanh - Vàng - Đỏ) và quản lý quan hệ khách hàng (CRM).

Dự án được thiết kế chuẩn mực phục vụ mục tiêu **thực hành, áp dụng và đánh giá toàn diện các kỹ thuật kiểm thử phần mềm chuyên sâu** theo chuẩn giáo trình kiểm thử quốc tế (ISTQB).

---

## 🎯 2. Trọng Tâm Kỹ Thuật Kiểm Thử Phần Mềm Áp Dụng

Hệ thống mã nguồn GameRent được cấu trúc chặt chẽ để thể hiện trực quan các phương pháp thiết kế ca kiểm thử hộp đen (Black-box Testing) và kiểm thử tự động (Automated Testing):

### 2.1. Phân tích giá trị biên (Boundary Value Analysis - BVA)
- **Nạp tiền ví (`deposit`)**: Hạn mức giao dịch quy định từ **10.000 VNĐ** đến **5.000.000 VNĐ**.
  - Biên dưới: `9.999 VNĐ` (Báo lỗi), `10.000 VNĐ` (Hợp lệ), `10.001 VNĐ` (Hợp lệ).
  - Biên trên: `4.999.999 VNĐ` (Hợp lệ), `5.000.000 VNĐ` (Hợp lệ), `5.000.001 VNĐ` (Báo lỗi).
- **Thời lượng thuê acc (`durationHours`)**: Quy định từ **1 giờ** đến **48 giờ**.
  - Kiểm tra các mốc: `0 giờ` (Chặn), `1 giờ` (Biên min hợp lệ), `48 giờ` (Biên max hợp lệ), `49 giờ` (Chặn).
- **Thêm sản phẩm mới (Theo đặc tả `UC1_Add New Product`)**:
  - Độ dài tiêu đề: Biên từ 5 đến 100 ký tự.
  - Giá thuê: Biên từ 1.000 VNĐ/giờ đến 200.000 VNĐ/giờ.
- **Độ dài mật khẩu & tên đăng ký**: Mật khẩu tối thiểu từ 6 ký tự trở lên.

### 2.2. Phân vùng tương đương (Equivalence Partitioning - EP)
- **Định dạng Email**: Lớp hợp lệ (chứa ký tự `@` và tên miền hợp lệ) vs Lớp không hợp lệ (để trống, thiếu `@`, sai cú pháp).
- **Số tiền nạp**: Lớp số nguyên hợp lệ vs Lớp số thực có phần thập phân (`10000.5`), lớp chứa chuỗi ký tự, lớp số âm.
- **Trạng thái tài khoản**: `available` (sẵn sàng cho thuê), `rented` (đang có khách thuê), `maintenance` (đang bảo trì), `need_change_pass` (cần thu hồi đổi pass).

### 2.3. Bảng quyết định điều kiện (Decision Table Testing)
- **Nghiệp vụ thuê tài khoản (`rentAccount`)**:
  - Điều kiện: [Đã đăng nhập?] $\times$ [Tài khoản không bị khóa?] $\times$ [Tài khoản game ở trạng thái `available`?] $\times$ [Số dư ví $\ge$ Tổng tiền thuê?].
  - Chỉ khi thỏa mãn 100% cả 4 điều kiện thì hệ thống mới kích hoạt trừ tiền ví, chuyển acc sang `rented` và bàn giao thông tin đăng nhập bí mật.
- **Nghiệp vụ hoàn tiền bảo hiểm (`resolveDispute`)**:
  - Quyết định phê duyệt hoàn tiền $\rightarrow$ ví người dùng được cộng lại 100% số tiền ca thuê, đơn chuyển trạng thái `completed`, tài khoản chuyển sang `maintenance` để kiểm tra.

### 2.4. Kiểm thử chuyển trạng thái (State Transition Testing)
Vòng đời trạng thái của một tài khoản game trong hệ thống:
$$\text{available (Sẵn sàng)} \xrightarrow{\text{Khách thuê}} \text{rented (Đang thuê)} \xrightarrow{\text{Hết giờ / Trả sớm}} \text{need\_change\_pass} \xrightarrow{\text{Đổi pass tự động}} \text{available}$$
$$\text{rented} \xrightarrow{\text{Khách báo lỗi}} \text{disputed (Khiếu nại)} \xrightarrow{\text{Admin duyệt hoàn tiền}} \text{maintenance (Bảo trì)}$$

---

## 🚀 3. Chi Tiết Các Phân Hệ Chức Năng

Hệ thống bao gồm **10 phân hệ nghiệp vụ hoàn chỉnh**:

```
GameRent Application Architecture
├── 1. Phân hệ Xác thực & Phân quyền (Auth & RBAC)
├── 2. Phân hệ Cửa hàng & Danh mục Game (Catalog & Filtering)
├── 3. Phân hệ Chi tiết tài khoản & Thư viện trang phục (Details & Preview)
├── 4. Phân hệ Thuê tài khoản tức thì (Instant Rental Flow)
├── 5. Phân hệ Đồng hồ đếm ngược & Gia hạn ca thuê (Live Timer & Extension)
├── 6. Phân hệ Trả tài khoản sớm & Báo lỗi khiếu nại (Early Return & Dispute)
├── 7. Phân hệ Ví điện tử & Nạp tiền tự động (Wallet & VietQR Simulation)
├── 8. Phân hệ Quản trị kho tài khoản & Thêm mới (Account Stock & UC1 Form)
├── 9. Phân hệ Quản lý khách hàng (CRM & Tự động đồng bộ khách đăng ký)
└── 10. Phân hệ Tổng quan giám sát & Cảnh báo khẩn cấp (Overview & Alerts)
```

### 1. Phân hệ Xác thực & Phân quyền (Auth & RBAC)
- Khởi động mặc định trang web ở trạng thái **Chưa đăng nhập** tại trang chủ Cửa hàng.
- Hộp thoại Đăng nhập / Đăng ký hiện đại, hỗ trợ kiểm tra tính hợp lệ dữ liệu ngay khi nhập.
- Phân tách rõ ràng giữa 2 vai trò:
  - **Quản trị viên (Admin)**: Toàn quyền quản trị kho, giám sát doanh thu, quản lý khách hàng, duyệt khiếu nại.
  - **Khách thuê (Renter)**: Khám phá kho acc, nạp tiền ví, thuê acc, theo dõi đơn của tôi, gia hạn và khiếu nại.
- Tự động bảo vệ route (Route Guard): Khách thuê không thể truy cập các trang quản trị của Admin.

### 2. Phân hệ Cửa hàng & Danh mục Game (Catalog & Filtering)
- Bộ lọc đa tiêu chí: Lọc theo 6 tựa game hot (*Liên Quân, Valorant, Genshin, FC Online, PUBG, Tốc Chiến*), theo khoảng giá thuê mỗi giờ, theo rank.
- Thanh tìm kiếm thông minh theo tên skin, tướng hoặc mã tài khoản.
- Sắp xếp linh hoạt: Giá tăng dần, giá giảm dần, đánh giá sao cao nhất, tài khoản mới nhất.
- Thẻ sản phẩm hiển thị đầy đủ: Ảnh đại diện chất lượng cao, bậc rank, server phát hành, giá thuê/giờ, nhãn "Bảo hiểm hoàn tiền 100%".

### 3. Phân hệ Chi tiết tài khoản & Thư viện ảnh (Details & Preview)
- Trình xem ảnh thư viện đa góc nhìn (Gallery Preview).
- Bảng thông số kỹ thuật chi tiết: Cấp độ, số lượng tướng/vũ khí, các trang phục đắt giá nhất.
- Hộp tính tiền dự kiến trực tiếp theo số giờ người dùng muốn thuê.

### 4. Phân hệ Thuê tài khoản tức thì (Instant Rental Flow)
- Chọn số giờ thuê từ 1 đến 48 giờ.
- Kiểm tra số dư ví tự động: Nếu thiếu tiền, hiển thị rõ số tiền cần nạp thêm và cho phép mở nhanh modal nạp tiền 1-click.
- Khi bấm xác nhận: Hệ thống trừ tiền ví, tạo mã đơn hàng duy nhất `ORDER-XXXX`, lập tức hiển thị thông tin đăng nhập bí mật (*Tài khoản & Mật khẩu game*) kèm nút sao chép nhanh tiện lợi.

### 5. Phân hệ Đồng hồ đếm ngược & Gia hạn ca thuê (Live Timer & Extension)
- Đồng hồ đếm ngược từng giây (`HH:MM:SS`) hiển thị liên tục thời gian chơi còn lại.
- Tự động đổi màu cảnh báo:
  - Màu xanh lá: Ca thuê còn nhiều thời gian (> 1 giờ).
  - Màu vàng cam: Ca thuê sắp hết hạn (còn dưới 60 phút).
  - Màu đỏ: Ca thuê đã hết giờ.
- **Nghiệp vụ Gia hạn thông minh (`extendRental`)**:
  - Nếu ca thuê đang còn hạn: Cộng nối tiếp số giờ thuê mới vào thời điểm hết hạn hiện tại (`endTime`).
  - Nếu ca thuê đã hết hạn: Tự động tính thời gian mới bắt đầu từ thời điểm bấm gia hạn (`Date.now()`).

### 6. Phân hệ Trả tài khoản sớm & Báo lỗi khiếu nại (Early Return & Dispute)
- **Trả sớm (`returnEarly`)**: Cho phép người chơi kết thúc ca chơi chủ động khi không còn nhu cầu; hệ thống giải phóng ca thuê và chuyển acc sang quy trình đổi mật khẩu.
- **Báo lỗi khiếu nại (`createDispute`)**: Khi gặp sự cố (sai mật khẩu, tài khoản bị khóa, trùng người chơi), khách hàng gửi yêu cầu hỗ trợ kèm mô tả chi tiết. Ca thuê được tạm dừng để Admin xử lý hoàn tiền 100%.

### 7. Phân hệ Ví điện tử & Nạp tiền tự động (Wallet & VietQR Simulation)
- Bảng biến động số dư theo dõi chi tiết mọi giao dịch (Nạp tiền, Phí thuê tài khoản, Hoàn tiền khiếu nại) kèm mã giao dịch `TX-XXXXX`.
- Modal nạp tiền mô phỏng VietQR Auto với các nút chọn nhanh mệnh giá (50k, 100k, 200k, 500k).
- Áp dụng nghiêm ngặt các điều kiện biên BVA (10.000đ - 5.000.000đ).

### 8. Phân hệ Quản trị kho tài khoản & Thêm mới (Stock Management & UC1)
- Bảng danh sách toàn bộ tài khoản game trong kho kèm trạng thái hoạt động.
- Chức năng đổi trạng thái nhanh: Sẵn sàng cho thuê $\leftrightarrow$ Bảo trì kỹ thuật.
- Form **Thêm mới tài khoản game** tuân thủ chuẩn 100% tài liệu đặc tả nghiệp vụ `UC1_Add New Product`: Tiêu đề, tựa game, nhà phát hành, rank, giá thuê, tài khoản bí mật, mật khẩu ban đầu, mô tả skin nổi bật.
- Cập nhật thông số và xóa tài khoản an toàn với modal xác nhận.

### 9. Phân hệ Quản lý khách hàng (CRM & Tự động đồng bộ)
- **Tự động đồng bộ khách hàng**: Khi người dùng đăng ký tài khoản khách mới bên ngoài, hệ thống lập tức tự động tạo hồ sơ khách hàng (`KH001`, `KH002`...) đưa vào trang Quản Lý Khách Hàng của Admin.
- **Tự động tích lũy số liệu**: Mỗi khi khách hàng phát sinh ca thuê thành công, hệ thống tự động cộng dồn **Số đơn thuê** và **Tổng chi tiêu** vào hồ sơ CRM của khách.
- Cung cấp đầy đủ các thao tác CRUD: Thêm khách hàng thủ công, Sửa thông tin liên hệ / Đổi trạng thái Hoạt động - Bị khóa, Xóa khách hàng.

### 10. Phân hệ Tổng quan giám sát & Cảnh báo khẩn cấp (Overview & Alerts)
- **3 Thẻ KPI tổng quan**: Tổng doanh thu thực tế, Số lượng tài khoản đang được thuê, Thẻ cảnh báo khẩn cấp.
- **Cảnh báo khẩn cấp 3 cấp độ thông minh**:
  - 🔴 **Mức Đỏ (Khẩn cấp)**: Có khiếu nại báo lỗi cần xử lý gấp, tài khoản cần bảo trì hoặc ca thuê hết hạn cần thu hồi pass.
  - 🟡 **Mức Vàng (Cảnh báo)**: Có các đơn thuê sắp hết hạn trong vòng 1 giờ.
  - 🟢 **Mức Xanh (An toàn)**: Toàn bộ hệ thống vận hành 100% ổn định, không có sự cố.
- Bảng danh sách tài khoản thuê thời gian thực kèm bộ lọc theo Game và Trạng thái.
- Popover chi tiết giám sát phiên thuê: Hỗ trợ Admin bù thêm giờ, thu hồi sớm, đưa vào bảo trì hoặc hoàn tiền chỉ với 1 click.

---

## 🧰 4. Thanh Công Cụ Hỗ Trợ Kiểm Thử (BTL Tester Tools)

Được bố trí cố định ở **góc dưới cùng bên phải màn hình**, thanh công cụ này là trợ thủ đắc lực dành cho Giảng viên và Tester nhằm rút ngắn tối đa thời gian thao tác kiểm thử:

| Công cụ / Nút bấm | Chức năng nghiệp vụ phục vụ kiểm thử |
| :--- | :--- |
| **Đổi vai trò 1-Click** | Chuyển đổi qua lại tức thì giữa quyền **Quản Trị Viên (Admin)** và **Khách Thuê** mà không cần qua các bước đăng xuất / đăng nhập thủ công. |
| **Nạp nhanh: +200.000 đ** | Bơm trực tiếp 200.000 VNĐ vào ví người dùng hiện tại để kiểm thử ngay luồng thanh toán và thuê acc. |
| **Tua giờ: -30 phút** | Chọn 1 ca thuê đang diễn ra và tua giảm 30 phút thời gian còn lại, giúp kiểm tra ngay lập tức các trạng thái: sắp hết hạn (< 1h) và hết hạn tự động thu hồi pass. |
| **Reset Dữ Liệu Về Gốc** | Xóa sạch bộ nhớ LocalStorage và khôi phục toàn bộ kho acc, đơn thuê và cấu hình ban đầu chuẩn của hệ thống. |

---

## 🔑 5. Danh Mục Tài Khoản Kiểm Thử

| Vai trò | Email đăng nhập | Mật khẩu | Tên hiển thị | Số dư ví ban đầu | Quyền hạn nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin@gamerent.vn` | `admin123` | **Quản Lý** | 3.000.000 VNĐ | Toàn quyền quản trị kho acc, xem KPI doanh thu, duyệt hoàn tiền khiếu nại, quản lý danh sách khách hàng CRM. |
| **Khách Thuê Mới** | *(Tự do đăng ký)* | *(Tự chọn $\ge 6$ ký tự)* | *(Tùy chọn, ví dụ: "Quân Quân")* | 50.000 VNĐ *(Hệ thống tặng trải nghiệm)* | Nạp tiền ví, thuê acc game, theo dõi đơn, gia hạn, báo lỗi khiếu nại. Tự động xuất hiện trong CRM Admin. |

> 💡 *Lưu ý*: Khi khởi động trang web lần đầu, hệ thống luôn mở ra **trang chủ Cửa hàng** ở trạng thái **chưa đăng nhập** để bạn có thể trải nghiệm trọn vẹn luồng từ góc nhìn của một khách hàng mới.

---

## 🧪 6. Báo Cáo Bộ Kiểm Thử Tự Động (Automated Test Suite)

Dự án tích hợp sẵn **89 bài kiểm thử tự động (Unit & Integration Tests)** sử dụng framework **Vitest**, bao phủ toàn diện các ca kiểm thử quy định trong đề cương môn học:

```powershell
 RUN  v5.0.1 E:/BTL_KTPM

 ✓ src/__tests__/unit/auth.test.js (25 tests)
 ✓ src/__tests__/unit/rental.test.js (10 tests)
 ✓ src/__tests__/unit/autoPasswordReset.test.js (10 tests)
 ✓ src/__tests__/unit/productUC1.test.js (15 tests)
 ✓ src/__tests__/unit/refund.test.js (8 tests)
 ✓ src/__tests__/integration/integrationFlows.test.js (6 tests)
 ✓ src/__tests__/unit/wallet.test.js (10 tests)
 ✓ src/__tests__/unit/crudManagement.test.js (5 tests)

 Test Files  8 passed (8)
      Tests  89 passed (89)
   Duration  1.20s
```

### Chi tiết 8 bộ kiểm thử:
1. **`auth.test.js` (25 tests)**: Kiểm thử BVA và EP cho họ tên, email hợp lệ/không hợp lệ, mật khẩu biên dưới (6 ký tự), kiểm tra trùng email, chặn tài khoản bị khóa (`isBlocked`), khôi phục và duy trì phiên đăng nhập khi reload trang.
2. **`rental.test.js` (10 tests)**: Kiểm thử nghiệp vụ thuê acc, BVA thời lượng 1h - 48h, Decision Table kiểm tra số dư ví, trừ tiền ví và chuyển trạng thái sang `rented`.
3. **`autoPasswordReset.test.js` (10 tests)**: Kiểm thử quy trình tự động thu hồi tài khoản khi hết giờ, sinh mật khẩu ngẫu nhiên mới và gửi thông báo cho khách.
4. **`productUC1.test.js` (15 tests)**: Kiểm thử form Thêm tài khoản game mới chuẩn đặc tả `UC1_Add New Product`: BVA tiêu đề (5 - 100 ký tự), giá thuê (1k - 200k), các trường bắt buộc.
5. **`refund.test.js` (8 tests)**: Kiểm thử quy trình khiếu nại và hoàn tiền 100% bảo hiểm, cập nhật số dư ví và đưa acc vào trạng thái bảo trì.
6. **`integrationFlows.test.js` (6 tests)**: Kiểm thử luồng tích hợp E2E xuyên suốt: Đăng ký $\rightarrow$ Nạp tiền $\rightarrow$ Thuê acc $\rightarrow$ Gia hạn $\rightarrow$ Báo lỗi $\rightarrow$ Hoàn tiền $\rightarrow$ Thu hồi đổi pass.
7. **`wallet.test.js` (10 tests)**: Kiểm thử nghiệp vụ ví và nạp tiền, BVA biên 10.000đ và 5.000.000đ, kiểm tra số nguyên, lưu vết mã giao dịch `TX-XXXXX`.
8. **`crudManagement.test.js` (5 tests)**: Kiểm thử CRUD kho tài khoản và khách hàng, đặc biệt kiểm thử **tự động thêm hồ sơ khách hàng mới vào CRM khi đăng ký**.

---

## 🏷️ 7. Danh Mục data-testid Cho Automation Testing

Hệ thống được gắn đầy đủ các thuộc tính chuẩn hóa `data-testid` trên DOM, sẵn sàng cho các công cụ tự động hóa kiểm thử UI như **Playwright, Cypress hoặc Selenium WebDriver**:

| Thuộc tính `data-testid` | Ý nghĩa phần tử kiểm thử |
| :--- | :--- |
| `app-header` | Thanh điều hướng đầu trang (Navbar) |
| `btn-nav-login` | Nút mở modal Đăng nhập trên thanh Navbar |
| `header-user-dropdown-btn` | Nút mở menu thông tin người dùng đang đăng nhập |
| `user-balance-box` | Khối hiển thị số dư ví người dùng |
| `btn-header-notifications` | Nút chuông thông báo hệ thống (3 cấp độ Xanh/Vàng/Đỏ) |
| `auth-modal` | Hộp thoại Xác thực (Đăng nhập / Đăng ký) |
| `tab-auth-login` | Tab chuyển sang giao diện Đăng nhập |
| `tab-auth-register` | Tab chuyển sang giao diện Đăng ký tài khoản |
| `input-login-email` | Ô nhập email đăng nhập |
| `input-login-password` | Ô nhập mật khẩu đăng nhập |
| `btn-submit-login` | Nút bấm xác nhận Đăng nhập |
| `btn-submit-register` | Nút bấm xác nhận Đăng ký tài khoản mới |
| `input-search-accounts` | Ô tìm kiếm tài khoản game trên trang chủ |
| `btn-rent-now-{accountId}` | Nút bấm chọn thuê tài khoản game cụ thể |
| `rent-confirm-modal` | Modal xác nhận thanh toán thuê tài khoản |
| `select-rent-hours` | Dropdown/input lựa chọn số giờ thuê |
| `btn-submit-rent-confirm` | Nút bấm xác nhận thanh toán thuê tài khoản |
| `btn-trigger-extend-{orderId}` | Nút mở modal gia hạn thêm giờ cho đơn thuê |
| `btn-submit-extend` | Nút bấm xác nhận thanh toán gia hạn |
| `btn-trigger-return-early-{orderId}` | Nút mở modal trả tài khoản sớm |
| `btn-trigger-dispute-{orderId}` | Nút mở modal báo lỗi khiếu nại ca thuê |
| `btn-open-deposit-modal` | Nút mở modal Nạp tiền vào ví |
| `input-deposit-amount` | Ô nhập số tiền nạp vào ví (Kiểm thử BVA) |
| `btn-confirm-deposit` | Nút bấm xác nhận hoàn tất nạp tiền |
| `floating-tester-toolbar` | Khung thanh công cụ kiểm thử nhanh BTL |
| `btn-tester-switch-role` | Nút chuyển đổi vai trò Admin $\leftrightarrow$ Renter |
| `btn-tester-quick-deposit` | Nút nạp nhanh +200.000đ vào ví |
| `btn-tester-fast-forward` | Nút tua nhanh -30 phút hạn thuê |
| `btn-tester-reset-db` | Nút khôi phục toàn bộ dữ liệu mẫu ban đầu |

---

## 💻 8. Hướng Dẫn Cài Đặt & Khởi Chạy Dự Án

### 8.1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18.x trở lên (Kiểm tra bằng lệnh `node -v`).
- **NPM**: Đi kèm với Node.js (Kiểm tra bằng lệnh `npm -v`).
- Trình duyệt web hiện đại: Chrome, Edge, Firefox, Brave.

### 8.2. Cài đặt các thư viện phụ thuộc
Mở terminal tại thư mục gốc của dự án (`e:\BTL_KTPM`) và thực hiện:
```bash
npm install
```

### 8.3. Khởi chạy máy chủ phát triển (Development Server)
```bash
npm run dev
```
Sau khi khởi chạy thành công, mở trình duyệt và truy cập: **`http://localhost:5173/`**

### 8.4. Chạy toàn bộ 86 bài kiểm thử tự động
```bash
npm test
```
*(Hoặc chạy trực tiếp: `npx vitest run`)*

### 8.5. Kiểm tra chất lượng mã nguồn (Linter)
```bash
npm run lint
```

### 8.6. Đóng gói mã nguồn bản thương mại (Production Build)
```bash
npm run build
```

---

## 📂 9. Cấu Trúc Thư Mục Dự Án (Project Structure)

```
BTL_KTPM/
├── Tài_Liệu/                                   # Thư mục chứa tài liệu báo cáo & đặc tả
│   ├── Dac_Ta_Yeu_Cau_Va_Kiem_Thu_GameRent.pdf # Đặc tả yêu cầu & kịch bản test chi tiết
│   └── UC1_Add New Product.pdf                 # Đề bài mẫu tham chiếu chuẩn form
├── src/
│   ├── __tests__/                              # Thư mục chứa 86 bài kiểm thử tự động
│   │   ├── unit/                               # 7 bộ kiểm thử đơn vị (Unit Tests)
│   │   │   ├── auth.test.js                    # 22 tests xác thực & đăng ký (BVA/EP)
│   │   │   ├── autoPasswordReset.test.js       # 10 tests tự động đổi pass khi hết hạn
│   │   │   ├── crudManagement.test.js          # 5 tests CRUD & tự động đồng bộ CRM
│   │   │   ├── productUC1.test.js              # 15 tests thêm mới tài khoản chuẩn UC1
│   │   │   ├── refund.test.js                  # 8 tests khiếu nại & hoàn tiền bảo hiểm
│   │   │   ├── rental.test.js                  # 10 tests thuê acc & kiểm tra số dư
│   │   │   └── wallet.test.js                  # 10 tests ví & nạp tiền (BVA biên 10k - 5M)
│   │   └── integration/                        # Kiểm thử tích hợp luồng nghiệp vụ
│   │       └── integrationFlows.test.js        # 6 tests luồng E2E xuyên suốt vòng đời acc
│   ├── components/                             # Các thành phần giao diện dùng chung
│   │   ├── AuthModal.jsx                       # Hộp thoại Đăng nhập / Đăng ký
│   │   ├── CountdownTimer.jsx                  # Đồng hồ đếm ngược thời gian thực
│   │   ├── DepositModal.jsx                    # Modal nạp tiền mô phỏng VietQR Auto
│   │   ├── ExtendRentalModal.jsx               # Modal gia hạn thêm giờ thuê acc
│   │   ├── FloatingTesterToolbar.jsx           # Thanh công cụ BTL Tester Tools nổi
│   │   ├── Navbar.jsx                          # Thanh điều hướng trên cùng & chuông báo
│   │   ├── RentConfirmModal.jsx                # Modal xác nhận thanh toán thuê acc
│   │   ├── ReturnEarlyModal.jsx                # Modal trả tài khoản sớm
│   │   └── Sidebar.jsx                         # Menu điều hướng bên trái theo phân quyền
│   ├── context/
│   │   └── AppContext.jsx                      # Quản lý State toàn cục & logic nghiệp vụ
│   ├── data/
│   │   └── initialData.js                      # Dữ liệu khởi tạo chuẩn ban đầu
│   ├── pages/                                  # Các trang màn hình chính của hệ thống
│   │   ├── AccountDetailPage.jsx               # Chi tiết tài khoản & thư viện ảnh skin
│   │   ├── AdminDashboardPage.jsx              # Quản trị kho acc & form thêm mới UC1
│   │   ├── CustomersPage.jsx                   # Quản lý khách hàng CRM
│   │   ├── HomePage.jsx                        # Cửa hàng thuê acc game (Trang chủ)
│   │   ├── MyRentalsPage.jsx                   # Quản lý đơn thuê & ca chơi của tôi
│   │   ├── OverviewDashboard.jsx               # Tổng quan giám sát, KPI & cảnh báo 3 cấp độ
│   │   ├── ReportsPage.jsx                     # Xử lý báo cáo lỗi & khiếu nại
│   │   ├── RevenuePage.jsx                     # Thống kê chi tiết doanh thu
│   │   ├── SettingsPage.jsx                    # Cài đặt hệ thống
│   │   └── WalletPage.jsx                      # Quản lý ví & lịch sử giao dịch
│   ├── utils/
│   │   └── validation.js                       # Các hàm chuẩn hóa & xác thực dữ liệu
│   ├── App.jsx                                 # Component điều phối chính & route guard
│   ├── index.css                               # Hệ thống Design System & Typography
│   └── main.jsx                                # Điểm khởi chạy ứng dụng React
├── package.json                                # Cấu hình thư viện & npm scripts
├── vite.config.js                              # Cấu hình Vite & Vitest
└── README.md                                   # Tài liệu hướng dẫn toàn diện dự án
```

---

## 📑 10. Tài Liệu Đặc Tả & Báo Cáo Tham Chiếu

- 📄 **[Dac_Ta_Yeu_Cau_Va_Kiem_Thu_GameRent.pdf](file:///e:/BTL_KTPM/T%C3%A0i_Li%E1%BB%87u/Dac_Ta_Yeu_Cau_Va_Kiem_Thu_GameRent.pdf)**: Tài liệu đặc tả 26 Use Cases đầy đủ, bảng thiết kế ca kiểm thử hộp đen BVA/EP/Decision Table và kịch bản thực thi.
- 📄 **[UC1_Add New Product.pdf](file:///e:/BTL_KTPM/T%C3%A0i_Li%E1%BB%87u/UC1_Add%20New%20Product.pdf)**: Tài liệu đề bài mẫu tham chiếu quy cách form nhập liệu và xử lý ngoại lệ.

---

## ⚖️ Bản Quyền & Giấy Phép

© 2026 **Nhóm Sinh Viên Bài Tập Lớn Kiểm Thử Phần Mềm** — Trường Đại học Công nghệ Đông Á (EAUT).  
Dự án được phát triển phục vụ mục đích học tập, nghiên cứu và đánh giá học phần Kiểm Thử Phần Mềm.
