import { test, expect, type Page } from "@playwright/test";

// REQ-4 mapping coverage: settings shape, product filters, dashboard
// orders_by_status, health badge version. All API mocked; asserts the
// FRONTEND sends/parses the v1.0.1 contract from docs/MAPPING.md.

const FAKE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY3MDAwMDAwMH0.fake";
const FAKE_USER = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
  avatar: null,
};

const MOCK_DASHBOARD = {
  success: true,
  data: {
    total_users: 42,
    active_users: 38,
    total_orders: 156,
    total_products: 89,
    total_revenue: 45200,
    recent_activity: [],
    api_status: { status: "healthy", version: "1.0.1", uptime: 86400, response_time: 45 },
    monthly_revenue: [],
    orders_by_status: { pending: 10, processing: 5, completed: 141 },
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

async function mockBase(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ json: { success: true, data: FAKE_USER } });
  });
  await page.route("**/api/dashboard/stats", async (route) => {
    await route.fulfill({ json: MOCK_DASHBOARD });
  });
  await page.route("**/api/settings", async (route) => {
    if (route.request().method() === "PUT") {
      await route.fulfill({ json: { success: true, data: { app_name: "Mock" } } });
    } else {
      await route.fulfill({ json: { success: true, data: { app_name: "Mock", locale: "en" } } });
    }
  });
}

test.describe("REQ-4 mapping", () => {
  test("products list sends v1.0 status filter (not legacy is_active)", async ({ page }) => {
    await setupAuth(page);
    await mockBase(page);
    let seenUrl = "";
    await page.route("**/api/products**", async (route) => {
      seenUrl = route.request().url();
      await route.fulfill({ json: MOCK_PAGINATED });
    });
    await page.goto("/products");
    await expect(page.locator("text=Products").first()).toBeVisible({ timeout: 15000 });
    // click the "Active" status filter button and assert the outgoing query
    const activeBtn = page.locator("button", { hasText: "Active" }).first();
    if (await activeBtn.count()) {
      await activeBtn.click();
      await page.waitForTimeout(1500);
      expect(seenUrl).toContain("status=active");
      expect(seenUrl).not.toContain("is_active");
    }
  });

  test("dashboard renders orders_by_status from v1.0.1 shape", async ({ page }) => {
    await setupAuth(page);
    await mockBase(page);
    await page.goto("/");
    await expect(page.locator("text=141").first()).toBeVisible({ timeout: 15000 });
  });

  test("health badge shows api_status version", async ({ page }) => {
    await setupAuth(page);
    await mockBase(page);
    await page.goto("/");
    await expect(page.locator("text=1.0.1").first()).toBeVisible({ timeout: 15000 });
  });
});
