import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { withUniwind } from 'uniwind';
import { CellCollection } from "./cell/collection";
import { Dividers } from "./cell/dividers";

const StyledCanvas = withUniwind(Canvas);

export const Board = () => {
    const panGesture = Gesture.Pan()
        .averageTouches(true)
        .onBegin((event) => {
            // CellHelper.moveCursorToPoint(event);
            // console.log("Touched the board", graphicsStoreState());
        })
        .onChange((event) => {
            // CellHelper.moveCursorToPoint(event);
        })
        .runOnJS(true);

    return (
        <GestureDetector gesture={panGesture}>
            <View className="flex-1 relative">
                <StyledCanvas className="flex-1">
                    {/*
                Render order matters here:
                - Elements listed earlier are drawn first / appear "behind"
                - Elements listed later are drawn on top / appear "after / atop" the ones earlier
                This is like z-index: later children overlay earlier ones
            */}

                    {/* <PeerCells /> */}

                    <CellCollection />

                    <Dividers />

                    {/* <CursorCell /> */}
                </StyledCanvas>

                {/* <View className="absolute inset-0">
                    <NativeCellCollection />
                </View> */}
            </View>
        </GestureDetector>
    );
};
