import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const VideoPlayerScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});
  const videoRef = useRef(null);

  // Ensure video URL is mobile-compatible
  const getMobileCompatibleUrl = (url) => {
    if (!url) return url;

    // If it's a Cloudinary URL, ensure it has mobile-compatible transformations
    if (url.includes("cloudinary.com")) {
      // Check if transformations already exist
      if (!url.includes("f_mp4") && !url.includes("vc_h264")) {
        // Add mobile-compatible transformations
        return url.replace("/upload/", "/upload/f_mp4,vc_h264,ac_aac,q_auto/");
      }
    }
    return url;
  };

  const videoUrl = getMobileCompatibleUrl(lesson.videoUrl);

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
          <View style={styles.headerMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>
                {formatDuration(lesson.duration)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>{lesson.views} views</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cloudinary Video Player */}
        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: videoUrl }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={(error) => {
              console.error("Video error:", error);
              console.error("Video URL:", videoUrl);
              setIsLoading(false);
              // Show user-friendly error
              Alert.alert(
                "Playback Error",
                "Unable to play this video. The video format may not be compatible. Please try uploading the video again or contact support.",
                [{ text: "OK" }]
              );
            }}
          />
        </View>

        {/* Video Info */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{lesson.category}</Text>
            </View>
            {lesson.difficulty && (
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      lesson.difficulty === "Beginner"
                        ? "#d1fae5"
                        : lesson.difficulty === "Intermediate"
                        ? "#fef3c7"
                        : "#fecaca",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    {
                      color:
                        lesson.difficulty === "Beginner"
                          ? "#10b981"
                          : lesson.difficulty === "Intermediate"
                          ? "#f59e0b"
                          : "#ef4444",
                    },
                  ]}
                >
                  {lesson.difficulty}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>
            {lesson.description || "No description available"}
          </Text>

          {/* Tags */}
          {lesson.tags && lesson.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {lesson.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {lesson.likes && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="#6366f1" />
                <Text style={styles.actionText}>Like ({lesson.likes})</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: (width * 9) / 16,
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 10,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 16,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default VideoPlayerScreen;
