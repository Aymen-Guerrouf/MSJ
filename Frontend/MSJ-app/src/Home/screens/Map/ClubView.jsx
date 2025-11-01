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
// import { API_ENDPOINTS } from "../../config/api";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";
const SLATE = "#1F2F3A";
const PALE_GREEN = "rgba(230, 247, 238, 1)";

export default function ClubView() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const club = params?.club;

  // Example: get userID from your auth store/context
  const userID = params?.userID || "u_demo_001";

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
      // const res = await fetch(API_ENDPOINTS.CLUBS.JOIN, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ clubID: club._id || club.id, userID, note }),
      // });
      // const data = await res.json().catch(() => null);
      // if (!res.ok) throw new Error(data?.message || "Unable to join club");
      await new Promise((r) => setTimeout(r, 800)); // mock
      setJoinOpen(false);
      setNote("");
      Alert.alert("Request sent", "Your join request has been submitted.");
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "ios" ? 25 : 8,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={26} color={SLATE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {club.name}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Hero */}
        <Image
          source={{
            uri:
              (club.images && club.images[0]) ||
              club.image ||
              "https://picsum.photos/1200/800",
          }}
          style={styles.hero}
          resizeMode="cover"
        />

        {/* Rounded divider feel */}
        <View style={styles.floatHandle} />

        {/* Content card */}
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={2}>
            {club.name}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color="#6D8B99" />
            <Text style={styles.metaText}>{club.wilaya || "—"}</Text>

            {/* counter bubble if you need it */}
            {cats.length > 3 ? (
              <View style={styles.counter}>
                <Text style={styles.counterText}>+{cats.length - 3}</Text>
              </View>
            ) : null}
          </View>

          {/* Category chips */}
          <View style={styles.chipsRow}>
            {cats.slice(0, 3).map((c) => (
              <View key={c} style={styles.chip}>
                <Text style={styles.chipText}>{c}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About Club</Text>
          <Text style={styles.about} numberOfLines={8}>
            {club.descreption ||
              "This club offers activities and training led by local mentors. Join to participate, learn, and collaborate with peers."}
          </Text>
        </View>

        {/* Join CTA - moved inside ScrollView */}
        <View style={styles.joinSection}>
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
              <Text style={styles.joinText}>JOIN NOW</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
            <Text style={styles.label}>User ID</Text>
            <View style={styles.readonly}>
              <Ionicons
                name="person-circle-outline"
                color="#6D8B99"
                size={18}
              />
              <Text style={styles.readonlyText}>{userID}</Text>
            </View>
          </View>
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

  header: {
    height: 54,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: SLATE,
    flex: 1,
    marginHorizontal: 8,
  },

  hero: {
    width: "92%",
    height: 200,
    backgroundColor: "#e9eef0",
    borderRadius: 16,
    alignSelf: "center",
  },

  floatHandle: {
    alignSelf: "center",
    width: 42,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ECEFF1",
    marginTop: -14,
    marginBottom: 4,
  },

  card: { paddingHorizontal: 16, paddingTop: 14 },
  title: { fontSize: 20, fontWeight: "800", color: SLATE, marginBottom: 4 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
    marginBottom: 4,
  },
  metaText: { color: "#6D8B99", fontSize: 13 },
  counter: {
    marginLeft: "auto",
    backgroundColor: "#ECEFF1",
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: { color: "#5B6C78", fontSize: 12, fontWeight: "700" },

  chipsRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 16 },
  chip: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    backgroundColor: PALE_GREEN,
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { color: "#456372", fontSize: 11, fontWeight: "700" },

  sectionTitle: {
    color: SLATE,
    fontWeight: "800",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  about: { color: "#6B7C8A", fontSize: 13, lineHeight: 20, marginBottom: 20 },

  joinSection: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  joinBtnWrap: { borderRadius: 16, overflow: "hidden" },
  joinBtn: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  joinText: { color: "#fff", fontWeight: "800", fontSize: 14 },

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
