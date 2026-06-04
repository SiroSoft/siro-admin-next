import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8080",
  ...(process.env.ALLOWED_ORIGINS?.split(",") ?? []),
];

const ipRequests = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const refreshSchema = z.object({
  refresh_token: z.string().min(1, "refresh_token is required"),
});

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
    const isValidOrigin = ALLOWED_ORIGINS.some((o) => origin.startsWith(o));
    if (!isValidOrigin) {
      console.error(`[AUTH REFRESH] Blocked request from origin: ${origin}`);
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      console.error(`[AUTH REFRESH] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = refreshSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const { refresh_token } = parsed.data;

    const res = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[AUTH REFRESH] Upstream error ${res.status}: ${errorBody}`);
      return NextResponse.json(
        { message: "Token refresh failed" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[AUTH REFRESH] Unexpected error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
