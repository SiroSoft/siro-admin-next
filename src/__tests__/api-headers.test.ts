import { describe, it, expect, afterEach } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";
import api from "@/services/api";

describe("api X-Siro-FE header", () => {
  const originalToken = process.env.NEXT_PUBLIC_FE_TOKEN;

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.NEXT_PUBLIC_FE_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_FE_TOKEN = originalToken;
    }
  });

  async function captureConfig(): Promise<InternalAxiosRequestConfig> {
    let captured: InternalAxiosRequestConfig | undefined;
    api.defaults.adapter = async (config) => {
      captured = config;
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };
    await api.get("/__header_probe__");
    if (!captured) throw new Error("adapter did not capture config");
    return captured;
  }

  function headerValue(config: InternalAxiosRequestConfig, name: string): unknown {
    const headers = config.headers as unknown as {
      get?: (n: string) => unknown;
      [key: string]: unknown;
    };
    if (headers && typeof headers.get === "function") return headers.get(name);
    return headers?.[name];
  }

  it("sets X-Siro-FE when NEXT_PUBLIC_FE_TOKEN is set", async () => {
    process.env.NEXT_PUBLIC_FE_TOKEN = "test-fe-token";
    const config = await captureConfig();
    expect(headerValue(config, "X-Siro-FE")).toBe("test-fe-token");
  });

  it("omits X-Siro-FE when NEXT_PUBLIC_FE_TOKEN is not set", async () => {
    delete process.env.NEXT_PUBLIC_FE_TOKEN;
    const config = await captureConfig();
    expect(headerValue(config, "X-Siro-FE")).toBeUndefined();
  });
});
