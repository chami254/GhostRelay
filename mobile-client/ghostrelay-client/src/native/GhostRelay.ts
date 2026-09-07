import * as Security from "../../modules/ghostrelay-security/src";

export const generateIdentity = Security.generateIdentity;
export const authenticate = Security.authenticate;
export const isBiometricAvailable =
  Security.isBiometricAvailable;