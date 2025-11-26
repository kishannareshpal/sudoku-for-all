import { ForceToggleOperation, GridPosition, NotesGridNotation, NotesGridNotationValue, NumbersGridNotation, NumbersGridNotationValue } from "@/lib/shared-types";
import { gameplayStoreState } from "../store/gameplay";
import { BoardNotationHelper } from "./board-notation-helper";

export const getNotesValueAt = (
    params: { position: GridPosition, notesGridNotation: NotesGridNotation }
): NotesGridNotationValue => {
    return BoardNotationHelper.getValueAt(params.position, params.notesGridNotation)
}

export const getNumberValueAt = (
    params: {
        position: GridPosition,
        playerGridNotation: NumbersGridNotation,
        givenGridNotation: NumbersGridNotation
    }
): NumbersGridNotationValue => {
    const given = BoardNotationHelper.getValueAt(params.position, params.givenGridNotation)
    if (given) {
        return given;
    }

    const player = BoardNotationHelper.getValueAt(params.position, params.playerGridNotation)
    if (player) {
        return player
    }

    return 0;
}

export const isNumberValueEmpty = (value: NumbersGridNotationValue | undefined): boolean => {
    return !value;
}

export const isNotesValueEmpty = (value: NotesGridNotationValue | undefined): boolean => {
    return !value?.length;
}

export const isValueEmptyAt = (
    params: {
        position: GridPosition,
        playerGridNotation: NumbersGridNotation,
        givenGridNotation: NumbersGridNotation,
        notesGridNotation: NotesGridNotation
    }
): boolean => {
    const givenEmpty = isNumberValueEmpty(BoardNotationHelper.getValueAt(params.position, params.givenGridNotation))
    const playerEmpty = isNumberValueEmpty(BoardNotationHelper.getValueAt(params.position, params.playerGridNotation))
    const notesEmpty = isNotesValueEmpty(BoardNotationHelper.getValueAt(params.position, params.notesGridNotation))

    return givenEmpty && playerEmpty && notesEmpty
}

export const isValueEditableAt = (
    params: {
        position: GridPosition,
        givenGridNotation: NumbersGridNotation,
    }
): boolean => {
    return isNumberValueEmpty(BoardNotationHelper.getValueAt(params.position, params.givenGridNotation))
}

export const isNumberValueEqualAt = (
    params: {
        position: GridPosition,
        value: number,
        playerGridNotation: NumbersGridNotation,
        givenGridNotation: NumbersGridNotation,
    },
    options?: { considerEmptyAsEqual: boolean },
): boolean => {
    options ||= { considerEmptyAsEqual: false };

    const numberValue = getNumberValueAt({ position: params.position, givenGridNotation: params.givenGridNotation, playerGridNotation: params.playerGridNotation })

    const isEqual = params.value === numberValue;
    if (options.considerEmptyAsEqual) {
        return isEqual;
    }

    return !isNumberValueEmpty(numberValue) && isEqual;
}

export const isNoteValueToggledAt = (
    params: {
        position: GridPosition,
        value: number,
        notesGridNotation: NotesGridNotation
    }
): boolean => {
    const notes = getNotesValueAt({ position: params.position, notesGridNotation: params.notesGridNotation })
    return notes.includes(params.value);
}

export const isValueErasableAt = (
    params: {
        position: GridPosition,
        givenGridNotation: NumbersGridNotation,
        playerGridNotation: NumbersGridNotation,
        notesGridNotation: NotesGridNotation
    }
): boolean => {
    const isEditable = isValueEditableAt({ position: params.position, givenGridNotation: params.givenGridNotation })
    const isValueNotEmpty = !isValueEmptyAt({ position: params.position, playerGridNotation: params.playerGridNotation, givenGridNotation: params.givenGridNotation, notesGridNotation: params.notesGridNotation })

    return isEditable && isValueNotEmpty
}

export const isValueStaticAt = (
    params: {
        position: GridPosition,
        givenGridNotation: NumbersGridNotation,
    }
): boolean => {
    return !isValueEditableAt({ position: params.position, givenGridNotation: params.givenGridNotation })
}

export const isValueAnnotatableAt = (
    params: {
        position: GridPosition,
        givenGridNotation: NumbersGridNotation,
        playerGridNotation: NumbersGridNotation,
    }
): boolean => {
    if (isValueStaticAt({ position: params.position, givenGridNotation: params.givenGridNotation })) {
        return false;
    }

    // Is only annotatable if a final number has not been placed at this position yet
    return isNumberValueEmpty(BoardNotationHelper.getValueAt(params.position, params.playerGridNotation))
}

export const erasePlayerValueAt = (
    params: {
        position: GridPosition,
        playerGridNotation: NumbersGridNotation,
        givenGridNotation: NumbersGridNotation,
        notesGridNotation: NotesGridNotation,
        saveMoveToHistory?: boolean
    }
): void => {
    params.saveMoveToHistory ??= true;

    if (!isValueErasableAt({ position: params.position, playerGridNotation: params.playerGridNotation, givenGridNotation: params.givenGridNotation, notesGridNotation: params.notesGridNotation })) {
        return;
    }

    gameplayStoreState().erasePlayerValueAt(params.position, params.saveMoveToHistory);
}

export const setPlayerValueAt = (
    params: {
        position: GridPosition,
        value: NumbersGridNotationValue,
        saveMoveToHistory?: boolean
    }
): void => {
    params.saveMoveToHistory ??= true;

    const state = gameplayStoreState();

    if (!state.puzzle) {
        return;
    }

    if (!isValueEditableAt({ position: params.position, givenGridNotation: state.puzzle.given })) {
        return;
    }

    state.setPlayerValueAt(params.position, params.value, params.saveMoveToHistory);
}

export const toggleNotesValueAt = (
    params: {
        position: GridPosition,
        value: NotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
        saveMoveToHistory?: boolean
    }
): void => {
    params.saveMoveToHistory ??= true;

    const state = gameplayStoreState();

    if (!state.puzzle) {
        return;
    }

    if (!isValueAnnotatableAt({ position: params.position, givenGridNotation: state.puzzle.given, playerGridNotation: state.puzzle.player })) {
        return;
    }

    state.toggleNotesValueAt(params.position, params.value, params.forceOperation, params.saveMoveToHistory);
}