import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container: {

    padding: 22,

    paddingBottom: 50,

  },

  appName: {

    fontSize: 30,

    fontWeight: "700",

    color: Colors.primary,

    textAlign: "center",

  },

  tagline: {

    marginTop: 8,

    color: Colors.text,

    textAlign: "center",

    fontSize: 16,

  },

  version: {

    marginTop: 12,

    color: Colors.textSecondary,

    textAlign: "center",

  },

  sectionTitle: {

    fontSize: 18,

    fontWeight: "700",

    color: Colors.primary,

    marginBottom: 14,

  },

  body: {

    color: Colors.text,

    lineHeight: 24,

    fontSize: 15,

  },

  feature: {

    color: Colors.text,

    marginBottom: 10,

    fontSize: 15,

  },

  footer: {

    marginTop: 25,

    textAlign: "center",

    color: Colors.textSecondary,

    fontSize: 13,

  },

});