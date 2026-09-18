những

# 🎮 GameRent - Hệ Thống Cho Thuê Tài Khoản Game Tự Động 24/7

> **Đề tài Bài tập lớn môn**: Kiểm Thử Phần Mềm (Software Testing & QA)**Trường**: Đại học Công nghệ Đông Á (EAUT) - **Khoa**: Công nghệ thông tin**Giảng viên hướng dẫn**: ThS. Phạm Thị Loan**Sinh viên thực hiện**:
>
> 1. **Lê Hải Đăng**
> 2. **Lê Minh Quân**
> 3. **Lê Xuân Đạt**
> 4. **Lê Thanh Tùng**
>    **Nền tảng**: Web Application (React + Vite + Modern CSS)

---

## 📌 Giới Thiệu Dự Án

**GameRent** là nền tảng thương mại điện tử chuyên cung cấp dịch vụ thuê tài khoản game trực tuyến tự động (Valorant, Liên Quân Mobile, Liên Minh Huyền Thoại, CS2, Genshin Impact...). Hệ thống được thiết kế khép kín từ quy trình nạp tiền ví, chọn giờ thuê, cấp thông tin đăng nhập tự động, đồng hồ đếm ngược thời gian thực, gia hạn ca thuê, đến quy trình trả acc sớm và giải quyết khiếu nại bảo hiểm hoàn tiền 100%.

Dự án được xây dựng với mục tiêu phục vụ **thực hành và đánh giá các kỹ thuật kiểm thử phần mềm chuyên sâu**:

- **Phân tích giá trị biên (Boundary Value Analysis - BVA)**
- **Phân vùng tương đương (Equivalence Partitioning - EP)**
- **Bảng quyết định điều kiện (Decision Table Testing)**
- **Kiểm thử chuyển trạng thái (State Transition Testing)**
- **Kiểm thử tự động hóa (Automated E2E Testing)** thông qua hệ thống `data-testid` chuẩn hóa trên toàn bộ DOM.

---

## 🌟 Điểm Nổi Bật Về Giao Diện & Trải Nghiệm (UI/UX)

- **Phong cách sáng màu thanh lịch (Light Theme)**: Chủ đạo với sắc **Trắng tinh khôi / Trắng ngà (`#FFFFFF`, `#F8FAFC`)** kết hợp với **Sắc cam ấm áp (`#F97316`, `#EA580C`)**.
- **Độ tương phản cao & Dễ đọc**: Sử dụng phông chữ **Outfit** (tiêu đề) và **Inter** (nội dung), chữ xám than đậm (`#0F172A`) rõ nét, không gây mỏi mắt.
- **Thành phần giao diện tương tác cao**:
  - Modal nạp tiền mô phỏng VietQR Auto với các nút chọn nhanh mệnh giá.
  - Đồng hồ đếm ngược thời gian thực chuyển màu cảnh báo khi sắp hết giờ.
  - Hộp thông tin bí mật với nút sao chép 1-click có phản hồi Toast trực quan.

---

## 🚀 Các Phân Hệ & Chức Năng Chính

Hệ thống bao gồm **7 phân hệ** với **26 Use Cases chi tiết**:

### 1. Phân hệ Xác thực & Phân quyền (Authentication & RBAC)

- **Đăng ký tài khoản (`Register`)**: Validate họ tên ($\ge 2$ ký tự), email đúng định dạng (@), kiểm tra trùng lặp email.
- **Đăng nhập (`Login`)**: Kiểm tra mật khẩu, xác thực trạng thái khóa tài khoản (`isBlocked`).
- **Phân quyền truy cập**: Tách biệt luồng nghiệp vụ giữa **Khách thuê (Renter)** và **Quản trị viên (Admin)**.

### 2. Phân hệ Tìm kiếm & Khám phá (Catalog & Discovery)

- **Tìm kiếm đa năng**: Tìm kiếm theo tên acc, skin nổi bật, bậc rank.
- **Lọc thông minh**: Lọc theo danh mục game, theo khoảng giá thuê mỗi giờ.
- **Sắp xếp**: Theo giá tăng dần, giảm dần, đánh giá sao, mới nhất.
- **Trang chi tiết**: Thông số kỹ thuật chi tiết của nick (Rank, skin VIP, bảo hiểm hoàn tiền 100%).

### 3. Phân hệ Ví điện tử & Nạp tiền (Wallet & Deposit)

- **Nạp tiền ví tự động**: Mô phỏng nạp qua VietQR và thẻ cào.
- **Kiểm thử biên (BVA/EP)**: Hạn mức nạp từ **10.000 VNĐ** đến **5.000.000 VNĐ** mỗi lần.
- **Lịch sử giao dịch**: Bảng biến động số dư chi tiết (Nạp tiền, phí thuê acc, hoàn tiền khiếu nại) kèm mã giao dịch `TX-XXXXX`.

### 4. Phân hệ Thuê tài khoản tự động (Rental Processing)

- **Lựa chọn thời lượng thuê**: Từ **1 đến 48 giờ** (áp dụng BVA).
- **Kiểm tra số dư (Decision Table)**: Cảnh báo số tiền còn thiếu nếu ví không đủ và mở nhanh modal nạp tiền.
- **Cấp tài khoản tức thì**: Trừ tiền ví, chuyển acc sang trạng thái `rented`, hiển thị tài khoản/mật khẩu bí mật.
- **Đồng hồ đếm ngược (Realtime Countdown Timer)**: Đếm ngược từng giây thời gian chơi thực tế.
- **Gia hạn thời gian thuê (`Extend Rental`)**: Cho phép thuê thêm giờ; tự động tính nối tiếp nếu còn hạn hoặc tính từ thời điểm hiện tại (`Date.now()`) nếu đơn đã hết hạn.
- **Trả tài khoản sớm (`Return Early`)**: Kết thúc ca thuê chủ động và chuyển acc sang quy trình đổi pass thu hồi.

### 5. Phân hệ Khiếu nại & Bảo hiểm (Dispute & Refund)

- **Báo lỗi sự cố**: Khách báo sự cố khi gặp lỗi (Sai mật khẩu, tài khoản bị ban, có người chơi đè, sai skin).
- **Phê duyệt & Hoàn tiền 100%**: Admin phê duyệt khiếu nại, hoàn trả 100% chi phí vào ví người dùng và chuyển acc vào bảo trì (`maintenance`).

### 6. Phân hệ Quản trị viên (Admin Dashboard)

- **Bảng điều khiển KPI**: Thống kê doanh thu, tổng số đơn thuê, số acc đang hoạt động.
- **Quản lý kho tài khoản**: Xem toàn bộ danh sách, đổi trạng thái (Sẵn sàng $\leftrightarrow$ Bảo trì), xóa acc.
- **Thêm mới tài khoản game**: Form thêm tài khoản với đầy đủ thông số kỹ thuật (chuẩn theo mẫu tài liệu `UC1_Add New Product`).

### 7. Thanh công cụ hỗ trợ Kiểm thử (BTL Tester Toolbar)

Thanh công cụ tiện ích nổi ở góc phải màn hình dành riêng cho giảng viên và tester:

- **Đổi vai trò 1-click**: Chuyển nhanh giữa **Admin** và **Khách Thuê (User)**.
- **Nạp nhanh +200.000 đ**: Bơm tiền trực tiếp vào ví để test luồng thanh toán ngay lập tức.
- **Tua nhanh -30 phút**: Giảm nhanh thời gian đơn thuê để test trạng thái sắp hết hạn và hết hạn.
- **Reset Data về gốc**: Xóa sạch LocalStorage và nạp lại bộ dữ liệu mẫu chuẩn ban đầu.

---

## 🛠️ Ngăn Xếp Công Nghệ (Tech Stack)

| Thành phần                  | Công nghệ sử dụng                                          |
| :---------------------------- | :------------------------------------------------------------- |
| **Framework**           | [React 18](https://react.dev/)                                  |
| **Build Tool**          | [Vite 8.2](https://vitejs.dev/) (Fast HMR & Optimized Bundling) |
| **Icons**               | [Lucide React](https://lucide.dev/)                             |
| **Styling**             | Vanilla CSS (Orange & White Design System, Responsive Layout)  |
| **Linter**              | [Oxlint](https://oxc.rs/) (Next-generation high-speed linter)   |
| **Lưu trữ dữ liệu** | HTML5 LocalStorage Persistence                                 |

---

## 💻 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường

- Đã cài đặt **Node.js** (khuyến nghị phiên bản 18.x trở lên).
- Trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Firefox).

### 2. Cài đặt các gói phụ thuộc (Dependencies)

Mở cửa sổ dòng lệnh tại thư mục dự án và chạy:

```bash
npm install
```

### 3. Khởi chạy máy chủ phát triển (Development Server)

```bash
npm run dev
```

Sau khi khởi chạy thành công, truy cập hệ thống tại: **`http://localhost:5173/`**

### 4. Kiểm tra mã nguồn với Linter

```bash
npm run lint
```

### 5. Đóng gói mã nguồn bản Production

```bash
npm run build
```

---

## 🔑 Tài Khoản Mẫu Để Kiểm Thử

Hệ thống đã chuẩn bị sẵn các tài khoản mẫu trong cơ sở dữ liệu giả lập (LocalStorage):

| Vai trò                           | Email đăng nhập    | Mật khẩu    | Số dư ví ban đầu | Quyền hạn                                                       |
| :--------------------------------- | :-------------------- | :------------ | :-------------------- | :---------------------------------------------------------------- |
| **Khách thuê (Renter)**    | `tester@gmail.com`  | `tester123` | 100.000 VNĐ          | Tìm kiếm, Nạp tiền, Thuê acc, Gia hạn, Trả sớm, Báo lỗi |
| **Quản trị viên (Admin)** | `admin@gamerent.vn` | `admin123`  | 500.000 VNĐ          | Quản lý kho, Thêm acc mới, Duyệt hoàn tiền khiếu nại     |

> 💡 *Mẹo kiểm thử nhanh: Bạn có thể bấm vào mục **BTL Tester Toolbar** ở góc dưới cùng bên phải màn hình để chuyển đổi vai trò hoặc nạp tiền ví chỉ với 1 cú click!*

---

## 📑 Tài Liệu Đặc Tả Tham Chiếu

Các tài liệu báo cáo và đặc tả hoàn chỉnh được lưu trữ tại thư mục `Tài_Liệu/`:

- **[Dac_Ta_Yeu_Cau_Va_Kiem_Thu_GameRent.pdf](file:///e:/BTL_KTPM/T%C3%A0i_Li%E1%BB%87u/Dac_Ta_Yeu_Cau_Va_Kiem_Thu_GameRent.pdf)**: Tài liệu đặc tả đầy đủ các Use Case chuẩn form mẫu quy cách.
- **[UC1_Add New Product.pdf](<file:///e:/BTL_KTPM/T%C3%A0i_Li%E1%BB%87u/UC1_Add%20New%20Product.pdf>)**: Tài liệu đề bài mẫu tham chiếu.

---

## 🤖 Hướng Dẫn Tự Động Hóa Kiểm Thử (E2E Test IDs)

Dự án đã định danh đầy đủ các phần tử HTML quan trọng bằng thuộc tính `data-testid`:

| Data Test ID                     | Ý nghĩa / Phần tử                                           |
| :------------------------------- | :-------------------------------------------------------------- |
| `btn-open-auth-modal`          | Nút mở hộp thoại đăng nhập / đăng ký                  |
| `tab-login` / `tab-register` | Các tab chuyển đổi phương thức đăng nhập / đăng ký |
| `input-login-email`            | Ô nhập email đăng nhập                                     |
| `input-login-password`         | Ô nhập mật khẩu đăng nhập                                |
| `btn-submit-login`             | Nút xác nhận đăng nhập                                    |
| `btn-open-deposit-modal`       | Nút mở modal nạp tiền ví                                   |
| `input-deposit-amount`         | Ô nhập số tiền cần nạp (Kiểm thử BVA)                   |
| `btn-confirm-deposit`          | Nút xác nhận nạp tiền                                      |
| `btn-rent-now-{accountId}`     | Nút bắt đầu thuê tài khoản cụ thể                      |
| `btn-confirm-rent`             | Nút thanh toán và xác nhận thuê acc                       |
| `live-countdown-timer`         | Đồng hồ đếm ngược thời gian thuê đang chạy           |
| `timer-expired`                | Huy hiệu thông báo đơn thuê đã hết hạn                |
| `btn-trigger-extend-{orderId}` | Nút mở bảng gia hạn thêm giờ                              |
| `btn-return-early-{orderId}`   | Nút mở modal trả tài khoản sớm                            |
| `floating-tester-toolbar`      | Thanh công cụ trợ giúp kiểm thử                           |

---

© 2026 Nhóm Sinh Viên Thực Hiện Bài Tập Lớn Kiểm Thử Phần Mềm. All rights reserved.
