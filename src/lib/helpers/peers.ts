import { COLUMNS_COUNT, ROWS_COUNT } from "../constants/board";
import { GridPosition, PeerCellMetadata, PeerType, Puzzle } from "../shared-types";
import { GridPositionHelper } from "./grid-position-helper";
import { SubgridPositionHelper } from "./sub-grid-position-helper";
import { getNumberValueAt, isNoteValueToggledAt, isNumberValueEqualAt } from "./values";

type ProcessEachPeerAndNonPeerCellOptions = {
    /**
     * A boolean flag to allow the current cell to be considered as a peer (default is `true`).
     */
    allowSelfAsPeer?: boolean;
    /**
     * A boolean flag to allow peers from the same row (default is `true`).
     */
    allowRowPeers?: boolean;
    /**
     * A boolean flag to allow peers from the same column (default is `true`).
     */
    allowColumnPeers?: boolean;
    /**
     * A boolean flag to allow peers from the same subgrid (default is `true`).
     */
    allowSubgridPeers?: boolean;
    /**
     * A boolean flag to allow peers that have the same value as the current cell - ignoring row or column sameness (default is `true`).
     */
    allowSameValueAnywherePeers?: boolean;

    // /**
    //  * A boolean flag to allow peers that have the same note value as the current cell?
    //  *
    //  * @todo - Implement
    //  */
    // allowSameValueAsNoteAnywherePeers?: boolean
};

/**
 * Processes each peer and non-peer number cell for a given value and location in the board.
 *
 * This method iterated over the entire grid and applied conditions (such as row, column, grid, note or value) to identify which cells are or aren't peers.
 * - For each peer cell, the optional `peerFoundCallback` method is triggered, and for a non-peer cell, the optional `nonPeerFoundCallback` method is triggered.
 *
 * @param cellPosition - The grid position of the cell being compared across the grid.
 * @param options - Options
 * @param peerFoundCallback - A callback method that gets called for each peer cell with some metadata of itself.
 * @param nonPeerFoundCallback  - An optional method that gets called for each non-peer cell with some metadata of itself.
 */
export const processEachPeerAndNonPeerCell = (
    puzzle: Puzzle,
    cellPosition: GridPosition,
    peerFoundCallback?: (peerCellMetadata: PeerCellMetadata) => void,
    nonPeerFoundCallback?: (nonPeerGridPosition: GridPosition) => void,
    options?: ProcessEachPeerAndNonPeerCellOptions,
): void => {
    const defaultedOptions: ProcessEachPeerAndNonPeerCellOptions = {
        allowSelfAsPeer: options?.allowSelfAsPeer ?? true,
        allowRowPeers: options?.allowRowPeers ?? true,
        allowColumnPeers: options?.allowColumnPeers ?? true,
        allowSubgridPeers: options?.allowSubgridPeers ?? true,
        allowSameValueAnywherePeers:
            options?.allowSameValueAnywherePeers ?? true,
        // allowSameValueAsNoteAnywherePeers: options?.allowSameValueAsNoteAnywherePeers ?? true
    };

    const cellValue = getNumberValueAt({ position: cellPosition, playerGridNotation: puzzle.player, givenGridNotation: puzzle.given });

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
        for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
            const currentGridPosition =
                GridPositionHelper.createFromIndexes({ rowIndex, colIndex });

            // Check note peer condition
            const hasNotePeer = isNoteValueToggledAt({
                position: currentGridPosition,
                value: cellValue,
                notesGridNotation: puzzle.notes,
            });

            const peerFoundType: PeerType = hasNotePeer ? "both" : "number";

            // Handle if the current iterating self is itself
            const isItself = GridPositionHelper.equals(
                currentGridPosition,
                cellPosition,
            );
            if (isItself) {
                // If it's itself, and it's allowed to be considered as a peer, behave as such, otherwise
                // return as not being one.
                if (defaultedOptions.allowSelfAsPeer) {
                    peerFoundCallback?.({
                        gridPosition: currentGridPosition,
                        type: peerFoundType,
                    });
                } else {
                    nonPeerFoundCallback?.(currentGridPosition);
                }

                continue;
            }

            // Check row, column and sub-grid peer conditions
            const isSameRow =
                defaultedOptions.allowRowPeers &&
                GridPositionHelper.equalRow(
                    currentGridPosition,
                    cellPosition,
                );
            if (isSameRow) {
                peerFoundCallback?.({
                    gridPosition: currentGridPosition,
                    type: peerFoundType,
                });
                continue;
            }

            const isSameCol =
                defaultedOptions.allowColumnPeers &&
                GridPositionHelper.equalColumn(
                    currentGridPosition,
                    cellPosition,
                );
            if (isSameCol) {
                peerFoundCallback?.({
                    gridPosition: currentGridPosition,
                    type: peerFoundType,
                });
                continue;
            }

            const isSameSubgrid =
                defaultedOptions.allowSubgridPeers &&
                SubgridPositionHelper.equalsFromGridPositions(
                    currentGridPosition,
                    cellPosition,
                );
            if (isSameSubgrid) {
                peerFoundCallback?.({
                    gridPosition: currentGridPosition,
                    type: peerFoundType,
                });
                continue;
            }

            // Check the same value anywhere peer condition
            const isSameValueButNotEmpty =
                defaultedOptions.allowSameValueAnywherePeers &&
                isNumberValueEqualAt(
                    {
                        position: currentGridPosition,
                        value: cellValue,
                        playerGridNotation: puzzle.player,
                        givenGridNotation: puzzle.given,
                    },
                    { considerEmptyAsEqual: false },
                );
            if (isSameValueButNotEmpty) {
                peerFoundCallback?.({
                    gridPosition: currentGridPosition,
                    type: peerFoundType,
                });
                continue;
            }

            // Only has a peer note
            if (
                hasNotePeer &&
                defaultedOptions.allowSameValueAnywherePeers
            ) {
                peerFoundCallback?.({
                    gridPosition: currentGridPosition,
                    type: "note",
                });
                continue;
            }

            // Did not match any conditions, so not a peer
            nonPeerFoundCallback?.(currentGridPosition);
        }
    }
}
