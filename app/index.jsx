import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";

export default function App() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { router.push("/voiceMode") }} style={styles.button}>
          <Text style={styles.buttonText}>Voice Only Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { router.push("/voiceMode") }} style={styles.button}>
          <Text style={styles.buttonText}>Video Avatar Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { router.push("/voiceMode") }} style={styles.button}>
          <Text style={styles.buttonText}>Previous Sessions</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { router.push("/voiceMode") }} style={styles.button}>
          <Text style={styles.buttonText}>Lessons</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    width: "80%",  // Ensure all buttons have the same width
    height: "15%",  // Ensure all buttons have the same width
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 41,
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,  // Adds shadow for Android
    // shadowColor: "#000",  // Adds shadow for iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
