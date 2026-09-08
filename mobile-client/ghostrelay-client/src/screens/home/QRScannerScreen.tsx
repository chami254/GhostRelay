import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";

import type { RootStackParamList } from "../../navigation/types";
import styles from "./QRScannerScreen.styles";

type QRScannerNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface QRIdentityPayload {
  publicKey?: unknown;
}

export default function QRScannerScreen() {
  const navigation =
    useNavigation<QRScannerNavigationProp>();

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  /*
   * Request camera permission when the permission state
   * becomes available and has not yet been granted.
   */
  useEffect(() => {
    if (!permission || permission.granted) {
      return;
    }

    if (permission.canAskAgain) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  /*
   * Reset the scanner whenever the screen becomes active.
   *
   * This allows the user to return to the scanner and scan
   * another contact without carrying over the previous scan.
   */
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );

  /*
   * Handle a QR scan.
   *
   * GhostRelay QR data may contain either:
   *
   * 1. A JSON object containing publicKey
   * 2. A raw public-key string
   *
   * Only the public key is passed to AddContact.
   */
  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) {
        return;
      }

      setScanned(true);

      const rawData = data.trim();

      if (!rawData) {
        setScanned(false);

        Alert.alert(
          "Invalid QR Code",
          "The scanned QR code does not contain a valid identity."
        );

        return;
      }

      try {
        const parsed: QRIdentityPayload =
          JSON.parse(rawData);

        if (
          typeof parsed.publicKey === "string" &&
          parsed.publicKey.trim().length > 0
        ) {
          navigation.replace("AddContact", {
            publicKey: parsed.publicKey.trim(),
          });

          return;
        }

        /*
         * The QR code was valid JSON but did not contain
         * the identity structure expected by GhostRelay.
         */
        throw new Error("Missing public key");
      } catch {
        /*
         * If the QR data isn't JSON, treat it as a raw
         * public key. AddContact will perform the next
         * layer of validation.
         */
        navigation.replace("AddContact", {
          publicKey: rawData,
        });
      }
    },
    [navigation, scanned]
  );

  /* ---------------- PERMISSION LOADING ---------------- */

  if (!permission) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#10D6B3"
          />

          <Text style={styles.loadingText}>
            Checking camera permission...
          </Text>
        </View>
      </Screen>
    );
  }

  /* ---------------- PERMISSION DENIED ---------------- */

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.screen}>
          <Header
            title="Scan QR Code"
            onBack={() => navigation.goBack()}
          />

          <View style={styles.permissionContainer}>
            <View style={styles.permissionIcon}>
              <Text style={styles.permissionIconText}>
                QR
              </Text>
            </View>

            <Text style={styles.permissionTitle}>
              Camera Permission Required
            </Text>

            <Text style={styles.instructions}>
              GhostRelay needs access to your camera to scan
              a contact's identity QR code.
            </Text>

            {permission.canAskAgain ? (
              <PrimaryButton
                title="Grant Camera Permission"
                onPress={() => {
                  void requestPermission();
                }}
              />
            ) : (
              <Text style={styles.permissionDeniedText}>
                Camera permission has been denied. Enable
                camera access for GhostRelay in your device
                settings and return here.
              </Text>
            )}
          </View>
        </View>
      </Screen>
    );
  }

  /* ---------------- SCANNER ---------------- */

  return (
    <Screen>
      <View style={styles.screen}>
        <Header
          title="Scan QR Code"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.content}>
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={
                scanned
                  ? undefined
                  : handleBarcodeScanned
              }
            />

            {/* QR scanning frame */}
            <View
              pointerEvents="none"
              style={styles.scanFrame}
            >
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </View>

          <Text style={styles.instructions}>
            Position the contact's QR code inside the frame to
            securely import their public key.
          </Text>

          {scanned && (
            <View style={styles.actionContainer}>
              <PrimaryButton
                title="Scan Another QR Code"
                onPress={() => setScanned(false)}
              />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}