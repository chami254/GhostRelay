import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 340,
  },

  actions: {
    paddingBottom: 8,
  },

  buttonSpacer: {
    height: 12,
  },
});