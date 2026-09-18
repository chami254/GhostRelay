import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Crypto from "expo-crypto";
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
import {
  saveContact,
  type GhostRelayIdentityPayload,
} from "../../api/contacts";

type AddContactNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ImportedIdentity = {
  publicKey: string;
  signingPublicKey: string;
  fingerprint: string;
};

/**
 * Decode a Base64 value into raw bytes.
 */
function decodeBase64(value: string): Uint8Array {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error("Public key is empty.");
  }

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

/**
 * Calculate the GhostRelay identity fingerprint.
 *
 * Protocol:
 * SHA-256(X25519 public key)
 * -> first 16 bytes
 * -> uppercase hexadecimal
 * -> colon separated
 */
async function calculateFingerprint(
  publicKey: string
): Promise<string> {
  const publicKeyBytes = decodeBase64(publicKey);

  if (publicKeyBytes.length !== 32) {
    throw new Error(
      "Invalid X25519 public key length."
    );
  }

  /**
   * Create a real ArrayBuffer rather than passing the
   * Uint8Array<ArrayBufferLike> directly to expo-crypto.
   *
   * This avoids the TS BufferSource incompatibility
   * introduced by newer TypeScript library definitions.
   */
  const publicKeyBuffer = new ArrayBuffer(
    publicKeyBytes.byteLength
  );

  new Uint8Array(publicKeyBuffer).set(
    publicKeyBytes
  );

  const digestBuffer = await Crypto.digest(
    Crypto.CryptoDigestAlgorithm.SHA256,
    publicKeyBuffer
  );

  const digestBytes = new Uint8Array(
    digestBuffer
  );

  return Array.from(digestBytes.slice(0, 16))
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()
    )
    .join(":");
}

/**
 * Validate the structure of a GhostRelay identity
 * payload before attempting cryptographic validation.
 */
function isGhostRelayIdentityPayload(
  value: unknown
): value is GhostRelayIdentityPayload {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const payload =
    value as Record<string, unknown>;

  return (
    payload.type === "ghostrelay-identity" &&
    payload.version === 1 &&
    typeof payload.publicKey === "string" &&
    typeof payload.signingPublicKey === "string" &&
    typeof payload.fingerprint === "string" &&
    payload.publicKey.trim().length > 0 &&
    payload.signingPublicKey.trim().length > 0 &&
    payload.fingerprint.trim().length > 0
  );
}

export default function AddContactScreen() {
  const navigation =
    useNavigation<AddContactNavigationProp>();

  const route =
    useRoute<
      RouteProp<RootStackParamList, "AddContact">
    >();

  const [publicKey, setPublicKey] =
    useState("");

  const [signingPublicKey, setSigningPublicKey] =
    useState("");

  const [fingerprint, setFingerprint] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  /*
   * ----------------------------------------------------
   * IMPORT NAVIGATION DATA
   * ----------------------------------------------------
   */

  useEffect(() => {
    const params = route.params;

    if (!params) {
      return;
    }

    if (params.publicKey) {
      setPublicKey(params.publicKey);
    }

    if (params.signingPublicKey) {
      setSigningPublicKey(
        params.signingPublicKey
      );
    }

    if (params.fingerprint) {
      setFingerprint(
        params.fingerprint
      );
    }
  }, [route.params]);

  /*
   * ----------------------------------------------------
   * PASTE IDENTITY
   * ----------------------------------------------------
   */

  async function handlePaste() {
    try {
      const text =
        await Clipboard.getStringAsync();

      if (!text.trim()) {
        Alert.alert(
          "Clipboard Empty",
          "No identity data was found in the clipboard."
        );
        return;
      }

      const trimmed = text.trim();

      /*
       * Prefer the complete GhostRelay identity
       * payload when JSON was copied.
       */
      try {
        const parsed: unknown =
          JSON.parse(trimmed);

        if (
          isGhostRelayIdentityPayload(parsed)
        ) {
          setPublicKey(
            parsed.publicKey.trim()
          );

          setSigningPublicKey(
            parsed.signingPublicKey.trim()
          );

          setFingerprint(
            parsed.fingerprint
              .trim()
              .toUpperCase()
          );

          return;
        }
      } catch {
        /*
         * Not JSON.
         * Treat it as a raw public-key input below.
         */
      }

      /*
       * Legacy/raw public-key paste.
       *
       * We retain the input for compatibility, but
       * handleSave will reject it unless the complete
       * trusted identity is available.
       */
      setPublicKey(trimmed);
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

  /*
   * ----------------------------------------------------
   * QR SCANNER
   * ----------------------------------------------------
   */

  function handleScanQR() {
    navigation.navigate("QRScanner");
  }

  /*
   * ----------------------------------------------------
   * IDENTITY VALIDATION
   * ----------------------------------------------------
   */

  async function validateImportedIdentity(): Promise<ImportedIdentity> {
    const normalizedPublicKey =
      publicKey.trim();

    const normalizedSigningPublicKey =
      signingPublicKey.trim();

    const normalizedFingerprint =
      fingerprint.trim().toUpperCase();

    if (!normalizedPublicKey) {
      throw new Error(
        "An X25519 public key is required."
      );
    }

    if (!normalizedSigningPublicKey) {
      throw new Error(
        "An Ed25519 signing public key is required."
      );
    }

    if (!normalizedFingerprint) {
      throw new Error(
        "A GhostRelay fingerprint is required."
      );
    }

    /*
     * Validate X25519 public-key length before hashing.
     */
    const publicKeyBytes =
      decodeBase64(normalizedPublicKey);

    if (publicKeyBytes.length !== 32) {
      throw new Error(
        "Invalid X25519 public key length."
      );
    }

    /*
     * Validate Ed25519 public-key length.
     */
    const signingPublicKeyBytes =
      decodeBase64(
        normalizedSigningPublicKey
      );

    if (signingPublicKeyBytes.length !== 32) {
      throw new Error(
        "Invalid Ed25519 signing public key length."
      );
    }

    /*
     * Validate fingerprint format.
     */
    const fingerprintPattern =
      /^(?:[0-9A-F]{2}:){15}[0-9A-F]{2}$/;

    if (
      !fingerprintPattern.test(
        normalizedFingerprint
      )
    ) {
      throw new Error(
        "Invalid GhostRelay fingerprint format."
      );
    }

    /*
     * Independently calculate the fingerprint
     * from the X25519 public key.
     */
    const calculatedFingerprint =
      await calculateFingerprint(
        normalizedPublicKey
      );

    if (
      calculatedFingerprint !==
      normalizedFingerprint
    ) {
      throw new Error(
        "Identity fingerprint does not match the supplied public key."
      );
    }

    return {
      publicKey: normalizedPublicKey,
      signingPublicKey:
        normalizedSigningPublicKey,
      fingerprint:
        calculatedFingerprint,
    };
  }

  /*
   * ----------------------------------------------------
   * SAVE CONTACT
   * ----------------------------------------------------
   */

  async function handleSave() {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const identity =
        await validateImportedIdentity();

      console.log(
        "CONTACT: identity validated",
        {
          fingerprint:
            identity.fingerprint,
        }
      );

      const savedContact =
        await saveContact(identity);

      /*
       * Use navigate here rather than replace().
       *
       * The current AddContactNavigationProp typing
       * does not expose replace(), while navigate() is
       * already valid for this stack.
       */
      navigation.navigate(
        "ContactAdded",
        {
          contact: savedContact,
        }
      );
    } catch (error) {
      console.error(
        "Failed to save contact:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : String(error);

      Alert.alert(
        "Unable to Add Contact",
        message
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ----------------------------------------------------
   * UI
   * ----------------------------------------------------
   */

  return (
    <Screen>
      <View style={styles.screen}>
        <Header
          title="Add Contact"
          onBack={() =>
            navigation.goBack()
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.container
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>
            Import Identity
          </Text>

          <Text style={styles.description}>
            Import a trusted GhostRelay identity
            by scanning a QR code or pasting its
            public identity data.
          </Text>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Paste public key or identity payload..."
            placeholderTextColor={
              Colors.textSecondary
            }
            value={publicKey}
            onChangeText={setPublicKey}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="none"
          />

          <TouchableOpacity
            style={localStyles.secondaryButton}
            onPress={handlePaste}
            activeOpacity={0.8}
          >
            <Ionicons
              name="copy-outline"
              size={20}
              color={Colors.primary}
            />

            <Text
              style={localStyles.secondaryText}
            >
              Paste Identity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.secondaryButton}
            onPress={handleScanQR}
            activeOpacity={0.8}
          >
            <Ionicons
              name="qr-code-outline"
              size={20}
              color={Colors.primary}
            />

            <Text
              style={localStyles.secondaryText}
            >
              Scan QR Code
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <PrimaryButton
              title={
                saving
                  ? "Verifying..."
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

/*
 * Local styles are deliberately kept here so this
 * screen does not depend on secondary-button entries
 * being present in AddContactScreen.styles.ts.
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
    marginTop: 12,
  },

  secondaryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
});