import React, { useState } from "react";

import {
  View,
  Text,
  Alert,
} from "react-native";

//import { useNavigation } from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type {
  AuthStackParamList,
} from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import GhostLogo from "../../components/GhostLogo";

import { Colors } from "../../theme";

import { registerIdentity } from "../../api/identity";

import { useAuth } from "../../auth/AuthContext";

export default function IdentityScreen() {
  /*const navigation =
    useNavigation<
      NativeStackNavigationProp<AuthStackParamList>
    >();*/

  const { createSession } = useAuth();

  const [publicKey, setPublicKey] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerateIdentity() {
    try {
      setLoading(true);

      /*
       * Temporary development identity.
       *
       * This will eventually be replaced by the
       * GhostRelay Rust security core.
       */

      const generatedPublicKey =
        crypto
          .randomUUID()
          .replace(/-/g, "")
          .toUpperCase();

      const generatedFingerprint =
        generatedPublicKey
          .substring(0, 16)
          .match(/.{1,2}/g)
          ?.join(":") ?? "";

      setPublicKey(generatedPublicKey);
      setFingerprint(generatedFingerprint);

      await registerIdentity({
        id: generatedFingerprint,
        publicKey: generatedPublicKey,
      });

      /*
       * Identity has now been registered.
       *
       * Create the application session.
       *
       * ApplicationGate will detect the authenticated
       * state and render MainNavigator automatically.
       */
      await createSession();

      Alert.alert(
        "Identity Created",
        "Your identity has been created successfully."
      );
    } catch (error) {
      console.error(
        "Identity creation failed:",
        error
      );

      Alert.alert(
        "Registration Failed",
        "Unable to create your GhostRelay identity."
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
          Your private key never leaves your device.
        </Text>

        <Card>
          <Text
            style={{
              color: Colors.primary,
              marginBottom: 8,
            }}
          >
            Public Key
          </Text>

          <Text
            style={{
              color: Colors.text,
            }}
          >
            {publicKey || "Tap Generate Identity"}
          </Text>
        </Card>

        <Card>
          <Text
            style={{
              color: Colors.primary,
              marginBottom: 8,
            }}
          >
            Fingerprint
          </Text>

          <Text
            style={{
              color: Colors.text,
            }}
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
                ? "Generating..."
                : "Generate Identity"
            }
            onPress={handleGenerateIdentity}
          />
        </View>
      </View>
    </Screen>
  );
}