import { SizeHelper } from "@/lib/helpers/size-helper";
import { CharSizeMap, NumberCharacter, Size } from "@/lib/shared-types";
import { observable } from "@legendapp/state";
import { SkFont } from "@shopify/react-native-skia";

type FontsStoreState = {
    numberFontSize: number;
    notesFontSize: number;
    numberFont: SkFont | null;
    notesFont: SkFont | null;
    charSizeMapForNumberFont: CharSizeMap;
    charSizeMapForNoteFont: CharSizeMap;
};

type FontsStoreComputedsAndActions = {
    charSizeFor: (type: "number" | "note", char: NumberCharacter) => Size;
    setFonts: (state: FontsStoreState) => void;
};

type DimensionsObservableStore = FontsStoreState &
    FontsStoreComputedsAndActions;

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

const initialState: FontsStoreState = {
    numberFontSize: 0,
    notesFontSize: 0,
    numberFont: null,
    notesFont: null,
    charSizeMapForNoteFont: emptyCharSizeMap(),
    charSizeMapForNumberFont: emptyCharSizeMap(),
};

export const fonts$ = observable<DimensionsObservableStore>({
    ...initialState,

    setFonts: (state) => {
        fonts$.assign(state);
    },

    charSizeFor: (type, char): Size => {
        if (type === "number") {
            return (
                fonts$.charSizeMapForNumberFont.get()[char] ||
                fonts$.numberFontSize.get()
            );
        } else if (type === "note") {
            return (
                fonts$.charSizeMapForNoteFont.get()[char] ||
                fonts$.notesFontSize.get()
            );
        }

        throw new Error(
            'Provided an invalid value for the argument named "type"',
        );
    },
});
