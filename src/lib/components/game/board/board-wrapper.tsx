import { PropsWithChildren, useState } from "react";
import { LayoutChangeEvent, View, ViewProps } from "react-native";
import { BoardCanvasContext } from "@/lib/components/game/board/board-context";
import { COLUMNS_COUNT } from "@/lib/constants/board";

export type BoardWrapperProps = PropsWithChildren<ViewProps>;

export const BoardWrapper = (
    {
        children,
        style,
        ...restProps
    }: BoardWrapperProps
) => {
    const [boardLength, setBoardLength] = useState<number>(0);
    const [cellLength, setCellLength] = useState<number>(0);

    const handleCanvasLayoutChange = (event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;

        const boardLength = Math.min(width, height);
        const cellLength = boardLength / COLUMNS_COUNT;

        setBoardLength(boardLength);
        setCellLength(cellLength);
    }

    return (
        <View
            onLayout={handleCanvasLayoutChange}
            style={{flex: 1}}
        >
            <BoardCanvasContext.Provider
                value={{
                    boardLength: boardLength,
                    cellLength: cellLength
                }}
            >
                {children}
            </BoardCanvasContext.Provider>
        </View>
    )
}