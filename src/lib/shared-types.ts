import { LocationNotation } from "@/lib/location";

export type GridIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SubgridIndex = 0 | 1 | 2;

/**
 * -------------
 * Board Move Notation
 * -------------
 */

export type GameState = 'paused' | 'playing' | 'over'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'very-hard' | 'extreme';

export type ForceToggleOperation = 'add' | 'remove'

export type CursorMode = 'number' | 'note';

export type Bounds = {
    min: number,
    max: number,
}

export type Size = {
    width: number,
    height: number,
}

export type Point = {
    x: number,
    y: number,
}

export type GridPosition = {
    row: GridIndex,
    col: GridIndex
};

export type SubgridPosition = {
    row: SubgridIndex,
    col: SubgridIndex
};

/**
 * The type of peer found during the processing via {@link CellHelper.processEachPeerAndNonPeerCell}
 */
export type PeerType = 'note' | 'number' | 'both';

export type PeerCellMetadata = {
    gridPosition: GridPosition,
    type: PeerType
}

export type Puzzle = {
    difficulty: Difficulty,
    solution: BoardGridNotation,
    notes: BoardNotesGridNotation,
    given: BoardGridNotation,
    player: BoardGridNotation,
    timeElapsedInSeconds: number,
};

/**
 * Represents a valid move type on the board.
 */
export type BoardMoveType =
    | 'set-number'
    | 'set-note'
    | 'remove-number'
    | 'remove-notes';

/**
 * Represents a plain string notation for moves on the board.
 *
 * @todo Explain the format
 */
export type BoardMovePlainStringNotation = string;

/**
 * Represents each move performed on the board.
 */
export type BoardMove = {
    type: BoardMoveType,
    index: number,
    locationNotation: LocationNotation,
    value: number,
}

/**
 * Represents the final board move grid notation.
 */
export type BoardMoveGridNotation = BoardMove[]

/**
 * -------------------
 * Board Normal Notation
 * -------------------
 */

/**
 * Represents each cell value in the grid notation.
 */
export type BoardGridNotationValue = number;

/**
 * Represents each row in the board grid notation.
 */
export type BoardGridNotationRow = BoardGridNotationValue[];

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
export type BoardNotesGridNotationValue = number[];

/**
 * Represents each row in the grid notation for notes on the board.
 */
export type BoardNotesGridNotationRow = BoardNotesGridNotationValue[]

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
