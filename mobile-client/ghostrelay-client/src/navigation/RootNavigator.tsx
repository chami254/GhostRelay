import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "../auth/AuthContext";
import ApplicationGate from "../auth/ApplicationGate";

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ApplicationGate />
      </AuthProvider>
    </NavigationContainer>
  );
}