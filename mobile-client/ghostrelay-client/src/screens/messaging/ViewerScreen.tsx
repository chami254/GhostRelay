import React, {
  useCallback,
  useEffect,
  useRef,
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

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RouteProp } from "@react-navigation/native";

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

interface DecryptedMessage {
  id?: string;
  sender: string;
  body: string;
  received?: string;
}

type ViewerNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ViewerRouteProp =
  RouteProp<RootStackParamList, "Viewer">;

const SELF_DESTRUCT_SECONDS = 15;

export default function ViewerScreen() {
  const navigation =
    useNavigation<ViewerNavigationProp>();

  const route =
    useRoute<ViewerRouteProp>();

  const { messageId } = route.params;

  const [message, setMessage] =
    useState<DecryptedMessage | null>(null);

  const [remaining, setRemaining] =
    useState(SELF_DESTRUCT_SECONDS);

  const [deleting, setDeleting] =
    useState(false);

  /*
   * Prevent the timer, Delete Now button,
   * and back button from deleting the same
   * message multiple times.
   */
  const deletionStarted =
    useRef(false);

  const handleDelete = useCallback(
    async () => {
      if (deletionStarted.current) {
        return;
      }

      deletionStarted.current = true;
      setDeleting(true);

      try {
        await deleteMessage(messageId);
      } catch (error) {
        console.error(
          "MESSAGE DELETE ERROR:",
          error
        );
      } finally {
        navigation.replace("Expired");
      }
    },
    [messageId, navigation]
  );

  useEffect(() => {
    let mounted = true;

    async function loadMessage() {
      try {
        const decrypted =
          await getMessage(messageId);

        if (!mounted) {
          return;
        }

        setMessage(
          decrypted as DecryptedMessage
        );

        setRemaining(
          SELF_DESTRUCT_SECONDS
        );
      } catch (error) {
        console.error(
          "MESSAGE LOAD ERROR:",
          error
        );

        if (!mounted) {
          return;
        }

        Alert.alert(
          "Unable to decrypt message.",
          "The message could not be retrieved from the relay.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.goBack(),
            },
          ]
        );
      }
    }

    loadMessage();

    return () => {
      mounted = false;
    };
  }, [messageId, navigation]);

  useEffect(() => {
    if (!message || deleting) {
      return;
    }

    const timer = setInterval(() => {
      setRemaining((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          void handleDelete();

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [message, deleting, handleDelete]);

  if (!message) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Decrypting...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.screen}>
        <Header
          title="Secure Message"
          onBack={() => {
            void handleDelete();
          }}
        />

        <View style={styles.container}>
          <View style={styles.identityCard}>
            <Text style={styles.from}>
              From
            </Text>

            <Text
              style={styles.sender}
              numberOfLines={1}
            >
              {message.sender}
            </Text>

            <Text style={styles.verified}>
              🛡 Fingerprint Verified
            </Text>
          </View>

          <View style={styles.warningCard}>
            <Text style={styles.warning}>
              This message will permanently
              disappear after viewing.
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
              00:
              {remaining
                .toString()
                .padStart(2, "0")}
            </Text>
          </View>

          <PrimaryButton
            title={
              deleting
                ? "Deleting..."
                : "Delete Now"
            }
            onPress={() => {
              void handleDelete();
            }}
          />
        </View>
      </View>
    </Screen>
  );
}