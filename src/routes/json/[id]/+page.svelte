<script lang="ts">
    import { highlightJson } from "highlighter";
    import type { PageProps } from "./$types";
    import { themeState } from "state/theme.svelte";

    let { data }: PageProps = $props();
</script>

<div class="p-4">
    <button onclick={() => history.back()} class="btn btn-sm">&lt; back</button>
    <div class="h-full overflow-y-auto p-2 [scrollbar-gutter:stable]">
        {#await highlightJson(JSON.stringify(data.details, null, 2), themeState.mode)}
            <p>Loading...</p>
        {:then html}
            {@html html}
        {/await}
    </div>
</div>
