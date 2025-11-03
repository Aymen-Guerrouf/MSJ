import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../config/api";
import { styles } from "./SignIn.styles";

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
      // Request location permission early so user sees the prompt before sign-in completes
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

      const data = await res.json();

      // Store the token in AsyncStorage
      if (data.success && data.data?.token) {
        await AsyncStorage.setItem("access_token", data.data.token);

        // Optionally store user data
        if (data.data.user) {
          await AsyncStorage.setItem(
            "user_data",
            JSON.stringify(data.data.user)
          );
        }

        // Check user role and navigate accordingly
        const userRole = data.data.user?.role;

        if (userRole === "super_admin" || userRole === "center_admin") {
          // Navigate to Admin screen
          navigation.replace("AdminPanel");
        } else {
          // Navigate to regular user home
          navigation.replace("HomeTab", { userCoords: coords });
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      setServerError(err?.message || "Sign in failed");
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please enter your account here</Text>

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

      <View style={styles.rightLinkWrap}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.rightLink}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <TouchableOpacity
        style={[styles.cta, (!canSubmit || isSubmitting) && styles.ctaDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={!canSubmit || isSubmitting}
        activeOpacity={0.9}
      >
        <LinearGradient
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

      <View style={styles.footerRow}>
        <Text style={styles.footerMuted}>Don’t have any account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
