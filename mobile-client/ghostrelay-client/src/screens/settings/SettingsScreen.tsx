import { ScrollView } from "react-native";
import React from "react";
import {
  View,
  Text,
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

import styles from "./SettingsScreen.styles";



export default function SettingsScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function comingSoon(title: string) {

    Alert.alert(
      title,
      "This feature will be enabled during the full backend integration."
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

        </Card>

        <SettingsItem
          icon="person-outline"
          title="Identity"
          subtitle="View your public key and fingerprint"
          onPress={() => navigation.navigate("Identity")}
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
          onPress={() => comingSoon("Relay Server")}
        />

        <SettingsItem
          icon="shield-checkmark-outline"
          title="Security"
          subtitle="Encryption preferences"
          onPress={() => comingSoon("Security")}
        />

        <SettingsItem
          icon="key-outline"
          title="Export Public Key"
          subtitle="Share your identity"
          onPress={() => comingSoon("Export Public Key")}
        />

        <SettingsItem
          icon="qr-code-outline"
          title="My QR Code"
          subtitle="Display your public identity"
          onPress={() => comingSoon("QR Identity")}
        />

        <SettingsItem
          icon="color-palette-outline"
          title="Appearance"
          subtitle="Theme preferences"
          onPress={() => comingSoon("Appearance")}
        />

        <SettingsItem
          icon="information-circle-outline"
          title="About"
          subtitle="GhostRelay information"
          onPress={() => navigation.navigate("About")}
        />

        <Text style={styles.version}>
          GhostRelay v1.0.0 Prototype
        </Text>

      </View>
      </ScrollView>

    </Screen>

  );

}