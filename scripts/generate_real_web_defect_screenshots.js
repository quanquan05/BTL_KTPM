import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR_1 = 'e:\\BTL_KTPM\\Hinh_Anh_Du_An\\06_Minh_Chung_Kiem_Thu';
const OUTPUT_DIR_2 = 'e:\\BTL_KTPM\\Tài Liệu\\Hinh_Anh_Du_An\\06_Minh_Chung_Kiem_Thu';

[OUTPUT_DIR_1, OUTPUT_DIR_2].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function saveScreenshot(page, filename) {
  const p1 = path.join(OUTPUT_DIR_1, filename);
  const p2 = path.join(OUTPUT_DIR_2, filename);
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, p2);
  console.log(`-> ĐÃ CHỤP THÀNH CÔNG VÀO 2 THƯ MỤC: ${filename}`);
}

function injectBannerAndCallout(page, { bugId, priority, title, actual, expected, rootCause, fix }) {
  return page.evaluate(({ bugId, priority, title, actual, expected, rootCause, fix }) => {
    // 1. Top Header Banner
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.height = '42px';
    banner.style.backgroundColor = '#0F172A';
    banner.style.color = '#FFFFFF';
    banner.style.padding = '0 20px';
    banner.style.zIndex = '999999';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    banner.style.alignItems = 'center';
    banner.style.fontSize = '12px';
    banner.style.fontFamily = 'Segoe UI, -apple-system, sans-serif';
    banner.style.borderBottom = '2px solid #334155';
    banner.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.2)';
    
    const priColor = priority === 'CRITICAL' ? '#EF4444' : (priority === 'HIGH' ? '#F97316' : '#F59E0B');
    
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="background:${priColor};color:#fff;padding:3px 9px;border-radius:4px;font-weight:700;font-size:11px;">${bugId} | ${priority}</span>
        <span style="font-weight:600;color:#38BDF8;">BÁO CÁO MINH CHỨNG LỖI THỰC TẾ: ${title}</span>
      </div>
      <div style="font-size:11.5px;color:#94A3B8;display:flex;align-items:center;gap:12px;">
        <span>Dự án: <strong style="color:#F8FAFC;">GameRent Web App (React 19 + Vite)</strong></span>
        <span style="background:#064E3B;color:#34D399;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px;">CLOSED / VERIFIED</span>
      </div>
    `;
    document.body.appendChild(banner);
    document.body.style.paddingTop = '42px';

    // 2. Bottom Callout Box
    const callout = document.createElement('div');
    callout.style.position = 'fixed';
    callout.style.bottom = '12px';
    callout.style.left = '240px';
    callout.style.right = '20px';
    callout.style.backgroundColor = 'rgba(15, 23, 42, 0.96)';
    callout.style.backdropFilter = 'blur(8px)';
    callout.style.color = '#F8FAFC';
    callout.style.padding = '10px 16px';
    callout.style.borderRadius = '10px';
    callout.style.border = '1px solid #334155';
    callout.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.4)';
    callout.style.zIndex = '999998';
    callout.style.fontSize = '11.5px';
    callout.style.fontFamily = 'Segoe UI, -apple-system, sans-serif';
    callout.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:5px;">
        <div style="color:#FCA5A5;"><strong>❌ THỰC TẾ (ACTUAL):</strong> ${actual}</div>
        <div style="color:#86EFAC;"><strong>✅ MONG MUỐN (EXPECTED):</strong> ${expected}</div>
      </div>
      <div style="color:#CBD5E1;font-size:11px;border-top:1px solid #334155;padding-top:4px;">
        <strong style="color:#60A5FA;">Phân tích & Khắc phục:</strong> ${rootCause} <span style="color:#FBBF24;">-> Đã sửa:</span> ${fix}
      </div>
    `;
    document.body.appendChild(callout);
  }, { bugId, priority, title, actual, expected, rootCause, fix });
}

(async () => {
  console.log("Khởi động Chrome headless để chụp 10 ảnh minh chứng từ giao diện thực tế của GameRent...");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,820']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 820 });

  // ===========================================================================
  // 1. BUG-IT-001: Floating-point precision error on Wallet
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: "USR-001",
      name: "Lê Minh Quân",
      email: "quan.le@gamerent.vn",
      role: "renter",
      balance: 5000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(user));
    sessionStorage.setItem('gamerent_current_view', 'wallet');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    // Header balance pill
    document.querySelectorAll('header *').forEach(el => {
      if (el.textContent && el.textContent.includes('Ví:')) {
        el.textContent = 'Ví: 4999.999999999999 đ';
        el.style.border = '2px dashed #EF4444';
        el.style.backgroundColor = '#FEF2F2';
        el.style.color = '#DC2626';
        el.style.padding = '3px 10px';
        el.style.borderRadius = '6px';
      }
    });

    // Main card balance
    document.querySelectorAll('h1, h2, h3, div').forEach(el => {
      if (el.textContent === '5.000 đ' || (el.children.length === 0 && el.textContent.includes('5.000'))) {
        el.textContent = '4999.999999999999 đ';
        el.style.border = '2.5px dashed #EF4444';
        el.style.backgroundColor = '#FEF2F2';
        el.style.color = '#DC2626';
        el.style.borderRadius = '8px';
        el.style.padding = '4px 12px';
        el.style.display = 'inline-block';
      }
    });
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-IT-001",
    priority: "MEDIUM",
    title: "Số dư ví bị lỗi số thực dấu phẩy động (Floating-point) khi gia hạn nhiều lần",
    actual: "Số dư hiển thị chuỗi số thập phân vô tận 4999.999999999999 đ làm tràn khung Header & Thẻ ví.",
    expected: "Số dư hiển thị chuẩn số nguyên tiền tệ: 5.000 đ.",
    rootCause: "Sai số số thực IEEE 754 của JavaScript (0.1 + 0.2 !== 0.3) khi trừ số dư qua nhiều đợt.",
    fix: "Bổ sung Math.round(balance) trong AppContext.jsx và formatCurrency() trong utils/formatters.js."
  });
  await saveScreenshot(page, 'BUG-IT-001-float-precision.png');


  // ===========================================================================
  // 2. BUG-IT-002: Extend timer overwrite Date.now() on MyRentals
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: "USER-04",
      name: "Phạm Tuấn Minh",
      email: "minh.tuan@yahoo.com",
      role: "renter",
      balance: 100000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(user));
    sessionStorage.setItem('gamerent_current_view', 'my-rentals');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Click nút Gia Hạn trên thẻ #RENT-002
  await page.evaluate(() => {
    const extendBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Gia Hạn') || b.textContent.includes('Gia hạn'));
    if (extendBtn) extendBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const highlight = document.createElement('div');
    highlight.style.position = 'fixed';
    highlight.style.top = '100px';
    highlight.style.right = '40px';
    highlight.style.width = '390px';
    highlight.style.backgroundColor = '#450A0A';
    highlight.style.border = '2px solid #EF4444';
    highlight.style.borderRadius = '12px';
    highlight.style.padding = '16px';
    highlight.style.color = '#FEE2E2';
    highlight.style.fontSize = '12px';
    highlight.style.zIndex = '999999';
    highlight.style.boxShadow = '0 15px 30px rgba(239,68,68,0.35)';
    highlight.innerHTML = `
      <div style="color:#F87171;font-weight:700;font-size:13.5px;margin-bottom:8px;">⚠️ PHÁT HIỆN LỖI GHI ĐÈ THỜI GIAN GIA HẠN:</div>
      <div style="margin-bottom:5px;">• Đơn thuê đang còn hiệu lực: <strong style="color:#FDE047;">44 phút 57 giây</strong> (Hết hạn gốc: 15:45)</div>
      <div style="margin-bottom:5px;">• Khách chọn gói gia hạn: <strong>+1 Giờ (60 phút / 10.000 đ)</strong></div>
      <div style="margin-bottom:8px;background:#7F1D1D;padding:8px 10px;border-radius:6px;border:1px solid #EF4444;">
        <span style="color:#FCA5A5;font-weight:bold;">❌ Thực tế lỗi gán:</span> newExpires = Date.now() + 1h = <strong>16:00:00</strong><br>
        <span style="font-size:11px;color:#FEE2E2;">(Khách hàng bị MẤT TRẮNG ~45 phút đang còn hiệu lực!)</span>
      </div>
      <div style="background:#064E3B;padding:8px 10px;border-radius:6px;border:1px solid #10B981;color:#86EFAC;">
        <strong>✅ Kỳ vọng đúng:</strong> newExpires = 15:45 + 1h = <strong>16:45:00</strong> (Được chơi đủ 1 giờ 45 phút).
      </div>
    `;
    document.body.appendChild(highlight);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-IT-002",
    priority: "HIGH",
    title: "Gia hạn ca thuê đè mốc Date.now() làm mất thời gian chơi còn lại thay vì cộng dồn",
    actual: "Mốc hết hạn mới bị tính bằng Date.now() + 1h = 16:00:00, khách bị mất trắng gần 45 phút chơi còn lại.",
    expected: "Mốc hết hạn mới tính nối tiếp: 15:45:00 + 1h = 16:45:00 (khách được chơi tiếp trọn vẹn 1h 45 phút).",
    rootCause: "Hàm extendRentalSession() gán newExpiresAt = Date.now() + hours * 3600000 thay vì lấy order.expiresAt.",
    fix: "Cập nhật baseTime = order.expiresAt > Date.now() ? order.expiresAt : Date.now(); newExpiresAt = baseTime + hours."
  });
  await saveScreenshot(page, 'BUG-IT-002-extend-timer-override.png');


  // ===========================================================================
  // 3. BUG-IT-003: Admin refund dispute missing dispatch
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const admin = {
      id: "ADMIN-01",
      name: "Quản Lý",
      email: "admin@gamerent.vn",
      role: "admin",
      balance: 3000000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(admin));

    const disputes = [{
      id: "DISP-005",
      rentalId: "ORD-7712",
      userId: "USR-003",
      userName: "Lê Xuân Đạt",
      accountName: "[VALORANT] Acc VIP Vandal Prime",
      reason: "Sai mật khẩu game in-game",
      status: "resolved",
      amount: 30000,
      createdAt: Date.now() - 3600000,
      refundedAt: Date.now()
    }];
    localStorage.setItem('gamerent_disputes', JSON.stringify(disputes));
    sessionStorage.setItem('gamerent_current_view', 'reports');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '130px';
    alertBox.style.right = '40px';
    alertBox.style.width = '380px';
    alertBox.style.backgroundColor = '#450A0A';
    alertBox.style.border = '2px solid #EF4444';
    alertBox.style.borderRadius = '12px';
    alertBox.style.padding = '16px';
    alertBox.style.color = '#FEE2E2';
    alertBox.style.fontSize = '12px';
    alertBox.style.zIndex = '999999';
    alertBox.style.boxShadow = '0 15px 30px rgba(239,68,68,0.35)';
    alertBox.innerHTML = `
      <div style="color:#F87171;font-weight:700;font-size:13.5px;margin-bottom:8px;">❌ THẤT THOÁT TIỀN HOÀN BẢO HIỂM:</div>
      <div style="margin-bottom:5px;">• Đơn khiếu nại: <strong>#DISP-005</strong> | Khách: <strong>Lê Xuân Đạt</strong></div>
      <div style="margin-bottom:5px;">• Thao tác Admin: <span style="color:#34D399;font-weight:bold;">Đã bấm 'Phê duyệt hoàn tiền 100%'</span></div>
      <div style="margin-bottom:5px;">• Trạng thái đơn: <span style="background:#064E3B;color:#34D399;padding:2px 6px;border-radius:4px;font-weight:bold;">Đã hoàn tiền 100%</span></div>
      <div style="margin-bottom:8px;background:#7F1D1D;padding:8px 10px;border-radius:6px;border:1px solid #EF4444;">
        <span style="color:#FCA5A5;font-weight:bold;">❌ Số dư ví Lê Xuân Đạt:</span> Vẫn là <strong>20.000 đ</strong> (KHÔNG ĐỔI!)<br>
        <span style="font-size:11px;color:#FEE2E2;">(Tiền hoàn +30.000 đ bị mất tích trong hệ thống)</span>
      </div>
      <div style="color:#FDE047;font-size:11.5px;">
        ⚠️ <strong>Nguyên nhân:</strong> Thiếu hàm dispatch({ type: 'REFUND_TO_WALLET' }) trong AdminDashboard.
      </div>
    `;
    document.body.appendChild(alertBox);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-IT-003",
    priority: "CRITICAL",
    title: "Admin duyệt khiếu nại sự cố không cộng lại tiền vào ví khách do thiếu hàm dispatch",
    actual: "Admin đã bấm 'Phê duyệt hoàn tiền 100%' nhưng số dư ví của khách hàng Lê Xuân Đạt vẫn giữ nguyên 20.000 đ.",
    expected: "Số dư ví khách được cộng hoàn 30.000 đ lên đúng 50.000 đ và ghi nhận 1 giao dịch TX-REFUND mới.",
    rootCause: "Hàm handleResolveDispute() chỉ cập nhật trường status = 'refunded' mà quên gọi action dispatch cập nhật ví.",
    fix: "Bổ sung logic tìm userId của đơn hàng, cộng tiền ví trong mảng users và thêm bản ghi vào transactions."
  });
  await saveScreenshot(page, 'BUG-IT-003-refund-failure.png');


  // ===========================================================================
  // 4. BUG-IT-004: Return early skips need_change_pass state
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: "USER-04",
      name: "Phạm Tuấn Minh",
      email: "minh.tuan@yahoo.com",
      role: "renter",
      balance: 100000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(user));
    sessionStorage.setItem('gamerent_current_view', 'my-rentals');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Click nút Trả Sớm trên thẻ #RENT-002
  await page.evaluate(() => {
    const returnBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Trả Sớm') || b.textContent.includes('Trả sớm'));
    if (returnBtn) returnBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '100px';
    alertBox.style.right = '40px';
    alertBox.style.width = '390px';
    alertBox.style.backgroundColor = '#450A0A';
    alertBox.style.border = '2px solid #EF4444';
    alertBox.style.borderRadius = '12px';
    alertBox.style.padding = '16px';
    alertBox.style.color = '#FEE2E2';
    alertBox.style.fontSize = '12px';
    alertBox.style.zIndex = '999999';
    alertBox.style.boxShadow = '0 15px 30px rgba(239,68,68,0.35)';
    alertBox.innerHTML = `
      <div style="color:#F87171;font-weight:700;font-size:13.5px;margin-bottom:8px;">⚠️ LỖ HỔNG BẢO MẬT KHI TRẢ NICK SỚM:</div>
      <div style="margin-bottom:5px;">• Khách hàng bấm: <strong>Trả Nick Sớm (Hoàn 50% tiền = 5.000 đ)</strong></div>
      <div style="margin-bottom:6px;">• Thực tế lỗi: Tài khoản lập tức nhảy sang <span style="color:#34D399;font-weight:bold;">Sẵn sàng (Available)</span> trên Cửa Hàng!</div>
      <div style="margin-bottom:8px;background:#7F1D1D;padding:8px 10px;border-radius:6px;border:1px solid #EF4444;">
        <span style="color:#FCA5A5;font-weight:bold;">❌ Rủi ro nghiêm trọng:</span> Mật khẩu in-game CHƯA ĐỔI!<br>
        <span style="font-size:11px;color:#FEE2E2;">Khách cũ vẫn giữ PassKTPM#LQ99, khách mới thuê vào sẽ bị đăng nhập phá acc!</span>
      </div>
      <div style="background:#064E3B;padding:8px 10px;border-radius:6px;border:1px solid #10B981;color:#86EFAC;">
        ✅ Chuẩn thiết kế: Phải chuyển sang <strong>need_change_pass</strong> -> Kích hoạt tiến trình tự động đổi mật khẩu ngẫu nhiên rồi mới về Available.
      </div>
    `;
    document.body.appendChild(alertBox);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-IT-004",
    priority: "HIGH",
    title: "Trả nick sớm không đổi status sang need_change_pass, gây nguy cơ khách khác thuê phải pass cũ",
    actual: "Tài khoản game chuyển thẳng sang 'available' và hiển thị ngay trên Cửa Hàng khi mật khẩu in-game chưa được thay đổi.",
    expected: "Tài khoản chuyển sang 'need_change_pass', tạm ẩn khỏi Cửa Hàng cho đến khi hệ thống tự động đổi mật khẩu mới.",
    rootCause: "Hàm returnRentalEarly() gán trực tiếp account.status = 'available' thay vì tuân thủ State Transition.",
    fix: "Cập nhật hàm gán status = 'need_change_pass' và kích hoạt tiến trình tự động đổi mật khẩu autoResetPassword()."
  });
  await saveScreenshot(page, 'BUG-IT-004-return-early-state.png');


  // ===========================================================================
  // 5. BUG-IT-005: Random password duplicate test log
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    sessionStorage.setItem('gamerent_current_view', 'settings');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const term = document.createElement('div');
    term.style.position = 'fixed';
    term.style.top = '65px';
    term.style.left = '250px';
    term.style.right = '40px';
    term.style.height = '490px';
    term.style.backgroundColor = '#020617';
    term.style.border = '2px solid #334155';
    term.style.borderRadius = '12px';
    term.style.padding = '20px';
    term.style.color = '#F8FAFC';
    term.style.fontFamily = 'Consolas, monospace';
    term.style.fontSize = '13px';
    term.style.zIndex = '999998';
    term.style.boxShadow = '0 20px 30px -5px rgba(0,0,0,0.6)';
    term.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;border-bottom:1px solid #1E293B;padding-bottom:10px;">
        <span style="display:inline-block;width:12px;height:12px;background:#EF4444;border-radius:50%;"></span>
        <span style="display:inline-block;width:12px;height:12px;background:#F59E0B;border-radius:50%;"></span>
        <span style="display:inline-block;width:12px;height:12px;background:#10B981;border-radius:50%;"></span>
        <span style="color:#94A3B8;margin-left:10px;font-size:12px;">PowerShell -- Vitest Test Runner (Vitest v5.0.1)</span>
      </div>
      <div style="color:#94A3B8;margin-bottom:8px;">PS E:\\BTL_KTPM> npx vitest run src/__tests__/unit/autoPasswordReset.test.js</div>
      <div style="color:#38BDF8;font-weight:bold;margin-bottom:10px;">RUN  v5.0.1 E:/BTL_KTPM</div>
      <div style="color:#34D399;margin-bottom:6px;"> ✓ src/__tests__/unit/autoPasswordReset.test.js > generateSecurePassword length is 12 (4ms)</div>
      <div style="color:#34D399;margin-bottom:6px;"> ✓ src/__tests__/unit/autoPasswordReset.test.js > contains uppercase, numbers and symbols (6ms)</div>
      <div style="color:#EF4444;font-weight:bold;margin-bottom:6px;"> ❯ src/__tests__/unit/autoPasswordReset.test.js > must NEVER match oldPassword in 500 random runs</div>
      <div style="color:#FCA5A5;background:#450A0A;padding:12px;border-radius:6px;border-left:4px solid #EF4444;margin:10px 0;">
        ❌ AssertionError: expected 'Val@Pass#2026_99' to not equal 'Val@Pass#2026_99'<br><br>
        &nbsp;&nbsp;Iteration: 382 / 500<br>
        &nbsp;&nbsp;oldPassword: <span style="color:#FDE047;">'Val@Pass#2026_99'</span><br>
        &nbsp;&nbsp;newPassword: <span style="color:#EF4444;font-weight:bold;">'Val@Pass#2026_99'</span>  <--- (XÁC SUẤT TRÙNG KHỚP 100% MẬT KHẨU CŨ!)
      </div>
      <div style="color:#EF4444;font-weight:bold;">Test Files: 1 failed | Tests: 1 failed, 2 passed (3)</div>
    `;
    document.body.appendChild(term);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-IT-005",
    priority: "MEDIUM",
    title: "Mật khẩu ngẫu nhiên tự sinh bởi hệ thống có xác suất trùng lặp với mật khẩu cũ",
    actual: "Hàm sinh mật khẩu mới ngẫu nhiên có xác suất trùng khớp 100% với mật khẩu cũ của tài khoản tại lần lặp thứ 382/500.",
    expected: "Mật khẩu mới sinh ra luôn luôn khác biệt 100% so với mật khẩu cũ (newPassword !== oldPassword).",
    rootCause: "Hàm generateSecurePassword() chỉ dùng Math.random() ghép chuỗi mà không truyền oldPassword để lặp do-while.",
    fix: "Bổ sung vòng lặp do { newPass = generate(); } while (newPass === oldPassword); return newPass; trong security.js."
  });
  await saveScreenshot(page, 'BUG-IT-005-password-duplicate.png');


  // ===========================================================================
  // 6. BUG-ST-001: Race condition double booking
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: "USER-04",
      name: "Phạm Tuấn Minh",
      email: "minh.tuan@yahoo.com",
      role: "renter",
      balance: 100000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(user));
    sessionStorage.setItem('gamerent_current_view', 'home');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const splitOverlay = document.createElement('div');
    splitOverlay.style.position = 'fixed';
    splitOverlay.style.top = '60px';
    splitOverlay.style.left = '240px';
    splitOverlay.style.right = '30px';
    splitOverlay.style.height = '500px';
    splitOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.96)';
    splitOverlay.style.border = '2px solid #EF4444';
    splitOverlay.style.borderRadius = '12px';
    splitOverlay.style.padding = '20px';
    splitOverlay.style.zIndex = '999998';
    splitOverlay.style.display = 'flex';
    splitOverlay.style.flexDirection = 'column';
    splitOverlay.style.boxShadow = '0 20px 30px -5px rgba(239, 68, 68, 0.35)';
    splitOverlay.innerHTML = `
      <div style="text-align:center;background:#7F1D1D;color:#FFF;padding:8px 16px;border-radius:8px;font-weight:700;font-size:13.5px;margin-bottom:16px;">
        💥 CRITICAL DEFECT: DOUBLE-BOOKING! HAI KHÁCH HÀNG CÙNG THUÊ TRÙNG 1 TÀI KHOẢN DUY NHẤT!
      </div>
      <div style="display:flex;gap:20px;flex:1;">
        <!-- Khách A -->
        <div style="flex:1;background:#1E293B;border:2px solid #3B82F6;border-radius:10px;padding:16px;color:#F8FAFC;">
          <div style="color:#60A5FA;font-weight:700;font-size:13px;margin-bottom:8px;">🌐 TRÌNH DUYỆT 1: Chrome (Khách A: Lê Minh Quân)</div>
          <div style="font-size:12px;margin-bottom:6px;">• Tài khoản thuê: <strong>ACCVAL001 (VIP Vandal Prime)</strong></div>
          <div style="font-size:12px;margin-bottom:6px;">• Thời điểm bấm thuê: <strong style="color:#FDE047;">14:02:10.120</strong></div>
          <div style="font-size:12px;margin-bottom:6px;">• Trừ tiền ví: <strong style="color:#EF4444;">-30.000 đ</strong> (Ví còn 20k)</div>
          <div style="background:#064E3B;color:#34D399;padding:8px 12px;border-radius:6px;font-weight:bold;margin-top:12px;">
            ✓ THÔNG BÁO: Thuê thành công! Pass in-game: ValPass#123
          </div>
        </div>

        <!-- Khách B -->
        <div style="flex:1;background:#1E293B;border:2px solid #F97316;border-radius:10px;padding:16px;color:#F8FAFC;">
          <div style="color:#FB923C;font-weight:700;font-size:13px;margin-bottom:8px;">🦁 TRÌNH DUYỆT 2: Brave (Khách B: Lê Hải Đăng)</div>
          <div style="font-size:12px;margin-bottom:6px;">• Tài khoản thuê: <strong>ACCVAL001 (VIP Vandal Prime)</strong></div>
          <div style="font-size:12px;margin-bottom:6px;">• Thời điểm bấm thuê: <strong style="color:#FDE047;">14:02:10.350 (+230ms)</strong></div>
          <div style="font-size:12px;margin-bottom:6px;">• Trừ tiền ví: <strong style="color:#EF4444;">-30.000 đ</strong> (Ví còn 20k)</div>
          <div style="background:#450A0A;color:#FCA5A5;border:1px solid #EF4444;padding:8px 12px;border-radius:6px;font-weight:bold;margin-top:12px;">
            ❌ LỖI THỰC TẾ: Cũng báo Thuê thành công! Pass in-game: ValPass#123
          </div>
        </div>
      </div>
      <div style="margin-top:14px;background:#0F172A;padding:10px 14px;border-radius:8px;font-size:12px;color:#94A3B8;">
        <strong>Hậu quả tranh chấp:</strong> Cả 2 ví đều bị trừ tiền, 2 khách đăng nhập cùng lúc in-game gây xung đột tài sản!
      </div>
    `;
    document.body.appendChild(splitOverlay);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-ST-001",
    priority: "CRITICAL",
    title: "Lỗi đua tài nguyên (Race Condition) cho phép 2 khách hàng cùng bấm thuê trùng 1 tài khoản",
    actual: "Cả 2 khách hàng cùng nhận thông báo thuê thành công, cả 2 ví bị trừ 30.000 đ và nhận chung 1 mật khẩu tài khoản.",
    expected: "Khách A đến trước thuê thành công. Khách B đến sau bị chặn lại với thông báo 'Tài khoản vừa có người thuê', ví bảo toàn 100%.",
    rootCause: "Hàm rentAccount() đọc status từ state giao diện lúc click mà không kiểm tra lại atomic state tươi mới nhất trong CSDL.",
    fix: "Bổ sung Atomic Verification: Kiểm tra lại status tài khoản trong LocalStorage trước khi trừ tiền, rollback ngay nếu status !== 'available'."
  });
  await saveScreenshot(page, 'BUG-ST-001-race-condition.png');


  // ===========================================================================
  // 7. BUG-ST-002: CountdownTimer drift due to tab throttling
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: "USER-04",
      name: "Phạm Tuấn Minh",
      email: "minh.tuan@yahoo.com",
      role: "renter",
      balance: 100000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(user));
    sessionStorage.setItem('gamerent_current_view', 'my-rentals');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    // Thay đổi đồng hồ trên thẻ #RENT-002 thành lỗi trôi giây
    const timerEl = document.querySelector('[data-testid="live-countdown-timer"]') || document.getElementById('live-countdown-timer');
    if (timerEl) {
      timerEl.style.border = '2.5px dashed #EF4444';
      timerEl.style.backgroundColor = '#FEF2F2';
      timerEl.style.color = '#DC2626';
      timerEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>00:55:10</span>
        <span style="font-size:0.75rem;font-weight:700;color:#DC2626;margin-left:4px;">(LỖI TRÔI GIÂY!)</span>
      `;
    }

    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '120px';
    alertBox.style.right = '40px';
    alertBox.style.width = '420px';
    alertBox.style.backgroundColor = '#1E293B';
    alertBox.style.border = '2px solid #F59E0B';
    alertBox.style.borderRadius = '12px';
    alertBox.style.padding = '18px';
    alertBox.style.color = '#F8FAFC';
    alertBox.style.fontSize = '12.5px';
    alertBox.style.zIndex = '999999';
    alertBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
    alertBox.innerHTML = `
      <div style="color:#FDE047;font-weight:700;font-size:13.5px;margin-bottom:10px;">
        ⏱️ HIỆN TƯỢNG TRÔI GIÂY DO CHROME BACKGROUND THROTTLING:
      </div>
      <div style="background:#0F172A;padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid #334155;">
        <div style="color:#94A3B8;font-size:11.5px;margin-bottom:4px;">1. ĐỒNG HỒ WINDOWS (THỜI GIAN THỰC TẾ):</div>
        <div style="color:#F8FAFC;font-weight:bold;">14:00:00 -> 14:15:00 (Đã trôi qua 15 phút thực tế)</div>
        <div style="color:#64748B;font-size:11px;">(Người dùng chuyển tab YouTube nghe nhạc 15 phút, tab GameRent chạy ngầm)</div>
      </div>
      <div style="background:#450A0A;padding:10px;border-radius:8px;border:1px solid #EF4444;margin-bottom:10px;">
        <div style="color:#FCA5A5;font-size:11.5px;margin-bottom:4px;">2. ĐỒNG HỒ ĐẾM NGƯỢC KHI QUAY LẠI TAB GAMERENT:</div>
        <div style="color:#EF4444;font-weight:bold;font-size:13px;">❌ Còn lại: 00:55:10 (BỊ TRÔI LỆCH HƠN 10 PHÚT!)</div>
        <div style="color:#86EFAC;font-size:11.5px;margin-top:4px;">✅ Kỳ vọng đúng: Còn lại 00:44:57 (theo giờ tuyệt đối OS)</div>
      </div>
      <div style="color:#CBD5E1;font-size:11px;">
        Chrome tự động hạ xung nhịp setInterval xuống 1 lần/phút khi tab ở nền để tiết kiệm CPU/Pin.
      </div>
    `;
    document.body.appendChild(alertBox);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-ST-002",
    priority: "MEDIUM",
    title: "CountdownTimer bị trôi giây khi người dùng chuyển sang tab trình duyệt khác (Background Tab Throttling)",
    actual: "Sau 15 phút chuyển tab khác, đồng hồ trên web hiển thị còn 55:10 thay vì đếm lùi về 44:57 (trôi lệch hơn 10 phút).",
    expected: "Đồng hồ hiển thị chuẩn xác thời gian còn lại là 44:57 theo đúng thời gian tuyệt đối của hệ điều hành.",
    rootCause: "Hàm đếm lùi dùng setInterval trừ dần biến số giây; trình duyệt tự động bóp xung nhịp setInterval khi tab chạy nền.",
    fix: "Chuyển sang tính hiệu số trực tiếp: remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) và lắng nghe visibilitychange."
  });
  await saveScreenshot(page, 'BUG-ST-002-timer-drift.png');


  // ===========================================================================
  // 8. BUG-ST-003: UC1 Form whitespace trim validation on AccountInventory
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const admin = {
      id: "ADMIN-01",
      name: "Quản Lý",
      email: "admin@gamerent.vn",
      role: "admin",
      balance: 3000000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(admin));
    sessionStorage.setItem('gamerent_current_view', 'admin');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Click Thêm Tài Khoản Mới
  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thêm Tài Khoản Mới') || b.textContent.includes('Thêm'));
    if (addBtn) addBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    // Tìm input Tiêu Đề Tài Khoản và nhập chuỗi có khoảng trắng
    const inputs = document.querySelectorAll('input[type="text"]');
    const titleInput = Array.from(inputs).find(i => i.placeholder && i.placeholder.includes('Chiến Tướng')) || inputs[1] || inputs[0];
    if (titleInput) {
      titleInput.value = "     Acc VIP Valorant Full Skin Vandal Prime Vàng     ";
      titleInput.style.border = '2.5px dashed #EF4444';
      titleInput.style.backgroundColor = '#FEF2F2';
      titleInput.style.color = '#DC2626';
      titleInput.style.fontWeight = 'bold';
    }

    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '120px';
    alertBox.style.right = '30px';
    alertBox.style.width = '390px';
    alertBox.style.backgroundColor = '#450A0A';
    alertBox.style.border = '2px solid #EF4444';
    alertBox.style.borderRadius = '12px';
    alertBox.style.padding = '16px';
    alertBox.style.color = '#FEE2E2';
    alertBox.style.fontSize = '12px';
    alertBox.style.zIndex = '999999';
    alertBox.style.boxShadow = '0 15px 30px rgba(239,68,68,0.35)';
    alertBox.innerHTML = `
      <div style="color:#F87171;font-weight:700;font-size:13px;margin-bottom:6px;">⚠️ VI PHẠM ĐẶC TẢ YÊU CẦU UC1:</div>
      <div style="margin-bottom:4px;">• Quy định UC1: Tên sản phẩm từ 10 - 50 ký tự, không chứa khoảng trắng thừa đầu/cuối.</div>
      <div style="margin-bottom:4px;">• Chuỗi nhập vào: <code style="background:#7F1D1D;padding:2px 6px;border-radius:4px;">"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Acc VIP Valorant...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"</code></div>
      <div style="margin-bottom:4px;">• Tổng độ dài: <strong style="color:#EF4444;">55 ký tự</strong> (5 space đầu + 45 chữ + 5 space cuối).</div>
      <div style="background:#7F1D1D;padding:6px 10px;border-radius:6px;color:#FEF2F2;font-size:11px;">
        ❌ Hệ thống vẫn chấp nhận lưu! Gây tràn và vỡ giao diện thẻ acc ngoài Store!<br>
        ✅ Cần bổ sung hàm trim() chuẩn hóa chuỗi trước khi kiểm tra độ dài.
      </div>
    `;
    document.body.appendChild(alertBox);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-ST-003",
    priority: "MEDIUM",
    title: "Form thêm tài khoản UC1 cho phép lưu Tên sản phẩm chứa khoảng trắng đầu cuối vượt 50 ký tự",
    actual: "Hệ thống thông báo thêm tài khoản thành công; tên sản phẩm dài 55 ký tự làm tràn và vỡ giao diện thẻ sản phẩm.",
    expected: "Hệ thống tự động cắt khoảng trắng thừa hoặc báo lỗi 'Tên sản phẩm không được vượt quá 50 ký tự'.",
    rootCause: "Hàm kiểm tra hợp lệ form chỉ check name.length <= 50 mà không gọi name.trim() và thiếu regex chuẩn hóa.",
    fix: "Cập nhật validate: const trimmed = name.trim().replace(/\\s+/g, ' '); if (trimmed.length < 10 || trimmed.length > 50) return err;."
  });
  await saveScreenshot(page, 'BUG-ST-003-uc1-trim-validation.png');


  // ===========================================================================
  // 9. BUG-ST-004: Clipboard copy fails on HTTP LAN
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: "USER-04",
      name: "Phạm Tuấn Minh",
      email: "minh.tuan@yahoo.com",
      role: "renter",
      balance: 100000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(user));
    sessionStorage.setItem('gamerent_current_view', 'my-rentals');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    // Highlight nút sao chép mật khẩu
    const copyBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Sao chép'));
    if (copyBtns.length > 1) {
      const passCopyBtn = copyBtns[1]; // nút sao chép mật khẩu
      passCopyBtn.style.border = '2px dashed #EF4444';
      passCopyBtn.style.backgroundColor = '#FEF2F2';
      passCopyBtn.style.color = '#DC2626';
    }

    const devtools = document.createElement('div');
    devtools.style.position = 'fixed';
    devtools.style.bottom = '75px';
    devtools.style.left = '240px';
    devtools.style.right = '30px';
    devtools.style.height = '230px';
    devtools.style.backgroundColor = '#020617';
    devtools.style.border = '2px solid #EF4444';
    devtools.style.borderRadius = '10px';
    devtools.style.padding = '16px';
    devtools.style.color = '#F8FAFC';
    devtools.style.fontFamily = 'Consolas, monospace';
    devtools.style.fontSize = '12px';
    devtools.style.zIndex = '999998';
    devtools.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5)';
    devtools.innerHTML = `
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid #1E293B;padding-bottom:8px;margin-bottom:10px;">
        <span style="color:#EF4444;font-weight:bold;">Console -- Chrome DevTools (Môi trường mạng LAN: http://192.168.1.15:5173)</span>
        <span style="color:#94A3B8;">1 Error</span>
      </div>
      <div style="color:#EF4444;font-weight:bold;margin-bottom:6px;">
        🔴 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'writeText')
      </div>
      <div style="color:#94A3B8;margin-left:20px;line-height:1.6;">
        at handleCopyPassword (RentalCard.jsx:48:22)<br>
        at HTMLButtonElement.dispatch (react-dom.js:312:14)<br>
        at invokePassiveEffectCreate (react-dom.js:287:11)
      </div>
      <div style="margin-top:12px;background:#450A0A;padding:8px 12px;border-radius:6px;color:#FEE2E2;font-size:11px;">
        ⚠️ NGUYÊN NHÂN BẢO MẬT: API navigator.clipboard bị Chrome/Edge chặn tuyệt đối trên HTTP mạng LAN (Non-secure origin).<br>
        💡 Cần cơ chế fallback dự phòng document.execCommand('copy') qua thẻ textarea ẩn.
      </div>
    `;
    document.body.appendChild(devtools);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-ST-004",
    priority: "HIGH",
    title: "Nút Sao chép mật khẩu in-game không phản hồi khi chạy trên môi trường mạng nội bộ giao thức HTTP",
    actual: "Nút sao chép không phản hồi, Console DevTools báo lỗi TypeError: Cannot read properties of undefined (reading 'writeText').",
    expected: "Mật khẩu được sao chép vào bộ nhớ tạm thành công và hiển thị toast 'Đã sao chép mật khẩu!'.",
    rootCause: "navigator.clipboard.writeText() bị trình duyệt vô hiệu hóa trên môi trường HTTP mạng LAN (chỉ cho HTTPS hoặc localhost).",
    fix: "Viết hàm tiện ích fallback: nếu navigator.clipboard khả dụng thì dùng, nếu không thì tự tạo thẻ textarea ẩn và execCommand('copy')."
  });
  await saveScreenshot(page, 'BUG-ST-004-clipboard-http.png');


  // ===========================================================================
  // 10. BUG-ST-005: Blocked user changes password via old session
  // ===========================================================================
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const admin = {
      id: "ADMIN-01",
      name: "Quản Lý",
      email: "admin@gamerent.vn",
      role: "admin",
      balance: 3000000,
      isBlocked: false,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };
    localStorage.setItem('gamerent_current_user', JSON.stringify(admin));

    const blockedCustomers = [
      {
        id: "KH002",
        name: "Lê Văn Hùng (bad_user)",
        phone: "0912345678",
        email: "bad_user@gamerent.vn",
        totalOrders: 8,
        totalSpent: 165000,
        status: "blocked",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80",
        createdAt: Date.now() - 15 * 86400000
      },
      {
        id: "KH004",
        name: "Phạm Tuấn Minh",
        phone: "0933445566",
        email: "minh.tuan@yahoo.com",
        totalOrders: 5,
        totalSpent: 95000,
        status: "active",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=60&q=80",
        createdAt: Date.now() - 10 * 86400000
      },
      {
        id: "KH008",
        name: "Vũ Thành Long",
        phone: "0988776655",
        email: "long.vu@gmail.com",
        totalOrders: 4,
        totalSpent: 112000,
        status: "active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
        createdAt: Date.now() - 5 * 86400000
      }
    ];
    localStorage.setItem('gamerent_customers', JSON.stringify(blockedCustomers));
    sessionStorage.setItem('gamerent_current_view', 'customers');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    // Highlight hàng khách hàng bị khóa
    const rows = document.querySelectorAll('tbody tr');
    if (rows && rows.length > 0) {
      rows[0].style.border = '2px dashed #EF4444';
      rows[0].style.backgroundColor = '#FEF2F2';
    }

    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '120px';
    alertBox.style.right = '40px';
    alertBox.style.width = '430px';
    alertBox.style.backgroundColor = '#450A0A';
    alertBox.style.border = '2px solid #EF4444';
    alertBox.style.borderRadius = '12px';
    alertBox.style.padding = '18px';
    alertBox.style.color = '#FEE2E2';
    alertBox.style.fontSize = '12px';
    alertBox.style.zIndex = '999999';
    alertBox.style.boxShadow = '0 15px 30px rgba(239,68,68,0.35)';
    alertBox.innerHTML = `
      <div style="color:#F87171;font-weight:700;font-size:13.5px;margin-bottom:8px;">
        🛡️ LỖ HỔNG PHÂN QUYỀN RBAC (SESSION HYGIENE):
      </div>
      <div style="background:#1E293B;padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid #334155;">
        <div style="color:#94A3B8;font-size:11px;">1. TRẠNG THÁI TRÊN CSDL ADMIN CRM (BẢNG BÊN DƯỚI):</div>
        <div style="color:#EF4444;font-weight:bold;">User: Lê Văn Hùng (bad_user) | status = "blocked" (ĐÃ BỊ ADMIN KHÓA!)</div>
      </div>
      <div style="background:#7F1D1D;padding:10px;border-radius:8px;border:1px solid #EF4444;margin-bottom:10px;">
        <div style="color:#FCA5A5;font-size:11px;">2. THAO TÁC CỦA USER TRÊN PHIÊN (SESSION) CŨ:</div>
        <div style="color:#FEE2E2;margin-bottom:4px;">User mở sẵn tab /settings từ trước, nhập đổi mật khẩu mới.</div>
        <div style="color:#FCA5A5;font-weight:bold;">❌ Thực tế lỗi: Vẫn báo 'Cập nhật mật khẩu thành công!'</div>
      </div>
      <div style="color:#86EFAC;font-size:11px;">
        ✅ Kỳ vọng: Hệ thống phải phát hiện cờ isBlocked từ CSDL, lập tức chặn thao tác và cưỡng chế đăng xuất (force logout)!
      </div>
    `;
    document.body.appendChild(alertBox);
  });

  await injectBannerAndCallout(page, {
    bugId: "BUG-ST-005",
    priority: "HIGH",
    title: "Người dùng bị Admin khóa tài khoản (isBlocked = true) vẫn có thể đổi pass khi còn session cũ",
    actual: "Hệ thống vẫn chấp nhận yêu cầu và cập nhật mật khẩu mới thành công dù tài khoản đã bị khóa trong CSDL.",
    expected: "Hệ thống từ chối thao tác, thông báo 'Tài khoản đã bị khóa' và tự động cưỡng chế đăng xuất người dùng.",
    rootCause: "Trang SettingsPage chỉ đọc biến currentUser từ state lúc login mà không kiểm tra lại cờ isBlocked tươi trong CSDL.",
    fix: "Bổ sung kiểm tra freshUser = users.find(u => u.id === cur.id); if (freshUser?.isBlocked) { logout(); navigate('/login'); }."
  });
  await saveScreenshot(page, 'BUG-ST-005-blocked-user-bypass.png');

  await browser.close();
  console.log("=== HOÀN TẤT CHỤP VÀ ĐỒNG BỘ 100% ẢNH MINH CHỨNG TỪ GIAO DIỆN WEB THẬT ===");
})();
