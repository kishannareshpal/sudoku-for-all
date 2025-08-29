import { atom } from 'jotai';

export type BoardDimensions = {
    boardLength: number,
    cellLength: number,
    numberTextSize: number,
    noteTextSize: number
}

export const boardDimensionsAtom = atom<BoardDimensions>({
    boardLength: 0,
    cellLength: 0,
    numberTextSize: 0,
    noteTextSize: 0,
});