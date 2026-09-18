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

import {
  decrypt,
  verifyMessage,
} from "../../native/GhostRelay";

type ViewerNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ViewerRouteProp =
  RouteProp<RootStackParamList, "Viewer">;

interface DecryptedMessage {
  id: string;
  senderId: string;
  plaintext: string;
  createdAt: string;
  verified: boolean;
}

const SELF_DESTRUCT_SECONDS = 15;

export default function ViewerScreen() {
  const navigation =
    useNavigation<ViewerNavigationProp>();

  const route =
    useRoute<ViewerRouteProp>();

  const { messageId } =
    route.params;

  const [message, setMessage] =
    useState<DecryptedMessage | null>(
      null
    );

  const [remaining, setRemaining] =
    useState(
      SELF_DESTRUCT_SECONDS
    );

  const [deleting, setDeleting] =
    useState(false);

  /*
   * Prevent multiple delete requests from:
   *
   * - timer
   * - Delete Now
   * - back button
   */
  const deletionStarted =
    useRef(false);

  /*
   * --------------------------------------------------
   * DELETE
   * --------------------------------------------------
   */
  const handleDelete =
    useCallback(async () => {
      if (deletionStarted.current) {
        return;
      }

      deletionStarted.current = true;
      setDeleting(true);

      try {
        await deleteMessage(
          messageId
        );
      } catch (error) {
        console.error(
          "MESSAGE DELETE ERROR:",
          error
        );
      } finally {
        navigation.navigate(
          "Expired"
        );
      }
    }, [
      messageId,
      navigation,
    ]);

  /*
   * --------------------------------------------------
   * RETRIEVE → VERIFY → DECRYPT
   * --------------------------------------------------
   */
  useEffect(() => {
    let mounted = true;

    async function loadMessage() {
      try {
        /*
         * Retrieve encrypted message from
         * the relay.
         */
        const retrieved =
          await getMessage(
            messageId
          );

        if (!mounted) {
          return;
        }

        /*
         * Ensure the message contains the fields
         * required by the security protocol.
         */
        if (
          !retrieved.id ||
          !retrieved.senderId ||
          !retrieved.ciphertext ||
          !retrieved.nonce ||
          !retrieved.signature ||
          !retrieved.algorithm ||
          !retrieved.createdAt ||
          !retrieved.expiresAt
        ) {
          throw new Error(
            "The retrieved message is missing required security fields."
          );
        }

        /*
         * ------------------------------------------------
         * VERIFY SIGNATURE
         * ------------------------------------------------
         *
         * IMPORTANT:
         *
         * The signed message must be reconstructed
         * exactly as it was when ComposeScreen signed it.
         *
         * The signature itself is NOT included in the
         * canonical object passed to Rust for verification.
         */
        const unsignedMessage = {
          id: retrieved.id,
          senderId:
            retrieved.senderId,
          receiverId:
            retrieved.receiverId,
          ciphertext:
            retrieved.ciphertext,
          nonce:
            retrieved.nonce,
          algorithm:
            retrieved.algorithm,
          createdAt:
            retrieved.createdAt,
          expiresAt:
            retrieved.expiresAt,
        };

        const canonicalMessage =
          JSON.stringify(
            unsignedMessage
          );

        /*
         * The sender's Ed25519 public key is required
         * here.
         */
        if (
          !retrieved.signingPublicKey
        ) {
          throw new Error(
            "The sender signing public key is unavailable. The message cannot be cryptographically verified."
          );
        }

        const verified =
          await verifyMessage(
            canonicalMessage,
            retrieved.signingPublicKey
          );

        if (!verified) {
          throw new Error(
            "Message signature verification failed. The message will not be displayed."
          );
        }

        /*
         * ------------------------------------------------
         * DECRYPT
         * ------------------------------------------------
         *
         * Verification succeeds first.
         *
         * Only then do we ask Rust to decrypt the
         * ciphertext using the active recipient identity.
         */
        if (
          !retrieved.publicKey
        ) {
          throw new Error(
            "The sender encryption public key is unavailable. The message cannot be decrypted."
          );
        }

        const plaintext =
          await decrypt(
            retrieved.publicKey,
            retrieved.ciphertext,
            retrieved.nonce
          );

        if (!mounted) {
          return;
        }

        setMessage({
          id: retrieved.id,
          senderId:
            retrieved.senderId,
          plaintext,
          createdAt:
            retrieved.createdAt,
          verified: true,
        });

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
          "Unable to open message",
          error instanceof Error
            ? error.message
            : "The encrypted message could not be verified or decrypted.",
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
  }, [
    messageId,
    navigation,
  ]);

  /*
   * --------------------------------------------------
   * SELF-DESTRUCT TIMER
   * --------------------------------------------------
   */
  useEffect(() => {
    if (!message || deleting) {
      return;
    }

    const timer =
      setInterval(() => {
        setRemaining(
          (previous) => {
            if (previous <= 1) {
              clearInterval(timer);
              void handleDelete();
              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    message,
    deleting,
    handleDelete,
  ]);

  /*
   * --------------------------------------------------
   * LOADING / SECURITY PROCESSING
   * --------------------------------------------------
   */
  if (!message) {
    return (
      <Screen>
        <View
          style={
            styles.loadingContainer
          }
        >
          <Text
            style={
              styles.loadingText
            }
          >
            Verifying and decrypting...
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
          {/* SENDER */}
          <View
            style={
              styles.identityCard
            }
          >
            <Text style={styles.from}>
              From
            </Text>

            <Text
              style={styles.sender}
              numberOfLines={1}
            >
              {message.senderId}
            </Text>

            {message.verified && (
              <Text
                style={
                  styles.verified
                }
              >
                🛡 Signature Verified
              </Text>
            )}
          </View>

          {/* WARNING */}
          <View
            style={
              styles.warningCard
            }
          >
            <Text
              style={styles.warning}
            >
              This message will permanently
              disappear after viewing.
            </Text>
          </View>

          {/* PLAINTEXT */}
          <View
            style={
              styles.messageCard
            }
          >
            <Text
              style={styles.message}
            >
              {message.plaintext}
            </Text>
          </View>

          {/* TIMER */}
          <View
            style={
              styles.timerCard
            }
          >
            <Text
              style={
                styles.timerLabel
              }
            >
              Self Destruct
            </Text>

            <Text
              style={styles.timer}
            >
              00:
              {remaining
                .toString()
                .padStart(2, "0")}
            </Text>
          </View>

          {/* DELETE */}
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