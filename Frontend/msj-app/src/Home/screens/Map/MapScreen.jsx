// screens/MapScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Modal,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { API_ENDPOINTS, apiCall } from "../../../config/api";

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const MINT = "rgba(150,214,195,1)";
const TEAL = "rgba(107,174,151,1)";
const SLATE = "#244355";
const ALL_WILAYAS = [
  "All",
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "MSila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
  "Timimoun",
  "Bordj Badji Mokhtar",
  "Ouled Djellal",
  "Béni Abbès",
  "In Salah",
  "In Guezzam",
  "Touggourt",
  "Djanet",
  "El M'Ghair",
  "El Meniaa",
];

export default function MapScreen() {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [query, setQuery] = useState("");
  const [wilaya, setWilaya] = useState("All");
  const [pickerOpen, setPickerOpen] = useState(false);

  // State for fetching centers
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch centers on mount
  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(
        `${API_ENDPOINTS.CENTERS.LIST}?include=all`
      );

      if (!response.ok) {
        throw new Error("Failed to load centers");
      }

      const data = await response.json();

      if (
        data.success &&
        data.data?.centers &&
        Array.isArray(data.data.centers)
      ) {
        setCenters(data.data.centers);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err?.message || "Failed to load centers");
      console.error("Error fetching centers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use fetched centers
  const homes = useMemo(() => centers, [centers]);

  const initialRegion = {
    latitude: 36.7538,
    longitude: 3.0588,
    latitudeDelta: 6,
    longitudeDelta: 6,
  };

  // Filtering
  const filtered = useMemo(() => {
    const byName = query
      ? homes.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
      : homes;
    return wilaya === "All"
      ? byName
      : byName.filter((h) => h.wilaya === wilaya);
  }, [homes, query, wilaya]);

  // Helper to get coordinates from center object
  const getCoordinates = (center) => {
    // Backend stores location as GeoJSON: { type: 'Point', coordinates: [lng, lat] }
    if (center.location?.coordinates) {
      return {
        latitude: center.location.coordinates[1],
        longitude: center.location.coordinates[0],
      };
    }
    // Fallback to direct properties if they exist
    return {
      latitude: center.latitude || 0,
      longitude: center.longitude || 0,
    };
  };

  // Fit to markers when list changes
  useEffect(() => {
    if (!mapRef.current || filtered.length === 0) return;
    const coords = filtered.map((h) => getCoordinates(h));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 100, right: 60, bottom: 160, left: 60 },
      animated: true,
    });
  }, [filtered]);

  // Select handler
  const chooseWilaya = (w) => {
    setWilaya(w);
    setPickerOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
      >
        {filtered.map((h) => {
          const coords = getCoordinates(h);
          return (
            <Marker
              key={h._id || h.id}
              coordinate={coords}
              title={h.name}
              description={h.wilaya}
              tracksViewChanges={false}
              onPress={() =>
                navigation.navigate("AnnexView", { annexId: h._id || h.id })
              }
            >
              <HomePin />
            </Marker>
          );
        })}
      </MapView>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={TEAL} />
            <Text style={styles.loadingText}>Loading centers...</Text>
          </View>
        </View>
      )}

      {/* Error message */}
      {error && !loading && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={32} color="#CC4B4B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchCenters} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#6D8B99" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search youth homes"
          placeholderTextColor="#6D8B99"
          style={styles.searchInput}
        />
        {/* Select wilaya button */}
        <TouchableOpacity
          onPress={() => setPickerOpen(true)}
          style={styles.selectBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="funnel-outline" size={16} color="#fff" />
          <Text style={styles.selectText}>
            {wilaya === "All" ? "Wilaya" : wilaya}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>

        {query ? (
          <TouchableOpacity
            onPress={() => setQuery("")}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={18} color="#6D8B99" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Locate me */}
      <TouchableOpacity
        style={styles.locate}
        onPress={() => mapRef.current?.animateToRegion(initialRegion, 500)}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={22} color={SLATE} />
      </TouchableOpacity>

      {/* Bottom-sheet vertical picker */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setPickerOpen(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetGrab} />
          <Text style={styles.sheetTitle}>Select wilaya</Text>
          <FlatList
            data={ALL_WILAYAS}
            keyExtractor={(i) => i}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => chooseWilaya(item)}
                style={[
                  styles.sheetRow,
                  item === wilaya && styles.sheetRowActive,
                ]}
                activeOpacity={0.9}
              >
                <Text
                  style={[
                    styles.sheetRowText,
                    item === wilaya && styles.sheetRowTextActive,
                  ]}
                >
                  {item}
                </Text>
                {item === wilaya ? (
                  <Ionicons name="checkmark-circle" size={18} color={TEAL} />
                ) : null}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

/* Complete mint home pin */
function HomePin() {
  return (
    <View style={pinStyles.root}>
      <View style={pinStyles.ring}>
        <View style={pinStyles.badge}>
          <Ionicons name="home" size={14} color="#ffffff" />
        </View>
      </View>
      <View style={pinStyles.pointer} />
    </View>
  );
}

const pinStyles = StyleSheet.create({
  root: { alignItems: "center" },
  ring: {
    backgroundColor: "#ffffff",
    padding: 3,
    borderRadius: 16,
  },
  badge: {
    backgroundColor: TEAL,
    borderRadius: 13,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: MINT,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: TEAL,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  searchWrap: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(151, 203, 177, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#1E3A3A",
    fontSize: 15,
  },
  clearBtn: { paddingLeft: 6, paddingVertical: 4 },

  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 10,
    backgroundColor: TEAL,
    marginLeft: 6,
  },
  selectText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  locate: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(151, 203, 177, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 8 },
    }),
  },

  // Bottom sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
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
    marginBottom: 8,
  },
  sheetRow: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: PALE_GREEN,
    borderWidth: 1,
    borderColor: "rgba(151,203,177,0.45)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetRowActive: {
    backgroundColor: "rgba(107,174,151,0.12)",
    borderColor: TEAL,
  },
  sheetRowText: { color: SLATE, fontSize: 14, fontWeight: "700" },
  sheetRowTextActive: { color: TEAL },

  // Loading overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  loadingText: {
    marginTop: 12,
    color: SLATE,
    fontSize: 14,
    fontWeight: "600",
  },

  // Error overlay
  errorOverlay: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
  },
  errorCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(204,75,75,0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  errorText: {
    marginTop: 8,
    color: "#CC4B4B",
    fontSize: 13,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: TEAL,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});

// Minimal, desaturated map style
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", stylers: [{ color: "#d6f3ea" }] },
];
