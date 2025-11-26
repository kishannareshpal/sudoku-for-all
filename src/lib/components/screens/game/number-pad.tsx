import { ToggleButton } from "@/lib/components/screens/game/number-pad/toggle-button";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { getNotesValueAt, setPlayerValueAt, toggleNotesValueAt } from "@/lib/helpers/values";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { GridIndex, NotesGridNotationValue } from "@/lib/shared-types";
import { gameplayStore, gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { View } from "react-native";
import shallowEqual from "shallowequal";
import { NumberPadContainer } from "./number-pad/container";

export const NumberPad = () => {
    const [cursorCellToggledNotes, setCursorCellToggledNotes] = useState<NotesGridNotationValue>([]);
    const entryMode = useGameplayStore((store) => store.entryMode);

    useStoreSubscription(
        gameplayStore,
        (store) => store.cursorGridPosition,
        (cursorGridPosition) => {
            // On cursor movement...
            const puzzle = gameplayStoreState().puzzle
            if (!puzzle) {
                return;
            }

            setCursorCellToggledNotes(
                getNotesValueAt({ position: cursorGridPosition, notesGridNotation: puzzle.notes })
            );
        },
        {
            equalityFn: shallowEqual,
            fireImmediately: true
        }
    );

    const onNumberPress = (value: number) => {
        const cursorPosition = gameplayStoreState().cursorGridPosition;

        if (entryMode === 'number') {
            setPlayerValueAt({ position: cursorPosition, value: value });
        } else {
            toggleNotesValueAt({ position: cursorPosition, value: [value] })
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
        <NumberPadContainer entryMode={entryMode}>
            {renderButtons()}
        </NumberPadContainer>
    );
};