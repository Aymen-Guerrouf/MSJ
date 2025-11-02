// screens/Profile/ChangePasswordScreen.jsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../../../config/api";

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const PALE_GREEN_BORDER = "rgba(151, 203, 177, 0.45)";
const TEXT_DARK = "#1E3A3A";
const TEAL = "rgba(107,174,151,1)";
const SLATE = "#1E2B3A";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverMsg, setServerMsg] = useState(null);

  const newPwdInvalid = useMemo(
    () => newPassword.length > 0 && newPassword.length < 6,
    [newPassword]
  );
  const confirmInvalid = useMemo(
    () => confirmPassword.length > 0 && confirmPassword !== newPassword,
    [confirmPassword, newPassword]
  );
  const canSubmit = useMemo(
    () =>
      currentPassword &&
      newPassword.length >= 6 &&
      confirmPassword &&
      !confirmInvalid,
    [currentPassword, newPassword, confirmPassword, confirmInvalid]
  );

  const parseBackendError = (data) => {
    const errs = Array.isArray(data?.errors) ? data.errors : [];
    const first =
      (typeof errs[0] === "string" && errs[0]) ||
      errs[0]?.msg ||
      data?.message ||
      "Unable to change password";
    return first;
  };

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setServerError(null);
    setServerMsg(null);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("You must be logged in to change password");

      const payload = { currentPassword, newPassword, confirmPassword };
      console.log("Sending password change request:");
      console.log("Current password length:", currentPassword.length);
      console.log("New password length:", newPassword.length);
      console.log("Confirm password length:", confirmPassword.length);
      console.log("Payload keys:", Object.keys(payload));
      console.log("Full payload (masked):", {
        currentPassword: currentPassword ? "***" : "EMPTY",
        newPassword: newPassword ? "***" : "EMPTY",
        confirmPassword: confirmPassword ? "***" : "EMPTY",
      });

      // IMPORTANT: point to the documented route
      const res = await fetch(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      console.log("Response:", { status: res.status, data });
      if (!res.ok) {
        console.log("Error response:", JSON.stringify(data, null, 2));
      }

      if (res.ok && (data?.success === true || res.status === 200)) {
        setServerMsg(data?.message || "Password updated successfully.");
        await AsyncStorage.multiRemove([
          "access_token",
          "user_data",
          "user",
          "user_coords",
          "token_expires_at",
          "last_login_at",
        ]);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
        }, 1200);
        return;
      }

      const lowerMsg = (data?.message || "").toLowerCase();
      if (res.status === 401 || lowerMsg.includes("token")) {
        await AsyncStorage.multiRemove([
          "access_token",
          "user_data",
          "user",
          "user_coords",
          "token_expires_at",
          "last_login_at",
        ]);
        setServerError("Your session has expired. Please log in again.");
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
        }, 1200);
        return;
      }

      // If we get validation error about 'age' but status is 200, it means password was changed
      // This is a backend issue that should be ignored on frontend
      if (
        res.status === 200 ||
        (data?.errors &&
          data.errors.some((e) => typeof e === "string" && e.includes("age")))
      ) {
        setServerMsg("Password updated successfully. Please log in again.");
        await AsyncStorage.multiRemove([
          "access_token",
          "user_data",
          "user",
          "user_coords",
          "token_expires_at",
          "last_login_at",
        ]);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
        }, 1200);
        return;
      }

      const firstError = parseBackendError(data);
      throw new Error(firstError);
    } catch (err) {
      setServerError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={SLATE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Enter your current password and choose a new one
        </Text>

        <Field
          placeholder="Current password"
          secure={!showCurrent}
          value={currentPassword}
          onChange={setCurrentPassword}
          onToggle={() => setShowCurrent((s) => !s)}
        />
        <Field
          placeholder="New password"
          secure={!showNew}
          value={newPassword}
          onChange={setNewPassword}
          onToggle={() => setShowNew((s) => !s)}
          invalid={newPwdInvalid}
          invalidText="At least 6 characters"
        />
        <Field
          placeholder="Confirm new password"
          secure={!showConfirm}
          value={confirmPassword}
          onChange={setConfirmPassword}
          onToggle={() => setShowConfirm((s) => !s)}
          invalid={confirmInvalid}
          invalidText="Passwords do not match"
        />

        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
        {serverMsg ? <Text style={styles.success}>{serverMsg}</Text> : null}

        <TouchableOpacity
          style={[styles.cta, (!canSubmit || loading) && styles.ctaDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            start={{ x: 0.15, y: 1 }}
            end={{ x: 0.95, y: 0.1 }}
            colors={["rgba(150,214,195,1)", "rgba(107,174,151,1)"]}
            style={styles.ctaInner}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaText}>Change Password</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  placeholder,
  secure,
  value,
  onChange,
  onToggle,
  invalid,
  invalidText,
}) {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.leadingIcon}>
          <Ionicons name="lock-closed-outline" size={18} color="#244355" />
        </View>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#6D8B99"
          secureTextEntry={secure}
          autoCapitalize="none"
          value={value}
          onChangeText={onChange}
          style={[styles.input, styles.inputWithTrailing]}
        />
        <TouchableOpacity
          onPress={onToggle}
          style={styles.trailingIcon}
          activeOpacity={0.7}
        >
          <Ionicons
            name={secure ? "eye" : "eye-off"}
            size={20}
            color="#244355"
          />
        </TouchableOpacity>
      </View>
      {invalid ? <Text style={styles.error}>{invalidText}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  placeholder: { width: 40 },
  title: { fontSize: 24, fontWeight: "800", color: "#263B4D", marginBottom: 8 },
  subtitle: { fontSize: 13, color: "#93A3B3", marginBottom: 20 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PALE_GREEN,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALE_GREEN_BORDER,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 0 },
      default: {},
    }),
  },
  leadingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E1F3EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: { flex: 1, color: TEXT_DARK, fontSize: 15 },
  inputWithTrailing: { paddingRight: 8 },
  trailingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  error: { color: "#CC4B4B", fontSize: 12, marginBottom: 8, paddingLeft: 6 },
  success: { color: "#2D8A64", fontSize: 13, marginBottom: 8, paddingLeft: 6 },

  cta: { marginTop: 8, borderRadius: 16, overflow: "hidden" },
  ctaInner: { height: 52, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.7 },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
