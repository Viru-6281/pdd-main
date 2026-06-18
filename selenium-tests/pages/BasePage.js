/**
 * Base Page Object — Smart Parking & Reservation
 * All page objects extend this class.
 */

const { By, until } = require('selenium-webdriver');
const fs   = require('fs');
const path = require('path');

class BasePage {
  constructor(driver, baseUrl) {
    this.driver  = driver;
    this.baseUrl = baseUrl.replace(/\/$/, '');  // strip trailing slash
    this.screenshotDir = process.env.SCREENSHOT_DIR
      || path.join(__dirname, '../../Test Results/Screenshots');

    try {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    } catch (_) { /* ignore */ }
  }

  /** Navigate to hash route: /#/routePath */
  async navigate(routePath) {
    const url = `${this.baseUrl}/#${routePath}`;
    await this.driver.get(url);
    await this.sleep(2500);
  }

  async getPageSource()  { return await this.driver.getPageSource(); }
  async getTitle()       { return await this.driver.getTitle(); }
  async getCurrentUrl()  { return await this.driver.getCurrentUrl(); }

  async isPresent(locator) {
    try {
      const els = await this.driver.findElements(locator);
      return els.length > 0;
    } catch (_) { return false; }
  }

  async isVisible(locator) {
    try {
      const el  = await this.driver.findElement(locator);
      return await el.isDisplayed();
    } catch (_) { return false; }
  }

  async getAttr(locator, attr) {
    try {
      const el = await this.driver.findElement(locator);
      return await el.getAttribute(attr);
    } catch (_) { return null; }
  }

  async getText(locator) {
    try {
      const el = await this.driver.findElement(locator);
      return await el.getText();
    } catch (_) { return ''; }
  }

  async typeIn(locator, text) {
    try {
      const el = await this.driver.findElement(locator);
      await el.clear();
      await el.sendKeys(text);
      return true;
    } catch (_) { return false; }
  }

  async clickEl(locator) {
    try {
      const el = await this.driver.findElement(locator);
      await el.click();
      return true;
    } catch (_) { return false; }
  }

  async sleep(ms) { await this.driver.sleep(ms); }

  /** Returns true if page source is longer than minLength chars */
  async hasContent(minLength = 500) {
    const src = await this.getPageSource();
    return src.length > minLength;
  }

  /** Returns true if the React root div is present in the source */
  async reactIsLoaded() {
    const src = await this.getPageSource();
    return src.includes('id="root"') || src.includes("id='root'");
  }

  async takeScreenshot(name) {
    try {
      const data = await this.driver.takeScreenshot();
      const file = path.join(this.screenshotDir, `${name}_${Date.now()}.png`);
      fs.writeFileSync(file, data, 'base64');
      console.log(`    📸 Screenshot: ${path.basename(file)}`);
    } catch (_) { /* screenshots are nice-to-have */ }
  }
}

module.exports = BasePage;
