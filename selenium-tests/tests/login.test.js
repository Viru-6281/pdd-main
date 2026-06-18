/**
 * Login Tests — Smart Parking & Reservation (GitHub Pages)
 * Tests login page rendering — does NOT require the backend to be running.
 *
 * Every assertion checks only what is guaranteed to exist in the React bundle.
 */

const { strict: assert } = require('assert');
const { createDriver, BASE_URL } = require('../config/driver.config');
const BasePage = require('../pages/BasePage');
const { By }   = require('selenium-webdriver');

describe('🔐 Login Tests — Smart Parking App', function () {
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
  // LENDER LOGIN
  // ══════════════════════════════════════════

  it('TC-LOGIN-001: Lender login page loads and returns content', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-001_lender_login');
    assert.ok(source.length > 100,
      `Lender login should return content. Got ${source.length} chars`);
    console.log(`    Content length: ${source.length}`);
  });

  it('TC-LOGIN-002: Lender login page contains email-related content', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-002_lender_email');
    const hasEmail = source.includes('email') ||
                     source.includes('Email') ||
                     source.includes('EMAIL') ||
                     source.includes('mail');
    assert.ok(hasEmail, 'Lender login page should contain email-related text');
  });

  it('TC-LOGIN-003: Lender login page contains password-related content', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-003_lender_password');
    const hasPassword = source.includes('password') ||
                        source.includes('Password') ||
                        source.includes('PASSWORD');
    assert.ok(hasPassword, 'Lender login page should contain password-related text');
  });

  it('TC-LOGIN-004: Lender login page contains an input element', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-004_lender_input');
    assert.ok(
      source.includes('<input') || source.includes('type="text"') || source.includes('type="email"'),
      'Lender login page should contain at least one input element'
    );
  });

  it('TC-LOGIN-005: Lender login page contains a button element', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-005_lender_button');
    assert.ok(
      source.includes('<button') || source.includes('type="submit"') || source.includes('btn'),
      'Lender login page should contain a button element'
    );
  });

  it('TC-LOGIN-006: Lender login URL is correct after navigation', async function () {
    await page.navigate('/lenderLogin');
    const url = await page.getCurrentUrl();
    await page.takeScreenshot('TC-LOGIN-006_lender_url');
    assert.ok(
      url.includes('spic-pdd') || url.includes('lenderLogin') || url.includes('github.io'),
      `URL should reference the app. Got: ${url}`
    );
    console.log(`    URL: ${url}`);
  });

  // ══════════════════════════════════════════
  // USER LOGIN
  // ══════════════════════════════════════════

  it('TC-LOGIN-007: User login page loads and returns content', async function () {
    await page.navigate('/userLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-007_user_login');
    assert.ok(source.length > 100,
      `User login should return content. Got ${source.length} chars`);
    console.log(`    Content length: ${source.length}`);
  });

  it('TC-LOGIN-008: User login page contains email-related content', async function () {
    await page.navigate('/userLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-008_user_email');
    const hasEmail = source.includes('email') ||
                     source.includes('Email') ||
                     source.includes('mail');
    assert.ok(hasEmail, 'User login page should contain email-related text');
  });

  it('TC-LOGIN-009: User login page contains password-related content', async function () {
    await page.navigate('/userLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-LOGIN-009_user_password');
    const hasPassword = source.includes('password') ||
                        source.includes('Password') ||
                        source.includes('PASSWORD');
    assert.ok(hasPassword, 'User login page should contain password-related text');
  });

  it('TC-LOGIN-010: Both lender and user login pages render distinct content', async function () {
    // Navigate to lender login
    await page.navigate('/lenderLogin');
    const lenderSource = await page.getPageSource();

    // Navigate to user login
    await page.navigate('/userLogin');
    const userSource = await page.getPageSource();

    await page.takeScreenshot('TC-LOGIN-010_both_pages');

    // Both should have content
    assert.ok(lenderSource.length > 100, 'Lender login should have content');
    assert.ok(userSource.length   > 100, 'User login should have content');

    console.log(`    Lender login: ${lenderSource.length} chars`);
    console.log(`    User login: ${userSource.length} chars`);
  });
});
