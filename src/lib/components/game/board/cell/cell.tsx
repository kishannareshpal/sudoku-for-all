import { CellHelper } from "@/lib/helpers/cell-helper";
import { PointHelper } from "@/lib/helpers/point-helper";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { useShallow } from "zustand/react/shallow";
import { CommonCellProps } from "./base-cell";
import { NotesCellContent } from "./notes-cell-content";
import { NumberCellContent } from "./number-cell-content";

type CellProps = CommonCellProps & {};

export const Cell = ({ gridPosition }: CellProps) => {
    const { given, player } = useGameplayStore(
        useShallow((state) => {
            return {
                given: state.puzzle?.given?.[gridPosition.row]?.[gridPosition.col],
                player: state.puzzle?.player?.[gridPosition.row]?.[gridPosition.col],
            }
        })
    )

    const notes = useGameplayStore((state) => state.puzzle?.notes?.[gridPosition.row]?.[gridPosition.col]) ?? []
    const isStatic = useGameplayStore((state) => CellHelper.isStaticAt(gridPosition, state.puzzle?.given));
    const number: number = given || player || 0;

    const cellLength = useGraphicsStore((state) => state.boardLayout.cellLength);
    const cellPoint = PointHelper.createFromGridPosition(gridPosition, cellLength)

    if (number) {
        return (
            <NumberCellContent
                value={number}
                cellPoint={cellPoint}
                isStatic={isStatic}
            />
        )
    } else if (notes.length) {
        return (
            <NotesCellContent
                values={notes}
                cellPoint={cellPoint}
            />
        )
    } else {
        return null;
    }
};
