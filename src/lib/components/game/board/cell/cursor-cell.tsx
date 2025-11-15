import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Rect } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { BaseCell } from "./base-cell";

export const CursorCell = () => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength)
    const cursorGridPosition = useGameplayStore(
        (state) => state.cursorGridPosition,
    );

    useStoreSubscription(
        useGameplayStore,
        (state) => state.cursorGridPosition,
        () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        },
        {
            equalityFn: GridPositionHelper.notChanged,
        },
    );

    const strokeWidth = CURSOR_CELL_OUTLINE_WIDTH;
    const halfOfStrokeWidth = strokeWidth / 2;

    if (!cursorGridPosition) {
        return null;
    }

    return (
        <BaseCell
            gridPosition={cursorGridPosition}
            renderChildren={(cellPointForGridPosition) => {
                // const cellLength =
                //     boardDimensions.cellLengthWithBorderSpacing - CURSOR_CELL_OUTLINE_WIDTH;

                return (
                    <Rect
                        x={cellPointForGridPosition.x + halfOfStrokeWidth}
                        y={cellPointForGridPosition.y + halfOfStrokeWidth}
                        width={cellLength}
                        height={cellLength}
                        style="stroke"
                        strokeWidth={strokeWidth}
                        color="red"
                    />
                );
            }}
        />
    );
};
