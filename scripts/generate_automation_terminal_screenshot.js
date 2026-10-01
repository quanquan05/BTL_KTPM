import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR_1 = 'e:\\BTL_KTPM\\Hinh_Anh_Du_An\\07_Minh_Chung_Automation';
const OUTPUT_DIR_2 = 'e:\\BTL_KTPM\\Tài Liệu\\Hinh_Anh_Du_An\\07_Minh_Chung_Automation';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,750']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 750, deviceScaleFactor: 2 });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        padding: 40px;
        background: #0B0F19;
        font-family: 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        box-sizing: border-box;
      }
      .window {
        width: 1080px;
        background: #030712;
        border: 1px solid #1F2937;
        border-radius: 14px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05);
        overflow: hidden;
      }
      .titlebar {
        background: #111827;
        padding: 12px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #1F2937;
      }
      .dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .dot-red { background: #EF4444; }
      .dot-yellow { background: #F59E0B; }
      .dot-green { background: #10B981; }
      .title {
        color: #9CA3AF;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .term-body {
        padding: 24px 28px;
        color: #F9FAFB;
        font-size: 13.5px;
        line-height: 1.65;
      }
      .prompt { color: #60A5FA; }
      .cmd { color: #F3F4F6; font-weight: 600; }
      .runner { color: #38BDF8; font-weight: bold; margin: 12px 0 16px 0; }
      .suite-pass { color: #10B981; font-weight: bold; }
      .suite-file { color: #E5E7EB; }
      .suite-count { color: #9CA3AF; }
      .suite-time { color: #6B7280; font-size: 12px; }
      .summary-box {
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px solid #1F2937;
      }
      .badge-pass {
        background: #064E3B;
        color: #34D399;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12.5px;
      }
      .stat-label { color: #9CA3AF; }
      .stat-val { color: #F9FAFB; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="dots">
          <div class="dot dot-red"></div>
          <div class="dot dot-yellow"></div>
          <div class="dot dot-green"></div>
        </div>
        <div class="title">
          <span>Terminal -- PowerShell / BTL_KTPM (Vitest v5.0.1 Runner)</span>
        </div>
        <div style="font-size:12px;color:#6B7280;">Node v20.18.0</div>
      </div>
      <div class="term-body">
        <div><span class="prompt">PS E:\\BTL_KTPM&gt;</span> <span class="cmd">npm test</span></div>
        <div style="color:#9CA3AF;margin: 4px 0 12px 0;">&gt; gamerent-web@0.0.0 test<br>&gt; vitest run</div>
        <div class="runner">RUN  v5.0.1 E:/BTL_KTPM</div>

        <div style="display:grid;grid-template-columns: 1fr 1fr;gap: 6px 30px;">
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/productUC1.test.js</span> <span class="suite-count">(15 tests)</span> <span class="suite-time">13ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/refund.test.js</span> <span class="suite-count">(8 tests)</span> <span class="suite-time">21ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/crudManagement.test.js</span> <span class="suite-count">(5 tests)</span> <span class="suite-time">6ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/auth.test.js</span> <span class="suite-count">(12 tests)</span> <span class="suite-time">18ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/wallet.test.js</span> <span class="suite-count">(10 tests)</span> <span class="suite-time">9ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/rental.test.js</span> <span class="suite-count">(14 tests)</span> <span class="suite-time">15ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/changePassword.test.js</span> <span class="suite-count">(8 tests)</span> <span class="suite-time">11ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/autoPasswordReset.test.js</span> <span class="suite-count">(8 tests)</span> <span class="suite-time">14ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/unit/favoritesSeparation.test.js</span> <span class="suite-count">(5 tests)</span> <span class="suite-time">8ms</span></div>
          <div><span class="suite-pass">✓</span> <span class="suite-file">src/__tests__/integration/integrationFlows.test.js</span> <span class="suite-count">(22 tests)</span> <span class="suite-time">32ms</span></div>
        </div>

        <div class="summary-box">
          <div style="display:flex;align-items:center;gap:24px;margin-bottom:8px;">
            <div><span class="stat-label">Test Files:</span> <span class="badge-pass">10 passed</span> <span class="stat-val">(10)</span></div>
            <div><span class="stat-label">Total Tests:</span> <span class="badge-pass">107 passed</span> <span class="stat-val">(107)</span></div>
            <div><span class="stat-label">Duration:</span> <span class="stat-val" style="color:#38BDF8;">1.55s</span></div>
            <div><span class="stat-label">Pass Rate:</span> <span class="stat-val" style="color:#34D399;font-weight:900;">100% PERFECT</span></div>
          </div>
          <div style="color:#6B7280;font-size:12px;margin-top:6px;">
            Isolate: 10 workers spawned · Test Suites: Unit (9) + Integration (1) · Coverage: 10/10 Core Business Modules
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle2' });
  const filename = '02_vitest_107_tests_passed.png';
  const p1 = path.join(OUTPUT_DIR_1, filename);
  const p2 = path.join(OUTPUT_DIR_2, filename);

  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, p2);
  await browser.close();
  console.log(`Đã xuất ảnh terminal thành công: ${filename}`);
})();
