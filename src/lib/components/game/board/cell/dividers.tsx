import { BOARD_OUTLINE_WIDTH, CELL_OUTLINE_WIDTH, ROWS_COUNT, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";
import { boardDimensionsAtom } from "@/lib/store/atoms/board-dimensions-atom";
import { Group, Points, Rect, vec } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridIndex } from "@/lib/shared-types";

export const Dividers = () => {
	const boardDimensions = useAtomValue(boardDimensionsAtom);
	
	const buildLines = () => {
		const lines = [];

        const halfOfStrokeWidth = (CELL_OUTLINE_WIDTH / 2);

		// Build vertical dividing lines
		for (let rowIndex = 1; rowIndex < ROWS_COUNT; rowIndex++) {
            const isSubgridColIndex = rowIndex % 3 === 0;
            if (isSubgridColIndex) {
                // Don't draw lines for sub-grids - they are drawn separately
                continue;
            }

            const subgridPositionRow = SubgridPositionHelper.rowFromGridPosition(rowIndex as GridIndex);
            const pointX = BOARD_OUTLINE_WIDTH + (rowIndex * boardDimensions.cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (rowIndex - subgridPositionRow - 1)) + (SUBGRID_OUTLINE_WIDTH * subgridPositionRow);

			lines.push(
				vec(pointX, 0),
				vec(pointX, boardDimensions.boardLength)
			)
		}
		
		// Build the horizontal dividing lines
		for (let colIndex = 1; colIndex < ROWS_COUNT; colIndex++) {
            const isSubgridColIndex = colIndex % 3 === 0;
            if (isSubgridColIndex) {
                // Don't draw lines for sub-grids - they are drawn separately
                continue;
            }

            const subgridPositionRow = SubgridPositionHelper.rowFromGridPosition(colIndex as GridIndex);
            const pointY = BOARD_OUTLINE_WIDTH + (colIndex * boardDimensions.cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (colIndex - subgridPositionRow - 1)) + (SUBGRID_OUTLINE_WIDTH * subgridPositionRow);

			lines.push(
				vec(0, pointY),
				vec(boardDimensions.boardLength, pointY)
			)
		}
		
		return lines;
	}

	const buildSubgridDividingLines = () => {
		const lines = [];

        const halfOfStrokeWidth = (SUBGRID_OUTLINE_WIDTH / 2);
		
		// Build vertical dividing lines
		for (let rowIndex = 1; rowIndex < ROWS_COUNT; rowIndex++) {
            const isSubgridColIndex = rowIndex % 3 === 0;
            if (!isSubgridColIndex) {
                continue;
            }

            const subgridPositionRow = SubgridPositionHelper.rowFromGridPosition(rowIndex as GridIndex);
            const pointX = BOARD_OUTLINE_WIDTH + (rowIndex * boardDimensions.cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (rowIndex - 1)) + ((SUBGRID_OUTLINE_WIDTH - CELL_OUTLINE_WIDTH) * (subgridPositionRow - 1));

            lines.push(
                vec(pointX, 0),
                vec(pointX, boardDimensions.boardLength)
            )
		}
		
		// Build the horizontal dividing lines
		for (let colIndex = 1; colIndex < ROWS_COUNT; colIndex++) {
            const isSubgridColIndex = colIndex % 3 === 0;
            if (!isSubgridColIndex) {
                continue;
            }

            const subgridPositionRow = SubgridPositionHelper.rowFromGridPosition(colIndex as GridIndex);
            const pointY = BOARD_OUTLINE_WIDTH + (colIndex * boardDimensions.cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (colIndex - 1)) + ((SUBGRID_OUTLINE_WIDTH - CELL_OUTLINE_WIDTH) * (subgridPositionRow - 1));

            lines.push(
                vec(0, pointY),
                vec(boardDimensions.boardLength, pointY)
            )
		}
		
		return lines;
	}
	
	return (
		<Group>
			<Rect
				x={BOARD_OUTLINE_WIDTH / 2}
				y={BOARD_OUTLINE_WIDTH / 2}
                antiAlias
				width={boardDimensions.boardLength - BOARD_OUTLINE_WIDTH}
				height={boardDimensions.boardLength - BOARD_OUTLINE_WIDTH}
				color="blue"
				style="stroke"
				strokeWidth={BOARD_OUTLINE_WIDTH}
			/>

            <Points
                antiAlias
                points={buildSubgridDividingLines()}
                mode="lines"
                color="cyan"
                strokeJoin="bevel"
                style="stroke"
                strokeWidth={SUBGRID_OUTLINE_WIDTH}
            />

            <Points
                antiAlias
                points={buildLines()}
                mode="lines"
                color="orange"
                style="stroke"
                strokeWidth={CELL_OUTLINE_WIDTH}
            />

            {/* Debug cells */}
            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="green"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + boardDimensions.cellLength + CELL_OUTLINE_WIDTH}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="red"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 2) + (CELL_OUTLINE_WIDTH * 2)}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="purple"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 3) + (CELL_OUTLINE_WIDTH * 2) + SUBGRID_OUTLINE_WIDTH}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="yellow"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 4) + (CELL_OUTLINE_WIDTH * 3) + SUBGRID_OUTLINE_WIDTH}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="purple"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 5) + (CELL_OUTLINE_WIDTH * 4) + SUBGRID_OUTLINE_WIDTH}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="purple"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 6) + (CELL_OUTLINE_WIDTH * 4) + (SUBGRID_OUTLINE_WIDTH * 2)}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="purple"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 7) + (CELL_OUTLINE_WIDTH * 5) + (SUBGRID_OUTLINE_WIDTH * 2)}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="purple"
                style="fill"
            />

            <Rect
                antiAlias
                x={BOARD_OUTLINE_WIDTH + (boardDimensions.cellLength * 8) + (CELL_OUTLINE_WIDTH * 6) + (SUBGRID_OUTLINE_WIDTH * 2)}
                y={BOARD_OUTLINE_WIDTH}
                width={boardDimensions.cellLength}
                height={boardDimensions.cellLength}
                color="purple"
                style="fill"
            />
		</Group>
	)
}