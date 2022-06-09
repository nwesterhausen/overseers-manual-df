/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
  objectId: string;
  identifier: string;
  names: string[];
  description: string;
  parent_raw: string;
};

/**
 * Array.prototype.filter function to only allow valid Raw objects.
 *
 * @param r - Element of the array
 * @returns True if the element is valid Raw
 */
export const FilterInvalidRaws = (r: Raw): boolean => {
  if (r.names.length === 0) {
    console.warn(`Invalid raw: ${r.identifier} ${r.objectId}`);
    return false;
  }
  return true;
};

/**
 * Returns an array of all the starting letters of the parsed raws objects.
 *
 * This uses the first name in the raw object `names` array.
 *
 * @param arr - Array of parsed DF Raw objects.
 * @returns Sorted array (A-Z) of the first letter of each raw's name.
 */
export const RawsFirstLetters = (arr: Raw[]): string[] => {
  return [
    ...new Set(
      arr.map((v: Raw) => {
        const name = v.names[0];
        if (name && name.length) {
          return name.charAt(0).toLowerCase();
        }
        return '';
      })
    ),
  ].sort();
};
