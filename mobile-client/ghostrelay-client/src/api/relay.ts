import { apiFetch } from "./client";
import type { RelayRequest } from "./types";

export async function relayMessage(
  message: RelayRequest
): Promise<unknown> {
  return apiFetch<unknown>("/relay", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

export async function getMessages(
  receiverId: string
): Promise<unknown> {
  return apiFetch<unknown>(
    `/messages/${receiverId}`
  );
}