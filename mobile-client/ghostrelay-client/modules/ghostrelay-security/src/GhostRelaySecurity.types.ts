export interface Identity {
  publicKey: string;
  fingerprint: string;
}

export type AuthenticationResult = {
  authenticated: boolean;
  method: string;
};

export type GhostRelaySecurityModuleEvents = {};