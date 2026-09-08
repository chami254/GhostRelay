import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import StatusBanner from "../../components/StatusBanner";
import ContactCard from "../../components/ContactCard";

import { useRootNavigation } from "../../navigation/hooks";
import type { Contact as NavigationContact } from "../../navigation/types";

import styles from "./HomeScreen.styles";

interface HomeContact extends NavigationContact {
  lastSeen: string;
  online: boolean;
}

export default function HomeScreen() {
  const navigation = useRootNavigation();

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<HomeContact[]>([]);

  /*
   * Contacts are intentionally isolated from the UI.
   *
   * The real contacts API/database will be connected here
   * during the server API integration phase.
   */
  const loadContacts = useCallback(async () => {
    try {
      // TODO: Replace with the real contacts repository/API.
      setContacts([]);
    } catch (error) {
      console.error("Failed to load contacts:", error);
      setContacts([]);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  /*
   * Home must not generate a new Rust identity.
   *
   * Identity creation is handled during onboarding and the
   * authentication/security layer owns that lifecycle.
   */

  const filteredContacts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return contacts;
    }

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedSearch)
    );
  }, [contacts, search]);

  const handleStartNewMessage = () => {
    navigation.navigate("AddContact");
  };

  const handleContactPress = (contact: HomeContact) => {
    navigation.navigate("Compose", {
      contact,
    });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>GhostRelay</Text>

                <TouchableOpacity
                  onPress={handleStartNewMessage}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Start a new message"
                  accessibilityHint="Opens the add contact screen"
                  hitSlop={8}
                  style={styles.addButton}
                >
                  <Ionicons
                    name="add-circle"
                    size={34}
                    color="#10D6B3"
                  />
                </TouchableOpacity>
              </View>

              <StatusBanner status="RELAY ACTIVE" />

              <SearchBar
                value={search}
                onChangeText={setSearch}
              />

              <Text style={styles.section}>
                CONTACTS
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ContactCard
              name={item.name}
              lastSeen={item.lastSeen}
              online={item.online}
              fingerprint={item.fingerprint}
              onPress={() => handleContactPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="people-outline"
                size={42}
                color="#8C9AA8"
              />

              <Text style={styles.emptyTitle}>
                {search.trim()
                  ? "No contacts found"
                  : "No contacts yet"}
              </Text>

              <Text style={styles.emptyText}>
                {search.trim()
                  ? "Try a different search."
                  : "Start a new message to add your first contact."}
              </Text>

              {!search.trim() && (
                <TouchableOpacity
                  onPress={handleStartNewMessage}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Add a contact"
                  style={styles.emptyAction}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color="#10D6B3"
                  />

                  <Text style={styles.emptyActionText}>
                    Add Contact
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </Screen>
  );
}