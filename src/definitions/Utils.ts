import { CasteRange } from './Creature';

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
