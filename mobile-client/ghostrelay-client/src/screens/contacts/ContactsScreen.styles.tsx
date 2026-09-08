import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
  },

  listEmptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 24,
  },

  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  contactInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  name: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  fingerprint: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },

  emptyDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },

  retryText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});