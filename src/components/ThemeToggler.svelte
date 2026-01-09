<script lang="ts">
    import { MoonIcon, SunIcon } from "@lucide/svelte";
    import { themeState, toggleTheme } from "state/theme.svelte";
</script>

<button class="mx-1" onclick={toggleTheme}>
    {#if themeState.mode === "light"}
        <SunIcon class="h-5 w-5" />
    {:else}
        <MoonIcon class="h-5 w-5" />
    {/if}
</button>
