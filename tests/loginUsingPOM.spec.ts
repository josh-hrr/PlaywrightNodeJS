import { test, expect } from '@playwright/test'
import { loginPage } from '../POM/loginPage'


test.describe('Test Suite #2 using POM', () => {

  test.beforeEach( async ({page}) => {
    await page.goto('/')
  })

  test('TC1 Login and logout should be successful', async ({page}) => {
    const myLoginPage = new loginPage(page)
    await myLoginPage.validLogin('standard_user', 'secret_sauce');
    await myLoginPage.clickLogoutBtn();
  })
})