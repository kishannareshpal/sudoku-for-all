import { Bounds } from "../shared-types";


export const ROWS_COUNT: number = 9 as const;

export const COLUMNS_COUNT: number = 9 as const;

/**
 * An alias to be used when you need either the ROWS_COUNT or COLUMNS_COUNT because both are always the same on a sudoku grid.
 */
export const ROWS_OR_COLUMNS_COUNT: number = 9 as const;

export const CELLS_COUNT: number = ROWS_COUNT * COLUMNS_COUNT;

export const SUBGRID_ROWS_COUNT: number = 3 as const;

export const SUBGRID_COLUMNS_COUNT: number = 3 as const

/**
 * An alias to be used when you need either the SUBGRID_ROWS_COUNT or SUBGRID_COLUMNS_COUNT because both are always the same on a sudoku grid.
 */
export const SUBGRID_ROWS_OR_COLUMNS_COUNT: number = 3 as const;

export const ROW_INDEX_BOUNDS: Bounds = { min: 0, max: ROWS_COUNT - 1 };

export const COL_INDEX_BOUNDS: Bounds = { min: 0, max: COLUMNS_COUNT - 1 };

export const NOTES_ROWS_COUNT: number = 3 as const;

export const NOTES_COLUMNS_COUNT: number = 3 as const;

// Outlines

export const CELL_OUTLINE_WIDTH: number = 1 as const;

export const SUBGRID_OUTLINE_WIDTH: number = 3 as const;

export const BOARD_OUTLINE_WIDTH: number = 3 as const;

export const CURSOR_CELL_OUTLINE_WIDTH: number = CELL_OUTLINE_WIDTH * 2;
