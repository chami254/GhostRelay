import { apiFetch } from "./client";

export interface ContactRequest {
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
}

export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
  alias?: string;
  createdAt?: string;
}

export interface GhostRelayIdentityPayload {
  type: "ghostrelay-identity";
  version: 1;
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
}

export async function saveContact(
  request: ContactRequest
): Promise<Contact> {
  const contact = await apiFetch<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify({
      publicKey: request.publicKey,
      signingPublicKey:
        request.signingPublicKey,
      fingerprint: request.fingerprint,
    }),
  });

  /*
   * Preserve the cryptographic identity locally even if
   * the current relay response does not yet echo all
   * public identity fields.
   */
  return {
    ...contact,
    publicKey:
      contact.publicKey || request.publicKey,
    signingPublicKey:
      contact.signingPublicKey ||
      request.signingPublicKey,
    fingerprint:
      contact.fingerprint ||
      request.fingerprint,
  };
}

export async function getContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>("/contacts");
}