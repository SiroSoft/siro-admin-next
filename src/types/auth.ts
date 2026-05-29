import type { components } from "@/types/api";

export type User = NonNullable<components["schemas"]["User"]>;
export type LoginRequest = components["schemas"]["LoginRequest"];
export type LoginResponse = components["schemas"]["AuthTokenResponse"];
export type RefreshTokenResponse = components["schemas"]["AuthTokenResponse"];
