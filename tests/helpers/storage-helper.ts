import { Page } from '@playwright/test'

const MENU_STORAGE_KEY = 'gaqno_menu_items'

export interface MenuStorageData {
  items: Array<{
    id: string
    label: string
    href: string
    icon: string
    requiredPermissions: string[]
    isCollapsible?: boolean
    children?: Array<any>
  }>
  timestamp: number
}

export async function getLocalStorageMenu(page: Page): Promise<MenuStorageData | null> {
  try {
    const menuData = await page.evaluate((key) => {
      if (typeof window === 'undefined' || !window.localStorage) return null
      const stored = localStorage.getItem(key)
      if (!stored) return null
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }, MENU_STORAGE_KEY)
    
    return menuData
  } catch (error) {
    return null
  }
}

export async function setLocalStorageMenu(page: Page, menuData: MenuStorageData): Promise<void> {
  try {
    await page.evaluate(
      ({ key, data }) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(key, JSON.stringify(data))
        }
      },
      { key: MENU_STORAGE_KEY, data: menuData }
    )
  } catch (error) {
    if (page.url() === 'about:blank' || !page.url()) {
      await page.goto('about:blank')
      await page.evaluate(
        ({ key, data }) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(key, JSON.stringify(data))
          }
        },
        { key: MENU_STORAGE_KEY, data: menuData }
      )
    }
  }
}

export async function clearLocalStorageMenu(page: Page): Promise<void> {
  try {
    const url = page.url()
    if (!url || url === 'about:blank') {
      return
    }
    await page.evaluate((key) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(key)
        }
      } catch {
      }
    }, MENU_STORAGE_KEY)
  } catch {
  }
}

export async function expireLocalStorageMenu(page: Page): Promise<void> {
  const menuData = await getLocalStorageMenu(page)
  if (menuData) {
    const expiredData: MenuStorageData = {
      ...menuData,
      timestamp: Date.now() - 31 * 60 * 1000
    }
    await setLocalStorageMenu(page, expiredData)
  }
}

export async function verifyMenuInLocalStorage(page: Page): Promise<boolean> {
  const menuData = await getLocalStorageMenu(page)
  
  if (!menuData) return false
  
  if (!Array.isArray(menuData.items)) return false
  
  if (typeof menuData.timestamp !== 'number') return false
  
  const now = Date.now()
  const maxAge = 30 * 60 * 1000
  
  if (now - menuData.timestamp > maxAge) return false
  
  return true
}

export async function getMenuItemsFromStorage(page: Page): Promise<string[]> {
  const menuData = await getLocalStorageMenu(page)
  
  if (!menuData || !Array.isArray(menuData.items)) {
    return []
  }
  
  const extractLabels = (items: any[]): string[] => {
    const labels: string[] = []
    for (const item of items) {
      if (item.label) {
        labels.push(item.label)
      }
      if (item.children && Array.isArray(item.children)) {
        labels.push(...extractLabels(item.children))
      }
    }
    return labels
  }
  
  return extractLabels(menuData.items)
}

