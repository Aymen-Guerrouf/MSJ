import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, apiCall } from "../../../../config/api";

const SupervisorDetailScreen = ({ navigation, route }) => {
  const { supervisorId } = route.params;
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    fetchSupervisorDetail();
    checkPendingRequest();
  }, []);

  const fetchSupervisorDetail = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        `${API_BASE_URL}/api/user/${supervisorId}`
      );
      const data = await response.json();

      if (data.success) {
        setSupervisor(data.data);
      }
    } catch (error) {
      console.error("Error fetching supervisor:", error);
      Alert.alert("Error", "Failed to load supervisor details");
    } finally {
      setLoading(false);
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
        setHasPendingRequest(!!pending);
      }
    } catch (error) {
      console.error("Error checking requests:", error);
    }
  };

  const handleRequestSupervision = () => {
    if (hasPendingRequest) {
      Alert.alert(
        "Already Pending",
        "You already have a pending supervision request. You can only send one request at a time."
      );
      return;
    }

    Alert.alert(
      "Request Supervision",
      `Send a supervision request to ${supervisor?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: sendSupervisionRequest,
        },
      ]
    );
  };

  const sendSupervisionRequest = async () => {
    try {
      setSubmitting(true);
      const response = await apiCall(`${API_BASE_URL}/api/project-requests`, {
        method: "POST",
        body: JSON.stringify({
          supervisorId: supervisorId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Request Sent!",
          `Your supervision request has been sent to ${supervisor?.name}. You'll be notified when they respond.`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("MySpark"),
            },
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      Alert.alert("Error", "Failed to send supervision request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Supervisor Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color="#6BAE97" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </View>
    );
  }

  if (!supervisor) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Supervisor Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.content, styles.centerContent]}>
          <Ionicons name="person-circle-outline" size={64} color="#96D6C3" />
          <Text style={styles.errorText}>Supervisor not found</Text>
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
        <Text style={styles.headerTitle}>Supervisor Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {supervisor.profilePicture ? (
              <Image
                source={{ uri: supervisor.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={60} color="#6BAE97" />
              </View>
            )}

            <Text style={styles.name}>{supervisor.name}</Text>

            {supervisor.email && (
              <View style={styles.contactRow}>
                <Ionicons name="mail" size={16} color="#6BAE97" />
                <Text style={styles.contactText}>{supervisor.email}</Text>
              </View>
            )}

            {supervisor.phone && (
              <View style={styles.contactRow}>
                <Ionicons name="call" size={16} color="#6BAE97" />
                <Text style={styles.contactText}>{supervisor.phone}</Text>
              </View>
            )}
          </View>

          {/* Title */}
          {supervisor.supervisorTitle && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="briefcase" size={20} color="#6BAE97" />
                <Text style={styles.sectionTitle}>Title</Text>
              </View>
              <Text style={styles.sectionContent}>
                {supervisor.supervisorTitle}
              </Text>
            </View>
          )}

          {/* Bio */}
          {supervisor.supervisorBio && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={20} color="#6BAE97" />
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Text style={styles.sectionContent}>
                {supervisor.supervisorBio}
              </Text>
            </View>
          )}

          {/* Expertise */}
          {supervisor.supervisorExpertise &&
            supervisor.supervisorExpertise.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="star" size={20} color="#6BAE97" />
                  <Text style={styles.sectionTitle}>Areas of Expertise</Text>
                </View>
                <View style={styles.expertiseGrid}>
                  {supervisor.supervisorExpertise.map((expertise, index) => (
                    <View key={index} style={styles.expertiseBadge}>
                      <Text style={styles.expertiseBadgeText}>{expertise}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* LinkedIn */}
          {supervisor.supervisorLinkedIn && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="logo-linkedin" size={20} color="#6BAE97" />
                <Text style={styles.sectionTitle}>LinkedIn</Text>
              </View>
              <Text style={styles.linkText}>
                {supervisor.supervisorLinkedIn}
              </Text>
            </View>
          )}

          {/* Request Button */}
          <TouchableOpacity
            style={[
              styles.requestButton,
              (submitting || hasPendingRequest) && styles.requestButtonDisabled,
            ]}
            onPress={handleRequestSupervision}
            disabled={submitting || hasPendingRequest}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons
                  name={hasPendingRequest ? "checkmark-circle" : "send"}
                  size={20}
                  color="white"
                />
                <Text style={styles.requestButtonText}>
                  {hasPendingRequest
                    ? "Request Already Sent"
                    : "Request Supervision"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {hasPendingRequest && (
            <View style={styles.warningCard}>
              <Ionicons name="information-circle" size={20} color="#f59e0b" />
              <Text style={styles.warningText}>
                You already have a pending request. You can only send one
                request at a time.
              </Text>
            </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E8F5F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#64748b",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
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
  expertiseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  expertiseBadge: {
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#96D6C3",
  },
  expertiseBadgeText: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    color: "#3b82f6",
    textDecorationLine: "underline",
  },
  requestButton: {
    backgroundColor: "#6BAE97",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  requestButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  requestButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  warningCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#f59e0b",
    lineHeight: 20,
  },
});

export default SupervisorDetailScreen;
