import { StyleSheet, Text, View } from "react-native";
import { NOTES_COLUMNS_COUNT, NOTES_ROWS_COUNT } from "@/lib/constants/board";
import { ReactNode } from "react";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { BaseCell, BaseCellProps } from "@/lib/components/game/board/cell/base-cell";

type CellProps = BaseCellProps & {
    row: number,
    col: number,
    value?: number,
    notes?: number[]
}

export const Cell = (
    {
        row,
        col,
        value,
        notes = [],
        style,
        ...restProps
    }: CellProps,
) => {
    const renderNotes = () => {
        const rows: ReactNode[] = [];

        for (let rowIndex = 0; rowIndex < NOTES_ROWS_COUNT; rowIndex++) {
            const columns: ReactNode[] = [];

            for (let colIndex = 0; colIndex < NOTES_COLUMNS_COUNT; colIndex++) {
                const noteNumber = (rowIndex * 3 + colIndex) + 1; // Calculate note number (1-9)

                columns.push(
                    <Text
                        key={`column-${noteNumber}`}
                        style={
                            [
                                styles.noteCell,
                                {
                                    opacity: notes.includes(noteNumber) ? 1 : 0
                                }
                            ]
                        }
                    >
                        {noteNumber}
                    </Text>
                )
            }

            rows.push(
                <View key={`row-${rowIndex}`} style={styles.notesRowContainer}>
                    {columns}
                </View>
            );
        }

        return rows;
    }

    const renderCellContent = () => {
        if (CellHelper.isValueNotEmpty(value)) {
            // If there is a value set, then show that
            return (
                <Text style={styles.numberCell}>
                    {value}
                </Text>
            );
        } else if (notes?.length) {
            // If there are any notes, then show them
            return (
                <View style={styles.notesContainer}>
                    {renderNotes()}
                </View>
            )
        } else {
            return null;
        }
    }

    return (
        <BaseCell
            row={row}
            col={col}
            {...restProps}
        >
            {renderCellContent()}
        </BaseCell>
    )
}

const styles = StyleSheet.create({
    notesContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        paddingTop: 4,
    },

    notesRowContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    noteCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'SplineSansMonoBold',
        lineHeight: 12
    },

    numberCell: {
        fontSize: 28,
        textAlign: 'center',
        fontFamily: 'SplineSansMonoBold',
    }
})