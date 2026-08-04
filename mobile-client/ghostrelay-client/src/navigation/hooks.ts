import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
  AuthStackParamList,
  RootStackParamList,
} from "./types";

export const useAuthNavigation = () =>
  useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

export const useRootNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();