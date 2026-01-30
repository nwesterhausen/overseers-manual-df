<script lang="ts">
    import "./page.css";
    import { highlightJson } from "highlighter";
    import type { PageProps } from "./$types";
    import { themeState } from "state/theme.svelte";
    import CreatureDetail from "./CreatureDetail.svelte";
    import DefaultDetail from "./DefaultDetail.svelte";
    import { type Creature } from "bindings/DFRawParser";

    let { data }: PageProps = $props();
</script>

<div class="p-4">
    <button onclick={() => history.back()} class="btn btn-sm">&lt; back</button>
    {#if data.details}
        <article>
            {#if data.details.metadata.objectType === "Creature"}
                <CreatureDetail raw={data.details as Creature} />
            {:else}
                <DefaultDetail raw={data.details} />
            {/if}
        </article>
    {:else}
        <div class="alert alert-error">
            <span>{data.error || "Something went wrong."}</span>
        </div>
    {/if}
</div>
