import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging class names using `clsx` and `tailwind-merge`.
 * 
 * @param inputs -  Class name values to be merged (supports clsx syntax).
 * 
 * @returns A single string containing the merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
}