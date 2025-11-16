import { PointHelper } from "@/lib/helpers/point-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { BaseCellProps } from "@/lib/shared-types";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Rect } from "@shopify/react-native-skia";

export type PeerNoteProps = BaseCellProps & {
    value: number;
};
export const PeerNote = ({ gridPosition, value }: PeerNoteProps) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const subCellLength = useGraphicsStore((state) => state.boardLayout.subCellLength);
    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9
    );

    const cellPoint = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength
    );

    const subCellPoint = {
        x: cellPoint.x + (subCellLength * subgridPosition.col),
        y: cellPoint.y + (subCellLength * subgridPosition.row),
    };

    return (
        <Rect
            antiAlias
            x={subCellPoint.x}
            y={subCellPoint.y}
            width={subCellLength}
            height={subCellLength}
            style="fill"
            color="red" />
    );
};
