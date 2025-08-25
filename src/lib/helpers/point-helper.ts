import { GridPosition, Point } from "@/lib/shared-types";

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
        const x = gridPosition.col * cellLength;
        const y = gridPosition.row * cellLength;

        return { x, y };
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