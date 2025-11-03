import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../config/api";
import { styles } from "./AdminPanel.styles";

const CATEGORIES = [
  "coding",
  "language",
  "career",
  "health",
  "entrepreneurship",
  "design",
  "marketing",
  "other",
];

export default function AdminPanel({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("coding");
  const [duration, setDuration] = useState("");

  const CLOUDINARY_CLOUD_NAME = "dvfsmezpi";
  const CLOUDINARY_UPLOAD_PRESET = "mja-hackothon";

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user_data");
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData(user);
        console.log("=== USER DATA LOADED ===");
        console.log("Full user object:", user);
        console.log("Role:", user.role);
        console.log("managedCenterId:", user.managedCenterId);
        console.log("center:", user.center);
        console.log("=======================");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "access_token",
        "user_data",
        "user",
        "user_coords",
        "token_expires_at",
        "last_login_at",
      ]);
      navigation.replace("SignIn");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const pickDocument = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === "video" ? "video/*" : "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets[0]) {
        const file = result.assets[0];

        if (type === "video") {
          setVideoFile(file);
          Alert.alert(
            "Video Selected",
            `Selected: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(
              2
            )} MB\n\nReady to upload!`
          );
        } else {
          setThumbnailFile(file);
          Alert.alert(
            "Thumbnail Selected",
            `Selected: ${file.name}\nReady to upload!`
          );
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const uploadToCloudinary = async (file, resourceType = "video") => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type:
          file.mimeType ||
          (resourceType === "video" ? "video/mp4" : "image/jpeg"),
        name: file.name,
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        // Transform the URL to ensure mobile-compatible format
        let finalUrl = data.secure_url;

        if (resourceType === "video") {
          finalUrl = finalUrl.replace(
            "/upload/",
            "/upload/f_mp4,vc_h264,ac_aac,q_auto/"
          );
        }

        return {
          url: finalUrl,
          duration: data.duration || null,
        };
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter a video title");
      return false;
    }
    if (!videoFile && !videoUrl.trim()) {
      Alert.alert(
        "Validation Error",
        "Please select a video file or enter a Cloudinary URL"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      let finalVideoUrl = videoUrl;
      let finalThumbnailUrl = thumbnailUrl;
      let videoDuration = duration;

      // Upload video to Cloudinary if file is selected
      if (videoFile) {
        setUploadProgress(30);
        Alert.alert("Uploading", "Uploading video to Cloudinary...");

        const videoResult = await uploadToCloudinary(videoFile, "video");
        finalVideoUrl = videoResult.url;
        videoDuration = videoResult.duration || duration;

        setUploadProgress(60);
      }

      // Upload thumbnail to Cloudinary if file is selected
      if (thumbnailFile) {
        Alert.alert("Uploading", "Uploading thumbnail...");
        const thumbnailResult = await uploadToCloudinary(
          thumbnailFile,
          "image"
        );
        finalThumbnailUrl = thumbnailResult.url;
        setUploadProgress(80);
      }

      // Save to database
      setUploadProgress(90);
      Alert.alert("Saving", "Saving video information...");

      const token = await AsyncStorage.getItem("access_token");

      const centerId =
        userData?.managedCenterId || userData?.center?._id || userData?.center;

      console.log("User data:", userData);
      console.log("Center ID:", centerId);
      console.log("Video URL:", finalVideoUrl);

      const requestBody = {
        title: title.trim(),
        category,
        description: description.trim() || undefined,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl || undefined,
        duration: videoDuration ? parseInt(videoDuration) : undefined,
      };

      if (centerId) {
        requestBody.centerId = centerId;
      }

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(API_ENDPOINTS.VIRTUAL_SCHOOL.LIST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      setUploadProgress(100);

      if (data.success) {
        Alert.alert("Success! 🎉", "Video uploaded and saved successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setTitle("");
              setDescription("");
              setVideoUrl("");
              setThumbnailUrl("");
              setDuration("");
              setCategory("coding");
              setVideoFile(null);
              setThumbnailFile(null);
              setUploadProgress(0);
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to create video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Failed",
        error.message ||
          "Failed to upload video. Please check your internet connection and try again."
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Upload Educational Videos</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {userData && (
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={32} color="#6366f1" />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionsCard}>
          <View style={styles.instructionHeader}>
            <Ionicons name="information-circle" size={24} color="#6366f1" />
            <Text style={styles.instructionTitle}>Upload Instructions</Text>
          </View>
          <Text style={styles.instructionText}>
            1. Pick a video file from your device
          </Text>
          <Text style={styles.instructionText}>
            2. Optionally pick a thumbnail image
          </Text>
          <Text style={styles.instructionText}>
            3. Fill in video details (title, category, description)
          </Text>
          <Text style={styles.instructionText}>
            4. Tap "Upload Video" - we'll upload to Cloudinary automatically!
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Video Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter video title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter video description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Select Video <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              style={styles.filePicker}
              onPress={() => pickDocument("video")}
            >
              <Ionicons name="videocam" size={24} color="#6366f1" />
              <View style={styles.filePickerText}>
                <Text style={styles.filePickerLabel}>
                  {videoFile ? videoFile.name : "Tap to select video"}
                </Text>
                {videoFile && (
                  <Text style={styles.filePickerSize}>
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <TextInput
              style={styles.input}
              placeholder="Paste Cloudinary URL (if already uploaded)"
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thumbnail (Optional)</Text>

            <TouchableOpacity
              style={styles.filePicker}
              onPress={() => pickDocument("image")}
            >
              <Ionicons name="image" size={24} color="#6366f1" />
              <View style={styles.filePickerText}>
                <Text style={styles.filePickerLabel}>
                  {thumbnailFile
                    ? thumbnailFile.name
                    : "Tap to select thumbnail"}
                </Text>
                {thumbnailFile && (
                  <Text style={styles.filePickerSize}>
                    {(thumbnailFile.size / 1024).toFixed(2)} KB
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <TextInput
              style={styles.input}
              placeholder="Paste thumbnail URL (if already uploaded)"
              value={thumbnailUrl}
              onChangeText={setThumbnailUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 600 for 10 minutes"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              uploading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            {uploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator color="white" />
                <Text style={styles.uploadingText}>
                  {uploadProgress > 0
                    ? `Uploading... ${uploadProgress}%`
                    : "Processing..."}
                </Text>
              </View>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="white" />
                <Text style={styles.submitButtonText}>Upload Video</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
