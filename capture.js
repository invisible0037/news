const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const websites = [
  { 
    url: 'https://iranintl.com', 
    filename: 'screenshot1.png',
    fullPage: true
  },
    { 
    url: 'https://bbc.com/persian', 
    filename: 'screenshot2.png',
    fullPage: true
  },
  { 
    url: 'https://t.me/persian_trend_oficial', 
    filename: 'screenshot3.png',
    width: 500,
    height: 3200
  },
];

const screenshotsDir = '.';

async function ensureDir() {
  try {
    await fs.access(screenshotsDir);
  } catch {
    console.log('Root directory exists');
  }
}

async function capture() {
  await ensureDir();
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (let i = 0; i < websites.length; i++) {
    const { url, filename, width = 1280, height = 720, fullPage = false } = websites[i];
    const screenshotPath = path.join(screenshotsDir, filename);
    
    const page = await browser.newPage();
    
    await page.setViewport({ 
      width: width, 
      height: height 
    });
    
    try {
      console.log(`Capturing ${url} -> ${filename}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // گرفتن اسکرین‌شات به صورت JPG با کیفیت 80
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: fullPage,
        type: 'jpeg',        // تعیین نوع فایل
        quality: 80          // کیفیت JPG (1-100)
      });
      
      console.log(`✅ Saved: ${screenshotPath}`);
    } catch (error) {
      console.error(`❌ Failed to capture ${url}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured!');
}

capture().catch(console.error);
