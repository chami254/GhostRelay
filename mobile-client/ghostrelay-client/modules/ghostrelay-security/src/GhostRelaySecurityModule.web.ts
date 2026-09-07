import {
  registerWebModule,
  NativeModule,
} from "expo";

class GhostRelaySecurityModule extends NativeModule<{}> {}

export default registerWebModule(
  GhostRelaySecurityModule,
  "GhostRelaySecurity"
);