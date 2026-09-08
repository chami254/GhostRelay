import { apiFetch } from "./client";

export interface ContactRequest {
  publicKey: string;
}

export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  fingerprint: string;
}

export async function saveContact(
  request: ContactRequest
): Promise<Contact> {
  return apiFetch<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>("/contacts");
}