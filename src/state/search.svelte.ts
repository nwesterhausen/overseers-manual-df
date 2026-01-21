import type { SearchQuery } from "bindings/DFRawParser";
import { defaultSearchState } from "./searchDefaults.svelte";

interface SearchState {
  query: SearchQuery;
  showFilters: boolean;
}

export const searchState = $state<SearchState>({
  query: {
    identifierQuery: null,
    numericFilters: [],
    rawTypes: ["Creature", "Inorganic", "Plant", "Entity"],
    requiredFlags: [],
    searchString: null,
    locations: ["Vanilla"],
    limit: 12,
    page: 1,
    favoritesOnly: false,
  },
  showFilters: false,
});

export const resetSearchState = function () {
  const defaultsSnapshot = structuredClone($state.snapshot(defaultSearchState));
  Object.assign(searchState, defaultsSnapshot);
};

/**
 * toggle the advanced search filter display
 */
export const toggleFilters = function () {
  searchState.showFilters = !searchState.showFilters;
};

/**
 * toggle only searching favorites
 */
export const toggleFavorites = function () {
  searchState.query.favoritesOnly = !searchState.query.favoritesOnly;
};
