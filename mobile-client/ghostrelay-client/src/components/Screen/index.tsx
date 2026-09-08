import React from "react";
import { SafeAreaView } from "react-native";

import styles from "./styles";

interface ScreenProps {
  children: React.ReactNode;
}

export default function Screen({
  children,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
}