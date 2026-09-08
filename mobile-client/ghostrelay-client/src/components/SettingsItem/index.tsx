import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../theme";
import styles from "./styles";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export default function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={
        subtitle ? subtitle : undefined
      }
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={22}
          color={Colors.primary}
        />

        <View style={styles.textContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              style={styles.subtitle}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.textSecondary}
      />
    </TouchableOpacity>
  );
}