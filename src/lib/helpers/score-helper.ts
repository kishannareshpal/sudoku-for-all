import { Difficulty } from "../shared-types";

const CORRECT_MOVE_BASE_POINTS = 10;
const INCORRECT_MOVE_BASE_POINTS = -20;

export class ScoreHelper {
    static difficultyMultiplier(difficulty: Difficulty): number {
        switch (difficulty) {
            case "easy":
                return 1;
            case "medium":
                return 2;
            case "hard":
                return 3;
            case "very-hard":
                return 4;
            case "extreme":
                return 5;
        }
    }

    static pointsForCorrectMove(difficulty: Difficulty): number {
        return CORRECT_MOVE_BASE_POINTS * this.difficultyMultiplier(difficulty);
    }

    static pointsForIncorrectMove(difficulty: Difficulty): number {
        return INCORRECT_MOVE_BASE_POINTS * this.difficultyMultiplier(difficulty);
    }

    static clampScore(score: number): number {
        return Math.max(0, score);
    }
}
