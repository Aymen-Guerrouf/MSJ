import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SpacesScreen = ({ navigation }) => {
  const spaces = [
    {
      id: 1,
      title: "Sharing Experiences",
      subtitle: "Listen & Learn from Others",
      icon: "people-outline",
      gradient: ["#10b981", "#059669", "#047857"],
      description: "Join seances and explore archives",
      screen: "SharingExperiences",
    },
    {
      id: 2,
      title: "Virtual School",
      subtitle: "Learn Through Videos",
      icon: "school-outline",
      gradient: ["#1e293b", "#334155", "#475569"],
      description: "Watch educational content",
      screen: "VirtualSchool",
    },
    {
      id: 3,
      title: "Startup Hub",
      subtitle: "Build Your Dreams",
      icon: "rocket-outline",
      gradient: ["#06b6d4", "#0891b2", "#0e7490"],
      description: "Resources for entrepreneurs",
      screen: "StartupHub",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spaces</Text>
        <Text style={styles.headerSubtitle}>
          Explore our youth center spaces
        </Text>
      </View>

      <View style={styles.spacesContainer}>
        {spaces.map((space) => (
          <TouchableOpacity
            key={space.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(space.screen)}
          >
            <LinearGradient
              colors={space.gradient}
              style={styles.spaceCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={space.icon} size={40} color="white" />
              </View>
              <View style={styles.spaceContent}>
                <Text style={styles.spaceTitle}>{space.title}</Text>
                <Text style={styles.spaceSubtitle}>{space.subtitle}</Text>
                <Text style={styles.spaceDescription}>{space.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="rgba(255,255,255,0.8)"
              />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  spacesContainer: {
    padding: 16,
    gap: 16,
  },
  spaceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 4,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  spaceContent: {
    flex: 1,
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  spaceSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  spaceDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
});

export default SpacesScreen;
