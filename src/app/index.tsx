import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CursorModeToggle } from "@/lib/components/game/cursor-mode-toggle";
import { Board } from "@/lib/components/game/board/board";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Board/>

            <View style={styles.controls}>
                <NumberPad/>

                <CursorModeToggle/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#000000'
    },
    controls: {
        flexDirection: 'column',
        gap: 8
    }
})

export default HomeScreen;