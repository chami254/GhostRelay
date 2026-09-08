import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export default function Header({
  title,
  onBack,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#10D6B3"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}

      <Text
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>

      <View style={styles.sidePlaceholder} />
    </View>
  );
}