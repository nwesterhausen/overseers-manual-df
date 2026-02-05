<script lang="ts">
    import type { Creature, Plant, RawObject } from "bindings/DFRawParser";

    interface Props {
        raw: RawObject;
    }

    let { raw } = $props();

    let displayInfo = $derived.by(() => {
        let flags: string[] = [];

        switch (raw.metadata.objectType) {
            case "Creature": {
                const creature = raw as unknown as Creature;
                break;
            }
            case "Plant": {
                const plant = raw as unknown as Plant;
                break;
            }
        }

        return { flags };
    });
</script>

{#if displayInfo.flags.length > 0}
    <div>
        <h3 class="info-card-subheading">Flags</h3>
        <div class="flex flex-wrap gap-1">
            {#each displayInfo.flags as flag}
                <span class="badge info-tag-badge">{flag}</span>
            {/each}
        </div>
    </div>
{/if}
