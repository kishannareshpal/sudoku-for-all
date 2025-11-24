import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import {
    BoardGridNotationValue,
    BoardNotesGridNotationValue,
    EntryMode, ForceToggleOperation,
    GameState,
    GridPosition, Move,
    PeerCellMetadata,
    Puzzle
} from "@/lib/shared-types";
import { produce } from "immer";
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
    setPlayerValueAt: (position: GridPosition, value: BoardGridNotationValue, saveMoveToHistory?: boolean) => void,
    erasePlayerValueAt: (position: GridPosition, saveMoveToHistory?: boolean) => void,
    toggleNotesValueAt: (
        position: GridPosition,
        notes: BoardNotesGridNotationValue,
        forceOperation?: ForceToggleOperation,
        saveMoveToHistory?: boolean,
    ) => void,

    recordMove: (params: Pick<Move, 'position' | 'type' | 'values'>) => void,
    commitMove: (action: 'undo' | 'redo') => void,
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

            recordMove: ({ position, type, values }) => {
                if (!get().puzzle) {
                    return;
                }

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            const newMoveIndex = state.puzzle.moveHistory.currentMoveIndex + 1;
                            state.puzzle.moveHistory.currentMoveIndex = newMoveIndex;

                            // Only keep items in the history that before the current index, remove everything after
                            state.puzzle.moveHistory.moves = state.puzzle.moveHistory.moves.filter(
                                (entry) => entry.index < newMoveIndex
                            );

                            state.puzzle.moveHistory.moves.push({
                                position: position,
                                index: newMoveIndex,
                                type: type,
                                values: values
                            })
                        }
                    })
                )

                console.log('move recorded!')

                // self.moveIndex += 1

                // let entry = MoveEntry(
                //     index: self.moveIndex,
                //     locationNotation: locationNotation,
                //     type: type,
                //     value: value
                // )

                // self.moves.removeAll { entry in entry.index >= self.moveIndex }
                // self.moves.append(entry)
            },

            commitMove: (action) => {
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
                const currentNotes = currentPuzzle.notes[position.row][position.col]

                set(
                    produce((state: GameplayStoreState) => {
                        if (state.puzzle) {
                            state.puzzle.player[position.row][position.col] = value;
                            state.puzzle.notes[position.row][position.col] = [];
                        }
                    })
                )

                if (saveMoveToHistory) {
                    // Save move to history
                    if (currentNotes.length) {
                        get().recordMove({
                            type: 'erase-notes',
                            position: position,
                            values: currentNotes
                        })
                    }

                    get().recordMove({
                        type: erasing ? 'erase-number' : 'set-number',
                        position: position,
                        values: [value]
                    })
                }
            },

            toggleNotesValueAt: (position, notes, forceOperation, saveMoveToHistory) => {
                // Ensure a puzzle exists
                const currentPuzzle = get().puzzle;
                if (!currentPuzzle) {
                    return;
                }

                for (const note of notes) {
                    const noteIndexInCurrentValues = currentPuzzle.notes[position.row][position.col].findIndex((value) => value === note);

                    if (noteIndexInCurrentValues !== -1) {
                        // Added already
                        if (!forceOperation || forceOperation === 'remove') {
                            set(produce((state: GameplayStoreState) => {
                                if (state.puzzle) {
                                    state.puzzle.notes[position.row][position.col].splice(noteIndexInCurrentValues, 1);
                                }
                            }))

                            if (saveMoveToHistory) {
                                // Save move to history
                                get().recordMove({
                                    type: 'erase-notes',
                                    position: position,
                                    values: [note]
                                })
                            }
                        }
                    } else {
                        // Not added yet
                        if (!forceOperation || forceOperation === 'add') {
                            set(produce((state: GameplayStoreState) => {
                                if (state.puzzle) {
                                    state.puzzle.notes[position.row][position.col].push(note);
                                }
                            }))

                            if (saveMoveToHistory) {
                                // Save move to history
                                get().recordMove({
                                    type: 'set-note',
                                    position: position,
                                    values: [note]
                                })
                            }
                        }
                    }
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
