import { StyleSheet } from "react-native";

import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: Colors.card,

    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,

    paddingHorizontal: 15,
    marginVertical: 15,
  },

  icon: {
    color: Colors.textSecondary,
  },

  input: {
    flex: 1,

    color: Colors.text,

    marginLeft: 10,

    paddingVertical: 10,

    fontSize: 15,
  },

  placeholder: {
    color: Colors.textSecondary,
  },
});