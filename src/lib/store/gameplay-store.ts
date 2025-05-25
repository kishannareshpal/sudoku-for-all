import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CursorMode, GridPosition } from "@/lib/shared-types";

type GameplayStoreState = {
    cursorMode: CursorMode,
    cursorGridPosition: GridPosition
}

type GameplayStoreActions = {
    moveCursorTo: (gridPosition: GridPosition | undefined) => void,
    toggleCursorMode: (mode?: CursorMode) => void,
}

type GameplayStore = GameplayStoreState & GameplayStoreActions;

const initialState: GameplayStoreState = {
    cursorMode: 'number',
    cursorGridPosition: {row: 0, col: 0},
}

export const useGameplayStore = create<GameplayStore>()(
    subscribeWithSelector(
        (set, get) => ({
            ...initialState,

            moveCursorTo: (gridPosition) => {
                set({
                    cursorGridPosition: gridPosition
                });
            },

            toggleCursorMode: (mode) => {
                let newCursorMode = mode;
                if (!newCursorMode) {
                    // Switch
                    newCursorMode = get().cursorMode === 'number' ? 'note' : 'number';
                }

                set({
                    cursorMode: newCursorMode
                })
            }
        })
    )
)

export const gameplayStoreState = (): GameplayStore => useGameplayStore.getState();