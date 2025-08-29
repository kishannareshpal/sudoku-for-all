import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { BoardProvider } from "@/lib/contexts/board-context";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { Puzzle } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { Canvas, matchFont, SkFont, useCanvasSize, useFonts } from "@shopify/react-native-skia";
import { init } from "array-fns";
import { FiberProvider, useContextBridge } from "its-fine";
import { useAtomValue, useSetAtom } from "jotai";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Cell } from "./cell/cell";
import { Dividers } from "./cell/dividers";


type BoardProps = PropsWithChildren<{
    puzzle: Puzzle
}>

export const Board = (
    {
        puzzle,
        children,
    }: BoardProps
) => {
    const boardDimensions = useAtomValue(boardDimensionsAtom);

    const fontManager = useFonts({
        SplineSansMonoRegular: [
            require("@assets/fonts/spline-sans-mono-regular.ttf")
        ],
    })!;

    const [fonts, setFonts] = useState<SkFont[]>([]);

    useEffect(() => {
        if (fontManager) {
            const numberFont = matchFont({ fontSize: boardDimensions.numberTextSize, fontFamily: 'SplineSansMonoRegular' }, fontManager);
            const noteFont = matchFont({ fontSize: boardDimensions.noteTextSize, fontFamily: 'SplineSansMonoRegular' }, fontManager);

            setFonts([
                numberFont,
                noteFont
            ]);
        }
    }, [fontManager]);
    

    const renderCells = () => {
        const cells = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const gridPosition = GridPositionHelper.createFromIndexes(rowIndex, colIndex);

                cells.push(
                    <Cell
                        gridPosition={gridPosition}
                    />
                )
            }
        }

        return cells;
    }

    return (
        <FiberProvider>
            <BoardProvider fontManager={fontManager} fonts={{ number: fonts[0], note: fonts[1] }}>
                <Layer />
            </BoardProvider>
        </FiberProvider>
    )
}

const Layer = () => {
    const ContextBridge = useContextBridge();
    const { ref, size: canvasSize } = useCanvasSize();

    const setBoardDimensions = useSetAtom(boardDimensionsAtom);

    useEffect(() => {
        const boardLength = Math.min(canvasSize.width, canvasSize.height);
        const cellLength = boardLength / COLUMNS_COUNT;

        const numberTextSize = cellLength / 2;
        const noteTextSize = cellLength / 3;

        setBoardDimensions({
            boardLength,
            cellLength,
            numberTextSize,
            noteTextSize
        });
    }, [canvasSize, setBoardDimensions]);

    return (
        <Canvas ref={ref} style={styles.container}>
            <ContextBridge>
                {/* {renderCells()} */}

                {init({ from: 0, to: 8 }).map((r) => (
                    init({ from: 0, to: 8 }).map(c => (
                        <Cell
                            key={`${r}${c}`}
                            gridPosition={GridPositionHelper.createFromIndexes(r, c)}
                        />
                    ))
                ))}

                {/* <Cell
                    gridPosition={{ row: 0, col: 0 }}
                /> */}

                <Dividers />
            </ContextBridge>
        </Canvas>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        position: 'relative',
        backgroundColor: 'lightgrey',
    },

    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },

    puzzleSceneContainer: {
        position: 'relative',
        flexShrink: 1,
        flexDirection: 'column',
    },

    gridContainer: {
        flexDirection: 'column',
    },

    gridRow: {
        flexDirection: 'row',
    }
})
