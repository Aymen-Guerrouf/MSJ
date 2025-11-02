// src/auth/forgot/components/ResetWithCode.jsx
import React, { useRef, useState } from "react";
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

export default function ResetPassword() {
  const navigation = useNavigation();

  // 4-digit code UI
  const [digits, setDigits] = useState(["", "", "", ""]);
  const refs = Array.from({ length: 4 }, () => useRef(null));

  // new password UI
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverMsg, setServerMsg] = useState(null);

  const code = digits.join("");
  const pwdInvalid = pwd && pwd.length < 6;
  const confirmInvalid = confirm && confirm !== pwd;
  const canSubmit =
    code.length === 4 && !!pwd && !!confirm && !pwdInvalid && !confirmInvalid;

  const setAt = (idx, v) => {
    const n = v.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[idx] = n;
    setDigits(next);
    if (n && idx < 3) refs[idx + 1].current?.focus();
    if (!n && idx > 0 && !next[idx]) refs[idx - 1].current?.focus();
  };

  const submit = async () => {
    if (!canSubmit || loading) return;
    setServerError(null);
    setServerMsg(null);
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password: pwd,
          confirmPassword: confirm,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && (data?.success === true || res.status === 200)) {
        setServerMsg(
          data?.message || "Password updated successfully. Please log in."
        );
        // Short delay then go to SignIn
        setTimeout(() => navigation.replace("SignIn"), 900);
        return;
      }

      throw new Error(
        data?.message || "Invalid code or unable to reset password."
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
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.backBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={24} color="#1E2B3A" />
      </TouchableOpacity>

      <Text style={styles.title}>Create password</Text>
      <Text style={styles.subtitle}>
        Enter the 4‑digit code and your new password
      </Text>

      {/* Code row */}
      <View style={styles.codeRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={refs[i]}
            value={d}
            onChangeText={(v) => setAt(i, v)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.codeBox, d ? styles.codeFilled : null]}
          />
        ))}
      </View>

      {/* New password */}
      <View style={styles.row}>
        <View style={styles.leadingIcon}>
          <Ionicons name="lock-closed-outline" size={18} color="#244355" />
        </View>
        <TextInput
          placeholder="Enter new password"
          placeholderTextColor="#6D8B99"
          secureTextEntry={!showPwd}
          autoCapitalize="none"
          value={pwd}
          onChangeText={setPwd}
          style={[
            styles.input,
            styles.inputWithTrailing,
            pwdInvalid && styles.inputError,
          ]}
        />
        <TouchableOpacity
          onPress={() => setShowPwd((s) => !s)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.trailingIcon}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPwd ? "eye-off" : "eye"}
            size={20}
            color="#244355"
          />
        </TouchableOpacity>
      </View>
      {pwdInvalid ? (
        <Text style={styles.error}>At least 6 characters</Text>
      ) : null}

      {/* Confirm password */}
      <View style={styles.row}>
        <View style={styles.leadingIcon}>
          <Ionicons name="lock-closed-outline" size={18} color="#244355" />
        </View>
        <TextInput
          placeholder="Confirm new password"
          placeholderTextColor="#6D8B99"
          secureTextEntry={!showConfirm}
          autoCapitalize="none"
          value={confirm}
          onChangeText={setConfirm}
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
      {serverMsg ? <Text style={styles.success}>{serverMsg}</Text> : null}

      <TouchableOpacity
        style={[styles.cta, (!canSubmit || loading) && styles.ctaDisabled]}
        onPress={submit}
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
  title: { fontSize: 28, fontWeight: "800", color: "#263B4D" },
  subtitle: { marginTop: 10, fontSize: 13, color: "#93A3B3", marginBottom: 32 },

  codeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 40,
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
    fontSize: 20,
    color: "#1E3A3A",
  },
  codeFilled: { borderColor: "#6BAE97" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PALE_GREEN,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALE_GREEN_BORDER,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 12,
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
  inputError: {},
  error: { color: "#CC4B4B", fontSize: 12, marginBottom: 8, paddingLeft: 6 },
  success: { color: "#2D8A64", fontSize: 13, marginBottom: 8, paddingLeft: 6 },

  cta: { marginTop: 20, borderRadius: 16, overflow: "hidden" },
  ctaInner: { height: 50, alignItems: "center", justifyContent: "center" },
  ctaDisabled: { opacity: 0.7 },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
