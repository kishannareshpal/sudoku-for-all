import { COLUMNS_COUNT, ROWS_COUNT } from "@/lib/constants/board";
import { GridPosition, Point } from "@/lib/shared-types";

export class Location {
    row: number;
    col: number;

    index: number;
    indexOrientation: LocationIndexOrientation

    constructor(row: number, col: number, orientation: LocationIndexOrientation = 'topToBottom') {
        if (row < 0 || row >= ROWS_COUNT) {
            throw new Error(`Provided row index ${row} is out of bounds. Must be between 0 and ${ROWS_COUNT - 1}.`);
        }

        if (col < 0 || col >= COLUMNS_COUNT) {
            throw new Error(`Provided column index ${row} is out of bounds. Must be between 0 and ${COLUMNS_COUNT - 1}.`);
        }

        this.row = row;
        this.col = col;
        this.indexOrientation = orientation;
        this.index = Location.indexFrom(row, col, orientation);
    }

    toPosition(boardLength: number, cellLength: number): Point {
        return {
            x: this.col * cellLength,
            y: this.row * cellLength,
        }
    }

    static fromPosition(gridPosition: GridPosition): Location {
        return new Location(
            gridPosition.row,
            gridPosition.col
        );
    }

    static zero(): Location {
        return new Location(0, 0);
    }

    static indexFrom(
        row: number,
        col: number,
        orientation: LocationIndexOrientation,
    ): number {
        switch (orientation) {
            case 'leftToRight':
                return row * COLUMNS_COUNT + col;
            case 'topToBottom':
                return col + ROWS_COUNT + row;
        }
    }

    static colFrom(
        index: number,
        orientation: LocationIndexOrientation,
    ): number {
        switch (orientation) {
            case 'leftToRight':
                return index % COLUMNS_COUNT;
            case 'topToBottom':
                return Math.floor(index / COLUMNS_COUNT);
        }
    }

    static rowFrom(
        index: number,
        orientation: LocationIndexOrientation,
    ): number {
        switch (orientation) {
            case 'leftToRight':
                return Math.floor(index / ROWS_COUNT);
            case 'topToBottom':
                return index % ROWS_COUNT;
        }
    }

    static validateNotationFormat(notation: LocationNotation): boolean {
        if (notation.length !== 2) {
            return false;
        }

        const onlyMadeOfNumbers = notation
            .split('')
            .every(
                (char) => !Number.isNaN(parseInt(char, 10))
            );
        if (!onlyMadeOfNumbers) {
            return false;
        }

        return true;
    }
}

export type LocationNotation = string;

type LocationIndexOrientation =
    | 'leftToRight'
    | 'topToBottom';