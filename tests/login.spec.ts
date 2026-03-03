import { expect, test } from '@playwright/test'

test.describe('Test Suite #1', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  })

  test('TC1 Login should run successfully', async ({page}) => {
    const usernameTextBox = page.getByRole('textbox', { name: 'username' });
    await usernameTextBox.waitFor({ state: 'visible' })
    await expect(usernameTextBox).toBeVisible()
    await usernameTextBox.fill('standard_user');

    const passwordTextBox = page.getByRole('textbox', { name: 'password' });
    await passwordTextBox.waitFor({ state: 'visible' })
    await expect(passwordTextBox).toBeVisible()
    await passwordTextBox.fill('secret_sauce');

    const loginBtn = page.getByRole('button', { name: 'Login' });
    await loginBtn.waitFor({ state: 'visible' })
    await expect(loginBtn).toBeVisible()
    await loginBtn.click()    

    const hamburgerBtn = page.locator('#react-burger-menu-btn');
    await hamburgerBtn.waitFor({ state: 'visible' })
    await expect(hamburgerBtn).toBeVisible()
    await hamburgerBtn.click()

    const logoutBtn = page.getByTestId('logout-sidebar-link');
    await logoutBtn.click()

    //explicit wait 
    await page.waitForTimeout(10000)  
  })
})