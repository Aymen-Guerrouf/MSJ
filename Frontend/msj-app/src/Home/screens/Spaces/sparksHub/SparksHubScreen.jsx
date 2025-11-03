import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL, apiCall, getUserData } from "../../../../config/api";

const { width } = Dimensions.get("window");

const SparksHubScreen = ({ navigation }) => {
  const [sparks, setSparks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userHasSpark, setUserHasSpark] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      fetchSparks();
      checkUserSpark();
    }, [])
  );

  const checkUserSpark = async () => {
    try {
      const response = await apiCall(
        `${API_BASE_URL}/api/startup-ideas/my-project`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setUserHasSpark(true);
      } else {
        setUserHasSpark(false);
      }
    } catch (error) {
      console.error("Error checking user spark:", error);
      setUserHasSpark(false);
    }
  };

  const loadUserData = async () => {
    const user = await getUserData();
    setUserData(user);
  };

  const fetchSparks = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/startup-ideas`;

      const response = await apiCall(url);
      const data = await response.json();

      if (data.success) {
        setSparks(data.data);
      }
    } catch (error) {
      console.error("Error fetching sparks:", error);
      setSparks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSparks();
    checkUserSpark();
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "#3b82f6",
      AI: "#8b5cf6",
      Education: "#10b981",
      Healthcare: "#ef4444",
      Environment: "#059669",
      Mobile: "#f59e0b",
      Web: "#06b6d4",
      "Social Impact": "#ec4899",
      Business: "#6366f1",
      Design: "#f97316",
      Science: "#14b8a6",
    };
    return colors[category] || "#6BAE97";
  };

  const renderSparkCard = (spark) => (
    <TouchableOpacity
      key={spark._id}
      style={styles.sparkCard}
      onPress={() => navigation.navigate("SparkDetail", { sparkId: spark._id })}
      activeOpacity={0.7}
    >
      {spark.images && spark.images.length > 0 ? (
        <Image source={{ uri: spark.images[0] }} style={styles.sparkImage} />
      ) : (
        <View style={[styles.sparkImage, styles.placeholderImage]}>
          <Ionicons name="bulb" size={50} color="#96D6C3" />
        </View>
      )}

      <View style={styles.sparkContent}>
        <View style={styles.sparkHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(spark.category) + "20" },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(spark.category) },
              ]}
            >
              {spark.category}
            </Text>
          </View>
        </View>

        <Text style={styles.sparkTitle} numberOfLines={2}>
          {spark.title}
        </Text>

        <Text style={styles.sparkDescription} numberOfLines={3}>
          {spark.description}
        </Text>

        <View style={styles.sparkFooter}>
          <View style={styles.ownerContainer}>
            <Ionicons name="person-circle-outline" size={20} color="#6BAE97" />
            <Text style={styles.ownerText} numberOfLines={1}>
              {spark.owner?.name || "Unknown"}
            </Text>
          </View>

          {spark.supervisor && (
            <View style={styles.supervisorTag}>
              <Ionicons name="shield-checkmark" size={14} color="#6BAE97" />
              <Text style={styles.supervisorText}>Supervised</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6BAE97" />
        <Text style={styles.loadingText}>Loading Sparks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Sparks Hub</Text>
            <Text style={styles.headerSubtitle}>
              Discover innovative startup ideas
            </Text>
          </View>
          {userHasSpark && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("MySpark")}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle" size={40} color="#6BAE97" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sparks Grid */}
      <ScrollView
        style={styles.content}
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
        <View style={styles.scrollContent}>
          {sparks.length > 0 ? (
            sparks.map(renderSparkCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bulb-outline" size={64} color="#96D6C3" />
              <Text style={styles.emptyStateTitle}>No Sparks Yet</Text>
              <Text style={styles.emptyStateText}>
                Be the first to create a spark!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {!userHasSpark && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateSpark")}
          activeOpacity={0.8}
        >
          <Ionicons name="bulb" size={24} color="white" />
          <Text style={styles.fabText}>Your Turn</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 180,
  },
  sparkCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sparkImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f1f5f9",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  sparkContent: {
    padding: 16,
  },
  sparkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sparkTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
    lineHeight: 28,
  },
  sparkDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 16,
  },
  sparkFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  ownerText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  supervisorTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  supervisorText: {
    fontSize: 12,
    color: "#6BAE97",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C7A5F",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6BAE97",
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 140,
    right: 20,
    left: 20,
    backgroundColor: "#6BAE97",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 10,
    zIndex: 1,
  },
  fabText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SparksHubScreen;
