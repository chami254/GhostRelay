import React, { useCallback, useMemo, useState } from "react";

import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import StatusBanner from "../../components/StatusBanner";
import ContactCard from "../../components/ContactCard";

import { useRootNavigation } from "../../navigation/hooks";
import type { Contact as NavigationContact } from "../../navigation/types";

import { getContacts } from "../../api/contacts";

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
   * --------------------------------------------------
   * LOAD CONTACTS
   * --------------------------------------------------
   *
   * Contacts are stored by the relay server.
   *
   * Home retrieves the latest contacts whenever the
   * screen becomes focused.
   */
  const loadContacts = useCallback(async () => {
    try {
      const savedContacts = await getContacts();

      const homeContacts: HomeContact[] = savedContacts.map(
        (contact) => ({
          ...contact,

          /*
           * The relay currently does not provide presence
           * information, so these are UI defaults.
           */
          lastSeen: "Unknown",
          online: false,
        })
      );

      setContacts(homeContacts);

      console.log(
        "HOME: contacts loaded:",
        homeContacts.length
      );
    } catch (error) {
      console.error(
        "HOME: failed to load contacts:",
        error
      );

      setContacts([]);
    }
  }, []);

  /*
   * --------------------------------------------------
   * REFRESH WHEN HOME SCREEN IS FOCUSED
   * --------------------------------------------------
   *
   * This is important because HomeScreen may remain
   * mounted while the user navigates to AddContact.
   *
   * When the user returns to Home, contacts are fetched
   * again instead of relying on the old state.
   */
  useFocusEffect(
    useCallback(() => {
      void loadContacts();
    }, [loadContacts])
  );

  /*
   * --------------------------------------------------
   * FILTER CONTACTS
   * --------------------------------------------------
   */
  const filteredContacts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return contacts;
    }

    return contacts.filter((contact) =>
      contact.name
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [contacts, search]);

  /*
   * --------------------------------------------------
   * NAVIGATION
   * --------------------------------------------------
   */
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
                <Text style={styles.title}>
                  GhostRelay
                </Text>

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
              onPress={() =>
                handleContactPress(item)
              }
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