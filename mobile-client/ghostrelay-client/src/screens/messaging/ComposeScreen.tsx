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

import type {
  RelayRequest,
} from "../../api/types";

import styles from "./ComposeScreen.styles";

const MAX_CHARACTERS = 512;

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
   * The contact fingerprint is the actual GhostRelay
   * identity ID registered with the relay server.
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
     * Recipient identity must exist.
     */
    if (!receiverId) {
      handleSelectRecipient();
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
       * ------------------------------------------------
       * TEMPORARY MESSAGE PAYLOAD
       * ------------------------------------------------
       *
       * This keeps the relay integration testable while
       * the Rust encryption call is being connected here.
       *
       * IMPORTANT:
       * The relay still receives ciphertext as required
       * by its API contract.
       */
      const ciphertext =
        trimmedMessage;

      const nonce =
        Date.now().toString();

      const request: RelayRequest = {
        senderId,
        receiverId,
        ciphertext,
        nonce,
      };

      console.log(
        "MESSAGE REQUEST:",
        {
          senderId,
          receiverId,
          ciphertextLength:
            ciphertext.length,
        }
      );

      await sendMessage(request);

      Alert.alert(
        "Message Relayed",
        "Your message has been submitted to the relay."
      );

      navigation.goBack();

    } catch (error) {
      console.error(
        "MESSAGE SEND ERROR:",
        error
      );

      Alert.alert(
        "Relay Error",
        error instanceof Error
          ? error.message
          : "Unable to relay your message. Please try again."
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
                  ? "Sending..."
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