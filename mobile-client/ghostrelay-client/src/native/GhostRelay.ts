import * as Security from "../../modules/ghostrelay-security/src";

export type GhostRelayIdentity = {
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
};

export type EncryptionResult = {
  ciphertext: string;
  nonce: string;
};

/**
 * ============================================================
 * Identity
 * ============================================================
 *
 * React Native receives public identity information only.
 *
 * Private keys remain inside the native/Rust security boundary.
 */
export async function generateIdentity(): Promise<GhostRelayIdentity> {
  const identity = await Security.generateIdentity();

  if (
    !identity ||
    typeof identity.publicKey !== "string" ||
    typeof identity.signingPublicKey !== "string" ||
    typeof identity.fingerprint !== "string" ||
    identity.publicKey.length === 0 ||
    identity.signingPublicKey.length === 0 ||
    identity.fingerprint.length === 0
  ) {
    throw new Error(
      "Invalid identity returned from the GhostRelay security core."
    );
  }

  return identity;
}

/**
 * ============================================================
 * Encryption
 * ============================================================
 */

export async function encrypt(
  recipientPublicKey: string,
  plaintext: string
): Promise<EncryptionResult> {
  if (!recipientPublicKey) {
    throw new Error("Recipient public key is required.");
  }

  if (typeof plaintext !== "string") {
    throw new Error("Plaintext must be a string.");
  }

  return Security.encrypt(
    recipientPublicKey,
    plaintext
  );
}

/**
 * ============================================================
 * Decryption
 * ============================================================
 */

export async function decrypt(
  senderPublicKey: string,
  ciphertext: string,
  nonce: string
): Promise<string> {
  if (!senderPublicKey) {
    throw new Error("Sender public key is required.");
  }

  if (!ciphertext) {
    throw new Error("Ciphertext is required.");
  }

  if (!nonce) {
    throw new Error("Nonce is required.");
  }

  return Security.decrypt(
    senderPublicKey,
    ciphertext,
    nonce
  );
}

/**
 * ============================================================
 * Message signatures
 * ============================================================
 */

export async function signMessage(
  messageJson: string
): Promise<string> {
  if (!messageJson) {
    throw new Error("Message payload is required.");
  }

  return Security.signMessage(messageJson);
}

export async function verifyMessage(
  messageJson: string,
  signingPublicKey: string
): Promise<boolean> {
  if (!messageJson) {
    throw new Error("Message payload is required.");
  }

  if (!signingPublicKey) {
    throw new Error("Signing public key is required.");
  }

  return Security.verifyMessage(
    messageJson,
    signingPublicKey
  );
}

/**
 * ============================================================
 * Biometric authentication
 * ============================================================
 */

export const authenticate = Security.authenticate;

export const isBiometricAvailable =
  Security.isBiometricAvailable;