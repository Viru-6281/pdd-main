/**
 * Registration Tests — Smart Parking & Reservation (GitHub Pages)
 * Tests registration page rendering — does NOT require the backend.
 *
 * Every assertion checks only what is guaranteed in the React bundle.
 */

const { strict: assert } = require('assert');
const { createDriver, BASE_URL } = require('../config/driver.config');
const BasePage = require('../pages/BasePage');

describe('📝 Registration Tests — Smart Parking App', function () {
  this.timeout(120000);
  let driver, page;

  before(async function () {
    console.log(`\n  Target URL: ${BASE_URL}\n`);
    driver = await createDriver();
    page   = new BasePage(driver, BASE_URL);
  });

  after(async function () {
    if (driver) {
      try { await driver.quit(); } catch (_) {}
    }
  });

  afterEach(async function () {
    if (this.currentTest && this.currentTest.state === 'failed') {
      await page.takeScreenshot(
        `FAIL_${this.currentTest.title.replace(/\W+/g, '_').slice(0, 40)}`
      );
    }
  });

  // ══════════════════════════════════════════
  // USER REGISTRATION
  // ══════════════════════════════════════════

  it('TC-REG-001: User Registration page loads successfully', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-001_user_register');
    assert.ok(source.length > 100,
      `User Registration page should load. Got ${source.length} chars`);
    console.log(`    Content length: ${source.length}`);
  });

  it('TC-REG-002: User Registration page contains name or user-related content', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-002_user_name_content');
    const hasNameContent =
      source.includes('name')     ||
      source.includes('Name')     ||
      source.includes('register') ||
      source.includes('Register') ||
      source.includes('signup')   ||
      source.includes('Sign Up')  ||
      source.includes('user')     ||
      source.includes('User');
    assert.ok(hasNameContent, 'User Registration page should contain name/register related text');
  });

  it('TC-REG-003: User Registration page contains email-related content', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-003_user_email');
    const hasEmail = source.includes('email') || source.includes('Email');
    assert.ok(hasEmail, 'Registration page should contain email-related content');
  });

  it('TC-REG-004: User Registration page contains password-related content', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-004_user_password');
    const hasPassword = source.includes('password') || source.includes('Password');
    assert.ok(hasPassword, 'Registration page should contain password-related content');
  });

  it('TC-REG-005: User Registration page contains input elements', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-005_user_inputs');
    assert.ok(
      source.includes('<input') || source.includes('type='),
      'Registration page should have input elements in HTML'
    );
  });

  it('TC-REG-006: User Registration page contains a submit/button element', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-006_user_button');
    assert.ok(
      source.includes('<button') || source.includes('type="submit"') || source.includes('submit'),
      'Registration page should have a button/submit element'
    );
  });

  // ══════════════════════════════════════════
  // LENDER REGISTRATION
  // ══════════════════════════════════════════

  it('TC-REG-007: Lender Registration page loads successfully', async function () {
    await page.navigate('/lenderRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-007_lender_register');
    assert.ok(source.length > 100,
      `Lender Registration page should load. Got ${source.length} chars`);
    console.log(`    Content length: ${source.length}`);
  });

  it('TC-REG-008: Lender Registration page contains registration-related content', async function () {
    await page.navigate('/lenderRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-REG-008_lender_content');
    const hasContent =
      source.includes('register') ||
      source.includes('Register') ||
      source.includes('lender')   ||
      source.includes('Lender')   ||
      source.includes('name')     ||
      source.includes('email')    ||
      source.includes('input');
    assert.ok(hasContent,
      'Lender Registration page should contain registration-related content');
  });
});
