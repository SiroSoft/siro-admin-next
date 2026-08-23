import { test, expect } from "@playwright/test";

/**
 * REAL-API integration tests — no route mocking.
 * Requires the SiroPHP skeleton running on http://localhost:8080
 * with seeded admin: admin@siro.test / Password123!
 *
 * Boot it from the skeleton repo:
 *   php siro migrate --force && php seed-e2e-admin.php && php siro serve
 */

const ADMIN_EMAIL = "admin@siro.test";
const ADMIN_PASSWORD = "Password123!";

test.describe("Real API: login → dashboard", () => {
  test("login form accepts real credentials and lands on dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Real JWT round-trip against the SiroPHP skeleton API.
    // The auth provider fetches /api/auth/me before rendering the shell.
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 20000 });
  });

  test("dashboard renders REAL data from the skeleton database", async ({ page }) => {
    // Login through the UI first so tokens are stored like a real session.
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 20000 });

    const token = await page.evaluate(() => localStorage.getItem("siro_access_token"));
    expect(token).toBeTruthy();
    expect(token).toContain("eyJ"); // JWT shape

    // The seeded admin must appear in a REAL users query (no mocks).
    const res = await page.request.get("http://localhost:8080/api/users?page=1&per_page=10", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const emails = (body.data ?? []).map((u: { email?: string }) => u.email);
    expect(emails).toContain(ADMIN_EMAIL);
  });

  test("wrong password is rejected by the real backend", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill("DefinitelyWrong!");
    await solveCaptchaIfPresent(page);
    await page.locator('button[type="submit"]').click();
    // Skeleton returns 401 Invalid credentials; starter shows an inline error.
    await expect(
      page.locator("text=Invalid credentials, text=Login failed, text=Incorrect").first(),
    ).toBeVisible({ timeout: 15000 });
  });
});

async function solveCaptchaIfPresent(page: import("@playwright/test").Page) {
  // Skeleton may enforce LOGIN_CAPTCHA depending on env; the local e2e DB has it off,
  // but keep this helper future-proof if the flag flips on.
  const input = page.locator("#captcha_answer");
  if (await input.count()) {
    // No code exposure in production mode; tests run with LOGIN_CAPTCHA=false locally.
    await input.fill("00000").catch(() => {});
  }
}
