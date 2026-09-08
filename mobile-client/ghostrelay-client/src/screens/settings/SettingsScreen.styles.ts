import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  content: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },

  /*
   * ---------------- SECTION HEADERS ----------------
   */

  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 4,
    paddingHorizontal: 4,
  },

  /*
   * ---------------- SYSTEM STATUS ----------------
   */

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  statusTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    color: Colors.primary,
  },

  statusTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  statusItem: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 20,
  },

  /*
   * ---------------- FOOTER ----------------
   */

  footer: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 12,
  },

  version: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  versionDetail: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  environment: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});