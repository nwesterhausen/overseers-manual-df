import { Raw } from './Raw';
import { SearchableNames, SimplifyVolume, toTitleCase } from './Utils';

export type BodySizeRange = {
  years: number;
  days: number;
  size_cm3: number;
};

export type MilkableDesc = {
  material: string;
  frequency: number;
};

export type CasteRange<T> = {
  [key: string]: T;
};

export type CasteTags = {
  [key: string]: string[];
};

export type Creature = {
  max_age: CasteRange<number[]>;
  lays_eggs: boolean;
  clutch_size: CasteRange<number[]>;
  based_on?: string;
  biomes: string[];
  cluster_range: number[];
  body_size: CasteRange<BodySizeRange[]>;
  grown_at: CasteRange<number>;
  names_map: CasteRange<string[]>;
  egg_sizes: CasteRange<number>;
  pet_value: CasteRange<number>;
  intelligence: CasteRange<boolean[]>;
  flier: CasteRange<boolean>;
  gnawer: CasteRange<boolean>;
  trainable: CasteRange<number>;
  active_time: CasteRange<number>;
  inactive_season: CasteRange<number>;
  creature_class: CasteRange<string[]>;
  local_pops_controllable: boolean;
  local_pops_produce_heroes: boolean;

  caste_tags: CasteTags;
  castes: Caste[];
} & Raw;

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
  return (<Creature>raw).lays_eggs !== undefined;
}

/**
 * Returns a short description of the creature's egg-laying behavior.
 *
 * @param creature - Creature to get the egg-laying status for.
 * @returns Text to describe the egg-laying of the creature.
 */
export const EggLayingStatus = (creature: Creature): string => {
  if (!creature.lays_eggs) {
    return "Doesn't lay eggs.";
  }
  const size = CondesedEggSize(creature.egg_sizes);
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
export const CondesedEggSize = (sizes: CasteRange<number>): number => {
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
  const strarr: string[] = [];
  // Bitmask math/tests
  if (activeTimeBitmask & ACTIVE_DIURNAL) {
    strarr.push('during the day');
  }
  if (activeTimeBitmask & ACTIVE_NOCTURNAL) {
    strarr.push('during the night');
  }
  if (activeTimeBitmask & ACTIVE_CREPUSCULAR) {
    strarr.push('at twilight');
  }
  if (activeTimeBitmask & ACTIVE_MATUTINAL) {
    strarr.push('at dawn');
  }
  if (activeTimeBitmask & ACTIVE_VESPERTINE) {
    strarr.push('at evening');
  }

  switch (strarr.length) {
    case 0:
      return 'No known active time-of-day.';
    case 1:
      return `Active ${strarr[0]}.`;
    case 2:
      return `Active ${strarr.join(' and ')}.`;
    default:
      return `Active ${strarr.slice(0, -1).join(', ')}, and ${strarr.slice(-1)}.`;
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
  const strarr: string[] = [];
  // Bitmask math/tests
  if (!(noSeasonBitmask & NO_SPRING)) {
    strarr.push('spring');
  }
  if (!(noSeasonBitmask & NO_SUMMER)) {
    strarr.push('summer');
  }
  if (!(noSeasonBitmask & NO_FALL)) {
    strarr.push('autumn');
  }
  if (!(noSeasonBitmask & NO_WINTER)) {
    strarr.push('winter');
  }

  switch (strarr.length) {
    case 0:
      return 'No known active seaons.';
    case 1:
      return `Active during ${strarr[0]}.`;
    case 2:
      return `Active during ${strarr.join(' and ')}.`;
    default:
      return `Active during ${strarr.slice(0, -1).join(', ')}, and ${strarr.slice(-1)}.`;
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
  const strarr: string[] = [];
  // Bitmask math/tests
  if (trainableBitmask & TRAINABLE_HUNTING) {
    strarr.push('hunting');
  }
  if (trainableBitmask & TRAINABLE_WAR) {
    strarr.push('war');
  }

  if (strarr.length) {
    return `Trainable for ${strarr.join(' and ')}.`;
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
  description: '',
  parent_raw: '',
  max_age: {} as CasteRange<number[]>,
  lays_eggs: false,
  clutch_size: {} as CasteRange<number[]>,
  biomes: [],
  cluster_range: [],
  body_size: {
    ALL: [],
  },
  grown_at: {} as CasteRange<number>,
  egg_sizes: {} as CasteRange<number>,
  pet_value: {} as CasteRange<number>,
  intelligence: {
    ALL: [false, false],
  },
  flier: {
    ALL: false,
  },
  gnawer: {
    ALL: false,
  },
  trainable: {
    ALL: 0,
  },
  active_time: {
    ALL: 0,
  },
  inactive_season: {
    ALL: 0,
  },
  creature_class: {},
  names_map: {
    SPECIES: [],
    ALL: [],
  },
  local_pops_controllable: false,
  local_pops_produce_heroes: false,
  tags: [],
  caste_tags: {} as CasteTags,
  castes: [] as Caste[],
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
  const searchableTerms = [
    SearchableNames(creature.names_map),
    creature.lays_eggs ? `eggs ${CondesedEggSize(creature.egg_sizes)}` : '',
    creature.description,
    creature.flier ? 'flier' : '',
    creature.local_pops_controllable ? 'playable' : '',
    creature.local_pops_controllable ? 'civillized' : '',
    creature.gnawer ? 'gnawer' : '',
    creature.pet_value ? `pet value ${creature.pet_value}` : '',
  ];
  if (creature.intelligence.ALL) {
    searchableTerms.push(creature.intelligence.ALL[0] && creature.intelligence.ALL[1] ? 'intelligent' : '');
    searchableTerms.push(creature.intelligence.ALL[0] ? 'learns' : '');
    searchableTerms.push(creature.intelligence.ALL[1] ? 'speaks' : '');
  }
  return searchableTerms.join(' ').replaceAll('  ', ' ').split(' ');
};
