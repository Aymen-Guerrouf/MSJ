import { StyleSheet, Platform } from "react-native";

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const TEAL = "rgba(107,174,151,1)";
const SLATE = "#244355";

export const styles = StyleSheet.create({
  searchWrap: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(151, 203, 177, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#1E3A3A",
    fontSize: 15,
  },
  clearBtn: {
    paddingLeft: 6,
    paddingVertical: 4,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 10,
    backgroundColor: TEAL,
    marginLeft: 6,
  },
  selectText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  locate: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(151, 203, 177, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 8 },
    }),
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  sheetGrab: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 8,
  },
  sheetRow: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: PALE_GREEN,
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.45)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetRowActive: {
    backgroundColor: "rgba(107,174,151,0.12)",
    borderColor: TEAL,
  },
  sheetRowText: {
    color: SLATE,
    fontSize: 14,
    fontWeight: "700",
  },
  sheetRowTextActive: {
    color: TEAL,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  loadingText: {
    marginTop: 12,
    color: SLATE,
    fontSize: 14,
    fontWeight: "600",
  },
  errorOverlay: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
  },
  errorCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(204,75,75,0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  errorText: {
    marginTop: 8,
    color: "#CC4B4B",
    fontSize: 13,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: TEAL,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});

export const pinStyles = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  ring: {
    backgroundColor: "#ffffff",
    padding: 3,
    borderRadius: 16,
  },
  badge: {
    backgroundColor: TEAL,
    borderRadius: 13,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(150,214,195,1)",
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: TEAL,
    marginTop: 2,
  },
});

export const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", stylers: [{ color: "#d6f3ea" }] },
];
