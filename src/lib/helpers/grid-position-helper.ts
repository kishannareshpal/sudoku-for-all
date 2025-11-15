import {
    COLUMNS_COUNT,
    COL_INDEX_BOUNDS,
    ROWS_COUNT,
    ROW_INDEX_BOUNDS
} from "@/lib/constants/board";
import { NumberHelper } from "@/lib/helpers/number-helper";
import { GridIndex, GridPosition, Point } from "@/lib/shared-types";
import { graphicsStoreState } from "../store/graphics";

export class GridPositionHelper {
    static zero(): GridPosition {
        return {
            row: 0,
            col: 0
        };
    }

    static createFromIndexes(colIndex: number, rowIndex: number): GridPosition {
        const col = NumberHelper.clamp(colIndex, COL_INDEX_BOUNDS) as GridIndex;
        const row = NumberHelper.clamp(rowIndex, ROW_INDEX_BOUNDS) as GridIndex;

        return { col, row };
    }

    static createFromPoint(point: Point): GridPosition | undefined {
        const cellLengthIgnoringBorders = graphicsStoreState().boardLayout.rawCellLength;

        const colIndex = Math.floor(point.x / cellLengthIgnoringBorders);
        const rowIndex = Math.floor(point.y / cellLengthIgnoringBorders);

        const gridPosition = this.createFromIndexes(colIndex, rowIndex);

        if (this.isOutOfBounds(gridPosition)) {
            return undefined;
        }

        return gridPosition;
    }

    static stringNotationOf(gridPosition: GridPosition): string {
        return `${gridPosition.col},${gridPosition.row}`;
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

    static equalRow(gridPositionA: GridPosition, gridPositionB: GridPosition): boolean {
        return gridPositionA.row === gridPositionB.row;
    }

    static equalColumn(gridPositionA: GridPosition, gridPositionB: GridPosition): boolean {
        return gridPositionA.col === gridPositionB.col;
    }

    static isOutOfBounds(gridPosition: GridPosition): boolean {
        if (gridPosition.row < 0 || gridPosition.row >= ROWS_COUNT) {
            return true;
        }

        return gridPosition.col < 0 || gridPosition.col >= COLUMNS_COUNT;
    }
}