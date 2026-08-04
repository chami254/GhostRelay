import { ScrollView } from "react-native";
import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  Alert,
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

import styles from "./ViewerScreen.styles";

import {
  getMessage,
  deleteMessage,
} from "../../api/messages";

export default function ViewerScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, "Viewer">>();

  const { messageId } = route.params;

  const [message, setMessage] = useState<any>(null);

  const [remaining, setRemaining] = useState(15);

  useEffect(() => {

    loadMessage();

  }, []);

  useEffect(() => {

    if (!message) return;

    const timer = setInterval(() => {

      setRemaining((previous) => {

        if (previous <= 1) {

          clearInterval(timer);

          handleDelete();

          return 0;

        }

        return previous - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [message]);

  async function loadMessage() {

    try {

      const decrypted =
        await getMessage(messageId);

      setMessage(decrypted);

    } catch {

      Alert.alert(
        "Unable to decrypt message."
      );

      navigation.goBack();

    }

  }

  async function handleDelete() {

    await deleteMessage(messageId);

    navigation.replace("Expired");

  }

  if (!message) {

    return (
      <Screen>

        <View
          style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
          }}
        >

          <Text
            style={{
              color:"white",
            }}
          >
            Decrypting...
          </Text>

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
        title="Secure Message"
        onBack={handleDelete}
      />

      <View style={styles.container}>

        <View style={styles.identityCard}>

          <Text style={styles.from}>
            From
          </Text>

          <Text style={styles.sender}>
            {message.sender}
          </Text>

          <Text style={styles.verified}>
            🛡 Fingerprint Verified
          </Text>

        </View>

        <View style={styles.warningCard}>

          <Text style={styles.warning}>
            This message will permanently disappear
            after viewing.
          </Text>

        </View>

        <View style={styles.messageCard}>

          <Text style={styles.message}>
            {message.body}
          </Text>

        </View>

        <View style={styles.timerCard}>

          <Text style={styles.timerLabel}>
            Self Destruct
          </Text>

          <Text style={styles.timer}>
            00:{remaining.toString().padStart(2,"0")}
          </Text>

        </View>

        <PrimaryButton
          title="Delete Now"
          onPress={handleDelete}
        />

      </View>
      </ScrollView>

    </Screen>

  );

}