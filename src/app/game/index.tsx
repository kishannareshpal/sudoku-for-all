import { Board } from "@/lib/components/game/board/board";
import { ControlButton } from "@/lib/components/game/control-button";
import { CursorModeToggle } from "@/lib/components/game/cursor-mode-toggle";
import { Header } from "@/lib/components/game/header";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";
import { PausedGameOverlay } from "@/lib/components/game/paused-game-overlay";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay-store";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GameScreen = () => {
    const handleUndo = (): void => {

    }

    const handleRedo = (): void => {

    }

    const handleHint = (): void => {

    }

    const handleEraser = (): void => {
        const { cursorGridPosition, erasePlayerValueAt } = gameplayStoreState();
        erasePlayerValueAt(cursorGridPosition);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <GameBoard />

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

                <NumberPad />

                <CursorModeToggle />
            </View>
        </SafeAreaView>
    );
}

const GameBoard = () => {
    const puzzle = useGameplayStore((store) => store.puzzle);

    if (!puzzle) {
        return null;
    }

    return (
        <View style={styles.boardContainer}>
            <Board puzzle={puzzle}>
                <PausedGameOverlay />
            </Board>
        </View>
    )
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
    },

    boardContainer: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        position: 'relative'
    },
})

export default GameScreen;
