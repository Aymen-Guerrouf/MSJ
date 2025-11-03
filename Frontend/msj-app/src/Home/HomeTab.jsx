// AppNavigation.jsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapScreen from "./screens/Map/MapScreen";
import AnnexView from "./screens/Map/AnnexView";
import Events from "./screens/Events/Events";
import EventView from "./screens/Events/EventView";
import WorkshopView from "./screens/Events/WorkshopView";
import ProfileScreen from "./screens/profile/ProfileScreen";
import SettingsScreen from "./screens/profile/SettingsScreen";
import ChangePasswordScreen from "./screens/profile/ChangePasswordScreen";
import VirtualTour from "../TourView/screens/VirtualTourScreen";
import ChatbotScreen from "./screens/Events/ChatbotScreen";
import ClubView from "./screens/Map/ClubView";
import { LinearGradient } from "expo-linear-gradient";
import {
  SpacesScreen,
  SharingExperiencesScreen,
  VirtualSchoolScreen,
  VideoPlayerScreen,
  SparksHubScreen,
  CreateSparkScreen,
  MySparkScreen,
  SparkDetailScreen,
  SupervisorsListScreen,
  SupervisorDetailScreen,
} from "./screens/Spaces";
import ExperienceStoryDetailScreen from "./screens/Spaces/sharing-exp/ExperienceStoryDetailScreen";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import {
  View,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="AnnexView" component={AnnexView} />
      <Stack.Screen name="AnnexTour360" component={VirtualTour} />
      <Stack.Screen name="ClubView" component={ClubView} />
      <Stack.Screen name="EventView" component={EventView} />
      <Stack.Screen name="WorkshopView" component={WorkshopView} />
    </Stack.Navigator>
  );
}

function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="EventView" component={EventView} />
      <Stack.Screen name="WorkshopView" component={WorkshopView} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
    </Stack.Navigator>
  );
}

function SpacesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SpacesScreen" component={SpacesScreen} />
      <Stack.Screen
        name="SharingExperiences"
        component={SharingExperiencesScreen}
      />
      <Stack.Screen
        name="ExperienceStoryDetail"
        component={ExperienceStoryDetailScreen}
      />
      <Stack.Screen name="VirtualSchool" component={VirtualSchoolScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />

      {/* Sparks Hub */}
      <Stack.Screen name="SparksHub" component={SparksHubScreen} />
      <Stack.Screen name="CreateSpark" component={CreateSparkScreen} />
      <Stack.Screen name="MySpark" component={MySparkScreen} />
      <Stack.Screen name="SparkDetail" component={SparkDetailScreen} />
      <Stack.Screen name="SupervisorsList" component={SupervisorsListScreen} />
      <Stack.Screen
        name="SupervisorDetail"
        component={SupervisorDetailScreen}
      />
    </Stack.Navigator>
  );
}

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Events"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarBackground: () => <CurvedTabBar />,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 115,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 20,
          paddingTop: 35,
          paddingBottom: Platform.OS === "ios" ? 40 : 20,
          paddingHorizontal: 15,
          zIndex: 9999,
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
            <PillTab focused={focused} icon="flash-outline" label="Events" />
          ),
        }}
      />
      <Tab.Screen
        name="Spaces"
        component={SpacesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <PillTab focused={focused} icon="grid-outline" label="Spaces" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <PillTab focused={focused} icon="person-outline" label="Profil" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function CurvedTabBar() {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 9999,
      }}
    >
      <Svg
        width={SCREEN_WIDTH}
        height={130}
        viewBox={`0 0 ${SCREEN_WIDTH} 130`}
        style={{ position: "absolute", bottom: 0, zIndex: 10000 }}
      >
        <Defs>
          <SvgLinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#96D6C3" stopOpacity="1" />
            <Stop offset="1" stopColor="#6BAE97" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={`M 0 35 Q ${
            SCREEN_WIDTH / 2
          } 0 ${SCREEN_WIDTH} 35 L ${SCREEN_WIDTH} 130 L 0 130 Z`}
          fill="#FFFFFF"
        />
        <Path
          d={`M 0 35 Q ${SCREEN_WIDTH / 2} 0 ${SCREEN_WIDTH} 35`}
          stroke="url(#gradient)"
          strokeWidth="3"
          fill="none"
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 10001,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: -3 },
            },
            android: { elevation: 20 },
          }),
        }}
      />
    </View>
  );
}

function PillTab({ focused, icon, label }) {
  const iconScale = React.useRef(new Animated.Value(1)).current;
  const underline = React.useRef(new Animated.Value(focused ? 35 : 0)).current;

  React.useEffect(() => {
    Animated.spring(iconScale, {
      toValue: focused ? 1.15 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
    Animated.timing(underline, {
      toValue: focused ? 35 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  return (
    <View
      style={{
        flex: 1,
        height: 95,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{ transform: [{ scale: iconScale }], alignItems: "center" }}
      >
        <Ionicons
          name={icon}
          size={30}
          color={focused ? "#6BAE97" : "#9CA3AF"}
        />
      </Animated.View>

      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={{
          color: focused ? "#6BAE97" : "#9CA3AF",
          fontSize: 12,
          fontWeight: focused ? "700" : "600",
          marginTop: 6,
          textAlign: "center",
          width: "100%",
          paddingHorizontal: 2,
        }}
      >
        {label}
      </Text>

      <Animated.View
        style={{
          height: 3,
          width: underline,
          marginTop: 5,
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
