<script lang="ts">
    import "./layout.css";
    import Navigation from "components/NavigationMenu.svelte";
    import AdvancedSearch from "components/AdvancedSearch/index.svelte";
    import { onMount } from "svelte";
    import { themeState } from "state/theme.svelte";
    import {
        loadStoredSettings,
        saveSettings,
        settingsState,
    } from "state/settings.svelte";
    import { parserLogs } from "state/parserState.svelte";
    import { searchState } from "state/search.svelte";
    import { highlightJson } from "highlighter";
    import { appState } from "state/app.svelte";

    let { children } = $props();

    onMount(() => {
        // Load what was persisted to DB
        loadStoredSettings();

        // Theme init
        const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            themeState.mode = e.matches ? "dark" : "light";
        };
        new Promise(() => highlightJson("")).catch(console.error);

        updateTheme(darkQuery);

        darkQuery.addEventListener("change", updateTheme);

        return () => darkQuery.removeEventListener("change", updateTheme);
    });
    // Theme Watcher
    $effect(() => {
        const activeTheme =
            themeState.mode === "dark"
                ? themeState.darkTheme
                : themeState.lightTheme;

        document.documentElement.setAttribute("data-theme", activeTheme);
    });
    // Settings changes watcher
    $effect(() => {
        // JSON.stringify is a cheap way to subscribe to all properties deeply.
        JSON.stringify(settingsState);

        // Don't run logic if we aren't ready (prevents saving immediately on mount)
        if (appState.status !== "ready") return;

        // DEBOUNCE: Wait 1 second after the last change before saving
        const timer = setTimeout(() => {
            saveSettings();
        }, 1000);

        // CLEANUP: If state changes again before 1s, clear the previous timer
        return () => {
            clearTimeout(timer);
        };
    });
</script>

<div class="h-screen flex flex-col overflow-hidden">
    <header class="shrink-0">
        <Navigation />
        {#if appState.status === "parsing"}
            <div
                role="alert"
                class={"alert alert-soft mx-2 place-content-center alert-" +
                    parserLogs.currentLogLevel}
            >
                <span>{parserLogs.currentLog}</span>
            </div>
        {:else if appState.status === "error"}
            <div
                role="alert"
                class="alert alert-error alert-soft mx-2 place-content-center"
            >
                <span>{appState.errorMessage}</span>
            </div>
        {/if}
        {#if searchState.showFilters}
            <AdvancedSearch />
        {/if}
    </header>
    <main class="grow overflow-y-auto">
        {@render children()}
    </main>
</div>
