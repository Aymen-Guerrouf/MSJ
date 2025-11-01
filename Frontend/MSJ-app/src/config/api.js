import { Platform } from "react-native";

// Get the local IP address for your computer
// When testing on a physical device, use your computer's local network IP
// When testing on web or emulator, use localhost
const getBaseURL = () => {
  // For web development (localhost:8081)
  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }

  // For physical devices on the same network
  // Replace this IP with your computer's actual IP address
  return "http://172.20.10.14:3000";

  // Alternative: Use Expo's development URL if using Expo Go
  // You can also get this dynamically from expo-constants
};

export const API_BASE_URL = getBaseURL();
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
};
