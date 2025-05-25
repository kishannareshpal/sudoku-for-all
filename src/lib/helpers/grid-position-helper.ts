import { GridPosition, Point } from "@/lib/shared-types";
import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";

export class GridPositionHelper {
    static createFromPoint(point: Point, cellLength: number): GridPosition | undefined {
        const col = Math.floor(point.x / cellLength);
        const row = Math.floor(point.y / cellLength);

        const gridPosition = { row, col };

        if (this.isOutOfBounds(gridPosition)) {
            return undefined;
        }

        return gridPosition;
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

        if (gridPosition.col < 0 || gridPosition.col >= COLUMNS_COUNT) {
            return true;
        }

        return false;
    }
}