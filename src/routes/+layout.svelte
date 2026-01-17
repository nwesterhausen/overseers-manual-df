<script lang="ts">
    import "./layout.css";
    import Navigation from "components/NavigationMenu.svelte";
    import AdvancedSearch from "components/AdvancedSearch.svelte";
    import { onMount } from "svelte";
    import { themeState } from "state/theme.svelte";
    import { settingsState } from "state/settings.svelte";
    import { parserLogs } from "state/parserState.svelte";

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

<div class="h-screen flex flex-col overflow-hidden">
    <header class="shrink-0">
        <Navigation
            onToggleAdvanced={() => (isAdvancedOpen = !isAdvancedOpen)}
            bind:advancedIsOpen={isAdvancedOpen}
        />
        {#if settingsState.appState === "parsing"}
            <div
                role="alert"
                class={"alert alert-soft mx-2 place-content-center alert-" +
                    parserLogs.currentLogLevel}
            >
                <span>{parserLogs.currentLog}</span>
            </div>
        {:else if settingsState.appState === "error"}
            <div
                role="alert"
                class="alert alert-error alert-soft mx-2 place-content-center"
            >
                <span>{settingsState.errorMessage}</span>
            </div>
        {/if}
        {#if isAdvancedOpen}
            <AdvancedSearch />
        {/if}
    </header>
    <main class="grow overflow-y-auto">
        {@render children()}
    </main>
</div>
