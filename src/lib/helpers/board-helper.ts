import {
    BOARD_OUTLINE_WIDTH,
    CELL_OUTLINE_WIDTH,
    ROWS_OR_COLUMNS_COUNT,
    SUBGRID_OUTLINE_WIDTH
} from "@/lib/constants/board";

export class BoardHelper {
    /**
     * Calculates the best board length that fits all 9 cells on each axis equally.
     * 
     * @param availableBoardLength - the maximum available width/height of the view where a square board can be drawn, which is where we're trying to fit our board into
     */
    static calculateFittedBoardLayout(availableBoardLength: number): { boardLength: number, cellLength: number } {
        const fittedCellLength = this.calculateFittedCellLength(availableBoardLength);
        const totalOutlineSpacing = this.getOutlineTotalSpacing();

        const fittedBoardLength = fittedCellLength * ROWS_OR_COLUMNS_COUNT + totalOutlineSpacing;

        return {
            boardLength: fittedBoardLength,
            cellLength: fittedCellLength
        }
    }

    /**
     * Calculates a cell length that we can use to draw so that are cells in the board are equal.
     * 
     * @param availableBoardLength - the maximum available width/height of the view where a square board can be drawn, which is where we're trying to fit the cells of our board into
     * @returns 
     */
    static calculateFittedCellLength(availableBoardLength: number): number {
        const totalOutlineSpacing = this.getOutlineTotalSpacing();

        return (availableBoardLength - totalOutlineSpacing) / ROWS_OR_COLUMNS_COUNT;
    }

    static getOutlineTotalSpacing(): number {
        // NOTE: We only need to calculate based on a single axis (horizontal / vertical) because both are 
        // the same due to the nature of sudoku grids being square.
        // - For example: Across the board length, there are only two times that the subgrid outline appears on any axis.

        const totalBoardOutlineSpace = BOARD_OUTLINE_WIDTH * 2 // because two board outlines are drawn per axis
        const totalSubgridOutlineSpace = SUBGRID_OUTLINE_WIDTH * 2 // because two subgrid outlines are drawn per axis
        const totalCellOutlineWidth = CELL_OUTLINE_WIDTH * 6 // because six cell outlines are drawn per axis (not 10, because we are excluding the 2 board outliens and the 2 subgrid outlines)

        return totalBoardOutlineSpace + totalSubgridOutlineSpace + totalCellOutlineWidth;
    }
}
