import { SizeHelper } from "@/lib/helpers/size-helper";
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
    }, [boardDimensions])

    const text = useSharedValue(value.toString());
    const textSize = useDerivedValue<Size>(() => {
        return font?.measureText(value.toString()) ?? SizeHelper.zero();
    }, [text, font])


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

    useEffect(() => {
        font?.setSize(boardDimensions.cellLength / 3);
    }, [boardDimensions]);

    // const text = useSharedValue(value.toString());
    // const textSize = useDerivedValue<Size>(() => {
    //     return font?.measureText(value.toString()) ?? SizeHelper.zero();
    // }, [text, font])

    const point = {
        x: cellPointForGridPosition.x, // - (textSize.value.width / 2),
        y: cellPointForGridPosition.y // + (textSize.value.width / 2)
    }

    return (
        <Group>
            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />

            <Text
                x={point.x}
                y={point.y}
                text="1"
                font={font}
            />
        </Group>
    )
}


// type CellTextsProps = {
//     parentCellPoint: Point,
//     numberParagraph: SkParagraph,
//     noteParagraph: SkParagraph
// }

// const CellText = (
//     {
//         parentCellPoint,
//         numberParagraph,
//         noteParagraph
//     }: CellTextsProps
// ) => {
//     const boardDimensions = useAtomValue(boardDimensionsAtom);

    // const numberTextSize: Size = useMemo(() => {
    //     if (!numberParagraph) {
    //         return SizeHelper.zero();
    //     }

    //     return {
    //         width: numberParagraph.getLongestLine(),
    //         height: numberParagraph.getHeight()
    //     }
    // }, [numberParagraph])

    // const numberTextPoint = {
    //     x: parentCellPoint.x + (boardDimensions.cellLength / 2) - (numberTextSize.width / 2),
    //     y: parentCellPoint.y + (boardDimensions.cellLength / 2) - (numberTextSize.height / 2)
    // }

//     const noteTextSize: Size = useMemo(() => {
//         if (!noteParagraph) {
//             return SizeHelper.zero();
//         }

//         return {
//             width: noteParagraph.getLongestLine(),
//             height: noteParagraph.getHeight()
//         }
//     }, [noteParagraph]);

//     return (
//         <Group>
//             {/* <Paragraph 
//                 x={numberTextPoint.x}
//                 y={numberTextPoint.y} 
//                 paragraph={numberParagraph}
//                 width={boardDimensions.cellLength}
//             /> */}
//         </Group>
//     )
// }