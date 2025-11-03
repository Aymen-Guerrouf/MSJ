import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ExperienceStoryDetailScreen = ({ route, navigation }) => {
  const { card } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Experience Story</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>{card.title}</Text>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          {card.host && (
            <View style={styles.metaItem}>
              <Ionicons
                name="person-circle-outline"
                size={18}
                color="#6BAE97"
              />
              <Text style={styles.metaText}>{card.host}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={18} color="#6BAE97" />
            <Text style={styles.metaText}>{formatDate(card.createdAt)}</Text>
          </View>
        </View>

        {/* Tag */}
        {card.tag && (
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Ionicons name="pricetag" size={14} color="#6BAE97" />
              <Text style={styles.tagText}>{card.tag}</Text>
            </View>
          </View>
        )}

        {/* Summary */}
        {card.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={20} color="#6BAE97" />
              <Text style={styles.sectionTitle}>Summary</Text>
            </View>
            <Text style={styles.summaryText}>{card.summary}</Text>
          </View>
        )}

        {/* Full Story */}
        {card.fullStory && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#6BAE97"
              />
              <Text style={styles.sectionTitle}>Full Story</Text>
            </View>
            <Text style={styles.storyText}>{card.fullStory}</Text>
          </View>
        )}

        {/* Key Lessons */}
        {card.lessons && card.lessons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={20} color="#6BAE97" />
              <Text style={styles.sectionTitle}>Key Lessons</Text>
            </View>
            {card.lessons.map((lesson, index) => (
              <View key={index} style={styles.lessonItem}>
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.lessonText}>{lesson}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Session Info if available */}
        {card.sessionId && (
          <View style={styles.sessionInfoCard}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#6BAE97"
            />
            <View style={styles.sessionInfoText}>
              <Text style={styles.sessionInfoTitle}>Original Session</Text>
              <Text style={styles.sessionInfoDate}>
                Session Date: {formatDate(card.sessionId.date)}
              </Text>
            </View>
          </View>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    lineHeight: 36,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  tagContainer: {
    marginBottom: 24,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#96D6C3",
  },
  tagText: {
    fontSize: 13,
    color: "#6BAE97",
    fontWeight: "600",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C7A5F",
  },
  summaryText: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 26,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#6BAE97",
  },
  storyText: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 28,
    textAlign: "justify",
  },
  lessonItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6BAE97",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  lessonNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  lessonText: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
  },
  sessionInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F0",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#96D6C3",
    gap: 12,
  },
  sessionInfoText: {
    flex: 1,
  },
  sessionInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C7A5F",
    marginBottom: 4,
  },
  sessionInfoDate: {
    fontSize: 14,
    color: "#6BAE97",
  },
});

export default ExperienceStoryDetailScreen;
