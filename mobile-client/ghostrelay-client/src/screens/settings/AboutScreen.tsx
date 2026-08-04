import React from "react";
import {
  ScrollView,
  Text,
} from "react-native";

import {
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import type {
  RootStackParamList,
} from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import Card from "../../components/Card";

import styles from "./AboutScreen.styles";



export default function AboutScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (

    <Screen>
      

      <Header
        title="About GhostRelay"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Card>

          <Text style={styles.appName}>
            GhostRelay
          </Text>

          <Text style={styles.tagline}>
            Secure • Ephemeral • Zero Trust
          </Text>

          <Text style={styles.version}>
            Version 1.0.0 (Prototype)
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            Mission
          </Text>

          <Text style={styles.body}>
            GhostRelay is a zero-trust messaging platform
            designed for secure, temporary communication.
            Messages are encrypted locally, transmitted
            through an untrusted relay, retrieved once,
            and permanently destroyed after viewing.
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            Security Features
          </Text>

          <Text style={styles.feature}>
            ✓ End-to-End Encryption
          </Text>

          <Text style={styles.feature}>
            ✓ Read Once Messaging
          </Text>

          <Text style={styles.feature}>
            ✓ Self-Destructing Payloads
          </Text>

          <Text style={styles.feature}>
            ✓ QR Identity Exchange
          </Text>

          <Text style={styles.feature}>
            ✓ Local Key Generation
          </Text>

          <Text style={styles.feature}>
            ✓ Zero Permanent Chat History
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            System Architecture
          </Text>

          <Text style={styles.body}>
            • React Native Client{"\n"}
            • Rust Security Core{"\n"}
            • Go Relay Server{"\n"}
            • Temporary In-Memory Storage{"\n"}
            • Local Identity Management
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            Cryptography
          </Text>

          <Text style={styles.body}>
            • X25519 Key Exchange{"\n"}
            • XChaCha20-Poly1305 Encryption{"\n"}
            • Ed25519 Digital Signatures{"\n"}
            • Secure Random Identity Generation{"\n"}
            • Fingerprint Verification
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            Technology Stack
          </Text>

          <Text style={styles.body}>
            Frontend{"\n"}
            React Native + Expo{"\n\n"}

            Backend{"\n"}
            Go + Gin{"\n\n"}

            Security{"\n"}
            Rust{"\n\n"}

            Mobile{"\n"}
            TypeScript
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            Message Lifecycle
          </Text>

          <Text style={styles.body}>
            Generate Identity{"\n"}
            ↓{"\n"}
            Encrypt Locally{"\n"}
            ↓{"\n"}
            Upload to Relay{"\n"}
            ↓{"\n"}
            Recipient Downloads{"\n"}
            ↓{"\n"}
            Decrypt Locally{"\n"}
            ↓{"\n"}
            Relay Deletes Payload{"\n"}
            ↓{"\n"}
            Message Destroyed
          </Text>

        </Card>

        <Card>

          <Text style={styles.sectionTitle}>
            Development
          </Text>

          <Text style={styles.body}>
            Bachelor of Computer Science{"\n"}
            Mount Kenya University{"\n\n"}

            Final Year Project{"\n\n"}

            GhostRelay demonstrates a secure,
            zero-trust messaging architecture
            combining Rust, Go and React Native.
          </Text>

        </Card>

        <Text style={styles.footer}>
          © 2026 GhostRelay • Privacy by Design
        </Text>

      </ScrollView>

    </Screen>

  );

}