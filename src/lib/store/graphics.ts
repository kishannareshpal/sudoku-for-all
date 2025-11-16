import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BoardHelper } from "../helpers/board-helper";
import { SizeHelper } from "../helpers/size-helper";
import { BoardLayout, CharSizeMap, EntryMode, FontLayout, NumberCharacter, Size } from "../shared-types";

/**
 * Just a simple helper function to generate the default value for char size maps on the store.
 */
const emptyCharSizeMap = (): CharSizeMap => {
    const zeroSize = SizeHelper.zero();
    return {
        1: zeroSize,
        2: zeroSize,
        3: zeroSize,
        4: zeroSize,
        5: zeroSize,
        6: zeroSize,
        7: zeroSize,
        8: zeroSize,
        9: zeroSize,
    };
};

type GraphicsStoreState = {
    boardLayout: BoardLayout,
    fontLayout: FontLayout
}

type GraphicsStoreActions = {
    setBoardLayout: (availableBoardLength: number) => BoardLayout,
    setFontLayout: (fontLayout: FontLayout) => void,
    getCharSizeFor: (entryType: EntryMode, char: NumberCharacter) => Size,
    reset: () => void,
}

type GraphicsStore = GraphicsStoreState & GraphicsStoreActions;

const initialState: GraphicsStoreState = {
    boardLayout: {
        boardLength: 0,
        rawCellLength: 0,
        subCellLength: 0,
        cellLength: 0
    },
    fontLayout: {
        numberFont: null,
        notesFont: null,
        numberFontSize: 0,
        notesFontSize: 0,
        noteCharSizeMap: emptyCharSizeMap(),
        numberCharSizeMap: emptyCharSizeMap(),
    }
};

export const useGraphicsStore = create<GraphicsStore>()(
    subscribeWithSelector(
        (set, get) => ({
            ...initialState,

            setBoardLayout(availableBoardLength) {
                const fittedBoardLayout = BoardHelper.calculateFittedBoardLayout(availableBoardLength);

                set({ boardLayout: fittedBoardLayout })

                return fittedBoardLayout;
            },

            setFontLayout(fontLayout) {
                set({ fontLayout })
            },

            getCharSizeFor(entryType, char) {
                if (entryType === "number") {
                    return (
                        get().fontLayout.numberCharSizeMap[char] ||
                        get().fontLayout.numberFontSize
                    );
                } else if (entryType === "note") {
                    return (
                        get().fontLayout.noteCharSizeMap[char] ||
                        get().fontLayout.notesFontSize
                    );
                }

                throw new Error(
                    'Provided an invalid value for the argument named "entryType"',
                );
            },

            reset() {
                set(initialState)
            }
        })
    )
);

export const graphicsStore = useGraphicsStore;

export const graphicsStoreState = (): GraphicsStore => graphicsStore.getState();