import { PuzzleHelper } from "../puzzle-helper";
import { Difficulty } from "../shared-types";
import { gameplayStoreState } from "../store/gameplay";

export class GameHelper {
    static newGame(difficulty: Difficulty) {
        const puzzle = PuzzleHelper.generate(difficulty);

        gameplayStoreState().updatePuzzle(puzzle);
    }
}
