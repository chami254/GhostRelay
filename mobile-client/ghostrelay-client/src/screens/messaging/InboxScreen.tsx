import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import type {
  RootStackParamList,
} from "../../navigation/types";

import Screen from "../../components/Screen";
import Header from "../../components/Header";

import { Colors } from "../../theme";

import styles from "./InboxScreen.styles";

import {
  getInbox,
  InboxMessage,
} from "../../api/messages";



export default function InboxScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [messages, setMessages] =
    useState<InboxMessage[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    loadInbox();

  }, []);

  async function loadInbox() {

    try {

      setLoading(true);

      const inbox = await getInbox();

      setMessages(inbox);

    } catch {

      Alert.alert(
        "Relay Error",
        "Unable to retrieve messages from the relay."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <Screen>
      <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Header
        title="Inbox"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>

        <Text style={styles.heading}>
          Incoming Messages
        </Text>

        <FlatList

          data={messages}

          keyExtractor={(item) => item.id}

          refreshing={loading}

          onRefresh={loadInbox}

          showsVerticalScrollIndicator={false}

          ListEmptyComponent={() => (

            <View
              style={{
                marginTop: 70,
                alignItems: "center",
              }}
            >

              <Ionicons
                name="mail-open-outline"
                size={70}
                color="#4A5663"
              />

              <Text
                style={{
                  color: Colors.textSecondary,
                  marginTop: 16,
                }}
              >
                No encrypted messages waiting.
              </Text>

            </View>

          )}

          renderItem={({ item }) => (

            <TouchableOpacity

              style={styles.messageCard}

              onPress={() =>

                navigation.navigate("Viewer", {

                  messageId: item.id,

                })

              }

            >

              <View style={styles.leftSection}>

                <Ionicons
                  name="lock-closed"
                  size={24}
                  color={Colors.primary}
                />

                <View style={styles.textContainer}>

                  <Text style={styles.sender}>
                    {item.sender}
                  </Text>

                  <Text style={styles.subtitle}>
                    Encrypted Payload
                  </Text>

                  <Text style={styles.time}>
                    Received {item.received}
                  </Text>

                  <Text
                    style={{
                      color: "#FFB84D",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
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

          )}

        />

        <Text style={styles.footer}>
          Messages are permanently deleted from the relay after successful retrieval.
        </Text>

      </View>
      </ScrollView>

    </Screen>

  );

}