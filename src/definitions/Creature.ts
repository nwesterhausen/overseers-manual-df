import type { BodySizeRange, CasteRange, Creature, MilkableDesc, Raw } from './types';
import { SearchableNames, SimplifyVolume, toTitleCase } from './Utils';

export type Caste = {
  name: string;
  tags: string[];
  clutch_size: number[];
  litter_size: number[];
  max_age: number[];
  active_time: number;
  curious_beast: number;
  no_season: number;
  trainable: number;
  baby: number;
  child: number;
  difficulty: number;
  egg_size: number;
  grass_trample: number;
  grazer: number;
  low_light_vision: number;
  pet_value: number;
  pop_ratio: number;
  baby_name: string[];
  caste_name: string[];
  child_name: string[];
  description: string;
  creature_class: string[];
  body_size: BodySizeRange[];
  milkable: MilkableDesc;
};

/**
 * Returns true if the raw is a Creature raw.
 *
 * @param raw - The parsed raw to check.
 * @returns True if the raw is a creature.
 */
export function isCreature(raw: Raw | Creature): boolean {
  return (<Creature>raw).biomes !== undefined;
}

/**
 * Helper to tell if a caste of the creature lays eggs.
 *
 * @param creature - Creature to check for egg laying tag
 * @returns true if one caste of this creature lays eggs
 */
export const IsEggLayer = (creature: Creature): boolean => {
  for (const casteTags of Object.values(creature.caste_tags)) {
    if (casteTags.indexOf('LaysEggs') !== -1) {
      return true;
    }
  }
  return false;
};

/**
 * Helper to tell get a single pet value.
 *
 * @param creature - Creature to get pet value from
 * @returns pet value of first encountered value or 0
 */
export const FirstPetValue = (creature: Creature): number => {
  for (const petValue of Object.values(creature.pet_value)) {
    if (petValue > 0) {
      return petValue;
    }
  }
  return 0;
};

/**
 * Helper to tell get a single difficulty value.
 *
 * @param creature - Creature to get difficulty value from
 * @returns difficulty value of first encountered value or 0
 */
export const FirstDifficulty = (creature: Creature): number => {
  for (const difficulty of Object.values(creature.difficulty)) {
    if (difficulty > 0) {
      return difficulty;
    }
  }
  return 0;
};

/**
 * Returns a short description of the creature's egg-laying behavior.
 *
 * @param creature - Creature to get the egg-laying status for.
 * @returns Text to describe the egg-laying of the creature.
 */
export const EggLayingStatus = (creature: Creature): string => {
  if (!IsEggLayer(creature)) {
    return "Doesn't lay eggs.";
  }
  const size = CondensedEggSize(creature.egg_sizes);
  const keys = Object.keys(creature.clutch_size);
  if (keys.length === 0) {
    if (size > 0) {
      return `Lays an unknown quantity of eggs with volume ${SimplifyVolume(size)}.`;
    }
    return 'Lays an unknown quantity of eggs.';
  }
  const ret: string[] = [];
  for (const k in creature.clutch_size) {
    if (size > 0) {
      ret.push(
        `${k[0]}${k.slice(1).toLowerCase()}s lay ${creature.clutch_size[k].join(
          ' - '
        )} eggs with volume ${SimplifyVolume(size)}.`
      );
    } else {
      ret.push(`${k[0]}${k.slice(1).toLowerCase()}s lay ${creature.clutch_size[k].join(' - ')} eggs.`);
    }
  }
  return ret.join(' ');
};

/**
 * Returns a short description of the creature's life expectancy.
 *
 * @param creature - Creature to get the life expectancy of.
 * @returns Text to describe the life expectancy of the creature.
 */
export const LifeExpectancyStatus = (creature: Creature): string => {
  const keys = Object.keys(creature.max_age);
  if (keys.length === 0) {
    return 'Lives indefinitely.';
  }
  if (keys.length === 1) {
    return `Live ${creature.max_age[keys[0]].join(' - ')} years.`;
  }
  const ret: string[] = [];
  for (const c in creature.max_age) {
    ret.push(`${c} lives ${creature.max_age[c].join(' - ')} years.`);
  }
  return ret.join(' ');
};

/**
 * Returns a short description of the creatures spawning patterns.
 *
 * @param creature - Creature to get the spawning group size of
 * @returns Text to describe the spawning patterns
 */
export const ClusterSizeStatus = (creature: Creature): string => {
  const [min, max] = creature.cluster_range;
  if (min === max) {
    if (max === 0) {
      return 'They do not normally appear.';
    }
    if (max === 1) {
      return 'They always appear alone.';
    }
    return `They always appear in groups of ${min}`;
  }
  return `They appear in groups of ${min} to ${max} individuals.`;
};

/**
 * Returns a short text description of a BodySizeRange.
 *
 * @param size - The body size range to turn into a string
 * @returns Text to describe the body size range value
 */
export const BodySizeStatus = (size: BodySizeRange): string => {
  if (size.years === 0) {
    if (size.days === 0) {
      return `${SimplifyVolume(size.size_cm3)} at birth`;
    } else {
      return `${SimplifyVolume(size.size_cm3)} at ${size.days} days;`;
    }
  }
  if (size.days === 0) {
    return `${SimplifyVolume(size.size_cm3)} at ${size.years} years`;
  }
  return `${SimplifyVolume(size.size_cm3)} at ${size.years} years, ${size.days} days`;
};

/**
 * Returns a short text description of when the creature reaches adulthood.
 *
 * @param grown_data - Age for each caste to reach adulthood as CasteRange
 * @returns Text to describe how the creature reaches adulthood
 */
export const GrownAtStatus = (grown_data: CasteRange<number>): string => {
  const castes = Object.keys(grown_data);
  const sts: string[] = [];
  for (const caste of castes) {
    if (grown_data[caste] > 0) {
      if (caste === 'ALL') {
        sts.push(`They reach adulthood at ${grown_data[caste]} years.`);
      } else {
        sts.push(`${caste[0]}${caste.slice(1).toLowerCase()}s reach adulthood at ${grown_data[caste]} years.`);
      }
    }
  }
  if (sts.length) {
    return sts.join(' ');
  }
  return 'Only appear as adults.';
};

/**
 * Returns the first-encountered egg size in the caste mapping for egg sizes.
 *
 * @remarks This should not just pick the first one and return, it should smartly provide answers by caste.
 * @param sizes - Caste mapping of the egg size
 * @returns The first encountered egg size
 */
export const CondensedEggSize = (sizes: CasteRange<number>): number => {
  const castes = Object.keys(sizes);
  if (castes.length >= 1) {
    return sizes[castes[0]];
  }
  return 0;
};

/**
 * Returns the first-encountered clutch range as an average.
 *
 * @remarks This should not just pick the first one and return, it should smartly provide answers by caste.
 * @param clutch_size - Caste mapping of the clutch size
 * @returns Average clutch size for first encountered clutch range
 */
export const AverageClutchSize = (clutch_size: CasteRange<number[]>): number => {
  const castes = Object.keys(clutch_size);
  if (castes.length === 1) {
    const [min, max] = clutch_size[castes[0]];
    return Math.floor((min + max) / 2);
  }
  return 0;
};

/**
 * Returns a string describing the active time represented by the bitmask.
 *
 *
 * active time:
 *      diurnal & nocturnal & crepuscular & matutinal & vespertine = 31
 *
 * @param activeTimeBitmask - The 8-bit bitmask for active time
 * @returns String describing the caste's active time
 */
export const ActiveTimeStatus = (activeTimeBitmask: number): string => {
  const strArr: string[] = [];
  // Bitmask math/tests
  if (activeTimeBitmask & ACTIVE_DIURNAL) {
    strArr.push('during the day');
  }
  if (activeTimeBitmask & ACTIVE_NOCTURNAL) {
    strArr.push('during the night');
  }
  if (activeTimeBitmask & ACTIVE_CREPUSCULAR) {
    strArr.push('at twilight');
  }
  if (activeTimeBitmask & ACTIVE_MATUTINAL) {
    strArr.push('at dawn');
  }
  if (activeTimeBitmask & ACTIVE_VESPERTINE) {
    strArr.push('at evening');
  }

  switch (strArr.length) {
    case 0:
      return 'No known active time-of-day.';
    case 1:
      return `Active ${strArr[0]}.`;
    case 2:
      return `Active ${strArr.join(' and ')}.`;
    default:
      return `Active ${strArr.slice(0, -1).join(', ')}, and ${strArr.slice(-1)}.`;
  }
};

const ACTIVE_DIURNAL = 1, // 0000 0001
  ACTIVE_NOCTURNAL = 2, // 0000 0010
  ACTIVE_CREPUSCULAR = 4, // 0000 0100
  ACTIVE_MATUTINAL = 8, // 0000 1000
  ACTIVE_VESPERTINE = 16; // 0001 0000

/**
 * Returns a string describing the active seasons represented by the bitmask.
 *
 *
 * "no" season (creature does not appear):
 *      NO_SPRING & NO_SUMMER & NO_AUTUMN & NO_WINTER = 15
 *
 * @param noSeasonBitmask - The 8-bit bitmask for active time
 * @returns String describing the caste's active seasons
 */
export const NoSeasonStatus = (noSeasonBitmask: number): string => {
  const strArr: string[] = [];
  // Bitmask math/tests
  if (!(noSeasonBitmask & NO_SPRING)) {
    strArr.push('spring');
  }
  if (!(noSeasonBitmask & NO_SUMMER)) {
    strArr.push('summer');
  }
  if (!(noSeasonBitmask & NO_FALL)) {
    strArr.push('autumn');
  }
  if (!(noSeasonBitmask & NO_WINTER)) {
    strArr.push('winter');
  }

  switch (strArr.length) {
    case 0:
      return 'No known active seasons.';
    case 1:
      return `Active during ${strArr[0]}.`;
    case 2:
      return `Active during ${strArr.join(' and ')}.`;
    default:
      return `Active during ${strArr.slice(0, -1).join(', ')}, and ${strArr.slice(-1)}.`;
  }
};

const NO_SPRING = 1, // 0001
  NO_SUMMER = 2, // 0010
  NO_FALL = 4, // 0100
  NO_WINTER = 8; // 1000

/**
 * Returns a string describing the trainability represented by the bitmask.
 *
 *
 * trainable:
 *      war & hunting = 3
 *
 * @param trainableBitmask - The 8-bit bitmask for trainable
 * @returns String describing the caste's trainability
 */
export const TrainableStatus = (trainableBitmask: number): string => {
  const strArr: string[] = [];
  // Bitmask math/tests
  if (trainableBitmask & TRAINABLE_HUNTING) {
    strArr.push('hunting');
  }
  if (trainableBitmask & TRAINABLE_WAR) {
    strArr.push('war');
  }

  if (strArr.length) {
    return `Trainable for ${strArr.join(' and ')}.`;
  }
  return 'Not trainable.';
};

const TRAINABLE_HUNTING = 1, // 0001
  TRAINABLE_WAR = 2; // 0010

/**
 * Returns a creature which has its missing values completed from the based on creature.
 *
 * @param creature - creature which has the 'based_on' token set
 * @param basedOn - creature that is basis for the other
 * @returns A modified creature with any missing values filled in from the based on creature
 */
export const AssignBasedOn = (creature: Creature, basedOn: Creature): Creature => {
  // Special cases handled here before we go through any other keys that might be "default"
  if (creature.creature_class.ALL && creature.creature_class.ALL.length > 1 && basedOn.creature_class.ALL.length > 1) {
    creature.creature_class.ALL = [...new Set(creature.creature_class.ALL.concat(basedOn.creature_class.ALL))];
  }

  // Go through all keys and assign if they are empty or defaults
  for (const key of Object.keys(DEFAULT_CREATURE)) {
    if (JSON.stringify(creature[key]) === JSON.stringify(DEFAULT_CREATURE[key])) {
      //  && (JSON.stringify(basedOn[key]) !== JSON.stringify(DEFAULT_CREATURE[key]))) {
      console.debug(`${key} being assigned for ${creature.identifier} from ${basedOn.identifier}`);
      creature[key] = basedOn[key];
    }
  }

  return creature;
};

const DEFAULT_CREATURE: Creature = {
  objectId: '',
  identifier: '',
  name: '',
  descriptions: {},
  parent_raw: '',
  max_age: {},
  clutch_size: {},
  biomes: [],
  cluster_range: [],
  underground_depth: [],
  body_size: {},
  grown_at: {},
  egg_sizes: {},
  pet_value: {},
  intelligence: {},
  flier: {},
  gnawer: {},
  trainable: {},
  active_time: {},
  inactive_season: {},
  creature_class: {},
  names_map: {},
  tags: [],
  caste_tags: {},
  difficulty: {},
  grass_trample: {},
  grazer: {},
  low_light_vision: {},
  pop_ratio: {},
  milkable: {},
  pref_string: [],
  population_number: [1, 1],
};

export const PopulationNumberStatus = (creature: Creature): string => {
  let descriptor = 'alone.';
  if (creature.population_number[0] !== creature.population_number[1]) {
    descriptor = `in groups of ${creature.population_number[0]} to ${creature.population_number[1]}.`;
  }
  return `They live in the world ${descriptor}`;
};

/**
 * Returns a short description of the creature's pet value.
 *
 * @param creature - Creature to get the pet value for.
 * @returns Text to describe the pet value of the creature.
 */
export const PetValueStatus = (creature: Creature): string => {
  const ret: string[] = [];
  for (const c in creature.pet_value) {
    if (c === 'ALL' || c === 'SPECIES') {
      ret.push(`Worth ${creature.pet_value.ALL} as a pet.`);
    } else {
      ret.push(`${toTitleCase(c)}s worth ${creature.pet_value[c]} as a pet.`);
    }
  }
  if (ret.length === 0) {
    return 'No pet value.';
  }
  return ret.join(' ');
};

/**
 * Returns an array of search terms that describe the creature.
 *
 * @param creature - Creature to create search terms for
 * @returns An array of strings that can be used to describe the creature
 */
export const GenerateSearchString = (creature: Creature): string[] => {
  let searchableTerms = [
    SearchableNames(creature.names_map),
    IsEggLayer(creature) ? `eggs ${CondensedEggSize(creature.egg_sizes)}` : '',
    Object.values(creature.descriptions).join(' '),
    creature.flier ? 'flier' : '',
    creature.tags.indexOf('LOCAL_POPS_CONTROLLABLE') === -1 ? '' : 'playable',
    creature.tags.indexOf('LOCAL_POPS_CONTROLLABLE') === -1 ? '' : 'civilized',
    creature.gnawer ? 'gnawer' : '',
    FirstPetValue(creature) > 0 ? `pet value ${FirstPetValue(creature)}` : '',
    FirstDifficulty(creature) > 0 ? `difficulty ${FirstDifficulty(creature)}` : '',
  ];
  if (creature.intelligence.ALL) {
    searchableTerms.push(creature.intelligence.ALL[0] && creature.intelligence.ALL[1] ? 'intelligent' : '');
    searchableTerms.push(creature.intelligence.ALL[0] ? 'learns' : '');
    searchableTerms.push(creature.intelligence.ALL[1] ? 'speaks' : '');
  }
  searchableTerms = searchableTerms.concat(creature.tags);
  searchableTerms = searchableTerms.concat(Object.values(creature.caste_tags).flat());
  searchableTerms = searchableTerms.concat(creature.pref_string);
  return searchableTerms
    .join(' ')
    .toLowerCase()
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .filter((v) => v.length > 0)
    .sort();
};

const DepthRanges = [
  'Aboveground',
  '1st Cavern Layer',
  '2nd Cavern Layer',
  '3rd Cavern Layer',
  'Magma Sea Layer',
  'HFS',
];

/**
 * Turn the UNDERGROUND_DEPTH tag into a string description
 *
 * @param depth_range - [min,max] UNDERGROUND_DEPTH tag values
 * @returns string describing what depths they are found at
 */
export const UndergroundDepthDescription = (depth_range: number[]): string => {
  const topLevel = depth_range[0];
  const bottomLevel = depth_range[1];
  if (topLevel === bottomLevel) {
    return DepthRanges[topLevel];
  }
  return `${DepthRanges[topLevel]} to ${DepthRanges[bottomLevel]}`;
};
