import { getSudoku } from "sudoku-gen";
import { Difficulty, Puzzle } from "../shared-types";
import { BoardNotationHelper } from "./board-notation-helper";

/**
 * Type from 'sudoku-gen'
 */
type GeneratorLibDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export class PuzzleHelper {
    static empty(difficulty: Difficulty): Puzzle {
        return {
            timeElapsedInSeconds: 0,
            difficulty: difficulty,
            solution: BoardNotationHelper.emptyGridNotation(),
            given: BoardNotationHelper.emptyGridNotation(),
            player: BoardNotationHelper.emptyGridNotation(),
            notes: BoardNotationHelper.emptyNotesGridNotation(),
            moveHistory: {
                currentMoveIndex: -1,
                moves: []
            }
        }
    }

    static generate(difficulty: Difficulty): Puzzle {
        const puzzle = getSudoku(
            this.mapAppToGeneratorLibDifficulty(difficulty)
        );

        /**
         * @remarks This particular sudoku generator library uses dash ('-') as empty cells in the notation,
         * but our app uses '0' instead. We need to replace all occurences of '-' with '0'
         */
        const givenPlainStringNotation = puzzle.puzzle.replaceAll('-', '0');
        const solutionPlainStringNotation = puzzle.solution;

        return {
            timeElapsedInSeconds: 0,
            difficulty: difficulty,
            solution: BoardNotationHelper.transformPlainStringToGridNotation(solutionPlainStringNotation),
            given: BoardNotationHelper.transformPlainStringToGridNotation(givenPlainStringNotation),
            notes: BoardNotationHelper.emptyNotesGridNotation(),
            player: BoardNotationHelper.emptyGridNotation(),
            moveHistory: {
                currentMoveIndex: -1,
                moves: []
            }
        }
    }

    static mapAppToGeneratorLibDifficulty(appDifficulty: Difficulty): GeneratorLibDifficulty {
        switch (appDifficulty) {
            case 'easy':
                return 'easy';

            case "medium":
                return 'medium';

            case "hard":
                return 'hard';

            case "very-hard":
            case "extreme": ;
                return 'expert'
        }
    }
}
