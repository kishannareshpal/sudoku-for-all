import {
    COLUMNS_COUNT,
    ROWS_COUNT
} from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import {
    BoardGridNotation,
    BoardGridNotationValue,
    BoardNotesGridNotation,
    BoardNotesGridNotationValue,
    EntryMode,
    ForceToggleOperation,
    GridPosition,
    PeerCellMetadata,
    PeerType,
    Point,
} from "@/lib/shared-types";
import { gameplayStoreState } from "@/lib/store/gameplay";

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

export class CellHelper {
    static getToggledNotesAtCursor(
        notesGridNotation:
            | BoardNotesGridNotation
            | undefined = gameplayStoreState().puzzle?.notes,
    ): BoardNotesGridNotationValue {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;
        return this.getToggledNotesAt(cursorGridPosition, notesGridNotation);
    }

    static getToggledNotesAt(
        gridPosition: GridPosition,
        notesGridNotation:
            | BoardNotesGridNotation
            | undefined = gameplayStoreState().puzzle?.notes,
    ): BoardNotesGridNotationValue {
        if (!notesGridNotation) {
            return [];
        }

        return notesGridNotation[gridPosition.row][gridPosition.col];
    }

    static getNumberValueAtCursor(
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.player,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
    ): BoardGridNotationValue {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;
        return this.getNumberValueAt(
            cursorGridPosition,
            playerGridNotation,
            givenGridNotation,
        );
    }

    static getNumberValueAt(
        gridPosition: GridPosition,
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.player,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
    ): BoardGridNotationValue {
        return (
            givenGridNotation?.[gridPosition.row][gridPosition.col] ||
            playerGridNotation?.[gridPosition.row][gridPosition.col] ||
            0
        );
    }

    static moveCursorTo(gridPosition: GridPosition): void {
        const store = gameplayStoreState();

        if (GridPositionHelper.isOutOfBounds(gridPosition)) {
            return;
        }

        const relatedCellsGridPositions: PeerCellMetadata[] = [];
        this.processEachPeerAndNonPeerCell(gridPosition, (peerCellMetadata) => {
            relatedCellsGridPositions.push(peerCellMetadata);
        });

        store.updateCursorPeerCells(relatedCellsGridPositions);
        store.updateCursorGridPosition(gridPosition);
    }

    static moveCursorToPoint(point: Point): void {
        const newGridPosition = GridPositionHelper.createFromPoint(point);
        if (!newGridPosition) {
            // Out of bounds, do nothing
            return;
        }

        CellHelper.moveCursorTo(newGridPosition);
    }

    static applyHintAt(gridPosition: GridPosition): void { }

    static eraseAt(gridPosition: GridPosition): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (!this.isEraseableAt(gridPosition, store.puzzle.given)) {
            return;
        }

        store.erasePlayerValueAt(gridPosition);
    }

    static eraseAtCursor(): void {
        const state = gameplayStoreState();
        const cursorGridPosition = state.cursorGridPosition;
        this.eraseAt(cursorGridPosition);
    }

    static changePlayerValueAtCursorTo(value: BoardGridNotationValue): void {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;

        this.changePlayerValueAt(cursorGridPosition, value);
    }

    static toggleCursorMode(mode?: EntryMode): void {
        const store = gameplayStoreState();

        const nextCursorMode =
            (mode ?? store.entryMode === "number") ? "note" : "number";
        gameplayStoreState().setEntryMode(nextCursorMode);
    }

    static changePlayerValueAt(
        gridPosition: GridPosition,
        value: BoardGridNotationValue,
    ): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (!this.isEditableAt(gridPosition, store.puzzle.given)) {
            return;
        }

        store.updatePlayerValueAt(gridPosition, value);
    }

    static toggleNotesValueAtCursor(
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
    ): void {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;

        this.toggleNotesValueAt(cursorGridPosition, notes, forceOperation);
    }

    static toggleNotesValueAt(
        gridPosition: GridPosition,
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
    ): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (
            !this.isAnnotatableAt(
                gridPosition,
                store.puzzle.given,
                store.puzzle.player,
            )
        ) {
            return;
        }

        store.toggleNotesValueAt(gridPosition, notes, forceOperation);
    }

    static isAnnotatableAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.player,
    ): boolean {
        if (!givenGridNotation || !playerGridNotation) {
            return false;
        }

        if (this.isStaticAt(gridPosition, givenGridNotation)) {
            return false;
        }

        // Is only annotatable if a final number has not been placed at this position yet
        return this.isValueEmpty(
            playerGridNotation[gridPosition.row][gridPosition.col],
        );
    }

    static isEraseableAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
    ): boolean {
        if (!givenGridNotation) {
            return false;
        }

        return this.isEditableAt(gridPosition, givenGridNotation);
    }

    static isEditableAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
    ): boolean {
        if (!givenGridNotation) {
            return false;
        }

        return this.isValueEmpty(
            givenGridNotation[gridPosition.row][gridPosition.col],
        );
    }

    static isStaticAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
    ): boolean {
        if (!givenGridNotation) {
            return true;
        }

        return this.isValueNotEmpty(
            givenGridNotation[gridPosition.row][gridPosition.col],
        );
    }

    static isNumberValueEqualAt(
        gridPosition: GridPosition,
        value: number,
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.player,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
        options?: { considerEmptyAsEqual: boolean },
    ): boolean {
        options ||= { considerEmptyAsEqual: false };

        const valueAtGridPosition =
            playerGridNotation?.[gridPosition.row][gridPosition.col] ||
            givenGridNotation?.[gridPosition.row][gridPosition.col] ||
            0;
        const same = valueAtGridPosition === value;

        if (options.considerEmptyAsEqual) {
            return same;
        }

        return same && CellHelper.isValueNotEmpty(valueAtGridPosition);
    }

    static isValueEmptyAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.player,
    ): boolean {
        return (
            this.isValueNotEmpty(
                givenGridNotation?.[gridPosition.row][gridPosition.col],
            ) ||
            this.isValueNotEmpty(
                playerGridNotation?.[gridPosition.row][gridPosition.col],
            )
        );
    }

    static isValueNotEmptyAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.given,
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState()
            .puzzle?.player,
    ): boolean {
        return !this.isValueEmptyAt(
            gridPosition,
            givenGridNotation,
            playerGridNotation,
        );
    }

    static isValueEmpty(value: number | undefined | null): boolean {
        return !value;
    }

    static isValueNotEmpty(value: number | undefined | null): boolean {
        return !this.isValueEmpty(value);
    }

    static areNotesEmptyAt(
        gridPosition: GridPosition,
        notesGridNotation:
            | BoardNotesGridNotation
            | undefined = gameplayStoreState().puzzle?.notes,
    ): boolean {
        if (!notesGridNotation) {
            return true;
        }

        return !notesGridNotation[gridPosition.row][gridPosition.col].length;
    }

    static areNotesNotEmptyAt(
        gridPosition: GridPosition,
        notesGridNotation:
            | BoardNotesGridNotation
            | undefined = gameplayStoreState().puzzle?.notes,
    ): boolean {
        return this.areNotesEmptyAt(gridPosition, notesGridNotation);
    }

    static containsToggledNoteAt(
        gridPosition: GridPosition,
        noteValue: number,
        notesGridNotation:
            | BoardNotesGridNotation
            | undefined = gameplayStoreState().puzzle?.notes,
    ): boolean {
        if (!notesGridNotation) {
            return false;
        }

        return notesGridNotation[gridPosition.row][gridPosition.col].includes(
            noteValue,
        );
    }

    /**
     * Processes each peer and non-peer number cell for a given value and location in the board.
     *
     * This method iterated over the entire grid and applied conditions (such as row, column, grid, note or value) to identify which cells are or aren't peers.
     * - For each peer cell, the optional `peerFoundCallback` method is triggered, and for a non-peer cell, the optional `nonPeerFoundCallback` method is triggered.
     *
     * @param cellGridPosition - The grid position of the cell being compared across the grid.
     * @param options - Options
     * @param peerFoundCallback - A callback method that gets called for each peer cell with some metadata of itself.
     * @param nonPeerFoundCallback  - An optional method that gets called for each non-peer cell with some metadata of itself.
     */
    static processEachPeerAndNonPeerCell(
        cellGridPosition: GridPosition,
        peerFoundCallback?: (peerCellMetadata: PeerCellMetadata) => void,
        nonPeerFoundCallback?: (nonPeerGridPosition: GridPosition) => void,
        options?: ProcessEachPeerAndNonPeerCellOptions,
    ): void {
        const puzzle = gameplayStoreState().puzzle;

        const defaultedOptions: ProcessEachPeerAndNonPeerCellOptions = {
            allowSelfAsPeer: options?.allowSelfAsPeer ?? true,
            allowRowPeers: options?.allowRowPeers ?? true,
            allowColumnPeers: options?.allowColumnPeers ?? true,
            allowSubgridPeers: options?.allowSubgridPeers ?? true,
            allowSameValueAnywherePeers:
                options?.allowSameValueAnywherePeers ?? true,
            // allowSameValueAsNoteAnywherePeers: options?.allowSameValueAsNoteAnywherePeers ?? true
        };

        const cellValue = CellHelper.getNumberValueAt(cellGridPosition);

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const currentGridPosition =
                    GridPositionHelper.createFromIndexes(colIndex, rowIndex);

                // Check note peer condition
                const hasNotePeer = CellHelper.containsToggledNoteAt(
                    currentGridPosition,
                    cellValue,
                );

                const peerFoundType: PeerType = hasNotePeer ? "both" : "number";

                // Handle if the current iterating self is itself
                const isItself = GridPositionHelper.equals(
                    currentGridPosition,
                    cellGridPosition,
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
                        cellGridPosition,
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
                        cellGridPosition,
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
                        cellGridPosition,
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
                    CellHelper.isNumberValueEqualAt(
                        currentGridPosition,
                        cellValue,
                        puzzle?.player,
                        puzzle?.given,
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
}
