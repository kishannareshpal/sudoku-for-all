import { BoardDimensions } from "@/lib/shared-types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { COLUMNS_COUNT } from "../constants/board";

type GraphicsStoreState = BoardDimensions;

type GraphicsStoreComputeds = {
    /**
     * A computed attribute that returns the length of each cell in the board, ignoring the borders (cell, subgrid)
     * spacing it is subject to.
     *
     * @see BoardDimensions.cellLength - for the length of each cell in the board, considering the borders spacing it is subject to.
     */
    cellLengthIgnoringBordersSpacing: () => number
};

type GraphicsStoreActions = {
    setDimensions: (dimensions: BoardDimensions) => void,
}

type GraphicsStore = (GraphicsStoreState & GraphicsStoreComputeds) & GraphicsStoreActions;

const initialState: GraphicsStoreState = {
    boardLength: 0,
    cellLength: 0
};

export const useGraphicsStore = create<GraphicsStore>()(
    subscribeWithSelector(
        (set, get) => ({
            ...initialState,

            cellLengthIgnoringBordersSpacing() {
                return get().boardLength / COLUMNS_COUNT
            },

            setDimensions(dimensions) {
                set({})
            },
        })
    )
);

/**
 * Just an alias
 */
export const gameplayStore = useGraphicsStore;

export const graphicsStoreState = (): GraphicsStore => gameplayStore.getState();

// export const boardDimensions$ = observable<GraphicsStore>({
//     ...initialState,

//     cellLengthIgnoringBordersSpacing: () => {
//         return boardDimensions$.boardLength.get() / 9;
//     },

//     setDimensions: (dimensions) => {
//         boardDimensions$.assign(dimensions);
//     }
// });