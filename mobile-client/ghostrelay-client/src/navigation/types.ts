import type {
  NavigatorScreenParams,
} from "@react-navigation/native";

/* ---------------- AUTH ---------------- */

export type AuthStackParamList = {

  Splash: undefined;

  Welcome: undefined;

  Identity: undefined;

  Main: undefined;

};

/* ---------------- TABS ---------------- */

export type TabParamList = {

  Home: undefined;

  Inbox: undefined;

  Contacts: undefined;

  Settings: undefined;

};

/* ---------------- MAIN ---------------- */
export interface Contact {

  id: string;

  name: string;

  publicKey: string;

  fingerprint: string;

}

export type RootStackParamList = {

  Tabs: NavigatorScreenParams<TabParamList>;
  

  Compose: {
    contact: Contact;
    receiverId: string;
    receiverName: string;
    fingerprint: string;
  };

  AddContact:
    | {
        publicKey?: string;
      }
    | undefined;

  QRScanner: undefined;

  ContactAdded: {
    contact: {
      id: string;
      name: string;
      publicKey: string;
      fingerprint: string;
    };
  };

  Viewer: {
    messageId: string;
  };

  Expired: undefined;

  About: undefined;

};

