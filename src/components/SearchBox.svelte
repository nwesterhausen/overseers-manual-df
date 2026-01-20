<script>
    import { SearchIcon, SlidersHorizontal, Star } from "@lucide/svelte";
    import {
        searchState,
        toggleFavorites,
        toggleFilters,
    } from "state/search.svelte";
</script>

<div class="flex flex-row">
    <label class="input input-md input-bordered grow">
        <SearchIcon class="h-5 w-5" />
        <input
            type="search"
            placeholder="Search raw files..."
            bind:value={searchState.query.searchString}
        />
    </label>
    <div class="tooltip tooltip-bottom" data-tip="Search Filters">
        <button
            class:btn-active={searchState.showFilters}
            class="btn btn-ghost px-1"
            onclick={toggleFilters}
            title="Advanced Search"
        >
            <SlidersHorizontal class="h-5 w-5" />
        </button>
    </div>
    <div class="tooltip tooltip-bottom" data-tip="Only Favorites">
        <button
            class:btn-active={searchState.query.favoritesOnly}
            class="btn btn-ghost px-1"
            onclick={toggleFavorites}
            title="Advanced Search"
        >
            <Star class="h-5 w-5" />
        </button>
    </div>
</div>
