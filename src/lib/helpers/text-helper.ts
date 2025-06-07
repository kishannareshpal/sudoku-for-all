import { Difficulty } from "../shared-types";

export class TextHelper {
    static formatDifficulty(difficulty: Difficulty): string {
        switch (difficulty) {
            case 'easy':
                return 'Easy';

            case "medium":
                return 'Medium';

            case "hard":
                return 'Hard';

            case "very-hard":
                return 'Very hard';

            case "extreme":
                return 'Extreme'

            default:
                break;
        }
    }
}
