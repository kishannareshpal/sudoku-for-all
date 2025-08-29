import { PointHelper } from "@/lib/helpers/point-helper";
import { GridPosition, Point } from "@/lib/shared-types";
import { BoardDimensions, boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { Group } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export type CommonBaseCellProps = {
    gridPosition: GridPosition,
}

export type BaseCellProps = CommonBaseCellProps & {
    renderChildren?: (boardDimensions: BoardDimensions, point: Point) => React.ReactNode
}

export const BaseCell = (
    {
        gridPosition,
        renderChildren
    }: BaseCellProps,
) => {
    const boardDimensions = useAtomValue(boardDimensionsAtom);
    const point = useMemo(() => {
        return PointHelper.createFromGridPosition(
            gridPosition,
            boardDimensions.cellLength,
        )
    }, [boardDimensions.cellLength, gridPosition]);

    return (
        <Group>
            {renderChildren?.(boardDimensions, point)}
        </Group>
    )
}