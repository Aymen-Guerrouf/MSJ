import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 16,
    gap: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  userRole: {
    fontSize: 14,
    color: "#6366f1",
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  instructionsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  instructionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  instructionText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
    paddingLeft: 8,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  categoryScroll: {
    marginTop: 4,
  },
  categoryChip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "capitalize",
  },
  categoryChipTextActive: {
    color: "white",
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  filePickerText: {
    flex: 1,
  },
  filePickerLabel: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  filePickerSize: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  orText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginVertical: 8,
  },
  helperButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
  },
  helperButtonText: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  uploadingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
