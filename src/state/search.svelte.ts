import type { SearchQuery } from "./bindings/DFRawParser";

export const searchState = $state<SearchQuery>({
  identifier_query: null,
  numeric_filters: [],
  raw_types: [],
  required_flags: [],
  search_string: null,
  locations: [],
  limit: 50,
  page: 1,
});
