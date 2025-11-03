// src/auth/signup/VerifyCode.jsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../../config/api";

export default function VerifyCode() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || "";

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const setAt = (idx, v) => {
    const n = v.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[idx] = n;
    setDigits(next);
    if (n && idx < 3) refs[idx + 1].current?.focus();
  };

  const code = digits.join("");
  const canSubmit = code.length === 4;

  const submitCode = async () => {
    if (!canSubmit) return;
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Invalid code");
      }

      const data = await res.json();

      // Store the token after successful verification
      if (data.success && data.data?.token) {
        await AsyncStorage.setItem("access_token", data.data.token);

        // Optionally store user data
        if (data.data.user) {
          await AsyncStorage.setItem(
            "user_data",
            JSON.stringify(data.data.user)
          );
        }
      }

      // Navigate to interest selection screen
      navigation.replace("InterestSelection");
    } catch (err) {
      setServerError(err?.message || "Unable to verify code");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setServerError(null);
    try {
      await fetch(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
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

      <Text style={styles.title}>Enter Verification{"\n"}Code</Text>
      <Text style={styles.subtitle}>
        Enter code that we have sent to your email{"\n"}
        {maskEmail(email)}
      </Text>

      <View style={styles.codeRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={refs[i]}
            value={d}
            onChangeText={(v) => setAt(i, v)}
            keyboardType="number-pad"
            returnKeyType="next"
            maxLength={1}
            style={[styles.codeBox, d ? styles.codeFilled : null]}
          />
        ))}
      </View>

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <TouchableOpacity
        style={[styles.cta, (!canSubmit || loading) && styles.ctaDisabled]}
        onPress={submitCode}
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

      <TouchableOpacity onPress={resend} style={{ marginTop: 16 }}>
        <Text style={styles.resend}>Resend code</Text>
      </TouchableOpacity>
    </View>
  );
}

const maskEmail = (e) => {
  if (!e) return "your...@domain.com";
  const [name, domain] = e.split("@");
  if (!domain) return e;
  const shown = name.slice(0, 3);
  return `${shown}...@${domain}`;
};

const PALE_GREEN = "rgba(230, 247, 238, 1)";
const PALE_GREEN_BORDER = "rgba(151, 203, 177, 0.45)";

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
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 13,
    color: "#93A3B3",
    marginBottom: 32,
  },
  codeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  codeBox: {
    width: 50,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALE_GREEN_BORDER,
    backgroundColor: PALE_GREEN,
    textAlign: "center",
    fontSize: 22,
    color: "#1E3A3A",
  },
  codeFilled: {
    borderColor: "#6BAE97",
  },
  error: { color: "#CC4B4B", fontSize: 12, marginTop: 6, marginBottom: 8 },

  cta: { marginTop: 16, borderRadius: 16, overflow: "hidden" },
  ctaInner: { height: 50, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.7 },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  resend: {
    color: "#2D8A64",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
