import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card";
import styles from "./styles";

interface ContactCardProps {
  name: string;
  lastSeen: string;
  online: boolean;
  verified?: boolean;
  fingerprint?: string;
  onPress?: () => void;
}

export default function ContactCard({
  name,
  lastSeen,
  online,
  verified = true,
  fingerprint,
  onPress,
}: ContactCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Card>
        <View style={styles.container}>
          {/* Avatar */}

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Contact Info */}

          <View style={styles.info}>
            <Text style={styles.name}>
              {name}
            </Text>

            <Text style={styles.lastSeen}>
              {lastSeen}
            </Text>
          </View>

          {/* Fingerprint */}

          {fingerprint && (
            <Text style={styles.fingerprint}>
              {fingerprint}
            </Text>
          )}

          {/* Status */}

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.onlineIndicator,
                {
                  backgroundColor: online
                    ? "#10D6B3"
                    : "#5B6574",
                },
              ]}
            />

            {verified && (
              <Ionicons
                name="shield-checkmark"
                size={18}
                color="#10D6B3"
              />
            )}

            <Ionicons
              name="chatbubble-outline"
              size={18}
              color="#9AA8B5"
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}