import { CasteTag } from './CasteTag';
import { DFBodySize } from './DFBodySize';
import { DFCaste } from './DFCaste';
import { DFCreature } from './DFCreature';
import { SearchableNames, SimplifyVolume, TransformIntoSearchTermString, toTitleCase } from './Utils';
import { Raw } from './types';

/**
 * Returns true if the raw is a Creature raw.
 *
 * @param raw - The parsed raw to check.
 * @returns True if the raw is a creature.
 */
export function isCreature(raw: Raw | DFCreature): boolean {
  return (<DFCreature>raw).biomes !== undefined;
}

/**
 * Helper to tell if a caste of the creature lays eggs.
 *
 * @param creature - Creature to check for egg laying tag
 * @returns true if one caste of this creature lays eggs
 */
export const IsEggLayer = (creature: DFCreature): boolean => {
  for (const caste of creature.castes) {
    if (caste.tags.indexOf('LaysEggs') !== -1) {
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
export const FirstPetValue = (creature: DFCreature): number => {
  for (const caste of creature.castes) {
    if (caste.petValue > 0) {
      return caste.petValue;
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
export const FirstDifficulty = (creature: DFCreature): number => {
  for (const caste of creature.castes) {
    if (caste.difficulty > 0) {
      return caste.difficulty;
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
export const EggLayingStatus = (creature: DFCreature): string => {
  if (!IsEggLayer(creature)) {
    return "Doesn't lay eggs.";
  }
  const ret: string[] = [];
  for (const caste of creature.castes) {
    if (caste.eggSize > 0) {
      ret.push(
        `${toTitleCase(caste.identifier)}s lay ${caste.clutchSize.join(' - ')} eggs with volume ${SimplifyVolume(
          caste.eggSize,
        )}.`,
      );
    } else {
      ret.push(`${toTitleCase(caste.identifier)}s lay ${caste.clutchSize.join(' - ')} eggs.`);
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
export const LifeExpectancyStatus = (creature: DFCreature): string => {
  const ret: string[] = [];
  for (const caste of creature.castes) {
    if (caste.maxAge && caste.maxAge.length > 1 && caste.maxAge[0] > 0 && caste.maxAge[1] > 0) {
      ret.push(`${caste} lives ${caste.maxAge.join(' - ')} years.`);
    }
  }
  if (ret.length === 0) {
    return 'No known life expectancy.';
  }

  return ret.join(' ');
};

/**
 * Returns a short description of the creatures spawning patterns.
 *
 * @param creature - Creature to get the spawning group size of
 * @returns Text to describe the spawning patterns
 */
export const ClusterSizeStatus = (creature: DFCreature): string => {
  const [min, max] = creature.clusterNumber;
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
export const BodySizeStatus = (size: DFBodySize): string => {
  if (size.years === 0) {
    if (size.days === 0) {
      return `${SimplifyVolume(size.sizeCm3)} at birth`;
    } else {
      return `${SimplifyVolume(size.sizeCm3)} at ${size.days} days;`;
    }
  }
  if (size.days === 0) {
    return `${SimplifyVolume(size.sizeCm3)} at ${size.years} years`;
  }
  return `${SimplifyVolume(size.sizeCm3)} at ${size.years} years, ${size.days} days`;
};

/**
 * Returns a short text description of when the creature reaches adulthood.
 *
 * @param grown_data - Age for each caste to reach adulthood as CasteRange
 * @returns Text to describe how the creature reaches adulthood
 */
export const GrownAtStatus = (creature: DFCreature): string => {
  const sts: string[] = [];
  for (const caste of creature.castes) {
    if (caste.child) {
      if (caste.identifier === 'ALL') {
        sts.push(`They reach adulthood at ${caste.child} years.`);
      } else {
        sts.push(`${toTitleCase(caste.identifier)}s reach adulthood at ${caste.child} years.`);
      }
    }
  }
  if (sts.length) {
    return sts.join(' ');
  }
  return 'Only appear as adults.';
};

/**
 * Returns a string describing the active time from tags
 *
 * @returns String describing the caste's active time
 */
export const ActiveTimeStatus = (caste: DFCaste): string => {
  const strArr: string[] = [];

  if (caste.tags.indexOf('ActiveDiurnal') !== -1) {
    strArr.push('during the day');
  }
  if (caste.tags.indexOf('ActiveNocturnal') !== -1) {
    strArr.push('at night');
  }
  if (caste.tags.indexOf('ActiveCrepuscular') !== -1) {
    strArr.push('at dawn and dusk');
  }
  if (caste.tags.indexOf('ActiveMatutinal') !== -1) {
    strArr.push('at dawn');
  }
  if (caste.tags.indexOf('ActiveVespertine') !== -1) {
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

/**
 * Returns a string describing the active seasons represented by the caste tags.
 *
 *
 * @returns String describing the caste's active seasons
 */
export const NoSeasonStatus = (caste: DFCaste): string => {
  const strArr: string[] = [];
  if (caste.tags.indexOf('NoSpring') !== -1) {
    strArr.push('in spring');
  }
  if (caste.tags.indexOf('NoSummer') !== -1) {
    strArr.push('in summer');
  }
  if (caste.tags.indexOf('NoFall') !== -1) {
    strArr.push('in autumn');
  }
  if (caste.tags.indexOf('NoWinter') !== -1) {
    strArr.push('in winter');
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

/**
 * Returns a string describing the trainability
 *
 *
 * trainable:
 *
 * @returns String describing the caste's trainability
 */
export const TrainableStatus = (caste: DFCaste): string => {
  const strArr: string[] = [];

  if (caste.tags.indexOf('TrainableHunting') !== -1) {
    strArr.push('hunting');
  }
  if (caste.tags.indexOf('TrainableWar') !== -1) {
    strArr.push('war');
  }
  if (caste.tags.indexOf('Trainable') !== -1) {
    strArr.push('hunting and war');
  }

  if (strArr.length) {
    return `Trainable for ${strArr.join(' and ')}.`;
  }
  return 'Not trainable.';
};

export const PopulationNumberStatus = (creature: DFCreature): string => {
  let descriptor = 'alone.';
  if (creature.populationNumber[0] !== creature.populationNumber[1]) {
    descriptor = `in groups of ${creature.populationNumber[0]} to ${creature.populationNumber[1]}.`;
  }
  return `They live in the world ${descriptor}`;
};

export const IsFlier = (creature: DFCreature): boolean => {
  return HasCasteTag(creature, 'Flier');
};

export const HasIntelligence = (creature: DFCreature): boolean => {
  return HasCasteTag(creature, 'Intelligent');
};

export const CanLearn = (creature: DFCreature): boolean => {
  return HasCasteTag(creature, 'CanLearn');
};

export const CanSpeak = (creature: DFCreature): boolean => {
  return HasCasteTag(creature, 'CanSpeak');
};

export const IsGnawer = (creature: DFCreature): boolean => {
  return HasCasteTag(creature, 'Gnawer');
};

export const HasCasteTag = (creature: DFCreature, tag: CasteTag): boolean => {
  for (const caste of creature.castes) {
    if (caste.tags.indexOf(tag) !== -1) {
      return true;
    }
  }
  return false;
};

export const FormatName = (creature: DFCreature): string => {
  return toTitleCase(creature.name.singular);
};

export const FormatDescription = (creature: DFCreature): string => {
  const strArr: string[] = [];
  for (const caste of creature.castes) {
    if (caste.description) {
      strArr.push(caste.description);
    }
  }
  if (strArr.length === 0) {
    return 'No description available.';
  }
  return strArr.join(' ');
};

/**
 * Returns a short description of the creature's pet value.
 *
 * @param creature - Creature to get the pet value for.
 * @returns Text to describe the pet value of the creature.
 */
export const PetValueStatus = (creature: DFCreature): string => {
  const ret: string[] = [];
  for (const caste of creature.castes) {
    if (caste.identifier === 'ALL' || caste.identifier === 'SPECIES') {
      ret.push(`Worth ${caste.petValue} as a pet.`);
    } else {
      ret.push(`${toTitleCase(caste.identifier)}s worth ${caste.petValue} as a pet.`);
    }
  }
  if (ret.length === 0) {
    return 'No pet value.';
  }
  return ret.join(' ');
};

export const CondensedEggSize = (creature: DFCreature): string => {
  const ret: string[] = [];
  for (const caste of creature.castes) {
    if (caste.eggSize > 0) {
      ret.push(`${SimplifyVolume(caste.eggSize)}`);
    }
  }
  if (ret.length === 0) {
    return '';
  }
  return ret.join(' ');
};

export const CreatureIntelligenceSummary = (creature: DFCreature): string => {
  const ret: string[] = [];

  for (const caste of creature.castes) {
    if (caste.tags.indexOf('Intelligent') !== -1) {
      ret.push('intelligent');
    }
    if (caste.tags.indexOf('CanLearn') !== -1) {
      ret.push('learns');
    }
    if (caste.tags.indexOf('CanSpeak') !== -1) {
      ret.push('speaks');
    }
  }

  if (ret.length === 0) {
    return '';
  }
  return ret.join(' and ');
};

/**
 * Returns an array of search terms that describe the creature.
 *
 * @param creature - Creature to create search terms for
 * @returns An array of strings that can be used to describe the creature
 */
export const GenerateCreatureSearchString = (creature: DFCreature): string => {
  let searchableTerms = [
    SearchableNames(creature),
    IsEggLayer(creature) ? `eggs ${CondensedEggSize(creature)}` : '',
    Object.values(creature.castes.map((v) => v.description)).join(' '),
    Object.values(creature.castes.map((v) => v.tags)).join(' '),
    creature.tags.indexOf('LocalPopsProduceHeroes') === -1 ? '' : 'playable',
    creature.tags.indexOf('LocalPopsControllable') === -1 ? '' : 'civilized',
    FirstPetValue(creature) > 0 ? `pet value ${FirstPetValue(creature)}` : '',
    FirstDifficulty(creature) > 0 ? `difficulty ${FirstDifficulty(creature)}` : '',
    CreatureIntelligenceSummary(creature),
  ];

  searchableTerms = searchableTerms.concat(creature.tags);
  searchableTerms = searchableTerms.concat(creature.prefStrings);

  return TransformIntoSearchTermString(searchableTerms);
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
