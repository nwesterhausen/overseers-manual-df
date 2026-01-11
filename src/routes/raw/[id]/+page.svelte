<script lang="ts">
    import "./page.css";
    import { highlightJson } from "highlighter";
    import type { PageProps } from "./$types";
    import { themeState } from "state/theme.svelte";

    let { data }: PageProps = $props();
</script>

<div class="p-4">
    <button onclick={() => history.back()} class="btn btn-sm">&lt; back</button>
    {#if data.details}
        <article>
            <section class="mt-8">
                {#await highlightJson(JSON.stringify(data.details, null, 2), themeState.mode)}
                    <p>Loading...</p>
                {:then html}
                    {@html html}
                {/await}
            </section>
        </article>
    {:else}
        <div class="alert alert-error">
            <span>{data.error || "Something went wrong."}</span>
        </div>
    {/if}
</div>
