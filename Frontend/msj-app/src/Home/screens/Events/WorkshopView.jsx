// screens/Events/WorkshopView.jsx
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

export default function WorkshopView() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const workshop = params?.workshop;
  const center = params?.center;

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already enrolled when component mounts
  useEffect(() => {
    checkEnrollmentStatus();
  }, [workshop?._id, workshop?.id]);

  const checkEnrollmentStatus = async () => {
    if (!workshop?._id && !workshop?.id) return;

    try {
      setIsChecking(true);
      const response = await apiCall(API_ENDPOINTS.WORKSHOPS.MY_ENROLLMENTS);

      if (response.ok) {
        const data = await response.json();
        const enrollments = data.data?.enrollments || [];

        // Check if current workshop is in user's enrollments
        const workshopId = workshop._id || workshop.id;
        const isAlreadyEnrolled = enrollments.some(
          (enr) =>
            enr.workshopId?._id === workshopId ||
            enr.workshopId?.id === workshopId ||
            enr.workshopId === workshopId
        );

        setIsEnrolled(isAlreadyEnrolled);
      }
    } catch (error) {
      console.log("Error checking enrollment status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!workshop) {
    return (
      <View style={styles.center}>
        <Text>No workshop data</Text>
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

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);

      const response = await apiCall(API_ENDPOINTS.WORKSHOPS.ENROLL, {
        method: "POST",
        body: JSON.stringify({
          workshopId: workshop._id || workshop.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEnrolled(true);
        Alert.alert(
          "Success",
          data.message || "You have successfully enrolled in this workshop!"
        );
      } else {
        throw new Error(data.message || "Enrollment failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to enroll");
    } finally {
      setIsEnrolling(false);
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
                workshop.images?.[0] ||
                workshop.image ||
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
          <Text style={styles.title}>
            {workshop.title || "Name of workshop"}
          </Text>

          {/* Meta Info Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>{center?.wilaya || "Biskra"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {workshop.date
                  ? new Date(workshop.date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "01/25/2025"}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {workshop.instructor || "M.Bensliman"}
              </Text>
            </View>
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>About workshop</Text>

          {/* Description */}
          <Text style={styles.description}>
            {workshop.description ||
              "You will get a complete travel package on the You will get a complete travel package on the beaches. Packages in the form of airline tickets, recommended Hotel rooms, Transportation, Have you ever been on holiday to the Greek ETC..."}
            <Text style={styles.readMore}> Read More</Text>
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {workshop.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{workshop.category}</Text>
              </View>
            )}
            {workshop.duration && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{workshop.duration}</Text>
              </View>
            )}
            <View style={styles.tag}>
              <Text style={styles.tagText}>{workshop.type || "Workshop"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      {!isChecking && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <TouchableOpacity
              style={[
                styles.enrollBtn,
                (isEnrolling || isEnrolled) && styles.enrollBtnDisabled,
              ]}
              onPress={handleEnroll}
              disabled={isEnrolling || isEnrolled}
              activeOpacity={0.9}
            >
              <LinearGradient
                start={{ x: 0.15, y: 1 }}
                end={{ x: 0.95, y: 0.1 }}
                colors={isEnrolled ? ["#4CAF50", "#45A049"] : [MINT, TEAL]}
                style={styles.enrollBtnInner}
              >
                {isEnrolled ? (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.enrollBtnText}>Enrolled</Text>
                  </>
                ) : (
                  <Text style={styles.enrollBtnText}>
                    {isEnrolling ? "Enrolling..." : "PARTICIPATE"}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            {workshop.price !== undefined && (
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>
                  {workshop.price > 0 ? `${workshop.price} DZD` : "FREE"}
                </Text>
              </View>
            )}
          </View>
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
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  headerOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: SLATE,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#93A3B3",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: SLATE,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7A8A9A",
    marginBottom: 16,
  },
  readMore: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
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
    paddingBottom: 120,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  enrollBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  enrollBtnDisabled: {
    opacity: 0.7,
  },
  enrollBtnInner: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  enrollBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  priceBox: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
});
