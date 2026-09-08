import React from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";

import styles from "./styles";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({
  title,
  onPress,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text
        style={styles.text}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}