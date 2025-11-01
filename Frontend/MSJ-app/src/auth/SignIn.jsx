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

  const emailInvalid =
    values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const passwordInvalid = values.password && values.password.length < 8;
  const canSubmit =
    !!values.email && !!values.password && !emailInvalid && !passwordInvalid;

  const onSubmit = async (form) => {
    if (!canSubmit) return;
    setServerError(null);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        let msg = "Invalid credentials";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }

      let coords = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
        }
      } catch {}

      navigation.replace("HomeTab", { userCoords: coords });
    } catch (err) {
      setServerError(err?.message || "Sign in failed");
    }
  };

  return (
    <View style={styles.screen}>
      {/* Mint bar */}
      <View style={styles.mintBar} />

      {/* Headings */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please enter your account here</Text>

      {/* Email */}
      <View style={styles.row}>
        <View style={styles.leadingIcon}>
          <Ionicons name="mail-outline" size={18} color="#244355" />
        </View>
        <TextInput
          {...register("email")}
          onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
          placeholder="Email or phone number"
          placeholderTextColor="#6D8B99"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={values.email}
          style={[styles.input, emailInvalid && styles.inputError]}
        />
      </View>
      {emailInvalid ? (
        <Text style={styles.error}>Enter a valid email</Text>
      ) : null}

      {/* Password */}
      <View style={styles.row}>
        <View style={styles.leadingIcon}>
          <Ionicons name="lock-closed-outline" size={18} color="#244355" />
        </View>
        <TextInput
          {...register("password")}
          onChangeText={(t) =>
            setValue("password", t, { shouldValidate: true })
          }
          placeholder="Password"
          placeholderTextColor="#6D8B99"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={values.password}
          style={[
            styles.input,
            styles.inputWithTrailing,
            passwordInvalid && styles.inputError,
          ]}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((s) => !s)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.trailingIcon}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#244355"
          />
        </TouchableOpacity>
      </View>
      {passwordInvalid ? (
        <Text style={styles.error}>At least 8 characters</Text>
      ) : null}

      {/* Forgot password */}
      <View style={styles.rightLinkWrap}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.rightLink}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      {/* CTA */}
      <TouchableOpacity
        style={[styles.cta, (!canSubmit || isSubmitting) && styles.ctaDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={!canSubmit || isSubmitting}
        activeOpacity={0.9}
      >
        <LinearGradient
          // Exact gradient requested: 237deg from mint to teal
          start={{ x: 0.15, y: 1 }}
          end={{ x: 0.95, y: 0.1 }}
          colors={["rgba(150,214,195,1)", "rgba(107,174,151,1)"]}
          style={styles.ctaInner}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Log In</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.footerMuted}>Don’t have any account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 80,
    paddingHorizontal: 22,
  },
  mintBar: {
    alignSelf: "center",
    width: 70,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#99D6BE",
    opacity: 0.9,
    marginBottom: 80,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.48,
    color: "#2E3E5C",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#8189B0",
    marginTop: 8,
    marginBottom: 40,
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
    marginBottom: 14,
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
  input: {
    flex: 1,
    color: TEXT_DARK,
    fontSize: 15,
  },
  inputWithTrailing: { paddingRight: 8 },
  trailingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  inputError: {
    // subtle red outline while preserving the soft fill
    borderWidth: 0,
  },
  error: {
    color: "#CC4B4B",
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 6,
  },

  rightLinkWrap: { alignItems: "flex-end", marginTop: 8, marginBottom: 28 },
  rightLink: { color: "#2D8A64", fontSize: 13, fontWeight: "700" },

  cta: {
    marginTop: 0,
    borderRadius: 16,
    overflow: "hidden",
  },
  ctaInner: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
  },
  footerMuted: { color: "#3C5568", fontSize: 14 },
  footerLink: { color: "#2D8A64", fontSize: 14, fontWeight: "700" },

  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 2 },
    default: {},
  }),
});
