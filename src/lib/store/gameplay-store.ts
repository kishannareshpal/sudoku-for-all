import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import {
    BoardGridNotationValue,
    BoardNotesGridNotationValue,
    CursorMode, ForceToggleOperation,
    GameState,
    GridPosition,
    Puzzle
} from "@/lib/shared-types";
import { produce } from "immer";
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type GameplayStoreState = {
    state: GameState,
    cursorMode: CursorMode,
    cursorGridPosition: GridPosition,
    puzzle?: Puzzle,
}

type GameplayStoreActions = {
    updateGameState: (state: GameState) => void,
    toggleGameState: () => void,
    updateCursorGridPosition: (position: GridPosition) => void,
    updateCursorMode: (mode: CursorMode) => void,
    updatePuzzle: (puzzle: Puzzle) => void,
    updatePlayerValueAt: (position: GridPosition, value: BoardGridNotationValue) => void,
    erasePlayerValueAt: (position: GridPosition) => void,
    toggleNotesValueAt: (
        position: GridPosition,
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation
    ) => void,
}

type GameplayStore = GameplayStoreState & GameplayStoreActions;

const initialState: GameplayStoreState = {
    state: 'playing',
    cursorMode: 'number',
    cursorGridPosition: GridPositionHelper.zero(),
    puzzle: undefined
}

export const useGameplayStore = create<GameplayStore>()(
    subscribeWithSelector(
        (set, get) => ({
            ...initialState,

            updateGameState: (state) => {
                set({ state: state });
            },

            toggleGameState: () => {
                const currentState = get().state;
                if (currentState === 'over') {
                    // Cannot toggle a finished game
                    return;
                }

                set({ state: currentState === 'paused' ? 'playing' : 'paused' })
            },

            updateCursorGridPosition: (position) => {
                set({cursorGridPosition: position})
            },

            updateCursorMode: (mode) => {
                set({cursorMode: mode})
            },

            updatePuzzle: (puzzle) => {
                set({puzzle: puzzle})
            },

            erasePlayerValueAt: (position) => {
                // Ensure a puzzle exists
                if (!get().puzzle) {
                    return;
                }

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            state.puzzle.player[position.row][position.col] = 0;
                            state.puzzle.notes[position.row][position.col] = [];
                        }
                    })
                )
            },

            updatePlayerValueAt: (position, value) => {
                // Ensure a puzzle exists
                if (!get().puzzle) {
                    return;
                }

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            state.puzzle.player[position.row][position.col] = value;
                            state.puzzle.notes[position.row][position.col] = [];
                        }
                    })
                )
            },

            toggleNotesValueAt: (position, notes, forceOperation) => {
                // Ensure a puzzle exists
                if (!get().puzzle) {
                    return;
                }

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            for (const note of notes) {
                                const noteIndexInCurrentValues = state.puzzle.notes[position.row][position.col].findIndex((value) => value === note);

                                if (noteIndexInCurrentValues !== -1) {
                                    // Added already
                                    if (!forceOperation || forceOperation === 'remove') {
                                        state.puzzle.notes[position.row][position.col].splice(noteIndexInCurrentValues, 1);
                                    }
                                } else {
                                    // Not added yet
                                    if (!forceOperation || forceOperation === 'add') {
                                        state.puzzle.notes[position.row][position.col].push(note);
                                    }
                                }
                            }
                        }
                    })
                )
            }})
    )
)

/**
 * Just an alias
 */
export const gameplayStore = useGameplayStore;

export const gameplayStoreState = (): GameplayStore => useGameplayStore.getState();
