import type { components } from "@/types/api";

export type User = NonNullable<components["schemas"]["User"]>;
export type CreateUserRequest = components["schemas"]["CreateUserRequest"];
export type UpdateUserRequest = components["schemas"]["UpdateUserRequest"];
