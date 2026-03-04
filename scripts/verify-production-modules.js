/**
 * Verifies that all shell routes and MFEs load correctly.
 * Runs purely locally by default (BASE_URL=http://localhost:3000).
 * Logs in, then visits each protected route and asserts:
 * - No "Serviço Indisponível" or "Ocorreu um erro inesperado"
 * - Root has meaningful content.
 *
 * Usage (local - all routes must pass):
 *   LOGIN_EMAIL=... LOGIN_PASSWORD=... npm run verify:production
 *   # From workspace root, start all MFEs first:
 *   npm run dev:frontends
 *   npm run dev:admin && npm run dev:omnichannel && npm run dev:saas && npm run dev:wellness && npm run dev:sso
 *   # Then from gaqno-shell-ui: npm run verify:production
 *
 * Usage (production):
 *   BASE_URL=https://portal.gaqno.com.br LOGIN_EMAIL=... LOGIN_PASSWORD=... node scripts/verify-production-modules.js
 *
 * Env:
 *   DEBUG=1       Log console errors and body snippet on failure; hint missing MFE port
 *   HEADLESS=1    Run headless
 */

const { chromium } = require("playwright");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || "";
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || "";
const HEADLESS = process.env.HEADLESS === "1" || process.env.HEADLESS === "true";
const DEBUG = process.env.DEBUG === "1" || process.env.DEBUG === "true";

const ERROR_PHRASES = [
  "Serviço Indisponível",
  "Ocorreu um erro inesperado",
  "não está disponível",
];

const PROTECTED_ROUTES = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/ai/books", name: "AI Books" },
  { path: "/ai/audio/tts", name: "AI Audio TTS" },
  { path: "/ai/images/text", name: "AI Images" },
  { path: "/ai/video/text", name: "AI Video" },
  { path: "/ai/studio", name: "AI Studio" },
  { path: "/ai/social", name: "AI Social" },
  { path: "/ai/discovery", name: "AI Discovery" },
  { path: "/ai/retail/dashboard", name: "AI Retail" },
  { path: "/crm", name: "CRM" },
  { path: "/crm/dashboard/overview", name: "CRM Overview" },
  { path: "/erp", name: "ERP" },
  { path: "/erp/dashboard", name: "ERP Dashboard" },
  { path: "/erp/catalog", name: "ERP Catalog" },
  { path: "/erp/inventory", name: "ERP Inventory" },
  { path: "/erp/orders", name: "ERP Orders" },
  { path: "/finance", name: "Finance" },
  { path: "/pdv", name: "PDV" },
  { path: "/rpg", name: "RPG" },
  { path: "/omnichannel", name: "Omnichannel" },
  { path: "/omnichannel/inbox", name: "Omnichannel Inbox" },
  { path: "/saas", name: "SaaS" },
  { path: "/saas/dashboard", name: "SaaS Dashboard" },
  { path: "/saas/costing", name: "SaaS Costing" },
  { path: "/saas/codemap", name: "SaaS Codemap" },
  { path: "/wellness", name: "Wellness" },
  { path: "/wellness/today", name: "Wellness Today" },
  { path: "/wellness/timeline", name: "Wellness Timeline" },
  { path: "/wellness/stats", name: "Wellness Stats" },
  { path: "/sso", name: "SSO" },
  { path: "/admin", name: "Admin" },
];

const MFE_PREFIXES = ["/ai/", "/admin", "/crm", "/erp", "/finance", "/pdv", "/rpg", "/omnichannel", "/saas", "/wellness", "/sso"];
const MFE_WAIT_MS = 8000;
const MFE_RETRIES = 2;

async function login(page) {
  await page.goto(BASE_URL + "/login", {
    waitUntil: "networkidle",
    timeout: 20000,
  });
  await page.waitForTimeout(1500);
  const emailInput = page
    .getByPlaceholder("seu@email.com")
    .or(page.locator('input[type="email"]'));
  const passwordInput = page
    .getByPlaceholder("••••••••")
    .or(page.locator('input[type="password"]'));
  await emailInput.fill(LOGIN_EMAIL);
  await passwordInput.fill(LOGIN_PASSWORD);
  await page.getByRole("button", { name: /Entrar|Entrando...|Login/ }).click();
  await page.waitForURL(/dashboard|\/login/, { timeout: 20000 });
  await page.waitForTimeout(2000);
}

async function checkRoute(page, route, consoleErrors) {
  const url = BASE_URL + route.path;
  const result = {
    name: route.name,
    path: route.path,
    status: "UNKNOWN",
    error: null,
    debug: null,
  };
  const isMfe = MFE_PREFIXES.some((p) => route.path.startsWith(p));
  const waitMs = isMfe ? MFE_WAIT_MS : 4000;
  const maxAttempts = isMfe ? MFE_RETRIES + 1 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    result.debug = null;
    consoleErrors.length = 0;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });
      await page.waitForTimeout(waitMs);

      const bodyText = await page.locator("body").innerText().catch(() => "");
      const foundPhrase = ERROR_PHRASES.find((phrase) => bodyText.includes(phrase));
      if (foundPhrase) {
        if (attempt < maxAttempts) {
          await page.waitForTimeout(2000);
          continue;
        }
        result.status = "FAIL";
        result.error = `Page shows: "${foundPhrase}"`;
        if (DEBUG) {
          result.debug = {
            bodySnippet: bodyText.slice(0, 400).replace(/\s+/g, " ").trim(),
            consoleErrors: [...consoleErrors],
          };
        }
        const ref = consoleErrors.find((e) => e.includes("ERR_CONNECTION_REFUSED"));
        if (ref) {
          const m = ref.match(/localhost:(\d+)/);
          result.error += m ? ` (MFE not running on port ${m[1]} - start the corresponding dev server)` : "";
        }
        return result;
      }

      const rootContent = await page.locator("#root").first().innerHTML().catch(() => "");
      if (rootContent.length < 200) {
        result.status = "FAIL";
        result.error = `Root content too small (${rootContent.length} chars)`;
        if (DEBUG) {
          result.debug = {
            rootLength: rootContent.length,
            consoleErrors: [...consoleErrors],
          };
        }
        return result;
      }

      result.status = "OK";
      return result;
    } catch (e) {
      const errMsg = e && e.message ? e.message.slice(0, 150) : String(e).slice(0, 150);
      if (attempt === maxAttempts) {
        result.status = "ERR";
        result.error = errMsg;
        if (DEBUG) {
          result.debug = { consoleErrors: [...consoleErrors] };
        }
        return result;
      }
      await page.waitForTimeout(2000);
    }
  }

  return result;
}

async function main() {
  if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
    console.error("[verify] Set LOGIN_EMAIL and LOGIN_PASSWORD.");
    console.error("[verify] Example: LOGIN_EMAIL=user@example.com LOGIN_PASSWORD=secret node scripts/verify-production-modules.js");
    process.exit(1);
  }

  const isLocal = BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1");
  console.log(`\n[verify] BASE_URL=${BASE_URL} (${isLocal ? "local" : "production"}) headless=${HEADLESS} debug=${DEBUG}`);
  if (isLocal) {
    console.log("[verify] Ensure all MFEs are running (e.g. npm run dev:frontends, dev:admin, dev:omnichannel, dev:saas, dev:wellness, dev:sso).");
  }
  console.log(`[verify] ${PROTECTED_ROUTES.length} routes to check\n`);

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error" && text && !text.includes("401")) {
      consoleErrors.push(text.slice(0, 200));
    }
  });

  const results = [];

  try {
    await login(page);
    const atDashboard = page.url().includes("dashboard");
    console.log(atDashboard ? "[verify] Login OK\n" : "[verify] Login may have failed; continuing...\n");

    for (const route of PROTECTED_ROUTES) {
      const r = await checkRoute(page, route, consoleErrors);
      results.push(r);
      const statusStr = r.status.padEnd(4);
      const errStr = r.error ? `  ${r.error}` : "";
      console.log(`  ${statusStr} ${route.path.padEnd(28)} ${route.name}${errStr}`);
      if (DEBUG && r.debug) {
        if (r.debug.consoleErrors && r.debug.consoleErrors.length) {
          console.log(`      [debug] console errors: ${r.debug.consoleErrors.slice(0, 3).join(" | ")}`);
        }
        if (r.debug.bodySnippet) {
          console.log(`      [debug] body snippet: ${r.debug.bodySnippet.slice(0, 120)}...`);
        }
      }
    }
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.status === "OK").length;
  const failed = results.filter((r) => r.status === "FAIL" || r.status === "ERR");
  const warned = results.filter((r) => r.status === "WARN");

  console.log(`\n[verify] ${passed}/${results.length} passed, ${warned.length} warnings, ${failed.length} failed.`);
  if (failed.length) {
    console.log("\n[verify] Failed routes:");
    failed.forEach((r) => console.log(`  - ${r.path} (${r.name}): ${r.error}`));
    const connectionRefused = failed.filter((r) => r.error && r.error.includes("port"));
    if (connectionRefused.length) {
      console.log("\n[verify] Hint: start missing MFEs (e.g. npm run dev:rpg, dev:omnichannel, dev:saas, dev:wellness, dev:sso, dev:admin).");
    }
    if (!DEBUG) {
      console.log("\n[verify] Re-run with DEBUG=1 to see console errors and body snippet for failures.");
    }
  }
  console.log("");
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
