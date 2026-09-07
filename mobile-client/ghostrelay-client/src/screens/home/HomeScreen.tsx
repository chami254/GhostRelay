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

import { useRootNavigation } from "../../navigation/hooks";

import { Colors } from "../../constants/theme";
import styles from "./HomeScreen.styles";

import type { Contact as NavigationContact } from "../../navigation/types";

import { generateIdentity } from "../../native/GhostRelay";

/* ---------------- HOME CONTACT ---------------- */

interface HomeContact extends NavigationContact {
lastSeen: string;
online: boolean;
}

/* ---------------- IDENTITY ---------------- */

async function loadIdentity() {
try {
const identity = await generateIdentity();


console.log("Public Key:", identity.publicKey);
console.log("Fingerprint:", identity.fingerprint);


} catch (error) {
console.error("Failed to generate identity:", error);
}
}

/* ---------------- HOME SCREEN ---------------- */

export default function HomeScreen() {
const navigation = useRootNavigation();

const [search, setSearch] = useState("");
const [contacts, setContacts] = useState<HomeContact[]>([]);

/* ---------------- LOAD IDENTITY ---------------- */

useEffect(() => {
loadIdentity();
}, []);

/* ---------------- LOAD CONTACTS ---------------- */

useEffect(() => {
loadContacts();
}, []);

async function loadContacts() {
// TODO:
// Replace with the real contacts API/database implementation.
//
// Example:
// const data = await getContacts();
// setContacts(data);


setContacts([]);


}

/* ---------------- FILTER CONTACTS ---------------- */

const filteredContacts = useMemo(() => {
return contacts.filter((contact) =>
contact.name
.toLowerCase()
.includes(search.toLowerCase())
);
}, [contacts, search]);

/* ---------------- UI ---------------- */

return ( <Screen> <View style={styles.container}>

```
    {/* Header */}

    <View style={styles.header}>
      <Text style={styles.title}>
        GhostRelay
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddContact")}
        activeOpacity={0.7}
      >
        <Ionicons
          name="add-circle"
          size={34}
          color={Colors.light.text}
        />
      </TouchableOpacity>
    </View>


    {/* Relay Status */}

    <StatusBanner status="RELAY ACTIVE" />


    {/* Contact Search */}

    <SearchBar
      value={search}
      onChangeText={setSearch}
    />


    {/* Contacts Section */}

    <Text style={styles.section}>
      CONTACTS
    </Text>


    {/* Contact List */}

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
      ListEmptyComponent={
        <Text style={styles.section}>
          No contacts available.
        </Text>
      }
    />

  </View>
</Screen>


);
}
