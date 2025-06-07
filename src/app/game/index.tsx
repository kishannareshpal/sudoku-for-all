import { Board } from "@/lib/components/game/board/board";
import { ControlButton } from "@/lib/components/game/control-button";
import { CursorModeToggle } from "@/lib/components/game/cursor-mode-toggle";
import { Header } from "@/lib/components/game/header";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay-store";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GameScreen = () => {
    const puzzle = useGameplayStore((store) => store.puzzle);

    if (!puzzle) {
        return null;
    }

    const handleUndo = () => {

    }

    const handleRedo = () => {

    }

    const handleHint = () => {

    }

    const handleEraser = () => {
        const { cursorGridPosition, erasePlayerValueAt } = gameplayStoreState();
        erasePlayerValueAt(cursorGridPosition);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <Board puzzle={puzzle}/>

            <View style={styles.controlsContainer}>
                <View style={styles.controlsRow}>
                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'undo-variant'
                        }}
                        onPress={handleUndo}
                    />

                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'redo-variant'
                        }}
                        onPress={handleRedo}
                    />

                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'lightbulb'
                        }}
                        onPress={handleHint}
                    />

                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'eraser'
                        }}
                        onPress={handleEraser}
                    />

                </View>

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
        backgroundColor: '#000000',
        gap: 24
    },

    controlsContainer: {
        flexDirection: 'column',
        gap: 8
    },

    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12
    }
})

export default GameScreen;
