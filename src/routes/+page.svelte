<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import InfoCard from "../components/info-card.svelte";
    import Navigation from "../components/navigation.svelte";
    let searchTerm = $state("");

    // Example data for your Dwarf Fortress project
    let creatures = $state([
        { name: "Dwarf", desc: "Likes beer." },
        { name: "Goblin", desc: "Likes stealing." },
        { name: "Forgotten Beast", desc: "Likes destroying your fort." },
    ]);

    // Derived state: This automatically updates when searchTerm changes
    let filteredCreatures = $derived(
        creatures.filter((c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );

    function handleSettings() {
        console.log("Settings button clicked! Opening modal...");
    }
</script>

<Navigation bind:searchQuery={searchTerm} onSettingsClick={handleSettings} />

<main class="p-4">
    <div class="flex flex-wrap justify-center gap-4">
        {#each filteredCreatures as item}
            <InfoCard title={item.name} description={item.desc} />
        {:else}
            <p class="text-neutral-500">No results found for "{searchTerm}"</p>
        {/each}
    </div>
</main>

<style></style>
