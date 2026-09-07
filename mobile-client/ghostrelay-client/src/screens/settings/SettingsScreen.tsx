import React from "react";

import {
  View,
  Text,
  ScrollView,
  Alert,
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
import SettingsItem from "../../components/SettingsItem";

import { useAuth } from "../../auth/AuthContext";

import styles from "./SettingsScreen.styles";

export default function SettingsScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const {
    isAuthenticated,
    isLocked,
    logout,
    lockSession,
  } = useAuth();

  function comingSoon(title: string) {
    Alert.alert(
      title,
      "This feature will be enabled during the full backend integration."
    );
  }

  async function handleLockSession() {
    try {
      await lockSession();
    } catch (error) {
      console.error(
        "Failed to lock session:",
        error
      );

      Alert.alert(
        "Lock Failed",
        "Unable to lock the current session."
      );
    }
  }

  function handleLogout() {
    Alert.alert(
      "Log Out",
      "Are you sure you want to end your current GhostRelay session?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error(
                "Logout failed:",
                error
              );

              Alert.alert(
                "Logout Failed",
                "Unable to end the current session."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Settings"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.container}>
          <Card>
            <Text style={styles.statusTitle}>
              System Status
            </Text>

            <Text style={styles.statusItem}>
              {isAuthenticated
                ? "🟢 Session Authenticated"
                : "🔴 Session Not Authenticated"}
            </Text>

            <Text style={styles.statusItem}>
              🟢 Identity Generated
            </Text>

            <Text style={styles.statusItem}>
              🟢 Encryption Engine Ready
            </Text>

            <Text style={styles.statusItem}>
              🟡 Relay Connection Pending
            </Text>

            <Text style={styles.statusItem}>
              🟢 Secure Storage Ready
            </Text>

            {isLocked && (
              <Text style={styles.statusItem}>
                🔒 Session Locked
              </Text>
            )}
          </Card>

          <SettingsItem
            icon="person-outline"
            title="Identity"
            subtitle="Identity management will be available here"
            onPress={() =>
              comingSoon("Identity")
            }
          />

          <SettingsItem
            icon="people-outline"
            title="Contacts"
            subtitle="Manage trusted contacts"
            onPress={() =>
              navigation.navigate("Tabs", {
                screen: "Contacts",
              })
            }
          />

          <SettingsItem
            icon="mail-outline"
            title="Inbox"
            subtitle="View encrypted messages"
            onPress={() =>
              navigation.navigate("Tabs", {
                screen: "Inbox",
              })
            }
          />

          <SettingsItem
            icon="server-outline"
            title="Relay Server"
            subtitle="Relay configuration"
            onPress={() =>
              comingSoon("Relay Server")
            }
          />

          <SettingsItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Encryption preferences"
            onPress={() =>
              comingSoon("Security")
            }
          />

          <SettingsItem
            icon="key-outline"
            title="Export Public Key"
            subtitle="Share your identity"
            onPress={() =>
              comingSoon("Export Public Key")
            }
          />

          <SettingsItem
            icon="qr-code-outline"
            title="My QR Code"
            subtitle="Display your public identity"
            onPress={() =>
              comingSoon("QR Identity")
            }
          />

          <SettingsItem
            icon="color-palette-outline"
            title="Appearance"
            subtitle="Theme preferences"
            onPress={() =>
              comingSoon("Appearance")
            }
          />

          <SettingsItem
            icon="lock-closed-outline"
            title="Lock Session"
            subtitle="Lock the current GhostRelay session"
            onPress={handleLockSession}
          />

          <SettingsItem
            icon="log-out-outline"
            title="Log Out"
            subtitle="End the current GhostRelay session"
            onPress={handleLogout}
          />

          <SettingsItem
            icon="information-circle-outline"
            title="About"
            subtitle="GhostRelay information"
            onPress={() =>
              navigation.navigate("About")
            }
          />

          <Text style={styles.version}>
            GhostRelay v1.0.0 Prototype
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}