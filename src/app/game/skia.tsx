import { Board } from "@/lib/components/game/board/board";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { FiberProvider } from "its-fine";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* <Header /> */}
            <GameBoard />
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
            <Board puzzle={puzzle}>
                {/* <PausedGameOverlay /> */}
            </Board>
        </FiberProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        // backgroundColor: '#191509',
        backgroundColor: 'grey',
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
