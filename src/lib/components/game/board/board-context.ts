import { createContext, useContext } from "react";

export type BoardCanvasContextValue = {
    boardLength: number,
    cellLength: number,
}

const boardCanvasContextDefaultValue: BoardCanvasContextValue = {
    boardLength: 1,
    cellLength: 1
}

export const BoardCanvasContext = createContext<BoardCanvasContextValue>(
    boardCanvasContextDefaultValue
);

export const useBoardCanvasContext = () => useContext(BoardCanvasContext);