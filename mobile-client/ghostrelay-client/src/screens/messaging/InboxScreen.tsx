import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type {
  RootStackParamList,
} from "../../navigation/types";

import Screen from "../../components/Screen";

import { Colors } from "../../theme";

import styles from "./InboxScreen.styles";

import {
  getInbox,
  InboxMessage,
} from "../../api/messages";

type InboxNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function InboxScreen() {
  const navigation =
    useNavigation<InboxNavigationProp>();

  const [messages, setMessages] =
    useState<InboxMessage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadInbox = useCallback(
    async () => {
      try {
        setLoading(true);

        const inbox = await getInbox();

        setMessages(inbox);
      } catch (error) {
        console.error(
          "INBOX LOAD ERROR:",
          error
        );

        Alert.alert(
          "Relay Error",
          "Unable to retrieve messages from the relay."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * Reload whenever the Inbox tab becomes active.
   *
   * This keeps the inbox current after returning
   * from another screen.
   */
  useFocusEffect(
    useCallback(() => {
      loadInbox();
    }, [loadInbox])
  );

  function renderMessage({
    item,
  }: {
    item: InboxMessage;
  }) {
    return (
      <TouchableOpacity
        style={styles.messageCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Viewer", {
            messageId: item.id,
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`Message from ${item.sender}`}
      >
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={styles.sender}
              numberOfLines={1}
            >
              {item.sender}
            </Text>

            <Text style={styles.subtitle}>
              Encrypted Payload
            </Text>

            <Text style={styles.time}>
              Received {item.received}
            </Text>

            <Text style={styles.expiration}>
              Expires in {item.expiresIn}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#8C9AA8"
        />
      </TouchableOpacity>
    );
  }

  function renderEmptyState() {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="mail-open-outline"
          size={70}
          color="#4A5663"
        />

        <Text style={styles.emptyText}>
          No encrypted messages waiting.
        </Text>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Inbox
            </Text>

            <Text style={styles.heading}>
              Incoming Messages
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={Colors.primary}
            />
          </View>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            messages.length === 0
              ? styles.emptyList
              : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadInbox}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            renderEmptyState()
          }
          ListFooterComponent={
            messages.length > 0 ? (
              <Text style={styles.footer}>
                Messages are permanently deleted
                from the relay after successful
                retrieval.
              </Text>
            ) : null
          }
        />
      </View>
    </Screen>
  );
}