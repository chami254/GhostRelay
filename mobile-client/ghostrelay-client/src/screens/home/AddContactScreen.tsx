import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";

import { Colors } from "../../theme";
import styles from "./AddContactScreen.styles";

import { saveContact } from "../../api/contacts";

export default function AddContactScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const route =
    useRoute<
      RouteProp<RootStackParamList, "AddContact">
    >();

  const [publicKey, setPublicKey] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------------- IMPORT SCANNED KEY ---------------- */

  useEffect(() => {
    const scannedKey = route.params?.publicKey;

    if (scannedKey) {
      setPublicKey(scannedKey);
    }
  }, [route.params?.publicKey]);

  /* ---------------- PASTE ---------------- */

  async function handlePaste() {
    try {
      const text = await Clipboard.getStringAsync();

      if (!text.trim()) {
        Alert.alert(
          "Clipboard Empty",
          "No public key was found in the clipboard."
        );
        return;
      }

      setPublicKey(text.trim());
    } catch (error) {
      console.error(
        "Failed to read clipboard:",
        error
      );

      Alert.alert(
        "Clipboard Error",
        "Unable to read the clipboard."
      );
    }
  }

  /* ---------------- QR SCANNER ---------------- */

  function handleScanQR() {
    navigation.navigate("QRScanner");
  }

  /* ---------------- SAVE CONTACT ---------------- */

  async function handleSave() {
    const trimmedKey = publicKey.trim();

    if (!trimmedKey) {
      Alert.alert(
        "Missing Public Key",
        "Paste or scan a public key first."
      );
      return;
    }

    try {
      setSaving(true);

      const savedContact = await saveContact({
        publicKey: trimmedKey,
      });

      navigation.replace("ContactAdded", {
        contact: savedContact,
      });
    } catch (error) {
      console.error(
        "Failed to save contact:",
        error
      );

      Alert.alert(
        "Unable to Add Contact",
        "The contact could not be saved. Please verify the public key and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <Screen>
      <View style={styles.screen}>
        <Header
          title="Add Contact"
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>
            Import Public Key
          </Text>

          <Text style={styles.description}>
            Enter a trusted user's public key or scan their
            QR code to establish a secure identity.
          </Text>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Paste public key..."
            placeholderTextColor={Colors.textSecondary}
            value={publicKey}
            onChangeText={setPublicKey}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="none"
          />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePaste}
            activeOpacity={0.8}
          >
            <Ionicons
              name="copy-outline"
              size={20}
              color={Colors.primary}
            />

            <Text style={styles.secondaryText}>
              Paste from Clipboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleScanQR}
            activeOpacity={0.8}
          >
            <Ionicons
              name="qr-code-outline"
              size={20}
              color={Colors.primary}
            />

            <Text style={styles.secondaryText}>
              Scan QR Code
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <PrimaryButton
              title={
                saving
                  ? "Saving..."
                  : "Save Contact"
              }
              onPress={handleSave}
            />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}