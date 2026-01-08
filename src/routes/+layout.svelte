<script lang="ts">
    import "./layout.css";
    import Navigation from "components/NavigationMenu.svelte";
    import { searchState } from "state/search.svelte";
    import AdvancedSearch from "components/AdvancedSearch.svelte";

    let isAdvancedOpen = $state(false);
    let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
    <Navigation
        bind:searchQuery={searchState.search_string}
        onToggleAdvanced={() => (isAdvancedOpen = !isAdvancedOpen)}
    />{#if isAdvancedOpen}
        <AdvancedSearch />
    {/if}
    <main class="grow">
        {@render children()}
    </main>
</div>
