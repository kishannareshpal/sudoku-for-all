import { CellHelper } from "@/lib/helpers/cell-helper";
import { graphicsStoreState } from "@/lib/store/board";
import { Canvas } from "@shopify/react-native-skia";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Dividers } from "./cell/dividers";

export const Board = () => {
    // const boardDimensions = use$(boardDimensions$);
    const containerRef = useRef<View>(null!);

    // const fontManager = useSkiaFonts({
    //     SplineSansMonoRegular: [
    //         require("@assets/fonts/spline-sans-mono-regular.ttf"),
    //     ],

    //     SplineSansMonoBold: [
    //         require("@assets/fonts/spline-sans-mono-bold.ttf"),
    //     ],

    //     roboto: [require("@assets/fonts/roboto-mono.ttf")],
    // });

    // useLayoutEffect(() => {
    //     measureLayout();
    // }, []);

    // useEffect(() => {
    //     if (!fontManager) {
    //         return;
    //     }

    //     const cellLength = boardDimensions.cellLength;

    //     const numberFontSize = cellLength * 0.8;
    //     const notesFontSize = cellLength / 3;

    //     const numberFont = matchFont(
    //         { fontSize: numberFontSize, fontFamily: "SplineSansMonoBold" },
    //         fontManager,
    //     );
    //     const noteFont = matchFont(
    //         { fontSize: notesFontSize, fontFamily: "SplineSansMonoBold" },
    //         fontManager,
    //     );

    //     fonts$.setFonts({
    //         numberFont: numberFont,
    //         notesFont: noteFont,
    //         numberFontSize: numberFontSize,
    //         notesFontSize: notesFontSize,
    //         charSizeMapForNoteFont:
    //             TextHelper.measureAllNumbersForFont(noteFont),
    //         charSizeMapForNumberFont:
    //             TextHelper.measureAllNumbersForFont(numberFont),
    //     });
    // }, [fontManager, boardDimensions]);

    const measureLayout = (): void => {
        containerRef.current?.measure((_x, _y, width, height) => {
            const fitBoardLength = Math.min(width, height);

            graphicsStoreState().setDimensions({
                boardLength: fitBoardLength,
                cellLength: CellHelper.calculateCellLength(fitBoardLength)
            })
        });
    };

    // const panGesture = Gesture.Pan()
    //     .averageTouches(true)
    //     .onBegin((event) => {
    //         CellHelper.moveCursorToPoint(event);
    //     })
    //     .onChange((event) => {
    //         CellHelper.moveCursorToPoint(event);
    //     })
    //     .runOnJS(true);

    const renderCells = () => {
        const cells = [];

        // for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
        //     for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
        //         const gridPosition = GridPositionHelper.createFromIndexes(
        //             colIndex,
        //             rowIndex,
        //         );

        //         cells.push(
        //             <Cell
        //                 key={GridPositionHelper.stringNotationOf(gridPosition)}
        //                 gridPosition={gridPosition}
        //             />,
        //         );
        //     }
        // }

        return cells;
    };

    return (
        <View
            ref={containerRef}
            onLayout={measureLayout}
            className="flex-1 justify-center items-center"
        >
            <View
                style={{
                    width: boardLength,
                    height: boardLength,
                }}
            >
                {/* <GestureDetector gesture={panGesture}> */}
                <Canvas style={styles.canvas}>
                    {/*
                          Render order matters here:
                          - Elements listed earlier are drawn first / appear "behind"
                          - Elements listed later are drawn on top / appear "after / atop" the ones earlier
                          This is like z-index: later children overlay earlier ones
                        */}

                    {/* <PeerCells /> */}

                    {/* {renderCells()} */}

                    <Dividers />

                    {/* <CursorCell /> */}
                </Canvas>
                {/* </GestureDetector> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
        backgroundColor: "red",
    },

    canvasContainer: {},
});
