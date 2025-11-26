import { MoveHistory } from "../shared-types";
import { gameplayStoreState } from "../store/gameplay";
import { moveCursorTo } from "./cursor";
import { erasePlayerValueAt, setPlayerValueAt, toggleNotesValueAt } from "./values";

export const isMoveUndoable = (
    { moveHistory }: { moveHistory: MoveHistory }
) => {
    return moveHistory.currentMoveIndex >= 0
}

export const isMoveRedoable = (
    { moveHistory }: { moveHistory: MoveHistory }
) => {
    return moveHistory.currentMoveIndex < moveHistory.moves.length - 1
}

export const undoLastMove = (): void => {
    const state = gameplayStoreState();

    if (!state.puzzle) {
        return;
    }

    if (state.state !== 'playing') {
        return;
    }

    const moveHistory = state.puzzle.moveHistory
    const targetMoveIndex = moveHistory.currentMoveIndex
    const targetMove = moveHistory.moves[targetMoveIndex]

    if (!targetMove) {
        return;
    }

    moveCursorTo({ position: targetMove.position })

    const deltaValue = targetMove.delta.before
    if (deltaValue.type === 'empty') {
        erasePlayerValueAt({ position: targetMove.position, givenGridNotation: state.puzzle.given, notesGridNotation: state.puzzle.notes, playerGridNotation: state.puzzle.player, saveMoveToHistory: false });
    } else if (deltaValue.type === 'number') {
        setPlayerValueAt({ position: targetMove.position, value: deltaValue.value, saveMoveToHistory: false });
    } else if (deltaValue.type === 'notes') {
        erasePlayerValueAt({ position: targetMove.position, givenGridNotation: state.puzzle.given, notesGridNotation: state.puzzle.notes, playerGridNotation: state.puzzle.player, saveMoveToHistory: false });
        toggleNotesValueAt({ position: targetMove.position, value: deltaValue.value, forceOperation: 'add', saveMoveToHistory: false })
    }

    state.commitMoveTravel('undo');
}

export const redoLastMove = (): void => {
    const state = gameplayStoreState();

    if (state.state !== 'playing') {
        return;
    }

    if (!state.puzzle) {
        return;
    }

    const moveHistory = state.puzzle.moveHistory
    const targetMoveIndex = moveHistory.currentMoveIndex + 1
    const targetMove = moveHistory.moves[targetMoveIndex]

    if (!targetMove) {
        return;
    }

    moveCursorTo({ position: targetMove.position })

    const deltaValue = targetMove.delta.after
    if (deltaValue.type === 'empty') {
        erasePlayerValueAt({ position: targetMove.position, givenGridNotation: state.puzzle.given, notesGridNotation: state.puzzle.notes, playerGridNotation: state.puzzle.player, saveMoveToHistory: false });
    } else if (deltaValue.type === 'number') {
        setPlayerValueAt({ position: targetMove.position, value: deltaValue.value, saveMoveToHistory: false });
    } else if (deltaValue.type === 'notes') {
        erasePlayerValueAt({ position: targetMove.position, givenGridNotation: state.puzzle.given, notesGridNotation: state.puzzle.notes, playerGridNotation: state.puzzle.player, saveMoveToHistory: false });
        toggleNotesValueAt({ position: targetMove.position, value: deltaValue.value, forceOperation: 'add', saveMoveToHistory: false })
    }

    state.commitMoveTravel('redo');
}