const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const websites = [
  { 
    url: 'https://iranintl.com', 
    filename: 'screenshot1.jpg',
    fullPage: true
  },
  { 
    url: 'https://bbc.com/persian/', 
    filename: 'screenshot2.jpg',
    fullPage: true
  },
  { 
    url: 'https://t.me/persian_trend_official', 
    filename: 'screenshot3.jpg',
    width: 500,
    height: 3200
  },
  { 
    url: 'https://t.me/pouriazeraati', 
    filename: 'screenshot4.jpg',
    width: 500,
    height: 3200
  },
  { 
    url: 'https://t.me/rodast_omiddana', 
    filename: 'screenshot5.jpg',
    width: 500,
    height: 3200
  },

];

const screenshotsDir = '.';

async function ensureDir() {
  try {
    await fs.access(screenshotsDir);
  } catch {
    await fs.mkdir(screenshotsDir, { recursive: true });
  }
}

async function capture() {
  await ensureDir();
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (let i = 0; i < websites.length; i++) {
    const { url, filename, width = 1280, height = 720, fullPage = false, quality = 90 } = websites[i];
    const screenshotPath = path.join(screenshotsDir, filename);
    
    const page = await browser.newPage();
    
    // تنظیم سایز viewport برای هر سایت
    await page.setViewport({ 
      width: width, 
      height: height 
    });
    
    try {
      console.log(`Capturing ${url} -> ${filename} (${width}x${height})`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
		await page.screenshot({ 
		  path: screenshotPath, 
		  fullPage: false,
		  type: 'jpeg',
		  quality: 90
		});
      console.log(`✅ Saved: ${screenshotPath} (${width}x${height})`);
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
