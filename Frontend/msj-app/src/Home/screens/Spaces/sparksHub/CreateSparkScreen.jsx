import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL, apiCall } from "../../../../config/api";

const CreateSparkScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const existingSpark = route?.params?.spark;
  const isEditMode = !!existingSpark;

  const [formData, setFormData] = useState({
    title: existingSpark?.title || "",
    description: existingSpark?.description || "",
    category: existingSpark?.category || "",
    images: existingSpark?.images || [],
    problemStatement: existingSpark?.problemStatement || "",
    solution: existingSpark?.solution || "",
    targetMarket: existingSpark?.targetMarket || "",
    businessModel: existingSpark?.businessModel || "Not Sure Yet",
  });

  const categories = [
    "Technology",
    "Education",
    "Healthcare",
    "Environment",
    "Innovation",
    "AI",
    "Mobile",
    "Web",
    "Social Impact",
    "Business",
    "Design",
    "Science",
  ];

  const businessModels = [
    "SaaS (Subscription)",
    "E-commerce",
    "Marketplace",
    "Ad-Supported",
    "Hardware Sale",
    "Freemium",
    "Service-Based",
    "Not Sure Yet",
    "Other",
  ];

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        // For now, we'll store the local URI
        // In production, you'd upload to Cloudinary first
        setFormData({
          ...formData,
          images: [...formData.images, result.assets[0].uri],
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Required Field", "Please enter a title");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Required Field", "Please enter a description");
      return false;
    }
    if (!formData.category) {
      Alert.alert("Required Field", "Please select a category");
      return false;
    }
    if (!formData.problemStatement.trim()) {
      Alert.alert(
        "Required Field",
        "Please describe the problem you're solving"
      );
      return false;
    }
    if (!formData.solution.trim()) {
      Alert.alert("Required Field", "Please describe your solution");
      return false;
    }
    if (!formData.targetMarket.trim()) {
      Alert.alert("Required Field", "Please describe your target market");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Note: In production, you'd upload images to Cloudinary first
      // For now, we'll send empty array or placeholder
      const submitData = {
        ...formData,
        images: formData.images.filter((img) => img.startsWith("http")), // Keep only valid URLs
      };

      const url = isEditMode
        ? `${API_BASE_URL}/api/startup-ideas/my-project`
        : `${API_BASE_URL}/api/startup-ideas`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await apiCall(url, {
        method,
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Success!",
          isEditMode
            ? "Your spark has been updated!"
            : "Your spark has been created!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("MySpark"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          data.message || `Failed to ${isEditMode ? "update" : "create"} spark`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} spark:`,
        error
      );
      Alert.alert(
        "Error",
        `Failed to ${isEditMode ? "update" : "create"} spark. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Edit Your Spark" : "Create Your Spark"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Image</Text>
          <Text style={styles.sectionSubtitle}>
            Add an image to showcase your idea
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imagesContainer}>
              {formData.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {formData.images.length < 3 && (
                <TouchableOpacity
                  style={styles.imageUploadBox}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={32} color="#6BAE97" />
                  <Text style={styles.uploadText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., AI-Powered Study Assistant"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            maxLength={100}
          />
          <Text style={styles.charCounter}>{formData.title.length}/100</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Brief Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your idea in a few sentences..."
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            maxLength={500}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.charCounter}>
            {formData.description.length}/500
          </Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  formData.category === category && styles.categoryChipActive,
                ]}
                onPress={() => setFormData({ ...formData, category })}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    formData.category === category &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Problem Statement */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Problem Statement <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>
            What problem are you trying to solve?
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the problem your target users face..."
            value={formData.problemStatement}
            onChangeText={(text) =>
              setFormData({ ...formData, problemStatement: text })
            }
            maxLength={1000}
            multiline
            numberOfLines={5}
          />
          <Text style={styles.charCounter}>
            {formData.problemStatement.length}/1000
          </Text>
        </View>

        {/* Solution */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Your Solution <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>How does your idea solve it?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain your solution and how it addresses the problem..."
            value={formData.solution}
            onChangeText={(text) =>
              setFormData({ ...formData, solution: text })
            }
            maxLength={1000}
            multiline
            numberOfLines={5}
          />
          <Text style={styles.charCounter}>
            {formData.solution.length}/1000
          </Text>
        </View>

        {/* Target Market */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Target Market <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>Who are your target customers?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., University students aged 18-25..."
            value={formData.targetMarket}
            onChangeText={(text) =>
              setFormData({ ...formData, targetMarket: text })
            }
            maxLength={500}
            multiline
            numberOfLines={3}
          />
          <Text style={styles.charCounter}>
            {formData.targetMarket.length}/500
          </Text>
        </View>

        {/* Business Model */}
        <View style={styles.section}>
          <Text style={styles.label}>Business Model</Text>
          <Text style={styles.helperText}>
            How will your project make money?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {businessModels.map((model) => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.categoryChip,
                  formData.businessModel === model && styles.categoryChipActive,
                ]}
                onPress={() =>
                  setFormData({ ...formData, businessModel: model })
                }
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    formData.businessModel === model &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {model}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="rocket" size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {isEditMode ? "Update Spark" : "Create Spark"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 140 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  helperText: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1e293b",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  charCounter: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "right",
    marginTop: 4,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  imageUploadBox: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6BAE97",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "600",
  },
  imageWrapper: {
    position: "relative",
  },
  uploadedImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#6BAE97",
    borderColor: "#6BAE97",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  categoryChipTextActive: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#6BAE97",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateSparkScreen;
