import * as Crypto from 'expo-crypto';

/**
 * Generate a random number between [{@link start} and {@link end}] (both inclusive)
 * 
 * @param start - the start number in the range to pick
 * @param end - the end number in the range to pick
 */
export const randomNumberBetween = (start: number, end: number): number => {
    if (end < start) {
        throw new RangeError(`Invalid 'end' parameter. The value of the 'end' parameter must be more than or equal to the value of the 'start' param. Values: start=${start}, end=${end}`)
    }

    // Generate a cryptographically secure random number
    const array = new Uint32Array(1);
    Crypto.getRandomValues(array);

    // Normalize the value to a floating point between 0 and 1
    const normalized = array[0] / (0xffffffff + 1);

    // Scale to your desired range (inclusive of min and max)
    return Math.floor(normalized * (end - start + 1)) + start;
}