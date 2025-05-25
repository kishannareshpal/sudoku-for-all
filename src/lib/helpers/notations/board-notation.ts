import { init } from "array-fns";
import { CELLS_COUNT, COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { BoardMoveGridNotation, BoardMovePlainStringNotation } from "@/lib/helpers/notations/board-move-notation";

export class BoardNotation {
    static emptyGridNotation(): BoardGridNotation {
        const rows: BoardGridNotationRow = init(ROWS_COUNT, () => 0);
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
        return '';
    }

    static emptyNotesPlainStringNotation(): BoardNotesPlainStringNotation {
        return init(CELLS_COUNT, () => '').join(',');
    }
}

/**
 * -------------------
 * Board Normal Notation
 * -------------------
 */

/**
 * Represents each cell value in the grid notation.
 */
export type BoardGridNotationCell = number;

/**
 * Represents each row in the board grid notation.
 */
export type BoardGridNotationRow = BoardGridNotationCell[];

/**
 * Represents the final / parsed board grid notation.
 */
export type BoardGridNotation = BoardGridNotationRow[];

/**
 * Represents the board notation as plain string.
 *
 * @todo Explain the format
 */
export type BoardPlainStringNotation = string;

/**
 * Represents the board notation as plain numbers.
 *
 * @todo Explain the format
 */
export type BoardPlainNumberNotation = number[];


/**
 * --------------------
 * Board Notes Notation
 * --------------------
 */

/**
 * Represents each cell value in the grid notation for notes on the board.
 */
export type BoardNotesGridNotationCell = number[];

/**
 * Represents each row in the grid notation for notes on the board.
 */
export type BoardNotesGridNotationRow = BoardNotesGridNotationCell[]

/**
 * Represents the final / parsed grid notation for notes on the board.
 */
export type BoardNotesGridNotation = BoardNotesGridNotationRow[];

/**
 * Represents the plain string notation for notes on the board.
 *
 * @todo Explain the format
 */
export type BoardNotesPlainStringNotation = string;