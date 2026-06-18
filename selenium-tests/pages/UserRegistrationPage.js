/**
 * Page Object Model — User Registration Page
 * Route: /#/userRegister
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class UserRegistrationPage extends BasePage {
  get nameInput()     { return By.css('input[placeholder*="name" i], input[id*="name" i], #name'); }
  get emailInput()    { return By.css('input[type="email"], input[placeholder*="mail" i], #email'); }
  get passwordInput() { return By.css('input[type="password"], #password'); }
  get mobileInput()   { return By.css('input[placeholder*="mobile" i], input[placeholder*="phone" i], input[type="tel"], #mobile'); }
  get addressInput()  { return By.css('input[placeholder*="address" i], textarea[placeholder*="address" i], #address'); }
  get submitButton()  { return By.css('button[type="submit"], button[id*="register" i], button[id*="signup" i]'); }
  get loginLink()     { return By.css('a[href*="Login"], a[href*="login"]'); }
  get pageHeading()   { return By.css('h1, h2, [class*="heading" i]'); }

  async open() {
    await this.navigate('/userRegister');
    await this.sleep(2500);
  }

  async isLoaded() {
    return await this.isPresent(this.emailInput) || await this.isPresent(this.nameInput);
  }

  async fillForm({ name, email, password, mobile, address }) {
    if (name && await this.isPresent(this.nameInput))     await this.type(this.nameInput, name);
    if (email && await this.isPresent(this.emailInput))   await this.type(this.emailInput, email);
    if (password && await this.isPresent(this.passwordInput)) await this.type(this.passwordInput, password);
    if (mobile && await this.isPresent(this.mobileInput)) await this.type(this.mobileInput, mobile);
    if (address && await this.isPresent(this.addressInput)) await this.type(this.addressInput, address);
  }

  async submit() {
    await this.click(this.submitButton);
    await this.sleep(2000);
  }

  async hasRegistrationForm() {
    return await this.isPresent(this.emailInput) || await this.isPresent(this.nameInput);
  }
}

module.exports = UserRegistrationPage;
