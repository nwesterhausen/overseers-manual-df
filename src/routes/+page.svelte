<script lang="ts">
    import { searchState } from "state/search.svelte";
    import InfoCard from "components/InfoCard.svelte";
    import { settingsState } from "state/settings.svelte";
    import { resultsState } from "state/results.svelte";

    // Reactively search whenever any part of the search state changes. Includes page num
    // and toggling "only favorties".
    $effect(() => {
        resultsState.search();
    });
</script>

<main class="p-4 flex flex-col items-center gap-4">
    <div class="flex flex-wrap justify-center gap-4">
        {#each resultsState.list as item}
            <InfoCard raw={item.data} raw_id={item.id} />
        {:else}
            {#if settingsState.appState === "ready"}
                <p class="text-neutral-500">
                    No results found for "{searchState.query.searchString}"
                </p>
            {/if}
        {/each}
    </div>

    {#if resultsState.totalCount > 0}
        <div class="flex items-center gap-4 py-4">
            <button
                class="btn variant-filled-surface"
                onclick={() => resultsState.prevPage()}
                disabled={!resultsState.hasPrev}
            >
                Previous
            </button>

            <span class="text-sm">
                Page {resultsState.page} of {resultsState.totalPages}
            </span>

            <button
                class="btn variant-filled-surface"
                onclick={() => resultsState.nextPage()}
                disabled={!resultsState.hasNext}
            >
                Next
            </button>
        </div>
    {/if}
</main>
