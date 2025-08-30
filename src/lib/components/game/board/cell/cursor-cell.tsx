import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Rect } from "@shopify/react-native-skia";
import { BaseCell } from "./base-cell";


export const CursorCell = () => {
    const cursorGridPosition = useGameplayStore((state) => state.cursorGridPosition);

    // useStoreSubscription(
    //     useGameplayStore,
    //     (state) => state.cursorGridPosition,
    //     () => {
    //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
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
            gridPosition={cursorGridPosition}
            renderChildren={(boardDimensions, cellPointForGridPosition) => {
                return (
                    <Rect
                        x={cellPointForGridPosition.x}
                        y={cellPointForGridPosition.y}
                        width={boardDimensions.cellLength}
                        height={boardDimensions.cellLength}
                        style="stroke"
                        strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
                        color="red"
                    />
                )
            }} 
        />
    )
}