import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { PointHelper } from "@/lib/helpers/point-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { boardDimensions$ } from "@/lib/store/observables/board-dimensions";
import { fonts$ } from "@/lib/store/observables/fonts";
import { use$ } from "@legendapp/state/react";
import { Group, Rect } from "@shopify/react-native-skia";
import { BaseCell, CommonCellProps } from "./base-cell";

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
                const key = `rc-${GridPositionHelper.stringNotationOf(
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
                } else {
                    return (
                        <PeerCell
                            key={key}
                            gridPosition={peerCellMetadata.gridPosition}
                        />
                    );
                }
            })}
        </Group>
    );
};

const PeerCell = ({ gridPosition }: CommonCellProps) => {
    return (
        <BaseCell
            gridPosition={gridPosition}
            renderChildren={(boardDimensions, cellPointForGridPosition) => {
                return (
                    <Rect
                        x={cellPointForGridPosition.x}
                        y={cellPointForGridPosition.y}
                        width={boardDimensions.cellLength}
                        height={boardDimensions.cellLength}
                        style="fill"
                        strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
                        color="#ff000047"
                    />
                );
            }}
        />
    );
};

type PeerNoteProps = CommonCellProps & {
    value: number;
};

const PeerNote = ({ gridPosition, value }: PeerNoteProps) => {
    const fonts = use$(fonts$);
    const cellLength = use$(boardDimensions$.cellLength);

    const cellPointForGridPosition = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength,
    );
    const subgridCellLength = cellLength / 3;

    const fontMeasurement = fonts.notesFont?.measureText(value.toString());
    const fontWidth = fontMeasurement?.width || 0;
    const fontHeight = fontMeasurement?.height || 0;

    const padding = 2;

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9,
    );
    const point = {
        x:
            cellPointForGridPosition.x +
            fontWidth / 2 -
            padding +
            subgridPosition.col * (subgridCellLength - padding) +
            subgridCellLength / 2 -
            fontWidth / 2,

        y:
            cellPointForGridPosition.y +
            fontHeight / 2 -
            padding +
            subgridPosition.row * (subgridCellLength - padding) +
            subgridCellLength / 2 -
            fontHeight / 2,
    };

    return (
        <Rect
            antiAlias
            x={point.x}
            y={point.y}
            width={fontWidth}
            height={fontHeight}
            style="fill"
            color="red"
        />
    );
};
