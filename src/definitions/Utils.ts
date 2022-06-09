import { CasteRange } from './Creature';

export const M3_to_CM3 = 1000000;

/**
 * Returns volume in cubic meters when given cubic centimeters
 *
 * @param cm3 - Volume in cubic centimeter
 * @returns Volume in cubic meter
 */
export const ConvertCm3ToM3 = (cm3: number): number => {
  return cm3 / M3_to_CM3;
};

/**
 * Returns a string describing the volume.
 *
 * @param volume_cm3 - Volume in cubic centimeter
 * @returns String describing the volume (w/ unit)
 */
export const SimplifyVolume = (volume_cm3: number): string => {
  // if (volume_cm3 >= 0.5 * M3_to_CM3) {
  //     let value = ConvertCm3ToM3(volume_cm3).toFixed(3)
  //     while(value.endsWith('0') || value.endsWith('.')) {
  //       value = value.slice(0,-1);
  //     }
  //     return `${value} m³`
  // }
  return `${volume_cm3.toLocaleString()} cm³`;
};

/**
 * Returns the given string with the first letter capitalized and ther rest lower cased.
 *
 * @param str - String to convert to "Title Case"
 * @returns String in Title Case
 */
export const toTitleCase = (str: string): string => {
  if (str.length <= 1) {
    return str.toUpperCase();
  }
  return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
};

/**
 * Returns a single string containing all provided names.
 *
 * @param names - Either an array of names or a names_map to turn into a searchable name string
 * @returns A string with all names inside of it
 */
export const SearchableNames = (names: CasteRange<string[]> | string[]): string => {
  if (Array.isArray(names)) {
    return names.join(' ');
  }
  return [...new Set(Object.values(names))].join(' ');
};

/**
 * Returns a condensed string representing the array of names.
 *
 * @param names - Names in an array
 * @returns A string with names condensed as much as possible
 */
export const CleanName = (names: string[]): string => {
  if (names.length < 2) {
    return [...new Set(names)].filter((n) => n.length > 0).join(', ');
  }
  const singular = names[0];
  const plural = names[1];
  if (singular === plural || plural === '') {
    return `${singular}`;
  }
  if (plural.startsWith(singular)) {
    return `${singular}(${plural.slice(singular.length)})`;
  }
  if (plural.endsWith('men')) {
    if (plural.endsWith('women')) {
      return `${singular}/women`;
    }
    return `${singular}/men`;
  }
  return `${singular}, ${plural}`;
};
