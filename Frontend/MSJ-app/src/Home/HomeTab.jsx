// AppNavigation.jsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapScreen from "./screens/Map/MapScreen";
import AnnexView from "./screens/Map/AnnexView";
import EventsList from "./screens/EventsList";
import ProfileScreen from "./screens/ProfileScreen";
import VirtualTour from "../TourView/screens/VirtualTourScreen";
import ClubView from "./screens/Map/ClubView";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="AnnexView" component={AnnexView} />
      <Stack.Screen name="AnnexTour360" component={VirtualTour} />
      <Stack.Screen name="ClubView" component={ClubView} />
    </Stack.Navigator>
  );
}

function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsList" component={EventsList} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 24,
          height: 78,
          borderRadius: 26,
          backgroundColor: "#FFFFFF",
          marginHorizontal: 20,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: "rgba(151,203,177,0.22)",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
            },
            android: { elevation: 12 },
          }),
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <PillTab focused={focused} icon="map-outline" label="Map" />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <PillTab focused={focused} icon="calendar-outline" label="Events" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <PillTab
              focused={focused}
              icon="person-circle-outline"
              label="Profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function PillTab({ focused, icon, label }) {
  const iconScale = React.useRef(new Animated.Value(1)).current;
  const underline = React.useRef(new Animated.Value(focused ? 45 : 0)).current;

  React.useEffect(() => {
    Animated.spring(iconScale, {
      toValue: focused ? 1.1 : 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
    Animated.timing(underline, {
      toValue: focused ? 45 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  return (
    <View
      style={{
        width: 110,
        height: 62,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{ transform: [{ scale: iconScale }], alignItems: "center" }}
      >
        <Ionicons
          name={icon}
          size={26}
          color={focused ? "#6BAE97" : "#9CA3AF"}
          marginTop={35}
        />
      </Animated.View>

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          color: focused ? "#6BAE97" : "#9CA3AF",
          fontSize: 12,
          fontWeight: focused ? "700" : "600",
          marginTop: 6,
          textAlign: "center",
        }}
      >
        {label}
      </Text>

      <Animated.View
        style={{
          height: 3,
          width: underline,
          marginTop: 6,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["rgba(150,214,195,1)", "rgba(107,174,151,1)"]}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
