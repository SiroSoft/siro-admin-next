import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/auth.store";

describe("auth.store", () => {
  const mockUser = { id: 1, name: "Test", email: "test@test.com", role: "admin", status: 1 };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: true });
  });

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets user on login", () => {
    useAuthStore.getState().login(mockUser, "access-token", "refresh-token");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe("Test");
  });

  it("clears user on logout", () => {
    useAuthStore.getState().login(mockUser, "at", "rt");
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("stores tokens in localStorage", () => {
    useAuthStore.getState().login(mockUser, "my-access-token", "my-refresh-token");
    expect(localStorage.getItem("siro_access_token")).toBe("my-access-token");
    expect(localStorage.getItem("siro_refresh_token")).toBe("my-refresh-token");
  });

  it("restores session from localStorage", () => {
    localStorage.setItem("siro_access_token", "at");
    localStorage.setItem("siro_refresh_token", "rt");
    localStorage.setItem("siro_user", JSON.stringify(mockUser));
    useAuthStore.getState().restoreSession();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
  });
});
