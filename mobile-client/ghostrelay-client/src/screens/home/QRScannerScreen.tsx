import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";

import type {
  RootStackParamList,
} from "../../navigation/types";

import styles from "./QRScannerScreen.styles";

type QRScannerNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface QRIdentityPayload {
  type?: unknown;
  version?: unknown;
  publicKey?: unknown;
  signingPublicKey?: unknown;
  fingerprint?: unknown;
}

/*
 * ----------------------------------------------------
 * QR IDENTITY PARSER
 * ----------------------------------------------------
 */

function parseIdentityPayload(
  rawData: string
):
  | {
      publicKey: string;
      signingPublicKey: string;
      fingerprint: string;
    }
  | null {
  const trimmed = rawData.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed: QRIdentityPayload =
      JSON.parse(trimmed);

    if (
      parsed.type !==
        "ghostrelay-identity" ||
      parsed.version !== 1 ||
      typeof parsed.publicKey !==
        "string" ||
      typeof parsed.signingPublicKey !==
        "string" ||
      typeof parsed.fingerprint !==
        "string"
    ) {
      return null;
    }

    if (
      !parsed.publicKey.trim() ||
      !parsed.signingPublicKey.trim() ||
      !parsed.fingerprint.trim()
    ) {
      return null;
    }

    return {
      publicKey:
        parsed.publicKey.trim(),

      signingPublicKey:
        parsed.signingPublicKey.trim(),

      fingerprint:
        parsed.fingerprint
          .trim()
          .toUpperCase(),
    };
  } catch {
    return null;
  }
}

export default function QRScannerScreen() {
  const navigation =
    useNavigation<QRScannerNavigationProp>();

  const [
    permission,
    requestPermission,
  ] = useCameraPermissions();

  const [scanned, setScanned] =
    useState(false);

  const [processingImage, setProcessingImage] =
    useState(false);

  /*
   * ----------------------------------------------------
   * CAMERA PERMISSION
   * ----------------------------------------------------
   */

  useEffect(() => {
    if (
      !permission ||
      permission.granted
    ) {
      return;
    }

    if (permission.canAskAgain) {
      void requestPermission();
    }
  }, [
    permission,
    requestPermission,
  ]);

  /*
   * ----------------------------------------------------
   * RESET SCANNER
   * ----------------------------------------------------
   */

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setProcessingImage(false);
    }, [])
  );

  /*
   * ----------------------------------------------------
   * NAVIGATION
   * ----------------------------------------------------
   */

  const openCompose = () => {
    navigation.navigate("Tabs", {
      screen: "Contacts",
    });
  };

  const openMyQRCode = () => {
    navigation.navigate("MyQRCode");
  };

  /*
   * ----------------------------------------------------
   * PROCESS QR DATA
   * ----------------------------------------------------
   *
   * Both live-camera scans and image scans come
   * through this same function.
   */

  const handleQRData = useCallback(
    (data: string) => {
      const identity =
        parseIdentityPayload(data);

      if (!identity) {
        Alert.alert(
          "Invalid GhostRelay QR Code",
          "The QR code does not contain a valid GhostRelay identity."
        );

        setScanned(false);
        return;
      }

      setScanned(true);

      navigation.navigate(
        "AddContact",
        identity
      );
    },
    [navigation]
  );

  /*
   * ----------------------------------------------------
   * LIVE CAMERA SCAN
   * ----------------------------------------------------
   */

  const handleBarcodeScanned =
    useCallback(
      ({ data }: { data: string }) => {
        if (
          scanned ||
          processingImage
        ) {
          return;
        }

        handleQRData(data);
      },
      [
        handleQRData,
        processingImage,
        scanned,
      ]
    );

  /*
   * ----------------------------------------------------
   * PHOTO / SCREENSHOT SCAN
   * ----------------------------------------------------
   */

  async function handlePickQRImage() {
    if (processingImage) {
      return;
    }

    try {
      setProcessingImage(true);

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
          }
        );

      if (
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const imageUri =
        result.assets[0].uri;

      const results =
        await Camera.scanFromURLAsync(
          imageUri,
          ["qr"]
        );

      if (!results.length) {
        Alert.alert(
          "QR Code Not Found",
          "No QR code could be detected in the selected image."
        );

        return;
      }

      handleQRData(
        results[0].data
      );
    } catch (error) {
      console.error(
        "Failed to scan QR image:",
        error
      );

      Alert.alert(
        "QR Scan Failed",
        "Unable to read a QR code from that image."
      );
    } finally {
      setProcessingImage(false);
    }
  }

  /*
   * ----------------------------------------------------
   * PERMISSION LOADING
   * ----------------------------------------------------
   */

  if (!permission) {
    return (
      <Screen>
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#10D6B3"
          />

          <Text
            style={styles.loadingText}
          >
            Checking camera permission...
          </Text>
        </View>
      </Screen>
    );
  }

  /*
   * ----------------------------------------------------
   * PERMISSION DENIED
   * ----------------------------------------------------
   */

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.screen}>
          <Header
            title="Scan QR Code"
            onBack={() =>
              navigation.goBack()
            }
          />

          <View
            style={
              styles.permissionContainer
            }
          >
            <View
              style={
                styles.permissionIcon
              }
            >
              <Text
                style={
                  styles.permissionIconText
                }
              >
                QR
              </Text>
            </View>

            <Text
              style={
                styles.permissionTitle
              }
            >
              Camera Permission Required
            </Text>

            <Text
              style={styles.instructions}
            >
              GhostRelay needs camera access
              for live QR scanning.
            </Text>

            {permission.canAskAgain ? (
              <PrimaryButton
                title="Grant Camera Permission"
                onPress={() => {
                  void requestPermission();
                }}
              />
            ) : (
              <Text
                style={
                  styles.permissionDeniedText
                }
              >
                Camera permission has been
                denied. Enable camera access
                for GhostRelay in your device
                settings and return here.
              </Text>
            )}

            <TouchableOpacity
              style={
                localStyles.secondaryButton
              }
              onPress={
                handlePickQRImage
              }
              disabled={processingImage}
              activeOpacity={0.8}
            >
              {processingImage ? (
                <ActivityIndicator
                  size="small"
                  color="#10D6B3"
                />
              ) : (
                <Text
                  style={
                    localStyles.secondaryText
                  }
                >
                  Choose QR Image
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    );
  }

  /*
   * ----------------------------------------------------
   * SCANNER
   * ----------------------------------------------------
   */

  return (
    <Screen>
      <View style={styles.screen}>
        <Header
          title="Scan QR Code"
          onBack={() =>
            navigation.goBack()
          }
        />

        <View style={styles.content}>
          <View
            style={
              styles.cameraContainer
            }
          >
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={
                scanned ||
                processingImage
                  ? undefined
                  : handleBarcodeScanned
              }
            />

            <View
              pointerEvents="none"
              style={styles.scanFrame}
            >
              <View
                style={
                  styles.cornerTopLeft
                }
              />

              <View
                style={
                  styles.cornerTopRight
                }
              />

              <View
                style={
                  styles.cornerBottomLeft
                }
              />

              <View
                style={
                  styles.cornerBottomRight
                }
              />
            </View>
          </View>

          <Text
            style={styles.instructions}
          >
            Position a GhostRelay identity QR
            code inside the frame.
          </Text>

          <View
            style={styles.actionContainer}
          >
            <TouchableOpacity
              style={
                localStyles.secondaryButton
              }
              onPress={
                handlePickQRImage
              }
              disabled={processingImage}
              activeOpacity={0.8}
            >
              {processingImage ? (
                <ActivityIndicator
                  size="small"
                  color="#10D6B3"
                />
              ) : (
                <Text
                  style={
                    localStyles.secondaryText
                  }
                >
                  Scan from Photo / Screenshot
                </Text>
              )}
            </TouchableOpacity>

            <PrimaryButton
              title="Compose Message"
              onPress={openCompose}
            />

            <PrimaryButton
              title="Show My QR Code"
              onPress={openMyQRCode}
            />

            {scanned && (
              <PrimaryButton
                title="Scan Another QR Code"
                onPress={() =>
                  setScanned(false)
                }
              />
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
}

/*
 * ----------------------------------------------------
 * LOCAL SECONDARY BUTTON STYLES
 * ----------------------------------------------------
 *
 * Kept local because QRScannerScreen.styles.ts
 * currently does not define these properties.
 */

const localStyles = StyleSheet.create({
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginBottom: 12,
  },

  secondaryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#10D6B3",
    textAlign: "center",
  },
});