import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Card from "../Card";
import styles from "./styles";

interface FeaturedCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export default function FeaturedCard({
  icon,
  title,
}: FeaturedCardProps) {
  return (
    <Card>
      <View style={styles.container}>
        <Ionicons
          name={icon}
          size={18}
          color="#10D6B3"
        />

        <Text
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
    </Card>
  );
}