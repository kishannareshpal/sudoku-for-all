import { CELL_OUTLINE_WIDTH, ROWS_COUNT, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { Group, Points, Rect, vec } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";

export const Dividers = () => {
	const boardDimensions = useAtomValue(boardDimensionsAtom);
	let halfOfStrokeWidth = CELL_OUTLINE_WIDTH / 8;
	
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
		
		return lines;
	}

	const buildSubgridDividingLines = () => {
		const lines = [];
		
		// Build vertical dividing lines
		for (let rowIndex = 1; rowIndex < ROWS_COUNT; rowIndex++) {
			const pointX = (rowIndex * boardDimensions.cellLength) + halfOfStrokeWidth;

			const isDividingSubgrids = rowIndex % 3 === 0;
			if (isDividingSubgrids) {
				lines.push(
					vec(pointX, 0),
					vec(pointX, boardDimensions.boardLength)
				)
			}
		}
		
		// Build the horizontal dividing lines
		for (let colIndex = 1; colIndex < ROWS_COUNT; colIndex++) {
			const pointY = (colIndex * boardDimensions.cellLength) + halfOfStrokeWidth;
			
			const isDividingSubgrids = colIndex % 3 === 0;
			if (isDividingSubgrids) {
				lines.push(
					vec(0, pointY),
					vec(boardDimensions.boardLength, pointY)
				)
			}
		}
		
		return lines;
	}
	
	return (
		<Group>
			<Points
				antiAlias
				points={buildLines()}
				mode="lines"
				color="grey"
				strokeJoin="bevel"
				style="stroke"
				strokeWidth={CELL_OUTLINE_WIDTH}
			/>

			<Points
				antiAlias
				points={buildSubgridDividingLines()}
				mode="lines"
				color="grey"
				strokeJoin="bevel"
				style="stroke"
				strokeWidth={SUBGRID_OUTLINE_WIDTH}
			/>

			<Rect
				x={SUBGRID_OUTLINE_WIDTH / 2}
				y={SUBGRID_OUTLINE_WIDTH / 2}
				width={boardDimensions.boardLength - SUBGRID_OUTLINE_WIDTH}
				height={boardDimensions.boardLength - SUBGRID_OUTLINE_WIDTH}
				color="grey"
				style="stroke"
				strokeWidth={SUBGRID_OUTLINE_WIDTH}
				strokeJoin="round"
			/>
		</Group>
	)
}