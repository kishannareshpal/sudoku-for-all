import { CellHelper } from "@/lib/helpers/cell-helper";
import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { withUniwind } from 'uniwind';
import { CellCollection } from "./cell/collection";
import { CursorCell } from "./cell/cursor-cell";
import { Dividers } from "./cell/dividers";
import { PeerCells } from "./cell/peer-cells";

const StyledCanvas = withUniwind(Canvas);

export const Board = () => {
    const panGesture = Gesture.Pan()
        .averageTouches(true)
        .onBegin((event) => {
            CellHelper.moveCursorToPoint(event);
        })
        .onChange((event) => {
            CellHelper.moveCursorToPoint(event);
        })
        .runOnJS(true);

    return (
        <GestureDetector gesture={panGesture}>
            <View className="flex-1 bg-white relative">
                <StyledCanvas className="flex-1">
                    {/*
                        Render order matters here:
                        - Elements listed earlier are drawn first / appear "behind"
                        - Elements listed later are drawn on top / appear "after / atop" the ones earlier
                        This is like z-index: later children overlay earlier ones
                    */}

                    <PeerCells />
                    <CellCollection />
                    <Dividers />
                    <CursorCell />
                </StyledCanvas>
            </View>
        </GestureDetector>
    );
};
