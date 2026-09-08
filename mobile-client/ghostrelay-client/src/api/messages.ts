import { apiFetch } from "./client";
import type {
  RelayRequest,
} from "./types";

export interface SecureMessage {
  id: string;
  sender: string;
  body: string;
}

export interface InboxMessage {
  id: string;
  sender: string;
  received: string;
  expiresIn: string;
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
  message: RelayRequest
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>(
    "/messages",
    {
      method: "POST",
      body: JSON.stringify(message),
    }
  );
}