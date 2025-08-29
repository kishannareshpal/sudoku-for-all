import { useBoardGraphicsContext } from "@/lib/components/game/board/board-graphics-context";
import { BaseCell } from "@/lib/components/game/board/cell/base-cell";
import { CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from "react-native";


export const CursorCell = () => {
    const boardCanvas = useBoardGraphicsContext();
    const cursorGridPosition = useGameplayStore((state) => state.cursorGridPosition);

    useStoreSubscription(
        useGameplayStore,
        (state) => state.cursorGridPosition,
        () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
        },
        {
            equalityFn: GridPositionHelper.notChanged
        }
    )

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
        borderWidth: CELL_OUTLINE_WIDTH,
        borderColor: '#F0B719'
    },
    cursorBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#221A00',
        zIndex: -1
    }
})
