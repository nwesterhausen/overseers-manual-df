<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { searchState } from "../search.svelte";
    import InfoCard from "../components/InfoCard.svelte";
    import type { RawObject } from "../bindings/DFRawParser";
    let searchTerm = $state("");

    let results = $state<RawObject[]>([]);

    // Reactively search whenever the global term changes
    $effect(() => {
        if (searchState.term.length > 2) {
            invoke<RawObject[]>("search_raws", {
                query: {
                    search_string: searchState.term,
                },
            }).then((data) => (results = data));
        }
    });
</script>

<main class="p-4">
    <div class="flex flex-wrap justify-center gap-4">
        {#each results as item}
            <InfoCard title={item.identifier} description="" />
        {:else}
            <p class="text-neutral-500">No results found for "{searchTerm}"</p>
        {/each}
    </div>
</main>

<style></style>
