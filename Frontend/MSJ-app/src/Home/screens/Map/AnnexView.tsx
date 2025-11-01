// screens/Map/AnnexView.jsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";
const SLATE = "#1F2F3A";
const PALE_GREEN = "rgba(230, 247, 238, 1)";

export default function AnnexView() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const annex = (params as any)?.annex;

  if (!annex) {
    return (
      <View style={styles.center}>
        <Text>No annex data</Text>
      </View>
    );
  }

  const openDial = () => {
    if (!annex.phone) return;
    Linking.openURL(`tel:${annex.phone.replace(/\s+/g, "")}`);
  };

  const openMaps = () => {
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?ll=${annex.latitude},${annex.longitude}&q=${encodeURIComponent(
          annex.name
        )}`,
        android: `geo:${annex.latitude},${annex.longitude}?q=${encodeURIComponent(
          annex.name
        )}`,
      }) || "";
    Linking.openURL(url);
  };

  const openTour = () => {
    (navigation as any).navigate("AnnexTour360");
  };

  const clubs = annex.clubs || [];
  const events = annex.events || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === "ios" ? 25 : 8 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={SLATE} />
        </TouchableOpacity>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        {/* Hero */}
        <Image source={{ uri: annex.image }} style={styles.hero} resizeMode="cover" />

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.name} numberOfLines={2}>{annex.name}</Text>
          <Text style={styles.wilayaText}>{annex.wilaya}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <InfoRow icon="location-outline" text={annex.address || `${annex.wilaya}, Algeria`} linkable={false} />
          <TouchableOpacity onPress={openDial} activeOpacity={0.85}>
            <InfoRow icon="call-outline" text={annex.phone || "N/A"} linkable={true} />
          </TouchableOpacity>

          {/* Mini Map Preview */}
          <View style={styles.mapWrap}>
            <MapView
              style={{ flex: 1 }}
              pointerEvents="none"
              initialRegion={{
                latitude: annex.latitude,
                longitude: annex.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude: annex.latitude, longitude: annex.longitude }}>
                <PinMini />
              </Marker>
            </MapView>

            <TouchableOpacity style={styles.mapCta} onPress={openMaps} activeOpacity={0.9}>
              <LinearGradient
                start={{ x: 0.15, y: 1 }}
                end={{ x: 0.95, y: 0.1 }}
                colors={[MINT, TEAL]}
                style={styles.mapCtaInner}
              >
                <Ionicons name="navigate" size={16} color="#fff" />
                <Text style={styles.mapCtaText}>Open in Maps</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 360 Tour CTA */}
          {annex.hasTour ? (
            <TouchableOpacity style={styles.cta} onPress={openTour} activeOpacity={0.9}>
              <LinearGradient
                start={{ x: 0.15, y: 1 }}
                end={{ x: 0.95, y: 0.1 }}
                colors={[MINT, TEAL]}
                style={styles.ctaInner}
              >
                <Ionicons name="cube-outline" size={18} color="#fff" />
                <Text style={styles.ctaText}>View 360 Tour</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Clubs */}
        <SectionHeader title="Clubs" />
        {clubs.length ? (
          <FlatList
            data={clubs}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <ClubCard club={item} />}
          />
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: "#7A8A9A", fontSize: 13, fontStyle: "italic" }}>No clubs listed yet.</Text>
          </View>
        )}

        {/* Events */}
        <SectionHeader title="Events and workshops" />
        {events.length ? (
          <View style={{ paddingHorizontal: 16 }}>
            {events.map((ev) => (
              <EventRow key={ev.id} ev={ev} />
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: "#7A8A9A", fontSize: 13, fontStyle: "italic" }}>No upcoming events.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, text, linkable }: { icon: any; text: any; linkable: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#244355" />
      </View>
      <Text numberOfLines={2} style={[styles.rowText, linkable && { color: TEAL, fontWeight: "700" }]}>
        {text}
      </Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 18, marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEAL, marginRight: 8 }} />
      <Text style={{ color: SLATE, fontWeight: "800", fontSize: 16 }}>{title}</Text>
    </View>
  );
}

function ClubCard({ club }) {
  const navigation = useNavigation();
  const cats = Array.isArray(club.categories) ? club.categories : [];
  const shown = cats.slice(0, 3);
  const rest = cats.length - shown.length;

  return (
    <TouchableOpacity
      onPress={() => (navigation as any).navigate("ClubView", { club })}
      activeOpacity={0.9}
    >
      <View style={clubStyles.card}>
        <Image source={{ uri: club.image }} style={clubStyles.img} />
        <Text numberOfLines={1} style={clubStyles.name}>{club.name}</Text>

        {/* Category chips */}
        <View style={clubStyles.chipsRow}>
          {shown.map((c) => (
            <View key={c} style={clubStyles.chip}>
              <Text style={clubStyles.chipText}>{c}</Text>
            </View>
          ))}
          {rest > 0 ? (
            <View style={[clubStyles.chip, { backgroundColor: "rgba(107,174,151,0.12)", borderColor: TEAL }]}>
              <Text style={[clubStyles.chipText, { color: TEAL }]}>+{rest}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EventRow({ ev }: { ev: any }) {
  return (
    <View style={eventStyles.row}>
      <Image source={{ uri: ev.image }} style={eventStyles.thumb} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text numberOfLines={1} style={eventStyles.title}>{ev.title}</Text>
        <Text style={eventStyles.meta}>{ev.date} • {ev.time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#93A3B3" />
    </View>
  );
}

function PinMini() {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 2.5,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      >
        <View
          style={{
            backgroundColor: TEAL,
            borderRadius: 10,
            width: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: MINT,
          }}
        >
          <Ionicons name="home" size={11} color="#fff" />
        </View>
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 7,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: TEAL,
          marginTop: 1,
        }}
      />
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
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: SLATE, flex: 1, marginHorizontal: 8 },
  hero: { width: "92%", height: 190, borderRadius: 16, alignSelf: "center", marginTop: 8 },
  titleBlock: { paddingHorizontal: 16, marginTop: 12 },
  name: { fontSize: 18, fontWeight: "800", color: SLATE, marginBottom: 4 },
  wilayaText: { fontSize: 13, color: "#7A8A9A" },
  card: { paddingHorizontal: 16, paddingTop: 14 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E1F3EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rowText: { flex: 1, color: SLATE, fontSize: 14 },
  mapWrap: {
    height: 170,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.35)",
  },
  mapCta: { position: "absolute", right: 10, bottom: 10, borderRadius: 14, overflow: "hidden" },
  mapCtaInner: {
    height: 36,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderRadius: 14,
  },
  mapCtaText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  cta: { marginTop: 16, borderRadius: 16, overflow: "hidden" },
  ctaInner: {
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});

const clubStyles = StyleSheet.create({
  card: {
    width: 180,
    borderRadius: 14,
    backgroundColor: PALE_GREEN,
    marginRight: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.45)",
  },
  img: { width: "100%", height: 96, borderRadius: 10, marginBottom: 8 },
  name: { color: SLATE, fontWeight: "800", fontSize: 13, marginBottom: 6 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { color: "#456372", fontSize: 11, fontWeight: "700" },
});

const eventStyles = StyleSheet.create({
  row: {
    height: 68,
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.35)",
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: { width: 52, height: 52, borderRadius: 10 },
  title: { color: SLATE, fontWeight: "800", fontSize: 14 },
  meta: { color: "#6D8B99", fontSize: 12, marginTop: 2 },
});
