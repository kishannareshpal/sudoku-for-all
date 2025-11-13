import { ButtonGroup } from "@modules/sudokuforallui";
import React from "react";
import { StyleSheet } from "react-native";
import { CURSOR_MODE_OPTIONS } from "./constants";

export const CursorModeToggle = () => {
    // const cursorMode = useGameplayStore((state) => state.cursorMode);

    // const onToggle = async (mode: CursorMode) => {
    //     if (mode === cursorMode) {
    //         // No change. Do nothing
    //         return;
    //     }

    //     gameplayStoreState().updateCursorMode(mode);

    //     performDoubleHaptics();
    // };

    // const performDoubleHaptics = async () => {
    //     await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

    //     // I don't think we really need to handle the timeout cancellation in this case
    //     setTimeout(() => {
    //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    //     }, 120);
    // };

    return (
        <ButtonGroup
            style={{ flex: 1 }}
            options={CURSOR_MODE_OPTIONS}
            // onSelectionChange={() => Alert.alert("You have changed bro")}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        flex: 0,
        alignSelf: "center",
        gap: 6,
        padding: 8,
        borderRadius: 50,
        backgroundColor: "#222222",
    },
    sliderBackground: {
        flex: 1,
        pointerEvents: "box-none",
        position: "absolute",
        height: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        margin: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    option: {
        opacity: 0.9,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 50,
    },
    optionText: {
        color: "white",
        fontWeight: "bold",
    },
    optionTextSelected: {
        color: "black",
    },
});
