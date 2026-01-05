<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { searchState } from "../search.svelte";
    import InfoCard from "../components/InfoCard.svelte";
    import type { RawObject } from "../bindings/DFRawParser";

    let results = $state<RawObject[]>([]);

    // Reactively search whenever any part of the global search query
    $effect(() => {
        invoke<[RawObject[], number]>("search_raws", {
            query: searchState,
        })
            .then((data) => (results = data[0]))
            .catch((error) => console.log(error));
    });
</script>

<main class="p-4">
    <div class="flex flex-wrap justify-center gap-4">
        {#each results as item}
            <InfoCard raw={item} />
        {:else}
            <p class="text-neutral-500">
                No results found for "{searchState.search_string}"
            </p>
        {/each}
    </div>
</main>

<style></style>
