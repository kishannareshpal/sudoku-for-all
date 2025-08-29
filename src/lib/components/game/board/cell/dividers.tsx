import { CELL_OUTLINE_WIDTH, ROWS_COUNT } from "@/lib/constants/board";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { Points, vec } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";

const halfOfStrokeWidth = CELL_OUTLINE_WIDTH / 8;

export const Dividers = () => {
	const boardDimensions = useAtomValue(boardDimensionsAtom);
	
	const buildLines = () => {
		const lines = [];
		
		// Build vertical dividing lines
		for (let rowIndex = 1; rowIndex < ROWS_COUNT; rowIndex++) {
			const pointX = (rowIndex * boardDimensions.cellLength) + halfOfStrokeWidth;
			
			lines.push(
				vec(pointX, 0),
				vec(pointX, boardDimensions.boardLength)
			)
		}
		
		// Build the horizontal dividing lines
		for (let colIndex = 1; colIndex < ROWS_COUNT; colIndex++) {
			const pointY = (colIndex * boardDimensions.cellLength) + halfOfStrokeWidth;
			
			lines.push(
				vec(0, pointY),
				vec(boardDimensions.boardLength, pointY)
			)
		}
		
		// Build the outer board stroke (forming a square)
		const topLeft = vec(halfOfStrokeWidth, halfOfStrokeWidth);
		const topRight = vec(boardDimensions.boardLength - halfOfStrokeWidth, halfOfStrokeWidth);
		const bottomRight = vec(boardDimensions.boardLength - halfOfStrokeWidth, boardDimensions.boardLength - halfOfStrokeWidth);
		const bottomLeft = vec(halfOfStrokeWidth, boardDimensions.boardLength - halfOfStrokeWidth)
		
		lines.push(
			// From top-left to top-right:
			topLeft,
			topRight,
			// From top-right to bottom-right:
			topRight,
			bottomRight,
			// From bottom-right to bottom-left:
			bottomRight,
			bottomLeft,
			// From bottom-left to top-left (closing):
			bottomLeft,
			topLeft,
		);
		
		return lines;
	}
	
	return (
		<Points
            antiAlias
            points={buildLines()}
            mode="lines"
            color="black"
            style="stroke"
            strokeWidth={CELL_OUTLINE_WIDTH}
		/>
	)
}