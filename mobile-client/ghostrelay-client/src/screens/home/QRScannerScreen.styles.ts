import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  /* ---------------- LOADING ---------------- */

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    color: Colors.textSecondary,
    marginTop: 14,
    textAlign: "center",
  },

  /* ---------------- PERMISSION ---------------- */

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 24,
  },

  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  permissionIconText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  permissionTitle: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  permissionDeniedText: {
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },

  /* ---------------- CAMERA ---------------- */

  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    maxHeight: 380,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.card,
    marginTop: 12,
    alignSelf: "center",
    position: "relative",
  },

  camera: {
    flex: 1,
  },

  /* ---------------- SCAN FRAME ---------------- */

  scanFrame: {
    position: "absolute",
    width: "70%",
    aspectRatio: 1,
    top: "15%",
    left: "15%",
  },

  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.primary,
    borderTopLeftRadius: 8,
  },

  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.primary,
    borderTopRightRadius: 8,
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 8,
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.primary,
    borderBottomRightRadius: 8,
  },

  /* ---------------- INSTRUCTIONS ---------------- */

  instructions: {
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 18,
    paddingHorizontal: 8,
  },

  actionContainer: {
    marginTop: 18,
  },
});