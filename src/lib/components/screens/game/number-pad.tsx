import { ToggleButton } from "@/lib/components/screens/game/number-pad/toggle-button";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { countNumberOccurrences, getNotesValueAt, setPlayerValueAt, toggleNotesValueAt } from "@/lib/helpers/values";
import { GridIndex, NotesGridNotationValue } from "@/lib/shared-types";
import { gameplayStoreState, useGameplayStore } from "@/lib/store/gameplay";
import * as Haptics from 'expo-haptics';
import { useMemo } from "react";
import { View } from "react-native";
import { NumberPadContainer } from "./number-pad/container";

const MAX_OCCURRENCES = 9;

export const NumberPad = () => {
    const notes = useGameplayStore((state) => state.puzzle?.notes);
    const cursorGridPosition = useGameplayStore((state) => state.cursorGridPosition);
    const entryMode = useGameplayStore((store) => store.entryMode);
    const gameState = useGameplayStore((state) => state.state);
    const given = useGameplayStore((state) => state.puzzle?.given);
    const player = useGameplayStore((state) => state.puzzle?.player);

    const toggledNotes: NotesGridNotationValue = useMemo(() => {
        if (!notes) {
            return [];
        }

        return getNotesValueAt({ position: cursorGridPosition, notesGridNotation: notes })
    }, [notes, cursorGridPosition])

    const completedNumbers = useMemo(() => {
        if (!given || !player) return new Set<number>();
        const completed = new Set<number>();
        for (let v = 1; v <= 9; v++) {
            if (countNumberOccurrences(v, { given, player }) >= MAX_OCCURRENCES) {
                completed.add(v);
            }
        }
        return completed;
    }, [given, player]);

    const isDisabled = gameState !== 'playing';

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
                const toggled = (entryMode === 'note') && toggledNotes.includes(value);
                const numberCompleted = completedNumbers.has(value);
                const id = `nptb-${GridPositionHelper.stringNotationOf({ row: rowIndex as GridIndex, col: colIndex as GridIndex })}`

                buttonRow.push(
                    <ToggleButton
                        key={id}
                        value={value}
                        onPress={() => onNumberPress(value)}
                        toggled={toggled}
                        disabled={isDisabled || numberCompleted}
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
