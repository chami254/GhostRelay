import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card";

interface Props {
  status: string;
}

export default function StatusBanner({ status }: Props) {
  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="radio-outline"
            size={18}
            color="#10D6B3"
          />

          <Text
            style={{
              color: "#10D6B3",
              marginLeft: 8,
              fontWeight: "600",
            }}
          >
            {status}
          </Text>
        </View>

        <Ionicons
          name="ellipsis-horizontal"
          size={18}
          color="#8C9AA8"
        />
      </View>
    </Card>
  );
}