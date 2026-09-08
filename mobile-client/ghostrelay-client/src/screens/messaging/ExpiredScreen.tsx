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

type ExpiredNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function ExpiredScreen() {
  const navigation =
    useNavigation<ExpiredNavigationProp>();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons
            name="shield-checkmark"
            size={110}
            color={Colors.primary}
          />

          <Text style={styles.title}>
            Message Destroyed
          </Text>

          <Text style={styles.subtitle}>
            The encrypted payload has been
            securely removed.
            {"\n\n"}
            No readable message remains on
            this device.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Return Home"
            onPress={() =>
              navigation.navigate("Tabs", {
                screen: "Home",
              })
            }
          />

          <View style={styles.buttonSpacer} />

          <PrimaryButton
            title="View Inbox"
            onPress={() =>
              navigation.navigate("Tabs", {
                screen: "Inbox",
              })
            }
          />
        </View>
      </View>
    </Screen>
  );
}