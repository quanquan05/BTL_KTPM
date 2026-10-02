# 🛠️ Scripts & Tools - GameRent BTL KTPM

Thư mục chứa các kịch bản Python và JavaScript phục vụ tạo lập báo cáo, vẽ sơ đồ và xử lý dữ liệu test:

### 1. Báo cáo & Tài liệu
- **`generate_full_btl_report.py`**: Kịch bản Python tự động sinh tài liệu Báo cáo Word chuẩn 4 chương hoàn chỉnh: `Tài_Liệu/BTL_KTPM_Nhóm_15.docx`.

### 2. Sinh sơ đồ PlantUML (Đã tối ưu tỉ lệ A4/Ngang vào Word)
- **`generate_plantuml_hinh1.py`**: Sinh **Hình 1: Sơ đồ Use Case tổng quát hệ thống GameRent** (PlantUML bố cục 2x2 gọn đẹp).
- **`generate_final_hinh2.py`**: Sinh **Hình 2: Sơ đồ luồng nghiệp vụ chính End-to-End (E2E)** (PlantUML swimlane activity diagram).
- **`generate_final_hinh11.py`**: Sinh **Hình 11: Sơ đồ chuyển trạng thái (State Transition Testing)** (PlantUML state machine diagram).
- **`generate_use_case_diagram.py`**: Sinh sơ đồ SVG Use Case chất lượng cao.
- **`generate_state_transition_diagram.py`**: Sinh sơ đồ SVG chuyển trạng thái.

### 3. Tự động hóa Test & Chụp ảnh minh chứng
- **`run_e2e_automation.js`**: Kịch bản Playwright chạy kiểm thử tự động E2E.
- **`generate_automation_terminal_screenshot.js`**: Chụp màn hình terminal chạy kiểm thử tự động.
- **`generate_defect_report_images.py`**: Kịch bản sinh các hình ảnh minh chứng lỗi phần mềm.
- **`generate_real_web_defect_screenshots.js`**: Playwright chụp ảnh lỗi trực tiếp từ giao diện web.

### 4. Định dạng & Đồng bộ Excel Test Cases
- **`beautify_all_three_excels.py`**: Kịch bản làm đẹp và chuẩn hóa định dạng toàn bộ 3 file Excel Test Case.
- **`update_unit_test_cases_excel.py`**: Cập nhật file `Unit Test Case.xlsx`.
- **`update_integration_test_cases_excel.py`**: Cập nhật file `IT_Test Case.xlsx`.
- **`update_system_test_cases_excel.py`**: Cập nhật file `ST_Test Case.xlsx`.

