import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridPosition, NumberCharacter, Point } from "@/lib/shared-types";
import { useGraphicsStore } from "@/lib/store/board";
import { useGameplayStore } from "@/lib/store/gameplay-store";
import { fonts$ } from "@/lib/store/observables/fonts";
import { use$ } from "@legendapp/state/react";
import { Group, Rect, Text } from "@shopify/react-native-skia";
import { BaseCell, CommonCellProps } from "./base-cell";

type CellProps = CommonCellProps & {};

export const Cell = ({ gridPosition }: CellProps) => {
    const given = useGameplayStore(
        (store) => store.puzzle?.given?.[gridPosition.row]?.[gridPosition.col],
    );
    const player = useGameplayStore(
        (store) => store.puzzle?.player?.[gridPosition.row]?.[gridPosition.col],
    );
    const notes = useGameplayStore(
        (store) =>
            store.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col] ?? [],
    );

    const isStatic = useGameplayStore((store) =>
        CellHelper.isStaticAt(gridPosition, store.puzzle?.given),
    );

    const number: number = given || player || 0;

    return (
        <BaseCell
            gridPosition={gridPosition}
            renderChildren={(_, cellPointForGridPosition) => {
                if (number > 0) {
                    return (
                        <NumberCellText
                            value={number}
                            cellPointForGridPosition={cellPointForGridPosition}
                            isStatic={isStatic}
                        />
                    );
                } else if (notes?.length) {
                    return (
                        <NotesCellText
                            values={notes}
                            gridPosition={gridPosition}
                            cellPointForGridPosition={cellPointForGridPosition}
                        />
                    );
                } else {
                    return null;
                }
            }}
        />
    );
};

type NumberCellTextProps = {
    value: number;
    cellPointForGridPosition: Point;
    isStatic: boolean;
};

const NumberCellText = ({
    value,
    cellPointForGridPosition,
    isStatic = true,
}: NumberCellTextProps) => {
    const fonts = use$(fonts$);
    const cellLength = useGraphicsStore((state) => state.cellLength)
    const charSize = fonts.charSizeFor(
        "number",
        value.toString() as NumberCharacter,
    );

    const textPoint = {
        x: cellPointForGridPosition.x + cellLength / 2 - charSize.width / 2,
        y: cellPointForGridPosition.y + cellLength / 2 + charSize.height / 2,
    };

    return (
        <Text
            antiAlias
            x={textPoint.x}
            y={textPoint.y}
            text={value.toString()}
            font={fonts.numberFont}
            color={isStatic ? "white" : "orange"}
        />
    );
};

type NotesCellTextProps = {
    values: number[];
    gridPosition: GridPosition;
    cellPointForGridPosition: Point;
};

const NotesCellText = ({
    values,
    gridPosition,
    cellPointForGridPosition,
}: NotesCellTextProps) => {
    return (
        <Group>
            {values.map((noteValue) => (
                <NoteText
                    key={noteValue}
                    value={noteValue}
                    gridPosition={gridPosition}
                    cellPointForGridPosition={cellPointForGridPosition}
                />
            ))}
        </Group>
    );
};

type NoteTextProps = {
    value: number;
    gridPosition: GridPosition;
    cellPointForGridPosition: Point;
};

const NoteText = ({
    value,
    gridPosition,
    cellPointForGridPosition,
}: NoteTextProps) => {
    const isPeer = useGameplayStore((store) =>
        store.cursorPeerCells.some((peerCellMetadata) => {
            return (
                GridPositionHelper.equals(
                    gridPosition,
                    peerCellMetadata.gridPosition,
                ) &&
                peerCellMetadata.type === "note" &&
                CellHelper.getNumberValueAt(
                    store.cursorGridPosition,
                    store.puzzle?.player,
                    store.puzzle?.given,
                ) === value
            );
        }),
    );

    const fonts = use$(fonts$);
    const cellLength = useGraphicsStore((state) => state.cellLength)
    const charSize = fonts.charSizeFor(
        "note",
        value.toString() as NumberCharacter,
    );

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9,
    );

    const subgridCellLength = cellLength / 3;
    const padding = 0;

    const point = {
        x:
            cellPointForGridPosition.x +
            subgridPosition.col * (subgridCellLength - padding) +
            subgridCellLength / 2 -
            charSize.width / 2 +
            padding,
        y:
            cellPointForGridPosition.y +
            subgridPosition.row * (subgridCellLength - padding) +
            subgridCellLength / 2 +
            charSize.height / 2 +
            padding,
    };

    const rectPoint = {
        x: cellPointForGridPosition.x + subgridPosition.col * subgridCellLength,
        y:
            cellPointForGridPosition.y +
            subgridPosition.row * subgridCellLength +
            subgridCellLength,
    };

    return (
        <Group>
            {isPeer ? (
                <Rect
                    antiAlias
                    x={rectPoint.x}
                    y={rectPoint.y}
                    width={subgridCellLength}
                    height={-subgridCellLength}
                    color="blue"
                />
            ) : null}

            <Text
                antiAlias
                x={point.x}
                y={point.y}
                text={value.toString()}
                font={fonts.notesFont}
                color="white"
            />
        </Group>
    );
};
