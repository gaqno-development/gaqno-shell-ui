import { Page, expect } from '@playwright/test'

const MENU_SELECTOR = '[role="navigation"], aside, nav, [data-testid="sidebar"]'
const MENU_ITEM_SELECTOR = 'a[href], button, [role="menuitem"], [role="link"]'

export async function waitForMenuToLoad(page: Page, timeout = 10000): Promise<void> {
  try {
    await page.waitForSelector(MENU_SELECTOR, { state: 'visible', timeout })
  } catch {
    const sidebar = page.locator('aside, [role="complementary"]').first()
    await sidebar.waitFor({ state: 'visible', timeout })
  }
  
  await page.waitForTimeout(500)
}

export async function getMenuItems(page: Page): Promise<string[]> {
  await waitForMenuToLoad(page)
  
  const menuItems = await page.evaluate(() => {
    const menuElements = document.querySelectorAll(
      'aside a, aside button, nav a, nav button, [role="navigation"] a, [role="navigation"] button'
    )
    
    const labels: string[] = []
    menuElements.forEach((el) => {
      const text = el.textContent?.trim()
      if (text && text.length > 0 && !labels.includes(text)) {
        labels.push(text)
      }
    })
    
    return labels
  })
  
  return menuItems
}

export async function verifyMenuItems(
  page: Page,
  expectedItems: string[]
): Promise<void> {
  await waitForMenuToLoad(page)
  
  const actualItems = await getMenuItems(page)
  
  for (const expectedItem of expectedItems) {
    const found = actualItems.some(
      (actual) =>
        actual.toLowerCase().includes(expectedItem.toLowerCase()) ||
        expectedItem.toLowerCase().includes(actual.toLowerCase())
    )
    
    if (!found) {
      throw new Error(
        `Menu item "${expectedItem}" not found. Available items: ${actualItems.join(', ')}`
      )
    }
  }
}

export async function clickMenuItem(page: Page, itemLabel: string): Promise<void> {
  await waitForMenuToLoad(page)
  
  const menuItem = page
    .locator('a, button')
    .filter({ hasText: new RegExp(itemLabel, 'i') })
    .first()
  
  await expect(menuItem).toBeVisible({ timeout: 5000 })
  await menuItem.click()
  await page.waitForTimeout(1000)
}

export async function isMenuVisible(page: Page): Promise<boolean> {
  try {
    const menu = page.locator(MENU_SELECTOR).first()
    await menu.waitFor({ state: 'visible', timeout: 2000 })
    return true
  } catch {
    return false
  }
}

export async function verifyMenuAppearsImmediately(page: Page): Promise<boolean> {
  const startTime = Date.now()
  const isVisible = await isMenuVisible(page)
  const loadTime = Date.now() - startTime
  
  return isVisible && loadTime < 1000
}

export async function getMenuItemsCount(page: Page): Promise<number> {
  const items = await getMenuItems(page)
  return items.length
}

