// screens/Events/Events.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { API_ENDPOINTS, getAuthHeaders } from "../../../config/api";

const TEAL = "rgba(107,174,151,1)";
const SLATE = "#1F2F3A";
const LIGHT_GRAY = "#E8EDEF";

export default function Events() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Both"); // "Events", "Workshops", or "Both"

  const categories = useMemo(
    () => ["All", "Design", "Culture and pr", "Sport", "Enterprise"],
    []
  );

  useEffect(() => {
    fetchEventsAndWorkshops();
  }, []);

  const fetchEventsAndWorkshops = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const centersRes = await fetch(
        `${API_ENDPOINTS.CENTERS.LIST}?include=events,workshops`,
        { headers }
      );
      const centersData = await centersRes.json().catch(() => null);

      const centersList =
        centersData?.data?.centers ||
        centersData?.centers ||
        (Array.isArray(centersData) ? centersData : []) ||
        [];

      const allEvents = [];
      const allWorkshops = [];

      centersList.forEach((center) => {
        if (Array.isArray(center.events)) {
          center.events.forEach((event) =>
            allEvents.push({ ...event, center })
          );
        }
        if (Array.isArray(center.workshops)) {
          center.workshops.forEach((w) => allWorkshops.push({ ...w, center }));
        }
      });

      setEvents(allEvents);
      setWorkshops(allWorkshops);
    } catch (error) {
      Alert.alert("Error", "Failed to load events and workshops");
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (items) => {
    if (activeTab === "All") return items;
    const tab = activeTab.toLowerCase();
    return items.filter((item) => {
      const category = (item.category || "").toLowerCase();
      if (tab === "design")
        return category.includes("design") || category === "art";
      if (tab === "culture and pr")
        return category.includes("culture") || category.includes("education");
      if (tab === "sport")
        return category.includes("sport") || category.includes("sports");
      if (tab === "enterprise")
        return category.includes("coding") || category.includes("tech");
      return false;
    });
  };

  const searchFilter = (items) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.title?.toLowerCase().includes(q));
  };

  const filteredEvents = searchFilter(filterByCategory(events));
  const filteredWorkshops = searchFilter(filterByCategory(workshops));

  const toggleFilterType = () => {
    if (filterType === "Both") setFilterType("Events");
    else if (filterType === "Events") setFilterType("Workshops");
    else setFilterType("Both");
  };

  const shouldShowEvents = filterType === "Both" || filterType === "Events";
  const shouldShowWorkshops =
    filterType === "Both" || filterType === "Workshops";

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* Single vertical scroller for the page to avoid nested scroll bounce/gaps */}
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#7A8A9A"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={toggleFilterType}
          >
            <Ionicons name="options-outline" size={18} color={TEAL} />
            <Text style={styles.filterTypeText}>{filterType}</Text>
          </TouchableOpacity>
        </View>

        {/* Category chips (slim, inline) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {categories.map((category) => {
            const active = activeTab === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveTab(category)}
                activeOpacity={0.9}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading or lists */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={TEAL} />
          </View>
        ) : (
          <>
            {shouldShowEvents &&
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id || event.id}
                  event={event}
                  navigation={navigation}
                  formatDate={formatDate}
                />
              ))}

            {shouldShowWorkshops &&
              filteredWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop._id || workshop.id}
                  workshop={workshop}
                  navigation={navigation}
                  formatDate={formatDate}
                />
              ))}

            {((shouldShowEvents && filteredEvents.length === 0) ||
              !shouldShowEvents) &&
              ((shouldShowWorkshops && filteredWorkshops.length === 0) ||
                !shouldShowWorkshops) && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No {filterType.toLowerCase()} found
                  </Text>
                </View>
              )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Event Card
function EventCard({ event, navigation, formatDate }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("EventView", { event, center: event.center })
      }
    >
      <Image
        source={{
          uri:
            event.images?.[0] ||
            event.image ||
            "https://via.placeholder.com/400x180",
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {event.title || "Event"}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <Ionicons name="location-outline" size={14} color="#7A8A9A" />
            <Text style={styles.cardMetaText}>
              {event.center?.wilaya || "Location"}
            </Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Ionicons name="calendar-outline" size={14} color="#7A8A9A" />
            <Text style={styles.cardMetaText}>{formatDate(event.date)}</Text>
          </View>
        </View>
        <View style={styles.cardTags}>
          {event.category ? (
            <View style={[styles.tag, styles.categoryTag]}>
              <Text style={styles.categoryTagText}>{event.category}</Text>
            </View>
          ) : null}
          {event.seats ? (
            <View style={[styles.tag, styles.seatsTag]}>
              <Ionicons name="people-outline" size={10} color="#6D8B99" />
              <Text style={styles.seatsTagText}> {event.seats} seats</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Workshop Card
function WorkshopCard({ workshop, navigation, formatDate }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("WorkshopView", {
          workshop,
          center: workshop.center,
        })
      }
    >
      <Image
        source={{
          uri:
            workshop.images?.[0] ||
            workshop.image ||
            "https://via.placeholder.com/400x180",
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {workshop.title || "Workshop"}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <Ionicons name="location-outline" size={14} color="#7A8A9A" />
            <Text style={styles.cardMetaText}>
              {workshop.center?.wilaya || "Location"}
            </Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Ionicons name="calendar-outline" size={14} color="#7A8A9A" />
            <Text style={styles.cardMetaText}>{formatDate(workshop.date)}</Text>
          </View>
        </View>
        <View style={styles.cardTags}>
          {workshop.category ? (
            <View style={[styles.tag, styles.categoryTag]}>
              <Text style={styles.categoryTagText}>{workshop.category}</Text>
            </View>
          ) : null}
          {workshop.duration ? (
            <View style={[styles.tag, styles.durationTag]}>
              <Ionicons name="time-outline" size={10} color="#E94B8B" />
              <Text style={styles.durationTagText}> {workshop.duration}</Text>
            </View>
          ) : null}
          <View style={[styles.tag, styles.priceTag]}>
            <Text style={styles.priceTagText}>
              {workshop.price ? `${workshop.price} DZD` : "FREE"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Page content wraps everything in one vertical scroll
  pageContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 40, // top padding for status bar
    paddingBottom: 100, // Extra padding to prevent bottom navbar from hiding items
  },

  // Search
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
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: SLATE },
  filterIcon: {
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterTypeText: {
    fontSize: 10,
    fontWeight: "700",
    color: TEAL,
    marginLeft: 2,
  },

  // Slim chips row
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
  chipActive: { backgroundColor: TEAL, borderColor: TEAL },
  chipText: { fontSize: 14, fontWeight: "700", color: TEAL },
  chipTextActive: { color: "#fff" },

  // Loader
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 170, backgroundColor: LIGHT_GRAY },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: SLATE, marginBottom: 8 },
  cardMeta: { flexDirection: "row", gap: 12, marginBottom: 10 },
  cardMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMetaText: { fontSize: 12, color: "#7A8A9A", fontWeight: "500" },
  cardTags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTag: { backgroundColor: "#E8F3FF", borderColor: "#4A90E2" },
  categoryTagText: { fontSize: 11, fontWeight: "700", color: "#4A90E2" },
  seatsTag: { backgroundColor: "#EEF3F6", borderColor: "#6D8B99" },
  seatsTagText: { fontSize: 11, fontWeight: "700", color: "#6D8B99" },
  durationTag: { backgroundColor: "#FFE8F0", borderColor: "#E94B8B" },
  durationTagText: { fontSize: 11, fontWeight: "700", color: "#E94B8B" },
  priceTag: { backgroundColor: "#FFF4E6", borderColor: "#F59E0B" },
  priceTagText: { fontSize: 11, fontWeight: "800", color: "#F59E0B" },

  // Empty state
  emptyContainer: { paddingVertical: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#7A8A9A", fontStyle: "italic" },
});
