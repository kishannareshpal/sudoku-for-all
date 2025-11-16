import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { PointHelper } from "@/lib/helpers/point-helper";
import { BaseCellProps } from "@/lib/shared-types";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Rect } from "@shopify/react-native-skia";

export type PeerNumberProps = BaseCellProps;

export const PeerNumber = ({ gridPosition }: PeerNumberProps) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const cellPoint = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength
    );

    return (
        <Rect
            x={cellPoint.x}
            y={cellPoint.y}
            width={cellLength}
            height={cellLength}
            style="fill"
            strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
            color="#ffff005e" />
    );
};
