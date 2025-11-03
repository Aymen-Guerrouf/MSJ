import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { API_ENDPOINTS, getAuthHeaders } from "../../../config/api";
import { styles } from "./Events.styles";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";

export default function Events() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => navigation.navigate("Chatbot")}
        activeOpacity={0.9}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={[MINT, TEAL]}
          style={styles.chatbotButtonGradient}
        >
          <Ionicons name="sparkles" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
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
        </View>

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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={TEAL} />
          </View>
        ) : (
          <>
            {filteredEvents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Events</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event._id || event.id}
                      event={event}
                      navigation={navigation}
                      formatDate={formatDate}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {filteredWorkshops.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Workshops</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {filteredWorkshops.map((workshop) => (
                    <WorkshopCard
                      key={workshop._id || workshop.id}
                      workshop={workshop}
                      navigation={navigation}
                      formatDate={formatDate}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {filteredEvents.length === 0 && filteredWorkshops.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No events or workshops found
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

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
