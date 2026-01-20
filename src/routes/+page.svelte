<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { searchState } from "state/search.svelte";
    import InfoCard from "components/InfoCard.svelte";
    import type { RawObject, SearchResults } from "bindings/DFRawParser";
    import { settingsState } from "state/settings.svelte";
    import { onMount } from "svelte";
    import {
        retrieveLastInsertionDate,
        retrieveLastInsertionDuration,
        retrieveLastParseDuration,
        retrieveLastParseOperationDate,
    } from "bindings/Commands";

    let search_results = $state<SearchResults<RawObject>>({
        results: [],
        totalCount: 0,
    });

    // Reactively search whenever any part of the global search query
    $effect(() => {
        invoke<SearchResults<RawObject>>("search_raws", {
            query: searchState,
        })
            .then((data) => (search_results = data))
            .catch((error) => console.log(error));
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
                    No results found for "{searchState.searchString}"
                </p>
            {/if}
        {/each}
    </div>
</main>

<style></style>
