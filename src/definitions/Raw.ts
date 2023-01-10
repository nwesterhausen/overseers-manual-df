import { AssignBasedOn, GenerateCreatureSearchString } from './Creature';
import { GeneratePlantSearchString } from './Plant';
import { Creature, DFInfoFile, DFPlant, Raw } from './types';

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
  // Sort all raws by objectId
  const rawsSorted = rawsArray.filter(FilterInvalidRaws).sort((a, b) => (a.objectId < b.objectId ? -1 : 1));

  console.info(`Looping over ${rawsSorted.length} raw objects`);
  // Loop over all sorted raws
  for (let i = 0; i < rawsSorted.length; i++) {
    if (typeof rawsSorted[i] === 'undefined') {
      continue;
    }

    if (!rawsSorted[i].rawModuleParents) {
      // Initialize raw_module_parents
      rawsSorted[i].rawModuleParents = [rawsSorted[i].moduleSourceDirectory];
    }
    // Initialized all_tags field
    console.debug(`Sorting ${rawsSorted[i].rawType} ${rawsSorted[i].name}`);

    rawsSorted[i].allTags = [...rawsSorted[i].tags];

    switch (rawsSorted[i].rawType) {
      case 'Creature': {
        // Coerce RAW into Creature based on raw_type
        const creature = rawsSorted[i] as Creature;
        // If its based on another raw, find it and apply it
        if (creature.basedOn && creature.basedOn.length) {
          const matches = rawsSorted.filter((c) => c.objectId === creature.basedOn);
          if (matches.length === 1) {
            rawsSorted[i] = AssignBasedOn(creature, matches[0] as Creature);
          } else {
            console.warn(`${matches.length} matches for 'based_on':${creature.basedOn}`);
            if (matches.length > 1) {
              rawsSorted[i] = AssignBasedOn(creature, matches[0] as Creature);
            }
          }
        }
        // Append all caste tags to all_tags
        for (const caste of Object.keys(creature.casteTags)) {
          rawsSorted[i].allTags.push(...creature.casteTags[caste]);
        }
        // Build a search string for the raw
        rawsSorted[i].searchString = GenerateCreatureSearchString(rawsSorted[i] as Creature);
        break;
      }
      case 'Plant': {
        // Coerce RAW into Plant based on raw_type
        const plant = rawsSorted[i] as DFPlant;

        // Append all material tags to all_tags
        for (const material of Object.keys(plant.materials)) {
          rawsSorted[i].allTags.push(...plant.materials[material].tags);
        }

        // Build a search string for the raw
        rawsSorted[i].searchString = GeneratePlantSearchString(rawsSorted[i] as DFPlant);
        break;
      }
      default:
        console.error(`Unhandled raw type ${rawsSorted[i].rawType}!`);
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
        raw.rawModuleParents.push(current.moduleSourceDirectory);
      } else {
        raw.rawModuleParents = [current.moduleSourceDirectory];
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

  return rawsArray.filter((v) => requiredModules.indexOf(v.rawModule) === -1);
}

export function RawsOnlyWithTagsOrAll(rawsArray: Raw[], allowedTags: string[]): Raw[] {
  // Early return if no allowed tags (we return all)
  if (allowedTags.length === 0) {
    return rawsArray;
  }

  console.log(`restricting to raws with tags ${allowedTags.join(' & ')}`);

  return rawsArray.filter((v) => {
    if (typeof v.allTags === 'undefined') {
      return false;
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
export function labelForModule(moduleInfo: DFInfoFile | undefined, moduleId?: string): string {
  if (typeof moduleId !== 'undefined') {
    return moduleId || '';
  }

  return `${moduleInfo.name} v${moduleInfo.displayedVersion}`;
}
