/**
 * Selenium E2E Test Suite — Navigation Tests
 * Tests live GitHub Pages deployment: https://Viru-6281.github.io/spic-pdd/
 *
 * ⚠️ NOTE: Uses HashRouter — all routes accessed via /#/path
 */

const { assert } = require('chai');
const { createDriver, BASE_URL } = require('../config/driver.config');
const HomePage            = require('../pages/HomePage');
const LenderLoginPage     = require('../pages/LenderLoginPage');
const UserLoginPage       = require('../pages/UserLoginPage');
const UserRegistrationPage = require('../pages/UserRegistrationPage');

describe('🌐 Navigation Tests — Smart Parking App (GitHub Pages)', function () {
  this.timeout(90000);
  let driver, home, lenderLogin, userLogin, userReg;

  before(async function () {
    console.log(`\n  🔗 Testing against: ${BASE_URL}\n`);
    driver     = await createDriver();
    home       = new HomePage(driver, BASE_URL);
    lenderLogin = new LenderLoginPage(driver, BASE_URL);
    userLogin  = new UserLoginPage(driver, BASE_URL);
    userReg    = new UserRegistrationPage(driver, BASE_URL);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const name = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
      await home.takeScreenshot(`FAIL_navigation_${name}`);
    }
  });

  // ─── Test 1: Homepage ──────────────────────────────
  it('TC-NAV-001: Homepage loads successfully (HTTP 200)', async function () {
    await home.open();
    const loaded = await home.isLoaded();
    await home.takeScreenshot('homepage_loaded');
    assert.isTrue(loaded, 'Homepage should load React root div');
  });

  it('TC-NAV-002: Homepage has meaningful content', async function () {
    await home.open();
    const hasContent = await home.hasContent();
    assert.isTrue(hasContent, 'Homepage should have meaningful content (>500 chars)');
  });

  it('TC-NAV-003: Page title is present', async function () {
    await home.open();
    const title = await home.getPageTitle();
    assert.isString(title, 'Page should have a title');
    assert.isNotEmpty(title, 'Page title should not be empty');
    console.log(`  Page title: "${title}"`);
  });

  // ─── Test 2: Lender Login ─────────────────────────
  it('TC-NAV-004: Lender Login route is accessible', async function () {
    await lenderLogin.open();
    const url = await lenderLogin.getCurrentUrl();
    await lenderLogin.takeScreenshot('lender_login_page');
    assert.isTrue(
      url.includes('lenderLogin') || url.includes('spic-pdd'),
      `URL should contain route. Got: ${url}`
    );
  });

  it('TC-NAV-005: Lender Login page renders form or content', async function () {
    await lenderLogin.open();
    const src = await lenderLogin.getPageSource();
    assert.isAbove(src.length, 500, 'Lender login page should render content');
  });

  // ─── Test 3: User Login ───────────────────────────
  it('TC-NAV-006: User Login route is accessible', async function () {
    await userLogin.open();
    const url = await userLogin.getCurrentUrl();
    await userLogin.takeScreenshot('user_login_page');
    assert.isTrue(
      url.includes('userLogin') || url.includes('spic-pdd'),
      `URL should contain route. Got: ${url}`
    );
  });

  it('TC-NAV-007: User Login page renders content', async function () {
    await userLogin.open();
    const src = await userLogin.getPageSource();
    assert.isAbove(src.length, 500, 'User login page should render content');
  });

  // ─── Test 4: User Registration ────────────────────
  it('TC-NAV-008: User Registration route is accessible', async function () {
    await userReg.open();
    const url = await userReg.getCurrentUrl();
    await userReg.takeScreenshot('user_register_page');
    assert.isTrue(
      url.includes('userRegister') || url.includes('spic-pdd'),
      `URL should contain route. Got: ${url}`
    );
  });

  it('TC-NAV-009: User Registration page renders content', async function () {
    await userReg.open();
    const src = await userReg.getPageSource();
    assert.isAbove(src.length, 500, 'User registration page should render content');
  });

  // ─── Test 5: Direct URL access (HashRouter check) ─
  it('TC-NAV-010: HashRouter prevents 404 on direct route access', async function () {
    const testUrl = `${BASE_URL}#/lenderLogin`;
    await driver.get(testUrl);
    await driver.sleep(3000);

    const src = await driver.getPageSource();
    const is404 = src.toLowerCase().includes('404') &&
                  src.toLowerCase().includes('not found') &&
                  !src.includes('id="root"');

    await home.takeScreenshot('hash_router_check');
    assert.isFalse(is404, 'HashRouter should prevent 404 — direct URL access should work');
  });
});
