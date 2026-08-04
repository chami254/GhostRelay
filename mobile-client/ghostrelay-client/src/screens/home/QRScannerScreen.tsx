import { ScrollView } from "react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";

import { Colors } from "../../theme";

import styles from "./QRScannerScreen.styles";

import { generateIdentity } from "../../native/GhostRelay";



export default function QRScannerScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [scanning, setScanning] = useState(false);

  async function handleSimulatedScan() {

    try {

      setScanning(true);

      // TODO:
      // Replace this with expo-camera QR scanning.
      // The QR should contain either:
      // - the contact's public key
      // - or a serialized contact object.

      const scannedPublicKey =
        "6FA94D83AB11C84D1B8A47D3EAF3C21A";

      console.log("Scanned Public Key:", scannedPublicKey);

      // Return to Add Contact with the scanned key
      navigation.replace("AddContact", {
        publicKey: scannedPublicKey,
      });

    } catch {

      Alert.alert(
        "Scan Failed",
        "Unable to read QR code."
      );

    } finally {

      setScanning(false);

    }


  }


  return (

    <Screen>
      <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Header
        title="Scan QR Code"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>

        <View style={styles.cameraPlaceholder}>

          <Ionicons
            name="qr-code-outline"
            size={90}
            color={Colors.primary}
          />

          <Text style={styles.cameraText}>
            Camera Preview
          </Text>

        </View>

        <Text style={styles.instructions}>
          Position the contact's QR code inside
          the frame to securely import their public key.
        </Text>

        <PrimaryButton
          title={
            scanning
              ? "Scanning..."
              : "Simulate Successful Scan"
          }
          onPress={handleSimulatedScan}
        />

      </View>
      </ScrollView>

    </Screen>

  );

}