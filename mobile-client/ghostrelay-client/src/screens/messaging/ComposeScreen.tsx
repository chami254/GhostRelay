import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import type {
  RouteProp,
} from "@react-navigation/native";
import type {
  RootStackParamList,
} from "../../navigation/types";
import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../auth/AuthContext";
import { sendMessage } from "../../api/messages";
import {
  encrypt,
  signMessage,
} from "../../native/GhostRelay";
import type {
  RelayRequest,
} from "../../api/types";
import styles from "./ComposeScreen.styles";

const MAX_CHARACTERS = 512;
const MESSAGE_ALGORITHM =
  "X25519-SHA256-XChaCha20-Poly1305-Ed25519";
const MESSAGE_LIFETIME_MS = 24 * 60 * 60 * 1000;

type ComposeNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ComposeRouteProp =
  RouteProp<RootStackParamList, "Compose">;

export default function ComposeScreen() {
  const navigation =
    useNavigation<ComposeNavigationProp>();

  const route =
    useRoute<ComposeRouteProp>();

  const { identity } = useAuth();

  const contact =
    route.params?.contact;

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  /*
   * --------------------------------------------------
   * RECIPIENT
   * --------------------------------------------------
   *
   * The contact fingerprint is the GhostRelay identity
   * registered with the relay server.
   */
  const receiverId =
    contact?.fingerprint ?? "";

  const receiverName =
    contact?.name ?? "";

  const fingerprint =
    contact?.fingerprint ?? "";

  /*
   * --------------------------------------------------
   * SELECT RECIPIENT
   * --------------------------------------------------
   */
  function handleSelectRecipient() {
    Alert.alert(
      "Recipient Required",
      "Please select a trusted contact before sending a message.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Contacts",
          onPress: () => {
            navigation.navigate("Tabs", {
              screen: "Contacts",
            });
          },
        },
        {
          text: "Scan QR",
          onPress: () => {
            navigation.navigate("QRScanner");
          },
        },
      ]
    );
  }

  /*
   * --------------------------------------------------
   * SEND MESSAGE
   * --------------------------------------------------
   *
   * Plaintext is encrypted by the Rust security core.
   * The resulting encrypted payload is then signed by
   * the active GhostRelay identity.
   *
   * Plaintext never enters the relay request.
   */
  async function handleSend() {
    const trimmedMessage =
      message.trim();

    /*
     * Sender identity must exist.
     */
    const senderId =
      identity?.fingerprint ?? "";

    if (!senderId) {
      Alert.alert(
        "Identity Error",
        "Your GhostRelay identity is unavailable. Please create or restore your identity before sending a message."
      );
      return;
    }

    /*
     * Recipient must exist.
     */
    if (!contact || !receiverId) {
      handleSelectRecipient();
      return;
    }

    /*
     * Recipient encryption key must exist.
     */
    if (!contact.publicKey) {
      Alert.alert(
        "Recipient Error",
        "The selected contact does not have a valid encryption public key."
      );
      return;
    }

    if (!trimmedMessage) {
      Alert.alert(
        "Empty Message",
        "Please enter a message before sending."
      );
      return;
    }

    if (sending) {
      return;
    }

    try {
      setSending(true);

      /*
       * Generate message metadata.
       *
       * The ID is included in the signed message so that
       * the signature is bound to one specific message.
       */
      const messageId =
        crypto.randomUUID();

      const createdAt =
        new Date().toISOString();

      const expiresAt =
        new Date(
          Date.now() + MESSAGE_LIFETIME_MS
        ).toISOString();

      /*
       * ------------------------------------------------
       * ENCRYPT
       * ------------------------------------------------
       *
       * Rust performs:
       * X25519 shared-secret derivation
       * -> SHA-256 key derivation
       * -> XChaCha20-Poly1305 encryption
       */
      const encrypted =
        await encrypt(
          contact.publicKey,
          trimmedMessage
        );

      /*
       * Construct the unsigned canonical message.
       *
       * This exact object is what Rust signs.
       */
      const unsignedMessage = {
        id: messageId,
        senderId,
        receiverId,
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce,
        algorithm: MESSAGE_ALGORITHM,
        createdAt,
        expiresAt,
      };

      /*
       * ------------------------------------------------
       * SIGN
       * ------------------------------------------------
       *
       * Rust signs the canonical serialization of the
       * message using the active Ed25519 identity.
       */
      const signature =
        await signMessage(
          JSON.stringify(unsignedMessage)
        );

      /*
       * Add the signature after signing.
       */
      const request: RelayRequest = {
        ...unsignedMessage,
        signature,
      };

      console.log(
        "MESSAGE REQUEST:",
        {
          id: request.id,
          senderId: request.senderId,
          receiverId: request.receiverId,
          ciphertextLength:
            request.ciphertext.length,
          nonceLength:
            request.nonce.length,
          signatureLength:
            request.signature.length,
          algorithm:
            request.algorithm,
        }
      );

      await sendMessage(request);

      Alert.alert(
        "Message Relayed",
        "Your encrypted and signed message has been submitted to the relay."
      );

      setMessage("");
      navigation.goBack();
    } catch (error) {
      console.error(
        "MESSAGE SEND ERROR:",
        error
      );

      Alert.alert(
        "Message Error",
        error instanceof Error
          ? error.message
          : "Unable to encrypt and relay your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <Header
          title="Compose"
          onBack={() =>
            navigation.goBack()
          }
        />

        <View style={styles.container}>
          {/* RECIPIENT */}
          <Text style={styles.label}>
            Recipient
          </Text>

          <View style={styles.selector}>
            {contact ? (
              <Text
                style={styles.selectorText}
                numberOfLines={1}
              >
                {receiverName}
              </Text>
            ) : (
              <Text
                style={styles.selectorText}
                numberOfLines={2}
              >
                No recipient selected
              </Text>
            )}
          </View>

          {!contact && (
            <View style={styles.footer}>
              <PrimaryButton
                title="Select Recipient"
                onPress={
                  handleSelectRecipient
                }
              />
            </View>
          )}

          {/* FINGERPRINT */}
          {contact && (
            <>
              <Text style={styles.label}>
                Fingerprint
              </Text>

              <View style={styles.selector}>
                <Text
                  style={styles.selectorText}
                  numberOfLines={2}
                >
                  {fingerprint ||
                    "Fingerprint unavailable"}
                </Text>
              </View>
            </>
          )}

          {/* MESSAGE */}
          <Text style={styles.label}>
            Message
          </Text>

          <TextInput
            style={styles.input}
            multiline
            maxLength={MAX_CHARACTERS}
            placeholder="Write your secure message..."
            placeholderTextColor="#6B7280"
            value={message}
            onChangeText={setMessage}
            autoCapitalize="sentences"
            autoCorrect
            textAlignVertical="top"
            editable={!sending}
          />

          <Text style={styles.counter}>
            {message.length} / {MAX_CHARACTERS}
          </Text>

          {/* SEND */}
          <View style={styles.footer}>
            <PrimaryButton
              title={
                sending
                  ? "Encrypting..."
                  : "Encrypt & Relay"
              }
              onPress={handleSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}