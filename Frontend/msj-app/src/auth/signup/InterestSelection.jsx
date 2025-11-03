// src/auth/signup/InterestSelection.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ENDPOINTS, apiCall } from "../../config/api";

const AVAILABLE_INTERESTS = [
  { id: "football", label: "Football", icon: "football" },
  { id: "basketball", label: "Basketball", icon: "basketball" },
  { id: "volleyball", label: "american-football" },
  { id: "chess", label: "Chess", icon: "extension-puzzle" },
  { id: "arts", label: "Arts", icon: "color-palette" },
  { id: "music", label: "Music", icon: "musical-notes" },
  { id: "theatre", label: "Theatre", icon: "film" },
  { id: "coding", label: "Coding", icon: "code-slash" },
  { id: "gaming", label: "Gaming", icon: "game-controller" },
  { id: "education", label: "Education", icon: "school" },
  { id: "volunteering", label: "Volunteering", icon: "heart" },
  { id: "culture", label: "Culture", icon: "globe" },
  { id: "tech", label: "Technology", icon: "hardware-chip" },
  { id: "health", label: "Health", icon: "fitness" },
  { id: "design", label: "Design", icon: "brush" },
  { id: "other", label: "Other", icon: "ellipsis-horizontal" },
];

export default function InterestSelection() {
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleSkip = () => {
    // Navigate to home without saving interests
    navigation.replace("HomeTab");
  };

  const handleNext = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert(
        "No Interests Selected",
        "Please select at least one interest to continue, or tap Skip."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.USER.UPDATE_INTERESTS, {
        method: "PATCH",
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to update interests");
      }

      // Successfully updated interests
      navigation.replace("HomeTab");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save interests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What are your{"\n"}interests?</Text>
        <Text style={styles.subtitle}>
          Select your interests to get personalized event and workshop
          recommendations
        </Text>

        <View style={styles.interestsGrid}>
          {AVAILABLE_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestCard,
                  isSelected && styles.interestCardSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={interest.icon}
                  size={28}
                  color={isSelected ? "#2D8A64" : "#93A3B3"}
                />
                <Text
                  style={[
                    styles.interestLabel,
                    isSelected && styles.interestLabelSelected,
                  ]}
                >
                  {interest.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (selectedInterests.length === 0 || loading) &&
              styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedInterests.length === 0 || loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            start={{ x: 0.15, y: 1 }}
            end={{ x: 0.95, y: 0.1 }}
            colors={["rgba(150,214,195,1)", "rgba(107,174,151,1)"]}
            style={styles.nextButtonInner}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.nextText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const PALE_GREEN_BORDER = "rgba(151, 203, 177, 0.45)";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#263B4D",
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#93A3B3",
    marginBottom: 32,
    lineHeight: 20,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  interestCard: {
    width: "48%",
    backgroundColor: PALE_GREEN,
    borderWidth: 1.5,
    borderColor: PALE_GREEN_BORDER,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    position: "relative",
  },
  interestCardSelected: {
    backgroundColor: "rgba(45, 138, 100, 0.08)",
    borderColor: "#2D8A64",
  },
  interestLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#93A3B3",
    textAlign: "center",
  },
  interestLabelSelected: {
    color: "#2D8A64",
    fontWeight: "700",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2D8A64",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    flexDirection: "row",
    gap: 12,
  },
  skipButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: PALE_GREEN_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D8A64",
  },
  nextButton: {
    flex: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  nextButtonInner: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
