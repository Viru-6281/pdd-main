/**
 * Selenium WebDriver Configuration
 * Smart Parking & Reservation System — E2E Tests
 *
 * Uses system Chrome (no chromedriver npm package needed).
 * Reads configuration from environment variables.
 */

const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// ── Configuration ──────────────────────────────────────────────────────────
const BASE_URL  = process.env.BASE_URL  || 'https://Viru-6281.github.io/spic-pdd/';
const HEADLESS  = process.env.HEADLESS  !== 'false';          // default: true
const TIMEOUT   = parseInt(process.env.TIMEOUT || '30000', 10);

/**
 * Create a configured Chrome WebDriver instance.
 * Works with both google-chrome and chromium-browser on Linux CI.
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
    '--disable-web-security',
    '--allow-running-insecure-content',
    '--ignore-certificate-errors',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-translate',
    '--metrics-recording-only',
    '--safebrowsing-disable-auto-update'
  );

  // Allow specifying alternate Chrome binary (e.g., chromium)
  if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
  }

  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit:  5000,
    pageLoad:  45000,
    script:    10000
  });

  return driver;
}

module.exports = { createDriver, BASE_URL, TIMEOUT, HEADLESS };
