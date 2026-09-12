"use client";

import { useAuthStore } from "@/store/auth.store";
import { DEMO_EMAIL } from "@/lib/constants";

/**
 * True when the signed-in user is the public read-only demo account.
 * Demo writes are blocked server-side (DemoGuard); UI uses this to
 * disable mutating affordances (e.g. uploads) with an explanation
 * instead of letting the click fail with a bare 403.
 */
export function useIsDemo(): boolean {
  const user = useAuthStore((s) => s.user);
  const email = typeof user?.email === "string" ? user.email.toLowerCase() : "";
  return email !== "" && email === DEMO_EMAIL.toLowerCase();
}
