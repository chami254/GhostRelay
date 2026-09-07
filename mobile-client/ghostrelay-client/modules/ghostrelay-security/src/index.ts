import GhostRelaySecurityModule from "./GhostRelaySecurityModule";

import type {
  Identity,
  AuthenticationResult,
} from "./GhostRelaySecurity.types";

export type {
  Identity,
  AuthenticationResult,
} from "./GhostRelaySecurity.types";

export function isBiometricAvailable(): boolean {
  return GhostRelaySecurityModule.isBiometricAvailable();
}

export function authenticate(): Promise<AuthenticationResult> {
  return GhostRelaySecurityModule.authenticate();
}

export function generateIdentity(): Promise<Identity> {
  return GhostRelaySecurityModule.generateIdentity();
}