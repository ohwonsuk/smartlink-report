const functions = require("firebase-functions");
const admin = require("firebase-admin");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

admin.initializeApp();

exports.generatePDF = functions
  .runWith({
    memory: "2GB",
    timeoutSeconds: 120,
  })
  .region("asia-northeast3")
  .https.onRequest(async (req, res) => {
    // CORS 처리
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    const { url, cookies } = req.body;

    if (!url) {
      res.status(400).send("Missing URL parameter");
      return;
    }

    let browser = null;
    try {
      console.log(`Starting PDF generation for URL: ${url}`);
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });

      const page = await browser.newPage();
      
      // 쿠키 전달 (인증 유지용)
      if (cookies && Array.isArray(cookies)) {
        await page.setCookie(...cookies);
      }

      // 화면 크기 및 고해상도 설정
      await page.setViewport({ 
        width: 1200, 
        height: 800, 
        deviceScaleFactor: 2 
      });

      // 리포트 페이지로 이동
      await page.goto(url, { 
        waitUntil: "networkidle0", 
        timeout: 60000 
      });
      
      // 애니메이션 대기 등 추가 처리 (필요시)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // PDF 생성 (웹과 동일한 렌더링 유지)
      const pdf = await page.pdf({
        format: "a4",
        landscape: true,
        printBackground: true,
        margin: { 
          top: "10mm", 
          right: "10mm", 
          bottom: "10mm", 
          left: "10mm" 
        }
      });

      console.log("PDF generation successful. Buffer size:", pdf.length);
      
      res.status(200);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
        "Cache-Control": "no-cache",
      });
      res.end(pdf);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).send(error.toString());
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });
