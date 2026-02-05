<script lang="ts">
    import { highlightJson } from "highlighter";
    import type { PageProps } from "./$types";
    import { themeState } from "state/theme.svelte";

    let { data }: PageProps = $props();
</script>

<div class="p-4">
    <button onclick={() => history.back()} class="btn btn-sm">&lt; back</button>
    <pre class="h-full font-mono overflow-y-auto p-2 [scrollbar-gutter:stable]">
{data.details}
    </pre>
</div>
