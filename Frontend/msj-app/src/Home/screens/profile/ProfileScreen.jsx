import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_ENDPOINTS, apiCall } from "../../../config/api";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    loadUserData();
    fetchEnrolledEvents();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user_data");
      const user = userJson ? JSON.parse(userJson) : null;
      console.log("Loaded user data:", user);

      // If no user data in storage, fetch from API
      if (!user) {
        try {
          const response = await apiCall(API_ENDPOINTS.USER.ME);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setUserData(data.data);
              // Store for future use
              await AsyncStorage.setItem(
                "user_data",
                JSON.stringify(data.data)
              );
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching user from API:", error);
        }
      }

      setUserData(user);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledEvents = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.EVENTS.MY_REGISTRATIONS);
      const data = await response.json();

      if (data.success) {
        const events = data.data.registrations
          .filter((reg) => reg.eventId) // Only include valid events
          .map((registration) => ({
            id: registration._id,
            title: registration.eventId.title || "Event",
            location: "Algeria", // You can add location to event model if needed
            imageUrl:
              registration.eventId.image ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
          }));

        setEnrolledEvents(events);
        setEventCount(events.length);
        console.log(`User enrolled in ${events.length} events`);
      }
    } catch (error) {
      console.error("Error fetching enrolled events:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), fetchEnrolledEvents()]);
    setRefreshing(false);
  };

  // Define badges with milestone requirements
  const badgeMilestones = [
    {
      id: 1,
      icon: "star-outline",
      color: "#87CEEB",
      name: "Beginner",
      eventsRequired: 1,
    },
    {
      id: 2,
      icon: "school",
      color: "#000000",
      name: "Learner",
      eventsRequired: 3,
    },
    {
      id: 3,
      icon: "sparkles",
      color: "#FFD700",
      name: "Explorer",
      eventsRequired: 5,
    },
    {
      id: 4,
      icon: "ribbon",
      color: "#4169E1",
      name: "Achiever",
      eventsRequired: 10,
    },
    {
      id: 5,
      icon: "trophy",
      color: "#FF8C00",
      name: "Champion",
      eventsRequired: 15,
    },
    {
      id: 6,
      icon: "star",
      color: "#9370DB",
      name: "Legend",
      eventsRequired: 20,
    },
  ];

  // Get badges earned based on milestones reached
  const earnedBadges = badgeMilestones.filter(
    (badge) => eventCount >= badge.eventsRequired
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6BAE97" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("SettingsScreen")}
        >
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6BAE97"]}
            tintColor="#6BAE97"
          />
        }
      >
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Ionicons name="person-outline" size={50} color="#6BAE97" />
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User Name</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>{userData?.name || "User"}</Text>
              <Ionicons name="checkmark" size={20} color="#6BAE97" />
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>
                {userData?.email || "No email"}
              </Text>
              <Ionicons name="checkmark" size={20} color="#6BAE97" />
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <Text style={styles.badgeCount}>
              {earnedBadges.length}{" "}
              {earnedBadges.length === 1 ? "Badge" : "Badges"} Earned
            </Text>
          </View>
          <View style={styles.badgesContainer}>
            {earnedBadges.length > 0 ? (
              earnedBadges.map((badge) => (
                <View key={badge.id} style={styles.badge}>
                  <View
                    style={[
                      styles.badgeCircle,
                      { backgroundColor: badge.color },
                    ]}
                  >
                    <Ionicons name={badge.icon} size={28} color="#FFF" />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeMilestone}>
                    {badge.eventsRequired}{" "}
                    {badge.eventsRequired === 1 ? "Event" : "Events"}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.noBadgesContainer}>
                <Ionicons name="medal-outline" size={40} color="#D1D5DB" />
                <Text style={styles.noBadgesText}>
                  Enroll in events to earn badges!
                </Text>
                <Text style={styles.noBadgesSubtext}>
                  First badge at 1 event
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Enrolled Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enrolled Events</Text>
            <Text style={styles.eventCountText}>
              {eventCount} {eventCount === 1 ? "Event" : "Events"}
            </Text>
          </View>
          {enrolledEvents.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.eventsScroll}
            >
              {enrolledEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <Image
                    source={{ uri: event.imageUrl }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventLocationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#6BAE97"
                    />
                    <Text style={styles.eventLocation}>{event.location}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noEventsContainer}>
              <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
              <Text style={styles.noEventsText}>No events enrolled yet</Text>
              <Text style={styles.noEventsSubtext}>
                Browse events and start your journey!
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
