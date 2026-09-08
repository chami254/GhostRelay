import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import Card from "../../components/Card";
import SettingsItem from "../../components/SettingsItem";

import { useAuth } from "../../auth/AuthContext";
import { API_BASE_URL } from "../../api/client";

import styles from "./SettingsScreen.styles";

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    isAuthenticated,
    isLocked,
    logout,
    lockSession,
  } = useAuth();

  const [locking, setLocking] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /*
   * --------------------------------------------------
   * SESSION
   * --------------------------------------------------
   */

  const handleLockSession = async () => {
    if (locking || isLocked) {
      return;
    }

    try {
      setLocking(true);
      await lockSession();
    } catch (error) {
      console.error("Failed to lock session:", error);

      Alert.alert(
        "Lock Failed",
        "Unable to lock the current GhostRelay session."
      );
    } finally {
      setLocking(false);
    }
  };

  const handleLogout = () => {
    if (loggingOut) {
      return;
    }

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
              setLoggingOut(true);
              await logout();
            } catch (error) {
              console.error("Logout failed:", error);

              Alert.alert(
                "Logout Failed",
                "Unable to end the current session."
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  /*
   * --------------------------------------------------
   * UNAVAILABLE FEATURES
   * --------------------------------------------------
   */

  const showUnavailable = (
    title: string,
    message?: string
  ) => {
    Alert.alert(
      title,
      message ??
        "This feature is not available yet."
    );
  };

  /*
   * --------------------------------------------------
   * NAVIGATION
   * --------------------------------------------------
   */

  const openContacts = () => {
    navigation.navigate("Tabs", {
      screen: "Contacts",
    });
  };

  const openInbox = () => {
    navigation.navigate("Tabs", {
      screen: "Inbox",
    });
  };

  const openAbout = () => {
    navigation.navigate("About");
  };

  /*
   * --------------------------------------------------
   * STATUS
   * --------------------------------------------------
   */

  const sessionStatus = isLocked
    ? "Locked"
    : isAuthenticated
      ? "Authenticated"
      : "Not authenticated";

  const sessionStatusIcon = isLocked
    ? "lock-closed"
    : isAuthenticated
      ? "checkmark-circle"
      : "alert-circle";

  const sessionStatusColor = isLocked
    ? "#FFB84D"
    : isAuthenticated
      ? "#10D6B3"
      : "#FF5C5C";

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Settings"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.content}>

          {/* ------------------------------------------
              SYSTEM STATUS
          ------------------------------------------ */}

          <Card>
            <View style={styles.statusHeader}>
              <View style={styles.statusTitleContainer}>
                <Ionicons
                  name="pulse-outline"
                  size={20}
                  color={styles.statusIcon.color}
                />

                <Text style={styles.statusTitle}>
                  System Status
                </Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <Ionicons
                name={sessionStatusIcon}
                size={18}
                color={sessionStatusColor}
              />

              <Text style={styles.statusItem}>
                Session: {sessionStatus}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Ionicons
                name="key-outline"
                size={18}
                color={styles.statusIcon.color}
              />

              <Text style={styles.statusItem}>
                Identity: Generated
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={styles.statusIcon.color}
              />

              <Text style={styles.statusItem}>
                Encryption: Available
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Ionicons
                name="server-outline"
                size={18}
                color={styles.statusIcon.color}
              />

              <Text style={styles.statusItem}>
                Relay: {API_BASE_URL}
              </Text>
            </View>
          </Card>

          {/* ------------------------------------------
              IDENTITY & SECURITY
          ------------------------------------------ */}

          <Text style={styles.sectionTitle}>
            IDENTITY & SECURITY
          </Text>

          <Card>
            <SettingsItem
              icon="person-outline"
              title="Identity"
              subtitle="Manage your GhostRelay identity"
              onPress={() =>
                showUnavailable(
                  "Identity Management",
                  "Identity management will be connected to the Rust identity layer during the final integration pass."
                )
              }
            />

            <SettingsItem
              icon="key-outline"
              title="Export Public Key"
              subtitle="Share your public identity"
              onPress={() =>
                showUnavailable(
                  "Export Public Key",
                  "Public-key export will be enabled once the identity sharing flow is connected."
                )
              }
            />

            <SettingsItem
              icon="qr-code-outline"
              title="My QR Code"
              subtitle="Display your public identity"
              onPress={() =>
                showUnavailable(
                  "My QR Code",
                  "Your identity QR display will be enabled during the identity-sharing integration."
                )
              }
            />

            <SettingsItem
              icon="shield-checkmark-outline"
              title="Security"
              subtitle="Encryption and secure-session settings"
              onPress={() =>
                showUnavailable(
                  "Security",
                  "Security preferences will be available after the encryption settings layer is finalized."
                )
              }
            />
          </Card>

          {/* ------------------------------------------
              MESSAGES & CONTACTS
          ------------------------------------------ */}

          <Text style={styles.sectionTitle}>
            MESSAGES & CONTACTS
          </Text>

          <Card>
            <SettingsItem
              icon="people-outline"
              title="Contacts"
              subtitle="Manage trusted contacts"
              onPress={openContacts}
            />

            <SettingsItem
              icon="mail-outline"
              title="Inbox"
              subtitle="View encrypted messages"
              onPress={openInbox}
            />
          </Card>

          {/* ------------------------------------------
              RELAY
          ------------------------------------------ */}

          <Text style={styles.sectionTitle}>
            RELAY
          </Text>

          <Card>
            <SettingsItem
              icon="server-outline"
              title="Relay Server"
              subtitle={API_BASE_URL}
              onPress={() =>
                showUnavailable(
                  "Relay Server",
                  "Relay configuration is currently controlled by the application environment."
                )
              }
            />

            <SettingsItem
              icon="wifi-outline"
              title="Connection Status"
              subtitle="Check relay connectivity"
              onPress={() =>
                showUnavailable(
                  "Connection Status",
                  "A live relay health check will be connected during the server integration pass."
                )
              }
            />
          </Card>

          {/* ------------------------------------------
              APPLICATION
          ------------------------------------------ */}

          <Text style={styles.sectionTitle}>
            APPLICATION
          </Text>

          <Card>
            <SettingsItem
              icon="color-palette-outline"
              title="Appearance"
              subtitle="Theme preferences"
              onPress={() =>
                showUnavailable(
                  "Appearance",
                  "Theme customization is not enabled yet."
                )
              }
            />

            <SettingsItem
              icon="information-circle-outline"
              title="About"
              subtitle="GhostRelay information"
              onPress={openAbout}
            />
          </Card>

          {/* ------------------------------------------
              SESSION
          ------------------------------------------ */}

          <Text style={styles.sectionTitle}>
            SESSION
          </Text>

          <Card>
            <SettingsItem
              icon="lock-closed-outline"
              title={
                locking
                  ? "Locking..."
                  : isLocked
                    ? "Session Locked"
                    : "Lock Session"
              }
              subtitle={
                isLocked
                  ? "Your current session is locked"
                  : "Lock the current GhostRelay session"
              }
              onPress={handleLockSession}
            />

            <SettingsItem
              icon="log-out-outline"
              title={
                loggingOut
                  ? "Logging Out..."
                  : "Log Out"
              }
              subtitle="End the current GhostRelay session"
              onPress={handleLogout}
            />
          </Card>

          {/* ------------------------------------------
              VERSION
          ------------------------------------------ */}

          <View style={styles.footer}>
            <Text style={styles.version}>
              GhostRelay
            </Text>

            <Text style={styles.versionDetail}>
              v1.0.0
            </Text>

            <Text style={styles.environment}>
              Secure messaging prototype
            </Text>
          </View>

        </View>
      </ScrollView>
    </Screen>
  );
}