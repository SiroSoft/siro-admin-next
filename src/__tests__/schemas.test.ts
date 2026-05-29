import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "@/modules/users/schemas/user.schema";
import { createProductSchema } from "@/modules/products/schemas/product.schema";

describe("user schemas", () => {
  describe("createUserSchema", () => {
    it("validates correct data", () => {
      const result = createUserSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "secret123",
        password_confirmation: "secret123",
        role: "admin",
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = createUserSchema.safeParse({
        name: "John",
        email: "not-an-email",
        password: "secret123",
        password_confirmation: "secret123",
        role: "admin",
        status: "active",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = createUserSchema.safeParse({
        name: "John",
        email: "john@test.com",
        password: "123",
        password_confirmation: "123",
        role: "admin",
        status: "active",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password mismatch", () => {
      const result = createUserSchema.safeParse({
        name: "John",
        email: "john@test.com",
        password: "secret123",
        password_confirmation: "different",
        role: "admin",
        status: "active",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateUserSchema", () => {
    it("requires all fields", () => {
      const result = updateUserSchema.safeParse({ name: "New Name", email: "a@b.com", role: "admin", status: "active" });
      expect(result.success).toBe(true);
    });

    it("rejects empty object", () => {
      const result = updateUserSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = updateUserSchema.safeParse({ name: "N", email: "bad", role: "admin", status: "active" });
      expect(result.success).toBe(false);
    });
  });
});

describe("product schema", () => {
  it("validates a valid product", () => {
    const result = createProductSchema.safeParse({
      name: "Test Product",
      price: 29.99,
      sku: "TP-001",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createProductSchema.safeParse({ price: 10 });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createProductSchema.safeParse({ name: "P", price: -5, sku: "S" });
    expect(result.success).toBe(false);
  });
});
