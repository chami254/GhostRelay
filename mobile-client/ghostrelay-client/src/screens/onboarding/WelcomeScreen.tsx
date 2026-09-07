
import React from "react";
import {
  View,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import GhostLogo from "../../components/GhostLogo";
import FeatureCard from "../../components/FeatureCard";
import PrimaryButton from "../../components/PrimaryButton";
import { Colors } from "../../theme";

export default function WelcomeScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AuthStackParamList>
    >();

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: "center",
        }}
      >
        <GhostLogo />

        <Text
          style={{
            color: Colors.text,
            fontSize: 28,
            fontWeight: "700",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Welcome to GhostRelay
        </Text>

        <Text
          style={{
            color: Colors.textSecondary,
            textAlign: "center",
            marginTop: 16,
            marginBottom: 30,
            lineHeight: 22,
          }}
        >
          A zero-trust ephemeral messaging relay through an
          untrusted server that temporarily stores encrypted
          payloads until they are securely delivered.
        </Text>

        <FeatureCard
          icon="key-outline"
          title="End-to-end encrypted using public-key cryptography"
        />

        <FeatureCard
          icon="shield-checkmark-outline"
          title="Messages self-destruct after reading"
        />

        <FeatureCard
          icon="lock-closed-outline"
          title="No phone number. No email. No centralized identity."
        />

        <View
          style={{
            marginTop: 28,
          }}
        >
          <PrimaryButton
            title="Begin Setup"
            onPress={() => navigation.navigate("Identity")}
          />
        </View>

        <Text
          style={{
            color: Colors.textSecondary,
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
          }}
        >
          No signup • No accounts • Open Source
        </Text>
      </View>
    </Screen>
  );
}