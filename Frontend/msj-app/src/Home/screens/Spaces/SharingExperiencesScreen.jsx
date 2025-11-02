import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, apiCall } from "../../../config/api";

const { width } = Dimensions.get("window");

const SharingExperiencesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch sessions
      const sessionsResponse = await apiCall(API_ENDPOINTS.EXPERIENCE.SESSIONS);
      const sessionsData = await sessionsResponse.json();

      if (sessionsData.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const past = [];

        sessionsData.data.sessions.forEach((session) => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);

          if (sessionDate >= today) {
            upcoming.push(session);
          } else {
            past.push(session);
          }
        });

        setUpcomingSessions(upcoming);
        setPastSessions(past);
      }

      // Fetch cards
      const cardsResponse = await apiCall(API_ENDPOINTS.EXPERIENCE.CARDS);
      const cardsData = await cardsResponse.json();

      if (cardsData.success) {
        setCards(cardsData.data.cards);
      }
    } catch (error) {
      console.error("Error fetching experience data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return formatDate(dateString);
  };

  const renderUpcomingSession = (session) => (
    <View key={session._id} style={styles.seanceCard}>
      <View style={styles.seanceHeader}>
        <View style={styles.dateTag}>
          <Ionicons name="calendar-outline" size={14} color="#6BAE97" />
          <Text style={styles.dateText}>{getDaysUntil(session.date)}</Text>
        </View>
        {session.tag && (
          <View style={styles.topicTagHeader}>
            <Text style={styles.topicTagHeaderText}>{session.tag}</Text>
          </View>
        )}
      </View>

      <Text style={styles.seanceTitle}>{session.title}</Text>

      {session.host && (
        <View style={styles.hostContainer}>
          <Ionicons name="person-circle-outline" size={18} color="#6BAE97" />
          <Text style={styles.hostText}>{session.host}</Text>
        </View>
      )}

      {session.description && (
        <Text style={styles.seanceDescription}>{session.description}</Text>
      )}

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#6BAE97" />
          <Text style={styles.detailText}>{session.time}</Text>
        </View>
        {session.centerId && (
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#6BAE97" />
            <Text style={styles.detailText} numberOfLines={1}>
              {session.centerId.name || "Center"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderArchivedCard = (card) => (
    <TouchableOpacity
      key={card._id}
      style={styles.archiveCard}
      onPress={() => navigation.navigate("ExperienceStoryDetail", { card })}
    >
      <View style={styles.archiveHeader}>
        <View style={styles.playButton}>
          <Ionicons name="document-text" size={40} color="#6BAE97" />
        </View>
        <View style={styles.archiveInfo}>
          <Text style={styles.archiveTitle} numberOfLines={2}>
            {card.title}
          </Text>
          {card.host && <Text style={styles.archiveHost}>{card.host}</Text>}
          <Text style={styles.archiveDate}>{formatDate(card.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.archiveSummary} numberOfLines={3}>
        {card.summary}
      </Text>

      {card.tag && (
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{card.tag}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6BAE97" />
        <Text style={styles.loadingText}>Loading experiences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sharing Experiences</Text>
        <Text style={styles.headerSubtitle}>
          Learn from others' journeys and experiences
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === "upcoming" ? "#6BAE97" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{upcomingSessions.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "archive" && styles.activeTab]}
          onPress={() => setActiveTab("archive")}
        >
          <Ionicons
            name="archive"
            size={20}
            color={activeTab === "archive" ? "#6BAE97" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "archive" && styles.activeTabText,
            ]}
          >
            Archive
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cards.length}</Text>
          </View>
        </TouchableOpacity>
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
          {activeTab === "upcoming" ? (
            upcomingSessions.length > 0 ? (
              upcomingSessions.map(renderUpcomingSession)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color="#96D6C3" />
                <Text style={styles.emptyStateTitle}>No Upcoming Sessions</Text>
                <Text style={styles.emptyStateText}>
                  Check back later for new experience sharing sessions
                </Text>
              </View>
            )
          ) : cards.length > 0 ? (
            cards.map(renderArchivedCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="archive-outline" size={64} color="#96D6C3" />
              <Text style={styles.emptyStateTitle}>No Archived Content</Text>
              <Text style={styles.emptyStateText}>
                Past sessions and experience cards will appear here
              </Text>
            </View>
          )}
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
  header: {
    backgroundColor: "white",
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#E8F5F0",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#6BAE97",
  },
  badge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  seanceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#6BAE97",
  },
  seanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  dateTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6BAE97",
  },
  spotsTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  spotsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6BAE97",
  },
  seanceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
    lineHeight: 28,
  },
  hostContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  hostText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  seanceDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 14,
  },
  speakerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  speakerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  speakerBio: {
    fontSize: 12,
    color: "#64748b",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 0,
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#64748b",
  },
  seanceFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  topicTag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b5cf6",
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6BAE97",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  archiveCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#6BAE97",
  },
  archiveHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  playButton: {
    marginRight: 12,
  },
  archiveInfo: {
    flex: 1,
  },
  archiveTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  archiveHost: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "600",
    marginBottom: 2,
  },
  archiveSpeaker: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "600",
    marginBottom: 2,
  },
  archiveDate: {
    fontSize: 12,
    color: "#96D6C3",
  },
  viewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: "#64748b",
  },
  archiveSummary: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#96D6C3",
  },
  tagText: {
    fontSize: 11,
    color: "#6BAE97",
    fontWeight: "500",
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
  topicTagHeader: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  topicTagHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d97706",
  },
  creatorText: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
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

export default SharingExperiencesScreen;
