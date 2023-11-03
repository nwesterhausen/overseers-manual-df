import { Plant } from '../definitions/Plant';

export function GetPlantProvidesList(plant: Plant): string[] {
  const provides: string[] = [];

  // First we can look through materials for specific things
  for (const material of plant.materials) {
    if (material.isLocalMaterial) {
      if (material.name === 'SEED') {
        provides.push(`${plant.name.singular} seed`);
      }
      if (material.name === 'DRINK' || material.name === 'OIL') {
        if (material.stateNames && material.stateNames.liquid) {
          provides.push(material.stateNames.liquid);
        }
      }
      if (
        material.name === 'WOOD' ||
        material.name === 'MILL' ||
        material.name === 'SOAP' ||
        material.name === 'PAPER'
      ) {
        if (material.stateNames && material.stateNames.solid) {
          provides.push(material.stateNames.solid);
        }
      }
      if (material.name === 'THREAD') {
        if (material.stateAdjectives && material.stateAdjectives.solid) {
          provides.push(`${material.stateAdjectives.solid} thread`);
        }
        if (material.properties && material.properties.includes('REACTION_CLASS:PAPER_SLURRY')) {
          provides.push(`${plant.name.singular} fiber paper`);
        }
      }
    }
  }

  // Then we can look through the growths for specific things
  if (Array.isArray(plant.growths)) {
    for (const growth of plant.growths) {
      if (
        growth.growthType === 'Fruit' ||
        growth.growthType === 'SeedCatkins' ||
        growth.growthType === 'Cone' ||
        growth.growthType === 'Nut'
      ) {
        if (growth.name && growth.name.singular) {
          provides.push(growth.name.singular);
        }
      }
    }
  }

  return [...new Set(provides)];
}
