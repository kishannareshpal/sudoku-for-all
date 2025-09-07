import { SUBGRID_COLUMNS_COUNT, SUBGRID_ROWS_COUNT } from "@/lib/constants/board";
import { GridIndex, GridPosition, SubgridIndex, SubgridPosition } from "@/lib/shared-types";

export class SubgridPositionHelper {
    static zero(): SubgridPosition {
        return {
            row: 0,
            col: 0
        };
    }

    static createFromFlatIndex(index: number): SubgridPosition {
        const subGridRow = Math.floor(index / 3) as SubgridIndex;
        const subGridCol = (index % 3) as SubgridIndex;

        return {
            row: subGridRow,
            col: subGridCol
        }
    }

    static createFromGridPosition(gridPosition: GridPosition): SubgridPosition {
        const subGridRow = this.rowFromGridPosition(gridPosition.row);
        const subGridCol = this.colFromGridPosition(gridPosition.col);

        return {
            row: subGridRow,
            col: subGridCol
        }
    }

    static rowFromGridPosition(gridPositionRow: GridIndex): SubgridIndex {
        return Math.floor(gridPositionRow / 3) as SubgridIndex;
    }

    static colFromGridPosition(gridPositionCol: GridIndex): SubgridIndex {
        return Math.floor(gridPositionCol / 3) as SubgridIndex;
    }

    static equals(subGridPositionA: SubgridPosition, subGridPositionB: SubgridPosition): boolean {
        const sameRow = subGridPositionA.row === subGridPositionB.row;
        const sameCol = subGridPositionA.col === subGridPositionB.col;

        return sameRow && sameCol;
    }

    static equalsFromGridPositions(gridPositionA: GridPosition, gridPositionB: GridPosition): boolean {
        const subGridPositionA = SubgridPositionHelper.createFromGridPosition(gridPositionA);
        const subGridPositionB = SubgridPositionHelper.createFromGridPosition(gridPositionB);

        return SubgridPositionHelper.equals(subGridPositionA, subGridPositionB);
    }

    static isOutOfBounds(subGridPosition: SubgridPosition): boolean {
        if (subGridPosition.row < 0 || subGridPosition.row >= SUBGRID_ROWS_COUNT) {
            return true;
        }

        return subGridPosition.col < 0 || subGridPosition.col >= SUBGRID_COLUMNS_COUNT;
    }
}