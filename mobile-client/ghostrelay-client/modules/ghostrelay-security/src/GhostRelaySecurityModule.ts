import { NativeModule, requireNativeModule } from 'expo';

import type {
  Identity,
  EncryptionResult,
  AuthenticationResult,
  GhostRelaySecurityModuleEvents,
} from './GhostRelaySecurity.types';

declare class GhostRelaySecurityModule
  extends NativeModule<GhostRelaySecurityModuleEvents> {

  isBiometricAvailable(): boolean;

  authenticate(): Promise<AuthenticationResult>;

  generateIdentity(): Promise<Identity>;

  encrypt(
    recipientPublicKey: string,
    plaintext: string
  ): Promise<EncryptionResult>;

  decrypt(
    senderPublicKey: string,
    ciphertext: string,
    nonce: string
  ): Promise<string>;

  signMessage(
    messageJson: string
  ): Promise<string>;

  verifyMessage(
    messageJson: string,
    signingPublicKey: string
  ): Promise<boolean>;
}

export default requireNativeModule<GhostRelaySecurityModule>(
  'GhostRelaySecurity'
);