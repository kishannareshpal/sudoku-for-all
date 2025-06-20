import { GridIndex, GridPosition, Point } from "@/lib/shared-types";
import { COLUMNS_COUNT, ROWS_COUNT, ROW_INDEX_BOUNDS, COL_INDEX_BOUNDS } from "@/lib/constants/board";
import { NumberHelper } from "@/lib/helpers/number-helper";

export class GridPositionHelper {
    static zero(): GridPosition {
        return {
            row: 0,
            col: 0
        };
    }

    static createFromIndexes(rowIndex: number, colIndex: number): GridPosition {
        const row = NumberHelper.clamp(rowIndex, ROW_INDEX_BOUNDS) as GridIndex;
        const col = NumberHelper.clamp(colIndex, COL_INDEX_BOUNDS) as GridIndex;

        return {row, col};
    }

    static createFromPoint(point: Point, cellLength: number): GridPosition | undefined {
        const colIndex = Math.floor(point.x / cellLength);
        const rowIndex = Math.floor(point.y / cellLength);

        const gridPosition = this.createFromIndexes(rowIndex, colIndex);

        if (this.isOutOfBounds(gridPosition)) {
            return undefined;
        }

        return gridPosition;
    }

    static stringNotationOf(gridPosition: GridPosition): string {
        return `${gridPosition.row},${gridPosition.col}`;
    }

    static changed(previousGridPosition: GridPosition | undefined, newGridPosition: GridPosition | undefined): boolean {
        if (!newGridPosition) {
            return false;
        }

        if (!previousGridPosition) {
            return true;
        }

        return !GridPositionHelper.equals(previousGridPosition, newGridPosition);
    }

    static notChanged(previousGridPosition: GridPosition | undefined, newGridPosition: GridPosition | undefined): boolean {
        if (!newGridPosition) {
            return true;
        }

        if (!previousGridPosition) {
            return false;
        }

        return GridPositionHelper.equals(previousGridPosition, newGridPosition)
    }

    static equals(gridPositionA: GridPosition, gridPositionB: GridPosition): boolean {
        const sameRow = gridPositionA.row === gridPositionB.row;
        const sameCol = gridPositionA.col === gridPositionB.col;

        return sameRow && sameCol;
    }

    static isOutOfBounds(gridPosition: GridPosition): boolean {
        if (gridPosition.row < 0 || gridPosition.row >= ROWS_COUNT) {
            return true;
        }

        return gridPosition.col < 0 || gridPosition.col >= COLUMNS_COUNT;
    }
}