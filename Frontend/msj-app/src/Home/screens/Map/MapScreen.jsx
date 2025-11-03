import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { API_ENDPOINTS, apiCall } from "../../../config/api";
import { styles, pinStyles, mapStyle } from "./MapScreen.styles";

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

  const homes = useMemo(() => centers, [centers]);

  const initialRegion = {
    latitude: 36.7538,
    longitude: 3.0588,
    latitudeDelta: 6,
    longitudeDelta: 6,
  };

  const filtered = useMemo(() => {
    const byName = query
      ? homes.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
      : homes;
    return wilaya === "All"
      ? byName
      : byName.filter((h) => h.wilaya === wilaya);
  }, [homes, query, wilaya]);

  const getCoordinates = (center) => {
    if (center.location?.coordinates) {
      return {
        latitude: center.location.coordinates[1],
        longitude: center.location.coordinates[0],
      };
    }
    return {
      latitude: center.latitude || 0,
      longitude: center.longitude || 0,
    };
  };

  useEffect(() => {
    if (!mapRef.current || filtered.length === 0) return;
    const coords = filtered.map((h) => getCoordinates(h));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 100, right: 60, bottom: 160, left: 60 },
      animated: true,
    });
  }, [filtered]);

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

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={TEAL} />
            <Text style={styles.loadingText}>Loading centers...</Text>
          </View>
        </View>
      )}

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

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#6D8B99" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search youth homes"
          placeholderTextColor="#6D8B99"
          style={styles.searchInput}
        />
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

      <TouchableOpacity
        style={styles.locate}
        onPress={() => mapRef.current?.animateToRegion(initialRegion, 500)}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={22} color={SLATE} />
      </TouchableOpacity>

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
