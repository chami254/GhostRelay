import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  label: {
    color: Colors.text,
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
  },

  selector: {
    minHeight: 52,
    backgroundColor: Colors.card,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  selectorText: {
    color: Colors.text,
    fontSize: 16,
  },

  input: {
    minHeight: 160,
    maxHeight: 240,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: "top",
  },

  counter: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 12,
  },

  securityCard: {
    backgroundColor: Colors.card,
    padding: 18,
    marginTop: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  securityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 15,
  },

  securityItem: {
    fontSize: 15,
    marginBottom: 12,
    color: Colors.text,
  },

  footer: {
    marginTop: "auto",
    paddingTop: 20,
    paddingBottom: 20,
  },
});