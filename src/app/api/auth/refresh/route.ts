import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const res = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Token refresh failed" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
