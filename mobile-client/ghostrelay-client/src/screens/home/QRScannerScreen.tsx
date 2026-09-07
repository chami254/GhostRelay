import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native";

import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";

import styles from "./QRScannerScreen.styles";

export default function QRScannerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  const [cameraFacing] = useState<CameraType>("back");

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );

  function handleBarcodeScanned({
    data,
  }: {
    data: string;
  }) {
    if (scanned) return;

    setScanned(true);

    console.log("Scanned QR:", data);

    try {
      const contact = JSON.parse(data);

      navigation.replace("AddContact", {
        publicKey: contact.publicKey,
      });
    } catch {
      navigation.replace("AddContact", {
        publicKey: data,
      });
    }
  }

  if (!permission) {
    return (
      <Screen>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Header
          title="Scan QR Code"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.container}>
          <Text style={styles.instructions}>
            GhostRelay requires camera permission to scan QR
            codes.
          </Text>

          <PrimaryButton
            title="Grant Camera Permission"
            onPress={requestPermission}
          />
        </View>
      </Screen>
    );
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

        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={cameraFacing}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={
              scanned
                ? undefined
                : handleBarcodeScanned
            }
          />
        </View>

        <Text style={styles.instructions}>
          Position the contact's QR code inside the frame to
          securely import their public key.
        </Text>

        {scanned && (
          <PrimaryButton
            title="Scan Another QR Code"
            onPress={() => setScanned(false)}
          />
        )}
      </ScrollView>
    </Screen>
  );
}