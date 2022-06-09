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
        if (name.length) {
          return name.charAt(0);
        }
        return '';
      })
    ),
  ].sort();
};
