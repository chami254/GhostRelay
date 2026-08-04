import React from "react";
import { View, ViewStyle } from "react-native";
import styles from "./styles";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({
  children,
  style,
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}