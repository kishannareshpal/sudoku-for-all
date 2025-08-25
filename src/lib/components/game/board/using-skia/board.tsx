import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { Puzzle, Size } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-canvas-size.atom";
import { Canvas, useFont, useFonts } from "@shopify/react-native-skia";
import { useSetAtom } from "jotai";
import React, { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
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
    const currentCanvasSize = useSharedValue<Size>({ width: 0, height: 0 });
    const setRootBoardDimensions = useSetAtom(boardDimensionsAtom);

    const fontManager = useFonts({
        SplineSansMonoBold: [
            require("@assets/fonts/spline-sans-mono-bold.ttf")
        ],
    });

    const font = useFont(require("@assets/fonts/spline-sans-mono-bold.ttf"));

    useAnimatedReaction(
        () => currentCanvasSize.value,
        (newCanvasSize) => {
            const boardLength = Math.min(newCanvasSize.width, newCanvasSize.height);
            const cellLength = boardLength / COLUMNS_COUNT;

            runOnJS(setRootBoardDimensions)({
                boardLength, 
                cellLength
            });
        }
    )

    const renderCells = () => {
        const cells = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const gridPosition = GridPositionHelper.createFromIndexes(rowIndex, colIndex);

                cells.push(
                    <Cell 
                        gridPosition={gridPosition}
                        fontManager={fontManager}
                        font={font}
                    />
                )
            }
        }

        return cells;
    }

    return (
        <Canvas onSize={currentCanvasSize} style={styles.container}>
            {/* {renderCells()} */}

            {/* <Cell 
                gridPosition={{ row: 0, col: 0 }}
                fontManager={fontManager}
                font={font}
            /> */}

            <Dividers />
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
