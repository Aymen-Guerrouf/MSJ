// src/home/HomeMap.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";

// Replace/extend with your real dataset from an API if available.
const YOUTH_CENTERS_DZA = [
  {
    id: "cij-sidi-fredj",
    name: "المركز الدولي للشباب - سيدي فرج",
    lat: 36.757,
    lon: 2.866,
  },
  {
    id: "oran-es-senia",
    name: "دار الشباب - السانية (وهران)",
    lat: 35.6536,
    lon: -0.6204,
  },
  { id: "constantine", name: "دار الشباب - قسنطينة", lat: 36.365, lon: 6.614 },
  { id: "setif", name: "دار الشباب - سطيف", lat: 36.191, lon: 5.413 },
  { id: "tizi-ouzou", name: "دار الشباب - تيزي وزو", lat: 36.711, lon: 4.045 },
];

export default function HomeMap() {
  const route = useRoute();
  const mapRef = useRef(null);

  // Initial camera over northern Algeria
  const initial = {
    latitude: 36.5,
    longitude: 3.0,
    latitudeDelta: 6.0,
    longitudeDelta: 6.0,
  };

  const [region, setRegion] = useState(initial);
  const [query, setQuery] = useState("");

  const userCoords = route.params?.userCoords || null;

  useEffect(() => {
    if (userCoords?.latitude && userCoords?.longitude) {
      const next = {
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 800);
    }
  }, [userCoords]);

  const centerOnUser = () => {
    if (userCoords?.latitude && userCoords?.longitude) {
      const next = {
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current?.animateToRegion(next, 700);
    }
  };

  // Filter markers by query (simple contains match)
  const filteredCenters = YOUTH_CENTERS_DZA.filter((c) => {
    const t = (c.name || "").toLowerCase();
    const q = (query || "").toLowerCase();
    return q ? t.includes(q) : true;
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredCenters.map((c) => (
          <Marker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lon }}
            title={c.name}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{c.name}</Text>
                <Text style={styles.calloutSub}>الجزائر</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Optional user pin is not needed because showsUserLocation renders blue dot;
            uncomment below if you want a colored pin in addition to the dot.
        {userCoords && (
          <Marker
            coordinate={{ latitude: userCoords.latitude, longitude: userCoords.longitude }}
            pinColor="#2DD4BF"
            title="موقعي الحالي"
            description="تم تحديد موقعك"
          />
        )} */}
      </MapView>

      {/* Top Search Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث عن دار الشباب"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCorrect={false}
          />
          {!!query && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.hint}>اعثر على ديار الشباب على الخريطة.</Text>
      </View>

      {/* Re-center to user FAB */}
      <TouchableOpacity
        style={[styles.fab, styles.shadow]}
        onPress={centerOnUser}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation (simple custom bar; replace with React Navigation Tabs later) */}
      <View style={[styles.navbar, styles.shadow]}>
        <NavBtn icon="map" label="الخريطة" active />
        <NavBtn icon="list" label="قائمة" onPress={() => {}} />
        <NavBtn icon="chatbubble-ellipses" label="دردشة" onPress={() => {}} />
        <NavBtn icon="person-circle" label="الملف" onPress={() => {}} />
      </View>
    </View>
  );
}

function NavBtn({ icon, label, onPress, active }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.navBtn}
      activeOpacity={0.8}
    >
      <Ionicons
        name={`${icon}${active ? "" : "-outline"}`}
        size={22}
        color={active ? "#fff" : "#9CA3AF"}
      />
      <Text style={[styles.navLabel, active && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },

  // Search overlay
  searchWrap: {
    position: "absolute",
    top: 18,
    left: 16,
    right: 16,
    backgroundColor: "rgba(17,24,39,0.7)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#111827", fontSize: 16 },
  clearBtn: { paddingLeft: 6, paddingVertical: 6 },
  hint: { color: "#D1D5DB", fontSize: 12, marginTop: 8 },

  // Callout styling
  callout: {
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  calloutTitle: { color: "#F9FAFB", fontWeight: "800", marginBottom: 4 },
  calloutSub: { color: "#D1D5DB", fontSize: 12 },

  // Bottom nav
  navbar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(17,24,39,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  navBtn: { alignItems: "center", justifyContent: "center" },
  navLabel: { marginTop: 4, fontSize: 11, color: "#9CA3AF", fontWeight: "600" },

  // FAB
  fab: {
    position: "absolute",
    right: 24,
    bottom: 98,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  // Shadows
  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
    },
    android: { elevation: 10 },
    default: {},
  }),
});
