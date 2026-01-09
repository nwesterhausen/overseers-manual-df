import type { SearchQuery } from "bindings/DFRawParser";

export const defaultSearchState = $state<SearchQuery>({
  identifier_query: null,
  numeric_filters: [],
  raw_types: ["Creature", "Inorganic", "Plant", "Entity"],
  required_flags: [],
  search_string: null,
  locations: ["Vanilla"],
  limit: 50,
  page: 1,
});
