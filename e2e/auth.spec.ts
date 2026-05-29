import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("shows login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h3, .card-title, h2").first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows validation errors for empty form", async ({ page }) => {
    await page.goto("/login");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Please enter a valid email")).toBeVisible();
  });

  test("has forgot password link", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('a[href*="forgot"]')).toBeVisible();
  });

  test("password visibility toggle works", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("secret123");
    await page.locator('button[aria-label*="password"]').click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });
});

test.describe("Dark Mode", () => {
  test("theme toggle is visible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('button[aria-label*="theme" i]')).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows loading state for unauthenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Siro Admin")).toBeVisible();
  });
});
