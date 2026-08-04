import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container: {

    flex: 1,

    paddingHorizontal: 22,

    paddingTop: 10,

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

    marginBottom: 28,

  },

  input: {

    minHeight: 170,

    backgroundColor: Colors.card,

    borderRadius: 16,

    padding: 16,

    color: Colors.text,

    borderWidth: 1,

    borderColor: Colors.border,

    textAlignVertical: "top",

    marginBottom: 20,

  },

  secondaryButton: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: Colors.card,

    borderRadius: 14,

    paddingVertical: 14,

    marginBottom: 14,

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

    marginTop: "auto",

    marginBottom: 25,

  },

});