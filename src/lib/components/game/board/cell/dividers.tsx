import { BOARD_OUTLINE_WIDTH, CELL_OUTLINE_WIDTH, ROWS_COUNT, SUBGRID_OUTLINE_WIDTH } from "@/lib/constants/board";
import { Group, Points, Rect, vec } from "@shopify/react-native-skia";
import { SubgridPositionHelper } from "@/lib/helpers/sub-grid-position-helper";
import { GridIndex } from "@/lib/shared-types";
import { use$ } from "@legendapp/state/react";
import { boardDimensions$ } from "@/lib/store/observables/board-dimensions";

export const Dividers = () => {
    const { cellLength, boardLength } = use$(boardDimensions$);
	
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
            const pointX = BOARD_OUTLINE_WIDTH + (rowIndex * cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (rowIndex - subgridPositionRow - 1)) + (SUBGRID_OUTLINE_WIDTH * subgridPositionRow);

			lines.push(
				vec(pointX, 0),
				vec(pointX, boardLength)
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
            const pointY = BOARD_OUTLINE_WIDTH + (colIndex * cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (colIndex - subgridPositionRow - 1)) + (SUBGRID_OUTLINE_WIDTH * subgridPositionRow);

			lines.push(
				vec(0, pointY),
				vec(boardLength, pointY)
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
            const pointX = BOARD_OUTLINE_WIDTH + (rowIndex * cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (rowIndex - 1)) + ((SUBGRID_OUTLINE_WIDTH - CELL_OUTLINE_WIDTH) * (subgridPositionRow - 1));

            lines.push(
                vec(pointX, 0),
                vec(pointX, boardLength)
            )
		}
		
		// Build the horizontal dividing lines
		for (let colIndex = 1; colIndex < ROWS_COUNT; colIndex++) {
            const isSubgridColIndex = colIndex % 3 === 0;
            if (!isSubgridColIndex) {
                continue;
            }

            const subgridPositionRow = SubgridPositionHelper.rowFromGridPosition(colIndex as GridIndex);
            const pointY = BOARD_OUTLINE_WIDTH + (colIndex * cellLength) + halfOfStrokeWidth + (CELL_OUTLINE_WIDTH * (colIndex - 1)) + ((SUBGRID_OUTLINE_WIDTH - CELL_OUTLINE_WIDTH) * (subgridPositionRow - 1));

            lines.push(
                vec(0, pointY),
                vec(boardLength, pointY)
            )
		}
		
		return lines;
	}

	return (
		<Group>
            <Points
                antiAlias
                points={buildLines()}
                mode="lines"
                color="#183609"
                style="stroke"
                strokeWidth={CELL_OUTLINE_WIDTH}
            />

            <Points
                antiAlias
                points={buildSubgridDividingLines()}
                mode="lines"
                color="#1F440E"
                strokeJoin="bevel"
                style="stroke"
                strokeWidth={SUBGRID_OUTLINE_WIDTH}
            />

            <Rect
                x={BOARD_OUTLINE_WIDTH / 2}
                y={BOARD_OUTLINE_WIDTH / 2}
                antiAlias
                width={boardLength - BOARD_OUTLINE_WIDTH}
                height={boardLength - BOARD_OUTLINE_WIDTH}
                color="#1F440E"
                style="stroke"
                strokeWidth={BOARD_OUTLINE_WIDTH}
            />
		</Group>
	)
}