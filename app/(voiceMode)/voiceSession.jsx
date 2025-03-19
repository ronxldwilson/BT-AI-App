import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

const VoiceRecordingSession = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [sound, setSound] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Animation values
  const waveScale1 = useRef(new Animated.Value(1)).current;
  const waveScale2 = useRef(new Animated.Value(1)).current;
  const waveScale3 = useRef(new Animated.Value(1)).current;
  const waveScale4 = useRef(new Animated.Value(1)).current;
  const micAnimation = useRef(new Animated.Value(1)).current;

  // Request audio permissions and initialize recording
  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting permissions...");
        const { status } = await Audio.requestPermissionsAsync();
        setPermissionStatus(status);
        
        console.log("Permission status:", status);
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Permission to access microphone was denied');
          console.error('Permission to access audio was denied');
        } else {
          console.log("Permission granted, configuring audio...");
          await configureAudio();
          console.log("Starting recording...");
          await startRecording();
        }
      } catch (error) {
        console.error('Error during permission or setup:', error);
        Alert.alert('Setup Error', 'Error initializing audio: ' + error.message);
      }
    })();

    return () => {
      if (recordingInstance) {
        console.log("Cleaning up recording on unmount");
        stopRecording();
      }
      if (sound) {
        console.log("Unloading sound on unmount");
        sound.unloadAsync();
      }
    };
  }, []);

  const configureAudio = async () => {
    console.log("Setting audio mode...");
    try {
      // Fix for interruptionModeIOS error
      const audioConfig = {
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      };
      
      // Add platform-specific options correctly
      if (Platform.OS === 'ios') {
        audioConfig.interruptionModeIOS = Audio.InterruptionModeIOS.DoNotMix;
      } else {
        audioConfig.interruptionModeAndroid = Audio.InterruptionModeAndroid.DoNotMix;
      }
      
      await Audio.setAudioModeAsync(audioConfig);
      console.log("Audio mode set successfully");
    } catch (error) {
      console.error("Error setting audio mode:", error);
      throw error;
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval;
    
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      console.log("Time's up, stopping recording");
      stopRecording();
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  // Auto-play after recording completes
  useEffect(() => {
    if (recordingComplete && sound) {
      console.log("Recording complete, playing back");
      playRecording();
    }
  }, [recordingComplete, sound]);

  // Animate waves when recording
  useEffect(() => {
    if (isRecording) {
      console.log("Starting wave animations");
      createWaveAnimation();
      createMicAnimation();
    } else {
      // Reset animations when not recording
      waveScale1.setValue(1);
      waveScale2.setValue(1);
      waveScale3.setValue(1);
      waveScale4.setValue(1);
      micAnimation.setValue(1);
    }
  }, [isRecording]);

  const createWaveAnimation = () => {
    const createWave = (waveRef, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveRef, {
            toValue: 1.2,
            duration: 1000,
            delay: delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(waveRef, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createWave(waveScale1, 0);
    createWave(waveScale2, 250);
    createWave(waveScale3, 500);
    createWave(waveScale4, 750);
  };

  const createMicAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micAnimation, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(micAnimation, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startRecording = async () => {
    console.log("startRecording called");
    try {
      console.log("Creating recording object");
      const recording = new Audio.Recording();
      
      console.log("Preparing to record");
      try {
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        console.log("Preparation successful");
      } catch (error) {
        console.error("Error preparing to record:", error);
        Alert.alert('Recording Error', 'Error preparing to record: ' + error.message);
        return;
      }
      
      console.log("Starting recording");
      await recording.startAsync();
      console.log("Recording started successfully");

      setRecordingInstance(recording);
      setIsRecording(true);
      setTimeLeft(10);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Recording Error', 'Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = async () => {
    console.log("stopRecording called, instance:", recordingInstance);
    if (!recordingInstance) return;

    try {
      console.log("Stopping recording");
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();
      console.log('Recording stopped, URI:', uri);
      
      console.log("Creating sound object");
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      console.log("Sound created successfully");
      
      setSound(newSound);
      setIsRecording(false);
      setRecordingComplete(true);

      // Reset recording instance
      setRecordingInstance(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Recording Error', 'Failed to stop recording: ' + error.message);
    }
  };

  const playRecording = async () => {
    console.log("playRecording called, sound:", sound);
    try {
      if (sound) {
        console.log("Setting position to start");
        await sound.setPositionAsync(0);
        
        console.log("Playing sound");
        await sound.playAsync();
        setIsPlaying(true);

        // Set up listener for when playback finishes
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            console.log("Playback finished");
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Failed to play recording', error);
      setIsPlaying(false);
      Alert.alert('Playback Error', 'Failed to play recording: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Session</Text>
      
      <View style={styles.circleContainer}>
        {/* Base circle */}
        <View style={[
          styles.baseCircle, 
          isRecording ? styles.recordingCircle : null
        ]}>
          {/* Wave animations */}
          <Animated.View
            style={[
              styles.waveCircle,
              { transform: [{ scale: waveScale1 }], opacity: isRecording ? 0.7 : 0 }
            ]}
          />
          <Animated.View
            style={[
              styles.waveCircle,
              { transform: [{ scale: waveScale2 }], opacity: isRecording ? 0.6 : 0 }
            ]}
          />
          <Animated.View
            style={[
              styles.waveCircle,
              { transform: [{ scale: waveScale3 }], opacity: isRecording ? 0.5 : 0 }
            ]}
          />
          <Animated.View
            style={[
              styles.waveCircle,
              { transform: [{ scale: waveScale4 }], opacity: isRecording ? 0.4 : 0 }
            ]}
          />
          
          {/* Icon in the center */}
          <View style={styles.iconContainer}>
            {isRecording ? (
              <Animated.View style={{ transform: [{ scale: micAnimation }] }}>
                <MaterialIcons name="mic" size={48} color="#ff0000" />
              </Animated.View>
            ) : isPlaying ? (
              <MaterialIcons name="pause" size={48} color="#4287f5" />
            ) : (
              <MaterialIcons name="play-arrow" size={48} color="#4CAF50" />
            )}
          </View>
        </View>
      </View>
      
      {/* Timer */}
      {isRecording && (
        <Text style={styles.timerText}>
          Recording: {timeLeft} seconds left
        </Text>
      )}
      
      {/* Status message */}
      <Text style={styles.statusText}>
        {permissionStatus === null 
          ? "Requesting microphone access..."
          : permissionStatus !== 'granted'
          ? "Microphone access denied"
          : isRecording
          ? "I'm listening to you..."
          : recordingComplete
          ? isPlaying
            ? "Playing your recording..."
            : "Recording complete!"
          : "Preparing to record..."}
      </Text>
      
      {/* Debug info - remove in production */}
      <Text style={styles.debugText}>
        Permission: {permissionStatus || 'requesting'}{'\n'}
        Recording: {isRecording ? 'yes' : 'no'}{'\n'}
        Complete: {recordingComplete ? 'yes' : 'no'}{'\n'}
        Playing: {isPlaying ? 'yes' : 'no'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  baseCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingCircle: {
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  waveCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 24,
  },
  debugText: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  }
});

export default VoiceRecordingSession;