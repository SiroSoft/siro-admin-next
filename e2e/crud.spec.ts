import { test, expect, type Page } from "@playwright/test";

const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY3MDAwMDAwMH0.fake";
const FAKE_USER = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
  avatar: null,
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

async function setupAuth(page: Page) {
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

async function mockApi(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ json: MOCK_USER_RESPONSE });
  });
  await page.route("**/api/dashboard/stats", async (route) => {
    await route.fulfill({ json: MOCK_DASHBOARD });
  });
  await page.route("**/api/users**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/products**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/orders**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/categories**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/tags**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/posts**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/settings**", async (route) => {
    await route.fulfill({
      json: { success: true, data: { app_name: "Siro Admin", app_description: "", language: "en", timezone: "UTC", currency: "USD", pagination_per_page: 15, maintenance_mode: false, email_notifications: true } },
    });
  });
  await page.route("**/api/auth/logout", async (route) => {
    await route.fulfill({ json: { success: true } });
  });
}

async function loginAndMock(page: Page) {
  await mockApi(page);
  await setupAuth(page);
}

test.describe("CRUD Page Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await loginAndMock(page);
  });

  test("Dashboard loads after login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/", { timeout: 15000 });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
  });

  test("Users page renders user table", async ({ page }) => {
    await page.goto("/users");
    await expect(page).toHaveURL("/users", { timeout: 15000 });
    await expect(page.locator("text=Users").or(page.locator("text=users")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Products page renders", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL("/products", { timeout: 15000 });
    await expect(page.locator("text=Products").or(page.locator("text=products")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Orders page renders", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL("/orders", { timeout: 15000 });
    await expect(page.locator("text=Orders").or(page.locator("text=orders")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Categories page renders", async ({ page }) => {
    await page.goto("/categories");
    await expect(page).toHaveURL("/categories", { timeout: 15000 });
    await expect(page.locator("text=Categories").or(page.locator("text=categories")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Tags page renders", async ({ page }) => {
    await page.goto("/tags");
    await expect(page).toHaveURL("/tags", { timeout: 15000 });
    await expect(page.locator("text=Tags").or(page.locator("text=tags")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Posts page renders", async ({ page }) => {
    await page.goto("/posts");
    await expect(page).toHaveURL("/posts", { timeout: 15000 });
    await expect(page.locator("text=Posts").or(page.locator("text=posts")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Settings page renders", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL("/settings", { timeout: 15000 });
    await expect(page.locator("text=Settings").or(page.locator("text=settings")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Sidebar navigation links are present", async ({ page }) => {
    await page.goto("/");
    const sidebarLinks = ["Users", "Orders", "Products", "Posts", "Settings"];
    for (const link of sidebarLinks) {
      await expect(page.locator(`nav a:has-text("${link}")`).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("Logout clears auth and redirects to login", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("nav", { timeout: 10000 });
    await page.locator('button:has-text("Logout"), a:has-text("Logout"), button[aria-label*="logout" i]').first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem("siro_access_token"));
    expect(token).toBeNull();
  });
});
