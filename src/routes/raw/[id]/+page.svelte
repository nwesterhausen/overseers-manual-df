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
            <section class="mt-8">
                <div class="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div
                        class="collapse-title font-semibold after:start-5 after:end-auto pe-4 ps-12"
                    >
                        Parsed JSON
                    </div>
                    <div class="collapse-content">
                        <div
                            class="max-h-96 overflow-y-auto p-2 [scrollbar-gutter:stable]"
                        >
                            {#await highlightJson(JSON.stringify(data.details, null, 2), themeState.mode)}
                                <p>Loading...</p>
                            {:then html}
                                {@html html}
                            {/await}
                        </div>
                    </div>
                </div>
            </section>
        </article>
    {:else}
        <div class="alert alert-error">
            <span>{data.error || "Something went wrong."}</span>
        </div>
    {/if}
</div>
