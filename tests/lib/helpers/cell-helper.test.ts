import { CellHelper } from "@/lib/helpers/cell-helper";
import { GridPositionHelper } from "@/lib/helpers/grid-position-helper";
import { PuzzleHelper } from "@/lib/helpers/puzzle-helper";
import { gameplayStoreState } from "@/lib/store/gameplay";

describe("CellHelper", () => {
    describe("#processEachPeerAndNonPeerCell", () => {
        it.skip("cells with the same value anywhere are considered as being peer if the option is enabled", () => {
            // Setup the puzzle we'll be processing on
            const puzzle = PuzzleHelper.empty("easy");
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

            gameplayStoreState().start(puzzle);

            const cursorGridPosition = GridPositionHelper.createFromIndexes(
                1,
                1,
            );

            const peerFoundCallbackSpy = jest.fn();
            CellHelper.processEachPeerAndNonPeerCell(
                cursorGridPosition,
                peerFoundCallbackSpy,
                undefined,
                {
                    allowSameValueAnywherePeers: true, // this is true by default ayway
                },
            );

            // Ensure that the same value given at a different spot is evaluated as being a peer
            expect(peerFoundCallbackSpy).toHaveBeenCalledWith({
                gridPosition: GridPositionHelper.createFromIndexes(7, 7),
                type: "number",
            });

            // Ensure that the same value the player entered at a different spot is evaluated as being a peer
            expect(peerFoundCallbackSpy).toHaveBeenCalledWith({
                gridPosition: GridPositionHelper.createFromIndexes(4, 7),
                type: "number",
            });

            const totalNumberOfPeersFound = 23; // 9 on the same grid + 6 making up a row + 6 making up a column + 2 anywhere else with the same value
            expect(peerFoundCallbackSpy).toHaveBeenCalledTimes(
                totalNumberOfPeersFound,
            );
        });

        it("cells with notes with the same value anywhere are considered as being peer if the option is enabled", () => {
            // Setup the puzzle we'll be processing on
            const puzzle = PuzzleHelper.empty("easy");

            puzzle.given[1][1] = 2;
            puzzle.notes[4][4] = [1, 2, 3];

            gameplayStoreState().start(puzzle);

            const cursorGridPosition = GridPositionHelper.createFromIndexes(
                1,
                1,
            );

            const peerFoundCallbackSpy = jest.fn();
            CellHelper.processEachPeerAndNonPeerCell(
                cursorGridPosition,
                peerFoundCallbackSpy,
            );

            // Ensure that a note with the same value given at a different spot anywhere is evaluated as being a peer
            expect(peerFoundCallbackSpy).toHaveBeenCalledWith({
                gridPosition: GridPositionHelper.createFromIndexes(4, 4),
                type: "note",
            });
        });
    });
});
