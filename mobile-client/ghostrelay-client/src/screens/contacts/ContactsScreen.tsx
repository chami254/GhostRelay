import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";
import Screen from "../../components/Screen";
import Header from "../../components/Header";
import styles from "./ContactsScreen.styles";

import {
  getContacts,
  type Contact,
} from "../../api/contacts";

export default function ContactsScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data = await getContacts();

        setContacts(data);
      } catch (err) {
        console.error(
          "Failed to load contacts:",
          err
        );

        setError(
          "Unable to load your contacts."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  /*
   * Refresh contacts whenever the Contacts tab
   * becomes active again.
   */
  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  const handleContactPress = (contact: Contact) => {
    navigation.navigate("Compose", {
      contact,
    });
  };

  const renderContact = ({
    item,
  }: {
    item: Contact;
  }) => (
    <TouchableOpacity
      style={styles.contactCard}
      activeOpacity={0.8}
      onPress={() => handleContactPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Message ${item.name}`}
    >
      <Ionicons
        name="person-circle"
        size={48}
        color="#10D6B3"
      />

      <View style={styles.contactInfo}>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.fingerprint}>
          {item.fingerprint}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#8C9AA8"
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator
            size="large"
            color="#10D6B3"
          />

          <Text style={styles.emptyText}>
            Loading contacts...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="cloud-offline-outline"
            size={56}
            color="#8C9AA8"
          />

          <Text style={styles.emptyText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadContacts()}
            activeOpacity={0.8}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="people-outline"
          size={64}
          color="#4A5663"
        />

        <Text style={styles.emptyText}>
          No contacts available.
        </Text>

        <Text style={styles.emptyDescription}>
          Add a trusted contact to start sending
          secure messages.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            navigation.navigate("AddContact")
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="person-add-outline"
            size={18}
            color="#10D6B3"
          />

          <Text style={styles.retryText}>
            Add Contact
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header title="Contacts" />

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            contacts.length === 0
              ? styles.listEmptyContainer
              : styles.listContent
          }
          refreshing={refreshing}
          onRefresh={() => loadContacts(true)}
          ListEmptyComponent={
            renderEmptyState
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </Screen>
  );
}