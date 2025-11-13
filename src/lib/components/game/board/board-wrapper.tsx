import { CellHelper } from "@/lib/helpers/cell-helper";
import { graphicsStoreState } from "@/lib/store/board";
import React, { PropsWithChildren, useRef } from "react";
import { View } from "react-native";

export const BoardWrapper = ({ children }: PropsWithChildren) => {
    const containerRef = useRef<View>(null!);

    const measureLayout = (): void => {
        containerRef.current?.measure((_x, _y, width, height) => {
            const fitBoardLength = Math.min(width, height);

            graphicsStoreState().setDimensions({
                boardLength: fitBoardLength,
                cellLength: CellHelper.calculateCellLength(fitBoardLength)
            })
        });
    };

    return (
        <View
            ref={containerRef}
            onLayout={measureLayout}
            className="flex-1 justify-center items-center"
        >
            {children}
        </View>
    );
};