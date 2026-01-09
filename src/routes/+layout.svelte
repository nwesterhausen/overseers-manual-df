<script lang="ts">
    import "./layout.css";
    import Navigation from "components/NavigationMenu.svelte";
    import { searchState } from "state/search.svelte";
    import AdvancedSearch from "components/AdvancedSearch.svelte";
    import { onMount } from "svelte";
    import { themeState } from "state/theme.svelte";

    let isAdvancedOpen = $state(false);
    let { children } = $props();

    onMount(() => {
        const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            themeState.mode = e.matches ? "dark" : "light";
        };

        updateTheme(darkQuery);

        darkQuery.addEventListener("change", updateTheme);

        return () => darkQuery.removeEventListener("change", updateTheme);
    });
    $effect(() => {
        const activeTheme =
            themeState.mode === "dark"
                ? themeState.darkTheme
                : themeState.lightTheme;

        document.documentElement.setAttribute("data-theme", activeTheme);
    });
</script>

<div class="min-h-screen flex flex-col overflow-hidden">
    <Navigation
        bind:searchQuery={searchState.search_string}
        onToggleAdvanced={() => (isAdvancedOpen = !isAdvancedOpen)}
    />{#if isAdvancedOpen}
        <AdvancedSearch />
    {/if}
    <main class="grow overflow-y-auto">
        {@render children()}
    </main>
</div>
