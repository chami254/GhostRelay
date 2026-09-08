import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "700",
  },

  info: {
    flex: 1,
    minWidth: 0,
    marginLeft: 16,
    marginRight: 12,
  },

  name: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "600",
  },

  lastSeen: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 13,
  },

  fingerprint: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: "monospace",
  },

  statusContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    minWidth: 22,
  },

  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  online: {
    backgroundColor: "#10D6B3",
  },

  offline: {
    backgroundColor: "#5B6574",
  },
});