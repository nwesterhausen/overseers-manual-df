import { Raw } from './Raw';

export type BodySizeRange = {
  years: number;
  days: number;
  size_cm3: number;
};

export type CasteRange<T> = {
  [key in typeof CasteOptions[number]]: T;
};

export type Creature = {
  max_age: CasteRange<number[]>;
  lays_eggs: boolean;
  clutch_size: CasteRange<number[]>;
  based_on?: Creature;
  biomes: string[];
  cluster_range: number[];
  body_size: CasteRange<BodySizeRange[]>;
  grown_at: CasteRange<number>;
  names_map: CasteRange<string[]>;
  egg_sizes: CasteRange<number>;
} & Raw;

export const CasteOptions = [
  'SPECIES',
  'child_SPECIES',
  'baby_SPECIES',
  'EVERY',
  'child_EVERY',
  'baby_EVERY',
  'MALE',
  'child_MALE',
  'baby_MALE',
  'FEMALE',
  'child_FEMALE',
  'baby_FEMALE',
];

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
      return `Lays an unknown quantity of eggs with volume ${size}cm³.`;
    }
    return 'Lays an unknown quantity of eggs.';
  }
  const ret: string[] = [];
  for (const k in creature.clutch_size) {
    if (size > 0) {
      ret.push(
        `${k[0]}${k.slice(1).toLowerCase()}s lay ${creature.clutch_size[k].join(' - ')} eggs with volume ${size}cm³.`
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
  let ret = '';
  for (const c in creature.max_age) {
    ret += `${c} lives ${creature.max_age[c].join(' - ')} years.`;
  }
  return ret;
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
      return `${size.size_cm3} cm³ at birth`;
    } else {
      return `${size.size_cm3} cm³ at ${size.days} days;`;
    }
  }
  if (size.days === 0) {
    return `${size.size_cm3} cm³ at ${size.years} years`;
  }
  return `${size.size_cm3} cm³ at ${size.years} years, ${size.days} days`;
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
      if (caste === 'EVERY') {
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
