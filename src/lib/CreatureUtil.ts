import { BodySize } from '../definitions/BodySize';
import { Caste } from '../definitions/Caste';
import { CasteTag } from '../definitions/CasteTag';
import { Creature } from '../definitions/Creature';
import { SimplifyVolume, toTitleCase } from './Utils';

/**
 * Helper to tell if a caste of the creature lays eggs.
 *
 * @param creature - Creature to check for egg laying tag
 * @returns true if one caste of this creature lays eggs
 */
export function IsEggLayer(creature: Creature): boolean {
  return HasCasteTag(creature, 'LaysEggs');
}

/**
 * Helper to tell get a single pet value.
 *
 * @param creature - Creature to get pet value from
 * @returns pet value of first encountered value or 0
 */
export function FirstPetValue(creature: Creature): number {
  if (!Array.isArray(creature.castes)) {
    return 0;
  }
  for (const caste of creature.castes) {
    if (caste.petValue > 0) {
      return caste.petValue;
    }
  }
  return 0;
}

/**
 * Helper to tell get a single difficulty value.
 *
 * @param creature - Creature to get difficulty value from
 * @returns difficulty value of first encountered value or 0
 */
export function FirstDifficulty(creature: Creature): number {
  if (!Array.isArray(creature.castes)) {
    return 0;
  }
  for (const caste of creature.castes) {
    if (caste.difficulty > 0) {
      return caste.difficulty;
    }
  }
  return 0;
}

/**
 * Returns a short description of the creature's egg-laying behavior.
 *
 * @param creature - Creature to get the egg-laying status for.
 * @returns Text to describe the egg-laying of the creature.
 */
export function EggLayingStatus(creature: Creature): string {
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
}

/**
 * Returns a short description of the creature's life expectancy.
 *
 * @param creature - Creature to get the life expectancy of.
 * @returns Text to describe the life expectancy of the creature.
 */
export function LifeExpectancyStatus(creature: Creature): string {
  const ret: string[] = [];
  if (Array.isArray(creature.castes)) {
    for (const caste of creature.castes) {
      if (caste.maxAge && caste.maxAge.length > 1 && caste.maxAge[0] > 0 && caste.maxAge[1] > 0) {
        ret.push(`${caste} lives ${caste.maxAge.join(' - ')} years.`);
      }
    }
  }
  if (ret.length === 0) {
    return 'No known life expectancy.';
  }

  return ret.join(' ');
}

/**
 * Returns a short description of the creatures spawning patterns.
 *
 * @param creature - Creature to get the spawning group size of
 * @returns Text to describe the spawning patterns
 */
export function ClusterSizeStatus(creature: Creature): string {
  if (!creature.clusterNumber) {
    return 'None';
  }
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
}

/**
 * Returns a short text description of a BodySizeRange.
 *
 * @param size - The body size range to turn into a string
 * @returns Text to describe the body size range value
 */
export function BodySizeStatus(size: BodySize): string {
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
}

/**
 * Returns a short text description of when the creature reaches adulthood.
 *
 * @param grown_data - Age for each caste to reach adulthood as CasteRange
 * @returns Text to describe how the creature reaches adulthood
 */
export function GrownAtStatus(creature: Creature): string {
  const sts: string[] = [];
  if (Array.isArray(creature.castes)) {
    for (const caste of creature.castes) {
      if (caste.child) {
        if (caste.identifier === 'ALL') {
          sts.push(`They reach adulthood at ${caste.child} years.`);
        } else {
          sts.push(`${toTitleCase(caste.identifier)}s reach adulthood at ${caste.child} years.`);
        }
      }
    }
  }
  if (sts.length) {
    return sts.join(' ');
  }
  return 'Only appear as adults.';
}

/**
 * Returns a string describing the active time from tags
 *
 * @returns String describing the caste's active time
 */
export function CasteActiveTimeStatus(caste: Caste): string {
  const strArr: string[] = [];
  if (caste.tags) {
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
}

/**
 * Returns a string describing the active seasons represented by the caste tags.
 *
 *
 * @returns String describing the caste's active seasons
 */
export function CasteSeasonActivity(caste: Caste): string {
  const strArr: string[] = ['spring', 'summer', 'autumn', 'winter'];
  if (caste.tags) {
    if (caste.tags.indexOf('NoSpring') !== -1) {
      // Remove spring from the list without the index
      strArr.splice(strArr.indexOf('spring'), 1);
    }
    if (caste.tags.indexOf('NoSummer') !== -1) {
      // Remove summer from the list
      strArr.splice(strArr.indexOf('summer'), 1);
    }
    if (caste.tags.indexOf('NoFall') !== -1) {
      // Remove fall from the list
      strArr.splice(strArr.indexOf('autumn'), 1);
    }
    if (caste.tags.indexOf('NoWinter') !== -1) {
      // Remove winter from the list
      strArr.splice(strArr.indexOf('winter'), 1);
    }
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
}

/**
 * Returns a string describing the trainability
 *
 *
 * trainable:
 *
 * @returns String describing the caste's trainability
 */
export function CasteTrainableStatus(caste: Caste): string {
  const strArr: string[] = [];
  if (caste.tags) {
    if (caste.tags.indexOf('TrainableHunting') !== -1) {
      strArr.push('hunting');
    }
    if (caste.tags.indexOf('TrainableWar') !== -1) {
      strArr.push('war');
    }
    if (caste.tags.indexOf('Trainable') !== -1) {
      strArr.push('hunting and war');
    }
  }

  if (strArr.length) {
    return `Trainable for ${strArr.join(' and ')}.`;
  }
  return 'Not trainable.';
}

/**
 * Determines the population status of a creature and returns a sentence describing how they appear
 * in the world.
 *
 * @param creature - The `creature` to get the population status for.
 * @returns a string that describes the population status of a creature.
 */
export function PopulationNumberStatus(creature: Creature): string {
  let descriptor = 'alone.';
  if (creature.populationNumber && creature.populationNumber[0] !== creature.populationNumber[1]) {
    descriptor = `in groups of ${creature.populationNumber[0]} to ${creature.populationNumber[1]}.`;
  }
  return `They live in the world ${descriptor}`;
}

/**
 * The function determines if a creature is a flier based on its caste tags.
 *
 * @param creature - The `creature` to get the flier status for.
 * @returns true if the creature is a flier.
 */
export function IsFlier(creature: Creature): boolean {
  return HasCasteTag(creature, 'Flier');
}

/**
 * The function determines if a creature has intelligence based on its caste tags.
 *
 * @param creature - The `creature` to get the intelligence status for.
 * @returns true if the creature is a flier.
 */
export function HasIntelligence(creature: Creature): boolean {
  return HasCasteTag(creature, 'Intelligent');
}

/**
 * Determines whether a creature can learn.
 *
 * @param creature - The creature to check.
 * @returns True if the creature can learn, false otherwise.
 */
export function CanLearn(creature: Creature): boolean {
  return HasCasteTag(creature, 'CanLearn');
}

/**
 * Determines whether a creature can speak.
 *
 * @param creature - The creature to check.
 * @returns True if the creature can speak, false otherwise.
 */
export function CanSpeak(creature: Creature): boolean {
  return HasCasteTag(creature, 'CanSpeak');
}

/**
 * Determines whether a creature is a gnawer
 *
 * @param creature - The creature to check.
 * @returns True if the creature gnaws cages, false otherwise.
 */
export function IsGnawer(creature: Creature): boolean {
  return HasCasteTag(creature, 'Gnawer');
}

/**
 * The function checks if a creature has a specific caste tag.
 *
 * @param creature - The `creature` to check for a caste tag in
 * @param tag - The `CasteTag` to check for
 * @returns true if the tag exists on a caste of the creature.
 */
export function HasCasteTag(creature: Creature, tag: CasteTag): boolean {
  if (!Array.isArray(creature.castes)) {
    return false;
  }
  for (const caste of creature.castes) {
    if (caste.tags && caste.tags.indexOf(tag) !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * Combines the descriptions of all castes into a single string.
 *
 * @param creature - Creature to get the description for.
 * @returns A string containing the description of all castes.
 */
export function FormatDescription(creature: Creature): string {
  const strArr: string[] = [];
  if (Array.isArray(creature.castes)) {
    for (const caste of creature.castes) {
      if (caste.description) {
        strArr.push(caste.description);
      }
    }
  }
  if (strArr.length === 0) {
    return 'No description available.';
  }
  return strArr.join(' ');
}

/**
 * Returns a short description of the creature's pet value.
 *
 * @param creature - Creature to get the pet value for.
 * @returns Text to describe the pet value of the creature.
 */
export function PetValueStatus(creature: Creature): string {
  const ret: string[] = [];
  if (Array.isArray(creature.castes)) {
    for (const caste of creature.castes) {
      if (caste.identifier === 'ALL' || caste.identifier === 'SPECIES') {
        ret.push(`Worth ${caste.petValue} as a pet.`);
      } else {
        ret.push(`${toTitleCase(caste.identifier)}s worth ${caste.petValue} as a pet.`);
      }
    }
  }
  if (ret.length === 0) {
    return 'No pet value.';
  }
  return ret.join(' ');
}

/**
 * Returns a short description of the creature's egg sizes
 *
 * @param creature - Creature to get the egg sizes for
 * @returns Text to describe the egg sizes of the creature
 */
export function CondensedEggSize(creature: Creature): string {
  const ret: string[] = [];
  if (Array.isArray(creature.castes)) {
    for (const caste of creature.castes) {
      if (caste.eggSize > 0) {
        ret.push(`${SimplifyVolume(caste.eggSize)}`);
      }
    }
  }
  if (ret.length === 0) {
    return '';
  }
  return ret.join(' ');
}

/**
 * Get a summary of the creature's intelligence
 *
 * @param creature - Creature to get the intelligence summary for
 * @returns string describing the creature's intelligence
 */
export function CreatureIntelligenceSummary(creature: Creature): string {
  const ret: string[] = [];

  if (Array.isArray(creature.castes)) {
    for (const caste of creature.castes) {
      if (caste.tags && caste.tags.indexOf('Intelligent') !== -1) {
        ret.push('intelligent');
      }
      if (caste.tags && caste.tags.indexOf('CanLearn') !== -1) {
        ret.push('learns');
      }
      if (caste.tags && caste.tags.indexOf('CanSpeak') !== -1) {
        ret.push('speaks');
      }
    }
  }

  if (ret.length === 0) {
    return '';
  }
  return ret.join(' and ');
}
