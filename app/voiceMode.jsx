import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet } from "react-native";

export default function voiceMode() {
    return (<>
        <SafeAreaView style={styles.safeContainer}>
            <View >
                <Text>
                    Hello World
                </Text>
            </View>
        </SafeAreaView>
    </>)
}

const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor:"white",
    },
})