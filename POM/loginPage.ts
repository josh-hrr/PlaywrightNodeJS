import { Page, Locator, expect } from '@playwright/test'

export class loginPage {
  private page: Page;
  private map: loginPageMap;
  constructor(page: Page) {
    this.page = page;
    this.map = new loginPageMap(page);
  }
  async validLogin(username: string, password: string) {
    await this.map.usernameTextBox.fill(username);
    await this.map.passwordTextBox.fill(password);
    await this.map.submitBtn.click();
    await expect(this.map.hamburgerBtn).toBeVisible();
  } 
  async clickLogoutBtn() {
    await this.map.hamburgerBtn.click();
    await expect(this.map.logoutBtn).toBeVisible();
    await this.map.logoutBtn.click();
  }
}

class loginPageMap {
  public usernameTextBox: Locator;
  public passwordTextBox: Locator;
  public submitBtn: Locator;
  public hamburgerBtn: Locator;
  public logoutBtn: Locator;

  constructor(page: Page) {
    this.usernameTextBox = page.getByRole('textbox', { name: 'username' });
    this.passwordTextBox = page.getByRole('textbox', { name: 'password' });
    this.submitBtn = page.getByRole('button', { name: 'Login' })
    this.hamburgerBtn = page.getByRole('button', { name: 'Open Menu' });
    this.logoutBtn = page.getByTestId('logout-sidebar-link');
  }
}