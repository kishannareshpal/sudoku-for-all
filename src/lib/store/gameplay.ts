import {
    EntryMode, ForceToggleOperation,
    GameState,
    GridPosition, Move,
    MoveDeltaValue,
    NotesGridNotationValue,
    NumbersGridNotationValue,
    PeerCellMetadata,
    Puzzle
} from "@/lib/shared-types";
import { produce } from "immer";
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { COLUMNS_COUNT, ROWS_COUNT } from "../constants/board";
import { GridPositionHelper } from "../helpers/grid-position-helper";
import { ScoreHelper } from "../helpers/score-helper";
import { SubgridPositionHelper } from "../helpers/sub-grid-position-helper";

export type GameplayStoreState = {
    state: GameState,
    entryMode: EntryMode,
    cursorGridPosition: GridPosition,
    cursorPeerCells: PeerCellMetadata[],
    puzzle?: Puzzle
}

type GameplayStoreActions = {
    setGameState: (state: GameState) => void,
    start: (puzzle: Puzzle) => void,
    incrementTimeElapsed: () => void,
    toggleGameState: () => GameState,
    setCursorGridPosition: (position: GridPosition) => void,
    setCursorPeerCells: (peerCells: PeerCellMetadata[]) => void,
    setEntryMode: (entryMode: EntryMode) => void,
    setPlayerValueAt: (position: GridPosition, value: NumbersGridNotationValue, saveMoveToHistory?: boolean) => void,
    erasePlayerValueAt: (position: GridPosition, saveMoveToHistory?: boolean) => void,
    toggleNotesValueAt: (
        position: GridPosition,
        notes: NotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
        saveMoveToHistory?: boolean,
    ) => void,

    recordMove: (move: Move) => void,
    commitMoveTravel: (action: 'undo' | 'redo') => void,
}

type GameplayStore = GameplayStoreState & GameplayStoreActions;

const initialState: GameplayStoreState = {
    state: 'playing',
    entryMode: 'number',
    cursorGridPosition: GridPositionHelper.zero(),
    cursorPeerCells: [],
    puzzle: undefined
}

export const useGameplayStore = create<GameplayStore>()(
    subscribeWithSelector(
        (set, get) => ({
            ...initialState,

            setGameState: (state) => {
                set({ state: state });
            },

            recordMove: (move) => {
                if (!get().puzzle) {
                    return;
                }

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            const nextMoveIndex = state.puzzle.moveHistory.currentMoveIndex + 1;
                            state.puzzle.moveHistory.currentMoveIndex = nextMoveIndex;

                            // Remove all moves in the stack including/after the next move index
                            state.puzzle.moveHistory.moves.splice(nextMoveIndex, state.puzzle.moveHistory.moves.length - 1);
                            state.puzzle.moveHistory.moves.push(move)
                        }
                    })
                )
            },

            commitMoveTravel: (action) => {
                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            if (action === 'undo') {
                                state.puzzle.moveHistory.currentMoveIndex -= 1
                            } else {
                                state.puzzle.moveHistory.currentMoveIndex += 1
                            }
                        }
                    })
                )
            },

            incrementTimeElapsed: () => {
                if (!get().puzzle || get().state !== 'playing') {
                    return;
                }

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            state.puzzle.timeElapsedInSeconds += 1;
                        }
                    })
                )
            },

            toggleGameState: (): GameState => {
                const currentState = get().state;
                if (currentState === 'over') {
                    // Cannot toggle a finished game
                    return 'over';
                }

                const nextState = currentState === 'paused' ? 'playing' : 'paused';
                set({ state: nextState })

                return nextState;
            },

            setCursorGridPosition: (position) => {
                set({ cursorGridPosition: position })
            },

            setCursorPeerCells: (peerCells) => {
                set({ cursorPeerCells: peerCells })
            },

            setEntryMode: (mode) => {
                set({ entryMode: mode })
            },

            start: (puzzle) => {
                set({
                    puzzle: puzzle,
                    state: 'playing',
                    cursorGridPosition: GridPositionHelper.zero(),
                    cursorPeerCells: [],
                })
            },

            erasePlayerValueAt: (position, saveMoveToHistory) => {
                get().setPlayerValueAt(position, 0, saveMoveToHistory);
            },

            setPlayerValueAt: (position, value, saveMoveToHistory) => {
                // Ensure a puzzle exists
                const currentPuzzle = get().puzzle;
                if (!currentPuzzle) {
                    return;
                }

                const erasing = value <= 0;
                const currentValue = currentPuzzle.player[position.row][position.col]
                const currentNotes = currentPuzzle.notes[position.row][position.col]

                set(produce((state: GameplayStoreState) => {
                    if (!state.puzzle) return;

                    state.puzzle.player[position.row][position.col] = value;
                    state.puzzle.notes[position.row][position.col] = [];

                    // Score: only when placing a new number (not erasing, not during undo/redo)
                    if (!erasing && saveMoveToHistory) {
                        const solutionValue = state.puzzle.solution[position.row][position.col];
                        const isCorrect = value === solutionValue;
                        const points = isCorrect
                            ? ScoreHelper.pointsForCorrectMove(state.puzzle.difficulty)
                            : ScoreHelper.pointsForIncorrectMove(state.puzzle.difficulty);
                        state.puzzle.score = ScoreHelper.clampScore(state.puzzle.score + points);
                    }

                    // Auto-remove notes from peers when placing a number
                    if (!erasing && value > 0) {
                        for (let r = 0; r < ROWS_COUNT; r++) {
                            for (let c = 0; c < COLUMNS_COUNT; c++) {
                                if (r === position.row && c === position.col) continue;

                                const sameRow = r === position.row;
                                const sameCol = c === position.col;
                                const sameSubgrid = SubgridPositionHelper.equalsFromGridPositions(
                                    { row: r, col: c } as GridPosition,
                                    position,
                                );

                                if (sameRow || sameCol || sameSubgrid) {
                                    const notes = state.puzzle.notes[r][c];
                                    const noteIndex = notes.indexOf(value);
                                    if (noteIndex !== -1) {
                                        notes.splice(noteIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                }))

                if (saveMoveToHistory) {
                    // Save move to history
                    const deltaBeforeValue: MoveDeltaValue =
                        currentNotes.length ? { type: 'notes', value: currentNotes }
                            : currentValue ? { type: 'number', value: currentValue }
                                : { type: 'empty' }

                    const deltaAfterValue: MoveDeltaValue =
                        erasing ? { type: 'empty' }
                            : { type: 'number', value: value }

                    get().recordMove({
                        position: position,
                        delta: {
                            before: deltaBeforeValue,
                            after: deltaAfterValue
                        }
                    })
                }

                // Check win condition after placing a number
                if (!erasing) {
                    const puzzle = get().puzzle;
                    if (puzzle && isPuzzleSolved(puzzle)) {
                        set({ state: 'over' });
                    }
                }
            },

            toggleNotesValueAt: (position, notes, forceOperation, saveMoveToHistory) => {
                const originalState = get();
                const updatedState = produce(originalState, (state: GameplayStoreState) => {
                    if (!state.puzzle) {
                        return;
                    }

                    const existingNotes = state.puzzle.notes[position.row][position.col];
                    for (const note of notes) {
                        const existingNoteIndex = existingNotes.indexOf(note);
                        const present = existingNoteIndex !== -1;

                        let mustBeOn: boolean;
                        if (!present && (!forceOperation || forceOperation === 'add')) {
                            // The note should be toggled on
                            mustBeOn = true
                        } else if (present && (!forceOperation || forceOperation === 'remove')) {
                            // The note should be toggled off
                            mustBeOn = false
                        } else {
                            // invalid action, skip iteration
                            continue;
                        }

                        if (mustBeOn) {
                            state.puzzle.notes[position.row][position.col].push(note);
                        } else {
                            state.puzzle.notes[position.row][position.col].splice(existingNoteIndex, 1)
                        }
                    }
                })
                set(updatedState)

                if (saveMoveToHistory) {
                    const deltaAfterValue = updatedState.puzzle?.notes[position.row][position.col] ?? []
                    const deltaBeforeValue = originalState.puzzle?.notes[position.row][position.col] ?? []

                    get().recordMove({
                        position: position,
                        delta: {
                            before: { type: 'notes', value: deltaBeforeValue },
                            after: { type: 'notes', value: deltaAfterValue }
                        },
                    })
                }
            }
        })
    )
)

/**
 * Just an alias
 */
export const gameplayStore = useGameplayStore;

export const gameplayStoreState = (): GameplayStore => useGameplayStore.getState();

function isPuzzleSolved(puzzle: Puzzle): boolean {
    for (let r = 0; r < ROWS_COUNT; r++) {
        for (let c = 0; c < COLUMNS_COUNT; c++) {
            const given = puzzle.given[r][c];
            const player = puzzle.player[r][c];
            const solution = puzzle.solution[r][c];
            const value = given || player;
            if (value !== solution) return false;
        }
    }
    return true;
}
