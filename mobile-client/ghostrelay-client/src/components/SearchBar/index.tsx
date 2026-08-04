import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#8C9AA8"
      />

      <TextInput
        style={styles.input}
        placeholder="Search contacts..."
        placeholderTextColor="#8C9AA8"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}