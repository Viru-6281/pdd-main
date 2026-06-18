/**
 * Page Object Model — Base Page
 * Smart Parking & Reservation System
 */

const { By, until, Key } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

class BasePage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.screenshotDir = process.env.SCREENSHOT_DIR
      || path.join(__dirname, '../../Test Results/Screenshots');

    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async navigate(path = '') {
    const url = this.baseUrl + '#' + path;
    await this.driver.get(url);
    await this.driver.sleep(2000); // Let React render
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async findElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  async click(locator) {
    const el = await this.findElement(locator);
    await this.driver.wait(until.elementIsVisible(el), 5000);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.findElement(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await this.findElement(locator);
    return await el.getText();
  }

  async isVisible(locator) {
    try {
      const el = await this.findElement(locator, 5000);
      return await el.isDisplayed();
    } catch {
      return false;
    }
  }

  async isPresent(locator) {
    const els = await this.driver.findElements(locator);
    return els.length > 0;
  }

  async waitForUrl(pattern, timeout = 15000) {
    await this.driver.wait(async () => {
      const url = await this.driver.getCurrentUrl();
      return url.includes(pattern);
    }, timeout, `URL did not contain "${pattern}" within ${timeout}ms`);
  }

  async waitForVisible(locator, timeout = 10000) {
    const el = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  async takeScreenshot(name) {
    try {
      const screenshot = await this.driver.takeScreenshot();
      const filename = `${name}_${Date.now()}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`  📸 Screenshot: ${filepath}`);
      return filepath;
    } catch (err) {
      console.warn(`  ⚠️ Screenshot failed: ${err.message}`);
    }
  }

  async getPageSource() {
    return await this.driver.getPageSource();
  }

  async sleep(ms) {
    await this.driver.sleep(ms);
  }
}

module.exports = BasePage;
