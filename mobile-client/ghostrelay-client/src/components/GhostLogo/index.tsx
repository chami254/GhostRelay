import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GhostLogo() {
  return (
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#10D6B3",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 24,
      }}
    >
      <Ionicons
        name="skull-outline"
        size={34}
        color="#10D6B3"
      />
    </View>
  );
}