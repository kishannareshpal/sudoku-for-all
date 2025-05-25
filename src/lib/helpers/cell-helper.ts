export class CellHelper {
    static isValueEmpty(value: number | undefined | null): boolean {
        return !value;
    }

    static isValueNotEmpty(value: number | undefined | null): boolean {
        return !CellHelper.isValueEmpty(value);
    }
}