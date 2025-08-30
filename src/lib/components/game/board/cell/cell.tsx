import { CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { Point } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { fontsAtom } from "@/lib/store/atoms/fonts-atom";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Group, Text } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import { BaseCell, CommonCellProps } from "./base-cell";

type CellProps = CommonCellProps & {};

export const Cell = ({ gridPosition }: CellProps) => {
    const given = useGameplayStore((store) => store.puzzle?.given?.[gridPosition.row]?.[gridPosition.col]);
    const player = useGameplayStore((store) => store.puzzle?.player?.[gridPosition.row]?.[gridPosition.col]);
    const notes = useGameplayStore((store) => store.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col] ?? []);
    
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
    cellPointForGridPosition: Point
}

const NumberCellText = (
    {
        cellPointForGridPosition,
        value
    }: NumberCellTextProps
) => {
    const fonts = useAtomValue(fontsAtom);
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const point = {
        x: (cellPointForGridPosition.x + CELL_OUTLINE_WIDTH / 2) + (boardDimensions.cellLength / 3),
        y: cellPointForGridPosition.y + (fonts.numberFontSize / 2) + (boardDimensions.cellLength / 2) - CELL_OUTLINE_WIDTH,
    }

    return (
        <Text
            x={point.x}
            y={point.y}
            text={value.toString()}
            font={fonts.numberFont}
            color="white"
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
    const halfOfStrokeWidth = CELL_OUTLINE_WIDTH / 2;
    const paddingX = halfOfStrokeWidth;
    const paddingY = halfOfStrokeWidth;
    
    const subgridPosition = SubgridPositionHelper.createFromFlatIndex((value - 1) % 9);

    const point = {
        x: (cellPointForGridPosition.x + paddingX) + CELL_OUTLINE_WIDTH
            + (subgridPosition.col * (subgridCellLength - paddingX))
            + (subgridCellLength / 2)
            - (fonts.notesFontSize / 2),

        y: (cellPointForGridPosition.y + paddingY) - (CELL_OUTLINE_WIDTH / 2)
            + (subgridPosition.row * (subgridCellLength - paddingY))
            + (subgridCellLength / 2)
            + (fonts.notesFontSize / 2),
    };

    return (
        <Text
            x={point.x}
            y={point.y}
            text={value.toString()}
            font={fonts.notesFont}
            color="white"
        />
    )
}