// src/auth/signin/components/SignIn.jsx
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
import * as Location from "expo-location";
import { API_ENDPOINTS } from "../config/api";
export default function SignIn() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const values = watch();

  // Simple client-side checks
  const emailInvalid =
    values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const passwordInvalid = values.password && values.password.length < 8;
  const canSubmit =
    !!values.email && !!values.password && !emailInvalid && !passwordInvalid;

  const onSubmit = async (form) => {
    if (!canSubmit) return;
    setServerError(null);

    try {
      // 1) Login
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      }); // Networking API [web:276]

      if (!res.ok) {
        let msg = "Invalid credentials";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }

      // 2) Ask for location and get current position
      let coords = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync(); // [web:455]
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }); // [web:455]
          coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
        }
      } catch {
        // ignore location errors; proceed without coords
      }

      // 3) Navigate to Home, pass coords (could be null)
      navigation.replace("Home", { userCoords: coords });
    } catch (err) {
      setServerError(err?.message || "Sign in failed");
    }
  };

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
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>
          Welcome back. Enter your details to continue.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            {...register("email")}
            onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
            placeholder="you@example.com"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={[styles.input, emailInvalid && styles.inputError]}
            placeholderTextColor="#9CA3AF"
            value={values.email}
          />
          {emailInvalid ? (
            <Text style={styles.error}>Enter a valid email</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              {...register("password")}
              onChangeText={(t) =>
                setValue("password", t, { shouldValidate: true })
              }
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={[
                styles.input,
                styles.inputWithIcon,
                passwordInvalid && styles.inputError,
              ]}
              placeholderTextColor="#9CA3AF"
              value={values.password}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              style={styles.eyeInside}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#E5E7EB"
              />
            </TouchableOpacity>
          </View>
          {passwordInvalid ? (
            <Text style={styles.error}>At least 8 characters</Text>
          ) : null}
        </View>

        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

        <TouchableOpacity
          style={[
            styles.cta,
            (!canSubmit || isSubmitting) && styles.ctaDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!canSubmit || isSubmitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaInner}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.linkWrap}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>No account? Create one</Text>
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
    maxWidth: 420,
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
  inputWrap: { position: "relative", justifyContent: "center" },
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
