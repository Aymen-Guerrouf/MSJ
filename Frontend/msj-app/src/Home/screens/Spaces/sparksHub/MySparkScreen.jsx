import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL, apiCall } from "../../../../config/api";

const MySparkScreen = ({ navigation }) => {
  const [spark, setSpark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchMySpark();
      checkPendingRequest();
    }, [])
  );

  const fetchMySpark = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        `${API_BASE_URL}/api/startup-ideas/my-project`
      );
      const data = await response.json();

      if (data.success) {
        setSpark(data.data);
      } else {
        setSpark(null);
      }
    } catch (error) {
      console.error("Error fetching spark:", error);
      setSpark(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkPendingRequest = async () => {
    try {
      const response = await apiCall(
        `${API_BASE_URL}/api/project-requests/my-requests`
      );
      const data = await response.json();

      if (data.success) {
        const pending = data.data.find((req) => req.status === "pending");
        setPendingRequest(pending);
      }
    } catch (error) {
      console.error("Error checking requests:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMySpark();
    checkPendingRequest();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Spark?",
      "Are you sure you want to delete your spark? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteSpark,
        },
      ]
    );
  };

  const deleteSpark = async () => {
    try {
      const response = await apiCall(
        `${API_BASE_URL}/api/startup-ideas/my-project`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Deleted", "Your spark has been deleted");
        setSpark(null);
      } else {
        Alert.alert("Error", data.message || "Failed to delete spark");
      }
    } catch (error) {
      console.error("Error deleting spark:", error);
      Alert.alert("Error", "Failed to delete spark");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "pending_review":
        return "#3b82f6";
      case "public":
        return "#10b981";
      default:
        return "#6BAE97";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Draft";
      case "pending_review":
        return "Under Review";
      case "public":
        return "Public";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "create-outline";
      case "pending_review":
        return "time-outline";
      case "public":
        return "checkmark-circle";
      default:
        return "help-circle";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6BAE97" />
        <Text style={styles.loadingText}>Loading your spark...</Text>
      </View>
    );
  }

  if (!spark) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Spark</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.content, styles.centerContent]}>
          <Ionicons name="bulb-outline" size={80} color="#96D6C3" />
          <Text style={styles.emptyTitle}>No Spark Yet</Text>
          <Text style={styles.emptyText}>
            Create your first spark to get started!
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("CreateSpark")}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.createButtonText}>Create Your Spark</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Spark</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateSpark", { spark })}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={22} color="#6BAE97" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

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
          {/* Image */}
          {spark.images && spark.images.length > 0 ? (
            <Image
              source={{ uri: spark.images[0] }}
              style={styles.sparkImage}
            />
          ) : (
            <View style={[styles.sparkImage, styles.placeholderImage]}>
              <Ionicons name="bulb" size={60} color="#96D6C3" />
            </View>
          )}

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(spark.status) + "20" },
            ]}
          >
            <Ionicons
              name={getStatusIcon(spark.status)}
              size={18}
              color={getStatusColor(spark.status)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(spark.status) },
              ]}
            >
              {getStatusText(spark.status)}
            </Text>
          </View>

          {/* Title & Category */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{spark.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{spark.category}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>{spark.description}</Text>
          </View>

          {/* Problem Statement */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={20} color="#6BAE97" />
              <Text style={styles.sectionTitle}>Problem Statement</Text>
            </View>
            <Text style={styles.sectionContent}>{spark.problemStatement}</Text>
          </View>

          {/* Solution */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={20} color="#6BAE97" />
              <Text style={styles.sectionTitle}>Solution</Text>
            </View>
            <Text style={styles.sectionContent}>{spark.solution}</Text>
          </View>

          {/* Target Market */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color="#6BAE97" />
              <Text style={styles.sectionTitle}>Target Market</Text>
            </View>
            <Text style={styles.sectionContent}>{spark.targetMarket}</Text>
          </View>

          {/* Business Model */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={20} color="#6BAE97" />
              <Text style={styles.sectionTitle}>Business Model</Text>
            </View>
            <Text style={styles.sectionContent}>{spark.businessModel}</Text>
          </View>

          {/* Supervisor Info */}
          {spark.supervisor && (
            <View style={styles.supervisorCard}>
              <View style={styles.supervisorHeader}>
                <Ionicons name="shield-checkmark" size={24} color="#6BAE97" />
                <Text style={styles.supervisorTitle}>Supervised By</Text>
              </View>
              <Text style={styles.supervisorName}>{spark.supervisor.name}</Text>
              {spark.supervisor.supervisorTitle && (
                <Text style={styles.supervisorRole}>
                  {spark.supervisor.supervisorTitle}
                </Text>
              )}
            </View>
          )}

          {/* Pending Request Alert */}
          {spark.status === "pending_review" && pendingRequest && (
            <View style={styles.alertCard}>
              <Ionicons name="time" size={24} color="#3b82f6" />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Request Sent</Text>
                <Text style={styles.alertText}>
                  Waiting for response from{" "}
                  {pendingRequest.supervisor?.name || "supervisor"}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {spark.status === "pending" && !pendingRequest && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("SupervisorsList")}
            >
              <Ionicons name="search" size={20} color="white" />
              <Text style={styles.actionButtonText}>Look for Supervisors</Text>
            </TouchableOpacity>
          )}

          {spark.status === "public" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewPublicButton]}
              onPress={() =>
                navigation.navigate("SparkDetail", { sparkId: spark._id })
              }
            >
              <Ionicons name="eye" size={20} color="#6BAE97" />
              <Text
                style={[styles.actionButtonText, styles.viewPublicButtonText]}
              >
                View in Sparks Hub
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 140 }} />
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sparkImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    marginBottom: 16,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    lineHeight: 36,
  },
  categoryBadge: {
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6BAE97",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  sectionContent: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
  },
  supervisorCard: {
    backgroundColor: "#E8F5F0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#96D6C3",
  },
  supervisorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  supervisorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6BAE97",
  },
  supervisorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  supervisorRole: {
    fontSize: 14,
    color: "#64748b",
  },
  alertCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: "#3b82f6",
  },
  actionButton: {
    backgroundColor: "#6BAE97",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewPublicButton: {
    backgroundColor: "#E8F5F0",
    borderWidth: 2,
    borderColor: "#6BAE97",
  },
  viewPublicButtonText: {
    color: "#6BAE97",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C7A5F",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6BAE97",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  createButton: {
    backgroundColor: "#6BAE97",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MySparkScreen;
