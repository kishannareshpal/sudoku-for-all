import { SkFont, SkTypefaceFontProvider } from "@shopify/react-native-skia";
import type { PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";

interface BoardContextValue {
  fontManager: SkTypefaceFontProvider,
  fonts: {
    number: SkFont,
    note: SkFont
  },
}

export const BoardContext = createContext<BoardContextValue | null>(null);

export const BoardProvider = ({ fontManager, fonts, children }: PropsWithChildren<BoardContextValue>) => (
  <BoardContext.Provider value={{ fontManager, fonts }}>
    {children}
  </BoardContext.Provider>
);

export const useBoard = () => {
  const value = useContext(BoardContext);

  if (value === null) {
    throw new Error('Board context provider not found');
  }

  return value;
};