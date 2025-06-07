import { useBoardCanvasContext } from "@/lib/components/game/board/board-context";
import { BoardWrapper } from "@/lib/components/game/board/board-wrapper";
import { Cell } from "@/lib/components/game/board/cell/cell";
import { CursorCell } from "@/lib/components/game/board/cell/cursor-cell";
import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { Point, Puzzle } from "@/lib/shared-types";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BoardCellDivisions } from "./board-cell-divisions";

type BoardProps = {
    puzzle: Puzzle
}

export const Board = (
    {puzzle}: BoardProps
) => {
    return (
        <View style={{flex: 1}}>
            <BoardWrapper>
                <PuzzleScene puzzle={puzzle}/>
            </BoardWrapper>
        </View>
    )
}

type PuzzleSceneProps = {
    puzzle: Puzzle
}

const PuzzleScene = ({puzzle}: PuzzleSceneProps) => {
    const boardCanvas = useBoardCanvasContext();

    const panGesture = Gesture
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

        if (!newGridPosition) {
            // Out of bounds, do nothing
            return;
        }

        CellHelper.moveCursorTo(newGridPosition);
    }

    const renderGrid = () => {
        const rows = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            const columnCells = [];

            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const playerValue = puzzle.player[rowIndex][colIndex];
                const givenValue = puzzle.given[rowIndex][colIndex];
                const notesValue = puzzle.notes[rowIndex][colIndex] ?? [];

                columnCells.push(
                    <Cell
                        key={rowIndex + '-' + colIndex}
                        col={colIndex}
                        row={rowIndex}
                        value={givenValue || playerValue}
                        notes={notesValue}
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

    return (
        <GestureDetector gesture={panGesture}>
            <View style={styles.container}>
                {renderGrid()}

                <BoardCellDivisions/>

                <CursorCell/>
            </View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
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
