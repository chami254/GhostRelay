import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    color: Colors.primary,
  },

  statusText: {
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: "600",
  },

  menuIcon: {
    color: Colors.textSecondary,
  },
});