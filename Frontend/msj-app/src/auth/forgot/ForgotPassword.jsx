// src/auth/forgot/components/ForgotPassword.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ENDPOINTS } from "../../config/api";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const emailInvalid = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = !!email && !emailInvalid;

  const submitEmail = async () => {
    if (!canSubmit || loading) return;
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_REQUEST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      // Your Swagger shows:
      // 200: { success: true, message: "A 6-digit password reset code has been sent to your email." }
      // 404: user not found
      // Some servers may send 200 with success=false on errors – handle both.

      const okJsonSuccess = data && data.success === true;
      const okStatus = res.status >= 200 && res.status < 300;
      console.log("Forgot password response:", res.status, data);

      if (okStatus && okJsonSuccess) {
        // Positive confirmation: proceed to verify screen
        navigation.navigate("ResetPassword", { email });
        return;
      }

      // Map common failure cases to messages
      if (res.status === 404) {
        throw new Error("User not found");
      }

      // If server returned 200 but success !== true, treat as failure
      if (okStatus && data && data.success === false) {
        throw new Error(
          data.message || "Unable to send code. Please try again."
        );
      }

      // Generic fallback for other 4xx/5xx
      throw new Error(
        (data && data.message) || "Unable to send code. Please try again later."
      );
    } catch (err) {
      setServerError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignIn")}
        style={styles.backBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={24} color="#1E2B3A" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter the email associated with your account
      </Text>

      <View style={styles.row}>
        <View style={styles.leadingIcon}>
          <Ionicons name="mail-outline" size={18} color="#244355" />
        </View>
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#6D8B99"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, emailInvalid && styles.inputError]}
        />
      </View>
      {emailInvalid ? (
        <Text style={styles.error}>Enter a valid email</Text>
      ) : null}
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <TouchableOpacity
        style={[styles.cta, (!canSubmit || loading) && styles.ctaDisabled]}
        onPress={submitEmail}
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
            <Text style={styles.ctaText}>Submit</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const PALE_GREEN_BORDER = "rgba(151, 203, 177, 0.45)";
const TEXT_DARK = "#1E3A3A";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    marginTop: 0,
    fontSize: 28,
    fontWeight: "800",
    color: "#263B4D",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 13,
    color: "#93A3B3",
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PALE_GREEN,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALE_GREEN_BORDER,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 8,
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
  inputError: {},
  error: { color: "#CC4B4B", fontSize: 12, marginTop: 4, marginBottom: 8 },

  cta: { marginTop: 24, borderRadius: 16, overflow: "hidden" },
  ctaInner: { height: 50, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.7 },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
