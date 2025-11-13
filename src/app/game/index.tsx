import { BoardWrapper } from "@/lib/components/game/board/board-wrapper";
import { Header } from "@/lib/components/game/header";
import { gameplayStoreState } from "@/lib/store/gameplay-store";
import { StyleSheet } from "react-native";
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

            <BoardWrapper>
                {/* <Board /> */}
            </BoardWrapper>

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
        </SafeAreaView >
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
        flex: 1,
        padding: 12,
        backgroundColor: '#191509',
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
