import { SkFont } from "@shopify/react-native-skia";
import { CharSizeMap, Difficulty, Size } from "../shared-types";

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
        font: Pick<SkFont, "measureText" | "getTextWidth">,
    ): CharSizeMap {
        const measure = (textValue: string): Size => {
            /**
             * @remark I'm explicitly using the deprecated `getTextWidth` API (which is currently deprecated in favor of `measureText`) because
             * measureText's width are incorrect for monospaced fonts. See: https://github.com/Shopify/react-native-skia/issues/3488
            */
            const width = font.getTextWidth(textValue);
            const { height } = font.measureText(textValue);

            return {
                width: width,
                height: height
            }
        }

        return {
            1: measure('1'),
            2: measure('2'),
            3: measure('3'),
            4: measure('4'),
            5: measure('5'),
            6: measure('6'),
            7: measure('7'),
            8: measure('8'),
            9: measure('9'),
        };
    }
}
