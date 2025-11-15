import { BOARD_OUTLINE_WIDTH, CELL_OUTLINE_WIDTH, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridPosition, Point, SubgridPosition } from "@/lib/shared-types";

export class PointHelper {
    static zero(): Point {
        return {
            x: 0,
            y: 0
        };
    }

    static createFromGridPosition(
        gridPosition: GridPosition,
        cellLength: number,
    ): Point {
        const subgridPosition = SubgridPositionHelper.createFromGridPosition(gridPosition);

        const compute = (
            gridIndex: number,
            subgridIndex: number,
        ) => {
            return (gridIndex * cellLength) + BOARD_OUTLINE_WIDTH + (CELL_OUTLINE_WIDTH * (gridIndex - subgridIndex)) + (SUBGRID_OUTLINE_WIDTH * subgridIndex);
        }

        return {
            x: compute(gridPosition.col, subgridPosition.col),
            y: compute(gridPosition.row, subgridPosition.row),
        };
    }

    static createFromSubgridPosition(
        subgridPosition: SubgridPosition,
        subCellLength: number,
    ): Point {
        const x = subgridPosition.col * subCellLength;
        const y = subgridPosition.row * subCellLength;

        return { x, y };
    }
}