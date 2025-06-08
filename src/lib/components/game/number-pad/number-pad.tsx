import { NumberPadButton } from "@/lib/components/game/number-pad/number-pad-button";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { BoardNotesGridNotationValue, GridIndex } from "@/lib/shared-types";
import { gameplayStore, useGameplayStore } from "@/lib/store/gameplay-store";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import shallowequal from "shallowequal";

export const NumberPad = () => {
    const [cursorCellToggledNotes, setCursorCellToggledNotes] = useState<BoardNotesGridNotationValue>([]);

    const cursorMode = useGameplayStore((store) => store.cursorMode);

    const animatedContainerStyle = useAnimatedStyle(
        () => ({
            backgroundColor: withTiming(cursorMode === 'note' ? '#222222' : 'transparent', {
                duration: 200,
            }),
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
            equalityFn: shallowequal
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
                const selected = (cursorMode === 'note') && cursorCellToggledNotes.includes(value);

                buttonRow.push(
                    <NumberPadButton
                        key={GridPositionHelper.stringNotationOf({ row: rowIndex as GridIndex, col: colIndex as GridIndex })}
                        value={value}
                        onPress={() => onNumberPress(value)}
                        onLongPress={() => onNumberPress(value)}
                        selected={selected}
                    />
                )
            }

            buttonRows.push(
                <View
                    key={rowIndex}
                    style={styles.row}
                >
                    {buttonRow}
                </View>
            );
        }

        return buttonRows;
    }

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            {renderButtons()}
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        alignSelf: 'center',
        gap: 6,
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },

    row: {
        flexDirection: 'row',
        gap: 6
    }
})
