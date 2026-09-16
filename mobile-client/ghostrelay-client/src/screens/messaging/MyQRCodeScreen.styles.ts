import { StyleSheet } from "react-native";

import { Colors } from "../../theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 10,
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 20,
  },

  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
  },

  qrLabel: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
    marginTop: 15,
  },

  sectionTitle: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 5,
  },

  publicKey: {
    color: Colors.text,
    fontSize: 12,
    lineHeight: 19,
    fontFamily: "monospace",
    marginBottom: 18,
  },

  fingerprint: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "monospace",
  },

  securityNotice: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginTop: 5,
  },

  securityTitle: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  securityText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    color: Colors.textSecondary,
    marginTop: 15,
    fontSize: 14,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  errorTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
});