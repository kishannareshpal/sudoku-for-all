import { BOARD_OUTLINE_WIDTH, COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Point } from "@/lib/shared-types";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { gameplayStoreState } from "@/lib/store/gameplay-store";
import { useBoardCanvasContext } from "@/lib/components/game/board/board-context";
import { BoardWrapper } from "@/lib/components/game/board/board-wrapper";
import { Cell } from "@/lib/components/game/board/cell/cell";
import { CursorCell } from "@/lib/components/game/board/cell/cursor-cell";

export const Board = () => {
    return (
        <View style={{flex: 1}}>
            <BoardWrapper>
                <BoardContent/>
            </BoardWrapper>
        </View>
    )
}

const BoardContent = () => {
    const boardCanvas = useBoardCanvasContext();

    const [notes, setNotes] = useState<number[]>([]);
    const [value, setValue] = useState<number>(0);

    const renderGrid = () => {
        const rows = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            const columnCells = [];

            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                columnCells.push(
                    <Cell
                        key={rowIndex + '-' + colIndex}
                        row={rowIndex}
                        col={colIndex}
                        value={value}
                        notes={notes}
                    />
                );
            }

            rows.push(
                <View key={rowIndex} style={styles.gridRow}>
                    {columnCells}
                </View>
            )
        }

        return (
            <View style={styles.gridContainer}>
                {rows}
            </View>
        );
    }

    const tapGesture = Gesture
        .Pan()
        .averageTouches(true)
        .onBegin((event) => {
            handleCursorMovementOnTouch({x: event.x, y: event.y})
        })
        .onChange((event) => {
            handleCursorMovementOnTouch({x: event.x, y: event.y})
        })
        .runOnJS(true);

    const handleCursorMovementOnTouch = (touchedPoint: Point) => {
        const newGridPosition = GridPositionHelper.createFromPoint(
            touchedPoint,
            boardCanvas.cellLength,
        )

        gameplayStoreState().moveCursorTo(newGridPosition);
    }

    return (
        <GestureDetector gesture={tapGesture}>
            <View style={styles.container}>
                {renderGrid()}

                <CursorCell/>
            </View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        outlineWidth: BOARD_OUTLINE_WIDTH,
        outlineColor: '#3D2E00'
    },

    gridContainer: {
        flex: 1,
        flexDirection: 'row'
    },

    gridRow: {
        flex: 1,
        flexDirection: 'column'
    }
})
