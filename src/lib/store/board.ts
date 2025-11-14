import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ROWS_OR_COLUMNS_COUNT } from "../constants/board";
import { BoardHelper } from "../helpers/board-helper";

type GraphicsStoreState = {
    /**
     * The best length for the board.
     */
    boardLength: number,

    /**
     * The length of each cell in the board, ignoring the borders (cell, subgrid) spacing it is subject to.
     */
    cellLength: number

    /**
     * The length of each cell in the board, considering the borders spacing it is subject to.
     */
    rawCellLength: number,
}

type GraphicsStoreActions = {
    setLayout: (availableBoardLength: number) => number,
}

type GraphicsStore = GraphicsStoreState & GraphicsStoreActions;

const initialState: GraphicsStoreState = {
    boardLength: 0,
    rawCellLength: 0,
    cellLength: 0
};

export const useGraphicsStore = create<GraphicsStore>()(
    subscribeWithSelector(
        (set, get) => ({
            ...initialState,

            setLayout(availableBoardLength) {
                const fittedBoardLayout = BoardHelper.calculateFittedBoardLayout(availableBoardLength);

                const rawCellLength = fittedBoardLayout.boardLength / ROWS_OR_COLUMNS_COUNT;
                set({
                    boardLength: fittedBoardLayout.boardLength,
                    cellLength: fittedBoardLayout.cellLength,
                    rawCellLength: rawCellLength
                })

                return fittedBoardLayout.boardLength;
            },
        })
    )
);

export const gameplayStore = useGraphicsStore;

export const graphicsStoreState = (): GraphicsStore => gameplayStore.getState();