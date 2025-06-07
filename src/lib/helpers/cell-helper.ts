import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import {
    BoardGridNotation,
    BoardGridNotationValue,
    BoardNotesGridNotationValue, CursorMode,
    ForceToggleOperation,
    GridPosition
} from "@/lib/shared-types";
import { gameplayStoreState } from "@/lib/store/gameplay-store";

export class CellHelper {
    static getToggledNotesAtCursor(): BoardNotesGridNotationValue {
        const store = gameplayStoreState();
        const cursorGridPosition = store.cursorGridPosition;

        return store.puzzle.notes[cursorGridPosition.row][cursorGridPosition.col];
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

        if (!this.isClearable(gridPosition, store.puzzle.given)) {
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

        if (!this.isEditable(gridPosition, store.puzzle.given)) {
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

        if (!this.isAnnotatable(gridPosition, store.puzzle.given, store.puzzle.player)) {
            return;
        }

        store.toggleNotesValueAt(gridPosition, notes, forceOperation);
    }

    static isAnnotatable(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation = gameplayStoreState().puzzle.given,
        playerGridNotation: BoardGridNotation = gameplayStoreState().puzzle.player,
    ): boolean {
        if (this.isStaticAt(gridPosition, givenGridNotation)) {
            return false;
        }

        // Is only annotatable if a final number has not been placed at this position yet
        return this.isValueEmpty(playerGridNotation[gridPosition.row][gridPosition.col]);
    }

    static isClearable(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation = gameplayStoreState().puzzle.given,
    ): boolean {
        return !this.isEditable(gridPosition, givenGridNotation);
    }

    static isEditable(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation = gameplayStoreState().puzzle.given
    ): boolean {
        return this.isValueEmpty(givenGridNotation[gridPosition.row][gridPosition.col])
    }

    static isStaticAt(
        gridPosition: GridPosition,
        givenGridNotation: BoardGridNotation = gameplayStoreState().puzzle.given
    ): boolean {
        return this.isValueNotEmpty(givenGridNotation[gridPosition.row][gridPosition.col])
    }

    static isValueEmpty(value: number | undefined | null): boolean {
        return !value;
    }

    static isValueNotEmpty(value: number | undefined | null): boolean {
        return !this.isValueEmpty(value);
    }
}
