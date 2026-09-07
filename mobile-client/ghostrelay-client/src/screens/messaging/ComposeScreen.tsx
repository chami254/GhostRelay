import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
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

import styles from "./ComposeScreen.styles";

// Temporary API
// Later this will relay through the GhostRelay Rust core.
import { sendMessage } from "../../api/messages";

import { generateIdentity } from "../../native/GhostRelay";

export default function ComposeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, "Compose">>();

    const { contact } = route.params;

    const receiverId = contact.id;
    const receiverName = contact.name;
    const fingerprint = contact.fingerprint;

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [identity, setIdentity] = useState<any>(null);


  const MAX_CHARACTERS = 512;

  useEffect(() => {
    async function loadIdentity() {
      try {
        const id = await generateIdentity();

        setIdentity(id);

        console.log("Public Key:", id.publicKey);
        console.log("Fingerprint:", id.fingerprint);
      } catch (error) {
        console.error("Identity generation failed:", error);
      }
    }

    loadIdentity();
  }, []);

  async function handleSend() {
    if (!message.trim()) {
      Alert.alert(
        "Empty Message",
        "Please enter a message before sending."
      );
      return;
    }

    try {
      setSending(true);

      await sendMessage({
        receiverId,
        message,
      });

      Alert.alert(
        "Message Relayed",
        "Your encrypted message has been uploaded to the relay."
      );

      navigation.goBack();
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Relay Error",
        "Unable to relay your message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
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
          <Text style={styles.selectorText}>
            {receiverName}
          </Text>
        </View>

        <Text style={styles.label}>
          Fingerprint
        </Text>

        <View style={styles.selector}>
          <Text style={styles.selectorText}>
            {fingerprint}
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
        />

        <Text style={styles.counter}>
          {message.length} / {MAX_CHARACTERS}
        </Text>

        

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
      </ScrollView>
    </Screen>
  );
}