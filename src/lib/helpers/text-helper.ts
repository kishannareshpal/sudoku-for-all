import { SkFont } from "@shopify/react-native-skia";
import { Difficulty, Size, CharSizeMap } from "../shared-types";

export class TextHelper {
    static formatDifficulty(difficulty: Difficulty): string {
        switch (difficulty) {
            case "easy":
                return "Easy";

            case "medium":
                return "Medium";

            case "hard":
                return "Hard";

            case "very-hard":
                return "Very hard";

            case "extreme":
                return "Extreme";

            default:
                throw new Error(`Invalid difficulty provided: ${difficulty}`);
        }
    }

    /**
     * Measure the dimensions of the characters 1-9 that are rendered in the board.
     * - We cache this, as we use the value to determine the accurate position of where to render the numbers.
     *
     * @param font - The Skia font that will be used to render the character in the board
     * @returns - A map of each character (number) and its size that you can cache anywhere (e.g. a store)
     */
    static measureAllNumbersForFont(
        font: Pick<SkFont, "measureText">,
    ): CharSizeMap {
        const sizes: Size[] = [];
        for (let i = 1; i <= 9; i++) {
            sizes.push(font.measureText(i.toString()));
        }

        return {
            1: font.measureText("1"),
            2: font.measureText("2"),
            3: font.measureText("3"),
            4: font.measureText("4"),
            5: font.measureText("5"),
            6: font.measureText("6"),
            7: font.measureText("7"),
            8: font.measureText("8"),
            9: font.measureText("9"),
        };
    }
}
