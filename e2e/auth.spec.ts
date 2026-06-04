import { test, expect } from "@playwright/test";

const VALID_EMAIL = "admin@example.com";
const VALID_PASSWORD = "password123";

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

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("invalid@example.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Invalid credentials, text=Login failed, text=Invalid email or password").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Login with valid credentials", () => {
  test("redirects to dashboard on successful login", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
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

  test("loads with data when authenticated", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
    await expect(page.locator("text=Dashboard, text=Stats, text=Overview").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Logout", () => {
  test("redirects to login after logout", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
    await page.locator('button[aria-label*="logout" i], a[href*="logout"]').first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe("Dark Mode", () => {
  test("theme toggle is visible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('button[aria-label*="theme" i]')).toBeVisible();
  });
});
