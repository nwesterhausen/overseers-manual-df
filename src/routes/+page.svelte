<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { searchState } from "state/search.svelte";
    import InfoCard from "components/InfoCard.svelte";
    import type { RawObject, SearchResults } from "bindings/DFRawParser";
    import { settingsState } from "state/settings.svelte";
    import { onMount } from "svelte";
    import {
        retrieveFavoriteRaws,
        retrieveLastInsertionDate,
        retrieveLastInsertionDuration,
        retrieveLastParseDuration,
        retrieveLastParseOperationDate,
        searchRaws,
    } from "bindings/Commands";

    let search_results = $state<SearchResults<RawObject>>({
        results: [],
        totalCount: 0,
    });
    let favorite_raws = $state<string[]>([]);

    // Reactively search whenever any part of the global search query
    $effect(() => {
        searchRaws(searchState.query)
            .then((data) => {
                search_results = data;
            })
            .catch(console.error);
    });
    // Test
    onMount(() => {
        retrieveLastParseDuration()
            .then((data) => console.log("last_parse_duration", data))
            .catch((e) => console.error("last_parse_duration", e));
        retrieveLastInsertionDuration()
            .then((data) => console.log("last_insertion_duration", data))
            .catch((e) => console.error("last_insertion_duration", e));
        retrieveLastInsertionDate()
            .then((data) => console.log("last_insertion_date", data))
            .catch((e) => console.error("last_insertion_date", e));
        retrieveLastParseOperationDate()
            .then((data) => console.log("last_parse_date", data))
            .catch((e) => console.error("last_parse_date", e));
    });
</script>

<main class="p-4">
    <div class="flex flex-wrap justify-center gap-4">
        {#each search_results.results as item}
            <InfoCard raw={item.data} raw_id={item.id} />
        {:else}
            {#if settingsState.appState === "ready"}
                <p class="text-neutral-500">
                    No results found for "{searchState.query.searchString}"
                </p>
            {/if}
        {/each}
    </div>
</main>

<style></style>
