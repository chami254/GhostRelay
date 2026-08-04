import { NativeModules } from "react-native";

const { GhostRelay } = NativeModules;

export interface Identity {
  publicKey: string;
  fingerprint: string;
}

export async function generateIdentity(): Promise<Identity> {
  const result = await GhostRelay.generateIdentity();

  if (!result) {
    throw new Error("GhostRelay returned an empty identity.");
  }

  return JSON.parse(result);
}