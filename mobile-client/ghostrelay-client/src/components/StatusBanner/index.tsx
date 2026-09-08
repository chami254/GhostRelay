import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Card from "../Card";
import styles from "./styles";

interface StatusBannerProps {
  status: string;
}

export default function StatusBanner({
  status,
}: StatusBannerProps) {
  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.statusContent}>
          <Ionicons
            name="radio-outline"
            size={18}
            color={styles.icon.color}
          />

          <Text style={styles.statusText}>
            {status}
          </Text>
        </View>

        <Ionicons
          name="ellipsis-horizontal"
          size={18}
          color={styles.menuIcon.color}
        />
      </View>
    </Card>
  );
}