import { ScrollView } from "react-native";
import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";

import Screen from "../../components/Screen";
import GhostLogo from "../../components/GhostLogo";
import { Colors } from "../../theme";


export default function SplashScreen() {

  const navigation =
  useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {

    const timer = setTimeout(() => {
  
      navigation.replace("Welcome");
  
    }, 2000);
  
    return () => clearTimeout(timer);
  
  }, []);

     

  return (

    <Screen>

      <View
        style={{
          flex:1,
          justifyContent:"center",
          alignItems:"center",
          paddingHorizontal:30,
        }}
      >

        <GhostLogo/>

        <Text
          style={{
            color:Colors.text,
            fontSize:32,
            fontWeight:"700",
            marginTop:10,
          }}
        >
          GhostRelay
        </Text>

        <Text
          style={{
            color:Colors.textSecondary,
            marginTop:8,
            textAlign:"center",
          }}
        >
          Secure Ephemeral Messaging
        </Text>

        <ActivityIndicator
          color={Colors.primary}
          size="large"
          style={{
            marginTop:50,
          }}
        />

      </View>

    </Screen>

  );

}