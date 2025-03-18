import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Voice from "@react-native-voice/voice";
import Animated, { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      scale.value = withTiming(1.5, { duration: 200, easing: Easing.ease });
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
      scale.value = withTiming(1, { duration: 200, easing: Easing.ease });
    };

    Voice.onSpeechVolumeChanged = (event) => {
      scale.value = withTiming(1 + event.value * 0.5, { duration: 100 });
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start("en-US");
    } catch (error) {
      console.error(error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>

      <Text>
        Hello
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  micButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 50,
    padding: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
});
