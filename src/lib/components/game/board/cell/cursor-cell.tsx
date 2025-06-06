import { CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { StyleSheet, View } from "react-native";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { useBoardCanvasContext } from "@/lib/components/game/board/board-context";
import { BaseCell } from "@/lib/components/game/board/cell/base-cell";

export const CursorCell = () => {
    const boardCanvas = useBoardCanvasContext();
    const cursorGridPosition = useGameplayStore((state) => state.cursorGridPosition);

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
        >
            <View style={styles.cursorBackground}/>
        </BaseCell>
    )
}

const styles = StyleSheet.create({
    cursor: {
        position: 'absolute',
        outlineWidth: CELL_OUTLINE_WIDTH,
        outlineColor: '#F0B719'
    },
    cursorBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#221A00',
        zIndex: -1
    }
})