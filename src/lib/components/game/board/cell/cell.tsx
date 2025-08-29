import { CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { useBoard } from "@/lib/contexts/board-context";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridPosition, Point } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Group, Text } from "@shopify/react-native-skia";
import { init } from "array-fns";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { BaseCell } from "./base-cell";

type CellProps = {
    gridPosition: GridPosition,
}

export const Cell = (
    {
        gridPosition,
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
                        gridPosition={gridPosition}
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
    cellPointForGridPosition: Point
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
    gridPosition: GridPosition,
    cellPointForGridPosition: Point
}

const NotesCellText = (
    {
        gridPosition,
        cellPointForGridPosition,
        value,
    }: NotesCellTextProps
) => {
    return (
        <Group>
            {
                init({ from: 1, to: 9 }).map((index) => (
                    <NoteText
                        key={index}
                        value={index}
                        gridPosition={gridPosition}
                        cellPointForGridPosition={cellPointForGridPosition}
                    />
                ))
            }

            {/* <NoteText
                value={4}
                cellPointForGridPosition={cellPointForGridPosition}
            />

            <NoteText
                value={9}
                cellPointForGridPosition={cellPointForGridPosition}
            />

            <NoteText
                value={3}
                cellPointForGridPosition={cellPointForGridPosition}
            /> */}

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
    const { fonts } = useBoard();
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const subgridCellLength = boardDimensions.cellLength / 3;
    const halfOfStrokeWidth = CELL_OUTLINE_WIDTH / 2;
    const paddingX = halfOfStrokeWidth;
    const paddingY = halfOfStrokeWidth;
    
    const subgridPosition = SubgridPositionHelper.createFromFlatIndex((value - 1) % 9);
    // const point = {
    //     x: cellPointForGridPosition.x + (subgridPosition.col * subgridCellLength) + (subgridCellLength / 2),
    //     // x: (cellPointForGridPosition.x + paddingX) + ((subgridCellLength - paddingX) * subgridPosition.col),
    //     y: (cellPointForGridPosition.y + paddingY) + ((subgridCellLength - paddingY) * subgridPosition.row) + boardDimensions.noteTextSize - halfOfStrokeWidth,
    // };

    const centerX = (boardDimensions.cellLength / 2) - (CELL_OUTLINE_WIDTH / 2) - paddingX;

    const point = {
        x: (cellPointForGridPosition.x + paddingX) + CELL_OUTLINE_WIDTH
            + (subgridPosition.col * (subgridCellLength - paddingX))
            + (subgridCellLength / 2)
            - (boardDimensions.noteTextSize / 2),

        y: (cellPointForGridPosition.y + paddingY) - (CELL_OUTLINE_WIDTH / 2)
            + (subgridPosition.row * (subgridCellLength - paddingY))
            + (subgridCellLength / 2)
            + (boardDimensions.noteTextSize / 2),
    };

    return (
        <>
            <Text
                x={point.x}
                y={point.y}
                text={value.toString()}
                font={fonts.note}
                color="black"
            />
        </>
    )
}