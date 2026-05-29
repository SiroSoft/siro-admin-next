"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewUserRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/users"); }, [router]);
  return null;
}
