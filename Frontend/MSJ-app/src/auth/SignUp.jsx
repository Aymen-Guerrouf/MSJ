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
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ENDPOINTS } from "../config/api";

export default function SignUp() {
  const navigation = useNavigation();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setValue, handleSubmit, watch } = useForm({
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // Manual validation (replace/expand as needed)
  const validate = (values) => {
    const errs = {};
    if (!values.name || values.name.length < 2)
      errs.name = "Please enter your full name";
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errs.email = "Enter a valid email";
    if (!values.password || values.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (values.password !== values.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const onSubmit = async (values) => {
    const errors = validate(values);
    setServerError(null);
    if (Object.keys(errors).length) {
      setServerError(Object.values(errors).join("\n"));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Signup failed. Please try again.");
      }
      navigation.replace("SignIn");
    } catch (err) {
      setServerError(err?.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get values for error handling inline
  const values = watch();

  return (
    <LinearGradient
      colors={["#0f172a", "#111827", "#0b1220"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <LinearGradient
        colors={["#8b5cf688", "#ec489980", "transparent"]}
        style={styles.blobA}
      />
      <LinearGradient
        colors={["#22d3ee66", "transparent"]}
        style={styles.blobB}
      />

      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Join us in seconds. It’s fast and free.
        </Text>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            onChangeText={(t) => setValue("name", t, { shouldValidate: true })}
            placeholder="John Doe"
            style={[
              styles.input,
              values.name && values.name.length < 2 && styles.inputError,
            ]}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={values.name}
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
            placeholder="you@example.com"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={[
              styles.input,
              values.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) &&
                styles.inputError,
            ]}
            placeholderTextColor="#9CA3AF"
            value={values.email}
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              onChangeText={(t) =>
                setValue("password", t, { shouldValidate: true })
              }
              placeholder="••••••••"
              secureTextEntry={!showPwd}
              autoCapitalize="none"
              style={[
                styles.input,
                styles.inputWithIcon,
                values.password &&
                  values.password.length < 8 &&
                  styles.inputError,
              ]}
              placeholderTextColor="#9CA3AF"
              value={values.password}
            />
            <TouchableOpacity
              onPress={() => setShowPwd((s) => !s)}
              style={styles.eyeInside}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPwd ? "eye-off" : "eye"}
                size={22}
                color="#E5E7EB"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              onChangeText={(t) =>
                setValue("confirmPassword", t, { shouldValidate: true })
              }
              placeholder="Repeat password"
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              style={[
                styles.input,
                styles.inputWithIcon,
                values.confirmPassword &&
                  values.confirmPassword !== values.password &&
                  styles.inputError,
              ]}
              placeholderTextColor="#9CA3AF"
              value={values.confirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((s) => !s)}
              style={styles.eyeInside}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirm ? "eye-off" : "eye"}
                size={22}
                color="#E5E7EB"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Display errors if any */}
        {serverError && <Text style={styles.error}>{serverError}</Text>}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.cta, loading && styles.ctaDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#22C55E", "#16A34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaInner}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaText}>Create account</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          style={styles.linkWrap}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const GLASS_BG = "rgba(255,255,255,0.08)";
const GLASS_BORDER = "rgba(255,255,255,0.18)";

const styles = StyleSheet.create({
  bg: { flex: 1, alignItems: "center", justifyContent: "center" },
  blobA: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 200,
    top: -40,
    right: -60,
    opacity: 0.8,
  },
  blobB: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 200,
    bottom: -30,
    left: -50,
    opacity: 0.7,
  },
  card: {
    width: "90%",
    maxWidth: 460,
    padding: 24,
    borderRadius: 20,
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
    },
    android: { elevation: 12 },
    default: {},
  }),
  title: { fontSize: 28, fontWeight: "800", color: "#F9FAFB" },
  subtitle: { fontSize: 14, color: "#D1D5DB", marginTop: 6, marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, color: "#E5E7EB", marginBottom: 6, opacity: 0.9 },
  inputWrap: { position: "relative", justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "rgba(17,24,39,0.4)",
    color: "#F3F4F6",
  },
  inputWithIcon: { paddingRight: 42 },
  eyeInside: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  inputError: {
    borderColor: "#FCA5A5",
    backgroundColor: "rgba(239,68,68,0.08)",
  },
  error: { marginTop: 6, color: "#FCA5A5", fontSize: 12 },

  cta: { marginTop: 6, borderRadius: 14, overflow: "hidden" },
  ctaInner: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  linkWrap: { alignItems: "center", marginTop: 16 },
  linkText: { color: "#93C5FD", fontSize: 14, fontWeight: "700" },
});
