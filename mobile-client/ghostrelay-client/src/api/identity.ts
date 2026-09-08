import { apiFetch } from "./client";
import type { Identity } from "./types";

export async function registerIdentity(
  identity: Identity
): Promise<Identity> {
  return apiFetch<Identity>("/identity", {
    method: "POST",
    body: JSON.stringify(identity),
  });
}