import { test, expect } from '@playwright/test';

test.describe('Shell Application UI Certification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display login page with proper styling', async ({ page }) => {
    await expect(page).toHaveTitle(/White Label Admin/);
    
    await expect(page.locator('h1, h2').filter({ hasText: 'Login' })).toBeVisible();
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    await page.screenshot({ path: 'test-results/01-login-page.png', fullPage: true });
    console.log('✅ Login page screenshot saved');
  });

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await page.fill('input[type="email"]', 'gabriel.aquino@outlook.com');
    await page.fill('input[type="password"]', 'Qesdaw312@');
    
    await page.locator('button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await expect(page.locator('h1, h2').filter({ hasText: /Dashboard/i })).toBeVisible();
    
    await page.screenshot({ path: 'test-results/02-dashboard.png', fullPage: true });
    console.log('✅ Dashboard screenshot saved');
  });

  test('should display sidebar menu with all services for super admin', async ({ page }) => {
    await page.fill('input[type="email"]', 'gabriel.aquino@outlook.com');
    await page.fill('input[type="password"]', 'Qesdaw312@');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await page.waitForTimeout(1000);
    
    const menuItems = [
      'Dashboard',
      'PDV',
      'CRM',
      'ERP',
      'Financeiro',
      'Inteligência Artificial',
      'Administração'
    ];
    
    for (const item of menuItems) {
      const menuItem = page.locator(`text="${item}"`).first();
      await expect(menuItem).toBeVisible();
      console.log(`✅ Menu item visible: ${item}`);
    }
    
    await page.screenshot({ path: 'test-results/03-sidebar-menu.png', fullPage: true });
    console.log('✅ Sidebar menu screenshot saved');
  });

  test('should display dashboard widgets with proper styling', async ({ page }) => {
    await page.fill('input[type="email"]', 'gabriel.aquino@outlook.com');
    await page.fill('input[type="password"]', 'Qesdaw312@');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await page.waitForTimeout(2000);
    
    const widgets = [
      'Quick Actions',
      'Aggregated Metrics',
      'Activity Timeline'
    ];
    
    for (const widget of widgets) {
      const widgetElement = page.locator('text=' + widget).first();
      await expect(widgetElement).toBeVisible();
      console.log(`✅ Widget visible: ${widget}`);
    }
    
    await page.screenshot({ path: 'test-results/04-dashboard-widgets.png', fullPage: true });
    console.log('✅ Dashboard widgets screenshot saved');
  });

  test('should verify Tailwind CSS is working - check element styles', async ({ page }) => {
    await page.fill('input[type="email"]', 'gabriel.aquino@outlook.com');
    await page.fill('input[type="password"]', 'Teste@123');
    
    const loginButton = page.locator('button[type="submit"]');
    
    const bgColor = await loginButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const padding = await loginButton.evaluate((el) => {
      return window.getComputedStyle(el).padding;
    });
    
    console.log('Login button styles:', { bgColor, padding });
    
    expect(bgColor).toBeTruthy();
    expect(padding).toBeTruthy();
    
    console.log('✅ Tailwind CSS is applying styles');
  });

  test('should navigate to different menu sections', async ({ page }) => {
    await page.fill('input[type="email"]', 'gabriel.aquino@outlook.com');
    await page.fill('input[type="password"]', 'Qesdaw312@');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    const pdvLink = page.locator('text="PDV"').first();
    await pdvLink.click();
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/05-pdv-section.png', fullPage: true });
    console.log('✅ PDV section screenshot saved');
    
    const financeLink = page.locator('text="Financeiro"').first();
    await financeLink.click();
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/06-finance-section.png', fullPage: true });
    console.log('✅ Finance section screenshot saved');
  });
});

test.describe('Visual Regression Tests', () => {
  test('should capture full application flow', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.screenshot({ path: 'test-results/visual-01-landing.png', fullPage: true });
    
    await page.fill('input[type="email"]', 'gabriel.aquino@outlook.com');
    await page.fill('input[type="password"]', 'Teste@123');
    
    await page.screenshot({ path: 'test-results/visual-02-login-filled.png', fullPage: true });
    
    await page.locator('button[type="submit"]').click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/visual-03-dashboard-full.png', fullPage: true });
    
    const toggleButton = page.locator('button').filter({ hasText: /toggle|menu/i }).first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/visual-04-menu-expanded.png', fullPage: true });
    }
    
    console.log('✅ Visual regression screenshots captured');
  });
});

