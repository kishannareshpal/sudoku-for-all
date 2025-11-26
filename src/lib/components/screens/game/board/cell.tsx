import { PointHelper } from "@/lib/helpers/point-helper";
import { isValueStaticAt } from "@/lib/helpers/values";
import { BaseCellProps } from "@/lib/shared-types";
import { useGameplayStore } from "@/lib/store/gameplay";
import { useGraphicsStore } from "@/lib/store/graphics";
import { useShallow } from "zustand/react/shallow";
import { NotesCellContent } from "./cell/notes-cell-content";
import { NumberCellContent } from "./cell/number-cell-content";

type CellProps = BaseCellProps;

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
    const isStatic = useGameplayStore((state) => !!state.puzzle && isValueStaticAt({ position: gridPosition, givenGridNotation: state.puzzle.given }));
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
