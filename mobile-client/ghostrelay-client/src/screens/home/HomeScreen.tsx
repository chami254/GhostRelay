import { ScrollView } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import StatusBanner from "../../components/StatusBanner";
import ContactCard from "../../components/ContactCard";

import { useAuthNavigation } from "../../navigation/hooks";
import { Colors } from "../../theme";

import styles from "./HomeScreen.styles";

import { generateIdentity } from "../../native/GhostRelay";



export interface Contact {
  id: string;
  name: string;
  lastSeen: string;
  online: boolean;
  fingerprint: string;
}

async function loadIdentity() {
  try {
    const identity = await generateIdentity();

    console.log(identity.publicKey);
    console.log(identity.fingerprint);
  } catch (error) {
    console.error("Failed to generate identity:", error);
  }
}


const MOCK_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Alice",
    lastSeen: "2 min ago",
    online: true,
    fingerprint: "A1:B2:C3:D4:E5:F6",
  },
  {
    id: "2",
    name: "Charlie",
    lastSeen: "1 hour ago",
    online: false,
    fingerprint: "F6:E5:D4:C3:B2:A1",
  },
  {
    id: "3",
    name: "Nova",
    lastSeen: "Just now",
    online: true,
    fingerprint: "N0:V4:A1:2B:3C:4D",
  },
  {
    id: "4",
    name: "Phantom_X",
    lastSeen: "3 days ago",
    online: false,
    fingerprint: "P9:H8:A7:N6:T5:O4:M3",
  },
];

export default function HomeScreen() {

  const navigation = useAuthNavigation();

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {

    // TODO:
    // Replace with:
    // const data = await getContacts();

    setContacts(MOCK_CONTACTS);

  }

  const filteredContacts = useMemo(() => {

    return contacts.filter(contact =>
      contact.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [contacts, search]);

  return (
    <Screen>

      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.title}>
            GhostRelay
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddContact")}
          >
            <Ionicons
              name="add-circle"
              size={34}
              color={Colors.primary}
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

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Compose", {
                  contact: item,
                })
              }
            >
              <ContactCard
                name={item.name}
                lastSeen={item.lastSeen}
                online={item.online}
                fingerprint={item.fingerprint}
              />
            </TouchableOpacity>
          )}
        />

      </View>

    </Screen>
  );
}