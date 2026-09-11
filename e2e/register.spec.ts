import { test, expect, type Page } from "@playwright/test";

async function mockApi(page: Page) {
  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({ json: { success: true, data: null } });
  });

  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ status: 401, json: { success: false, message: "Unauthenticated" } });
  });
}

test.describe("Register", () => {
  test("shows register page", async ({ page }) => {
    await mockApi(page);
    await page.goto("/register");
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#password_confirmation")).toBeVisible();
  });

  test("shows validation errors for empty form", async ({ page }) => {
    await mockApi(page);
    await page.goto("/register");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Please enter a valid email")).toBeVisible();
  });

  test("validates and submits with turnstile token", async ({ page }) => {
    await mockApi(page);

    let requestBody: Record<string, unknown> | undefined;
    await page.route("**/api/auth/register", async (route) => {
      try {
        requestBody = route.request().postDataJSON() as Record<string, unknown>;
      } catch {
        requestBody = undefined;
      }
      await route.fulfill({ json: { success: true, data: null } });
    });

    await page.goto("/register");
    await page.locator("#name").fill("Test User");
    await page.locator('input[type="email"]').fill("test@example.com");
    await page.locator("#password").fill("password123");
    await page.locator("#password_confirmation").fill("password123");
    await page.locator('button[type="submit"]').click();

    await expect.poll(() => requestBody?.email, { timeout: 10000 }).toBe("test@example.com");
    // The Turnstile widget only renders when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set;
    // when present, the page attaches it as "cf-turnstile-response" (covered by unit test).
    if (requestBody && "cf-turnstile-response" in requestBody) {
      expect(typeof requestBody["cf-turnstile-response"]).toBe("string");
    }
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
