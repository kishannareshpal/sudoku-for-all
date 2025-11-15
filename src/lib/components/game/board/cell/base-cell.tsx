import { PointHelper } from "@/lib/helpers/point-helper";
import { GridPosition, Point } from "@/lib/shared-types";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Group } from "@shopify/react-native-skia";
import React from "react";

export type CommonCellProps = {
    gridPosition: GridPosition,
}

export type BaseCellProps = CommonCellProps & {
    renderChildren?: (point: Point) => React.ReactNode
}

export const BaseCell = (
    {
        gridPosition,
        renderChildren
    }: BaseCellProps,
) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);

    const point = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength,
    )

    return (
        <Group>
            {renderChildren?.(point)}
        </Group>
    )
}