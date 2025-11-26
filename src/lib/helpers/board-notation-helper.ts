import { CELLS_COUNT, COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import {
    BoardMovePlainStringNotation,
    GridPosition,
    MoveGridNotation,
    NotesGridNotation,
    NotesGridNotationRow,
    NotesGridNotationValue,
    NotesPlainStringNotation,
    NumbersGridNotation,
    NumbersGridNotationRow,
    NumbersGridNotationValue,
    PlainNumberNotation,
    PlainStringNotation
} from "@/lib/shared-types";
import { init } from "array-fns";

export class BoardNotationHelper {
    static emptyGridNotation(emptyValue: number = 0): NumbersGridNotation {
        const rows: NumbersGridNotationRow = init(ROWS_COUNT, () => emptyValue);
        return init(COLUMNS_COUNT, () => rows);
    }

    static getValueAt<TNotation extends NumbersGridNotation | NotesGridNotation, TValue = TNotation extends NumbersGridNotation ? NumbersGridNotationValue : NotesGridNotationValue>(
        position: GridPosition,
        notation: TNotation
    ): TValue {
        return notation[position.row][position.col] as TValue;
    }

    static emptyNotesGridNotation(): NotesGridNotation {
        // An array of 9 arrays representing each row, where each row has 9 arrays representing each cell and each cell
        // has up to 9 values in the array to represent each note value in the cell.

        /**
         * Generates 'the row' by creating an empty list of note values for each column.
         */
        const generateRow = (): NotesGridNotationRow => {
            return init(COLUMNS_COUNT, () => [] as number[]);
        };

        return init(
            ROWS_COUNT,
            () => generateRow()
        );
    }

    static emptyPlainStringNotation(): PlainStringNotation {
        // A CSV of {CELLS_COUNT} zeroes.
        return init(CELLS_COUNT, () => '0')
            .join(',')
    }

    static emptyPlainNumberNotation(): PlainNumberNotation {
        return init(CELLS_COUNT, () => 0);
    }

    static emptyMoveGridNotation(): MoveGridNotation {
        return [];
    }

    static emptyMovePlainStringNotation(): BoardMovePlainStringNotation {
        return init(CELLS_COUNT, () => '0').join(',');
    }

    static emptyNotesPlainStringNotation(): NotesPlainStringNotation {
        return init(CELLS_COUNT, () => '').join(',');
    }

    static transformPlainStringToGridNotation(
        plainStringNotation: PlainStringNotation
    ): NumbersGridNotation {
        const grid: NumbersGridNotation = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            const gridRow: NumbersGridNotationRow = [];

            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const colRowIndex = rowIndex * COLUMNS_COUNT + colIndex;
                const value = parseInt(plainStringNotation[colRowIndex]);

                gridRow.push(value);
            }

            grid.push(gridRow);
        }

        return grid;
    }
}
