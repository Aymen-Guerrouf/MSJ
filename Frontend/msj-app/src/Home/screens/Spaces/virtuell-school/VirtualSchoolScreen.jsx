import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, apiCall } from "../../../../config/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const VirtualSchoolScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "coding",
    "language",
    "career",
    "health",
    "entrepreneurship",
    "design",
    "marketing",
    "other",
  ];

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "All"
          ? API_ENDPOINTS.VIRTUAL_SCHOOL.LIST
          : `${API_ENDPOINTS.VIRTUAL_SCHOOL.LIST}?category=${selectedCategory}`;

      const response = await apiCall(url);
      const data = await response.json();

      if (data.success && data.data.videos) {
        setVideos(data.data.videos);
      } else {
        Alert.alert("Error", "Failed to fetch videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      Alert.alert("Error", "Unable to load videos. Please try again.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const filteredLessons = videos.filter((video) => {
    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description &&
        video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981";
      case "Intermediate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const openVideo = (lesson) => {
    navigation.navigate("VideoPlayer", { lesson });
  };

  const renderVideoCard = (lesson) => (
    <TouchableOpacity
      key={lesson._id}
      style={styles.videoCard}
      onPress={() => openVideo(lesson)}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri:
            lesson.thumbnailUrl ||
            "https://via.placeholder.com/400x300?text=Video",
        }}
        style={styles.thumbnail}
      />
      <View style={styles.playOverlay}>
        <View style={styles.playButton}>
          <Ionicons name="play" size={32} color="white" />
        </View>
      </View>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {lesson.description || "No description"}
        </Text>

        <View style={styles.videoFooter}>
          {lesson.difficulty && (
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor: getDifficultyColor(lesson.difficulty) + "15",
                },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(lesson.difficulty) },
                ]}
              >
                {lesson.difficulty}
              </Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{lesson.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Virtual School</Text>
        <Text style={styles.headerSubtitle}>
          Watch short videos about useful topics
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lessons..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.activeCategoryChipText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Loading videos...</Text>
          </View>
        ) : filteredLessons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No videos found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Try adjusting your search"
                : "No videos available in this category"}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {filteredLessons.length}{" "}
                {filteredLessons.length === 1 ? "lesson" : "lessons"}
              </Text>
            </View>

            <View style={styles.videoGrid}>
              {filteredLessons.map(renderVideoCard)}
            </View>
          </>
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
    backgroundColor: "white",
    padding: 24,
    paddingTop: 40,
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
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  categoriesContainer: {
    backgroundColor: "white",
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeCategoryChip: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeCategoryChipText: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  videoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  videoCard: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 4,
  },
  thumbnail: {
    width: "100%",
    height: 120,
    backgroundColor: "#e2e8f0",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  durationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
    lineHeight: 18,
  },
  videoDescription: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 10,
    lineHeight: 16,
  },
  videoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  difficultyBadge: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
  },
  categoryBadge: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
});

export default VirtualSchoolScreen;
