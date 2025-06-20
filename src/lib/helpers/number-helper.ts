export class NumberHelper {
    /**
     * Cap the provided {@link value} to be within the min and max {@link bounds}. Both {@link bounds} are inclusive.
     *
     * @param value
     * @param bounds
     */
    static clamp(
        value: number,
        bounds: { min: number, max: number }
    ): number {
        return Math.max(bounds.min, Math.min(bounds.max, value));
    }
}