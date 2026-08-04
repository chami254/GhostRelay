import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container: {

    flexDirection: "row",

    alignItems: "center",

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

    marginLeft: 16,

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

    justifyContent: "space-between",

    alignItems: "center",

    height: 52,

  },

  onlineIndicator: {

    width: 10,

    height: 10,

    borderRadius: 5,

  },

});