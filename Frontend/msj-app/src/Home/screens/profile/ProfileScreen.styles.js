import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  profilePictureContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  changePhotoText: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "500",
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    fontWeight: "500",
  },
  infoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  infoValue: {
    fontSize: 15,
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  badgeCount: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "500",
  },
  eventCountText: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "500",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
  },
  badge: {
    alignItems: "center",
    width: 70,
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  badgeMilestone: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 2,
  },
  noBadgesContainer: {
    alignItems: "center",
    paddingVertical: 30,
    width: "100%",
  },
  noBadgesText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 12,
  },
  noBadgesSubtext: {
    fontSize: 12,
    color: "#D1D5DB",
    marginTop: 4,
  },
  noEventsContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  noEventsText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
    fontWeight: "500",
  },
  noEventsSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  eventsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  eventCard: {
    width: 110,
    marginRight: 12,
  },
  eventImage: {
    width: 110,
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  eventLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: "#6B7280",
  },
});
