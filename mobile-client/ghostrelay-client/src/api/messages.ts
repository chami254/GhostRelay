import { apiFetch } from "./client";

import type {
  Message,
  RelayRequest,
} from "./types";

export interface SecureMessage extends Message {
  expiresAt?: string;
}

export interface InboxMessage extends Message {
  expiresAt: string;
}

export interface SendMessageResponse {
  id: string;
}

export async function getInbox(): Promise<InboxMessage[]> {
  return apiFetch<InboxMessage[]>("/messages");
}

export async function getMessage(
  messageId: string
): Promise<SecureMessage> {
  return apiFetch<SecureMessage>(
    `/messages/${messageId}`
  );
}

export async function deleteMessage(
  messageId: string
): Promise<void> {
  await apiFetch<void>(
    `/messages/${messageId}`,
    {
      method: "DELETE",
    }
  );
}

export async function sendMessage(
  request: RelayRequest
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>("/messages", {
    method: "POST",
    body: JSON.stringify(request),
  });
}