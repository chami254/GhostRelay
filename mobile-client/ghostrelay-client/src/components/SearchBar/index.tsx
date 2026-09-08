import React from "react";
import {
  View,
  TextInput,
  type TextInputProps,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search contacts...",
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search contacts"
      />
    </View>
  );
}