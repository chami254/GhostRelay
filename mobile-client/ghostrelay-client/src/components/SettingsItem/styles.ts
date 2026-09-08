import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  left: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
});