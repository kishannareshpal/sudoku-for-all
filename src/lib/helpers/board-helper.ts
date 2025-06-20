import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { GridPosition } from "../shared-types";
import { gameplayStoreState } from "../store/gameplay-store";
import { CellHelper } from "./cell-helper";
import { GridPositionHelper } from "./grid-position-helper";

type PeerType = 'note' | 'number' | 'both';

type ProcessEachPeerAndNonPeerCellOptions = {
    allowSelfAsPeer: boolean,
    allowRowPeers: boolean,
    allowColumnPeers: boolean,
    allowSubgridPeers: boolean,
    allowSameValueAnywherePeers: boolean,
    allowSameValueAsNoteAnywherePeers: boolean,
    peerFoundCallback: (peerGridPosition: GridPosition, peerType: PeerType) => void,
    nonPeerFoundCallback: (nonPeerGridPosition: GridPosition) => void,
}

export class BoardHelper {
    static processEachPeerAndNonPeerCell(
        cell: { value: number, gridPosition: GridPosition },
        options: ProcessEachPeerAndNonPeerCellOptions
    ) {
        const puzzle = gameplayStoreState().puzzle;

        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            for (let colIndex = 0; colIndex < COLUMNS_COUNT; colIndex++) {
                const gridPosition = GridPositionHelper.createFromIndexes(rowIndex, colIndex);

                // const toggledNotesAtThisGridPosition = CellHelper.getToggledNotesAt(gridPosition, puzzle?.notes);

                // Check note peer condition
                const hasNotePeer = (
                    options.allowColumnPeers
                        && CellHelper.isValueEmpty(cell.value)
                        && CellHelper.areNotesNotEmptyAt(cell.gridPosition, puzzle?.notes)
                )
                    ? CellHelper.containsToggledNoteAt(gridPosition, cell.value)
                    : false;


            }
        }
    }
}
