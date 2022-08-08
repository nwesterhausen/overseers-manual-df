import { Raw } from './types';

/**
 * Array.prototype.filter function to only allow valid Raw objects.
 *
 * @param r - Element of the array
 * @returns True if the element is valid Raw
 */
export const FilterInvalidRaws = (r: Raw): boolean => {
  if (r.name.length === 0) {
    console.warn(`Invalid raw: ${r.identifier} ${r.objectId}`);
    return false;
  }
  return true;
};

/**
 * Returns an array of all the starting letters of the parsed raws objects.
 *
 * This returns lower case letters for all the raw objects' names.
 *
 * @param arr - Array of parsed DF Raw objects.
 * @returns Sorted array (A-Z) of the first letter of each raw's name.
 */
export const RawsFirstLetters = (arr: Raw[]): string[] => {
  return [
    ...new Set(
      arr.map((v: Raw) => {
        if (v.name && v.name.length) {
          return v.name.charAt(0).toLowerCase();
        }
        return '';
      })
    ),
  ].sort();
};
