import { Plant } from '../definitions/Plant';
import { TransformIntoSearchTermString } from './Utils';

export function GeneratePlantSearchString(plant: Plant): string {
  let searchableTerms = [plant.name.singular, plant.name.plural, plant.name.adjective]; // add name
  searchableTerms = searchableTerms.concat(plant.prefStrings); // add preference string

  searchableTerms.push(plant.metadata.moduleName); // add sourced module
  if (Array.isArray(plant.tags)) {
    searchableTerms.push(...plant.tags); // add all tags
  }

  return TransformIntoSearchTermString(searchableTerms);
}
