import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

export default function GhostLogo() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="skull-outline"
        size={34}
        color="#10D6B3"
      />
    </View>
  );
}