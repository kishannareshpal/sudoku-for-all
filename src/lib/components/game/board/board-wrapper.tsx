import { BoardCanvasContext } from "@/lib/components/game/board/board-context";
import { COLUMNS_COUNT } from "@/lib/constants/board";
import { PropsWithChildren, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";

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
            style={styles.container}
            {...restProps}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
