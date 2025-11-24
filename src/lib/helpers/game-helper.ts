import { Difficulty } from "../shared-types";
import { gameplayStoreState } from "../store/gameplay";
import { PuzzleHelper } from "./puzzle-helper";

export class GameHelper {
    static newGame(difficulty: Difficulty): void {
        const puzzle = PuzzleHelper.generate(difficulty);
        gameplayStoreState().start(puzzle);
    }
}
