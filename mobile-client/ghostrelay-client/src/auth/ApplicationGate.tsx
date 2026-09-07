import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "./AuthContext";

import AuthNavigator from "../navigation/AuthNavigator";
import MainNavigator from "../navigation/MainNavigator";

import { Colors } from "../theme";

export default function ApplicationGate() {
  const {
    status,
    restoreSession,
  } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  /*
   * While we determine whether an existing session exists,
   * don't expose either the onboarding flow or the main app.
   */
  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={Colors.text}
        />
      </View>
    );
  }

  /*
   * No valid session:
   * show Splash → Welcome → Identity.
   */
  if (
    status === "unauthenticated"
  ) {
    return <AuthNavigator />;
  }

  /*
   * Valid session:
   * allow access to the main application.
   */
  if (
    status === "authenticated"
  ) {
    return <MainNavigator />;
  }

  /*
   * Locked sessions will be handled by the
   * secure unlock flow in the next part of this phase.
   */
  if (status === "locked") {
    return <AuthNavigator />;
  }

  return null;
}