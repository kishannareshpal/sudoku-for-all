import { CELLS_COUNT, COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import {
    BoardGridNotation,
    BoardGridNotationRow,
    BoardMoveGridNotation,
    BoardMovePlainStringNotation,
    BoardNotesGridNotation,
    BoardNotesGridNotationRow,
    BoardNotesPlainStringNotation,
    BoardPlainNumberNotation,
    BoardPlainStringNotation
} from "@/lib/shared-types";
import { init } from "array-fns";

export class BoardNotationHelper {
    static emptyGridNotation(emptyValue: number = 0): BoardGridNotation {
        const rows: BoardGridNotationRow = init(ROWS_COUNT, () => emptyValue);
        return init(COLUMNS_COUNT, () => rows);
    }

    static emptyNotesGridNotation(): BoardNotesGridNotation {
        // An array of 9 arrays representing each row, where each row has 9 arrays representing each cell and each cell
        // has up to 9 values in the array to represent each note value in the cell.

        /**
         * Generates 'the row' by creating an empty list of note values for each column.
         */
        const generateRow = (): BoardNotesGridNotationRow => {
            return init(COLUMNS_COUNT, () => [] as number[]);
        };

        return init(
            ROWS_COUNT,
            () => generateRow()
        );
    }

    static emptyPlainStringNotation(): BoardPlainStringNotation {
        // A CSV of {CELLS_COUNT} zeroes.
        return init(CELLS_COUNT, () => '0')
            .join(',')
    }

    static emptyPlainNumberNotation(): BoardPlainNumberNotation {
        return init(CELLS_COUNT, () => 0);
    }

    static emptyMoveGridNotation(): BoardMoveGridNotation {
        return [];
    }

    static emptyMovePlainStringNotation(): BoardMovePlainStringNotation {
        return init(CELLS_COUNT, () => '0').join(',');
    }

    static emptyNotesPlainStringNotation(): BoardNotesPlainStringNotation {
        return init(CELLS_COUNT, () => '').join(',');
    }

    static transformPlainStringToGridNotation(
        plainStringNotation: BoardPlainStringNotation
    ): BoardGridNotation {
        const grid: BoardGridNotation = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            const gridRow: BoardGridNotationRow = [];

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
