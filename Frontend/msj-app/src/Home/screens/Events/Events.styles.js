import { StyleSheet, Platform } from "react-native";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";
const SLATE = "#1F2F3A";
const LIGHT_GRAY = "#E8EDEF";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatbotButton: {
    position: "absolute",
    bottom: 140,
    right: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chatbotButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: SLATE,
  },
  chipsContainer: {
    paddingVertical: 16,
    gap: 10,
    marginTop: 8,
  },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TEAL,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEAL,
  },
  chipTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 12,
  },
  horizontalList: {
    paddingRight: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 280,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 170,
    backgroundColor: LIGHT_GRAY,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMetaText: {
    fontSize: 12,
    color: "#7A8A9A",
    fontWeight: "500",
  },
  cardTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTag: {
    backgroundColor: "#E8F3FF",
    borderColor: "#4A90E2",
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4A90E2",
  },
  seatsTag: {
    backgroundColor: "#EEF3F6",
    borderColor: "#6D8B99",
  },
  seatsTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6D8B99",
  },
  durationTag: {
    backgroundColor: "#FFE8F0",
    borderColor: "#E94B8B",
  },
  durationTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E94B8B",
  },
  priceTag: {
    backgroundColor: "#FFF4E6",
    borderColor: "#F59E0B",
  },
  priceTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#F59E0B",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#7A8A9A",
    fontStyle: "italic",
  },
});
