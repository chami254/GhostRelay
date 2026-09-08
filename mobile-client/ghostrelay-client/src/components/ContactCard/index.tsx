import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={
        onPress ? `Open conversation with ${name}` : undefined
      }
    >
      <Card>
        <View style={styles.container}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initial || "?"}
            </Text>
          </View>

          {/* Contact information */}
          <View style={styles.info}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>

            <Text
              style={styles.lastSeen}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lastSeen}
            </Text>

            {fingerprint && (
              <Text
                style={styles.fingerprint}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {fingerprint}
              </Text>
            )}
          </View>

          {/* Contact status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.onlineIndicator,
                online
                  ? styles.online
                  : styles.offline,
              ]}
            />

            {verified && (
              <Ionicons
                name="shield-checkmark"
                size={18}
                color="#10D6B3"
              />
            )}

            {onPress && (
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color="#9AA8B5"
              />
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}