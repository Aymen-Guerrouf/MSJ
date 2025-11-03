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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, apiCall } from "../../../../config/api";

const SupervisorsListScreen = ({ navigation }) => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        `${API_BASE_URL}/api/startup-ideas/supervisors`
      );
      const data = await response.json();

      if (data.success) {
        setSupervisors(data.data);
      }
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      setSupervisors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSupervisors();
  };

  const renderSupervisorCard = (supervisor) => (
    <TouchableOpacity
      key={supervisor._id}
      style={styles.supervisorCard}
      onPress={() =>
        navigation.navigate("SupervisorDetail", {
          supervisorId: supervisor._id,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          {supervisor.profilePicture ? (
            <Image
              source={{ uri: supervisor.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color="#6BAE97" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.supervisorName}>{supervisor.name}</Text>

          {supervisor.supervisorTitle && (
            <Text style={styles.supervisorTitle}>
              {supervisor.supervisorTitle}
            </Text>
          )}

          {supervisor.supervisorExpertise &&
            supervisor.supervisorExpertise.length > 0 && (
              <View style={styles.expertiseContainer}>
                {supervisor.supervisorExpertise
                  .slice(0, 3)
                  .map((expertise, index) => (
                    <View key={index} style={styles.expertiseTag}>
                      <Text style={styles.expertiseText}>{expertise}</Text>
                    </View>
                  ))}
                {supervisor.supervisorExpertise.length > 3 && (
                  <View style={styles.expertiseTag}>
                    <Text style={styles.expertiseText}>
                      +{supervisor.supervisorExpertise.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            )}

          {supervisor.supervisorBio && (
            <Text style={styles.bio} numberOfLines={2}>
              {supervisor.supervisorBio}
            </Text>
          )}
        </View>

        <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Supervisors</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color="#6BAE97" />
          <Text style={styles.loadingText}>Loading supervisors...</Text>
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
        <Text style={styles.headerTitle}>Find Supervisors</Text>
        <View style={{ width: 24 }} />
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
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Choose Your Supervisor</Text>
              <Text style={styles.infoText}>
                Select a supervisor to guide your startup journey. You can only
                send one request at a time.
              </Text>
            </View>
          </View>

          {supervisors.length > 0 ? (
            supervisors.map(renderSupervisorCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#96D6C3" />
              <Text style={styles.emptyStateTitle}>No Supervisors Yet</Text>
              <Text style={styles.emptyStateText}>
                Check back later for available supervisors
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
  infoCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#3b82f6",
    lineHeight: 20,
  },
  supervisorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f1f5f9",
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  supervisorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  supervisorTitle: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "600",
    marginBottom: 8,
  },
  expertiseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  expertiseTag: {
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expertiseText: {
    fontSize: 12,
    color: "#6BAE97",
    fontWeight: "600",
  },
  bio: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
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
});

export default SupervisorsListScreen;
