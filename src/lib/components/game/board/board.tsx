import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { Point } from "@/lib/shared-types";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { fontsAtom } from "@/lib/store/atoms/fonts-atom";
import {
  Canvas,
  matchFont,
  useCanvasSize,
  useFonts,
} from "@shopify/react-native-skia";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Cell } from "./cell/cell";
import { CursorCell } from "./cell/cursor-cell";
import { Dividers } from "./cell/dividers";
import { RelatedCells } from "./cell/related-cells";

export const Board = () => {
  const { ref, size: canvasSize } = useCanvasSize();

  const [boardDimensions, setBoardDimensionsAtom] = useAtom(boardDimensionsAtom);
  const setFontsAtom = useSetAtom(fontsAtom);

  const fontManager = useFonts({
    SplineSansMonoRegular: [
      require("@assets/fonts/spline-sans-mono-regular.ttf"),
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
      const numberFont = matchFont(
        { fontSize: numberFontSize, fontFamily: "SplineSansMonoRegular" },
        fontManager
      );
      const noteFont = matchFont(
        { fontSize: notesFontSize, fontFamily: "SplineSansMonoRegular" },
        fontManager
      );

      setFontsAtom({
        numberFont: numberFont,
        notesFont: noteFont,
        numberFontSize: numberFontSize,
        notesFontSize: notesFontSize,
      });
    }
  }, [canvasSize, fontManager, setBoardDimensionsAtom, setFontsAtom]);

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
    const newGridPosition = GridPositionHelper.createFromPoint(
      touchedPoint,
      boardDimensions.cellLength
    );

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
          rowIndex,
          colIndex
        );

        cells.push(
          <Cell
            key={GridPositionHelper.stringNotationOf(gridPosition)}
            gridPosition={gridPosition}
          />
        );
      }
    }

    return cells;
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Canvas ref={ref} style={styles.container}>
        {/* 
          Render order matters here:
          - Elements listed earlier are drawn first / appear "behind"
          - Elements listed later are drawn on top / appear "after / atop" the ones earlier
          This is like z-index: later children overlay earlier ones 
        */}
        
        <RelatedCells />

        {renderCells()}

        <Dividers />


        <CursorCell />
      </Canvas>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: "transparent",
  },

  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});
