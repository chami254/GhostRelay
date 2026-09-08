import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
});