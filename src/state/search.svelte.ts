import type { SearchQuery } from "bindings/DFRawParser";

export const searchState = $state<SearchQuery>({
  identifier_query: null,
  numeric_filters: [],
  raw_types: ["Creature", "Inorganic", "Plant", "Entity"],
  required_flags: [],
  search_string: null,
  locations: [],
  limit: 50,
  page: 1,
});
