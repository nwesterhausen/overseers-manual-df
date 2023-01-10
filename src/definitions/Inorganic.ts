import { GenerateMaterialSearchString } from "./Material";
import { TransformIntoSearchTermString } from "./Utils";
import { DFInorganic } from "./types";

export function GenerateInorganicSearchString(inorganic: DFInorganic): string {
    let searchableTerms = [...inorganic.name.split(' ')]; // add name

    searchableTerms.push(GenerateMaterialSearchString(inorganic.material));

    searchableTerms.push(inorganic.rawModule); // add sourced module
    searchableTerms.push(...inorganic.allTags); // add all tags

    if (inorganic.magmaSafe) {
        searchableTerms.push('magma-safe magma safe');
    }

    return TransformIntoSearchTermString(searchableTerms);
}