import React, { useState } from "react";

import {
  View,
  Text,
  Alert,
} from "react-native";

import { generateIdentity } from "../../../modules/ghostrelay-security/src";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import GhostLogo from "../../components/GhostLogo";

import { Colors } from "../../theme";
import { registerIdentity } from "../../api/identity";
import { useAuth } from "../../auth/AuthContext";

export default function IdentityScreen() {
  const { createSession } = useAuth();

  const [publicKey, setPublicKey] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerateIdentity() {
    console.log("=== GENERATE IDENTITY PRESSED ===");

    try {
      console.log("=== ABOUT TO CALL generateIdentity() ===");
  
      const result = await generateIdentity();
  
      console.log("=== generateIdentity RETURNED ===", result);
  
      // existing code...
    } catch (error) {
      console.error("=== IDENTITY CREATION ERROR ===", error);
    }

    if (loading) {
      console.log("=== GENERATE IDENTITY: ALREADY LOADING ===");
      return;
    }

    setLoading(true);

    try {
      /*
       * Generate the identity through the GhostRelay native
       * security module.
       *
       * The actual identity generation occurs inside the
       * Rust security core through the Kotlin bridge.
       *
       * React Native receives only:
       * - publicKey
       * - fingerprint
       *
       * The private key remains inside the native security layer.
       */

      console.log(
        "=== CALLING GhostRelay SECURITY MODULE ==="
      );

      const result = await generateIdentity();

      console.log(
        "=== RUST BRIDGE RESULT ===",
        result
      );

      /*
       * Validate the identity returned by the native layer.
       */

      if (
        !result ||
        typeof result.publicKey !== "string" ||
        typeof result.fingerprint !== "string" ||
        result.publicKey.length === 0 ||
        result.fingerprint.length === 0
      ) {
        throw new Error(
          "Invalid identity returned from the Rust security core."
        );
      }

      /*
       * Display the public identity information.
       */

      setPublicKey(result.publicKey);
      setFingerprint(result.fingerprint);

      /*
       * Register ONLY the public identity with the relay.
       *
       * The private key never leaves the native security layer.
       */

      console.log(
        "=== REGISTERING PUBLIC IDENTITY ==="
      );

      await registerIdentity({
        id: result.fingerprint,
        publicKey: result.publicKey,
      });

      console.log(
        "IDENTITY: registration successful"
      );

      /*
       * Create the application session.
       *
       * AuthContext will change the authentication state.
       * ApplicationGate then controls the transition into
       * the authenticated application.
       */

      console.log(
        "AUTH: createSession() START"
      );

      await createSession({
        publicKey: result.publicKey,
        fingerprint: result.fingerprint,
      });

      console.log(
        "IDENTITY: createSession() completed"
      );

      /*
       * Do not manually navigate here.
       *
       * ApplicationGate owns the authentication transition.
       */

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
          Your private key never leaves your device.
        </Text>

        <Card>
          <Text
            style={{
              color: Colors.primary,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            Public Key
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
