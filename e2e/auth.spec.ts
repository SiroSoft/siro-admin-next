import { test, expect, type Page } from "@playwright/test";

const VALID_EMAIL = "admin@example.com";
const VALID_PASSWORD = "password123";

const FAKE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY3MDAwMDAwMH0.fake";

const FAKE_USER = {
  id: 1,
  name: "Admin User",
  email: VALID_EMAIL,
  role: "admin",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
  avatar: null,
};

const MOCK_LOGIN_OK = {
  success: true,
  data: { token: FAKE_TOKEN, refresh_token: FAKE_TOKEN, token_type: "Bearer", expires_in: 3600, user: FAKE_USER },
};

const MOCK_USER_RESPONSE = { success: true, data: FAKE_USER };

const MOCK_DASHBOARD = {
  success: true,
  data: {
    total_users: 42,
    active_users: 38,
    total_orders: 156,
    total_products: 89,
    total_revenue: 45200,
    recent_activity: [],
    api_status: { status: "healthy", version: "1.0.0", uptime: 86400, response_time: 45 },
    monthly_revenue: [],
  },
};

const MOCK_PAGINATED = { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 0 } };

type LoginMode = "ok" | "invalid" | "none";

async function mockApi(page: Page, opts: { login?: LoginMode } = {}) {
  const mode: LoginMode = opts.login ?? "none";

  await page.route("**/api/auth/captcha", async (route) => {
    await route.fulfill({
      json: { success: true, data: { id: "captcha_test_0001", svg: "<svg/>", code: "abcde" } },
    });
  });

  await page.route("**/api/auth/login", async (route) => {
    if (mode === "ok") {
      await route.fulfill({ json: MOCK_LOGIN_OK });
    } else {
      await route.fulfill({ status: 401, json: { success: false, message: "Invalid credentials" } });
    }
  });

  await page.route("**/api/auth/me", async (route) => {
    if (mode === "ok") {
      await route.fulfill({ json: MOCK_USER_RESPONSE });
    } else {
      await route.fulfill({ status: 401, json: { success: false, message: "Unauthenticated" } });
    }
  });

  await page.route("**/api/auth/logout", async (route) => {
    await route.fulfill({ json: { success: true } });
  });

  await page.route("**/api/dashboard/stats", async (route) => {
    await route.fulfill({ json: MOCK_DASHBOARD });
  });

  for (const resource of ["users", "products", "orders", "categories", "tags", "posts"]) {
    await page.route(`**/api/${resource}**`, async (route) => {
      await route.fulfill({ json: MOCK_PAGINATED });
    });
  }
}

async function seedAuthedSession(page: Page) {
  await page.goto("/login");
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem("siro_access_token", token);
      localStorage.setItem("siro_refresh_token", token);
      localStorage.setItem("siro_user", JSON.stringify(user));
    },
    { token: FAKE_TOKEN, user: FAKE_USER },
  );
}

test.describe("Login", () => {
  test("shows login page", async ({ page }) => {
    await mockApi(page);
    await page.goto("/login");
    await expect(page.locator("h3, .card-title, h2").first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows validation errors for empty form", async ({ page }) => {
    await mockApi(page);
    await page.goto("/login");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Please enter a valid email")).toBeVisible();
  });

  test("has forgot password link", async ({ page }) => {
    await mockApi(page);
    await page.goto("/login");
    await expect(page.locator('a[href*="forgot"]')).toBeVisible();
  });

  test("password visibility toggle works", async ({ page }) => {
    await mockApi(page);
    await page.goto("/login");
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("secret123");
    await page.locator('button[aria-label*="password"]').click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await mockApi(page, { login: "invalid" });
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("invalid@example.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();
    await expect(
      page.locator("text=Invalid credentials").first(),
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Login with valid credentials", () => {
  test("redirects to dashboard on successful login", async ({ page }) => {
    await mockApi(page, { login: "ok" });
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 15000 });
  });
});

test.describe("Dashboard", () => {
  test("redirects to login when unauthenticated", async ({ page }) => {
    await mockApi(page); // me -> 401
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("shows loading state for unauthenticated", async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
    await expect(
      page.locator('img[alt="Siro Admin"]').or(page.locator('text=Siro Admin')).first(),
    ).toBeVisible({ timeout: 30000 });
  });

  test("loads with data when authenticated", async ({ page }) => {
    await mockApi(page, { login: "ok" });
    await seedAuthedSession(page);
    await page.goto("/");
    await expect(
      page.locator('nav[aria-label="Breadcrumb"] >> text=Dashboard').first(),
    ).toBeVisible({ timeout: 30000 });
    await expect(page.locator("text=Total Users")).toBeVisible({ timeout: 30000 });
  });
});

test.describe("Logout", () => {
  test("redirects to login after logout", async ({ page }) => {
    await mockApi(page, { login: "ok" });
    await seedAuthedSession(page);
    await page.goto("/");
    await expect(page.locator('button[aria-label="User menu"]')).toBeVisible({ timeout: 30000 });
    await page.locator('button[aria-label="User menu"]').click();
    const logoutItem = page.getByRole("menuitem", { name: /log\s?out/i });
    await logoutItem.waitFor({ state: "visible", timeout: 15000 });
    await logoutItem.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 30000 });
  });
});

test.describe("Dark Mode", () => {
  test("theme toggle is visible", async ({ page }) => {
    await mockApi(page, { login: "ok" });
    await seedAuthedSession(page);
    await page.goto("/");
    await expect(page.locator('button[aria-label*="theme" i]').first()).toBeVisible({ timeout: 30000 });
  });
});
