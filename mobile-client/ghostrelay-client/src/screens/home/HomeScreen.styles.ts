import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  /*
   * Padding belongs to the list content rather than the outer
   * container so the FlatList can correctly calculate the
   * available screen height.
   */
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    minHeight: 42,
  },

  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
  },

  addButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    color: Colors.textSecondary,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  emptyState: {
    flex: 1,
    minHeight: 240,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
  },

  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
    maxWidth: 300,
  },

  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  emptyActionText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
});