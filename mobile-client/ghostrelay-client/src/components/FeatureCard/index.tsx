import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Card from "../Card";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export default function FeatureCard({
  icon,
  title,
}: Props) {
  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color="#10D6B3"
        />

        <Text
          style={{
            color: "white",
            marginLeft: 12,
            fontSize: 15,
          }}
        >
          {title}
        </Text>
      </View>
    </Card>
  );
}