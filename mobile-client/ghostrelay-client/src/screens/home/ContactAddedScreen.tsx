import React from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import PrimaryButton from "../../components/PrimaryButton";

import { Colors } from "../../theme";
import styles from "./ContactAddedScreen.styles";

export default function ContactAddedScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, "ContactAdded">>();

  const contact = route.params?.contact;

  function handleCompose() {
    if (!contact) {
      Alert.alert(
        "Contact Missing",
        "Unable to open the compose screen."
      );
      return;
    }

    navigation.navigate("Compose", {
      contact,
    });
  }

  function handleBackToHome() {
    navigation.navigate("Tabs", {
      screen: "Home",
    });
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="checkmark-circle"
              size={110}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Contact Added
          </Text>

          <Text style={styles.subtitle}>
            The contact's public key has been securely
            stored.
          </Text>

          <View style={styles.contactCard}>
            <Text style={styles.contactName}>
              {contact?.name ?? "Unknown Contact"}
            </Text>

            <Text style={styles.fingerprintLabel}>
              Fingerprint
            </Text>

            <Text style={styles.fingerprint}>
              {contact?.fingerprint ?? "--:--:--:--"}
            </Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              title="Send Message"
              onPress={handleCompose}
            />

            <View style={styles.actionSpacing} />

            <PrimaryButton
              title="Back to Home"
              onPress={handleBackToHome}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}