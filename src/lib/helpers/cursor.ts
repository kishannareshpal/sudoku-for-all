import { GridPosition, PeerCellMetadata, Point } from "../shared-types";
import { gameplayStoreState } from "../store/gameplay";
import { GridPositionHelper } from "./grid-position-helper";
import { processEachPeerAndNonPeerCell } from "./peers";

export const moveCursorTo = (
    { position }: { position: GridPosition }
): void => {
    const state = gameplayStoreState();

    if (!state.puzzle) {
        return;
    }

    if (GridPositionHelper.isOutOfBounds(position)) {
        return;
    }

    const relatedCellsGridPositions: PeerCellMetadata[] = [];
    processEachPeerAndNonPeerCell(state.puzzle, position, (peerCellMetadata) => {
        relatedCellsGridPositions.push(peerCellMetadata);
    });

    state.setCursorPeerCells(relatedCellsGridPositions);
    state.setCursorGridPosition(position);
}

export const moveCursorToPoint = (
    params: {
        point: Point,
        cellLength: number
    }
): void => {
    const nextPosition = GridPositionHelper.createFromPoint(params.point, params.cellLength);
    if (!nextPosition) {
        // Out of bounds, do nothing
        return;
    }

    moveCursorTo({ position: nextPosition });
}