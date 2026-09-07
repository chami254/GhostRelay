import { ScrollView } from "react-native";
import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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

import styles from "./ContactsScreen.styles";

import {
  getContacts,
  Contact,
} from "../../api/contacts";

import { generateIdentity } from "../../native/GhostRelay";


export default function ContactsScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [contacts, setContacts] =
    useState<Contact[]>([]);

  useEffect(() => {

    loadContacts();

  }, []);

  async function loadContacts() {

    const data = await getContacts();

    setContacts(data);

  }

  

  return (

    <Screen>
      <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Header title="Contacts" />

      <View style={styles.container}>

        <FlatList

          data={contacts}

          keyExtractor={(item) => item.id}

          renderItem={({ item }) => (

            <TouchableOpacity

              style={styles.contactCard}

              onPress={() =>

                navigation.navigate("Compose", {
                  contact: item,
                })

              }

            >

              <Ionicons
                name="person-circle"
                size={48}
                color="#10D6B3"
              />

              <View
                style={{
                  marginLeft:12,
                  flex:1,
                }}
              >

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.fingerprint}>
                  {item.fingerprint}
                </Text>

              </View>

            </TouchableOpacity>

          )}

        />

      </View>
      </ScrollView>

    </Screen>

  );

}