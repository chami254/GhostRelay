import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    height: 60,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 20,
  },

  title: {
    color: Colors.text,

    fontSize: 20,

    fontWeight: "700",
  },
});