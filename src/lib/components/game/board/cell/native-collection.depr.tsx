import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { PointHelper } from "@/lib/helpers/point-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { CommonCellProps } from "./base-cell";

export const NativeCellCollection = () => {
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
                    <NativeCell
                        key={id}
                        gridPosition={gridPosition}
                    />

                    // <Cell
                    //     key={id}
                    //     gridPosition={gridPosition}
                    // />
                );
            }
        }

        return cells;
    }, [])

    return (
        <View className="flex-1 relative">
            {/* <Cell
                gridPosition={GridPositionHelper.createFromIndexes(4, 4)}
            /> */}

            {/* <NativeCell
                gridPosition={GridPositionHelper.createFromIndexes(4, 4)}
            /> */}

            {cells}
        </View>
    );
}

const NativeCell = ({ gridPosition }: CommonCellProps) => {
    const {
        given,
        player
    } = useGameplayStore(
        useShallow((state) => {
            return {
                given: state.puzzle?.given?.[gridPosition.row]?.[gridPosition.col],
                player: state.puzzle?.player?.[gridPosition.row]?.[gridPosition.col],
            }
        })
    )

    const notes = useGameplayStore((state) => state.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col]) ?? []

    const isStatic = useGameplayStore((state) => CellHelper.isStaticAt(gridPosition, state.puzzle?.given));

    const number: number = 1 || given || player || 0;

    if (number) {
        return <NativeNumberCell value={number} gridPosition={gridPosition} isStatic={isStatic} />
    } else if (notes.length) {
        return <NativeNotesCell notes={notes} gridPosition={gridPosition} />
    } else {
        return null;
    }
}

const NativeNumberCell = ({ value, isStatic, gridPosition }: CommonCellProps & { value: number, isStatic: boolean }) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const fontSize = useGraphicsStore((state) => state.fontLayout.numberFontSize);

    const point = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength,
    )

    return (
        <View
            className="absolute items-center justify-center"
            style={{
                width: cellLength,
                height: cellLength,
                left: point.x,
                top: point.y,
            }}
        >
            <Text
                className="text-black font-bold leading-none"
                style={{ fontSize: fontSize }}
            >
                {value}
            </Text>
        </View>
    );
}

const NativeNotesCell = ({ notes, gridPosition }: CommonCellProps & { notes: number[] }) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const subCellLength = cellLength / 3

    const point = PointHelper.createFromGridPosition(
        gridPosition,
        cellLength,
    )

    return (
        <View
            className="absolute items-center justify-center"
            style={{
                width: cellLength,
                height: cellLength,
                left: point.x,
                top: point.y,
            }}
        >
            {notes.map((noteValue) => (
                <NativeNoteText
                    key={noteValue}
                    value={noteValue}
                    subCellLength={subCellLength}
                />
            ))}
        </View>
    );
}

const NativeNoteText = ({ value, subCellLength }: { subCellLength: number, value: number }) => {
    const fontSize = useGraphicsStore((state) => state.fontLayout.notesFontSize);
    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9,
    );

    const pointForSubgridPosition = PointHelper.createFromSubgridPosition(subgridPosition, subCellLength)

    return (
        <View
            className="absolute items-center justify-center"
            style={{
                width: subCellLength,
                height: subCellLength,
                left: pointForSubgridPosition.x,
                top: pointForSubgridPosition.y,
            }}
        >
            <Text
                className="text-blue-800 font-bold leading-none"
                style={{ fontSize: fontSize }}
            >
                {value}
            </Text>
        </View>
    )
}