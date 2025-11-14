import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { graphicsStoreState } from "@/lib/store/board";
import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { withUniwind } from 'uniwind';
import { Cell } from "./cell/cell";
import { Dividers } from "./cell/dividers";

const StyledCanvas = withUniwind(Canvas);

export const Board = () => {
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

    const panGesture = Gesture.Pan()
        .averageTouches(true)
        .onBegin((event) => {
            CellHelper.moveCursorToPoint(event);
            console.log("Loaded board!", graphicsStoreState());
        })
        .onChange((event) => {
            CellHelper.moveCursorToPoint(event);
        })
        .runOnJS(true);

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
        <GestureDetector gesture={panGesture}>
            <StyledCanvas className="flex-1">
                {/*
                Render order matters here:
                - Elements listed earlier are drawn first / appear "behind"
                - Elements listed later are drawn on top / appear "after / atop" the ones earlier
                This is like z-index: later children overlay earlier ones
            */}

                {/* <PeerCells /> */}

                {renderCells()}

                <Dividers />

                {/* <CursorCell /> */}
            </StyledCanvas>
        </GestureDetector>
    );
};
