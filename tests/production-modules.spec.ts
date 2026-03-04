import { test, expect } from "@playwright/test";

/**
 * Production module load tests. Run against production to certify all MFEs load.
 *
 * Usage:
 *   BASE_URL=https://portal.gaqno.com.br LOGIN_EMAIL=... LOGIN_PASSWORD=... npx playwright test tests/production-modules.spec.ts
 *
 * Skips when LOGIN_EMAIL or LOGIN_PASSWORD are not set.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || "";
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || "";

const ERROR_PHRASES = [
  "Serviço Indisponível",
  "Ocorreu um erro inesperado",
  "não está disponível",
];

test.describe("Production modules load", () => {
  test.beforeEach(async ({ page }) => {
    if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
      test.skip();
      return;
    }
    await page.goto(BASE_URL + "/login", { waitUntil: "networkidle", timeout: 20000 });
    await page.getByPlaceholder("seu@email.com").or(page.locator('input[type="email"]')).fill(LOGIN_EMAIL);
    await page.getByPlaceholder("••••••••").or(page.locator('input[type="password"]')).fill(LOGIN_PASSWORD);
    await page.getByRole("button", { name: /Entrar|Entrando...|Login/ }).click();
    await page.waitForURL(/dashboard|\/login/, { timeout: 20000 });
    await page.waitForTimeout(1500);
  });

  test("dashboard loads without service error", async ({ page }) => {
    await page.goto(BASE_URL + "/dashboard", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(2000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    await expect(page.locator("#root")).toHaveCount(1);
    expect((await page.locator("#root").innerHTML()).length).toBeGreaterThan(200);
  });

  test("AI Audio TTS loads and shows expected heading", async ({ page }) => {
    await page.goto(BASE_URL + "/ai/audio#tts", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    await expect(page.getByRole("heading", { name: /Texto para Audio/i })).toBeVisible({ timeout: 10000 });
  });

  test("AI Images text loads and shows expected heading", async ({ page }) => {
    await page.goto(BASE_URL + "/ai/images/text", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    await expect(page.getByRole("heading", { name: /Texto para Imagem/i })).toBeVisible({ timeout: 10000 });
  });

  test("AI Books loads", async ({ page }) => {
    await page.goto(BASE_URL + "/ai/books", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    expect((await page.locator("#root").innerHTML()).length).toBeGreaterThan(200);
  });

  test("CRM route loads without service error", async ({ page }) => {
    await page.goto(BASE_URL + "/crm", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    expect((await page.locator("#root").innerHTML()).length).toBeGreaterThan(200);
  });

  test("Finance route loads without service error", async ({ page }) => {
    await page.goto(BASE_URL + "/finance", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    expect((await page.locator("#root").innerHTML()).length).toBeGreaterThan(200);
  });

  test("Intelligence route loads and shows Analytics or placeholder", async ({ page }) => {
    await page.goto(BASE_URL + "/intelligence", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    const hasContent =
      body.includes("Analytics") ||
      body.includes("Intelligence") ||
      body.includes("inteligência") ||
      body.includes("Previsões") ||
      body.includes("Insights");
    expect(hasContent).toBe(true);
    expect((await page.locator("#root").innerHTML()).length).toBeGreaterThan(200);
  });

  test("ERP Orders route loads without service error", async ({ page }) => {
    await page.goto(BASE_URL + "/erp/orders", { waitUntil: "networkidle", timeout: 25000 });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    for (const phrase of ERROR_PHRASES) {
      expect(body).not.toContain(phrase);
    }
    expect((await page.locator("#root").innerHTML()).length).toBeGreaterThan(200);
  });
});
