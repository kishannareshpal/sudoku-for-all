import { Board } from "@/lib/components/game/board/board";
import { BoardWrapper } from "@/lib/components/game/board/board-wrapper";
import { EntryModeToggle } from "@/lib/components/game/entry-mode-toggle";
import { Header } from "@/lib/components/game/header";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";
import { gameplayStoreState } from "@/lib/store/gameplay";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

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
        <>
            <Stack.Screen options={{ header: () => <Header /> }} />

            <View className="flex-1 bg-white p-3">
                <View className="flex-1">
                    <BoardWrapper>
                        <Board />
                    </BoardWrapper>
                </View>

                <View className="flex-1 items-center justify-center gap-2">
                    <NumberPad />
                    <EntryModeToggle />
                </View>

                {/* <View style={styles.controlsContainer}>
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

                <CursorModeToggle /> */}
                {/* </View> */}
            </View>
        </>
    );
}

// const GameBoard = () => {
//     const puzzle = useGameplayStore((store) => store.puzzle);

//     if (!puzzle) {
//         return null;
//     }

//     return (
//         <View style={styles.boardContainer}>
//             {/* <PausedGameOverlay /> */}
//         </View>
//     )
// }

const styles = StyleSheet.create({
    container: {

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
