import { graphicsStoreState } from "@/lib/store/board";
import React, { PropsWithChildren, useRef, useState } from "react";
import { View } from "react-native";

export const BoardWrapper = ({ children }: PropsWithChildren) => {
    const containerRef = useRef<View>(null!);

    const [boardLength, setBoardLength] = useState<number>(0);

    const measureLayout = (): void => {
        containerRef.current?.measure((_x, _y, width, height) => {
            const availableBoardLength = Math.min(width, height);

            const fittedBoardLength = graphicsStoreState().setLayout(availableBoardLength)
            setBoardLength(fittedBoardLength);
        });
    };

    return (
        <View
            ref={containerRef}
            onLayout={measureLayout}
            className="flex-1 justify-center items-center"
        >
            {boardLength ? (
                <View className="bg-white" style={{ minWidth: boardLength, minHeight: boardLength }}>
                    {children}
                </View>
            ) : null}
        </View>
    );
};