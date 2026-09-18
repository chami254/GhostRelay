import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import QRCode from "react-native-qrcode-svg";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";

import type {
  RootStackParamList,
} from "../../navigation/types";

import { useAuth } from "../../auth/AuthContext";

import styles from "./MyQRCodeScreen.styles";

type MyQRCodeNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface GhostRelayIdentity {
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
}

export default function MyQRCodeScreen() {
  const navigation =
    useNavigation<MyQRCodeNavigationProp>();

  const {
    identity: sessionIdentity,
  } = useAuth();

  const [identity, setIdentity] =
    useState<GhostRelayIdentity | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    void loadIdentity();
  }, [sessionIdentity]);

  const loadIdentity = async () => {
    try {
      setLoading(true);

      if (
        !sessionIdentity?.publicKey ||
        !sessionIdentity.fingerprint ||
        !sessionIdentity.signingPublicKey
      ) {
        throw new Error(
          "Complete GhostRelay identity is unavailable for this session."
        );
      }

      setIdentity({
        publicKey:
          sessionIdentity.publicKey.trim(),

        signingPublicKey:
          sessionIdentity.signingPublicKey.trim(),

        fingerprint:
          sessionIdentity.fingerprint
            .trim()
            .toUpperCase(),
      });
    } catch (error) {
      console.error(
        "Failed to load GhostRelay identity:",
        error
      );

      Alert.alert(
        "Identity Error",
        "Unable to load your complete GhostRelay identity."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * QR payload contains public identity only.
   *
   * No private key.
   * No session token.
   * No password.
   */
  const qrPayload = identity
    ? JSON.stringify({
        type: "ghostrelay-identity",
        version: 1,
        publicKey: identity.publicKey,
        signingPublicKey:
          identity.signingPublicKey,
        fingerprint:
          identity.fingerprint,
      })
    : "";

  if (loading) {
    return (
      <Screen>
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color="#10D6B3"
          />

          <Text
            style={styles.loadingText}
          >
            Loading your identity...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!identity) {
    return (
      <Screen>
        <View style={styles.screen}>
          <Header
            title="My QR Code"
            onBack={() =>
              navigation.goBack()
            }
          />

          <View
            style={styles.errorContainer}
          >
            <Text
              style={styles.errorTitle}
            >
              Identity Unavailable
            </Text>

            <Text
              style={styles.errorText}
            >
              GhostRelay could not load your
              complete public identity.
            </Text>

            <PrimaryButton
              title="Try Again"
              onPress={loadIdentity}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="My QR Code"
          onBack={() =>
            navigation.goBack()
          }
        />

        <View style={styles.content}>
          <Text style={styles.heading}>
            Your GhostRelay Identity
          </Text>

          <Text
            style={styles.description}
          >
            Let another GhostRelay user scan
            this code to add you as a trusted
            contact.
          </Text>

          <Card>
            <View
              style={styles.qrContainer}
            >
              <QRCode
                value={qrPayload}
                size={240}
                backgroundColor="#FFFFFF"
                color="#081018"
              />
            </View>

            <Text style={styles.qrLabel}>
              Scan this code to exchange
              identities
            </Text>
          </Card>

          <Card>
            <Text
              style={styles.sectionTitle}
            >
              X25519 Public Key
            </Text>

            <Text
              style={styles.publicKey}
              selectable
            >
              {identity.publicKey}
            </Text>

            <Text
              style={styles.sectionTitle}
            >
              Ed25519 Signing Public Key
            </Text>

            <Text
              style={styles.publicKey}
              selectable
            >
              {identity.signingPublicKey}
            </Text>

            <Text
              style={styles.sectionTitle}
            >
              Fingerprint
            </Text>

            <Text
              style={styles.fingerprint}
              selectable
            >
              {identity.fingerprint}
            </Text>
          </Card>

          <View
            style={styles.securityNotice}
          >
            <Text
              style={styles.securityTitle}
            >
              🔐 Public identity only
            </Text>

            <Text
              style={styles.securityText}
            >
              This QR code contains only public
              identity information. Private
              cryptographic material is never
              included.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}