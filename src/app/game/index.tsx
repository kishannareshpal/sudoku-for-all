import { Board } from "@/lib/components/game/board/board";
import { ControlButton } from "@/lib/components/game/control-button";
import { CursorModeToggle } from "@/lib/components/game/cursor-mode-toggle";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay-store";
import { FiberProvider } from "its-fine";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* <Header /> */}
            <GameBoard />

            <View style={styles.controlsContainer}>
                <View style={styles.controlsRow}>
                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'undo-variant'
                        }}
                        onPress={() => {
                            const state = gameplayStoreState();
                            state.setSomeValue(state.somevalue - 1);
                        }}
                    />

                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'redo-variant'
                        }}
                        onPress={() => {
                            const state = gameplayStoreState();
                            state.setSomeValue(state.somevalue + 1);
                        }}
                        // onPress={handleRedo}
                    />

                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'lightbulb'
                        }}
                        // onPress={handleHint}
                    />

                    <ControlButton
                        iconProps={{
                            type: 'material',
                            name: 'eraser'
                        }}
                        // onPress={handleEraser}
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
        <FiberProvider>
            {/* <BoardProvider fontManager={fontManager} fonts={{ number: fonts[0], note: fonts[1] }}> */}
            <Board>
                {/* <PausedGameOverlay /> */}
            </Board>
            {/* </BoardProvider> */}
        </FiberProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: 'black',
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
        position: 'relative',
        backgroundColor: 'black'
    },
})

export default GameScreen;
