import React from "react";
import ContactsScreen from "../screens/contacts/ContactsScreen";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import type { TabParamList } from "./types";

import HomeScreen from "../screens/home/HomeScreen";
import InboxScreen from "../screens/messaging/InboxScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

import { Colors } from "../theme";

const Tab =
  createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {

  return (

    <Tab.Navigator

      initialRouteName="Home"

      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor: Colors.primary,

        tabBarInactiveTintColor: Colors.textSecondary,

        tabBarStyle: {

          backgroundColor: Colors.background,

          borderTopColor: Colors.border,

          height: 65,

          paddingBottom: 8,

          paddingTop: 6,

        },

        tabBarLabelStyle: {

          fontSize: 12,

          fontWeight: "600",

        },

        tabBarIcon: ({ color, size }) => {

          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {

            case "Home":
              iconName = "home-outline";
              break;

            case "Contacts":
              iconName = "people-outline";
              break;

            case "Inbox":
              iconName = "mail-outline";
              break;

            case "Settings":
              iconName = "settings-outline";
              break;

            default:
              iconName = "ellipse-outline";

          }

          return (

            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />

          );

        },

      })}

    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
      />

      <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />

    </Tab.Navigator>

  );

}