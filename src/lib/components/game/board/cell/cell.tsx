import { CELL_OUTLINE_WIDTH, CURSOR_CELL_OUTLINE_WIDTH, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { Point } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { fontsAtom } from "@/lib/store/atoms/fonts-atom";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Group, Rect, Text } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import { BaseCell, CommonCellProps } from "./base-cell";

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
    cellPointForGridPosition: Point
}

const NotesCellText = (
    {
        cellPointForGridPosition,
        values,
    }: NotesCellTextProps
) => {
    return (
        <Group>
            {values.map((noteValue) => (
                <NoteText
                    key={noteValue}
                    value={noteValue}
                    cellPointForGridPosition={cellPointForGridPosition}
                />
            ))}
        </Group>
    )
}

type NoteTextProps = {
    value: number,
    cellPointForGridPosition: Point
}

const NoteText = (
    {
        value,
        cellPointForGridPosition
    }: NoteTextProps
) => {
    const fonts = useAtomValue(fontsAtom);
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const subgridCellLength = boardDimensions.cellLength / 3;

    const fontMeasurement = fonts.notesFont?.measureText(value.toString());
    const fontWidth = fontMeasurement?.width || 0;
    const fontHeight = fontMeasurement?.height || 0;

    const paddingX = CURSOR_CELL_OUTLINE_WIDTH;
    const paddingY = CURSOR_CELL_OUTLINE_WIDTH;

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex((value - 1) % 9);
    const point = {
        x: cellPointForGridPosition.x + (SUBGRID_OUTLINE_WIDTH / 2) + paddingX
            + (subgridPosition.col * (subgridCellLength - paddingX))
            + (subgridCellLength / 2)
            - (fontWidth / 2),

        y: cellPointForGridPosition.y - (SUBGRID_OUTLINE_WIDTH / 2) + paddingY
            + (subgridPosition.row * (subgridCellLength - paddingY))
            + (subgridCellLength / 2)
            + (fontHeight / 2),
    };

    return (
        <Text
            antiAlias
            x={point.x}
            y={point.y}
            text={value.toString()}
            font={fonts.notesFont}
            color="white"
        />
    )
}