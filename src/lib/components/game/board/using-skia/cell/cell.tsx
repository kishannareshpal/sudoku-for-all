import { SizeHelper } from "@/lib/helpers/size-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridPosition, Point, Size } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-canvas-size.atom";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Group, SkFont, SkTypefaceFontProvider, Text } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { BaseCell } from "./base-cell";

type CellProps = {
    gridPosition: GridPosition,
    fontManager: SkTypefaceFontProvider | null,
    font: SkFont | null
}

export const Cell = (
    {
        gridPosition,
        font,
        fontManager,
        ...restProps
    }: CellProps,
) => {
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const given = useGameplayStore((store) => store.puzzle?.given?.[gridPosition.row]?.[gridPosition.col]);
    const player = useGameplayStore((store) => store.puzzle?.player?.[gridPosition.row]?.[gridPosition.col]);
    const numberValue: number = given ?? player ?? 0;

    const notesValue = useGameplayStore((store) => store.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col] ?? [1, 2, 4]);

    return (
        <BaseCell
            gridPosition={gridPosition}
            renderChildren={(boardDimensions, cellPointForGridPosition) => {
                return (
                    <NotesCellText
                        font={font}
                        value={notesValue}
                        cellPointForGridPosition={cellPointForGridPosition}
                    />
                )

                // if (numberValue) {
                //     return (
                //         <NumberCellText 
                //             font={font} 
                //             value={numberValue}
                //             cellPointForGridPosition={cellPointForGridPosition}
                //         />
                //     )
                // } else if (notesValue?.length) {
                //     return (
                //         <NotesCellText
                //             font={font}
                //             value={notesValue}
                //             cellPointForGridPosition={cellPointForGridPosition}
                //         />
                //     )
                // } else {
                //     return null;
                // }
            }}
        />
    )
}

type NumberCellTextProps = {
    value: number,
    cellPointForGridPosition: Point,
    font: SkFont | null
}

const NumberCellText = (
    {
        cellPointForGridPosition,
        value,
        font
    }: NumberCellTextProps
) => {
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    useEffect(() => {
        font?.setSize(boardDimensions.cellLength / 2);
    }, [boardDimensions, font])

    const text = useSharedValue(value.toString());
    // const textSize = useDerivedValue<Size>(() => {
    //     return font?.measureText(value.toString()) ?? SizeHelper.zero();
    // }, [text, font])


    const point = {
        x: cellPointForGridPosition.x + (boardDimensions.cellLength / 2) - (textSize.value.width / 2),
        y: cellPointForGridPosition.y + (boardDimensions.cellLength / 2) + (textSize.value.width / 2)
    }

    return (
        <Group>
            <Text
                x={point.x}
                y={point.y}
                text={text}
                font={font}
            />
        </Group>
    )
}

type NotesCellTextProps = {
    value: number[],
    cellPointForGridPosition: Point,
    font: SkFont | null
}

const NotesCellText = (
    {
        cellPointForGridPosition,
        value,
        font
    }: NotesCellTextProps
) => {
    const boardDimensions = useAtomValue(boardDimensionsAtom);
    const fontSize = boardDimensions.cellLength / 3

    useEffect(() => {
        font?.setSize(fontSize);
    }, [boardDimensions]);

    return (
        <Group>
            <NoteText
                value={5}
                font={font}
                cellPointForGridPosition={cellPointForGridPosition}
            />

            {/* <NoteText 
                value={2}
                font={font}
                cellPointForGridPosition={cellPointForGridPosition}
            />

            <NoteText 
                value={3}
                font={font}
                cellPointForGridPosition={cellPointForGridPosition}
            />

            <NoteText 
                value={4}
                font={font}
                cellPointForGridPosition={cellPointForGridPosition}
            /> */}

        </Group>
    )
}

type NoteTextProps = {
    value: number,
    cellPointForGridPosition: Point,
    font: SkFont | null
}

const NoteText = (
    {
        value,
        cellPointForGridPosition,
        font
    }: NoteTextProps
) => {
    const boardDimensions = useAtomValue(boardDimensionsAtom);
    const subgridCellLength = boardDimensions.cellLength / 3;

    const zero = SizeHelper.zero();

    const textSize = useDerivedValue<Size>(() => {
        return font?.measureText(value.toString()) ?? zero;
    }, [value, font]);

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex((value - 1) % 9);

    // const point = {
    //     x: (cellPointForGridPosition.x + (subgridCellLength * subgridPosition.col)) + (textSize.value.width / 2),
    //     y: (cellPointForGridPosition.y + (subgridCellLength * subgridPosition.row)) + textSize.value.width
    // }

    const point = {
        x: (cellPointForGridPosition.x + (subgridCellLength * subgridPosition.col)), // + (textSize.value.width / 2),
        y: (cellPointForGridPosition.y + (subgridCellLength * subgridPosition.row)) // + textSize.value.width
    }

    return (
        <>
            {/* <Rect
                x={point.x}
                y={point.y}
                color="blue"
                width={10}
                height={10}
            /> */}

            <Text
                x={point.x}
                y={point.y}
                text={value.toString()}
                font={font}
            />
        </>
    )
}