import { useBoardCanvasContext } from "@/lib/components/game/board/board-context";
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
    const boardCanvas = useBoardCanvasContext();

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
        outlineStyle: 'solid',
        outlineWidth: 1,
        outlineColor: '#3D2E00',
        justifyContent: 'center',
        alignItems: 'center',
    }
})