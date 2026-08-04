import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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

import { generateIdentity } from "../../native/GhostRelay";


export default function AddContactScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, "AddContact">>();

  const [publicKey, setPublicKey] = useState("");
  const [saving, setSaving] = useState(false);

  // Automatically populate the field if we came back
  // from QRScanner with a scanned public key.
  useEffect(() => {

    if (route.params?.publicKey) {

      setPublicKey(route.params.publicKey);

    }

  }, [route.params]);

  async function handlePaste() {

    const text = await Clipboard.getStringAsync();

    if (!text) {

      Alert.alert(
        "Clipboard Empty",
        "No public key found."
      );

      return;

    }

    setPublicKey(text);

  }

  function handleScanQR() {

    navigation.navigate("QRScanner");

  }

  async function handleSave() {

    if (!publicKey.trim()) {

      Alert.alert(
        "Missing Public Key",
        "Paste or scan a public key first."
      );

      return;

    }

    try {

      setSaving(true);

      const savedContact = await saveContact({
        publicKey,
      });
      
      navigation.replace("ContactAdded", {
        contact: savedContact,
      });

    } catch {

      Alert.alert(
        "Error",
        "Unable to save contact."
      );

    } finally {

      setSaving(false);

    }

  }

  return (

    <Screen>
      <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Header
        title="Add Contact"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>

        <Text style={styles.heading}>
          Import Public Key
        </Text>

        <Text style={styles.description}>
          Enter a trusted user's public key or scan
          their QR code to establish a secure identity.
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
        />

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handlePaste}
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
            title={saving ? "Saving..." : "Save Contact"}
            onPress={handleSave}
          />

        </View>

      </View>
      </ScrollView>

    </Screen>

  );

}