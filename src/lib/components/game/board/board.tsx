import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { fontsAtom } from "@/lib/store/atoms/fonts-atom";
import { Canvas, matchFont, useCanvasSize, useFonts } from "@shopify/react-native-skia";
import { useContextBridge } from "its-fine";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Cell } from "./cell/cell";
import { Dividers } from "./cell/dividers";

export const Board = () => {
    const ContextBridge = useContextBridge();
    const { ref, size: canvasSize } = useCanvasSize();

    const setBoardDimensionsAtom = useSetAtom(boardDimensionsAtom);
    const setFontsAtom = useSetAtom(fontsAtom);

    const fontManager = useFonts({
        SplineSansMonoRegular: [
            require("@assets/fonts/spline-sans-mono-regular.ttf")
        ],
    });

    useEffect(() => {
        const boardLength = Math.min(canvasSize.width, canvasSize.height);
        const cellLength = boardLength / COLUMNS_COUNT;

        const numberFontSize = cellLength / 2;
        const notesFontSize = cellLength / 3;

        setBoardDimensionsAtom({
            boardLength,
            cellLength,
        });

        if (fontManager) {
            const numberFont = matchFont({ fontSize: numberFontSize, fontFamily: 'SplineSansMonoRegular' }, fontManager);
            const noteFont = matchFont({ fontSize: notesFontSize, fontFamily: 'SplineSansMonoRegular' }, fontManager);
    
            setFontsAtom({
                numberFont: numberFont,
                notesFont: noteFont,
                numberFontSize: numberFontSize, 
                notesFontSize: notesFontSize,
            })
        }
    }, [canvasSize, fontManager, setBoardDimensionsAtom, setFontsAtom]);

    const renderCells = () => {
        const cells = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const gridPosition = GridPositionHelper.createFromIndexes(rowIndex, colIndex);

                cells.push(
                    <Cell 
                        key={GridPositionHelper.stringNotationOf(gridPosition)}
                        gridPosition={gridPosition} 
                    />
                )
            }
        }

        return cells;
    }

    return (
        <Canvas ref={ref} style={styles.container}>
            <ContextBridge>
                {renderCells()}

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
        backgroundColor: 'white',
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
