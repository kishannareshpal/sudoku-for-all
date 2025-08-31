import { BoardHelper } from "@/lib/helpers/board-helper";
import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { PuzzleHelper } from "@/lib/puzzle-helper";
import { gameplayStoreState } from "@/lib/store/gameplay-store";

describe('BoardHelper', () => {
    describe('#processEachPeerAndNonPeerCell', () => {
        it('cells with the same value anywhere are considered as being peer if the option is enabled', () => {
            // Setup the puzzle we'll be processing on
            const puzzle = PuzzleHelper.empty('easy');
            puzzle.given = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ];
            puzzle.player = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ];

            gameplayStoreState().updatePuzzle(puzzle);

            const cursorGridPosition = GridPositionHelper.createFromIndexes(1, 1);
            
            const valueAtCursor = CellHelper.getNumberValueAt(cursorGridPosition);
            expect(valueAtCursor).toEqual(2);

            const peerFoundCallbackSpy = jest.fn();
            BoardHelper.processEachPeerAndNonPeerCell(
                { 
                    gridPosition: cursorGridPosition,
                    value: valueAtCursor
                },
                peerFoundCallbackSpy,
                undefined,
                { 
                    allowSameValueAnywherePeers: true  // this is true by default ayway
                }
            );

            // Ensure that the same value given at a different spot is evaluated as being a peer
            expect(peerFoundCallbackSpy).toHaveBeenCalledWith(
                GridPositionHelper.createFromIndexes(7, 7),
                'number'
            )
            
            // Ensure that the same value the player entered at a different spot is evaluated as being a peer
            expect(peerFoundCallbackSpy).toHaveBeenCalledWith(
                GridPositionHelper.createFromIndexes(4, 7),
                'number'
            )

            
            const totalNumberOfPeersFound = 23; // 9 on the same grid + 6 making up a row + 6 making up a column + 2 anywhere else with the same value
            expect(peerFoundCallbackSpy).toHaveBeenCalledTimes(totalNumberOfPeersFound);
        });
    });
})