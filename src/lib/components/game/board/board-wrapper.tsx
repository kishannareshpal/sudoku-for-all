import { TextHelper } from "@/lib/helpers/text-helper";
import { graphicsStoreState, useGraphicsStore } from "@/lib/store/graphics";
import { matchFont, useFonts } from "@shopify/react-native-skia";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export const BoardWrapper = ({ children }: PropsWithChildren) => {
    const containerRef = useRef<View>(null);
    const boardLayout = useGraphicsStore(
        useShallow((state) => state.boardLayout)
    );

    const fonts = useFonts({
        SFANumber: [require("@assets/fonts/jetbrains-mono-regular.ttf")]
    });

    useEffect(() => {
        if (!fonts || !boardLayout.cellLength || !boardLayout.subCellLength) {
            return;
        }

        const numberFontSize = boardLayout.cellLength * 0.8 // 80% of the cell length
        const notesFontSize = boardLayout.subCellLength * 0.9 // A grid of 3x3 notes can be placed within each cell

        const numberFont = matchFont({ fontSize: numberFontSize, fontFamily: "SFANumber" }, fonts);
        const notesFont = matchFont({ fontSize: notesFontSize, fontFamily: "SFANumber" }, fonts);

        graphicsStoreState().setFontLayout({
            numberFont: numberFont,
            notesFont: notesFont,
            numberFontSize: numberFontSize,
            notesFontSize: notesFontSize,
            numberCharSizeMap: TextHelper.measureAllNumbersForFont(numberFont),
            noteCharSizeMap: TextHelper.measureAllNumbersForFont(notesFont),
        })

        return () => {
            graphicsStoreState().reset();
        }
    }, [fonts, boardLayout.cellLength, boardLayout.subCellLength]);

    const measureLayout = (): void => {
        containerRef.current?.measure((_x, _y, width, height) => {
            // Determine the board layout
            const availableBoardLength = Math.min(width, height);
            graphicsStoreState().setBoardLayout(availableBoardLength)
        });
    };

    return (
        <View
            ref={containerRef}
            onLayout={measureLayout}
            className="flex-1 justify-center items-center"
        >
            {boardLayout.boardLength ? (
                <View style={{ minWidth: boardLayout.boardLength, minHeight: boardLayout.boardLength }}>
                    {children}
                </View>
            ) : null}
        </View>
    );
};