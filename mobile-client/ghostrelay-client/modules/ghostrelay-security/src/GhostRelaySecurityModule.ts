import { NativeModule, requireNativeModule } from "expo";

import type {
  Identity,
  AuthenticationResult,
  GhostRelaySecurityModuleEvents,
} from "./GhostRelaySecurity.types";

export type {
  Identity,
  AuthenticationResult,
} from "./GhostRelaySecurity.types";


declare class GhostRelaySecurityModule
  extends NativeModule<GhostRelaySecurityModuleEvents> {

  isBiometricAvailable(): boolean;

  authenticate(): Promise<AuthenticationResult>;

  generateIdentity(): Promise<Identity>;
}

export default requireNativeModule<GhostRelaySecurityModule>(
  "GhostRelaySecurity"
);