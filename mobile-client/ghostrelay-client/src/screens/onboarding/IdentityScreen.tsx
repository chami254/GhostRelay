import React, { useState } from "react";
import {
  NativeModules,
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
import { registerIdentity } from "../../api/identity";
import { useAuth } from "../../auth/AuthContext";

interface RustIdentityResult {
  publicKey: string;
  fingerprint: string;
}

interface GhostRelaySecurityModule {
  generateIdentity: () =>
    Promise<RustIdentityResult | string>;
}

export default function IdentityScreen() {
  const { createSession } = useAuth();

  const security =
    NativeModules.GhostRelaySecurity as
      | GhostRelaySecurityModule
      | undefined;

  const [publicKey, setPublicKey] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerateIdentity() {
    if (loading) {
      return;
    }

    if (!security) {
      Alert.alert(
        "Security Core Unavailable",
        "The GhostRelay security module is not available on this device."
      );
      return;
    }

    if (
      typeof security.generateIdentity !== "function"
    ) {
      Alert.alert(
        "Security Core Error",
        "The GhostRelay identity generation function is unavailable."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Generate the identity inside the Rust security core.
       *
       * The private key remains inside the native security layer.
       * React Native receives only the public identity information.
       */
      const rawResult =
        await security.generateIdentity();

      console.log(
        "RUST BRIDGE RESULT:",
        rawResult
      );

      /*
       * The native bridge currently returns a React Native
       * object, but we continue supporting a JSON string in
       * case the native implementation changes.
       */
      let result: RustIdentityResult;

      if (typeof rawResult === "string") {
        try {
          result = JSON.parse(rawResult);
        } catch {
          throw new Error(
            "The Rust security core returned invalid identity data."
          );
        }
      } else {
        result = rawResult;
      }

      /*
       * Validate the public identity before doing anything
       * with it.
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
       * AuthContext will change the status to "authenticated".
       * ApplicationGate will then automatically replace the
       * onboarding navigator with MainNavigator.
       */
      console.log(
        "AUTH: createSession() START"
      );

      await createSession();

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
        "IDENTITY CREATION ERROR:",
        error
      );

      Alert.alert(
        "Identity Creation Failed",
        error instanceof Error
          ? error.message
          : "Unable to create your GhostRelay identity."
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