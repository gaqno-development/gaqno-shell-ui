/**
 * Opens a browser and verifies all shell routes load (no white screen).
 * Logs in first to access protected modules.
 * Run: node scripts/verify-browser.js
 */

const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || "gabriel.aquino@outlook.com";
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || "Qesdaw312@";

const PUBLIC_ROUTES = [
  { path: "/", name: "Home" },
  { path: "/login", name: "Login" },
  { path: "/register", name: "Register" },
];

const PROTECTED_ROUTES = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/ai", name: "AI" },
  { path: "/crm", name: "CRM" },
  { path: "/erp", name: "ERP" },
  { path: "/finance", name: "Finance" },
  { path: "/pdv", name: "PDV" },
  { path: "/omnichannel", name: "Omnichannel" },
  { path: "/saas", name: "SaaS" },
  { path: "/wellness", name: "Wellness" },
  { path: "/sso", name: "SSO" },
  { path: "/admin", name: "Admin" },
];

async function login(page) {
  await page.goto(BASE + "/login", { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.getByPlaceholder("seu@email.com").fill(LOGIN_EMAIL);
  await page.getByPlaceholder("••••••••").fill(LOGIN_PASSWORD);
  await page.getByRole("button", { name: /Entrar|Entrando.../ }).click();
  await page.waitForURL(/dashboard|\/login/, { timeout: 15000 });
  await page.waitForTimeout(2000);
}

async function checkRoute(page, path, name, options = {}) {
  const { protected: isProtected = false } = options;
  const url = BASE + path;
  const waitAfterNav = isProtected ? 6000 : 1500;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    if (isProtected) {
      try {
        await page.waitForSelector("#root > *", { timeout: 10000 });
      } catch (_) {}
    }
    await page.waitForTimeout(waitAfterNav);

    const info = await page.evaluate(() => {
      const root = document.getElementById("root");
      const rootLen = root?.innerHTML?.length || 0;
      const hasGlobalError = !!document.getElementById("gaqno-global-error");
      const firstChildTag = root?.firstElementChild?.tagName || "none";
      const url = window.location.href;
      return { rootLen, hasGlobalError, firstChildTag, url };
    });

    const status = info.rootLen > 100 && !info.hasGlobalError ? "OK" : "FAIL";
    console.log(
      `  ${status.padEnd(4)} ${path.padEnd(18)} root:${String(info.rootLen).padStart(6)} chars  child:<${info.firstChildTag}>  url:${info.url}`
    );
    return { name, path, status, rootLen: info.rootLen };
  } catch (e) {
    console.log(`  ERR  ${path.padEnd(18)} ${e.message.slice(0, 100)}`);
    return { name, path, status: "ERR", error: e.message };
  }
}

async function main() {
  console.log(`\nVerifying routes at ${BASE}\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === "error" && !text.includes("DevTools") && !text.includes("401")) {
      errors.push(text.slice(0, 150));
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`[pageerror] ${err.message.slice(0, 150)}`);
  });

  const results = [];

  for (const route of PUBLIC_ROUTES) {
    results.push(await checkRoute(page, route.path, route.name));
  }

  console.log("\nLogging in...");
  try {
    await login(page);
    const atDashboard = page.url().includes("dashboard");
    console.log(atDashboard ? "  Login OK\n" : "  Login may have failed, continuing...\n");
  } catch (e) {
    console.log("  Login failed:", e.message, "- continuing anyway\n");
  }

  for (const route of PROTECTED_ROUTES) {
    errors.length = 0;
    results.push(await checkRoute(page, route.path, route.name, { protected: true }));
    if (errors.length > 0) {
      errors.forEach((e) => console.log(`         ${e}`));
    }
  }

  const passed = results.filter((r) => r.status === "OK").length;
  const failed = results.filter((r) => r.status !== "OK").length;

  console.log(`\n${passed} passed, ${failed} failed.\n`);

  await page.waitForTimeout(3000);
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
