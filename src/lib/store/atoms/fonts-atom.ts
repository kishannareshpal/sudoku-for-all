import { SkFont } from '@shopify/react-native-skia';
import { atom } from 'jotai';

export type FontsAtom = {
    numberFont: SkFont | null,
    notesFont: SkFont | null,
    numberFontSize: number,
    notesFontSize: number,
}

export const fontsAtom = atom<FontsAtom>({
    numberFont: null,
    notesFont: null,
    numberFontSize: 0,
    notesFontSize: 0
});