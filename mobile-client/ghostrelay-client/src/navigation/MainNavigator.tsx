
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./types";

import TabNavigator from "./TabNavigator";
import ComposeScreen from "../screens/messaging/ComposeScreen";
import AddContactScreen from "../screens/home/AddContactScreen";
import QRScannerScreen from "../screens/home/QRScannerScreen";
import ContactAddedScreen from "../screens/home/ContactAddedScreen";
import ViewerScreen from "../screens/messaging/ViewerScreen";
import ExpiredScreen from "../screens/messaging/ExpiredScreen";
import AboutScreen from "../screens/settings/AboutScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
      />

      <Stack.Screen
        name="Compose"
        component={ComposeScreen}
      />

      <Stack.Screen
        name="AddContact"
        component={AddContactScreen}
      />

      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
      />

      <Stack.Screen
        name="ContactAdded"
        component={ContactAddedScreen}
      />

      <Stack.Screen
        name="Viewer"
        component={ViewerScreen}
      />

      <Stack.Screen
        name="Expired"
        component={ExpiredScreen}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
      />
    </Stack.Navigator>
  );
}
