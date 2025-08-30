import { atom } from 'jotai';

export type BoardDimensions = {
    boardLength: number,
    cellLength: number
}

export const boardDimensionsAtom = atom<BoardDimensions>({
    boardLength: 0,
    cellLength: 0
});