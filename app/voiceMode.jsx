import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";


export default function VoiceMode() {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voice Mode</Text>
            <Text style={styles.instructions}>Follow these instructions to use Voice Mode:</Text>
            <View style={styles.list}>
                <Text style={styles.listItem}>• Ensure your microphone is enabled.</Text>
                <Text style={styles.listItem}>• Speak clearly for the best response.</Text>
                <Text style={styles.listItem}>• You can stop or pause anytime.</Text>
                <Text style={styles.listItem}>• Tap "Start Session" to begin.</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {
                console.log("Starting voice session...")
                router.push("./voiceSession")
            }}>
                <Text style={styles.buttonText}>Start Session</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginBottom: 15,
    },
    list: {
        alignSelf: "flex-start",
        marginLeft: 20,
        marginBottom: 20,
    },
    listItem: {
        fontSize: 14,
        color: "#444",
        marginBottom: 5,
    },
    button: {
        width: "60%",  // Ensure all buttons have the same width
        height: "15%",  // Ensure all buttons have the same width
        backgroundColor: "black",
        paddingVertical: 15,
        overflow: "hidden",
        borderRadius: 41,
        alignItems: "center",
        marginVertical: 10,
        elevation: 10,  // Adds shadow for Android
        shadowColor: "#000",  // Adds shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        justifyContent: "center",
      },
      buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
      },
});