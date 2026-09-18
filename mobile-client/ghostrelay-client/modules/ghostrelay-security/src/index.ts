import GhostRelaySecurityModule from './GhostRelaySecurityModule';

import type {
  Identity,
  EncryptionResult,
  AuthenticationResult,
} from './GhostRelaySecurity.types';

export type {
  Identity,
  EncryptionResult,
  AuthenticationResult,
} from './GhostRelaySecurity.types';

export function isBiometricAvailable(): boolean {
  return GhostRelaySecurityModule.isBiometricAvailable();
}

export function authenticate(): Promise<AuthenticationResult> {
  return GhostRelaySecurityModule.authenticate();
}

export function generateIdentity(): Promise<Identity> {
  return GhostRelaySecurityModule.generateIdentity();
}

export function encrypt(
  recipientPublicKey: string,
  plaintext: string
): Promise<EncryptionResult> {
  return GhostRelaySecurityModule.encrypt(
    recipientPublicKey,
    plaintext
  );
}

export function decrypt(
  senderPublicKey: string,
  ciphertext: string,
  nonce: string
): Promise<string> {
  return GhostRelaySecurityModule.decrypt(
    senderPublicKey,
    ciphertext,
    nonce
  );
}

export function signMessage(
  messageJson: string
): Promise<string> {
  return GhostRelaySecurityModule.signMessage(
    messageJson
  );
}

export function verifyMessage(
  messageJson: string,
  signingPublicKey: string
): Promise<boolean> {
  return GhostRelaySecurityModule.verifyMessage(
    messageJson,
    signingPublicKey
  );
}