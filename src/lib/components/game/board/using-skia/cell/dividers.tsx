import { ROWS_COUNT } from "@/lib/constants/board";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-canvas-size.atom";
import { Points, vec } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";

export const Dividers = () => {
	const boardDimensions = useAtomValue(boardDimensionsAtom);
	
	const buildLines = () => {
		const lines = [];
		
		// Build vertical dividing lines
		for (let rowIndex = 1; rowIndex < ROWS_COUNT; rowIndex++) {
			const pointX = rowIndex * boardDimensions.cellLength;
			
			lines.push(
				vec(pointX, 0),
				vec(pointX, boardDimensions.boardLength)
			)
		}
		
		// Build the horizontal dividing lines
		for (let colIndex = 1; colIndex < ROWS_COUNT; colIndex++) {
			const pointY = colIndex * boardDimensions.cellLength;
			
			lines.push(
				vec(0, pointY),
				vec(boardDimensions.boardLength, pointY)
			)
		}
		
		// Build the outer board stroke (forming a square)
		const topLeft = vec(0, 0);
		const topRight = vec(boardDimensions.boardLength, 0);
		const bottomRight = vec(boardDimensions.boardLength, boardDimensions.boardLength);
		const bottomLeft = vec(0, boardDimensions.boardLength)
		
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
		points={buildLines()}
		mode="lines"
		color="lightblue"
		style="stroke"
		strokeWidth={1}
		/>
	)
}