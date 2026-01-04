<script lang="ts">
    import "./layout.css";
    import Navigation from "../components/Navigation.svelte";
    import { searchState } from "../search.svelte";

    let { children } = $props();

    function handleSettings() {
        console.log("Settings button clicked! Opening modal...");
    }
</script>

<Navigation
    bind:searchQuery={searchState.term}
    onSettingsClick={handleSettings}
/>
{@render children()}
