import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { PointHelper } from "@/lib/helpers/point-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { BaseCellProps } from "@/lib/shared-types";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Group, Rect } from "@shopify/react-native-skia";

export const PeerCells = () => {
    const cursorValue = useGameplayStore((store) =>
        CellHelper.getNumberValueAt(
            store.cursorGridPosition,
            store.puzzle?.player,
            store.puzzle?.given,
        ),
    );
    const cursorPeerCells = useGameplayStore((store) => store.cursorPeerCells);

    return (
        <Group>
            {cursorPeerCells.map((peerCellMetadata) => {
                const key = `pc-${peerCellMetadata.type}-${GridPositionHelper.stringNotationOf(
                    peerCellMetadata.gridPosition,
                )}`;

                if (peerCellMetadata.type === "note") {
                    return (
                        <PeerNote
                            key={key}
                            gridPosition={peerCellMetadata.gridPosition}
                            value={cursorValue}
                        />
                    );
                } else if (peerCellMetadata.type === 'number') {
                    return (
                        <PeerCell
                            key={key}
                            gridPosition={peerCellMetadata.gridPosition}
                        />
                    );
                } else if (peerCellMetadata.type === 'both') {
                    return (
                        <Group key={key}>
                            <PeerNote
                                gridPosition={peerCellMetadata.gridPosition}
                                value={cursorValue}
                            />

                            <PeerCell
                                gridPosition={peerCellMetadata.gridPosition}
                            />
                        </Group>
                    )
                } else {
                    return null
                }
            })}
        </Group>
    );
};

type PeerCellProps = BaseCellProps;
const PeerCell = ({ gridPosition }: PeerCellProps) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const cellPoint = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength,
    )

    return (
        <Rect
            x={cellPoint.x}
            y={cellPoint.y}
            width={cellLength}
            height={cellLength}
            style="fill"
            strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
            color="#ffff005e"
        />
    );
};

type PeerNoteProps = BaseCellProps & {
    value: number;
};

const PeerNote = ({ gridPosition, value }: PeerNoteProps) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const subCellLength = useGraphicsStore((state) => state.boardLayout.subCellLength)
    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9,
    );

    const cellPoint = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength,
    )

    const subCellPoint = {
        x: cellPoint.x + (subCellLength * subgridPosition.col),
        y: cellPoint.y + (subCellLength * subgridPosition.row),
    }

    return (
        <Rect
            antiAlias
            x={subCellPoint.x}
            y={subCellPoint.y}
            width={subCellLength}
            height={subCellLength}
            style="fill"
            color="red"
        />
    );
};
