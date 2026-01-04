import type { SearchQuery } from "./bindings/DFRawParser";

export const searchState = $state<SearchQuery>({
  identifier_query: null,
  numeric_filters: [],
  raw_type_name: null,
  required_flags: [],
  search_string: null,
});
