import { PointHelper } from "@/lib/helpers/point-helper";
import { BoardDimensions, GridPosition, Point } from "@/lib/shared-types";
import { boardDimensions$ } from "@/lib/store/observables/board-dimensions";
import { use$ } from "@legendapp/state/react";
import { Group } from "@shopify/react-native-skia";
import React from "react";

export type CommonCellProps = {
    gridPosition: GridPosition,
}

export type BaseCellProps = CommonCellProps & {
    renderChildren?: (boardDimensions: BoardDimensions, point: Point) => React.ReactNode
}

export const BaseCell = (
    {
        gridPosition,
        renderChildren
    }: BaseCellProps,
) => {
    const dimensions = use$(boardDimensions$);

    const point = PointHelper.createFromGridPosition(
        gridPosition,
        dimensions.cellLengthWithBorderSpacing,
    )

    return (
        <Group>
            {renderChildren?.(dimensions, point)}
        </Group>
    )
}