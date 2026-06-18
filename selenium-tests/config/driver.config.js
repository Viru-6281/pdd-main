/**
 * Selenium WebDriver Configuration
 * Smart Parking & Reservation System — E2E Tests
 */

require('dotenv').config({ path: '.env' });
const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// ─── Environment Configuration ───────────────────────────────────────
const BASE_URL = process.env.BASE_URL || 'https://Viru-6281.github.io/spic-pdd/';
const HEADLESS  = process.env.HEADLESS !== 'false';
const TIMEOUT   = parseInt(process.env.TIMEOUT || '30000', 10);

/**
 * Create a configured ChromeDriver instance
 * @returns {WebDriver}
 */
async function createDriver() {
  const options = new chrome.Options();

  if (HEADLESS) {
    options.addArguments('--headless=new');
  }

  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--disable-extensions',
    '--disable-setuid-sandbox',
    '--remote-debugging-port=9222',
    '--disable-web-security',
    '--allow-running-insecure-content'
  );

  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: TIMEOUT, pageLoad: 60000 });
  await driver.manage().window().setRect({ width: 1920, height: 1080 });

  return driver;
}

module.exports = { createDriver, BASE_URL, TIMEOUT };
