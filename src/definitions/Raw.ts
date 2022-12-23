import { AssignBasedOn, GenerateSearchString } from './Creature';
import { Creature, Raw } from './types';

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

/**
 * Returns a unique and sorted array of raws from raws
 */
export const UniqueSort = (rawsArray: Raw[]): Raw[] => {
  // Sort all raws by name
  const rawsSorted = rawsArray.filter(FilterInvalidRaws).sort((a, b) => (a.name < b.name ? -1 : 1));

  // Loop over all sorted raws
  for (let i = 0; i < rawsSorted.length; i++) {
    if (!rawsSorted[i].raw_module_parents) {
      // Initialize raw_module_parents
      rawsSorted[i].raw_module_parents = [rawsSorted[i].raw_module_found_in];
    }
    switch (rawsSorted[i].raw_type) {
      case 'Creature':
        // Assume its a creature raw (all we handle right now)
        const creature = rawsSorted[i] as Creature;
        // If its based on another raw, find it and apply it
        if (creature.based_on && creature.based_on.length) {
          const matches = rawsSorted.filter((c) => c.objectId === creature.based_on);
          if (matches.length === 1) {
            rawsSorted[i] = AssignBasedOn(creature, matches[0] as Creature);
          } else {
            console.warn(`${matches.length} matches for 'based_on':${creature.based_on}`);
          }
        }
        // Build a search string for the raw
        rawsSorted[i].searchString = GenerateSearchString(rawsSorted[i] as Creature);
        break;
      default:
        console.error(`Unhandled raw type ${rawsSorted[i].raw_type}!`);
    }
  }

  // Unique values only
  const uniqResult = rawsSorted.reduce((res: Raw[], current) => {
    // Check if we already have one with that identifier
    const raw = res.find((v) => v.identifier === current.identifier);

    // If the identifier exists in our results array, we already have it entered. We can append our source to it.
    if (raw) {
      // Check if the array of module_parents exists or not first
      if (Array.isArray(raw.raw_module_parents)) {
        raw.raw_module_parents.push(current.raw_module_found_in);
      } else {
        raw.raw_module_parents = [current.raw_module_found_in];
      }

      return res;
    } else {
      // If we didn't find it, append it
      return [...res, current];
    }
  }, [] as Raw[]);

  // Return the sorted and unique result
  return uniqResult;
};
