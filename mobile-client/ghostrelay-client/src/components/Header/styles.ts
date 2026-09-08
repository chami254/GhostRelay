import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    minHeight: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  sidePlaceholder: {
    width: 32,
    height: 32,
  },

  title: {
    flex: 1,
    marginHorizontal: 12,
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});