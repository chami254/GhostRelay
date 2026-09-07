
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "./types";

import SplashScreen from "../screens/onboarding/SplashScreen";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import IdentityScreen from "../screens/onboarding/IdentityScreen";
import MainNavigator from "./MainNavigator";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />

      <Stack.Screen
        name="Identity"
        component={IdentityScreen}
      />

      <Stack.Screen
        name="Main"
        component={MainNavigator}
      />
    </Stack.Navigator>
  );
}