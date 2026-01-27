import { test, expect } from '@playwright/test';

const EMAIL = 'gabriel.aquino@outlook.com';
const PASSWORD = 'Qesdaw312@';
const BASE_URL = 'http://localhost:3000';

test.describe('AI Modules Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to login
    const isLoginPage = page.url().includes('/login') || await page.locator('input[type="email"], input[name="email"]').isVisible().catch(() => false);
    
    if (isLoginPage) {
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', EMAIL);
      await page.fill('input[type="password"], input[name="password"]', PASSWORD);
      
      // Click login button
      await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")');
      
      // Wait for navigation after login
      await page.waitForURL('**/', { timeout: 10000 }).catch(() => {});
      await page.waitForLoadState('networkidle');
    }
  });

  test('should load AI main page without stream errors', async ({ page }) => {
    // Navigate to AI main page
    await page.goto(`${BASE_URL}/ai`);
    await page.waitForLoadState('networkidle');
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('stream') || text.includes('Failed to resolve module specifier')) {
          errors.push(text);
        }
      }
    });
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    // Verify no stream errors
    const streamErrors = errors.filter(e => e.includes('stream'));
    expect(streamErrors.length).toBe(0);
    
    // Verify page loaded
    await expect(page).toHaveURL(/.*\/ai/);
  });

  test('should load AI Books page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/books`);
    await page.waitForLoadState('networkidle');
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('stream') || text.includes('Failed to resolve module specifier')) {
          errors.push(text);
        }
      }
    });
    
    await page.waitForTimeout(2000);
    
    const streamErrors = errors.filter(e => e.includes('stream'));
    expect(streamErrors.length).toBe(0);
    await expect(page).toHaveURL(/.*\/ai\/books/);
  });

  test('should load AI Video page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/video`);
    await page.waitForLoadState('networkidle');
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('stream') || text.includes('Failed to resolve module specifier')) {
          errors.push(text);
        }
      }
    });
    
    await page.waitForTimeout(2000);
    
    const streamErrors = errors.filter(e => e.includes('stream'));
    expect(streamErrors.length).toBe(0);
    await expect(page).toHaveURL(/.*\/ai\/video/);
  });

  test('should load AI Images page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images`);
    await page.waitForLoadState('networkidle');
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('stream') || text.includes('Failed to resolve module specifier')) {
          errors.push(text);
        }
      }
    });
    
    await page.waitForTimeout(2000);
    
    const streamErrors = errors.filter(e => e.includes('stream'));
    expect(streamErrors.length).toBe(0);
    await expect(page).toHaveURL(/.*\/ai\/images/);
  });

  test('should load AI Audio page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/audio`);
    await page.waitForLoadState('networkidle');
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('stream') || text.includes('Failed to resolve module specifier')) {
          errors.push(text);
        }
      }
    });
    
    await page.waitForTimeout(2000);
    
    const streamErrors = errors.filter(e => e.includes('stream'));
    expect(streamErrors.length).toBe(0);
    await expect(page).toHaveURL(/.*\/ai\/audio/);
  });

  test('should verify all AI modules are accessible', async ({ page }) => {
    const modules = [
      { path: '/ai', name: 'AI Main' },
      { path: '/ai/books', name: 'Books' },
      { path: '/ai/video', name: 'Video' },
      { path: '/ai/images', name: 'Images' },
      { path: '/ai/audio', name: 'Audio' },
    ];

    const results: Array<{ name: string; success: boolean; error?: string }> = [];

    for (const module of modules) {
      try {
        await page.goto(`${BASE_URL}${module.path}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Check for stream errors in console
        const errors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            const text = msg.text();
            if (text.includes('stream') || text.includes('Failed to resolve module specifier')) {
              errors.push(text);
            }
          }
        });
        
        await page.waitForTimeout(2000);
        
        const streamErrors = errors.filter(e => e.includes('stream'));
        const hasError = streamErrors.length > 0;
        
        results.push({
          name: module.name,
          success: !hasError,
          error: hasError ? streamErrors[0] : undefined,
        });
      } catch (error) {
        results.push({
          name: module.name,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Log results
    console.log('\n=== AI Modules Test Results ===');
    results.forEach(result => {
      console.log(`${result.success ? '✓' : '✗'} ${result.name}: ${result.success ? 'PASS' : 'FAIL'}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    });

    // Verify all modules succeeded
    const failed = results.filter(r => !r.success);
    expect(failed.length).toBe(0);
  });
});
