import type { SearchQuery } from "bindings/DFRawParser";

export const defaultSearchState = $state<SearchQuery>({
  identifierQuery: null,
  numericFilters: [],
  rawTypes: ["Creature", "Inorganic", "Plant", "Entity"],
  requiredFlags: [],
  searchString: null,
  locations: ["Vanilla"],
  limit: 12,
  page: 1,
  favoritesOnly: false,
});
