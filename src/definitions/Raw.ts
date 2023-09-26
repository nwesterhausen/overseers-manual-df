import { GenerateCreatureSearchString } from './Creature';
import { DFCreature } from './DFCreature';
import { DFPlant } from './DFPlant';
import { ModuleInfoFile } from './ModuleInfoFile';
import { GeneratePlantSearchString } from './Plant';
import { Raw } from './types';

/**
 * Array.prototype.filter function to only allow valid Raw objects.
 *
 * @param r - Element of the array
 * @returns True if the element is valid Raw
 */
export const FilterInvalidRaws = (r: Raw): boolean => {
  if (!r.name || r.name.singular.length === 0 || !r.identifier || r.identifier.length === 0) {
    console.error(`Invalid raw: ${r.identifier} ${r.objectId}`, r);
    return false;
  }
  if (!r.metadata) {
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
        if (v.name && v.name.singular.length > 0) {
          return v.name.singular.charAt(0).toLowerCase();
        }
        return '';
      }),
    ),
  ].sort();
};

/**
 * Returns a unique and sorted array of raws from raws
 */
export const UniqueSort = (rawsArray: Raw[]): Raw[] => {
  if (!Array.isArray(rawsArray)) {
    console.error('Raws UniqueSort - Cannot sort non-array!');
    console.debug(rawsArray);
    return [];
  }

  // Sort all raws by objectId
  const rawsSorted = rawsArray.filter(FilterInvalidRaws).sort((a, b) => (a.objectId < b.objectId ? -1 : 1));

  console.info(`Looping over ${rawsSorted.length} raw objects`);
  // Loop over all sorted raws
  for (let i = 0; i < rawsSorted.length; i++) {
    if (typeof rawsSorted[i] === 'undefined') {
      continue;
    }

    // Initialized all_tags field
    console.debug(`Sorting ${rawsSorted[i].metadata.objectType} ${rawsSorted[i].name.singular}`);
    console.debug(rawsSorted[i]);

    switch (rawsSorted[i].metadata.objectType) {
      case 'Creature': {
        // Build a search string for the raw
        rawsSorted[i].searchString = GenerateCreatureSearchString(rawsSorted[i] as unknown as DFCreature);
        break;
      }
      case 'Plant': {
        // Build a search string for the raw
        rawsSorted[i].searchString = GeneratePlantSearchString(rawsSorted[i] as unknown as DFPlant);
        break;
      }
      case 'Inorganic': {
        // Build a search string for the raw
        // rawsSorted[i].searchString = GenerateInorganicSearchString(rawsSorted[i] as DFInorganic);
        break;
      }
      default:
        console.error(`Unhandled raw type ${rawsSorted[i].metadata.objectType}!`);
    }
  }

  // Unique values only
  const uniqResult = rawsSorted.reduce((res: Raw[], current) => {
    // Check if we already have one with that identifier
    const raw = res.find((v) => v.identifier === current.identifier);

    // If the identifier exists in our results array, we already have it entered. We can append our source to it.
    if (raw) {
      // Check if the array of module_parents exists or not first
      if (Array.isArray(raw.rawModuleParents)) {
        raw.rawModuleParents.push(current.metadata.rawModuleLocation);
      } else {
        raw.rawModuleParents = [current.metadata.rawModuleLocation];
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

export function RawsOnlyWithoutModules(rawsArray: Raw[], requiredModules: string[]): Raw[] {
  // Early return if no required modules
  if (requiredModules.length === 0) {
    return rawsArray;
  }

  return rawsArray.filter((v) => requiredModules.indexOf(v.metadata.moduleName) === -1);
}

export function RawsOnlyWithTagsOrAll(rawsArray: Raw[], allowedTags: string[]): Raw[] {
  // Early return if no allowed tags (we return all)
  if (allowedTags.length === 0) {
    return rawsArray;
  }

  console.log(`restricting to raws with tags ${allowedTags.join(' & ')}`);

  return rawsArray.filter((v) => {
    switch (v.metadata.objectType) {
      case 'Creature': {
        const creature = v as unknown as DFCreature;
        if (creature.tags.filter((w) => allowedTags.indexOf(w) !== -1).length > 0) {
          return true;
        }
        for (const caste of creature.castes) {
          if (caste.tags.filter((w) => allowedTags.indexOf(w) !== -1).length > 0) {
            return true;
          }
        }
        break;
      }
      case 'Inorganic': {
        break;
      }
      case 'Plant': {
        break;
      }
      default: {
        // Ignore other types for now.
        break;
      }
    }

    return v.allTags.filter((w) => allowedTags.indexOf(w) !== -1).length > 0;
  });
}

export function RawsMatchingSearchString(rawsArray: Raw[], searchString: string): Raw[] {
  // Early return if no search string
  if (searchString === '') {
    return rawsArray;
  }

  // Split the search string into terms to find
  const searchTerms = searchString.toLowerCase().split(' ');

  // Perform the search filtering
  return rawsArray.filter((raw) => {
    // Guard against non-existent search string
    if (!raw.searchString || !Array.isArray(raw.searchString)) {
      return false;
    }

    // Early return if search string is empty
    if (raw.searchString.length === 0) {
      return false;
    }

    // Guard against badly typed search string
    if (typeof raw.searchString[0] !== 'string') {
      return false;
    }

    return (
      // Filter the object based on the search terms
      // Return "true" only when all of the input search terms do match a value
      // in the raws search string, otherwise we don't include that raw in the
      // results.
      searchTerms.filter((v) => {
        // Restrict to only any matching search terms
        for (const term of raw.searchString) {
          if (term.indexOf(v.toLowerCase()) !== -1) return true;
        }
        return false;
      }).length === searchTerms.length
    );
  });
}

/**
 * Helper to display the "NAME vVERSION" for a module, or just the module if there isn't module info available.
 * Example usage:
 * `labelForModule(rawsContext.rawsInfo.latest.find(v => v.identifier === module), module)`
 */
export function labelForModule(moduleInfo: ModuleInfoFile | undefined, moduleId?: string): string {
  if (typeof moduleId !== 'undefined') {
    return moduleId || '';
  }
  if (typeof moduleInfo === 'undefined') {
    return 'unknown (undefined)';
  }

  return `${moduleInfo.name || 'unknown'} v${moduleInfo.displayedVersion || '?'}`;
}
