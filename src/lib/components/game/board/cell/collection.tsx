import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { Group } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Cell } from "./cell";

export const CellCollection = () => {
    const cells = useMemo(() => {
        const cells = [];

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const gridPosition = GridPositionHelper.createFromIndexes(
                    colIndex,
                    rowIndex,
                );

                const id = GridPositionHelper.stringNotationOf(gridPosition);

                cells.push(
                    <Cell
                        key={id}
                        gridPosition={gridPosition}
                    />
                );
            }
        }

        return cells;
    }, [])

    return (
        <Group>
            {/* <Cell
                gridPosition={GridPositionHelper.createFromIndexes(4, 4)}
            /> */}

            {cells}
        </Group>

    );
}