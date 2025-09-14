import { Board } from "@/lib/components/game/board/board";
import { ControlButton } from "@/lib/components/game/control-button";
import { UndoControl } from "@/lib/components/game/controls/undo";
import { CursorModeToggle } from "@/lib/components/game/cursor-mode-toggle";
import { NumberPad } from "@/lib/components/game/number-pad/number-pad";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { Host, HStack } from "@expo/ui/swift-ui";
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
        <SafeAreaView style={styles.page}>
            {/*<Header /> */}

            <Board />

            <Host>
                <HStack>
                    <UndoControl />
                </HStack>
            </Host>

            {/*<View style={{ flexShrink: 1 }}>*/}
            <View style={styles.controlsRow}>
                {/*<ControlButton
                    iconProps={{
                        type: "material",
                        name: "undo-variant",
                    }}
                    onPress={handleUndo}
                />
                <ControlButton
                    iconProps={{
                        type: "material",
                        name: "redo-variant",
                    }}
                    onPress={handleRedo}
                />

                <ControlButton
                    iconProps={{
                        type: "material",
                        name: "lightbulb",
                    }}
                    onPress={handleHint}
                />



                <ControlButton
                    iconProps={{
                        type: "material",
                        name: "eraser",
                    }}
                    onPress={handleEraser}
                />*/}
            </View>

            <View style={styles.controlsContainer}>
                <NumberPad />
                <CursorModeToggle />
            </View>

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
    page: {
        flex: 1,
        flexDirection: "column",
        padding: 12,
        backgroundColor: "#000",
        gap: 24,
    },

    controlsContainer: {
        flexShrink: 0,
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
        flexShrink: 1,
        alignSelf: "center",
    },
});

export default GameScreen;
