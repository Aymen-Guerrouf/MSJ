// screens/Clubs/ClubView.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { API_ENDPOINTS, apiCall } from "../../../config/api";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";
const SLATE = "#1F2F3A";
const PALE_GREEN = "rgba(230, 247, 238, 1)";

export default function ClubView() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const club = params?.club;
  const center = params?.center;

  const [joinOpen, setJoinOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!club) {
    return (
      <View style={styles.center}>
        <Text>No club data</Text>
      </View>
    );
  }

  const onSubmitJoin = async () => {
    try {
      setLoading(true);
      const res = await apiCall(API_ENDPOINTS.CLUBS.JOIN_REQUEST, {
        method: "POST",
        body: JSON.stringify({ clubId: club._id || club.id, note }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Unable to submit join request");
      setJoinOpen(false);
      setNote("");
      Alert.alert("Request sent", "Your join request has been submitted successfully.");
    } catch (err) {
      Alert.alert("Error", err?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const cats = Array.isArray(club.categories)
    ? club.categories
    : club.category
    ? [club.category]
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Hero Image with Back Button */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                club.images?.[0] ||
                club.image ||
                "https://via.placeholder.com/400x280",
            }}
            style={styles.hero}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerOverlay}>
            <Text style={styles.overlayTitle}>Club Details</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{club.name}</Text>

          {/* Meta Info Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {center?.wilaya || club.wilaya || "Location"}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={16} color="#93A3B3" />
              <Text style={styles.metaText}>
                {center?.name || "Youth Center"}
              </Text>
            </View>
          </View>

          {/* Category chips */}
          {cats.length > 0 && (
            <View style={styles.chipsRow}>
              {cats.map((c, idx) => (
                <View key={`${c}-${idx}`} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Section Title */}
          <Text style={styles.sectionTitle}>About Club</Text>

          {/* Description */}
          <Text style={styles.description}>
            {club.description ||
              club.descreption ||
              "This club offers activities and training led by local mentors. Join to participate, learn, and collaborate with peers."}
          </Text>

          {/* Contact Information if available */}
          {center?.address && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Address</Text>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color={TEAL} />
                <Text style={styles.infoText}>{center.address}</Text>
              </View>
            </View>
          )}

          {center?.phone && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Contact</Text>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color={TEAL} />
                <Text style={styles.infoText}>{center.phone}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Join Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setJoinOpen(true)}
          style={styles.joinBtnWrap}
          activeOpacity={0.9}
        >
          <LinearGradient
            start={{ x: 0.15, y: 1 }}
            end={{ x: 0.95, y: 0.1 }}
            colors={[MINT, TEAL]}
            style={styles.joinBtn}
          >
            <Text style={styles.joinText}>JOIN CLUB</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom sheet join form */}
      <Modal
        visible={joinOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinOpen(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setJoinOpen(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetGrab} />
          <Text style={styles.sheetTitle}>Join {club.name}</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Tell us a bit about your motivation"
              placeholderTextColor="#8FA1AB"
              style={styles.textArea}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            onPress={onSubmitJoin}
            disabled={loading}
            style={styles.submitWrap}
            activeOpacity={0.9}
          >
            <LinearGradient
              start={{ x: 0.15, y: 1 }}
              end={{ x: 0.95, y: 0.1 }}
              colors={[MINT, TEAL]}
              style={styles.submitBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Send Request</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 280,
  },
  hero: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  headerOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: SLATE,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#93A3B3",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#4169E1",
    backgroundColor: "#fff",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4169E1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: SLATE,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7A8A9A",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: SLATE,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#5F6F7E",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 120,
  },
  joinBtnWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  joinBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  joinText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },

  // Bottom sheet
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  sheetGrab: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 10,
  },

  inputWrap: { marginBottom: 12 },
  label: { color: "#67808E", fontWeight: "700", fontSize: 12, marginBottom: 6 },
  readonly: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F6FAF8",
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.35)",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readonlyText: { color: "#385560", fontSize: 13, fontWeight: "700" },

  textArea: {
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1E3A3A",
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },

  submitWrap: { borderRadius: 14, overflow: "hidden", marginTop: 6 },
  submitBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
