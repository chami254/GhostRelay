import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 24,
  },

  title: {
    flex: 1,
    marginLeft: 12,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
});