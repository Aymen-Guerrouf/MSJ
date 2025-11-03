import { StyleSheet, Platform } from "react-native";

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const PALE_GREEN_BORDER = "rgba(151, 203, 177, 0.45)";
const TEXT_DARK = "#1E3A3A";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 80,
    paddingHorizontal: 22,
  },
  logo: {
    alignSelf: "center",
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.48,
    color: "#2E3E5C",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#8189B0",
    marginTop: 8,
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PALE_GREEN,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALE_GREEN_BORDER,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 20,
  },
  leadingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E1F3EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: TEXT_DARK,
    fontSize: 15,
  },
  inputWithTrailing: {
    paddingRight: 8,
  },
  trailingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  inputError: {
    borderWidth: 0,
  },
  error: {
    color: "#CC4B4B",
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 6,
  },
  rightLinkWrap: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 28,
  },
  rightLink: {
    color: "#2D8A64",
    fontSize: 13,
    fontWeight: "700",
  },
  cta: {
    marginTop: 0,
    borderRadius: 16,
    overflow: "hidden",
  },
  ctaInner: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
  },
  footerMuted: {
    color: "#3C5568",
    fontSize: 14,
  },
  footerLink: {
    color: "#2D8A64",
    fontSize: 14,
    fontWeight: "700",
  },
  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
});
