export const ROWS_COUNT: number = 9 as const;

export const COLUMNS_COUNT: number = 9 as const;

export const NOTES_ROWS_COUNT: number = 3 as const;

export const NOTES_COLUMNS_COUNT: number = 3 as const;

export const CELLS_COUNT: number = ROWS_COUNT * COLUMNS_COUNT;

export const CELL_OUTLINE_WIDTH: number = 1 as const;

/**
 * The outer border width of the board.
 *
 * @remarks The multiplication here is intended to account for the additional width of the
 * outline or border of the entire board compared to the individual cells.
 * - When you place two views with the same outline next to each other, the touching outline will be the sum of two.
 */
export const BOARD_OUTLINE_WIDTH = CELL_OUTLINE_WIDTH * 3;

