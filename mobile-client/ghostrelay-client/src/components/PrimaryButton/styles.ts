import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  button: {
    minHeight: 55,
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  text: {
    color: "#081018",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});