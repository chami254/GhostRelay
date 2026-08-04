import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
      <TouchableOpacity onPress={onBack}>
        <Ionicons
          name="arrow-back"
          size={22}
          color="#10D6B3"
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={{ width: 22 }} />
    </View>
  );
}