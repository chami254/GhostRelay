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
    paddingBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },

  identityCard: {
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  from: {
    color: Colors.textSecondary,
    fontSize: 13,
  },

  sender: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 5,
  },

  verified: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 13,
  },

  warningCard: {
    backgroundColor: "#332A15",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  warning: {
    color: "#FFD166",
    lineHeight: 22,
  },

  messageCard: {
    flex: 1,
    minHeight: 160,
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },

  message: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 27,
  },

  timerCard: {
    alignItems: "center",
    marginBottom: 18,
  },

  timerLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },

  timer: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 3,
  },
});