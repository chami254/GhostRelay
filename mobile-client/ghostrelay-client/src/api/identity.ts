import { apiFetch } from "./client";
import type { Identity } from "./types";
import {
  generateIdentity as generateGhostRelayIdentity,
} from "../native/GhostRelay";

export async function generateIdentity(): Promise<{
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
}> {
  return generateGhostRelayIdentity();
}

export async function registerIdentity(
  identity: Identity
): Promise<Identity> {
  if (!identity.id) {
    throw new Error("Identity ID is required.");
  }

  if (!identity.publicKey) {
    throw new Error("Identity public key is required.");
  }

  if (!identity.signingPublicKey) {
    throw new Error(
      "Identity signing public key is required."
    );
  }

  return apiFetch<Identity>("/identity", {
    method: "POST",
    body: JSON.stringify({
      id: identity.id,
      publicKey: identity.publicKey,
      signingPublicKey: identity.signingPublicKey,
    }),
  });
}

export function validateIdentity(
  identity: {
    publicKey: string;
    signingPublicKey: string;
    fingerprint: string;
  }
): boolean {
  return (
    typeof identity.publicKey === "string" &&
    identity.publicKey.length > 0 &&
    typeof identity.signingPublicKey === "string" &&
    identity.signingPublicKey.length > 0 &&
    typeof identity.fingerprint === "string" &&
    identity.fingerprint.length > 0
  );
}