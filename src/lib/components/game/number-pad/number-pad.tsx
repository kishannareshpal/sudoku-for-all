import { ToggleButton } from "@/lib/components/game/number-pad/toggle-button";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { BoardNotesGridNotationValue, GridIndex } from "@/lib/shared-types";
import { gameplayStore, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import shallowEqual from "shallowequal";

export const NumberPad = () => {
    const [cursorCellToggledNotes, setCursorCellToggledNotes] = useState<BoardNotesGridNotationValue>([]);

    const cursorMode = useGameplayStore((store) => store.cursorMode);

    const animatedContainerStyle = useAnimatedStyle(
        () => ({
            backgroundColor: withSpring(cursorMode === 'note' ? '#222222' : 'transparent'),
        }),
        [cursorMode]
    );

    useStoreSubscription(
        gameplayStore,
        (store) => [store.cursorMode, store.cursorGridPosition, store.puzzle?.notes],
        () => {
            // On cursor movement...
            setCursorCellToggledNotes(CellHelper.getToggledNotesAtCursor());
        },
        {
            equalityFn: shallowEqual
        }
    );

    const onNumberPress = (value: number) => {
        if (cursorMode === 'number') {
            CellHelper.changePlayerValueAtCursorTo(value);
        } else {
            CellHelper.toggleNotesValueAtCursor([value]);
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const renderButtons = () => {
        const buttonRows = [];

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            const buttonRow = [];

            for (let colIndex = 0; colIndex < 3; colIndex++) {
                const value = (colIndex + rowIndex * 3) + 1;
                const toggled = (cursorMode === 'note') && cursorCellToggledNotes.includes(value);
                const id = `nptb-${GridPositionHelper.stringNotationOf({ row: rowIndex as GridIndex, col: colIndex as GridIndex })}`

                buttonRow.push(
                    <ToggleButton
                        key={id}
                        value={value}
                        onPress={() => onNumberPress(value)}
                        toggled={toggled}
                    />
                )
            }

            buttonRows.push(
                <View key={rowIndex} className="flex-row gap-1">
                    {buttonRow}
                </View>
            );
        }

        return buttonRows;
    }

    return (
        <Animated.View
            className="gap-1 p-3 rounded-2xl self-center justify-center items-center"
            style={animatedContainerStyle}
        >
            {renderButtons()}
        </Animated.View>
    );
};