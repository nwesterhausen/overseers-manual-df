import { GenerateMaterialSearchString } from './Material';
import { TransformIntoSearchTermString } from './Utils';
import { DFPlant } from './types';

export function GeneratePlantSearchString(plant: DFPlant): string {
  let searchableTerms = [...plant.name.split(' ')]; // add name
  searchableTerms = searchableTerms.concat(plant.prefString); // add preference string
  searchableTerms = searchableTerms.concat(plant.materials.map((m) => GenerateMaterialSearchString(m))); // add material info

  searchableTerms.push(plant.rawModule); // add sourced module
  searchableTerms.push(...plant.allTags); // add all tags

  return TransformIntoSearchTermString(searchableTerms);
}

const liquidMaterials = ['DrinkPlant', 'Extract'];
const nonEdibleMaterials = ['Wood', 'Thread'];

export function GetMaterialDescription(plant: DFPlant, material_type: string): string {
  const material = plant.materials.find((v) => v.type === material_type);
  if (typeof material === 'undefined') {
    return '';
  }

  if (
    nonEdibleMaterials.indexOf(material.type) === -1 &&
    material.tags.indexOf('EdibleRaw') === -1 &&
    material.tags.indexOf('EdibleCooked') === -1 &&
    material.tags.indexOf('AlcoholPlant') === -1 &&
    material.tags.indexOf('PowderMiscPlant') === -1
  ) {
    return '';
  }

  const edibleContexts: string[] = [];
  if (material.tags.indexOf('EdibleRaw') > -1) {
    edibleContexts.push('edible raw');
  }
  if (material.tags.indexOf('EdibleCooked') > -1) {
    edibleContexts.push('cookable');
  }

  switch (material.type) {
    case 'Fruit': {
      if (typeof plant.growthNames['Fruit'] !== 'undefined') {
        return `${plant.growthNames['Fruit'].singular} (${edibleContexts.join(', ')})`;
      }
      if (typeof plant.growthNames['Pod'] !== 'undefined') {
        return `${plant.growthNames['Pod'].singular} (${edibleContexts.join(', ')})`;
      }
      break;
    }
    case 'Leaf': {
      if (typeof plant.growthNames['Leaves'] !== 'undefined') {
        return `${plant.growthNames['Leaves'].singular} (${edibleContexts.join(', ')})`;
      }
      if (material.names.solid === 'leaf') {
        return `${plant.name} ${material.names.solid} (${edibleContexts.join(', ')})`;
      }
      break;
    }
    case 'Wood': {
      if (!material.names.solid.endsWith('wood')) {
        return material.names.solid + ' (wood)';
      }
      break;
    }
    case 'Seed': {
      if (material.names.solid === 'seed') {
        return `${plant.name} ${material.names.solid}`;
      }
      break;
    }
    case 'Thread': {
      if (material.names.solid === 'fiber') {
        return `${plant.name} ${material.names.solid}`;
      }
      break;
    }
    case 'Extract': {
      return `${material.names.liquid} (extract)`;
    }
    case 'DrinkPlant': {
      return `${material.names.liquid} (brewed)`;
    }
    case 'Powder': {
      if (material.names.solid.includes('dye')) {
        return `${material.names.solid} (milled into ${material.colors.solid} dye)`;
      }
      return `${material.names.solid} (milled into flour)`;
    }
    case 'Structural': {
      if (material.names.solid === 'plant') {
        return `${plant.name} ${material.names.solid} (${edibleContexts.join(', ')})`;
      }
      break;
    }
    case 'None': {
      return '';
    }
  }

  if (liquidMaterials.indexOf(material.type) > -1) {
    return material.names.liquid;
  }
  if (edibleContexts.length > 0) {
    return `${material.names.solid} (${edibleContexts.join(', ')})`;
  }
  return material.names.solid;
}

export function GetAllMaterialDescriptions(plant: DFPlant): string[] {
  const descriptionStrings: string[] = [];
  for (const material of plant.materials) {
    descriptionStrings.push(GetMaterialDescription(plant, material.type));
  }
  return descriptionStrings.filter((v) => v.length > 0);
}
