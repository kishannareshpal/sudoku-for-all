import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { PointHelper } from "@/lib/helpers/point-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Rect } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";

export const CursorCell = () => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const cursorGridPosition = useGameplayStore((state) => state.cursorGridPosition);

    const cellPoint = PointHelper.createFromGridPosition(
        cursorGridPosition,
        cellLength,
    )

    useStoreSubscription(
        useGameplayStore,
        (state) => state.cursorGridPosition,
        () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        },
        { equalityFn: GridPositionHelper.notChanged },
    );

    if (!cursorGridPosition) {
        return null;
    }

    return (
        <Rect
            x={cellPoint.x}
            y={cellPoint.y}
            width={cellLength}
            height={cellLength}
            strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
            style="stroke"
            color="orange"
        />
    );
};
