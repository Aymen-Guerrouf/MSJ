// src/auth/signup/SignUp.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../../config/api";

export default function SignUp() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const emailInvalid = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordInvalid = password && password.length < 6;
  const confirmInvalid = confirmPassword && confirmPassword !== password;
  const ageInvalid =
    age && (isNaN(age) || parseInt(age) < 1 || parseInt(age) > 120);

  const canSubmit =
    !!fullName &&
    !!age &&
    !!email &&
    !!password &&
    !!confirmPassword &&
    !emailInvalid &&
    !passwordInvalid &&
    !confirmInvalid &&
    !ageInvalid;

  const handleSignUp = async () => {
    if (!canSubmit || loading) return;
    setServerError(null);
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email,
          password,
          age: parseInt(age),
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const msg = data?.message || "Registration failed";
        throw new Error(msg);
      }

      // Navigate to verify code screen
      navigation.navigate("VerifyCode", { email });
    } catch (err) {
      setServerError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
      >
        {/* Headings */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill in the form to continue</Text>

        {/* Full Name */}
        <View style={styles.row}>
          <View style={styles.leadingIcon}>
            <Ionicons name="person-outline" size={18} color="#244355" />
          </View>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#6D8B99"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
        </View>

        {/* Age */}
        <View style={styles.row}>
          <View style={styles.leadingIcon}>
            <Ionicons name="calendar-outline" size={18} color="#244355" />
          </View>
          <TextInput
            placeholder="Age"
            placeholderTextColor="#6D8B99"
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
            style={[styles.input, ageInvalid && styles.inputError]}
          />
        </View>
        {ageInvalid ? (
          <Text style={styles.error}>Enter a valid age (1-120)</Text>
        ) : null}

        {/* Email */}
        <View style={styles.row}>
          <View style={styles.leadingIcon}>
            <Ionicons name="mail-outline" size={18} color="#244355" />
          </View>
          <TextInput
            placeholder="Email"
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

        {/* Password */}
        <View style={styles.row}>
          <View style={styles.leadingIcon}>
            <Ionicons name="lock-closed-outline" size={18} color="#244355" />
          </View>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#6D8B99"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
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
          <Text style={styles.error}>At least 6 characters</Text>
        ) : null}

        {/* Confirm Password */}
        <View style={styles.row}>
          <View style={styles.leadingIcon}>
            <Ionicons name="lock-closed-outline" size={18} color="#244355" />
          </View>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#6D8B99"
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[
              styles.input,
              styles.inputWithTrailing,
              confirmInvalid && styles.inputError,
            ]}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((s) => !s)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.trailingIcon}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showConfirm ? "eye-off" : "eye"}
              size={20}
              color="#244355"
            />
          </TouchableOpacity>
        </View>
        {confirmInvalid ? (
          <Text style={styles.error}>Passwords do not match</Text>
        ) : null}

        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, (!canSubmit || loading) && styles.ctaDisabled]}
          onPress={handleSignUp}
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
              <Text style={styles.ctaText}>Sign Up</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerMuted}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const PALE_GREEN_BORDER = "rgba(151, 203, 177, 0.45)";

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "800",
    color: "#263B4D",
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "#93A3B3",
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALE_GREEN_BORDER,
    backgroundColor: PALE_GREEN,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E3A3A",
    height: "100%",
  },
  inputWithTrailing: {
    paddingRight: 36,
  },
  trailingIcon: {
    position: "absolute",
    right: 14,
  },
  inputError: {
    borderColor: "#CC4B4B",
  },
  error: {
    color: "#CC4B4B",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  cta: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  ctaInner: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerMuted: {
    color: "#93A3B3",
    fontSize: 14,
  },
  footerLink: {
    color: "#6BAE97",
    fontSize: 14,
    fontWeight: "700",
  },
});
