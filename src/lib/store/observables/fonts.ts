import { observable } from "@legendapp/state";
import { SkFont } from "@shopify/react-native-skia";

type FontsStoreState = {
    numberFontSize: number,
    notesFontSize: number,
    numberFont: SkFont | null,
    notesFont: SkFont | null,
};

type FontsStoreActions = {
    setFonts: (state: FontsStoreState) => void,
}

type DimensionsObservableStore = FontsStoreState & FontsStoreActions;

const initialState: FontsStoreState = {
    numberFontSize: 0,
    notesFontSize: 0,
    numberFont: null,
    notesFont: null,
};

export const fonts$ = observable<DimensionsObservableStore>({
    ...initialState,

    setFonts: (state) => {
        fonts$.assign(state);
    }
});