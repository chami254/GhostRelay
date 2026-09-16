import type { StyleProp, ViewStyle } from 'react-native';

export type Identity = {
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
};

export type AuthenticationResult = {
  authenticated: boolean;
  method: 'biometric' | 'failed' | 'error' | 'unavailable';
  errorCode?: number;
  message?: string;
};

export type GhostRelaySecurityModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type OnTapEventPayload = Record<string, never>;

export type GhostRelaySecurityViewProps = {
  onTap: (event: { nativeEvent: OnTapEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};