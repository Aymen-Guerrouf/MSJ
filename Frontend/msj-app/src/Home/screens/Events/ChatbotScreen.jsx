// screens/Events/ChatbotScreen.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_ENDPOINTS, getAuthHeaders } from "../../../config/api";

const TEAL = "rgba(107,174,151,1)";
const MINT = "rgba(150,214,195,1)";
const SLATE = "#1F2F3A";
const LIGHT_GRAY = "#F9FAFB";

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: trimmedText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.CHATBOT.CHAT, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: `bot-${Date.now()}`,
        text: data.response || "I'm not sure how to respond to that.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const renderMessage = useCallback(
    (message) => (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        {message.isBot && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={16} color={TEAL} />
          </View>
        )}
        <View
          style={[
            styles.messageContent,
            message.isBot
              ? styles.botMessageContent
              : styles.userMessageContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isBot ? styles.botMessageText : styles.userMessageText,
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              message.isBot ? styles.botMessageTime : styles.userMessageTime,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    ),
    [formatTime]
  );

  // Header height to offset if needed; you can tune this if content overlaps.
  const headerTop = Platform.OS === "ios" ? 50 : 40;
  const headerBottom = 20;
  const headerVertical = headerTop + headerBottom;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header: centered title+icon with back aligned to the same baseline */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[MINT, TEAL]}
        style={[styles.header, { paddingTop: headerTop }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerSide}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="sparkles" size={20} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>

          {/* Empty right side to keep center truly centered */}
          <View style={styles.headerSide} />
        </View>
      </LinearGradient>

      {/* Content: messages + input stacked; no absolute positioning */}
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingTop: 16, paddingBottom: 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(renderMessage)}

          {isLoading && (
            <View style={[styles.messageBubble, styles.botBubble]}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={16} color={TEAL} />
              </View>
              <View
                style={[
                  styles.messageContent,
                  styles.botMessageContent,
                  styles.loadingContent,
                ]}
              >
                <ActivityIndicator size="small" color={TEAL} />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom:
                Platform.OS === "ios" ? Math.max(12, insets.bottom) : 12,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={styles.sendButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={
                !inputText.trim() || isLoading
                  ? ["#D1D5DB", "#D1D5DB"]
                  : [MINT, TEAL]
              }
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },

  // Header layout: symmetric row to keep center true center
  header: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSide: {
    width: 48, // match aiIconContainer width so center stays centered
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    paddingBottom: 115, // Account for tab bar height
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },
  messagesContent: {
    paddingHorizontal: 16,
  },
  messageBubble: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  botBubble: {
    justifyContent: "flex-start",
  },
  userBubble: {
    justifyContent: "flex-end",
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 2,
    borderColor: TEAL,
  },
  messageContent: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 12,
  },
  botMessageContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userMessageContent: {
    backgroundColor: TEAL,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  botMessageText: {
    color: SLATE,
  },
  userMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: 10,
    fontWeight: "500",
  },
  botMessageTime: {
    color: "#9CA3AF",
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: SLATE,
    fontStyle: "italic",
  },

  // Input row (not absolute)
  inputContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: SLATE,
    maxHeight: 100,
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: TEAL,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
