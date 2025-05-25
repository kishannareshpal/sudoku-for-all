/**
 * -------------
 * Board Move Notation
 * -------------
 */

import { LocationNotation } from "@/lib/location";

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