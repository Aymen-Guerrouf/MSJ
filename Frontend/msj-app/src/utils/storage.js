// src/utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage utility for managing user session data
 */
export const Storage = {
  // Token management
  async getToken() {
    return await AsyncStorage.getItem("access_token");
  },

  async setToken(token) {
    await AsyncStorage.setItem("access_token", token);
  },

  async removeToken() {
    await AsyncStorage.removeItem("access_token");
  },

  // User data management
  async getUser() {
    const userJson = await AsyncStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  },

  async setUser(user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  },

  async removeUser() {
    await AsyncStorage.removeItem("user");
  },

  // User coordinates
  async getUserCoords() {
    const coordsJson = await AsyncStorage.getItem("user_coords");
    return coordsJson ? JSON.parse(coordsJson) : null;
  },

  async setUserCoords(coords) {
    await AsyncStorage.setItem("user_coords", JSON.stringify(coords));
  },

  // Token expiry
  async getTokenExpiry() {
    return await AsyncStorage.getItem("token_expires_at");
  },

  async setTokenExpiry(expiresAt) {
    await AsyncStorage.setItem("token_expires_at", String(expiresAt));
  },

  // Check if token is expired
  async isTokenExpired() {
    const expiresAt = await this.getTokenExpiry();
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  },

  // Clear all session data
  async clearSession() {
    await AsyncStorage.multiRemove([
      "access_token",
      "user",
      "user_data",
      "user_coords",
      "token_expires_at",
      "last_login_at",
    ]);
  },

  // Get all session data
  async getSessionData() {
    const [token, user, coords, expiresAt, lastLogin] =
      await AsyncStorage.multiGet([
        "access_token",
        "user",
        "user_coords",
        "token_expires_at",
        "last_login_at",
      ]);

    return {
      token: token[1],
      user: user[1] ? JSON.parse(user[1]) : null,
      coords: coords[1] ? JSON.parse(coords[1]) : null,
      expiresAt: expiresAt[1],
      lastLogin: lastLogin[1],
    };
  },
};
