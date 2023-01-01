import { Plant } from "./types";

export function GeneratePlantSearchString(plant: Plant): string[] {
    let searchableTerms = [  
        ...plant.name.split(' ')
      ];
    searchableTerms = searchableTerms.concat(plant.pref_string);
  
    searchableTerms.push(plant.raw_module);
    searchableTerms.push(...plant.all_tags)
  
    return searchableTerms
      .join(' ')
      .toLowerCase()
      .replace(/\s\s+/g, ' ')
      .split(' ')
      .filter((v) => v.length > 0)
      .sort();
}