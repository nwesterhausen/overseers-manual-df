import type { SearchQuery } from "bindings/DFRawParser";
import { defaultSearchState } from "./searchDefaults.svelte";

export const searchState = $state<SearchQuery>({
  identifierQuery: null,
  numericFilters: [],
  rawTypes: ["Creature", "Inorganic", "Plant", "Entity"],
  requiredFlags: [],
  searchString: null,
  locations: ["Vanilla"],
  limit: 50,
  page: 1,
});

export const resetSearchState = function () {
  const defaultsSnapshot = structuredClone($state.snapshot(defaultSearchState));
  Object.assign(searchState, defaultsSnapshot);
};
