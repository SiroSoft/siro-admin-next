import { describe, it, expect } from "vitest";
import { cn, formatDate, formatRelativeTime, formatNumber } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2026-05-29T12:00:00Z");
    expect(result).toContain("2026");
  });

  it("returns empty for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("returns empty for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("returns empty for invalid date", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  it('returns "just now" for recent dates', () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe("just now");
  });

  it('returns minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toMatch(/5m ago|minutes? ago/);
  });

  it("returns empty for null", () => {
    expect(formatRelativeTime(null)).toBe("");
  });
});

describe("formatNumber", () => {
  it("formats a number with commas", () => {
    expect(formatNumber(1234)).toBe("1,234");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("formats large numbers", () => {
    expect(formatNumber(1000000)).toBe("1,000,000");
  });
});
