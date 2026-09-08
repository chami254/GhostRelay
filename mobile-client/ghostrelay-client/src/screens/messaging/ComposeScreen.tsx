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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";

import { sendMessage } from "../../api/messages";

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

  const { contact } = route.params;

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const receiverId = contact.id;
  const receiverName = contact.name;
  const fingerprint = contact.fingerprint;

  async function handleSend() {
    const trimmedMessage = message.trim();

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

      await sendMessage(receiverId, message);

      Alert.alert(
        "Message Relayed",
        "Your message has been securely submitted to the relay."
      );

      navigation.goBack();
    } catch (error) {
      console.error(
        "MESSAGE SEND ERROR:",
        error
      );

      Alert.alert(
        "Relay Error",
        "Unable to relay your message. Please try again."
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
          onBack={() => navigation.goBack()}
        />

        <View style={styles.container}>
          <Text style={styles.label}>
            Recipient
          </Text>

          <View style={styles.selector}>
            <Text
              style={styles.selectorText}
              numberOfLines={1}
            >
              {receiverName}
            </Text>
          </View>

          <Text style={styles.label}>
            Fingerprint
          </Text>

          <View style={styles.selector}>
            <Text
              style={styles.selectorText}
              numberOfLines={2}
            >
              {fingerprint || "Fingerprint unavailable"}
            </Text>
          </View>

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
          />

          <Text style={styles.counter}>
            {message.length} / {MAX_CHARACTERS}
          </Text>

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