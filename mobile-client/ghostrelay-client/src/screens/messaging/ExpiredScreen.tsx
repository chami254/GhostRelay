import { ScrollView } from "react-native";
import React from "react";
import {
  View,
  Text,
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
import PrimaryButton from "../../components/PrimaryButton";

import { Colors } from "../../theme";

import styles from "./ExpiredScreen.styles";



export default function ExpiredScreen() {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (

    <Screen>
      <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.container}>

        <Ionicons
          name="shield-checkmark"
          size={120}
          color={Colors.primary}
        />

        <Text style={styles.title}>
          Message Destroyed
        </Text>

        <Text style={styles.subtitle}>
          The encrypted payload has been securely removed.
          {"\n\n"}
          No readable message remains on this device.
        </Text>

        <PrimaryButton
          title="Return Home"
          onPress={() => navigation.navigate("Tabs")}
        />

        <View style={{ height: 15 }} />

        <PrimaryButton
          title="View Inbox"
          onPress={() =>
            navigation.navigate("Tabs", {
              screen: "Inbox",
            })
          }
        />

      </View>
      </ScrollView>

    </Screen>

  );

}