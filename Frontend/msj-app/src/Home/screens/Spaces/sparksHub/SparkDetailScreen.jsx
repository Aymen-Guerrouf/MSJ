import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, apiCall } from "../../../../config/api";

const SparkDetailScreen = ({ route, navigation }) => {
  const { sparkId } = route.params;
  const [spark, setSpark] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSparkDetail();
  }, [sparkId]);

  const fetchSparkDetail = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        `${API_BASE_URL}/api/startup-ideas/${sparkId}`
      );
      const data = await response.json();

      if (data.success) {
        setSpark(data.data);
      }
    } catch (error) {
      console.error("Error fetching spark detail:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6BAE97" />
        <Text style={styles.loadingText}>Loading spark...</Text>
      </View>
    );
  }

  if (!spark) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
        <Text style={styles.errorText}>Spark not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spark Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Hero Image */}
          {spark.images && spark.images.length > 0 ? (
            <Image source={{ uri: spark.images[0] }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.placeholderImage]}>
              <Ionicons name="bulb" size={70} color="#96D6C3" />
            </View>
          )}

          {/* Title & Category */}
          <View style={styles.titleSection}>
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

            <Text style={styles.title}>{spark.title}</Text>

            {/* Owner & Supervisor */}
            <View style={styles.metaRow}>
              <View style={styles.ownerContainer}>
                <Ionicons name="person-circle" size={20} color="#6BAE97" />
                <Text style={styles.ownerText}>{spark.owner?.name}</Text>
              </View>

              {spark.supervisor && (
                <View style={styles.supervisedBadge}>
                  <Ionicons name="shield-checkmark" size={16} color="#6BAE97" />
                  <Text style={styles.supervisedText}>Supervised</Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>{spark.description}</Text>
          </View>

          {/* Problem Statement */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: "#fee2e2" }]}>
                <Ionicons name="alert-circle" size={24} color="#ef4444" />
              </View>
              <Text style={styles.cardTitle}>The Problem</Text>
            </View>
            <Text style={styles.cardContent}>{spark.problemStatement}</Text>
          </View>

          {/* Solution */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: "#fef3c7" }]}>
                <Ionicons name="bulb" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.cardTitle}>The Solution</Text>
            </View>
            <Text style={styles.cardContent}>{spark.solution}</Text>
          </View>

          {/* Target Market */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: "#dbeafe" }]}>
                <Ionicons name="people" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.cardTitle}>Target Market</Text>
            </View>
            <Text style={styles.cardContent}>{spark.targetMarket}</Text>
          </View>

          {/* Business Model */}
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: "#d1fae5" }]}>
                <Ionicons name="cash" size={24} color="#10b981" />
              </View>
              <Text style={styles.cardTitle}>Business Model</Text>
            </View>
            <Text style={styles.cardContent}>{spark.businessModel}</Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
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
  header: {
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#ef4444",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#f1f5f9",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    padding: 20,
    backgroundColor: "white",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    lineHeight: 36,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerText: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "600",
  },
  supervisedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  supervisedText: {
    fontSize: 13,
    color: "#6BAE97",
    fontWeight: "600",
  },
  section: {
    padding: 20,
    backgroundColor: "white",
    marginTop: 1,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 26,
  },
  detailCard: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardContent: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
  },
});

export default SparkDetailScreen;
