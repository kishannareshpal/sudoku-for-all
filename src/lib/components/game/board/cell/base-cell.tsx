import { useBoardGraphicsContext } from "@/lib/components/game/board/board-graphics-context";
import { StyleSheet, View, ViewProps } from "react-native";

export type BaseCellProps = ViewProps & {
    row: number,
    col: number
}

export const BaseCell = (
    {
        row,
        col,
        children,
        style,
        ...restProps
    }: BaseCellProps,
) => {
    const boardCanvas = useBoardGraphicsContext();

    return (
        <View
            style={[
                styles.cell,
                {
                    width: boardCanvas.cellLength,
                    height: boardCanvas.cellLength,
                },
                style
            ]}
            {...restProps}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})
