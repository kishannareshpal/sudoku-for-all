import { GridPosition, Point } from "@/lib/shared-types";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { BOARD_OUTLINE_WIDTH, CELL_OUTLINE_WIDTH, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";

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

    // static createFromSubgridPosition(
    //     subgridPosition: SubgridPosition,
    //     cellLength: number,
    // ): Point {
    //     const x = gridPosition.col * cellLength;
    //     const y = gridPosition.row * cellLength;
        
    //     return { x, y };
    // }
}