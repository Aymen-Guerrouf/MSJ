// screens/Events/EventView.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { API_ENDPOINTS, apiCall } from "../../../config/api";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";
const SLATE = "#1F2F3A";
const PALE_GREEN = "rgba(230, 247, 238, 1)";

export default function EventView() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const event = params?.event;
  const center = params?.center;

  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already registered when component mounts
  useEffect(() => {
    checkRegistrationStatus();
  }, [event?._id, event?.id]);

  const checkRegistrationStatus = async () => {
    if (!event?._id && !event?.id) return;

    try {
      setIsChecking(true);
      const response = await apiCall(API_ENDPOINTS.EVENTS.MY_REGISTRATIONS);

      if (response.ok) {
        const data = await response.json();
        const registrations = data.data?.registrations || [];

        // Check if current event is in user's registrations
        const eventId = event._id || event.id;
        const isAlreadyRegistered = registrations.some(
          (reg) =>
            reg.eventId?._id === eventId ||
            reg.eventId?.id === eventId ||
            reg.eventId === eventId
        );

        setIsRegistered(isAlreadyRegistered);
      }
    } catch (error) {
      console.log("Error checking registration status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>No event data</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegister = async () => {
    try {
      setIsRegistering(true);

      const response = await apiCall(API_ENDPOINTS.EVENTS.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          eventId: event._id || event.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(true);
        Alert.alert(
          "Success",
          data.message || "You have successfully registered for this event!"
        );
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to register");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Hero Image with Back Button */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                event.images?.[0] ||
                event.image ||
                "https://via.placeholder.com/400x250",
            }}
            style={styles.hero}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerOverlay}>
            <Text style={styles.overlayTitle}>Details</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{event.title || "Name of Event"}</Text>

          {/* Meta Info Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {center?.wilaya || "Location"}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {event.date
                  ? new Date(event.date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : formatDate(event.startDate).split(",")[0]}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {event.instructor || event.organizer || "Organizer"}
              </Text>
            </View>
          </View>

          {/* Club/Center Name */}
          {center && (
            <View style={styles.clubRow}>
              <Ionicons name="business-outline" size={14} color="#7A8A9A" />
              <Text style={styles.clubText}>{center.name}</Text>
            </View>
          )}

          {/* Section Title */}
          <Text style={styles.sectionTitle}>About event</Text>

          {/* Description */}
          <Text style={styles.description}>
            {event.description ||
              "You will get a complete travel package on the beaches. Packages in the form of airline tickets, recommended Hotel rooms, Transportation, Have you ever been on holiday to the Greek ETC..."}
            <Text style={styles.readMore}> Read More</Text>
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {event.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{event.category}</Text>
              </View>
            )}
            {event.seats && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{event.seats} seats</Text>
              </View>
            )}
            <View style={styles.tag}>
              <Text style={styles.tagText}>{event.type || "Event"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      {!isChecking && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.registerBtn,
              (isRegistering || isRegistered) && styles.registerBtnDisabled,
            ]}
            onPress={handleRegister}
            disabled={isRegistering || isRegistered}
            activeOpacity={0.9}
          >
            <LinearGradient
              start={{ x: 0.15, y: 1 }}
              end={{ x: 0.95, y: 0.1 }}
              colors={isRegistered ? ["#4CAF50", "#45A049"] : [MINT, TEAL]}
              style={styles.registerBtnInner}
            >
              {isRegistered ? (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.registerBtnText}>Registered</Text>
                </>
              ) : (
                <Text style={styles.registerBtnText}>
                  {isRegistering ? "Registering..." : "PARTICIPATE"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 280,
  },
  hero: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#93A3B3",
    fontWeight: "500",
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  clubText: {
    fontSize: 13,
    color: "#7A8A9A",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: "#7A8A9A",
    lineHeight: 20,
    marginBottom: 16,
  },
  readMore: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#4169E1",
    backgroundColor: "#fff",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4169E1",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 120,
  },
  registerBtn: { borderRadius: 12, overflow: "hidden" },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnInner: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
