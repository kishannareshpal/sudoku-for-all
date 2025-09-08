import { Board } from "@/lib/components/game/board/board";
import { ControlButton } from "@/lib/components/game/control-button";
import { CursorModeToggle } from "@/lib/components/game/cursor-mode-toggle";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GameScreen = () => {
    const handleUndo = () => {};

    const handleRedo = () => {};

    const handleHint = () => {};

    const handleEraser = () => {
        CellHelper.eraseAtCursor();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/*<Header /> */}

            <Board />

            {/*<View style={{ flexShrink: 1 }}>*/}
            {/*    <View style={styles.controlsRow}>*/}
            {/*        /!* <ControlButton*/}
            {/*            iconProps={{*/}
            {/*                type: 'material',*/}
            {/*                name: 'undo-variant'*/}
            {/*            }}*/}
            {/*            onPress={handleUndo}*/}
            {/*        />*/}

            {/*        <ControlButton*/}
            {/*            iconProps={{*/}
            {/*                type: 'material',*/}
            {/*                name: 'redo-variant'*/}
            {/*            }}*/}
            {/*            onPress={handleRedo}*/}
            {/*        />*/}

            {/*        <ControlButton*/}
            {/*            iconProps={{*/}
            {/*                type: 'material',*/}
            {/*                name: 'lightbulb'*/}
            {/*            }}*/}
            {/*            onPress={handleHint}*/}
            {/*        /> *!/*/}

            {/*        <ControlButton*/}
            {/*            iconProps={{*/}
            {/*                type: 'material',*/}
            {/*                name: 'eraser'*/}
            {/*            }}*/}
            {/*            onPress={handleEraser}*/}
            {/*        />*/}
            {/*    </View>*/}

            <NumberPad />

            <CursorModeToggle />
            {/*</View>*/}
        </SafeAreaView>
    );
};

// const GameBoard = () => {
//     const puzzle = useGameplayStore((store) => store.puzzle);
//
//     if (!puzzle) {
//         return null;
//     }
//
//     return (
//         <Board />
//
//         // <FiberProvider>
//         //     {/* <BoardProvider fontManager={fontManager} fonts={{ number: fonts[0], note: fonts[1] }}> */}
//         //         {/* <rrrPausedGameOverlay /> */}
//         //     {/* </BoardProvider> */}
//         // </FiberProvider>
//     )
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#06190B",
        gap: 24,
    },

    controlsContainer: {
        flexDirection: "column",
        gap: 8,
    },

    controlsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },

    boardContainer: {
        flex: 1,
        alignSelf: "center",
    },
});

export default GameScreen;
