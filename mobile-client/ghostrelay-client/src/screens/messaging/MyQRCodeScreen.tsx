import React, { useEffect, useState } from "react";

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
  fingerprint?: string;
}

export default function MyQRCodeScreen() {
  const navigation =
    useNavigation<MyQRCodeNavigationProp>();

  const { identity: sessionIdentity } =
    useAuth();

  const [identity, setIdentity] =
    useState<GhostRelayIdentity | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadIdentity();
  }, []);

  const loadIdentity = async () => {
    try {
      setLoading(true);

      if (!sessionIdentity?.publicKey) {
        throw new Error(
          "No identity available for this session."
        );
      }

      setIdentity({
        publicKey: sessionIdentity.publicKey.trim(),

        fingerprint:
          typeof sessionIdentity.fingerprint === "string"
            ? sessionIdentity.fingerprint
            : undefined,
      });
    } catch (error) {
      console.error(
        "Failed to load GhostRelay identity:",
        error
      );

      Alert.alert(
        "Identity Error",
        "Unable to load your GhostRelay identity."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * The QR code contains ONLY public identity
   * information.
   *
   * Never place a private key, session token,
   * password, or other secret material inside
   * the QR payload.
   */

  const qrPayload = identity
    ? JSON.stringify({
        type: "ghostrelay-identity",
        version: 1,
        publicKey: identity.publicKey,
      })
    : "";

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#10D6B3"
          />

          <Text style={styles.loadingText}>
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
            onBack={() => navigation.goBack()}
          />

          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>
              Identity Unavailable
            </Text>

            <Text style={styles.errorText}>
              GhostRelay could not load your public
              identity. Please try again.
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="My QR Code"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.content}>
          <Text style={styles.heading}>
            Your GhostRelay Identity
          </Text>

          <Text style={styles.description}>
            Let another GhostRelay user scan this code
            to add you as a trusted contact.
          </Text>

          <Card>
            <View style={styles.qrContainer}>
              <QRCode
                value={qrPayload}
                size={240}
                backgroundColor="#FFFFFF"
                color="#081018"
              />
            </View>

            <Text style={styles.qrLabel}>
              Scan this code to exchange identities
            </Text>
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>
              Public Key
            </Text>

            <Text
              style={styles.publicKey}
              selectable
            >
              {identity.publicKey}
            </Text>

            {identity.fingerprint && (
              <>
                <Text style={styles.sectionTitle}>
                  Fingerprint
                </Text>

                <Text
                  style={styles.fingerprint}
                  selectable
                >
                  {identity.fingerprint}
                </Text>
              </>
            )}
          </Card>

          <View style={styles.securityNotice}>
            <Text style={styles.securityTitle}>
              🔐 Public identity only
            </Text>

            <Text style={styles.securityText}>
              This QR code contains your public identity
              information. Your private cryptographic
              material is never included.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}