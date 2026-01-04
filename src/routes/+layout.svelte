<script lang="ts">
    import "./layout.css";
    import Navigation from "../components/Navigation.svelte";
    import { searchState } from "../search.svelte";
    import { invoke } from "@tauri-apps/api/core";

    let { children } = $props();

    // invoke("parse_raws", {}).then((result) => console.log(result));

    function handleSettings() {
        console.log("Settings button clicked! Opening modal...");
    }
</script>

<Navigation
    bind:searchQuery={searchState.search_string}
    onSettingsClick={handleSettings}
/>
{@render children()}
