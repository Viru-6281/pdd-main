/**
 * Page Object Model — Home Page (CarAnimation)
 * Route: /  (HashRouter: /#/)
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class HomePage extends BasePage {
  // Locators — mapped to React component elements
  get body()        { return By.tagName('body'); }
  get root()        { return By.id('root'); }
  get anyButton()   { return By.tagName('button'); }
  get anyLink()     { return By.tagName('a'); }
  get animContainer(){ return By.css('[class*="animation"], [class*="Animation"], .lottie, canvas, svg'); }

  async open() {
    await this.navigate('/');
    await this.sleep(3000); // Allow Lottie/animation to load
  }

  async isLoaded() {
    const src = await this.getPageSource();
    // Should contain React root div
    return src.includes('id="root"') || src.includes('root');
  }

  async hasContent() {
    const src = await this.getPageSource();
    return src.length > 500; // Has meaningful content
  }

  async getPageTitle() {
    return await this.getTitle();
  }
}

module.exports = HomePage;
