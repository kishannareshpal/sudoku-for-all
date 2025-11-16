import { ToggleButton } from "@/lib/components/game/number-pad/toggle-button";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { BoardNotesGridNotationValue, GridIndex } from "@/lib/shared-types";
import { gameplayStore, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import shallowEqual from "shallowequal";

export const NUMBER_ENTRY_MODE_BACKDROP_COLOR = 'transparent';
export const NOTES_ENTRY_MODE_BACKDROP_COLOR = '#222222';

export const NumberPad = () => {
    const [cursorCellToggledNotes, setCursorCellToggledNotes] = useState<BoardNotesGridNotationValue>([]);
    const entryMode = useGameplayStore((store) => store.entryMode);

    const backdropColor = useSharedValue(0);
    const animatedBackdropStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                backdropColor.value,
                [0, 1],
                [NUMBER_ENTRY_MODE_BACKDROP_COLOR, NOTES_ENTRY_MODE_BACKDROP_COLOR]
            )
        };
    });

    useStoreSubscription(
        gameplayStore,
        (store) => [store.entryMode, store.cursorGridPosition, store.puzzle?.notes],
        () => {
            // On cursor movement...
            setCursorCellToggledNotes(CellHelper.getToggledNotesAtCursor());
        },
        {
            equalityFn: shallowEqual,
            fireImmediately: true
        }
    );

    useEffect(() => {
        backdropColor.value = withSpring(entryMode === "number" ? 0 : 1, { duration: 75 });
    }, [backdropColor, entryMode]);

    const onNumberPress = (value: number) => {
        if (entryMode === 'number') {
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
                const toggled = (entryMode === 'note') && cursorCellToggledNotes.includes(value);
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
            style={animatedBackdropStyle}
        >
            {renderButtons()}
        </Animated.View>
    );
};