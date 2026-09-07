import { ScrollView } from "react-native";
import React from "react";
import {
  View,
  Text,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import PrimaryButton from "../../components/PrimaryButton";

import { Colors } from "../../theme";

import styles from "./ContactAddedScreen.styles";

export default function ContactAddedScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, "ContactAdded">>();

  const contact = route.params?.contact;

  function handleCompose() {

    if (!contact) {

      Alert.alert(
        "Contact Missing",
        "Unable to open the compose screen."
      );

      return;

    }

    navigation.navigate("Compose", {
      contact,
    });

  }

  return (
    

    <Screen>
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.container}>

        <Ionicons
          name="checkmark-circle"
          size={120}
          color={Colors.primary}
        />

        <Text style={styles.title}>
          Contact Added
        </Text>

        <Text style={styles.subtitle}>
          The contact's public key has been securely stored.
        </Text>

        <View style={styles.contactCard}>

          <Text style={styles.contactName}>
            {contact?.name ?? "Unknown Contact"}
          </Text>

          <Text style={styles.fingerprintLabel}>
            Fingerprint
          </Text>

          <Text style={styles.fingerprint}>
            {contact?.fingerprint ?? "--:--:--:--"}
          </Text>

        </View>

        <PrimaryButton
          title="Send Message"
          onPress={handleCompose}
        />

        <PrimaryButton
          title="Back to Home"
          onPress={() =>
            navigation.navigate("Tabs", {
              screen: "Home",
            })
          }
        />

      </View>
      </ScrollView>

    </Screen>

  );

}