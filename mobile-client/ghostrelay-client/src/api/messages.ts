import { apiFetch } from "./client";

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

export async function getInbox(): Promise<InboxMessage[]> {

  return apiFetch("/messages");

}

export async function getMessage(
  messageId: string
): Promise<SecureMessage> {

  return apiFetch(`/messages/${messageId}`);

}

export async function deleteMessage(
  messageId: string
): Promise<void> {

  await fetch(
    `http://192.168.1.100:8080/messages/${messageId}`,
    {
      method: "DELETE",
    }
  );

}

export async function sendMessage(
  recipient: string,
  ciphertext: string
) {

  return apiFetch("/messages", {

    method: "POST",

    body: JSON.stringify({

      recipient,

      ciphertext,

    }),

  });

}