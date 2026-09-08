import type { NavigatorScreenParams } from "@react-navigation/native";

/* ---------------- AUTH ---------------- */

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Identity: undefined;
};

/* ---------------- TABS ---------------- */

export type TabParamList = {
  Home: undefined;
  Inbox: undefined;
  Contacts: undefined;
  Settings: undefined;
};

/* ---------------- SHARED DATA ---------------- */

export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  fingerprint: string;
}

/* ---------------- MAIN APPLICATION ---------------- */

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;

  Compose: {
    contact: Contact;
  };

  AddContact:
    | {
        publicKey?: string;
      }
    | undefined;

  QRScanner: undefined;

  ContactAdded: {
    contact: Contact;
  };

  Viewer: {
    messageId: string;
  };

  Expired: undefined;

  About: undefined;
};