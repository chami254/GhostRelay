import React, { useState } from "react";

import {
  View,
  Text,
  Alert,
} from "react-native";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import GhostLogo from "../../components/GhostLogo";
import { Colors } from "../../theme";

import {
  generateIdentity,
  registerIdentity,
  validateIdentity,
} from "../../api/identity";

import { useAuth } from "../../auth/AuthContext";

export default function IdentityScreen() {
  const { createSession } = useAuth();

  const [publicKey, setPublicKey] = useState("");
  const [signingPublicKey, setSigningPublicKey] =
    useState("");
  const [fingerprint, setFingerprint] =
    useState("");

  const [loading, setLoading] = useState(false);

  async function handleGenerateIdentity() {
    if (loading) {
      console.log(
        "=== GENERATE IDENTITY: ALREADY LOADING ==="
      );
      return;
    }

    setLoading(true);

    try {
      console.log(
        "=== GENERATE IDENTITY PRESSED ==="
      );

      /*
       * ========================================================
       * Generate cryptographic identity
       * ========================================================
       *
       * The actual key generation occurs inside the
       * GhostRelay Rust security core.
       *
       * React Native receives public identity information only.
       */
      console.log(
        "=== CALLING GHOSTRELAY SECURITY MODULE ==="
      );

      const result = await generateIdentity();

      console.log(
        "=== RUST BRIDGE RESULT ===",
        result
      );

      /*
       * ========================================================
       * Validate identity
       * ========================================================
       */

      if (!validateIdentity(result)) {
        throw new Error(
          "Invalid identity returned from the Rust security core."
        );
      }

      /*
       * ========================================================
       * Update UI
       * ========================================================
       */

      setPublicKey(result.publicKey);
      setSigningPublicKey(
        result.signingPublicKey
      );
      setFingerprint(result.fingerprint);

      /*
       * ========================================================
       * Register public identity with relay
       * ========================================================
       *
       * Only public identity information is sent.
       *
       * Private keys never enter this request.
       */
      console.log(
        "=== REGISTERING PUBLIC IDENTITY ==="
      );

      await registerIdentity({
        id: result.fingerprint,
        publicKey: result.publicKey,
        signingPublicKey:
          result.signingPublicKey,
      });

      console.log(
        "IDENTITY: registration successful"
      );

      /*
       * ========================================================
       * Create application session
       * ========================================================
       *
       * The application session only needs the public
       * identity information required by session.ts.
       *
       * Private cryptographic material remains inside Rust.
       */
      console.log(
        "AUTH: createSession() START"
      );

      await createSession({
        publicKey: result.publicKey,
        fingerprint: result.fingerprint,
        signingPublicKey: result.signingPublicKey,
      });

      console.log(
        "IDENTITY: createSession() completed"
      );
    } catch (error) {
      console.error(
        "=== IDENTITY CREATION ERROR ===",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : String(error);

      console.error(
        "=== IDENTITY ERROR MESSAGE ===",
        message
      );

      Alert.alert(
        "Identity Creation Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header title="Identity" />

      <View
        style={{
          flex: 1,
          padding: 24,
        }}
      >
        <GhostLogo />

        <Text
          style={{
            color: Colors.text,
            fontSize: 26,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Create Your Identity
        </Text>

        <Text
          style={{
            color: Colors.textSecondary,
            textAlign: "center",
            marginTop: 12,
            marginBottom: 24,
          }}
        >
          Your identity is generated locally.
          {"\n"}
          Your private keys never leave your device.
        </Text>

        <Card>
          <Text
            style={{
              color: Colors.primary,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            X25519 Public Key
          </Text>

          <Text
            style={{
              color: Colors.text,
            }}
            selectable
          >
            {publicKey || "Tap Generate Identity"}
          </Text>
        </Card>

        <Card>
          <Text
            style={{
              color: Colors.primary,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            Ed25519 Signing Public Key
          </Text>

          <Text
            style={{
              color: Colors.text,
            }}
            selectable
          >
            {signingPublicKey || "--"}
          </Text>
        </Card>

        <Card>
          <Text
            style={{
              color: Colors.primary,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            Fingerprint
          </Text>

          <Text
            style={{
              color: Colors.text,
            }}
            selectable
          >
            {fingerprint || "--:--:--:--"}
          </Text>
        </Card>

        <View
          style={{
            marginTop: 24,
          }}
        >
          <PrimaryButton
            title={
              loading
                ? "Creating Identity..."
                : "Generate Identity"
            }
            onPress={handleGenerateIdentity}
          />
        </View>
      </View>
    </Screen>
  );
}