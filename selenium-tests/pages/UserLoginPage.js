/**
 * Page Object Model — User Login Page
 * Route: /#/userLogin
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class UserLoginPage extends BasePage {
  get emailInput()    { return By.css('input[type="email"], input[placeholder*="mail" i], #email, #userEmail'); }
  get passwordInput() { return By.css('input[type="password"], #password, #userPassword'); }
  get loginButton()   { return By.css('button[type="submit"], button[id*="login" i]'); }
  get registerLink()  { return By.css('a[href*="Register"], a[href*="register"]'); }
  get pageHeading()   { return By.css('h1, h2, [class*="heading" i], [class*="title" i]'); }
  get forgotPassword(){ return By.css('a[href*="forgot"], [class*="forgot" i]'); }

  async open() {
    await this.navigate('/userLogin');
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

  async hasLoginForm() {
    return await this.isPresent(this.emailInput);
  }
}

module.exports = UserLoginPage;
