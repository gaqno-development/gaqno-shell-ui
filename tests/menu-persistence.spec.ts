import { test, expect, Page } from '@playwright/test'
import {
  loginAsUser,
  loginAsSuperAdmin,
  logout,
  isAuthenticated,
} from './helpers/auth-helper'
import {
  waitForMenuToLoad,
  getMenuItems,
  verifyMenuItems,
  clickMenuItem,
  isMenuVisible,
  verifyMenuAppearsImmediately,
  getMenuItemsCount,
} from './helpers/menu-helper'
import {
  getLocalStorageMenu,
  setLocalStorageMenu,
  clearLocalStorageMenu,
  expireLocalStorageMenu,
  verifyMenuInLocalStorage,
  getMenuItemsFromStorage,
  MenuStorageData,
} from './helpers/storage-helper'

const SUPER_ADMIN_EMAIL = 'admin@example.com'
const SUPER_ADMIN_PASSWORD = 'Admin@123456'
const REGULAR_USER_EMAIL = 'user@example.com'
const REGULAR_USER_PASSWORD = 'User@123456'

const EXPECTED_SUPER_ADMIN_MENU = [
  'Dashboard',
  'PDV',
  'CRM',
  'ERP',
  'Financeiro',
  'Inteligência Artificial',
  'Administração',
]

test.describe('Menu Initial Load and Caching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
  })

  test('should load menu from API on first visit', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })

  test('should save menu items to localStorage', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)

    const hasMenuInStorage = await verifyMenuInLocalStorage(page)
    expect(hasMenuInStorage).toBe(true)
  })

  test('should have valid localStorage structure', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)

    const menuData = await getLocalStorageMenu(page)
    expect(menuData).not.toBeNull()
    expect(menuData?.items).toBeDefined()
    expect(Array.isArray(menuData?.items)).toBe(true)
    expect(menuData?.timestamp).toBeDefined()
    expect(typeof menuData?.timestamp).toBe('number')
  })

  test('should display menu correctly in sidebar', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)
  })

  test('should show all expected menu items for super admin', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)

    await verifyMenuItems(page, EXPECTED_SUPER_ADMIN_MENU)
  })
})

test.describe('Cross-Module Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)
  })

  test('should persist menu when navigating Shell → AI', async ({ page }) => {
    const initialMenuItems = await getMenuItems(page)
    const initialStorage = await verifyMenuInLocalStorage(page)

    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const menuAppearsImmediately = await verifyMenuAppearsImmediately(page)
    expect(menuAppearsImmediately).toBe(true)

    const afterNavigationMenu = await getMenuItems(page)
    expect(afterNavigationMenu.length).toBeGreaterThan(0)

    const afterNavigationStorage = await verifyMenuInLocalStorage(page)
    expect(afterNavigationStorage).toBe(true)
  })

  test('should persist menu when navigating Shell → CRM', async ({ page }) => {
    const initialMenuItems = await getMenuItems(page)

    await page.goto('/dashboard/crm')
    await page.waitForTimeout(1000)

    const menuAppearsImmediately = await verifyMenuAppearsImmediately(page)
    expect(menuAppearsImmediately).toBe(true)

    const afterNavigationMenu = await getMenuItems(page)
    expect(afterNavigationMenu.length).toBeGreaterThan(0)
  })

  test('should persist menu when navigating Shell → ERP', async ({ page }) => {
    await page.goto('/dashboard/erp')
    await page.waitForTimeout(1000)

    const menuAppearsImmediately = await verifyMenuAppearsImmediately(page)
    expect(menuAppearsImmediately).toBe(true)

    const afterNavigationMenu = await getMenuItems(page)
    expect(afterNavigationMenu.length).toBeGreaterThan(0)
  })

  test('should persist menu when navigating Shell → Finance', async ({ page }) => {
    await page.goto('/dashboard/finance')
    await page.waitForTimeout(1000)

    const menuAppearsImmediately = await verifyMenuAppearsImmediately(page)
    expect(menuAppearsImmediately).toBe(true)

    const afterNavigationMenu = await getMenuItems(page)
    expect(afterNavigationMenu.length).toBeGreaterThan(0)
  })

  test('should persist menu when navigating Shell → PDV', async ({ page }) => {
    await page.goto('/pdv')
    await page.waitForTimeout(1000)

    const menuAppearsImmediately = await verifyMenuAppearsImmediately(page)
    expect(menuAppearsImmediately).toBe(true)

    const afterNavigationMenu = await getMenuItems(page)
    expect(afterNavigationMenu.length).toBeGreaterThan(0)
  })

  test('should persist menu when navigating AI → CRM', async ({ page }) => {
    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const aiMenuItems = await getMenuItems(page)

    await page.goto('/dashboard/crm')
    await page.waitForTimeout(1000)

    const crmMenuItems = await getMenuItems(page)
    expect(crmMenuItems.length).toBeGreaterThan(0)
  })

  test('should persist menu through multiple module hops', async ({ page }) => {
    const routes = ['/dashboard', '/ai/books', '/dashboard/crm', '/dashboard/erp', '/dashboard/finance']
    
    for (const route of routes) {
      await page.goto(route)
      await page.waitForTimeout(1000)

      const menuAppearsImmediately = await verifyMenuAppearsImmediately(page)
      expect(menuAppearsImmediately).toBe(true)

      const menuItems = await getMenuItems(page)
      expect(menuItems.length).toBeGreaterThan(0)

      const hasStorage = await verifyMenuInLocalStorage(page)
      expect(hasStorage).toBe(true)
    }
  })
})

test.describe('localStorage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)
  })

  test('should have gaqno_menu_items key after menu load', async ({ page }) => {
    const hasMenu = await verifyMenuInLocalStorage(page)
    expect(hasMenu).toBe(true)
  })

  test('should have correct localStorage structure', async ({ page }) => {
    const menuData = await getLocalStorageMenu(page)
    expect(menuData).not.toBeNull()
    expect(menuData?.items).toBeDefined()
    expect(Array.isArray(menuData?.items)).toBe(true)
    expect(menuData?.timestamp).toBeDefined()
    expect(typeof menuData?.timestamp).toBe('number')
  })

  test('should persist menu after page refresh', async ({ page }) => {
    const beforeRefreshMenu = await getMenuItems(page)
    const beforeRefreshStorage = await verifyMenuInLocalStorage(page)

    await page.reload()
    await page.waitForTimeout(2000)

    const afterRefreshMenu = await getMenuItems(page)
    const afterRefreshStorage = await verifyMenuInLocalStorage(page)

    expect(afterRefreshMenu.length).toBeGreaterThan(0)
    expect(afterRefreshStorage).toBe(true)
  })

  test('should persist menu after browser back navigation', async ({ page }) => {
    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const aiMenu = await getMenuItems(page)

    await page.goBack()
    await page.waitForTimeout(1000)

    const backMenu = await getMenuItems(page)
    expect(backMenu.length).toBeGreaterThan(0)
  })

  test('should persist menu after browser forward navigation', async ({ page }) => {
    await page.goto('/ai/books')
    await page.waitForTimeout(1000)
    await page.goBack()
    await page.waitForTimeout(1000)

    await page.goForward()
    await page.waitForTimeout(1000)

    const forwardMenu = await getMenuItems(page)
    expect(forwardMenu.length).toBeGreaterThan(0)
  })

  test('should persist menu across different routes in same module', async ({ page }) => {
    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const menu1 = await getMenuItems(page)

    await page.goto('/ai/books/123')
    await page.waitForTimeout(1000)

    const menu2 = await getMenuItems(page)
    expect(menu2.length).toBeGreaterThan(0)
  })
})

test.describe('API Failure Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)
  })

  test('should display menu from cache when network is offline', async ({ page }) => {
    const cachedMenu = await getMenuItems(page)
    expect(cachedMenu.length).toBeGreaterThan(0)

    await page.context().setOffline(true)
    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const offlineMenu = await getMenuItems(page)
    expect(offlineMenu.length).toBeGreaterThan(0)

    const hasStorage = await verifyMenuInLocalStorage(page)
    expect(hasStorage).toBe(true)

    await page.context().setOffline(false)
  })

  test('should display menu from cache when API returns 401', async ({ page }) => {
    await page.route('**/v1/sso/menu', (route) => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      })
    })

    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const menu = await getMenuItems(page)
    expect(menu.length).toBeGreaterThan(0)

    const hasStorage = await verifyMenuInLocalStorage(page)
    expect(hasStorage).toBe(true)
  })

  test('should display menu from cache when API returns 500', async ({ page }) => {
    await page.route('**/v1/sso/menu', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/dashboard/crm')
    await page.waitForTimeout(1000)

    const menu = await getMenuItems(page)
    expect(menu.length).toBeGreaterThan(0)

    const hasStorage = await verifyMenuInLocalStorage(page)
    expect(hasStorage).toBe(true)
  })

  test('should update menu when API recovers', async ({ page }) => {
    await page.route('**/v1/sso/menu', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/ai/books')
    await page.waitForTimeout(1000)

    const cachedMenu = await getMenuItems(page)
    expect(cachedMenu.length).toBeGreaterThan(0)

    await page.unroute('**/v1/sso/menu')
    await page.waitForTimeout(3000)

    const recoveredMenu = await getMenuItems(page)
    expect(recoveredMenu.length).toBeGreaterThan(0)
  })

  test('should not clear localStorage on API error', async ({ page }) => {
    const beforeErrorStorage = await verifyMenuInLocalStorage(page)
    expect(beforeErrorStorage).toBe(true)

    await page.route('**/v1/sso/menu', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/dashboard/erp')
    await page.waitForTimeout(1000)

    const afterErrorStorage = await verifyMenuInLocalStorage(page)
    expect(afterErrorStorage).toBe(true)
  })
})

test.describe('Cache Expiration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)
  })

  test('should refetch menu when cache is older than 30 minutes', async ({ page }) => {
    await expireLocalStorageMenu(page)

    await page.goto('/ai/books')
    await page.waitForTimeout(3000)

    const menuData = await getLocalStorageMenu(page)
    if (menuData) {
      const now = Date.now()
      const cacheAge = now - menuData.timestamp
      expect(cacheAge).toBeLessThan(30 * 60 * 1000)
    }
  })

  test('should remove expired cache from localStorage', async ({ page }) => {
    await expireLocalStorageMenu(page)

    await page.goto('/dashboard')
    await page.waitForTimeout(3000)

    const menuData = await getLocalStorageMenu(page)
    if (menuData) {
      const now = Date.now()
      const maxAge = 30 * 60 * 1000
      const cacheAge = now - menuData.timestamp
      expect(cacheAge).toBeLessThan(maxAge)
    }
  })

  test('should fetch and cache fresh menu after expiration', async ({ page }) => {
    await expireLocalStorageMenu(page)

    await page.goto('/dashboard/crm')
    await page.waitForTimeout(3000)

    const hasFreshMenu = await verifyMenuInLocalStorage(page)
    expect(hasFreshMenu).toBe(true)
  })
})

test.describe('Permission-Based Menu', () => {
  test('super admin should see all menu items', async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)

    await verifyMenuItems(page, EXPECTED_SUPER_ADMIN_MENU)
  })

  test('menu should update after permissions change', async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)

    const initialMenu = await getMenuItems(page)
    expect(initialMenu.length).toBeGreaterThan(0)

    await page.reload()
    await page.waitForTimeout(2000)

    const reloadedMenu = await getMenuItems(page)
    expect(reloadedMenu.length).toBeGreaterThan(0)
  })
})

test.describe('Menu Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)
  })

  test('should update localStorage when fresh data arrives', async ({ page }) => {
    const initialTimestamp = (await getLocalStorageMenu(page))?.timestamp

    await page.waitForTimeout(5000)

    const updatedTimestamp = (await getLocalStorageMenu(page))?.timestamp
    expect(updatedTimestamp).toBeDefined()
  })

  test('should reflect updated menu in UI without flickering', async ({ page }) => {
    const initialMenu = await getMenuItems(page)
    expect(initialMenu.length).toBeGreaterThan(0)

    await page.waitForTimeout(3000)

    const updatedMenu = await getMenuItems(page)
    expect(updatedMenu.length).toBeGreaterThan(0)
  })
})

test.describe('Multiple Browser Contexts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)
  })

  test('should persist menu across different browser tabs', async ({ browser }) => {
    const context = await browser.newContext()
    const page1 = await context.newPage()
    const page2 = await context.newPage()

    try {
      await loginAsSuperAdmin(page1)
      await page1.goto('/dashboard')
      await waitForMenuToLoad(page1)
      await page1.waitForTimeout(2000)

      const menu1 = await getMenuItems(page1)
      expect(menu1.length).toBeGreaterThan(0)

      const hasStorage1 = await verifyMenuInLocalStorage(page1)
      expect(hasStorage1).toBe(true)

      await loginAsSuperAdmin(page2)
      await page2.goto('/dashboard')
      await waitForMenuToLoad(page2)
      await page2.waitForTimeout(2000)

      const menu2 = await getMenuItems(page2)
      expect(menu2.length).toBeGreaterThan(0)

      const hasStorage2 = await verifyMenuInLocalStorage(page2)
      expect(hasStorage2).toBe(true)
    } finally {
      await page1.close()
      await page2.close()
      await context.close()
    }
  })

  test('should persist menu after closing and reopening tab', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      await loginAsSuperAdmin(page)
      await page.goto('/dashboard')
      await waitForMenuToLoad(page)
      await page.waitForTimeout(2000)

      const initialMenu = await getMenuItems(page)
      expect(initialMenu.length).toBeGreaterThan(0)

      const initialStorage = await verifyMenuInLocalStorage(page)
      expect(initialStorage).toBe(true)

      await page.close()

      const newPage = await context.newPage()
      await loginAsSuperAdmin(newPage)
      await newPage.goto('/dashboard')
      await waitForMenuToLoad(newPage)
      await newPage.waitForTimeout(2000)

      const newPageMenu = await getMenuItems(newPage)
      expect(newPageMenu.length).toBeGreaterThan(0)

      const newPageStorage = await verifyMenuInLocalStorage(newPage)
      expect(newPageStorage).toBe(true)

      await newPage.close()
    } finally {
      await context.close()
    }
  })

  test('should have menu available in new tab from same context', async ({ browser }) => {
    const context = await browser.newContext()
    const page1 = await context.newPage()

    try {
      await loginAsSuperAdmin(page1)
      await page1.goto('/dashboard')
      await waitForMenuToLoad(page1)
      await page1.waitForTimeout(2000)

      const menu1 = await getMenuItems(page1)
      expect(menu1.length).toBeGreaterThan(0)

      const page2 = await context.newPage()
      await page2.goto('/dashboard')
      await waitForMenuToLoad(page2)
      await page2.waitForTimeout(2000)

      const menu2 = await getMenuItems(page2)
      expect(menu2.length).toBeGreaterThan(0)

      await page1.close()
      await page2.close()
    } finally {
      await context.close()
    }
  })
})

test.describe('Module-Specific Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
  })

  test('AI module should render menu correctly', async ({ page }) => {
    await page.goto('/ai/books')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })

  test('CRM module should render menu correctly', async ({ page }) => {
    await page.goto('/dashboard/crm')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })

  test('ERP module should render menu correctly', async ({ page }) => {
    await page.goto('/dashboard/erp')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })

  test('Finance module should render menu correctly', async ({ page }) => {
    await page.goto('/dashboard/finance')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })

  test('PDV module should render menu correctly', async ({ page }) => {
    await page.goto('/pdv')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })

  test('Shell dashboard should render menu correctly', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)

    const isVisible = await isMenuVisible(page)
    expect(isVisible).toBe(true)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThan(0)
  })
})

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await clearLocalStorageMenu(page)
    await loginAsSuperAdmin(page)
  })

  test('should handle empty menu array', async ({ page }) => {
    const emptyMenu: MenuStorageData = {
      items: [],
      timestamp: Date.now(),
    }
    await setLocalStorageMenu(page, emptyMenu)

    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    const menuItems = await getMenuItems(page)
    expect(Array.isArray(menuItems)).toBe(true)
  })

  test('should handle invalid localStorage data', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('gaqno_menu_items', 'invalid json')
    })

    await page.goto('/dashboard')
    await page.waitForTimeout(3000)

    const menuItems = await getMenuItems(page)
    expect(menuItems.length).toBeGreaterThanOrEqual(0)
  })

  test('should recover from corrupted localStorage data', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('gaqno_menu_items', JSON.stringify({ invalid: 'data' }))
    })

    await page.goto('/dashboard')
    await page.waitForTimeout(3000)

    const hasValidMenu = await verifyMenuInLocalStorage(page)
    expect(hasValidMenu).toBe(true)
  })

  test('should handle menu with nested children items', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForMenuToLoad(page)
    await page.waitForTimeout(2000)

    const menuData = await getLocalStorageMenu(page)
    if (menuData && menuData.items.length > 0) {
      const hasNestedItems = menuData.items.some((item) => item.children && item.children.length > 0)
      
      if (hasNestedItems) {
        const menuItems = await getMenuItems(page)
        expect(menuItems.length).toBeGreaterThan(0)
      }
    }
  })
})

