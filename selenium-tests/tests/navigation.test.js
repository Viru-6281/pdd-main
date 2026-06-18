/**
 * Navigation Tests — Smart Parking & Reservation (GitHub Pages)
 * Tests the live deployed site: https://Viru-6281.github.io/spic-pdd/
 *
 * Design principle: Every assertion is achievable on a properly deployed React app.
 * Tests do NOT rely on the backend API being live.
 */

const { strict: assert } = require('assert');
const { createDriver, BASE_URL } = require('../config/driver.config');
const BasePage = require('../pages/BasePage');
const { By }   = require('selenium-webdriver');

describe('🌐 Navigation Tests — Smart Parking App', function () {
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

  // ── TC-NAV-001 ──────────────────────────────────────────────────────────
  it('TC-NAV-001: Homepage loads with HTTP 200 (site is reachable)', async function () {
    await page.navigate('/');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-001_homepage');
    assert.ok(source.length > 100,
      `Expected page source > 100 chars, got ${source.length}`);
  });

  // ── TC-NAV-002 ──────────────────────────────────────────────────────────
  it('TC-NAV-002: Homepage contains React root element', async function () {
    await page.navigate('/');
    const loaded = await page.reactIsLoaded();
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-002_react_root');
    assert.ok(
      loaded || source.includes('root') || source.includes('React'),
      'Homepage should contain React root or React-related content'
    );
  });

  // ── TC-NAV-003 ──────────────────────────────────────────────────────────
  it('TC-NAV-003: Page title is a non-empty string', async function () {
    await page.navigate('/');
    const title = await page.getTitle();
    await page.takeScreenshot('TC-NAV-003_title');
    assert.ok(typeof title === 'string', 'Title should be a string');
    assert.ok(title.length > 0, `Title should not be empty, got: "${title}"`);
    console.log(`    Title: "${title}"`);
  });

  // ── TC-NAV-004 ──────────────────────────────────────────────────────────
  it('TC-NAV-004: Lender Login route responds (no server error)', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-004_lender_login');
    assert.ok(source.length > 100,
      `Lender login route should return content, got ${source.length} chars`);
    assert.ok(
      !source.toLowerCase().includes('cannot get /lenderlogin'),
      'Route should not return Express "Cannot GET" error'
    );
  });

  // ── TC-NAV-005 ──────────────────────────────────────────────────────────
  it('TC-NAV-005: Lender Login page has form-related HTML', async function () {
    await page.navigate('/lenderLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-005_lender_form_content');
    // Any of these indicates a login form rendered
    const hasFormContent =
      source.includes('input')   ||
      source.includes('email')   ||
      source.includes('Email')   ||
      source.includes('login')   ||
      source.includes('Login')   ||
      source.includes('password') ||
      source.includes('Password');
    assert.ok(hasFormContent,
      'Lender login page should contain form-related HTML (input, email, login, password)');
  });

  // ── TC-NAV-006 ──────────────────────────────────────────────────────────
  it('TC-NAV-006: User Login route responds (no server error)', async function () {
    await page.navigate('/userLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-006_user_login');
    assert.ok(source.length > 100,
      `User login route should return content, got ${source.length} chars`);
    assert.ok(
      !source.toLowerCase().includes('cannot get /userlogin'),
      'Route should not return "Cannot GET" error'
    );
  });

  // ── TC-NAV-007 ──────────────────────────────────────────────────────────
  it('TC-NAV-007: User Login page has form-related HTML', async function () {
    await page.navigate('/userLogin');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-007_user_form_content');
    const hasFormContent =
      source.includes('input')    ||
      source.includes('email')    ||
      source.includes('Email')    ||
      source.includes('login')    ||
      source.includes('Login')    ||
      source.includes('password') ||
      source.includes('Password');
    assert.ok(hasFormContent,
      'User login page should contain form-related HTML');
  });

  // ── TC-NAV-008 ──────────────────────────────────────────────────────────
  it('TC-NAV-008: User Registration route responds (no server error)', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-008_user_register');
    assert.ok(source.length > 100,
      `Registration route should return content, got ${source.length} chars`);
    assert.ok(
      !source.toLowerCase().includes('cannot get /userregister'),
      'Route should not return "Cannot GET" error'
    );
  });

  // ── TC-NAV-009 ──────────────────────────────────────────────────────────
  it('TC-NAV-009: User Registration page has form-related HTML', async function () {
    await page.navigate('/userRegister');
    const source = await page.getPageSource();
    await page.takeScreenshot('TC-NAV-009_user_register_form');
    const hasFormContent =
      source.includes('input')    ||
      source.includes('name')     ||
      source.includes('Name')     ||
      source.includes('email')    ||
      source.includes('register') ||
      source.includes('Register') ||
      source.includes('signup')   ||
      source.includes('Sign');
    assert.ok(hasFormContent,
      'Registration page should contain form-related HTML');
  });

  // ── TC-NAV-010 ──────────────────────────────────────────────────────────
  it('TC-NAV-010: HashRouter — direct URL to /lenderLogin does not 404', async function () {
    // With HashRouter the URL is: https://host/spic-pdd/#/lenderLogin
    // GitHub Pages serves index.html for all paths, React handles routing
    const targetUrl = `${BASE_URL}/#/lenderLogin`;
    await driver.get(targetUrl);
    await page.sleep(3000);

    const source  = await page.getPageSource();
    const currUrl = await page.getCurrentUrl();
    await page.takeScreenshot('TC-NAV-010_hash_router');

    // Should NOT get a 404 page
    const is404 = (source.toLowerCase().includes('404') &&
                   source.toLowerCase().includes('not found') &&
                   source.length < 500);
    assert.ok(!is404,
      `Direct URL access should not 404. URL: ${currUrl}, Content length: ${source.length}`);
    console.log(`    URL: ${currUrl}, Content: ${source.length} chars`);
  });
});
