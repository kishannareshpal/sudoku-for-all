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
    MoveHistory,
    PeerCellMetadata,
    PeerType,
    Point
} from "@/lib/shared-types";
import { GameplayStoreState, gameplayStoreState } from "@/lib/store/gameplay";

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

        store.setCursorPeerCells(relatedCellsGridPositions);
        store.setCursorGridPosition(gridPosition);
    }

    static moveCursorToPoint(point: Point): void {
        const newGridPosition = GridPositionHelper.createFromPoint(point);
        if (!newGridPosition) {
            // Out of bounds, do nothing
            return;
        }

        CellHelper.moveCursorTo(newGridPosition);
    }

    static erasePlayerValueAt(gridPosition: GridPosition, saveMoveToHistory: boolean = true): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (!this.isEraseableAt(gridPosition, store.puzzle.given)) {
            return;
        }

        store.erasePlayerValueAt(gridPosition, saveMoveToHistory);
    }

    static undoLastMove(gameplay: GameplayStoreState): void {
        if (gameplay.state !== "playing") return;
        if (!gameplay.puzzle) return;

        const moveHistory = gameplay.puzzle.moveHistory;
        if (!this.isMoveUndoable(moveHistory)) return;

        const index = moveHistory.currentMoveIndex;
        const move = moveHistory.moves.find(m => m.index === index);
        if (!move) return;

        // Move cursor to affected cell
        this.moveCursorTo(move.position);

        const store = gameplayStoreState();

        switch (move.type) {
            case "set-number": {
                const previousMove = moveHistory.moves.findLast(
                    (pm) => pm.index < move.index && GridPositionHelper.equals(move.position, move.position)
                )

                if (!previousMove) {
                    store.erasePlayerValueAt(move.position)
                    break;
                }

                if (previousMove?.type === 'erase-notes') {
                    store.erasePlayerValueAt(previousMove.position, false)
                    store.toggleNotesValueAt(previousMove.position, previousMove.values, 'add', false);
                } else {
                    store.setPlayerValueAt(move.position, previousMove.values[0], false)
                }
                break;
            }

            case "erase-number": {
                // undo = put erased number back
                const value = move.values[0];
                store.setPlayerValueAt(move.position, value, false);
                break;
            }

            case "set-note": {
                // undo = remove this note
                store.toggleNotesValueAt(move.position, move.values, "remove", false);
                break;
            }

            case "erase-notes": {
                // undo = restore all removed notes
                store.toggleNotesValueAt(move.position, move.values, "add", false);
                break;
            }
        }

        // now move the pointer backward
        gameplayStoreState().commitMove("undo");
    }

    // static undoLastMove(gameplay: GameplayStoreState): void {
    //     if (gameplay.state !== 'playing') {
    //         return;
    //     }

    //     if (!gameplay.puzzle) {
    //         return;
    //     }

    //     const moveHistory = gameplay.puzzle.moveHistory;
    //     if (!this.isMoveUndoable(moveHistory)) {
    //         return;
    //     }

    //     // TODO: can potentially do: moveHistory.moves[moveHistory.currentMoveIndex]? and get rid of the `index` field in `Move`?
    //     const undoneMove = moveHistory.moves.find((move) => move.index === moveHistory.currentMoveIndex);
    //     if (!undoneMove) {
    //         return;
    //     }

    //     const handle = (undoneMove: Move, moveHistory: MoveHistory): void => {
    //         this.moveCursorTo(undoneMove.position)

    //         if (undoneMove.type === 'set-number') {
    //             // Undoing a move that set a number means that we have to unset the number
    //             this.erasePlayerValueAt(undoneMove.position, false);

    //             // Additionally, lookup the history for the last known move made at this position (if any) and undo that
    //             const previousMoveOnThisCell = moveHistory.moves.findLast((move) => move.index < undoneMove.index && GridPositionHelper.equals(move.position, undoneMove.position))
    //             if (previousMoveOnThisCell) {
    //                 // Prior to the move we're undoing, there was no other move done on this cell, so undoing should clear out the cell
    //                 if (previousMoveOnThisCell.type === 'set-number') {
    //                     this.setPlayerValueAt(previousMoveOnThisCell.position, previousMoveOnThisCell.values[0], false)
    //                     gameplayStoreState().commitMove('undo');
    //                 } else if (previousMoveOnThisCell.type === 'erase-notes') {
    //                     this.toggleNotesValueAt(previousMoveOnThisCell.position, previousMoveOnThisCell.values, 'add', false)
    //                     gameplayStoreState().commitMove('undo');
    //                 } else {
    //                     const updatedMoveHistory = gameplayStoreState().puzzle?.moveHistory ?? { currentMoveIndex: 0, moves: [] };
    //                     handle(previousMoveOnThisCell, updatedMoveHistory)
    //                 }
    //             } else {
    //                 gameplayStoreState().commitMove('undo');
    //             }
    //         } else if (undoneMove.type === 'erase-number') {
    //             // Undoing a move that has erased a number means that we have to set the number
    //             this.setPlayerValueAt(undoneMove.position, undoneMove.values[0], false)
    //             gameplayStoreState().commitMove('undo');
    //         } else if (undoneMove.type === 'set-note') {
    //             // Undoing a move that set a note means erasing the note
    //             this.toggleNotesValueAt(undoneMove.position, undoneMove.values, 'remove', false);
    //             gameplayStoreState().commitMove('undo');
    //         } else if (undoneMove.type === 'erase-notes') {
    //             // Undoing a move that erased notes means setting them
    //             this.toggleNotesValueAt(undoneMove.position, undoneMove.values, 'add', false)
    //             gameplayStoreState().commitMove('undo');
    //         } else {
    //             return;
    //         }
    //     }

    //     handle(undoneMove, moveHistory)
    // }

    static redoLastMove(gameplay: GameplayStoreState): void {
        if (gameplay.state !== 'playing') {
            return;
        }

        if (!gameplay.puzzle) {
            return;
        }

        const moveHistory = gameplay.puzzle.moveHistory;
        if (!this.isMoveRedoable(moveHistory)) {
            return;
        }

        const redoingMoveIndex = moveHistory.currentMoveIndex + 1
        const redoingMove = moveHistory.moves.find((move) => move.index === redoingMoveIndex);
        if (!redoingMove) {
            return;
        }

        this.moveCursorTo(redoingMove.position)

        if (redoingMove.type === 'set-number') {
            // Redoing a move that set a number, should set the number
            this.setPlayerValueAt(redoingMove.position, redoingMove.values[0], false)
        } else if (redoingMove.type === 'erase-number') {
            // Redoing a move that erased a number, should erase a number
            this.erasePlayerValueAt(redoingMove.position, false)
        } else if (redoingMove.type === 'set-note') {
            // Redoing a move that set a note, should set a note
            this.toggleNotesValueAt(redoingMove.position, redoingMove.values, 'add', false)
        } else if (redoingMove.type === 'erase-notes') {
            // Redoing a move that set a note, should set a note
            this.toggleNotesValueAt(redoingMove.position, redoingMove.values, 'remove', false)
        } else {
            return;
        }

        gameplayStoreState().commitMove('redo');
    }

    static isMoveUndoable(moveHistory: MoveHistory): boolean {
        return moveHistory.currentMoveIndex >= 0
    }

    static isMoveRedoable(moveHistory: MoveHistory): boolean {
        return moveHistory.currentMoveIndex < moveHistory.moves.length - 1
    }

    static erasePlayerValueAtCursor(): void {
        const state = gameplayStoreState();
        const cursorGridPosition = state.cursorGridPosition;

        this.erasePlayerValueAt(cursorGridPosition);
    }

    static setPlayerValueAtCursorTo(value: BoardGridNotationValue): void {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;

        this.setPlayerValueAt(cursorGridPosition, value);
    }

    static toggleCursorMode(mode?: EntryMode): void {
        const store = gameplayStoreState();

        const nextCursorMode =
            (mode ?? store.entryMode === "number") ? "note" : "number";
        gameplayStoreState().setEntryMode(nextCursorMode);
    }

    static setPlayerValueAt(
        gridPosition: GridPosition,
        value: BoardGridNotationValue,
        saveMoveToHistory: boolean = true,
    ): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (!this.isEditableAt(gridPosition, store.puzzle.given)) {
            return;
        }

        store.setPlayerValueAt(gridPosition, value, saveMoveToHistory);
    }

    static toggleNotesValueAtCursor(
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
        saveMoveToHistory: boolean = true
    ): void {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;

        this.toggleNotesValueAt(cursorGridPosition, notes, forceOperation, saveMoveToHistory);
    }

    static toggleNotesValueAt(
        gridPosition: GridPosition,
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
        saveMoveToHistory: boolean = true,
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

        store.toggleNotesValueAt(gridPosition, notes, forceOperation, saveMoveToHistory);
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
