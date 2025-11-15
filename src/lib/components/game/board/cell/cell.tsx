import { BOARD_OUTLINE_WIDTH } from "@/lib/constants/board";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { PointHelper } from "@/lib/helpers/point-helper";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridPosition, NumberCharacter, Point } from "@/lib/shared-types";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { Group, Skia, TextBlob } from "@shopify/react-native-skia";
import { useShallow } from "zustand/react/shallow";
import { BaseCell, CommonCellProps } from "./base-cell";

type CellProps = CommonCellProps & {};

export const Cell = ({ gridPosition }: CellProps) => {
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

    const notes = [1, 2, 3, 4, 5, 6, 7, 8, 9]// useGameplayStore((state) => state.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col]) ?? []

    const isStatic = useGameplayStore((state) => CellHelper.isStaticAt(gridPosition, state.puzzle?.given));

    const number: number = 0 // given || player || 0;

    return (
        <BaseCell
            gridPosition={gridPosition}
            renderChildren={(cellPointForGridPosition) => {
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

export type NumberCellTextProps = {
    value: number;
    cellPointForGridPosition: Point;
    isStatic: boolean;
};

const NumberCellText = ({
    value,
    cellPointForGridPosition,
    isStatic = true,
}: NumberCellTextProps) => {
    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength)

    const font = useGraphicsStore((state) => state.fontLayout.numberFont);
    const valueCharSize = useGraphicsStore(
        useShallow((state) => state.getCharSizeFor('number', value.toString() as NumberCharacter))
    )

    if (!font) {
        return null;
    }

    const textPoint = {
        x: cellPointForGridPosition.x + (cellLength / 2) - (valueCharSize.width / 2),
        y: cellPointForGridPosition.y + (cellLength / 2) + (valueCharSize.height / 2),
    };

    const textBlob = Skia.TextBlob.MakeFromText(value.toString(), font);

    return (
        <TextBlob
            antiAlias
            x={textPoint.x}
            y={textPoint.y}
            blob={textBlob}
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
    // const isPeer = useGameplayStore((store) =>
    //     store.cursorPeerCells.some((peerCellMetadata) => {
    //         return (
    //             GridPositionHelper.equals(
    //                 gridPosition,
    //                 peerCellMetadata.gridPosition,
    //             ) &&
    //             peerCellMetadata.type === "note" &&
    //             CellHelper.getNumberValueAt(
    //                 store.cursorGridPosition,
    //                 store.puzzle?.player,
    //                 store.puzzle?.given,
    //             ) === value
    //         );
    //     }),
    // );

    // const fonts = use$(fonts$);
    // const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength)
    // const charSize = fonts.charSizeFor(
    //     "note",
    //     value.toString() as NumberCharacter,
    // );

    // const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
    //     (value - 1) % 9,
    // );

    // const subgridCellLength = cellLength / 3;
    // const padding = 0;

    // const point = {
    //     x:
    //         cellPointForGridPosition.x +
    //         subgridPosition.col * (subgridCellLength - padding) +
    //         subgridCellLength / 2 -
    //         charSize.width / 2 +
    //         padding,
    //     y:
    //         cellPointForGridPosition.y +
    //         subgridPosition.row * (subgridCellLength - padding) +
    //         subgridCellLength / 2 +
    //         charSize.height / 2 +
    //         padding,
    // };

    // const rectPoint = {
    //     x: cellPointForGridPosition.x + subgridPosition.col * subgridCellLength,
    //     y:
    //         cellPointForGridPosition.y +
    //         subgridPosition.row * subgridCellLength +
    //         subgridCellLength,
    // };

    // return (
    //     <Group>
    //         {isPeer ? (
    //             <Rect
    //                 antiAlias
    //                 x={rectPoint.x}
    //                 y={rectPoint.y}
    //                 width={subgridCellLength}
    //                 height={-subgridCellLength}
    //                 color="blue"
    //             />
    //         ) : null}

    //         <Text
    //             antiAlias
    //             x={point.x}
    //             y={point.y}
    //             text={value.toString()}
    //             font={fonts.notesFont}
    //             color="white"
    //         />
    //     </Group>
    // );

    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength)
    const subCellLength = useGraphicsStore((state) => state.boardLayout.subCellLength)

    const font = useGraphicsStore((state) => state.fontLayout.notesFont);

    const subgridPosition = SubgridPositionHelper.createFromFlatIndex(
        (value - 1) % 9,
    );

    const pointForSubgridPosition = PointHelper.createFromGridPosition(subgridPosition, subCellLength)

    const valueCharSize = useGraphicsStore(
        useShallow((state) => state.getCharSizeFor('note', value.toString() as NumberCharacter))
    )

    if (!font) {
        return null;
    }

    const textPoint = {
        x: cellPointForGridPosition.x + (subCellLength / 2) - (valueCharSize.width / 2),
        y: cellPointForGridPosition.y + (subCellLength / 2) + (valueCharSize.height / 2) - (BOARD_OUTLINE_WIDTH / 2)
    }

    const textBlob = Skia.TextBlob.MakeFromText(value.toString(), font);

    return (
        <TextBlob
            antiAlias
            x={textPoint.x + (subCellLength * subgridPosition.col)}
            y={textPoint.y + (subCellLength * subgridPosition.row)}
            blob={textBlob}
        />
    );
};
