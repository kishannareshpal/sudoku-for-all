import { CELL_OUTLINE_WIDTH, CURSOR_CELL_OUTLINE_WIDTH, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridPosition, Point } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { fontsAtom } from "@/lib/store/atoms/fonts-atom";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Group, Rect, Text } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import { BaseCell, CommonCellProps } from "./base-cell";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";

type CellProps = CommonCellProps & {};

export const Cell = ({ gridPosition }: CellProps) => {
    const given = useGameplayStore((store) => store.puzzle?.given?.[gridPosition.row]?.[gridPosition.col]);
    const player = useGameplayStore((store) => store.puzzle?.player?.[gridPosition.row]?.[gridPosition.col]);
    const notes = useGameplayStore((store) => store.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col] ?? []);

    const isStatic = useGameplayStore((store) => CellHelper.isStaticAt(gridPosition, store.puzzle?.given))
    
    const number: number = given || player || 0;

    return (
        <BaseCell
            gridPosition={gridPosition}
            renderChildren={(_, cellPointForGridPosition) => {
                if (number > 0) {
                    return (
                        <NumberCellText 
                            value={number}
                            cellPointForGridPosition={cellPointForGridPosition}
                            isStatic={isStatic}
                        />
                    )
                } else if (notes?.length) {
                    return (
                        <NotesCellText
                            values={notes}
                            gridPosition={gridPosition}
                            cellPointForGridPosition={cellPointForGridPosition}
                        />
                    )
                } else {
                    return null;
                }
            }}
        />
    )
}

type NumberCellTextProps = {
    value: number,
    cellPointForGridPosition: Point,
    isStatic: boolean,
}

const NumberCellText = (
    {
        value,
        cellPointForGridPosition,
        isStatic = true
    }: NumberCellTextProps
) => {
    const fonts = useAtomValue(fontsAtom);
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const fontMeasurement = fonts.numberFont?.measureText(value.toString());
    const fontWidth = fontMeasurement?.width || 0;
    const fontHeight = fontMeasurement?.height || 0;

    const point = {
        x: cellPointForGridPosition.x + (boardDimensions.cellLength / 2) - (fontWidth / 2),
        y: cellPointForGridPosition.y + (boardDimensions.cellLength / 2) + (fontHeight / 2) - (CELL_OUTLINE_WIDTH * 2),
    }

    return (
        <Text
            antiAlias
            x={point.x}
            y={point.y}
            text={value.toString()}
            font={fonts.numberFont}
            color={isStatic ? 'white' : 'orange'}
        />
    )
}

type NotesCellTextProps = {
    values: number[],
    gridPosition: GridPosition,
    cellPointForGridPosition: Point
}

const NotesCellText = (
    {
        values,
        gridPosition,
        cellPointForGridPosition,
    }: NotesCellTextProps
) => {
    return (
        <Group>
            {values.map((noteValue) => (
                <NoteText
                    key={noteValue}
                    value={noteValue}
                    gridPosition={gridPosition}
                    cellPointForGridPosition={cellPointForGridPosition}
                />
            ))}
        </Group>
    )
}

type NoteTextProps = {
    value: number,
    gridPosition: GridPosition,
    cellPointForGridPosition: Point
}

const NoteText = (
    {
        value,
        gridPosition,
        cellPointForGridPosition
    }: NoteTextProps
) => {
    const isPeer = useGameplayStore(
        (store) => store.cursorPeerCells.some(
            (peerCellMetadata) => {
                return GridPositionHelper.equals(
                    gridPosition,
                    peerCellMetadata.gridPosition,
                ) && peerCellMetadata.type === 'note' &&
                    (CellHelper.getNumberValueAt(store.cursorGridPosition, store.puzzle?.player, store.puzzle?.given) === value)
            }
        )
    )

    const fonts = useAtomValue(fontsAtom);
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const subgridCellLength = boardDimensions.cellLength / 3;

    const fontMeasurement = fonts.notesFont?.measureText(value.toString());
    const fontWidth = fontMeasurement?.width || 0;
    const fontHeight = fontMeasurement?.height || 0;

    const padding = CURSOR_CELL_OUTLINE_WIDTH;

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex((value - 1) % 9);
    const point = {
        x: cellPointForGridPosition.x + (SUBGRID_OUTLINE_WIDTH / 2) + padding
            + (subgridPosition.col * (subgridCellLength - padding))
            + (subgridCellLength / 2)
            - (fontWidth / 2),

        y: cellPointForGridPosition.y - (SUBGRID_OUTLINE_WIDTH / 2) + padding
            + (subgridPosition.row * (subgridCellLength - padding))
            + (subgridCellLength / 2)
            + (fontHeight / 2),
    };

    return (
        <Group>
            {isPeer ? (
                <Rect
                    antiAlias
                    x={point.x}
                    y={point.y + (SUBGRID_OUTLINE_WIDTH / 2)}
                    width={fontWidth - (SUBGRID_OUTLINE_WIDTH / 2)}
                    height={-fontHeight}
                    color="red"
                />
            ) : null}

            <Text
                antiAlias
                x={point.x}
                y={point.y}
                text={value.toString()}
                font={fonts.notesFont}
                color="white"
            />
        </Group>
    )
}