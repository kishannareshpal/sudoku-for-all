import { BoardDimensions } from "@/lib/shared-types";
import { Observable, observable } from "@legendapp/state";

type BoardDimensionsStoreState = BoardDimensions;

type BoardDimensionsStoreComputedState = {
    /**
     * A computed attribute that returns the length of each cell in the board, ignoring the borders (cell, subgrid)
     * spacing it is subject to.
     *
     * @see BoardDimensions.cellLengthWithBorderSpacing - for the length of each cell in the board, considering the borders spacing it is subject to.
     */
    cellLengthIgnoringBordersSpacing: Observable<number>
};

type BoardDimensionsStoreActions = {
    setDimensions: (dimensions: BoardDimensions) => void,
}

type DimensionsObservableStore = (BoardDimensionsStoreState & BoardDimensionsStoreComputedState) & BoardDimensionsStoreActions;

const initialState: BoardDimensionsStoreState = {
    boardLength: 0,
    cellLengthWithBorderSpacing: 0
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