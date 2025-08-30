import { CURSOR_CELL_OUTLINE_WIDTH } from "@/lib/constants/board";
import { BoardHelper } from "@/lib/helpers/board-helper";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { useStoreSubscription } from "@/lib/hooks/use-store-subscription";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { Group, Rect } from "@shopify/react-native-skia";
import { JSX, useRef, useState } from "react";
import { BaseCell, CommonCellProps } from "./base-cell";

export const RelatedCells = () => {
//   const cursorGridPosition = useGameplayStore(
//     (state) => state.cursorGridPosition
//   );
  const processorAbortControllerRef = useRef(new AbortController());

  const [relatedCells, setRelatedCells] = useState<JSX.Element[]>([]);

  useStoreSubscription(
    useGameplayStore,
    (state) => state.cursorGridPosition,
    (newCursorGridPosition) => {
      if (!newCursorGridPosition) {
        setRelatedCells([]);
        return;
      }

      const numberValueAtCursor = CellHelper.getNumberValueAtCursor();
      const cells: JSX.Element[] = [];

      BoardHelper.processEachPeerAndNonPeerCell(
        {
          value: numberValueAtCursor,
          gridPosition: newCursorGridPosition,
        },
        (peerGridPosition, peerType) => {
          cells.push(
            <RelatedCell
              key={`rc-${GridPositionHelper.stringNotationOf(
                peerGridPosition
              )}`}
              gridPosition={peerGridPosition}
            />
          );
        },
      );

      setRelatedCells(cells);
    },
    {
      equalityFn: GridPositionHelper.notChanged,
    }
  );

  // useEffect(() => {
  //     if (!cursorGridPosition) {
  //         setRelatedCells([]);
  //         return;
  //     }

  //     const numberValueAtCursor = CellHelper.getNumberValueAtCursor();
  //     const cells: JSX.Element[] = [];

  //     BoardHelper.processEachPeerAndNonPeerCell(
  //         {
  //             value: numberValueAtCursor,
  //             gridPosition: cursorGridPosition,
  //         },
  //         (peerGridPosition, peerType) => {
  //             cells.push(
  //                 <RelatedCell
  //                     key={`rc-${GridPositionHelper.stringNotationOf(peerGridPosition)}`}
  //                     gridPosition={peerGridPosition}
  //                 />
  //             )
  //         },
  //         undefined,
  //         undefined,
  //         processorAbortControllerRef.current.signal
  //     );

  //     setRelatedCells(cells);

  //     return () => {
  //         processorAbortControllerRef.current.abort();

  //         processorAbortControllerRef.current = new AbortController();
  //     }
  // }, [cursorGridPosition]);

  return <Group>{relatedCells}</Group>;
};

const RelatedCell = ({ gridPosition }: CommonCellProps) => {
  return (
    <BaseCell
      gridPosition={gridPosition}
      renderChildren={(boardDimensions, cellPointForGridPosition) => {
        return (
          <Rect
            x={cellPointForGridPosition.x}
            y={cellPointForGridPosition.y}
            width={boardDimensions.cellLength}
            height={boardDimensions.cellLength}
            style="fill"
            strokeWidth={CURSOR_CELL_OUTLINE_WIDTH}
            color="red"
            opacity={0.2}
          />
        );
      }}
    />
  );
};
