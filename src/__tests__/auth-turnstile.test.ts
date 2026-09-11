import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/services/api", () => ({
  default: { post: vi.fn(), get: vi.fn() },
}));

import api from "@/services/api";
import { authService } from "@/services/auth.service";

const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;

describe("auth.service turnstile token", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedPost.mockResolvedValue({ data: { success: true } });
  });

  it("login includes cf-turnstile-response in the request body", async () => {
    await authService.login({
      email: "demo@skeleton.sirophp.com",
      password: "Demo123!",
      "cf-turnstile-response": "turnstile-test-token",
    });
    expect(mockedPost).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ "cf-turnstile-response": "turnstile-test-token" }),
    );
  });

  it("register includes cf-turnstile-response in the request body", async () => {
    await authService.register({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      "cf-turnstile-response": "turnstile-test-token",
    });
    expect(mockedPost).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ "cf-turnstile-response": "turnstile-test-token" }),
    );
  });

  it("forgotPassword includes cf-turnstile-response in the request body", async () => {
    await authService.forgotPassword("test@example.com", "turnstile-test-token");
    expect(mockedPost).toHaveBeenCalledWith(
      "/api/auth/forgot-password",
      expect.objectContaining({
        email: "test@example.com",
        "cf-turnstile-response": "turnstile-test-token",
      }),
    );
  });

  it("forgotPassword omits the token key when no token is given", async () => {
    await authService.forgotPassword("test@example.com");
    const body = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(body.email).toBe("test@example.com");
    expect("cf-turnstile-response" in body).toBe(false);
  });
});
