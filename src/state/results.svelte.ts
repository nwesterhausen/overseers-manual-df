import { searchRaws } from "bindings/Commands";
import type { RawObject, SearchResults } from "bindings/DFRawParser";
import { searchState } from "./search.svelte";

class ResultsState {
  results = $state<SearchResults<RawObject>>({
    results: [],
    totalCount: 0,
  });

  // Helper getters for UI
  get list() {
    return this.results.results;
  }

  get totalCount() {
    return this.results.totalCount;
  }

  get page() {
    return searchState.query.page;
  }

  get limit() {
    return searchState.query.limit;
  }

  get totalPages() {
    if (this.limit === 0) return 1;
    return Math.ceil(this.totalCount / this.limit) || 1;
  }

  get hasNext() {
    return this.page < this.totalPages;
  }

  get hasPrev() {
    return this.page > 1;
  }

  /**
   * Performs the search using the current searchState.query
   */
  async search() {
    try {
      // Svelte's reactivity tracks the state in here.
      this.results = await searchRaws(searchState.query);
    } catch (e) {
      console.error("Error fetching raws:", e);
    }
  }

  nextPage() {
    if (this.hasNext) {
      searchState.query.page += 1;
    }
  }

  prevPage() {
    if (this.hasPrev) {
      searchState.query.page -= 1;
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      searchState.query.page = page;
    }
  }
}

export const resultsState = new ResultsState();
