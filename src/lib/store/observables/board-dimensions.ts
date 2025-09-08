import { Observable, observable } from "@legendapp/state";
import { BoardDimensions } from "@/lib/shared-types";

type BoardDimensionsStoreState = BoardDimensions;

type BoardDimensionsStoreComputedState = {
    /**
     * A computed attribute that returns the length of each cell in the board, ignoring the borders (cell, subgrid)
     * spacing it is subject to.
     *
     * @see BoardDimensions.cellLength - for the length of each cell in the board, considering the borders spacing it is subject to.
     */
    cellLengthIgnoringBordersSpacing: Observable<number>
};

type BoardDimensionsStoreActions = {
    setDimensions: (dimensions: BoardDimensions) => void,
}

type DimensionsObservableStore = (BoardDimensionsStoreState & BoardDimensionsStoreComputedState) & BoardDimensionsStoreActions;

const initialState: BoardDimensionsStoreState = {
    boardLength: 0,
    cellLength: 0
};

export const boardDimensions$ = observable<DimensionsObservableStore>({
    ...initialState,

    cellLengthIgnoringBordersSpacing: () => {
        return boardDimensions$.boardLength.get() / 9;
    },

    setDimensions: (dimensions) => {
        boardDimensions$.assign(dimensions);
    }
});