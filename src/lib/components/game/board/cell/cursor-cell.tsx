import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Rect } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { BaseCell } from "./base-cell";

export const CursorCell = () => {
    const cursorGridPosition = useGameplayStore(
        (state) => state.cursorGridPosition
    );

    useStoreSubscription(
        useGameplayStore,
        (state) => state.cursorGridPosition,
        () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        },
        {
            equalityFn: GridPositionHelper.notChanged,
        }
    );

    if (!cursorGridPosition) {
        return null;
    }

    return (
        <BaseCell
            gridPosition={cursorGridPosition}
            renderChildren={(boardDimensions, cellPointForGridPosition) => {
                const halfOfStrokeWidth = CURSOR_CELL_OUTLINE_WIDTH / 2;

                return (
                    <Rect
                        x={cellPointForGridPosition.x + halfOfStrokeWidth}
                        y={cellPointForGridPosition.y + halfOfStrokeWidth}
                        width={boardDimensions.cellLength - CURSOR_CELL_OUTLINE_WIDTH}
                        height={boardDimensions.cellLength - CURSOR_CELL_OUTLINE_WIDTH}
                        style="stroke"
                        strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
                        color="red"
                    />
                );
            }}
        />
    );
};
