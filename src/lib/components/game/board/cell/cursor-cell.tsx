import { BOARD_OUTLINE_WIDTH } from "@/lib/constants/board";
import { StyleSheet } from "react-native";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { useBoardCanvasContext } from "@/lib/components/game/board/board-context";
import { BaseCell } from "@/lib/components/game/board/cell/base-cell";

export const CursorCell = () => {
    const boardCanvas = useBoardCanvasContext();
    const {cursorGridPosition} = useGameplayStore();

    // TODO: Haptic feedback
    // useStoreSubscription(
    //     useGameplayStore,
    //     (state) => state.cursorGridPosition,
    //     () => {
    //         Haptics.selectionAsync().catch()
    //     },
    //     {
    //         equalityFn: GridPositionHelper.notChanged
    //     }
    // )

    if (!cursorGridPosition) {
        return null;
    }

    return (
        <BaseCell
            row={cursorGridPosition.row}
            col={cursorGridPosition.col}
            style={[
                styles.cursor,
                {
                    top: boardCanvas.cellLength * cursorGridPosition.row,
                    left: boardCanvas.cellLength * cursorGridPosition.col,
                }
            ]}
        />
    )
}

const styles = StyleSheet.create({
    cursor: {
        position: 'absolute',
        backgroundColor: '#221A00',
        outlineWidth: BOARD_OUTLINE_WIDTH,
        outlineColor: '#F0B719'
    }
})