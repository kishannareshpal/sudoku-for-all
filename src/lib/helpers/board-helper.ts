import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { GridPosition } from "../shared-types";
import { gameplayStoreState } from "../store/gameplay-store";
import { CellHelper } from "./cell-helper";
import { GridPositionHelper } from "./grid-position-helper";
import { SubgridPositionHelper } from "./sub-grid-position-helper";

/**
 * The type of peer found during the processing via {@link BoardHelper.processEachPeerAndNonPeerCell}
 */
type PeerType = 'note' | 'number' | 'both';

type ProcessEachPeerAndNonPeerCellOptions = {
    /**
     * A boolean flag to allow the current cell to be considered as a peer (default is `true`).
     */
    allowSelfAsPeer?: boolean,
    /**
     * A boolean flag to allow peers from the same row (default is `true`).
     */
    allowRowPeers?: boolean,
    /**
     * A boolean flag to allow peers from the same column (default is `true`).
     */
    allowColumnPeers?: boolean,
    /**
     * A boolean flag to allow peers from the same subgrid (default is `true`).
     */
    allowSubgridPeers?: boolean,
    /**
     * A boolean flag to allow peers that have the same value as the current cell - ignoring row or column sameness (default is `true`).
     */
    allowSameValueAnywherePeers?: boolean,

    /**
     * A boolean flag to allow peers that have the same note value as the current cell?
     * 
     * @todo - Implement
     */
    allowSameValueAsNoteAnywherePeers?: boolean
}

export class BoardHelper {
    /**
     * Processes each peer and non-peer number cell for a given value and location in the board.
     * 
     * This method iterated over the entire grid and applies conditions (such as row, column, grid, note or value) to identify which cells are or aren't peers.
     * - For each peer cell, the optional `peerFoundCallback` method is triggered and for a non-peer cell, the optional `nonPeerFoundCallback` method is triggered.
     * 
     * @param cell - The cell metadata being compared across the grid.
     * @param options - Options
     * @param peerFoundCallback - A callback method that gets called for each peer cell with some metadata of itself.
     * @param nonPeerFoundCallback  - An optional method that gets called for each non-peer cell with some metadata of itself.
     */
    static processEachPeerAndNonPeerCell(
        cell: { value: number, gridPosition: GridPosition },
        peerFoundCallback?: (peerGridPosition: GridPosition, peerType: PeerType) => void,
        nonPeerFoundCallback?: (nonPeerGridPosition: GridPosition) => void,
        options?: ProcessEachPeerAndNonPeerCellOptions,
    ): void {
        const puzzle = gameplayStoreState().puzzle;

        const defaultedOptions: ProcessEachPeerAndNonPeerCellOptions = {
            allowSelfAsPeer: options?.allowSelfAsPeer ?? true,
            allowRowPeers: options?.allowRowPeers ?? true,
            allowColumnPeers: options?.allowColumnPeers ?? true,
            allowSubgridPeers: options?.allowSubgridPeers ?? true,
            allowSameValueAnywherePeers: options?.allowSameValueAnywherePeers ?? true,
            allowSameValueAsNoteAnywherePeers: options?.allowSameValueAsNoteAnywherePeers ?? true
        }

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {

                const currentGridPosition = GridPositionHelper.createFromIndexes(rowIndex, colIndex);

                // Check note peer condition
                const hasNotePeer = (
                    defaultedOptions.allowColumnPeers
                        && CellHelper.isValueEmpty(cell.value)
                        && CellHelper.areNotesNotEmptyAt(cell.gridPosition, puzzle?.notes)
                )
                    ? CellHelper.containsToggledNoteAt(currentGridPosition, cell.value)
                    : false;

                const peerFoundType: PeerType = hasNotePeer ? 'both' : 'number';

                // Handle if the current iterating self is itself
                const isItself = GridPositionHelper.equals(currentGridPosition, cell.gridPosition);
                if (isItself) {
                    // If it's itself and it's allowed to be considered as a peer, behave as such, otherwise
                    // return as not being one.
                    if (defaultedOptions.allowSelfAsPeer) {
                        peerFoundCallback?.(currentGridPosition, peerFoundType);
                    } else {
                        nonPeerFoundCallback?.(currentGridPosition);
                    }

                    continue;
                }

                // Check row, column and sub-grid peer conditions
                const isSameRow = defaultedOptions.allowRowPeers && GridPositionHelper.equalRow(currentGridPosition, cell.gridPosition);
                if (isSameRow) {
                    peerFoundCallback?.(currentGridPosition, peerFoundType);
                    continue;
                }

                const isSameCol = defaultedOptions.allowColumnPeers && GridPositionHelper.equalColumn(currentGridPosition, cell.gridPosition);
                if (isSameCol) {
                    peerFoundCallback?.(currentGridPosition, peerFoundType);
                    continue;
                }

                const isSameSubgrid = defaultedOptions.allowSubgridPeers && SubgridPositionHelper.equalsFromGridPositions(
                    currentGridPosition, cell.gridPosition
                )
                if (isSameSubgrid) {
                    peerFoundCallback?.(currentGridPosition, peerFoundType);
                    continue;
                }

                // Check the same value anywhere peer condition
                const isSameValueButNotEmpty = defaultedOptions.allowSameValueAnywherePeers && CellHelper.isNumberValueEqualAt(
                    currentGridPosition,
                    cell.value,
                    puzzle?.player,
                    puzzle?.given,
                    { considerEmptyAsEqual: false }
                );
                if (isSameValueButNotEmpty) {
                    peerFoundCallback?.(currentGridPosition, peerFoundType);
                    continue;
                }

                // Only has a peer note
                if (hasNotePeer && defaultedOptions.allowSameValueAnywherePeers) {
                    peerFoundCallback?.(currentGridPosition, 'note');
                    continue;
                }

                // Did not match any conditions, so not a peer
                nonPeerFoundCallback?.(currentGridPosition);
            }
        }
    }
}
