# 🎮 GameRent - Hệ Thống Cho Thuê Tài Khoản Game Trực Tuyến Tự Động 24/7

> **BÀI TẬP LỚN MÔN HỌC**: KIỂM THỬ PHẦN MỀM (SOFTWARE TESTING & QUALITY ASSURANCE)
> **TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐÔNG Á (EAUT) - KHOA CÔNG NGHỆ THÔNG TIN**
> **LỚP**: Kiểm thử phần mềm-1-1-26(N05)
> **NHÓM THỰC HIỆN**: **NHÓM 15**
> **GIẢNG VIÊN HƯỚNG DẪN**: **ThS. Phạm Thị Loan**
> **BỘ KIỂM THỬ TỰ ĐỘNG**: Vitest Automation Suite (**10/10 Test Suites · 107/107 Tests Passed · 100% Success**)

---

## 📌 1. Giới Thiệu Dự Án GameRent

**GameRent** là nền tảng thương mại điện tử chuyên cung cấp dịch vụ cho thuê tài khoản game trực tuyến tự động 24/7 (bao gồm 6 tựa game Esports thịnh hành hàng đầu: *Valorant, Liên Minh Huyền Thoại, Liên Quân Mobile, FC Online, PUBG Steam, LMHT: Tốc Chiến*).

Dự án giải quyết triệt để các rủi ro, nhược điểm của mô hình thuê tài khoản truyền thống qua mạng xã hội (lừa đảo chiếm đoạt tài khoản, thông tin đăng nhập sai lệch, không có cơ chế hoàn tiền khi gặp sự cố, thủ công tốn thời gian):

- **Bàn giao mật khẩu bí mật tức thì 1 giây**: Sau khi thanh toán, hệ thống tự động sinh khóa truy cập và hiển thị thông tin đăng nhập in-game bí mật với nút sao chép 1-click.
- **Nạp tiền ví tự động chuẩn VietQR Napas247**: Quét mã QR động, hệ thống tự động cộng dồn số dư ví thời gian thực.
- **Giám sát thời gian thực & Cảnh báo 3 cấp độ**: Đồng hồ `CountdownTimer` đếm ngược chuẩn xác theo mốc thời gian tuyệt đối `Date.now()`, hiển thị màu Xanh lục (>1h), Vàng cam (<1h) và Đỏ (hết giờ).
- **Gia hạn giờ chơi linh hoạt**: Cộng nối tiếp thời gian trực tiếp mà không làm gián đoạn phiên chơi game.
- **Trả nick sớm**: Hoàn trả 50% chi phí thời gian chưa sử dụng vào ví người dùng, tự động thu hồi mật khẩu để bảo vệ tài khoản.
- **Cam kết Bảo hiểm 100%**: Khách hàng gặp sự cố (sai pass, dính 2FA, tài khoản bị khóa) gửi khiếu nại trong 15 phút đầu được Admin phê duyệt hoàn tiền bảo hiểm 100% vào ví.
- **Quản trị kho chuẩn UC1**: Form thêm sản phẩm tuân thủ nghiêm ngặt tài liệu đặc tả `UC1_Add New Product`.
- **CRM khách hàng tự động đồng bộ**: Khách vãng lai đăng ký thành viên mới lập tức được cấp ví trải nghiệm 50.000 VNĐ và tự động đồng bộ vào bảng quản trị CRM của Admin.
- **Khóa nguyên tử chống Race Condition (Double-booking)**: Ngăn chặn triệt để tình huống 2 khách hàng cùng bấm thuê trùng 1 tài khoản tại cùng một thời điểm.

---

## 🎯 2. Trọng Tâm Kỹ Thuật Kiểm Thử Phần Mềm Áp Dụng

Dự án được xây dựng chuẩn mực nhằm phục vụ việc học tập, thực hành và đánh giá toàn diện các kỹ thuật kiểm thử phần mềm chuyên sâu theo chuẩn giáo trình quốc tế ISTQB:

### 2.1. Phân tích giá trị biên (Boundary Value Analysis - BVA)

- **Hạn mức nạp tiền ví VietQR (`validateDepositAmount`)**: Quy định từ **10.000 VNĐ** đến **5.000.000 VNĐ**.
  - Biên dưới: `9.999 VNĐ` (Lỗi), `10.000 VNĐ` (Biên min hợp lệ), `10.001 VNĐ` (Hợp lệ).
  - Biên trên: `4.999.999 VNĐ` (Hợp lệ), `5.000.000 VNĐ` (Biên max hợp lệ), `5.000.001 VNĐ` (Lỗi).
- **Thời lượng thuê tài khoản (`calculateRentalCost`)**: Quy định từ **1 giờ** đến **48 giờ**.
  - Kiểm tra các mốc: `0 giờ` (Lỗi), `1 giờ` (Biên min), `48 giờ` (Biên max), `49 giờ` (Lỗi).
- **Thêm sản phẩm mới chuẩn đặc tả `UC1_Add New Product` (`validateProductUC1`)**:
  - Độ dài tiêu đề tài khoản: Biên từ 5 đến 100 ký tự (Dưới 5 hoặc trên 100 ký tự bị từ chối).
  - Giá thuê mỗi giờ: Biên từ 1.000 VNĐ/giờ đến 200.000 VNĐ/giờ.
- **Độ dài mật khẩu & tên đăng ký (`validateRegistration`)**: Mật khẩu tối thiểu 6 ký tự; Tên đăng nhập từ 4 đến 30 ký tự; Số điện thoại đúng 10 chữ số chuẩn nhà mạng Việt Nam.

### 2.2. Phân vùng tương đương (Equivalence Partitioning - EP)

- **Định dạng Email**: Lớp hợp lệ (chứa `@` và tên miền hợp lệ như `@gmail.com`, `@eaut.edu.vn`) vs Lớp không hợp lệ (rỗng, thiếu `@`, sai định dạng).
- **Số tiền nạp ví**: Lớp số nguyên dương hợp lệ vs Lớp số thực có phần thập phân (`10000.5`), lớp chứa chữ cái/ký tự đặc biệt, lớp số âm.
- **Trạng thái tài khoản game**: `available` (sẵn sàng cho thuê), `rented` (đang có khách thuê), `maintenance` (đang bảo trì kỹ thuật), `need_change_pass` (cần thu hồi đổi pass).

### 2.3. Bảng quyết định điều kiện (Decision Table Testing)

- **Nghiệp vụ thuê tài khoản (`rentAccount`)**:
  - Kết hợp 4 điều kiện: [Đã đăng nhập?] $\times$ [Tài khoản không bị khóa (`isBlocked = false`)] $\times$ [Tài khoản game ở trạng thái `available`?] $\times$ [Số dư ví $\ge$ Tổng tiền thuê?].
  - Chỉ khi thỏa mãn 100% cả 4 điều kiện, hệ thống mới trừ tiền ví, chuyển acc sang `rented`, tạo mã `ORDER-XXXX` và bàn giao thông tin in-game bí mật.
- **Nghiệp vụ giải quyết khiếu nại bảo hiểm (`resolveDispute`)**:
  - Quyết định Phê duyệt (Approved) $\rightarrow$ Khách nhận lại 100% tiền đơn vào ví, tài khoản chuyển sang diện `maintenance`.
  - Quyết định Từ chối (Rejected) $\rightarrow$ Giữ nguyên trạng thái, đơn hàng kết thúc không hoàn tiền.

### 2.4. Kiểm thử chuyển trạng thái (State Transition Testing)

Vòng đời trạng thái của một tài khoản game trong hệ thống được quản lý chặt chẽ qua sơ đồ chuyển trạng thái:

```text
[available] (Sẵn sàng) ─── Thuê acc thành công ───> [rented] (Đang thuê)
    │                                                    │
    │                                      ┌─────────────┴─────────────┐
    │                                  Hết giờ / Trả sớm          Khách báo lỗi
    │                                      │                           │
    │                                      v                           v
    │                            [need_change_pass]              [disputed]
    │                                      │                           │
    │                              Đổi pass tự động           Admin duyệt hoàn tiền
    │                                      │                           │
    │                                      v                           v
    └───────────────────────────── [available] <─────────── [maintenance]
```

### 2.5. Kiểm thử phòng chống Race Condition (Atomic Check & Lock)

- Giả lập 2 phiên làm việc Client độc lập cùng nhấn nút "Xác Nhận Thuê" đối với 1 tài khoản game duy nhất tại cùng một mili-giây.
- Cơ chế Atomic Lock lập tức cấp quyền cho Client 1 và từ chối Client 2 với thông báo: *"Tài khoản vừa được người khác thuê trước. Giao dịch đã được hủy an toàn!"*, đồng thời bảo toàn 100% số dư ví cho Client 2 (Triệt tiêu hoàn toàn lỗi Double-booking).

---

## 📁 3. Hồ Sơ Báo Cáo & Tài Liệu Nghiệm Thu (`Tài_Liệu/`)

Toàn bộ sản phẩm bàn giao chính thức của **Nhóm 15** được quy hoạch đồng bộ tại thư mục [`e:\BTL_KTPM\Tài_Liệu`](file:///e:/BTL_KTPM/Tài_Liệu):

```text
e:\BTL_KTPM\Tài_Liệu/
├── BTL_KTPM_Nhóm_15.docx               # Báo cáo tổng hợp Bài tập lớn hoàn chỉnh 4 chương (121 trang)
├── PHAN_CONG_NHIEM_VU_NHOM_15.docx     # Bản xác nhận phân công nhiệm vụ chi tiết thành viên Nhóm 15
├── Unit Test Case.xlsx                 # Bộ 100 ca Unit Test Case ma trận EP/BVA (10 module hàm)
├── IT_Test Case.xlsx                   # Bộ 10 ca Integration Test Case (Sandwich) + 5 Bug log chi tiết
└── ST_Test Case.xlsx                   # Bộ 12 ca System Test Case E2E + Wireframe thực tế + 5 Bug log chi tiết
```

### Bảng đối chiếu thông số 3 file Test Case Excel

| Tiêu chí                        | Unit Test Case.xlsx                                                       | IT_Test Case.xlsx                                                                | ST_Test Case.xlsx                                                                |
| :-------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **Tổng số Sheet**         | **13 Sheet**                                                        | **10 Sheet**                                                               | **13 Sheet**                                                               |
| **Phạm vi kiểm thử**     | 10 module hàm cốt lõi (`F_AUTH_REG` $\rightarrow$ `F_FAV_SEP`)   | 6 luồng giao tiếp tích hợp (`IT_AUTH_SYNC` $\rightarrow$ `IT_FAV_SEP`) | 7 phân hệ kịch bản E2E (`ST_AUTH_RBAC` $\rightarrow$ `ST_CONCURRENCY`) |
| **Số ca kiểm thử**       | **100 Unit Test Cases** (`UTCID01` $\rightarrow$ `16`/module) | **10 Integration Test Cases** (`ITC-01` $\rightarrow$ `ITC-10`)      | **12 System Test Cases** (`STC-E2E-01` $\rightarrow$ `STC-E2E-12`)   |
| **Chiến lược áp dụng** | Phân vùng tương đương & Giá trị biên (EP / BVA)                 | Tích hợp hỗn hợp**Sandwich Testing**                                   | Hộp đen E2E, Chuyển trạng thái & Khóa nguyên tử                          |
| **Số lỗi phát hiện**    | Code được unit-test tự động hóa (107 tests pass)                   | **5 Bug tích hợp** (`BUG-IT-001` $\rightarrow$ `BUG-IT-005`)       | **5 Bug hệ thống** (`BUG-ST-001` $\rightarrow$ `BUG-ST-005`)       |
| **Tỷ lệ Pass**            | **100% Passed**                                                     | **100% Passed** (sau khi fix)                                              | **100% Passed** (sau khi fix)                                              |
| **Thông tin tác giả**    | **Nhóm 15** · GVHD: **ThS. Phạm Thị Loan**                | **Nhóm 15** · GVHD: **ThS. Phạm Thị Loan**                       | **Nhóm 15** · GVHD: **ThS. Phạm Thị Loan**                       |

---

## 🐛 4. Báo Cáo 10 Lỗi Thực Tế Phát Hiện & Giải Pháp Khắc Phục (Defect Log)

Toàn bộ 10 lỗi kỹ thuật được phát hiện trong quá trình kiểm thử tích hợp và hệ thống đã được nhóm ghi nhận đầy đủ theo chuẩn 8 trường thông tin và khắc phục triệt để trên mã nguồn:

### 4.1. Danh mục 5 lỗi Kiểm thử tích hợp (Integration Bugs)

|         Mã Bug         | Mức ưu tiên | Tiêu đề tóm tắt lỗi                                                                                                            | Vị trí phát sinh                                | Kịch bản liên quan |         Trạng thái         |
| :----------------------: | :------------: | :----------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- | :-------------------: | :--------------------------: |
| **`BUG-IT-001`** |     Medium     | Lỗi sai lệch số dư ví khi nạp tiền VietQR do cộng dồn chuỗi String thay vì Number (`"150000" + 50000 = "15000050000"`). | `DepositModal.jsx` / `deposit()`               |      `ITC-02`      | **Closed (Đã sửa)** |
| **`BUG-IT-002`** |      High      | Lỗi không giải mã được mật khẩu in-game bí mật khi bàn giao tài khoản cho khách thuê.                                | `initialData.js` / `RentConfirmModal.jsx`      |      `ITC-03`      | **Closed (Đã sửa)** |
| **`BUG-IT-003`** |    Critical    | Tiền hoàn khiếu nại bảo hiểm (Dispute Refund) không được cộng ngược lại vào ví điện tử của khách hàng.         | `ReportsDisputesPage.jsx` / `resolveDispute()` |      `ITC-06`      | **Closed (Đã sửa)** |
| **`BUG-IT-004`** |      High      | Phiên đăng nhập (Session) không bị hủy khi người dùng thực hiện đổi mật khẩu tài khoản thành công.               | `SettingsPage.jsx` / `changePassword()`        |      `ITC-08`      | **Closed (Đã sửa)** |
| **`BUG-IT-005`** |     Medium     | Danh sách tài khoản yêu thích (Favorites) bị lẫn lộn giữa các tài khoản khác nhau trên cùng một trình duyệt.       | `favoriteUtils.js` / `getFavoritesKey()`       |      `ITC-09`      | **Closed (Đã sửa)** |

### 4.2. Danh mục 5 lỗi Kiểm thử hệ thống (System Bugs)

|         Mã Bug         | Mức ưu tiên | Tiêu đề tóm tắt lỗi                                                                                                                    | Vị trí phát sinh                          | Kịch bản liên quan |         Trạng thái         |
| :----------------------: | :------------: | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :-------------------: | :--------------------------: |
| **`BUG-ST-001`** |    Critical    | Lỗi đua tài nguyên (Race Condition) cho phép 2 khách hàng cùng bấm thuê trùng 1 tài khoản (Double-booking).                     | `RentConfirmModal.jsx` / `rentAccount()` |    `STC-E2E-12`    | **Closed (Đã sửa)** |
| **`BUG-ST-002`** |     Medium     | CountdownTimer bị trôi giây khi người dùng chuyển sang tab trình duyệt khác (Background Tab Throttling).                           | `CountdownTimer.jsx`                       |    `STC-E2E-06`    | **Closed (Đã sửa)** |
| **`BUG-ST-003`** |     Medium     | Form thêm tài khoản UC1 cho phép lưu Tên sản phẩm chứa khoảng trắng đầu cuối vượt quá giới hạn 50 ký tự.                | `AccountInventoryPage.jsx`                 |    `STC-E2E-10`    | **Closed (Đã sửa)** |
| **`BUG-ST-004`** |      High      | Nút Sao chép (Copy) mật khẩu in-game không phản hồi khi chạy trên môi trường mạng nội bộ giao thức HTTP.                     | `MyRentalsPage.jsx`                        |    `STC-E2E-05`    | **Closed (Đã sửa)** |
| **`BUG-ST-005`** |      High      | Người dùng bị Admin khóa tài khoản (`isBlocked = true`) vẫn đổi được mật khẩu qua trang Settings khi còn lưu session cũ. | `SettingsPage.jsx` / `auth.js`           |    `STC-E2E-02`    | **Closed (Đã sửa)** |

---

## 🧪 5. Kết Quả Bộ Kiểm Thử Tự Động Hóa (Vitest Suite)

Hệ thống tích hợp sẵn bộ kiểm thử tự động toàn diện gồm **10 Test Suites với 107 Test Cases** được thực thi trực tiếp bằng framework **Vitest**:

```powershell
 RUN  v5.0.1 E:/BTL_KTPM

 ✓ src/__tests__/unit/auth.test.js (25 tests) 15ms
 ✓ src/__tests__/unit/rental.test.js (14 tests) 47ms
 ✓ src/__tests__/unit/autoPasswordReset.test.js (10 tests) 80ms
 ✓ src/__tests__/unit/productUC1.test.js (15 tests) 13ms
 ✓ src/__tests__/integration/integrationFlows.test.js (7 tests) 14ms
 ✓ src/__tests__/unit/refund.test.js (8 tests) 12ms
 ✓ src/__tests__/unit/changePassword.test.js (8 tests) 15ms
 ✓ src/__tests__/unit/favoritesSeparation.test.js (5 tests) 15ms
 ✓ src/__tests__/unit/crudManagement.test.js (5 tests) 20ms
 ✓ src/__tests__/unit/wallet.test.js (10 tests) 6ms

 Test Files  10 passed (10)
      Tests  107 passed (107)
   Duration  1.25s
```

### Tóm tắt phạm vi 10 Test Suites:

1. `auth.test.js` (25 tests): Kiểm thử phân vùng tương đương và giá trị biên cho họ tên, email hợp lệ/không hợp lệ, mật khẩu tối thiểu 6 ký tự, kiểm tra trùng lặp email, chặn tài khoản bị khóa `isBlocked`.
2. `rental.test.js` (14 tests): Kiểm thử bảng quyết định điều kiện thuê acc, biên thời lượng 1h - 48h, trừ tiền ví, chuyển trạng thái acc sang `rented`, gia hạn thời gian và hủy ca thuê.
3. `autoPasswordReset.test.js` (10 tests): Kiểm thử cơ chế tự động thu hồi tài khoản khi hết giờ chơi, sinh mật khẩu ngẫu nhiên an toàn và gửi thông báo hệ thống.
4. `productUC1.test.js` (15 tests): Kiểm thử form thêm mới tài khoản game chuẩn đặc tả `UC1_Add New Product`: kiểm tra biên tiêu đề, giá thuê, độ dài mật khẩu và các trường bắt buộc.
5. `favoritesSeparation.test.js` (5 tests): Kiểm thử cơ chế phân tách danh sách tài khoản yêu thích độc lập theo từng User ID và khách vãng lai (Guest).
6. `integrationFlows.test.js` (7 tests): Kiểm thử luồng tích hợp E2E xuyên suốt vòng đời tài khoản: Đăng ký $\rightarrow$ Nạp tiền $\rightarrow$ Thuê acc $\rightarrow$ Giám sát Timer $\rightarrow$ Gia hạn $\rightarrow$ Báo lỗi $\rightarrow$ Hoàn tiền $\rightarrow$ Thu hồi đổi pass.
7. `wallet.test.js` (10 tests): Kiểm thử nghiệp vụ ví điện tử, kiểm tra giá trị biên nạp tiền từ 10.000đ đến 5.000.000đ, kiểm tra số nguyên, lưu vết mã giao dịch `TX-XXXXX`.
8. `crudManagement.test.js` (5 tests): Kiểm thử thao tác CRUD kho tài khoản và khách hàng, đặc biệt là cơ chế **tự động thêm hồ sơ khách hàng mới vào CRM khi đăng ký thành công**.
9. `refund.test.js` (8 tests): Kiểm thử nghiệp vụ khiếu nại báo lỗi và hoàn tiền bảo hiểm 100%, cộng tiền ngược lại vào ví và chuyển tài khoản về trạng thái bảo trì.
10. `changePassword.test.js` (8 tests): Kiểm thử chức năng đổi mật khẩu cá nhân của khách thuê (kiểm tra mật khẩu cũ, mật khẩu mới tối thiểu 6 ký tự, khớp mật khẩu xác nhận).

---

## 🧰 6. Thanh Công Cụ Hỗ Trợ Kiểm Thử Nhanh (BTL Tester Tools)

Được bố trí cố định ở **góc dưới cùng bên phải màn hình**, thanh công cụ này là trợ thủ đắc lực giúp Giảng viên và Tester thao tác kiểm thử trực quan trong vài giây:

| Công cụ / Nút bấm                   | Chức năng nghiệp vụ phục vụ kiểm thử                                                                                                                       |
| :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Đổi vai trò 1-Click**        | Chuyển đổi qua lại tức thì giữa quyền**Quản Trị Viên (Admin)** và **Khách Thuê** mà không cần đăng xuất/đăng nhập lại.         |
| **Nạp nhanh: +200.000 đ**       | Bơm trực tiếp 200.000 VNĐ vào ví người dùng hiện tại để kiểm thử ngay luồng thanh toán và thuê acc.                                             |
| **Tua giờ ca thuê (-30 phút)** | Lựa chọn ca thuê đang chơi và tua nhanh 30 phút thời gian, giúp kiểm tra ngay trạng thái: sắp hết hạn (<1h) và hết hạn tự động thu hồi pass. |
| **Reset Dữ Liệu Về Gốc**      | Xóa sạch bộ nhớ LocalStorage và khôi phục toàn bộ kho acc, đơn thuê và cấu hình ban đầu chuẩn của hệ thống.                                   |

---

## 🔑 7. Danh Mục Tài Khoản Kiểm Thử Mặc Định

| Vai trò                             | Email đăng nhập      | Mật khẩu                        | Tên hiển thị             | Số dư ví ban đầu                           | Quyền hạn nghiệp vụ                                                                                                    |
| :----------------------------------- | :---------------------- | :-------------------------------- | :-------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Quản Trị Viên (Admin)**   | `admin@gamerent.vn`   | `admin123`                      | **Quản Lý (Admin)** | 3.000.000 VNĐ                                  | Toàn quyền quản trị kho acc, xem KPI doanh thu, duyệt hoàn tiền khiếu nại, quản lý danh sách khách hàng CRM. |
| **Khách Thuê Mẫu (Renter)** | `renter@gamerent.vn`  | `123456`                        | **Khách Mẫu**       | 200.000 VNĐ                                    | Thuê acc game, theo dõi đơn thuê, nạp tiền, gia hạn giờ chơi, khiếu nại sự cố.                               |
| **Khách Đăng Ký Mới**     | *(Tự do đăng ký)* | *(Tự chọn $\ge 6$ ký tự)* | *(Tùy chọn)*            | **50.000 VNĐ** *(Tặng trải nghiệm)* | Tự động được tặng 50k vào ví tân thủ, tự động xuất hiện trong trang Quản Lý Khách Hàng CRM của Admin. |

---

## 🏷️ 8. Danh Mục `data-testid` Cho Automation Testing

Hệ thống được gắn đầy đủ các thuộc tính chuẩn hóa `data-testid` trên DOM, sẵn sàng cho việc mở rộng kiểm thử tự động hóa giao diện (UI Automation) với **Playwright, Cypress hoặc Selenium WebDriver**:

| Thuộc tính`data-testid`            | Ý nghĩa phần tử kiểm thử                                           |
| :------------------------------------- | :----------------------------------------------------------------------- |
| `app-header`                         | Thanh điều hướng đầu trang (Navbar)                                |
| `btn-nav-login`                      | Nút mở modal Đăng nhập / Đăng ký trên thanh Navbar              |
| `header-user-dropdown-btn`           | Nút mở menu thông tin người dùng đang đăng nhập                |
| `user-balance-box`                   | Khối hiển thị số dư ví người dùng thời gian thực              |
| `btn-header-notifications`           | Nút chuông thông báo hệ thống (3 cấp độ Xanh/Vàng/Đỏ)        |
| `auth-modal`                         | Hộp thoại Xác thực (Đăng nhập / Đăng ký)                       |
| `tab-auth-login`                     | Tab chuyển sang giao diện Đăng nhập                                 |
| `tab-auth-register`                  | Tab chuyển sang giao diện Đăng ký tài khoản mới                  |
| `input-login-email`                  | Ô nhập email đăng nhập                                              |
| `input-login-password`               | Ô nhập mật khẩu đăng nhập                                         |
| `btn-submit-login`                   | Nút bấm xác nhận Đăng nhập                                        |
| `btn-submit-register`                | Nút bấm xác nhận Đăng ký tài khoản mới                         |
| `input-search-accounts`              | Ô tìm kiếm tài khoản game trên trang chủ Cửa hàng               |
| `btn-favorite-card-{accountId}`      | Nút lưu/bỏ lưu yêu thích trên thẻ sản phẩm                     |
| `btn-filter-favorites`               | Nút lọc xem danh sách tài khoản đã lưu yêu thích               |
| `btn-rent-now-{accountId}`           | Nút bấm chọn thuê tài khoản game cụ thể                          |
| `rent-confirm-modal`                 | Modal xác nhận thanh toán thuê tài khoản                           |
| `select-rent-hours`                  | Dropdown/input lựa chọn số giờ thuê (1h - 48h)                      |
| `btn-submit-rent-confirm`            | Nút bấm xác nhận thanh toán thuê tài khoản                       |
| `btn-trigger-extend-{orderId}`       | Nút mở modal gia hạn thêm giờ cho đơn thuê                       |
| `btn-submit-extend`                  | Nút bấm xác nhận thanh toán gia hạn                                |
| `btn-trigger-return-early-{orderId}` | Nút mở modal trả tài khoản sớm                                     |
| `btn-trigger-dispute-{orderId}`      | Nút mở modal báo lỗi khiếu nại ca thuê                            |
| `btn-open-deposit-modal`             | Nút mở modal Nạp tiền vào ví                                       |
| `input-deposit-amount`               | Ô nhập số tiền nạp vào ví (Kiểm thử BVA)                        |
| `btn-confirm-deposit`                | Nút bấm xác nhận hoàn tất nạp tiền VietQR                        |
| `floating-tester-toolbar`            | Khung thanh công cụ kiểm thử nhanh BTL                               |
| `btn-tester-switch-role`             | Nút chuyển đổi vai trò Admin$\leftrightarrow$ Renter              |
| `btn-tester-quick-deposit`           | Nút nạp nhanh +200.000đ vào ví                                      |
| `btn-trigger-select-rental`          | Nút mở dropdown chọn ca thuê cần tua giờ                           |
| `btn-tester-fast-forward`            | Nút tua nhanh -30 phút hạn thuê                                      |
| `btn-tester-reset-db`                | Nút mở modal xác nhận khôi phục toàn bộ dữ liệu mẫu ban đầu |

---

## 💻 9. Hướng Dẫn Cài Đặt & Khởi Chạy Dự Án

### 9.1. Yêu cầu môi trường

- **Node.js**: Phiên bản 18.x hoặc 20.x LTS trở lên (Kiểm tra bằng lệnh `node -v`).
- **NPM**: Phiên bản 9.x hoặc 10.x trở lên (Kiểm tra bằng lệnh `npm -v`).
- **Python**: Phiên bản 3.10 trở lên kèm thư viện `openpyxl`, `python-docx`, `pillow` (để chạy các script cập nhật file Excel/Word).

### 9.2. Cài đặt các thư viện phụ thuộc

Mở terminal tại thư mục gốc của dự án (`e:\BTL_KTPM`) và chạy:

```bash
npm install
```

### 9.3. Khởi chạy máy chủ phát triển (Development Server)

```bash
npm run dev
```

Sau khi khởi chạy thành công, mở trình duyệt web và truy cập: **`http://localhost:5173/`**

### 9.4. Chạy toàn bộ 107 bài kiểm thử tự động (Vitest)

```bash
# Chạy trực tiếp qua npm script
npm test

# Hoặc chạy lệnh Vitest trong môi trường Windows CMD/PowerShell
npx vitest run
```

### 9.5. Kiểm tra chất lượng mã nguồn (Linter)

```bash
npm run lint
```

### 9.6. Đóng gói mã nguồn bản thương mại (Production Build)

```bash
npm run build
```

---

## 📂 10. Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
e:\BTL_KTPM/
├── Tài_Liệu/                                   # Thư mục hồ sơ báo cáo chính thức của Nhóm 15
│   ├── BTL_KTPM_Nhóm_15.docx                   # Báo cáo tổng hợp Bài tập lớn hoàn chỉnh 4 chương
│   ├── PHAN_CONG_NHIEM_VU_NHOM_15.docx         # Biên bản phân công nhiệm vụ chi tiết thành viên
│   ├── Unit Test Case.xlsx                     # Bộ 100 ca Unit Test Case ma trận (10 module)
│   ├── IT_Test Case.xlsx                       # Bộ 10 ca Integration Test Case (Sandwich) + 5 Bug log
│   └── ST_Test Case.xlsx                       # Bộ 12 ca System Test Case E2E + Wireframe + 5 Bug log
│
├── public/                                     # Tài nguyên tĩnh phục vụ Web Application
│   ├── favicon.svg                             # Icon nhận diện thương hiệu GameRent
│   ├── icons.svg                               # Bộ icon SVG hệ thống
│   ├── login_wireframe_real_sized.png          # Ảnh chụp AuthModal thực tế nhúng trong STC Wireframe
│   ├── so_do_use_case_tong_quat.png/.svg       # Sơ đồ Use Case tổng quát hệ thống
│   ├── so_do_chuyen_trang_thai_state_transition.png/.svg # Sơ đồ chuyển trạng thái tài khoản
│   └── images/                                 # Kho hình ảnh tài khoản game, biểu tượng game, trang phục VIP
│       ├── accounts/                           # Ảnh chụp chi tiết tài khoản game
│       ├── games/                              # Ảnh banner đại diện các tựa game
│       └── skins/                              # Ảnh các bộ trang phục VIP nổi bật
│
├── scripts/                                    # Bộ công cụ kịch bản tự động hóa & đồng bộ dữ liệu
│   ├── README.md                               # Hướng dẫn sử dụng bộ script
│   ├── generate_full_btl_report.py             # Kịch bản sinh Báo cáo Word 4 chương hoàn chỉnh
│   ├── update_unit_test_cases_excel.py         # Kịch bản khởi tạo & chuẩn hóa Unit Test Case.xlsx
│   ├── update_integration_test_cases_excel.py # Kịch bản khởi tạo & chuẩn hóa IT_Test Case.xlsx
│   ├── update_system_test_cases_excel.py       # Kịch bản khởi tạo & chuẩn hóa ST_Test Case.xlsx
│   ├── run_e2e_automation.js                   # Kịch bản chạy kiểm thử tự động hóa E2E
│   ├── generate_automation_terminal_screenshot.js # Kịch bản chụp ảnh log kết quả Vitest Terminal
│   ├── generate_defect_report_images.py        # Kịch bản sinh bảng phiếu báo cáo lỗi đồ họa
│   ├── generate_real_web_defect_screenshots.js # Kịch bản chụp bằng chứng lỗi trực tiếp trên Web
│   ├── generate_use_case_diagram.py            # Kịch bản vẽ sơ đồ Use Case bằng matplotlib
│   └── generate_state_transition_diagram.py    # Kịch bản vẽ sơ đồ chuyển trạng thái bằng matplotlib
│
├── src/                                        # Toàn bộ mã nguồn ứng dụng React 19 + Vitest
│   ├── __tests__/                              # Thư mục 107 bài kiểm thử tự động (Vitest)
│   │   ├── unit/                               # 9 bộ kiểm thử đơn vị (Unit Tests)
│   │   │   ├── auth.test.js                    # 25 tests xác thực & đăng ký (BVA/EP)
│   │   │   ├── changePassword.test.js          # 8 tests đổi mật khẩu khách thuê (BVA/EP)
│   │   │   ├── autoPasswordReset.test.js       # 10 tests tự động đổi pass khi hết hạn
│   │   │   ├── crudManagement.test.js          # 5 tests CRUD & tự động đồng bộ CRM
│   │   │   ├── favoritesSeparation.test.js     # 5 tests phân tách danh sách yêu thích độc lập
│   │   │   ├── productUC1.test.js              # 15 tests thêm mới tài khoản chuẩn UC1
│   │   │   ├── refund.test.js                  # 8 tests khiếu nại & hoàn tiền bảo hiểm 100%
│   │   │   ├── rental.test.js                  # 14 tests thuê acc, gia hạn & hủy ca
│   │   │   └── wallet.test.js                  # 10 tests ví & nạp tiền (BVA biên 10k - 5M)
│   │   └── integration/                        # Kiểm thử tích hợp luồng nghiệp vụ E2E
│   │       └── integrationFlows.test.js        # 7 tests luồng E2E xuyên suốt vòng đời acc
│   │
│   ├── components/                             # Các thành phần giao diện & hộp thoại tương tác
│   │   ├── AuthModal.jsx                       # Hộp thoại Đăng nhập / Đăng ký tài khoản
│   │   ├── ConfirmModal.jsx                    # Modal xác nhận thao tác an toàn
│   │   ├── CountdownTimer.jsx                  # Đồng hồ đếm ngược thời gian thực (Date.now() Resilient)
│   │   ├── DepositModal.jsx                    # Modal nạp tiền mô phỏng VietQR Auto
│   │   ├── DisputeModal.jsx                    # Modal gửi báo lỗi khiếu nại sự cố
│   │   ├── ExtendRentalModal.jsx               # Modal gia hạn thêm giờ thuê acc
│   │   ├── FloatingTesterToolbar.jsx           # Thanh công cụ BTL Tester Tools nổi góc màn hình
│   │   ├── Footer.jsx                          # Chân trang website GameRent
│   │   ├── Navbar.jsx                          # Thanh điều hướng trên cùng & chuông báo động
│   │   ├── RentConfirmModal.jsx                # Modal xác nhận thanh toán thuê acc & chống Race Condition
│   │   ├── ReturnEarlyModal.jsx                # Modal trả tài khoản sớm nhận hoàn tiền 50%
│   │   └── Sidebar.jsx                         # Menu điều hướng bên trái theo phân quyền
│   │
│   ├── context/
│   │   └── AppContext.jsx                      # Quản lý State toàn cục & điều phối logic nghiệp vụ
│   ├── data/
│   │   └── initialData.js                      # Dữ liệu khởi tạo chuẩn ban đầu (Kho acc, đơn mẫu, user)
│   ├── pages/                                  # Các màn hình phân hệ của hệ thống
│   │   ├── AccountDetailPage.jsx               # Chi tiết tài khoản & thư viện ảnh trang phục
│   │   ├── AccountInventoryPage.jsx            # Quản trị kho tài khoản chuyên sâu & form thêm chuẩn UC1
│   │   ├── AdminDashboardPage.jsx              # Bảng điều khiển quản trị tổng hợp
│   │   ├── CustomersPage.jsx                   # Quản lý khách hàng CRM
│   │   ├── HomePage.jsx                        # Cửa hàng thuê acc game (Trang chủ)
│   │   ├── MyRentalsPage.jsx                   # Quản lý đơn thuê & ca chơi của tôi
│   │   ├── OverviewDashboard.jsx               # Tổng quan giám sát, KPI & cảnh báo 3 cấp độ
│   │   ├── ReportsDisputesPage.jsx             # Xử lý báo cáo lỗi & khiếu nại bồi thường bảo hiểm
│   │   ├── RevenuePage.jsx                     # Thống kê chi tiết doanh thu theo game & thời gian
│   │   ├── SettingsPage.jsx                    # Cài đặt hệ thống 4 tabs, quy tắc BVA & Backup dữ liệu
│   │   └── WalletPage.jsx                      # Quản lý ví điện tử & lịch sử giao dịch
│   │
│   ├── utils/
│   │   ├── favoriteUtils.js                    # Tiện ích quản lý danh sách yêu thích độc lập
│   │   └── validation.js                       # Các hàm chuẩn hóa & kiểm tra tính hợp lệ dữ liệu
│   │
│   ├── App.css                                 # Tùy biến kiểu dáng ứng dụng
│   ├── App.jsx                                 # Component điều phối chính & route guard phân quyền
│   ├── index.css                               # Hệ thống Design System, Biến màu & Typography
│   └── main.jsx                                # Điểm khởi chạy ứng dụng React
│
├── index.html                                  # File HTML chính của ứng dụng
├── package.json                                # Cấu hình thư viện & npm scripts
├── package-lock.json                           # Khóa phiên bản thư viện phụ thuộc
├── vite.config.js                              # Cấu hình Vite & Vitest
├── .oxlintrc.json                              # Cấu hình kiểm tra cú pháp Oxlint
├── .gitignore                                  # Cấu hình loại trừ file git
└── README.md                                   # Tài liệu hướng dẫn toàn diện dự án
```

---

## 🏆 11. Đánh Giá & Kết Luận Nghiệm Thu

1. **Tính hoàn thiện của ứng dụng**: Ứng dụng web GameRent vận hành trơn tru 100% các chức năng, đáp ứng đầy đủ chu trình nghiệp vụ khép kín từ Đăng ký, Nạp tiền VietQR, Thuê acc, Đếm ngược, Gia hạn, Trả sớm đến Khiếu nại bảo hiểm và Quản trị kho UC1.
2. **Tính chuẩn mực của hồ sơ kiểm thử**: Cả 3 file Excel (`Unit Test Case.xlsx`, `IT_Test Case.xlsx`, `ST_Test Case.xlsx`) và file Báo cáo Word (`BTL_KTPM_Nhóm_15.docx`) được thiết kế đồng bộ, dữ liệu nhất quán 100%, áp dụng đầy đủ các kỹ thuật EP, BVA, Decision Table, State Transition và Race Condition.
3. **Chất lượng kiểm thử tự động hóa**: Bộ 10 Test Suites với 107 Test Cases chạy tự động trên Vitest đạt tỷ lệ Pass 100%, thời gian thực thi chỉ ~1.25 giây, chứng minh mã nguồn đạt độ ổn định và độ tin cậy cao.
