import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import {
    BoardGridNotation,
    BoardGridNotationValue,
    BoardNotesGridNotation,
    BoardNotesGridNotationValue, CursorMode,
    ForceToggleOperation,
    GridPosition
} from "@/lib/shared-types";
import { gameplayStoreState } from "@/lib/store/gameplay-store";

export class CellHelper {
    static getToggledNotesAtCursor(
        notesGridNotation: BoardNotesGridNotation | undefined = gameplayStoreState().puzzle?.notes
    ): BoardNotesGridNotationValue {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;
        return this.getToggledNotesAt(cursorGridPosition, notesGridNotation);
    }

    static getToggledNotesAt(
        gridPosition: GridPosition,
        notesGridNotation: BoardNotesGridNotation | undefined = gameplayStoreState().puzzle?.notes
    ): BoardNotesGridNotationValue {
        if (!notesGridNotation) {
            return [];
        }

        return notesGridNotation[gridPosition.row][gridPosition.col];
    }

    static moveCursorTo(
        gridPosition: GridPosition
    ): void {
        const store = gameplayStoreState();

        if (GridPositionHelper.isOutOfBounds(gridPosition)) {
            return;
        }

        store.updateCursorGridPosition(gridPosition);
    }

    static clearAt(
        gridPosition: GridPosition
    ): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (!this.isClearableAt(gridPosition, store.puzzle.given)) {
            return;
        }

        store.updatePlayerValueAt(gridPosition, 0);
    }

    static changePlayerValueAtCursorTo(
        value: BoardGridNotationValue
    ): void {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;

        this.changePlayerValueAt(cursorGridPosition, value);
    }

    static toggleCursorMode(
        mode?: CursorMode
    ): void {
        const store = gameplayStoreState();

        const nextCursorMode = mode ?? (store.cursorMode === 'number') ? 'note' : 'number'
        gameplayStoreState().updateCursorMode(nextCursorMode);
    }

    static changePlayerValueAt(
        gridPosition: GridPosition,
        value: BoardGridNotationValue
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
        forceOperation?: ForceToggleOperation
    ): void {
        const cursorGridPosition = gameplayStoreState().cursorGridPosition;

        this.toggleNotesValueAt(cursorGridPosition, notes, forceOperation)
    }

    static toggleNotesValueAt(
        gridPosition: GridPosition,
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation
    ): void {
        const store = gameplayStoreState();

        if (!store.puzzle) {
            return;
        }

        if (!this.isAnnotatableAt(gridPosition, store.puzzle.given, store.puzzle.player)) {
            return;
        }

        store.toggleNotesValueAt(gridPosition, notes, forceOperation);
    }

    static isAnnotatableAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState().puzzle?.given,
        playerGridNotation: BoardGridNotation | undefined = gameplayStoreState().puzzle?.player,
    ): boolean {
        if (!givenGridNotation || !playerGridNotation) {
            return false;
        }

        if (this.isStaticAt(gridPosition, givenGridNotation)) {
            return false;
        }

        // Is only annotatable if a final number has not been placed at this position yet
        return this.isValueEmpty(playerGridNotation[gridPosition.row][gridPosition.col]);
    }

    static isClearableAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState().puzzle?.given,
    ): boolean {
        if (!givenGridNotation) {
            return false;
        }

        return !this.isEditableAt(gridPosition, givenGridNotation);
    }

    static isEditableAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState().puzzle?.given
    ): boolean {
        if (!givenGridNotation) {
            return false;
        }

        return this.isValueEmpty(givenGridNotation[gridPosition.row][gridPosition.col])
    }

    static isStaticAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation | undefined = gameplayStoreState().puzzle?.given
    ): boolean {
        if (!givenGridNotation) {
            return true;
        }

        return this.isValueNotEmpty(givenGridNotation[gridPosition.row][gridPosition.col])
    }

    static isValueEmpty(value: number | undefined | null): boolean {
        return !value;
    }

    static isValueNotEmpty(value: number | undefined | null): boolean {
        return !this.isValueEmpty(value);
    }

    static areNotesEmptyAt(
        gridPosition: GridPosition,
        notesGridNotation: BoardNotesGridNotation | undefined = gameplayStoreState().puzzle?.notes
    ): boolean {
        if (!notesGridNotation) {
            return true;
        }

        return !notesGridNotation[gridPosition.row][gridPosition.col].length;
    }

    static areNotesNotEmptyAt(
        gridPosition: GridPosition,
        notesGridNotation: BoardNotesGridNotation | undefined = gameplayStoreState().puzzle?.notes
    ): boolean {
        return this.areNotesEmptyAt(gridPosition, notesGridNotation)
    }

    static containsToggledNoteAt(
        gridPosition: GridPosition,
        noteValue: number,
        notesGridNotation: BoardNotesGridNotation | undefined = gameplayStoreState().puzzle?.notes
    ): boolean {
        if (!notesGridNotation) {
            return false;
        }

        return notesGridNotation[gridPosition.row][gridPosition.col].includes(noteValue);
    }
}
