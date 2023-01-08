import { StatesIntoFlatArray } from './Utils';
import { Plant } from './types';

export function GeneratePlantSearchString(plant: Plant): string[] {
  let searchableTerms = [...plant.name.split(' ')]; // add name
  searchableTerms = searchableTerms.concat(plant.pref_string); // add preference string
  searchableTerms = searchableTerms.concat(plant.materials.map((m) => m.material_type)); // add material types
  searchableTerms = searchableTerms.concat(plant.materials.map((m) => StatesIntoFlatArray(m.state_name)).flat()); //add material names
  searchableTerms = searchableTerms.concat(plant.materials.map((m) => StatesIntoFlatArray(m.state_color)).flat()); //add material colors

  searchableTerms.push(plant.raw_module); // add sourced module
  searchableTerms.push(...plant.all_tags); // add all tags

  return searchableTerms
    .join(' ')
    .toLowerCase()
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .filter((v) => v.length > 0)
    .sort();
}

const liquidMaterials = ['DrinkPlant', 'Extract'];
const nonEdibleMaterials = ['Wood', 'Thread'];

export function GetMaterialDescription(plant: Plant, material_type: string): string {
  const material = plant.materials.find((v) => v.material_type === material_type);
  if (typeof material === 'undefined') {
    return '';
  }

  if (
    nonEdibleMaterials.indexOf(material.material_type) === -1 &&
    material.tags.indexOf('EdibleRaw') === -1 &&
    material.tags.indexOf('EdibleCooked') === -1 &&
    material.tags.indexOf('AlcoholPlant') === -1
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

  switch (material.material_type) {
    case 'Fruit': {
      if (typeof plant.growth_names['Fruit'] !== 'undefined') {
        return `${plant.growth_names['Fruit'].singular} (${edibleContexts.join(', ')})`;
      }
      if (typeof plant.growth_names['Pod'] !== 'undefined') {
        return `${plant.growth_names['Pod'].singular} (${edibleContexts.join(', ')})`;
      }
      break;
    }
    case 'Leaf': {
      if (typeof plant.growth_names['Leaves'] !== 'undefined') {
        return `${plant.growth_names['Leaves'].singular} (${edibleContexts.join(', ')})`;
      }
      if (material.state_name.solid === 'leaf') {
        return `${plant.name} ${material.state_name.solid} (${edibleContexts.join(', ')})`;
      }
      break;
    }
    case 'Wood': {
      if (!material.state_name.solid.endsWith('wood')) {
        return material.state_name.solid + ' (wood)';
      }
      break;
    }
    case 'Seed': {
      if (material.state_name.solid === 'seed') {
        return `${plant.name} ${material.state_name.solid}`;
      }
      break;
    }
    case 'Thread': {
      if (material.state_name.solid === 'fiber') {
        return `${plant.name} ${material.state_name.solid}`;
      }
      break;
    }
    case 'Extract': {
      return `${material.state_name.liquid} (extract)`;
    }
    case 'DrinkPlant': {
      return `${material.state_name.liquid} (brewed)`;
    }
    case 'Powder': {
      return `${material.state_name.solid} (milled)`;
    }
    case 'Structural': {
      if (material.state_name.solid === 'plant') {
        return `${plant.name} ${material.state_name.solid} (${edibleContexts.join(', ')})`;
      }
      break;
    }
    case 'None': {
      return '';
    }
  }

  if (liquidMaterials.indexOf(material.material_type) > -1) {
    return material.state_name.liquid;
  }
  if (edibleContexts.length > 0) {
    return `${material.state_name.solid} (${edibleContexts.join(', ')})`;
  }
  return material.state_name.solid;
}

export function GetAllMaterialDescriptions(plant: Plant): string[] {
  const strs: string[] = [];
  for (const material of plant.materials) {
    strs.push(GetMaterialDescription(plant, material.material_type));
  }
  return strs.filter((v) => v.length > 0);
}
