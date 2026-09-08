import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
  },

  heading: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  list: {
    paddingBottom: 20,
  },

  emptyList: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  messageCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
  },

  sender: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 4,
    color: Colors.primary,
    fontSize: 13,
  },

  time: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  expiration: {
    color: "#FFB84D",
    fontSize: 12,
    marginTop: 3,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  emptyText: {
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },

  footer: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 20,
    textAlign: "center",
    color: Colors.textSecondary,
    lineHeight: 22,
    fontSize: 12,
  },
});