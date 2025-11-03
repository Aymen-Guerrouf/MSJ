import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get the local IP address for your computer
// When testing on a physical device, use your computer's local network IP
// When testing on web or emulator, use localhost
const getBaseURL = () => {
  // For web development (use backend port 3001)
  if (Platform.OS === "web") {
    return "http://localhost:3001";
  }

  // Allow an environment override (useful when testing on a device or CI)
  // e.g. set API_BASE_URL=http://192.168.1.23:3001 when launching the app
  try {
    // process.env may be injected by bundlers or CI; guard access
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.API_BASE_URL
    ) {
      return process.env.API_BASE_URL;
    }
  } catch (e) {}

  // For physical devices on the same network: change this to your machine's IP
  return "http://192.168.0.115:3001";

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
    UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/update-password`,
    FORGOT_PASSWORD_REQUEST: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  },
  CENTERS: {
    LIST: `${API_BASE_URL}/api/centers`, // supports ?include=clubs,events,workshops,all
  },
  EVENTS: {
    LIST: `${API_BASE_URL}/api/events`,
    REGISTER: `${API_BASE_URL}/api/event-registrations`,
    MY_REGISTRATIONS: `${API_BASE_URL}/api/event-registrations/my`,
  },
  WORKSHOPS: {
    LIST: `${API_BASE_URL}/api/workshops`,
    ENROLL: `${API_BASE_URL}/api/workshop-enrollments`,
    MY_ENROLLMENTS: `${API_BASE_URL}/api/workshop-enrollments/my`,
  },
  CLUBS: {
    LIST: `${API_BASE_URL}/api/clubs`,
    JOIN: `${API_BASE_URL}/api/club-memberships/join`,
    MY_MEMBERSHIPS: `${API_BASE_URL}/api/club-memberships/my`,
  },
  POSTS: {
    LIST: `${API_BASE_URL}/api/posts`,
  },
  VIRTUAL_SCHOOL: {
    LIST: `${API_BASE_URL}/api/virtual-school`,
    GET: (id) => `${API_BASE_URL}/api/virtual-school/${id}`,
  },
  EXPERIENCE: {
    SESSIONS: `${API_BASE_URL}/api/experience-sessions`,
    SESSION: (id) => `${API_BASE_URL}/api/experience-sessions/${id}`,
    CARDS: `${API_BASE_URL}/api/experience-cards`,
    CARD: (id) => `${API_BASE_URL}/api/experience-cards/${id}`,
  },
  SPARKS: {
    LIST: `${API_BASE_URL}/api/startup-ideas`,
    CREATE: `${API_BASE_URL}/api/startup-ideas`,
    MY_PROJECT: `${API_BASE_URL}/api/startup-ideas/my-project`,
    DETAIL: (id) => `${API_BASE_URL}/api/startup-ideas/${id}`,
    SUPERVISORS: `${API_BASE_URL}/api/startup-ideas/supervisors`,
  },
  PROJECT_REQUESTS: {
    CREATE: `${API_BASE_URL}/api/project-requests`,
    MY_REQUESTS: `${API_BASE_URL}/api/project-requests/my-requests`,
    RESPOND: (id) => `${API_BASE_URL}/api/project-requests/${id}/respond`,
    CANCEL: (id) => `${API_BASE_URL}/api/project-requests/${id}`,
  },
  CHATBOT: {
    CHAT: `${API_BASE_URL}/api/user/chat`,
  },
  USER: {
    UPDATE_INTERESTS: `${API_BASE_URL}/api/user/interests`,
    ME: `${API_BASE_URL}/api/user/me`,
  },
};

// Helper function to get auth headers
export async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Helper function to make authenticated API calls
export async function apiCall(url, options = {}) {
  const headers = await getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  return response;
}

// Helper to clear auth data on logout
export async function clearAuthData() {
  await AsyncStorage.removeItem("access_token");
  await AsyncStorage.removeItem("user_data");
}

// Helper to get user data
export async function getUserData() {
  const userData = await AsyncStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
}
