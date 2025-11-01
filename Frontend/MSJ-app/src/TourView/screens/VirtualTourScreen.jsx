import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PannellumViewer from "../components/PannellumViewer";
const PANORAMAS = [
  {
    id: "main-hall",
    name: "Main Hall",
    image: "https://pannellum.org/images/bma-0.jpg",
  },
  {
    id: "exhibition-room",
    name: "Exhibition Room",
    image: "https://pannellum.org/images/bma-1.jpg",
  },
];

export default function VirtualTour() {
  const [selectedPanorama, setSelectedPanorama] = useState(PANORAMAS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const newIndex =
      currentIndex === 0 ? PANORAMAS.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedPanorama(PANORAMAS[newIndex]);
  };

  const goToNext = () => {
    const newIndex =
      currentIndex === PANORAMAS.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedPanorama(PANORAMAS[newIndex]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 360° Panorama View */}
      <View style={styles.panoramaContainer}>
        <PannellumViewer
          key={selectedPanorama.id}
          imageUrl={selectedPanorama.image}
          autoRotate={false}
          autoRotateSpeed={2}
          initialYaw={0}
          initialPitch={0}
        />
      </View>

      {/* Navigation Arrows */}
      <TouchableOpacity
        style={[styles.arrowButton, styles.leftArrow]}
        onPress={goToPrevious}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["rgba(150, 214, 195, 1)", "rgba(107, 174, 151, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.arrowText}>‹</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.arrowButton, styles.rightArrow]}
        onPress={goToNext}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["rgba(150, 214, 195, 1)", "rgba(107, 174, 151, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.arrowText}>›</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Current Room Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{selectedPanorama.name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  panoramaContainer: {
    flex: 1,
  },
  titleContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    backgroundColor: "rgba(150, 214, 195, 0.25)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(150, 214, 195, 0.4)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradientButton: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  leftArrow: {
    left: 20,
    transform: [{ translateY: -30 }],
  },
  rightArrow: {
    right: 20,
    transform: [{ translateY: -30 }],
  },
  arrowText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -4,
  },
});
