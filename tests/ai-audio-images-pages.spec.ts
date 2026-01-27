import { test, expect } from '@playwright/test';

// Requires: shell and AI MFE (gaqno-ai) running and federated so /ai/images and /ai/audio load the MFE.

const EMAIL = 'gabriel.aquino@outlook.com';
const PASSWORD = 'Qesdaw312@';
const BASE_URL = 'http://localhost:3000';

test.describe('AI Audio and Images child pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const isLoginPage =
      page.url().includes('/login') ||
      (await page.locator('input[type="email"], input[name="email"]').isVisible().catch(() => false));

    if (isLoginPage) {
      await page.fill('input[type="email"], input[name="email"]', EMAIL);
      await page.fill('input[type="password"], input[name="password"]', PASSWORD);
      await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")');
      await page.waitForURL('**/', { timeout: 10000 }).catch(() => {});
      await page.waitForLoadState('networkidle');
    }
  });

  test('GET /ai/images redirects to /ai/images/text', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/ai\/images\/text/, { timeout: 15000 });
  });

  test('/ai/images/text shows Texto para Imagem as its own page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images/text`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/images\/text/);
    await expect(page.getByRole('heading', { name: 'Texto para Imagem' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gerar imagem' })).toBeVisible();
  });

  test('/ai/images/edit shows Editar Imagem as its own page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images/edit`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/images\/edit/);
    await expect(page.getByRole('heading', { name: 'Editar Imagem' })).toBeVisible();
  });

  test('GET /ai/audio redirects to /ai/audio/tts', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/audio`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/ai\/audio\/tts/, { timeout: 15000 });
  });

  test('/ai/audio/tts shows Texto para Audio as its own page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/audio/tts`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/audio\/tts/);
    await expect(page.getByRole('heading', { name: 'Texto para Audio' })).toBeVisible();
  });

  test('sub-nav on /ai/images/text: clicking Editar Imagem goes to /ai/images/edit', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images/text`);
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: 'Editar Imagem' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/images\/edit/);
    await expect(page.getByRole('heading', { name: 'Editar Imagem' })).toBeVisible();
  });

  test('sub-nav on /ai/images/edit: clicking Texto para Imagem goes to /ai/images/text', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images/edit`);
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: 'Texto para Imagem' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/images\/text/);
    await expect(page.getByRole('heading', { name: 'Texto para Imagem' })).toBeVisible();
  });

  test('/ai/images/inpainting shows Inpainting as its own page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images/inpainting`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/images\/inpainting/);
    await expect(page.getByRole('heading', { name: 'Inpainting' })).toBeVisible();
    await expect(page.getByText('Em breve.')).toBeVisible();
  });

  test('sub-nav on /ai/images/text: clicking Inpainting goes to /ai/images/inpainting', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/images/text`);
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: 'Inpainting' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/images\/inpainting/);
    await expect(page.getByRole('heading', { name: 'Inpainting' })).toBeVisible();
  });
});

test.describe('AI Video child pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const isLoginPage =
      page.url().includes('/login') ||
      (await page.locator('input[type="email"], input[name="email"]').isVisible().catch(() => false));

    if (isLoginPage) {
      await page.fill('input[type="email"], input[name="email"]', EMAIL);
      await page.fill('input[type="password"], input[name="password"]', PASSWORD);
      await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")');
      await page.waitForURL('**/', { timeout: 10000 }).catch(() => {});
      await page.waitForLoadState('networkidle');
    }
  });

  test('/ai/video/text shows Texto para Vídeo as its own page', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai/video/text`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/ai\/video\/text/);
    await expect(page.getByRole('heading', { name: 'Texto para Vídeo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gerar vídeo' })).toBeVisible();
  });
});
