/**
 * Page Object Model — Lender Login Page
 * Route: /#/lenderLogin
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LenderLoginPage extends BasePage {
  // Locators — using multiple strategies for robustness
  get emailInput()    { return By.css('input[type="email"], input[placeholder*="mail" i], #email, #lenderEmail'); }
  get passwordInput() { return By.css('input[type="password"], #password, #lenderPassword'); }
  get loginButton()   { return By.css('button[type="submit"], button[id*="login" i], button[id*="Login"]'); }
  get loginForm()     { return By.css('form, [class*="form" i], [class*="Form"]'); }
  get registerLink()  { return By.css('a[href*="Register"], a[href*="register"], [class*="register" i]'); }
  get pageHeading()   { return By.css('h1, h2, [class*="heading" i], [class*="title" i]'); }
  get errorMessage()  { return By.css('[class*="error" i], [class*="toast" i], .Toastify, [role="alert"]'); }

  async open() {
    await this.navigate('/lenderLogin');
    await this.sleep(2500);
  }

  async isLoaded() {
    const hasEmail    = await this.isPresent(this.emailInput);
    const hasPassword = await this.isPresent(this.passwordInput);
    return hasEmail || hasPassword;
  }

  async fillEmail(email) {
    await this.type(this.emailInput, email);
  }

  async fillPassword(password) {
    await this.type(this.passwordInput, password);
  }

  async clickLogin() {
    await this.click(this.loginButton);
    await this.sleep(2000);
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getHeadingText() {
    try {
      return await this.getText(this.pageHeading);
    } catch {
      return '';
    }
  }

  async hasLoginForm() {
    return await this.isPresent(this.loginForm) || await this.isPresent(this.emailInput);
  }
}

module.exports = LenderLoginPage;
