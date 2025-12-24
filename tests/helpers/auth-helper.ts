import { Page, expect } from '@playwright/test'

const emailInput = (page: Page) => page.getByPlaceholder('seu@email.com')
const passwordInput = (page: Page) => page.getByPlaceholder('••••••••')
const submitButton = (page: Page) => page.getByRole('button', { name: /Entrar|Entrando.../ })

export async function loginAsUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  try {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 10000 })
  } catch {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 10000 })
  }
  
  await emailInput(page).fill(email)
  await passwordInput(page).fill(password)
  
  const navigationPromise = page.waitForURL('**/dashboard', { timeout: 20000 })
  await submitButton(page).click()
  
  try {
    await navigationPromise
  } catch (error) {
    await page.waitForTimeout(3000)
    const currentUrl = page.url()
    if (!currentUrl.includes('/dashboard')) {
      const errorText = await page.locator('text=/erro|error|invalid/i').first().textContent().catch(() => '')
      throw new Error(`Login failed. Current URL: ${currentUrl}. Error: ${errorText}`)
    }
  }
  
  await page.waitForTimeout(1000)
}

export async function loginAsSuperAdmin(page: Page): Promise<void> {
  await loginAsUser(page, 'admin@example.com', 'Admin@123456')
}

export async function logout(page: Page): Promise<void> {
  const logoutButton = page.locator('button, a').filter({ hasText: /Sair|Logout|Sign out/i }).first()
  
  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click()
    await page.waitForURL('**/login', { timeout: 5000 })
  } else {
    await page.goto('/login')
  }
  
  await page.waitForTimeout(500)
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  const currentUrl = page.url()
  
  if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
    return false
  }
  
  try {
    const dashboardElement = page.locator('text=/dashboard|Dashboard/i').first()
    await dashboardElement.waitFor({ state: 'visible', timeout: 2000 })
    return true
  } catch {
    return false
  }
}

