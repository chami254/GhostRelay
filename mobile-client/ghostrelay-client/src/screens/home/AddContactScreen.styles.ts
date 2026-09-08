import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
  },

  heading: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },

  input: {
    minHeight: 150,
    maxHeight: 220,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: "top",
    marginBottom: 18,
  },

  secondaryButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  secondaryText: {
    color: Colors.primary,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    marginTop: 12,
    paddingTop: 8,
  },
});