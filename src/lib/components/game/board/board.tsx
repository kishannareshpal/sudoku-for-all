import {
    COLUMNS_COUNT,
    CURSOR_CELL_OUTLINE_WIDTH,
    ROWS_COUNT,
} from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { Point } from "@/lib/shared-types";
import {
    Canvas,
    matchFont,
    useFonts as useSkiaFonts,
} from "@shopify/react-native-skia";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Cell } from "./cell/cell";
import { Dividers } from "./cell/dividers";
import { boardDimensions$ } from "@/lib/store/observables/board-dimensions";
import { use$ } from "@legendapp/state/react";
import { CursorCell } from "@/lib/components/game/board/cell/cursor-cell";
import { PeerCells } from "@/lib/components/game/board/cell/peer-cells";
import { fonts$ } from "@/lib/store/observables/fonts";

export const Board = () => {
    const boardDimensions = use$(boardDimensions$);
    const containerRef = useRef<View>(null!);

    const fontManager = useSkiaFonts({
        SplineSansMonoRegular: [
            require("@assets/fonts/spline-sans-mono-regular.ttf"),
        ],

        SplineSansMonoBold: [
            require("@assets/fonts/spline-sans-mono-bold.ttf"),
        ],

        roboto: [require("@assets/fonts/roboto-mono.ttf")],
    });

    useLayoutEffect(() => {
        measureLayout();
    }, []);

    useEffect(() => {
        if (!fontManager) {
            return;
        }

        const cellLength = boardDimensions.cellLength;

        const numberFontSize = cellLength * 0.8;
        const notesFontSize = cellLength / 3;

        const numberFont = matchFont(
            { fontSize: numberFontSize, fontFamily: "SplineSansMonoBold" },
            fontManager,
        );
        const noteFont = matchFont(
            { fontSize: notesFontSize, fontFamily: "SplineSansMonoBold" },
            fontManager,
        );

        // Cache measurement
        // Math.max(
        //     ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(
        //         (value) => noteFont.measureText("1").width,
        //     ),
        // );

        fonts$.setFonts({
            numberFont: numberFont,
            notesFont: noteFont,
            numberFontSize: numberFontSize,
            notesFontSize: notesFontSize,
        });
    }, [fontManager, boardDimensions]);

    const measureLayout = (): void => {
        containerRef.current?.measure((_x, _y, width, height) => {
            const fitBoardLength = Math.min(width, height);
            boardDimensions$.setDimensions({
                boardLength: fitBoardLength,
                cellLength: CellHelper.calculateCellLength(fitBoardLength),
            });
        });
    };

    // const setFontsAtom = useSetAtom(fontsAtom);

    // useAnimatedReaction(
    //     () => canvasSize.value,
    //     (value) => {
    //         console.log("Canvas size changed")
    //         // runOnJS(updateDimensions)();
    //
    //         // runOnJS(() => {
    //         //     dimensionsObservableStore$.updateDimensions({
    //         //         boardLength: boardLength,
    //         //         cellLength: cellLength,
    //         //     });
    //         // })
    //
    //         // runOnJS(dimensionsObservableStore$.updateDimensions)({
    //         //     boardLength: boardLength,
    //         //     cellLength: cellLength,
    //         // })
    //     },
    // );

    // useEffect(() => {
    // const boardLength = Math.min(canvasSize.width, canvasSize.height);
    // const cellLength = (boardLength - (BOARD_OUTLINE_WIDTH * 2) - (SUBGRID_OUTLINE_WIDTH * 2) - (CELL_OUTLINE_WIDTH * 6)) / 9;
    //
    // dimensionsObservableStore$.updateDimensions({
    //     boardLength: boardLength,
    //     cellLength: cellLength,
    // });

    // const boardLength = Math.min(canvasSize.width, canvasSize.height);
    // const cellLength = (boardLength - (BOARD_OUTLINE_WIDTH * 2) - (SUBGRID_OUTLINE_WIDTH * 2) - (CELL_OUTLINE_WIDTH * 6)) / 9;
    //
    // setBoardDimensionsAtom({
    //     boardLength,
    //     cellLength,
    // });

    // console.log({ s: Math.min(size.value.width, size.value.height), b: boardLength});

    // const numberFontSize = cellLength * 0.8;
    // const notesFontSize = (cellLength / 3) - CURSOR_CELL_OUTLINE_WIDTH;
    //
    // if (fontManager) {
    //   const numberFont = matchFont(
    //     { fontSize: numberFontSize, fontFamily: "SplineSansMonoRegular" },
    //     fontManager
    //   );
    //   const noteFont = matchFont(
    //     { fontSize: notesFontSize, fontFamily: "SplineSansMonoRegular" },
    //     fontManager
    //   );
    //
    //   setFontsAtom({
    //     numberFont: numberFont,
    //     notesFont: noteFont,
    //     numberFontSize: numberFontSize,
    //     notesFontSize: notesFontSize,
    //   });
    // }
    // }, [canvasSize, fontManager, setFontsAtom]);

    const panGesture = Gesture.Pan()
        .averageTouches(true)
        .onBegin((event) => {
            handleCursorMovementOnTouch({ x: event.x, y: event.y });
        })
        .onChange((event) => {
            handleCursorMovementOnTouch({ x: event.x, y: event.y });
        })
        .runOnJS(true);

    const handleCursorMovementOnTouch = (touchedPoint: Point) => {
        console.log(touchedPoint, boardDimensions.cellLength);

        const newGridPosition =
            GridPositionHelper.createFromPoint(touchedPoint);

        if (!newGridPosition) {
            // Out of bounds, do nothing
            return;
        }

        CellHelper.moveCursorTo(newGridPosition);
    };

    const renderCells = () => {
        const cells = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const gridPosition = GridPositionHelper.createFromIndexes(
                    colIndex,
                    rowIndex,
                );

                cells.push(
                    <Cell
                        key={GridPositionHelper.stringNotationOf(gridPosition)}
                        gridPosition={gridPosition}
                    />,
                );
            }
        }

        return cells;
    };

    return (
        <View
            ref={containerRef}
            onLayout={measureLayout}
            style={styles.canvasParentContainer}
        >
            <View
                style={[
                    styles.canvasContainer,
                    {
                        width: boardDimensions.boardLength,
                        height: boardDimensions.boardLength,
                    },
                ]}
            >
                <GestureDetector gesture={panGesture}>
                    <Canvas style={styles.canvas}>
                        {/*
                          Render order matters here:
                          - Elements listed earlier are drawn first / appear "behind"
                          - Elements listed later are drawn on top / appear "after / atop" the ones earlier
                          This is like z-index: later children overlay earlier ones
                        */}

                        <PeerCells />

                        {renderCells()}

                        {/*<Cell
                            gridPosition={GridPositionHelper.createFromIndexes(
                                4,
                                1,
                            )}
                        />
                        <Cell
                            gridPosition={GridPositionHelper.createFromIndexes(
                                2,
                                0,
                            )}
                        />*/}

                        <Dividers />

                        <CursorCell />
                    </Canvas>
                </GestureDetector>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
        backgroundColor: "black",
    },

    canvasContainer: {},

    canvasParentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
